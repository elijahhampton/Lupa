import React from 'react';

import {
    Platform
} from 'react-native';

import * as Permissions from 'expo-permissions';

export default _requestPermissionsAsync = async () => {
  const { status, expires, permissions } = await Permissions.askAsync(
    Permissions.CALENDAR,
    Permissions.LOCATION,
    Permissions.CAMERA_ROLL,
    Permissions.CAMERA,
    Permissions.NOTIFICATIONS,
  );
  if (status !== 'granted') {
    alert('Hey! You heve not enabled selected permissions');
  }
}