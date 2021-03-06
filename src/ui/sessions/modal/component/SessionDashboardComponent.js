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
import ParQAssessment from '../../../user/dashboard/components/ParQAssessment';
import { getLupaProgramInformationStructure } from '../../../../model/data_structures/programs/program_structures';
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
    const [linkedProgram, setLinkedProgram] = useState(getLupaProgramInformationStructure());
    const [parQAssessmentVisible, setParQAssessmentVisible] = useState(false);
    const [isFirstSession, setIsFirstSession] = useState(false);

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
                setProgramUID(clientData.linked_program)
            }
        })
    }, [programUID])

    const navigateToVirtualSession = async () => {
     
        let foundProgram = -1;

        await LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(trainerUserData.user_uuid)
        .then(async data => {
            const clients = data.clients;
            clients.forEach(async clientData => {
                if (clientData.client == requesterUserData.user_uuid) {
                 if (typeof(clientData.linked_program) == null || typeof(clientData.linked_program) == 'undefined' || clientData.linked_program == '' || clientData.linked_program == "0") {
                     if (currUserData.isTrainer) {
                         alert('Please link a program to this client from the session options!')
                     } else {
                         alert('Your trainer has yet to link you to a program.  Please wait a moment.')
                     }
                     return;
                 } else {
                     foundProgram = clientData.linked_program;
                 }

                 if (foundProgram == -1 || foundProgram == "0"){
                    if (currUserData.isTrainer) {
                        alert('Please link a program to this client from the session options!')
                    } else {
                        alert('Your trainer has yet to link you to a program.  Please wait a moment.')
                    }

                    return;
                 }

                 await LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(requesterUserData.user_uuid)
                .then(async data => {
                    const programData = data.program_data;
                    programData.forEach(program => {
                        if (program.program_structure_uuid == foundProgram) {
                            let isFirstSession = false;
                            if (booking && booking.isFirstSession == true) {
                                isFirstSession = true;
                                if (currUserData.user_uuid == booking.requester_uuid) {
                                   setIsFirstSession(true)
                                   setParQAssessmentVisible(true);
                                }
                            } else {
                                setIsFirstSession(false)
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
                                        workout: -1,
                                        isBooking: true,
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
                                        isBooking: true
                                    })
                                  }
                        
                                    setProgramUID(clientData.linked_program)
                        }
                    })
                });
    
     
                }
            })
        })
    }

    const navigateToLiveSession = async () => {
        let foundProgram = -1;

        await LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(trainerUserData.user_uuid)
        .then(async data => {
            const clients = data.clients;
            clients.forEach(async clientData => {
                if (clientData.client == requesterUserData.user_uuid) {
                 if (typeof(clientData.linked_program) == null || typeof(clientData.linked_program) == 'undefined' || clientData.linked_program == '' || clientData.linked_program == "0") {
                     if (currUserData.isTrainer) {
                         alert('Please link a program to this client from the session options!')
                     } else {
                         alert('Your trainer has yet to link you to a program.  Please wait a moment.')
                     }
                     return;
                 } else {
                     foundProgram = clientData.linked_program;
                 }

                 if (foundProgram == -1 || foundProgram == "0"){
                    if (currUserData.isTrainer) {
                        alert('Please link a program to this client from the session options!')
                    } else {
                        alert('Your trainer has yet to link you to a program.  Please wait a moment.')
                    }

                    return;
                 }

                 await LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(requesterUserData.user_uuid)
                .then(async data => {
                    const programData = data.program_data;
                    programData.forEach(program => {
                        if (program.program_structure_uuid == foundProgram) {
                            navigation.push('LiveWorkout', {
                                sessionID: booking.uid,
                                uuid: clientData.linked_program,
                                workoutType: 'PROGRAM',
                                workoutMode: LIVE_WORKOUT_MODE.TEMPLATE,
                                booking: booking,
                                week: -1,
                                workout: -1,
                                isBooking: true
                            })
            
                           setProgramUID(clientData.linked_program)
                        }
                    })
                });
    
     
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

    const renderRemoteCoachingText = () => {
        if (booking && booking.session_type == SESSION_TYPE.REMOTE_COACHING) {
            return (
                <View style={{paddingVertical: 5}}>
                <Caption style={{color: 'white'}}>
                    Coaching for this session will end on {moment(booking.start_time).format('LL').toString()}
                </Caption>
            </View>
            )
        }
    }

    const renderSessionLocation = () => {
        switch(booking.session_type) {
            case SESSION_TYPE.REMOTE:
                return 'Virtual';
            case SESSION_TYPE.IN_PERSON:
                return trainerUserData.homegym.name;
            case SESSION_TYPE.REMOTE_COACHING:
                return 'Virtual'
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

                {renderRemoteCoachingText()}
            </View>

            <Divider />


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
      <ParQAssessment isVisible={parQAssessmentVisible} closeModal={() => setParQAssessmentVisible(false)} loadAnswers={false} />
       </>

            
    )
}

export default SessionDashboardComponent;