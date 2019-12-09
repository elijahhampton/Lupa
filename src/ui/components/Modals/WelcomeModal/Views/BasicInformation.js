import React from 'react';

import {
    View,
    StyleSheet,
    Text,
    Picker,
    Dimensions,
    TouchableHighlightBase
} from 'react-native';

import {
    TextInput,
    Switch,
    Avatar
} from 'react-native-paper';

import { Input } from 'react-native-elements';

import { DatePicker } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';

import * as ImagePicker from 'expo-image-picker';
import LupaMapView from '../../LupaMapView';

import * as Location from 'expo-location';
import LupaController from '../../../../../controller/lupa/LupaController';

export default class BasicInformation extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            firstName: '',
            lastName: '',
            gender: " ",
            photoSource: undefined,
            location: undefined,
        }
    }

    componentWillMount() {
        this._getLocationAsync();
    }

    _getLocationAsync = async () => {
        console.log('location')
        let result;
        await Location.getCurrentPositionAsync({}).then(res => {
            result = res;
        })
        console.log('BBB' + result)
        await this.setState({
            location: JSON.stringify(result)
        })
    }

    _getAvatar = () => {
        console.log('here')
        let avatarWithText = (
            <TouchableOpacity onPress={this._chooseProfilePictureFromCameraRoll}>
            <Avatar.Text size={150} label="EH" />
        </TouchableOpacity>
        );

        let avatarWithPhoto = (
            <TouchableOpacity style={{backgroundColor: "transparent"}} onPress={this._chooseProfilePictureFromCameraRoll}>
            <Avatar.Image size={150} source={this.state.photoSource} />
        </TouchableOpacity>
        );

        if (this.state.photoSource == undefined) {
            return avatarWithText;
        }

        return avatarWithPhoto;
    }

    _chooseProfilePictureFromCameraRoll = async () => {
        console.log('hhere')
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

       //Update field photo_url field
        this._handleUserPhotoUrlUpdate(result);

        if (!result.cancelled) {
            this.setState({ photoSource: result.uri });
        }
    }

    _handleUserPhotoUrlUpdate = photoURI => {
        this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('photo_url', photoURI.uri);
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
                        Before we take you into the app we need a little information. 
                         Don't worry you can save most of it for later.
                    </Text>
                </View>

                <View style={styles.userInput}>
                    {
                        this._getAvatar()
                    }
                </View>

                <View>
                    <TouchableOpacity style={{flexDirection: "row", alignItems: "center"}}>
                    <Icon name="map-pin" size={15} style={{padding: 2}} />
                    <Text style={[styles.generalText, { color: '#2196F3'}]}>
                        Where are you located?
                    </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.pickerContainer}>
                    <Text style={styles.generalText}>
                        Gender
                    </Text>
                    <Picker
                        mode="dropdown"
                        placeholder="Select One"
                        placeholderStyle={{ color: "#2874F0" }}
                        note={false}
                        selectedValue={this.state.gender}
                        onValueChange={value => this._handleGenderUpdate(value)}
                        style={{ width: Dimensions.get('screen').width, height: 10 }}
                    >
                        <Picker.Item label=" " value=" " />
                        <Picker.Item label="Male" value="male" />
                        <Picker.Item label="Female" value="female" />
                    </Picker>
                </View>

                <LupaMapView isVisible={false} />

            </View>

        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-evenly",
        padding: 10,
    },
    generalText: {
        fontSize: 20,
        fontWeight: "400",
        color: "#9E9E9E"
    },
    instructionalTextContainer: {
        height: "20%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
    },
    instructionalText: {
        flexShrink: 1,
        fontSize: 20,
        fontWeight: "600"
    },
    userInput: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    pickerContainer: {
        height: "30%",
        width: "100%",
    },
    inputContainerStyle: {
        margin: 5,
    }
})