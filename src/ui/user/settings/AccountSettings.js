import React from 'react';

import {
    View,
    StyleSheet,
    Text
} from 'react-native';

import FeatherIcon from 'react-native-vector-icons/Feather'
import { useSelector } from 'react-redux/lib/hooks/useSelector';

const OPTIONS = [
    'Display Name',
    'Username',
    'Email'
]

function AccountSettings(prop) {
    const currUserData = useSelector(state => {
        return state.Users.currUserData
    })

    const handleListItemOnPress = (option) => {
        switch(option) {
            case 'Display Name':

                break;
            case 'Username':
                break;
            case 'Email':
                break;
        }
    }

    return (
        <View style={styles.container}>
            {
                OPTIONS.map((option, index, arr) => {
                    return (
                        <ListItem title={option} bottomDivider rightIcon={() => <FeatherIcon name="arrow-right" size={20} onPress={() => handleListItemOnPress(option)} />}/>
                    )
                })
            }
           
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    }
})