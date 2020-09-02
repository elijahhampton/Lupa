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
    <Appbar.Header  style={{ height: Constants.statusBarHeight + 20, backgroundColor: 'white'}} statusBarHeight>
    <Appbar.Action onPress={handleClose}  style={{alignSelf: 'flex-start'}} icon={() => <ThinFeatherIcon name="arrow-left" size={20} />} />
    <Appbar.Content title="New Vlog" titleStyle={{fontFamily: 'Avenir-Heavy', paddingVertical: 3}} />
    </Appbar.Header>

                <View style={{flex: 1, justifyContent: 'space-between'}}>
                


                        <Surface style={{borderRadius: 8, borderWidth: 0.5, borderColor: '#E5E5E5', flex: 1, margin: 10, elevation: 0}}>
                            <View style={{padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                            <ThinFeatherIcon name="camera" size={20} onPress={handleAddImage}/>
                            <ThinFeatherIcon name="video" size={20} onPress={handleAddVideo}/>
                            <ThinFeatherIcon name="aperture" size={20} onPress={handleOpenCameraRoll} />
                           {/* <ThinFeatherIcon color="#1089ff" name="clipboard" size={20} />
                            <ThinFeatherIcon color="#1089ff" name="activity" size={20} />*/}
                            </View>
                            <Divider style={{marginHorizontal: 20}} />

                            <TextInput keyboardType="twitter" multiline ref={postTextInputRef} value={postText} maxLength={220} onChangeText={text => setPostText(text)}  style={{fontSize: 15,lineHeight: 20, fontFamily: 'Avenir', alignSelf: 'center', width: '90%', margin: 10}} placeholder="Share techniques and advice..." />
                            
                            
                            {addedPostMedia === true ?
                            <Surface style={{backgroundColor: 'black', width: '90%', alignSelf: 'center', height: 250, borderRadius: 20}}>
                            {renderMedia()}
                            </Surface>
                            :
                            null
                            }
                            
                        </Surface>
                   

                    
                    

                </View>
                <View style={{flex: 1}} />
               
            </View>
            <FAB onPress={saveVlog} icon="check" style={{backgroundColor: '#1089ff', position: 'absolute', bottom: 0, right: 0, margin: 20}} />
           </View>
    )
}

export default CreateNewPost;