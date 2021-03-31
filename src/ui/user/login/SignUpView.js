import React, { useState, useReducer, useCallback } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  Alert
} from 'react-native';

import {
  ActivityIndicator,
  Button,
} from 'react-native-paper';

 

import {
  CheckBox,
  Button as ElementsButton,
} from 'react-native-elements';

import { Constants } from 'react-native-unimodules';

import * as authActions from '../../../controller/lupa/auth/auth'

import LupaController from '../../../controller/lupa/LupaController';

import { getLupaUserStructure } from '../../../controller/firebase/collection_structures'
import { connect, useDispatch } from 'react-redux';

import Input from '../../common/Input/Input'
import { getLupaProgramInformationStructure } from '../../../model/data_structures/programs/program_structures';
import LUPA_DB, { LUPA_AUTH } from '../../../controller/firebase/firebase';

import FeatherIcon from 'react-native-feather1s'
import { storeAsyncData } from '../../../controller/lupa/storage/async';
import { logoutUser, handleLoginError} from '../../../controller/lupa/auth/auth'
import { UPDATE_CURRENT_USER_PACKS_ACTION } from '../../../controller/redux/actionTypes';
const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE'

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
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

const SignUp = props => {

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: '',
      username: '',
      confirmPassword: '',
    },
    inputValidies: {
      email: false,
      password: false,
      username: '',
      confirmPassword: false,
    },
    formIsValid: false,
  })

  const signupHandler = async () => {
    setLoading(true);
    const attemptedEmail = formState.inputValues.email.trim();
    const attemptedPassword = formState.inputValues.password.trim();

    if (typeof(attemptedEmail) == 'undefined' 
    || attemptedEmail == '' 
    || attemptedPassword == '' 
    || typeof(attemptedPassword) == 'undefined') {
      Alert.alert(
        'Invalid Inputs',
        'You cannot use an empty email or password.',
        [{text: 'Okay', onPress: () => {}}
        ]
      )
      setLoading(false);
      return;
    }

    if (agreedToTerms === false) {
      Alert.alert(
        'Terms and Service',
        'Please agree to the Terms and Service before creating an account.',
        [{text: 'Okay', onPress: () => {}}
        ]
      );
      setLoading(false);
      return;
    }
    
    try {
    await dispatch(authActions.signup(attemptedEmail, attemptedPassword));
    storeAsyncData(attemptedEmail, 'PREVIOUS_LOGIN_EMAIL');
    storeAsyncData(attemptedPassword, 'PREVIOUS_LOGIN_PASSWORD');
    navigation.navigate('Onboarding')
    _setupRedux()
    } catch(error) {
      if (LUPA_AUTH.currentUser) {
        dispatch(logoutUser())
      }

      handleLoginError()
      navigation.navigate('GuestView')
      setLoading(false);
    }

    setLoading(false);
    }
  

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

  const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance()

  /**
  * Sets up redux by loading the current user's data, packs, and programs
  * as well as Lupa application data (assessments, workouts);
  */
  const _setupRedux = async () => {
    let currUserData = getLupaUserStructure(), currUserPrograms = getLupaProgramInformationStructure(), lupaWorkouts = {};

    await LUPA_CONTROLLER_INSTANCE.getCurrentUserData().then(result => {
      currUserData = result;
    });

    const userPayload = {
      userData: currUserData,
      healthData: {}
    }

    await dispatch({ type: 'UPDATE_CURRENT_USER', payload: userPayload });
    await dispatch({ type: UPDATE_CURRENT_USER_PACKS_ACTION, payload: [] });

    if (currUserData.isTrainer) {
      await dispatch({ type: 'UPDATE_CURRENT_USER_PROGRAMS', payload: [] })
    }

    await LUPA_CONTROLLER_INSTANCE.loadWorkouts().then(result => {
      lupaWorkouts = result;
    });

    await dispatch({ type: 'UPDATE_LUPA_WORKOUTS', payload: lupaWorkouts })
  }

  const { navigation } = props

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', }}>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        keyboardVerticalOffset={50}
        style={styles.keyboardAvoidingView}>
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ justifyContent: 'space-between', flexGrow: 2 }}>


            <View style={{ alignItems: 'center', width: "100%", }}>
              <View style={styles.headerText}>
                <Text style={{ paddingVertical: 5, fontSize: 20, fontWeight: '700', color: 'black', alignSelf: 'center' }}>
                  Join us and start your fitness journey
                        </Text>
                        <Text style={{ paddingVertical: 5, fontSize: 15, fontFamily: 'Avenir', color: 'black', alignSelf: 'center' }}>
                  Discover your perfect fitness program
                        </Text>
              </View>
            </View>

            <Input
              id="email"
              label="E-Mail"
              keyboardType="email-address"
              required
              email
              autoCapitalize="none"
              errorMessage="Please enter a valid email address"
              onInputChange={inputChangeHandler}
              initialValue=''
              initallyValid={true}
              signUpInput
            />

            <Input
              id="password"
              label="Password"
              keyboardType="default"
              secureTextEntry
              required
              password
              minLength={8}
              autoCapitalize="none"
              errorMessage="Please enter a valid password."
              onInputChange={inputChangeHandler}
              initialValue='' 
              initiallyValid={true}
              signUpInput
              />

            <Input id="confirmPassword"
              label="Confirm Password"
              keyboardType="default"
              secureTextEntry
              password
              required
              minLength={8}
              autoCapitalize="none"
              errorMessage="The passwords do not match!"
              onInputChange={inputChangeHandler}
              initialValue='' 
              initiallyValid={true}
              signUpInput
              />


            <View style={{ margin: 10 }}>
              <CheckBox
                center
                title='I agree to the Terms of Service and Privacy Policy.'
                iconRight
                iconType='material'
                checkedIcon='done'
                uncheckedIcon='check-box-outline-blank'
                checkedColor='check-box'
                containerStyle={{ backgroundColor: 'transparent', padding: 15, borderColor: 'transparent' }}
                checked={agreedToTerms}
                onPress={() => setAgreedToTerms(!agreedToTerms)}
              />

            </View>

            <View style={{  justifyContent: 'center', width: '100%', alignSelf: 'center', alignItems: 'center' }}>
              {
                loading == false ?
                <Button 
                onPress={signupHandler} 
                uppercase={false} 
                mode="contained" 
                theme={{roundness: 12}}
                contentStyle={{width: Dimensions.get('window').width - 50, height: 45,}}
                style={{
                 elevation: 0, 
                 backgroundColor: '#23374d', 
                 alignItems: 'center', 
                 justifyContent: 'center', 
                 marginTop: 20, 
                 alignSelf: 'center'}}>
              <Text style={{fontFamily: 'Avenir'}}>
                Sign Up
              </Text>
           </Button>
           :
           <ActivityIndicator size="small" color="#23374d" animating={true} />
              }


            </View>

            <Button style={{marginVertical: 15}} color="#23374d" uppercase={false} mode="text" onPress={() => navigation.navigate('Login')}>
         <Text>
           Already have an account? Sign in
         </Text>
       </Button>
          </ScrollView>

        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  headerText: {
    margin: 15,
    padding: 10,
    alignItems: 'center'
  },
})

export default SignUp;