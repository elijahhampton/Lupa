
import AsyncStorage from '@react-native-community/async-storage';

const asyncData = [
    'isSignedIn',
    'lupaUSER_', //actually lupaUSER_USERNAME
    'lupaPASS_', //actually lupaPASS_PASSWORD
    'RECENTLY_INTERACTED_USERS'
]

/**
 * @param {} key 
 * @param {*} value 
 */
async function storeAsyncData(key, value) {
    try {
        await AsyncStorage.setItem(key, value);
    } catch(err) {
        //Error saving data

    }
};

/**
 * @param {*} key 
 */
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