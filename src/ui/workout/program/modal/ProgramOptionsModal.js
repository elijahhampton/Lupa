import React, { createRef, useState } from 'react'

import {
    Modal,
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback,
    SafeAreaView
} from 'react-native'
import { Divider, Appbar, Button, Caption } from 'react-native-paper'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import Feather1s from 'react-native-feather1s/src/Feather1s'
import LupaController from '../../../../controller/lupa/LupaController'
import EditProgramWorkouts from '../createprogram/buildworkout/EditProgramWorkouts'
import ProgramInformationPreview from '../ProgramInformationPreview'
import { LIVE_WORKOUT_MODE } from '../../../../model/data_structures/workout/types'
import { ScrollView } from 'react-native-gesture-handler'
import { Row } from 'native-base'

const daysOfTheWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
]

const a = [0,1,2,3,4]
const TRAINER_OPTIONS = [
    {
        optionTitle: 'Edit Program',
    },
    {
        optionTitle: 'Preview Program'
    },
    {
        optionTitle: 'Share Program',
    },
    {
        optionTitle: 'Post to Profile',
    },
    {
        optionTitle: 'Delete Program',
        customTextStyle: {
           color: '#e53935',
           fontWeight: '600',
        }
    },
]

const DEFAULT_OPTIONS = [
    
]

const CURR_USER_OPTIONS = [
    {
        optionTitle: 'View Trainer Profile',      
    },
  /* {
        optionTitle: 'Show Program Preview',
    }*/
]

const { windowWidth } = Dimensions.get('window').width

function ProgramOptionsModal({ program, isVisible, closeModal }) {
    
    const currUserData = useSelector(state => {
        return state.Users.currUserData
    })

    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const navigation = useNavigation()

    const [editWorkoutsModalIsVisible, setEditWorkoutsModalIsVisible] = useState(false);
    const programPreviewRef = createRef();
    const openProgramPreview = () => programPreviewRef.current.open();
    const closeProgramPreview = () => programPreviewRef.current.close();

    handleOpenProgramPreview = async () => {
        await closeModal()
        openProgramPreview()
    }

    const handleDefaultOptionsOnPress = (optionTitle) => {
  

        if (optionTitle == 'Preview Program') {
            openProgramPreview()
        }
        
        if (optionTitle == 'Edit Program') {
            setEditWorkoutsModalIsVisible(true)
        }

        if (optionTitle == 'Share Program') {
            shareProgramOnPress(program);
        }

        if (optionTitle == 'Delete Program') {
            LUPA_CONTROLLER_INSTANCE.eraseProgram(program.program_structure_uuid);
        }

        if (optionTitle == 'Post to Profile') {
            LUPA_CONTROLLER_INSTANCE.markProgramPublic(program.program_structure_uuid);
        }
    }

    const handleCurrUserOptions = (optionTitle) => {

        if (optionTitle == 'View Trainer Profile') {
            navigation.navigate('Profile', {
                userUUID: program.program_owner,
            });
        }

        closeModal()
    }

    const shareProgramOnPress = (program) => {
        navigation.push('ShareProgramModal', {
            programData: program,
            following: currUserData.following,
        });
    }
    
    const renderProgramOwnerOptions = () => {
            if ((currUserData.user_uuid == program.program_structure_uuid) == false) {
                return TRAINER_OPTIONS.map((option, index, arr) => {
                    return (
                        <>
                        <TouchableWithoutFeedback key={index} onPress={() => handleDefaultOptionsOnPress(option.optionTitle)}>
                        <View key={index} style={styles.optionContainerStyle}>
                            <Text style={[styles.textStyle, option.customTextStyle]}>
                                {option.optionTitle}
                            </Text>
                        </View>
                        </TouchableWithoutFeedback>
                        <Divider />
                        </>
                    )
                });
        }
            }


    const renderDefaultOptions = () => {
            return DEFAULT_OPTIONS.map((option, index, arr) => {
                return (
                    <>
                    <TouchableWithoutFeedback key={index} onPress={() => handleDefaultOptionsOnPress(option.optionTitle)}>
                    <View key={index} style={styles.optionContainerStyle}>
                        <Text style={[styles.textStyle, option.customTextStyle]}>
                            {option.optionTitle}
                        </Text>
                    </View>
                    </TouchableWithoutFeedback>
                    <Divider />
                    </>
            )
       });
    }

    const renderCurrUserOptions = () => {
        return CURR_USER_OPTIONS.map((option, index, arr) => {
            return (
                <>
                <TouchableWithoutFeedback key={index} onPress={() => handleCurrUserOptions(option.optionTitle)}>
                <View key={index} style={styles.optionContainerStyle}>
                    <Text style={[styles.textStyle, option.customTextStyle]}>
                        {option.optionTitle}
                    </Text>
                </View>
                </TouchableWithoutFeedback>
                <Divider />
                </>
        )
   });
}

const handleOnLaunchWorkout = (index, day) => {
    navigation.navigate('LiveWorkout', {
        workoutMode: LIVE_WORKOUT_MODE.TEMPLATE,
        sessionID: currUserData.user_uuid,
        uuid: program.program_structure_uuid,
        workoutType: 'PROGRAM',
        week: index,
        day: day
    });

    closeModal();
}

const renderWorkoutContent = () => {
    return (
    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
        {
          program.program_workout_structure.map((weekStructure, index, arr) => {
                return (
                    <>
                   <View style={{padding: 10}}>
                       <Text style={styles.weekHeaderText}>
                           Week {index + 1}
                       </Text>
                       <View style={{backgroundColor: 'black', justifyContent: 'center', alignItems: 'center'}}>
                      <Row>
                      {
                            daysOfTheWeek.map((day, index, arr) => {
                                if (index == 3) {
                                    return;
                                }

                                return (
                                    <>
                                    <View style={{backgroundColor: 'red', height: 100, width: Dimensions.get('window').width / 7}}>
                                    </View>
                                    <View style={{height: 1, width: 1, backgroundColor: 'white'}} />
                                    </>
                                )
                            })
                        }
                      </Row>
                      <Row>
                      {
                            daysOfTheWeek.map(day => {
                                if (index < 4) {
                                    return;
                                }
                                return (
                                    <>
                                    <View style={{backgroundColor: 'red', height: 100, width: Dimensions.get('window').width / 7}}>
                                    </View>
                                    <View style={{height: 1, width: 1, backgroundColor: 'white'}} />
                                    </>
                                )
                            })
                        }
                      </Row>
   
                    </View>
                    </View>
                    <Divider />
                    </>
                )
            })
        }
    </View>
    )
}

    return (
        <Modal 
            presentationStyle="fullScreen" 
            animated={true} 
            animationType="slide" 
            style={styles.modal} 
            visible={isVisible}>
             <Appbar.Header style={styles.appBar}>
                <Appbar.BackAction 
                onPress={closeModal} 
                />
                <Appbar.Content 
                    title="Program Options" 
                    titleStyle={styles.appBarTitleStyle} 
                    />
            </Appbar.Header>
            <View style={styles.container}>
                <ScrollView>
                {
                    renderDefaultOptions()
                }
                {
                    renderCurrUserOptions()
                }
                {
                    renderProgramOwnerOptions()
                }
                {
                    renderWorkoutContent()
                }
                </ScrollView>
            </View>
   
            <EditProgramWorkouts isVisible={editWorkoutsModalIsVisible} closeModal={() => setEditWorkoutsModalIsVisible(false)} programData={program} />
            <ProgramInformationPreview ref={programPreviewRef} program={program} trainerView={true} />
            <SafeAreaView />
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    textStyle: {
        fontFamily: 'avenir-roman', 
        fontSize: 15, 
        padding: 10
    },
    optionContainerStyle: {
        padding: 3
    },
    appBar: {
        elevation: 0,
        backgroundColor: '#FFFFFF'
    },
    appBarTitleStyle: {
        alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 25
    },
    weekHeaderText: {
        fontSize: 16,
        fontWeight: '700'
    },
    exerciseHeaderText: {
        fontSize: 15,
        fontWeight: '400'
    },
    metadataText: {
        color: '#AAAAAA',
        fontSize: 12,
        fontWeight: '300'
    },
    dayHeaderText: {
        fontSize: 13,
        fontWeight: '700'
    }
})

export default ProgramOptionsModal;