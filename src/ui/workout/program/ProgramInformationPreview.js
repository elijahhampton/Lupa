import React, { useState, useEffect } from 'react';

import {
    StyleSheet,
    View,
    Text,
    Image,
    SafeAreaView,
    Modal,
    TextInput,
    Dimensions,
    StatusBar,
} from 'react-native';

import {
    Surface,
    Button,
    Paragraph,
    Caption,
    Avatar,
    IconButton,
    Chip,
    Appbar,
    Divider,
    Card,
} from 'react-native-paper';

import {
    Header
} from 'native-base';

import { Constants } from 'react-native-unimodules';
import LupaController from '../../../controller/lupa/LupaController';

import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import { initStripe, stripe, CURRENCY, STRIPE_ENDPOINT, LUPA_ERR_TOKEN_UNDEFINED } from '../../../modules/payments/stripe/index'
const { fromString } = require('uuidv4')
import { withNavigation } from 'react-navigation'
import FeatherIcon from 'react-native-vector-icons/Feather'

import { connect, useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { LOG_ERROR } from '../../../common/Logger';
import { getUpdateCurrentUserAttributeActionPayload } from '../../../controller/redux/payload_utility';
import { getLupaProgramInformationStructure } from '../../../model/data_structures/programs/program_structures';
import ProgramSearchResultCard from './components/ProgramSearchResultCard';
import { ScrollView } from 'react-native-gesture-handler';
import { Pagination } from 'react-native-snap-carousel';
import { colors } from 'react-native-elements';

import MapView, { Marker } from 'react-native-maps';
import { getLupaUserStructure } from '../../../controller/firebase/collection_structures';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addProgram: (programPayload) => {
            dispatch({
                type: "ADD_CURRENT_USER_PROGRAM",
                payload: programPayload,
            })
        },
        updateCurrentUserAttribute: (payload) => {
            dispatch({
                type: "UPDATE_CURRENT_USER_ATTRIBUTE",
              payload: payload
            })
        }
    }
}

function ProgramInformationPreview(props) {
    const [programData, setProgramData] = useState(getLupaProgramInformationStructure());
    const [programOwnerData, setProgramOwnerData] = useState(getLupaUserStructure())
    const [showProfileModal, setShowProfileModal] = useState(false)
    const [showWorkoutPreviewModal, setShowWorkoutPreviewModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [token, setToken] = useState("")
    const [paymentSuccessful, setPaymentSuccessful] = useState(false)
    const [paymentComplete, setPaymentComplete] = useState(false)

    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance()

    const dispatch = useDispatch()
    const currUserData = useSelector(state => {
        return state.Users.currUserData
    })

    const handleToggleBookmark = () => {
        const payload = getUpdateCurrentUserAttributeActionPayload('bookmarked_programs', programData.program_structure_uuid, '');
        LUPA_CONTROLLER_INSTANCE.toggleProgramBookmark(currUserData.user_uuid, programData.program_structure_uuid)
        dispatch({ type: "UPDATE_CURRENT_USER_ATTRIBUTE", ...payload })
     }

    useEffect(() => {
        async function fetchData() {
            let result = {}, userData = {}
            await LUPA_CONTROLLER_INSTANCE.getProgramInformationFromUUID(props.programData.program_structure_uuid).then(data => {
                result = data;
            })

            await LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(props.programData.program_owner.uuid).then(data => {
                userData = data
            })

            await setProgramData(result);
            await setProgramOwnerData(userData)
        }

        fetchData();
    }, [])

    /**
     * Sends request to server to complete payment
     */
    const makePayment = async (token, amount) => {
        const idempotencyKey = await fromString(token.toString() + Math.random().toString())

        axios({
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            url: STRIPE_ENDPOINT,
            data: JSON.stringify({
                amount: 0.50,
                currency: CURRENCY,
                token: token,
                idempotencyKey: idempotencyKey,
            })
        }).then(response => {
            setLoading(false)
        }).catch(err => {
            setPaymentSuccessful(false)
            setPaymentComplete(true)
        })
    }

    /**
     * Handles program purchase process
     */
    const handlePurchaseProgram = async (amount) => {
        /*
         //handle stripe
         await initStripe();
 
         //collect payment information and generate payment token
         try {
             setLoading(true)
             setToken(null)
             const token = await stripe.paymentRequestWithCardForm({
                 requiredBillingAddressFields: 'zip'
             });
 
             if (token == undefined) {
                 throw LUPA_ERR_TOKEN_UNDEFINED;
             }
             
             await setLoading(false)
             await setToken(token)
         } catch (error) {
             setLoading(false)
             setPaymentComplete(true)
             setPaymentSuccessful(false)
             return;
         }
 
         //get the token from the state
         const generatedToken = await token;
 
         //Send request to make payment
         try {
             makePayment(generatedToken, amount)
         } catch (error) {
             setPaymentComplete(true)
             setPaymentSuccessful(true)
             return;
         }
         */

        /****  REMOVE THIS IF PAYMENTS ARE LIVE ******/
        setPaymentSuccessful(true)
        setPaymentComplete(true)

        //If the payment is complete and successful then update database
        if (paymentComplete == true && paymentSuccessful == true) {

            //handle program in backend
            try {
                const updatedProgramData = await LUPA_CONTROLLER_INSTANCE.purchaseProgram(currUserData.user_uuid, programData);
                await dispatch({ type: "ADD_CURRENT_USER_PROGRAM" , ...updatedProgramData})
            } catch (err) {
                //need to handle the case where there is an error when we add the program
                props.closeModalMethod()
            }
        }

        //close modal
        props.closeModalMethod()
    }

    const getProgramTags = () => {
        try {
            return programData.program_tags.map((tag, index, arr) => {
                if (index == arr.length - 1) {
                    return (
                        <Caption>
                            {tag}
                        </Caption>
                    )
                }
                return (
                    <Caption>
                        {tag},{" "}
                    </Caption>

                )
            })
        } catch (err) {
            return null
        }
    }

    /**
     * Returns the program owners display name
     * @return String progam owner's display name
     */
    const getOwnerDisplayName = () => {
        if (typeof(programData) == 'undefined')
        {
            return ''
        }

            try {
            return programData.program_owner.displayName
            } catch(error) {
                LOG_ERROR('ProgramInformationPreview.js', 'Unhandled exception in getOwnerDisplayName()', error)
                return ''
            }

        return ''
    }

      /**
     * Returns the program name
     * @return URI Returns a string for the name, otherwise ''
     */
    const getProgramName = () => {
            try {
                return (
                    <Text style={{ fontSize: 20, color: '#212121', paddingVertical: 10 }}>
                              {programData.program_name}
                    </Text>
                )
            } catch(err) {
                return (
                    <Text style={{  fontSize: 20, color: '#212121' }}>
                                    Unable to load program name
                                    </Text>
                )
            } 
    }

     /**
     * Returns the program description
     * @return URI Returns a string for the description, otherwise ''
     */
    const getProgramDescription = () => {
        if (typeof(programData) == 'undefined')
        {
            return ''
        }

            try {
                return programData.program_description;
            } catch(err) {
                return ''
            }
    }

    /**
     * Returns the program image
     * @return URI Returns a uri for the program image, otherwise ''
     */
    const getProgramImage = () => {
        if (typeof(programData) == 'undefined')
        {
            return ''
        }

            try {
                return programData.program_image;
            } catch(err) {
                return ''
            }
    }

    /**
     * Returns the program price
     * @return String representing the program price, otherwise, ''
     */
    const getProgramPrice = () => {
        if (typeof(programData) == 'undefined')
        {
            return 0
        }

            try {
                return programData.program_price;
            } catch(error) {
                return 0;
            }
    }


    return (
        <Modal presentationStyle="fullScreen" visible={props.isVisible} style={{ flex: 1 }} animated={true} animationType="slide">
               <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
                   <SafeAreaView />
                   <IconButton icon={() => <FeatherIcon name="x" size={25} onPress={() => props.closeModalMethod()}/>} />
                   <ScrollView contentContainerStyle={{}}>
                   <View style={{alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width, height: 300}}>
                       <Image style={{width: '100%', height: '100%'}} source={{uri: getProgramImage()}} />
                   </View>

                   <View style={{height: 200, alignItems: 'center', justifyContent: 'space-evenly'}}>
                       <View style={{width: Dimensions.get('window').width, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                           <View>
                               <Text style={{fontSize: 20, fontWeight: '300'}}>
                                 {programOwnerData.display_name}
                               </Text>
                               <Text style={{fontSize: 15, fontWeight: '300'}}>
                                   {programOwnerData.certification}
                               </Text>
                           </View>

                           <View>
                               <Avatar.Text label="EH" color="#FFFFFF" size={50} style={{backgroundColor: '#212121'}} />
                           </View>
                       </View>

                       <View style={{width: Dimensions.get('window').width - 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                           <TextInput placeholder="Send Elijah a message"  style={{textAlign: 'center', flex: 1, padding: 10, fontSize: 15, backgroundColor: 'rgb(229, 229, 234)', borderRadius: 15}} />
                           <Button mode="contained" theme={{
                               colors: {
                                   primary: 'rgba(13,71,161 ,1)'
                               }
                           }} style={{elevation: 0, marginHorizontal: 10, borderRadius: 8}}>
                                <Text>
                                    Send
                                </Text>
                           </Button>
                       </View>
                   </View>

                   <View style={{height: 150, alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                       <Divider style={{width: '100%'}} />
                       <>
                       <View style={{paddingVertical: 20}}>
                       <View style={{paddingLeft: 10, width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                           {getProgramName()}
                           <View style={{width: Dimensions.get('window').width, flexDirection: 'column', justifyContent: 'space-evenly'}}>
                           <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image source={require('../../images/thumbs-up-icon.png')} style={{width: 18, height: 18, margin: 3}} />
                            <Text style={{color: 'rgb(142, 142, 147)'}}>
                                One on One
                            </Text>
                           </View>
                           <View style={{flexDirection: 'row', alignItems: 'center'}}>
                           <Image source={require('../../images/thumbs-up-icon.png')} style={{width: 18, height: 18, margin: 3}} />
                           <View style={{flexDirection: 'row', width: Dimensions.get('window').width}}>
                              {getProgramTags()}
                           </View>
                           </View>
 
                           </View>
                       </View>
                       </View>
                       </>
                       <Divider style={{width: '100%'}} />
                   </View>

                   <View style={{paddingVertical: 20, height: 400}}>
                       <View style={{marginTop: 10, width: '100%', height: 200, alignItems: 'center', justifyContent: 'center'}}>
                            <View style={{borderWidth: 0.5, borderColor: 'rgb(142, 142, 147)', width: '80%', height: '100%', borderRadius: 15}}>
                                <MapView style={{width: '100%', height: '100%', alignSelf: 'center', borderRadius: 15}}
                    initialRegion={{
                        latitude: 0,
                        longitude: 0,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                      }} />
                                <View style={{paddingVertical: 10, width: '100%', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                                <Text style={{fontSize: 15, fontWeight: '300'}}>
                           Mean's Gym House
                       </Text>
                       <Text style={{fontSize: 15, fontWeight: '300'}}>
                       1234 Hydrag Lane
                       </Text>
                       </View>
                            </View>
                       </View>
                   </View>


                   </ScrollView>
                   <View style={{padding: 10, borderTopWidth: 0.5, borderTopColor: 'rgb(174, 174, 178)', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center'}}>
                    <Text style={{fontSize: 30, color: '#212121', fontFamily: 'HelveticaNeueBold'}}>
                        ${getProgramPrice()}
                    </Text>

                    <Button mode="contained" style={{width: 'auto', elevation: 0}} theme={{
                        roundness: 8,
                        colors: {
                            primary: 'rgba(13,71,161 ,1)'
                        }
                    }}>
                        Purchase
                    </Button>
                   </View>
                   </View>
               <SafeAreaView />
            </Modal>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(ProgramInformationPreview));