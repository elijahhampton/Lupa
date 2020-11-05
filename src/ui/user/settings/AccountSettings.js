import React, { useState } from 'react';

import {
    View,
    StyleSheet,
    Text,
    SafeAreaView,
    TextInput,
} from 'react-native';
import { Appbar, Button, Divider, } from 'react-native-paper';
import { ListItem } from 'react-native-elements';

import FeatherIcon from 'react-native-vector-icons/Feather'
import { useSelector } from 'react-redux/lib/hooks/useSelector';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import { useDispatch } from 'react-redux';
import { UPDATE_CURRENT_USER_ACTION_PAYLOAD } from '../../../controller/redux/payload_utility';
import LupaController from '../../../controller/lupa/LupaController';

function AccountSettings({ navigation, route }) {
    const currUserData = useSelector(state => {
        return state.Users.currUserData
    })
    
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const dispatch = useDispatch();

    const [displayName, setDisplayName] = useState(currUserData.display_name);
    const [email, setEmail] = useState(currUserData.email)

    /**
     * Saves account settings
     * TODO: Make this save conditionally.  No need to rewrite data to the database with values that
     * haven't changed.
     */
    const handleOnSave = () => {
        LUPA_CONTROLLER_INSTANCE.updateCurrentUser('display_name', displayName.trim());
        LUPA_CONTROLLER_INSTANCE.updateCurrentUser('email', email.trim());

        const displayNamePayload = getUpdateCurrentUserAttributeActionPayload('display_name', display_name, []);
        const emailPayload = getUpdateCurrentUserAttributeActionPayload('email', email, []);
        
        dispatch({ type: 'UPDATE_CURRENT_USER_ATTRIBUTE', payload: displayNamePayload })
        dispatch({ type: UPDATE_CURRENT_USER_ATTRIBUTE, payload: emailPayload })
    }

    return (
        <SafeAreaView style={styles.container}>
             <Appbar.Header style={{ backgroundColor: 'white', elevation: 0 }}>
                <Appbar.Action onPress={() => navigation.pop()} icon={() => <Feather1s name="arrow-left" size={20} />} />
                <Appbar.Content title="Account Settings" titleStyle={{ alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 20 }} />
                <Button color="#1089ff" onPress={handleOnSave}>
                    Save
                </Button>
        </Appbar.Header>

           <View style={{height: 30, marginVertical: 8, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
               <View style={{flex: 2}}>
               <Text style={{color: 'black', fontSize: 16, fontWeight: '400'}}>
                   Display Name
               </Text>
               </View>
             
               <View style={{justifyContent: 'flex-start',  flex: 3}}>
                <TextInput value={displayName} returnKeyLabel="done" returnKeyType="done" style={{fontSize: 15, fontWeight: '400', color: 'rgb(142, 142, 147)'}} placeholderTextColor="rgb(142, 142, 147)" placeholder={displayName} />
               </View>
           </View>
            <Divider />
           <View style={{height: 30, marginVertical: 8, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
               <View style={{flex: 2}}>
               <Text style={{color: 'black', fontSize: 16, fontWeight: '400'}}>
                   Email
               </Text>
               </View>
             
               <View style={{justifyContent: 'flex-start',  flex: 3}}>
                <TextInput value={email} returnKeyLabel="done" returnKeyType="done" style={{fontSize: 15, fontWeight: '400', color: 'rgb(142, 142, 147)'}} placeholderTextColor="rgb(142, 142, 147)" placeholder={email} />
               </View>
           </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    titleStyle: {
        fontSize: 13, 
        fontWeight: '600', 
        color: '#212121',
    },
    listItemTitleStyle: {
        color: 'rgb(99, 99, 102)',
        padding: 10
    },
})

export default AccountSettings;