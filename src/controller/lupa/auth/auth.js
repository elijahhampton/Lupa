import LUPA_DB, { LUPA_AUTH } from '../../firebase/firebase';

import {
    getLupaUserStructure,
    getLupaHealthDataStructure
} from '../../firebase/collection_structures';
import { getLupaProgramStructure } from '../../../model/data_structures/programs/program_structures';
import { UserCollectionFields } from '../common/types';


import * as EmailValidator from 'email-validator';
import { enableNetworkProviderAsync } from 'expo-location';

const USERNAME_MAXIMUM_CHARACTER_LIMIT = 30;
const USERNAME_MINIMUM_CHARACTER_LIMIT = 6;
const PASSWORD_MINIMUM_LIMIT_LOW = 7;
const PASSWORD_MAXIMUM_LIMIT_HIGH = 10;
const INVALID_USERNAME_CHARACTERS = [
    '!',
    '@',
    '#',
    '$',
    '^',
    '&',
    '%',
    '*',
    '(',
    ')',
    '+',
    '=',
    '-',
    '[',
    ']',
    '\/',
    '/',
    '{',
    '}',
    '|',
    ':',
    '<',
    '>',
    '?',
    '.'
    ]

    const INVALID_PASSWORD_CHARACTERS = [
        '@',
        '#',
        '$',
        '^',
        '&',
        '%',
        '*',
        '(',
        ')',
        '+',
        '=',
        '-',
        '[',
        ']',
        '\/',
        '/',
        '{',
        '}',
        '|',
        ':',
        '<',
        '>',
        '?',
        '.'
        ]

        function usernameIsValid(username) {
            return /^[0-9a-zA-Z_.-]+$/.test(username);
        }

        function isIllegalPassword(password) {
            return !/^((?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%&*]{6,20})$/.test(password);
        }

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
    if (user) 
    {
       
    } 
    else 
    {
        
    }
})

checkSignUpFields = (username, email, password, confirmedPassword, birthday, agreedToTerms) => {
    //check if username is already in use
    //const res = LUPA_CONTROLLER_INSTANCE.checkUserIsInUse(username);
    /*
    if (res)
    {
        return "username already in use"
    }
    */

    let age = birthday;
    agreedToTerms = true;

    let errObject = {
        reason: "",
        field: "",
    }

    //check username length and characters
    if (username.length <= USERNAME_MINIMUM_CHARACTER_LIMIT || username.length >=  USERNAME_MAXIMUM_CHARACTER_LIMIT || !usernameIsValid(username))
    {
        errObject.reason = 'username not valid'
        errObject.field = 'Username'
        return errObject
    }


    //check if valid email
    if (!EmailValidator.validate(email))
    {
        errObject.reason = "Invalid email"
        errObject.field = 'Email'
        return errObject
    }

    //check if password and confirmed password match
    if (password !== confirmedPassword)
    {
        errObject.reason = 'Passwords do not match/';
        errObject.field = 'Confirmed Password'
        return errObject
    }

    //check if password is valid in length and illegal characters
    if (isIllegalPassword(password))
    {
        errObject.reason = "Illegal Passowrd";
        errObject.field = "Password"
        return errObject
    }

    //check if birthday is over 16 (or 18?)
    //let age = await calculateAge(birthday);
   /* if (age.getFullYear() < 1992)
    {
        errObject.reason = "age under 16"
        errObject.field = 'Birthday'
        return errObject
    }*/

    //check if user has agreed to terms
    if (agreedToTerms === false)
    {
        errObject.reason = "agreed to terms false";
        errObject.field = 'Terms'
        return errObject
    }

    return -1;
}

/**
 *  Sign Up User
 * @param email User email to store
 * @param password User pass to store
 * @promise Returns a promise with a user token filled with user information
 * @return result true or false based on if any errors occurred in the signUpUser function
 * 
 * This method as'gs://lupa-cd0e3.appspot.comsigns a user as logged in in firebase.
 */
export var signUpUser = async (username, email, password, confirmedPassword,isTrainerAccount, birthday, agreedToTerms) => {
    
    var USER_UUID, ANNOUNCEMENTS_PACK_UID;
    let signUpResultStatus = {
        result: true,
        reason: "",
        field: undefined,
    }
    try {

    //calculate age
    //let age = await calculateAge(birthday);
    let age = 26;

    let err = await checkSignUpFields(username, email, password, confirmedPassword, birthday, agreedToTerms);
   if (err != -1)
    {

        signUpResultStatus.reason = err.reason;
        signUpResultStatus.result = false;
        signUpResultStatus.field = err.field;
        return Promise.resolve(signUpResultStatus);
    }

    await LUPA_AUTH.createUserWithEmailAndPassword(email, password).then(userCredential => {
        USER_UUID = userCredential.user.uid
        console.log('LUPA: Registering user with firebase authentication.')
        //Set sign up result to true
        signUpResultStatus.result = true;

        //Catch error on signup
    }).catch(err => {
       signUpResultStatus.result = false;
       signUpResultStatus.reason = err;
        return Promise.resolve(signUpResultStatus);
    });

    let userDoc = LUPA_DB.collection('users').doc(USER_UUID);

    // Don't need to send a reason back here.. just do a try catch and handle it if something goes wrong
    try {
        let userData = await getLupaUserStructure(USER_UUID, username, email, age);

        console.log(userData)
    
        //Add user to users collection with UID.
    await LUPA_DB.collection('users').doc(USER_UUID).set(userData);
    } catch (err) {
        console.log(err)
        console.log('IS IT EW zzzzzzzZZZZZZZZZZZZZZZZZZZZZ:: ' + USER_UUID)
    }

    try {
    await LUPA_DB.collection('packs').where('pack_title', '==', "Announcements").limit(1).get().then(snapshot => {
        let packID;
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
 
            currentDoc.update({
                pack_members: packMembers
            });
            console.log('bushh')
        });
    });
} catch(err) {

}

   try {
    //Add user in health data collection
    //let userHealthData = getLupaHealthDataStructure(USER_UUID);
    //await LUPA_DB.collection('health_data').doc(USER_UUID).set(userHealthData).catch(err => {
   // })
} catch(err) {

}
    }
    catch(err) {
        console.log(err)
    }

    return Promise.resolve(signUpResultStatus);
}

/**
 * 
 * @param {*} email 
 * @param {*} password 
 */
export var loginUser = async (email, password) => {
    let result = false;
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