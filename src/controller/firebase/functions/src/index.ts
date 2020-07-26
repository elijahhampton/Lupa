import { Colors } from "react-native/Libraries/NewAppScreen";

const functions = require('firebase-functions')
const admin = require("firebase-admin");

const stripe = require('tipsi-stripe')

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


admin.initializeApp(firebaseConfig)

if (process.env.NODE_ENV === 'development') {
    functions.useFunctionsEmulator('http://localhost:8080');
  }

//const stripe = require('stripe')('sk_test_j7uyPkfflXbCe7do8gRKrroB00OCXXL9kZ')
// { sendLocalPushNotification } = require('../../../modules/push-notifications/index')


const SESSIONS_DOCUMENT_CHANGE_TYPES = {
    SESSIONS_ACCEPTED: "session_accepted",
    SESSION_DENIED: "session_denied",
    SESSION_EXPIRED: "session_expired",
    SESSION_EXPIRATION_NEAR: "session_expiration_near",
    SESSION_FINISHED: "session_finished",
    SESSION_TIME_CHANGE: "session_time_change",
    SESSION_INVITE: "session_invite"
}

/** Sends a notification to a user upon receiving a notification of some type. */
exports.receivedNotification = functions.firestore
.document('users/{userUUID}')
.onUpdate((change, context) => {
  const dataAfter = change.after.data();
  const dataBefore = change.before.data();
  console.log('A')
  //Check to see if the size of the notification array has changed
  if (dataBefore.notifications.length < dataAfter.notifications.length)
  {
    //If the size of the array has grown
    let newNotification = dataAfter.notifications[dataAfter.notifications.length - 1];
    console.log('B')
    //Find out which notification it is
    if (newNotification.type == "RECEIVED_PROGRAMS")
    {
      const payload = {
        data: {
          title: "New Program Invite",
          body: `You received an invitation to preview a program. Navigate to your notifications for more details.`,
          time: new Date().getTime().toString()
        },
        notification: {
          title: "New Program Invite",
          body: `You received an invitation to preview a program. Navigate to your notifications for more details.`,
          time: new Date().getTime().toString()
        },
      };

      console.log('C')
      admin
        .messaging()
        .sendToDevice(
            [dataAfter.tokens.fb_messaging_token], 
            payload,
            {
                // Required for background/quit data-only messages on iOS
                contentAvailable: true,
                // Required for background/quit data-only messages on Android
                priority: 'high',
            }
        )
        .then(function(response) {
          console.log("Notification sent successfully:", response);
        })
        .catch(function(error) {
          console.log("Notification sent failed:", error);
    })
    }
  }
  
})


/**
 * Sends a notification to a user when they receive a new session invite.
 */
exports.sessionCreated = functions.firestore
.document('sessions/{sessionUUID}')
.onCreate((snapshot, context) => {
    // Get an object representing the document
      // e.g. {'name': 'Marie', 'age': 66}
      //Session document data before update
      const sessionDocumentData = snapshot.data();

      //get necessary information
      const sessionName = sessionDocumentData.name;
      const sessionDescription = sessionDocumentData.description;
      const sessionDate = sessionDocumentData.date;
      const sessionLocation = sessionDocumentData.locationData;

      //get participant's information
      let otherParticipant;
      const sessionRequester = sessionDocumentData.requesterUUID;
      let uuidOne = sessionDocumentData.attendeeOne;
      let uuidTwo = sessionDocumentData.attendeeTwo;
      sessionRequester == uuidOne ? otherParticipant = uuidTwo : otherParticipant = uuidOne;

            const payload = {
                data: {
                    title: "New Session Invite",
                  body: "You have a new session invite.  Navigate to your dashboard for the details.",
                  time: new Date().getTime().toString()
                },
                notification: {
                  title: "New Session Invite",
                  body: "You have a new session invite.  Navigate to your dashboard for the details.",
                  time: new Date().getTime().toString()
                },
              };

              admin
                .messaging()
                .sendToDevice(
                    [sessionDocumentData.attendeeTwoData.tokens.fb_messaging_token], 
                    payload,
                    {
                        // Required for background/quit data-only messages on iOS
                        contentAvailable: true,
                        // Required for background/quit data-only messages on Android
                        priority: 'high',
                    }
                )
                .then(function(response) {

                })
                .catch(function(error) {
     

});
});


exports.payWithStripe = functions.https.onRequest((request, response) => {
    // Set your secret key: remember to change this to your live secret key in production
    // See your keys here: https://dashboard.stripe.com/account/apikeys

    return cors(request, response, async () => {

          // eslint-disable-next-line promise/catch-or-return
    stripe.charges.create({
      amount: 0,
      currency: 'usd',
      source: 'tok_visa',
  }).then((charge) => {
          // asynchronously called
          response.send(charge);
      })
      .catch(err =>{
          console.log(err);
      });

      response.status(200).send('Ok')

    })

})