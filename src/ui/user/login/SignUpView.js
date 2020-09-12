import React, { useState, useReducer, useCallback } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
  Alert
} from 'react-native';

import {
  Button,
} from 'react-native-paper';

import SafeAreaView from 'react-native-safe-area-view';

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
import LUPA_DB from '../../../controller/firebase/firebase';
import { setUncaughtExceptionCaptureCallback } from 'process';

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
    const attemptedEmail = formState.inputValues.username.trim();

    if (agreedToTerms === false) {
      Alert.alert(
        'Terms and Service',
        'Please agree to the Terms and Service before creating an account.',
        [{text: 'Okay', onPress: () => {
          console.log('Okay')
        }}
        ]
      )
    }

    let emailExist = false;
    await LUPA_DB.collection('users').where('email', '==', attemptedEmail).limit(1).get().then(docs => {
      if (docs.size > 0) {
        emailExist = true;
        Alert.alert(
          'Email address in use',
          'This email address you entered is already in use.',
          [{text: 'Okay', onPress: () => {

          }},
          {
            text: 'Recover Password',
            onPress: () => alert('Too bad')
          }
          ]
        )
        return;
      } else {
        emailExist = false;
      }
    });

    if (emailExist == true) {
      return;
    } else {
      await dispatch(authActions.signup(formState.inputValues.username.trim(), formState.inputValues.email.trim(), formState.inputValues.password.trim()))
      navigation.navigate('Onboarding')
      _setupRedux()
    }
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
    let currUserData = getLupaUserStructure(), currUserPrograms = getLupaProgramInformationStructure(), lupaWorkouts = [];

    await LUPA_CONTROLLER_INSTANCE.getCurrentUserData().then(result => {
      currUserData = result;
    })
    let userPayload = {
      userData: currUserData,
      healthData: {}
    }
    await dispatch({ type: 'UPDATE_CURRENT_USER', payload: userPayload })

    if (currUserData.isTrainer) {
      await LUPA_CONTROLLER_INSTANCE.loadCurrentUserPrograms().then(result => {
        currUserPrograms = result;
      })
      await dispatch({ type: 'UPDATE_CURRENT_USER_PROGRAMS', payload: currUserPrograms })
    }

    lupaWorkouts = LUPA_CONTROLLER_INSTANCE.loadWorkouts();
    dispatch({ type: 'UPDATE_LUPA_WORKOUTS', payload: lupaWorkouts })
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
            <View style={{ alignItems: 'center', marginTop: Constants.statusBarHeight, width: "100%", }}>
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
              id="username"
              label="E-Mail"
              keyboardType="email-address"
              required
              email
              autoCapitalize="none"
              errorMessage="Please enter a valid email address"
              onInputChange={inputChangeHandler}
              initialValue=''
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

            <View style={{  justifyContent: 'flex-end', width: '100%', alignSelf: 'center' }}>
            <Button onPress={signupHandler} uppercase={false} mode="contained" style={{shadowColor: '#23374d', elevation: 5, backgroundColor: '#23374d', height: 45, alignItems: 'center', justifyContent: 'center', marginTop: 20, width: Dimensions.get('window').width - 50, alignSelf: 'center'}}>
          <Text>
            Sign Up
          </Text>
       </Button>

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