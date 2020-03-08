import * as firebase from 'firebase';
import 'firebase/firestore';
//Initialize firebase
const firebaseConfig = {
    apiKey: "AIzaSyAPrxdNkncexkRazrgGy4FY6Nd-9ghZVWE",
    authDomain: "lupa-cd0e3.firebaseapp.com",
    databaseURL: "https://lupa-cd0e3.firebaseio.com",
    projectId: "lupa-cd0e3",
    storageBucket: "lupa-cd0e3.appspot.com",
    messagingSenderId: "413569093565",
    appId: "1:413569093565:web:7a8efd135343441213ccd4"
  };

const fb_init_config = firebase.initializeApp(firebaseConfig);

const LUPA_DB = firebase.firestore();
const LUPA_DB_FIREBASE = firebase.database();
const LUPA_AUTH = firebase.auth();
const LUPA_STORAGE_BUCKET = firebase.storage();
const LUPA_USER_PROFILE_IMAGES_STORAGE_REF = LUPA_STORAGE_BUCKET.ref().child('profile_images');
const LUPA_PACK_IMAGE_STORAGE_REF = LUPA_STORAGE_BUCKET.ref().child('pack_images');
const LUPA_PACK_EVENT_IMAGE_STORAGE_REF = LUPA_STORAGE_BUCKET.ref().child('pack_event_images');
/*LUPA_USER_PROFILE_PICTURE_IMAGES_REF = LUPA_USER_IMAGES.child('users');
const LUPA_USER_PACK_IMAGES_REF = LUPA_STORAGE_BUCKET.ref();
LUPA_USER_PACK_IMAGES_REF.child('packs')*/

//save every user image as: useruuid_imgname

LUPA_DB_FIREBASE.goOnline();

export class Fire {
  constructor() {
    this.sharedFirebaseInstance = fb_init_config;
  }

  init(uuid) {
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

  saveUserProfileImage = async (blob) => {
    const user_uuid = await LUPA_AUTH.currentUser.uid;
    LUPA_USER_PROFILE_IMAGES_STORAGE_REF.child(user_uuid).put(blob);
  }

  getUserProfileImageFromUUID = async (uuid) => {
    let link;
    await LUPA_USER_PROFILE_IMAGES_STORAGE_REF.child(`${uuid}`).getDownloadURL().then(url => {
      link = url;
    });

    return Promise.resolve(link)
  }

  savePackImage = (blob, uuid) => {
    LUPA_PACK_IMAGE_STORAGE_REF.child(uuid).put(blob);
  }

  getPackImageFromUUID = async (uuid) => {
    let temp;
    let link;
    if (uuid == '7Xf7iiUmhGTfSg2k0Ktr')
    {
      temp = '7Xf7iiUmhGTfSg2k0Ktr' + '.jpg';
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


    console.log('from firebase pack image : '  + link)
    return Promise.resolve(link);
  }

  savePackEventImage = (blob, uuid) => {
    LUPA_PACK_EVENT_IMAGE_STORAGE_REF.child(uuid).put(blob);
  }

  getPackEventImageFromUUID = async (uuid) => {
    let link;
    let temp;
    if (uuid == 'ZRhxugKa9JvRtiOu496S')
    {
      temp = 'ZRhxugKa9JvRtiOu496S' + '.jpg';
      await LUPA_PACK_EVENT_IMAGE_STORAGE_REF.child(`${temp}`).getDownloadURL().then(url => {
        link = url;
      });
    }
    else
    {
      await LUPA_PACK_EVENT_IMAGE_STORAGE_REF.child(`${uuid}`).getDownloadURL().then(url => {
        link = url;
      });
    }

    return Promise.resolve(link);
  }

}


export default LUPA_DB;
export { LUPA_AUTH, LUPA_DB_FIREBASE};