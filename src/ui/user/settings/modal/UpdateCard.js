import React, { createRef, useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Dimensions,
    Modal,
} from 'react-native';

import {
    Appbar,
    Button,
    TextInput
} from 'react-native-paper';

import { useSelector } from 'react-redux';

import Feather1s from 'react-native-feather1s/src/Feather1s';
import LupaColor from '../../../common/LupaColor';
import { createStripeCustomerAccount, createTokenFromCard, initStripe } from '../../../../modules/payments/stripe';
import { LOG_ERROR } from '../../../../common/Logger';
import FullScreenLoadingIndicator from '../../../common/FullScreenLoadingIndicator';
import { getLupaStoreState } from '../../../../controller/redux/index'
function UpdateCard({ closeModal, isVisible }) {
    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    });

    const cardNumberInput = createRef();
    const expMonthInputRef = createRef();
    const expYearInputRef = createRef();
    const cvcInputRef = createRef();

    const [cardNumber, setCardNumber] = useState("");
    const [cardNumberInputFocused, setCardNumberInputFocused] = useState("");

    const [expMonth, setExpMonth] = useState("");
    const [expMonthInputFocused, setExpMonthInputFocused] = useState("");
    
    const [expYear, setExpYear] = useState("");
    const [expYearInputFocused, setExpYearInputFocused] = useState("");

    const [cvc, setCvc] = useState("");
    const [cvcInputFocused, setCvcInputFocused] = useState("");

    const [fullScreenIndicatorIsVisible, setFullScreenIndicatorVisible] = useState(false)

    const handleUpdateCard = () => {
        setFullScreenIndicatorVisible(true)
        try {
            initStripe();

            const params = {
                // mandatory
                number: cardNumber,
                expMonth: Number(expMonth),
                expYear: Number(expYear),
                cvc: cvc,
                currency: 'usd',
                object: 'card',
                name: currUserData.display_name
              }

              const updatedUserData = getLupaStoreState().Users.currUserData;
              console.log(updatedUserData.stripe_metadata.stripe_id)
              console.log('UTUTUTUTUTTU')
              const cardLastFour = cardNumber.substring(cardNumber.length - 4, cardNumber.length - 1);
    
              //TODO: REFRESH STRIPE ID IN REDUX
            createTokenFromCard(params, updatedUserData.stripe_metadata.stripe_id, cardLastFour)
        } catch(error) {
            LOG_ERROR('UpdateCard.js', 'Caught unhandled exception in createTokenFromCard', error)
            setFullScreenIndicatorVisible();
            closeModal();
        }

        closeModal();
        setFullScreenIndicatorVisible(false)
    }

    return (
        <Modal presentationStyle="fullScreen" visible={isVisible} animated={true} animationType="slide">
            <View style={styles.container}>
                <Appbar.Header style={{ backgroundColor: '#FFFFFF', elevation: 0, }}>
                    <Appbar.Action onPress={closeModal} icon={() => <Feather1s thin={true} name="x" size={20} />} />
                    <Appbar.Content title="Update Card" titleStyle={{ alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 20 }} />
                </Appbar.Header>
                <ScrollView contentContainerStyle={{ alignItems: 'flex-start', paddingHorizontal: 10 }}>
                <TextInput 
                    ref={cardNumberInput} 
                    mode="outlined" 
                    onFocus={() => setCardNumberInputFocused(true)} 
                    onBlur={() => setCardNumberInputFocused(false)} 
                    value={cardNumber} 
                    onChangeText={text => setCardNumber(text)} 
                    label="Card Number" 
                    placeholder="Enter your card number" 
                    placeholderTextColor="#212121" 
                    style={[styles.textInput, {  width: Dimensions.get('window').width - 20, height: 45, borderBottomColor: cardNumberInputFocused ? "#1089ff" : "#212121",}]} 
                    keyboardType="default" 
                    keyboardAppearance="light" 
                    returnKeyLabel="done" 
                    returnKeyType="done" 
                    theme={{ roundness: 3, colors: { primary: 'rgb(30,136,229)' } }} 
                    />

                    <View style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start', width: '100%'}}>
                    <TextInput 
                    ref={expMonthInputRef} 
                    mode="outlined" 
                    onFocus={() => setExpMonthInputFocused(true)} 
                    onBlur={() => setExpMonthInputFocused(false)} 
                    value={expMonth} 
                    onChangeText={text => setExpMonth(text)} 
                    label="Exp. Month" 
                    placeholder="Exp. Month" 
                    placeholderTextColor="#212121" 
                    style={[styles.textInput, { width: Dimensions.get('window').width / 3.2, height: 45, borderBottomColor: cardNumberInputFocused ? "#1089ff" : "#212121",}]} 
                    keyboardType="default" 
                    keyboardAppearance="light" 
                    returnKeyLabel="done" 
                    returnKeyType="done" 
                    theme={{ roundness: 3, colors: { primary: 'rgb(30,136,229)' } }} 
                    />

<TextInput 
                    ref={expYearInputRef} 
                    mode="outlined" 
                    onFocus={() => setExpYearInputFocused(true)} 
                    onBlur={() => setExpYearInputFocused(false)} 
                    value={expYear} 
                    onChangeText={text => setExpYear(text)} 
                    label="Exp. Year" 
                    placeholder="Exp.Year" 
                    placeholderTextColor="#212121" 
                    style={[styles.textInput, {  width: Dimensions.get('window').width / 3.2, height: 45, borderBottomColor: cardNumberInputFocused ? "#1089ff" : "#212121",}]} 
                    keyboardType="default" 
                    keyboardAppearance="light" 
                    returnKeyLabel="done" 
                    returnKeyType="done" 
                    theme={{ roundness: 3, colors: { primary: 'rgb(30,136,229)' } }} 
                    />
                    </View>

                    <TextInput 
                    ref={cvcInputRef} 
                    mode="outlined" 
                    onFocus={() => setCvcInputFocused(true)} 
                    onBlur={() => setCvcInputFocused(false)} 
                    value={cvc} 
                    onChangeText={text => setCvc(text)} 
                    label="Cvc" 
                    placeholder="Cvc" 
                    placeholderTextColor="#212121" 
                    style={[styles.textInput, {  width: Dimensions.get('window').width / 3.2, height: 45, borderBottomColor: cardNumberInputFocused ? "#1089ff" : "#212121",}]} 
                    keyboardType="default" 
                    keyboardAppearance="light" 
                    returnKeyLabel="done" 
                    returnKeyType="done" 
                    theme={{ roundness: 3, colors: { primary: 'rgb(30,136,229)' } }} 
                    />

                    <Button onPress={handleUpdateCard} uppercase={false} color="#1089ff" mode="contained" style={{marginVertical: 20, height: 45, alignItems: 'center', justifyContent: 'center'}}>
                        Update Card
                    </Button>
                </ScrollView>
            </View>
            <FullScreenLoadingIndicator isVisible={fullScreenIndicatorIsVisible} />
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LupaColor.WHITE,

    },
    textInput: {
        margin: 3,
        alignSelf: 'flex-start',
        marginVertical: 10,
        fontSize: 13,
        fontFamily: 'Avenir-Light',
      },
})

export default UpdateCard;