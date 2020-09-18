/**
 *
 */

import LUPA_DB, { LUPA_AUTH, FIRESTORE_INSTANCE, LUPA_DB_FIREBASE, Fire, FirebaseStorageBucket } from '../firebase/firebase.js';

const USER_COLLECTION = LUPA_DB.collection('users');
const PROGRAMS_COLLECTION = LUPA_DB.collection('programs');
const VLOGS_COLLECTION = LUPA_DB.collection('vlogs');
const WORKOUTS_COLLECTION = LUPA_DB.collection('workouts');
//import * as algoliasearch from 'algoliasearch'; // When using TypeScript
const algoliasearch = require('algoliasearch/reactnative.js');
const algoliaIndex = algoliasearch("EGZO4IJMQL", "f0f50b25f97f17ed73afa48108d9d7e6");
const usersIndex = algoliaIndex.initIndex("dev_USERS");
const tmpIndex = algoliaIndex.initIndex("tempDev_Users");
const programsIndex = algoliaIndex.initIndex("dev_Programs");
const tmpProgramsIndex = algoliaIndex.initIndex("tempDev_Programs");

import { UserCollectionFields } from './common/types';
import { getLupaProgramInformationStructure } from '../../model/data_structures/programs/program_structures';

import LOG, { LOG_ERROR } from '../../common/Logger';
import { getLupaUserStructure } from '../firebase/collection_structures';
import { NOTIFICATION_TYPES } from '../../model/notifications/common/types'
import ProgramController from './ProgramController';

export default class UserController {
    private static _instance: UserController;
    private fbStorage = new FirebaseStorageBucket();
    private PROGRAMS_CONTROLLER_INSTANCE = ProgramController.getInstance();

    private constructor() {

    }

    /**
     * Returns an instance of the user controller if one exist, otherwise creates an instance and
     * returns it.
     * @return UserController._instance an instance of the user controller.
     */
    public static getInstance = () => {
        if (!UserController._instance) {
            UserController._instance = new UserController();
            return UserController._instance;
        }

        return UserController._instance;
    }

    /**
     * 
     * @param uuid UUID of the user for which to curate trainers.
     * @param attributes Array of attributes to base trainer generation.
     * @return Array of trainers.
     */
    generateCuratedTrainers = async (uuid, attributes) => {
        let userData = getLupaUserStructure();
        await this.getUserInformationByUUID(uuid).then(data => {
            userData = data;
        })

        let tempRetVal = []
        await this.getTrainers().then(data => {
            tempRetVal = data;
        })

        return Promise.resolve(tempRetVal)
    }

    /**
     * Saves a users profile image in the firebase storage bucket.
     * @param string URI of the profile image.
     * @return Returns a promise resolving the URL of the profile image in the storage bucket.
     */
    saveUserProfileImage = async (string) => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', string, true);
            xhr.send(null);
        });

        let imageURL;
        return new Promise((resolve, reject) => {
            this.fbStorage.saveUserProfileImage(blob).then(url => {
                resolve(url);
            })
        })
    }

    /**
     * Generates user structures based on the UUIDs given.
     * @param arrOfUUIDS Array of UUIDS for which to fetch user structure.
     * @return Array of user structures.
     */
    getArrayOfUserObjectsFromUUIDS = async (arrOfUUIDS) => {
        let results = new Array();
        return new Promise(async (resolve, reject) => {
            for (let i = 0; i < arrOfUUIDS.length; ++i) {
                await this.getUserInformationByUUID(arrOfUUIDS[i]).then(result => {
                    results.push(result);
                });
            }
            resolve(results);
        })
    }

    isUsernameTaken = async (val) => {
        let isTaken;

        await USER_COLLECTION.where('username', '==', val).get().then(docs => {
            if (docs.length == 0) {
                isTaken = false;
                return Promise.resolve(isTaken);
            }
            else {
                isTaken = true;
                return Promise.resolve(isTaken);
            }
        });
    }


    getAttributeFromUUID = async (uuid, attribute) => {
        let retValue;

        await USER_COLLECTION.doc(uuid).get().then(res => {
            let snapshot = res.data();
            switch (attribute) {
                case 'display_name':
                    retValue = snapshot.display_name;
                    break;
                case 'email':
                    retValue = snapshot.email;
                    break;
                case 'email_verified':
                    retValue = snapshot.email_verified;
                    break;
                case 'gender':
                    retValue = snapshot.gender;
                    break;
                case 'interest':
                    retValue = snapshot.interest;
                    break;
                case 'isTrainer':
                    retValue = snapshot.isTrainer;
                    break;
                case 'location':
                    retValue = snapshot.location;
                    break;
                case 'packs':
                    retValue = snapshot.packs;
                    break;
                case 'photo_url':
                    retValue = snapshot.photo_url;
                    break;
                case 'preferred_workout_times':
                    retValue = snapshot.preferred_workout_times;
                    break;
                case 'rating':
                    retValue = snapshot.rating;
                    break;
                case 'time_created':
                    retValue = snapshot.time_created;
                    break;
                case 'user_uuid':
                    retValue = snapshot.user_uuid;
                    break;
                case 'username':
                    retValue = snapshot.username;
                    break;
                case 'experience':
                    retValue = snapshot.experience;
                    break;
                case 'followers':
                    retValue = snapshot.followers;
                    break;
                case 'following':
                    retValue = snapshot.following;
                    break;
                case 'sessions_completed':
                    retValue = snapshot.sessionsCompleted;
                    break;
                case 'bio':
                    retValue = snapshot.bio;
                    break;
            }
        });

        return retValue;
    }

    /************** *********************/

    /**
     * DEPRECATED - To be removed in version 0.8
     */
    getCurrentUser = () => {
        return LUPA_AUTH.currentUser;
    }

    /**
     * DEPRECATED - To be removed in version 0.8
     */
    getCurrentUserUUID = async () => {
        return await LUPA_AUTH.currentUser.uid;
    }

    getCurrentUserData = async (uuid = 0) => {
        let data = {}
        try {
            let currentUserInformation = {}
            if (uuid == 0) {
                let currentUserUUID = await this.getCurrentUserUUID();
                await USER_COLLECTION.where('user_uuid', '==', currentUserUUID).limit(1).get().then(docs => {
                    docs.forEach(doc => {
                        currentUserInformation = doc.data();
                        return;
                    })
                })

                return Promise.resolve(currentUserInformation)
            }

            await USER_COLLECTION.doc(uuid).get().then(snapshot => {
                data = snapshot.data()
            })

            return Promise.resolve(data);

        } catch (error) {
            alert(error)
            let errdata = getLupaUserStructure()
            return Promise.resolve(errdata)
        }

    }

    updateCurrentUser = async (fieldToUpdate, value, optionalData = "", optionalDataTwo = "") => {
        let currentUserHealthDocumentData;

        let currentUserDocument = await USER_COLLECTION.doc(this.getCurrentUser().uid);

        switch (fieldToUpdate) {
            case 'isTrainer':
                currentUserDocument.update({
                    isTrainer: value
                })
                break;
            case 'interest':
                currentUserDocument.update({
                    interest: value
                })
                break;
            case 'last_completed_workout':
                currentUserDocument.update({
                    last_completed_workout: value
                });
                break;
            case 'scheduler_times':
                if (optionalData == 'add') {
                    let schedulerObject = {}, updatedSchedulerTimes = {}, newDateObject = {}
                    await currentUserDocument.get().then(result => {
                        schedulerObject = result.data().scheduler_times;
                    });

                    updatedSchedulerTimes = schedulerObject;

                    for (const key in value) {
                        if (Object.keys(updatedSchedulerTimes).includes(key)) {
                            let existingDateObjectValues = updatedSchedulerTimes[key]
                        }



                        //there is already a date with times in the dataabse
                        if (Object.keys(updatedSchedulerTimes).includes(key)) {
                            let existingDateObjectValues = Object.values(updatedSchedulerTimes[key])[0].times
                            let comingInObjectValues = value[key]
                            updatedSchedulerTimes[key] = [{ times: [...existingDateObjectValues, ...comingInObjectValues] }]
                        } else if (!Object.keys(updatedSchedulerTimes).includes(key)) { // //if there is not a date already present
                            updatedSchedulerTimes[key] = [{ times: value[key] }]
                        }
                    }

                    currentUserDocument.update({
                        scheduler_times: updatedSchedulerTimes,
                    })
                } else if (optionalData == 'remove') {
                    let schedulerObject = {}, updatedSchedulerTimes = {}

                    //Get the user's scheduler times
                    await currentUserDocument.get().then(result => {
                        schedulerObject = result.data().scheduler_times;
                    });

                    //Loop thrpugh schedulerObject to find the key of the time block
                    for (const key in schedulerObject) {
                        if (key == optionalDataTwo) {
                            let updatedDay = schedulerObject[key];
                            for (let i = 0; i < updatedDay[0].times.length; i++) {
                                if (updatedDay[0].times[i].startTime == optionalDataTwo.startTime
                                    && updatedDay[0].times[i].endTime == optionalDataTwo.endTime
                                    && updatedDay[0].times[i].startTimePeriod == optionalDataTwo.startTimePeriod
                                    && updatedDay[0].times[i].endTimePeriod == optionalDataTwo.endTimePeriod) {
                                        updatedDay[0].times = updatedDay[0].times.splice(i, 1);
                                    }
                            }

                            schedulerObject[key] = updatedDay;
                            
                            currentUserDocument.update({
                                scheduler_times: schedulerObject
                            })
                        }
                    }
                }
                break;
            case UserCollectionFields.PROGRAMS:
                try {

                    let programs = [], snapshot = {}
                    if (optionalData == 'add') {
                        await currentUserDocument.get().then(result => {
                            snapshot = result.data()
                        });

                        programs = snapshot.programs
                        programs.push(value);
                        console.log('made it here')
                        await currentUserDocument.update({
                            programs: programs
                        });
                    }
                    else if (optionalData == 'remove') {

                    }
                } catch (error) {
                    alert(error)
                }
                break;
            case 'program_data':
                    try {
    
                        let programDataList = [], snapshot = {}
                        if (optionalData == 'add') {
                            await currentUserDocument.get().then(result => {
                                snapshot = result.data()
                            });
    
                            programDataList = snapshot.program_data
                            
                            /* Update metadata no matter who the user is because trainers might want to do
                            the program as well.  Date purchased will serve as date created for trainers (not to be explicitly used that way) */
                                value.program_metadata = {
                                    workouts_completed: 0
                                }

                                value.program_purchase_metadata = {
                                    date_purchased: new Date(),
                                }
                           
                            programDataList.push(value);
                     
                            await currentUserDocument.update({
                                program_data: programDataList
                            });
                        }
                        else if (optionalData == 'remove') {

                        }
                    } catch (error) {
                        alert(error)
                    }
                    break;
            case UserCollectionFields.CHATS:
                let chats;
                if (optionalData == 'add') {
                    await currentUserDocument.get().then(result => {
                        chats = result.data().chats;
                    });

                    let chatField = {
                        user: optionalDataTwo,
                        chatID: value,
                    }

                    chats.push(chatField);

                    currentUserDocument.update({
                        chats: chats,
                    })
                }
                break;
            case UserCollectionFields.HOME_GYM:
                await currentUserDocument.update({
                    homegym: value,
                })
                break;
            case UserCollectionFields.PACKS:
                let updatedPacksData;

                await currentUserDocument.get().then(result => {
                    updatedPacksData = result.data().packs;
                })

                if (optionalData == 'add') {
                    for (let i = 0; i < value.length; i++) {
                        let pack = value[i];
                        updatedPacksData.push(pack);
                    }

                    currentUserDocument.update({
                        packs: updatedPacksData
                    })
                }
                else if (optionalData == "remove") {
                    for (let i = 0; i < value.length; i++) {
                        let packID = value[i];
                        updatedPacksData.splice(updatedPacksData.indexOf(packID), 1);
                    }

                    currentUserDocument.update({
                        packs: updatedPacksData,
                    });
                }
                break;
            case UserCollectionFields.LOCATION:
                currentUserDocument.update({
                    location: value,
                });
                break;
            case UserCollectionFields.BIO:
                currentUserDocument.update({
                    bio: value,
                })
                break;
            case UserCollectionFields.DISPLAY_NAME:
                LUPA_AUTH.currentUser.updateProfile({
                    displayName: value,
                })
                currentUserDocument.set({
                    display_name: value,
                }, {
                    merge: true,
                })
                break;
            case UserCollectionFields.USERNAME:
                currentUserDocument.set({
                    username: value,
                }, {
                    merge: true
                })
                break;
            case UserCollectionFields.PHOTO_URL:
                LUPA_AUTH.currentUser.updateProfile({
                    photoURL: value
                })
                currentUserDocument.set({
                    photo_url: value,
                }, {
                    merge: true
                })
                break;
            case UserCollectionFields.FOLLOWERS:
                /* For now we don't handle this year */
                break;
            case UserCollectionFields.FOLLOWING:
                /* For now we don't handle this year */
                break;
            case UserCollectionFields.HOURLY_PAYMENT_RATE:
                currentUserDocument.update({
                    hourly_payment_rate: value
                })
                break;
            case 'vlogs':
                let updatedVlogs = [];
                if (optionalData == 'add') {
                    await currentUserDocument.get().then(snapshot => {
                        updatedVlogs = snapshot.data().vlogs;
                    });

                    updatedVlogs.push(value);

                    currentUserDocument.update({
                        vlogs: updatedVlogs
                    })
                }
                break;
        }
    }

    getUserInformationByUUID = async uuid => {
        let userResult = getLupaUserStructure(), docData = getLupaProgramInformationStructure(), userPrograms = []

        if (uuid == "" || typeof (uuid) == 'undefined') {
            return Promise.resolve(userResult)
        }

        try {
            await USER_COLLECTION.doc(uuid).get().then(result => {
                userResult = result.data();
            });

            if (typeof(userResult) == 'undefined') {
                userResult = getLupaUserStructure();
                return Promise.resolve(userResult)
            }
        } catch (error) {
            LOG_ERROR('UserController.ts', 'Caught exception in getUserInformationByUUID', error)
            userResult = getLupaUserStructure();
            return Promise.resolve(userResult)
        }

        return Promise.resolve(userResult);
    }

    addFollowerToUUID = async (uuidOfAccountBeingFollowed, uuidOfFollower) => {
        let result;
        let accountToUpdate = USER_COLLECTION.doc(uuidOfAccountBeingFollowed);
        await accountToUpdate.get().then(snapshot => {
            result = snapshot.data();
        })

        //Get the current followers
        let currentFollowers = result.followers;

        //add the follower to the current followers
        currentFollowers.push(uuidOfFollower);

        //update followers
        accountToUpdate.set({
            followers: currentFollowers
        }, {
            merge: true,
        });
    }

    followAccountFromUUID = async (uuidOfUserToFollow, uuidOfUserFollowing) => {
        let result;
        let accountToUpdate = USER_COLLECTION.doc(uuidOfUserFollowing);
        await accountToUpdate.get().then(snapshot => {
            result = snapshot.data();
        });

        //get the current following
        let currentFollowing = result.following;

        //add the following to the current followers
        currentFollowing.push(uuidOfUserToFollow);

        //update following
        accountToUpdate.set({
            following: currentFollowing
        }, {
            merge: true,
        });
    }

    unfollowAccountFromUUID = async (uuidOfUserToUnfollow, uuidOfUserUnfollowing) => {
        let result;
        let accountToUpdate = USER_COLLECTION.doc(uuidOfUserUnfollowing);

        await accountToUpdate.get().then(snapshot => {
            result = snapshot.data();
        });

        let currentFollowing = result.following;

        currentFollowing.splice(currentFollowing.indexOf(uuidOfUserToUnfollow), 1);

        accountToUpdate.set({
            following: currentFollowing,
        }, {
            merge: true,
        })
    }

    removeFollowerFromUUID = async (uuidOfUserToRemove, uuidOfUserUnfollowing) => {
        let result;
        let accountToUpdate = USER_COLLECTION.doc(uuidOfUserToRemove);
        await accountToUpdate.get().then(snapshot => {
            result = snapshot.data();
        })

        //Get the current followers
        let currentFollowers = result.followers;

        //add the follower to the current followers
        currentFollowers.splice(currentFollowers.indexOf(uuidOfUserUnfollowing), 1);

        //update followers
        accountToUpdate.set({
            followers: currentFollowers,
        }, {
            merge: true,
        });
    }

    getTrainers = async () => {
        let trainers = []
        try {
            await USER_COLLECTION.where('isTrainer', '==', true).limit(5).get().then(docs => {
                let snapshot = getLupaUserStructure()
                docs.forEach(querySnapshot => {
                    snapshot = querySnapshot.data();

                    if (typeof (snapshot) != 'undefined' && snapshot != null && snapshot.display_name != "") {
                        let snapshotID = querySnapshot.id;
                        snapshot.id = snapshotID;
                        trainers.push(snapshot);
                    }
                })
            })
        } catch (error) {
            alert(error)
            trainers = []
        }

        return Promise.resolve(trainers);
    }


    /**************** *******************/

    indexProgramsIntoAlgolia = async () => {
        let records = [], program = undefined;

        await PROGRAMS_COLLECTION.get().then(docs => {
            docs.forEach(doc => {
                //Load user data from document
                program = doc.data();

                if (program.program_name == "" || typeof (program) == 'undefined') {

                } else {
                    program.objectID = program.program_structure_uuid
                    records.push(program);
                }
            });

            algoliaIndex.copyIndex(programsIndex.indexName, tmpProgramsIndex.indexName, [
                'settings',
                'synonyms',
                'rules'
            ]).then(({ taskID }) =>
                tmpProgramsIndex.waitTask(taskID)
            ).then(() => {
                const objects = records;
                return tmpProgramsIndex.addObjects(objects);
            }).then(() =>
                algoliaIndex.moveIndex(tmpProgramsIndex.indexName, programsIndex.indexName)
            ).catch(err => {
                console.error(err);
            });
        })
    }

    indexUsersIntoAlgolia = async () => {
        let records = [];
        await USER_COLLECTION.get().then(docs => {
            docs.forEach(doc => {
                //Load user data from document
                let user = doc.data();

                if (user.display_name == "" || typeof (user) == 'undefined') {

                } else {
                    //Set object ID (although this may not be necessary)
                    user.objectID = doc.id;

                    //Set necessary data for users
                    let userData = {
                        objectID: user.objectID,
                        display_name: user.display_name,
                        email: user.email,
                        email_verified: user.email_verified,
                        gender: user.gender,
                        isTrainer: user.isTrainer,
                        location: user.location,
                        packs: user.packs,
                        photo_url: user.photo_url,
                        time_created: user.time_created,
                        user_uuid: user.user_uuid,
                        username: user.username,
                    }

                    records.push(userData);
                }
            });

            algoliaIndex.copyIndex(usersIndex.indexName, tmpIndex.indexName, [
                'settings',
                'synonyms',
                'rules'
            ]).then(({ taskID }) =>
                tmpIndex.waitTask(taskID)
            ).then(() => {
                const objects = records;
                return tmpIndex.addObjects(objects);
            }).then(() =>
                algoliaIndex.moveIndex(tmpIndex.indexName, usersIndex.indexName)
            ).catch(err => {
                console.error(err);
            });


            usersIndex.addObjects(records, (err, content) => {
                if (err) {
                    console.log('big error: ' + err);
                }


            });
        });
    }

    /**
     * Add User to Firebase
     */
    addUserToDatabase = (usernameIn, passwordIn = "", emailIn = "", firstNameIn = "", lastNameIn = "", statisticsIn = [],
        specializationsIn = [], experienceIn = [], packsByNameIn = [], recommendedWorkoutsIn = [], isTrainerIn = false, sessionsIn = [],
        timeCreatedIn = new Date().getTime(), genderIn = "undefined", locationIn = "undefined", ratingIn = 0, eventsByNameIn = []) => {

        let newUserData = {
            email: emailIn,
            eventsByName: eventsByNameIn,
            experience: experienceIn,
            firstName: firstNameIn,
            gender: genderIn,
            isTrainer: isTrainerIn,
            lastName: lastNameIn,
            location: locationIn,
            packsByName: packsByNameIn,
            password: passwordIn,
            rating: ratingIn,
            recommendedWorkouts: recommendedWorkoutsIn,
            timeCreated: timeCreatedIn,
            username: usernameIn,
            specializations: specializationsIn,
            statistics: statisticsIn,
            sessions: sessionsIn,
        }

        try {
            USER_COLLECTION.doc(usernameIn).set(newUserData);
            return true;
        } catch (Exception) {
            alert(Exception)
            return false;
        }
    }


    searchPrograms = (startsWith = '') => {
        let currHit = undefined;

        return new Promise((resolve, reject) => {
            const query = startsWith.toLowerCase();

            programsIndex.search({
                query: query,
            }, (err, { hits }) => {
                if (err) throw reject(err);
                let results = [];

                for (let i = 0; i < hits.length; i++) {
                    currHit = hits[i];
                    if (currHit.program_name != undefined || currHit.program_structure_uuid != undefined) {
                        results.push(currHit);
                    }
                }

                resolve(results);

            }

            )
        });
    }

    getNearbyUsers = async (location) => {
        try {
            return new Promise((resolve, reject) => {
                let nearbyUsers = [];
                usersIndex.search({
                    query: location.state,
                    attributesToHighlight: ['location'],
                }, async (err, { hits }) => {
                    if (err) throw reject(err);

                    try {
                        await USER_COLLECTION.where('isTrainer', '==', true).get().then(result => {
                            let docs = result;
                            let data;
                            docs.forEach(doc => {
                                data = doc.data();
                                if (data.user_uuid == undefined || data.user_uuid == "" || data == undefined || typeof (data) != 'object') {

                                    return;
                                }
                                nearbyUsers.push(data);
                            });
                        });
                    } catch (error) {
                        //TODO:
                        LOG_ERROR('UserController.ts', 'Handling error in getNearbyUsers().', error)
                        resolve(nearbyUsers);
                    }

                    try {
                        await USER_COLLECTION.where('isTrainer', '==', false).get().then(result => {
                            let docs = result;
                            let data;
                            docs.forEach(doc => {
                                data = doc.data();
                                if (data.user_uuid == undefined || data.user_uuid == "" || data == undefined || typeof (data) != 'object') {
                                    return;
                                }
                                nearbyUsers.push(data);
                            });
                        });
                    } catch (error) {
                        //TODO:
                        LOG_ERROR('UserController.ts', 'Handling error in getNearbyUsers().', error)
                        resolve(nearbyUsers);
                    }

                    resolve(nearbyUsers);

                    //parse all of ths hits for the city
                    /*   for (var i = 0; i < hits.length; ++i) {
                           let locationHighlightedResult = hits[i]._highlightResult;
                           let compare = (locationHighlightedResult.location.city.value.replace('<em>', '').replace('</em>', '').toLowerCase() == location.city.toLowerCase())
                           if (compare) {
                               await nearbyUsers.push(hits[i]);
                           }
                       }*/

                    //parse all of ths hits for the city
                    /* for (var i = 0; i < hits.length; ++i) {
                         let locationHighlightedResult = hits[i]._highlightResult;
                        // let compare = (locationHighlightedResult.location.state.value.replace('<em>', '').replace('</em>', '').toLowerCase() == location.state.toLowerCase())
                         if (true) {
                             alert(hits[i])
                             console.log(hits[i])
                             await nearbyUsers.push(hits[i]);
                         }
                     }*/

                })
            })
        } catch (err) {
            return Promise.resolve([])
        }

    }

    getNearbyTrainers = async (location) => {
        return new Promise((resolve, reject) => {
            resolve([])
        })
        /*  return new Promise((resolve, reject) => {
              let nearbyTrainers = new Array();
              usersIndex.search({
                  query: location.city,
                  attributesToHighlight: ['location'],
              }, async (err, { hits }) => {
                  if (err) throw reject(err);
  
                  if (hits.length == 0) {
                      await USER_COLLECTION.where('isTrainer', '==', true).limit(3).get().then(result => {
                          let docs = result;
                          let data;
                          docs.forEach(doc => {
                              data = doc.data();
                              nearbyTrainers.push(data);
                          });
                      });
                      resolve(nearbyTrainers);
                  }
  
                  //parse all of ths hits for the city
                  for (var i = 0; i < hits.length; ++i) {
                      //if we come across the current user's uuid then skip
                      if (hits[i].user_uuid == this.getCurrentUserUUID() || hits[i].isTrainer != true)
                      {
                          continue;
                      }
                      let locationHighlightedResult = hits[i]._highlightResult;
                      let compare = (locationHighlightedResult.location.city.value.replace('<em>', '').replace('</em>', '').toLowerCase() == location.city.toLowerCase())
                      if (compare) {
                          await nearbyTrainers.push(hits[i]);
                      }
                  }
  
                  //parse all of ths hits for the state
                  for (var i = 0; i < hits.length; ++i) {
                      //if we come across the current user's uuid or we already have the hit then skip
                      if (hits[i].user_uuid == this.getCurrentUserUUID() || nearbyTrainers.includes(hits[i]) || hits[i].isTrainer != true)
                      {
                          continue;
                      }
                      let locationHighlightedResult = hits[i]._highlightResult;
                      let compare = (locationHighlightedResult.location.state.value.replace('<em>', '').replace('</em>', '').toLowerCase() == location.state.toLowerCase())
                      if (compare) {
                          await nearbyTrainers.push(hits[i]);
                      }
                  }
  
                  await nearbyTrainers.filter(trainer => {
                      return trainer.user_uuid != this.getCurrentUserUUID();
                  })
  
                  resolve(nearbyTrainers);
              })
          })*/

    }

    /******* Programs Collection Operations ******************/

    /**
     * Creates a new program entry in the programs collection and adds the UUID for that program
     * to the current users program list.
     * 
     * Notes:
     * This method assumes only the current user can create a program for the account and send it to others.
     * @param uuid 
     */
    createProgram = async (uuid) => {
        PROGRAMS_COLLECTION.doc(uuid).set(getLupaProgramInformationStructure());
        this.updateCurrentUser('program_data', getLupaProgramInformationStructure(), 'add');
    }

    /**
     * Removes a specified value from a given away.
     * 
     * !!! Move to lupa/common/utils !!!
     * @param arr 
     * @param value 
     */
    arrayRemove(arr, value) {
        return arr.filter(function (ele) {
            return ele != value;
        });
    }

    /**
     * Used for deleting programs that were in the process of creation
     */
    deleteProgram = async (user_uuid, programUUID) => {
        let tempData = {};

        try {
            /**
             * TODO:
             * Need to delete the last program that was created or the program with the UUID
             * programUUID from the user's document field program_data.
             */
            
            /* await USER_COLLECTION.doc(user_uuid).get().then(snapshot => {
                 tempData = snapshot.data();
             })
             
             let userProgramData = await tempData.program_data;

             await userProgramData.pop();
     
             await USER_COLLECTION.doc(user_uuid).update({
                 program_data: userProgramData
             });*/

            //delete program from lupa programs
            await PROGRAMS_COLLECTION.doc(programUUID).delete();
        } catch (err) {
            alert(err)
        }
    }

    /**
     *  /**
     * Used for deleting workouts that were in the process of creation
     */
     deleteWorkout = async (user_uuid, workoutUUID) => {
         await WORKOUTS_COLLECTION.doc(workoutUUID).delete();
     }

    loadCurrentUserPrograms = async () => {
        let programUUIDS = [], programsData = [];
        let temp;
        let uuid = await this.getCurrentUser().uid;

        if (typeof (uuid) == 'undefined') {

            return Promise.resolve([])
        }

        try {

            await USER_COLLECTION.doc(uuid).get().then(snapshot => {
                temp = snapshot.data();
            });

            programUUIDS = temp.programs;

            for (let i = 0; i <= programUUIDS.length; i++) {
                await PROGRAMS_COLLECTION.doc(programUUIDS[i]).get().then(snapshot => {
                    temp = snapshot.data();
                })


                try {
                    if (typeof (temp) != 'undefined' && temp != null) {
                        if (temp.program_name != "" && temp.program_image != "") {
                            await programsData.push(temp)
                        }
                    }
                } catch (error) {
                    alert(error)
                    LOG_ERROR('UserController.ts', 'Unhandled exception in loadCurrentUserPrograms()', error)
                    continue;
                }

            }
        } catch (error) {
            alert(error)
            LOG_ERROR('UserController.ts', 'Unhandled exception in loadCurrentUserPrograms()', error)
            programsData = [];
        }


        return Promise.resolve(programsData);
        //return Promise.resolve([]);
    }

    deleteUserProgram = async (programUUID, userUUID) => {
        /* let programData, programRef;
             programRef = await PROGRAMS_COLLECTION.doc(programUUID);
 
             await programRef.get().then(snapshot => {
                 programData = snapshot.data();
             });
 
         //get the current user UUID
         const currUserUUID = await this.getCurrentUserUUID();
 
         //If the program is not the owner's then we can just delete it from their document
         if (userUUID != programData.program_owner)
         {
             const currUserRef = await USER_COLLECTION.doc(userUUID);
 
             await currUserRef.update({
                 programs: FIRESTORE_INSTANCE.FieldValue.arrayRemove(programUUID)
             })
         }
         else
         {
             try {
                 let programParticipants = programData.program_participants;
 
                 for(let i = 0; i < programParticipants.length; i++)
                 {
                     //Get a reference to the current users document
                     const currUserRef = await USER_COLLECTION.doc(userUUID);
 
                     //Remove the program uuid from the current users document
                     await currUserRef.update({
                         programs: FIRESTORE_INSTANCE.FieldValue.arrayRemove(programUUID)
                     })
 
                     //get a reference to the users document
                     let userRef = await USER_COLLECTION.doc(userUUID);
 
                     //update the programs section of the users document removing the program uuid from their list
                     await userRef.update({
                         programs: FIRESTORE_INSTANCE.FieldValue.arrayRemove(programUUID)
                     })
 
 
                     //last we remove the program from the DB completely
                     await programRef.delete();
                 }
             } catch (error) {
                 LOG_ERROR('UserController.ts', 'Unhandled error in deleteUserProgram()', error)
             }
         }*/
    }

    /**
     * Saves a program image to the FS storage bucket.
     * 
     * @param programUUID 
     * @param url 
     */
    saveProgramImage = async (programUUID, url) => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', url, true);
            xhr.send(null);
        });

        let imageURL;
        return new Promise((resolve, reject) => {
            this.fbStorage.saveProgramImage(programUUID, blob).then(url => {
                resolve(url);
            })
        })
    }

    /**
     * 
     * @param workoutData 
     */
    saveProgram = async (workoutData) => {
        let imageURL;
        await this.saveProgramImage(workoutData.program_structure_uuid, workoutData.program_image).then(url => {
            imageURL = url;
        })

        //update the program image in the structure
        workoutData.program_image = imageURL;

        /* Perform check on data */
        let checkedWorkoutData = workoutData;

        if (workoutData.program_tags == undefined || typeof (workoutData.program_tags) != "object") {
            checkedWorkoutData.program_tags = [];
        }

        //add program to lupa programs collection
        await PROGRAMS_COLLECTION.doc(workoutData.program_structure_uuid).set(checkedWorkoutData);

        //add uuid of program and programData to user programs/program data arr
        await this.updateCurrentUser('programs', workoutData.program_structure_uuid, 'add');
        let variationProgramData = checkedWorkoutData;
        variationProgramData.date_created = new Date();
        variationProgramData.workouts_completed = 0;
        await this.updateCurrentUser('program_data', variationProgramData, 'add');

        let payload;
        await PROGRAMS_COLLECTION.doc(workoutData.program_structure_uuid).get().then(snapshot => {
            payload = snapshot.data();
        })

        return Promise.resolve(payload);
    }

    /**
     *  Sends a notification containing the data to the program to a list of users.
     * @param currUserData 
     * @param userList 
     * @param program 
     */
    handleSendUserProgram = async (currUserData, userList, program) => {
        if (userList.length === 0) {
            return;
        }

        try {

            let receivedProgramNotificationStructure = {
                notification_uuid: Math.random().toString(),
                data: program,
                from: currUserData.user_uuid,
                to: userList,
                read: false,
                type: NOTIFICATION_TYPES.RECEIVED_PROGRAM,
                actions: ['View', 'Delete'],
                timestamp: new Date().getTime()
            }

            let userNotifications = [];
            if (userList.length == 0) {
                return;
            }

            for (let i = 0; i < userList.length; i++) {
                await USER_COLLECTION.doc(userList[i]).get().then(snapshot => {
                    userNotifications = snapshot.data().notifications;
                })
                await userNotifications.push(receivedProgramNotificationStructure);
                await USER_COLLECTION.doc(userList[i]).update({
                    notifications: userNotifications,
                })
            }

            this.PROGRAMS_CONTROLLER_INSTANCE.addProgramShare(program.program_structure_uuid, userList.length);

        } catch (err) {
            alert(err)
        }

    }

    //user one is the sender
    getPrivateChatUUID = async (currUserUUID, userTwo) => {
        let chats;
        let GENERATED_CHAT_UUID;
        if (currUserUUID.charAt(0) < userTwo.charAt(0)) {
            GENERATED_CHAT_UUID = currUserUUID + userTwo;
        }
        else {
            GENERATED_CHAT_UUID = userTwo + currUserUUID;
        }

        await USER_COLLECTION.doc(currUserUUID).get().then(result => {
            chats = result.data().chats;
        });

        let otherUserDocData;
        let otherUserDoc = USER_COLLECTION.doc(userTwo);

        let chatID, chatExistUserOne = false;
        await chats.forEach(element => {
            if (element.user == userTwo) {
                chatExistUserOne = true;
                chatID = element.chatID;
            }
        });

        if (!chatExistUserOne) {

            //if already got it then return it
            //if not then add it and return it
            await this.updateCurrentUser('chats', GENERATED_CHAT_UUID, 'add', userTwo);

            //Update other users chats
            await USER_COLLECTION.doc(userTwo).get().then(snapshot => {
                otherUserDocData = snapshot.data();
            });

            let otherUserChats = otherUserDocData.chats;

            let chatExistUserTwo;
            chatExistUserOne = false;

            await otherUserChats.forEach(element => {
                if (element.user == currUserUUID) {
                    chatExistUserTwo = true;
                    chatID = element.chatID;
                }
            });

            //add to other user if they don't already have it
            if (!chatExistUserTwo) {
                let chatField = {
                    user: currUserUUID,
                    chatID: GENERATED_CHAT_UUID,
                }
                otherUserChats.push(chatField);

                await otherUserDoc.update({
                    chats: otherUserChats
                })
            }

            return Promise.resolve(GENERATED_CHAT_UUID);
        }
        else //chat does exist
        {
            return Promise.resolve(chatID);
        }
    }


    getAllCurrentUserChats = async () => {
        let result = [];

        try {
            await USER_COLLECTION.doc(this.getCurrentUser().uid).get().then(snapshot => {
                result = snapshot.data().chats;
            });
        } catch (error) {
            alert(error);
            return Promise.resolve([])
        }

        return Promise.resolve(result);
    }


    /**
     * Saves a single workout graphic.
     * 
     * @param workout 
     * @param programUUID 
     * @param graphicType 
     * @param uri 
     */
    saveProgramWorkoutGraphic = async (workout, programUUID, graphicType, uri) => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        });

        let imageURL;
        return new Promise((resolve, reject) => {
            this.fbStorage.saveProgramWorkoutGraphic(blob, workout, programUUID, graphicType).then(url => {
                resolve(url);
            })
        })
    }

    getUserNotificationsQueue = async (uuid) => {
        let notificationsQueue = [];

        try {
            await USER_COLLECTION.doc(uuid).get().then(snapshot => {
                notificationsQueue = snapshot.data().notifications;
            })
        } catch (err) {
            return Promise.resolve([])
        }

        return Promise.resolve(notificationsQueue);
    }

    getFeaturedPrograms = async () => {
        let featuredProfiles = [];
        await PROGRAMS_COLLECTION.get().then(docs => {
            docs.forEach(doc => {
                let snapshot = doc.data();
                if (typeof (snapshot) == 'undefined' || snapshot.program_name == null || typeof (snapshot.program_name) == 'undefined' || snapshot.program_image == '' || snapshot.completedProgram === false) {

                }
                else {
                    featuredProfiles.push(snapshot);
                }

            })
        });

        return Promise.resolve(featuredProfiles)
    }

    purchaseProgram = async (currUserData, programData) => {
        let updatedProgramSnapshot;
        let GENERATED_CHAT_UUID, chats;


        const currUserUUID = await currUserData.user_uuid
        const programOwnerUUID = programData.program_owner;

        try {
            //add the program and programData to users list
            await this.updateCurrentUser('programs', programData.program_structure_uuid, 'add');
            let variationProgramData = programData;
            variationProgramData.date_purchased = new Date()
            variationProgramData.workouts_completed = 0;
            await this.updateCurrentUser('program_data', variationProgramData, 'add');
            
            //add the user as one of the program participants
            let updatedParticipants= [], updatedPurchaseMetadata = {}
            await PROGRAMS_COLLECTION.doc(programData.program_structure_uuid).get().then(snapshot => {
                updatedParticipants = snapshot.data().program_participants;
                updatedPurchaseMetadata = snapshot.data().program_purchase_metadata;
            });

            updatedParticipants.push(currUserUUID);
            updatedPurchaseMetadata.purchase_list.push({
                purchaser: currUserData.display_name,
                date_purchased: new Date(),
                program_name: programData.program_name,
            })

            await PROGRAMS_COLLECTION.doc(programData.program_structure_uuid).update({
                program_participants: updatedParticipants,
                program_purchase_metadata: updatedPurchaseMetadata,
            });

            //setup trainer and user chat channel
            if (currUserUUID.charAt(0) < programOwnerUUID.charAt(0)) {
                GENERATED_CHAT_UUID = currUserUUID + programOwnerUUID;
            }
            else {
                GENERATED_CHAT_UUID = programOwnerUUID + currUserUUID;
            }


            await USER_COLLECTION.doc(currUserUUID).get().then(result => {
                chats = result.data().chats;
            });

            let otherUserDocData;
            let otherUserDoc = USER_COLLECTION.doc(programOwnerUUID);

            let chatID, chatExistUserOne = false;
            await chats.forEach(element => {
                if (element.user == programOwnerUUID) {
                    chatExistUserOne = true;
                    chatID = element.chatID;
                }
            });

            if (!chatExistUserOne) {

                //if already got it then return it
                //if not then add it and return it
                await this.updateCurrentUser('chats', GENERATED_CHAT_UUID, 'add', programOwnerUUID);

                //Update other users chats
                await USER_COLLECTION.doc(programOwnerUUID).get().then(snapshot => {
                    otherUserDocData = snapshot.data();
                });

                let otherUserChats = otherUserDocData.chats;

                let chatExistUserTwo;
                chatExistUserOne = false;

                await otherUserChats.forEach(element => {
                    if (element.user == currUserUUID) {
                        chatExistUserTwo = true;
                        chatID = element.chatID;
                    }
                });

                //add to other user if they don't already have it
                if (!chatExistUserTwo) {
                    let chatField = {
                        user: currUserUUID,
                        chatID: GENERATED_CHAT_UUID,
                    }
                    otherUserChats.push(chatField);

                    await otherUserDoc.update({
                        chats: otherUserChats
                    })
                }

            }
        } catch (err) {
            alert(err)
        }

        /** **************/


        try {
            //init Fire
            await Fire.shared.init(GENERATED_CHAT_UUID);

            let currUserDisplayName = await this.getAttributeFromUUID(currUserUUID, 'display_name')
            const message = {
                _id: programOwnerUUID,
                timestamp: new Date().getTime(),
                text: programData.program_automated_message,
                user: {
                    _id: programOwnerUUID,
                    name: await this.getAttributeFromUUID(programOwnerUUID, 'display_name'),
                    avatar: await this.getAttributeFromUUID(programOwnerUUID, 'photo_url')
                }
            }

            await Fire.shared.append(message)

        } catch (err) {
            alert(err)
        }


        /************/

        //update the program sales data (LATER)

        await PROGRAMS_COLLECTION.doc(programData.program_structure_uuid).get().then(snapshot => {
            updatedProgramSnapshot = snapshot.data();
        })
        return Promise.resolve(updatedProgramSnapshot);
    }

    saveVlogMedia = async (uri) => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        });

        let imageURL;
        return new Promise((resolve, reject) => {
            this.fbStorage.saveVlogMedia(blob).then(url => {
                resolve(url);
            })
        })
    }

    saveVlog = async (vlogStructure) => {
        let generatedURL;
        if (typeof (vlogStructure.vlog_media.uri) == 'undefined' || vlogStructure.vlog_media.uri == null || vlogStructure.vlog_media.uri == '') {

        } else {
            await this.saveVlogMedia(vlogStructure.vlog_media.uri).then(mediaURL => {
                generatedURL = mediaURL;
            });

            //Update the existing uri with the newly generated uri we retrieve from firestore storage.
            vlogStructure.vlog_media.uri = generatedURL;
        }

        //generate a uuid for the vlog using the vlog test
        const VLOG_UUID = Math.random().toString()
        vlogStructure.vlog_uuid = VLOG_UUID;

        //Add the UUID to the users vlog list
        this.updateCurrentUser('vlogs', VLOG_UUID, 'add', '');

        //Add the vlog structure to the vlog collection
        VLOGS_COLLECTION.doc(VLOG_UUID).set(vlogStructure);
    }

    /**
     * Deletes a vlog based on a user's id and vlog id.
     * @param userID User UUID of vlogs to delete.
     * @param vlogID Vlog ID of which vlog to delete.
     */
    deleteVlog = (userID, vlogID) => {
        VLOGS_COLLECTION.doc(userID).delete();

        let updatedVlogs = [];
        USER_COLLECTION.doc(userID).get().then(snapshot => {
            updatedVlogs = snapshot.data().vlogs;
        })

        this.arrayRemove(updatedVlogs, vlogID);
        USER_COLLECTION.doc(userID).update({
            vlogs: updatedVlogs
        });
    }

    /**
     * Gets all of a users vlogs based on the uuid parameter.
     * @param uuid User uuid for which to fetch vlogs.
     * @return promise Returns a promise resolving a list of vlogs.
     */
    getAllUserVlogs = async (uuid) => {
        let vlogsList = []
        let vlogsData = [];

        try {
            await USER_COLLECTION.doc(uuid).get().then(snapshot => {
                vlogsList = snapshot.data().vlogs;
            });
        } catch (error) {
           // alert(error);
            return Promise.resolve([])
        }

        for (let i = 0; i < vlogsList.length; i++) {
            await VLOGS_COLLECTION.doc(vlogsList[i]).get().then(snapshot => {
                const vlogData = snapshot.data();
                vlogsData.push(vlogData);
            });
        }

        return Promise.resolve(vlogsData);
    }

}

//me
/*
chats = [
    me+you = sdjf89fh3984hf9wfiwehfoifioeww


]

*/
