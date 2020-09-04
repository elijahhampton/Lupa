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
    {
        optionTitle: 'Launch Live Workout',
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

    const handleDefaultOptionsOnPress = (optionTitle) => {
        closeModal()

        if (optionTitle == 'Share Program') {
            shareProgramOnPress(program)
        }
    }

    const handleCurrUserOptions = (optionTitle) => {
        closeModal()

        if (optionTitle == 'View Trainer Profile') {
            navigation.navigate('Profile', {
                userUUID: program.program_owner,
            })
        }

        if (optionTitle == 'Launch Live Workout') {
            navigation.navigate('LiveWorkout', {
                uuid: program.program_structure_uuid
            })
        }
    }

    const shareProgramOnPress = (program) => {
        navigation.push('ShareProgramModal', {
            programData: program,
            following: currUserData.following,
        })
    }
    
    const renderProgramOwnerOptions = () => {
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
            })
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
       })
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
   })
}

    return (
        <Modal presentationStyle="fullScreen" animated={true} animationType="slide" style={styles.modal} visible={isVisible}>
                                               <Appbar.Header style={styles.appBar} theme={{
                    colors: {
                        primary: '#FFFFFF'
                    }
                }}>
                    <Appbar.Action onPress={closeModal} icon={() => <Feather1s thin={true} name="arrow-left" size={20} />} />
                    <Appbar.Content title="Program Options" titleStyle={{fontFamily: 'HelveticaNeue-Medium', fontSize: 15, fontWeight: '600'}} />
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
        elevation: 0
    }
})

export default ProgramOptionsModal;