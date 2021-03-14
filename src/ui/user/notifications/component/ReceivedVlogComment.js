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
import { getLupaExerciseStructure } from '../../../../model/data_structures/workout/exercise_collections';

const {windowWidth} = Dimensions.get('window').width


function ReceivedVlogComment({ notificationData }) {
    const [vlogData, setVlogData] = useState(notificationData.data);
    const [componentDidErr, setComponentDidErr] = useState(false);

    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance()

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })


    const renderNotificationMessage = () => {
        if (typeof(vlogData) == 'undefined') {
            return (
                <Text style={{alignSelf: 'flex-start'}}>
                     Error loading notification.
                </Text>             
            )
        }

        try {
            return (
                <Text>
                    Someone has commented on your vlog {vlogData.vlog_title}
                </Text>
            )
        } catch(error) {
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
                        <View>
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

export default  ReceivedVlogComment;