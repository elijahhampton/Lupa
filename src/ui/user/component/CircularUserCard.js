import React, { useState } from 'react';

import {
    View,
    Image,
    Dimensions,
    Text,
    TouchableWithoutFeedback,
} from 'react-native';

import {
    Avatar,
    Surface,
    Chip,
    Caption,
    Button,
    Paragraph,
} from 'react-native-paper';

import FeatherIcon from 'react-native-vector-icons/Feather'

import { useNavigation } from '@react-navigation/native';

const { windowWidth } = Dimensions.get('window').width

function CircularUserCard({ user }) {
    const navigation = useNavigation()

    const navigateToProfile = () => {
        navigation.push('Profile', {
            userUUID: user.user_uuid,
        })
    }

    const getAvatar = () => {
        try {
            return  <Avatar.Image source={{uri: user.photo_url}} rounded size={65} />
        } catch(error) {
            return <Avatar.Text label="UU" size={45} color="#212121"  />
        }
    } 

    const renderUserDisplayName = () => {
        try {
            let name = user.display_name.split()[0]
            return name;
        } catch(error) {
            return user.display_name
        }
    }

    return (
        <TouchableWithoutFeedback key={user.user_uuid} style={{width: windowWidth}} onPress={navigateToProfile}>
            <View style={{alignItems: 'center', margin: 10}}>
                        {getAvatar()}
                        <Text style={{fontSize: 13, paddingVertical: 5, fontFamily: 'HelveticaNeue-Light'}}>
                            {user.display_name}
                        </Text>
                    </View>
        </TouchableWithoutFeedback>
    )
    
}

export default CircularUserCard