import React, { useState } from 'react';

import {
    View,
    Text,
    StyleSheet,
    Picker,
    Dimensions,
    Modal,
    SafeAreaView,
} from 'react-native';

import {
    Headline
} from 'react-native-paper';

import { Avatar, Input } from 'react-native-elements';

import ImagePicker from 'react-native-image-picker';

import _requestPermissionsAsync, { _checkCameraAndPhotoLibraryPermissions } from '../../../../controller/lupa/permissions/permissions';

import LupaController from '../../../../controller/lupa/LupaController';

import { getUpdateCurrentUserAttributeActionPayload } from '../../../../controller/redux/payload_utility'

import { connect } from 'react-redux';

mapStateToProps = (state) => {
    return { 
      lupa_data: state
    }
  }
  
  mapDispatchToProps = dispatch => {
    return {
      updateCurrentUserAttribute: (payload) => {
          dispatch({
              type: "UPDATE_CURRENT_USER_ATTRIBUTE",
              payload: payload
          })
      }
    }
  }

class BasicInformation extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            chosenUsername: "",
            displayName: "",
            maketrainerAccount: false,
            isForwardPageChange: this.props.isForwardPageChange,
            location: '',
            locationText: 'Where are you located?',
         //   setHomeGymText: "Set a Home Gym",
            locationDataSet: false,
            showLoadingIndicator: false,
            displayNameIsInvalid: false,
            showMapView: false,
            surroundingGymLocations: [],
            firstName: '',
            lastName: '',
            gender: " ",
            photoSource: undefined,
            showLoadingIndicator: false,
            displayNameSet: false,
            avatarSet: false,
        }
    }

    componentDidMount = async () => {
       await this.disableNext();
       await _checkCameraAndPhotoLibraryPermissions()
    }

    enableNext = () => {
        this.props.setNextDisabled(false);
    }

    disableNext = () => {
        this.props.setNextDisabled(true);
    }


    _handleTrainerAccountUpdate = () => {
        this.setState({ makeTrainerAccount: !this.state.makeTrainerAccount });
        this.LUPA_CONTROLLER_INSTANCE.updateUser('isTrainer', this.state.maketrainerAccount);
    }

    _handleDisplayNameOnChangeText = text => {
        this.setState({ displayName: text })
    }

    _handleDisplayNameEndEditing = async () => {
        const display_name = await this.state.displayName.trim();
        const payload = await getUpdateCurrentUserAttributeActionPayload('display_name', display_name, []);
        await this.props.updateCurrentUserAttribute(payload);

        await this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('display_name', this.state.displayName);

        if (this.state.displayName.length >= 1)
        {
            await this.setState({
                displayNameSet: true,
            })
        }

        await this.checkDisplayNameInputText();
    }

    checkDisplayNameInputText = () => {
        const currDisplayName = this.state.displayName.trim();

        try {
            let displayNameParts = currDisplayName.split(" ");
            let length = displayNameParts.length;

            if (length != 2)
            {
                this.setState({ displayNameIsInvalid: false })
                return;
            }
        } catch (err)
        {
            this.setState({ displayNameIsInvalid: false })
            return;
        }

        this.setState({ displayNameIsInvalid: true })
    }

    _getAvatar = () => {
        let avatar = <Avatar quality={0} showEditButton rounded size={50} source={{ uri: this.state.photoSource}} onPress={this._chooseProfilePictureFromCameraRoll}/>
        return avatar;
    }

    _chooseProfilePictureFromCameraRoll = async () => {
       try {

        ImagePicker.showImagePicker({}, (response) => {
            if (!response.didCancel)
            {
                this.setState({ 
                    photoSource: response.uri,
                    avatarSet: true,
                });

            //Update field photo_url field
            this._handleUserPhotoUrlUpdate(response.uri);
            }
            else if (response.error)
            {
          
            }
        });

        } catch(error)
        {
         
            console.log(error)
            this.setState({
                avatarSet: false
            })
        }
    }

    _handleUserPhotoUrlUpdate = async (photoURI) => {
        try {
            let firebasePhotoURL;

            await this.LUPA_CONTROLLER_INSTANCE.saveUserProfileImage(photoURI).then(result => {
                firebasePhotoURL = result;
            });
    
            const reduxPayload = await getUpdateCurrentUserAttributeActionPayload('photo_url', firebasePhotoURL);
            await this.props.updateCurrentUserAttribute(reduxPayload);
    
            this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('photo_url', firebasePhotoURL);
        } catch(err) {
          
        }

    }


    render() {
       this.state.displayNameSet == true && this.state.displayNameIsInvalid == true && this.state.avatarSet == true ? this.enableNext() : this.disableNext()
        return (
                <SafeAreaView style={styles.flexFull}>

                    <View style={[styles.flexFull, {alignItems: "center", justifyContent: 'space-evenly'}]}>
                    <View>
                    {   
                       <Avatar showEditButton rounded size={100} source={{uri: this.state.photoSource}} onPress={this._chooseProfilePictureFromCameraRoll}/>
                    }
                    </View>
                    </View>

                    <View style={styles.flexFull}>
                    <Headline style={{padding: 5}}>
        What should we call you?
    </Headline>
    <Input 
        placeholder="Enter your first and last name" 
        onChangeText={text => this._handleDisplayNameOnChangeText(text)} 
        onSubmitEditing={text => this._handleDisplayNameEndEditing(text)}
        value={this.state.displayName}
        returnKeyType="done"
        editable={true}
        />
                    </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flexFull: {
        flex: 1
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(BasicInformation);