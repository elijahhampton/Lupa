import React, { useState } from 'react'

import {
    Modal,
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Dimensions,
    TouchableWithoutFeedback
} from 'react-native'

import { Divider, Appbar } from 'react-native-paper'

import {
    Header,
    Left,
    Right,
    Body,
    Title,
} from 'native-base'

import { useSelector } from 'react-redux'

import { useNavigation } from '@react-navigation/native'

import FeatherIcon from 'react-native-vector-icons/Feather'

import ShareProgramModal from '../modal/ShareProgramModal'

const TRAINER_OPTIONS = [
   /* {
        optionTitle: 'Pause Program'
    },*/
    {
        optionTitle: 'Edit Program',
    },
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
    {
        optionTitle: 'View Profile'
    },
]

const { windowWidth } = Dimensions.get('window').width

function ProgramOptionsModal({ program, isVisible, closeModal }) {
    const [shareProgramModalIsVisible, setShareProgramModalIsVisible] = useState(false)

    const currUserData = useSelector(state => {
        return state.Users.currUserData
    })

    const navigation = useNavigation()

    const handleDefaultOptionsOnPress = (optionTitle) => {
        closeModal()

        if (optionTitle == 'Share Program') {
            shareProgramOnPress(program)
        }
    }

    const navigateToProfile = () => {
        navigation.navigate('Profile', {
            profileUUID: program.program_owner,
        })
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
                    <TouchableWithoutFeedback onPress={() => handleDefaultOptionsOnPress(option.optionTitle)}>
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
                    <TouchableWithoutFeedback onPress={() => handleDefaultOptionsOnPress(option.optionTitle)}>
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
                                               <Appbar.Header style={{elevation: 0}} theme={{
                    colors: {
                        primary: '#FFFFFF'
                    }
                }}>
                    <Appbar.BackAction onPress={closeModal} />
                    <Appbar.Content title="Program Options" />
                </Appbar.Header>
            <View style={styles.container}>
                {
                    renderDefaultOptions()
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
    }
})

export default ProgramOptionsModal;