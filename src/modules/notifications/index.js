import { Alert } from 'react-native';
import {request, check, PERMISSIONS, requestMultiple, checkMultiple, RESULTS} from 'react-native-permissions';

const requestVirtualSessionsPermission = () => {
  checkMultiple(PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE)
  .then(results => {
    switch(results) {
      case RESULTS.GRANTED:
        //granted
        break;
      case RESULTS.UNAVAILABLE:
        Alert.alert('Permissions Unavailable', 'One or more of these permissions are unavailable on your device.', [{
          text: 'Okay',
          onPress: () => {}
        }]);
        break;
      case RESULTS.DENIED:
        Alert.alert('Permissions Denied', 'One or more of these permissions have been denied.  Please check your camera and notification settings for Lupa.', [{
          text: 'Okay',
          onPress: () => {}
        }]);
        break;
      case RESULTS.BLOCKED:

        request(PERMISSIONS.IOS.CAMERA).then(() => {
          if (RESULTS.DENIED) {
            Alert.alert('Permissions Denied', 'One or more of these permissions have been denied.  Please check your camera and notification settings for Lupa.', [{
              text: 'Okay',
              onPress: () => {}
            }]);
            return;
          }
        })

        request(PERMISSIONS.IOS.MICROPHONE).then(results => {
          if (RESULTS.DENIED) {
            Alert.alert('Permissions Denied', 'One or more of these permissions have been denied.  Please check your camera and notification settings for Lupa.', [{
              text: 'Okay',
              onPress: () => {}
            }]);
            return;
          }
        })
    }
  })
}

//import PushNotificationIOS from "@react-native-community/push-notification-ios";
//var PushNotification = require("react-native-push-notification");

// Must be outside of any component LifeCycle (such as `componentDidMount`).
/*PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function (token) {
      alert('token generated')
    },
  
    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function (notification) {
      console.log("NOTIFICATION:", notification);
       alert('onNotification')
      // process the notification
  
      // (required) Called when a remote is received or opened, or local notification is opened
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },
  
    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    onAction: function (notification) {
     // console.log("ACTION:", notification.action);
      // console.log("NOTIFICATION:", notification);
      alert('onaction')
  
      // process the action
    },
  
    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: function(err) {
      alert('onError')
    },
  
    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
  
    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,
  
    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     * - if you are not using remote notification or do not have Firebase installed, use this:
     *     requestPermissions: Platform.OS === 'ios'
     */
    //requestPermissions: true,
  //})
  