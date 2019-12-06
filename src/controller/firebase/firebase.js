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

firebase.initializeApp(firebaseConfig);

const LUPA_DB = firebase.firestore();
export const LUPA_AUTH = firebase.auth();





/*module.exports = onCreateSearch = functions.firestore.document('users/{firstName}').onCreate(event => {
  const user = event.data.data();

  user.firstName = event.params.firstName;

  const index = client.initIndex('dev_GENSEARCH');
  return index.saveObject(user);
});*/



export default LUPA_DB;