
import React from 'react';
import stripe from 'tipsi-stripe';
import LOG, { LOG_ERROR } from '../../../common/Logger';
import LUPA_DB, { LUPA_AUTH } from '../../../controller/firebase/firebase';
import axios from 'axios';
import { UPDATE_CURRENT_USER_ATTRIBUTE_ACTION } from '../../../controller/redux/actionTypes';
import { getUpdateCurrentUserAttributeActionPayload } from '../../../controller/redux/payload_utility';
import { getLupaUserStructurePlaceholder } from '../../../controller/firebase/collection_structures';
import { rejects } from 'assert';
export function initStripe() {
  stripe.setOptions({
    publishableKey: 'pk_live_51GlmH9Cfww9muTLL3x1ey79iTIgxf8gUkcTKODIodBukFttIC9MXRVAJ6TlEjpWheGkLNopSy2CN0WNM4BxwNMD400tuClEWOM'
  })
}

export {
  stripe
}

export const STRIPE_ENDPOINT = 'https://us-central1-lupa-cd0e3.cloudfunctions.net/payWithStripe'
export const PAY_TRAINER_ENDPOINT = 'https://us-central1-lupa-cd0e3.cloudfunctions.net/makePaymentToTrainer'
export const REGISTER_NEW_STRIPE_USER_ENDPOINT = 'https://us-central1-lupa-cd0e3.cloudfunctions.net/createStripeCustomerAccount'
export const CURRENCY = 'usd';
export const LUPA_ERR_TOKEN_UNDEFINED = "TOKEN_UNDEFINED";

export enum STRIPE_VERIFICATION_STATUS {
  VERIFIED=0,
  PENDING=1,
  UNVERIFIED=2,
  UNREGISTERED=3,
  DISABLED=4,
}


/**
 * Create stripe customer account
 * @param {*} email 
 * @param {*} uuid 
 */
export const createStripeCustomerAccount = async (email, uuid, isTrainer) => {
  LOG('index.js', 'createStripeCustomerAccount::Running createStripeCustomerAccount(email, uuid, isTrainer)');
  LOG('index.js', 'createStripeCustomerAccount::' + email);
  LOG('index.js', 'createStripeCustomerAccount::' + uuid);

  axios({
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
  },
    method: 'post',
    url: REGISTER_NEW_STRIPE_USER_ENDPOINT,
    data: JSON.stringify({
      email: email,
      user_uuid: uuid,
    }),
  }).then(async response => {
    LOG('index.js', 'createStripeCustomerAccount::Received response');

    const accountID = response.data.account_id;
    const stripeID = response.data.stripeID;

    await updateFirstTimeUserStripeMetadata(stripeID, "", uuid)
    if (isTrainer === true) {
      await updateFirstTimeUserStripeMetadata(stripeID, accountID, uuid)
    }
  }).catch(error => {
    LOG_ERROR('index.js', 'createStripeCustomerAccount::Caught error during axios request', error);
  });
}

const updateFirstTimeUserStripeMetadata = (stripe_id, account_id="", uuid) => {
  return async (dispatch) => {
    let userData = getLupaUserStructurePlaceholder();

    await LUPA_DB.collection('users').doc(uuid).get().then(snapshot => {
      userData = snapshot.data();
    }).catch(error => {
      LOG_ERROR('index.js', 'updateFirstTimeUserStripeMetadata::Caught error fetching user data from uuid: ' + uuid);
      return;
    })

    //Change the stripe_id
    let stripeMetadata = userData.stripe_metadata;
    userData.stripe_metadata.stripe_id = stripe_id;

    if (userData.isTrainer) {
      userData.stripe_metadata.account_id = account_id;
      userData.stripe_metadata.connected_account_verification_status = "2";
    }

    const payload = getUpdateCurrentUserAttributeActionPayload('stripe_metadata', stripeMetadata, [])
    dispatch({ type: UPDATE_CURRENT_USER_ATTRIBUTE_ACTION, value: payload })
  }
}

const updateStripeConnectVerificationStatus = (uuid, status) => {
  return async (dispatch) => {
    LOG('index.js', 'updateStripeConnectVerificationStatus');
    let userData = getLupaUserStructurePlaceholder();

    LOG('index.js', 'updateStripeConnectVerificationStatus::Fetching user data from uuid: ' + uuid);
    await LUPA_DB.collection('users').doc(uuid).get().then(snapshot => {
      userData = snapshot.data();
    }).catch(error => {

    })

    //Change the stripe_id
    let stripeMetadata = userData.stripe_metadata;
    stripeMetadata.connected_account_verification_status = status

     //update the user's stripe_metadata
     LUPA_DB.collection('users').doc(uuid).update({
      stripe_metadata: stripeMetadata
    });

    const payload = getUpdateCurrentUserAttributeActionPayload('stripe_metadata', stripeMetadata, [])
    dispatch({ type: UPDATE_CURRENT_USER_ATTRIBUTE_ACTION, value: payload })
  }
}

const saveUserAccountIDToDatabase = (uuid, account_id) => {

  return async (dispatch) => {
    //Obtain the users information by their UUID
    let userData;

    await LUPA_DB.collection('users').doc(uuid).get().then(snapshot => {
      userData = snapshot.data();
    });

    let stripeMetadata = userData.stripe_metadata;
    stripeMetadata.account_id = account_id

    //update the user's stripe_metadata
    LUPA_DB.collection('users').doc(uuid).update({
      stripe_metadata: stripeMetadata
    });

    const payload = getUpdateCurrentUserAttributeActionPayload('stripe_metadata', stripeMetadata, [])
    dispatch({ type: UPDATE_CURRENT_USER_ATTRIBUTE_ACTION, value: payload })
  }
}

const saveUserStripeIDToDatabase = async (uuid, stripe_account_id) => {
  return async (dispatch) => {
    //Obtain the users information by their UUID
    let userData = getLupaUserStructurePlaceholder();

    await LUPA_DB.collection('users').doc(uuid).get().then(snapshot => {
      userData = snapshot.data();
    });

    //Change the stripe_id
    let stripeMetadata = userData.stripe_metadata;
    stripeMetadata.stripe_id = stripe_account_id;

    //update the user's stripe_metadata
    LUPA_DB.collection('users').doc(uuid).update({
      stripe_metadata: stripeMetadata
    });

    const payload = getUpdateCurrentUserAttributeActionPayload('stripe_metadata', stripeMetadata, [])
    dispatch({ type: UPDATE_CURRENT_USER_ATTRIBUTE_ACTION, value: payload })
  }
}

// then AFTER creating the user account you create a token of a card using tipsi-stripe
/**
 * Creates token from a card
 */
export async function createTokenFromCard(params, stripeID, cardLastFour) {
  console.log('LOOOOOOOOL')
  console.log(stripeID);
  console.log(params)
  return new Promise(async (resolve, reject) => {
    await stripe.createTokenWithCard(params)
    .then(async token => {
      console.log('ummm')
      await addCardToStripeAccount(token.tokenId, stripeID, cardLastFour).then(data => {
        resolve(data);
      })
    }).catch(error => {
      console.log(error)
      LOG_ERROR('index.js', 'Error in modules/payments/index.js while creating token from card', error)
      resolve(-1)
    })
  })
}


const updateStripeMetadata = (data) => {
  return {
    type: UPDATE_CURRENT_USER_ATTRIBUTE_ACTION,
    payload: data
  }
}


export const addCardToStripeAccount = async (tokenId, stripeID, cardLastFour) => {
  const user_uuid = LUPA_AUTH.currentUser.uid;
  console.log(LUPA_AUTH.currentUser)
  return new Promise(async (resolve, reject)=> {
  return await LUPA_AUTH.currentUser.getIdToken(true).then(async idToken => {
      console.log('OOOOH: ' + idToken)
  
      await axios({
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        url: 'https://us-central1-lupa-cd0e3.cloudfunctions.net/addCardToStripeAccount',
        data: JSON.stringify({
          tokenId: tokenId,
          stripeID: stripeID,
          user_uuid: user_uuid
        })
      }).then(response => {
        const stripeData = response.data.stripeMetadata;
        if (response.status === 200) {
          resolve(stripeData);
        } else {
          resolve(-1);
        }
      }).catch(err => console.log(err))
    }).catch(err => console.log(err))
  })
}

/*

{
    "id": "ch_1EZGjoKT40GCfr6OUy7b7xZ6",
    "object": "charge",
    "amount": 100,
    "amount_refunded": 0,
    "application": null,
    "application_fee": null,
    "application_fee_amount": null,
    "balance_transaction": "txn_1EZGjoKT40GCfr6OWAxU4gK3",
    "billing_details": {
        "address": {
            "city": null,
            "country": null,
            "line1": null,
            "line2": null,
            "postal_code": "12312",
            "state": null
        },
        "email": null,
        "name": null,
        "phone": null
    },
    "captured": true,
    "created": 1557663908,
    "currency": "usd",
    "customer": null,
    "description": null,
    "destination": null,
    "dispute": null,
    "failure_code": null,
    "failure_message": null,
    "fraud_details": {},
    "invoice": null,
    "livemode": false,
    "metadata": {},
    "on_behalf_of": null,
    "order": null,
    "outcome": {
        "network_status": "approved_by_network",
        "reason": null,
        "risk_level": "normal",
        "risk_score": 27,
        "seller_message": "Payment complete.",
        "type": "authorized"
    },
    "paid": true,
    "payment_intent": null,
    "payment_method": "src_1EZGjGKT40GCfr6OuqGca9Gy",
    "payment_method_details": {
        "card": {
            "brand": "visa",
            "checks": {
                "address_line1_check": null,
                "address_postal_code_check": "pass",
                "cvc_check": "pass"
            },
            "country": "US",
            "description": "Visa Classic",
            "exp_month": 2,
            "exp_year": 2024,
            "fingerprint": "r1wUCNEWSFD13KQx",
            "funding": "credit",
            "last4": "4242",
            "three_d_secure": null,
            "wallet": null
        },
        "type": "card"
    },
    "receipt_email": null,
    "receipt_number": null,
    "receipt_url": "https://pay.stripe.com/receipts/acct_1EQtQcKT40GCfr6O/ch_1EZGjoKT40GCfr6OUy7b7xZ6/rcpt_F3NUrM5dCDMcI7rySb0QLhR6m5mYGnf",
    "refunded": false,
    "refunds": {
        "object": "list",
        "data": [],
        "has_more": false,
        "total_count": 0,
        "url": "/v1/charges/ch_1EZGjoKT40GCfr6OUy7b7xZ6/refunds"
    },
    "review": null,
    "shipping": null,
    "source": {
        "id": "src_1EZGjGKT40GCfr6OuqGca9Gy",
        "object": "source",
        "amount": null,
        "card": {
            "exp_month": 2,
            "exp_year": 2024,
            "last4": "4242",
            "country": "US",
            "brand": "Visa",
            "address_zip_check": "pass",
            "cvc_check": "pass",
            "funding": "credit",
            "fingerprint": "r1wUCNEWSFD13KQx",
            "three_d_secure": "optional",
            "name": null,
            "address_line1_check": null,
            "tokenization_method": null,
            "dynamic_last4": null
        },
        "client_secret": "src_client_secret_F3NUUwOyZJmX65qyzyVEeN7R",
        "created": 1557663908,
        "currency": null,
        "flow": "none",
        "livemode": false,
        "metadata": {},
        "owner": {
            "address": {
                "city": null,
                "country": null,
                "line1": null,
                "line2": null,
                "postal_code": "12312",
                "state": null
            },
            "email": null,
            "name": null,
            "phone": null,
            "verified_address": null,
            "verified_email": null,
            "verified_name": null,
            "verified_phone": null
        },
        "statement_descriptor": null,
        "status": "consumed",
        "type": "card",
        "usage": "reusable"
    },
    "source_transfer": null,
    "statement_descriptor": null,
    "status": "succeeded",
    "transfer_data": null,
    "transfer_group": null
}

*/