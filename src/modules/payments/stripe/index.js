import stripe from 'tipsi-stripe';
import LOG, { LOG_ERROR } from '../../../common/Logger';
import LUPA_DB, { LUPA_AUTH } from '../../../controller/firebase/firebase';

export function initStripe() {
    stripe.setOptions({
        publishableKey: 'pk_live_0qnly0beDBvvr3pkYIL8VYcF00ydAsthgS'
    })
}

export {
    stripe
}

export const STRIPE_ENDPOINT = 'https://us-central1-lupa-cd0e3.cloudfunctions.net/payWithStripe'
export const CURRENCY = 'usd';
export const LUPA_ERR_TOKEN_UNDEFINED = "TOKEN_UNDEFINED";


/**
 * Create stripe customer account
 * @param {*} email 
 * @param {*} uuid 
 */
export const createStripeCustomerAccount = (email, uuid) => {
    LUPA_AUTH.currentUser.getIdToken(true).then(idToken => {
      // Send firebase idToken to your backend via HTTPS
      axios({
        method: 'post',
        url: 'https://us-central1-lupa-cd0e3.cloudfunctions.net/createStripeCustomerAccount',
        headers: {
          'Authorization': 'Bearer ' + idToken
        },
        data: JSON.stringify({
          email: email,
          user_uuid: uuid,
          user_type: 'non-trainer'
        })
      })
      .then(res  => {
        if (res.status === 200) {
          // grab stripe account id and send it to the callback 
          //to be saved in firebase and/or your local storage
          let stripeID = res.data.stripeID;
  
          return saveUserStripeIDToDatabase(uid, stripeID);
        }
      })
      .catch(err => console.log('error while doing get req createStripeAccount:', err));
  
    }).catch(error => {
      // Handle error
      console.log('Error retrieving IdToken!', err);
    });
  }

  const saveUserStripeIDToDatabase = async (uuid, stripe_account_id) => {

    //Obtain the users information by their UUID
    let userData;
    await LUPA_DB.collection('users').doc(uuid).get().then(snapshot => {
        userData = snapshot.data();
    });

    //Change the stripe_id
    let stripeMetadata = userData.stripe_metadata;
    stripeMetadata.stripe_id = stripe_account_id;

    //update the user's stripe_metadata
    LUPA_DB.collection('users').doc(uid).update({
        stripe_metadata: stripeMetadata
    });
  }

// then AFTER creating the user account you create a token of a card using tipsi-stripe
/**
 * Creates token from a card
 */
export function createTokenFromCard(params, stripeID) {
    return stripe.createTokenWithCard(params).then(token => {
        addCardToStripeAccount(token.tokenId, stripeID)
    }).catch(error => {
        LOG_ERROR('index.js', 'Error in modules/payments/index.js while creating token from card', error )
    });
  }

  export const addCardToStripeAccount = (tokenId, stripeID) => {
    return (dispatch) => {
  
      LUPA_AUTH.currentUser.getIdToken(true).then(idToken => {
  
        axios({
          method: 'post',
          url: 'https://us-central1-lupa-cd0e3.cloudfunctions.net/addCardToStripeAccount',
          headers: {
            'Authorization': 'Bearer ' + idToken
          },
          data: {
            tokenId: tokenId,
            stripeID: stripeID,
          }
        })
        .then(res  => {
          if (res.status === 200) {
              //Obtain the users information by their UUID
    let userData;
    await LUPA_DB.collection('users').doc(uuid).get().then(snapshot => {
        userData = snapshot.data();
    });

    //Change the stripe_id
    let stripeMetadata = userData.stripe_metadata;
    stripeMetadata.card_added_to_stripe = true;


            return dispatch({ type: 'ADD_CARD_TO_ACCOUNT_SUCCESS', payload: stripeMetadata });
          }
        })
        .catch(err => console.log('error while doing get req addCardToStripeAccount:', err));
  
      })
      .catch(error => console.log('Error retrieving users ID token', error));
    }
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