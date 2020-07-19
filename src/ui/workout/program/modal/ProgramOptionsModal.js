import React from 'react'

import {
    Modal,
    View,
    Text,
    StyleSheet,
    SafeAreaView,
} from 'react-native'

function ProgramOptionsModal(props) {
    return (
        <Modal presentationStyle="fullScreen" animated={true} animationType="slide" style={styles.modal} visible={false}>
            <SafeAreaView style={styles.container}>

            </SafeAreaView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    }
})

export default ProgramOptionsModal;