import * as React from 'react';

import { View, Modal, StyleSheet,     SafeAreaView,} from 'react-native';
 

import { Banner, ActivityIndicator} from 'react-native-paper';

import MapView, { Marker } from 'react-native-maps';

import LupaController from '../../../controller/lupa/LupaController';
import getLocationFromCoordinates from '../../../modules/location/mapquest/mapquest'
import Geolocation from '@react-native-community/geolocation';
import { getUpdateCurrentUserAttributeActionPayload } from '../../../controller/redux/payload_utility';
import { check, RESULTS, PERMISSIONS, request } from 'react-native-permissions';
import FullScreenLoadingIndicator from '../../common/FullScreenLoadingIndicator';
import { connect } from 'react-redux';
function ConfirmHomeGymDialog(props) {
    return (
        <>
        <Banner
        visible={props.isVisible}
        actions={[
          {
            label: 'Accept',
            onPress: () => props.handleHomeGymConfirmation(props.gymInformation),
          },
          {
            label: 'Cancel',
            onPress: () => props.closeDialogMethod(),
          },
        ]}
      >
        Would you like to set {props.gymInformation.name} at {props.gymInformation.formatted_address} as the location for your program?
      </Banner>
      </>
    )
}


Geolocation.setRNConfiguration({
    authorizationLevel: 'whenInUse',
    skipPermissionRequests: false,
  });

  const mapStateToProps = (state, action) => {
      return {
          lupa_data: state,
      }
  }


class LupaMapView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showGymConfirmationDialog: false,
            gymInformation: {},
            surroundingGymLocations:[],
            locationPermissionStatus: '',
            homeGymLocation: '',
            homeGymLocationData: '',
            userLocation: {},
            userLocationIsSet: false,
            ready: false,
        }

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    }

    async checkLocationPermissionsAndRequest() {
        await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
        .then(async (result) => {
            switch (result) {
                case RESULTS.UNAVAILABLE:
                    //tell user it is not available on this device
                    this.setState({ locationPermissionStatus: 'unavailable' })
                    alert('Location services not available on this device.')
                    break;
                case RESULTS.DENIED:
                     // alert the user to change it from settings
                    //  alert('The Camera permission is required to use certain Lupa features.  You can enable it from the Lupa tab in the Settings app.')
                    request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(value => {
                        this.setState({ locationPermissionStatus: value })
                    })
                    break;
                case RESULTS.GRANTED:
                    this.setState({ locationPermissionStatus: 'granted' })
                    await this.fetchUserLocation();
                    break;
                case RESULTS.BLOCKED:
                    this.setState({ locationPermissionStatus: 'blocked' })
                    alert('Location services blocked.  Please enable location in settings and return to the app.')
                    // alert the user to change it from settings
                    //  alert('The Camera permission is required to use certain Lupa features.  You can enable it from the Lupa tab in the Settings app.')
                    break;
            }
        })
        .catch((error) => {
            alert(error)
             // alert the user to change it from settings
                    //  alert('The Camera permission is required to use certain Lupa features.  You can enable it from the Lupa tab in the Settings app.')
        });
    }

    fetchUserLocation = async () => {
        console.log('fetchingLocation')
       // LOG('Lupa.js', 'Retrieving the current users position');
        await Geolocation.getCurrentPosition(
            this.handleOnFetchUserLocationSuccess, 
            this.handleOnFetchUserLocationError,
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
       );
}

renderUnReadyView = () => {
    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <FullScreenLoadingIndicator isVisible={true} />
        </View>
    )
}

handleOnFetchUserLocationError = (error) => {
    alert(error.message)
}

handleOnFetchUserLocationSuccess = async (position) => {
    const locationData = await getLocationFromCoordinates(position.coords.longitude, position.coords.latitude);
    const initialPosition = JSON.stringify(position);
    await this.setState({ userLocation: locationData })
    await this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('location', locationData);
}

    componentDidMount = async () => {
        await this.setState({ ready: false })

        await this.checkLocationPermissionsAndRequest()
        await this.fetchUserLocation()

        await this.setState({ ready: true })

        if (this.state.surroundingGymLocations.length === 0) {
            await this._fetchGymLocations()
        }
    }



    shouldComponentUpdate = (nextProps, nextState) => {
        return true;
    }

    _fetchGymLocations = async () => {
        let results;
        try {
            await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=gym&location=${this.state.userLocation.latitude},${this.state.userLocation.longitude}&radius=5000&type=gym&key=AIzaSyAPrxdNkncexkRazrgGy4FY6Nd-9ghZVWE`).then(response => response.json()).then(result => {
                this.setState({ surroundingGymLocations: result.results })    
            })
        } catch (err)
        {
            await this.setState({
                surroundingGymLocations: []
            });
            return;
        }

    }

    mapMarkers = () => {
        
        return this.state.surroundingGymLocations.map(marker => {
            let coord = {
                latitude: marker.geometry.location.lat,
                longitude: marker.geometry.location.lng
            }
            return (
                <Marker
                coordinate={coord}
                title={marker.name}
                description={marker.formatted_address}
                shouldRasterizeIOS={true}
                key={marker.formatted_address}
                flat
                onPress={() => this.handleOnPressMarker(marker)}
                onSelect={() => this.handleOnPressMarker(marker)}
              />
            )
        })
    }



    handleOnPressMarker = async (gymInformationIn) => {
        await this.setState({
            gymInformation: gymInformationIn,
            showGymConfirmationDialog: true,
        });

        await this.showGymConfirmationDialog();
    }

    showGymConfirmationDialog = async () => {
        await this.setState({ showGymConfirmationDialog: true })
    }

    handleHomeGymConfirmation = async (gymInformation) => {
        let homeGymData = {
            name: gymInformation.name,
            location: gymInformation.geometry.location,
            address: gymInformation.formatted_address,
        }

        console.log(homeGymData)

        await this.hideGymConfirmationDialog();
        await this.props.closeMapViewMethod(homeGymData);
    }

    hideGymConfirmationDialog = async () => {
        await this.setState({ showGymConfirmationDialog: false })
    }

    renderComponent = () => {
        if (!this.state.ready) {
            return (
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.8)'}}>
          <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
            )
        } else {
            return (
                <MapView style={{flex: 1}}
                          initialRegion={{
                              latitude: this.props.lupa_data.Users.currUserData.location.latitude,
                              longitude: this.props.lupa_data.Users.currUserData.location.longitude,
                              latitudeDelta: 0.0922,
                              longitudeDelta: 0.0421,
                            }}
                      >
                          {this.mapMarkers()}
                      </MapView>
            )
        }

    }

    render() {
        return (
            <Modal presentationStyle="fullScreen" visible={this.props.isVisible} animated={true} animationType="slide">
                          <SafeAreaView style={{backgroundColor: 'transparent'}} />
                  <ConfirmHomeGymDialog isVisible={this.state.showGymConfirmationDialog} gymInformation={this.state.gymInformation} handleHomeGymConfirmation={gymInfo => this.handleHomeGymConfirmation(gymInfo)} closeDialogMethod={this.hideGymConfirmationDialog}/>
                  {
                      this.state.ready == true ?
                      <MapView style={{flex: 1}}
                          initialRegion={{
                              latitude: this.state.userLocation.latitude,
                              longitude: this.state.userLocation.longitude,
                              latitudeDelta: 0.0922,
                              longitudeDelta: 0.0421,
                            }}
                      >
                          {this.mapMarkers()}
                      </MapView>
                      :
                      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.8)'}}>
                      <ActivityIndicator size="large" color="#FFFFFF" />
                  </View>
                  }
            </Modal>
        )
    }
}

export default connect(mapStateToProps)(LupaMapView);

