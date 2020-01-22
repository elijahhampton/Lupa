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
LUPA_DB_FIREBASE.goOnline();

const LUPA_AUTH = firebase.auth();

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





/*module.exports = onCreateSearch = functions.firestore.document('users/{firstName}').onCreate(event => {
  const user = event.data.data();

  user.firstName = event.params.firstName;

  const index = client.initIndex('dev_GENSEARCH');
  return index.saveObject(user);
});*/



export default LUPA_DB;
export { LUPA_AUTH, LUPA_DB_FIREBASE};