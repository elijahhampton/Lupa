import LUPA_DB, { LUPA_AUTH, UserAuthenticationHandler } from '../../firebase/firebase';
import { dispatch } from 'redux-thunk'
import { createStripeCustomerAccount } from '../../../modules/payments/stripe';
export const SIGNUP = 'SIGNUP'

function signUpUser() {
  return {
    type: SIGNUP,
  }
}

const sendVerificationEmail = () => {
  LUPA_AUTH.currentUser.sendEmailVerification().then(function () {
    // Email sent.
  }).catch(function (error) {
    // An error happened.
  });
}

export const signup = (email, password) => {
  const authHandler = new UserAuthenticationHandler()
  let USER_UUID;

  return async dispatch => {

    //Authenticate user in firebase
    await LUPA_AUTH.createUserWithEmailAndPassword(email, password).then(userCredential => {
      USER_UUID = userCredential.user.uid

      //Catch error on signup
    }).catch(error => {
      alert('Oops! Something went wrong! Please try again.');
    });

    //Add the user's information to the database
    await authHandler.signUpUser(USER_UUID, "", email, password);

    //Create the user as a customer in stripe
    createStripeCustomerAccount(email, LUPA_AUTH.currentUser.uid);

    //user is gined in now
    //LUPA_AUTH.currentUser.getTokenId()
    dispatch(signUpUser());
  }
}