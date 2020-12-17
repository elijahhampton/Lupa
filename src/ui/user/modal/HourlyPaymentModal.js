import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import { TextInput } from 'react-native';

import {
    View,
    Text,
    StyleSheet,
    Modal
} from 'react-native';

import {
    Appbar,
    Caption,
    Button
} from 'react-native-paper';

import FeatherIcon from 'react-native-vector-icons/Feather';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux/lib/hooks/useSelector';
import LupaController from '../../../controller/lupa/LupaController';
import { getLupaStoreState } from '../../../controller/redux';
import { UPDATE_CURRENT_USER_ATTRIBUTE_ACTION } from '../../../controller/redux/actionTypes';
import { getUpdateCurrentUserAttributeActionPayload } from '../../../controller/redux/payload_utility';

function HourlyPaymentModal({ isVisible, closeModal }) {
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    const dispatch = useDispatch();

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

    const handleSetHourlyPaymentRate = (text) => {
        if (text.length <= 1) {
            setHourlyPaymentRate('$')
            return;
        }

        setHourlyPaymentRate(text);
    }

    const handleOnSave = () => {
        const updatedHourlyPaymentRate = hourlyPaymentRate.replace('$','');
        LUPA_CONTROLLER_INSTANCE.updateCurrentUser('hourly_payment_rate', updatedHourlyPaymentRate);

        const payload = getUpdateCurrentUserAttributeActionPayload('hourly_payment_Rate', updatedHourlyPaymentRate);
        dispatch({ type: UPDATE_CURRENT_USER_ATTRIBUTE_ACTION, payload: payload });
    }

    const navigation = useNavigation();
    const [hourlyPaymentRate, setHourlyPaymentRate] = useState(currUserData.hourly_payment_rate)
    return (
                <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
                <Appbar.Header style={{backgroundColor: 'white', elevation: 0, borderBottomWidth: 1, borderBottomColor: '#EEEEEE'}}>
                <Appbar.Action icon={() => <FeatherIcon name="arrow-left" size={20} style={{padding: 3}} />} onPress={() => navigation.pop()} />
                <Appbar.Content  title="Hourly Payment" titleStyle={{alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 26}} />
                <Button mode="text" color="#1089ff" compact onPress={handleOnSave}>
                    Save
                </Button>
                </Appbar.Header>
                <View style={{flex: 1, padding: 15}}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={{fontFamily: 'Avenir', fontSize: 16}}>
                        How much would you like to charge per hour?
                    </Text>
                    <TextInput 
                    value={hourlyPaymentRate} 
                    placeholder="$15" 
                    onChangeText={text => handleSetHourlyPaymentRate(text)}
                    style={{fontSize: 16, fontFamily: 'Avenir'}} />
                    </View>
                  
                    <Caption style={{marginVertical: 10}}>
                        Lupa starts all trainers at a default rate of $15/hr.
                    </Caption>
                   
                </View>
            </SafeAreaView>
            
    )
}

export default HourlyPaymentModal;