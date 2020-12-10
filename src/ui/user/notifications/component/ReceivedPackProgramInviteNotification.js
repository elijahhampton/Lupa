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
import LOG, { LOG_ERROR } from '../../../../common/Logger';

const {windowWidth} = Dimensions.get('window').width


function ReceivedPackProgramInviteNotification({ notificationData }) {
    const [senderUserData, setSenderUserData] = useState(getLupaUserStructure())
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance()
    const navigation = useNavigation();
    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

    const renderNotificationMessage = () => {
        try {
            return (
                <Text>
                               <Text style={{fontWeight: '500'}}>
       {senderUserData.display_name}{" "}
       </Text>
       <Text>
          has invited you to start a program in your pack.  Navigate to your pack to view the offer.
       </Text>
        </Text>
            )
       
    } catch(error) {
        alert(error)
    }
    }

    const renderActionButtons = () => {
        return (
        <View style={{width: '100%'}}>
            <Button 
            style={{
                elevation: 0, 
                marginVertical: 10, 
                width: Dimensions.get('window').width - 20, 
                alignSelf: 'center'
            }}
            theme={{roundness: 12}}
            uppercase={false}
            mode="contained" 
            color="#1089ff" 
            contentStyle={{height: 35}}
            onPress={() => navigation.push('PackChat', {
                uid: notificationData.data
            })}>
                <Text style={{fontSize: 13, fontFamily: 'Avenir-Medium'}}>
                    View Pack Offer
                </Text>
            </Button>
        </View>
        )
    }

    useEffect(() => {
        async function fetchData() {
            await LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(notificationData.from).then(data => {
                setSenderUserData(data)
            })
        }

        LOG('ReceivedPackProgramInviteNotification.js', 'Running useEffect::Fetching sender data from notification.')
        fetchData()
    }, []);

    return (
        <>
                   <View style={{width: '100%', marginVertical: 15}}>
                       <View style={{width: '80%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
                           <Avatar.Image source={{uri: senderUserData.photo_url}} size={35} style={{marginHorizontal: 10}} />
                           <View>
                               {renderNotificationMessage()}
                           </View>
                       </View>
                       {renderActionButtons()}
                   </View>
                    
                   <Divider />
                   </>
    )
}

export default ReceivedPackProgramInviteNotification;