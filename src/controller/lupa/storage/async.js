import {
    AsyncStorage
} from 'react-native';

const asyncData = [
    'isSignedIn',
    'lupaUSER_', //actually lupaUSER_USERNAME
    'lupaPASS_', //actually lupaPASS_PASSWORD
]

async function storeAsyncData(key, value) {
    try {
        await AsyncStorage.setItem(key, value);
    } catch(err) {
        //Error saving data

    }
};

function retrieveAsyncData(key) {
    let retVal = undefined;
    try {
        retVal = AsyncStorage.getItem(key)
    } catch(err) {
        //Error retrieving data
    }

    return retVal;
}

//Export functions
export {
    storeAsyncData,
    retrieveAsyncData,
};