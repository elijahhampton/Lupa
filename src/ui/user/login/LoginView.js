/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  16, 2019
 * 
 * Login View
 */
import React, { useEffect, useReducer, useCallback, useState, createRef } from "react";

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Keyboard,
  Platform,
  KeyboardAvoidingView
} from "react-native";

 

import {
  Snackbar,
  Divider, Button
} from 'react-native-paper';

import {
  Button as ElementsButton 
} from "react-native-elements";

import { useDispatch } from 'react-redux';

import LupaController from '../../../controller/lupa/LupaController';

import ThinFeatherIcon from "react-native-feather1s";
import { storeAsyncData, retrieveAsyncData } from "../../../controller/lupa/storage/async";
import { LOG_ERROR } from "../../../common/Logger";
import { getLupaUserStructure } from "../../../controller/firebase/collection_structures";
import { Constants } from "react-native-unimodules";
import Input from '../../common/Input/Input'
import { useNavigation } from '@react-navigation/native';

import { loginUser, logoutUser } from "../../../controller/lupa/auth/auth";
import { useSelector } from 'react-redux'
import { getLupaStoreState } from "../../../controller/redux";
import { LUPA_AUTH } from "../../../controller/firebase/firebase";

const INPUT_PLACEHOLDER_COLOR = "rgb(99, 99, 102)"

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE'

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    if (action.value == '' || typeof(action.value) == 'undefined') {
      return {
        ...state
      }
    }

    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues
    };
  }
  return state;
};

/**
 * Ensures the user's model matches the current schema.
 * */
function checkUserSchema(userData, schema) {
  return Object.keys(userData).length === Object.keys(schema).length
  && Object.keys(userData).every(k => schema.hasOwnProperty(k));
}

function LoginView(props) {
  const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
  const LUPA_STATE = useSelector(state => {
    return state;
  })

  const [securePasswordEntryEnabled, useSecurePasswordEntry] = useState(true);
  const [snackIsVisible, showSnack] = useState(false);
  const [loginRejectedReason, setLoginRejectedReason] = useState('');
  const [userHasCompletedOnboarding, setUserHasCompletedOnboarding] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch()

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      loginEmail: '',
      loginPassword: '',
    },
    inputValidies: {
      loginEmail: false,
      loginPassword: false,
    },
    formIsValid: false,
  })

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
    dispatchFormState({
      type: FORM_INPUT_UPDATE,
      value: inputValue,
      isValid: inputValidity,
      input: inputIdentifier
    })
  },
  [dispatchFormState]
  );

  useEffect(() => {
    async function retrievePreviousSignInData() {
      try {
        await retrieveAsyncData('PREVIOUS_LOGIN_EMAIL').then(res => {
          dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: res,
            isValid: true,
            input: 'loginEmail'
          });
        });
  
        await retrieveAsyncData('PREVIOUS_LOGIN_PASSWORD').then(res => {
          dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: res,
            isValid: true,
            input: 'loginPassword'
          });
        });
      } catch(error) {
        LOG_ERROR('LoginView.js', 'Unhandled error in LoginView.js componentDidMount', error);
        dispatchFormState({
          type: FORM_INPUT_UPDATE,
          value: '',
          isValid: true,
          input: 'loginEmail'
        })

        dispatchFormState({
          type: FORM_INPUT_UPDATE,
          value: '',
          isValid: true,
          input: 'loginPassword'
        })
      }
    }

    retrievePreviousSignInData();
  }, []);

   /**
   * Introduce the application by setting up redux, indexing the application, 
   * and navigating the user into the application.
   */
  const _introduceApp = async (uuid) => {
    try {
    await _setupRedux(uuid);
    LUPA_CONTROLLER_INSTANCE.indexApplicationData();

    if (LUPA_STATE.Users.currUserData.has_completed_onboarding == true) {
      navigation.navigate('App');
      return;
    }

    } catch(error) {
      if (LUPA_AUTH.currentUser) {
        dispatch(logoutUser());
      }

      navigation.navigate('GuestView');
    }

    navigation.navigate('Onboarding')
  }

const resetFormState = () => {
  dispatchFormState({
    type: FORM_INPUT_UPDATE,
    value: '',
    isValid: false,
    input: 'loginEmail'
  })

  dispatchFormState({
    type: FORM_INPUT_UPDATE,
    value: '',
    isValid: false,
    input: 'loginPassword'
  })
}

  /**
   * Handles user authentication once the user presses the login button.
   */
  const onLogin = async () => {
    //e.preventDefault();
    await dispatchFormState({
      type: FORM_INPUT_UPDATE,
      value: '',
    })
    
    Keyboard.dismiss();

    let attemptedUsername = await formState.inputValues.loginEmail;
    let attemptedPassword = await formState.inputValues.loginPassword;

   await dispatch(loginUser(attemptedUsername, attemptedPassword));
  const updatedState = await getLupaStoreState();

    
   if (updatedState.Auth.isAuthenticated === true) {
    _introduceApp(updatedState.Auth.user.user.uid);
    storeAsyncData(attemptedUsername, 'PREVIOUS_LOGIN_EMAIL');
    storeAsyncData(attemptedPassword, 'PREVIOUS_LOGIN_PASSWORD');
    resetFormState();
   } else {
     switch(updatedState.Auth.loginErrorCode) {
       case 'auth/invalid-email':
        setLoginRejectedReason('The email you are attempting to use is not a valid email address.');
        break;
       case 'auth/user-disabled':
        setLoginRejectedReason('This account has been disabled.  Please contact support for further information.');
        break;
       case 'auth/user-not-found':
        setLoginRejectedReason('This account you are attempting to sign in with is not registered.');
        break;
       case 'auth/wrong-password':
        setLoginRejectedReason('Invalid password.');
        break;
     }
    
    showSnack(true);
   }


  }

  /**
   * DISPATCHES PAYLOAD INTO REDUX ONLOGIN CONTAINING USER INFORMATION AND LUPA DATA 
   */
  const updateUserInRedux = (userObject) => {
    dispatch({ type: 'UPDATE_CURRENT_USER', payload: userObject});
  }

  const updateUserProgramsDataInRedux = (programsData) => {
    dispatch({ type: 'UPDATE_CURRENT_USER_PROGRAMS', payload: programsData });
  }

  const updateLupaWorkoutsDataInRedux = (lupaWorkoutsData) => {
    dispatch({ type: 'UPDATE_LUPA_WORKOUTS', payload: lupaWorkoutsData });
  }

  const toggleSecurePasswordEntry = () => {
    useSecurePasswordEntry(!securePasswordEntryEnabled);
  }

  /**
   * Sets up redux by loading the current user's data, packs, and programs
   * as well as Lupa application data (assessments, workouts);
   */
  _setupRedux = async (uuid) => {
    let currUserData = getLupaUserStructure(), currUserPrograms = [], lupaWorkouts = {};
    await LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(uuid).then(result => {
      currUserData = result;
    });

    setUserHasCompletedOnboarding(currUserData.has_completed_onboarding);
    
    //We need to ensure that the user's structure matches the current schema. If it
    //does not we simply add the missing fields with the default properties.
    /*if (!checkUserSchema(currUserData, getLupaUserStructure())) {
      currUserData = Object.assign(getLupaUserStructure(), currUserData)
    }*/

    let userPayload = {
      userData: currUserData,
    }

    await updateUserInRedux(userPayload);

    if (currUserData.isTrainer) {
      await LUPA_CONTROLLER_INSTANCE.loadCurrentUserPrograms().then(result => {
        currUserPrograms = result;
      })
      await updateUserProgramsDataInRedux(currUserPrograms);
    }

    await LUPA_CONTROLLER_INSTANCE.loadWorkouts().then(result => {
      lupaWorkouts = result;
    });
    await updateLupaWorkoutsDataInRedux(lupaWorkouts);
  }

  /**
   * Emits a set state action when the snackbar is dismissed.
   */
  const onDismissSnackBar = () => {
    showSnack(false);
  }

  //next method

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'space-between' }}>
     <View style={{flex: 1, justifyContent: 'space-between'}} keyboardDismissMode="interactive" keyboardShouldPersistTaps="never">
     <View style={styles.headerText}>
       <Text style={styles.welcomeBackText}>
         Welcome back,
                     </Text>
       <Text style={styles.signInText}>
         sign in to continue
                     </Text>

     </View>

     <View style={{ flex: 1, justifyContent: 'flex-start', marginVertical: 20 }}>
       <View style={{ width: '100%', margin: 5 }}>
       <Input
       id="loginEmail"
       label="Email"
       placeholder="Email"
       editable={true}
       onInputChange={inputChangeHandler}
       autoCapitalize='none'
       email
       secureTextEntry={false}
       required
       initialValue=''
      initiallyValid={true}
       />
       </View>

       <View style={{ width: '100%', margin: 5}}>
       <Input
       id="loginPassword"
       label="Password"
       placeholder="Enter your password" 
       placeholderTextColor={INPUT_PLACEHOLDER_COLOR}
       editable={true}
       onInputChange={inputChangeHandler}
       autoCapitalize='none'
       password
       initiallyValid={true}
       secureTextEntry={securePasswordEntryEnabled}
       minLength={8}
       required
       />
       </View>

       <Button onPress={onLogin} uppercase={false} mode="contained" contentStyle={{height: 45, width: Dimensions.get('window').width - 50}} style={{shadowColor: '#23374d', elevation: 5, backgroundColor: '#23374d', alignItems: 'center', justifyContent: 'center', marginTop: 20, alignSelf: 'center'}}>
          <Text>
            Login
          </Text>
       </Button>

       <Button color="#23374d" uppercase={false} mode="text" style={{marginVertical: 5}}>
         <Text>
           Forgot Password?
         </Text>
       </Button>
       </View>

       <View style={{position: 'absolute', bottom: 0, alignSelf: 'center', width: '100%', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
       <Button color="#23374d" uppercase={false} mode="text" onPress={() => navigation.navigate('SignUp')}>
         <Text>
           Don't have an account?  Join us
         </Text>
       </Button>
       </View>

       </View>

       <Snackbar
       style={{backgroundColor: '#212121', marginBottom: Constants.statusBarHeight}}
       theme={{ colors: { accent: '#2196F3' }}}
       visible={snackIsVisible}
       onDismiss={onDismissSnackBar}
       action={{
         label: 'Okay',
         onPress: () => showSnack(false),
       }}
     >
       {loginRejectedReason}
     </Snackbar>
     
   </SafeAreaView>
  )
}

const styles = StyleSheet.create({
          root: {
          flex: 1,
  },
  textLabel: {
          fontSize: 15,
    fontWeight: "600",
    color: '#424242',
    margin: 5
  },
  headerText: {
    padding: 10,
    alignItems: 'center',
  },
  welcomeBackText: {
    fontSize: 28, fontWeight: '700', color: 'black',  
  },
  signInText: {
    fontSize: 28, fontWeight: '700', color: '#23374d',  
  },
  noAccountTextContainer: {
    flexDirection: 'row', margin: 5
  },
  inputStyle: {
    fontWeight: '400', fontSize: 15
  },
  leftIconContainerStyle: {
    margin: 5, 
    alignItems: 'flex-start'
  }
});

export default LoginView;
