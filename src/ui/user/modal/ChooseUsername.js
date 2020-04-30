import React, { useState } from 'react';

import {
    View,
    StyleSheet,
    Text,
    Modal,
    TouchableOpacity,
} from 'react-native';

import {
    TextInput,
    Caption,
    Provider,
    Portal,
    ActivityIndicator,
} from 'react-native-paper';

import { Button } from 'react-native-elements';

import * as Location from 'expo-location';

import _requestPermissionsAsync from '../../../../../controller/lupa/permissions/permissions';

import { Input } from 'react-native-elements';
import SafeAreaView from 'react-native-safe-area-view';
import Feather from 'react-native-vector-icons/Feather';

import LupaMapView from '../../LupaMapView';

import Color from '../../../../common/Color';

import getLocationFromCoordinates from '../../../../../modules/location/mapquest/mapquest.js';

import LupaController from '../../../../../controller/lupa/LupaController';

import { getUpdateCurrentUserAttributeActionPayload } from '../../../../../controller/redux/payload_utility'

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
                <Modal presentationStyle="overFullScreen" style={styles.activityIndicatorModal} visible={props.visible}>
                    <ActivityIndicator style={{alignSelf: "center"}} animating={isLoading} hidesWhenStopped={false} size='large' color="#2196F3" />
                </Modal>
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
         //   setHomeGymText: "Set a Home Gym",
            locationDataSet: false,
            showLoadingIndicator: false,
            displayNameIsInvalid: false,
            showMapView: false,
            surroundingGymLocations: [],
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
        await this.setState({
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
        });

        await this.setState({
            showLoadingIndicator: false,
        })
    }
/*
    launchMapView = () => {
        this.setState({ showMapView: true  })
    }

    closeMapView = async (homeGym) => {
        const payload = await getUpdateCurrentUserAttributeActionPayload('homegym', homeGym, []);
        this.props.updateCurrentUserAttribute(payload);
        await this.setState({ setHomeGymText: homeGym.name, showMapView : false })
    }
*/
    render() {
        return (
            <View style={styles.root}>
                <SafeAreaView style={{ flex: 1, padding: 10, justifyContent: 'space-between', }}>

                    <View style={styles.instructionalTextContainer}>
                        <Text style={styles.instructionalText}>
                            Before we take you into the app we need a little information.  Don't worry you can finish most of it at a later time.
                    </Text>
                    </View>


<View style={{flex: 2, justifyContent: "center"}}>
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


                    <View style={{ justifyContent: "space-evenly", flex: 3 }}>
    

                    <Button onPress={this._getLocationAsync} title={this.state.locationText} raised disabled={false} type="solid" buttonStyle={{borderRadius: 30, padding:10, backgroundColor: "#2196F3"}} titleStyle={{color: 'white', fontFamily: "avenir-book"}} style={{color: "black"}} iconRight={true} icon={<Icon name="map-pin" size={15} style={{ margin: 3 }} />} /> 

                   {/* <Button onPress={this.launchMapView} title={this.state.setHomeGymText} raised disabled={!this.state.locationDataSet} type="solid" buttonStyle={this.state.locationDataSet ? {backgroundColor: "#2196F3", borderRadius: 30, padding:10,}: {backgroundColor: "white", borderRadius: 30, padding:10,}} titleStyle={this.state.locationDataSet ? {color: 'white', fontFamily: "avenir-book"} : {color: 'black', fontFamily: "avenir-book"}} style={{color: "black"}} iconRight={true} icon={<Icon name="map-pin" size={15} style={{ margin: 3 }} />} /> */}

                        <Caption style={{alignSelf: "center"}}>
                            We use your location to suggest trainers and others in your area as well as packs.  Read our Terms of Service and Privacy Policy for more information.
                    </Caption>
                    </View>


                   {/*  <LupaMapView isVisible={this.state.showMapView} closeMapViewMethod={this.closeMapView} gymData={this.state.surroundingGymLocations} initialRegionLatitude={this.state.locationDataSet ? this.state.location.coords.latitude : 0} initialRegionLongitude={this.state.locationDataSet ? this.state.location.coords.longitude : 0}
                     /> */}
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
        fontFamily: "avenir-roman"
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
        flex: 1,
        margin: 0,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center'
    },
    locationButtonStyles: {

    }
})

export default connect(mapStateToProps, mapDispatchToProps)(ChooseUsername);