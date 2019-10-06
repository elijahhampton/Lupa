global.Buffer = global.Buffer || require('buffer').Buffer

import axios from 'axios';

import API_ENDPOINT, { AXIOS_HEADERS } from './axios/constants';


let User  = require('../models/user.model');

enum A {
    Username,
    Email
}
class LupaController {

    static registerUser = async (username, password, firstName, lastName, email) => {
        console.log('Trying to add user');
        //Check if username or email a already exist here

        //Register user
        await axios.post(API_ENDPOINT + "/users/add", {
            headers: AXIOS_HEADERS,
            params: {
                username: username,
                password: password,
                firstName: firstName,
                lastName: lastName,
                email: email,
            }
        })
        .then(user => {
            console.log("Successfully added user: " + user);
        })
        .then(err => {
            console.log("Error adding user: " + err);
        })
    } 

    static retrieveAllPacks = async () => {
        await axios.get(API_ENDPOINT + "/packs", {
            headers: AXIOS_HEADERS,
        })
        .then(packs => {
            return packs;
        })
        .catch(err => {
            console.log(err);
        })
    }

    static retrievePackByName = async (packName: String) => {
        await axios.get(API_ENDPOINT + "/packs", {
            headers: AXIOS_HEADERS,
            params: packName,
        })
        .then(pack => {
            return pack;
        })
        .catch (err => {
            console.log(err);
        })
    }
    
    static retrievePacksByLeader = async (packLeader: String) => {

    }
}

export default LupaController;