import React, { createRef, useEffect, useState} from 'react'

import {
    View,
    Text,
    InputAccessoryView,
    StyleSheet,
    TextInput,
    Modal,
    SafeAreaView,
} from 'react-native';

import {
    Button,
    FAB,
} from 'react-native-paper';

import FeatherIcon from 'react-native-vector-icons/Feather';
import ThinFeatherIcon from 'react-native-feather1s'

import ImagePicker from 'react-native-image-picker'

function CreateNewPost({ isVisible, closeModal, postType }) {
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
            <SafeAreaView style={{flex: 1}}>
                <View style={{width: '100%', paddingHorizontal: 20}}>
                    <ThinFeatherIcon onPress={closeModal} name="arrow-left" size={20} onPress={closeModal} />
                </View>

                <View style={{flex: 1, justifyContent: 'space-between'}}>
                <View style={{width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                    <FeatherIcon name="rss" color="#1089ff" size={20} />
                    <Text style={{fontFamily: 'Avenir-Heavy', paddingVertical: 3}}>
                        New vlog
                    </Text>
                    <Text style={{fontFamily: 'Avenir-Light', fontWeight: '600', paddingVertical: 3, color: 'rgb(102, 111, 120)'}}>
                        Share techniques or advice
                    </Text>
                </View>


                    <View style={{width: '100%'}}>
                    <TextInput inputAccessoryViewID='Testing' ref={postTextInputRef} value={postText} onChangeText={text => setPostText(text)} style={{alignSelf: 'center'}} placeholder="While squatting try this..." />
                    </View>
                    
                    

                </View>
                <InputAccessoryView nativeID='Testing' style={{width: '100%', justifyContent: 'space-evenly', flexDirection: 'row'}}>
           
                        
                  
                <ThinFeatherIcon color="#1089ff" name="video" size={20} style={{marginBottom: 10, marginLeft: 10, alignSelf: 'flex-end'}} />
      </InputAccessoryView>
                <View style={{flex: 1}} />
               
            </SafeAreaView>

            <FAB icon="check" style={{backgroundColor: '#1089ff', position: 'absolute', bottom: 0, right: 0, margin: 12}} />
        </Modal>
    )
}

export default CreateNewPost;