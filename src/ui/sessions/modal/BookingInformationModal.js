import React, { useState, useEffect } from 'react';

import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Modal,
    ScrollView,
    SafeAreaView,
    ActionSheetIOS,
} from 'react-native';
import { Chip, Paragraph, Caption, Divider, Surface, Button} from 'react-native-paper';
import FeatherIcon from 'react-native-vector-icons/Feather'
import { Avatar } from 'react-native-elements'
import Feather1s from 'react-native-feather1s'
import { useSelector } from 'react-redux';
import LupaController from '../../../controller/lupa/LupaController';
import { getLupaPackEventStructure, getLupaUserStructurePlaceholder } from '../../../controller/firebase/collection_structures';
import { initStripe, PAY_TRAINER_ENDPOINT, CURRENCY } from '../../../modules/payments/stripe/index'
import { getLupaStoreState } from '../../../controller/redux/index'
import axios from 'axios';
import moment from 'moment';

function BookingInformationModal({ trainerUserData, requesterUserData, isVisible, closeModal, booking }) {
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const currUserData = useSelector(state => {
        return state.Users.currUserData
    });

    const [loading, setLoading] = useState(false);
    const [paymentComplete, setPaymentComplete] = useState(false);
    const [paymentSuccessful, setPaymentSuccessful] = useState(false);

    const showBookingOptions = () => {
        //show trainer sheet
        if (trainerUserData.user_uuid == currUserData.user_uuid) {
            showTrainerBookingOptions()
        }

        //show requester sheet
        if (requesterUserData.user_uuid == currUserData.user_uuid) {
            showRequesterBookingOptions()
        }
    }

    const showTrainerBookingOptions = () => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
              options: ["Session Completed", "Cancel Session", "Cancel"],
              destructiveButtonIndex: 2,
              cancelButtonIndex: 2,
            },
            buttonIndex => {
              if (buttonIndex === 0) {
                // cancel action
              } else if (buttonIndex === 0) {
                  handleBookingSessionCompleted()
              } else if (buttonIndex === 1) {
                  handleCancelBookingSession()
              }
            }
          );
    }

    const showRequesterBookingOptions = () => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
              options: ["Cancel", "Cancel Session"],
              destructiveButtonIndex: 0,
              cancelButtonIndex: 0
            },
            buttonIndex => {
              if (buttonIndex === 0) {
                // cancel action
              } else if (buttonIndex === 1) {
                  handleCancelBookingSession()
              }
            }
          );
    }

    const handleCancelBookingSession = () => {
        LUPA_CONTROLLER_INSTANCE.handleCancelBooking(booking);
        closeModal()
    }

        /**
     * Sends request to server to complete payment
     */
    const makePaymentToTrainer = async (amount) => {
        try {
        //generate idempotencyKey to prevent double transactions
        const idempotencyKey = await Math.random().toString()

        //Get a copy of the current user data to pass some fields into the request
        const updatedUserData = getLupaStoreState().Users.currUserData;

        //Make the payment request to firebase with axios
        axios({
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            url: PAY_TRAINER_ENDPOINT,
            data: JSON.stringify({
                requester_card_source: requesterUserData.stripe_metadata.card_source,
                customer_id: requesterUserData.stripe_metadata.stripe_id,
                trainer_card_source: updatedUserData.stripe_metadata.card_source,
                trainer_account_id: updatedUserData.stripe_metadata.account_id,
                amount: amount,
                currency: CURRENCY,
                source: requesterUserData.stripe_metadata.card_source,
                idempotencyKey: idempotencyKey,
                trainer_uuid: trainerUserData.user_uuid,
                purchaser_uuid: requesterUserData.user_uuid,
            })
        }).then(response => {
            console.log(response);
        }).catch(err => {
            console.log(err)
            setPaymentSuccessful(false)
            setPaymentComplete(true)
        })
    } catch(error ) {
        console.log(error)
    }
    }
  
    /**
     * Handles program purchase process
     */
    const handlePayBookingCost = async (amount) => {
        await setLoading(true)
         //handle stripe
         await initStripe()

         //Send request to make payment
         try {
             await makePaymentToTrainer(amount)
         } catch (error) {
             await setPaymentComplete(false)
             await setPaymentSuccessful(false)
             setLoading(false);
             return;
         }
  
        await setLoading(false);
    }

    const handleBookingSessionCompleted = async () => {
        const updatedUserData = getLupaStoreState().Users.currUserData;
        //handlepayment request
        try {
        await handlePayBookingCost(updatedUserData.hourly_payment_rate);
        } catch(error) {
            LOG_ERROR('TrainerDashboard.js', 'Failed payment in handlePayBookingCost', error);
            return;
        }

        LUPA_CONTROLLER_INSTANCE.markBookingSessionCompleted(booking);

        closeModal()
    }

    const renderEquipmentList = () => {
        const equipmentList = trainerUserData.trainer_metadata.personal_equipment_list;
        if (equipmentList.length === 0 || typeof(equipmentList) == 'undefined') {
            return (
                <Caption>
                    {trainerUserData.display_name} has not listed any available equipment.
                </Caption>
            )
        } else {
            return equipmentList.map(equipmentName => {
                return (
                    <Caption>
                    {equipmentName} {" "}
                </Caption>
                )
               
            })
        }
    }

    const renderSessionDuration = () => {
       let startTime = booking.start_time.split(" ")[0];
       let updatedStartTime = startTime.split(":")[1];

       let endTime = booking.end_time.split(" ")[0];
       let updatedEndTime = endTime.split(":")[1];

       if ((Number(updatedEndTime) - Number(updatedStartTime)) == 0) {
           return "60"
       } else {
           return "90"
       }
    }

    return (
        <Modal presentationStyle="fullScreen" visible={isVisible} animationType="slide">
            <SafeAreaView />
            <View style={{flex: 1, backgroundColor: 'white'}}>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{height: Dimensions.get('window').height, backgroundColor: 'rgba(0,0,0,0)'}}>
                     
                            <FeatherIcon name="x" size={22} style={{margin: 10}} onPress={closeModal}  />
                      
                        <View style={{justifyContent: 'flex-start', backgroundColor: 'white', padding: 15, }}>
                            <Avatar source={{ uri: trainerUserData.photo_url }} size={120}  style={{marginVertical: 10, width: 120, height: 120, borderRadius: 10}} />

                            <Text style={{fontSize: 30, paddingVertical: 5, fontWeight: 'bold', color: '#23374d'}}>
                                {trainerUserData.display_name}
                            </Text>
                            <Text style={{fontSize: 20, paddingVertical: 5}}>
                                {trainerUserData.certification}
                            </Text>
                        </View>
                        <Divider />
                        <View style={{  padding: 10, borderRadius: 0,  alignItems: 'flex-start', justifyContent: 'space-evenly',  backgroundColor: 'white'}}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <FeatherIcon name="map-pin" style={{paddingHorizontal: 5}} />
                                <Caption>
                                    {trainerUserData.homegym.address}
                                </Caption>
                            </View>

                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <FeatherIcon name="home" style={{paddingHorizontal: 5}} />
                                <Caption>
                                {trainerUserData.homegym.name}
                                </Caption>
                            </View>
                           </View >
                           <Divider />
                           <View style={{ padding: 10, borderRadius: 3,   backgroundColor: 'white'}}>
                                <Text style={{fontSize: 18, fontFamily: 'Avenir-Heavy', color: '#23374d'}}>
                                   {moment(booking.date).format('LL').toString()}
                                </Text>

                                <View>
                                    <View style={{paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                        <Text style={{fontSize: 16, fontFamily: 'Avenir-Medium', color: 'black'}}>
                                            Starting Time
                                        </Text>
                                        <Chip>
                                            {moment(booking.start_time).format('LT').toString()}
                                        </Chip>
                                    </View>

                                    <View style={{paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                        <Text style={{fontSize: 16, fontFamily: 'Avenir-Medium', color: 'black'}}>
                                            End Time
                                        </Text>
                                        <Chip>
                                          {moment(booking.end_time).format('LT').toString()}
                                        </Chip>
                                    </View>
                                </View>


                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Feather1s name="clock" size={12} style={{paddingRight: 5, }} color='#1089ff' />
                                <Caption style={{color: '#1089ff'}}>
                                    {renderSessionDuration()} minutes session
                                </Caption>
                                </View>
                               
                           </ View>
                            <Divider />
                           < View style={{  padding: 10, borderRadius: 3,   backgroundColor: 'white'}}>
                                <Text style={{fontSize: 18, fontFamily: 'Avenir-Heavy', color: '#23374d'}}>
                                    Session Note
                                </Text>

                                <Paragraph style={{fontFamily: 'Avenir-Light'}}>
                               {booking.note}
                                </Paragraph>
                           </ View >

                          {/*  <Divider />

                           < View style={{  padding: 10, borderRadius: 3,   backgroundColor: 'white'}}>
                                <Text style={{fontFamily: 'Avenir-Light', paddingVertical: 10}}>
                                    {trainerUserData.display_name} has listed the following equipment available:
                                </Text>

                                <View style={{flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap'}}>
                                    {renderEquipmentList()}
                                </View>
                                
                          </ View> */}


                           <Button 
                           mode="contained" 
                           color="#23374d" 
                           onPress={showBookingOptions} 
                           theme={{roundness: 12}}
                           uppercase={false}
                           contentStyle={{height: 45, width: Dimensions.get('window').width - 10}} 
                           style={{marginVertical: 50, marginHorizontal: 10, alignItems: 'center', justifyContent: 'center', elevation: 0}}>
                               <Text style={{fontFamily: 'Avenir-Heavy', fontWeight: '800'}}>
                                   Session Options
                               </Text>
                           </Button>

                    </ScrollView>
                    
            </View>

        </Modal>  
    )
}

export default BookingInformationModal;


//time date
//note you left for trainer
//location
//controls
//equipment trainer can bring
