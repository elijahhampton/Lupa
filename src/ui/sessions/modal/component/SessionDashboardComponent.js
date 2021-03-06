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
    Dialog,
    Divider
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
import { LIVE_WORKOUT_MODE } from '../../../../model/data_structures/workout/types';
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

    const [programUID, setProgramUID] = useState("");

    useEffect(() => {
        async function fetchComponentData() {
            const updatedUserData = getLupaStoreState().Users.currUserData;

            if (trainerUserData.user_uuid != 0 && requesterUserData.user_uuid != 0) {
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
           
        }
        
        fetchComponentData()

        const clients = trainerUserData.clients;
         clients.forEach(clientData => {
            if (clientData.client == requesterUserData.user_uuid) {
                console.log(clientData.linked_program)
                setProgramUID(clientData.linked_program)
            }
        })
    }, [programUID])

    const navigateToVirtualSession = async () => {
        await LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(trainerUserData.user_uuid)
        .then(data => {
            const clients = data.clients;
            clients.forEach(clientData => {
                if (clientData.client == requesterUserData.user_uuid) {
    
                    if (typeof(clientData.linked_program) == null || typeof(clientData.linked_program) == 'undefined' || clientData.linked_program == '') {
                        if (currUserData.isTrainer) {
                            alert('Please link a program to this client from the session options!')
                        } else {
                            alert('Your trainer has yet to link you to a program.  Please wait a moment.')
                        }
                        return;
                    }
    
            let isFirstSession = false;
            if (booking && booking.isFirstSession == true) {
                isFirstSession = true;
            } else {
                isFirstSession = false
            }
    
                  if (isFirstSession == true) {
                    navigation.push('LiveWorkout', {
                        sessionID: booking.uid,
                        uuid: clientData.linked_program,
                        workoutType: 'PROGRAM',
                        workoutMode: LIVE_WORKOUT_MODE.CONSULTATION,
                        booking: booking,
                        week: -1,
                        workout: -1
                    })
                  } else {
                    navigation.push('LiveWorkout', {
                        sessionID: booking.uid,
                        uuid: clientData.linked_program,
                        workoutType: 'PROGRAM',
                        workoutMode: LIVE_WORKOUT_MODE.VIRTUAL,
                        booking: booking,
                        week: -1,
                        workout: -1,
                    })
                  }
    
                    setProgramUID(clientData.linked_program)
                }
            })
        })
     
         
    }

    const navigateToLiveSession = async () => {
        await LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(trainerUserData.user_uuid)
        .then(data => {
            const clients = data.clients;
            clients.forEach(clientData => {
                if (clientData.client == requesterUserData.user_uuid) {
                 if (typeof(clientData.linked_program) == null || typeof(clientData.linked_program) == 'undefined' || clientData.linked_program == '') {
                     if (currUserData.isTrainer) {
                         alert('Please link a program to this client from the session options!')
                     } else {
                         alert('Your trainer has yet to link you to a program.  Please wait a moment.')
                     }
                     return;
                 }
     
                   //if this is first booking then
                   let isFirstSession = false;
                   if (booking && booking.isFirstSession == true) {
                       isFirstSession = true;
                   } else {
                       isFirstSession = false
                   }
     
                   if (isFirstSession == true) {
                     navigation.push('LiveWorkout', {
                         sessionID: booking.uid,
                         uuid: clientData.linked_program,
                         workoutType: 'PROGRAM',
                         workoutMode: LIVE_WORKOUT_MODE.CONSULTATION,
                         booking: booking,
                         week: -1,
                         workout: -1
                     })
                   } else {
                     navigation.push('LiveWorkout', {
                         sessionID: booking.uid,
                         uuid: clientData.linked_program,
                         workoutType: 'PROGRAM',
                         workoutMode: LIVE_WORKOUT_MODE.TEMPLATE,
                         booking: booking,
                         week: -1,
                         workout: -1
                     })
                   }
     
                    setProgramUID(clientData.linked_program)
                }
            })
        })
    }

    const renderSessionControl = () => {
        if (booking.session_type == SESSION_TYPE.REMOTE) {
            return (
                <Caption style={{color: '#1089ff'}} onPress={navigateToVirtualSession}>
                    Join Session
                </Caption>
            )
        } else if (booking.session_type == SESSION_TYPE.IN_PERSON) {
            return (
                <Caption style={{color: '#1089ff'}} onPress={navigateToLiveSession}>
                    Join Live Workout
                </Caption>
            )
        }
    }

    const renderSessionLocation = () => {
        switch(booking.session_type) {
            case SESSION_TYPE.REMOTE:
                return 'Remote';
            case SESSION_TYPE.IN_PERSON:
                return trainerUserData.homegym.name;
            default:
                return 'Cannot load location'
        }
    }
    return (
        <>
        <Surface key={booking.uid} style={{backgroundColor: '#23374d', elevation: 0, alignSelf: 'center', width: Dimensions.get('window').width - 10, borderColor: '#E5E5E5', marginVertical: 10, padding: 10}}>
             <Text style={{fontSize: 15, paddingVertical: 5, fontFamily: 'Avenir-Heavy', color: 'white'}}>
                        {moment(booking.date).format('LL').toString()}
                    </Text>

            <View style={{marginVertical: 5}}>
                <View style={{paddingVertical: 5, flexDirection: 'row', alignItems: 'center'}}>
                    <FeatherIcon name="clock" color="#FFFFFF" style={{paddingRight: 5}} />
                    <Text style={{color: 'white', fontSize: 15, fontFamily: 'Avenir-Medium'}}>
                       { moment(booking.start_time).format('LT').toString()}
                    </Text>
                </View>

                <View style={{paddingVertical: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row', alignItems: 'center', }}>
                <FeatherIcon name="map-pin" color="#FFFFFF" style={{paddingRight: 5}} />
                    <Text style={{color: 'white', fontSize: 15, fontFamily: 'Avenir-Medium'}}>
                      {renderSessionLocation()}
                    </Text>
                </View>

                {renderSessionControl()}
                </View>
            </View>

            <Button 
                onPress={() => setBookingInformationModalVisible(true)} 
                color="#1089ff" 
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
       <Divider style={{backgroundColor: 'white'}} />
       </>

            
    )
}

export default SessionDashboardComponent;