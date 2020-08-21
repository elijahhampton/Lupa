import React, { useState } from 'react';

import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    TextInput,
} from 'react-native';

import {
    Button,
    Divider,
    Dialog,
    Modal,
    Appbar,
    Portal,
} from 'react-native-paper';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import { Constants } from 'react-native-unimodules';


function AddCueModal({ captureData, closeModal, isVisible }) {
    const [cue, setCue] = useState("");

    const saveCue = () => {
        captureData(cue);
        closeModal();
    }

    return (
        <Portal>
                    <Modal visible={isVisible} theme={{
                        colors: {
                            primary: '#23374d'
                        }
                    }}
                    contentContainerStyle={{width: Dimensions.get('window').width, height: Dimensions.get('window').height + Constants.statusBarHeight, backgroundColor: '#FFFFFF'}}
                    >
                        <Appbar.Header style={{elevation: 3, backgroundColor: '#FFFFFF'}}>
                            <Appbar.Action onPress={closeModal} icon={() => <Feather1s name="arrow-left"  thin={true} size={20} />}/>
                            <Appbar.Content title="Add Cues"  />
                            <Button mode="text" theme={{
                        colors: {
                            primary: '#23374d'
                        }
                    }} onPress={saveCue}>
                    Save
                </Button>
                        </Appbar.Header>
            <View style={{flex: 1, padding: 20, backgroundColor: '#FFFFFF'}}>
                <TextInput value={cue} onChangeText={text => setCue(text)} placeholder="Watch your back in this movement" style={{fontSize: 15, padding: 5, width: '100%', borderBottomWidth: 1.5}} />
            </View>
        </Modal>
        </Portal>
    )
}

export default AddCueModal;