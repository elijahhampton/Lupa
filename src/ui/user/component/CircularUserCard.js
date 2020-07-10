import React, { useState } from 'react';

import {
    View,
    Image,
} from 'react-native';

import {
    Avatar
} from 'react-native-elements';

import {
    Avatar as PaperAvatar,
    Surface,
} from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';

function CircularUserCard(props) {
    const getAvatar = () => {
        try {
            return <Avatar source={{uri: props.user.photo_url}} rounded size={60} containerStyle={{margin: 10}} avatarStyle={{borderRadius: 50}} onPress={() => props.navigation.push('ProfileView', {
                navFrom: 'Packs',
                userUUID: props.user.user_uuid,
            })}/>
        } catch(error) {
            return <PaperAvatar.Text label="UU" size={60} color="#212121" onPress={() => props.navigation.push('ProfileView', {
                navFrom: 'Packs',
                userUUID: props.user.user_uuid,
            })} />
        }
    } 

    const getUserDisplay = () => {
        try {
            return (
                <TouchableOpacity onPress={() => props.navigation.push('ProfileView', {
                    navFrom: 'Packs',
                    userUUID: props.user.user_uuid,
                })}>
                                    <Surface style={{borderWidth: 1, borderColor: 'rgb(199, 199, 204)', width: 100, height: 100, borderRadius: 8, margin: 5, }}>
                    <Image style={{width: 100, height: 100, borderRadius: 8}} source={{uri: props.user.photo_url}} />
                </Surface>
                </TouchableOpacity>
            )
        } catch(error) {
            return (
                <Surface style={{borderWidth: 1, borderColor: 'rgb(199, 199, 204)', width: 100, height: 100, borderRadius: 8, margin: 5, }}>
                    <Image style={{width: '100%', height: '100%', borderRadius: 8}} source={{uri: props.user.photo_url}} />
                </Surface>
            )
        }
    }

    return (
        <View>
            {getAvatar()}
        </View>
    )
}

export default CircularUserCard;