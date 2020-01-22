import LUPA_DB, { LUPA_AUTH } from '../firebase/firebase';

import {
    getLupaUserStructure,
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
    if (user) {} else {}
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
        result = false;
        return result;
    });


    let userData = getLupaUserStructure(LUPA_AUTH.currentUser.uid, "", "", LUPA_AUTH.currentUser.email,
        LUPA_AUTH.currentUser.emailVerified, LUPA_AUTH.currentUser.phoneNumber, "", "", false, "", "", [], "", "", {}, [], 0, {}, [], [], 0);
    
        //Add user to users collection with UID.
    LUPA_DB.collection('users').doc(LUPA_AUTH.currentUser.uid).set(userData).catch(err => {
        console.log('LUPA: Error while trying to add user to users collection.');
        result = false;
        return result;
    });

    //Add user to all default packs
    LUPA_DB.collection('packs').where('isDefault', '==', true).get().then(snapshot => {
        snapshot.forEach(doc => {
            let pack = doc.data();
            let packMembers = pack.pack_members;
            packMembers.push(LUPA_AUTH.currentUser.uid);
            pack.set({
                members: packMembers
            }, {
                merge: true
            });

            //Get the pack UUIDS
            let pack_uuid = doc.id;

            //Add user to all pack events for that pack
            LUPA_DB.collection(pack_uuid).get().then(snapshot => {
                //update attendees list for default pack events
                let packEventData = snapshot.data();
                let attendees = packEventData.attendees;
                attendees.push(LUPA_AUTH.currentUser.uid);

            }); //end snapshot.forEach

        });
    });
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