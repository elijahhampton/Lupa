import React from 'react';

import {
    Platform, Alert,
    PermissionsAndroid
} from 'react-native';
import { checkPermission } from 'react-native-contacts';

import {request, PERMISSIONS, RESULTS, check, requestMultiple} from 'react-native-permissions';
import { requestNotificationPermissions } from '../../firebase/firebase';
import { fcmService } from '../../firebase/service/FCMService';

export const _checkCameraAndPhotoLibraryPermissions = () => {
  check(PERMISSIONS.IOS.CAMERA).then((result) => {
    switch (result) {
      case RESULTS.UNAVAILABLE:
        //tell user it is not available on this device
        Alert.alert(
          'Camera Permissions Unavailable',
          'It looks like location services are not available on your device.',
          [{ text: 'Okay', onPress: () => { } }
          ]
        )
        break;
      case RESULTS.DENIED:
        //request permission
        request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result) => {
          if (result == RESULTS.DENIED || result == RESULTS.BLOCKED) {
            alert('Camera permissions have been blocked or denied.  Enable camera permissions from your settings application.');
          } else if (result == RESULTS.UNAVAILABLE) {
            alert('It looks like camera permissions are not available on your device.');
          } else {
            //otherwise the services have been granted and there is nothing to do
          }
        });
        break;
      case RESULTS.GRANTED:
        // nothing to do
        break;
      case RESULTS.BLOCKED:
        // alert the user to change it from settings
        Alert.alert(
          'Camera Permissions',
          'It looks like camera permissions have been disabled on your device.  Enable camera permissions in the lupa section of your phones settings.',
          [{ text: 'Okay', onPress: () => { } }
          ]
        )
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
        Alert.alert(
          'Photo library permissions not available.',
          'It looks like photo library permissions are not available on your device.',
          [{ text: 'Okay', onPress: () => { } }
          ]
        )
        break;
      case RESULTS.DENIED:
        //request permission
        request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result) => {
          if (result == RESULTS.DENIED || result == RESULTS.BLOCKED) {
            alert('Photo library permissions have been blocked or denied.  Enable photo permissions from your settings application.');
          } else if (result == RESULTS.UNAVAILABLE) {
            alert('It looks like photo library permissions are not available on your device.');
          } else {
            //otherwise the services have been granted and there is nothing to do
            
          }
        });
        break;
      case RESULTS.GRANTED:
        // nothing to do
     
        break;
      case RESULTS.BLOCKED:
        // alert the user to change it from settings
        Alert.alert(
          'Photo Permissions Blocked',
          'It looks like photo library permissions have been disabled on your device.  Enable photo library permissions in the lupa section of your phones settings.',
          [{ text: 'Okay', onPress: () => { } }
          ]
        )
        break;
    }
  })
  .catch((error) => {
    // …
    // alert('Oops.  It looks like there was an error while trying to anable the Camera permission.  You can enable it from the Lupa tab in the Settings app.')
  });

}

export default _requestPermissionsAsync = () => {

  requestMultiple([
    PERMISSIONS.IOS.CAMERA, 
    PERMISSIONS.IOS.PHOTO_LIBRARY,
    PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
  ]).then(
    (statuses) => {
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
  }
}