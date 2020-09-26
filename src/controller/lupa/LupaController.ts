import UserController from './UserController';
import PacksController from './PacksController';
import SessionController from './SessionController';
import ProgramController from './ProgramController';

import LUPA_DB, { LUPA_AUTH} from '../firebase/firebase.js';
import WorkoutController from './WorkoutController';
import { getLupaProgramInformationStructure } from '../../model/data_structures/programs/program_structures';
import { getLupaUserStructure } from '../firebase/collection_structures';
import { getLupaWorkoutInformationStructure } from '../../model/data_structures/workout/workout_collection_structures';

const algoliasearch = require('algoliasearch/reactnative.js');
const algoliaIndex = algoliasearch("EGZO4IJMQL", "f0f50b25f97f17ed73afa48108d9d7e6");
const packsIndex = algoliaIndex.initIndex("dev_PACKS");
const algoliaUsersIndex = algoliasearch("EGZO4IJMQL", "f0f50b25f97f17ed73afa48108d9d7e6");
const usersIndex = algoliaUsersIndex.initIndex("dev_USERS");

let USER_CONTROLLER_INSTANCE;
let PACKS_CONTROLLER_INSTANCE;
let SESSION_CONTROLLER_INSTANCE;
let NOTIFICATIONS_CONTROLLER_INSTANCE;
let PROGRAMS_CONTROLLER_INSTANCE;


export default class LupaController {
    private static _instance : LupaController;

    private constructor() {
       USER_CONTROLLER_INSTANCE = UserController.getInstance();
      PACKS_CONTROLLER_INSTANCE = PacksController.getInstance();
       SESSION_CONTROLLER_INSTANCE = SessionController.getInstance();
       PROGRAMS_CONTROLLER_INSTANCE = ProgramController.getInstance();
    }

    public static getInstance() {
      if (!LupaController._instance)
      {
        LupaController._instance = new LupaController();
        return LupaController._instance;
      }

      return LupaController._instance;
    }

    generateCuratedTrainers = async (uuid, attributes) => {
        let retVal = [];
        await USER_CONTROLLER_INSTANCE.generateCuratedTrainers(uuid, attributes).then(data => {
          retVal = data;
        });

        return Promise.resolve(retVal);
    }

    isUserLoggedIn = async () => {
      let result;
      await LUPA_AUTH.currentUser == null ? result = false : result = true
    return result;
    }

    saveVlogMedia = async (mediaURI) => {
      let url;
      await USER_CONTROLLER_INSTANCE.saveVlogMedia(mediaURI).then(result => {
        url = result;
      })

      return Promise.resolve(url);
    }

    /***************** Firebase Storage *********** */
    saveUserProfileImage = async (imageURI) => {
      let url;

      await USER_CONTROLLER_INSTANCE.saveUserProfileImage(imageURI).then(result => {
        url = result;
      });

      return Promise.resolve(url);
    }

    savePackImage = async (string, uuid) => {
      let url;
      await PACKS_CONTROLLER_INSTANCE.savePackImage(string, uuid).then(data => {
        url = data;
      });

      return Promise.resolve(url);
    }

    savePackEventImage = (string, uuid) => {
      PACKS_CONTROLLER_INSTANCE.savePackEventImage(string, uuid);
    }

    getPackImageFromUUID = async (uuid) => {
      let link;
      await PACKS_CONTROLLER_INSTANCE.getPackImageFromUUID(uuid).then(result => {
        link = result;
      });

      return Promise.resolve(link);
    }

    getPackEventImageFromUUID = async (uuid) => {
      let link;
      await PACKS_CONTROLLER_INSTANCE.getPackEventImageFromUUID(uuid).then(result => {
        link = result;
      });

      return Promise.resolve(link);
    }
    /***************************** */

    /***********  App IO *************/

    runAppSetup = () => {
      this.indexApplicationData();
    }

    addLupaTrainerVerificationRequest = (uuid, certification, cert_number) => {
      let certInformation = {uuid, certification, cert_number};
      LUPA_DB.collection('trainer_request').doc(uuid).set(certInformation);
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

    getCurrentUserData = async (uuid=0) => {
      let userData = {}
      await USER_CONTROLLER_INSTANCE.getCurrentUserData(uuid).then(result => {
        userData = result;
      });

      return Promise.resolve(userData);
    }

    updatePack = (packID, attribute, value, optionalData=[]) => {
      PACKS_CONTROLLER_INSTANCE.updatePack(packID, attribute, value, optionalData);
    }

    updatePackEvent = (eventUUID, attribute, value, optionalData=[]) => {
      PACKS_CONTROLLER_INSTANCE.updatePackEvent(eventUUID, attribute, value, optionalData);
    }

    updateCurrentUser = (fieldToUpdate, value, optionalData) => {
      //validate data

      //pass to usercontroller
      USER_CONTROLLER_INSTANCE.updateCurrentUser(fieldToUpdate, value, optionalData);
    }

    updateProgramData = (programUUID, programData) => {
      PROGRAMS_CONTROLLER_INSTANCE.updateProgramData(programUUID, programData);
    }

    updateProgramWorkoutData = (programUUID, workoutData) => {
      PROGRAMS_CONTROLLER_INSTANCE.updateProgramWorkoutData(programUUID, workoutData);
    }

    updateWorkoutInformation = (workoutUUID, workoutData) =>  {
      PROGRAMS_CONTROLLER_INSTANCE.updateWorkoutInformation(workoutUUID, workoutData);
    }

    updateWorkoutData = (workoutUUID, workoutData) => {
      PROGRAMS_CONTROLLER_INSTANCE.updateWorkoutData(workoutUUID, workoutData);
    }



    completeSession = async (uuid) => {
      await SESSION_CONTROLLER_INSTANCE.completeSession(uuid);
    }

    addUserSessionReview = async (sessionUUID, userReviewingUUID, userToReviewUUID, reviewText, dateSubmitted) => {
      let retVal;
      await SESSION_CONTROLLER_INSTANCE.addUserSessionReview(sessionUUID, userReviewingUUID, userToReviewUUID, reviewText, dateSubmitted).then(res => {
        retVal = res;
      });

      return Promise.resolve(retVal);
    }

    createNewSession = async (attendeeOne, attendeeTwo, requesterUUID, date, time_periods, name, description, timestamp, locationData) => {
      await SESSION_CONTROLLER_INSTANCE.createSession(attendeeOne, attendeeTwo, requesterUUID, date, time_periods, name, description, timestamp, locationData);
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

    /********************** */

    /* Algolia */
    indexApplicationData = () => {
     //USER_CONTROLLER_INSTANCE.indexUsersIntoAlgolia();
      USER_CONTROLLER_INSTANCE.indexProgramsIntoAlgolia();
    }

    indexUsers = async () => {
     // await  USER_CONTROLLER_INSTANCE.indexUsersIntoAlgolia();
    }

    indexPacks = async () => {
      //await PACKS_CONTROLLER_INSTANCE.indexPacksIntoAlgolia();
    }

    indexPrograms = async () => {
      //await USER_CONTROLLER_INSTANCE.indexProgramsIntoAlgolia();
    }

    /** Pack Functions */
    createNewPack = async (packLeader, title, description, location, image, members, invitedMembers, rating, sessionsCompleted, timeCreated, isSubscription, isDefault, packImageSource, packVisibility) => {
      //validate data
      //call packs controller to create pack
      const packData = await PACKS_CONTROLLER_INSTANCE.createPack(packLeader, title, description, location, image, members, invitedMembers, rating, sessionsCompleted, timeCreated, isSubscription, isDefault, packImageSource, packVisibility);

      return Promise.resolve(packData);
    }

    createNewPackEvent = async (packUUID, title, description, date, eventImage) => {
      //validate data
      let payload;
      //call pack controller to create new event
      await PACKS_CONTROLLER_INSTANCE.createPackEvent(packUUID, title, description, date, eventImage).then(data => {
        payload = data;
      });

      return Promise.resolve(payload);
    }

    inviteUserToPacks = (packs, userUUID) => {
      //If the user didn't select any packs then there is no work to be done and we can just exit the function
      if (packs.length == 0)
      {
        return;
      }

      PACKS_CONTROLLER_INSTANCE.inviteUserToPacks(packs, userUUID);
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
      await USER_CONTROLLER_INSTANCE.getNearbyTrainers(location).then(result => {
        trainersNearby = result;
      });
      return Promise.resolve(trainersNearby);
    }
    getUsersBasedOnLocation = async location => {
      let nearbyUsers = [];
      await USER_CONTROLLER_INSTANCE.getNearbyUsers(location).then(result => {
        nearbyUsers = result;
      });

      return Promise.resolve(nearbyUsers);
    }
    getUserInformationByUUID = async (uuid) => {
      let userResult = getLupaUserStructure()

      if (typeof(uuid) == 'undefined') {
        return Promise.resolve(userResult);
      }

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
     *
     */
    searchPrograms = async searchQuery => {
      const queries = [{
        indexName: 'dev_Programs',
        query: searchQuery,
        params: {
          hitsPerPage: 5,
        }
      }];

      return new Promise((resolve, rejects) => {
                let finalResults = new Array();

      algoliaIndex.search(queries).then(({results}) => {
        const programResults = results[0];

        try {
        for (let i = 0; i < programResults.hits.length; ++i)
        {
            finalResults.push(programResults.hits[i]);
        }
        } catch(err)
        {
          alert(err)
        }

        resolve(finalResults);
      })
      })
    }

    /**
     *
     * @param searchQuery
     */
    searchTrainersAndPrograms = (searchQuery) => {
      const queries = [{
        indexName: 'dev_USERS',
        query: searchQuery,
        params: {
          hitsPerPage: 5
        }
      }, {
        indexName: 'dev_Programs',
        query: searchQuery,
        params: {
          hitsPerPage: 5,
        }
      }];

      return new Promise((resolve, rejects) => {
                // perform 3 queries in a single API
                let finalResults = new Array();
      //  - 1st query targets index `categories`
      //  - 2nd and 3rd queries target index `products`

      algoliaIndex.search(queries).then(({results}) => {
        const userResults = results[0];
        const programResults = results[1];

        try {
                  //add the results we want from each into our final results array
        for (let i = 0; i < userResults.hits.length; ++i)
        {
           if (userResults.hits[i].isTrainer == true)
           {
            if (userResults.hits[i]._highlightResult.display_name.matchLevel == "full"
            || userResults.hits[i]._highlightResult.username.matchLevel == "full")
            {
              userResults.hits[i].resultType = "User"
              finalResults.push(userResults.hits[i]);
            }
           }
        }

        for (let i = 0; i < programResults.hits.length; ++i)
        {
          programResults.hits[i].resultType = "Program"
            finalResults.push(programResults.hits[i]);
        }
        } catch(err)
        {
          alert(err)
        }

        resolve(finalResults);
      })
      })
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
     /* let finalResults = new Array();

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

        try {
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
        } catch(err)
        {

        }

        resolve(finalResults);
      });
      })*/

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

    getActivePacksBasedOnLocation = async (location) => {
      let explorePagePacks;
      await PACKS_CONTROLLER_INSTANCE.getActivePacksBasedOnLocation(location).then(result => {
        explorePagePacks = result;
      });

      return Promise.resolve(explorePagePacks);
    }

    getCommunityPacksBasedOnLocation = async (location) => {
      let explorePagePacks;
      await PACKS_CONTROLLER_INSTANCE.getCommunityPacksBasedOnLocation(location).then(result => {
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

    getCurrentUserDefaultPacks = async () => {
      let defaultPacks = [];
      await PACKS_CONTROLLER_INSTANCE.getCurrentUserDefaultPacks().then(result => {
        defaultPacks = result;
      });

      return Promise.resolve(defaultPacks)

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

      if (id != undefined)
      {
        await PACKS_CONTROLLER_INSTANCE.getPackEventsByUUID(id).then(packs => {
          result = packs;
        });
      }

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

    createNewProgram = async (uuid) => {
     USER_CONTROLLER_INSTANCE.createProgram(uuid)
    }

    createNewWorkout = async (uuid) => {
      PROGRAMS_CONTROLLER_INSTANCE.createWorkout(uuid);
    }

    publishProgram = (uuid) => {
      PROGRAMS_CONTROLLER_INSTANCE.publishProgram(uuid);
    }

    publishWorkout = (uuid, dateString) => {
      PROGRAMS_CONTROLLER_INSTANCE.publishWorkout(uuid, dateString);
    }

    saveProgram = async (programUUID) => {

      let res;
       await USER_CONTROLLER_INSTANCE.saveProgram(programUUID).then(result => {
        res = result;
       })

       return Promise.resolve(res);
    }

    saveWorkout = async (workoutUUID) => {
      let res;
      await USER_CONTROLLER_INSTANCE.saveWorkout(workoutUUID).then(result => {
        res = result;
      });

      return Promise.resolve(res);
    }

    deleteUserProgram = async (programUUID, userUUID) => {
      await USER_CONTROLLER_INSTANCE.deleteUserProgram(programUUID, userUUID);
    }

    handleSendUserProgram = (currUserData, userList, program) => {

      try {
        USER_CONTROLLER_INSTANCE.handleSendUserProgram(currUserData, userList, program);
          } catch(err) {
            alert(err)
        }
    }

    deleteProgram = async (user_uuid, programUUID) => {
      await USER_CONTROLLER_INSTANCE.deleteProgram(user_uuid, programUUID);
    }

    deleteWorkout = async (user_uuid, workoutUUID) => {
      await USER_CONTROLLER_INSTANCE.deleteWorkout(user_uuid, workoutUUID);
    }

    eraseProgram = (uuid) => {
      PROGRAMS_CONTROLLER_INSTANCE.eraseProgram(uuid);
    }

    eraseWorkout = (uuid) => {
      PROGRAMS_CONTROLLER_INSTANCE.deleteWorkout(uuid);
    }

    loadCurrentUserPrograms = async () => {
      let programsData = []

      await USER_CONTROLLER_INSTANCE.loadCurrentUserPrograms().then(result => {
        programsData = result;
      })

      return Promise.resolve(programsData);
    }

    loadWorkouts = () => {
      let workoutData = PROGRAMS_CONTROLLER_INSTANCE.loadWorkouts();
      return workoutData;
    }

    getAllUserPrograms = async (uuid) => {
      let retVal = [];

      if (typeof(uuid) == 'undefined' || uuid == null) {
        return Promise.resolve([])
      }
      
      await PROGRAMS_CONTROLLER_INSTANCE.getAllUserPrograms(uuid).then(data => {
        retVal = data;
      })

      return Promise.resolve(retVal)
    }

    getPrivateChatUUID = async (currUserUUID, userTwo) => {
      let result;
      await USER_CONTROLLER_INSTANCE.getPrivateChatUUID(currUserUUID, userTwo).then(chatUUID => {
        result = chatUUID;
      });

      return Promise.resolve(result);
    }

    getAllCurrentUserChats = async () => {
      let result;
      await USER_CONTROLLER_INSTANCE.getAllCurrentUserChats().then(chats => {
        result = chats;
      });

      return Promise.resolve(result);
    }

    getSuggestedTrainers = async () => {
      let suggestedTrainers;

      await SESSION_CONTROLLER_INSTANCE.getSuggestedTrainers().then(trainers => {
        suggestedTrainers = trainers;
      });

      return Promise.resolve(suggestedTrainers);
    }

    getUpcomingSessions = async (isCurrentUser, user_uuid) => {
      let upcomingSessions;
      await SESSION_CONTROLLER_INSTANCE.getUpcomingSessions(true, user_uuid).then(sessions => {
        upcomingSessions = sessions;
      });

      return Promise.resolve(upcomingSessions);
    }

        /* designing programs */
        saveProgramWorkoutGraphic = async (workout, programUUID, graphicType, uri) => {
          let newURI;
          await USER_CONTROLLER_INSTANCE.saveProgramWorkoutGraphic(workout, programUUID, graphicType, uri).then(res => {
            newURI = res;
          });

          return Promise.resolve(newURI);
      }

      getUserNotifications = async (uuid) => {
        if (typeof(uuid) == 'undefined' || typeof(uuid) != 'string') {
          return Promise.resolve([])
        }

       let queue = []

       await USER_CONTROLLER_INSTANCE.getUserNotificationsQueue(uuid).then(queueResults => {
        queue = queueResults;
        })

        return Promise.resolve(queue);
      }

      getFeaturedPrograms = async () => {
        let retVal = []

        await USER_CONTROLLER_INSTANCE.getFeaturedPrograms().then(result => {
          retVal = result;
        });

        return Promise.resolve(retVal);
      }

      getTopPicks = async () => {
        let topPicks = []

        try {
            await PROGRAMS_CONTROLLER_INSTANCE.getTopPicks().then(result => {
              topPicks = result;
            })
        }
        catch (err) {
            alert(err)
            topPicks = []
        }
        return Promise.resolve(topPicks)
      }

      getRecentlyAddedPrograms = async () => {
        let recentlyAddedPrograms = []

        try {
            await PROGRAMS_CONTROLLER_INSTANCE.getRecentlyAddedPrograms().then(result => {
              recentlyAddedPrograms = result
            })
        }
        catch (err) {
            alert(err)
            recentlyAddedPrograms = []
        }

        return Promise.resolve(recentlyAddedPrograms)
      }

      purchaseProgram = async (currUserData, programData) => {
        let updatedProgram;
        await USER_CONTROLLER_INSTANCE.purchaseProgram(currUserData, programData).then(retVal => {
          updatedProgram = retVal;
        })

        return Promise.resolve(updatedProgram)
      }

      /**
     * Returns an object representing a Lupa Program
     * See LupaProgramStructure
     *
     * @return Object representing a LupaProgramStructure
     */
    getProgramInformationFromUUID = async (uuid) => {
      let retVal = getLupaProgramInformationStructure()

      if (typeof uuid != 'string' || typeof(uuid) == 'undefined'){
        return Promise.resolve(retVal)
      }

      await PROGRAMS_CONTROLLER_INSTANCE.getProgramInformationFromUUID(uuid).then(result => {
        retVal = result;
      });

      return Promise.resolve(retVal);
    }

     /**
     * Returns an object representing a Lupa Workout
     * See LupaWorkoutStructure
     *
     * @return Object representing a LupaWorkoutStructure
     */
    getWorkoutInformationFromUUID = async (uuid) => {
      let retVal = getLupaWorkoutInformationStructure()

      if (typeof uuid != 'string' || typeof(uuid) == 'undefined'){
        return Promise.resolve(retVal)
      }

      await PROGRAMS_CONTROLLER_INSTANCE.getWorkoutInformationFromUUID(uuid).then(result => {
        retVal = result;
      });

      return Promise.resolve(retVal);
    }

    getPacksWithoutParticipatingUUID = async (userUUID) => {
      let data = []
      await PACKS_CONTROLLER_INSTANCE.getPacksWithoutParticipatingUUID(userUUID).then(result => {
        data = result;
      });

      return Promise.resolve(data);
    }

    changeTrainerHourlyRate = (rate) => {
      USER_CONTROLLER_INSTANCE.updateCurrentUser('hourly_payment_rate', rate, "", "");
    }

    submitCertificationNumber = (userUUID, certificationNumber) => {
      //send email ?

      //update user
      USER_CONTROLLER_INSTANCE.updateCurrentUser('isTrainer', true, userUUID, "")
    }

    publishVlog = (vlogStructure) => {
      if (typeof(vlogStructure) == 'undefined' || vlogStructure == null) {
        return;
      }

      USER_CONTROLLER_INSTANCE.saveVlog(vlogStructure);
    }

    deleteVlog = (userID, vlogID) => {
      if (typeof(userID) == 'undefined' || typeof(vlogID) == 'undefined') {
        return;
      }
      
      USER_CONTROLLER_INSTANCE.deleteVlog(userID, vlogID);
    }

    getAllUserVlogs = async (uuid) => {
      let retVal = [];
      await USER_CONTROLLER_INSTANCE.getAllUserVlogs(uuid).then(vlogs => {
        retVal = vlogs;
      });

      return Promise.resolve(retVal);
    }

    addSchedulerTime = (dateObject) => {
      if (typeof(dateObject) == 'undefined' || dateObject == null) {
        return;
      }

      USER_CONTROLLER_INSTANCE.updateCurrentUser('scheduler_times', dateObject, 'add')
    }

    deleteSchedulertimeBlock = (day, timeBlock) => {
      USER_CONTROLLER_INSTANCE.updateCurrentUser('scheduler_times', timeBlock, 'remove', day)
    }

    fetchDashboardData =  async () => {
      let retVal = {};
      await PROGRAMS_CONTROLLER_INSTANCE.fetchDashboardData().then(data => {
        retVal = data;
      });

      return Promise.resolve(retVal);
    }

    addProgramShare = (programUUID, numShares) => {
      if (typeof(programUUID) == 'undefined') {
        return;
      }

      PROGRAMS_CONTROLLER_INSTANCE.addProgramShare(programUUID, numShares)
    }

    addProgramView = (programUUID) => {
      if (typeof(programUUID) == 'undefined') {
        return;
      }

      PROGRAMS_CONTROLLER_INSTANCE.addProgramView(programUUID);
    }

    addProgramInteraction = (programUUID) => {
      if (typeof(programUUID) == 'undefined') {
        return;
      }

      PROGRAMS_CONTROLLER_INSTANCE.addProgramInteraction(programUUID);
    }

    handleStartProgram = async (userUUID, programUUID) => {
      await USER_CONTROLLER_INSTANCE.startProgram(userUUID, programUUID)
    }

    handleResetProgram = async (userUUID, programUUID) => {
      await USER_CONTROLLER_INSTANCE.resetProgram(userUUID, programUUID)
    }

    handleStopProgram = async (userUUID, programUUID) => {
      await USER_CONTROLLER_INSTANCE.stopProgram(userUUID, programUUID)
    }

    markProgramCompleted = (uuid) => {
      PROGRAMS_CONTROLLER_INSTANCE.markProgramCompleted(uuid);
    }
}
