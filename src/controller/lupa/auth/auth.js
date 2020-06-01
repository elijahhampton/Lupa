import LUPA_DB, { LUPA_AUTH } from '../../firebase/firebase';


/**
 * Logout User
 * Takes the current user and logs them out in firebase.
 */
export var logoutUser = () => {
    LUPA_AUTH.signOut();
}