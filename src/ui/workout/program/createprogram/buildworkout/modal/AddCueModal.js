import React, { useState } from 'react';

import {
    View,
    Text,
    Modal,
    Dimensions,
    StyleSheet,
    TextInput,
} from 'react-native';

import {
    Button,
    Divider,
    Dialog,
    Appbar,
} from 'react-native-paper';
import Feather1s from 'react-native-feather1s/src/Feather1s';


function AddCueModal({ captureData, closeModal, isVisible }) {
    const [cue, setCue] = useState("");

    const saveCue = () => {
        captureData(cue);
        closeModal();
    }

    return (
                    <Modal presentationStyle="fullScreen" visible={isVisible} theme={{
                        colors: {
                            primary: '#23374d'
                        }
                    }}>
                        <Appbar.Header style={{backgroundColor: '#FFFFFF', elevation: 3, justifyContent: 'space-between'}}>
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
            <Divider />
            <Dialog.Content style={{alignItems: 'center', padding: 20}}>
                <TextInput value={cue} onChangeText={text => setCue(text)} placeholder="Watch your back in this movement" style={{fontSize: 15, padding: 5, width: '100%', borderBottomWidth: 1.5}} />
            </Dialog.Content>
            <Dialog.Actions>
            </Dialog.Actions>
        </Modal>
    )
}

export default AddCueModal;