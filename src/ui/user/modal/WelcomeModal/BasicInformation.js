import React from 'react';

import {
    View,
    StyleSheet,
    Text,
    Picker,
    Dimensions,
    TouchableHighlightBase
} from 'react-native';


import { Input, Avatar } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';

import LupaController from '../../../../controller/lupa/LupaController';

import { connect } from 'react-redux';

import { getUpdateCurrentUserAttributeActionPayload } from '../../../../controller/redux/payload_utility';

const mapStateToProps = (state) => {
    return {
        lupa_data: state,
    }
} 

const mapDispatchToProps = dispatch => {
    return {
      updateCurrentUserAttribute: (payload) => {
        dispatch({
          type: 'UPDATE_CURRENT_USER_ATTRIBUTE',
          payload: payload
        })
      },
    }
  }

class BasicInformation extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            firstName: '',
            lastName: '',
            gender: " ",
            photoSource: undefined,
        }
    }

    componentDidMount() {
       
    }


    _getAvatar = () => {
        let avatar = <Avatar quality={0} showEditButton rounded size={120} source={{ uri: this.state.photoSource}} onPress={this._chooseProfilePictureFromCameraRoll}/>
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
                this.setState({ photoSource: result.uri });
            }
        } catch(error)
        {
            alert(error);
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

    _handleGenderUpdate = genderIn => {
        this.setState({ gender: genderIn })
        this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('gender', genderIn);
    }

    render() {
        return (
            <View style={styles.root}>
                <View style={styles.instructionalTextContainer}>
                    <Text style={styles.instructionalText}>
                         You're almost there!
                    </Text>
                </View>

                <View style={styles.userInput}>
                    {
                       <Avatar showEditButton rounded size={150} source={{uri: this.state.photoSource}} onPress={this._chooseProfilePictureFromCameraRoll}/>
                    }
                </View>
                

                
                <View style={styles.pickerContainer}>
                    <Picker
                        placeholder="Select One"
                        placeholderStyle={{ color: "#2874F0" }}
                        note={false}
                        selectedValue={this.state.gender}
                        onValueChange={value => this._handleGenderUpdate(value)}
                        style={{ width: Dimensions.get('screen').width, height: 10 }}
                    >
                        <Picker.Item label=" " value=" " />
                        <Picker.Item label="Select a gender" value=" " />
                        <Picker.Item label="Male" value="male" />
                        <Picker.Item label="Female" value="female" />
                    </Picker>
                </View>

                

            </View>

        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        flexShrink: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-evenly",
        padding: 10,
    },
    generalText: {
        fontSize: 30,
        fontWeight: "400",
        color: "#9E9E9E",
        alignSelf: 'center',
    },
    instructionalTextContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
    },
    instructionalText: {
        flexShrink: 1,
        fontSize: 25,
        fontFamily: "avenir-roman",
    },
    userInput: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    pickerContainer: {
        flex: 1,
    },
    inputContainerStyle: {
        margin: 5,
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(BasicInformation);