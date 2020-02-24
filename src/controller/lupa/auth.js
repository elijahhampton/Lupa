import LUPA_DB, { LUPA_AUTH } from '../firebase/firebase';

import {
    getLupaUserStructure,
    getLupaHealthDataStructure
} from '../firebase/collection_structures';

/**
 * PROBLEMS:
 * 
 * 1. Users and Health data documents created for user even if firebase auth fails.
 * 
 * 
 */

/**
 * On Auth State Change
 * Listens for user authentication changes
 * Note: On logout user = null
 */
LUPA_AUTH.onAuthStateChanged(user => {
    if (user) {console.log('loggin in')} else {console.log('loggin out')}
})

/**
 *  Sign Up User
 * @param email User email to store
 * @param password User pass to store
 * @promise Returns a promise with a user token filled with user information
 * @return result true or false based on if any errors occurred in the signUpUser function
 * 
 * This method assigns a user as logged in in firebase.
 */
export var signUpUser = async (email, password, confirmedPassword, isTrainerAccount, agreedToTerms) => {
    let result = false;

    //Check password against confirmedPassword- lazy check for now
    if (password != confirmedPassword) {
        console.log('LUPA: Password did not match confirmed password')
        console.log('c' + result);
        return Promise.resolve(result);
    }

    await LUPA_AUTH.createUserWithEmailAndPassword(email, password).then(userCredential => {
        console.log('LUPA: Registering user with firebase authentication.')
        //Set sign up result to true
        result = true;

        //Catch error on signup
    }).catch(err => {
        console.log('umm what is the error' + err);
        result = false;
        console.log('a' + result);
        return Promise.resolve(result);
    });



    let userData = getLupaUserStructure(LUPA_AUTH.currentUser.uid, "", "", LUPA_AUTH.currentUser.email,
        LUPA_AUTH.currentUser.emailVerified, LUPA_AUTH.currentUser.phoneNumber, "", "", isTrainerAccount, "", "", [], "", "", {}, [], 0, {}, [], [], 0, "", [], certification);
    
        //Add user to users collection with UID.
    LUPA_DB.collection('users').doc(LUPA_AUTH.currentUser.uid).set(userData).catch(err => {
        console.log('LUPA: Error while trying to add user to users collection.');
        result = false;
        console.log('b' + result)
        return Promise.resolve(result);
    });

    //Add user to all default packs
    //TODO - Add  user to default pack events as as well
    let defaultPacks = new Array();

    LUPA_DB.collection('packs').where('pack_isDefault', '==', true).get().then(snapshot => {
        let packID;
        snapshot.forEach(doc => {
            let pack = doc.data();
            packID = doc.id;

            let currentDoc = LUPA_DB.collection('packs').doc(packID);
            let packMembers = pack.pack_members;
            packMembers.push(LUPA_AUTH.currentUser.uid);
            currentDoc.update({
                pack_members: packMembers
            });

        });
    });

    //Add user in health data collection
    let userHealthData = getLupaHealthDataStructure(LUPA_AUTH.currentUser.uid);
    LUPA_DB.collection('health_data').doc(LUPA_AUTH.currentUser.uid).set(userHealthData).catch(err => {
        result = false;
        console.log(err);
        console.log('error trying to get health data')
    })

    return Promise.resolve(result);
}

/**
 * 
 * @param {*} email 
 * @param {*} password 
 */
export var loginUser = async (email, password) => {
    let result;
    await LUPA_AUTH.signInWithEmailAndPassword(email, password).then(userCredential => {
        result = true;
    }).catch(err => {
        result = false;
    });

    return result;
}

/**
 * Logout User
 * Takes the current user and logs them out in firebase.
 */
export var logoutUser = () => {
    console.log('supposet to logot now')
    LUPA_AUTH.signOut();
}

/**
 * Returns the current user logged in using firebase authentication
 */
export var getCurrentUser = () => {
    return LUPA_AUTH.currentUser;
}

/**
 * Returns a promise holding true or false based on if the user is signed in or not using firebase authentication
 * @promise holds true or false based on if a user is signed in or not
 * @return result true or false based on if a user is signed in or not 
 */
export var isSignedIn = async () => {
    let result = false;
    await LUPA_AUTH.currentUser == null ? result = false : result = true
    return result;
}