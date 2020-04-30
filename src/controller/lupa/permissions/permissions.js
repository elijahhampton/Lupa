import React from 'react';

import {
    Platform, Alert
} from 'react-native';

import * as Permissions from 'expo-permissions';
import { requestNotificationPermission } from '../../firebase/firebase';

export default _requestPermissionsAsync = async () => {
  const { status, expires, permissions } = await Permissions.askAsync(
    Permissions.LOCATION,
    Permissions.CAMERA_ROLL,
    Permissions.CAMERA,
  );

  await requestNotificationPermission();

  if (status !== 'granted') {
    alert('In order to use this app you must enable this permission.  Please visit the settings app on your phone to turn it on.');
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