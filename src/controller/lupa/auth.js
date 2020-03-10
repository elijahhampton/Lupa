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
    let signUpResultStatus = {
        result: true,
        reason: "",
    }
    //Check password against confirmedPassword- lazy check for now
    if (password != confirmedPassword) 
    {
        signUpResultStatus.reason = "Password doesn't match confirmed password.";
        return Promise.resolve(signUpResultStatus);
    }

    if (password < 8 || password > 12 || confirmedPassword < 8 || confirmedPassword > 12)
    {
        signUpResultStatus.reason = "Password must be between 8-12 characters";
        return Promise.resolve(signUpResultStatus);
    }

    await LUPA_AUTH.createUserWithEmailAndPassword(email, password).then(userCredential => {
        console.log('LUPA: Registering user with firebase authentication.')
        //Set sign up result to true
        signUpResultStatus.result = true;

        //Catch error on signup
    }).catch(err => {
        signUpResultStatus.result = false;
        signUpResultStatus.reason = err;
        return Promise.resolve(signUpResultStatus);
    });

    // Don't need to send a reason back here.. just do a try catch and handle it if something goes wrong

    try {
        let userData = getLupaUserStructure(LUPA_AUTH.currentUser.uid, "", "", LUPA_AUTH.currentUser.email,
        LUPA_AUTH.currentUser.emailVerified, LUPA_AUTH.currentUser.phoneNumber, "", "", isTrainerAccount, "", "", [], "", "", {}, [], 0, {}, [], [], 0, "", [], "");
    
        //Add user to users collection with UID.
    LUPA_DB.collection('users').doc(LUPA_AUTH.currentUser.uid).set(userData).catch(err => {
        
    });

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
    })
    } catch(error)
    {
        //handle error here
    }

    return Promise.resolve(signUpResultStatus);
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