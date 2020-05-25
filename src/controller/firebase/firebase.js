import * as firebase from 'firebase';
import reactfirebase from '@react-native-firebase/app';
import reactfirebaseauth from '@react-native-firebase/auth';
import reactfirebasemessaging from '@react-native-firebase/messaging';
import reactfirebaseremoteconfig from '@react-native-firebase/remote-config'
import reactfirebaseanalytics from '@react-native-firebase/analytics'
import reactfirebaseperformance from '@react-native-firebase/perf';
import reactfirebaseiid from '@react-native-firebase/iid';
import reactfirestore from '@react-native-firebase/firestore';
import reactfirebasestorage from '@react-native-firebase/storage';
import reactfirebasedatabase from '@react-native-firebase/database';
import axios from 'axios';
import { sendLocalPushNotification } from '../../modules/push-notifications';
import { getLupaUserStructure } from './collection_structures';

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

let fb_init_config = reactfirebase.initializeApp(firebaseConfig)


const LUPA_DB = reactfirestore();
const LUPA_DB_FIREBASE = reactfirebase.database()

const LUPA_AUTH = reactfirebaseauth();

var CURRENT_USER_DOC_REF = undefined;
var CURRENT_USER_DOC_DATA_REF = undefined;

const LUPA_MESSAGING = reactfirebasemessaging();
//LUPA_MESSAGING.usePublicVapidKey("BGW5xIJ27nU0IJws4pE-yQe-DRG_v3E1pd3-kEZyNqCnKFy-vrroiqu7LVyv0hudcyJ0Uj8M5nc2gGKgPLlfTic");

async function saveTokenToDatabase(token) {
  // Assume user is already signed in
  const userId = await reactfirebaseauth().currentUser.uid;

  let tokenObject;

  try {
    await reactfirestore()
    .collection('users')
    .doc(userId)
    .get()
    .then(snapshot => {
      tokenObject = snapshot.data().tokens;
    });
  
    tokenObject.fb_messaging_token = token;

      // Add the token to the users datastore
  await reactfirestore()
  .collection('users')
  .doc(userId)
  .update({
    tokens: tokenObject
  });
  } catch(err) {
    generateMessagingToken();
  }

}

export function generateMessagingToken() {
  reactfirebasemessaging()
      .getToken()
      .then(token => {
        return saveTokenToDatabase(token);
      });
}

//LUPA_MESSAGING.registerDeviceForRemoteMessages(); apparently auto handled? Can remove when notifications are working without it
//LUPA_MESSAGING.registerForRemoteNotifications(); deprecated

LUPA_MESSAGING.onMessage(async remoteMessage => {
  sendLocalPushNotification(remoteMessage.data.title, remoteMessage.data.body, remoteMessage.data.time)
});

LUPA_MESSAGING.setBackgroundMessageHandler(async remoteMessage => {
  sendLocalPushNotification(remoteMessage.data.title, remoteMessage.data.body, remoteMessage.data.time)
});

async function requestNotificationPermission() {
  const settings = await LUPA_MESSAGING.requestPermission();

  if (settings == 'granted') {
    generateMessagingToken();
  }
  else
  {

  }
}

export async function sendNotificationToCurrentUsersDevice() {


  const userId = LUPA_AUTH.currentUser.uid;
  let tokenObject, uuid;

  await reactfirestore()
  .collection('users')
  .doc(userId)
  .get()
  .then(snapshot => {
    uuid = snapshot.data().user_uuid;
    tokenObject = snapshot.data().tokens;
  });

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

// Callback fired if Instance ID token is updated.
LUPA_MESSAGING.onTokenRefresh(() => {
  LUPA_MESSAGING.getToken().then((refreshedToken) => {
    console.log('Token refreshed.');
    saveTokenToDatabase(refreshedToken);
    // ...
  }).catch((err) => {

  });
});

const LUPA_STORAGE_BUCKET = reactfirebasestorage()
const LUPA_USER_PROFILE_IMAGES_STORAGE_REF = LUPA_STORAGE_BUCKET.ref().child('profile_images');
const LUPA_PACK_IMAGE_STORAGE_REF = LUPA_STORAGE_BUCKET.ref().child('pack_images');
const LUPA_PACK_EVENT_IMAGE_STORAGE_REF = LUPA_STORAGE_BUCKET.ref().child('pack_event_images');
const LUPA_USER_PROGRAMS_STORAGE_REF = LUPA_STORAGE_BUCKET.ref().child('program_workout_images')
const LUPA_PROGRAM_IMAGES_STORAGE_REF = LUPA_STORAGE_BUCKET.ref().child('program_images')
//save every user image as: useruuid_imgname


export class Fire {
  constructor() {
    this.sharedFirebaseInstance = fb_init_config;
  }

  //type : private / pack
  init = async (uuid) => {
    this.dbRefString = `messages/${uuid}`;
    this.ref = LUPA_DB_FIREBASE.ref(this.dbRefString);
    console.log('initializing')
  }

  getUser() {
    return {
      _id: LUPA_AUTH.currentUser.uid,
      name: LUPA_AUTH.currentUser.displayName,
      avatar: LUPA_AUTH.currentUser.photoURL,
    }
  }

parse = snapshot => {
  const { timestamp: numberStamp, text, user } = snapshot.val();
  const { key: _id } = snapshot;
  const timestamp = new Date(numberStamp);
  const message = {
    _id,
    timestamp,
    text,
    user,
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
}
// send the message to the Backend
send = messages => {
  for (let i = 0; i < messages.length; i++) {
    const { text, user } = messages[i];
    const message = {
      text,
      user,
      timestamp: this.timestamp,
    };
    this.append(message);
  }
};

append = message => this.ref.push(message);

// close the connection to the Backend
off() {
  //this.ref.off();
}
}

export class UserAuthenticationHandler {
  constructor() {}

USERNAME_MAXIMUM_CHARACTER_LIMIT = 30;
USERNAME_MINIMUM_CHARACTER_LIMIT = 6;
PASSWORD_MINIMUM_LIMIT_LOW = 7;
PASSWORD_MAXIMUM_LIMIT_HIGH = 10;
INVALID_USERNAME_CHARACTERS = [
    '!',
    '@',
    '#',
    '$',
    '^',
    '&',
    '%',
    '*',
    '(',
    ')',
    '+',
    '=',
    '-',
    '[',
    ']',
    '\/',
    '/',
    '{',
    '}',
    '|',
    ':',
    '<',
    '>',
    '?',
    '.'
    ]

  INVALID_PASSWORD_CHARACTERS = [
    '@',
    '#',
    '$',
    '^',
    '&',
    '%',
    '*',
    '(',
    ')',
    '+',
    '=',
    '-',
    '[',
    ']',
    '\/',
    '/',
    '{',
    '}',
    '|',
    ':',
    '<',
    '>',
    '?',
    '.'
    ]

  usernameIsValid(username) {
    return /^[0-9a-zA-Z_.-]+$/.test(username);
}

 isIllegalPassword(password) {
    return !/^((?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%&*]{6,20})$/.test(password);
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
        console.log('Password updated.');
      }).catch((err) => console.log(err))
    }).catch((err) => console.log(err))
  }

  changeEmail = (currentPassword, newEmail) => {
    this.reauthenticate(currentPassword).then(() => {
      var user = firebase.auth().currentUser;
      user.updateEmail(newEmail).then(() => {
        console.log("Email updated!");
      }).catch((error) => { console.log(error); });
    }).catch((error) => { console.log(error); });
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

signUpUser = async (username, email, password, confirmedPassword,isTrainerAccount, birthday, agreedToTerms) => {
  var USER_UUID, ANNOUNCEMENTS_PACK_UID;
  let signUpResultStatus = {
      result: true,
      reason: "",
      field: undefined,
  }

  //calculate age
  //let age = await calculateAge(birthday);
  let age = 26;

  let err = await checkSignUpFields(username, email, password, confirmedPassword, birthday, agreedToTerms);
 if (err != -1)
  {
      signUpResultStatus.reason = err.reason;
      signUpResultStatus.result = false;
      signUpResultStatus.field = err.field;
      return Promise.resolve(signUpResultStatus);
  }

  await LUPA_AUTH.createUserWithEmailAndPassword(email, password).then(userCredential => {
      USER_UUID = userCredential.user.uid
      console.log('LUPA: Registering user with firebase authentication.')
      //Set sign up result to true
      signUpResultStatus.result = true;

      //Catch error on signup
  }).catch(err => {
     signUpResultStatus.result = false;
     signUpResultStatus.reason = err;
      return Promise.resolve(signUpResultStatus);
  });

  let userDoc = LUPA_DB.collection('users').doc(USER_UUID);

  // Don't need to send a reason back here.. just do a try catch and handle it if something goes wrong
  try {
      let userData = getLupaUserStructure(USER_UUID, "", username, LUPA_AUTH.currentUser.email,
      LUPA_AUTH.currentUser.emailVerified, LUPA_AUTH.currentUser.phoneNumber, age, "", "", isTrainerAccount, 
      "", "", [], "", "", {}, [], 0, {}, [], [], 0, "", [], "", [], {});
  
      //Add user to users collection with UID.
  await LUPA_DB.collection('users').doc(USER_UUID).set(userData);
  } catch (err) {
      
  }

  try {
  await LUPA_DB.collection('packs').where('pack_title', '==', "Announcements").limit(1).get().then(snapshot => {
      let packID;
      snapshot.forEach(doc => {
          
          let pack = doc.data();
          packID = doc.id;
          let packs = [packID];
          userDoc.update({
              packs: packs
          })
          console.log(packID);
          let currentDoc = LUPA_DB.collection('packs').doc(packID);
          let packMembers = pack.pack_members;
          packMembers.push(USER_UUID);
          console.log('length: ' + packMembers.length)
          currentDoc.update({
              pack_members: packMembers
          });
          console.log('bushh')
      });
  });
} catch(err) {

}

  return Promise.resolve(signUpResultStatus);
}

checkSignUpFields = (username, email, password, confirmedPassword, birthday, agreedToTerms) => {
  //check if username is already in use
  //const res = LUPA_CONTROLLER_INSTANCE.checkUserIsInUse(username);
  /*
  if (res)
  {
      return "username already in use"
  }
  */

  let age = birthday;
  agreedToTerms = true;

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

  //check if birthday is over 16 (or 18?)
  //let age = await calculateAge(birthday);
  if (age.getFullYear() < 1992)
  {
      errObject.reason = "age under 16"
      errObject.field = 'Birthday'
      return errObject
  }

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
    const fileName = user_uuid+"_"+workout.workout_uid+"_"+programUUID+"_"+graphicType;

    return new Promise((resolve, reject) => {
      
      LUPA_USER_PROGRAMS_STORAGE_REF.child(fileName).put(blob).then(ref => {
       LUPA_USER_PROGRAMS_STORAGE_REF.child(fileName).getDownloadURL().then(url => {
           resolve(url)
         })
       })
 
     })
  }

  getUserProfileImageFromUUID = async (uuid) => {
    let link;
    await LUPA_USER_PROFILE_IMAGES_STORAGE_REF.child(`${uuid}`).getDownloadURL().then(url => {
      link = url;
    });

    return Promise.resolve(link)
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
  requestNotificationPermission,
};