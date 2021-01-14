import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    View,
    Text,
    Dimensions,
    TouchableWithoutFeedback,
} from 'react-native';

import {
    Avatar,
    Button,
    Appbar,
    Caption,
    Divider,
} from 'react-native-paper';
import LiveWorkout from '../../../workout/modal/LiveWorkout';

import axios from 'axios';

import { getLupaUserStructure, getLupaUserStructurePlaceholder } from '../../../../controller/firebase/collection_structures';
import LupaController from '../../../../controller/lupa/LupaController';
import { useNavigation } from '@react-navigation/native';
import ProgramOptionsModal from '../../../workout/program/modal/ProgramOptionsModal';
import LUPA_DB, { LUPA_AUTH } from '../../../../controller/firebase/firebase';
import getBookingStructure from '../../../../model/data_structures/user/booking';
import { BOOKING_STATUS, SESSION_TYPE } from '../../../../model/data_structures/user/types';
import moment from 'moment';
import { LOG_ERROR } from '../../../../common/Logger';
import { getLupaStoreState } from '../../../../controller/redux';
import { CURRENCY, initStripe, PAY_TRAINER_ENDPOINT } from '../../../../modules/payments/stripe';

const {windowWidth} = Dimensions.get('window').width


function ReceivedBookingRequestNotification({ notificationData }) {
    const [senderUserData, setSenderUserData] = useState(getLupaUserStructure())
    const [bookingData, setBookingData] = useState(notificationData.data);
    const [componentDidErr, setComponentDidErr] = useState(false);

    const [loading, setLoading] = useState(false);
    const [paymentComplete, setPaymentComplete] = useState(false);
    const [paymentSuccessful, setPaymentSuccessful] = useState(false);

    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance()

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

           /**
     * Sends request to server to complete payment
     */
    const makePaymentToTrainer = async (amount) => {
        let requesterUserData = getLupaUserStructurePlaceholder();
        await LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(bookingData.requester_uuid).then(data => {
            requesterUserData = data;
        })

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
             if (bookingData.hasOwnProperty('isFirstSession') == true) {
                 await makePaymentToTrainer(15.00)
             } else {
                await makePaymentToTrainer(amount)
             }
         } catch (error) {
             await setPaymentComplete(false)
             await setPaymentSuccessful(false)
             setLoading(false);
             return;
         }
  
        await setLoading(false);
    }

    const handleAcceptBooking = () => {
        LUPA_CONTROLLER_INSTANCE.handleAcceptBooking(notificationData.data.uid).then(() => {
            const updatedUserData = getLupaStoreState().Users.currUserData;
            //handlepayment request
            try {
            handlePayBookingCost(updatedUserData.hourly_payment_rate);
            } catch(error) {
                LOG_ERROR('TrainerDashboard.js', 'Failed payment in handlePayBookingCost', error);
                return;
            }
        })
    }


    const renderBookingButtons = () => {
        try {
        if (typeof(bookingData) == 'undefined') {
            return (
            null
            )
        }
        
        return bookingData.status === BOOKING_STATUS.BOOKING_REQUESTED ?
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', width: '100%'}}>
        <Button uppercase={false} color="#1089ff" onPress={handleAcceptBooking}>
            Accept
        </Button>

        <Button uppercase={false} color="#1089ff" onPress={() => LUPA_CONTROLLER_INSTANCE.handleDeclineBooking(notificationData.data.uid)}>
            Decline
        </Button>
    </View>
                            :
                         null

    }catch(errror) {
        setComponentDidErr(true);
    }
        
    }

    const renderNotificationMessage = () => {
        if (typeof(bookingData.session_type) == 'undefined') {
            return (
                <Text style={{alignSelf: 'flex-start'}}>
                     Error loading notification.
                </Text>
                              
            )
            
           
        }

        try {
        if (bookingData.session_type == 'remote') { //SESSION_TYPE.REMOTE
            return (
                <Text>
                               <Text style={{fontWeight: '500'}}>
       {senderUserData.display_name}{" "}
       </Text>
       <Text>
       has requested a remote training session with you.
       </Text>
                               </Text>
            )
        } else if (bookingData.session_type == 'in_person') { //SESSION_TYPE.IN_PERSION ? 
            return (
                <Text>
                               <Text style={{fontWeight: '500'}}>
       {senderUserData.display_name}{" "}
       </Text>
       <Text>
       has requested an in person training session with you.
       </Text>
                               </Text>
            )
        } else {
            <Text>
                               <Text style={{fontWeight: '500'}}>
       {senderUserData.display_name}{" "}
       </Text>
       <Text>
       has requested a training session with you.
       </Text>
                               </Text>
        }
    } catch(error) {
        LOG_ERROR('ReceivedBookingRequestNotificaiton.js', 'renderNotificationMessage::Caught exception trying to render the notification message.  Returning default message.', error);
        setComponentDidErr(true);
        return (
            <Text>
            Error loading notification.
                               </Text>
        )
    }
    }

    useEffect(() => {
        async function fetchData() {
            await LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(notificationData.from).then(data => {
                setSenderUserData(data)
            }).catch(() => {
                setComponentDidErr(true)
            })
        }



        const bookingsObserver = LUPA_DB.collection('bookings')
        .doc(notificationData.data.uid)
        .onSnapshot(documentSnapshot => {
            const bookingData = documentSnapshot.data();
            setBookingData(bookingData)
        }, err => {
            setComponentDidErr(true);
        })

        fetchData().catch(() => {
            setComponentDidErr(true);
        })
        return () => bookingsObserver();
    }, []);

    const renderComponentDisplay = () => {
        if (componentDidErr == true) {
            return (
                <View style={{width: '100%', marginVertical: 15, padding: 20, alignItems: 'center', justifyContent: 'center'}}>
                <Text>
                    Error loading notificaiton
                </Text>
            </View>
            )

        } else {
            return (
                <>
                <View style={{width: '100%', marginVertical: 15}}>
                    <View style={{width: '80%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
                        <Avatar.Image source={{uri: senderUserData.photo_url}} size={35} style={{marginHorizontal: 10}} />
                        <View>
                            {renderNotificationMessage()}
    <Caption>
        {
        moment(notificationData.data.start_time).format('LT').toString()
         } 
         - 
         {
         moment(notificationData.data.end_time).format('LT').toString()
         }
    </Caption>
                        </View>
                    </View>
                    {renderBookingButtons()}
                   
                </View>
               
                <Divider />
                </>
            )
           
        }
    }

    return renderComponentDisplay()
}

export default ReceivedBookingRequestNotification;