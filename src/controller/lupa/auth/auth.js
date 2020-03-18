import LUPA_DB, { LUPA_AUTH } from '../../firebase/firebase';

import {
    getLupaUserStructure,
    getLupaHealthDataStructure
} from '../../firebase/collection_structures';

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
    var USER_UUID, ANNOUNCEMENTS_PACK_UID;
    let signUpResultStatus = {
        result: true,
        reason: "",
    }


    console.log('one')
    await LUPA_AUTH.createUserWithEmailAndPassword(email, password).then(userCredential => {
        USER_UUID = userCredential.user.uid
        console.log('LUPA: Registering user with firebase authentication.')
        //Set sign up result to true
        signUpResultStatus.result = true;

        //Catch error on signup
    }).catch(err => {
        alert(err);
        signUpResultStatus.result = false;
        signUpResultStatus.reason = err;
        return Promise.resolve(signUpResultStatus);
    });

    console.log('two')
    // Don't need to send a reason back here.. just do a try catch and handle it if something goes wrong

    try {
        let userData = getLupaUserStructure(USER_UUID, "", "", LUPA_AUTH.currentUser.email,
        LUPA_AUTH.currentUser.emailVerified, LUPA_AUTH.currentUser.phoneNumber, "", "", isTrainerAccount, "", "", [], "", "", {}, [], 0, {}, [], [], 0, "", [], "");
    
        //Add user to users collection with UID.
    await LUPA_DB.collection('users').doc(USER_UUID).set(userData);
    let userDoc = await LUPA_DB.collection('users').doc(USER_UUID);
    console.log("interrr")
    await LUPA_DB.collection('packs').where('pack_title', '==', "Announcements").limit(1).get().then(snapshot => {
        let packID;
        console.log('ppp ' + snapshot.size)
        snapshot.forEach(doc => {
            
            let pack = doc.data();
            packID = doc.id;
            let packs = [packID];
            userDoc.update({
                packs: packs
            })
            console.log(packID);
            let currentDoc = LUPA_DB.collection('packs').doc(packID);
            let packMembers = pack.pack_members;
            packMembers.push(USER_UUID);
            console.log('length: ' + packMembers.length)
            currentDoc.update({
                pack_members: packMembers
            });
            console.log('bushh')
        });
    });

    console.log('four')
    //Add user in health data collection
    let userHealthData = getLupaHealthDataStructure(USER_UUID);
    await LUPA_DB.collection('health_data').doc(USER_UUID).set(userHealthData).catch(err => {
    })
    } catch(error)
    {   
        alert(err)
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

export var sendVerificationEmail = () => {
    LUPA_AUTH.sendVerificationEmail().then(result => {
        
    })
}