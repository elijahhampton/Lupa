import React, { useEffect, useState } from 'react';

import {
    View,
    Modal,
    Image,
    Text,
    Dimensions,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
} from 'react-native';
 
import { useSelector } from 'react-redux';
import {
    Surface, Button, Divider, Appbar, Paragraph,
} from 'react-native-paper';
import FeatherIcon from 'react-native-vector-icons/Feather'
import Feather1s from 'react-native-feather1s/src/Feather1s';
import { useNavigation } from '@react-navigation/native';
import LUPA_DB from '../../../../controller/firebase/firebase';
import LupaController from '../../../../controller/lupa/LupaController';
import { LIVE_WORKOUT_MODE } from '../../../../model/data_structures/workout/types';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ProgramOptionsModal from '../../../workout/program/modal/ProgramOptionsModal';
import { getLupaProgramInformationStructure } from '../../../../model/data_structures/programs/program_structures';

/**
 * Renders a user's programs along with program options.
 * @param {} param0 
 */
const DashboardPrograms = ({ isVisible, closeModal }) => {
    const navigation = useNavigation();

    const [cardContentHeight, setCardContentHeight] = useState(0)
    const [cardExpanded, setCardExpanded]  = useState(false);
    const [programs, setPrograms] = useState([])
    const [currentProgram, setCurrentProgram] = useState(getLupaProgramInformationStructure());
    const [programsModalIsOpen, setProgramOptionsIsVisible] = useState(false);


    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

    const handleOnPressProgram = async (program) => {
        await setCurrentProgram(program)
        setProgramOptionsIsVisible(true)
    }

    const navigateLiveWorkout = (programData) => {
        closeModal();

        navigation.push('LiveWorkout', {
            programData: programData,
            sessionID: currUserData.user_uuid,
        })
    }
    
    const handleToggleStartProgram = async (programData) => {
        if (programData.program_started === false) {
            await LUPA_CONTROLLER_INSTANCE.handleStartProgram(currUserData.user_uuid, programData.program_structure_uuid);
        } else {
            await LUPA_CONTROLLER_INSTANCE.handleStopProgram(currUserData.user_uuid, programData.program_structure_uuid);
        }
    }

    const handleResetProgram = async (programData) => {
        await LUPA_CONTROLLER_INSTANCE.handleResetProgram(currUserData.user_uuid, programData.program_structure_uuid);
    }

    useEffect(() => {
        let programsList = []
        const programDataObserver = LUPA_DB.collection('users').doc(currUserData.user_uuid).onSnapshot(documentSnapshot => {
            const data = documentSnapshot.data().program_data;
            if (typeof(data) == 'undefined' || data.completedProgram === false) {

            } else {
                console.log(data)
                setPrograms(data);
            }
        });

        return () => programDataObserver();
    }, [])

    const handleOnPressFindFitnessProgram = () => {
        closeModal();
        navigation.push('Search')
    }

    const renderMyPrograms = () => {
        if (programs.length === 0) {
            return (
                <View style={{flex: 1, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center'}}>
                    <Paragraph>
                        <Text style={{ fontSize: 16, fontFamily: 'Avenir-Medium'}}>
                        Here you can access all of the fitness programs you have bought on Lupa.{" "} 
                        </Text>
                        <Text style={{ fontSize: 16, fontFamily: 'Avenir-Medium', color: ''}}>
                        Get started with a program that fits you.
                        </Text>
                    </Paragraph>

                    <Button
                    onPress={handleOnPressFindFitnessProgram}
                    uppercase={false}
                    mode="contained"
                    color="rgb(34, 74, 115)"
                    theme={{roundness: 12}}
                    style={{elevation: 0, marginVertical: 15, width: '100%'}}
                    contentStyle={{height: 55, width: Dimensions.get('window').width - 25}}
                    >
                        Find a Fitness Program
                    </Button>
                </View>
            )
        } else {
            return (
            <ScrollView>
                {
                    programs.map((result, index, arr) => {
                        if (typeof(result) == 'undefined' || typeof(result.program_structure_uuid) == 'undefined' /*|| result.program_image == "" */) {
                            return;
                        }

                        return (
                            <TouchableWithoutFeedback onPress={() => handleOnPressProgram(result)}>
                            <View style={{backgroundColor: 'white'}}>

                            <Surface style={{flexDirection: 'row', alignItems: 'center', borderRadius: 20, margin: 10, elevation: 0, width: Dimensions.get('window').width-20, height: 120, backgroundColor: 'transparent'}} >
                            <View style={{flex: 1.5, alignItems: 'center', justifyContent: 'center' }}>
                                <Image source={{uri: result.program_image }}  style={{width: '100%', height: '100%', borderRadius: 8}} />
                            </View>
                            <View style={{flex: 3, height: '100%', justifyContent: 'space-between' }}>
                                <View style={{justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 5}}>
                                <View style={{width: '90%'}} >
                                    <Text style={{fontSize: 15, color: '#212121'}}>
                                        {result.program_name}
                                    </Text>
                                    <Text style={{paddingVertical: 10, fontSize: 10,flexWrap: 'wrap'}} numberOfLines={4}>
                                    {result.program_description}
                                    </Text>
                                </View>

                             
                                </View>
                            
                              
                            </View>
                          </Surface>
                          </View>
                          </TouchableWithoutFeedback>
                        )
                    })
                }
            </ScrollView>
            )
        }
    }

    return (
        <Modal animated={true} animationType="slide" visible={isVisible} presentationStyle="fullScreen" onDismiss={closeModal}>
            <Appbar.Header style={{backgroundColor: 'white', elevation: 0}}>
                    <Appbar.BackAction onPress={closeModal} />
                    <Appbar.Content title="My Programs" titleStyle={{alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 25}} />
            </Appbar.Header>
            <View style={{flex: 1}}>
               {renderMyPrograms()}
            </View>
            <ProgramOptionsModal program={currentProgram} isVisible={programsModalIsOpen} closeModal={() => setProgramOptionsIsVisible(false)} />
            <SafeAreaView />
        </Modal>
    )
}

export default DashboardPrograms;
