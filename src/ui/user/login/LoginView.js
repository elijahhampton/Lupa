/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  16, 2019
 * 
 * Login View
 */
import React from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView
} from "react-native";

import {
  Snackbar,
  Divider
} from 'react-native-paper';

import {
  Input, 
  Button as ElementsButton 
} from "react-native-elements";

import { connect } from 'react-redux';

import LupaController from '../../../controller/lupa/LupaController';
import { UserAuthenticationHandler } from "../../../controller/firebase/firebase";
import { ScrollView } from "react-native-gesture-handler";

import ThinFeatherIcon from "react-native-feather1s";
import { storeAsyncData, retrieveAsyncData } from "../../../controller/lupa/storage/async";
import { LOG_ERROR } from "../../../common/Logger";
import { getLupaUserStructure } from "../../../controller/firebase/collection_structures";
import { Constants } from "react-native-unimodules";
/**
 * Maps the redux state to props.
 */
mapStateToProps = (state, action) => {
  return {
    lupa_data: state
  }
}

/**
 * Allows redux actions to be emitted through props.
 */
mapDispatchToProps = dispatch => {
  return {
    updateUser: (currUserData) => {
      dispatch({
        type: 'UPDATE_CURRENT_USER',
        payload: currUserData
      })
    },
    updatePacks: (currUserPacksData) => {
      dispatch({
        type: 'UPDATE_CURRENT_USER_PACKS',
        payload: currUserPacksData,
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

const INPUT_PLACEHOLDER_COLOR = "rgb(99, 99, 102)"

/**
 * The LoginView class contains the view the user sees upong logging on.
 */
class LoginView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    this.userAuthenticationHandler = new UserAuthenticationHandler();

    this.state = {
      username: '',
      password: '',
      securePasswordEntry: true,
      showSnack: false,
      loginRejectReason: "",

    }

  }

  componentDidMount = async () => {
    try {
      await retrieveAsyncData('PREVIOUS_LOGIN_EMAIL').then(res => {
        this.setState({ username: res })
      });

      await retrieveAsyncData('PREVIOUS_LOGIN_PASSWORD').then(res => {
        this.setState({ password: res})
      });
    } catch(error) {
      LOG_ERROR('LoginView.js', 'Unhandled error in LoginView.js componentDidMount', error);
    }
  }

  /**
   * DISPATCHES PAYLOAD INTO REDUX ONLOGIN CONTAINING USER INFORMATION AND LUPA DATA 
   */
  _updateUserInRedux = (userObject) => {
    this.props.updateUser(userObject);
  }
  _updatePacksInRedux = (packsData) => {
    this.props.updatePacks(packsData);
  }
  _updateUserProgramsDataInRedux = (programsData) => {
    this.props.updateUserPrograms(programsData);
  }
  _updateLupaWorkoutsDataInRedux = (lupaWorkoutsData) => {
    this.props.updateLupaWorkouts(lupaWorkoutsData);
  }
  _updateLupaAssessmentDataInRedux = (lupaAssessmentData) => {
    this.props.updateLupaAssessments(lupaAssessmentData);
  }
  _handleShowPassword = () => {
    this.setState({
      securePasswordEntry: !this.state.securePasswordEntry
    })
  }

  /**
   * Handles user authentication once the user presses the login button.
   */
  onLogin = async (e) => {
    e.preventDefault();

    const attemptedUsername = this.state.username;
    const attemptedPassword = this.state.password;
    console.log(attemptedUsername +  "  " + attemptedPassword)

    let successfulLogin = false;
    await this.userAuthenticationHandler.loginUser(attemptedUsername, attemptedPassword).then(result => {
      successfulLogin = result;
    })

    alert(successfulLogin)

    if (successfulLogin) {
      this._introduceApp();
      storeAsyncData('PREVIOUS_LOGIN_EMAIL', attemptedUsername);
      storeAsyncData('PREVIOUS_LOGIN_PASSWORD', attemptedPassword);
    } else {
      this.setState({
        loginRejectReason: 'Invalid Username or Password.  Try again.',
        showSnack: true
      })
    }
  }

  /**
   * Introduce the application by setting up redux, indexing the application, 
   * and navigating the user into the application.
   */
  _introduceApp = async () => {
    await this._setupRedux();
    this.LUPA_CONTROLLER_INSTANCE.indexApplicationData();
    this.props.navigation.navigate('App');
  }

  /**
   * Sets up redux by loading the current user's data, packs, and programs
   * as well as Lupa application data (assessments, workouts);
   */
  _setupRedux = async () => {
    let currUserData = getLupaUserStructure(), currUserPacks = [], currUserPrograms = [], lupaAssessments = [], lupaWorkouts = [];
    await this.LUPA_CONTROLLER_INSTANCE.getCurrentUserData().then(result => {
      currUserData = result;
    })

    await this.LUPA_CONTROLLER_INSTANCE.getCurrentUserPacks().then(result => {
      currUserPacks = result;
    })


    await this.LUPA_CONTROLLER_INSTANCE.loadCurrentUserPrograms().then(result => {
      currUserPrograms = result;
    })

    lupaWorkouts = await this.LUPA_CONTROLLER_INSTANCE.loadWorkouts();

    lupaAssessments = await this.LUPA_CONTROLLER_INSTANCE.loadAssessments();

    let userPayload = {
      userData: currUserData,
      healthData: {}
    }

    await this._updatePacksInRedux(currUserPacks);
    await this._updateUserInRedux(userPayload);
    await this._updateUserProgramsDataInRedux(currUserPrograms);
    await this._updateLupaWorkoutsDataInRedux(lupaWorkouts);
    await this._updateLupaAssessmentDataInRedux(lupaAssessments);
  }

  /**
   * Handle toggling the visibility of the snackbar.
   */
  _onToggleSnackBar = () => this.setState(state => ({ showSnack: !state.showSnack }));

  /**
   * Emits a set state action when the snackbar is dismissed.
   */
  _onDismissSnackBar = () => {
    this.setState({ showSnack: false });
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'space-between' }}>
       <KeyboardAvoidingView behavior="padding" style={{flex: 1 ,backgroundColor: 'transparent'}}>
        <View style={{flex: 1, justifyContent: 'space-between'}} keyboardDismissMode="interactive" keyboardShouldPersistTaps="never" showsVerticalScrollIndicator={false} shouldRasterizeIOS={true}>
        <View style={styles.headerText}>
          <Text style={styles.welcomeBackText}>
            Welcome back,
                        </Text>
          <Text style={styles.signInText}>
            sign in to continue
                        </Text>
          <View style={styles.noAccountTextContainer}>
            <Text style={{ fontSize: 13, fontWeight: '500', color: 'rgb(142, 142, 147)' }}>
              Don't have an account?
        </Text>
            <Text>
              {" "}
            </Text>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp')}>
              <Text style={{ fontSize: 13, fontWeight: '500', color: '#1565C0' }}>
                Sign up
          </Text>
            </TouchableOpacity>
          </View>

        </View>

        <View style={{ flex: 1, justifyContent: 'flex-start', marginVertical: 20 }}>
          <View style={{ width: '100%', margin: 5 }}>
              <Input 
              placeholder="Enter an email address" 
              placeholderTextColor={INPUT_PLACEHOLDER_COLOR}
              autoCapitalize='none'
              inputStyle={styles.inputStyle} 
              inputContainerStyle={{ borderBottomColor: "rgb(209, 209, 214)", borderTopColor: "transparent", borderRightColor: "transparent", borderLeftColor: "transparent", borderBottomWidth: 2, padding: 0 }} 
              containerStyle={{ marginVertical: 20, width: '90%', alignSelf: 'center', borderRadius: 5, backgroundColor: 'transparent'  }} 
              value={this.state.username} 
              editable={true}
              onChangeText={text => this.setState({username: text})}
              returnKeyType="default"
              keyboardType="default"
              leftIcon={<ThinFeatherIcon thin={false} name="mail" size={15} />}
              leftIconContainerStyle={styles.leftIconContainerStyle}
              />
          </View>

          <View style={{ width: '100%', margin: 5}}>

             <Input 
             placeholder="Enter a password" 
             placeholderTextColor={INPUT_PLACEHOLDER_COLOR}
             autoCapitalize='none'
             secureTextEntry={this.state.securePasswordEntry}
             inputStyle={styles.inputStyle} 
             inputContainerStyle={{ borderBottomColor: "rgb(209, 209, 214)", borderTopColor: "transparent", borderRightColor: "transparent", borderLeftColor: "transparent", borderBottomWidth: 2, padding: 0 }} 
             containerStyle={{ marginVertical: 30, width: '90%', alignSelf: 'center', borderRadius: 5, backgroundColor: 'transparent'  }} 
             value={this.state.password} 
             editable={true}
             onChangeText={text => this.setState({password: text})}
             returnKeyType='done'
             keyboardType='default'
             returnKeyLabel='done'
             rightIcon={<ThinFeatherIcon thin={true} name={this.state.securePasswordEntry ? "eye-off" : "eye"} onPress={this._handleShowPassword} size={20}/>} 
             leftIcon={<ThinFeatherIcon thin={false} name="lock" size={15} />}
              leftIconContainerStyle={styles.leftIconContainerStyle}
              />
          </View>
          </View>

          <View style={{position: 'absolute', bottom: 0, alignSelf: 'center', width: '100%', flex: 1, justifyContent: 'center' }}>
          <ElementsButton
  title="Login"
  type="solid"
  raised
  style={{backgroundColor: "#1565C0", padding: 10, borderRadius: 0}}
  buttonStyle={{backgroundColor: 'transparent'}}
  onPress={this.onLogin}
  containerStyle={{borderRadius: 12}}
/>
<Divider />
          </View>

          </View>
          </KeyboardAvoidingView>
          <Snackbar
          style={{backgroundColor: '#212121'}}
          theme={{ colors: { accent: '#2196F3' }}}
          visible={this.state.showSnack}
          onDismiss={this._onDismissSnackBar}
          action={{
            label: 'Okay',
            onPress: () => this.setState({ showSnack: false }),
          }}
        >
          {this.state.loginRejectReason}
        </Snackbar>
        
        <SafeAreaView style={{backgroundColor: '#1565C0'}} />
      </View>
    );
  }
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
    marginTop: Constants.statusBarHeight
  },
  welcomeBackText: {
    fontSize: 28, fontWeight: '700', color: 'black',  
  },
  signInText: {
    fontSize: 28, fontWeight: '700', color: '#1565C0',  
  },
  noAccountTextContainer: {
    flexDirection: 'row', marginTop: 5
  },
  inputStyle: {
    fontWeight: '400', fontSize: 15
  },
  leftIconContainerStyle: {
    margin: 5, 
    alignItems: 'flex-start'
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginView);
