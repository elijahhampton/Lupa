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

import LupaController from '../../../../../controller/lupa/LupaController';
import { _requestCameraAndCameraRollPermsisionsAsync } from '../../../../../controller/lupa/permissions/permissions';

export default class BasicInformation extends React.Component {
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
            _requestCameraAndCameraRollPermsisionsAsync();

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

    _handleUserPhotoUrlUpdate = photoURI => {
        this.LUPA_CONTROLLER_INSTANCE.saveUserProfileImage(photoURI);
        //this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('photo_url', photoURI.uri);
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
        fontWeight: "200"
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