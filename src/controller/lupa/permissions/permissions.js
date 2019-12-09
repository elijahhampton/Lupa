import React from 'react';

import {
    Permissions,
    Platform
} from 'react-native';

export default _requestPermissionsAsync = async () => {
        const { photoPermissionsStatus } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (photoPermissionsStatus != 'granted') {
            alert('Sorry, we need camera roll permissions to make this work.');
        }

        console.log('location permissions!')
        const { locationPermissionsStatus } = await Permissions.askAsync(Permissions.LOCATION);
        console.log('AAAAAAA' + locationPermissionsStatus)
        if (status !== 'granted') {
          alert('Sorry, we need location access to make this work.');
        }
}