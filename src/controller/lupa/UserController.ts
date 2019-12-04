/**
 * 
 */

import LUPA_DB from '../firebase/firebase.js';

const USER_COLLECTION = LUPA_DB.collection('users');


//import * as algoliasearch from 'algoliasearch'; // When using TypeScript
const algoliasearch = require('algoliasearch/reactnative.js');


const algoliaUsersIndex = algoliasearch("EGZO4IJMQL", "f0f50b25f97f17ed73afa48108d9d7e6");
const usersIndex = algoliaUsersIndex.initIndex("dev_USERS");

//algoliaUsersIndex.setExtraHeader('X-Forwarded-For', '127.0.0.1');

enum Gender {
    Male,
    Female
}

export default class UserController {
    private static _instance : UserController;

    private currUser = {
        accountInformation: {
            username: undefined,
            password: undefined,
            isTrainer: undefined
        },
        personalInformation: {
            firstName: undefined,
            lastName: undefined,
            gender: undefined,
        },
        packInformation: {
            packs: [],
            events: [],
        },
        sessionInformation: {
            sessions: []
        },
        timeCreated: undefined,
    }

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
    })
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
            this.setCurrentUserInformation(usernameIn);
            return true;
            } catch(Exception) {
                console.log(Exception)
                return false;
            }
    }

    /**
     * 
     */
    login = async (usernameIn, passwordIn)  : Promise<Boolean> => {
        let userData;
        let loginResult;
        //Perform Query
        await USER_COLLECTION.doc(usernameIn).get()
            .then(doc => 
            {
                if (!doc.exists)
                {
                    console.log('No Such Document');
                } 
                else
                {
                    userData = doc.data();
                    //Set current user properties
                    this.setCurrentUserInformation(userData);
                }
            })
            
            //Determine username and password fit
            if (userData.username == usernameIn &&
                userData.password == passwordIn)
            {
                loginResult = true;
            }
            else
            {
                loginResult = false;
            }
        
        return Promise.resolve(loginResult);
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

    /**
     * 
     */
    getCurrentUserInformation() {
        return this.currUser;
    }

    /**
     * 
     */
    setCurrentUserInformation = (doc) => {
        this.currUser.accountInformation.username = doc.username;
        console.log('setting username to + ' + this.currUser.accountInformation.username);
        this.currUser.accountInformation.password = doc.password;
        this.currUser.accountInformation.isTrainer = doc.isTrainer;

        this.currUser.packInformation.packs = doc.packsByName;

        this.currUser.packInformation.events = doc.events;

        this.currUser.personalInformation.firstName = doc.firstname;
        this.currUser.personalInformation.lastName = doc.lastname;

        switch (doc.gender)
        {
            case "Male":
                this.currUser.personalInformation.gender = Gender.Male;
                    break;
            case "Female":
                this.currUser.personalInformation.gender = Gender.Female;
                    break;
            default:
        }

        this.currUser.sessionInformation.sessions = doc.sessions

        this.currUser.timeCreated = doc.timeCreated;

       // UserController.currUser.userName = 
        console.log('Setting current user as: ' + this.currUser);
    }
    
}