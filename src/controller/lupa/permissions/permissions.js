import React from 'react';

import {
    Platform, Alert
} from 'react-native';

import {request, PERMISSIONS, RESULTS, check} from 'react-native-permissions';
import Contacts from 'react-native-contacts'; 
import { requestNotificationPermission } from '../../firebase/firebase';

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
          alert('The Camera permission is required to use certain Lupa features.  You can enable it from the Lupa tab in the Settings app.')
        }
      });
        break;
      case RESULTS.GRANTED:
        // nothing to do
        break;
      case RESULTS.BLOCKED:
        // alert the user to change it from settings
        alert('The Camera permission is required to use certain Lupa features.  You can enable it from the Lupa tab in the Settings app.')
        break;
    }
  })
  .catch((error) => {
    // …
    alert('Oops.  It looks like there was an error while trying to anable the Camera permission.  You can enable it from the Lupa tab in the Settings app.')
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
          alert('The Photo Library permission is required to use the Lupa app.  You can enable it from the Lupa tab in the Settings app.')
        }
      });
        break;
      case RESULTS.GRANTED:
        // nothing to do
        break;
      case RESULTS.BLOCKED:
        // alert the user to change it from settings
        alert('The Photo Library permission is required to use the Lupa app.  You can enable it from the Lupa tab in the Settings app.')
        break;
    }
  })
  .catch((error) => {
    // …
    alert('Oops.  It looks like there was an error while trying to anable the Photo Library permission.  You can enable it from the Lupa tab in the Settings app.')
  });

}

export default _requestPermissionsAsync = () => {
  
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
          alert('The Camera permission is required to use certain Lupa features.  You can enable it from the Lupa tab in the Settings app.')
        }
      });
        break;
      case RESULTS.GRANTED:
        // nothing to do
        break;
      case RESULTS.BLOCKED:
        // alert the user to change it from settings
        alert('The Camera permission is required to use certain Lupa features.  You can enable it from the Lupa tab in the Settings app.')
        break;
    }
  })
  .catch((error) => {
    // …
    alert('Oops.  It looks like there was an error while trying to anable the Camera permission.  You can enable it from the Lupa tab in the Settings app.')
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
          alert('The Photo Library permission is required to use the Lupa app.  You can enable it from the Lupa tab in the Settings app.')
        }
      });
        break;
      case RESULTS.GRANTED:
        // nothing to do
        break;
      case RESULTS.BLOCKED:
        // alert the user to change it from settings
        alert('The Photo Library permission is required to use the Lupa app.  You can enable it from the Lupa tab in the Settings app.')
        break;
    }
  })
  .catch((error) => {
    // …
    alert('Oops.  It looks like there was an error while trying to anable the Photo Library permission.  You can enable it from the Lupa tab in the Settings app.')
  });
  
  //TODO: Change to location in use and fix errors where is always denied or blocked
  check(PERMISSIONS.IOS.LOCATION_ALWAYS)
  .then((result) => {
    switch (result) {
      case RESULTS.UNAVAILABLE:
        //tell user it is not available on this device
        
        break;
      case RESULTS.DENIED:
       //request permission
       request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result) => {
        if (result == RESULTS.DENIED || result == RESULTS.BLOCKED)
        {
          alert('The Location permission is required to use the Lupa app.  You can enable it from the Lupa tab in the Settings app.')
        }
      });
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
    alert('Oops.  It looks like there was an error while trying to anable the Location permission.  You can enable it from the Lupa tab in the Settings app.')
  });


      Contacts.requestPermission((err, permission) => {
        if (permission == 'authorized')
        {
            //granted
        }
        else
        {
            //denied
        }
      })

  requestNotificationPermission();
}