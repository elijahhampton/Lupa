/**
 * 
 */

import LUPA_DB, { LUPA_AUTH, FirebaseStorageBucket } from '../firebase/firebase.js';

const USER_COLLECTION = LUPA_DB.collection('users');
//const USER_PROGRAMS = LUPA_DB.collection('users/USER-UUID/programs'); For reference
const HEALTH_DATA_COLLECTION = LUPA_DB.collection('health_data');


//import * as algoliasearch from 'algoliasearch'; // When using TypeScript
const algoliasearch = require('algoliasearch/reactnative.js');
const algoliaUsersIndex = algoliasearch("EGZO4IJMQL", "f0f50b25f97f17ed73afa48108d9d7e6");
const usersIndex = algoliaUsersIndex.initIndex("dev_USERS");
const tmpIndex = algoliaUsersIndex.initIndex("tempDev_Users");

import { v4 as uuidv4 } from 'uuid';

import { UserCollectionFields, HealthDataCollectionFields } from './common/types';
import { getPathwaysForGoalUUID } from '../../model/data_structures/workout/goal_pathway_structures';
import { getLupaProgramInformationStructure } from '../../model/data_structures/programs/program_structures';
import { SnapshotViewIOSComponent, Alert } from 'react-native';
import { domainToASCII } from 'url';

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
                case 'mobile':
                    retValue = snapshot.mobile;
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
            }
        });

        return retValue;
    }

    /************** *********************/

    getCurrentUser = () => {
        return LUPA_AUTH.currentUser;
    }

    getCurrentUserUUID = () => {
        return LUPA_AUTH.currentUser.uid;
    }

    getCurrentUserData = async () => {
        let currentUserInformation;
        let currentUserUUID = await this.getCurrentUserUUID();
        await USER_COLLECTION.where('user_uuid', '==', currentUserUUID).get().then(docs => {
            docs.forEach(doc => {
                currentUserInformation = doc.data();
                return;
            })
        });

        return Promise.resolve(currentUserInformation);
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
                currentUserDocument.set({
                    bio: value,
                },
                    {
                        merge: true,
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
            case HealthDataCollectionFields.GOALS:
                let currentUserGoals = currentUserHealthDocumentData.goals;
                if (optionalData === 'add') {

                    let goalStructures = getPathwaysForGoalUUID(value);
                    let goalObject = {
                        goal_uuid: value,
                        pathways: goalStructures
                    }

                    currentUserGoals.push(goalObject);
                    currentUserHealthDocument.set({
                        goals: currentUserGoals
                    }, {
                        merge: true,
                    })
                }
                else if (optionalData === 'remove') {

                    let index;

                    for (let i = 0; i < currentUserGoals.length; i++) {
                        index = currentUserGoals[i].goal_uuid.indexOf(value);
                    }

                    currentUserGoals.splice(index);
                    currentUserHealthDocument.set({
                        goals: currentUserGoals
                    }, {
                        merge: true,
                    })
                }
                break;
        }
    }

    getUserInformationByUUID = async uuid => {
        let userResult, programsResult = [], servicesResult = [];
        await USER_COLLECTION.doc(uuid).get().then(result => {
            userResult = result.data();
            userResult.id = result.id;
        });

        await USER_COLLECTION.doc(uuid).collection('programs').get().then(docs => {
            docs.forEach(doc => {
                let snapshot = doc.data();
                programsResult.push(snapshot);
            })
        });

        await USER_COLLECTION.doc(uuid).collection('services').get().then(docs => {
            docs.forEach(doc => {
                let snapshot = doc.data();
                servicesResult.push(snapshot);
            })
        });

        userResult.programs = programsResult;
        userResult.services = servicesResult;

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
        await USER_COLLECTION.where('isTrainer', '==', true).get().then(docs => {
            docs.forEach(querySnapshot => {
                let snapshot = querySnapshot.data();
                let snapshotID = querySnapshot.id;
                snapshot.id = snapshotID;
                trainers.push(snapshot);
            })
        })

        return Promise.resolve(trainers);
    }


    /**************** *******************/

    indexUsersIntoAlgolia = async () => {
        let records = [];
        await USER_COLLECTION.get().then(docs => {
            docs.forEach(doc => {
                //Load user data from document
                let user = doc.data();

                //Set object ID (although this may not be necessary)
                user.objectID = doc.id;

                //Set necessary data for users
                let userData = {
                    objectID: user.objectID,
                    display_name: user.display_name,
                    email: user.email,
                    email_verified: user.email_verified,
                    gender: user.gender,
                    interest: user.interest,
                    isTrainer: user.isTrainer,
                    location: user.location,
                    mobile: user.mobile,
                    packs: user.packs,
                    photo_url: user.photo_url,
                    preferred_workout_times: user.preferred_workout_times,
                    time_created: user.time_created,
                    user_uuid: user.user_uuid,
                    username: user.username,
                    rating: user.rating, //For now we give all users a rating whether they are a trainer or nto
                    experience: user.experience
                }

                records.push(userData);
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


            /*usersIndex.addObjects(records, (err, content) => {
                if (err) {
                    console.log('big error: ' + err);
                }

                console.log('Completed User Indexing')
            });*/
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
            mobile: undefined,
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
        return new Promise((resolve, reject) => {
            let nearbyUsers = new Array();
            usersIndex.search({
                query: location.city,
                attributesToHighlight: ['location'],
            }, async (err, { hits }) => {
                if (err) throw reject(err);

                //parse all of ths hits for the city
                for (var i = 0; i < hits.length; ++i) {
                    let locationHighlightedResult = hits[i]._highlightResult;
                    let compare = (locationHighlightedResult.location.city.value.replace('<em>', '').replace('</em>', '').toLowerCase() == location.city.toLowerCase())
                    if (compare) {
                        await nearbyUsers.push(hits[i]);
                    }
                }

                //parse all of ths hits for the city
                for (var i = 0; i < hits.length; ++i) {
                    let locationHighlightedResult = hits[i]._highlightResult;
                    let compare = (locationHighlightedResult.location.state.value.replace('<em>', '').replace('</em>', '').toLowerCase() == location.state.toLowerCase())
                    if (compare) {
                        await nearbyUsers.push(hits[i]);
                    }
                }

                //parse all of ths hits for the city
                for (var i = 0; i < hits.length; ++i) {
                    let locationHighlightedResult = hits[i]._highlightResult;
                    let compare = (locationHighlightedResult.location.country.value.replace('<em>', '').replace('</em>', '').toLowerCase() == location.country.toLowerCase())
                    if (compare) {
                        await nearbyUsers.push(hits[i]);
                    }
                }
                resolve(nearbyUsers);
            })
        })

    }

    getNearbyTrainers = async (location) => {
        return new Promise((resolve, reject) => {
            let nearbyTrainers = new Array();
            usersIndex.search({
                query: location.city,
                attributesToHighlight: ['location'],
            }, async (err, { hits }) => {
                if (err) throw reject(err);
alert(hits.length)
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

                /*
                //parse all of ths hits for the city
                for (var i = 0; i < hits.length; ++i) {
                    let locationHighlightedResult = hits[i]._highlightResult;
                    let compare = (locationHighlightedResult.location.country.value.replace('<em>', '').replace('</em>', '').toLowerCase() == location.country.toLowerCase())
                    if (compare) {
                        await nearbyTrainers.push(hits[i]);
                    }
                }*/

                await nearbyTrainers.filter(trainer => {
                    return trainer.user_uuid != this.getCurrentUserUUID();
                })

                resolve(nearbyTrainers);
            })
        })

    }

    getUsersInSameState = () => {

    }

    getRandomUsers = () => {

    }

    /******* Programs Collection Operations ******************/

    getUserProgramCollectionReference = (user_uuid) => {
        return USER_COLLECTION.doc(user_uuid).collection("programs");
    }

    createProgram = async (user_uuid) => {
        let programUUID;

        let program_structure_payload = await getLupaProgramInformationStructure();

        //
        await USER_COLLECTION.doc(user_uuid).collection("programs").add(program_structure_payload).then(ref => {
            programUUID = ref.id;
        });

        //update fb doc with uuid
        let currentProgramDoc = USER_COLLECTION.doc(user_uuid).collection("programs").doc(programUUID);
        currentProgramDoc.update({
            program_structure_uuid: programUUID,
        })

        //
        program_structure_payload.program_structure_uuid = programUUID;

        return Promise.resolve(program_structure_payload);
    }

    deleteProgram = async (user_uuid, programUUID) => {
        await USER_COLLECTION.doc(user_uuid).collection("programs").doc(programUUID).delete();
    }

    loadCurrentUserPrograms = async () => {
        let programs = [];
        let uuid = await this.getCurrentUser().uid;
        await USER_COLLECTION.doc(uuid).collection("programs").get().then(docs => {
            docs.forEach(doc => {
                if (docs.length == 0)
                {
                    return Promise.resolve([]);
                }
                let snapshot = doc.data();
                if (snapshot.program_name != undefined || snapshot.program_name != "")
                {
                    snapshot.program_uuid = doc.id;
                    programs.push(snapshot);
                }
            });
        });

        if (programs.length == 0 || !programs.length)
        {
            return Promise.resolve([]);
        }

        return Promise.resolve(programs);
    }

    createService = async (serviceObject) => {
        let uuid = await this.getCurrentUser().uid;
        USER_COLLECTION.doc(uuid).collection('services').add(serviceObject);
    }

    loadCurrentUserServices = async () => {
        let services = [];
        let uuid = await this.getCurrentUser().uid;
        await USER_COLLECTION.doc(uuid).collection("services").get().then(docs => {
            docs.forEach(doc => {
                if (docs.length == 0)
                {
                    return Promise.resolve ([]);
                }
                let snapshot = doc.data();
                if (snapshot.service_name != undefined || snapshot.service_name != "")
                {
                    snapshot.service_uuid = doc.id;
                    services.push(snapshot);
                }
            });
        });

        if (services.length == 0 || !services.length)
        {
            return Promise.resolve([]);
        }

        return Promise.resolve(services);
    }

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

    saveProgram =  async (user_uuid, workoutData) => {
        let imageURL;
        await this.saveProgramImage(workoutData.program_structure_uuid, workoutData.program_image).then(url => {
            imageURL = url;
        })

        //update the program image in the structure
        workoutData.program_image = imageURL;

         await USER_COLLECTION.doc(user_uuid).collection("programs").doc(workoutData.program_structure_uuid).set(workoutData);
    
         let payload;
         await USER_COLLECTION.doc(user_uuid).collection("programs").doc(workoutData.program_structure_uuid).get().then(snapshot => {
             payload = snapshot.data();
         })

         return Promise.resolve(payload);
        }

    handleSendUserProgram = async (currUserUUID, currUserData, currUserDisplayName, userList, program) => {
      
      try {

      let receivedProgramNotificationStructure = {
            data: program,
            from: currUserUUID,
            fromData: currUserData,
            to: userList,
            read: false,
            type: 'RECEIVED_PROGRAMS',
            actions: ['Save', 'View', 'Delete'],
        }

        let userNotifications = [];
        for (let i = 0; i < userList.length; i++)
        {   
            alert(userList[i])
           await USER_COLLECTION.doc(userList[i]).get().then(snapshot => {
                userNotifications = snapshot.data().notifications;
            })

            await userNotifications.push(receivedProgramNotificationStructure);

            await USER_COLLECTION.doc(userList[i]).update({
                notifications: userNotifications,
            })
        }

    } catch(err) {
        alert('aaaaaa')
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
        let result;

        await USER_COLLECTION.doc(this.getCurrentUser().uid).get().then(snapshot => {
            result = snapshot.data().chats;
        });

        return Promise.resolve(result);
    }

    addAssessment = async (assessment_uuid) => {
        let currUserAssessments = [];
        await USER_COLLECTION.doc(this.getCurrentUserUUID()).get().then(snapshot => {
            currUserAssessments = snapshot.data().assessments;
        })

        if (currUserAssessments.includes(assessment_uuid))
        {
            currUserAssessments.splice(currUserAssessments.indexOf(assessment_uuid), 1);
        }

        currUserAssessments.push(assessment_uuid);

        USER_COLLECTION.doc(this.getCurrentUserUUID()).update({
            assessments: currUserAssessments
        })
    }

    getUserAssessment = async (acronym, user_uuid) => {
        let retVal;
        await LUPA_DB.collection('assessments').doc(acronym + "_" + user_uuid).get().then(snapshot => {
            retVal = snapshot.data();
        });
        
        return Promise.resolve(retVal);
    }

    /* designing programs */
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

    getUserNotificationsQueue = async () => {
        let queue;
        let uuid = await this.getCurrentUserUUID();

        await USER_COLLECTION.doc(uuid).get().then(snapshot => {
            queue = snapshot.data()
        })

        const res = queue.notifications;

        return Promise.resolve(res);
      }

}

//me
/*
chats = [
    me+you = sdjf89fh3984hf9wfiwehfoifioeww


]

*/