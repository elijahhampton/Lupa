import reactfirebasemessaging from '@react-native-firebase/messaging';
import LOG from '../../../common/Logger';
import {Platform} from 'react-native';

class FCMService {

    createNotificationListeners = (onNotification, onOpenNotification) => {
      LOG('firebase.js', 'createNotificationListeners::Creating notification listeners')
      
      // When the application is running, but in the background
      reactfirebasemessaging().onNotificationOpenedApp(remoteMessage => {
        LOG('firebase.js', 'createNotificationListeners::onNotificationOpenedApp caused app to open.')
        if (remoteMessage) {
          const notification = remoteMessage.notification;
          onOpenNotification(notification);
        }
      });
    
      //When the application is opened from a quit state
      reactfirebasemessaging().getInitialNotification().then(remoteMessage => {
        LOG('firebase.js', 'createNotificationListeners::getInitialNotification caused app to open.')
        if (remoteMessage) {
          const notification = remoteMessage.notification;
          onOpenNotification(notification);
        }
      });

      reactfirebasemessaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('MEssage handled in the background!', remoteMessage);
      })
    
     /* // Foreground state messages
      this.messageListener = reactfirebasemessaging().onMessage(async remoteMessage => {
        LOG('firebase.js', 'createNotificationListeners::onMessage A new FCM message arrived!', remoteMessage);
     
        if (remoteMessage) {
          let notification = null;
          if (Platform.OS === 'ios') {
            notification = remoteMessage.data; //check this
          } else {
            notification = remoteMessage.notification;
          }
    
          onNotification(notification);
        }
      });*/
    }
    
    unRegister = () => {
      //return () => this.messageListener();
    }
    
    registerAppWithFCM = async () => {
      if (Platform.OS === 'ios') {
        await reactfirebasemessaging().registerDeviceForRemoteMessages();
        await reactfirebasemessaging().setAutoInitEnabled(true);
      }
    }
    
    requestNotificationPermissions = () => {
      reactfirebasemessaging().requestPermission();
    }
  }
  
  export const fcmService = new FCMService()