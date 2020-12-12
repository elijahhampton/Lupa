import React, { useState, useEffect } from 'react';

import {
    View,
    Text,
    Dimensions,
    StyleSheet
} from 'react-native';

import {
    Surface,
    Button,
    Caption,
    Dialog
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { Avatar } from 'react-native-elements';
import moment from 'moment';
import { getBookingStructure } from '../../../../model/data_structures/user/booking';
import { useSelector } from 'react-redux';
import BookingInformationModal from '../BookingInformationModal';
import LupaController from '../../../../controller/lupa/LupaController';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { getLupaUserStructurePlaceholder } from '../../../../controller/firebase/collection_structures';
import { getLupaStoreState } from '../../../../controller/redux/index'
import { SESSION_TYPE } from '../../../../model/data_structures/user/types'
function SessionDashboardComponent({ booking }) {
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    });

    const navigation = useNavigation();

    const [displayName, setDisplayName] = useState("");
    const [bookingInformationModalVisible, setBookingInformationModalVisible] = useState(false);

    const [trainerUserData, setTrainerUserData] = useState(getLupaUserStructurePlaceholder());
    const [requesterUserData, setRequesterUserData] = useState(getLupaUserStructurePlaceholder());

    useEffect(() => {
        async function fetchComponentData() {
            const updatedUserData = getLupaStoreState().Users.currUserData;
            if (booking.requester_uuid == currUserData.user_uuid) {
                setRequesterUserData(updatedUserData);
                await LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(booking.trainer_uuid).then(data => {
                    setTrainerUserData(data);
                });
            } else {
                setTrainerUserData(updatedUserData);
                await LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(booking.requester_uuid).then(data => {
                    setRequesterUserData(data);
                });
            }

            if (currUserData.user_uuid == booking.trainer_uuid) {
                await LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(booking.trainer_uuid, 'display_name').then(attribute => {
                    setDisplayName(attribute)
                })
            } else {
                await LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(booking.requester_uuid, 'display_name').then(attribute => {
                    setDisplayName(attribute)
                })
            }
        }
        
        fetchComponentData()
    }, [])

    const navigateToVirtualSession = () => {
       navigation.push('VirtualSession', {
           booking: booking
       })
    }

    const renderSessionControl = () => {
        if (booking.session_type == SESSION_TYPE.REMOTE) {
            return (
                <Caption style={{color: '#1089ff'}} onPress={navigateToVirtualSession}>
                    Join Session
                </Caption>
            )
        }
    }

    const renderSessionLocation = () => {
        switch(booking.session_type) {
            case SESSION_TYPE.REMOTE:
                return 'Remote';
            case SESSION_TYPE.IN_PERSON:
                return trainerUserData.trainer_metadata.homegym;
        }
    }
    return (
        <Surface key={booking.uid} style={{elevation: 0, alignSelf: 'center', width: Dimensions.get('window').width - 10, borderRadius: 8, borderWidth: 0.5, borderColor: '#E5E5E5', marginVertical: 10, padding: 10}}>
             <Text style={{fontSize: 15, paddingVertical: 5, fontFamily: 'Avenir-Heavy'}}>
                        {moment(booking.date).format('LL').toString()}
                    </Text>

            <View style={{marginVertical: 5}}>
                <View style={{paddingVertical: 5, flexDirection: 'row', alignItems: 'center'}}>
                    <FeatherIcon name="clock" style={{paddingRight: 5}} />
                    <Text style={{color: '#23374d', fontSize: 15, fontFamily: 'Avenir-Medium'}}>
                       { booking.start_time}
                    </Text>
                </View>

                <View style={{paddingVertical: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row', alignItems: 'center', }}>
                <FeatherIcon name="map-pin" style={{paddingRight: 5}} />
                    <Text style={{color: "#23374d", fontSize: 15, fontFamily: 'Avenir-Medium'}}>
                      {renderSessionLocation()}
                    </Text>
                </View>

                {renderSessionControl()}
                </View>
            </View>

            <View style={{padding: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgb(243, 245, 246)', borderRadius: 10}}>
                <Avatar size={40} rounded source={{uri: requesterUserData.photo_url}} containerStyle={{marginRight: 8, borderWidth: 2, borderColor: 'white'}} />

                <Text style={{fontFamily: 'Avenir-Roman', fontWeight: '500', fontSize: 12}} numberOfLines={2} ellipsizeMode="tail">
                    {booking.note}
                </Text>
            </View>

            <Button 
                onPress={() => setBookingInformationModalVisible(true)} 
                color="rgb(35, 73, 115)" 
                uppercase={false} 
                mode="contained" 
                contentStyle={{height: 40, width: '100%'}} 
                style={{marginVertical: 10, marginTop: 20, elevation: 5}}
                theme={{
                    roundness: 12
                }}>
                View Session Information
            </Button>
                <BookingInformationModal trainerUserData={trainerUserData} requesterUserData={requesterUserData} isVisible={bookingInformationModalVisible} closeModal={() => setBookingInformationModalVisible(false)} booking={booking} />
            </Surface>
       

            
    )
}

export default SessionDashboardComponent;