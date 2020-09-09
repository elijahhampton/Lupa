import React, { createRef, useEffect, useState} from 'react'

import {
    View,
    Text,
    InputAccessoryView,
    StyleSheet,
    Modal,
    Image,
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

import { Video } from 'expo-av'

import { useSelector } from 'react-redux'
import FeatherIcon from 'react-native-vector-icons/Feather';
import ThinFeatherIcon from 'react-native-feather1s'
import { Constants } from 'react-native-unimodules'
import ImagePicker from 'react-native-image-picker'
import { useNavigation } from '@react-navigation/native';
import LupaController from '../../../../controller/lupa/LupaController';
import { getLupaVlogStructure } from '../../../../model/data_structures/vlog';

function CreateNewPost(props) {
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const navigation = useNavigation();

    const currUserUUID = useSelector(state => {
        return state.Users.currUserData.user_uuid;
    })
    
    const [postText, setPostText] = useState("");
    const [postMediaURI, setPostMediaURI] = useState("");
    const [postMediaType, setPostMediaType] = useState("");
    const [addedPostMedia, setAddedPostMedia] = useState(false)
    const postTextInputRef = createRef();
    const [ready, setReady] = useState(false)

    const handleCaptureNewMediaURI = (uri, mediaType) => {
        if (typeof(uri) == 'undefined' || uri == null) {
            return null;
        }
        setPostMediaURI(uri);
        setPostMediaType(mediaType);

        setAddedPostMedia(true)
    }

    const handleAddVideo = () => {
        navigation.push('LupaCamera', {
            captureURI: handleCaptureNewMediaURI,
            mediaCaptureType: 'VIDEO',
            outlet: 'CreateNewPost',
        })
    }

    const handleAddImage = () => {
        navigation.push('LupaCamera', {
            captureURI: handleCaptureNewMediaURI,
            mediaCaptureType: 'IMAGE',
            outlet: 'CreateNewPost',
        })
    }

    const renderMedia = () => {
        if (typeof(postMediaURI) == 'undefined' || postMediaURI == null) {
            return (
                <View style={{flex: 1, backgroundColor: 'black'}} />
            )
        }

        switch (postMediaType) {
            case 'IMAGE':
                return <Image resizeMethod="scale" resizeMode="cover" source={{uri: postMediaURI}} style={{ width: '100%', height: '100%',  borderRadius: 19 }} />
            case 'VIDEO':
                return <Video resizeMode="cover"  source={{uri: postMediaURI}} style={{ width: '100%', height: '100%',  borderRadius: 19 }} loop={false} />
        }
    }

    const handleOpenCameraRoll = () => {
        ImagePicker.showImagePicker({
            allowsEditing: true,
            cancelButtonTitle: 'Cancel'
        }, async (response) => {
            if (!response.didCancel)
            {   
                handleCaptureNewMediaURI(response.uri, 'IMAGE')
            }
        });
    }

    const saveVlog = () => {
        const vlogStructure = getLupaVlogStructure(postText, postMediaURI, postMediaType, currUserUUID, new Date().getTime(), new Date());
        LUPA_CONTROLLER_INSTANCE.publishVlog(vlogStructure);
        handleClose();
    }

    const clearVlog = () => {
        setPostMediaURI("")
        setPostText("")
        setPostMediaType("")
    }

    const handleClose = () => {
        clearVlog();
        navigation.pop();
    }

    useEffect(() => {
        setReady(ready);

        if (ready) {
            postTextInputRef.current.focus();
        }
    }, [])
    return (
        <View style={{flex: 1}}>
            <View style={{flex: 1}}>
    <Appbar.Header  style={{backgroundColor: 'white'}}>
    <Appbar.Action onPress={handleClose}  style={{alignSelf: 'flex-start'}} icon={() => <ThinFeatherIcon name="arrow-left" size={20} />} />
    <Appbar.Content title="New Vlog" titleStyle={{alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 20}} />
    <Button uppercase={false} color="#1089ff">
        Post
    </Button>
    </Appbar.Header>

                <View style={{flex: 1, justifyContent: 'space-between', backgroundColor: 'white'}}>
                


                        <Surface style={{flex: 1, margin: 10, elevation: 0}}>
                           
  

                            <TextInput inputAccessoryViewID="textInputAccessory" keyboardType="twitter" multiline ref={postTextInputRef} value={postText} maxLength={220} onChangeText={text => setPostText(text)}   style={{fontSize: 20,lineHeight: 20, fontFamily: 'Avenir', alignSelf: 'center', width: '90%', }} placeholder="Share techniques and advice..." />
                            <InputAccessoryView nativeID={"textInputAccessory"}>
                            <View style={{padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
                            <ThinFeatherIcon style={{paddingHorizontal: 20}} name="video" size={20} onPress={handleAddVideo}/>
                            <ThinFeatherIcon style={{paddingHorizontal: 20}} name="aperture" size={20} onPress={handleOpenCameraRoll} />
                            </View>
                            </InputAccessoryView>
                            
                            {addedPostMedia === true ?
                            <Surface style={{backgroundColor: 'black', width: '90%', alignSelf: 'center', height: 250, borderRadius: 20}}>
                            {renderMedia()}
                            </Surface>
                            :
                            null
                            }
                            
                        </Surface>
                   

                    
                    

                </View>
                <View style={{flex: 1, backgroundColor: 'white'}} />
               
            </View>
            <FAB onPress={saveVlog} icon="check" style={{backgroundColor: '#1089ff', position: 'absolute', bottom: 0, right: 0, margin: 16}} />
           </View>
    )
}

export default CreateNewPost;