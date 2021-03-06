/**
 *
 */

import LUPA_DB, {
    LUPA_AUTH,
    Fire,
    FirebaseStorageBucket
} from '../firebase/firebase.js';

const USER_COLLECTION = LUPA_DB.collection('users');
const PROGRAMS_COLLECTION = LUPA_DB.collection('programs');
const VLOGS_COLLECTION = LUPA_DB.collection('vlogs');
const WORKOUTS_COLLECTION = LUPA_DB.collection('workouts');
const COMMUNITY_COLLECTION = LUPA_DB.collection('communities');

//import * as algoliasearch from 'algoliasearch'; // When using TypeScript
const algoliasearch = require('algoliasearch/reactnative.js');
const algoliaIndex = algoliasearch("EGZO4IJMQL", "f0f50b25f97f17ed73afa48108d9d7e6");
const usersIndex = algoliaIndex.initIndex("dev_USERS");
const tmpIndex = algoliaIndex.initIndex("tempDev_Users");
const programsIndex = algoliaIndex.initIndex("dev_Programs");
const tmpProgramsIndex = algoliaIndex.initIndex("tempDev_Programs");

usersIndex.setSettings({
  highlightPreTag: '',
  highlightPostTag: ''
});

import { Booking, BOOKING_STATUS } from '../../model/data_structures/user/types';
import { getBookingStructure } from '../../model/data_structures/user/booking'
import { LupaUserStructure, UserCollectionFields } from './common/types';
import { getLupaProgramInformationStructure } from '../../model/data_structures/programs/program_structures';
import { createCommunityReview, initializeNewCommunity } from '../../model/data_structures/community/community';
import LOG, { LOG_ERROR } from '../../common/Logger';
import { getLupaUserStructure, getLupaUserStructurePlaceholder } from '../firebase/collection_structures';
import { NOTIFICATION_TYPES } from '../../model/notifications/common/types'
import ProgramController from './ProgramController';
import moment from 'moment';
import { CommunityEvent } from '../../model/data_structures/community/types.js';
import { PackType } from '../../model/data_structures/packs/types.js';

export default class UserController {
    private static _instance: UserController;
    private fbStorage = new FirebaseStorageBucket();
    private PROGRAMS_CONTROLLER_INSTANCE = ProgramController.getInstance();

    private constructor() {}

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
     * @param user_uuid UUID of the user to search for
     * @param curatedTrainersArr Array to check if the user exist in
     * @returns boolean Returns a boolean based on if the user with the user_uuid exist in this array or not
     */
    checkIfUserExistInCuratedTrainers = (user_uuid : String, curatedTrainersArr : Array<Object>) : Boolean => {
        for(let i = 0; i < curatedTrainersArr.length; i++) {
            if (curatedTrainersArr[i].user_uuid) {
                return true;
            }
        }

        return false;
    }

    /**
     * 
     * @param uuid UUID of the user for which to curate trainers.
     * @param attributes Array of attributes to base trainer generation.
     * @return Array of trainers.
     */
    generateCuratedTrainers = async (location: Object): Promise<Array<Object>> => {
        let curatedTrainers = new Array();

        const city = location.city;
        const state = location.state;
        const attributesToRetrieve = ['user_uuid', 'location', 'display_name', 'scheduler_times', 'isTrainer', 'email', 'photo_url']

        if (typeof(city) == 'undefined' || typeof(state) == 'undefined') {
            LOG_ERROR('UserController.ts', 'generateCuratedTrainers::One or more of the values in the location object were undefined.  Returning from function.', 'Undefined parameters in generateCuratedTrainers.');
            resolve([])
        }

        return new Promise( async (resolve, reject) => {
            //search our algolia index for user that match the city query and add them to our array
            await usersIndex.search(city, {
                attributesToRetrieve: attributesToRetrieve
            }).then(({hits}) => {
                const results = hits;
                let result = {};
                for (let i = 0; i < results.length; i++) {
                    result = results[i];
                    if (result._highlightResult.location.city.matchLevel == 'full') {
                        delete result._highlightResult;
                        curatedTrainers.push(result);
                    }
                }
            }).catch(error => {
                LOG_ERROR('UserController.ts', 'generateCuratedTrainers::Caught exception searching for users with city value: ' + city, error);
                resolve([])
            })

            //search our algolia index for user that match the state query and add them to our array only
            //if they do not exist in the array
            await usersIndex.search(state, {
                attributesToRetrieve: attributesToRetrieve
            })
            .then(async ({hits}) => {
                const results = hits;
                let result = {};
                for (let i = 0; i < results.length; i++) {
                    result = results[i];
                    if (result._highlightResult.location.state.matchLevel == 'full') {
                        const userAlreadyExist = await this.checkIfUserExistInCuratedTrainers(result.user_uuid, curatedTrainers);
                        if (!userAlreadyExist) {
                            delete result._highlightResult;
                            curatedTrainers.push(result);
                        }
                    }
                }
            })
            .catch(error => {
                LOG_ERROR('UserController.ts', 'generateCuratedTrainers::Caught exception searching for users with state value: ' + state, error);
                if (curatedTrainers.length != 0 && typeof(curatedTrainers) == 'object') {
                    resolve(curatedTrainers)
                } else {
                    resolve([])
                }
            })

            LOG('UserController.ts', 'generateCuratedTrainers::Returning curated trainers from generateCuratedTrainers with a length of: ' + curatedTrainers.length);
            resolve(curatedTrainers);
        });
    }

    /**
     * Saves a users profile image in the firebase storage bucket.
     * @param string URI of the profile image.
     * @return Returns a promise resolving the URL of the profile image in the storage bucket.
     */
    saveUserProfileImage = async (string: String): Promise<String> => {
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
    getArrayOfUserObjectsFromUUIDS = async (arrOfUUIDS: Array<String>): Array<Object> => {
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

    /**
     * Returns an attribute from a user based on a uuid.
     * @param uuid 
     * @param attribute 
     */
    getAttributeFromUUID = async (uuid: String, attribute: String): Promise<any> => {
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
                case 'stripe_metadata':
                    retValue = snapshot.stripe_metadata;
                    break;
                case 'client_metadata':
                    retValue = snapshot.client_metadata;
                    break;
                case 'trainer_metadata':
                    retValue = snapshot.trainer_metadata;
                    break;
            }
        });

        return retValue;
    }

    /************** *********************/

    /**
     * DEPRECATED - To be removed in version 0.8
     * @deprecated
     */
    getCurrentUser = () => {
        return LUPA_AUTH.currentUser;
    }

    /**
     * DEPRECATED - To be removed in version 0.8
     * @deprecated
     */
    getCurrentUserUUID = async () => {
        return await LUPA_AUTH.currentUser.uid;
    }

    /**
     * Returns data for the current user if no uuid is specified else 
     * returns data from the uuid given.
     * @param uuid 
     */
    getCurrentUserData = async (uuid = 0): Promise<Object> => {
        let data = {}
        try {
            let currentUserInformation = {}
            if (uuid == 0) {
                let currentUserUUID = await this.getCurrentUserUUID();
                await USER_COLLECTION.where('user_uuid', '==', currentUserUUID).limit(1).get().then(docs => {
                    docs.forEach(doc => {
                        if (doc.exists) {
                            currentUserInformation = doc.data();
                            return;
                        } else {
                            throw 'User document does not exist.'
                        }
                       
                    })
                })

                return Promise.resolve(currentUserInformation)
            }

            await USER_COLLECTION.doc(uuid).get().then(snapshot => {
                data = snapshot.data()
            })

            return Promise.resolve(data);

        } catch (error) {
            let errdata = getLupaUserStructurePlaceholder();
            return Promise.resolve(errdata)
        }

    }

    /**
     * Updates a specified field for the current user in the database.
     * @param fieldToUpdate 
     * @param value 
     * @param optionalData 
     * @param optionalDataTwo 
     */
    updateCurrentUser = async (fieldToUpdate: String, value: any, optionalData: any = "", optionalDataTwo: any = "") => {
        let currentUserHealthDocumentData;

        let currentUserDocument = await USER_COLLECTION.doc(this.getCurrentUser().uid);
        let userData = getLupaUserStructurePlaceholder();
        let trainerMetadata = undefined;
        let clientMetadata = undefined;

        switch (fieldToUpdate) {
            case 'experience_level':
                currentUserDocument.get().then(documentSnapshot => {
                    userData = documentSnapshot.data()
                });

                this.checkUserStructure(userData, getLupaUserStructurePlaceholder());
                clientMetadata = userData.client_metadata;
                clientMetadata.experience_level = value;

                currentUserDocument.update({
                    client_metadata: value
                });
                break;
            case 'client_metadata':
                currentUserDocument.get().then(documentSnapshot => {
                    userData = documentSnapshot.data()
                });

                this.checkUserStructure(userData, getLupaUserStructurePlaceholder());
                clientMetadata = userData.client_metadata;
                clientMetadata.client_metadata = value;

                currentUserDocument.update({
                    client_metadata: value
                });
                break;
            case 'exercise_space':
                currentUserDocument.get().then(documentSnapshot => {
                    userData = documentSnapshot.data()
                });

                this.checkUserStructure(userData, getLupaUserStructurePlaceholder());
                trainerMetadata = userData.trainer_metadata;
                trainerMetadata.exercise_space = value;

                currentUserDocument.update({
                    trainer_metadata: trainerMetadata
                });
                break;
            case 'trainer_interest':
                currentUserDocument.get().then(documentSnapshot => {
                    userData = documentSnapshot.data()
                });

                this.checkUserStructure(userData, getLupaUserStructurePlaceholder());
                trainerMetadata = userData.trainer_metadata;
                trainerMetadata.trainer_interest = value;

                currentUserDocument.update({
                    trainer_metadata: trainerMetadata
                });
                break;
            case 'trainer_metadata':
                    currentUserDocument.get().then(documentSnapshot => {
                        userData = documentSnapshot.data()
                    });
    
                    this.checkUserStructure(userData, getLupaUserStructurePlaceholder());
                    trainerMetadata = userData.trainer_metadata;
                    trainerMetadata = value;
    
                    currentUserDocument.update({
                        trainer_metadata: trainerMetadata
                    });
                    break;
            case 'personal_equipment_list':
                currentUserDocument.get().then(documentSnapshot => {
                    userData = documentSnapshot.data()
                });

                this.checkUserStructure(userData, getLupaUserStructurePlaceholder());
                trainerMetadata = userData.trainer_metadata;
                trainerMetadata.personal_equipment_list = value;

                currentUserDocument.update({
                    trainer_metadata: trainerMetadata
                });
                break;
            case 'isTrainer':
                currentUserDocument.update({
                    isTrainer: value
                })
                break;
            case 'certification':
                currentUserDocument.update({
                    certification: value
                })
                break;
            case 'interest':
                currentUserDocument.update({
                    interest: value
                })
                break;
            case 'bookings':
                let bookings = []

                if (optionalData == 'add') {
                    await currentUserDocument.get().then(result => {
                        bookings = result.data().bookings;
                    });

                    bookings.push(value);

                    currentUserDocument.update({
                        bookings: bookings
                    });
                }
                break;
            case 'last_completed_workout':
                currentUserDocument.update({
                    last_completed_workout: value
                });
                break;
            case 'scheduler_times':
                console.log(value)
                if (optionalData == 'update') {
                    currentUserDocument.update({
                        scheduler_times: value
                    });
                    break;
                }

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
                        value.date_purchased = new Date().getDate();

                        programDataList.push(value);

                        await currentUserDocument.update({
                            program_data: programDataList
                        });
                    }
                    else if (optionalData == 'remove') {

                    }
                } catch (error) {

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
                    updatedPacksData.push(value);

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
            case 'stripe_metadata':
                currentUserDocument.update({
                    stripe_metadata: value
                })
                break;
            case 'has_completed_onboarding':
                currentUserDocument.update({
                    has_completed_onboarding: true
                })
                break;
            case 'clients':
                let clients = [];
                await currentUserDocument.get().then(snapshot => {
                    clients = snapshot.data().clients;
                });

                clients.push(value);

                if (optionalData == 'add') {
                    clients.push(value);
                } else if (optionalData == 'remove') {
                   clients.splice(clients.indexOf(value), 1);
                }

                currentUserDocument.update({
                    clients: clients
                })
                break;
        }
    }

    /**
     * Returns a user's information based on the uuid given.
     * @param uuid 
     */
    getUserInformationByUUID = async (uuid: String): Promise<Object> => {
        let userResult = getLupaUserStructure(), docData = getLupaProgramInformationStructure(), userPrograms = []

        if (uuid == "" || typeof (uuid) == 'undefined') {
            return Promise.resolve(userResult)
        }

        try {
            await USER_COLLECTION.doc(uuid).get().then(result => {
                userResult = result.data();
            });

            if (typeof (userResult) == 'undefined') {
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

    /**
     * 
     * @param uuidOfAccountBeingFollowed 
     * @param uuidOfFollower 
     */
    addFollowerToUUID = async (uuidOfAccountBeingFollowed: String, uuidOfFollower: String) => {
        let result = getLupaUserStructure();
        await USER_COLLECTION.doc(uuidOfAccountBeingFollowed).get().then(snapshot => {
            result = snapshot.data();
        })


        //Get the current followers
        let currentFollowers = [];
        if (typeof (result.followers) == 'undefined') {
            currentFollowers = []
        } else {
            currentFollowers = result.followers;
        }

        //add the follower to the current followers
        currentFollowers.push(uuidOfFollower);

        //update followers
        await USER_COLLECTION.doc(uuidOfAccountBeingFollowed).update({
            followers: currentFollowers
        });
    }

    /**
     * 
     * @param uuidOfUserToFollow 
     * @param uuidOfUserFollowing 
     */
    followAccountFromUUID = async (uuidOfUserToFollow: String, uuidOfUserFollowing: String) => {
        let result = getLupaUserStructure();
        await USER_COLLECTION.doc(uuidOfUserFollowing).get().then(snapshot => {
            result = snapshot.data();
        });

        //get the current following
        let currentFollowing = [];
        if (typeof (result.following) == 'undefined') {
            currentFollowing = []
        } else {
            currentFollowing = result.following;
        }

        //add the following to the current followers
        currentFollowing.push(uuidOfUserToFollow);

        //update following
        await USER_COLLECTION.doc(uuidOfUserFollowing).update({
            following: currentFollowing
        });
    }

    /**
     * 
     * @param uuidOfUserToUnfollow 
     * @param uuidOfUserUnfollowing 
     */
    unfollowAccountFromUUID = async (uuidOfUserToUnfollow: String, uuidOfUserUnfollowing: String) => {
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

    /**
     * 
     * @param uuidOfUserToRemove 
     * @param uuidOfUserUnfollowing 
     */
    removeFollowerFromUUID = async (uuidOfUserToRemove: String, uuidOfUserUnfollowing: String) => {
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

    /**
     * 
     */
    getTrainers = async (): Promise<Array<Object>> => {
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

            trainers = []
        }

        return Promise.resolve(trainers);
    }

    /**
     * 
     */
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

    /**
     * 
     */
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
                        hourly_payment_rate: user.hourly_payment_rate,
                        certification: user.certification,
                        trainer_metadata: user.trainer_metadata,
                        client_metadata: user.client_metadata,
                        homegym: user.homegym,
                        programs: user.programs
                    }

                    console.log('adding a user FROM CONTROLLER  ')
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

            return false;
        }
    }

    /**
     * 
     * @param startsWith 
     */
    searchTrainersByDisplayName = (startsWith = ''): Promise<Array<Object>> => {
        let currHit = getLupaUserStructurePlaceholder();

        return new Promise(async (resolve, reject) => {
            const query = startsWith.toLowerCase();
            let results = [];

            try {
                usersIndex.search({
                    query: query,

                }, (err, { hits }) => {
                    if (err) throw reject(err);

                    for (let i = 0; i < hits.length; i++) {
                        currHit = hits[i];
                        if (typeof (currHit) == 'undefined') {

                        } else {
                            results.push(currHit);
                        }
                    }
                });
            } catch (error) {
                LOG_ERROR('', '', error);

                await USER_COLLECTION.where('isTrainer', '==', true).get().then(collectionRef => {
                    collectionRef.docs.forEach(doc => {
                        currHit = doc.data();

                        if (typeof (currHit) == 'undefined') {

                        } else {
                            results.push(currHit);
                        }
                    });
                })

                resolve(results)
            }

            resolve(results);
        })
    }


    /**
     * 
     * @param startsWith 
     */
    searchPrograms = (startsWith = ''): Promise<Array<Object>> => {
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

    /**
     * 
     * @param location 
     */
    getNearbyUsers = async (location): Promise<Array<String>> => {
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

                })
            })
        } catch (err) {
            return Promise.resolve([])
        }

    }

    /**
     * 
     * @param location 
     */
    getNearbyTrainers = async (location): Promise<Array<String>> => {
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
    arrayRemove(arr, value): Array<any> {
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

        }
    }

    /**
     *  /**
     * Used for deleting workouts that were in the process of creation
     */
    deleteWorkout = async (user_uuid: String, workoutUUID: String) => {
        await WORKOUTS_COLLECTION.doc(workoutUUID).delete();
    }

    loadCurrentUserPrograms = async (): Promise<Array<Object>> => {
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

                    LOG_ERROR('UserController.ts', 'Unhandled exception in loadCurrentUserPrograms()', error)
                    continue;
                }

            }
        } catch (error) {

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
    saveProgramImage = async (programUUID: String, url: String): Promise<String> => {
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
    saveProgram = async (workoutData: Object) => {
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
    handleSendUserProgram = async (currUserData: Object, userList: Array<String>, program: Object) => {
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

           // this.PROGRAMS_CONTROLLER_INSTANCE.addProgramShare(program.program_structure_uuid, userList.length);

        } catch (err) {

        }

    }

    /**
     * User one is the sender?
     * @param currUserUUID 
     * @param userTwo 
     */
    getPrivateChatUUID = async (currUserUUID: String, userTwo: String): Promise<String> => {
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


    /**
     * 
     */
    getAllCurrentUserChats = async (): Promise<Array<Object>> => {
        let result = [];

        try {
            await USER_COLLECTION.doc(this.getCurrentUser().uid).get().then(snapshot => {
                result = snapshot.data().chats;
            });
        } catch (error) {

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
    saveProgramWorkoutGraphic = async (workout: any, programUUID: String, graphicType: String, uri: String): Promise<String> => {
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

    /**
     * 
     * @param uuid 
     */
    getUserNotificationsQueue = async (uuid: String): Promise<Array<Object>> => {
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

    /**
     * 
     */
    getFeaturedPrograms = async (): Promise<Array<Object>> => {
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

    /**
     * WE DONT USE THIS ANYMORE! PURCHASE DATA MODIFICATION TAKES PLACE ON Server FROM WEBSITE
     * @param currentUserData 
     * @param programData 
     */
    purchaseProgram = async (currentUserData: Object, programData: Object) => {
        let updatedProgramSnapshot;
        let GENERATED_CHAT_UUID, chats;

        let currUserData = currentUserData;

        if (typeof (currUserData) == 'undefined') {
            const uuid = await LUPA_AUTH.currentUser.uid;
            USER_COLLECTION.doc(uuid).get().then(documentSnapshot => {
                currUserData = documentSnapshot.data();
            })
        }


        const currUserUUID = await currUserData.user_uuid
        const programOwnerUUID = programData.program_owner;


        //add the program and programData to users list
        await this.updateCurrentUser('programs', programData.program_structure_uuid, 'add');
        let variationProgramData = programData;
        variationProgramData.date_purchased = new Date()
        variationProgramData.workouts_completed = 0;
        variationProgramData.program_started = false;
        await this.updateCurrentUser('program_data', variationProgramData, 'add');

        //add the user as one of the program participants
        let updatedParticipants = [], updatedPurchaseMetadata = {}
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

        try {

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
            await PROGRAMS_COLLECTION.doc(programData.program_structure_uuid).get().then(snapshot => {
                updatedProgramSnapshot = snapshot.data();
            })

            return Promise.resolve(updatedProgramSnapshot);
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
            await PROGRAMS_COLLECTION.doc(programData.program_structure_uuid).get().then(snapshot => {
                updatedProgramSnapshot = snapshot.data();
            })

            return Promise.resolve(updatedProgramSnapshot);
        }


        /************/

        //update the program sales data (LATER)

        await PROGRAMS_COLLECTION.doc(programData.program_structure_uuid).get().then(snapshot => {
            updatedProgramSnapshot = snapshot.data();
        })
        return Promise.resolve(updatedProgramSnapshot);
    }

    /**
     * 
     * @param uri 
     */
    saveVlogMedia = async (uri: String): Promise<Array<String>> => {
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

    saveVlog = async (vlogStructure: Object) => {
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

    saveCommunityVlog = async (communityUID, vlogStructure: Object) => {
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
        COMMUNITY_COLLECTION.doc(communityUID).collection('vlogs').doc(VLOG_UUID).set(vlogStructure);
    }

    /**
     * Deletes a vlog based on a user's id and vlog id.
     * @param userID User UUID of vlogs to delete.
     * @param vlogID Vlog ID of which vlog to delete.
     */
    deleteVlog = (userID: String, vlogID: String): void => {
        VLOGS_COLLECTION.doc(vlogID).delete();

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
    getAllUserVlogs = async (uuid: String): Promise<Array<Object>> => {
        let vlogsList = []
        let vlogsData = [];

        try {
            await USER_COLLECTION.doc(uuid).get().then(snapshot => {
                vlogsList = snapshot.data().vlogs;
            });
        } catch (error) {

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

    startProgram = async (userUUID: String, programUUID: String) => {
        //Obtain the users document given the UUID
        let userData = getLupaUserStructure();
        await USER_COLLECTION.doc(userUUID).get().then(documentSnapshot => {
            userData = documentSnapshot.data();
        });

        //Search for the correct program in the user's program data
        let userProgramData = userData.program_data;
        let foundProgram = getLupaProgramInformationStructure();
        let found = false;
        let foundIndex = 0;
        for (let i = 0; i < userProgramData.length; i++) {
            if (userProgramData[i].program_structure_uuid == programUUID) {
                found = true;
                foundProgram = userProgramData[i];
                foundIndex = i;
                continue;
            }
        }

        //If we can't find it we just return from this function
        //if we find it then we need to set program_started to true, reset the start date, and end date
        //according to the program_duration
        if (found === false) {
            return;
        }

        //Give the program a start date of today and an end date based on the program duration
        let newStartDate = moment().format(); // 2020-09-23T21:09:59-04:00
        let newEndDate = moment().add(foundProgram.program_duration, 'weeks');
        foundProgram.program_start_date = newStartDate;
        foundProgram.program_end_date = newEndDate;

        //set the program as started
        foundProgram.program_started = true;

        //replace the program at the saved index and update the users program data
        userProgramData[foundIndex] = foundProgram;
        await USER_COLLECTION.doc(userUUID).update({
            program_data: userProgramData
        })
    }

    resetProgram = async (userUUID: String, programUUID: String) => {
        //Obtain the users document given the UUID
        let userData = getLupaUserStructure();
        await USER_COLLECTION.doc(userUUID).get().then(documentSnapshot => {
            userData = documentSnapshot.data();
        });

        //Search for the correct program in the user's program data
        let userProgramData = userData.program_data;
        let foundProgram = getLupaProgramInformationStructure();
        let found = false;
        let foundIndex = 0;
        for (let i = 0; i < userProgramData.length; i++) {
            if (userProgramData[i].program_structure_uuid == programUUID) {
                found = true;
                foundProgram = userProgramData[i];
                foundIndex = i;
                continue;
            }
        }

        //If we can't find it we just return from this function
        //if we find it then we need to set program_started to true, reset the start date, and end date
        //according to the program_duration
        if (found === false) {
            return;
        }

        //Give the program a start date of today and an end date based on the program duration
        let newStartDate = moment().format(); // 2020-09-23T21:09:59-04:00
        let newEndDate = moment().add(foundProgram.program_duration, 'weeks').format()
        foundProgram.program_start_date = newStartDate;
        foundProgram.program_end_date = newEndDate;

        //replace the program at the saved index and update the users program data
        userProgramData[foundIndex] = foundProgram;
        await USER_COLLECTION.doc(userUUID).update({
            program_data: userProgramData
        })
    }


    stopProgram = async (userUUID: String, programUUID: String) => {
        //Obtain the users document given the UUID
        let userData = getLupaUserStructure();
        await USER_COLLECTION.doc(userUUID).get().then(documentSnapshot => {
            userData = documentSnapshot.data();
        });

        //Search for the correct program in the user's program data
        let userProgramData = userData.program_data;
        let foundProgram = getLupaProgramInformationStructure();
        let found = false;
        let foundIndex = 0;
        for (let i = 0; i < userProgramData.length; i++) {
            if (userProgramData[i].program_structure_uuid == programUUID) {
                found = true;
                foundProgram = userProgramData[i];
                foundIndex = i;
                continue;
            }
        }

        //If we can't find it we just return from this function
        //if we find it then we need to set program_started to true, reset the start date, and end date
        //according to the program_duration
        if (found === false) {
            return;
        }

        //set the found program's field program_started to false
        foundProgram.program_started = false;

        //replace the program at the saved index and update the users program data
        userProgramData[foundIndex] = foundProgram;
        await USER_COLLECTION.doc(userUUID).update({
            program_data: userProgramData
        })
    }

    /**
     * 
     * @param booking 
     */
    createBookingRequestFromTrainer = (booking: Object) => {

    }

    /**
     * 
     * @param a 
     * @param b 
     */
    checkUserStructure(a: Object, b: Object) {
        return Object.keys(a).length === Object.keys(b).length
            && Object.keys(a).every(k => b.hasOwnProperty(k))
    }

    /**
     * TODO: Look into checkuseStructure() usage
     * @param booking 
     */
    createBookingRequest = async (booking: Object, isAuthenticatedUser?: Boolean, unauthenticatedUserUUID?: String): Promise<Boolean> => {
        const requesterUUID = booking.requester_uuid;
        const trainerUUID = booking.trainer_uuid;

        let isFirstSession = true;
        await LUPA_DB.collection('bookings')
        .get()
        .then(async querySnapshot=> {
            await querySnapshot.docs.forEach(doc => {
                let data = doc.data();

                if (data.requester_uuid == requesterUUID && data.trainer_uuid == trainerUUID) {
                    isFirstSession = false;
                }
            });

            booking.isFirstSession = isFirstSession;
        });

        //create booking
        await LUPA_DB.collection('bookings').doc(booking.uid).set(booking)
            .then(docRef => {
                console.log('success')
            })
            .catch(error => {
                console.log(error)
            });


        //add the booking uuid to both users booking fields
        //the requester
        if (isAuthenticatedUser === true) {
            this.updateCurrentUser('bookings', booking.uid, 'add');
        }

        let userData = getLupaUserStructure();
        await USER_COLLECTION.doc(trainerUUID).get().then(documentSnapshot => {
            userData = documentSnapshot.data();
        }).catch(error => {
            console.log('error for trainer?')
        })


        if (!this.checkUserStructure(userData, getLupaUserStructure())) {
            userData = Object.assign(getLupaUserStructure(), userData)
        }

        let trainerBookings = userData.bookings;
        trainerBookings.push(booking.uid);

        USER_COLLECTION.doc(trainerUUID).update({
            bookings: trainerBookings
        })

        //send notification to trainer. here we just need to add the notification to the users notification list and
        //allow firebase fucntions to do the rest

        //create notification
        const receivedProgramNotificationStructure = {
            notification_uuid: Math.random().toString(),
            data: booking,
            from: requesterUUID,
            to: trainerUUID,
            read: false,
            type: NOTIFICATION_TYPES.BOOKING_REQUEST,
            actions: ['Accept', 'View', 'Delete'],
            timestamp: new Date().getTime()
        }

        //add notification to users notification array
        let userNotifications = [];


        await USER_COLLECTION.doc(trainerUUID).get().then(snapshot => {
            userNotifications = snapshot.data().notifications;
        })
        await userNotifications.push(receivedProgramNotificationStructure);

        await USER_COLLECTION.doc(trainerUUID).update({
            notifications: userNotifications,
        });

        return Promise.resolve(true);
    }

    handleDeclineBooking = async (booking_uid: String | Number) => {
        const bookingID = booking_uid;
        let booking : Booking = {} 
        await LUPA_DB.collection('bookings').doc(bookingID).get().then(documentSnapshot => {
            booking = documentSnapshot.data();
            booking.status = BOOKING_STATUS.BOOKING_DENIED
        });

        const trainer_uuid = booking.trainer_uuid;
        const requester_uuid = booking.requester_uuid;

        let userData = getLupaUserStructure(), notifications = []

        //Delete the booking from the trainers list
        await USER_COLLECTION.doc(trainer_uuid).get().then(documentSnapshot => {
            userData = documentSnapshot.data();
        });
        if (!this.checkUserStructure(userData, getLupaUserStructure())) {
            userData = Object.assign(getLupaUserStructure(), userData)
        }

        //remove the notification with any data that has the booking_uid field
        notifications = userData.notifications;

        let index = 0, notificationType = "";
        for (let i = 0; i < notifications.length; i++) {
            if (notifications[i].hasOwnProperty('type')) {
                notificationType = notifications[i]['type'];
                if (notificationType == 'BOOKING_REQUEST') {
                    if (notifications[i].data.uid == booking_uid) {
                        index = i;
                    }
                }
            }
        }

        let updatedNotifications = notifications;
        updatedNotifications.splice(index, 1);
       

        USER_COLLECTION.doc(trainer_uuid).update({
            notifications: updatedNotifications
        });

        

        //Delete the booking from the requesters list
        await USER_COLLECTION.doc(requester_uuid).get().then(documentSnapshot => {
            userData = documentSnapshot.data();
        });
        if (!this.checkUserStructure(userData, getLupaUserStructure())) {
            userData = Object.assign(getLupaUserStructure(), userData)
        }

        //remove the notification with any data that has the booking_uid field
        notifications = userData.notifications;
        index = 0, notificationType = "";
        for (let i = 0; i < notifications.length; i++) {
            if (notifications[i].hasOwnProperty('type')) {
                notificationType = notifications[i]['type'];
                if (notificationType == 'BOOKING_REQUEST') {
                    if (notifications[i].data.uid == booking_uid) {
                        index = i;
                    }
                }
            }
        }

        updatedNotifications = notifications;
        updatedNotifications.splice(index, 1);

        USER_COLLECTION.doc(trainer_uuid).update({
            notifications: updatedNotifications
        });
    }

    handleAcceptedBooking = async (booking_uid: String | Number) => {
        const bookingID = booking_uid;
        let booking = {}

        await LUPA_DB.collection('bookings').doc(bookingID).get().then(documentSnapshot => {
            booking = documentSnapshot.data();
            booking.status = BOOKING_STATUS.BOOKING_ACCEPTED
        });

        const trainer_uuid = booking.trainer_uuid;
        const requester_uuid = booking.requester_uuid;

        LUPA_DB.collection('bookings').doc(bookingID).update({
            status: BOOKING_STATUS.BOOKING_ACCEPTED
        });

        let GENERATED_CHAT_UUID = undefined;

        try {
            //setup a chat between the two users
            if (trainer_uuid.charAt(0) < requester_uuid.charAt(0)) {
                GENERATED_CHAT_UUID = trainer_uuid + requester_uuid;
            }
            else {
                GENERATED_CHAT_UUID = requester_uuid + trainer_uuid;
            }

            let chats = []
            await USER_COLLECTION.doc(trainer_uuid).get().then(result => {
                chats = result.data().chats;
            });

            let otherUserDocData;
            let otherUserDoc = USER_COLLECTION.doc(requester_uuid);

            let chatID, chatExistUserOne = false;
            await chats.forEach(element => {
                if (element.user == requester_uuid) {
                    chatExistUserOne = true;
                    chatID = element.chatID;
                }
            });

            if (!chatExistUserOne) {

                //if already got it then return it
                //if not then add it and return it
                await this.updateCurrentUser('chats', GENERATED_CHAT_UUID, 'add', requester_uuid);

                //Update other users chats
                await USER_COLLECTION.doc(requester_uuid).get().then(snapshot => {
                    otherUserDocData = snapshot.data();
                });

                let otherUserChats = otherUserDocData.chats;

                let chatExistUserTwo;
                chatExistUserOne = false;

                await otherUserChats.forEach(element => {
                    if (element.user == trainer_uuid) {
                        chatExistUserTwo = true;
                        chatID = element.chatID;
                    }
                });

                //add to other user if they don't already have it
                if (!chatExistUserTwo) {
                    let chatField = {
                        user: trainer_uuid,
                        chatID: GENERATED_CHAT_UUID,
                    }
                    otherUserChats.push(chatField);

                    await otherUserDoc.update({
                        chats: otherUserChats
                    })
                }

            }
        } catch (err) {

        }

        /** **************/

        if (!LUPA_AUTH.currentUser.uid) {
            //email user with the correct details
        } else {
            try {
                //init Fire
                await Fire.shared.init(GENERATED_CHAT_UUID);
                const message = {
                    _id: trainer_uuid,
                    timestamp: new Date().getTime(),
                    text: 'Your booking request has been accepted.',
                    user: {
                        _id: trainer_uuid,
                        name: await this.getAttributeFromUUID(trainer_uuid, 'display_name'),
                        avatar: await this.getAttributeFromUUID(trainer_uuid, 'photo_url')
                    }
                }
                await Fire.shared.append(message);

            } catch (err) {

            }
        }
    }

    handleCancelBooking = async (booking: Object) => {
        const booking_uid = booking.uid;
        const trainer_uid = booking.trainer_uuid;
        const requester_uid = booking.requester_uuid;

        let userData = getLupaUserStructure(), bookings = [], notifications = []

        //Delete the booking from the trainers list
        await USER_COLLECTION.doc(trainer_uid).get().then(documentSnapshot => {
            userData = documentSnapshot.data();
        });
        if (!this.checkUserStructure(userData, getLupaUserStructure())) {
            userData = Object.assign(getLupaUserStructure(), userData)
        }

        bookings = userData.bookings;
        bookings.splice(bookings.indexOf(booking_uid, 1));

        //remove the notification with any data that has the booking_uid field
        notifications = userData.notifications;

        let index = 0, notificationType = "";
        for (let i = 0; i < notifications.length; i++) {
            if (notifications[i].hasOwnProperty('type')) {
                notificationType = notifications[i]['type'];
                if (notificationType == 'BOOKING_REQUEST') {
                    if (notifications[i].data.uid == booking_uid) {
                        index = i;
                    }
                }
            }
        }

        let updatedNotifications = notifications;
        updatedNotifications.splice(index, 1);
       

        USER_COLLECTION.doc(trainer_uid).update({
            bookings: bookings,
            notifications: updatedNotifications
        });

        

        //Delete the booking from the requesters list
        await USER_COLLECTION.doc(requester_uid).get().then(documentSnapshot => {
            userData = documentSnapshot.data();
        });
        if (!this.checkUserStructure(userData, getLupaUserStructure())) {
            userData = Object.assign(getLupaUserStructure(), userData)
        }

        //remove this from the user's booking list
        bookings = userData.bookings;
        bookings.splice(bookings.indexOf(booking_uid, 1));

        //remove the notification with any data that has the booking_uid field
        notifications = userData.notifications;
        index = 0, notificationType = "";
        for (let i = 0; i < notifications.length; i++) {
            if (notifications[i].hasOwnProperty('type')) {
                notificationType = notifications[i]['type'];
                if (notificationType == 'BOOKING_REQUEST') {
                    if (notifications[i].data.uid == booking_uid) {
                        index = i;
                    }
                }
            }
        }

        updatedNotifications = notifications;
        updatedNotifications.splice(index, 1);
       

        USER_COLLECTION.doc(trainer_uid).update({
            bookings: bookings,
            notifications: updatedNotifications
        });
    

        //Delete the booking from the collection
        await LUPA_DB.collection('bookings').doc(booking_uid).delete();
    }

    fetchBookingData = async (uuid: String): Promise<Object> => {
        let bookingData = {}
        await LUPA_DB.collection('bookings').doc(uuid).get().then(documentSnapshot => {
            bookingData = documentSnapshot.data();
        });

        return Promise.resolve(bookingData);
    }

    fetchMyClients = async (uuid: String): Promise<Array<Object>> => {
        let userData = getLupaUserStructurePlaceholder();

        await USER_COLLECTION
        .doc(uuid)
        .get()
        .then(documentSnapshot => {
            userData = documentSnapshot.data();
        });

        let clients = userData.clients;
        let clientsData = []

        if (typeof(clients) == 'undefined') {
            clientsData = []
        } else {
            for (let i = 0; i < clients.length; i++) {
                await this.getUserInformationByUUID(clients[i].client).then(data => {
                    clientsData.push(data);
                })
            }
        }

        return Promise.resolve(clientsData);
    }

    deleteBooking = (booking_uuid: String, trainer_uuid: String, requester_uuid: String): Boolean => {
        let userData = getLupaUserStructurePlaceholder();
        let bookings = []

        const trainerDocRef = USER_COLLECTION.doc(trainer_uuid);
        const requesterDocRef = USER_COLLECTION.doc(requester_uuid);

        try {
            trainerDocRef.get().then(documentSnapshot => {
                userData = documentSnapshot.data();
            });

            // this.checkUserStructure(userData, getLupaUserStructurePlaceholder());
            bookings = userData.bookings;
            this.arrayRemove(bookings, booking_uuid);
            trainerDocRef.update({
                bookings: bookings
            })

            bookings = [];


            requesterDocRef.get().then(documentSnapshot => {
                userData = documentSnapshot.data();
            });

            // this.checkUserStructure(userData, getLupaUserStructurePlaceholder());
            bookings = userData.bookings;
            this.arrayRemove(bookings, booking_uuid);
            requesterDocRef.update({
                bookings: bookings
            })

            LUPA_DB.collection('bookings').doc(booking_uuid).delete();
        } catch (error) {
            return false;
        }

        return true;
    }

    shuffle = (array) => {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    /**
     * 
     * @param date 
     * @param time 
     */

     transformIntoUsableDateString = (formattedDate) => {
        const dateParts = formattedDate.split(" ");
        let month = dateParts[0], day = dateParts[1].replace(',', ''), year = dateParts[2];

        switch(month) {
            case 'January':
                month = 1;
                break
            case 'February':
                month = 2;
                break;
            case 'March':
                month = 3;
                break;
            case 'April':
                month = 4;
                break;
            case 'May':
                month = 5;
                break;
            case 'June':
                month = 6;
                break;
            case 'July':
                month = 7;
                break;
            case 'August':
                month = 8;
                break;
            case 'September':
                month = 9;
                break;
            case 'October':
                month = 10;
                break;
            case 'November':
                month = 11;
                break;
            case 'December':
                month = 12;
                break;
            default:
                month = 1;
        }

        if (day.length == 1) {
            day = "0" + day;
        }

        const updatedDateString = year+"-"+month+"-"+day
        return updatedDateString;
     }


    /**
     * Returns available trainers given a date and time block.
     * TODO
     * @param date 
     * @param time 
     */
    getAvailableTrainersByDateTime = async (date, time): Promise<Array<Object>> => {
        LOG('UserController.ts', `getAvailableTrainerByDateTime::Starting function with parameters: Date(${date})`);
        let trainers = [];
        let trainer = getLupaUserStructurePlaceholder();
        await USER_COLLECTION.where('isTrainer', '==', true).get().then(queryReference => {
            queryReference.forEach(doc => {
                trainer = doc.data();

                if (Object.keys(trainer.scheduler_times).includes(date.toString())) {
                    console.log(trainer.scheduler_times)
                    trainers.push(trainer);
                }
            })
        });
    

        this.shuffle(trainers);

        return Promise.resolve(trainers);
    }

    markBookingSessionCompleted = async (booking) => {
        let updatedBookingStructure = booking;

        //mark status as completed
        updatedBookingStructure.status = BOOKING_STATUS.BOOKING_COMPLETED;
        LUPA_DB.collection('bookings').doc(updatedBookingStructure.uid).set(updatedBookingStructure);
    }

    setTrainerBelongsToGym = async () => {
        const uuid = await LUPA_AUTH.currentUser.uid

        let userData = getLupaUserStructurePlaceholder();
        let trainerMetadata = {}
        LUPA_DB.collection('users').doc(uuid).get().then(documentSnapshot => {
            userData = documentSnapshot.data()
        });

        this.checkUserStructure(userData, getLupaUserStructurePlaceholder());
        trainerMetadata = userData.trainer_metadata;

        trainerMetadata.hasOwnExerciseSpace = false;
        trainerMetadata.belongsToTrainerGym = true;

        LUPA_DB.collection('users').doc(uuid).update({
            trainer_metadata: trainerMetadata
        })
    }

    setTrainerHasOwnExerciseSpace = async () => {
        const uuid = await LUPA_AUTH.currentUser.uid

        let userData = getLupaUserStructurePlaceholder();
        let trainerMetadata = {}
        LUPA_DB.collection('users').doc(uuid).get().then(documentSnapshot => {
            userData = documentSnapshot.data()
        });

        this.checkUserStructure(userData, getLupaUserStructurePlaceholder());
        trainerMetadata = userData.trainer_metadata;

        trainerMetadata.hasOwnExerciseSpace = true;
        trainerMetadata.belongsToTrainerGym = false;

        LUPA_DB.collection('users').doc(uuid).update({
            trainer_metadata: trainerMetadata
        })
    }

    setTrainerIsInHomeTrainer = async () => {
        const uuid = await LUPA_AUTH.currentUser.uid

        let userData = getLupaUserStructurePlaceholder();
        let trainerMetadata = {}
        LUPA_DB.collection('users').doc(uuid).get().then(documentSnapshot => {
            userData = documentSnapshot.data()
        });

        this.checkUserStructure(userData, getLupaUserStructurePlaceholder());
        trainerMetadata = userData.trainer_metadata;

        if (trainerMetadata.isInHomeTrainer === true) {
            trainerMetadata.isInHomeTrainer = false;
        } else {
            trainerMetadata.isInHomeTrainer = true;
        }



        LUPA_DB.collection('users').doc(uuid).update({
            trainer_metadata: trainerMetadata
        })
    }

    setTrainerHasExperienceInSmallGroup = async () => {
        const uuid = await LUPA_AUTH.currentUser.uid

        let userData = getLupaUserStructurePlaceholder();
        let trainerMetadata = {}
        LUPA_DB.collection('users').doc(uuid).get().then(documentSnapshot => {
            userData = documentSnapshot.data()
        });

        this.checkUserStructure(userData, getLupaUserStructurePlaceholder());
        trainerMetadata = userData.trainer_metadata;

        if (trainerMetadata.hasExperienceInSmallGroupSettings == true) {
            trainerMetadata.hasExperienceInSmallGroupSettings = false;
        } else {
            trainerMetadata.hasExperienceInSmallGroupSettings = true;
        }

        LUPA_DB.collection('users').doc(uuid).update({
            trainer_metadata: trainerMetadata
        })
    }

    setTrainerSmallGroupExperience = async (val) => {
        const uuid = await LUPA_AUTH.currentUser.uid

        let userData = getLupaUserStructurePlaceholder();
        let trainerMetadata = {}
        LUPA_DB.collection('users').doc(uuid).get().then(documentSnapshot => {
            userData = documentSnapshot.data()
        });

        this.checkUserStructure(userData, getLupaUserStructurePlaceholder());
        trainerMetadata = userData.trainer_metadata;

        trainerMetadata.smallGroupExperienceYears = val;

        LUPA_DB.collection('users').doc(uuid).update({
            trainer_metadata: trainerMetadata
        })
    }

    loadAchievements = () => {
        const ACHIEVEMENTS_FILE = require('../../model/data_structures/achievement/achievements.json')

        let exercise = [], 
            muscleGroup = [], 
            packs = [], 
            sessions = [], 
            programs = [];

        let achievements = ACHIEVEMENTS_FILE.achievements;

        for (let i = 0; i < achievements.length; i++) {
            switch(achievements[i].identifier.toString().charAt(0).toLowerCase()) 
            {
                case 'e':
                    exercise.push(achievements[i])
                    break;
                case 's':
                    sessions.push(achievements[i]);
                    break;
                case 'p':
                    packs.push(achievements[i]);
                    break;
                case 'pr':
                    programs.push(achievements[i]);
                    break;
                case 'mg':
                    muscleGroup.push(achievements[i]);
                    break;
                default:
                    console.log('default')
            }
        }

        const achievementCategories = {
            exercise: exercise,
            muscleGroup: muscleGroup,
            packs: packs,
            sessions: sessions,
            programs: programs
        }

        return achievementCategories;
    }

    saveCommunityImage = async (imageURI, metadata, communityUUID) => {
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    resolve(xhr.response);
                };
                xhr.onerror = function (e) {
                    reject(new TypeError('Network request failed'));
                };
                xhr.responseType = 'blob';
                xhr.open('GET', imageURI, true);
                xhr.send(null);
            });
    
            let imageURL;
            return new Promise(async (resolve, reject) => {
                await this.fbStorage.saveCommunityImage(blob, metadata, communityUUID).then(url => {
                    resolve(url);
                })
            })
    }

    createCommunityRequest = async (communityName, communityAddress, communityZipcode, 
        communityCity, communityState, communityOwnerName, communityPhoneNumber, images, associatedLupaAccount) => {
            let uploadedPictures  = [];
            console.log('A')
         
            const id = await LUPA_AUTH.currentUser.uid;
           // const newCommunity = initializeNewCommunity(communityName, communityAddress, communityCity, communityState, [], [], [associatedLupaAccount], communityZipcode, communityOwnerName, communityPhoneNumber, associatedLupaAccount);
            const newCommunity = initializeNewCommunity(communityName, communityAddress, communityCity, communityState, [], [], [id], communityZipcode, communityOwnerName, communityPhoneNumber, id);
            console.log('B')
            let communityUID = -1;
            await LUPA_DB.collection('communities')
            .add(newCommunity)
            .then(docRef => {
                communityUID = docRef.id
                
                LUPA_DB.collection('communities').doc(docRef.id).update({
                    uid: docRef.id
                })  
            })
            .catch(error => {
                console.log(error)
            })

           /* var metadata = {
                customMetadata: {
                    'community_uid': communityUID.toString()
                }
              }

            if (images.length != 0) {
                for (let i = 0; i < images.length; i++) {
                    await this.saveCommunityImage(images[i], metadata, communityUID)
                    .then(uri => {
                        uploadedPictures.push(uri)
console.log('pushing now!!')
                        
                        // LOG('PublishProgram.js', 'handleChooseProgramImage::Successfully retrieved image uri and set state: ' + programImage)
                    })
                    .catch(error => {
                        console.log('dsfsjdfoisjdfoisjfosidjfosidjfsodifjsdoif')
                        console.log(error)
                        //LOG_ERROR('PublishProgram.js', 'handleChooseProgramImage::Caught exception trying to retrieve new image uri.' ,error)
                    })
                }
            }

            console.log('UPDAINGL: ' + uploadedPictures.length)
            LUPA_DB.collection('communities').doc(communityUID).update({
                pictures: uploadedPictures
            })     */

            return Promise.resolve(communityUID);
        }

        deleteCommunity = async (uid) => {
            COMMUNITY_COLLECTION.doc(uid).delete();
        }

        updateCommunityPictures = (uid, images) => {
            COMMUNITY_COLLECTION.doc(uid).update({
                pictures: images
            })
        }

        addCommunityReview = async (communityUID, reviewerUID, reviewText) => {
            const newReview = createCommunityReview(reviewerUID, reviewText, communityUID);

            let reviews = [];
            await COMMUNITY_COLLECTION.doc(communityUID).get()
            .then(documentSnapshot => {
                reviews = documentSnapshot.data().reviews;
                reviews.push(newReview);

                COMMUNITY_COLLECTION.doc(communityUID).update({
                    reviews: reviews
                })
            })
            .catch(error => {

            })
        }

        subscribeToCommunity = async (userUID, communityUID) => {
            let subscribers = [];
            await COMMUNITY_COLLECTION.doc(communityUID).get()
            .then(documentSnapshot => {
                subscribers = documentSnapshot.data().reviews;
                subscribers.push(userUID);

                COMMUNITY_COLLECTION.doc(communityUID).update({
                   subscribers: subscribers
                })
            })
            .catch(error => {

            })
        }

        unsubscribeUserFromCommunity = async (userUID, communityUID) => {
let subscribers = [];
            await COMMUNITY_COLLECTION.doc(communityUID).get()
            .then(documentSnapshot => {
                subscribers = documentSnapshot.data().reviews;
                subscribers.splice(subscribers.indexOf(userUID));

                COMMUNITY_COLLECTION.doc(communityUID).update({
                   subscribers: subscribers
                })
            })
            .catch(error => {
                
            })
        }


        createCommunityEvent = async (communityUID: string | number, communityEvent: CommunityEvent, images: Array<string>) => {
            const communityDocRef = await COMMUNITY_COLLECTION.doc(communityUID);
            
            let communityEvents : Object = {}

            await COMMUNITY_COLLECTION.doc(communityUID).get()
            .then(documentSnapshot => {
                communityEvents = documentSnapshot.data().events;
                const date = communityEvent.startDate.toString();
                if (Object.keys(communityEvents).includes(date)) {
                    for (const key in communityEvents) {
                       
                        if (key == date) {

                            communityEvents[date] = [communityEvent, ...communityEvents[date].daily_events];

                        } 
                    }
                } else {
                    console.log(communityEvents)
                    communityEvents = Object.defineProperty(communityEvents, date, {
                        value: {
                            daily_events: [communityEvent]
                        },
                        writable: true,
                        enumerable: true
                    });
                    console.log(communityEvents)
                }
                console.log('OUSDFSDFSDFSD')

                console.log(communityEvents)
                COMMUNITY_COLLECTION.doc(communityUID).update({
                    events: communityEvents
                });

                console.log('oOOoooOOOOO')
            })
            .catch(error => {
                alert(error)
            })
        }

        getNearbyCommunitiesBasedOnCityAndState = async (city, state) => {
            let communities = []

            return new Promise(async (resolve, reject) => {
                await COMMUNITY_COLLECTION.where('city', '==', city)
                .get()
                .then(querySnapshot => {
                    querySnapshot.docs.forEach(doc => {
                        communities.push(doc.data());
                    })
                })
                .catch(error => {
                    communities = []
                })
    
    
                await COMMUNITY_COLLECTION.where('city', '==', state)
                .get()
                .then(querySnapshot => {
                    querySnapshot.docs.forEach(doc => {
                        communities.push(doc.data());
                    })
                })
                .catch(error => {
                    communities = []
                })

                resolve(communities);
            })
           
        }

        linkProgramToClient = async (trainerUID, clientUID, program) => {
            const userDocRef = USER_COLLECTION.doc(trainerUID);
            await userDocRef.get().then(documentSnapshot => {
                let userData = documentSnapshot.data();
                let updatedClientsList = userData.clients;

                console.log('clients: ' + updatedClientsList)

                for (let i = 0; i < updatedClientsList.length; i++) {
                    if (updatedClientsList[i].client == clientUID) {
                        console.log('@@@@@@@@@@@@@@@@')
                        console.log(program);
                        updatedClientsList[i].linked_program = program.program_structure_uuid
                        continue;
                    }
                }

                userDocRef.update({
                    clients: updatedClientsList
                })
            })
        }

        fetchPackWaitlist = async () => {
            return new Promise(async (resolve, reject) => {
                let waitlistData = []
                await LUPA_DB.collection('pack_programs').get().then(querySnapshot => {
                    querySnapshot.docs.forEach(doc => {
                        waitlistData.push(doc.data());
                    });
                })

                resolve(waitlistData);
            })
           
        }

        addUserToPack = async (userData : LupaUserStructure, packData : PackType) => { 
            this.updateCurrentUser('packs', packData.uid, 'add', '');
            
            let updatedPackMemberList = packData.members;
            updatedPackMemberList.push(userData.user_uuid);

            LUPA_DB.collection('packs').doc(packData.uid).update({
                members: updatedPackMemberList
            })
         }

         updateCompletedExerciseEquipment = async (userData : LupaUserStructure, exerciseID, exerciseEquipment) => {
             let updatedCompletedExerciseList = userData.completed_exercises;
             for (let i = 0; i < updatedCompletedExerciseList.length; i++) {
                if (updatedCompletedExerciseList[i].index == exerciseID) {
                    updatedCompletedExerciseList[i].equipment_used = exerciseEquipment;
                }

             USER_COLLECTION.doc(userData.user_uuid).update({
                completed_exercises: updatedCompletedExerciseList
            });
         }
    }        

    updateCompletedExerciseStats = (userData, exerciseID, editedExerciseWeightUsed, editedExerciseOneRepMax) => {
        let updatedCompletedExerciseList = userData.completed_exercises;
        for (let i = 0; i < updatedCompletedExerciseList.length; i++) {
           if (updatedCompletedExerciseList[i].index == exerciseID) {
               updatedCompletedExerciseList[i].equipment_weight = editedExerciseWeightUsed;
               updatedCompletedExerciseList[i].one_rep_max = editedExerciseOneRepMax;
           }

        USER_COLLECTION.doc(userData.user_uuid).update({
           completed_exercises: updatedCompletedExerciseList
       });
    }
    }

    savePersonalExercise = async (userData, exercise) => {
        let updatedPersonalExerciseLibrary : Array<Object> = userData.personal_exercise_library;
        updatedPersonalExerciseLibrary.push(exercise);

        await USER_COLLECTION.doc(userData.user_uuid).update({
            personal_exercise_library: updatedPersonalExerciseLibrary
        })
    }

    addVlogComment = async (vlogID, comment) => {
        await LUPA_DB.collection('vlogs').doc(vlogID).get().then(documentSnapshot => {
            let vlogData = documentSnapshot.data();

            let comments = vlogData.comments;
            comments.push(comment);

            LUPA_DB.collection('vlogs').doc(vlogID).update({
                comments: comments
            })
        })
    }   
}

//me
/*
chats = [
    me+you = sdjf89fh3984hf9wfiwehfoifioeww


]

*/
