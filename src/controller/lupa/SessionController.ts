/* Please do not remove this line as it prevents the Cannot Find Variable: Buffer error */
//global.Buffer = global.Buffer || require('buffer').Buffer
import UserController from './UserController';
import LUPA_DB, { LUPA_AUTH } from '../firebase/firebase.js';

let SESSIONS_COLLECTION = LUPA_DB.collection('sessions');
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

    createSession = (attendeeOne, attendeeTwo, time, day, location, name, description) => {
      let newSession = getLupaSessionStructure(attendeeOne, attendeeTwo, time, day, location, name, description);
      SESSIONS_COLLECTION.doc().set(newSession);
    }
}