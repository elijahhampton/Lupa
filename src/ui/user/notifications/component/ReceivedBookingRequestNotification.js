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
import { LUPA_AUTH } from '../../../../controller/firebase/firebase';
import getBookingStructure from '../../../../model/data_structures/user/booking';

const {windowWidth} = Dimensions.get('window').width


function ReceivedBookingRequestNotification({ notificationData }) {
    const [senderUserData, setSenderUserData] = useState(getLupaUserStructure())
    const [bookingData, setBookingData] = useState(getBookingStructure());
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance()

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

    useEffect(() => {
        async function fetchData() {
            await LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(notificationData.from).then(data => {
                setSenderUserData(data)
            })

            /*
            await LUPA_CONTROLLER_INSTANCE.getBookingData(notificationData.data.booking_uid).then(data => {
                setBookingData(data);
            })
            */
        }

        fetchData()
    }, []);

    return (
        <>
                   <View style={{width: '100%', marginVertical: 15}}>
                       <View style={{width: '80%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
                           <Avatar.Image source={{uri: senderUserData.photo_url}} size={35} style={{marginHorizontal: 10}} />
                           <View>
                               <Text>
                               <Text style={{fontWeight: '500'}}>
       {senderUserData.display_name}{" "}
       </Text>
       <Text>
       has requested a training session with you.
       </Text>
                               </Text>
       <Caption>
           {notificationData.data.start_time} - {notificationData.data.end_time}
       </Caption>
                           </View>
                       </View>
                       {
                           bookingData.is_set === true ?
                            null
                            :
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', width: '100%'}}>
                            <Button uppercase={false} color="#1089ff" onPress={() => LUPA_CONTROLLER_INSTANCE.handleAcceptBooking(notificationData.data.booking_uid)}>
                                Accept
                            </Button>
 
                            <Button uppercase={false} color="#1089ff">
                                Decline
                            </Button>
                        </View>
                       }
                      
                   </View>
                  
                   <Divider />
                   </>
    )
}

export default ReceivedBookingRequestNotification;