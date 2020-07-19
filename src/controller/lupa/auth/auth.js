import LUPA_DB, { LUPA_AUTH, UserAuthenticationHandler } from '../../firebase/firebase';
import { dispatch } from 'redux-thunk'
export const SIGNUP = 'SIGNUP'

function signUpUser() {
    return {
        type: SIGNUP,
    }
}

export const signup = (username, email, password) => {
    const authHandler = new UserAuthenticationHandler()
    let USER_UUID;
    
    return async dispatch => {
             //Authenticate user in firebase
  await LUPA_AUTH.createUserWithEmailAndPassword(email.trim(), password.trim()).then( userCredential => {
    USER_UUID = userCredential.user.uid

    //Catch error on signup
}).catch(error => {
    throw new Error('Something went wrong: ' + error)
  });
  
  await authHandler.signUpUser(USER_UUID, username, email, password);

  //user is gined in now
  //LUPA_AUTH.currentUser.getTokenId()
        dispatch(signUpUser());
    }
}