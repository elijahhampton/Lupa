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
        if (user.emailVerified == true)
        {
            //we do nothing if the user has already verified there email
        }
        else
        {
            //if not we need to send an email verification link
            user.sendEmailVerification({
                handleCodeInApp: true,
                url: 'app/email-verification'
            })
        }
        console.log('loggin in')
    } 
    else 
    {
        console.log('loggin out')
    }
})


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