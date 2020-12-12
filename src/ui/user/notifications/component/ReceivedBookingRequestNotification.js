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

import ProgramInformationPreview from '../../../workout/program/ProgramInformationPreview';
import { getLupaUserStructure } from '../../../../controller/firebase/collection_structures';
import LupaController from '../../../../controller/lupa/LupaController';
import { useNavigation } from '@react-navigation/native';
import ProgramOptionsModal from '../../../workout/program/modal/ProgramOptionsModal';
import LUPA_DB, { LUPA_AUTH } from '../../../../controller/firebase/firebase';
import getBookingStructure from '../../../../model/data_structures/user/booking';
import { BOOKING_STATUS, SESSION_TYPE } from '../../../../model/data_structures/user/types';
import moment from 'moment';
import { LOG_ERROR } from '../../../../common/Logger';

const {windowWidth} = Dimensions.get('window').width


function ReceivedBookingRequestNotification({ notificationData }) {
    const [senderUserData, setSenderUserData] = useState(getLupaUserStructure())
    const [bookingData, setBookingData] = useState(notificationData.data);
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance()

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })


    const renderBookingButtons = () => {
        if (typeof(bookingData) == 'undefined') {
            return (
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', width: '100%'}}>
            <Button uppercase={false} color="#1089ff" onPress={() => LUPA_CONTROLLER_INSTANCE.handleAcceptBooking(notificationData.data.uid)}>
                Accept
            </Button>

            <Button uppercase={false} color="#1089ff">
                Decline
            </Button>
        </View>
            )
        }
        
        return bookingData.status === BOOKING_STATUS.BOOKING_REQUESTED ?
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', width: '100%'}}>
        <Button uppercase={false} color="#1089ff" onPress={() => LUPA_CONTROLLER_INSTANCE.handleAcceptBooking(notificationData.data.uid)}>
            Accept
        </Button>

        <Button uppercase={false} color="#1089ff" onPress={() => {}}>
            Decline
        </Button>
    </View>
                            :
                         null
        
    }

    const renderNotificationMessage = () => {
        try {
        if (bookingData.session_type == SESSION_TYPE.REMOTE) {
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
        } else if (bookingData.session_type == SESSION_TYPE.IN_PERSON) {
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
        return (
            <Text>
                               <Text style={{fontWeight: '500'}}>
       {senderUserData.display_name}{" "}
       </Text>
       <Text>
       has requested a training session with you.
       </Text>
                               </Text>
        )
    }
    }

    useEffect(() => {
        async function fetchData() {
            await LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(notificationData.from).then(data => {
                setSenderUserData(data)
            })
        }


        const bookingsObserver = LUPA_DB.collection('bookings').doc(notificationData.data.uid).onSnapshot(documentSnapshot => {
            const bookingData = documentSnapshot.data();
            console.log('@@@@@@@')
            console.log(notificationData.data.uid)
            console.log(bookingData)
            setBookingData(bookingData)
        })

        fetchData()
        return () => bookingsObserver();
    }, []);

    return (
        <>
                   <View style={{width: '100%', marginVertical: 15}}>
                       <View style={{width: '80%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
                           <Avatar.Image source={{uri: senderUserData.photo_url}} size={35} style={{marginHorizontal: 10}} />
                           <View>
                               {renderNotificationMessage()}
       <Caption>
           {
           notificationData.data.start_time
            } 
            - 
            {
            notificationData.data.end_time
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

export default ReceivedBookingRequestNotification;