import React, { useState } from 'react';

import {
    Text,
    View,
    StyleSheet,
    Image,
    Dimensions,
    SafeAreaView,
    Modal,
    TouchableOpacity,
    StatusBar,
} from 'react-native';

import * as Location from 'expo-location';

import {
    Surface,
    ActivityIndicator
} from 'react-native-paper';

import Map from '../../../images/map.png'
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LupaController from '../../../../controller/lupa/LupaController';

import getLocationFromCoordinates from '../../../../modules/location/mapquest/mapquest';
import { getUpdateCurrentUserAttributeActionPayload } from '../../../../controller/redux/payload_utility';

import _requestPermissionsAsync from '../../../../controller/lupa/permissions/permissions'

import { connect } from 'react-redux';
//Activity Indicator to show while fetching location data
const ActivityIndicatorModal = (props) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
                <Modal presentationStyle="overFullScreen" style={styles.activityIndicatorModal} visible={props.isVisible}>
                    <ActivityIndicator style={{alignSelf: "center"}} animating={isLoading} hidesWhenStopped={false} size='large' color="#2196F3" />
                </Modal>
    );
}

mapStateToProps = (state, action) => {
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

class WelcomeLupaIntroduction extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            location: {},
            locationText: '',
            locationDataSet: false,
            showLoadingIndicator: false,
        }
    }

    componentDidMount = async () => {
        await this.disableNext();
    }

    enableNext = () => {
        this.props.setNextDisabled(false);
    }

    disableNext = () => {
        this.props.setNextDisabled(true)
    }

    _getLocationAsync = async () => {
       // await _requestPermissionsAsync();
        let result;
        try {

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
        await this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('location', locationData);

        //udpate user in redux
        const payload = await getUpdateCurrentUserAttributeActionPayload('location', locationData, []);
        await this.props.updateCurrentUserAttribute(payload);

        //hide loading indicator
        await this.setState({
            locationText: locationDataText,
            locationDataSet: true,
        })

        await this.setState({
            showLoadingIndicator: false
        })

        await this.enableNext(); 
        } catch( err) {
            
        }
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar networkActivityIndicatorVisible={false} hidden={true} />
                <View style={{ flex: 1 }}>
                    <Image source={Map} style={{ width: Dimensions.get('window').width, height: "100%" }} resizeMode="cover"/>
                </View>
                <View style={{ flex: 2, alignItems: "center", justifyContent: "center" }}>
                    {
                        this.state.locationDataSet === false ?
                        <>
                            <View style={{ alignSelf: "flex-start", margin: 5 }}>
                                <TouchableOpacity onPress={() => this._getLocationAsync()} style={{borderRadius: 20}}>
                                <Surface style={{ borderRadius: 20, elevation: 10, alignSelf: "flex-start", width: Dimensions.get('window').width / 2, height: 100 }}>
                                    <LinearGradient start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        colors={['#FFFFFF', '#8AC5F3', '#0084EC']}
                                        style={styles.gradient}>
    
                                        <MaterialIcons name="location-on" size={35} color="#FBFBFB" />
                                    </LinearGradient>
                                </Surface>
                                </TouchableOpacity>
                                <Text style={{ width: Dimensions.get('window').width / 2, padding: 10 }}>
                                    Select one of the boxes to show health stats in your area
                                </Text>
                            </View>
    
                            <View style={{ alignSelf: "flex-end", margin: 5 }}>
                                <TouchableOpacity onPress={() => this._getLocationAsync()} style={{borderRadius: 20}}>
                                <Surface style={{ borderRadius: 20, elevation: 10, alignSelf: "flex-start", width: Dimensions.get('window').width / 2, height: 100 }}>
                                    <LinearGradient start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        colors={['#FFFFFF', '#8AC5F3', '#0084EC']}
                                        style={styles.gradient}>
    
                                        <MaterialIcons name="location-on" size={35} color="#FBFBFB" />
                                    </LinearGradient>
                                </Surface>
                                </TouchableOpacity>
                                <Text style={{ width: Dimensions.get('window').width / 2, padding: 10 }}>
                                    Select one of the boxes to show health stats in your area
                                    </Text>
                            </View>
                            </>
                         :
                         <>
                            <View style={{ alignSelf: "flex-start", margin: 5 }}>
                                <Surface style={{ borderRadius: 20, elevation: 10, alignSelf: "flex-start", width: Dimensions.get('window').width / 2, height: 100 }}>
    
                                </Surface>
                                <Text style={{ padding: 10 }}>
                                    Text One
                                </Text>
                            </View>
                            <View style={{ alignSelf: "flex-end", margin: 5 }}>
                                <Surface style={{ borderRadius: 20, elevation: 10, alignSelf: "flex-start", width: Dimensions.get('window').width / 2, height: 100 }}>
    
                                </Surface>
                                <Text style={{ padding: 10 }}>
                                    Text Two
                                    </Text>
                            </View>
                            </>
                                    }
                </View>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-start" }}>
                    <Text style={{ fontSize: 30, fontWeight: "700" }}>
                        Welcome to Lupa
                                </Text>
                    <Text style={{ fontWeight: "400" }}>
                        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                                </Text>
                </View>
    
                <ActivityIndicatorModal isVisible={this.state.showLoadingIndicator} />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: "100%",
        width: "100%",
        borderRadius: 20,
        padding: 10,
        alignItems: "center",
        justifyContent: 'center',
    },
    activityIndicatorModal: {
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeLupaIntroduction);