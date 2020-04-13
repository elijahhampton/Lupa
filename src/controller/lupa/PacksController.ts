/* Please do not remove this line as it prevents the Cannot Find Variable: Buffer error */
//global.Buffer = global.Buffer || require('buffer').Buffer

//default
//global
//subscription
//

import LUPA_DB, { LUPA_AUTH, FirebaseStorageBucket, LUPA_PACK_IMAGE_STORAGE_REF} from '../firebase/firebase.js';

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
  private fbStorage = new FirebaseStorageBucket();

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

  inviteUserToPacks = async (arrOfUUIDS, userUUID) => {
    let packDocumentData;
    let packDocument;
    for (let i = 0; i < arrOfUUIDS.length; i++)
    {
      packDocument = await PACKS_COLLECTION.doc(arrOfUUIDS[i]);
      await PACKS_COLLECTION.doc(arrOfUUIDS[i]).get().then(result => {
        packDocumentData = result.data();
      })
      let updatedInvitedMembers = await packDocumentData.pack_invited_members;
      updatedInvitedMembers.push(userUUID);
      packDocument.update({
        pack_invited_members: updatedInvitedMembers,
      })
    }
  }

  urlToBlob = async (string) => {
  }

  savePackImage = async (string, uuid) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
       resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', string, true);
      xhr.send(null);
    });

    let imageURL;
    return new Promise((resolve, reject) => {
      this.fbStorage.savePackImage(blob, uuid).then(url => {
        resolve(url);
      });
    })
  }

  savePackEventImage = async (string, uuid) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', string, true);
      xhr.send(null);
    });

    let imageURL;
    return new Promise((resolve, reject) => {
      this.fbStorage.savePackEventImage(blob, uuid).then(url => {
        resolve(url);
      })
    });
  }

  getPackEventImageFromUUID = async (uuid) => {
    let link;
    await this.fbStorage.getPackEventImageFromUUID(uuid).then(result => {
      link = result;
    });

    return Promise.resolve(link);
  }

  getPackImageFromUUID = async (uuid) => {
    let link;
    await this.fbStorage.getPackImageFromUUID(uuid).then(result => {
      link = result;
    });

    return Promise.resolve(link);
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
        pack_uuid: doc.id,
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
        pack_type: pack.pack_type,
        pack_description: pack.pack_description,
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

  acceptPackInviteByPackUUID = async (packUUID, userUUID) => {
    let packDocumentData = [];
    let packDocument = PACKS_COLLECTION.doc(packUUID);
    await PACKS_COLLECTION.doc(packUUID).get().then(result => {
      packDocumentData = result.data();
    });


    // remove member from invited members
    let members = packDocumentData.pack_invited_members;
    members.splice(members.indexOf(userUUID), 1);

    packDocument.set({
      pack_invited_members: members,
    },
    {
      merge: true,
    })

    //add member to the pack

    let currentMembers = packDocumentData.pack_members;
    currentMembers.push(userUUID);

    packDocument.set({
      pack_members: currentMembers
    },
    {
      merge: true,
    })
  }

  declinePackInviteByPackUUID = async (packUUID, userUUID) => {
    let packDocumentData;
    let packDocument = PACKS_COLLECTION.doc(packUUID);
    await PACKS_COLLECTION.doc(packUUID).get().then(result => {
      packDocumentData = result.data();
    });


    // remove member from invited members
    let members = packDocumentData.pack_invited_members;
    members.splice(members.indexOf(userUUID, 1));

    packDocument.set({
      pack_invited_members: members,
    },
    {
      merge: true,
    })

    //no need to do anything else
  }


  updatePack = async (packID, attribute, value, optionalData=[]) =>
  {
    let currentPackDocData; 

        let currentPackDoc = await PACKS_COLLECTION.doc(packID);
        await PACKS_COLLECTION.doc(packID).get().then(snapshot => {
            currentPackDocData = snapshot.data();
        });

        switch(attribute)
        {
          case "pack_image":
            let packImage = value;
            currentPackDoc.update({
              pack_image: packImage
            });
            break;
          case "pack_members":
            if (optionalData[0] == "add")
            {
              let userToAdd = value;
              let updatedArr = currentPackDoc.pack_members;
              updatedArr.push(userToAdd)
              currentPackDoc.update({
                pack_members: updatedArr
              });
              break;
            }
            else if (optionalData[0] == "remove")
            {
              let userToRemove = value;

              //If the user leaving the pack is the pack leader then we delete the pack
              if (userToRemove == currentPackDocData.pack_leader)
              {
                //delete pack
                currentPackDoc.delete();
                break;
              }
              let updatedArr = currentPackDocData.pack_members;
              updatedArr.splice(currentPackDocData.indexOf(userToRemove), 1);
              currentPackDoc.update({
                pack_members: updatedArr
              })
              break;
            }
            break;
          default:
        }
  }

  updatePackEvent = async (eventUUID, attribute, value, optionalData=[]) =>
  {
    let currentPackEventDocData; 

        let currentPackEventDoc = await PACKS_EVENT_COLLECTION.doc(eventUUID);
        await PACKS_EVENT_COLLECTION.doc(eventUUID).get().then(snapshot => {
            currentPackEventDocData = snapshot.data();
        });

    switch(attribute)
    {
      case "pack_event_image":
        let packEventImage = value;
        currentPackEventDoc.update({
          pack_event_image: packEventImage
        })
    }
  }

  requestToJoinPack = async (userUUID, packUUID) => {
    let packData;
    let packDocument = PACKS_COLLECTION.doc(packUUID);
    await PACKS_COLLECTION.doc(packUUID).get().then(result => {
      packData = result.data();
    });

    let currentRequest = packData.pack_requests;

    currentRequest.push(userUUID);

    packDocument.set({
      pack_requests: currentRequest,
    },
    {
      merge: true,
    });    
  }

  acceptJoinPackRequest = async (userUUID, packUUID) => {
    let packData;
    let packDocument = PACKS_COLLECTION.doc(packUUID);
    await PACKS_COLLECTION.doc(packUUID).get().then(result => {
      packData = result.data();
    });

    let currentRequest = packData.pack_requests;

    currentRequest.splice(currentRequest.indexOf(userUUID), 1);

    let currentMembers = packData.pack_members;
    currentMembers.push(userUUID);

    packDocument.set({
      pack_members: currentMembers,
      pack_requests: currentRequest,
    },{
      merge: true
    });    
  }

  declineJoinPackRequest = async (userUUID, packUUID) => {
    let packData;
    let packDocument = PACKS_COLLECTION.doc(packUUID);
    await PACKS_COLLECTION.doc(packUUID).get().then(result => {
      packData = result.data();
    });

    let currentRequest = packData.pack_requests;

    currentRequest.splice(currentRequest.indexOf(userUUID), 1);

    packDocument.set({
      pack_requests: currentRequest,
    },
    {
      merge: true,
    });  
  }

  getPackInvitesFromUUID = async (uuid) => {
    let packs = [];
    await PACKS_COLLECTION.where('pack_invited_members', 'array-contains', uuid).get().then(docs => {
      docs.forEach(doc => {
        let packData = doc.data();
        packData.id = doc.id;
        packs.push(packData);
      });
    });

    return Promise.resolve(packs);
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

  async getCurrentUserDefaultPacks() {
    let defaultPacks = [];
    await PACKS_COLLECTION.where('pack_isDefault', '==', true).where('pack_members', 'array-contains', LUPA_AUTH.currentUser.uid).get().then(querySnapshot => {
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
    let currentUserPacks = [];
    let currentUserInformation;
        let currentUserUUID = await LUPA_AUTH.currentUser.uid;
        await LUPA_DB.collection('users').doc(currentUserUUID).get().then(doc => {
            currentUserInformation = doc.data();
        });

        let packsData = currentUserInformation.packs;

        if (packsData == undefined)
        {
          return Promise.resolve([]);
        }

        for (let i = 0; i < packsData.length; i++)
        {
          let pack = packsData[i];
            await PACKS_COLLECTION.doc(pack).get().then(snapshot => {
              let data = snapshot.data();
              data.pack_uuid = snapshot.id;
              currentUserPacks.push(data);
            })
        }

        console.log('UMMMMM '  + currentUserPacks.length)

    return Promise.resolve(currentUserPacks);
  }

  getPackInformationByUserUUID = async (uuid) => {
    let currUserPacks = [];
    await  PACKS_COLLECTION.where('pack_members', 'array-contains', uuid).get().then(async querySnapshot => {
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
      packInformation.pack_uuid = result.id;
    });

    return Promise.resolve(packInformation);
  }

  getPackEventsByUUID = async (packID) => {
    let events = [];
    let result;
    await PACKS_EVENT_COLLECTION.where('pack_uuid', '==', packID).get().then(docs => {
      docs.forEach(doc => {
        result = doc.data();

        let packEventDate = result.pack_event_date;

            //check to see if session has expired
            let dateParts = packEventDate.split('-');
            let month = dateParts[0], day = dateParts[1], year = dateParts[2];
            let realMonth;
            switch(month)
            {
                case 'January':
                    realMonth = 1;
                case 'january':
                    realMonth = 1;
                    break;
                case 'February':
                    realMonth = 2;
                case 'february':
                    realMonth = 2;
                    break;
                case 'March':
                    realMonth = 3;
                case 'march':
                    realMonth = 3;
                    break;
                case "April":
                    realMonth = 4;
                case "april":
                    realMonth = 5;
                    break;
                case 'May':
                    realMonth = 5;
                case 'may':
                    realMonth = 5;
                    break;
                case 'June':
                    realMonth = 6;
                case 'june':
                   realMonth = 6;
                    break;
                case 'July':
                    realMonth = 7;
                case 'july':
                    realMonth = 7;
                    break;
                case 'August':
                    realMonth = 8;
                case 'august':
                    realMonth = 8;
                    break;
                case 'September':
                    realMonth = 9;
                case 'september':
                    realMonth = 9;
                    break;
                case 'October':
                    realMonth = 10;
                case 'october':
                    realMonth = 10;
                    break;
                case 'November':
                    realMonth = 11;
                case 'november':
                    realMonth = 11;
                    break;
                case 'December':
                    realMonth = 12;
                case 'december':
                    realMonth = 12;
                    break;
                default:
            }
            //Check session is within 3 days and mark as expires soon - TODO - no need to do anything in structures for this.. just visual warning.. just update value in sessionStatus
            
            //Check session is past and remove - we remove pending sessions that have expired - 
            //todo: NEED TO CHECK FOR TIME HERE AS WELL
            if (new Date().getMonth() + 1 >= realMonth && new Date().getDate() > day && new Date().getFullYear() >= year || 
                new Date().getFullYear() > year || new Date().getMonth() + 1 > realMonth && new Date().getFullYear() >= year)
            {
                result.pack_event_stage = 'Expired';
                this.updatePackEventField(result.id, 'pack_event_stage', 'Expired');
            }

        if (result.pack_event_stage != 'Expired')
        {
          result.pack_event_uuid = doc.id;
          events.push(result);
        }

      });
    })

    return Promise.resolve(events);
  }

  updatePackEventField = async (eventUUID, fieldToUpdate, value, optionalData="") =>
  {
    let currentDocumentData;
    await PACKS_EVENT_COLLECTION.doc(eventUUID).get().then(result => {
      currentDocumentData = result.data();
    })

    let currentDocument = await PACKS_EVENT_COLLECTION.doc(eventUUID);

    switch(fieldToUpdate)
    {
      case 'pack_event_stage':
        currentDocument.set({
          pack_event_stage: value,
        },
        {
          merge: true,
        })
        break;
    }
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

  createPack = async (packLeader, title, description, location, image, members, invitedMembers, rating, sessionsCompleted, timeCreated, isSubscription, isDefault, type, packImageSource) => {
    const lupaPackStructure = getLupaPackStructure(packLeader, title, description, location, image, members, invitedMembers, rating, sessionsCompleted, timeCreated, isSubscription, isDefault, type);
    let packRef;
    let packSnapshot, packData, packPhotoUrl;
    await PACKS_COLLECTION.add(lupaPackStructure).then(ref => {
      packRef = ref.id;
    });

    await this.getPackInformationByUUID(packRef).then(snapshot => {
      packData = snapshot;
    })

    await this.savePackImage(image, packRef).then(url => {
      packPhotoUrl = url;
    });

    packData.pack_uuid = packRef;
    packData.pack_image = packPhotoUrl;
    let packPayload = {
      data: packData,
      photo_url: packPhotoUrl
    }

    return Promise.resolve(packPayload);
  }

  createPackEvent = async (packUUID, title, description, datetime, eventImage) => {
    let updatedPackEvents = [];

    
    const fullDateTime = datetime.toString().split(" ");
    const fullDate = fullDateTime[0].toString().split("/");
    const day = fullDate[0];
    let month = fullDate[1];
    const year = fullDate[2];

    switch(month)
    {
      case "1":
        month = "january";
        break;
      case "2":
        month = "february";
        break;
      case "3":
        month = "march";
        break;
      case "4":
        month = "april";
        break;
      case "5":
        month = "may";
        break;
      case "6":
        month = "june";
        break;
      case "7":
        month = "july";
        break;
      case "8":
        month = "august";
        break;
      case "9":
        month = "september";
        break;
      case "10":
        month = "october";
        break;
      case "11":
        month = "novemmber";
        break;
      case "12":
        month = "december";
        break;
      default:
    }

    const fullTime = fullDateTime[1].toString().split(":");
    let hours = fullTime[0].toString();
    let minutes = fullTime[1].toString();

    let wordTime;
    if (Number(hours) < 12)
    {
      hours = hours.toString();
      wordTime = "PM";
    }
    else if (Number(hours) >= 12)
    {
      if (Number(hours) === 12)
      {
        hours = 12;
        hours = hours.toString();
        wordTime = "AM";
      }
      else
      {
        hours = Number(hours) - 12;
        hours = hours.toString();
        wordTime = "AM";
      }
    }

    let parsedDate = month + "-" + day + "-" + year;
    let parsedTime = hours + ":" + minutes + wordTime;

    //create lupa pack event structure
    const newPackEvent  = getLupaPackEventStructure(title, description, parsedDate, parsedTime, eventImage);
    newPackEvent.pack_uuid = packUUID; //Consider moving this into the parameters later..

    let eventUUID, eventData, imageURL;
    await PACKS_EVENT_COLLECTION.add(newPackEvent).then(ref => {
      eventUUID = ref.id;
    })

    await this.getPackEventInformationByUUID(eventUUID).then(snapshot => {
      eventData = snapshot;
    })

    await this.savePackEventImage(eventImage, eventUUID).then(url => {
      imageURL = url;
    })

    eventData.pack_event_uuid = eventUUID;

    let eventPayload = {
      data: eventData,
      photo_url: imageURL
    }

    return Promise.resolve(eventPayload);
    
  } 

  getPackEventInformationByUUID = async (uuid) => {
    let eventData;
    await PACKS_EVENT_COLLECTION.doc(uuid).get().then(snapshot => {
      eventData = snapshot.data();
      eventData.pack_event_uuid = snapshot.id;
    });

    return Promise.resolve(eventData);
  }

  removeUserFromPackByUUID  = async (packUUID, userUUID) => {
    let snapshot;
    await PACKS_COLLECTION.doc(packUUID).get().then(result => {
      snapshot = result.data();
    });

    let oldPackMembersList = snapshot.pack_members;
    let updatedPackMemberList = await oldPackMembersList.filter((uuids) => {

      //return any uuids not equal to the userUUID given in params
      return uuids != userUUID;
    });

    await PACKS_COLLECTION.doc(packUUID).set(
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
      packEventData = result.data();
    })

    let attendees = packEventData.attendees;
    attendees.push(userUUID);
    //update events
    currentDocument.update({
      attendees: attendees
    });
  }

  /** attend pack events **/
  unattendPackEvent = async  (packEventUUID, packEventTitle, userUUID) => {
    let packEventData;
    let updatedPackEventAttendees;
    let currentDocument = PACKS_EVENT_COLLECTION.doc(packEventUUID);

    await PACKS_EVENT_COLLECTION.doc(packEventUUID).get().then(result => {
      packEventData = result.data();
    })

    let attendees = packEventData.attendees;

    attendees.splice(attendees.indexOf(userUUID), 1);

    //update events
    currentDocument.update({
      attendees: attendees,
    });
  }

  isAttendingPackEvent = async (packEventUUID, packEventTitle, userUUID) => {
    let packEventData;
    let isAttending = false;

   await PACKS_EVENT_COLLECTION.doc(packEventUUID).get().then(result => {
      packEventData = result.data();
    });

    packEventData.attendees.includes(userUUID) ? isAttending = true : isAttending = false
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
getActivePacksBasedOnLocation = async (location) => {
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
          let packObject = JSON.parse(JSON.stringify(hits[i]));
          if (packObject.pack_type == "Activity" && packObject.pack_isDefault == false)
          {
            delete packObject['_highlightResult'];
            await explorePagePacks.push(packObject);
          }
        }
      }


      //parse all of the hits for the state
      for (var i = 0; i < hits.length; ++i)
      {
        let locationHighlightedResult = hits[i]._highlightResult;
        let compare = (locationHighlightedResult.pack_location.state.value.replace('<em>', '').replace('</em>', '').toLowerCase() == location.state.toLowerCase())
        if (compare)
        {
         // delete hits[i]._highlightResult;
         let packObject = JSON.parse(JSON.stringify(hits[i]));
         if (packObject.pack_type == "Activity" && packObject.pack_isDefault == false)
         {
           delete packObject['_highlightResult'];
           await explorePagePacks.push(packObject);
         }
        }
      }

      //parse all of the hits for the country
      for (var i = 0; i < hits.length; ++i)
      {
        let locationHighlightedResult = hits[i]._highlightResult;
        let compare = (locationHighlightedResult.pack_location.country.value.replace('<em>', '').replace('</em>', '').toLowerCase() == location.country.toLowerCase())
        if (compare)
        {
         // delete hits[i]._highlightResult;
         let packObject = JSON.parse(JSON.stringify(hits[i]));
         if (packObject.pack_type == "Activity" && packObject.pack_isDefault == false)
         {
           delete packObject['_highlightResult'];
           await explorePagePacks.push(packObject);
         }
        }
      }

      //next we add a bunch of packs to pad incase no packs are near the user
      //TODO: we need to randomize these packs so the user doesnt see the same thing everything
      const browser = await packsIndex.browseAll();
    await browser.on('result', content => {
      content.hits.forEach(hit => {
        if (hit.pack_isDefault == false && hit.pack_type == "Activity")
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

//No subscription packs
getCommunityPacksBasedOnLocation = async (location) => {
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
          let packObject = JSON.parse(JSON.stringify(hits[i]));
          if (packObject.pack_type == "Community" && packObject.pack_isDefault == false)
          {
            delete packObject['_highlightResult'];
            await explorePagePacks.push(packObject);
          }
        }
      }


      //parse all of the hits for the state
      for (var i = 0; i < hits.length; ++i)
      {
        let locationHighlightedResult = hits[i]._highlightResult;
        let compare = (locationHighlightedResult.pack_location.state.value.replace('<em>', '').replace('</em>', '').toLowerCase() == location.state.toLowerCase())
        if (compare)
        {
         // delete hits[i]._highlightResult;
         let packObject = JSON.parse(JSON.stringify(hits[i]));
         if (packObject.pack_type == "Community" && packObject.pack_isDefault == false)
         {
           delete packObject['_highlightResult'];
           await explorePagePacks.push(packObject);
         }
        }
      }

      //parse all of the hits for the country
      for (var i = 0; i < hits.length; ++i)
      {
        let locationHighlightedResult = hits[i]._highlightResult;
        let compare = (locationHighlightedResult.pack_location.country.value.replace('<em>', '').replace('</em>', '').toLowerCase() == location.country.toLowerCase())
        if (compare)
        {
         // delete hits[i]._highlightResult;
         let packObject = JSON.parse(JSON.stringify(hits[i]));
         if (packObject.pack_type == "Community" && packObject.pack_isDefault == false)
         {
           delete packObject['_highlightResult'];
           await explorePagePacks.push(packObject);
         }
        }
      }

      //next we add a bunch of packs to pad incase no packs are near the user
      //TODO: we need to randomize these packs so the user doesnt see the same thing everything
      const browser = await packsIndex.browseAll();
    await browser.on('result', content => {
      content.hits.forEach(hit => {
        if (hit.pack_isDefault == false && hit.pack_type == "Community")
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
//Subscription packs
getSubScriptionBasedPacksBasedOnLocation = async location => {

}
}
/******************************************************************************************/

export default PacksController;