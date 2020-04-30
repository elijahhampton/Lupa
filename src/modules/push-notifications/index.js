import React, { useEffect } from 'react'
import PushNotification from 'react-native-push-notification';
import { LUPA_MESSAGING, sendNotificationToCurrentUsersDevice } from '../../controller/firebase/firebase';

export function sendLocalPushNotification(title, message, time) {
    PushNotification.localNotification({
        /* iOS only properties */
        alertAction: "view", // (optional) default: view
        category: "", // (optional) default: empty string
        userInfo: {}, // (optional) default: {} (using null throws a JSON value '<null>' error)
       
        /* iOS and Android properties */
        title: title, // (optional)
        message: message, // (required)
        playSound: true, // (optional) default: true
        soundName: "default", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
        number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
      });
}

export function sendScheduledNotification() {

}

export function sendNotificationToDevice() {
  sendNotificationToCurrentUsersDevice();
}