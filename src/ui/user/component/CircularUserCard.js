import React, { useState } from 'react';

import {
    View,
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

    return (
        <View>
            {getAvatar()}
           {/* <View style={{position: 'absolute', bottom: 0, right: 0, margin: 12, width: 15, height: 15, backgroundColor: 'rgba(129,199,132 ,1)', borderRadius: 20}} /> */}
        </View>
    )
}

export default withNavigation(CircularUserCard);