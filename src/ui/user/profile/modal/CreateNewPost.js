import React, { createRef, useEffect, useState } from 'react'

import {
    View,
    Text,
    InputAccessoryView,
    StyleSheet,
    Modal,
    Image,
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

function CreateNewPost({ route, navigation }) {
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

    const [titleText, setTitleText] = useState("")
    const [postText, setPostText] = useState("");
    const [postMediaURI, setPostMediaURI] = useState("");
    const [postMediaType, setPostMediaType] = useState("");
    const [addedPostMedia, setAddedPostMedia] = useState(false)
    const postTextInputRef = createRef();
    const titleTextInputRef = createRef();
    const [ready, setReady] = useState(false)

    const handleCaptureNewMediaURI = (uri, mediaType) => {
        if (typeof (uri) == 'undefined' || uri == null) {
            return null;
        }
        setPostMediaURI(uri);
        setPostMediaType(mediaType);

        setAddedPostMedia(true)
    }

    const handleAddVideo = () => {
        titleTextInputRef.current.blur();
        postTextInputRef.current.blur();
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
        if (typeof (postMediaURI) == 'undefined' || postMediaURI == null) {
            return (
                <View style={{ flex: 1, backgroundColor: 'black' }} />
            )
        }

        switch (postMediaType) {
            case 'IMAGE':
                return <Image resizeMethod="scale" resizeMode="cover" source={{ uri: postMediaURI }} style={{ width: '100%', height: '100%', borderRadius: 0 }} />
            case 'VIDEO':
                return <Video resizeMode="cover" source={{ uri: postMediaURI }} style={{ width: '100%', height: '100%', borderRadius: 0 }} loop={false} />
        }
    }

    const handleOpenCameraRoll = () => {
        titleTextInputRef.current.blur();
        postTextInputRef.current.blur();
        ImagePicker.showImagePicker({
            allowsEditing: true,
            cancelButtonTitle: 'Cancel'
        }, async (response) => {
            if (!response.didCancel) {
                handleCaptureNewMediaURI(response.uri, 'IMAGE')
            }
        });
    }

    const saveVlog = () => {
                //Get a vlog structure
                const vlogStructure = getLupaVlogStructure(titleText, postText, postMediaURI, postMediaType, currUserData.user_uuid, currUserData.location.longitude, currUserData.location.latitude, currUserData.location.city, currUserData.location.state, currUserData.location.country, new Date().getTime(), new Date());

        if (route.params) {
            if (typeof(route.params['vlogType'])) {
                if (route.params.vlogType == 'Community') {
                    LUPA_CONTROLLER_INSTANCE.publishCommunityVlog(route.params.communityUID, vlogStructure);
                    handleClose();
                    return;
                }
            }
        }
    

        //save vlog to firestore
        LUPA_CONTROLLER_INSTANCE.publishVlog(vlogStructure);

        //handleClose
        handleClose();
    }

    const clearVlog = () => {
        setPostMediaURI("")
        setPostText("")
        setPostMediaType("")
    }

    const handleClose = () => {
        clearVlog();
        navigation.goBack();
    }

    useEffect(() => {
        setReady(ready);

        if (ready) {
            titleTextInputRef.current.focus();
        }
    }, [])
    return (
        <View style={{ flex: 1, backgroundColor: '#EEEEEE' }}>
            <Appbar.Header style={{ backgroundColor: 'white', elevation: 0 }}>
                <Appbar.Action onPress={handleClose} style={{ alignSelf: 'flex-start' }} icon={() => <ThinFeatherIcon name="arrow-left" size={20} />} />
                <Appbar.Content title="New Vlog" titleStyle={{alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 25}} />
                <Button mode="contained" theme={{ roundness: 5 }} uppercase={false} color="#1089ff" onPress={saveVlog}>
                    Post
    </Button>
            </Appbar.Header>

            <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: 'white', paddingTop: Constants.statusBarHeight }}>

                <View style={{ flex: 1, elevation: 0 }}>
                    <TextInput keyboardType="default" returnKeyLabel="done" returnKeyType="done" ref={titleTextInputRef} value={titleText} maxLength={30} onChangeText={text => setTitleText(text)} style={{ marginVertical: 10, fontSize: 25, fontFamily: 'Avenir', alignSelf: 'center', width: '90%', }} placeholder="Title..." placeholderTextColor="#212121" />
                    <TextInput inputAccessoryViewID="textInputAccessory" keyboardType="default" returnKeyLabel="done" returnKeyType="done" multiline ref={postTextInputRef} value={postText} maxLength={220} onChangeText={text => setPostText(text)} style={{ marginVertical: 20, fontSize: 18, fontFamily: 'Avenir', alignSelf: 'center', width: '90%', }} placeholder="Share techniques and advice..." placeholderTextColor="#212121" />
                    <InputAccessoryView nativeID={"textInputAccessory"}>
                        <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <ThinFeatherIcon style={{ paddingHorizontal: 20 }} name="video" size={20} onPress={handleAddVideo} />
                            <ThinFeatherIcon style={{ paddingHorizontal: 20 }} name="aperture" size={20} onPress={handleOpenCameraRoll} />
                        </View>
                    </InputAccessoryView>

                    {addedPostMedia === true ?
                        <View style={{ backgroundColor: 'black', width: '90%', alignSelf: 'center', height: 250, borderRadius: 3 }}>
                            {renderMedia()}
                        </View>
                        :
                        null
                    }
                </View>
            </View>
        </View>
    )
}

export default CreateNewPost;