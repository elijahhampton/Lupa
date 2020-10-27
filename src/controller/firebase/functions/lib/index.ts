const functions = require('firebase-functions')
const admin = require("firebase-admin");

const cors = require('cors')({ origin: true });

const stripe = require('stripe')
  ('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');

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
    if (dataBefore.notifications.length < dataAfter.notifications.length) {
      //If the size of the array has grown
      let newNotification = dataAfter.notifications[dataAfter.notifications.length - 1];
      console.log('B')
      //Find out which notification it is
      if (newNotification.type == "RECEIVED_PROGRAM") {
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



exports.makePaymentToTrainer = functions.https.onRequest(async (request, response) => {
  const actualAmount = request.body.amount * 100;
  const CURRENCY = request.body.currency;

  console.log('makePaymentToTrainer::started');

  const externalAccountsList = await stripe.accounts.listExternalAccounts(
    request.body.trainer_account_id,
    {object: 'bank_account', limit: 1}
  );

  const externalAccount = externalAccountsList.data[0].id
  const amountWithoutStripeFee = (actualAmount - ((actualAmount * 0.25) + 0.25));
  const lupaPayout = (actualAmount * 0.16)

  console.log('lupa: ' + lupaPayout)
  console.log('stripe fee without amount: ' + amountWithoutStripeFee)

  // Create a PaymentIntent:
const paymentIntent = await stripe.paymentIntents.create({
  amount: actualAmount,
  currency: 'usd',
  payment_method: request.body.requester_card_source,
  customer: request.body.customer_id,
  payment_method_types: ['card'],
  transfer_group: 0,
  confirm: true,
  transfer_data: {
    destination: request.body.trainer_account_id,
  },
  application_fee_amount: lupaPayout,
}, {
  idempotencyKey: Math.random.toString(),
}).then(intent => {
  console.log('Successfull intent')
  console.log(intent)
}).catch(err => {
  console.log('OKOKOKOK ERRROOOORR')
  console.log(err)
})
})

/**
 * Handles sending payment data to firebase server.
 * 
 * @trigger onRequest (HTTPS)
 */
exports.payWithStripe = functions.https.onRequest((request, response) => {
  console.log('stripe a')
  console.log('works??')
  stripe.charges.create({
    amount: request.body.amount * 100,
    currency: request.body.currency,
    source: request.body.token.tokenId,
  },
    {
      idempotencyKey: request.body.idempotencyKey
    }).then((charge) => {
      console.log('stripe b')
      // asynchronously called
      response.send(charge);
    })
    .catch(err => {
      console.log('stripe c')
      console.log(err)
    });
});

/**
 * Handles creating a customer account with stripe
 * 
 * @trigger onRequest (HTTPS)
 */
exports.createStripeCustomerAccount = functions.https.onRequest(async (request, response) => {
  // Set your secret key: remember to change this to your live secret key in production
  // See your keys here: https://dashboard.stripe.com/account/apikeys
  console.log('CREATING STRIPE CUSToMSE ACCOUNT')

  const account = await stripe.accounts.create({
    business_type: 'individual',
    type: 'custom',
    country: 'US',
    email: request.body.user_email,
    capabilities: {
      card_payments: {requested: true},
      transfers: { requested: true }
    },
  });

  const stripeCustomer = await stripe.customers.create({
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
    stripeMetadata.stripe_id = customer.id;
    stripeMetadata.account_id = account.id;

    //update the user's stripe_metadata
    admin.firestore().collection('users').doc(request.body.user_uuid).update({
      stripe_metadata: stripeMetadata
    });

  })

  response.setHeader('Content-Type', 'application/json');
  response.send({ account_id: account.id /*, charges_enabled: account.charges_enabled, payouts_enabled: account.payouts_enabled */ })

});

exports.handleNewIndividualCustomAccountVerificationAttempt = functions.https.onRequest(async (request, response) => {
  console.log('1')
  const bankAccountFirstName = request.body.bank_account_holder_first_name;
  const bankAccountHolderLastName = request.body.bank_account_holder_last_name;
  const bankHolderName = bankAccountFirstName + " " + bankAccountHolderLastName;
  const bankAccountNumber = request.body.bank_account_number;
  const bankAccountRoutingNumber = request.body.bank_account_routing_number;
  console.log(bankAccountFirstName)
  console.log(bankAccountHolderLastName)
  console.log(bankAccountNumber)
  console.log(bankAccountRoutingNumber)
  console.log('1')
  const accountID = request.body.account_id;
  const userDisplayName = request.body.user_display_name;
  const productDescription = "Fitness Trainer"
  const city = request.body.city;
  const state = request.body.state;
  const country = "US"
  const streetAddress = request.body.street_address;
  const secondaryAddress = request.body.secondary_address;
  const zipcode = request.body.zipcode;
  console.log(accountID)
  console.log(userDisplayName)
  console.log(productDescription)
  console.log(city)
  console.log(state)
  console.log(streetAddress)
  console.log(secondaryAddress)
  console.log(zipcode)
  console.log(country)
  console.log('1')
  //create
  const email = request.body.email;
  const ip = request.body.public_ip_address;
  const user_uuid = request.body.user_uuid;
  const userFirstName = request.body.user_first_name;
  const userLastName = request.body.user_last_name;
  const phoneNumber = request.body.user_phone_number;
  const last4 = request.body.last_four_ssn;
  console.log(email)
  console.log(ip)
  console.log(user_uuid)
  console.log(userFirstName)
  console.log(userLastName)
  console.log(phoneNumber)
  console.log(last4)

  console.log('1')
  const day = request.body.birthday_day
  const month = request.body.birthday_month
  const year = request.body.birthday_year;

  console.log(day)
  console.log(month)
  console.log(year)
  console.log('1')
  const account = await stripe.accounts.update(
    accountID,
    {
      business_type: 'individual',
      business_profile: {
        mcc: "5734",
        name: userDisplayName,
        product_description: productDescription,
        support_address: {
          city: city,
          country: country,
          line1: streetAddress,
          line2: secondaryAddress,
          postal_code: zipcode,
          state: state,
        },
        url: ""
      },
      capabilities: {
        card_payments: {
          requested: true
        },
        transfers: {
          requested: true
        },
      },
      individual: {
        first_name: userFirstName,
        last_name: userLastName,
        ssn_last_4: last4,
        email: email,
        phone: phoneNumber,
        address: {
          city: city,
          country: country,
          line1: streetAddress,
          line2: secondaryAddress,
          postal_code: zipcode,
          state: state,
        },
        dob: {
          day: Number(day),
          month: Number(month),
          year: Number(year)
        },
      },
      email: email,
      tos_acceptance: {
        date: new Date(),
        ip: ip,
      },
      external_account: { 
        object: 'bank_account',
        country: 'US',
        currency: 'usd',
        account_holder_name: bankHolderName,
        account_holder_type: 'individual',
        routing_number: bankAccountRoutingNumber,
        account_number: bankAccountNumber,
    },
      metadata: {
        user_uuid: user_uuid,
      }
    }
  ).then(account => {
    console.log('updated!')
    console.log(account)
  }).catch(err => {
    console.log('got an error')
    console.log(err)
  })
  console.log('about to print acc')
  console.log(account)

})

exports.updateAccount = functions.https.onRequest(async (request, response) => {
  
})

exports.createAccountLink = functions.https.onRequest(async (request, response) => {
  const account_id = request.body.accountID;
  console.log(account_id)
  const accountLink = await stripe.accountLinks.create({
    account: account_id,
    refresh_url: 'https://example.com/reauth',
    return_url: 'https://example.com/return',
    type: 'account_onboarding',
  });
  console.log('just created it')
  response.setHeader('Content-Type', 'application/json');
  response.send({ redirect_url: accountLink.url });
  console.log('finished sending request')
});


/**
 * Handles adding a card to a stripe account
 * 
 * @trigger onRequest (HTTPS)
 */
exports.addCardToStripeAccount = functions.https.onRequest((request, response) => {
  // Set your secret key: remember to change this to your live secret key in production
  // See your keys here: https://dashboard.stripe.com/account/apikeys

  const tokenId = request.body.tokenId;
  const stripeID = request.body.stripeID;
  const user_uuid = request.body.user_uuid;
  console.log('tokenL ' + tokenId)
  console.log('stripe: ' + stripeID)

  console.log('starting...')
  return stripe.customers.update(stripeID, { source: tokenId })
    .then(customer => {

      console.log('GOT THE RIHGT ID: ' + stripeID)

      const { last4, id } = customer.sources.data[0];

      console.log('still right id here: ' + id)
      console.log('WORKKSS???')
      console.log(customer.sources.data[0])
      //check this
      let stripeMetadata = {
        stripe_id: stripeID,
        card_source: id,
        card_last_four: last4,
        card_added_to_stripe: true
      }

      console.log('AAAAAAAA')
      console.log(stripeMetadata);
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

exports.retrieveTrainerAccountInformation = functions.https.onRequest(async (request, response) => {
  const account_id = request.body.trainer_account_id;

  let accountDataIn = {}, balanceDataIn = {};

  const trainerAccountInformation = 
    await stripe.accounts.retrieve(account_id)
          .then(account => {
            accountDataIn = account;
          })

  const balanceInformation = await stripe.balance.retrieve(account_id, (err, balanceInfo) => {
      balanceDataIn = balanceInfo;
  })
  
  if (typeof(balanceDataIn) == 'undefined' || accountDataIn == 'undefined') {
    return;
  }
 
  const accountData = {
    account_data: accountDataIn,
    balance_data: balanceDataIn,
  }

  response.setHeader('Content-Type', 'application/json');
  response.status(200).send(accountData)
});