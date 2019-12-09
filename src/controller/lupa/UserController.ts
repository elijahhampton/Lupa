/**
 * 
 */

import LUPA_DB, { LUPA_AUTH} from '../firebase/firebase.js';

const USER_COLLECTION = LUPA_DB.collection('users');


//import * as algoliasearch from 'algoliasearch'; // When using TypeScript
const algoliasearch = require('algoliasearch/reactnative.js');
const algoliaUsersIndex = algoliasearch("EGZO4IJMQL", "f0f50b25f97f17ed73afa48108d9d7e6");
const usersIndex = algoliaUsersIndex.initIndex("dev_USERS");

//algoliaUsersIndex.setExtraHeader('X-Forwarded-For', '127.0.0.1');

import { UserCollectionFields } from './common/types';

export default class UserController {
    private static _instance : UserController;

    private constructor() {

    }

    public static getInstance = () => {
        if (!UserController._instance)
        {
            UserController._instance = new UserController();
            return UserController._instance;
        }

        return UserController._instance;
    }

    /************** *********************/

    getCurrentUser = () => {
        return  LUPA_AUTH.currentUser;
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

    updateCurrentUser = async (fieldToUpdate, value, optionalData="") => {
        let currentUserDocument = USER_COLLECTION.doc(this.getCurrentUser().uid);
        console.log('LUPA: User Controller updating current user');
        switch(fieldToUpdate) {
            case UserCollectionFields.DISPLAY_NAME:
                LUPA_AUTH.currentUser.updateProfile({
                    displayName: value,
                    photoURL: this.getUserPhotoURL(),
                })
                currentUserDocument.set({
                    display_name: value,
                }, {
                    merge: true,
                })

                console.log(LUPA_AUTH.currentUser)
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
                        displayName: this.getUserDisplayName(),
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
            case UserCollectionFields.INTEREST:
                let interestData = [];
                currentUserDocument.get().then(snapshot => {
                    let snapshotData = snapshot.data();
                    interestData = snapshotData.interest
                    console.log(interestData)
                });
                
                interestData.push(value);

                currentUserDocument.set({
                    interest: interestData
                },{
                    merge: true,
                })
                break;
            case UserCollectionFields.PREFERRED_WORKOUT_TIMES:
                switch(optionalData) {
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

        }
        console.log('LUPA: User Controller finished updating current user')
    }

    updateCurrentUserHealthData  = (fieldToUpdate) => {

    }

    getUserPhotoURL = (currUser=true, uid=undefined) => {
        if (currUser == true) {
            return this.getCurrentUser().photoURL;
        }
    }

    getUserDisplayName = (currUser=true, uid=undefined) => {
        if (currUser == true) {
            return this.getCurrentUser().displayName;
        }
    }


    /**************** *******************/

    indexUsersIntoAlgolia = async () => {
        let records = [];

        console.log('starting to index');
      
        await USER_COLLECTION.get().then(docs => {
          docs.forEach(doc => {
            //Load user data from document
            let user = doc.data();

            //Set object ID (although this may not be necessary)
            user.objectID = doc.id;

            //Set necessary data for users
            let userData = {
                objectID: user.objectID,
                username: user.username,
                firstName: user.firstname,
                lastName: user.lastname,
                statistics: user.statistics,
                specializations: user.specializations,
                experience: user.experience,
                packs: user.packsByName,
                recommendedWorkouts: user.recommended,
                email: user.email,
                isTrainer: user.isTrainer,
                sessions: user.sessions,
                timeCreated: user.timeCreated,
                gender: user.gender,
                location: user.location,
                rating: user.rating,
            }
      
            records.push(userData);
      });

      usersIndex.addObjects(records, (err, content) => {
        if (err) {
            console.log('big error: ' + err);
        }

        console.log('Completed User Indexing')
    });
  });
}

    /**
     * Add User to Firebase
     */
    addUserToDatabase = (usernameIn, passwordIn="", emailIn="", firstNameIn="", lastNameIn="", statisticsIn=[], 
    specializationsIn=[], experienceIn=[], packsByNameIn=[], recommendedWorkoutsIn=[], isTrainerIn=false, sessionsIn=[], 
    timeCreatedIn=new Date().getTime(), genderIn="undefined", locationIn="undefined", ratingIn=0, eventsByNameIn=[]) => {
        
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
            } catch(Exception) {
                console.log(Exception)
                return false;
            }
    }



    /**
     * Search users by name
     */
    searchByRealName = (startsWith='') =>  {
        let results = new Array();
        let result = {
            firstName: undefined, 
            lastName: undefined, 
            gender: undefined, 
            isTrainer: undefined, 
            packs: undefined, 
            queryMatchLevel: undefined, 
            location: undefined,
            resultType: undefined,
            rating: undefined,
        }

        return new Promise((resolve, reject) => {
            usersIndex.search({
                query: startsWith,
            }, (err, {hits}) => {
                if (err) throw reject(err);
                let results = [];


                for (let i = 0; i < hits.length; i++){
                    let currHit = hits[i];
                    result.firstName = currHit.firstName;
                    result.lastName = currHit.lastName;
                    result.gender = currHit.gender;
                    result.isTrainer = currHit.isTrainer;
                    result.packs = currHit.packs;
                    result.queryMatchLevel = currHit._highlightResult.firstName.matchLevel;
                    result.location = currHit.location;
                    result.rating = currHit.rating;
                    console.log(result.rating);
                
                    result.resultType = currHit.isTrainer == true ? "trainer" : "user";

                    results.push(result);
                }

                results.sort();

                resolve(results);

            }

            )
        });
    }
}