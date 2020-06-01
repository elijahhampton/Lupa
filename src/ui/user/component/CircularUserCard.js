import React, { useState } from 'react';

import {
    Modal,
    TouchableHighlight
} from 'react-native';

import {
    Avatar
} from 'react-native-elements';

import { withNavigation } from 'react-navigation';

import {
    Avatar as PaperAvatar
} from 'react-native-paper';

function CircularUserCard(props) {
    const getAvatar = () => {
        console.log(props.user.user_uuid)
        try {
            return <Avatar source={{uri: props.user.photo_url}} rounded size={60} containerStyle={{margin: 10}} avatarStyle={{borderWidth: 3, borderColor: '#616161', borderRadius: 50}} onPress={() => props.navigation.push('ProfileView', {
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

    return (
        <>
            {getAvatar()}
        </>
    )
}

export default withNavigation(CircularUserCard);