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

import LupaController from '../../../controller/lupa/LupaController';

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
    
    handleCloseUserModal = () => {
        this.setState({ showUserProfileModal: false })
    }

    _navigateToUserProfile = () => {
        
    }

    getUserAvatar = () => {
        if (this.state.userImage == "" || this.state.userImage == undefined)
        {
            return <Avatar.Text label="UU" color="white"  size={30} style={{backgroundColor: '#212121'}}/>
        }

        try {

            return <Avatar.Image size={30} source={{uri: this.state.userImage}} style={this.props.optionalStyling}/>
        }
        catch (err)
        {
           return <Avatar.Text label="UU"  color="white" size={30} style={{backgroundColor: '#212121'}}/>
        }
    }
    render() {
        return (
           <>
                {
                    this.getUserAvatar()
                }
        </>
        )
    }
}

const styles = {

}