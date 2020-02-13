/* Please do not remove this line as it prevents the Cannot Find Variable: Buffer error */
//global.Buffer = global.Buffer || require('buffer').Buffer

//default
//global
//subscription
//

import LUPA_DB, { LUPA_AUTH} from '../firebase/firebase.js';

const PACKS_COLLECTION = LUPA_DB.collection('packs');
const PACKS_EVENT_COLLECTION = LUPA_DB.collection('pack_events');

//import * as algoliasearch from 'algoliasearch'; // When using TypeScript
const algoliasearch = require('algoliasearch/reactnative.js');
const algoliaIndex = algoliasearch("EGZO4IJMQL", "f0f50b25f97f17ed73afa48108d9d7e6");
const packsIndex = algoliaIndex.initIndex("dev_PACKS");
const tmpIndex = algoliaIndex.initIndex("tmpDev_PACKS");

import UserController from './UserController';
import { getLupaPackStructure, getLupaPackEventStructure } from '../firebase/collection_structures';
import { rejects } from 'assert';
let USER_CONTROLLER_INSTANCE;

class PacksController {
  private static instance : PacksController;

  private constructor() {
    USER_CONTROLLER_INSTANCE = UserController.getInstance();
  }

  static getInstance() {
      if (!PacksController.instance) {
          PacksController.instance = new PacksController();
          //One time initializaitons here..
      }

      return PacksController.instance;
  }

  indexPacksIntoAlgolia = async () => {
    let records = [];

    await PACKS_COLLECTION.get().then(docs => {
      docs.forEach(doc => {
              //Load pack from document
      let pack = doc.data();

      //Set object ID (although this may not be necessary)
      pack.objectID = doc.id;

      //Set necessary data for packs
      let packData = {
        pack_title: pack.pack_title,
        pack_leader: pack.pack_leader,
        pack_image: pack.pack_image,
        pack_isDefault: pack.pack_isDefault,
        pack_isSubscription: pack.pack_isSubscription,
        pack_leader_notes: pack.pack_leader_notes,
        pack_members: pack.pack_members,
        pack_invited_members: pack.pack_invited_members,
        pack_rating: pack.pack_rating,
        pack_sessions_completed: pack.pack_sessions_completed,
        pack_time_created: pack.pack_time_created,
        pack_location: pack.pack_location,
      }

      records.push(packData);

      });


      algoliaIndex.copyIndex(packsIndex.indexName, tmpIndex.indexName, [
        'settings',
        'synonyms',
        'rules'
      ]).then(({ taskID }) =>
        tmpIndex.waitTask(taskID)
      ).then(() => {
        const objects = records;
        return tmpIndex.addObjects(objects);
      }).then(() => 
        algoliaIndex.moveIndex(tmpIndex.indexName, packsIndex.indexName)
      ).catch(err => {
        console.error(err);
      });



     /* packsIndex.addObjects(records, (err, content) => {
        if (err) {
          console.log('Error while indexing packs into Algolia: ' + err);
        }

        console.log('Completed Packs Indexing');
      });*/
    });
  }

  getAllPacks() {
    
  }

  async getDefaultPacks() {
    let defaultPacks = [];
    await PACKS_COLLECTION.where('pack_isDefault', '==', true).get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        let snapshot = doc.data();
        let snapshotID = doc.id;
        snapshot.id = snapshotID;
        defaultPacks.push(snapshot);
      })
    });
    
    return Promise.resolve(defaultPacks);
  }

  /**
   * Subscription Based Offers
   */
  getSubscriptionBasedPacks = async () => {
    let subscriptionPacks = [];
    await PACKS_COLLECTION.where('pack_isSubscription', '==', true).where('pack_isDefault', '==', false).get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        let snapshot = doc.data();
        let snapshotID = doc.id;
        snapshot.id = snapshotID;
        subscriptionPacks.push(snapshot);
      });
    });

    return Promise.resolve(subscriptionPacks);
  }

  getExplorePagePacks = async () => {
    let explorePagePacks = [];

    await PACKS_COLLECTION.where('pack_isDefault', '==', false).get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        let snapshot = doc.data();
        let snapshotID = doc.id;
        snapshot.id = snapshotID;
        explorePagePacks.push(snapshot);
      });
    });

    return Promise.resolve(explorePagePacks);
  }


  getCurrentUserPacks = async () => {
    let currUserPacks = [];
    let currentUserUUID = await USER_CONTROLLER_INSTANCE.getCurrentUser().uid;
    await  PACKS_COLLECTION.where('pack_members', 'array-contains', currentUserUUID).get().then(async querySnapshot => {
     querySnapshot.forEach(userPackDoc => {
        let snapshotID = userPackDoc.id;
        let snapshot = userPackDoc.data();
        snapshot.id = snapshotID;
        currUserPacks.push(snapshot);
      });
    })

    return Promise.resolve(currUserPacks);
  }

  getPackInformationByUUID = async (uuid) => {
    let packInformation;
    await PACKS_COLLECTION.doc(uuid).get().then(result => {
      packInformation = result;
    });

    return Promise.resolve(packInformation);
  }

  getPackEventsByUUID = async (packID) => {
    let events;
    await PACKS_EVENT_COLLECTION.doc(packID).get().then(result => {
      events = result;
    });

    return Promise.resolve(events);
  }

  getPacksEventsFromArrayOfUUIDS = async (arr) => {
    let packEventsData = [];

    for (let i = 0; i < arr.length; ++i)
    {
      await PACKS_EVENT_COLLECTION.doc(arr[i]).get().then(doc => {
        if (doc.exists) {
          let snapshot = doc.data();
          snapshot.events.forEach(event => {
          packEventsData.push(event);
          })
      } else {
      }
      })
    }


    return Promise.resolve(packEventsData);
  }

  createPack = (packLeader, title, description, location, image, members, invitedMembers, rating, sessionsCompleted, timeCreated, isSubscription, isDefault) => {
    const lupaPackStructure = getLupaPackStructure(packLeader, title, description, location, image, members, invitedMembers, rating, sessionsCompleted, timeCreated, isSubscription, isDefault);
    PACKS_COLLECTION.doc().set(lupaPackStructure);
  }

  createPackEvent = async (packUUID, title, description, date, eventImage) => {
    let updatedPackEvents = [];
    //create lupa pack event structure
    const newPackEvent  = getLupaPackEventStructure(title, description, date, eventImage);
    newPackEvent.pack_uuid = packUUID; //Consider moving this into the parameters later..

    //get all pack events for this pack
    await PACKS_EVENT_COLLECTION.doc(packUUID).get().then((result,err) => {
      let snapshotID = result.id
      let snapshot = result.data();
      snapshot.id = snapshotID;

    snapshot.events.forEach(eventObject => {
        updatedPackEvents.push(eventObject);
      })
    })

    //add new pack event
    updatedPackEvents.push(newPackEvent)

    //update document
    PACKS_EVENT_COLLECTION.doc(packUUID).set({
      events: updatedPackEvents
    });
  } 

  removeUserFromPackByUUID  = async (packUUID, userUUID) => {
    let snapshot;
    await PACKS_COLLECTION.doc(packUUID).get().then(result => {
      snapshot = result.data();
    });

    let oldPackMembersList = snapshot.pack_members;
    let updatedPackMemberList = oldPackMembersList.filter((uuids) => {

      //return any uuids not equal to the userUUID given in params
      return uuids != userUUID;
    });

    PACKS_COLLECTION.doc(packUUID).set(
      {
        pack_members: updatedPackMemberList
      }, 
      { 
        merge: true
      });
  }

  /** Unattend pack events **/
  attendPackEvent = async (packEventUUID, packEventTitle, userUUID) => {
    let packEventData;
    let updatedPackEventAttendees;
    let currentDocument = PACKS_EVENT_COLLECTION.doc(packEventUUID);

   await PACKS_EVENT_COLLECTION.doc(packEventUUID).get().then(result => {
      packEventData = result.data().events;
      
      // Should be an faster way to do this
      packEventData.forEach(event => {
        //find the event with the right title
        if (event.pack_event_title = packEventTitle) {
          //get the list of current attendees
          updatedPackEventAttendees = event.attendees;

          //add the userUUID into the list
          updatedPackEventAttendees.push(userUUID);
        }

      });

    })

    //update events
    currentDocument.update({
      events: packEventData,
    });
  }

  /** attend pack events **/
  unattendPackEvent = async  (packEventUUID, packEventTitle, userUUID) => {
    let packEventData;
    let updatedPackEventAttendees;
    let currentDocument = PACKS_EVENT_COLLECTION.doc(packEventUUID);

    await PACKS_EVENT_COLLECTION.doc(packEventUUID).get().then(result => {
      packEventData = result.data().events;
      let a = [];
      
      // Should be an faster way to do this
      packEventData.forEach(event => {
        //find the event with the right title
        if (event.pack_event_title = packEventTitle) {
          //get the list of current attendees
          updatedPackEventAttendees = event.attendees;

          //find the userUUID in the array of attendees
          updatedPackEventAttendees.findIndex((currValue, index, arr) => {
             return currValue == userUUID;
          });

          //remove from array
          updatedPackEventAttendees.splice(userUUID, 1);

        }

      });

    })

    //update events
    currentDocument.update({
      events: packEventData,
    });
  }

  isAttendingPackEvent = async (packEventUUID, packEventTitle, userUUID) => {
    let packEventData;
    let updatedPackEventAttendees;
    let currentDocument = PACKS_EVENT_COLLECTION.doc(packEventUUID);

    let isAttending = false;

   await PACKS_EVENT_COLLECTION.doc(packEventUUID).get().then(result => {
      packEventData = result.data().events;
      
      // Should be an faster way to do this
      packEventData.forEach(event => {
        //find the event with the right title
        if (event.pack_event_title = packEventTitle) {
          //get the list of current attendees
          updatedPackEventAttendees = event.attendees;

          //return true if user is already ana ttendee and fasle otherwise
          updatedPackEventAttendees.forEach(attendee => {
            if (attendee == userUUID) { isAttending = true }
          })
        }

      });

    });
    return Promise.resolve(isAttending);
  }

  /************************* Pack Explore Page Functions ************************************/
//Subscription based packs
getSubscriptionPacksBasedOnLocation = async location => {
  let fallbackQuery;
  let resultArray = [];
  let subscriptionBasedPacks = new Array();

  return new Promise((resolve, reject) => {
    packsIndex.search({
      query: location.city,
      attributesToHighlight: ['pack_isSubscription'],
    }, async (err, {hits}) => {
      if (err) throw rejects(err);
  
  
      //parse all of the hits first for the city
      for (var i = 0; i < hits.length; ++i)
      {
          await subscriptionBasedPacks.push(hits[i]);
      }

      subscriptionBasedPacks.filter((val, index, arr) => {
        return val.pack_isDefault != true;
      })
      
    //resolve the promise with all of the packs
      resolve(subscriptionBasedPacks);
    });
  });
}


//No subscription packs
getExplorePagePacksBasedOnLocation = async location => {
  let fallbackQuery;
  let resultArray = [];
  let explorePagePacks = new Array();

  return new Promise((resolve, reject) => {
    packsIndex.search({
      query: location.city,
      attributesToHighlight: ['pack_location'],
    }, async (err, {hits}) => {
      if (err) throw rejects(err);
  
  
  
      //parse all of the hits first for the city
      for (var i = 0; i < hits.length; ++i)
      {
        let locationHighlightedResult = hits[i]._highlightResult;
        let compare = (locationHighlightedResult.pack_location.city.value.replace('<em>', '').replace('</em>', '').toLowerCase() == location.city.toLowerCase())
        if (compare)
        {
          await explorePagePacks.push(hits[i]);
        }
      }


      //parse all of the hits for the state
      for (var i = 0; i < hits.length; ++i)
      {
        let locationHighlightedResult = hits[i]._highlightResult;
        let compare = (locationHighlightedResult.pack_location.state.value.replace('<em>', '').replace('</em>', '').toLowerCase() == location.state.toLowerCase())
        if (compare)
        {
          await explorePagePacks.push(hits[i]);
        }
      }

      //parse all of the hits for the country
      for (var i = 0; i < hits.length; ++i)
      {
        let locationHighlightedResult = hits[i]._highlightResult;
        let compare = (locationHighlightedResult.pack_location.country.value.replace('<em>', '').replace('</em>', '').toLowerCase() == location.country.toLowerCase())
        if (compare)
        {
          await explorePagePacks.push(hits[i]);
        }
      }

      //next we add a bunch of packs to pad incase no packs are near the user
      //TODO: we need to randomize these packs so the user doesnt see the same thing everything
      const browser = await packsIndex.browseAll();
    await browser.on('result', content => {
      content.hits.forEach(hit => {
        if (hit.pack_isDefault == false && hit.pack_isSubscription == false)
        {
          explorePagePacks.push(hit);
        }
      })
    });
  
    browser.on('error', err => {
      throw err;
    });
  
    browser.stop();

    //here we 
      
    //resolve the promise with all of the packs
      resolve(explorePagePacks);
    });
  });
}

  //First we search for packs based on city

  /*
          //parse all of the hits first for exact match to the query
        hits.forEach(hit => {
          let locationHighlightedResult = hit._highlightResult;
          if (locationHighlightedResult.pack_location.state.value.replace('<em>', '').replace('</em>', '').toLowerCase() == location.state.toLowerCase())
          {
            explorePagePacks.push(hit);
            console.log(explorePagePacks.length)
          }
        });  


            //parse all of the hits first for exact match to the query
     hits.forEach(hit => {
      let locationHighlightedResult = hit._highlightResult;
      if (locationHighlightedResult.pack_location.country.value.replace('<em>', '').replace('</em>', '').toLowerCase() == location.country.toLowerCase())
      {
        explorePagePacks.push(hit);
        console.log(explorePagePacks.length)
      }
    });  

    const browser = await packsIndex.browseAll();
    await browser.on('result', content => {
      content.hits.forEach(hit => {
        if (hit.pack_isDefault == false && hit.pack_isSubscription == false)
        {
          console.log(hit);
          explorePagePacks.push(hit);
        }
      })
    });
  
    browser.on('error', err => {
      throw err;
    });
  
    browser.stop();

    console.log(explorePagePacks.length + 'sdasds')
    return Promise.resolve(explorePagePacks);
    */


  /*
  const browser = await packsIndex.browseAll();
  await browser.on('result', content => {
    content.hits.forEach(hit => {
      if (hit.pack_isDefault == false && hit.pack_isSubscription == false)
      {
        console.log(hit);
        explorePagePacks.push(hit);
      }
    })
  });

  browser.on('error', err => {
    throw err;
  });

  browser.stop();
*/
  //console.log('before exiting: ' + explorePagePacks.length)
  //return Promise.resolve(explorePagePacks);

//Subscription packs
getSubScriptionBasedPacksBasedOnLocation = async location => {

}
}
/******************************************************************************************/

export default PacksController;