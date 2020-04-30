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
    TextInput,
    ActivityIndicator,
    Caption,
    Headline
} from 'react-native-paper';

import { Button, Avatar, Input } from 'react-native-elements';

import * as ImagePicker from 'expo-image-picker';

import * as Location from 'expo-location';


import _requestPermissionsAsync from '../../../../controller/lupa/permissions/permissions';

import Feather from 'react-native-vector-icons/Feather';
import getLocationFromCoordinates from '../../../../modules/location/mapquest/mapquest';

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

//Activity Indicator to show while fetching location data
const ActivityIndicatorModal = (props) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
                <Modal presentationStyle="overFullScreen" style={styles.activityIndicatorModal} visible={props.isVisible}>
                    <ActivityIndicator style={{alignSelf: "center"}} animating={isLoading} hidesWhenStopped={false} size='large' color="#2196F3" />
                </Modal>
    );
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

    _handleUsernameOnChangeText = text => {
        this.setState({ chosenUsername: text })
    }

    _handleDisplayNameEndEditing = async () => {
        const display_name = await this.state.displayName;
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

    _handleUsernameEndEditing = () => {
        this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('username', this.state.chosenUsername);
    }

    checkDisplayNameInputText = () => {
        const currDisplayName = this.state.displayName;

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

            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1
            });

           //Update field photo_url field
            this._handleUserPhotoUrlUpdate(result.uri);
    
            if (!result.cancelled) {
                this.setState({ 
                    photoSource: result.uri,
                    avatarSet: true,
                });
            }
        } catch(error)
        {
            this.setState({
                avatar: false
            })
        }
    }

    _handleUserPhotoUrlUpdate = async (photoURI) => {
        let firebasePhotoURL;

        await this.LUPA_CONTROLLER_INSTANCE.saveUserProfileImage(photoURI).then(result => {
            firebasePhotoURL = result;
        });

        await this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('photo_url', firebasePhotoURL);

        const reduxPayload = await getUpdateCurrentUserAttributeActionPayload('photo_url', firebasePhotoURL);
        await this.props.updateCurrentUserAttribute(reduxPayload);
    }


    render() {
        this.state.displayNameSet == true && this.state.displayNameIsInvalid == true && this.state.avatarSet == true ? this.enableNext() : this.disableNext()
        return (
                <SafeAreaView style={{flex: 1}}>

                    <View style={{flex: 1, alignItems: "center", justifyContent: 'space-evenly'}}>
                    <View>
                    {
                       <Avatar showEditButton rounded size={100} source={{uri: this.state.photoSource}} onPress={this._chooseProfilePictureFromCameraRoll}/>
                    }
                    </View>
                    </View>

                    <View style={{flex: 1}}>
                    <Headline style={{padding: 5}}>
        What should we call you?
    </Headline>
    <Input 
        placeholder="Enter your first and last name" 
        onChangeText={text => this._handleDisplayNameOnChangeText(text)} 
        onSubmitEditing={text => this._handleDisplayNameEndEditing()}
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
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(BasicInformation);