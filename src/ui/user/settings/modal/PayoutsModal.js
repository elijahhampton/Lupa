import React, { useState, useEffect, createRef } from 'react';

import {
    Modal,
    Text,
    View,
    StyleSheet,
    Linking,
    RefreshControl,
    Image,
    ScrollView,
    SafeAreaView,
    Dimensions,
} from 'react-native';

import {
    Header,
    Container,
    Left,
    Body,
    Right,
} from 'native-base';

import {
    IconButton,
    Title,
    Caption,
    Divider,
    List,
    Button,
    Snackbar,
    Switch,
    Banner,
    Appbar,
    Avatar,
    Surface,
    Paragraph
} from 'react-native-paper';


import axios from 'axios';

import { useSelector } from 'react-redux';
import LOG, { LOG_ERROR } from '../../../../common/Logger';

const PayoutsModal = ({ isVisible, closeModal }) => {
    const [availableBalance, setAvailableBalance] = useState(0);
    const [pendingBalance, setPendingBalance] = useState(0);

    const trainerAccountID = useSelector(state => {
        return state.Users.currUserData.stripe_metadata.account_id;
    })

    const FETCH_TRAINER_BALANCES_ENDPOINT = "https://us-central1-lupa-cd0e3.cloudfunctions.net/fetchTrainerBalancesEndpoint";

    useEffect(() => {
        fetchAccountBalance()
    }, [])

    const fetchAccountBalance = () => {
        axios({
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            url: FETCH_TRAINER_BALANCES_ENDPOINT,
            data: JSON.stringify({
                account_id: trainerAccountID
            })
        }).then(response => {
            LOG('PayoutsModal.js', 'Finished running axios request.');
            LOG('PayoutsModal.js', 'Available Balance: ' + response.data.availableBalance);
            LOG('PayoutsModal.js', 'Pending Balance: ' + response.data.pendingBalance);
            setAvailableBalance(response.data.availableBalance)
            setPendingBalance(response.data.pendingBalance);

        }).catch(error => {
            LOG_ERROR('PayoutsModal.js', 'Error running axios request.', error);
            setAvailableBalance(0);
            setPendingBalance(0);
        })
    }

    return (
        <Modal animationType="slide" presentationStyle="fullScreen" visible={isVisible}>
             <Appbar.Header statusBarHeight={false} style={{ backgroundColor: '#FFFFFF', elevation: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Appbar.BackAction size={20} onPress={closeModal} />
                <Appbar.Content title="Payouts" titleStyle={{alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 25}} />
            </Appbar.Header>
            <View style={styles.root}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{padding: 10}}>
                <Text style={{ fontFamily: 'Avenir-Heavy', fontSize: 16}}>
                    Available Earnings
                </Text>
                <Text style={{paddingVertical: 10, fontFamily: 'Avenir-Light', fontSize: 20}}>
                    ${availableBalance}
                </Text>
                </View>

                <View style={{padding: 10}}>
                <Text style={{ fontFamily: 'Avenir-Heavy', fontSize: 16}}>
                    Pending Earnings
                </Text>
                <Text style={{paddingVertical: 10, fontFamily: 'Avenir-Light', fontSize: 20}}>
                    ${pendingBalance}
                </Text>
                </View>
                </View>

                <Text style={styles.descriptionText}>
                     Payouts are issued on a weekly basis every tuesday.  You will only be sent the amount available from your payable earnings.
                </Text>

            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    descriptionText: {
        fontFamily: 'Avenir-Roman', color: '#aaaaaa', padding: 10
    },
})

export default PayoutsModal;

