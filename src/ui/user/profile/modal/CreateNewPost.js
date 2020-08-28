import React, { createRef, useEffect, useState} from 'react'

import {
    View,
    Text,
    InputAccessoryView,
    StyleSheet,
    Modal,
    SafeAreaView,
    TextInput,
} from 'react-native';

import {
    Button,
    FAB,
    Surface,
    Appbar,
    Divider,
} from 'react-native-paper';

import FeatherIcon from 'react-native-vector-icons/Feather';
import ThinFeatherIcon from 'react-native-feather1s'
import { Constants } from 'react-native-unimodules'
import ImagePicker from 'react-native-image-picker'
import { useNavigation } from '@react-navigation/native';

function CreateNewPost({ isVisible, closeModal, postType }) {
    const navigation = useNavigation();
    
    const [postText, setPostText] = useState("");
    const postTextInputRef = createRef();
    const [ready, setReady] = useState(false)

    const handleCaptureNewMediaURI = (uri, mediaType) => {
        if (typeof(uri) == 'undefined') {
            return null;
        }
    }

    const handleAddVideo = () => {

    }

    const handleAddImage = () => {

    }

    useEffect(() => {
        setReady(ready);

        if (ready) {
            postTextInputRef.current.focus();
        }
    }, [])
    return (
        <Modal presentationStyle="fullScreen" visible={isVisible} animated={true} animationType="slide">
            <View style={{flex: 1}}>
                {/*<View style={{width: '100%', paddingHorizontal: 20}}>
                    <ThinFeatherIcon onPress={closeModal} name="arrow-left" size={20} onPress={closeModal} />
    </View> */}

    <Appbar.Header  style={{ height: Constants.statusBarHeight + 20, backgroundColor: 'white'}} statusBarHeight>
    <Appbar.Action onPress={() => navigation.pop()} style={{alignSelf: 'flex-start'}} icon={() => <ThinFeatherIcon onPress={closeModal} name="arrow-left" size={20} onPress={closeModal} />} />
    <Appbar.Content title="New Vlog" titleStyle={{fontFamily: 'Avenir-Heavy', paddingVertical: 3}} />
    </Appbar.Header>

                <View style={{flex: 1, justifyContent: 'space-between'}}>
                


                        <Surface style={{borderRadius: 8, flex: 1, margin: 10, elevation: 8}}>
                            <View style={{padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                            <ThinFeatherIcon color="#1089ff" name="video" size={20} />
                            <ThinFeatherIcon color="#1089ff" name="image" size={20} />
                            <ThinFeatherIcon color="#1089ff" name="clipboard" size={20} />
                            <ThinFeatherIcon color="#1089ff" name="activity" size={20} />
                            </View>
                            <Divider style={{marginHorizontal: 20}} />

                            <TextInput  multiline ref={postTextInputRef} value={postText} onChangeText={text => setPostText(text)}  style={{fontSize: 15, fontFamily: 'HelveticaNeue', alignSelf: 'center', width: '90%', margin: 10}} placeholder="Share techniques and advice..." />
                        </Surface>
                   

                    
                    

                </View>
                <View style={{flex: 1}} />
               
            </View>

            <FAB icon="check" style={{backgroundColor: '#1089ff', position: 'absolute', bottom: 0, right: 0, margin: 20}} />
        </Modal>
    )
}

export default CreateNewPost;