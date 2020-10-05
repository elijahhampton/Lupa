
const functions = require('firebase-functions')
const admin = require("firebase-admin");

const cors = require('cors')({origin: true});

const stripe = require('stripe')
('sk_test_YauPjDqwd1vHVwXqSV8DP2Hv00OjpJozLy');

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

const SESSIONS_DOCUMENT_CHANGE_TYPES = {
    SESSIONS_ACCEPTED: "session_accepted",
    SESSION_DENIED: "session_denied",
    SESSION_EXPIRED: "session_expired",
    SESSION_EXPIRATION_NEAR: "session_expiration_near",
    SESSION_FINISHED: "session_finished",
    SESSION_TIME_CHANGE: "session_time_change",
    SESSION_INVITE: "session_invite"
}

/** Sends a notification to a user upon receiving a notification object 
 * of some type. 
 * 
 * @trigger onUpdate (User)
 * */
exports.receivedNotification = functions.firestore
.document('users/{userUUID}')
.onUpdate((change, context) => {
  const dataAfter = change.after.data();
  const dataBefore = change.before.data();

  //Check to see if the size of the notification array has changed
  if (dataBefore.notifications.length < dataAfter.notifications.length)
  {
    //If the size of the array has grown
    let newNotification = dataAfter.notifications[dataAfter.notifications.length - 1];
console.log('B')
    //Find out which notification it is
    if (newNotification.type == "RECEIVED_PROGRAM")
    {
      console.log('C')
      const payload = {
        data: {
          title: "New Program Invite",
          body: "You have been invited to try a new program. Navigate to your notifications for more details.",
          time: new Date().getTime().toString()
        },
        notification: {
          title: "New Program Invite",
          body: "You have been invited to try a new program. Navigate to your notifications for more details.",
          time: new Date().getTime().toString()
        },
      };
      console.log('D')
      return admin
        .messaging()
        .sendToDevice(
            [dataBefore.tokens.fb_messaging_token], 
            payload,
            {
                // Required for background/quit data-only messages on iOS
                contentAvailable: true,
                // Required for background/quit data-only messages on Android
                priority: 'high',
            }
        );
    }
    console.log("F")
  }
  console.log("E")
  return false;
});

/**
 * Handles sending payment data to firebase server.
 * 
 * @trigger onRequest (HTTPS)
 */
exports.payWithStripe = functions.https.onRequest((request, response) => {
    // Set your secret key: remember to change this to your live secret key in production
    // See your keys here: https://dashboard.stripe.com/account/apikeys

    const actualAmount = request.body.amount * 100;

    
    stripe.charges.create({
        amount: actualAmount, 
        currency: request.body.currency,
        source: request.body.token.tokenId,
    },
    {
      idempotencyKey: request.body.idempotencyKey,
    }).then((charge) => {
            // asynchronously called
            response.send(charge);
        })
        .catch(err =>{
            return;
        });

        const payoutToSellerAmount = Math.floor(actualAmount * .84);

const sellerPayout = stripe.payouts.create({
  amount: payoutToSellerAmount,
  currency: 'usd',
  destination: request.body.seller_stripe_id
});

        
});

/**
 * Handles creating a customer account with stripe
 * 
 * @trigger onRequest (HTTPS)
 */
exports.createStripeCustomerAccount = functions.https.onRequest((request, response) => {
  // Set your secret key: remember to change this to your live secret key in production
  // See your keys here: https://dashboard.stripe.com/account/apikeys
  console.log('CREATING STRIPE CUSToMSE ACCOUNT')
  const stripeCustomer = stripe.customers.create({
    email: request.body.email,
    metadata: {
      user_uuid: request.body.user_uuid,
      type: request.body.user_type
    }
  }).then(async customer => {
//Obtain the users information by their UUID
let userData;
await admin.firestore().collection('users').doc(request.body.user_uuid).get().then(snapshot => {
    userData = snapshot.data();
});

//Change the stripe_id
let stripeMetadata = userData.stripe_metadata;
stripeMetadata.stripe_id = customer.id

//update the user's stripe_metadata
admin.firestore().collection('users').doc(request.body.user_uuid).update({
    stripe_metadata: stripeMetadata
});

  }) 
      
});

/**
 * Handles adding a card to a stripe account
 * 
 * @trigger onRequest (HTTPS)
 */
exports.addCardToStripeAccount = functions.https.onRequest((request, response) => {
  // Set your secret key: remember to change this to your live secret key in production
  // See your keys here: https://dashboard.stripe.com/account/apikeys
  
    const tokenId   = request.body.tokenId;
    const stripeID  = request.body.stripeID;
    const user_uuid = request.body.user_uuid;
console.log('tokenL ' + tokenId)
console.log('stripe: ' + stripeID)

console.log('starting...')
    return stripe.customers.update(stripeID, { source: tokenId })
    .then(customer => {

      const { last4, id } = customer.sources.data[0];
      console.log('WORKKSS???')
      console.log(customer.sources.data[0])
      //check this
      let stripeMetadata = {
        stripe_id: id,
        card_last_four: last4,
        card_added_to_stripe: true
      }

      console.log('AAAAAAAA')
      return admin.firestore().collection('users').doc(user_uuid).update({
        stripe_metadata: stripeMetadata
      }).catch(
        err => {
          stripeMetadata.card_added_to_stripe = false;
          console.log('BBBBBBBBB')
          admin.firestore().collection('users').doc(user_uuid).update({
            stripe_metadata: stripeMetadata
          })

          response.status(400).send({
            error: err,
            description: 'Error while updating firebase from cloud function in *addCardToStripeAccount*'
          })
        });
    })
    .catch(error => console.log('Error while adding card to serviceUser', error));
});