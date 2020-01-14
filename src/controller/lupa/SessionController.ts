/* Please do not remove this line as it prevents the Cannot Find Variable: Buffer error */
//global.Buffer = global.Buffer || require('buffer').Buffer
import UserController from './UserController';
import LUPA_DB, { LUPA_AUTH } from '../firebase/firebase.js';

let SESSIONS_COLLECTION = LUPA_DB.collection('sessions');
let USERS_COLLECTION = LUPA_DB.collection('users');

let USER_CONTROLLER_INSTANCE;

import {
  getLupaSessionStructure
} from '../firebase/collection_structures';

export default class SessionController {
    private static _instance : SessionController;

    private constructor() {
      USER_CONTROLLER_INSTANCE = UserController.getInstance();
    }

    public static getInstance() {
      if (!SessionController._instance)
      {
        SessionController._instance = new SessionController();
        return SessionController._instance;
      }

      return SessionController._instance;
    }

    createSession = async  (attendeeOne, attendeeTwo, time, day, location={}, name, description) => {
      let attendeeTwoUID;
      attendeeOne = USER_CONTROLLER_INSTANCE.getCurrentUser().uid;
        await USERS_COLLECTION.where('display_name', '==', attendeeTwo).get().then(res => {
          res.forEach(doc => {
            let snapshot = doc.data();
            attendeeTwoUID = snapshot.user_uuid;
          });
        });
        
        let newSession = getLupaSessionStructure(attendeeOne, attendeeTwoUID, time, day, location, name, description);
      SESSIONS_COLLECTION.doc().set(newSession);



      return newSession;
    }

    getUserSessions = async (currUser=true, uid=undefined) => {
      let sessions = [];
      if (currUser) {
        await SESSIONS_COLLECTION.where('attendeeOne', '==', USER_CONTROLLER_INSTANCE.getCurrentUser().uid).get().then(docs => {
          docs.forEach(doc => {
            let sessionData = doc.data();
            let sessionID = doc.id;
            let sessionObject = {sessionID, sessionData}
            sessions.push(sessionObject);
          })
        });

        await SESSIONS_COLLECTION.where('attendeeTwo', '==', USER_CONTROLLER_INSTANCE.getCurrentUser().uid).get().then(docs => {
          docs.forEach(doc => {
            let sessionData = doc.data();
            let sessionID = doc.id;
            let sessionObject = {sessionID, sessionData}
            sessions.push(sessionObject);
          })
        })
      }
      return sessions;
    }

    getSessionInformationByUUID = async (uuid) => {
      let result;
      await SESSIONS_COLLECTION.doc(uuid).get().then(snapshot => {
        result = snapshot.data();
      });

      return result;
    }

    updateSessionFieldByUUID  = async (uuid, fieldToUpdate, value, optionalData="") => {
      let currentSessionDocument = SESSIONS_COLLECTION.doc(uuid);
      let currentSessionDocumentInformation;
      await SESSIONS_COLLECTION.doc(uuid).get().then(snapshot => {
        currentSessionDocumentInformation = snapshot.data();
      });

      let attendeeOne = currentSessionDocumentInformation.attendeeOne;
      let attendeeTwo = currentSessionDocumentInformation.attendeeTwo;

      switch(fieldToUpdate) {
        case 'date':
          await currentSessionDocument.set({
            date: value
          }, {
            merge: true,
          });
          break;
        case 'last_suggested_by':
          if (optionalData == attendeeOne) { 
            
          }

          if (optionalData == attendeeTwo) {

          }
          await currentSessionDocument.set({
            lastSuggestedBy: {
            optionalData: value,
            }
          }, 
            {
            merge: true,
            });
          break;
        default:
      }
    }
}