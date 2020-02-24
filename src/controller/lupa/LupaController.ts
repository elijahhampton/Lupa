/* Please do not remove this line as it prevents the Cannot Find Variable: Buffer error */
//global.Buffer = global.Buffer || require('buffer').Buffer


import UserController from './UserController';
import PacksController from './PacksController';
import SessionController from './SessionController';

import LUPA_DB, { LUPA_AUTH} from '../firebase/firebase.js';


import requestPermissionsAsync from './permissions/permissions';
import { rejects } from 'assert';
import WorkoutController from './WorkoutController';

const algoliasearch = require('algoliasearch/reactnative.js');
const algoliaIndex = algoliasearch("EGZO4IJMQL", "f0f50b25f97f17ed73afa48108d9d7e6");
const packsIndex = algoliaIndex.initIndex("dev_PACKS");
const algoliaUsersIndex = algoliasearch("EGZO4IJMQL", "f0f50b25f97f17ed73afa48108d9d7e6");
const usersIndex = algoliaUsersIndex.initIndex("dev_USERS");

let USER_CONTROLLER_INSTANCE;
let PACKS_CONTROLLER_INSTANCE;
let SESSION_CONTROLLER_INSTANCE;
let NOTIFICATIONS_CONTROLLER_INSTANCE;
let WORKOUT_CONTROLLER_INSTANCE;


export default class LupaController {
    private static _instance : LupaController;

    private constructor() {
      USER_CONTROLLER_INSTANCE = UserController.getInstance();
      PACKS_CONTROLLER_INSTANCE = PacksController.getInstance();
      SESSION_CONTROLLER_INSTANCE = SessionController.getInstance();
      WORKOUT_CONTROLLER_INSTANCE = WorkoutController.getInstance();
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
      return Promise.resolve(result);
    }

    addNotification = (user, date, time, type, data) => {
      NOTIFICATIONS_CONTROLLER_INSTANCE.createNotification(user, date, time, type, data);
    }

    isUsernameTaken = async (val) => {
      let isTaken;
      USER_CONTROLLER_INSTANCE.isUsernameTaken(val).then(result => {
        isTaken = result;
      })

      return Promise.resolve(isTaken);
    }

    getCurrentUser = () => {
      let currentUser = USER_CONTROLLER_INSTANCE.getCurrentUser();
      return currentUser;
    }

    getCurrentUserData = async () => {
      let userData;
      await USER_CONTROLLER_INSTANCE.getCurrentUserData().then(result => {
        userData = result;
      });

      return Promise.resolve(userData);
    }

    getCurrentUserHealthData = async () => {
      let healthData;
      await USER_CONTROLLER_INSTANCE.getCurrentUserHealthData().then(result => {
        healthData = result;
      });

      return Promise.resolve(healthData);
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

    createNewSession = async (attendeeOne, attendeeTwo, requesterUUID, date, time_periods, name, description, timestamp) => {
      await SESSION_CONTROLLER_INSTANCE.createSession(attendeeOne, attendeeTwo, requesterUUID, date, time_periods, name, description, timestamp);
    }

    getUserSessions = (currUser=true, uid=undefined) => {
      return SESSION_CONTROLLER_INSTANCE.getUserSessions(currUser, uid);
    }

    getUserInformationFromArray = async (arrOfUUIDS) => {
      let result;
      await USER_CONTROLLER_INSTANCE.getArrayOfUserObjectsFromUUIDS(arrOfUUIDS).then(objs => {
        result = objs;
      });

      return result;
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

    /** Pack Functions */
    createNewPack = (packLeader, title, description, location, image, members, invitedMembers, rating, sessionsCompleted, timeCreated, isSubscription, isDefault) => {
      //validate data

      //call packs controller to create pack
      PACKS_CONTROLLER_INSTANCE.createPack(packLeader, title, description, location, image, members, invitedMembers, rating, sessionsCompleted, timeCreated, isSubscription, isDefault);
    }

    createNewPackEvent = (packUUID, title, description, date, eventImage) => {
      //validate data

      //call pack controller to create new event
      PACKS_CONTROLLER_INSTANCE.createPackEvent(packUUID, title, description, date, eventImage);
    }

    getSubscriptionPacksBasedOnLocation = async location => {
      let subscriptionBasedPacks;
      await PACKS_CONTROLLER_INSTANCE.getSubscriptionPacksBasedOnLocation(location).then(result => {
        subscriptionBasedPacks = result;
      });

      return Promise.resolve(subscriptionBasedPacks);
    }

    /* User Functions */
    getTrainersBasedOnLocation = async location => {
      let trainersNearby;
      await USER_CONTROLLER_INSTANCE.getNearbyUsers(location).then(result => {
        trainersNearby = result;
      });

      return Promise.resolve(trainersNearby);
    }
    getUsersBasedOnLocation = async location => {
      let nearbyUsers
      await USER_CONTROLLER_INSTANCE.getNearbyUsers(location).then(result => {
        nearbyUsers = result;
      });

      return Promise.resolve(nearbyUsers);
    }
    getUserInformationByUUID = async (uuid) => {
      let userResult;
      await USER_CONTROLLER_INSTANCE.getUserInformationByUUID(uuid).then(result => {
        userResult = result;
      });

      return Promise.resolve(userResult)
    }

    getPackInformationByUserUUID = async (uuid) => {
      let userResult;
      await PACKS_CONTROLLER_INSTANCE.getPackInformationByUserUUID(uuid).then(result => {
        userResult = result;
      });

      return Promise.resolve(userResult)
    }

    /**
     * search
     * Performs search queries on all indices through algolia
     * @param searchQuery The query to search for
     * @return returns a promise with an array of objects that matched the query.
     * 
     * TODO: Save only necessary information into an object before pushing into final results array.
     */
    search = (searchQuery) => {
      let finalResults = new Array();

      const queries = [{
        indexName: 'dev_USERS',
        query: searchQuery,
        params: {
          hitsPerPage: 10
        }
      }, {
        indexName: 'dev_PACKS',
        query: searchQuery,
        params: {
          hitsPerPage: 10,
        }
      }];

      return new Promise((resolve, rejects) => {
                // perform 3 queries in a single API
                let finalResults = new Array();
      //  - 1st query targets index `categories`
      //  - 2nd and 3rd queries target index `products`
      algoliaIndex.search(queries, (err, { results = {}}) => {
        if (err) rejects(err);
      
        const userResults = results[0];
        const packResults = results[1];

        //add the results we want from each into our final results array
        for (let i = 0; i < userResults.hits.length; ++i)
        {
          userResults.hits[i].isTrainer == true ?  userResults.hits[i].resultType="trainer" :  userResults.hits[i].resultType="user"
          if (userResults.hits[i]._highlightResult.display_name.matchLevel == "full" || userResults.hits[i]._highlightResult.username.matchLevel == "full" 
          || userResults.hits[i]._highlightResult.email.matchLevel == "full")
          {
            finalResults.push(userResults.hits[i]);
          }
        }

        for (let i = 0; i < packResults.hits.length; ++i)
        {
          packResults.hits[i].resultType = "pack"
          if (packResults.hits[i]._highlightResult.pack_title.matchLevel == "full")
          {
            finalResults.push(packResults.hits[i]);
          }
        }

        resolve(finalResults);
      });
      })
    
    }

    followUser = (uuidOfUserToFollow, uuidOfUserFollowing) => {
      USER_CONTROLLER_INSTANCE.followAccountFromUUID(uuidOfUserToFollow, uuidOfUserFollowing);
      USER_CONTROLLER_INSTANCE.addFollowerToUUID(uuidOfUserToFollow, uuidOfUserFollowing);
    }

    unfollowUser = (uuidofUserToUnfollow, uuidOfUserUnfollowing) => {
      USER_CONTROLLER_INSTANCE.unfollowAccountFromUUID(uuidofUserToUnfollow, uuidOfUserUnfollowing);
      USER_CONTROLLER_INSTANCE.removeFollowerFromUUID(uuidofUserToUnfollow, uuidOfUserUnfollowing)
    }

    getAllTrainers = async () => {
      let trainers;
      await USER_CONTROLLER_INSTANCE.getTrainers().then(result => {
        trainers = result;
      });

      return Promise.resolve(trainers);
    }

    /* Session Functions */
    getSessionInformationByUUID = async (uuid) => {
      let retVal;
      await SESSION_CONTROLLER_INSTANCE.getSessionInformationByUUID(uuid).then(result => {
        retVal = result;
      });

      return retVal;
    }

    updateSession = async (uuid, fieldToUpdate, value, optionalData="") => {
      await SESSION_CONTROLLER_INSTANCE.updateSessionFieldByUUID(uuid, fieldToUpdate, value, optionalData);
    }

    /* Pack Functions */
    /***************************Explore Page Pack Function  ****************************/

    getExplorePagePacksBasedOnLocation = async location => {
      let explorePagePacks;
      await PACKS_CONTROLLER_INSTANCE.getExplorePagePacksBasedOnLocation(location).then(result => {
        explorePagePacks = result;
      });

      return Promise.resolve(explorePagePacks);
    }

    /***********************************************************************************/
    getCurrentUserPacks = async () => {
      let userPacks;
      
      //Get all packs for the current user
      await PACKS_CONTROLLER_INSTANCE.getCurrentUserPacks().then(currUserPacksData => {
        userPacks = currUserPacksData;
      });

      return userPacks;
    }

    getSubscriptionPacks = async () => {
      let result;
      await PACKS_CONTROLLER_INSTANCE.getSubscriptionBasedPacks().then(packs => {
        result = packs;
      });

      return result;
    }

    getExplorePagePacks = async () => {
      let result;
      await PACKS_CONTROLLER_INSTANCE.getExplorePagePacks().then(packs => {
        result = packs;
      });

      return result;
    }

    getDefaultPacks = async () => {
      let result;

      await PACKS_CONTROLLER_INSTANCE.getDefaultPacks().then(packs => {
        result = packs;
      });

      return result;
    }

    requestToJoinPack = (userUUID, packUUID) => {
      PACKS_CONTROLLER_INSTANCE.requestToJoinPack(userUUID, packUUID);
    }

    acceptPackInviteByPackUUID = (packUUID, userUUID) => {
      PACKS_CONTROLLER_INSTANCE.acceptPackInviteByPackUUID(packUUID, userUUID);
    } 

    declinePackInviteByPackUUID = (packUUID, userUUID) => {
      PACKS_CONTROLLER_INSTANCE.declinePackInviteByPackUUID(packUUID, userUUID);
    }

    getPackInvitesFromUUID = async (uuid) => {
      let packInvites = [];
      await PACKS_CONTROLLER_INSTANCE.getPackInvitesFromUUID(uuid).then(result => {
        packInvites = result;
      });

      return Promise.resolve(packInvites);
    }

    getPackInformationByUUID = async (uuid) => {
      let result = [];
      await PACKS_CONTROLLER_INSTANCE.getPackInformationByUUID(uuid).then(packs => {
        result = packs;
      });

      return Promise.resolve(result);
    }

    getPackEventsByUUID = async (id) => {
      let result = new Array();
      await PACKS_CONTROLLER_INSTANCE.getPackEventsByUUID(id).then(packs => {
        result = packs;
      });

      return Promise.resolve(result);
    }

    removeUserFromPackByUUID = (packUUID, userUUID) => {
      PACKS_CONTROLLER_INSTANCE.removeUserFromPackByUUID(packUUID, userUUID);
    }

    setUserAsAttendeeForEvent = (packEventUUID, packEventTitle, userUUID) => {
      PACKS_CONTROLLER_INSTANCE.attendPackEvent(packEventUUID, packEventTitle, userUUID);
    }

    removeUserAsAttendeeForEvent = (packEventUUID, packEventTitle, userUUID) => {
      PACKS_CONTROLLER_INSTANCE.unattendPackEvent(packEventUUID, packEventTitle, userUUID);
    }

    userIsAttendingPackEvent = async (packEventUUID, packEventTitle, userUUID) => {
      let result;
      await PACKS_CONTROLLER_INSTANCE.isAttendingPackEvent(packEventUUID, packEventTitle, userUUID).then(bool => {
        result = bool;
      });

      return Promise.resolve(result);
    }

    getPacksEventsFromArrayOfUUIDS = async (arr) => {
      let packEventsData;
      await PACKS_CONTROLLER_INSTANCE.getPacksEventsFromArrayOfUUIDS(arr).then(result => {
        packEventsData = result;
      });

      return Promise.resolve(packEventsData);
    }

    /** Goals **/
    addGoalForCurrentUser = (goalUUID) => {
      USER_CONTROLLER_INSTANCE.updateCurrentUser('goals', goalUUID, 'add');
    }

    removeGoalForCurrentUser = (goalUUID) => {
      USER_CONTROLLER_INSTANCE.updateCurrentUser('goals', goalUUID, 'remove');
    }

    /** Workouts **/
    getWorkoutDataFromUUID = async (uuid) => {
      let workoutData;
      await WORKOUT_CONTROLLER_INSTANCE.getWorkoutDataFromUUID(uuid).then(async result => {
        workoutData = await result;
      });

      return Promise.resolve(workoutData);
    }
}