import {
    AsyncStorage
} from 'react-native';

async function storeAsyncData(key, value) {
    try {
        await AsyncStorage.setItem(key, value);
    } catch(err) {
        //Error saving data

    }
};

async function retrieveAsynData(key, value) {
    try {
        await AsyncStorage.getItem(key, value);
    } catch(err) {
        //Error retrieving data
    }
}

//Export functions
export {
    storeAsyncData,
    retrieveAsynData,
};