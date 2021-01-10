import React from 'react';

import {
    View,
    Text,
    Modal,
    SafeAreaView,
    StyleSheet
} from 'react-native';

const ProgramPreview = ({ isVisible, closeModal, program }) => {
    return (
        <Modal presentationStyle="fullScreen">
            <SafeAreaView style={styles.container}>

            </SafeAreaView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export default ProgramPreview;