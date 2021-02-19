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


function ReceivedPackProgramStartedInvite({ notificationData }) {

    const renderNotificationMessage = () => {
        try {
            return (
                <Text style={{alignSelf: 'flex-start'}}>
                     Error loading notification.
                </Text>             
            )
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
                            {renderNotificationMessage()}                           
                   </View>
                </View>
               
                <Divider />
                </>
            )
           
        }
    }

    return renderComponentDisplay()
}

export default ReceivedPackProgramStartedInvite;