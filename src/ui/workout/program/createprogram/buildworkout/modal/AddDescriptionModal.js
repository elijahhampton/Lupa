import React, { useState } from 'react';

import {
    View,
    StyleSheet,
    Dimensions,
    Modal,
    TextInput,
    Text,
} from 'react-native';

import {
    Appbar
} from 'react-native-paper';

import FeatherIcon from 'react-native-vector-icons/Feather'

function AddDescriptionModal({ isVisible, captureData, closeModal }) {
    const [description, setDescription] = useState("")

    const saveDescription = () => {
        captureData(description)
        closeDialogMethod()
    }

    return (
                    <Modal visible={isVisible} presentationStyle="fullScreen">
                        <Appbar.Header style={{elevation: 3, backgroundColor: '#FFFFFF'}}>
                            <Appbar.Action icon={() => <FeatherIcon name="arrow-left" />} onPress={closeModal} />
                            <Appbar.Content title="Add a description" />
                        </Appbar.Header>
                        <View style={{flex: 1}}>
                        <TextInput value={description} onChangeText={text => setDescription(text)} multiline mode="flat" placeholder="The purpose of this exercise is to..." label="Descriptions" theme={{
                        colors: {
                            primary: '#23374d'
                        }
                    }}/>
                        </View>
        </Modal>
    )
}

export default AddDescriptionModal;