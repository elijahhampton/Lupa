import React from 'react';

import {
    Platform
} from 'react-native';

import * as Permissions from 'expo-permissions';

export default _requestPermissionsAsync = async () => {
  const { status, expires, permissions } = await Permissions.askAsync(
    Permissions.LOCATION,
    Permissions.CAMERA_ROLL,
    Permissions.CAMERA,
    Permissions.NOTIFICATIONS,
  );
  if (status !== 'granted') {
    alert('Hey! You heve not enabled selected permissions');
  }
}

export async function _requestLocationPermissionsAsync() {
  // permissions returns only for location permissions on iOS and under certain conditions, see Permissions.LOCATION
  const { status, permissions } = await Permissions.askAsync(Permissions.LOCATION);
  if (status === 'granted') {
    return Promise.resolve(true);
  } else {
    throw new Error('Location permissions not allowed.')
  }
}

export async function _requestCameraAndCameraRollPermsisionsAsync() {
  const { status, expires, permissions } = await Permissions.askAsync(
    Permissions.CAMERA_ROLL,
    Permissions.CAMERA,
  );
  if (status !== 'granted') {
    return Promise.resolve(true);
  } else {
    throw new Error("Camera permissions not allowed.");
  }
}