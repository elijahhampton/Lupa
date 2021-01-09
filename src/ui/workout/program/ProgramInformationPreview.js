import React, { useState, useEffect } from 'react';

import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Modal,
    ScrollView,
    Linking,
    TextInput,
    Dimensions,
    SafeAreaView,
    TouchableWithoutFeedback,
    StatusBar,
} from 'react-native';
 
import {
    Surface,
    Button,
    Paragraph,
    Caption,
    IconButton,
    Chip,
    Appbar,
    Divider,
    Card,
    Dialog,
} from 'react-native-paper';

import { Constants } from 'react-native-unimodules';
import LupaController from '../../../controller/lupa/LupaController';

import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import { initStripe, stripe, CURRENCY, STRIPE_ENDPOINT, LUPA_ERR_TOKEN_UNDEFINED } from '../../../modules/payments/stripe/index'
import FeatherIcon from 'react-native-vector-icons/Feather'

import { connect, useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import LOG, { LOG_ERROR } from '../../../common/Logger';
import { getUpdateCurrentUserAttributeActionPayload } from '../../../controller/redux/payload_utility';
import { getLupaProgramInformationStructure } from '../../../model/data_structures/programs/program_structures';
import ProfileProgramCard from './components/ProfileProgramCard';
import { Pagination } from 'react-native-snap-carousel';
import { Avatar } from 'react-native-elements';
import PurchaseProgramWebView from '../program/modal/PurchaseProgramWebView';

import MapView, { Marker } from 'react-native-maps';
import { getLupaUserStructure } from '../../../controller/firebase/collection_structures';
import { titleCase } from '../../common/Util';
import FullScreenLoadingIndicator from '../../common/FullScreenLoadingIndicator';
import LUPA_DB from '../../../controller/firebase/firebase';
import { getLupaStoreState } from '../../../controller/redux';
import { initializeNewPack } from '../../../model/data_structures/packs/packs';


const { windowWidth } = Dimensions.get('window').width
const VERTICAL_SEPARATION = 10

function StartPackDialog({ isVisible, closeModal, program }) {
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    const currUserData = useSelector(state => {
        return state.Users.currUserData
    })

    const [usersToShare, setUsersToShare] = useState([currUserData]);
    const [chosenPack, setChosenPack] = useState(initializeNewPack('', '', '', []));
  const [currUserFollowers, setCurrUserFollowers] = useState([])
    const [forceUpdate, setForceUpdate] = useState(false);

    const handleInviteFriends = () => {

    }

    const handleAvatarOnPress = (user) => {
        if (user.uid == chosenPack.uid) {
            return;
        } else {
            setChosenPack(user);
        }
    
        setForceUpdate(!forceUpdate)
      }
    
      const handleOnPressSend = async () => {
        LUPA_CONTROLLER_INSTANCE.handleSendProgramOfferInvite(currUserData.user_uuid, chosenPack.uid, program.program_structure_uuid)
        closeModal()
      }
    
      const renderUserAvatars = () => {
        if (getLupaStoreState().Packs.currUserPacksData.length == 0) {
            return null;
        }

        return getLupaStoreState().Packs.currUserPacksData.map((user, index, arr) => {
            if (user.members <= 1 == false) {
                return null;
            }

          if (chosenPack.uid == user.uid) {
            return (
              <TouchableWithoutFeedback key={user.user_uuid} onPress={() => handleAvatarOnPress(user)}>
              <View style={{marginVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{padding: 10, fontSize: 15, fontFamily: 'Avenir-Medium'}}>
                {user.name}
              </Text>
              </View>
              </TouchableWithoutFeedback>
            )
          } else {
            return (
              <TouchableWithoutFeedback  key={user.uid} onPress={() => handleAvatarOnPress(user)}>
                 <View style={{marginVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                 <Text style={{padding: 10, fontSize: 15, fontFamily: 'Avenir-Roman'}}>
                   {user.name}
                 </Text>
                 </View>
                 </TouchableWithoutFeedback>
            )
          }
        })
      }

    useEffect(() => {
        async function fetchFollowers () {
          if (typeof(currUserData.followers) === 'undefined') {
            return;
          }
    
          await LUPA_CONTROLLER_INSTANCE.getUserInformationFromArray(currUserData.followers)
          .then(result => {
            setCurrUserFollowers(result);
          }).catch(error => {
            LOG_ERROR('PublishProgram.js', 'useEffect::Caught error fetching current users followers data.', error)
            setCurrUserFollowers([])
          })
        }
    
        LOG('PublishProgram.js', 'Running useEffect');
        fetchFollowers()
      }, []);


    return (
        <Dialog visible={isVisible} animationType="fade" animated={true} style={{borderRadius: 15, height: 'auto', justifyContent: 'space-evenly',}}>
            <Dialog.Title>
                Invite your pack
            </Dialog.Title>
            <Dialog.Content>
                {
                    getLupaStoreState().Packs.currUserPacksData.length == 0 ?
                        <View>
                            <Text style={{fontFamily: 'Avenir-Medium', fontSize: 16, fontWeight: '700', color: 'rgb(116, 126, 136)'}}>
        
        
                        <Text style={{color: '#1089ff'}}>
                            Join{" "}
                        </Text>
                        <Text>
                            or{" "}
                        </Text>
                        <Text style={{color: '#1089ff'}}>
                            create{" "}
                        </Text>
                        <Text>
                            your own pack to invite your friends to participate in this program.
                        </Text>
                        </Text>
                        </View>
                    :
                    <Paragraph style={{fontFamily: 'Avenir'}}>
                    You are about to invite your pack to start {program.program_name} with you.  
                </Paragraph>
                }
                <View style={{height: 200, alignItems: 'flex-start', width: '100%'}}>
                    <ScrollView centerContent contentContainerStyle={{justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                    {renderUserAvatars()}
                    </ScrollView>
                </View>
         

            </Dialog.Content>

            <Dialog.Actions style={{flexDirection: 'row', marginVertical: 10, alignItems: 'center', justifyContent: 'space-evenly'}}>
                <Button 
                uppercase={false}
                mode="contained" 
                color="rgb(245, 245, 245)"
                contentStyle={{height: 45, width: Dimensions.get('window').width / 2.8}}
                theme={{roundness: 8}}
                style={{elevation: 0}}
                onPress={closeModal}
                >
                    Cancel
                </Button>

                <Button 
                disabled={getLupaStoreState().Packs.currUserPacksData.length == 0}
                uppercase={false}
                mode="contained" 
                color="#1089ff"
                contentStyle={{height: 45, width: Dimensions.get('window').width / 2.8}}
                theme={{roundness: 8}}
                style={{elevation: 0}}
                onPress={handleOnPressSend}
                >
                    Send Invite
                </Button>
            </Dialog.Actions>
        </Dialog>
    )
}

function WaitListDialog({ isVisible, closeModal, program, userIsWaitlisted }) {
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    const handleAddToWaitlist = () => {
        const userData = getLupaStoreState().Users.currUserData;
        LUPA_CONTROLLER_INSTANCE.addUserToProgramWaitlist(program.program_structure_uuid, userData);
        closeModal();
    }
    return (
        <Dialog visible={isVisible} animationType="fade" animated={true} style={{borderRadius: 15,}}>
            <Dialog.Title>
                Add to waitlist
            </Dialog.Title>
            <Dialog.Content>
                <Paragraph style={{fontFamily: 'Avenir'}}>
                    You are about to added to the wait for {program.program_name}.  Lupa will search for four users in your area
                    to join this program with you.  Users are usually matched within the day.
                </Paragraph>

                <Caption>
                    You will be notified once you are placed in a pack.
                </Caption>
            </Dialog.Content>

            <Dialog.Actions style={{flexDirection: 'row', marginVertical: 10, alignItems: 'center', justifyContent: 'space-evenly'}}>
                <Button 
                uppercase={false}
                mode="contained" 
                color="rgb(245, 245, 245)"
                contentStyle={{height: 45, width: Dimensions.get('window').width / 2.8}}
                theme={{roundness: 8}}
                style={{elevation: 0}}
                onPress={closeModal}
                >
                    Cancel
                </Button>

                <Button 
                uppercase={false}
                mode="contained" 
                color="#1089ff"
                contentStyle={{height: 45, width: Dimensions.get('window').width / 2.8}}
                theme={{roundness: 8}}
                style={{elevation: 0}}
                onPress={handleAddToWaitlist}
                disabled={userIsWaitlisted}
                >
                    Confirm
                </Button>
            </Dialog.Actions>
        </Dialog>
    )
}

function ProgramInformationPreview({ isVisible, program, closeModalMethod }) {
    const [programOwnerData, setProgramOwnerData] = useState(getLupaUserStructure())
    const [showProfileModal, setShowProfileModal] = useState(false)
    const [showWorkoutPreviewModal, setShowWorkoutPreviewModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [token, setToken] = useState("")
    const [paymentSuccessful, setPaymentSuccessful] = useState(false)
    const [paymentComplete, setPaymentComplete] = useState(false)
    const [waitlistDialogIsVisible, setWaitlistDialogIsVisible] = useState(false);
    const [startPackDialogIsVisible, setStartPackDialogIsVisible] = useState(false);

    const [waitlistProgramData, setProgramWaitlistData] = useState([]);

    const [lupaPurchasePageOpen, setLupaPurchasePageOpen] = useState(false)

    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance()

    const dispatch = useDispatch()

    const currUserData = useSelector(state => {
        return state.Users.currUserData
    })

    const getProgramProps = () => {
        const id = program.program_structure_uuid
        return id;

    }

    useEffect(() => {
        async function fetchData() {
            try {
                await LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(program.program_owner).then(data => {
                    setProgramOwnerData(data)
                })
            } catch(err) {
                alert(err)
                setProgramOwnerData(getLupaProgramInformationStructure())
            }
        }

        LOG('ProgramInformationPreview.js', 'Running useEffect');

        fetchData();
    }, [])

    const checkUserIsWaitlisted = () => {
        let retVal = false;
        waitlistProgramData.forEach(entry => {
            if (entry.user_uuid == currUserData.user_uuid) {
                retVal = true;
            }
        });

        retVal = false;
        return retVal;
    }

    /**
     * Sends request to server to complete payment
     */
    const makePayment = async (token, amount) => {
        //Create an idemptoencyKey to prevent double transactions
        const idempotencyKey = await Math.random().toString()

        //Get a copy of the current user data to pass some fields into the request
        const userData = currUserData;

        //Make the payment request to firebase with axios
        axios({
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            url: STRIPE_ENDPOINT,
            data: JSON.stringify({
                seller_stripe_id: programOwnerData.stripe_metadata.stripe_id,
                amount: amount,
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

        //If the payment is complete and successful then update database
        if (paymentComplete == true && paymentSuccessful == true) {

            //handle program in backend
            try {
                const updatedProgramData = await LUPA_CONTROLLER_INSTANCE.purchaseProgram(currUserData, program);
                await dispatch({ type: "ADD_CURRENT_USER_PROGRAM" , ...updatedProgramData})
            } catch (err) {
                setLoading(false);
                alert(err)
                //need to handle the case where there is an error when we add the program
                closeModalMethod()
            }
        }
        await setLoading(false);
        //close modal
        closeModalMethod()
    }

    const getProgramTags = () => {
        try {
            return program.program_tags.map((tag, index, arr) => {
                return (
                    <Chip mode="flat" textStyle={{fontSize: 12, fontWeight: 'bold', color: '#23374d'}} style={{borderRadius: 10, alignItems: 'center', justifyContent: 'center', margin: 5}}>
                    
                        <Caption>
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
     * Returns the program name
     * @return URI Returns a string for the name, otherwise ''
     */
    const getProgramName = () => {
            try {
                return (
                    <Text style={{ fontSize: 15, color: '#212121', paddingVertical: 10, fontFamily: 'Avenir-Heavy'}}>
                           {titleCase(program.program_name)}
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
        if (typeof(program) == 'undefined')
        {
            return ''
        }

            try {
                return program.program_description;
            } catch(err) {
                return ''
            }
    }

    /**
     * Returns the program image
     * @return URI Returns a uri for the program image, otherwise ''
     */
    const getProgramImage = () => {
        if (typeof(program) == 'undefined')
        {
            return ''
        }

            try {
                return program.program_image;
            } catch(err) {
                return ''
            }
    }

    return (
        <Modal presentationStyle="fullScreen" visible={isVisible} style={styles.container} animated={true} animationType="slide">
              <SafeAreaView style={styles.container}>
               
                  <Appbar.Header style={styles.appbar} theme={{
                      colors: {
                          primary: '#FFFFFF'
                      },
                  }}>

<Appbar.BackAction onPress={() => closeModalMethod()} />

                    
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <TouchableOpacity onPress={() => setStartPackDialogIsVisible(true)}>
                        <View style={{marginHorizontal: 5, alignItems: 'center', justifyContent: 'center',}}>
                        <View style={{borderRadius: 8, alignItems: 'center', justifyContent: 'center', width: 30, height: 30, backgroundColor: 'rgb(245, 245, 245)',}}>
                            <MaterialIcon name="group-add" size={18} />
                          
                        </View>
                        </View>
                        </TouchableOpacity>
                    </View>
                  </Appbar.Header>
                   <View style={{flexGrow: 2}}>
                       <Text style={{alignSelf: 'center', paddingVertical: 10}}>
                       {getProgramName()}
                       </Text>
                   <View style={styles.programImageContainer}>
                       <Surface style={{marginHorizontal: 20, width: '60%', borderRadius: 10, height: 180, alignItems: 'center', justifyContent: 'center'}}>
                       <Image style={{width: '100%', height: '100%', borderRadius: 10}} source={{uri: getProgramImage()}} />
                       </Surface>

                       <Text style={{color: "#1089ff", paddingTop: 10, fontFamily: 'Avenir-Medium'}}>
                           ${program.program_price}
                       </Text>
                       
                   </View>

                   <View style={styles.programOwnerDetailsContainer}>
                      
                      <View style={styles.programOwnerDetailsSubContainer}>
                      <View>
                              <Avatar rounded source={{uri: programOwnerData.photo_url}} color="#FFFFFF" size={50} />
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

                   <View style={styles.programInformationContainer}>
                       
                       <Paragraph style={styles.programDescriptionText}>
                           {getProgramDescription()}
                       </Paragraph>
                       <View style={[styles.programTags, styles.alignRowAndCenter]}>
                           {getProgramTags()}
                       </View>
                   </View>

                   </View>
                   <View style={styles.purchaseContainer}>

                  <Button 
                  icon={() => <FeatherIcon name="shopping-cart" color="white" size={15} />}
                        onPress={() => setLupaPurchasePageOpen(true)} 
                        mode="contained"
                        theme={{
                        roundness: 8,
                    }}
                    color="#1089ff"
                    style={{width: '100%'}}>
                        Proceed to Checkout
                </Button>
                </View>
                   <FullScreenLoadingIndicator isVisible={loading} />
                   <PurchaseProgramWebView 
                    isVisible={lupaPurchasePageOpen} 
                    closeModal={() => setLupaPurchasePageOpen(false)}
                    programUUID={program.program_structure_uuid}
                    programOwnerUUID={programOwnerData.user_uuid}
                    purchaserUUID={currUserData.user_uuid}
                    />
                   </SafeAreaView>
                   <StartPackDialog isVisible={startPackDialogIsVisible} closeModal={() => setStartPackDialogIsVisible(false)} program={program} />
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
        elevation: 0,
        justifyContent: 'space-between',

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
    },
    image: {
        width: '100%', 
        height: '100%'
    },
    programOwnerDetailsContainer: {
        alignItems: 'center', 
        justifyContent: 'space-evenly',
        marginVertical: VERTICAL_SEPARATION,
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
        fontFamily: 'Avenir-Light',
        paddingVertical: 5
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
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginVertical: VERTICAL_SEPARATION
    }
})

export default ProgramInformationPreview;