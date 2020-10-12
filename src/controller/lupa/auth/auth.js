import LUPA_DB, { LUPA_AUTH, UserAuthenticationHandler } from '../../firebase/firebase';
import { dispatch } from 'redux-thunk'
import { createStripeCustomerAccount } from '../../../modules/payments/stripe';

export const SIGNUP = 'SIGNUP'
export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGOUT_REQUEST = "LOGOUT_REQUEST";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const LOGOUT_FAILURE = "LOGOUT_FAILURE";
export const VERIFY_REQUEST = "VERIFY_REQUEST";
export const VERIFY_SUCCESS = "VERIFY_SUCCESS";

const requestLogin = () => {
  return {
    type: LOGIN_REQUEST
  };
};

const receiveLogin = user => {
  return {
    type: LOGIN_SUCCESS,
    user
  };
};

const loginError = () => {
  return {
    type: LOGIN_FAILURE
  };
};

const requestLogout = () => {
  return {
    type: LOGOUT_REQUEST
  };
};

const receiveLogout = () => {
  return {
    type: LOGOUT_SUCCESS
  };
};

const logoutError = () => {
  return {
    type: LOGOUT_FAILURE
  };
};

const verifyRequest = () => {
  return {
    type: VERIFY_REQUEST
  };
};

const verifySuccess = () => {
  return {
    type: VERIFY_SUCCESS
  };
};

export const loginUser = (email, password) =>  {
  return async (dispatch) => {
    dispatch(requestLogin());
    await LUPA_AUTH
    .signInWithEmailAndPassword(email, password)
    .then(user => {
      dispatch(receiveLogin(user));
    })
    .catch(error => {
      //Do something with the error if you want!
      dispatch(loginError());
    });
  }
};

export const logoutUser = () => {
  return async (dispatch) => {
    dispatch(requestLogout());
    await LUPA_AUTH
      .signOut()
      .then(() => {
        dispatch(receiveLogout());
      })
      .catch(error => {
        //Do something with the error if you want!
        dispatch(logoutError());
      });
  }
};

export const verifyAuth = () =>  {
  return async (dispatch) => {
    dispatch(verifyAuth());
    await LUPA_AUTH.onAuthStateChanged(user => {
      if (user !== null) {
        dispatch(receiveLogin(user));
      }
      dispatch(verifySuccess());
    });
  }

};


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