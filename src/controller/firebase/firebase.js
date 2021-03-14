//import * as firebase from 'firebase';
import reactfirebase from '@react-native-firebase/app';
import reactfirebaseauth from '@react-native-firebase/auth';
import reactfirestore from '@react-native-firebase/firestore';
import reactfirebasemessaging from '@react-native-firebase/messaging';
import '@react-native-firebase/database';
import reactfirebasestorage from '@react-native-firebase/storage';
import axios from 'axios';
import { getLupaUserStructure, getLupaUserStructurePlaceholder } from './collection_structures';

import * as EmailValidator from 'email-validator'
import { fcmService } from './service/FCMService';

//Initialize firebase
const firebaseConfig = {
    apiKey: "AIzaSyAPrxdNkncexkRazrgGy4FY6Nd-9ghZVWE",
    authDomain: "lupa-cd0e3.firebaseapp.com",
    databaseURL: "https://lupa-cd0e3.firebaseio.com",
    projectId: "lupa-cd0e3",
    storageBucket: "lupa-cd0e3.appspot.com",
    messagingSenderId: "413569093565",
    appId: "1:413569093565:ios:c61a094c14a7e82613ccd4"
    //appId: "1:413569093565:web:7a8efd135343441213ccd4"
  };

//reactfirebase.initializeApp(firebaseConfig);

let fb_init_config;

if (!reactfirebase.apps.length || reactfirebase.apps.length == 0) {
  fb_init_config = reactfirebase.initializeApp(firebaseConfig)
}


const LUPA_DB = reactfirestore()
const LUPA_DB_FIREBASE = reactfirebase.database()
const LUPA_AUTH = reactfirebaseauth()
const LUPA_MESSAGING = reactfirebasemessaging();


export async function sendNotificationToCurrentUsersDevice() {


  const userId = LUPA_AUTH.currentUser.uid;
  let tokenObject, uuid;
  let userData = getLupaUserStructurePlaceholder()
  await reactfirestore()
  .collection('users')
  .doc(userId)
  .get()
  .then(snapshot => {
    userData = snapshot.data()
  });
  
  uuid = userData.user_uuid
  tokenObject = userData.tokens

  const FIREBASE_API_KEY = "AIzaSyAphvoeqmIPNfeFeegmV8nNsfCMPyl0bvI";

    axios({
      method: 'post',
      url: 'https://fcm.googleapis.com/fcm/send',
      data: JSON.stringify({"to": `${tokenObject.fb_messaging_token}`, "notification": {"title":"Test","body":"Test"}}),
      headers : {
          Authorization : `key=${FIREBASE_API_KEY}`
      },
    }).then(res => {
      
    })
}


async function saveTokenToDatabase(token, uuid) {
  let userData = getLupaUserStructure(), tokenObject = {
    fb_messaging_token: token
  }

  // Assume user is already signed in
  if (typeof(uuid) == 'undefined' || typeof(uuid) != 'string') {
    const userId = await reactfirebaseauth().currentUser.uid;

    console.log('token: ' + tokenObject.fb_messaging_token)
  // Add the token to the users datastore
  await reactfirestore()
    .collection('users')
    .doc(uuid)
    .update({
      tokens: tokenObject
    });

    return;
  }

  // Add the token to the users datastore
  await LUPA_DB.collection('users').doc(uuid).update({
    tokens: tokenObject
  })
  await reactfirestore()
    .collection('users')
    .doc(uuid)
    .update({
      tokens: tokenObject
    });
}

export function generateMessagingToken(uuid) {
  LUPA_MESSAGING.hasPermission().then(enabled => {
    if (enabled) {
      reactfirebasemessaging()
      .getToken()
      .then(token => {
        return saveTokenToDatabase(token, uuid);
      });
    } else {
      fcmService.requestNotificationPermissions();
    }
  }).catch(err => {

  })
 
}

const LUPA_STORAGE_BUCKET = reactfirebasestorage()
const LUPA_USER_PROFILE_IMAGES_STORAGE_REF = LUPA_STORAGE_BUCKET.ref().child('profile_images');
const LUPA_PACK_IMAGE_STORAGE_REF = LUPA_STORAGE_BUCKET.ref().child('pack_images');
const LUPA_PACK_EVENT_IMAGE_STORAGE_REF = LUPA_STORAGE_BUCKET.ref().child('pack_event_images');
const LUPA_USER_PROGRAMS_STORAGE_REF = LUPA_STORAGE_BUCKET.ref().child('program_workout_images')
const LUPA_PROGRAM_IMAGES_STORAGE_REF = LUPA_STORAGE_BUCKET.ref().child('program_images')
const LUPA_VLOG_MEDIA_STORAGE_REF = LUPA_STORAGE_BUCKET.ref().child('vlog_media')
const LUPA_COMMUNITY_IMAGES_STORAGE_REF = LUPA_STORAGE_BUCKET.ref().child('community_images')
//save every user image as: useruuid_imgname


export class Fire {
  constructor() {
    this.sharedFirebaseInstance = fb_init_config;
  }

  //type : private / pack
  init = async (uuid) => {
    this.dbRefString = `messages/${uuid}`;
    this.ref = LUPA_DB_FIREBASE.ref(this.dbRefString);
  }

  getUser() {
    return {
      _id: LUPA_AUTH.currentUser.uid,
      name: LUPA_AUTH.currentUser.displayName,
      avatar: LUPA_AUTH.currentUser.photoURL,
    }
  }

parse = snapshot => {
  const { timestamp: numberStamp, createdAt, text, user, system, extraData } = snapshot.val();
  const { key: _id } = snapshot;
  const timestamp = createdAt;
  const message = {
    _id,
    timestamp,
    text,
    user,
    system,
    extraData
  };
  return message;
};

on = callback =>
  this.ref
    .limitToLast(20)
    .on('child_added', snapshot => callback(this.parse(snapshot)));

get timestamp() {
  //return this.ref.ServerValue.TIMESTAMP;
  //return firebase.database.ServerValue.TIMESTAMP;
  return new Date().getTime()
}
// send the message to the Backend
send = messages => {
  for (let i = 0; i < messages.length; i++) {
    const { text, user, extraData } = messages[i];

    const message = {
      system: messages[i].system === false || typeof(messages[i].system) === 'undefined'  ? false : true,
      extraData,
      text,
      user,
      timestamp: new Date().getTime(),
    };
    this.append(message);
  }
};

append = message => this.ref.push(message);

// close the connection to the Backend
off() {
  this.ref.off();
}
}

export class UserAuthenticationHandler {
  constructor() {}

sendPasswordResetEmail = async () => {
  const email = await LUPA_AUTH.currentUser.email;

LUPA_AUTH.sendPasswordResetEmail(email).then(function() {
  // Email sent.
}).catch(function(error) {
  // An error happened.
});
}

  reauthenticate = (currentPassword) => {
    var user = reactfirebaseauth().currentUser;
    var cred = reactfirebaseauth.EmailAuthProvider.credential(user.email, currentPassword);
    return user.reauthenticateWithCredential(cred);
  }

  changePassword = (currentPassword, newPassword) => {
    this.reauthenticate(currentPassword).then(() => {
      var user = reactfirebaseauth().currentUser;
      user.updatePassword(newPassword).then(() => {

      }).catch((err) => {})
    }).catch((err) => {})
  }

  changeEmail = (currentPassword, newEmail) => {
    this.reauthenticate(currentPassword).then(() => {
      var user = firebase.auth().currentUser;
      user.updateEmail(newEmail).then(() => {

      }).catch((error) => { });
    }).catch((error) => { });
  }

  /**
 * Returns a promise holding true or false based on if the user is signed in or not using firebase authentication
 * @promise holds true or false based on if a user is signed in or not
 * @return result true or false based on if a user is signed in or not 
 */
isSignedIn = async () => {
  let result = false;
  await LUPA_AUTH.currentUser == null ? result = false : result = true
  return result;
}

usernameIsTaken = (username) => {
  LUPA_DB.collection('users').where('username', '==', username).limit(1).get().then(querySnapshot => {
    try {
    if (querySnapshot.length == 0)
    {
      return false;
    }
    else
    {
      return true;
    }
  } catch(error) {

    return false;
  }
  })
  return retVal;
}

emailIsTaken = (email) => {
  let retVal = false;
  LUPA_DB.collection('users').where('email', '==', email).limit(1).get().then(querySnapshot => {
    try {
      if (querySnapshot.length == 0)
      {
        return false;
      }
      else
      {
        return true;
      }
    } catch(error) {
   
      return false;
    }
    })
  return retVal;
}

/**
 * 
 * @param {*} email 
 * @param {*} password 
 */
loginUser = async (email, password) => {
  let result = false;
  await LUPA_AUTH.signInWithEmailAndPassword(email, password).then(userCredential => {
      result = true;
  }).catch(err => {
 
      result = false;
  });

  return result;
}

signUpUser = async (USER_UUID, username, email, password) => {
  
  const userDoc = await LUPA_DB.collection('users').doc(USER_UUID);

  //Populate database with user data
  try {
      //Obtain a user structure
      let userData = {}
      if (USER_UUID.includes("-")) {
        //We have a guest account
        userData = getLupaUserStructure(USER_UUID, username, email, 0, new Date(), true);
      } else {
        //Authenticated user
        userData = getLupaUserStructure(USER_UUID, username, email, 0, new Date(), false);
      }

      //Add user to users collection with UID.
      await LUPA_DB.collection('users').doc(USER_UUID).set(userData, { merge: true });
  } catch (err) {
    return Promise.resolve(false);
  }
  

  return Promise.resolve(true);
}

checkSignUpFields = (username, email, password, confirmedPassword, age, agreedToTerms) => {


  let errObject = {
      reason: "",
      field: "",
  }

  //check username length and characters
  if (username.length <= this.USERNAME_MINIMUM_CHARACTER_LIMIT || username.length >=  this.USERNAME_MAXIMUM_CHARACTER_LIMIT || !(this.usernameIsValid(username)))
  {
      errObject.reason = 'username not valid'
      errObject.field = 'Username'
      return errObject
  }

  //check if valid email
  if (!EmailValidator.validate(email))
  {
      errObject.reason = "email not valid"
      errObject.field = 'Email'
      return errObject
  }

  //check if password and confirmed password match
  if (password !== confirmedPassword)
  {
      errObject.reason = 'passwords do not match';
      errObject.field = 'Confirmed Password'
      return errObject
  }

  //check if password is valid in length and illegal characters
  if (this.isIllegalPassword(password))
  {
      errObject.reason = "password illegal";
      errObject.field = "Password"
      return errObject
  }

 /* if (age < 16)
  {
      errObject.reason = "age under 16"
      errObject.field = 'Birthday'
      return errObject
  }*/

  agreedToTerms == true || false ? null : agreedToTerms = false

  //check if user has agreed to terms
  if (agreedToTerms === false)
  {
      errObject.reason = "agreed to terms false";
      errObject.field = 'Terms'
      return errObject
  }

  return -1;
}
}

Fire.shared = new Fire();

export class FirebaseStorageBucket {
  constructor() {

  }

  saveProgramWorkoutGraphic = async (blob, workout, programUUID, graphicType) => {
    const user_uuid = await LUPA_AUTH.currentUser.uid;
    const fileName = user_uuid+"_"+workout.workout_uid+"_"+programUUID+"_"+graphicType+"_"+Math.random().toString();
    
    return new Promise((resolve, reject) => {
      
      LUPA_USER_PROGRAMS_STORAGE_REF.child(fileName).put(blob).then(ref => {
       LUPA_USER_PROGRAMS_STORAGE_REF.child(fileName).getDownloadURL().then(url => {
           resolve(url)
         })
       })
 
     })
  }

  saveVlogMedia = async (blob) => {
    const user_uuid = await LUPA_AUTH.currentUser.uid;
    return new Promise((resolve, reject) => {
      
     LUPA_VLOG_MEDIA_STORAGE_REF.child(user_uuid).put(blob).then(ref => {
      LUPA_VLOG_MEDIA_STORAGE_REF.child(user_uuid).getDownloadURL().then(url => {
          resolve(url)
        })
      })

    })
  }

  saveProgramImage = async (programUUID, blob) => {
    const user_uuid = await LUPA_AUTH.currentUser.uid;
    return new Promise((resolve, reject) => {
      
     LUPA_PROGRAM_IMAGES_STORAGE_REF.child(programUUID).put(blob).then(ref => {
      LUPA_PROGRAM_IMAGES_STORAGE_REF.child(programUUID).getDownloadURL().then(url => {
          resolve(url)
        })
      })

    })
  }

  saveCommunityImage = async (blob, metadata, communityUUID) => {
    console.log("ASDIJUUUUUUUUUID: " + communityUUID)
    return new Promise((resolve, reject) => {
      LUPA_COMMUNITY_IMAGES_STORAGE_REF.child(communityUUID).put(blob, metadata).then(ref => {
       LUPA_COMMUNITY_IMAGES_STORAGE_REF.child(communityUUID).getDownloadURL().then(url => {
           resolve(url)
         })
       })
 
     })
  }

  saveUserProfileImage = async (blob) => {
    const user_uuid = await LUPA_AUTH.currentUser.uid;
    return new Promise((resolve, reject) => {
      
     LUPA_USER_PROFILE_IMAGES_STORAGE_REF.child(user_uuid).put(blob).then(ref => {
      LUPA_USER_PROFILE_IMAGES_STORAGE_REF.child(user_uuid).getDownloadURL().then(url => {
          resolve(url)
        })
      })

    })
  }

  savePackImage = async (blob, uuid) => {
    let snapshotRef;
    return new Promise((resolve,reject) => {
      LUPA_PACK_IMAGE_STORAGE_REF.child(uuid).put(blob).then(ref => {
        LUPA_PACK_IMAGE_STORAGE_REF.child(uuid).getDownloadURL().then(url => {
          resolve(url)
        })
      })
  })
}

savePackEventImage = async (blob, uuid) => {
  let snapshotRef;
  return new Promise((resolve, reject) => {
    LUPA_PACK_EVENT_IMAGE_STORAGE_REF.child(uuid).put(blob).then(ref => {
      LUPA_PACK_EVENT_IMAGE_STORAGE_REF.child(uuid).getDownloadURL().then(url => {
        resolve(url)
      })
    })
  })
}

  getPackImageFromUUID = async (uuid) => {
    let temp;
    let link;
    if (uuid == 'xezOnF9aQzyCgH1ohGrR')
    {
      temp = 'xezOnF9aQzyCgH1ohGrR' + '.jpg';
      await LUPA_PACK_IMAGE_STORAGE_REF.child(`${temp}`).getDownloadURL().then(url => {
        link = url;
      });
    }
    else 
    {
      await LUPA_PACK_IMAGE_STORAGE_REF.child(`${uuid}`).getDownloadURL().then(url => {
        link = url;
      });
    }
    return Promise.resolve(link);
  }

  getPackEventImageFromUUID = async (uuid) => {
    let link;
    let temp;

      await LUPA_PACK_EVENT_IMAGE_STORAGE_REF.child(`${uuid}`).getDownloadURL().then(url => {
        link = url;
      });

    return Promise.resolve(link);
  }

}


export default LUPA_DB;
export { 
  LUPA_AUTH,
  LUPA_DB_FIREBASE,
  reactfirestore as FIRESTORE_INSTANCE,
};