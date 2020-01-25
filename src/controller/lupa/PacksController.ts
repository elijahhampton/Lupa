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

import UserController from './UserController';
import { getLupaPackStructure, getLupaPackEventStructure } from '../firebase/collection_structures';
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

    console.log('Indexing Packs Into Algolia');

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
      }

      records.push(packData);

      });

      packsIndex.addObjects(records, (err, content) => {
        if (err) {
          console.log('Error while indexing packs into Algolia: ' + err);
        }

        console.log('Completed Packs Indexing');
      });
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
    let currentUserUUID = USER_CONTROLLER_INSTANCE.getCurrentUser().uid;
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
      packInformation = result.data();
    });

    return Promise.resolve(packInformation);
  }

  getPackEventsByUUID = async (uuid) => {
    let packEvents;
    console.log('asdasda' + uuid);
    await PACKS_EVENT_COLLECTION.doc(uuid).get().then(result => {
      packEvents = result.data();
      console.log('boookty' + result.data())
    });

    console.log(packEvents);

    return Promise.resolve(packEvents);
  }

  createPack = (packLeader, title, description, image, members, invitedMembers, rating, sessionsCompleted, timeCreated, isSubscription, isDefault) => {
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
}

export default PacksController;