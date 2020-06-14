import React, { useState, useReducer, useCallback} from 'react';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal,
    Dimensions,
    KeyboardAvoidingView,
} from 'react-native';

import {
    Surface,
    Snackbar,
    ActivityIndicator,
} from 'react-native-paper';

import SafeAreaView from 'react-native-safe-area-view';

import { 
    Input,
    CheckBox,
    Button as ElementsButton,
 } from 'react-native-elements';

 import { Constants } from 'react-native-unimodules';

 import * as authActions from '../../../controller/lupa/auth/auth'
 import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

 import FeatherIcon from 'react-native-vector-icons/Feather';
 import ThinFeatherIcon from "react-native-feather1s";

import { UserAuthenticationHandler } from '../../../controller/firebase/firebase'

import LupaController from '../../../controller/lupa/LupaController';

import { getLupaAssessmentStructure } from '../../../controller/firebase/collection_structures'
import { connect, useDispatch } from 'react-redux';
/*
mapStateToProps = (state) => {
    return { 
      lupa_data: state
    }
  }
  
  mapDispatchToProps = dispatch => {
    return {
      updateUser: (userObject) => {
        dispatch({
          type: 'UPDATE_CURRENT_USER',
          payload: userObject
        })
      },
      updatePacks: (packsData) => {
        dispatch({
          type: 'UPDATE_CURRENT_USER_PACKS',
          payload: packsData,
        })
      },
      updateUserPrograms: (currUserProgramsData) => {
        dispatch({
          type: 'UPDATE_CURRENT_USER_PROGRAMS',
          payload: currUserProgramsData,
        })
      },
      updateUserServices: (currUserServicesData) => {
        dispatch({
          type: 'UPDATE_CURRENT_USER_SERVICES',
          payload: currUserServicesData,
        })
      },
      updateLupaWorkouts: (lupaWorkoutsData) => {
        dispatch({
          type: 'UPDATE_LUPA_WORKOUTS',
          payload: lupaWorkoutsData,
        })
      },
      updateLupaAssessments: (lupaAssessmentData) => {
        dispatch({
          type: 'UPDATE_LUPA_ASSESSMENTS',
          payload: lupaAssessmentData
        })
      }
    }
  }

  function getInputContainerValidationStyle(state) {
    if (state)
    {
      //problem with field
     return { borderBottomColor: '#e53935'}
    }
    else
    {
      //no problem with field
      return { borderBottomColor: "rgb(209, 209, 214)" }
    }
  }

  function SignUpLoadingModal(props) {
    const { isLoading } = props;
    return (
      <Modal visible={isLoading} presentationStyle="fullScreen" style={{backgroundColor: '#FFFFFF'}}>
        <View style={{flex: 1, backgroundColor: '#F2F2F2'}}>
           <View style={{backgroundColor: '#F2F2F2', alignItems: 'center', justifyContent: 'space-evenly', height: '80%', width: '100%'}}>
           <Text style={{fontSize: 20, fontFamily: 'ARSMaquettePro-Regular'}}>
              Setting up your account...
           </Text>
           <ActivityIndicator color="#1565C0" animating={true} size='large' />
        </View>
        </View>
      </Modal>
    )
  }

const INPUT_PLACEHOLDER_COLOR = "rgb(99, 99, 102)"
class SignupModal extends React.Component {

    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
        this.scrollView = React.createRef();
        this.userAuthenticationHandler = new UserAuthenticationHandler();

        this.state = {
          username: "",
            email: "",
            password: "",
            confirmedPassword: "",
            isTrainerAccount: false,
            agreedToTerms: false,
            isRegistered: false,
            passwordSecureTextEntry: true,
            confirmPasswordSecureTextEntry: true,
            alertOverlayVisible: false,
            buttonYes: false,
            buttonNo: true,
            birthdayMonth: "",
            birthdayDay: "",
            birthdayYear: "",
            showSnack: false,
            usernameProblem: false,
            emailProblem: false,
            passwordProblem: false,
            confirmedPasswordProblem: false,
            birthdayProblem: false,
            termsProblem: false,
            generalRegistrationProblem: false,
            registeringUser: false,
            signupRejectionReason: "",
            rejectedField: "",
            loading: false,
        }
    }

  _introduceApp = async () => {
    await this._setupRedux();
    this.props.navigation.navigate('App');
  }

  _setupRedux = async () => {
    let currUserData, currUserPacks, currUserPrograms, lupaWorkouts = [], lupaAssessments = [];
    await this.LUPA_CONTROLLER_INSTANCE.getCurrentUserData().then(result => {
      currUserData = result;
    })

    await this.LUPA_CONTROLLER_INSTANCE.getCurrentUserPacks().then(result => {
      currUserPacks = result;
    })

    await this.LUPA_CONTROLLER_INSTANCE.loadCurrentUserPrograms().then(result => {
      currUserPrograms = result;
    })

    lupaWorkouts = await this.LUPA_CONTROLLER_INSTANCE.loadWorkouts()

    lupaAssessments = await this.LUPA_CONTROLLER_INSTANCE.loadAssessments()

    const userPayload = {
      userData: currUserData,
      healthData: {}
    }

    await this._updateUserInRedux(userPayload);
    await this._updatePacksInRedux(currUserPacks);
    await this._updateUserProgramsDataInRedux(currUserPrograms);
    await this._updateLupaWorkoutsDataInRedux(lupaWorkouts);
    await this._updateLupaAssessmentDataInRedux(lupaAssessments);
  }

  _updateUserInRedux = (userObject) => {
    this.props.updateUser(userObject);
  }
  _updatePacksInRedux = (packsData) => {
    this.props.updatePacks(packsData);
  }
  _updateUserHealthDataInRedux = (healthData) => {
    this.props.updateHealthData(healthData);
  }
  _updateUserProgramsDataInRedux = (programsData) => {
    this.props.updateUserPrograms(programsData);
  }
  _updateUserServicesInRedux = (servicesData) => {
    this.props.updateUserServices(servicesData);
  }
  _updateLupaWorkoutsDataInRedux = (lupaWorkoutsData) => {
    this.props.updateLupaWorkouts(lupaWorkoutsData);
  }
  _updateLupaAssessmentDataInRedux = (lupaAssessmentData) => {
    this.props.updateLupaAssessments(lupaAssessmentData);
  }


    _registerUser = async () => {
      //Reset the fields that were previously rejected because we now have a new state
      this.setState({ registeringUser: true })
      this.resetRejectedFields();
      let emptyField = false;

      const username = this.state.username.trim();
        const email = this.state.email.trim().toLowerCase();
        const password = this.state.password.trim();
        const confirmedPassword = this.state.confirmedPassword.trim();
        const isTrainerAccount = this.state.isTrainerAccount;
        const agreedToTerms = this.state.agreedToTerms;
        const month = this.state.birthdayMonth;
        const year =this.state.birthdayYear;
        const day = this.state.birthdayDay;
        const birthday = new Date(this.state.birthdayYear, this.state.birthdayMonth, this.state.birthdayDay);

        if (username == "")
        {
          this.setState({ 
            usernameProblem: true, 
          })
          emptyField = true;
        }
        
        if (email == "")
        {
          this.setState({ 
            emailProblem: true, 
          })
          emptyField = true;
        }
        
        if (password == "")
        {
          this.setState({ 
            passwordProblem: true, 
          })
          emptyField = true;
        }
        
        if (confirmedPassword == "")
        {
          this.setState({ 
            confirmedPasswordProblem: true, 
          })
          emptyField = true;
        }
        
        if (month == "" || day == "" || year == "")
        {
          this.setState({ 
            birthdayProblem: true, 
          })
          emptyField = true;
        }

        if (emptyField == true)
        {
          this.setState({
            showSnack: true, 
            signupRejectionReason: 'There are fields missing in your form.',
            registeringUser: false,
          })
          this.scrollView.current.scrollTo(0);
          return;
        }

        
        await this.setState({ loading: true })
        //Check registration status
        let successfulRegistration;
        try {
        await this.userAuthenticationHandler.signUpUser(username, email, password, confirmedPassword, birthday, agreedToTerms).then(result => {
          successfulRegistration = result;
        });
      } catch(error) {
        this.setState({ loading: false, registeringUser: false });

        const registrationStatus = {
          result: false,
          reason: "Something went wrong with your login.  The email you are trying to register with may already be in use"
        }

        successfulRegistration = registrationStatus;
      }

        await this.setState({ loading: false })

        await this.handleOnRegistration(successfulRegistration);
    }

    handleOnRegistration = async (registrationStatus) => {
      this.setState({ loading: false })
      if (registrationStatus.result)
      {
        //introduce app
        await this._introduceApp();
      }
      else
      {
        this.scrollView.current.scrollTo(0);
        await this.setState({signupRejectionReason: registrationStatus.reason, showSnack: true, registeringUser: false });
        switch(registrationStatus.field)
        {
          case 'Username':
            this.setState({ rejectedField: registrationStatus.field, usernameProblem: true })
            break;
            case 'Email':
            this.setState({ rejectedField: registrationStatus.field, emailProblem: true })
            break;
            case 'Confirmed Password':
            this.setState({ rejectedField: registrationStatus.field, confirmedPasswordProblem: true })
            break;
            case 'Password':
            this.setState({ rejectedField: registrationStatus.field, passwordProblem: true })
            break;
            case 'Birthday':
            this.setState({ rejectedField: registrationStatus.field, birthdayProblem: true })
            break;
            case 'Terms':
            this.setState({ rejectedField: registrationStatus.field, termsProblem: true })
            break;

            default: 
            this.setState({ rejectedField: "Unknown", generalRegistrationProblem: true })
        }
      }
    }

  _onToggleSnackBar = () => this.setState(state => ({ showSnack: !state.showSnack }));

  _onDismissSnackBar = () => {
    this.setState({ showSnack: false, registeringUser: false });
  }


    _handleShowPassword = () => {
        this.setState({
            passwordSecureTextEntry: !this.state.passwordSecureTextEntry
        })
      }

      _handleShowConfirmPassword = () => {
        this.setState({
            confirmPasswordSecureTextEntry: !this.state.confirmPasswordSecureTextEntry
        })
      }

      resetRejectedFields = () => {
        this.setState({
          showSnack: false,
          usernameProblem: false,
          emailProblem: false,
          passwordProblem: false,
          confirmedPasswordProblem: false,
          birthdayProblem: false,
          termsProblem: false,
        })
      }

    render() {
        return (
          <SafeAreaView style={{flex: 1, backgroundColor: '#F4F7FC'}} forceInset={{bottom: 'never'}}>
            <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
          <ScrollView ref={this.scrollView} keyboardDismissMode="interactive" keyboardShouldPersistTaps="never" showsVerticalScrollIndicator={false} shouldRasterizeIOS={true} contentContainerStyle={{backgroundColor: '#F4F7FC'}}>
            
          <View style={{width: "100%", height: Dimensions.get('window').height}}>
          <View style={styles.headerText}>
                    <Text style={{fontSize: 28, fontWeight: '700', color: 'black', fontFamily: 'ARSMaquettePro-Regular' }}>
            Create an account
                        </Text>
                        <View style={{flexDirection: 'row', marginTop: 5}}>
        <Text style={{fontSize: 13, fontWeight: '500', color: 'rgb(142, 142, 147)'}}>
          Already have an account?
        </Text>
        <Text>
          {" "}
        </Text>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
          <Text style={{fontSize: 13, fontWeight: '500', color: '#1565C0'}}>
            Sign In
          </Text>
        </TouchableOpacity>
        </View>
        </View>
                    

                    <View style={{height: "60%", width: "100%", alignItems: "center", justifyContent: "space-evenly"}}>
                    <View style={{width: '90%', margin: 5}}>
                            <Input 
                            value={this.state.username} 
                            onChangeText={text => this.setState({username: text})} 
                            placeholder="Username" 
                            placeholderTextColor={INPUT_PLACEHOLDER_COLOR}
                            autoCapitalize='none'
                            inputStyle={styles.inputStyle} 
                            inputContainerStyle={[styles.inputContainerStyle, getInputContainerValidationStyle(this.state.usernameProblem)]} 
                            containerStyle={styles.containerStyle} 
                            editable={true}
                            enablesReturnKeyAutomatically={true}
                            returnKeyLabel="Done"
                            returnKeyType="done"
                            multiline={false}
                            style={{alignSelf: "center"}}
                            leftIcon={<ThinFeatherIcon thin={false} name="user" size={15} />}
                            leftIconContainerStyle={styles.leftIconContainerStyle}
                            />
                        </View>

                    <View style={{width: '90%', margin: 5}}>
                            <Input 
                            value={this.state.email} 
                            onChangeText={text => this.setState({email: text})} 
                            placeholder="Email" 
                            placeholderTextColor={INPUT_PLACEHOLDER_COLOR}
                            autoCapitalize='none'
                            inputStyle={styles.inputStyle} 
                            inputContainerStyle={[styles.inputContainerStyle, getInputContainerValidationStyle(this.state.emailProblem)]} 
                            containerStyle={[styles.containerStyle]}
                            editable={true}
                            enablesReturnKeyAutomatically={true}
                            returnKeyLabel="Done"
                            returnKeyType="done"
                            multiline={false}
                            leftIcon={<ThinFeatherIcon thin={false} name="mail" size={15} />}
                            leftIconContainerStyle={styles.leftIconContainerStyle}
                            />
                        </View>

                    <View style={{width: '90%', margin: 5}}>
                            <Input 
                            rightIcon={<ThinFeatherIcon thin={true} name={this.state.passwordSecureTextEntry ? "eye-off" : "eye"} onPress={this._handleShowPassword} size={20}/>} 
                            value={this.state.password} 
                            onChangeText={text => this.setState({password: text})} 
                            secureTextEntry={this.state.passwordSecureTextEntry} 
                            placeholder="Password" 
                            placeholderTextColor={INPUT_PLACEHOLDER_COLOR}
                            autoCapitalize='none'
                            inputStyle={{fontWeight: '500', fontSize: 15}} 
                            inputStyle={styles.inputStyle} 
                            inputContainerStyle={[styles.inputContainerStyle, getInputContainerValidationStyle(this.state.passwordProblem)]} 
                            containerStyle={[styles.containerStyle]}
                            editable={true}
                            enablesReturnKeyAutomatically={true}
                            returnKeyLabel="Done"
                            returnKeyType="done"
                            multiline={false}
                            leftIcon={<ThinFeatherIcon thin={false} name="lock" size={15} />}
                            leftIconContainerStyle={styles.leftIconContainerStyle}
                            />
                        </View>

                        <View style={{width: '90%', margin: 5}}>

                            <Input 
                            rightIcon={<ThinFeatherIcon thin={true} name={this.state.confirmPasswordSecureTextEntry ? "eye-off" : "eye"} onPress={this._handleShowConfirmPassword} size={20} />} 
                             value={this.state.confirmedPassword} 
                             onChangeText={text => this.setState({confirmedPassword: text})} 
                             secureTextEntry={this.state.confirmPasswordSecureTextEntry} 
                             placeholder="Confirm password" 
                             placeholderTextColor={INPUT_PLACEHOLDER_COLOR}
                             autoCapitalize='none'
                             inputStyle={styles.inputStyle} 
                             inputContainerStyle={[styles.inputContainerStyle, getInputContainerValidationStyle(this.state.confirmedPasswordProblem)]} 
                             containerStyle={[styles.containerStyle]}
                             editable={true}
                             enablesReturnKeyAutomatically={true}
                             returnKeyLabel="Done"
                             rexturnKeyType="done"
                             multiline={false}
                             leftIcon={<ThinFeatherIcon thin={false} name="lock" size={15} />}
                             leftIconContainerStyle={styles.leftIconContainerStyle}
                             />
                        </View>

                        <View style={{width: '50%', backgroundColor: "transparent", margin: 10}}>
                            <Text style={styles.textLabel}>
                                Birthday
                            </Text>
                            <View style={{borderRadius: 20, width: "100%", backgroundColor: "#FAFAFA", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly"}}>
                            <Input 
                             value={this.state.birthdayMonth}
                             onChangeText={text => this.setState({ birthdayMonth: text})} 
                             placeholder="MM" 
                             placeholderTextColor="black"
                             inputStyle={{width: "100%", fontSize: 10}} 
                             inputContainerStyle={{width: "100%", borderColor: "transparent"}} 
                             containerStyle={[getInputContainerValidationStyle(this.state.birthdayProblem), { width: "20%" }]} 
                             editable={true}
                             enablesReturnKeyAutomatically={true}
                             returnKeyLabel="Hi"
                             returnKeyType="done"
                             keyboardType="numeric"
                             maxLength={2}
                             multiline={false}
                             />

<Input 
                             value={this.state.birthdayDay}
                             onChangeText={text => this.setState({ birthdayDay: text })} 
                             placeholder="DD" 
                             placeholderTextColor="black"
                             inputStyle={{width: "100%", fontSize: 10}} 
                             inputContainerStyle={{width: "100%", borderColor: "transparent"}} 
                             containerStyle={{backgroundColor: getInputContainerValidationStyle(this.state.birthdayProblem), width: "20%", }} 
                             editable={true}
                             enablesReturnKeyAutomatically={true}
                             returnKeyLabel="Hi"
                             returnKeyType="done"
                             keyboardType="numeric"
                             multiline={false}
                             maxLength={2}
                             />

<Input 
                             value={this.state.birthdayYear}
                             onChangeText={text => this.setState({ birthdayYear: text })} 
                             placeholder="YYYY" 
                             placeholderTextColor="black"
                             inputStyle={{width: "100%", fontSize: 10}} 
                             inputContainerStyle={{width: "100%", borderColor: "transparent"}} 
                             containerStyle={{backgroundColor: getInputContainerValidationStyle(this.state.birthdayProblem), width: "25%", }} 
                             editable={true}
                             enablesReturnKeyAutomatically={true}
                             returnKeyLabel="Hi"
                             returnKeyType="done"
                             keyboardType="numeric"
                             multiline={false}
                             maxLength={4}
                             />
                            </View>
                            
                        </View>
                    </View>
            
</View>
            

                       <View style={{marginTop: 15, flex: 1, justifyContent: 'flex-end', width: '90%', alignSelf: 'center'}}>
                        <ElementsButton
  title="Create Account"
  type="solid"
  raised
  style={{backgroundColor: "#1565C0", padding: 10, borderRadius: 12}}
  buttonStyle={{backgroundColor: 'transparent'}}
  containerStyle={{borderRadius: 12}}
  onPress={this._registerUser}
  disabled={this.state.registeringUser}
/>
                        </View>

                        <View style={{margin: 10}}>
                        <CheckBox
                                center
                                title='I agree to the Terms of Service and Privacy Policy.'
                                iconRight
                                iconType='material'
                                checkedIcon='done'
                                uncheckedIcon='check-box-outline-blank'
                                checkedColor='check-box'
                                containerStyle={{backgroundColor: 'transparent', padding: 15, borderColor: 'transparent'}}
                                checked={this.state.agreedToTerms }
                                onPress={() => this.setState({ agreedToTerms: !this.state.agreedToTerms })}
                            />
  
                        </View>             
          </ScrollView>
          <Snackbar
          style={{backgroundColor: '#212121'}}
          theme={{ colors: { accent: '#2196F3' }}}
          visible={this.state.showSnack}
          onDismiss={this._onDismissSnackBar}
          action={{
            label: 'Okay',
            onPress: () => this.setState({ showSnack: false, loading: false }),
          }}
        >
          {this.state.signupRejectionReason}
        </Snackbar>

        <SignUpLoadingModal isLoading={this.state.loading} />
        </KeyboardAvoidingView>
          </SafeAreaView>
        
                    
        );
    }
} 

const styles = StyleSheet.create({
    modalContainer: {
        display: "flex",
        backgroundColor: "#FAFAFA",
        margin: 0,
        alignItems: "center",
        flexDirection: "column",
        flex: 1,
    },
    headerText: {
        marginTop: 15,
        padding: 10,
        height: "20%",
        alignItems: 'center'
    },
    textLabel: {
        fontSize: 15,
        fontWeight: "600",
        color: '#424242',
        margin: 5,
        alignSelf: "flex-start",
    },
    inputStyle: {
      fontWeight: '500', 
      fontSize: 15
    },
    inputContainerStyle: {
      borderBottomWidth: 1.5,
      borderTopColor: "transparent", 
      borderRightColor: "transparent", 
      borderLeftColor: "transparent", 
      padding: 3
    },
    containerStyle: {
      width: "100%", 
      borderRadius: 20, 
      backgroundColor: 'transparent'
    },
    leftPositionedSurface: {
      left: 0,
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
      alignSelf: "flex-start",
    },
    rightPositionedSurface: {
      right: 0,
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
      alignSelf: 'flex-end'
    },
    leftIconContainerStyle: {
      margin: 5, 
      alignItems: 'flex-start'
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(SignupModal);
*/

const formReducer = (state = initialState, action) => {
  switch(action.type) {
     case 'FORM_INPUT_UPDATE':
       const updatedValues = {
         ...state.inputValues,
         [action.input]: action.value
       }
       const updatedValidities = {
         ...state.inputValidities,
         [action.input]: action.isValid
       }
       let updatedFormIsValid = true;
       for (const key in updatedValidities) {
        updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
       }
       return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
    }
    default:
      return state
  }
}

function SignUp(props) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: '',
    },
    inputValidies: {
      email: false,
      password: false,
    },
    formIsValid: false,
  })

  const signupHandler = () => {
    alert(formState.inputValues.password)
    dispatch(authActions.signup(formState.inputValues.email, formState.inputValues.password));
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

  return (
    <KeyboardAvoidingView 
    behavior="padding"
    keyboardVerticalOffset={50}
    style={styles.keyboardAvoidingView}>
      <View style={{flex: 1}}>
          <ScrollView contentContainerStyle={{justifyContent: 'space-between', flexGrow: 2}}>
          <View style={{marginTop: Constants.statusBarHeight, width: "100%"}}>
          <View style={styles.headerText}>
                    <Text style={{fontSize: 28, fontWeight: '700', color: 'black', fontFamily: 'ARSMaquettePro-Regular' }}>
            Create an account
                        </Text>
                        <View style={{flexDirection: 'row', marginTop: 5}}>
        <Text style={{fontSize: 13, fontWeight: '500', color: 'rgb(142, 142, 147)'}}>
          Already have an account?
        </Text>
        <Text>
          {" "}
        </Text>
        <TouchableOpacity>
          <Text style={{fontSize: 13, fontWeight: '500', color: '#1565C0'}}>
            Sign In
          </Text>
        </TouchableOpacity>
        </View>
        </View>
        </View>

            <Input 
              id="email" 
              label="E-Mail" 
              keyboardType="email-address" 
              required 
              email 
              autoCapitalize={false} 
              errorMessage="Please enter a valid email address" 
              onInputChange={inputChangeHandler}
              initialValue='' />
            <Input 
              id="username" 
              label="Username" 
              keyboardType="default" 
              required 
              minLength={5} 
              autoCapitalize={false} 
              errorMessage="Please enter a valid username" 
              onInputChange={inputChangeHandler}
              initialValue='' />
            <Input 
              id="password" 
              label="Password" 
              keyboardType="default" 
              secureTextEntry 
              required 
              minLength={5} 
              autoCapitalize={false} 
              errorMessage="Please enter a valid password." 
              onInputChange={inputChangeHandler}
              initialValue='' />
            <Input id="confirm-password" label="Confirm Password" keyboardType="default" secureTextEntry required minLength={5} autoCapitalize={false} errorMessage="The passwords do not match!" onValueChange={() => {}} initialValue='' />
          
            <View style={{marginTop: 15, justifyContent: 'flex-end', width: '90%', alignSelf: 'center'}}>
                        <ElementsButton
  title="Create Account"
  type="solid"
  raised
  style={{backgroundColor: "#1565C0", padding: 10, borderRadius: 12}}
  buttonStyle={{backgroundColor: 'transparent'}}
  containerStyle={{borderRadius: 12}}
  onPress={signupHandler}
  disabled={false}
/>
                        </View>

                        <View style={{margin: 10}}>
                        <CheckBox
                                center
                                title='I agree to the Terms of Service and Privacy Policy.'
                                iconRight
                                iconType='material'
                                checkedIcon='done'
                                uncheckedIcon='check-box-outline-blank'
                                checkedColor='check-box'
                                containerStyle={{backgroundColor: 'transparent', padding: 15, borderColor: 'transparent'}}
                                checked={agreedToTerms}
                                onPress={() => setAgreedToTerms(!agreedToTerms)}
                            />
  
                        </View>  
          </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1
  },
  headerText: {
    marginTop: 15,
    padding: 10,
    alignItems: 'center'
},
})

export default SignUp;