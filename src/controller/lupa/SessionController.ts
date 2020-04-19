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
import { SESSION_STATUS } from './common/types';

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

    createSession = async  (attendeeOne, attendeeTwo, requesterUUID, date, time_periods, name, description, timestamp,locationData) => {
        
        let newSession = getLupaSessionStructure(attendeeOne, attendeeTwo, requesterUUID, date, time_periods, name, description, timestamp, locationData);
        SESSIONS_COLLECTION.doc().set(newSession);



      return newSession;
    }

    getUserSessions = async (currUser=true, uid=undefined) => {
      let sessions = [];
      let currUserUUID = await USER_CONTROLLER_INSTANCE.getCurrentUser().uid;
      await SESSIONS_COLLECTION.where('attendeeOne', '==', currUserUUID).get().then(docs => {
        let found = false;
        docs.forEach(doc => {
          let sessionData = doc.data();

          if (sessionData.sessionMode != 'Expired' &&  sessionData.sessionStatus != "Pending" || sessionData.attendeeOneRemoved != false)
          {
            let sessionID = doc.id;
            let sessionObject = {sessionID, sessionData}
            sessions.push(sessionObject);            
          }

        })
      });

      await SESSIONS_COLLECTION.where('attendeeTwo', '==', currUserUUID).get().then(docs => {

        docs.forEach(doc => {
          let sessionData = doc.data();
          if (sessionData.sessionMode != 'Expired' &&  sessionData.sessionStatus != "Pending" || sessionData.attendeeTwoRemoved != false)
          {

            let sessionID = doc.id;
            let sessionObject = {sessionID, sessionData}
            sessions.push(sessionObject);            
          }
        })
      });

      let count = 0;
      let currElement;
      let currIndex;
      for (let i = 0; i < sessions.length; ++i)
      {
        count = 0;
        currElement = sessions[i];
        currIndex = i;
        for (let j = 0; j < sessions.length; ++j)
        {
          if (currElement == sessions[j])
          {
            count = count + 1;
          }
        }

        if (count > 1)
        {
          sessions.slice(currIndex);
        }
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

      //If the user has confirmed the session don't allow information to be edited
      if (currentSessionDocumentInformation.sessionStatus == SESSION_STATUS.Confirmed)
      {
        return;
      }

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
        case 'time_periods':
          let currentTimes = currentSessionDocumentInformation.time_periods;
          let newTimes = [];
          currentTimes.includes(value) ? currentTimes.splice(currentTimes.indexOf(value), 1) : currentTimes.push(value);
          await currentSessionDocument.set({
            time_periods: currentTimes,
          }, {
            merge: true,
          });
          break;
        case 'session_status':
          await currentSessionDocument.set({
            sessionStatus: value,
          },
          {
            merge: true,
          });
          break;
        case 'session_mode':
          await currentSessionDocument.set({
            sessionMode: value,
          },
          {
            merge: true,
          });
          break;
        case 'removed':
          await currentSessionDocument.set({
            removed: value,
          },
          {
            merge: true
          });
        default:
      }
    }

    /**
     * 
     * TODO: Account for day being 30/31
     */
    getUpcomingSessions = async (isCurrUser, user_uuid) => {
      let userSessions;

      await this.getUserSessions(true).then(sessions => {
        userSessions = sessions;
      });

      if (userSessions.length == 0)
      {
        return Promise.resolve([]);
      }

      let currentDate = new Date()
      let currentDay = currentDate.getDate();
      let filteredSessionsArr = new Array();

      //filter sessions within 3 days
      for (let i = 0; i < userSessions.length; ++i)
      {
        let session = await userSessions[i].sessionData;
        let sessionDate = session.date;

        //parse date
        let dateParts = sessionDate.split("-");
        const month = dateParts[0];
        const day = dateParts[1];
        const year = dateParts[2];


        //get the other users data to attach to the session object
        let otherUserUUID;
        let otherUserData;

        session.attendeeOne == await LUPA_AUTH.currentUser.uid ? otherUserUUID = session.attendeeTwo : otherUserUUID = session.attendeeOne;
 
        await USERS_COLLECTION.doc(otherUserUUID).get().then(snapshot => {
          otherUserData = snapshot.data();
        });

        session.otherUserData = otherUserData;

        //We show date if it is within 3 days
        if ((currentDay - day) <= 3)
        {
          filteredSessionsArr.push(session);
        }

      }


      return Promise.resolve(filteredSessionsArr);
    }

    getSuggestedTrainers = async () => {
      return Promise.resolve([]);
    }

    addUserSessionReview = async (sessionUUID, userReviewingUUID, userToReviewUUID, reviewText, dateSubmitted) => {
      try {
      let updatedUserReviews = [];

      //get reference to users document
      let userToReviewDoc = await USERS_COLLECTION.doc(userToReviewUUID);
      
      //fetch user's reviews
      await USERS_COLLECTION.doc(userToReviewUUID).get().then(snapshot => {
        updatedUserReviews = snapshot.data().session_reviews;
      });

      //create review object
      let userSessionReview = {
        sessionUUID: sessionUUID,
        reviewBy: userReviewingUUID,
        reviewText: reviewText,
        reviewDate: dateSubmitted,
      }
      
      //add review into updated reviews arr
      await updatedUserReviews.push(userSessionReview);
      
      //update users document
      await userToReviewDoc.update({
        sessions_reviews: updatedUserReviews,
      })
    } 
    catch(err) {
      console.log('errrr')
      return Promise.resolve(false)
    }
    return Promise.resolve(true);
    }

}