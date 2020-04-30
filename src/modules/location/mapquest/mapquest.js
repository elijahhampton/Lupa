const API_KEY = "ozFQBEwZhEJkqTrr9SAgUrlefNZR2xQO";

const MAP_QUEST_URL = "http://www.mapquestapi.com/geocoding/v1/reverse";

getDataFromLocationObjectByKey = (locObject, desiredKey) => {
    let retValue;
    let currValue, prevValue;
    Object.keys(locObject).forEach(key => {
        currValue = key;

        if (locObject[currValue] == desiredKey) {
            retValue = locObject[prevValue];
            return;
        }

        prevValue = key;
    });

    return retValue;
} 

export default getLocationFromCoordinates = async (long, lat) => {
    let retLocationData = {
        city: '',
        state: '',
        country: '',
        longitude: '',
        latitude: ''
    }

    let locationDataResults;

    //fetch location data from mapquest api
    await fetch('http://www.mapquestapi.com/geocoding/v1/reverse?key=' + API_KEY + '&location=' + lat + ',' + long).then(result => result.json()).then(locationData => {
        locationDataResults = locationData;
    }, err => {
        console.log(err);
    });


    //get all keys from locations field - specifically the first object which contains the main location data we need
    let mainLocationData = locationDataResults.results[0].locations[0];

    //Obtain country
    const userCountry = await getDataFromLocationObjectByKey(mainLocationData, 'Country');

    //Obtain state
    const userState = await getDataFromLocationObjectByKey(mainLocationData, 'State');

    //Obtain city
    const userCity = await getDataFromLocationObjectByKey(mainLocationData, 'City')

    retLocationData.city = userCity;
    retLocationData.state = userState;
    retLocationData.country = userCountry;
    retLocationData.longitude = long;
    retLocationData.latitude = lat;

    return retLocationData;
}