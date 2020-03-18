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

import _requestPermissionsAsync from '../../../../controller/lupa/permissions/permissions';

import { Input } from 'react-native-elements';
import SafeAreaView from 'react-native-safe-area-view';
import { Feather as Icon } from '@expo/vector-icons';

import Color from '../../../common/Color';

import getLocationFromCoordinates from '../../../../modules/location/mapquest/mapquest.js';

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
        <Provider>
            <Portal>
                <Modal style={styles.activityIndicatorModal} visible={props.visible}>
                    <ActivityIndicator animating={isLoading} hidesWhenStopped={false} size='large' color={Color.LUPA_BLUE} />
                </Modal>
            </Portal>
        </Provider>
    );
}

class ChooseUsername extends React.Component {
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
            displayNameIsInvalid: false,
        }
    }

    componentDidMount = () => {
    
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

    _handleDisplayNameEndEditing = async (text) => {
        const display_name = await this.state.displayName;
        console.log(display_name);
        const payload = await getUpdateCurrentUserAttributeActionPayload('display_name', display_name, []);
        console.log('.....' + payload.value)
        this.props.updateCurrentUserAttribute(payload);

        this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('display_name', this.state.displayName);
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
                <SafeAreaView style={{ flex: 1, padding: 10, justifyContent: 'space-between', }}>

                    <View style={styles.instructionalTextContainer}>
                        <Text style={styles.instructionalText}>
                            Before we take you into the app we need a little information.  Don't worry you can finish most of it at a later time.
                    </Text>
                    </View>

                    <View style={{ flex: 2, flexDirection: "column", alignItems: "center", justifyContent: 'space-around' }}>
                        <TextInput
                            style={styles.textInput}
                            mode="outlined"
                            label="Choose a username"
                            theme={{ colors: { primary: '#1976D2' } }}
                            onChangeText={text => this._handleUsernameOnChangeText(text)}
                            onBlur={this._handleUsernameEndEditing}
                            value={this.state.chosenUsername}
                        />

                        <TextInput
                            style={styles.textInput}
                            mode="outlined"
                            label="Enter a display name"
                            theme={{ colors: { primary: '#1976D2' } }}
                            onChangeText={text => this._handleDisplayNameOnChangeText(text)}
                            onSubmitEditing={text => this._handleDisplayNameEndEditing(text)}
                            value={this.state.displayName}
                            editable={true}
                            returnKeyType="done"
                        />
                    </View>


                    <View style={{ alignItems: 'center', justifyContent: "space-around", flex: 2 }}>
                        <TouchableOpacity onPress={this._getLocationAsync} style={{ flexDirection: "row", alignItems: "center" }}>
                            <Icon name="map-pin" size={20} style={{ padding: 2 }} />
                            <Text style={[styles.generalText, { color: '#2196F3' }]}>
                                {this.state.locationText}
                            </Text>
                        </TouchableOpacity>

                        <Caption>
                            We use your location to suggest trainers and others in your area as well as packs.  Read our Terms of Service and Privacy Policy for more information.
                    </Caption>
                    </View>


                    {/* <LupaMapView isVisible={false} /> */}
                    <ActivityIndicatorModal visible={this.state.showLoadingIndicator} />


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
        fontSize: 20,
        fontWeight: "200"
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

export default connect(mapStateToProps, mapDispatchToProps)(ChooseUsername);