import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text, ScrollView
} from 'react-native';
import Feather1s from 'react-native-feather1s/src/Feather1s';

import {
    Appbar, Caption
} from 'react-native-paper';
import { useSelector } from 'react-redux';

import LupaColor from '../../common/LupaColor';
import UpdateCard from './modal/UpdateCard';

function PaymentSettings({ navigation, route }) {
    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    });

    const [updateCardModalVisible, setUpdateCardModalVisible] = useState(false);

    const renderCardInformation = () => {
        let ret = true;
        if (typeof(currUserData.stripe_metadata.card_last_four) == 'undefined' || typeof(currUserData.stripe_metadata.card_last_four) == "undefined") {
            return (
                <View style={{padding: 10, alignItems: 'flex-start'}}>
                    <Caption>
                        You have not added a card to receive payments.
                    </Caption>

                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <Caption style={{color: '#1089ff'}} onPress={() => setUpdateCardModalVisible(true)}>
                        Add Card
                    </Caption>
                    <Feather1s name="plus" color="#1089ff" />
                    </View>

                </View>
            )
        } else {
            return (
            <Text>
                One card on file with last four: {currUserData.stripe_metadata.card_last_four}
            </Text>
            )
        }
    }
    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: '#FFFFFF', elevation: 0,}}>
            <Appbar.Action onPress={() => navigation.pop()} icon={() => <Feather1s thin={true} name="arrow-left" size={20} />}/>
                <Appbar.Content title="Cards and Payments"  titleStyle={{alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 20}} />
</Appbar.Header> 
 
<ScrollView>
        {renderCardInformation()}
</ScrollView>
<UpdateCard isVisible={updateCardModalVisible} closeModal={() => setUpdateCardModalVisible(false)} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LupaColor.WHITE
    }
})

export default PaymentSettings;