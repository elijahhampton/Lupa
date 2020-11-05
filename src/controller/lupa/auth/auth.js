import LUPA_DB, { LUPA_AUTH, UserAuthenticationHandler } from '../../firebase/firebase';
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

const signUp = (user) => {
  return {
    type: SIGNUP,
    user
  }
}

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

const loginError = (errorCode) => {
  return {
    type: LOGIN_FAILURE,
    errorCode
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
    type: LOGOUT_FAILURE,
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

export const loginUser = (email, password) => {
  console.log(email)
  return async (dispatch) => {
    dispatch(requestLogin());
    console.log('after request')
    try {
      await LUPA_AUTH
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        console.log(user)
        dispatch(receiveLogin(user));
      })
      .catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        //Do something with the error if you want!
        dispatch(loginError(errorCode));
      });
    } catch(error) {
      console.log('error');
    }
  }
};

export const logoutUser = () => {
  return async (dispatch) => {
    console.log('a')
    dispatch(requestLogout());
    await LUPA_AUTH
      .signOut()
      .then(() => {
        dispatch(receiveLogout());
        console.log('b')
      })
      .catch(error => {
        alert(error)
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
        dispatch(receiveLogin(user)); //Might need to change this
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

    let emailExist = false;
    await LUPA_DB.collection('users').where('email', '==', email).limit(1).get().then(docs => {
      if (docs.size > 0) {
        emailExist = true;
        Alert.alert(
          'Email address in use',
          'This email address you entered is already in use.',
          [{text: 'Okay', onPress: () => {}},
          {text: 'Recover Password', onPress: () => {}}
          ]
        )
        return;
      } else {
        emailExist = false;
      }
    });
  
    if (emailExist == true) {
      dispatch(loginError())
      return;
    }

    //Authenticate user in firebase
    await LUPA_AUTH.createUserWithEmailAndPassword(email, password).then(async userCredential => {
      USER_UUID = userCredential.user.uid

      //Add the user's information to the database
    await authHandler.signUpUser(USER_UUID, "", email, password);

    dispatch(signUp(userCredential));

      //Catch error on signup
    }).catch(error => {
      alert('Oops! Something went wrong! Please try again.');
      if (LUPA_AUTH.currentUser) {
        LUPA_AUTH.signOut()
      }

      dispatch(loginError())
    });
  }
}