import LUPA_DB, { LUPA_AUTH } from '../firebase/firebase';

import {
    getLupaUserStructure,
    getLupaHealthDataStructure,
} from '../lupa/common/types';

/**
 * On Auth State Change
 * Listens for user authentication changes
 * Note: On logout user = null
 */
LUPA_AUTH.onAuthStateChanged(user => {
    if (user) {
        console.log('LUPA: User logged in.')
    } 
    else
    {
        console.log('LUPA: User logged out.')
    }

    //Update current user on every authentication state change
    LUPA_AUTH.updateCurrentUser();
})

/**
 *  Sign Up User
 * @param email User email to store
 * @param password User pass to store
 * @promise Returns a promise with a user token filled with user information
 * 
 * This method assigns a user as logged in in firebase.
 */
export var signUpUser = (email, password) => {
    let result;
    let userData = getLupaUserStructure
    LUPA_AUTH.createUserWithEmailAndPassword(email, password).then(userCredential => {
        //userCredentials.user
        console.log('LUPA: Registering user with firebase authentication.')
        
        //Add user to users collection with UID.
        LUPA_DB.collection('users').doc(userCredential.user.uid).
            set(getLupaUserStructure(userCredential.user.uid, "", userCredential.user.password, userCredential.user.email, 
            userCredential.user.emailVerified, userCredential.user.phoneNumber, "", "", false, "", "", [], "", new Date()));
        
        //Add health data to health data colleciton with uid - UNFINISHED
        LUPA_DB.collection('health_data').doc(userCredential.user.uid).set(getLupaHealthDataStructure())

        //Add user to all default packs
        LUPA_DB.collection('packs').where('isDefault', '==', true).get();

        //Add user to all default pack events
        LUPA_DB.collection('pack_events')
        //Set sign up result to true
        result = true;
        //Catch error on signup
    }).catch(err => {
        console.log('LUPA: Error while trying to signup user.')
        result = false;
    });

    return result;
}

/**
 * 
 * @param {*} email 
 * @param {*} password 
 */
export var loginUser = (email, password) => {
    let result;
    LUPA_AUTH.signInWithEmailAndPassword(email, password).then(userCredential => {
        //userCredentials.user
        result = true;
    }).catch(err => {
        result = false;
        console.log('LUPA: Error on logging in user');
    }); 
    return result;
}

/**
 * Logout User
 * Takes the current user and logs them out in firebase.
 */
export var logoutUser = () => {
    LUPA_AUTH.signOut();
}

/**
 * 
 */
export var getCurrentUser = () => {
    return LUPA_AUTH.currentUser;
}

/**
 * 
 */
export var isSignedIn = () => {
    let result = false;
    return LUPA_AUTH.currentUser == null ? result = false : result = true
}