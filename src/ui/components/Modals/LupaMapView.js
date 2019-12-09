import React from 'react';

import {
    Modal,
    StyleSheet
} from 'react-native';

import MapView from 'react-native-maps';

export default class LupaMapView extends React.Component {
    constructor(props) {
        super(props);


    }

    render() {
        return (
            <Modal visible={this.props.isVisible} presentationStyle="fullScreen" style={styles.modalContainer}>
                    <MapView style={styles.mapView} initialRegion={{
                        latitude: this.props.initialLat, 
                        longitude: this.props.initLong,
                        }} />
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        display: "flex",
        margin: 0,
    },
    mapView: {
        width: "100%",
        height: "100%",
    }
});