import React, { useState } from 'react'

import {
    View,
    Text,
    StyleSheet,
    Modal,
    SafeAreaView,
} from 'react-native';

import {
    Appbar,
    Caption,
    Button,
} from 'react-native-paper';

import { Input } from 'react-native-elements';
import LupaController from '../../../../controller/lupa/LupaController'

function ChangeHourlyRateModal({ isVisible, closeModal }) {
    const [newHourlyRate, setHourlyRate] = useState(0.00)
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance()

    const handleCloseModal = () => {
        LUPA_CONTROLLER_INSTANCE.changeTrainerHourlyRate(newHourlyRate);
        closeModal()
    }

    return (
        <Modal presentationStyle="fullScreen" visible={isVisible} animationType="slide" animated={true}>
                <Appbar.Header style={{ backgroundColor: '#FFFFFF', elevation: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: 'rgb(199, 199, 204)', borderBottomWidth: 0.8 }}>
                   <Appbar.BackAction onPress={closeModal} />
                   <Appbar.Content title="Change Rate" />
                </Appbar.Header>
            <View style={{flex: 1, justifyContent: 'space-between'}}>
                <View >

                <View style={{backgroundColor: '#E5E5E5'}}>
                <Caption style={{padding: 10, color: '', alignItems: 'center', textAlign: 'center', fontFamily: 'HelveticaNeue', fontSize: 13, fontWeight: '400',}}>
                    Your hourly payment rate is used when you meet with clients on on one for an in person sessions.  
                </Caption>
                </View>

                <Input 
                    keyboardAppearance="light" 
                    keyboardType="numeric" 
                    placeholder="Ex. $20.00"
                    inputStyle={{fontSize: 15}}
                    returnKeyLabel="done" 
                    returnKeyType="done" 
                    onChangeText={(text) => {setHourlyRate(text)}} 
                    value={newHourlyRate} 
                    containerStyle={{marginHorizontal: 10, marginVertical: 15, borderWidth: 0.5, borderRadius: 10, width: '30%'}} 
                    inputContainerStyle={{borderWidth: 0, borderBottomWidth: 0}} />

                </View>

                <View style={{padding: 10}}>
                <Caption style={{paddingVertical: 10}}>
                    Note: Your rate is public and can be seen when users view your profile.
                </Caption>
                <Button onPress={handleCloseModal} uppercase={false} mode="contained" style={{height: 55,padding: 10, paddingHorizontal: 50, alignItems: 'center', justifyContent: 'center'}} color="#1089ff">
                        Change Rate
                </Button>
                </View>
            </View>
            <SafeAreaView />
        </Modal>
    )
}

const styles = StyleSheet.create({

})

export default ChangeHourlyRateModal;