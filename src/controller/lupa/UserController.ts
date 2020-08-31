/**
 *
 */

import LUPA_DB, { LUPA_AUTH, FIRESTORE_INSTANCE, LUPA_DB_FIREBASE, Fire, FirebaseStorageBucket } from '../firebase/firebase.js';

const USER_COLLECTION = LUPA_DB.collection('users');
//const USER_PROGRAMS = LUPA_DB.collection('users/USER-UUID/programs'); For reference
const HEALTH_DATA_COLLECTION = LUPA_DB.collection('health_data');

const PROGRAMS_COLLECTION = LUPA_DB.collection('programs');


//import * as algoliasearch from 'algoliasearch'; // When using TypeScript
const algoliasearch = require('algoliasearch/reactnative.js');
const algoliaUsersIndex = algoliasearch("EGZO4IJMQL", "f0f50b25f97f17ed73afa48108d9d7e6");
const usersIndex = algoliaUsersIndex.initIndex("dev_USERS");
const tmpIndex = algoliaUsersIndex.initIndex("tempDev_Users");

const programsIndex = algoliaUsersIndex.initIndex("dev_Programs");
const tmpProgramsIndex = algoliaUsersIndex.initIndex("tempDev_Programs");

import { UserCollectionFields } from './common/types';
import { getLupaProgramInformationStructure } from '../../model/data_structures/programs/program_structures';

import LOG, {LOG_ERROR} from '../../common/Logger';
import { getLupaUserStructure } from '../firebase/collection_structures';
import { NOTIFICATION_TYPES } from '../../model/notifications/common/types'
import { config } from 'process';

export default class UserController {
    private static _instance: UserController;
    private fbStorage = new FirebaseStorageBucket();

    private constructor() {

    }

    public static getInstance = () => {
        if (!UserController._instance) {
            UserController._instance = new UserController();
            return UserController._instance;
        }

        return UserController._instance;
    }

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

    getUserProfileImageFromUUID = async (uuid) => {

        let url;
        await this.fbStorage.getUserProfileImageFromUUID(uuid).then(result => {
            url = result
        })
        return url;
    }

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

    getCurrentUserData = async (uuid=0) => {
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

    } catch(error) {
        alert(error)
        let errdata = getLupaUserStructure()
        return Promise.resolve(errdata)
    }

    }

    getCurrentUserHealthData = async () => {
        let currentUserHealthData;
        let currentUserUUID = await this.getCurrentUserUUID();
        await HEALTH_DATA_COLLECTION.where('user_uuid', '==', currentUserUUID).get().then(docs => {
            docs.forEach(doc => {
                currentUserHealthData = doc.data();
                return;
            });
        });

        return Promise.resolve(currentUserHealthData);
    }

    getUserInformationFromUsername = async (username) => {
        let result;
        await USER_COLLECTION.where('username', '==', username).get().then(res => {
            result = res.data();
        });
        return result;
    }

    getUserInformationFromDisplayName = async (displayName) => {
        let result;
        await USER_COLLECTION.where('display_name', '==', displayName).get().then(res => {
            result = res.data();
        })
        return result;
    }

    isTrainer = (userUUID) => {
        USER_COLLECTION.doc(userUUID).get().then(snapshot => {
            let userData = snapshot.data();
            if (userData.isTrainer) {
                return true;
            }
        })

        return false;
    }

    updateCurrentUser = async (fieldToUpdate, value, optionalData = "", optionalDataTwo = "") => {
        let currentUserHealthDocumentData;

        let currentUserDocument = await USER_COLLECTION.doc(this.getCurrentUser().uid);
        let currentUserHealthDocument = await HEALTH_DATA_COLLECTION.doc(this.getCurrentUser().uid);
        await currentUserHealthDocument.get().then(snapshot => {
            currentUserHealthDocumentData = snapshot.data();
        });

        switch (fieldToUpdate) {
            case 'scheduler_times':
                if (optionalData == 'add') {
                    console.log('hereeeee')
                    let schedulerObject = {}, updatedSchedulerTimes = {}, newDateObject = {}
                    await currentUserDocument.get().then(result => {
                        schedulerObject = result.data().scheduler_times;
                     });

                     updatedSchedulerTimes = schedulerObject;

                     console.log('trying this messs')
                     for (const key in value) {
                        if (Object.keys(updatedSchedulerTimes).includes(key)) {
                            let existingDateObjectValues = updatedSchedulerTimes[key]
                        }
                        
                        
                        
                        //there is already a date with times in the dataabse
                         if (Object.keys(updatedSchedulerTimes).includes(key)) {
                            let existingDateObjectValues = Object.values(updatedSchedulerTimes[key])[0].times
                            let comingInObjectValues = value[key]
                            updatedSchedulerTimes[key] = [{times: [...existingDateObjectValues, ...comingInObjectValues]}]
                         } else if (!Object.keys(updatedSchedulerTimes).includes(key)) { // //if there is not a date already present
                            updatedSchedulerTimes[key] = [{ times: value[key] }]
                         }
                     }

                     currentUserDocument.update({
                         scheduler_times: updatedSchedulerTimes,
                     })
                }
                break;
            case UserCollectionFields.PROGRAMS:
                try {

                let programs = [], snapshot = {}
                if (optionalData == 'add')
                {
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
                else if (optionalData == 'remove')
                {

                }
            } catch(error) {
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
            case UserCollectionFields.GENDER:
                currentUserDocument.set({
                    gender: value,
                }, {
                    merge: true,
                })
                break;
            case UserCollectionFields.INTEREST_ARR:
                currentUserDocument.update({
                    interest: value,
                });
                break;
            case UserCollectionFields.INTEREST:
                let interestData = [];
                await currentUserDocument.get().then(snapshot => {
                    let snapshotData = snapshot.data();
                    interestData = snapshotData.interest
                });

                let updatedArr = interestData;

                if (optionalData == 'remove') {


                    updatedArr = interestData;
                    updatedArr.splice(interestData.indexOf(value), 1);
                }

                if (optionalData == 'add') {
                    updatedArr = interestData;
                    updatedArr.push(value);

                }

                currentUserDocument.update({
                    interest: updatedArr
                })
                break;
            case UserCollectionFields.PREFERRED_WORKOUT_TIMES:
                switch (optionalData) {
                    case 'Monday':
                        currentUserDocument.set({
                            preferred_workout_times: { Monday: value }
                        }, {
                            merge: true
                        })
                        break;
                    case 'Tuesday':
                        currentUserDocument.set({
                            preferred_workout_times: { Tuesday: value }
                        }, {
                            merge: true,
                        })
                        break;
                    case 'Wednesday':
                        currentUserDocument.set({
                            preferred_workout_times: { Wednesday: value }
                        }, {
                            merge: true
                        })
                        break;
                    case 'Thursday':
                        currentUserDocument.set({
                            preferred_workout_times: { Thursday: value }
                        }, {
                            merge: true
                        })
                        break;
                    case 'Friday':

                        currentUserDocument.set({
                            preferred_workout_times: { Friday: value }
                        }, {
                            merge: true
                        })
                        break;
                    case 'Saturday':
                        currentUserDocument.set({
                            preferred_workout_times: { Saturday: value }
                        }, {
                            merge: true
                        })
                        break;
                    case 'Sunday':
                        currentUserDocument.set({
                            preferred_workout_times: { Sunday: value }
                        }, {
                            merge: true
                        })
                        break;
                }
                break;
            case UserCollectionFields.FOLLOWERS:
                /* For now we don't handle this year */
                break;
            case UserCollectionFields.FOLLOWING:
                /* For now we don't handle this year */
                break;
            case UserCollectionFields.WORKOUT_LOG:
            let updatedData = []

            await currentUserDocument.get().then(snapshot => {
                updatedData = snapshot.data().workout_log;
            });


            if (optionalData == 'add') {
                    updatedData.push(value);
            }

            await currentUserDocument.update({
                    workout_log: updatedData
                });

                break;
            case UserCollectionFields.BOOKMARKED_PROGRAMS:
                let updatedBookmarks;

                await currentUserDocument.get().then(snapshot => {
                    updatedBookmarks = snapshot.data().bookmarked_programs
                });

                if (updatedBookmarks.includes(value))
                {
                    await updatedBookmarks.splice(updatedBookmarks.indexOf(value), 1);
                }
                else
                {
                    await updatedBookmarks.push(value)
                }

                await currentUserDocument.update({
                    bookmarked_programs: updatedBookmarks
                })

                break;
            case UserCollectionFields.HOURLY_PAYMENT_RATE:
                currentUserDocument.update({
                    hourly_payment_rate: value
                })
                break;
            case 'vlogs':
                let updatedVlogs = [];
                if (optionalData == 'add')
                {
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

        if (uuid == "" || typeof(uuid) == 'undefined') {
            return Promise.resolve(userResult)
        }

        try {
            await USER_COLLECTION.doc(uuid).get().then(result => {
                userResult = result.data();
            });

            if (typeof(userResult.programs) == 'undefined') {
                if (userResult.programs.length > 0)
                {
                    for (let i = 0; i < userResult.programs.length; i++) {
                        docData = getLupaProgramInformationStructure()
                        await LUPA_DB.collection('programs').doc(userResult.programs[i]).get().then(snapshot => {
                            docData = snapshot.data()
                        })

                        if (typeof(docData) == 'undefined' || docData.program_name == "") {

                        }
                        else
                        {
                            userPrograms.push(docData)
                        }
                    }
                }
            }

        } catch(error) {
            LOG_ERROR('UserController.ts', 'Caught exception in getUserInformationByUUID', error)
            const userData = getLupaUserStructure()
            return Promise.resolve(userData)
        }

        Object.defineProperty(userResult, 'programs', {
            value: userPrograms,
            writable: true
        })

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

    updateCurrentUserHealthData = (fieldToUpdate) => {
        switch (fieldToUpdate) {
            case 'statistics':
                break;
            default:
        }
    }

    getUserPhotoURL = (currUser = true, uid = undefined) => {
        if (currUser == true) {
            return this.getCurrentUser().photoURL;
        }
    }

    getUserDisplayName = (currUser = true, uid = undefined) => {
        if (currUser == true) {
            return this.getCurrentUser().displayName;
        }
    }

    getTrainers = async () => {
        let trainers = []
        try {
            await USER_COLLECTION.where('isTrainer', '==', true).limit(5).get().then(docs => {
                let snapshot = getLupaUserStructure()
                docs.forEach(querySnapshot => {
                    snapshot = querySnapshot.data();

                    if (typeof(snapshot) != 'undefined' && snapshot != null && snapshot.display_name != ""){
                        let snapshotID = querySnapshot.id;
                        snapshot.id = snapshotID;
                        trainers.push(snapshot);
                    }
                })
            })
        } catch(error) {
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

                if (program.program_name == "" || typeof(program) == 'undefined') {

                } else  {
                    program.objectID = program.program_structure_uuid
                    records.push(program);
                }
            });

            algoliaUsersIndex.copyIndex(programsIndex.indexName, tmpProgramsIndex.indexName, [
                'settings',
                'synonyms',
                'rules'
            ]).then(({ taskID }) =>
                tmpProgramsIndex.waitTask(taskID)
            ).then(() => {
                const objects = records;
                return tmpProgramsIndex.addObjects(objects);
            }).then(() =>
                algoliaUsersIndex.moveIndex(tmpProgramsIndex.indexName, programsIndex.indexName)
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

                if (user.display_name == "" || typeof(user) == 'undefined') {

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

            algoliaUsersIndex.copyIndex(usersIndex.indexName, tmpIndex.indexName, [
                'settings',
                'synonyms',
                'rules'
            ]).then(({ taskID }) =>
                tmpIndex.waitTask(taskID)
            ).then(() => {
                const objects = records;
                return tmpIndex.addObjects(objects);
            }).then(() =>
                algoliaUsersIndex.moveIndex(tmpIndex.indexName, usersIndex.indexName)
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
            console.log(Exception)
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
                    if (currHit.program_name != undefined || currHit.program_structure_uuid != undefined)
                    {
                        results.push(currHit);
                    }
                }

                resolve(results);

            }

            )
        });
    }

    /**
     * Search users by name
     */
    searchByRealName = (startsWith = '') => {
        let results = new Array();
        let result = {
            objectID: undefined,
            display_name: undefined,
            email: undefined,
            email_verified: undefined,
            gender: undefined,
            interest: undefined,
            isTrainer: undefined,
            location: undefined,
            packs: undefined,
            photo_url: undefined,
            preferred_workout_times: undefined,
            time_created: undefined,
            user_uuid: undefined,
            username: undefined,
            rating: undefined, //For now we give all users a rating whether they are a trainer or nto
            uid: undefined,
            resultType: undefined,
        }

        return new Promise((resolve, reject) => {
            const query = startsWith.toLowerCase();

            usersIndex.search({
                query: query,
            }, (err, { hits }) => {
                if (err) throw reject(err);
                let results = [];


                for (let i = 0; i < hits.length; i++) {
                    let currHit = hits[i];
                    result.display_name = currHit._highlightResult.display_name.value;
                    result.display_name.match_level = currHit._highlightResult.display_name.matchLevel;
                    result.photo_url = currHit.photo_url;
                    result.objectID = currHit.objectID;
                    result.resultType = currHit.isTrainer == true ? "trainer" : "user";
                    result.location = currHit.location;
                    result.email = currHit.email;

                    results.push(result);
                }

                results.sort();

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
                            if (data.user_uuid == undefined  || data.user_uuid == "" || data == undefined || typeof(data) != 'object')
                            {

                                return;
                            }
                            nearbyUsers.push(data);
                        });
                    });
                } catch(error) {
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
                            if (data.user_uuid == undefined || data.user_uuid == "" || data == undefined || typeof(data) != 'object')
                            {
                                return;
                            }
                            nearbyUsers.push(data);
                        });
                    });
                } catch(error) {
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
    } catch(err) {
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

    getUsersInSameState = () => {

    }

    getRandomUsers = () => {

    }

    /******* Programs Collection Operations ******************/

    getUserProgramCollectionReference = (user_uuid) => {
        return USER_COLLECTION.doc(user_uuid).collection("programs");
    }

    /**
     * Creates a new program entry in the programs collection and adds the UUID for that program
     * to the current users program list.
     * 
     * Notes:
     * This method assumes only the current user can create a program for the account and send it to others.
     * @param uuid 
     */
    createProgram = async (uuid) => {
        PROGRAMS_COLLECTION.doc(uuid).set(getLupaProgramInformationStructure())
    }

    /**
     * Removes a specified value from a given away.
     * 
     * !!! Move to lupa/common/utils !!!
     * @param arr 
     * @param value 
     */
    arrayRemove(arr, value) {
        return arr.filter(function(ele)
        { return ele != value;
        });
    }

    /**
     * Used for deleting programs that were in the process of creation
     */
    deleteProgram = async (user_uuid, programUUID) => {
        let tempData = {}
        let updatedProgramList = []

        try {
       /* await USER_COLLECTION.doc(user_uuid).get().then(snapshot => {
            tempData = snapshot.data()
        })

        updatedProgramList = this.arrayRemove(tempData.programs, programUUID)

        await USER_COLLECTION.doc(user_uuid).update({
            programs: updatedProgramList
        })*/

        //delete program from lupa programs
        await PROGRAMS_COLLECTION.doc(programUUID).delete();
    } catch(err) {
        alert(err)
    }
    }

    loadCurrentUserPrograms = async () => {
        let programUUIDS = [], programsData = [];
        let temp;
        let uuid = await this.getCurrentUser().uid;

        if (typeof(uuid) == 'undefined') {

            return Promise.resolve([])
        }

        try {

            await USER_COLLECTION.doc(uuid).get().then(snapshot => {
                temp = snapshot.data();
             });

             programUUIDS = temp.programs;

             for (let i = 0; i <= programUUIDS.length; i++)
             {
                 await PROGRAMS_COLLECTION.doc(programUUIDS[i]).get().then(snapshot => {
                     temp = snapshot.data();
                 })


                 try {
                     if (typeof(temp) != 'undefined' && temp != null)
                     {
                         if (temp.program_name != "" && temp.program_image != "")
                         {
                            await programsData.push(temp)
                         }
                     }
                } catch(error) {
                    alert(error)
                    LOG_ERROR('UserController.ts', 'Unhandled exception in loadCurrentUserPrograms()', error)
                    continue;
                }

             }
        } catch(error) {
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
    saveProgram =  async (workoutData) => {
        let imageURL;
        await this.saveProgramImage(workoutData.program_structure_uuid, workoutData.program_image).then(url => {
            imageURL = url;
        })

        //update the program image in the structure
        workoutData.program_image = imageURL;

        /* Perform check on data */
        let checkedWorkoutData = workoutData;

        if (workoutData.program_tags == undefined || typeof(workoutData.program_tags) != "object")
        {
            checkedWorkoutData.program_tags = [];
        }

        //add program to lupa programs collection
        await PROGRAMS_COLLECTION.doc(workoutData.program_structure_uuid).set(checkedWorkoutData);

        //add uuid of program to user programs arr
        await this.updateCurrentUser('programs', workoutData.program_structure_uuid, 'add');

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
            type: NOTIFICATION_TYPES.RECEIVED_NOTIFICATION,
            actions: ['View', 'Delete'],
            timestamp: new Date().getTime()
        }

        let userNotifications = [];
        if (userList.length == 0) {
            return;
        }

        for (let i = 0; i < userList.length; i++)
        {
           await USER_COLLECTION.doc(userList[i]).get().then(snapshot => {
                userNotifications = snapshot.data().notifications;
            })
            await userNotifications.push(receivedProgramNotificationStructure);
            await USER_COLLECTION.doc(userList[i]).update({
                notifications: userNotifications,
            })
        }

    } catch(err) {
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
        } catch(error) {
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
        } catch(err) {
            return Promise.resolve([])
        }

        return Promise.resolve(notificationsQueue);
      }

      getFeaturedPrograms = async () => {
          let featuredProfiles = [];
          await PROGRAMS_COLLECTION.get().then(docs => {
              docs.forEach(doc => {
                  let snapshot = doc.data();
                if (typeof(snapshot) == 'undefined' || snapshot.program_name == null || typeof(snapshot.program_name) == 'undefined' || snapshot.program_image == '' || snapshot.completedProgram === false)
                {

                }
                else
                {
                    featuredProfiles.push(snapshot);
                }

              })
          });

          return Promise.resolve(featuredProfiles)
      }

      purchaseProgram = async (currUserData, programData) => {
        let updatedProgramSnapshot;
        let GENERATED_CHAT_UUID, chats;


        const currUserUUID = await currUserData
        const programOwnerUUID = programData.program_owner;

        try {
        //add the program to users list
        await this.updateCurrentUser('programs', programData.program_structure_uuid, 'add');
        //add the user as one of the program participants
        let updatedParticipants;
        await PROGRAMS_COLLECTION.doc(programData.program_structure_uuid).get().then(snapshot => {
           updatedParticipants = snapshot.data().program_participants;
        });

        updatedParticipants.push(currUserUUID);

        await PROGRAMS_COLLECTION.doc(programData.program_structure_uuid).update({
            program_participants: updatedParticipants,
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
        } catch(err) {
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

        } catch(err) {
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
        if (typeof(vlogStructure.vlog_media.uri) == 'undefined' || vlogStructure.vlog_media.uri == null || vlogStructure.vlog_media.uri == '') {
            
        } else {
            await this.saveVlogMedia(vlogStructure.vlog_media.uri).then(mediaURL => {
                generatedURL = mediaURL;
            });
    
            //Update the existing uri with the newly generated uri we retrieve from firestore storage.
            vlogStructure.vlog_media.uri = generatedURL;
        }

        //generate a uuid for the vlog using the vlog test
        const VLOG_UUID = Math.random().toString()

        //Add the UUID to the users vlog list
        this.updateCurrentUser('vlogs', VLOG_UUID, 'add', '');

        //Add the vlog structure to the vlog collection
        LUPA_DB.collection('vlogs').doc(VLOG_UUID).set(vlogStructure);
      }

      deleteVlog = (userID, vlogID) => {
        LUPA_DB.collection('vlogs').doc(userID).delete();

        let updatedVlogs = [];
        USER_COLLECTION.doc(userID).get().then(snapshot => {
            updatedVlogs = snapshot.data().vlogs;
        })

        this.arrayRemove(updatedVlogs, vlogID);
        USER_COLLECTION.doc(userID).update({
            vlogs: updatedVlogs
        });
      }

      getAllUserVlogs = async (uuid) => {
          let vlogsList = []
          let vlogsData = [];

          try {
            await USER_COLLECTION.doc(uuid).get().then(snapshot => {
                vlogsList = snapshot.data().vlogs;
            });
          } catch(error) {
              return Promise.resolve([])
          }

          for (let i = 0; i < vlogsList.length; i++) {
              await LUPA_DB.collection('vlogs').doc(vlogsList[i]).get().then(snapshot => {
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
