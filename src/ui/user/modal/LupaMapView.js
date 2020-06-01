import * as React from 'react';

import { View, Modal, StyleSheet } from 'react-native';

import { Portal, Paragraph, Dialog, Button, Banner} from 'react-native-paper';

import MapView, { Marker } from 'react-native-maps';

import LupaController from '../../../controller/lupa/LupaController';

function ConfirmHomeGymDialog(props) {
    return (
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
    )
}

class LupaMapView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showGymConfirmationDialog: false,
            gymInformation: {},
            surroundingGymLocations:[],
        }

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    }

    componentDidMount = async () => {
        await this._fetchGymLocations();
    }

    _fetchGymLocations = async () => {
        let results;
        try {
            await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=gym&location=${this.props.initialRegionLatitude},${this.props.initialRegionLongitude}&radius=5000&type=gym&key=AIzaSyAPrxdNkncexkRazrgGy4FY6Nd-9ghZVWE`).then(response => response.json()).then(result => {
                results = result.results;
            })
        } catch (err)
        {
        
            results = [];
        }

        await this.setState({
            surroundingGymLocations: results
        });
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

        await this.hideGymConfirmationDialog();
        await this.props.closeMapViewMethod(homeGymData);
    }

    hideGymConfirmationDialog = async () => {
        await this.setState({ showGymConfirmationDialog: false })
    }

    render() {
        return (
            <Modal presentationStyle="fullScreen" visible={this.props.isVisible} animated={true} animationType="slide">
                <MapView style={{flex: 1}}
                    initialRegion={{
                        latitude: this.props.initialRegionLatitude,
                        longitude: this.props.initialRegionLongitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                      }}
                >
                    {this.mapMarkers()}
                </MapView>

                <ConfirmHomeGymDialog isVisible={this.state.showGymConfirmationDialog} gymInformation={this.state.gymInformation} handleHomeGymConfirmation={gymInfo => this.handleHomeGymConfirmation(gymInfo)} closeDialogMethod={this.hideGymConfirmationDialog}/>
            </Modal>
        )
    }
}

export default LupaMapView;

