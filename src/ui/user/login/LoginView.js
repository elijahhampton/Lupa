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
  Snackbar
} from 'react-native-paper';

import {
  Input, 
  Button as ElementsButton 
} from "react-native-elements";

import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

import LupaController from '../../../controller/lupa/LupaController';
import { UserAuthenticationHandler } from "../../../controller/firebase/firebase";
import { ScrollView } from "react-native-gesture-handler";


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
      secureTextEntry: true,
      showSnack: false,
      loginRejectReason: "",

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
      secureTextEntry: !this.state.secureTextEntry
    })
  }

  /**
   * Handles user authentication once the user presses the login button.
   */
  onLogin = async (e) => {
    e.preventDefault();

    const attemptedUsername = this.state.username;
    const attemptedPassword = this.state.password;

    let successfulLogin;
    await this.userAuthenticationHandler.loginUser(attemptedUsername, attemptedPassword).then(result => {
      successfulLogin = result;
    })

    if (successfulLogin) {
      this._introduceApp();
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
    await this.LUPA_CONTROLLER_INSTANCE.indexApplicationData();
    this.props.navigation.navigate('App');
  }

  /**
   * Sets up redux by loading the current user's data, packs, and programs
   * as well as Lupa application data (assessments, workouts);
   */
  _setupRedux = async () => {
    let currUserData, currUserPacks, currUserHealthData, currUserPrograms, currUserServices, lupaWorkouts;
    await this.LUPA_CONTROLLER_INSTANCE.getCurrentUserData().then(result => {
      currUserData = result;
    })

    await this.LUPA_CONTROLLER_INSTANCE.getCurrentUserPacks().then(result => {
      currUserPacks = result;
    })


    await this.LUPA_CONTROLLER_INSTANCE.loadCurrentUserPrograms().then(result => {
      currUserPrograms = result;
    })

    await this.LUPA_CONTROLLER_INSTANCE.loadWorkouts().then(result => {
      lupaWorkouts = result;
    });

    await this.LUPA_CONTROLLER_INSTANCE.loadAssessments().then(result => {
      lupaAssessments = result;
    })

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
      <SafeAreaView style={{ padding: 15, flex: 1, backgroundColor: 'rgb(244, 247, 252)', justifyContent: 'space-between' }}>
       <KeyboardAvoidingView behavior="padding" style={{flex: 1, backgroundColor: 'transparent'}}>
        <ScrollView contentContainerStyle={{flex: 1, justifyContent: 'space-between'}} keyboardDismissMode="interactive" keyboardShouldPersistTaps="never" showsVerticalScrollIndicator={false} shouldRasterizeIOS={true}>
        <View style={styles.headerText}>
          <Text style={styles.welcomeBackText}>
            Welcome back,
                        </Text>
          <Text style={styles.signInText}>
            sign in to continue
                        </Text>
          <View style={styles.noAccountTextContainer}>
            <Text style={{ fontSize: 17, fontWeight: '500', color: "black" }}>
              Don't have an account?
        </Text>
            <Text>
              {" "}
            </Text>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp')}>
              <Text style={{ fontSize: 17, fontWeight: '500', color: '#2196F3' }}>
                Sign up
          </Text>
            </TouchableOpacity>
          </View>

        </View>

        <View style={{ flex: 1, justifyContent: 'space-evenly', }}>
          <View style={{ width: '100%', margin: 5 }}>
            <Text style={styles.textLabel}>
              Email
                            </Text>
              <Input 
              placeholder="Enter an email address" 
              inputStyle={styles.inputStyle} 
              inputContainerStyle={{ borderBottomColor: '#545454', borderTopColor: "transparent", borderRightColor: "transparent", borderLeftColor: "transparent", borderBottomWidth: 2, padding: 0 }} 
              containerStyle={{ width: Dimensions.get('screen').width, borderRadius: 5, backgroundColor: 'transparent' }} 
              value={this.state.username} 
              editable={true}
              onChangeText={text => this.setState({username: text})}
              returnKeyType="default"
              keyboardType="default"
              />
          </View>

          <View style={{ width: '100%', margin: 5 }}>
            <Text style={styles.textLabel}>
              Password
                            </Text>

             <Input 
             placeholder="Enter a password" 
             inputStyle={styles.inputStyle} 
             inputContainerStyle={{ borderBottomColor: '#545454', borderTopColor: "transparent", borderRightColor: "transparent", borderLeftColor: "transparent", borderBottomWidth: 2, padding: 0 }} 
             containerStyle={{ width: '100%', borderRadius: 5, backgroundColor: 'transparent'  }} 
             containerStyle={{ width: Dimensions.get('screen').width, borderRadius: 5}} 
             value={this.state.password} 
             editable={true}
             onChangeText={text => this.setState({password: text})}
             returnKeyType="default"
             keyboardType="default"
              />
          </View>
          </View>





          <View style={{ alignSelf: 'center', width: '90%', flex: 1, justifyContent: 'center' }}>
          <ElementsButton
  title="Login"
  type="solid"
  raised
  style={{backgroundColor: "#2196F3", padding: 10, borderRadius: 12}}
  buttonStyle={{backgroundColor: 'transparent'}}
  onPress={this.onLogin}
  containerStyle={{borderRadius: 12}}
/>

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
          </View>
          </ScrollView>
          </KeyboardAvoidingView>
      </SafeAreaView>
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
          marginTop: 15,
    padding: 10,
    flex: 1,
  },
  welcomeBackText: {
    fontSize: 35, fontWeight: '700', color: 'black', fontFamily: 'ARSMaquettePro-Regular'
  },
  signInText: {
    fontSize: 35, fontWeight: '700', color: '#2196F3', fontFamily: 'ARSMaquettePro-Regular'
  },
  noAccountTextContainer: {
    flexDirection: 'row', marginTop: 5
  },
  inputStyle: {
    fontWeight: '500', fontSize: 15
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(LoginView));
