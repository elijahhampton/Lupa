/* Please do not remove this line as it prevents the Cannot Find Variable: Buffer error */
//global.Buffer = global.Buffer || require('buffer').Buffer


import UserController from './UserController';
import PacksController from './PacksController';
import SessionController from './SessionController';
import NotificationsController from './NotificationsController';

import { NOTIFICATION_TYPES } from '../lupa/common/types'

import requestPermissionsAsync from './permissions/permissions';

let USER_CONTROLLER_INSTANCE;
let PACKS_CONTROLLER_INSTANCE;
let SESSION_CONTROLLER_INSTANCE;
let NOTIFICATIONS_CONTROLLER_INSTANCE;

export default class LupaController {
    private static _instance : LupaController;

    private constructor() {
      USER_CONTROLLER_INSTANCE = UserController.getInstance();
      PACKS_CONTROLLER_INSTANCE = PacksController.getInstance();
      SESSION_CONTROLLER_INSTANCE = SessionController.getInstance();
      NOTIFICATIONS_CONTROLLER_INSTANCE = NotificationsController.getInstance();
    }

    public static getInstance() {
      if (!LupaController._instance)
      {
        LupaController._instance = new LupaController();
        return LupaController._instance;
      }

      return LupaController._instance;
    }

    private static notifications = [];

    /************************/

    runAppSetup = () => {
      requestPermissionsAsync();
      this.indexApplicationData();
    }

    /********************** */
    getNotifications = async () => {
      let result;
      await NOTIFICATIONS_CONTROLLER_INSTANCE.getNotificationsFromUUID(this.getCurrentUser().uid).then(res => {
        result = res;
      });
      console.log('innnn lupa controller' + result);
      return Promise.resolve(result);
    }

    addNotification = (user, date, time, type, data) => {
      NOTIFICATIONS_CONTROLLER_INSTANCE.createNotification(user, date, time, type, data);
    }

    getCurrentUser = () => {
      let currentUser = USER_CONTROLLER_INSTANCE.getCurrentUser();
      return currentUser;
    }

    isTrainer = (userUUID) => {
      let isTrainer = USER_CONTROLLER_INSTANCE.isTrainer(userUUID);
      return isTrainer;
    }

    updateCurrentUser = (fieldToUpdate, value, optionalData) => {
      //validate data
      
      //pass to usercontroller
      USER_CONTROLLER_INSTANCE.updateCurrentUser(fieldToUpdate, value, optionalData);
    }

    getUserDisplayName = () => {
      return USER_CONTROLLER_INSTANCE.getUserDisplayName(true);
    }

    getUserPhotoURL = () => {
      return USER_CONTROLLER_INSTANCE.getUserPhotoURL(true);
    }

    createNewSession = async (attendeeOne, userInvited, time, day, location, name, description) => {
      let sessionData = await SESSION_CONTROLLER_INSTANCE.createSession(attendeeOne, userInvited, time, day, location, name, description);
      this.addNotification(userInvited, new Date(), new Date().getTime(), "", sessionData);
    }

    getUserSessions = (currUser=true, uid=undefined) => {
      return SESSION_CONTROLLER_INSTANCE.getUserSessions(currUser, uid);
    }

    getAttributeFromUUID = async (uuid, attribute) => {
      let result;
      await USER_CONTROLLER_INSTANCE.getAttributeFromUUID(uuid, attribute).then(res => {
        result = res;
      });
      return result;
    }

    getUUIDFromDisplayName  = async (displayName) => {
      let result;
      await USER_CONTROLLER_INSTANCE.getUserInformationFromDisplayName(displayName).then(snapshot => {
        result = snapshot.data();
      })

      let userUUID = result.uid;
      return userUUID;
    }
    /********************** */

    /* Algolia */
    indexApplicationData = () => {
      console.log('Indexing all application data');
      USER_CONTROLLER_INSTANCE.indexUsersIntoAlgolia();
      PACKS_CONTROLLER_INSTANCE.indexPacksIntoAlgolia();
    }

    indexUsers = async () => {
      await  USER_CONTROLLER_INSTANCE.indexUsersIntoAlgolia();
    }

    indexPacks = async() => {
      await PACKS_CONTROLLER_INSTANCE.indexPacksIntoAlgolia();
    }

    /* User Functions */
    searchUserByPersonalName = async (searchQuery='') => {
      let arr;
      await USER_CONTROLLER_INSTANCE.searchByRealName(searchQuery).then(objs => {
        arr = objs;
      })
      return arr;
    }

    followUser = (uuidOfUserToFollow, uuidOfUserFollowing) => {
      USER_CONTROLLER_INSTANCE.followAccountFromUUID(uuidOfUserToFollow, uuidOfUserFollowing);
      USER_CONTROLLER_INSTANCE.addFollowerToUUID(uuidOfUserToFollow, uuidOfUserFollowing);
    }

    /* Session Functions */
    getSessionInformationByUUID = async (uuid) => {
      let retVal;
      await SESSION_CONTROLLER_INSTANCE.getSessionInformationByUUID(uuid).then(result => {
        retVal = result;
      });

      return retVal;
    }

    updateSession = (uuid, fieldToUpdate, value, optionalData="") => {
      SESSION_CONTROLLER_INSTANCE.updateSessionFieldByUUID(uuid, fieldToUpdate, value, optionalData);
    }

    /* Pack Functions */
    getCurrentUserPacks = async () => {
      let userPacks;
      
      //Get all packs for the current user
      await PACKS_CONTROLLER_INSTANCE.getCurrentUserPacks().then(currUserPacksData => {
        userPacks = currUserPacksData;
      });

      return userPacks;
    }
}