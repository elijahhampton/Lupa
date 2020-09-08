import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';

class LocalNotificationService {
    configure = (onOpenNotification) => {
        alert('trying to configure')
        PushNotification.configure({
            onRegister: function(token) {
               
            },
            onNotification: function(notification) {
                if (!notification?.data) {
                    return;
                }
                notification.userInteraction = true;
                onOpenNotification(Platform.OS === 'ios' ? notification.data.item : notification.data);

                //Only call callback if not from foreground
                if (Platform.OS === 'ios') {
                    notification.finish(PushNotificationIOS.FetchResult.NoData);
                }
            },
            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },
            popInitialNotification: true,
            requestPermissions: true
        })
    }

    unregister = () => {
        PushNotification.unregister()
    }

    showNotification = (id, title, message, data={}, options={}) => {
        PushNotification.localNotification({
            ...this.buildIOSNotification(id, title, message, data, options),
            title: title || "",
            message: message || '',
            playSound: options.playSound || false,
            soundName: options.soundName || 'default',
            userInteraction: false,
        });
    }

    buildIOSNotification = (id, title, message, data={}, options={}) => {
        console.log('Build ios notification')
        return {
            alertAction: options.alertAction || 'view',
            category: options.category || "",
            userInfo: {
                id: id,
                item: data,
            }
        }
    }

    cancelAllLocalNotifications = () => {
        if (Platform.OS === 'ios') {
            PushNotificationIOS.removeAllDeliveredNotifications();
        } else {
            PushNotification.cancelAllLocalNotifications()
        }
    }
}

export const localNotificationService = new LocalNotificationService();