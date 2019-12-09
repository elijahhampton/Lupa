import LUPA_DB, { LUPA_AUTH } from '../firebase/firebase';

import {
    getLupaUserStructure,
    getLupaHealthDataStructure,
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
    if (user) {
        console.log(user)
        console.log('LUPA: User logged in.')
    }
    else {
        console.log('LUPA: User logged out.')
    }

    //Update current user on every authentication state change
    //LUPA_AUTH.updateCurrentUser();
})

/**
 *  Sign Up User
 * @param email User email to store
 * @param password User pass to store
 * @promise Returns a promise with a user token filled with user information
 * 
 * This method assigns a user as logged in in firebase.
 */
export var signUpUser = async (email, password, confirmedPassword) => {
    let result;

    //Check password against confirmedPassword- lazy check for now
    if (password != confirmedPassword) {
        console.log('LUPA: Password did not match confirmed password')
        return;
    }

    await LUPA_AUTH.createUserWithEmailAndPassword(email, password).then(userCredential => {
        console.log('LUPA: Registering user with firebase authentication.')
        //Set sign up result to true
        result = true;
        //Catch error on signup
    }).catch(err => {
        console.log('LUPA: Error while trying to signup user.')
        result = false;
        return result;
    });

    console.log(LUPA_AUTH.currentUser);

    let userData = getLupaUserStructure(LUPA_AUTH.currentUser.uid, "", "", LUPA_AUTH.currentUser.email,
        LUPA_AUTH.currentUser.emailVerified, LUPA_AUTH.currentUser.phoneNumber, "", "", false, "", "", [], "", "", {}, []);
    //Add user to users collection with UID.
    LUPA_DB.collection('users').doc(LUPA_AUTH.currentUser.uid).set(userData).catch(err => {
        console.log('LUPA: Error while trying to add user to users collection.');
        result = false;
        return result;
    });

    let healthData = getLupaHealthDataStructure(LUPA_AUTH.currentUser.uid);
    //Add health data to health data colleciton with uid - UNFINISHED
    LUPA_DB.collection('health_data').doc(LUPA_AUTH.currentUser.uid).set(healthData).catch(err => {
        console.log('LUPA: Error while trying to add health data to health data collection.');
        result = false;
        return result;
    });

    console.log('LUPA: Adding user to default packs.')
    //Add user to all default packs
    LUPA_DB.collection('packs').where('isDefault', '==', true).get().then(snapshot => {
        snapshot.forEach(doc => {
            let pack = doc.data();
            pack.set({
                members: LUPA_AUTH.currentUser.uid,
            }, {
                merge: true
            });
        });
    });


    console.log('LUPA: Adding user to default pack events.')
    //Add user to all default pack events
    LUPA_DB.collection('pack_events').where('isDefault', '==', true).get().then(snapshot => {
        snapshot.forEach(doc => {
            let event = doc.data();
            event.set({
                attendees: LUPA_AUTH.currentUser.uid,
            }, {
                merge: true,
            });
        });
    });

    return result;
}

/**
 * 
 * @param {*} email 
 * @param {*} password 
 */
export var loginUser = async (email, password) => {
    let result;
    console.log('loggin')
    await LUPA_AUTH.signInWithEmailAndPassword(email, password).then(userCredential => {
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