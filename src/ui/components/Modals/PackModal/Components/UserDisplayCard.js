import React, { useState } from 'react';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';

import {
    Surface, Avatar
} from 'react-native-paper';

import LupaController from '../../../../../controller/lupa/LupaController';

import UserProfileModal from '../../../DrawerViews/Profile/UserProfileModal';

import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode'

export default class UserDisplayCard extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            showUserProfileModal: false,
            userUUID: this.props.userUUID,
            userImage: '',
            userDisplayName: '',
        }
    }

    componentDidMount = async () => {
      let userImageIn, userDisplayNameIn;

        await this.LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(this.state.userUUID, 'display_name').then(result => {
            userDisplayNameIn = result;
        })

        await this.LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(this.state.userUUID, 'photo_url').then(result => {
            userImageIn = result;
        })

        await this.setState({
            userImage: userImageIn,
            userDisplayName: userDisplayNameIn,
        })
    }

    
    handleCloseUserModal = () => {
        this.setState({ showUserProfileModal: false })
    }

    _navigateToUserProfile = () => {
        
    }

    render() {
        return (
            <TouchableOpacity onPress={() => this.setState({ showUserProfileModal: true })}>
                <Avatar.Image source={{uri: this.state.userImage}} />
</TouchableOpacity>
        )
    }
}

const styles = {

}