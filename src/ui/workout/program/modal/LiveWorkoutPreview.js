import React, { useEffect } from 'react'

import {
    StyleSheet,
    View,
    Text,
    Modal,
    SafeAreaView
} from 'react-native'

import { Chip, Appbar, ActivityIndicator} from 'react-native-paper'
import { Constants } from 'react-native-unimodules'

function LiveWorkoutPreview({ program, isVisible, closeModal }) {
    return (
        <Modal style={styles.container} visible={isVisible} presentationStyle="fullScreen" animated={true} animationType="fade">
            <Appbar.Header style={styles.appbar}>
                <Appbar.BackAction color="#FFFFFF" onPress={closeModal} />
            </Appbar.Header>
            <SafeAreaView style={styles.container}>
                <View style={styles.mediaContent}>
                <ActivityIndicator animating={true} color="#FFFFFF" size="large" />
                </View>

                <Chip mode="flat" style={styles.chip} textStyle={styles.chipTextStyle}>
                    Learn More about 6 Week Resistance
                </Chip>
            </SafeAreaView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    appbar: {
        backgroundColor: '#212121'
    },
    container: {
        flex: 1,
        backgroundColor: '#212121'
    },
    mediaContent: {
        flex: 1,
        backgroundColor: '#212121',
        alignItems: 'center',
        justifyContent: 'center'
    },
    chip: {
        elevation: 10,
        position: 'absolute',
        bottom: Constants.statusBarHeight + 20,
        alignSelf: 'center',
        backgroundColor: '#1089ff'
    },
    chipTextStyle: {
        color: '#FFFFFF',
        fontWeight: 'bold'
    }
})

export default LiveWorkoutPreview