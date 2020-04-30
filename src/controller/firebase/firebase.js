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
let LUPA_DB_FIREBASE = reactfirebase.database()

const LUPA_AUTH = reactfirebaseauth();

var CURRENT_USER_DOC_REF = undefined;
var CURRENT_USER_DOC_DATA_REF = undefined;

const LUPA_MESSAGING = reactfirebasemessaging();
//LUPA_MESSAGING.usePublicVapidKey("BGW5xIJ27nU0IJws4pE-yQe-DRG_v3E1pd3-kEZyNqCnKFy-vrroiqu7LVyv0hudcyJ0Uj8M5nc2gGKgPLlfTic");

async function saveTokenToDatabase(token) {
  // Assume user is already signed in
  const userId = await reactfirebaseauth().currentUser.uid;

  let tokenObject;
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
      alert(res.data);
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
  return firebase.database.ServerValue.TIMESTAMP;
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
  this.ref.off();
}
}

Fire.shared = new Fire();

export class FirebaseStorageBucket {
  constructor() {

  }

  getUserProfileImageFromUUID = async (uuid) => {
    let link;
    await LUPA_USER_PROFILE_IMAGES_STORAGE_REF.child(`${uuid}`).getDownloadURL().then(url => {
      link = url;
    });

    return Promise.resolve(link)
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