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
} from 'react-native-paper';

import { Input, Avatar } from 'react-native-elements';

import { DatePicker } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';

import * as ImagePicker from 'expo-image-picker';

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
        await Location.getCurrentPositionAsync({ enableHighAccuracy: true }).then(res => {
            result = res;
        })
        console.log('BBB' + result)
        await this.setState({
            location: JSON.stringify(result)
        })
    }

    _getAvatar = () => {
        let avatar = <Avatar showEditButton rounded size={120} />
        return avatar;
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
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
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
        fontSize: 22,
        fontWeight: "600"
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