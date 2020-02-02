import React, { useState } from 'react';

import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';

import {
    TextInput,
    Caption,
    Provider,
    Portal,
    Modal
} from 'react-native-paper';

import * as Location from 'expo-location';

import { Input } from 'react-native-elements';
import SafeAreaView from 'react-native-safe-area-view';
import { Feather as Icon } from '@expo/vector-icons';

import Color from '../../../../common/Color';

import getLocationFromCoordinates from '../../../../../modules/location/mapquest/mapquest.js';

import LupaController from '../../../../../controller/lupa/LupaController';

//Activity Indicator to show while fetching location data
const ActivityIndicatorModal = (props) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <Provider>
            <Portal>
                <Modal style={styles.activityIndicatorModal} visible={props.visible}>
                    <ActivityIndicator animating={isLoading} hidesWhenStopped={false} size='large' color={Color.LUPA_BLUE}/>
                </Modal>
            </Portal>
        </Provider>
    );
}

export default class ChooseUsername extends React.Component {
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
            locationDataSet: false,
            showLoadingIndicator: false,
        }
    }

    _handleTrainerAccountUpdate = () => {
        console.log('here')
        this.setState({ makeTrainerAccount: !this.state.makeTrainerAccount });
        this.LUPA_CONTROLLER_INSTANCE.updateUser('isTrainer', this.state.maketrainerAccount);
    }

    _handleDisplayNameOnChangeText = text => {
        this.setState({ displayName: text })
    }

    _handleUsernameOnChangeText = text => {
        this.setState({ chosenUsername: text })
    }

    _handleDisplayNameEndEditing = () => {
        this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('display_name', this.state.displayName);
    }

    _handleUsernameEndEditing = () => {
        this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('username', this.state.chosenUsername);
    }

    _getLocationAsync = async () => {
        let result;
        //show loading indicator
        this.setState({
            showLoadingIndicator: true,
        })

        //get users location data
        await Location.getCurrentPositionAsync({ enableHighAccuracy: true }).then(res => {
            result = res;
        })

        //set state
        await this.setState({
            location: result
        })

        //convert data into actual location
        const locationData = await getLocationFromCoordinates(this.state.location.coords.longitude, this.state.location.coords.latitude);
        const locationDataText = await locationData.city + ", " + locationData.state;

        //Update user location in database
        this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('location', locationData);

        //hide loading indicator
        await this.setState({
            locationText: locationDataText,
            locationDataSet: true,
            showLoadingIndicator: false
        });


    }

    render() {
        return (
            <View style={styles.root}>
                <SafeAreaView style={{flex: 1, padding: 10, justifyContent: 'space-evenly',}}>

                <View style={styles.instructionalTextContainer}>
                    <Text style={styles.instructionalText}>
                        Before we take you into the app we need a little information.  Don't worry you can finish most of it at a later time.
                    </Text>
                </View>

                <View style={{flex: 2, flexDirection: "column", alignItems: "center", justifyContent: 'space-around'}}>
                <TextInput 
                        style={styles.textInput} 
                        mode="outlined" 
                        label="Choose a username" 
                        theme={{colors: {primary: '#1976D2'}}} 
                        onChangeText={text => this._handleUsernameOnChangeText(text)}
                        onBlur={this._handleUsernameEndEditing}
                        value={this.state.chosenUsername}
                        />

                    <TextInput 
                        style={styles.textInput} 
                        mode="outlined" 
                        label="Enter a display name" 
                        theme={{colors: {primary: '#1976D2', backdrop: "red", accent: "red", surface: "red"}}} 
                        onChangeText={text => this._handleDisplayNameOnChangeText(text)}
                        onBlur={this._handleDisplayNameEndEditing}
                        value={this.state.displayName}
                        />  
                </View>

                
                <View style={{alignItems: 'center', justifyContent: "space-around", flex: 2}}>
                    <TouchableOpacity onPress={this._getLocationAsync} style={{flexDirection: "row", alignItems: "center"}}>
                    <Icon name="map-pin" size={20} style={{padding: 2}} />
                    <Text style={[styles.generalText, { color: '#2196F3'}]}>
                        {this.state.locationText}
                    </Text>
                    </TouchableOpacity>

                    <Caption>
                        We use your location to suggest trainers and others in your area as well as packs.  Read our Terms of Service and Privacy Policy for more information.
                    </Caption>
                </View>


               {/* <LupaMapView isVisible={false} /> */}
               <ActivityIndicatorModal visible={this.state.showLoadingIndicator}/>


                </SafeAreaView>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "white"
    },
    textInput: {
        width: "95%",
        margin: 5,
    },
    generalText: {
        fontSize: 20,
        fontWeight: "400",
        color: "#9E9E9E"
    },
    instructionalTextContainer: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    instructionalText: {
        flexShrink: 1,
        fontSize: 15,
        fontWeight: "500"
    },
    userInput: {
        height: "20%",
        width: "100%",

    },
    pickerContainer: {
        height: "30%",
        width: "100%",
    },
    inputContainerStyle: {
        margin: 5,
        width: "75%",
    },
    activityIndicatorModal: {
        width: 100,
        height: 100,
        backgroundColor: 'white',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    }
})