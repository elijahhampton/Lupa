import React, { useState } from 'react';

import {
    Modal,
    TouchableHighlight
} from 'react-native';

import {
    Avatar
} from 'react-native-elements';

import ModalProfileView from '../profile/ModalProfileView';

function CircularUserCard(props) {
    let [userProfileVisible, showUserProfile] = useState(false);
    let [userUUID, setUserUUID] = useState(props.userObject);

    return (
        <>
            <Avatar source={{uri: 'https://picsum.photos/200/300'}} rounded size={60} containerStyle={{margin: 10}} avatarStyle={{borderWidth: 3, borderColor: '#616161', borderRadius: 50}} onPress={() => showUserProfile(true)}/>
        <ModalProfileView isVisible={userProfileVisible} uuid={'acbKf0TQnmcYPJaKoZq501qlZWI2'} closeModalMethod={() => showUserProfile(false)} />
        </>
    )
}

export default CircularUserCard;