const functions = require('firebase-functions')
const admin = require("firebase-admin");
var nodemailer = require('nodemailer');
const moment = require('moment')
const cors = require('cors')({ origin: true });
const { RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole } = require('agora-access-token')
const stripe = require('stripe')
  ('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');

  var smtpTransport = require('nodemailer-smtp-transport');

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

const SEND_GRID_API_KEY = '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'
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(SEND_GRID_API_KEY)


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

const STRIPE_VERIFICATION_STATUS = {
  VERIFIED: "0",
  PENDING: "1",
  UNVERIFIED: "2",
  UNREGISTERED: "3",
  DISABLED: "4",
}

exports.generateAgoraTokenFromUUID = functions.https.onRequest(async (request, response) => {
  // Rtc Example
  const appID = 'fd515bbb863a43fa8dd6e89f2b3bfaeb';
  const appCertificate = '5ac6a8379aeb454c95c16b1393b3a693';
  const channelName = request.body.channel_name;
  const uid = 0;
  const role = RtcRole.PUBLISHER;
  const expirationTimeInSeconds = 3600
  const currentTimestamp = Math.floor(Date.now() / 1000)
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds

  console.log(channelName)
  console.log(uid)

  // Build token with uid
  const token = await RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, role, privilegeExpiredTs);
  console.log("Token With Integer Number Uid: " + token);



  response.setHeader('Content-Type', 'application/json');
  response.status(200).send({ token: token })
})

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

    let payload = {}

    //Check to see if the size of the notification array has changed
    if (dataBefore.notifications.length < dataAfter.notifications.length) {
      //If the size of the array has grown
      let newNotification = dataAfter.notifications[dataAfter.notifications.length - 1];
      
      switch(newNotification.type)
      {
        case "RECEIVED_PROGRAM":
           payload = {
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
          case "BOOKING_REQUEST":
            payload = {
              data: {
                title: "New Booking Request",
                body: "Someone has requested a workout session with you!",
                time: new Date().getTime().toString()
              },
              notification: {
                title: "New Booking Request",
                body: "Someone has requested a workout session with you!",
                time: new Date().getTime().toString()
              },
            };
            break;
          case "RECEIVED_PROGRAM":
          payload = {
            data: {
              title: "New Program",
              body: "Someone has shared a program with you.",
              time: new Date().getTime().toString()
            },
            notification: {
              title: "New Program",
              body: "Someone has shared a program with you.",
              time: new Date().getTime().toString()
            },
          };
          break;
          default:
            payload = {
              data: {
                title: "New Notification",
                body: "Your account has received a notification.",
                time: new Date().getTime().toString()
              },
              notification: {
                title: "New Notification",
                body: "Your account has received a notification.",
                time: new Date().getTime().toString()
              },
            };
      }


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
    
    return false;
  });


exports.createPackCharge = functions.https.onRequest(async (request, response) => {
  const packData = request.body.pack_data;

  if (typeof (packData) === 'undefined' || packData.uid == 0) {
    console.log('createPackCharge::Pack data is undefined or uid is 0.  Returning from function...')
  }

  console.log('createPackCharge::Attempting to create charge.')

  const actualAmount = 0;
  const lupaPayout = 0;

  // Create a PaymentIntent:
  await stripe.paymentIntents.create({
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


exports.makePaymentToTrainer = functions.https.onRequest(async (request, response) => {
  const actualAmount = request.body.amount * 100;
  const CURRENCY = request.body.currency;

  const purchaserUUID = request.body.purchaser_uuid;
  const trainerUUID = request.body.trainer_uuid;

  console.log('makePaymentToTrainer::started');

  const externalAccountsList = await stripe.accounts.listExternalAccounts(
    request.body.trainer_account_id,
    { object: 'bank_account', limit: 1 }
  );

  const externalAccount = externalAccountsList.data[0].id
  const amountWithoutStripeFee = (actualAmount - ((actualAmount * 0.25) + 0.25));
  const lupaPayout = (actualAmount * 0.16)

  console.log('lupa: ' + lupaPayout)
  console.log('stripe fee without amount: ' + amountWithoutStripeFee)

  // Create a PaymentIntent:
  await stripe.paymentIntents.create({
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
    idempotencyKey: Math.random().toString(),
  }).then(intent => {
    console.log(intent)

    admin.firestore().collection('users').doc(trainerUUID).get().then(documentSnapshot => {
      const userData = documentSnapshot.data();

      let updatedClientsList = userData.clients;
      if (typeof(updatedClientsList) == 'undefined') {
        return;
      }

      let clientExist = false;
      for (let i = 0; i < updatedClientsList.length; i++) {
        if (updatedClientsList[i].client == purchaserUUID) {
          clientExist = true;
        }
      }

      if (clientExist == false) {
        let clientStructure = {
          client: purchaserUUID,
          linked_program: "0"
        }
        updatedClientsList.push(clientStructure);
        admin.firestore().collection('users').doc(trainerUUID).update({
          clients: updatedClientsList
        })
      }
    })
  }).catch(err => {
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
  console.log('createStripeCustomerAccount')

  console.log('Validating request parameters.')
  console.log(request.body)
  const uuid = await request.body.user_uuid;
  const email = await request.body.email;

  if (typeof (uuid) == 'undefined' || typeof (email) == 'undefined') {
    console.log('createStripeCustomerAccount::Exiting function request parameters could not be validated.')
    console.log('UUID: ' + uuid)
    console.log('Email: ' + email)
    return;
  }

  console.log('createStripeCustomerAccount::Request parameters validated.')


  let userData, retAccountID = "", stripe_id = "";

  console.log('createStripeCustomerAccount::Capturing user data from uuid: ' + uuid);
  await admin.firestore().collection('users').doc(uuid).get().then(snapshot => {
    userData = snapshot.data();
  });

  let stripeMetadata = userData.stripe_metadata;

  if (userData.isTrainer) {
    console.log('createStripeCustomerAccount::Creating user custom stripe account.')
    const account = await stripe.accounts.create({
      business_type: 'individual',
      type: 'custom',
      country: 'US',
      email: email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true }
      },
    }).then(account => {
      stripeMetadata.account_id = account.id;
      stripeMetadata.connected_account_verification_status = "2";
      retAccountID = account.id;
    }).catch(error => {
      console.log(error)
    })
  }

  console.log('createStripeCustomerAccount::Creating user stripe customer account.')
  const stripeCustomer = await stripe.customers.create({
    email: email,
    metadata: {
      user_uuid: uuid,
      type: userData.isTrainer === true ? 'Trainer' : 'User'
    }
  }).then(customer => {
    stripeMetadata.stripe_id = customer.id;
    stripe_id = customer.id;
  }).catch(error => {
    console.log(error)
  })

  //update the user's stripe_metadata
  console.log('createStripeCustomerAccount::Updating user stripe data.')
  admin.firestore().collection('users').doc(uuid).update({
    stripe_metadata: stripeMetadata
  });

  const ids = {
    account_id: retAccountID,
    stripe_id: stripe_id
  }

  console.log('Created ids object.')
  console.log('Account ID: ' + ids.account_id)
  console.log('Stripe ID: ' + ids.stripe_id)

  console.log('createStripeCustomerAccount::Sending back response.')
  response.setHeader('Content-Type', 'application/json');
  response.status(200).send(ids)
});

exports.handleNewIndividualCustomAccountVerificationAttempt = functions.https.onRequest(async (request, response) => {
  const currentStripeVerificationStatus = Number(request.body.current_stripe_verification_status);

  //check if the user is already verified and this is some error
  if (currentStripeVerificationStatus == 0) {
    console.log('handleNewIndividualCustomAccountVerificationAttempt::User already verified returning from function.');
    return;
  }

  const user_uuid = request.body.user_uuid;
  if (typeof (user_uuid) == 'undefined' || user_uuid == "" || user_uuid == null) {
    console.log('handleNewIndividualCustomAccountVerificationAttempt::UUID is unknown.  Returning from from function.');
    return;
  }

  const accountID = request.body.account_id;
  if (typeof (accountID) == 'undefined' || accountID == "" || accountID == null) {
    console.log('handleNewIndividualCustomAccountVerificationAttempt::Connected account ID to update is unknown.  Returning from from function.');
    return;
  }



  const bankAccountFirstName = request.body.bank_account_holder_first_name;
  const bankAccountHolderLastName = request.body.bank_account_holder_last_name;
  const bankHolderName = bankAccountFirstName + " " + bankAccountHolderLastName;
  const bankAccountNumber = request.body.bank_account_number;
  const bankAccountRoutingNumber = request.body.bank_account_routing_number;
  const userDisplayName = request.body.user_display_name;
  const productDescription = "Fitness Trainer"
  const city = request.body.city;
  const state = request.body.state;
  const country = "US"
  const streetAddress = request.body.street_address;
  const secondaryAddress = request.body.secondary_address;
  const zipcode = request.body.zipcode;
  const email = request.body.email;
  const ip = request.body.public_ip_address;
  const userFirstName = request.body.user_first_name;
  const userLastName = request.body.user_last_name;
  const phoneNumber = request.body.user_phone_number;
  const last4 = request.body.last_four_ssn;
  const day = request.body.birthday_day
  const month = request.body.birthday_month
  const year = request.body.birthday_year;

  console.log('handleNewIndividualCustomAccountVerificationAttempt::Updating connected account data for account id: ' + accountID);
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
      },
      settings: {
        payouts: {
          schedule: {
            interval: 'weekly',
            weekly_anchor: 'tuesday',
          },
          statement_descriptor: "LUPA HEALTH"
        }
      }
    }
  ).then(async account => {
    console.log('handleNewIndividualCustomAccountVerificationAttempt::Finished submitting information for account verification.  Updating user account.')
    let userData;
    await admin.firestore().collection('users').doc(user_uuid).get().then(documentSnapshot => {
      userData = documentSnapshot.data();
    });

    let stripeMetadata = userData.stripe_metadata;
    stripeMetadata.connected_account_verification_status = 1;
    stripeMetadata.has_submitted_for_verification = true;

    admin.firestore().collection('users').doc(user_uuid).update({
      stripe_metadata: stripeMetadata
    })
  }).catch(error => {
    console.log('handleNewIndividualCustomAccountVerificationAttempt::Error submitting connected account information for verification.');
    console.log(error)
  });

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

      console.log('CUSSSSTOOOOMERERER')
      console.log(customer)

      console.log('still right id here: ' + id)
      console.log('WORKKSS???')
      console.log(customer.sources.data[0])

     
      admin
      .firestore()
      .collection('users')
      .doc(user_uuid)
      .get()
      .then(documentSnapshot => {
        let userData, stripeMetadata;

          userData = documentSnapshot.data();

          if (typeof(userData) === 'undefined') {
            response.setHeader('Content-Type', 'application/json');
            response.status(400).send({ stripeMetadata: -1 })
            return;
          } else {
             stripeMetadata = userData.stripe_metadata;
           //  stripeMetadata.stripe_id = stripeID;
             stripeMetadata.card_source = id;
             stripeMetadata.card_last_four = last4;
             stripeMetadata.card_added_to_stripe = true
          }


          admin.
      firestore()
      .collection('users')
      .doc(user_uuid)
      .update({
        stripe_metadata: stripeMetadata
      })
      .then(() => {
        response.setHeader('Content-Type', 'application/json');
        response.status(200).send({ stripeMetadata: stripeMetadata })
      })
      .catch(
        err => {
          stripeMetadata.card_added_to_stripe = false;
          console.log('BBBBBBBBB')

          admin.firestore().collection('users').doc(user_uuid).update({
            stripe_metadata: stripeMetadata
          })

          response.status(400).send({
            stripeMetadata: -1
          })
        })
    })
    .catch(error => console.log('Error while adding card to serviceUser', error));
      })

      //check this
      /*let stripeMetadata = {
        stripe_id: stripeID,
        card_source: id,
        card_last_four: last4,
        card_added_to_stripe: true
      }*/

      

});

exports.retrieveTrainerAccountInformation = functions.https.onRequest(async (request, response) => {
  const account_id = request.body.trainer_account_id;

  let accountDataIn = {}, balanceDataIn = {};

  const trainerAccountInformation =
    await stripe.accounts.retrieve(account_id)
      .then(account => {
        accountDataIn = account;
      });

  const balanceInformation = await stripe.balance.retrieve(account_id, (err, balanceInfo) => {
    balanceDataIn = balanceInfo;
  })

  if (typeof (balanceDataIn) == 'undefined' || accountDataIn == 'undefined') {
    return;
  }

  const accountData = {
    account_data: accountDataIn,
    balance_data: balanceDataIn,
  }

  response.setHeader('Content-Type', 'application/json');
  response.status(200).send(accountData)
});

exports.chargePackProgramMembers = functions.https.onRequest(async (request, response) => {
  const purchasingMembersList = request.body.purchasing_members;
  let purchasingProgram = request.body.program;
  const packProgramUID = request.body.pack_program_uid;

  let cardSourceArr = []

  //collect card source
  for (let i = 0; i < purchasingMembersList.length; i++) {
    await admin
    .firestore()
    .collection('users')
    .doc(purchasingMembersList[i])
    .get()
    .then(documentSnapshot => {
      let userData = documentSnapshot.data();
      cardSourceArr.push({
        card_source: userData.stripe_metadata.card_source,
        customer_id: userData.stripe_metadata.stripe_id,
      });
    })
  }

  let externalAccountsList = []
  await admin
  .firestore()
  .collection('users')
  .doc(purchasingProgram.program_owner)
  .get()
  .then(async documentSnapshot => {
    let userData = documentSnapshot.data();
    const account_id = userData.stripe_metadata.account_id;

 //collect trainer account id
 externalAccountsList = await stripe.accounts.listExternalAccounts(
  account_id,
  { object: 'bank_account', limit: 1 }
);
  })

  const actualAmount = purchasingProgram.program_price;
  const externalAccount = externalAccountsList.data[0].id;
  const lupaPayout = (actualAmount * 0.16)

  for (let i = 0; i < cardSourceArr.length; i++) {
// Create a PaymentIntent:
await stripe.paymentIntents.create({
  amount: actualAmount,
  currency: 'usd',
  payment_method: cardSourceArr[i].card_source,
  customer: cardSourceArr[i].customer_id,
  payment_method_types: ['card'],
  transfer_group: packProgramUID,
  confirm: true,
  transfer_data: {
    destination: externalAccount
  },
  application_fee_amount: lupaPayout,
}, {
  idempotencyKey: Math.random().toString(),
}).then(intent => {
  admin.firestore().collection('users').doc(cardSourceArr[i].user_uuid).get().then(documentSnapshot => {
    let userData = documentSnapshot.data();
    let pack_programs = userData.pack_programs;
    purchasingProgram.program_participant_category = 'pack';
    pack_programs.push(purchasingProgram.program_structure_uuid)

    admin.firestore().collection('users').doc(cardSourceArr[i].user_uuid).update({
      pack_programs: pack_programs
    })

    admin.firestore().collection('pack_programs').doc(packProgramUID).set({
      program_data: purchasingProgram
    }, {
      merge: true
    })
  })
})
  }
})

exports.sendFeedbackSubmission = functions.https.onRequest(async (request, response) => {
  const feedbackText = await request.body.feedback_text;
  const user = await request.body.user_email;

  const msg = {
    to: 'rheasilvia.lupahealth@gmail.com', // Change to your recipient
    from: 'rheasilvia.lupahealth@gmail.com', // Change to your verified sender
    subject: 'New Feedback Submission',
    text: `You have received new feedback from a user with the registered email: ${user}.  The submission states: ${feedbackText}`,
  }

  sgMail
    .send(msg)
    .then(() => {
      console.log('sendFeedbackSubmission::Successfully sent email.')
    })
    .catch((error) => {
      console.error('sendFeedbackSubmission::Function exited with error: ' + error)
    })
})

exports.sendTrainerEmailReferral = functions.https.onRequest(async (request, response) => {
  const trainerData = request.body.trainer_data;
  const referrerData = request.body.referrer_data
  const referrerDateJoined = moment(referrerData).format('LL').toString();
  const toAddress = request.body.referred_user_email;
  const emailMsg = {
    to: toAddress,
    from: 'rheasilvia.lupahealth@gmail.com',
    template_id: 'd-54bdf21630e84659bc0946a22562043e', 
    dynamic_template_data: {
      referrer: referrerData,
      trainer: trainerData,
      referrerDateJoined: referrerDateJoined
    }
  }

  await sgMail.send(emailMsg);
  return { success: true }
});

exports.fetchTrainerBalancesEndpoint = functions.https.onRequest(async (request, response) => {
  const connectedStripeAccountId = request.body.account_id;

  if (typeof(connectedStripeAccountId) == 'undefined') {
    return;
  }

  const balance = await stripe.balance.retrieve({
    stripeAccount: connectedStripeAccountId
  });

  console.log('fetchTrainerBalancesEndpoint::Successfully fetched balance object.');
  console.log(balance);

  const availableAccountBalance = balance.available[0].amount;
  const pendingAccountBalance = balance.pending[0].amount;

  response.setHeader('Content-Type', 'application/json');
  response.status(200).send({ availableBalance: availableAccountBalance, pendingBalance: pendingAccountBalance });
});