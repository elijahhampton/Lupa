import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    SafeAreaView
} from 'react-native';
import { ListItem } from 'react-native-elements';
import { LUPA_AUTH } from '../../../../controller/firebase/firebase';
import { useSelector } from 'react-redux';

function AccountSettings(props) {
    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    });

    const handleResetPassword = () => {
        LUPA_AUTH.sendPasswordResetEmail(currUserData.email).then(function() {
            // Email sent.
          }).catch(function(error) {
            // An error happened.
          });
    }

    const handleSendVerificationEmail = () => {

    }

    const renderEmailVerificationText = () => {
        return LUPA_AUTH.currentUser.emailVerified === true ? 'Your email has been verified.' : 'Your email has not been verified'
    }

    return (
        <SafeAreaView style={styles.container}>
            <ListItem onPress={handleSendVerificationEmail} title='Verify Email' titleStyle={styles.titleStyle} description={renderEmailVerificationText()} bottomDivider/>
            <ListItem onPress={handleResetPassword} title='Reset Password' titleStyle={styles.titleStyle} description='Reset your password.' bottomDivider/>
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
        fontWeight: '400', 
        color: '#212121',
    },
})

export default AccountSettings;