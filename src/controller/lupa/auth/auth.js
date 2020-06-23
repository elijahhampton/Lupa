import LUPA_DB, { LUPA_AUTH, UserAuthenticationHandler } from '../../firebase/firebase';

export const SIGNUP = 'SIGNUP'

export const signup = (username, email, password) => {
    let USER_UUID;
    
    return async dispatch => {
             //Authenticate user in firebase
  await LUPA_AUTH.createUserWithEmailAndPassword(email, password).then( userCredential => {
    USER_UUID = userCredential.user.uid

    //Catch error on signup
}).catch(error => {
    alert(error.message)
    throw new Error('Something went wrong!')
  });

  await UserAuthenticationHandler.signUpUser(USER_UUID, username, email, password);

  //user is gined in now
  //LUPA_AUTH.currentUser.getTokenId()
        dispatch({type: SIGNUP});
    }
}