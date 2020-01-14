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


    getAttributeFromUUID = async (uuid, attribute) => {
        let retValue;
        
        await USER_COLLECTION.doc(uuid).get().then(res => {
            let snapshot = res.data();
            switch(attribute) {
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
                    retValue = snapshot.sessions_completed;
                    break;
            }
        });
        
        return retValue;
    }

    /************** *********************/

    getCurrentUser = () => {
        return  LUPA_AUTH.currentUser;
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
        case UserCollectionFields.FOLLOWERS:
            /* For now we don't handle this year */
        case UserCollectionFields.FOLLOWING:
            /* For now we don't handle this year */
        }
        console.log('LUPA: User Controller finished updating current user')
    }

    addFollowerToUUID = async (uuidOfAccountBeingFollowed, uuidOfFollower) => {
        let result;
        let  accountToUpdate = USER_COLLECTION.doc(uuidOfAccountBeingFollowed);
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
        let  accountToUpdate = USER_COLLECTION.doc(uuidOfUserFollowing);
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
            }, (err, {hits}) => {
                if (err) throw reject(err);
                let results = [];


                for (let i = 0; i < hits.length; i++){
                    let currHit = hits[i];
                    result.display_name = currHit._highlightResult.display_name.value;
                    result.display_name.match_level = currHit._highlightResult.display_name.matchLevel;
                    result.email = currHit.email;
                    result.gender = currHit.gender;
                    result.photo_url = currHit.photo_url;
                    result.objectID = currHit.objectID;
                    result.preferred_workout_times = currHit.preferred_workout_times;
                    result.rating = currHit.rating;
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