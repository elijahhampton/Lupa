import React, { useState } from 'react';

import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Modal,
    Button,
    SafeAreaView,
    KeyboardAvoidingView,
} from 'react-native';
 
import {
    Headline,
    TextInput,
    Surface,
    Avatar,
} from 'react-native-paper';

import FeatherIcon from 'react-native-vector-icons/Feather';
import ThinFeatherIcon from 'react-native-feather1s'

import ImagePicker from 'react-native-image-picker';

import _requestPermissionsAsync, { _checkCameraAndPhotoLibraryPermissions } from '../../../../controller/lupa/permissions/permissions';

import LupaController from '../../../../controller/lupa/LupaController';

import { getUpdateCurrentUserAttributeActionPayload } from '../../../../controller/redux/payload_utility'

import { connect } from 'react-redux';
import { LOG_ERROR } from '../../../../common/Logger';
import { Constants } from 'react-native-unimodules';

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
            gender: '',
            photoSource: '',
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
            this.setState({
                displayNameSet: true,
            })
        }

        await this.checkDisplayNameInputText();
    }

    checkDisplayNameInputText = () => {
        const currDisplayName = this.state.displayName.trim();



        this.setState({ displayNameIsInvalid: true })
    }

    _getAvatar = () => {
        let avatar = <Avatar quality={0} showEditButton rounded size={50} source={{ uri: this.state.photoSource}} onPress={this._chooseProfilePictureFromCameraRoll}/>
        return avatar;
    }

    _chooseProfilePictureFromCameraRoll = async () => {
       try {

        ImagePicker.showImagePicker({
            allowsEditing: true
        }, async (response) => {
            if (!response.didCancel)
            {
                await this.setState({ 
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
         
            LOG_ERROR('BasicInformation.js', 'Unhandled exception in _chooseProfilePictureFromCameraRoll()', error);

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
               LOG_ERROR('BasicInformation.js', 'Unhandled exception in _handleUserPhotoUrlUpdate', error);
        }

    }


    render() {
       this.state.displayNameSet == true && this.state.displayNameIsInvalid == true && this.state.avatarSet == true ? this.enableNext() : this.disableNext()
        return (
            <KeyboardAvoidingView style={{flex: 1}}>
                <SafeAreaView style={[styles.flexFull, { }]}>
    
                   
    <View>
    <Text style={{ fontFamily: 'Avenir-Medium', textAlign: 'center', fontSize: 25, marginVertical: Constants.statusBarHeight}} >
       Add your display name and choose an avatar.
    </Text>
                        </View>

    <View>
                    <View style={{alignItems: 'center', marginVertical: 20}}>
                        <View>
                        {this.state.photoSource == '' ? <Avatar.Icon icon={() => <ThinFeatherIcon name="user" size={80} />} size={150} style={{backgroundColor: '#EEEEEE'}} /> : <Avatar.Image source={{uri: this.state.photoSource}} size={150} />    } 
                        <Button title="Choose an avatar" onPress={this._chooseProfilePictureFromCameraRoll}/>
                        </View>
       
                    </View>

                    <TextInput 
                    style={{marginVertical: 30}}
    mode='outlined' 
    theme={{ 
        colors: {
            accent: '#1089ff',
            primary: '#1089ff',
            surface: '#1089ff',
            backdrop: '#1089ff'
        }
    }}
    placeholder="Ex. John Smith or Alice Walker" 
        onChangeText={text => this._handleDisplayNameOnChangeText(text)} 
        onSubmitEditing={text => this._handleDisplayNameEndEditing(text)}
        value={this.state.displayName}
        returnKeyType="done"
        editable={true}
        keyboardType="default"
        keyboardAppearance="light"
        returnKeyLabel="done"
    />
                    </View>

    

    



            </SafeAreaView>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flexFull: {
        flex: 1,
        marginHorizontal: 20,

    }
})
export default connect(mapStateToProps, mapDispatchToProps)(BasicInformation);