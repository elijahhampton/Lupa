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

    componentDidMount = async () => {
      let userImageIn;
      
        await this.LUPA_CONTROLLER_INSTANCE.getUserProfileImageFromUUID(this.state.userUUID).then(result => {
            userImageIn = result;
        })

        await this.setState({
            userImage: userImageIn,
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
                <Avatar.Image source={{uri: this.state.userImage}} style={this.props.optionalStyling}/>
</TouchableOpacity>
        )
    }
}

const styles = {

}