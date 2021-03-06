

import React, { useState, useEffect } from 'react';

import {
    Modal,
    Text,
    View,
    StyleSheet,
    TouchableHighlight,
    SafeAreaView,
    ScrollView,
    Dimensions
} from 'react-native';

import {
    Header,
    Container,
    Left,
    Body,
    Right,
} from 'native-base';

import {
    Button,
    IconButton,
    Title,
    TextInput,
    Caption,
    Divider,
    List,
    Switch,
    Appbar,
} from 'react-native-paper';

 

import { useDispatch, useSelector} from 'react-redux';

import LupaController from '../../../../../controller/lupa/LupaController'
import { getUpdateCurrentUserAttributeActionPayload } from '../../../../../controller/redux/payload_utility';
import Feather1s from 'react-native-feather1s/src/Feather1s';

function EditBioModal(props) {
    //lupa controller instance
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    //redux dispatch hook
    const dispatch = useDispatch();

    //user bio from useSelector redux hook
    const currUserBio = useSelector(state => {
        return state.Users.currUserData.bio
    })

    //bio and setbio function from useState
    const [bioText, setBioText] = useState('');

    //use effect hook
    useEffect(() => {
        setBioText(currUserBio)
    }, []) 

    /**
     * 
     */
    const handleCloseModal = async () => {
        LUPA_CONTROLLER_INSTANCE.updateCurrentUser('bio', bioText, "");

        const PAYLOAD = getUpdateCurrentUserAttributeActionPayload('bio', bioText)

        await dispatch({ type: 'UPDATE_CURRENT_USER_ATTRIBUTE', payload: PAYLOAD });

        props.closeModalMethod();
    }


    return (
    <Modal presentationStyle="fullScreen" animated={true} animationType="slide" visible={props.isVisible} style={{backgroundColor: 'white'}}>
       <SafeAreaView style={{flex: 1}}>
        <Appbar.Header style={{backgroundColor: '#FFFFFF', elevation: 0, alignItems: 'center'}}>
            <Appbar.BackAction onPress={() => props.closeModalMethod()}/>
            <Appbar.Content title="Biography" titleStyle={{alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 25}} />
            <Button theme={{colors: {
                primary: 'rgb(33,150,243)'
            }}}
            onPress={handleCloseModal}>
                <Text>
                    Save
                </Text>
            </Button>
        </Appbar.Header>
       <View style={{padding: 10}}>
       <Text style={{fontFamily: 'Avenir-Medium', fontSize: 18}}>
            Why are you using Lupa?
        </Text>
       </View>


        <View style={{flex: 1}}>
        <TextInput maxLength={180} value={bioText} onChangeText={text => setBioText(text)} multiline placeholder="Edit your biography" style={{width: Dimensions.get('window').width - 20, height: '30%', alignSelf: 'center'}} mode="outlined" theme={{
            colors: {
                primary: 'rgb(33,150,243)'
            }
        }}>

</TextInput>
        </View>
        </SafeAreaView>
    </Modal>
    )
}

export default EditBioModal;