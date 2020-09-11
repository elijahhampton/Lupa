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
import FeatherIcon from 'react-native-vector-icons/Feather'

import { connect, useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { LOG_ERROR } from '../../../common/Logger';
import { getUpdateCurrentUserAttributeActionPayload } from '../../../controller/redux/payload_utility';
import { getLupaProgramInformationStructure } from '../../../model/data_structures/programs/program_structures';
import ProfileProgramCard from './components/ProfileProgramCard';
import { ScrollView } from 'react-native-gesture-handler';
import { Pagination } from 'react-native-snap-carousel';
import { colors } from 'react-native-elements';

import MapView, { Marker } from 'react-native-maps';
import { getLupaUserStructure } from '../../../controller/firebase/collection_structures';
import { titleCase } from '../../common/Util';
import FullScreenLoadingIndicator from '../../common/FullScreenLoadingIndicator';


const { windowWidth } = Dimensions.get('window').width
const VERTICAL_SEPARATION = 20

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

    useEffect(() => {
        async function fetchData() {
            try {
                await LUPA_CONTROLLER_INSTANCE.getProgramInformationFromUUID(props.program.program_structure_uuid).then(data => {
                    setProgramData(data)
                })
            } catch(err) {
                alert(err)
                setProgramData(getLupaProgramInformationStructure())
            }

            try {
                await LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(props.program.program_owner).then(data => {
                    setProgramOwnerData(data)
                })
            } catch(err) {
                alert(err)
                setProgramOwnerData(getLupaProgramInformationStructure())
            }
        }

        fetchData();
    }, [])

    /**
     * Sends request to server to complete payment
     */
    const makePayment = async (token, amount) => {
        const idempotencyKey = await Math.random().toString()

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
        await setLoading(true)
        /*
         //handle stripe
         await initStripe();
 
         //collect payment information and generate payment token
         try {
             setToken(null)
             const token = await stripe.paymentRequestWithCardForm({
                 requiredBillingAddressFields: 'zip'
             });
 
             if (token == undefined) {
                 throw LUPA_ERR_TOKEN_UNDEFINED;
             }
             
             await setToken(token)
         } catch (error) {
             setLoading(false)
             return;
         }
 
         //get the token from the state
         const generatedToken = await token;
 
         //Send request to make payment
         try {
             await makePayment(generatedToken, amount)
         } catch (error) {
             await setPaymentComplete(false)
             await setPaymentSuccessful(false)
             return;
         }
         */

        /****  REMOVE THIS IF PAYMENTS ARE LIVE ******/
        await setPaymentSuccessful(true)
        await setPaymentComplete(true)

        //If the payment is complete and successful then update database
        if (paymentComplete == true && paymentSuccessful == true) {

            //handle program in backend
            try {
                const updatedProgramData = await LUPA_CONTROLLER_INSTANCE.purchaseProgram(currUserData, programData);
                await dispatch({ type: "ADD_CURRENT_USER_PROGRAM" , ...updatedProgramData})
            } catch (err) {
                setLoading(false);
                alert(err)
                //need to handle the case where there is an error when we add the program
                props.closeModalMethod()
            }
        }
        await setLoading(false);
        //close modal
        props.closeModalMethod()
    }

    const getProgramTags = () => {
        try {
            return programData.program_tags.map((tag, index, arr) => {
                return (
                    <Chip mode="flat" textStyle={{fontSize: 12, fontWeight: 'bold', color: '#23374d'}} style={{backgroundColor: 'transparent', borderRadius: 10, alignItems: 'center', justifyContent: 'center', margin: 5}}>
                    
                        <Caption style={{color: '#23374d'}}>
                        {tag}
                        </Caption>
                    </Chip>

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
        if (typeof(programOwnerData) == 'undefined')
        {
            return ''
        }

            try {
            return programOwnerData.display_name
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
                    <Text style={{ fontSize: 15, color: '#212121', paddingVertical: 10, fontFamily: 'Avenir-Heavy'}}>
                           {titleCase(programData.program_name)}
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

    const getLocationLatitude = () => {
        if (typeof(programData) == 'undefined' || programData == null)
        {
            return 0
        }

        try {
            return programData.program_location.location.lat
        } catch(error) {
            return 0;
        }
    }

    const getLocationLongitude = () => {
        if (typeof(programData) == 'undefined' || programData == null)
        {
            return 0
        }

        try {
            return programData.program_location.location.long;
        } catch(error) {
            return 0;
        }
    }

    const renderProgramLocationName = () => {
        if (typeof(programData) == 'undefined' || programData == null)
        {
            return "";
        }

        try {
            return programData.program_location.name;
        } catch(error) {
            return "";
        }
    }

    const renderProgramLocationAddress = () => {
        if (typeof(programData) == 'undefined' || programData == null)
        {
            return "";
        }

        try {
            return programData.program_location.address;
        } catch(error) {
            return "";
        }
    }


    return (
        <Modal presentationStyle="fullScreen" visible={props.isVisible} style={styles.container} animated={true} animationType="slide">
              <SafeAreaView style={styles.container}>
                  <Appbar.Header style={styles.appbar} theme={{
                      colors: {
                          primary: '#FFFFFF'
                      },
                  }}>
                      <Appbar.Action icon={() => <FeatherIcon name="x" size={20}/>} onPress={() => props.closeModalMethod()} />
                    
                  </Appbar.Header>
                   <ScrollView contentContainerStyle={{justifyContent: 'space-between', flexGrow: 2}}>
                   <View style={styles.programImageContainer}>
                       <Surface style={{marginHorizontal: 20, width: '90%', borderRadius: 10, height: 300, alignItems: 'center', justifyContent: 'center'}}>
                       <Image style={{width: '100%', height: '100%', borderRadius: 10}} source={{uri: getProgramImage()}} />
                       <Chip textStyle={{color: 'white', fontFamily: 'Avenir-Heavy', fontWeight: '600'}} style={{paddingHorizontal: 10, borderRadius: 0, borderBottomLeftRadius: 8, elevation: 8, position: 'absolute', top: 0, right: 0, alignSelf: 'center', backgroundColor: '#1089ff', width: 'auto'}}>
                           $50.00
                       </Chip>
                       </Surface>
                       
                   </View>

                   <View style={styles.programInformationContainer}>
                           {getProgramName()}
                       <Paragraph style={styles.programDescriptionText}>
                           {getProgramDescription()}
                       </Paragraph>
                       <View style={[styles.programTags, styles.alignRowAndCenter]}>
                           {getProgramTags()}
                       </View>
                   </View>

                   <View style={styles.mapViewContainer}>
                       <View style={styles.mapViewSubContainer}>
                                <MapView style={styles.mapView}
                    initialRegion={{
                        latitude: getLocationLatitude(),
                        longitude: getLocationLongitude(),
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                        
                      }} 
                   
                      />
                                <View style={styles.mapViewTextContainer}>
                                <Text style={styles.mapViewText}>
                           {renderProgramLocationName()}
                       </Text>
                       <Text style={styles.mapViewText}>
                       {renderProgramLocationAddress()}
                       </Text>
                       </View>
                       </View>
                   </View>

                   <View style={styles.programOwnerDetailsContainer}>
                      
                      <View style={styles.programOwnerDetailsSubContainer}>
                      <View>
                              <Avatar.Image source={{uri: programOwnerData.photo_url}} label="EH" color="#FFFFFF" size={50} style={{backgroundColor: '#212121'}} />
                          </View>
                          <View>
                              <Text style={styles.mapViewText}>
                                {programOwnerData.display_name}
                              </Text>
                              <Text style={styles.mapViewText}>
                                  National Association of Sports Medicine
                              </Text>
                          </View>
                      </View>
                  </View>

                {/*  <View style={styles.programTermsContainer}>
                       <Text style={{alignItems: 'flex-start', fontFamily: 'Avenir-Light'}}>
                            Terms of Service
                       </Text>
                       <Text style={{alignItems: 'flex-start', fontFamily: 'Avenir-Light'}}>
                            Privacy Policy
                       </Text>
                    </View>*/}

                   </ScrollView>
                   <View style={styles.purchaseContainer}>

                    <Button 
                        onPress={() => handlePurchaseProgram(0)} 
                        mode="outlined"
                        theme={{
                        roundness: 8,
                        colors: {
                            primary: '#1089ff'
                        }
                    }}
                    style={{width: '100%'}}>
                        Proceed to Checkout
                    </Button>
                   </View>
                   <FullScreenLoadingIndicator isVisible={loading} />
                   </SafeAreaView>
            </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    textAlignCenter: {
        textAlign: 'center'
    },
    appbar: {
        elevation: 0
    },
    mapViewContainer: {
        marginVertical: VERTICAL_SEPARATION
    },
    mapViewSubContainer: {
      
        width: '100%', 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    mapView: {
        width: Dimensions.get('window').width - 20, 
        height: 180, 
        alignSelf: 'center', 
        borderRadius: 15
    },
    mapViewTextContainer: {
        paddingVertical: 10, 
        width: '100%', 
        alignItems: 'flex-start', 
        justifyContent: 'flex-start',
        paddingLeft: 20
    },
    mapViewText: {
        fontSize: 15, 
        fontWeight: '300',
        margin: 3,
    },
    purchaseContainer: {
        padding: 10, 
        borderTopWidth: 0.5, 
        borderTopColor: 'rgb(174, 174, 178)', 
        flexDirection: 'row', 
        justifyContent: 'space-evenly', 
        alignItems: 'center'
    },
    programImageContainer: {
        alignItems: 'center', 
        justifyContent: 'center', 
        width: windowWidth,
        marginBottom: VERTICAL_SEPARATION
    },
    image: {
        width: '100%', 
        height: '100%'
    },
    programOwnerDetailsContainer: {
        alignItems: 'center', justifyContent: 'space-evenly',
        marginVertical: VERTICAL_SEPARATION
    },
    programOwnerDetailsSubContainer: {
        width: Dimensions.get('window').width, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'
},
    programInformationContainer: {
        marginVertical: VERTICAL_SEPARATION,
        marginHorizontal: 20, 
        height: 150, 
        justifyContent: 'space-evenly',
    },
    programDescriptionText: {
        color: '#212121', 
        fontFamily: 'Avenir-Light',
        paddingVertical: 10
    },
    programPriceText: {
        fontSize: 30, 
        color: '#212121'
    },
    programTags: {
        justifyContent: 'flex-start'
    },
    alignRowAndCenter: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    puchaseButton: {
        width: 'auto', 
        elevation: 0
    },
    messageButtonContainer: {
        marginVertical: 20, 
        width: Dimensions.get('window').width - 20, 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        alignSelf: 'center',
        marginVertical: VERTICAL_SEPARATION
    },
    messageButton: {
        borderRadius: 8, 
        width: Dimensions.get('window').width - 20
    },
    programTermsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginVertical: VERTICAL_SEPARATION
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(ProgramInformationPreview);