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
    TouchableOpacity,
} from 'react-native';
 
import {
    Headline,
    TextInput,
    Surface,
} from 'react-native-paper';

import { Avatar, Input } from 'react-native-elements';

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
            trainingStyles: []
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

    handleOnPickTrainingStyle = async (style) => {
        if (typeof(style) == 'undefined') {
            return;
        }

        let updatedTrainingStyleList = this.state.trainingStyles;
        if (updatedTrainingStyleList.includes(style)) {
            updatedTrainingStyleList.splice(updatedTrainingStyleList.indexOf(style), 1);
        } else {
            updatedTrainingStyleList.push(style);
        }

        await this.setState({ trainingStyles: updatedTrainingStyleList }, () => {
            const reduxPayload = getUpdateCurrentUserAttributeActionPayload('training_styles', this.state.trainingStyles);
            this.props.updateCurrentUserAttribute(reduxPayload)
        })

        let trainer_metadata;
        this.LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(this.props.lupa_data.Users.currUserData.user_uuid, 'trainer_metadata').then((data) => {
            trainer_metadata = data;
            trainer_metadata.trainer_styles = this.state.trainingStyles;
            this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('trainer_metadata', trainer_metadata);
        });
    } 


    render() {
       this.state.displayNameSet == true && this.state.displayNameIsInvalid == true && this.state.avatarSet == true && this.state.trainingStyles.length > 0 == true ? this.enableNext() : this.disableNext()
        return (
                <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
                    <View style={{ marginVertical: 20}}>
                    <View 
                        style={{
                            paddingHorizontal: 20,
                            width: '100%', 
                            flexDirection: 'row', 
                            alignItems: 'center', 
                            justifyContent: 'space-evenly'
                        }}>
                          <Avatar 
                        rounded 
                        icon={{
                            type: 'feather',
                            name: 'user',
                            size: 18
                        }} 
                        showEditButton={true} 
                        onPress={this._chooseProfilePictureFromCameraRoll} 
                        source={{ uri: this.state.photoSource }} 
                        size={60} /> 

                        <Text style={{width: '80%', paddingHorizontal: 15, fontFamily: 'Avenir-Heavy'}}>
                            Start by adding a profile picture and telling us your name.
                        </Text>
                        </View>

                        <Input 
    placeholder="What is your full name?" 
        onChangeText={text => this._handleDisplayNameOnChangeText(text)} 
        onSubmitEditing={text => this._handleDisplayNameEndEditing(text)}
        value={this.state.displayName}
        returnKeyType="done"
        editable={true}
        keyboardType="default"
        keyboardAppearance="light"
        returnKeyLabel="done"
        containerStyle={{borderRadius: 12, backgroundColor: '#EEEEEE', alignSelf: 'center', width: Dimensions.get('window').width - 20, marginVertical: 20}}
        inputContainerStyle={{borderWidth: 0, borderBottomWidth: 0}}
        inputStyle={{fontSize: 15, fontFamily: 'Avenir-Medium'}}
    />
                        </View>

                        <View style={{flex: 1,  justifyContent: 'space-evenly', alignItems: 'center'}}>
                            <Text style={{fontFamily: 'Avenir-Heavy', fontSize: 18}}>
                                Choose your desired training styles
                            </Text>

                            <TouchableOpacity onPress={() => this.handleOnPickTrainingStyle('In Home')}>
                            <View style={[styles.baseContainerStyle, this.state.trainingStyles.includes('In Home') ? styles.selectedContainerStyle : styles.unselectedContainerStyle]}>
                                <Text style={[styles.baseTextStyle, this.state.trainingStyles.includes('In Home') ? styles.selectedTextStyle : styles.unselectedTextStyle]}>
                                    In Home
                                </Text>
                                <Text style={[styles.baseSubTextStyle, this.state.trainingStyles.includes('In Home') ? styles.selectedTextStyle : styles.unselectedTextStyle]}>
                                    Host training sessions at your home.
                                </Text>
                            </View>
                            </TouchableOpacity>
                            
                            <TouchableOpacity onPress={() => this.handleOnPickTrainingStyle('In Studio')}>
                            <View style={[styles.baseContainerStyle, this.state.trainingStyles.includes('In Studio') ? styles.selectedContainerStyle : styles.unselectedContainerStyle]}>
                            <Text style={[styles.baseTextStyle, this.state.trainingStyles.includes('In Studio') ? styles.selectedTextStyle : styles.unselectedTextStyle]}>
                                    In Studio
                                </Text>
                                <Text style={[styles.baseSubTextStyle, this.state.trainingStyles.includes('In Studio') ? styles.selectedTextStyle : styles.unselectedTextStyle]}>
                                    Host training sessions in a studio.
                                </Text>
                            </View>
                            </TouchableOpacity>


                            <TouchableOpacity onPress={() => this.handleOnPickTrainingStyle('Virtual')}>
                            <View style={[styles.baseContainerStyle, this.state.trainingStyles.includes('Virtual') ? styles.selectedContainerStyle : styles.unselectedContainerStyle]}>
                            <Text style={[styles.baseTextStyle, this.state.trainingStyles.includes('Virtual') ? styles.selectedTextStyle : styles.unselectedTextStyle]}>
                                    Virtual
                                </Text>
                                <Text style={[styles.baseSubTextStyle, this.state.trainingStyles.includes('Virtual') ? styles.selectedTextStyle : styles.unselectedTextStyle]}>
                                    Host training sessions remotely.
                                </Text>
                            </View>
                            </TouchableOpacity>


                            <TouchableOpacity onPress={() => this.handleOnPickTrainingStyle('Outdoor')}>
                            <View style={[styles.baseContainerStyle, this.state.trainingStyles.includes('Outdoor')  ? styles.selectedContainerStyle : styles.unselectedContainerStyle]}>
                            <Text style={[styles.baseTextStyle, this.state.trainingStyles.includes('Outdoor') ? styles.selectedTextStyle : styles.unselectedTextStyle]}>
                                    Outdoor
                                </Text>
                                <Text style={[styles.baseSubTextStyle, this.state.trainingStyles.includes('Outdoor') ? styles.selectedTextStyle : styles.unselectedTextStyle]}>
                                    Host training sessions at an outdoor venue.
                                </Text>
                            </View>
                            </TouchableOpacity>
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
        flex: 1,
    },
    baseContainerStyle: {
        padding: 20, 
        width: Dimensions.get('window').width - 20, 
        borderWidth: 1, 
        borderColor: '#EEEEEE',
        borderRadius: 12,
    },
    selectedContainerStyle: {
        backgroundColor: '#1089ff', 
    },
    unselectedContainerStyle: {
        backgroundColor: 'white',
    },
    baseTextStyle: {
        fontFamily: 'Avenir-Heavy',
        fontSize: 15
    },
    selectedTextStyle: {
        color: 'white',
    },
    unselectedTextStyle: {
        color: 'black',
    },
    baseSubTextStyle: {
        fontFamily: 'Avenir-Medium',
        fontSize: 13
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(BasicInformation);