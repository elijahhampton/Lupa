/* Please do not remove this line as it prevents the Cannot Find Variable: Buffer error */
//global.Buffer = global.Buffer || require('buffer').Buffer
import LUPA_DB from '../firebase/firebase.js';

import UserController from './UserController';
import PacksController from './PacksController';
import SessionController from './SessionController';
import { getLupaNotificationStructure } from '../firebase/collection_structures';

let USER_CONTROLLER_INSTANCE;

let NOTIFICATIONS_COLLECTION = LUPA_DB.collection('notifications');

export default class NotificationsController {
    private static _instance : NotificationsController;

    private constructor() {
      USER_CONTROLLER_INSTANCE = UserController.getInstance();
    }

    public static getInstance() {
      if (!NotificationsController._instance)
      {
        NotificationsController._instance = new NotificationsController();
        return NotificationsController._instance;
      }

      return NotificationsController._instance;
    }

    public createNotification(user, date, time, type, data) {
        let lupaNotification = getLupaNotificationStructure(user, date, time, type, data);
        NOTIFICATIONS_COLLECTION.doc(user).set({notifications: [lupaNotification]}, { merge: true });
    }

    public deleteNotification(notification) {

    }

    public async getNotificationsFromUUID(uuid) {
        console.log('notifications');
        let result;
        await NOTIFICATIONS_COLLECTION.doc(uuid).get().then(res => {
            result = res.data();
        })
        return Promise.resolve(result.notifications);
    }

}