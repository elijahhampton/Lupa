import React, { useState } from 'react';

import {
    View,
    StyleSheet,
    Dimensions,
    TextInput,
    Text,
} from 'react-native';

import {
    Appbar,
    Modal,
    Portal,
    Button
} from 'react-native-paper';

import FeatherIcon from 'react-native-vector-icons/Feather'
import ThinFeatherIcon from 'react-native-feather1s'
import { Constants } from 'react-native-unimodules';

function AddDescriptionModal({ isVisible, captureData, closeModal }) {
    const [description, setDescription] = useState("")

    const saveDescription = () => {
        captureData(description)
        closeDialogMethod()
    }

    return (
        <Portal>
                    <Modal visible={isVisible} contentContainerStyle={{width: '100%', height: Dimensions.get('window').height + Constants.statusBarHeight, backgroundColor: '#FFFFFF'}}>
                        <Appbar.Header style={{elevation: 3, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Appbar.Action icon={() => <ThinFeatherIcon  thin={true} name="arrow-left" size={20} />} onPress={closeModal} />
                            <Appbar.Content title="Add a description" />
                            <Button uppercase={false} mode="text" color="#23374d" onPress={saveDescription}>
                                Save
                            </Button>
                        </Appbar.Header>
                        <View style={{flex: 1}}>
                        <TextInput value={description} onChangeText={text => setDescription(text)} multiline mode="flat" placeholder="The purpose of this exercise is to..." label="Descriptions" theme={{
                        colors: {
                            primary: '#23374d'
                        }
                    }}/>
                        </View>
        </Modal>
        </Portal>
    )
}

export default AddDescriptionModal;