import React from 'react'

import {
    Modal,
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback
} from 'react-native'
import { Divider, Appbar } from 'react-native-paper'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import Feather1s from 'react-native-feather1s/src/Feather1s'
import LupaController from '../../../../controller/lupa/LupaController'

const TRAINER_OPTIONS = [
  /*  {
        optionTitle: 'Edit Program',
    },*/
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
        optionTitle: 'Launch Live Workout',
    },*/
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

    const handleDefaultOptionsOnPress = (optionTitle) => {

        if (optionTitle == 'Share Program') {
            shareProgramOnPress(program);
        }

        if (optionTitle == 'Delete Program') {
            LUPA_CONTROLLER_INSTANCE.eraseProgram(program.program_structure_uuid);
        }

        if (optionTitle == 'Post to Profile') {
            LUPA_CONTROLLER_INSTANCE.markProgramPublic(program.program_structure_uuid);
        }

        closeModal()
    }

    const handleCurrUserOptions = (optionTitle) => {

        if (optionTitle == 'View Trainer Profile') {
            navigation.navigate('Profile', {
                userUUID: program.program_owner,
            });
        }

        if (optionTitle == 'Launch Live Workout') {
            navigation.navigate('LiveWorkout', {
                uuid: program.program_structure_uuid,
                workoutType: 'PROGRAM',
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

    return (
        <Modal 
            presentationStyle="fullScreen" 
            animated={true} 
            animationType="slide" 
            style={styles.modal} 
            visible={isVisible}>
             <Appbar.Header style={styles.appBar}>
                <Appbar.Action onPress={closeModal} icon={() => <Feather1s thin={true} name="x" size={20} />} />
                <Appbar.Content title="Program Options" titleStyle={{alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 25}} />
            </Appbar.Header>
            <View style={styles.container}>
                {
                    renderDefaultOptions()
                }
                {
                    renderCurrUserOptions()
                }
                {
                    renderProgramOwnerOptions()
                }
            </View>
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
    }
})

export default ProgramOptionsModal;