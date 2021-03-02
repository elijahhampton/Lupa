import React from 'react';

import {
    View,
    StyleSheet,
    Text,
} from 'react-native';

import QRCode from 'react-native-qrcode-image';
import { WebView } from 'react-native-webview' // Add these
import { useSelector } from 'react-redux/lib/hooks/useSelector';


const TrainerQRCode = () => {
    const currUserData = useSelector(state => {
        return state.Users.currUserData
    });

    return (
        <View style={style.container}>
            <View style={style.textContainer}>
            <Text style={{fontFamily: 'Avenir-Black', fontSize: 18, padding: 10}}>
                Here is your QR Code!
            </Text>
            <Text style={{textAlign: 'center'}}>
                You can use this code to easily direct clients straight to your profile.
            </Text>
            </View>

<QRCode
value={currUserData.user_uuid}
size={250}
bgColor='#000000'
fgColor='#FFFFFF'/>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: 'white',
        padding: 20
    },
    textContainer: {
        alignItems: 'center',
        textAlign: 'center',
    }
})

export default TrainerQRCode;