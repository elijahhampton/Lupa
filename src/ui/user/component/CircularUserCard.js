import React, { useState } from 'react';

import {
    Modal,
    TouchableHighlight
} from 'react-native';

import {
    Avatar
} from 'react-native-elements';

import ModalProfileView from '../profile/ModalProfileView';
import {
    Avatar as PaperAvatar
} from 'react-native-paper';

function CircularUserCard(props) {
    const getAvatar = () => {
        try {
            return <Avatar source={{uri: props.user.photo_url}} rounded size={60} containerStyle={{margin: 10}} avatarStyle={{borderWidth: 3, borderColor: '#616161', borderRadius: 50}} onPress={() => showUserProfile(true)}/>
        } catch(error) {
            return <PaperAvatar.Text label="UU" size={60} color="#212121" />
        }
    } 

    return (
        <>
            {getAvatar()}
      {/*  <ModalProfileView isVisible={userProfileVisible} uuid={'acbKf0TQnmcYPJaKoZq501qlZWI2'} closeModalMethod={() => showUserProfile(false)} /> */}
        </>
    )
}

export default CircularUserCard;