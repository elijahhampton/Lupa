import React from 'react';

import {
    Platform, Alert,
    PermissionsAndroid
} from 'react-native';

import {request, PERMISSIONS, RESULTS, check, requestMultiple} from 'react-native-permissions';
import Contacts, { requestPermission } from 'react-native-contacts'; 
import { requestNotificationPermissions } from '../../firebase/firebase';
import { fcmService } from '../../firebase/service/FCMService';

/**
PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL;
PERMISSIONS.IOS.CALENDARS;
PERMISSIONS.IOS.CAMERA;
PERMISSIONS.IOS.CONTACTS;
PERMISSIONS.IOS.FACE_ID;
PERMISSIONS.IOS.LOCATION_ALWAYS;
PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
PERMISSIONS.IOS.MEDIA_LIBRARY;
PERMISSIONS.IOS.MICROPHONE;
PERMISSIONS.IOS.MOTION;
PERMISSIONS.IOS.PHOTO_LIBRARY;
PERMISSIONS.IOS.REMINDERS;
PERMISSIONS.IOS.SIRI;
PERMISSIONS.IOS.SPEECH_RECOGNITION;
PERMISSIONS.IOS.STOREKIT;
 */


export const _checkCameraAndPhotoLibraryPermissions = () => {
  check(PERMISSIONS.IOS.CAMERA)
  .then((result) => {
    switch (result) {
      case RESULTS.UNAVAILABLE:
        //tell user it is not available on this device
        break;
      case RESULTS.DENIED:
       //request permission
       request(PERMISSIONS.IOS.CAMERA).then((result) => {
        if (result == RESULTS.DENIED || result == RESULTS.BLOCKED)
        {
         // alert('The Camera permission is required to use certain Lupa features.  You can enable it from the Lupa tab in the Settings app.')
        }
      });
        break;
      case RESULTS.GRANTED:
        // nothing to do
        break;
      case RESULTS.BLOCKED:
        // alert the user to change it from settings
      //  alert('The Camera permission is required to use certain Lupa features.  You can enable it from the Lupa tab in the Settings app.')
        break;
    }
  })
  .catch((error) => {
    // …
   // alert('Oops.  It looks like there was an error while trying to anable the Camera permission.  You can enable it from the Lupa tab in the Settings app.')
  });

  check(PERMISSIONS.IOS.PHOTO_LIBRARY)
  .then((result) => {
    switch (result) {
      case RESULTS.UNAVAILABLE:
        //tell user it is not available on this device
        break;
      case RESULTS.DENIED:
       //request permission
       request(PERMISSIONS.IOS.PHOTO_LIBRARY).then((result) => {
        if (result == RESULTS.DENIED || result == RESULTS.BLOCKED)
        {
     //     alert('The Photo Library permission is required to use the Lupa app.  You can enable it from the Lupa tab in the Settings app.')
        }
      });
        break;
      case RESULTS.GRANTED:
        // nothing to do
        break;
      case RESULTS.BLOCKED:
        // alert the user to change it from settings
      //  alert('The Photo Library permission is required to use the Lupa app.  You can enable it from the Lupa tab in the Settings app.')
        break;
    }
  })
  .catch((error) => {
    // …
   // alert('Oops.  It looks like there was an error while trying to anable the Photo Library permission.  You can enable it from the Lupa tab in the Settings app.')
  });

}

export default _requestPermissionsAsync = () => {

  requestMultiple([
    PERMISSIONS.IOS.CAMERA, 
    PERMISSIONS.IOS.PHOTO_LIBRARY,
    PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
  ]).then(
    (statuses) => {
      let statusD
      if (statuses[PERMISSIONS.IOS.CAMERA] == 'blocked' || statuses[PERMISSIONS.IOS.CAMERA] == 'denied' || statuses[PERMISSIONS.IOS.CAMERA] == 'unavailable') {
        Alert.alert('It looks like camera permissions have been denied.  Open your settings to change this.')
      }

      if (statuses[PERMISSIONS.IOS.PHOTO_LIBRARY] == 'blocked' || statuses[PERMISSIONS.IOS.PHOTO_LIBRARY] == 'denied' || statuses[PERMISSIONS.IOS.PHOTO_LIBRARY] == 'unavailable') {
        Alert.alert('It looks like camera permissions have been denied.  Open your settings to change this.')
      }

      if (statuses[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] == 'blocked' || statuses[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] == 'denied' || statuses[PERMISSIONS.IOS.LOCATION_WHEN_IN_USE] == 'unavailable') {
        Alert.alert('It looks like camera permissions have been denied.  Open your settings to change this.')
      }

    },
  );

  fcmService.requestNotificationPermissions()
}

if (Platform.OS === 'android') {
  try {
    check(PERMISSIONS.ANDROID.CAMERA)
    .then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          //tell user it is not available on this device
          
          break;
        case RESULTS.DENIED:
         //request permission
      
          break;
        case RESULTS.GRANTED:
          // nothing to do
          
          break;
        case RESULTS.BLOCKED:
          // alert the user to change it from settings
         //may need to handle the case here user says only while using?
          break;
      }
    })
    .catch((error) => {
      // …
     // alert('Oops.  It looks like there was an error while trying to anable the Location permission.  You can enable it from the Lupa tab in the Settings app.')
    });
  
    check(PERMISSIONS.ANDROID.READ_CONTACTS)
    .then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          //tell user it is not available on this device
          
          break;
        case RESULTS.DENIED:
         //request permission
      
          break;
        case RESULTS.GRANTED:
          // nothing to do
          
          break;
        case RESULTS.BLOCKED:
          // alert the user to change it from settings
         //may need to handle the case here user says only while using?
          break;
      }
    })
    .catch((error) => {
      // …
     // alert('Oops.  It looks like there was an error while trying to anable the Location permission.  You can enable it from the Lupa tab in the Settings app.')
    });
  
    check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
    .then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          //tell user it is not available on this device
          
          break;
        case RESULTS.DENIED:
         //request permission
      
          break;
        case RESULTS.GRANTED:
          // nothing to do
          
          break;
        case RESULTS.BLOCKED:
          // alert the user to change it from settings
         //may need to handle the case here user says only while using?
          break;
      }
    })
    .catch((error) => {
      // …
     // alert('Oops.  It looks like there was an error while trying to anable the Location permission.  You can enable it from the Lupa tab in the Settings app.')
    });
  
    check(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION)
    .then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          //tell user it is not available on this device
          
          break;
        case RESULTS.DENIED:
         //request permission
      
          break;
        case RESULTS.GRANTED:
          // nothing to do
          
          break;
        case RESULTS.BLOCKED:
          // alert the user to change it from settings
         //may need to handle the case here user says only while using?
          break;
      }
    })
    .catch((error) => {
      // …
     // alert('Oops.  It looks like there was an error while trying to anable the Location permission.  You can enable it from the Lupa tab in the Settings app.')
    });
  
    check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
    .then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          //tell user it is not available on this device
          
          break;
        case RESULTS.DENIED:
         //request permission
      
          break;
        case RESULTS.GRANTED:
          // nothing to do
          
          break;
        case RESULTS.BLOCKED:
          // alert the user to change it from settings
         //may need to handle the case here user says only while using?
          break;
      }
    })
    .catch((error) => {
      // …
     // alert('Oops.  It looks like there was an error while trying to anable the Location permission.  You can enable it from the Lupa tab in the Settings app.')
    });
  
    check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
    .then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          //tell user it is not available on this device
          
          break;
        case RESULTS.DENIED:
         //request permission
      
          break;
        case RESULTS.GRANTED:
          // nothing to do
          
          break;
        case RESULTS.BLOCKED:
          // alert the user to change it from settings
         //may need to handle the case here user says only while using?
          break;
      }
    })
    .catch((error) => {
      // …
     // alert('Oops.  It looks like there was an error while trying to anable the Location permission.  You can enable it from the Lupa tab in the Settings app.')
    });
  
    check(PERMISSIONS.ANDROID.LOCATION_WHEN_IN_USE)
    .then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          //tell user it is not available on this device
          
          break;
        case RESULTS.DENIED:
         //request permission
      
          break;
        case RESULTS.GRANTED:
          // nothing to do
          
          break;
        case RESULTS.BLOCKED:
          // alert the user to change it from settings
         //may need to handle the case here user says only while using?
          break;
      }
    })
    .catch((error) => {
      // …
     // alert('Oops.  It looks like there was an error while trying to anable the Location permission.  You can enable it from the Lupa tab in the Settings app.')
    });
  
    check(PERMISSIONS.ANDROID.RECEIVE_WAP_PUSH)
    .then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          //tell user it is not available on this device
          
          break;
        case RESULTS.DENIED:
         //request permission
      
          break;
        case RESULTS.GRANTED:
          // nothing to do
          
          break;
        case RESULTS.BLOCKED:
          // alert the user to change it from settings
         //may need to handle the case here user says only while using?
          break;
      }
    })
    .catch((error) => {
      // …
     // alert('Oops.  It looks like there was an error while trying to anable the Location permission.  You can enable it from the Lupa tab in the Settings app.')
    });

    fcmService.requestNotificationPermissions();
  } catch(err) {
    alert(err)
  }
}