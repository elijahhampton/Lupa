import UserController from './UserController';
import ProgramController from './ProgramController';

import LUPA_DB, { LUPA_AUTH} from '../firebase/firebase.js';
import WorkoutController from './WorkoutController';
import { getLupaProgramInformationStructure } from '../../model/data_structures/programs/program_structures';
import { getLupaUserStructure } from '../firebase/collection_structures';
import { getLupaWorkoutInformationStructure } from '../../model/data_structures/workout/workout_collection_structures';
import PackController from './PacksController';
import { initializeNewPack } from '../../model/data_structures/packs/packs';
import { CommunityEvent } from '../../model/data_structures/community/types';

const algoliasearch = require('algoliasearch/reactnative.js');
const algoliaIndex = algoliasearch("EGZO4IJMQL", "f0f50b25f97f17ed73afa48108d9d7e6");
const algoliaUsersIndex = algoliasearch("EGZO4IJMQL", "f0f50b25f97f17ed73afa48108d9d7e6");
const usersIndex = algoliaUsersIndex.initIndex("dev_USERS");

let USER_CONTROLLER_INSTANCE;
let NOTIFICATIONS_CONTROLLER_INSTANCE;
let PROGRAMS_CONTROLLER_INSTANCE;
let PACKS_CONTROLLER_INSTANCE;


export default class LupaController {
    private static _instance : LupaController;

    private constructor() {
       USER_CONTROLLER_INSTANCE = UserController.getInstance();
       PROGRAMS_CONTROLLER_INSTANCE = ProgramController.getInstance();
       PACKS_CONTROLLER_INSTANCE = PackController.getInstance();
    }

    public static getInstance() {
      if (!LupaController._instance)
      {
        LupaController._instance = new LupaController();
        return LupaController._instance;
      }

      return LupaController._instance;
    }

    generateCuratedTrainers = async (location: Object) => {
        let retVal = [];
        if (typeof(location) == 'undefined') {
          return Promise.resolve(retVal);
        }

        await USER_CONTROLLER_INSTANCE.generateCuratedTrainers(location).then(data => {
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

    saveProgramImage = async (programUUID, uri) => {
      let url = "";

      await PROGRAMS_CONTROLLER_INSTANCE.saveProgramImage(programUUID, uri).then(result => {
        url = result;
      });

      return Promise.resolve(url);
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

    getAttributeFromUUID = async (uuid : String, attribute : String) => {
      let retVal;
      await USER_CONTROLLER_INSTANCE.getAttributeFromUUID(uuid, attribute).then(data => {
        retVal = data;
      });

      return Promise.resolve(retVal);
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


    getUserInformationFromArray = async (arrOfUUIDS) => {
      let result = []
      await USER_CONTROLLER_INSTANCE.getArrayOfUserObjectsFromUUIDS(arrOfUUIDS).then(objs => {
        result = objs;
      });

      return result;
    }

    /********************** */

    /* Algolia */
    indexApplicationData = () => {
      USER_CONTROLLER_INSTANCE.indexUsersIntoAlgolia();
      USER_CONTROLLER_INSTANCE.indexProgramsIntoAlgolia();
    }

    indexUsers = async () => {
     // await  USER_CONTROLLER_INSTANCE.indexUsersIntoAlgolia();
    }



    indexPrograms = async () => {
      //await USER_CONTROLLER_INSTANCE.indexProgramsIntoAlgolia();
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
       
        }

        resolve(finalResults);
      })
      })
    }

    searchTrainersByDisplayName = (startsWith = '') : Promise<Array<Object>> => {
      
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
              userResults.hits[i].resultType = "User"
              console.log('CCCCCC')
              finalResults.push(userResults.hits[i]);
              console.log('@@@@@@@@@@@@@@@@')
              console.log(finalResults.length)
        }

        for (let i = 0; i < programResults.hits.length; ++i)
        {
          programResults.hits[i].resultType = "Program"
            finalResults.push(programResults.hits[i]);
            console.log('@@@@@@@@@@@@@@@@')
            console.log(finalResults.length)
        }

        } catch(err)
        {
      
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
      let finalResults = new Array();

      const queries = [{
        indexName: 'dev_USERS',
        query: searchQuery,
        params: {
          hitsPerPage: 10
        }
      }];

      return new Promise((resolve, rejects) => {
                // perform 3 queries in a single API
                let finalResults = new Array();
      //  - 1st query targets index `categories`
      //  - 2nd and 3rd queries target index `products`
      algoliaIndex.search(queries, async (err, { results = {}}) => {
        if (err) rejects(err);

        const userResults = results[0];

        try {
                  //add the results we want from each into our final results array
        for (let i = 0; i < userResults.hits.length; ++i)
        {
          userResults.hits[i].isTrainer == true ?  userResults.hits[i].resultType="trainer" :  userResults.hits[i].resultType="user"
          if (userResults.hits[i]._highlightResult.display_name.matchLevel == "full" || userResults.hits[i]._highlightResult.username.matchLevel == "full"
          || userResults.hits[i]._highlightResult.email.matchLevel == "full")
          {
            const uuid = userResults.hits[i]._highlightResult.user_uuid.value;
            await LUPA_DB.collection('users').doc(uuid).get().then(snapshot => {
              finalResults.push(snapshot.data());
            });
          }
        }

        } catch(err)
        {

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

    updateProgramImage = (programUUID, imageURI) => {
       PROGRAMS_CONTROLLER_INSTANCE.updateProgramImage(programUUID, imageURI);
    }

    updateProgramMetadata = async (programUUID, title, description, tags, image, price) => {
      let retVal = false;
      await PROGRAMS_CONTROLLER_INSTANCE.updateProgramMetadata(programUUID, title, description, tags, image, price).then(result => {
        retVal = result;
      }).catch(error => {
        retVal = false;
      });

      return Promise.resolve(retVal);
    }

    sendPackInvite = (newPack, usersToInvite) => {
      PACKS_CONTROLLER_INSTANCE.sendPackInvite(newPack, usersToInvite);
    }

    handleDeletePackProgram = async (packProgramUID) => {
      PACKS_CONTROLLER_INSTANCE.handleDeletePackProgram(packProgramUID);
    }

    handleStartPackProgramOffer = (packProgramUID) => {
      PACKS_CONTROLLER_INSTANCE.handleStartPackProgramOffer(packProgramUID);
    }

    setPackProgramLive = (packProgramUID, bool) => {
      PACKS_CONTROLLER_INSTANCE.setPackProgramLive(packProgramUID, bool);
    }

    handleSendProgramOfferInvite = (senderUUID, packData, programData) => {
      PACKS_CONTROLLER_INSTANCE.handleSendProgramOfferInvite(senderUUID, packData, programData);
    }

    handleAcceptPackProgramOfferInvite = (packProgramUID, userUID) => {
      PACKS_CONTROLLER_INSTANCE.handleAcceptPackProgramOfferInvite(packProgramUID, userUID);
    }

    handleDeclinePackProgramOfferInvite = (packProgramUID, userUID) => {
      PACKS_CONTROLLER_INSTANCE.handleDeclinePackProgramOfferInvite(packProgramUID, userUID);
    }

    createNewPack = async (newPack) => {
      return new Promise(async (resolve, reject) => {
        let retVal = -1;
        await PACKS_CONTROLLER_INSTANCE.createPack(newPack).then(result => {
          retVal = result;
        });

        resolve(retVal);
      })
    }

    checkProgramWaitlistForMatches = async (programUID, userData) => {
      await PROGRAMS_CONTROLLER_INSTANCE.checkProgramWaitlistForMatches(programUID, userData, this.createNewPack);
    }

    addUserToProgramWaitlist = async (programUID, userData) => {
      return new Promise(async (resolve, reject) => {
        await PROGRAMS_CONTROLLER_INSTANCE.addUserToProgramWaitlist(programUID, userData)
        .then(result => {
          resolve(result);
        })
      })
    }

    handleOnAcceptPackInvite = (packUID, userUID) => {
      return new Promise((resolve, reject) => {
        PACKS_CONTROLLER_INSTANCE.handleOnAcceptPackInvite(packUID, userUID).then(data => {
          resolve(data);
        });
      })
    }

    handleOnDeclinePackInvite = (packUID, userUID) => {
      PACKS_CONTROLLER_INSTANCE.handleOnDeclinePackInvite(packUID, userUID);
    }

    inviteUserToPack = (uuid, packData) => {
      PACKS_CONTROLLER_INSTANCE.inviteUserToPack(uuid, packData);
    }

    getPackInformationFromUUID = async (uuid) => {
      return new Promise(async (resolve, reject) => {
        let retVal = {}
        await PACKS_CONTROLLER_INSTANCE.getPackInformationFromUUID(uuid).then(result => {
          retVal = result;
        });

        resolve(retVal);
      })
    }

    createNewProgram = async (programData) => {
      return new Promise(async (resolve, reject) => {
        let retVal = -1;
        await PROGRAMS_CONTROLLER_INSTANCE.createProgram(programData).then(result => {
        retVal = result;
      });

     resolve(retVal);

      })
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


    loadCurrentUserPacks = async () => {
      let packsData = []

      await PACKS_CONTROLLER_INSTANCE.loadCurrentUserPacks().then(result => {
        packsData = result;
      });

      return Promise.resolve(packsData);
    }

    loadWorkouts = async () => {
      let workoutData = {}
      await PROGRAMS_CONTROLLER_INSTANCE.loadWorkouts().then(result => {
        workoutData = result;
      })
      return Promise.resolve(workoutData)
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

    setProgramPublic = (uuid, isPublic) => {
      PROGRAMS_CONTROLLER_INSTANCE.setProgramPublic(uuid, isPublic);
    }

    createBookingRequest = (booking: Object, isAuthenticatedUser?: Boolean, unauthenticatedUserUUID?: String) => {
      if (typeof(booking) == 'undefined') {
        return;
      };
      
      USER_CONTROLLER_INSTANCE.createBookingRequest(booking, isAuthenticatedUser, unauthenticatedUserUUID);
    }

    handleAcceptBooking = (booking_uid) => {
      USER_CONTROLLER_INSTANCE.handleAcceptedBooking(booking_uid);
    }

    handleDeclineBooking = (booking_uid) => {
      USER_CONTROLLER_INSTANCE.handleDeclineBooking(booking_uid);
    }

    handleCancelBooking = (bookingData) => {
      USER_CONTROLLER_INSTANCE.handleCancelBooking(bookingData);
    }

    fetchBookingData = async (uuid) => {
      let retVal = undefined;

      await USER_CONTROLLER_INSTANCE.fetchBookingData(uuid).then(data => {
        retVal = data;
      });

      return Promise.resolve(retVal);
    }

    fetchMyClients = async (uuid: String | Number): Promise<Array<Object>> => {
      if (typeof(uuid) == 'undefined' || uuid === 0) {
        return Promise.resolve([])
      }

      let retVal : Promise<Array<Object>>;
      await USER_CONTROLLER_INSTANCE.fetchMyClients(uuid).then(data => {
        retVal = data;
      });

      return Promise.resolve(retVal);
    }

    deleteBooking = (booking_uuid, requester_uuid, trainer_uuid) : Boolean => {
      let retVal =  USER_CONTROLLER_INSTANCE.deleteBooking(booking_uuid, requester_uuid, trainer_uuid);
      return retVal;
    } 

    getAvailableTrainersByDateTime = async (date : Date, time): Promise<Array<Object>> => {
      
      let retVal : Promise<Array<Object>> = undefined;
      await USER_CONTROLLER_INSTANCE.getAvailableTrainersByDateTime(date, time).then(data => {
        retVal = data;
      });

      return Promise.resolve(retVal);
    }

    markBookingSessionCompleted =  (booking) => {
      USER_CONTROLLER_INSTANCE.markBookingSessionCompleted(booking);
    }

    setTrainerBelongsToGym = async () => {
      USER_CONTROLLER_INSTANCE.setTrainerBelongsToGym()
  }

  setTrainerHasOwnExerciseSpace = async () => {
      USER_CONTROLLER_INSTANCE.setTrainerHasOwnExerciseSpace()
  }

  setTrainerIsInHomeTrainer = async () => {
      USER_CONTROLLER_INSTANCE.setTrainerIsInHomeTrainer()
  }

  setTrainerHasExperienceInSmallGroup = async () => {
      USER_CONTROLLER_INSTANCE.setTrainerHasExperienceInSmallGroup()
  }

  setTrainerSmallGroupExperience = async (val) => {
    if (typeof(val) != 'string' || typeof(val) != 'number') {
      return;
    }
    
      const experience = Number(val);
      USER_CONTROLLER_INSTANCE.setTrainerSmallGroupExperience(experience)
  }

  loadAchievements = () => {
    return USER_CONTROLLER_INSTANCE.loadAchievements();
  }
  
  createCommunityRequest = async (communityName, communityAddress, communityZipcode, 
    communityCity, communityState, communityOwnerName, communityPhoneNumber, images, associatedLupaAccount) => {
      return new Promise(async (resolve, reject) => {
        await USER_CONTROLLER_INSTANCE.createCommunityRequest(communityName, communityAddress, communityZipcode, 
          communityCity, communityState, communityOwnerName, communityPhoneNumber, images, associatedLupaAccount)
          .then(communityUID => {
            resolve(communityUID)
          })
          .catch(error => {
            resolve(-1);
          })
      })
     
    }

  deleteCommunity = (uid) => {
    USER_CONTROLLER_INSTANCE.deleteCommunity(uid);
  }

  saveCommunityImage = async (imageURI, metadata, communityUUID) => {
    let retVal = -1;
    await USER_CONTROLLER_INSTANCE.saveCommunityImage(imageURI, metadata, communityUUID).then(uri => {
      retVal = uri;
    });

    return Promise.resolve(retVal);
  }

  updateCommunityPictures = (uid, images) => {
    USER_CONTROLLER_INSTANCE.updateCommunityPictures(uid, images);
  }

  addCommunityReview = (communityUID, reviewerUID, reviewText) => {
    USER_CONTROLLER_INSTANCE.addCommunityReview(communityUID, reviewerUID, reviewText);
  }

  getProgramInformationFromGroup = async (uuidArr) => {
    return new Promise((resolve, reject) => {
      PROGRAMS_CONTROLLER_INSTANCE.getProgramInformationFromGroup(uuidArr).then(data => {
        resolve(data);
      })
    })
  }

  subscribeToCommunity = (userUID, communityUID) => {
    USER_CONTROLLER_INSTANCE.subscribeToCommunity(userUID, communityUID);
  }

  unsubscribeUserFromCommunity = (userUID, communityUID) => {
    USER_CONTROLLER_INSTANCE.unsubscribeUserFromCommunity(userUID, communityUID);
  }

  createCommunityEvent = async (communityUID: string | number, communityEvent: CommunityEvent, images: Array<string>) => {
    USER_CONTROLLER_INSTANCE.createCommunityEvent(communityUID, communityEvent, images);
  }

  getProgramsBasedOnInterest = async () : Promise<Array<LupaProgramInformationStructure>> => {
    return new Promise(async (resolve, reject) => {
      await PROGRAMS_CONTROLLER_INSTANCE.getProgramsBasedOnInterest()
      .then(data => {
        resolve(data)
      });
    })

  
  }

}
