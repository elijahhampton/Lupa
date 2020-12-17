import * as React from 'react';

import { View, Modal, StyleSheet,  Dimensions ,SafeAreaView, Image, Text} from 'react-native';
 

import { Banner, ActivityIndicator, Button, Dialog, Paragraph, Caption} from 'react-native-paper';

import MapView, { Marker } from 'react-native-maps';

import LupaController from '../../../controller/lupa/LupaController';
import getLocationFromCoordinates from '../../../modules/location/mapquest/mapquest'
import Geolocation from '@react-native-community/geolocation';
import { getUpdateCurrentUserAttributeActionPayload } from '../../../controller/redux/payload_utility';
import { check, RESULTS, PERMISSIONS, request } from 'react-native-permissions';
import FullScreenLoadingIndicator from '../../common/FullScreenLoadingIndicator';
import { connect } from 'react-redux';
import RBSheet from 'react-native-raw-bottom-sheet';
import { UserCollectionFields } from '../../../controller/lupa/common/types';
import { Constants } from 'react-native-unimodules';

const ConfirmHomeGymDialog = React.forwardRef(({ gymInformation, closeDialogMethod, handleHomeGymConfirmation }, ref) => {
    return (
        <RBSheet
        ref={ref}
        height={250}
        customStyles={{
            container: {

            },
            wrapper: {

            },
            draggableIcon: {

            }
        }}
        >
            <View style={{flex: 1, justifyContent: 'space-evenly'}}>
                <Text style={{fontFamily: 'Avenir-Heavy', alignSelf: 'center', paddingHorizontal: 20}}>
                Would you like to set {gymInformation.name} at {gymInformation.formatted_address} as your home gym?
                </Text>

                <Button
                uppercase={false}
                onPress={() => handleHomeGymConfirmation(gymInformation)}
                color="#1089ff"
                mode="contained" 
                style={{elevation: 0, width: Dimensions.get('window').width - 20, alignSelf: 'center'}}
                theme={{roundness: 8}}
                contentStyle={{width: '100%', height: 45}}>
                    <Text>
                        Set Home Gym
                    </Text>
                </Button>

                <Button
                onPress={closeDialogMethod}
                uppercase={false}
                color="#1089ff"
                mode="outlined" 
                style={{elevation: 0}}
                theme={{roundness: 8}}
                style={{elevation: 0, width: Dimensions.get('window').width - 20, alignSelf: 'center'}}
                contentStyle={{width: Dimensions.get('window').width - 40, height: 45}}>
                    <Text>
                        Cancel
                    </Text>
                </Button>
            </View>

        </RBSheet>
    )
})


Geolocation.setRNConfiguration({
    authorizationLevel: 'whenInUse',
    skipPermissionRequests: false,
  });

  const mapStateToProps = (state, action) => {
      return {
          lupa_data: state,
      }
  }


const ShareLocationDialog = ({ fetchUserLocation, isVisible, closeModal}) => {

    const handleLocationPermissionGranted = async () => {
        await fetchUserLocation()
        closeModal()
    }

    const checkLocationPermissionsAndRequest = async () => {
        await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
        .then(async (result) => {
            switch (result) {
                case RESULTS.UNAVAILABLE:
                    //tell user it is not available on this device
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
                    handleLocationPermissionGranted()
                    break;
                case RESULTS.BLOCKED:
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

    return (
        <Dialog visible={isVisible} style={{alignSelf: 'center', borderRadius: 20, width: Dimensions.get('window').width - 20, height: 400, backgroundColor: 'white'}} >
            <Dialog.Title>
                Setup your Home Gym
            </Dialog.Title>
            <Paragraph style={{fontFamily: 'Avenir', paddingHorizontal: 20}}>
                Find your gym, studio, apartment, or house and mark it as your home gym.  Clients will ony be able to see the location of your home gym upon booking a session with you.
            </Paragraph>
            <Dialog.Content style={{flex: 1, alignItems: 'center', justifyContent: 'space-evenly'}}>
                <Image style={{width: 150, height: 100}} source={require('../../images/onboarding/location_map.png')} />
                <Button
                uppercase={false}
                onPress={checkLocationPermissionsAndRequest}
                color="#1089ff"
                mode="contained" 
                style={{elevation: 0}}
                theme={{roundness: 8}}
                contentStyle={{width: Dimensions.get('window').width - 40, height: 45}}>
                    Enable Location
                </Button>
            </Dialog.Content>
        </Dialog>
    )
}


class LupaMapView extends React.Component {
    constructor(props) {
        super(props);

        this.confirmHomeGymDialogRef = React.createRef();

        this.state = {
            showGymConfirmationDialog: false,
            gymInformation: {},
            surroundingGymLocations:[],
            locationPermissionStatus: '',
            homeGymLocation: '',
            homeGymSet: false,
            homeGymLocationData: '',
            userLocation: {
                latitude: 0,
                longitude: 0,
            },
            region: {
                latitude: 51.5079145,
    longitude: -0.0899163,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
            },
            userLocationIsSet: false,
            ready: false,
            locationDialogVisible: false,
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
    
    const region = {
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    }

    await this.setState({ userLocation: region, region: region }, () => {
        this._fetchGymLocations()
    })
    await this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('location', locationData);
}

    componentDidMount = async () => {
       this.setState({ locationDialogVisible: true })
    }


    _fetchGymLocations = async () => {
        try {
            await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=gym&location=${this.state.region.latitude},${this.state.region.longitude}&radius=5000&type=gym&key=AIzaSyAPrxdNkncexkRazrgGy4FY6Nd-9ghZVWE`)
            .then(response => response.json())
            .then(result => {
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
        return this.state.surroundingGymLocations.map((marker, index, arr) => {
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

    openConfirmHomeGymDialog = () => this.confirmHomeGymDialogRef.current.open();
    closeConfirmHomeGymDialog = () => this.confirmHomeGymDialogRef.current.close();

    handleOnPressMarker = async (gymInformationIn) => {
        await this.setState({
            gymInformation: gymInformationIn,
            showGymConfirmationDialog: true,
        });

        await this.showGymConfirmationDialog();
    }

    showGymConfirmationDialog = async () => {
        this.openConfirmHomeGymDialog()
    }

    handleHomeGymConfirmation = async (gymInformation) => {
        const homeGymData = {
            name: gymInformation.name,
            location: gymInformation.geometry.location,
            address: gymInformation.formatted_address,
        }

        //update redux
        const payload = getUpdateCurrentUserAttributeActionPayload('homegym', homeGymData);
        //this.props.updateCurrentUser(payload);

        //update database
        this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser(UserCollectionFields.HOME_GYM, homeGymData);

        await this.hideGymConfirmationDialog().then(() => {
            this.setState({ homeGymSet: true })
        })
    }

    hideGymConfirmationDialog = async () => {
        await this.closeConfirmHomeGymDialog()
    }

    render() {
        return (
            <View style={{flex: 1}}>
                          <SafeAreaView style={{backgroundColor: 'transparent'}} />
                      <MapView style={{flex: 1}}
                      region={this.state.region}
                      onRegionChangeComplete={region => this.setState({ region })}
                          initialRegion={{
                              latitude: this.state.userLocation.latitude,
                              longitude: this.state.userLocation.longitude,
                              latitudeDelta: 0.0922,
                              longitudeDelta: 0.0421,
                            }}
                      >
                          {this.mapMarkers()}
                      </MapView>
                      <ShareLocationDialog 
                        fetchUserLocation={this.fetchUserLocation} 
                        isVisible={this.state.locationDialogVisible} 
                        closeModal={() => this.setState({ locationDialogVisible: false })} 
                        />
                      <ConfirmHomeGymDialog 
                      ref={this.confirmHomeGymDialogRef} 
                      isVisible={this.state.showGymConfirmationDialog} 
                      gymInformation={this.state.gymInformation} 
                      handleHomeGymConfirmation={gymInfo => this.handleHomeGymConfirmation(gymInfo)} 
                      closeDialogMethod={this.hideGymConfirmationDialog}/>
                            
                            
                      <Button
                      onPress={() => this.props.navigateNextView()}
                        uppercase={false}
                        color="#1089ff"
                        mode="contained" 
                        disabled={this.state.homeGymSet === false}
                        style={{
                            elevation: 3, 
                            position: 'absolute', 
                            bottom: Constants.statusBarHeight, 
                            width: Dimensions.get('window').width - 20, 
                            alignSelf: 'center'
                        }}
                        theme={{roundness: 8}}
                        contentStyle={{width: '100%', height: 45}}>
                            <Text>
                                Next
                            </Text>
                    </Button>
                       </View>
        )
    }
}

export default connect(mapStateToProps)(LupaMapView);

