import React from 'react';

const { retrieveAsyncData } = require('./storage/async');

export var isSignedIn = async () => {
    return await retrieveAsyncData('isSignedIn');
}