import React, { useState } from 'react';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';

import {
    Surface
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

    handleCloseUserModal = () => {
        this.setState({ showUserProfileModal: false })
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

    render() {
        return (
            <TouchableOpacity onPress={() => this.setState({ showUserProfileModal: true })}>
<Surface style={{elevation: 5, width: 100, height: 100, borderRadius: 20, margin: 5, alignItems: "center", flexDirection: 'column'}}>
<Image style={{width: "100%", height: "100%", borderRadius: 20}} source={this.state.userImage} resizeMethod="scale" resizeMode={ImageResizeMode.cover} />
                <Text>
                    {this.state.userDisplayName}
                </Text>
</Surface>
<UserProfileModal isOpen={this.state.showUserProfileModal} uuid={this.state.userUUID} closeModalMethod={this.handleCloseUserModal}/>
</TouchableOpacity>
        )
    }
}

const styles = {

}