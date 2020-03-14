/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  16, 2019
 * 
 * Login View
 */
import React, { Component } from "react";

import { connect } from 'react-redux';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import SafeAreaView from 'react-native-safe-area-view';
import {Input, Button as ElementsButton } from "react-native-elements";
import LupaController from '../../../controller/lupa/LupaController';

const {
  loginUser,
} = require('../../../controller/lupa/auth/auth');

/**
 * 
 */
mapStateToProps = (state) => {
  return {
    lupa_data: state
  }
}

/**
 * 
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
    }
  }
}

/**
 * 
 */
class LoginView extends Component {
  constructor(props) {
    super(props);

    this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    this.state = {
      username: '',
      password: '',
      snackBarIsVisible: false,
      secureTextEntry: true,
    }

  }

  /**
   * 
   */
  _updateUserInRedux = (userObject) => {
    this.props.updateUser(userObject);
  }

  /**
   * 
   */
  _updatePacksInRedux = (packsData) => {
    this.props.updatePacks(packsData);
  }

  /**
   * 
   */
  _updateUserHealthDataInRedux = (healthData) => {
    this.props.updateHealthData(healthData);
  }

  /**
   * 
   */
  _handleShowPassword = () => {
    this.setState({
      secureTextEntry: !this.state.secureTextEntry
    })
  }

  /**
   * 
   */
  onLogin = async (e) => {
    e.preventDefault();

    const attemptedUsername = this.state.username;
    const attemptedPassword = this.state.password;

    let successfulLogin = await loginUser(attemptedUsername, attemptedPassword);

    if (successfulLogin) {
      this._introduceApp();
    } else {
      this.setState({
        snackBarIsVisible: true,
      })
    }
  }

  /**
   * Introduce the application
   */
  _introduceApp = async () => {
    this.props.navigation.navigate('App', {
      _setupRedux: this._setupRedux.bind(this)
    });
  }

  /**
   * 
   */
  _setupRedux = async () => {
    let currUserData, currUserPacks, currUserHealthData;
    await this.LUPA_CONTROLLER_INSTANCE.getCurrentUserData().then(result => {
      currUserData = result;
    })

    await this.LUPA_CONTROLLER_INSTANCE.getCurrentUserPacks().then(result => {
      currUserPacks = result;
    })

    await this.LUPA_CONTROLLER_INSTANCE.getCurrentUserHealthData().then(result => {
      currUserHealthData = result;
    });


    let userPayload = {
      userData: currUserData,
      healthData: currUserHealthData,
    }

    await this._updatePacksInRedux(currUserPacks);
    await this._updateUserInRedux(userPayload);
  }

  render() {
    return (
      <SafeAreaView style={{ padding: 15, flex: 1, backgroundColor: 'rgb(244, 247, 252)', justifyContent: 'space-between' }}>
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





          <View style={{ flex: 1, justifyContent: 'center' }}>
          <ElementsButton
  title="Login"
  type="solid"
  raised
  style={{backgroundColor: "#2196F3", padding: 10, borderRadius: 12}}
  buttonStyle={{backgroundColor: 'transparent'}}
  onPress={this.onLogin}
  containerStyle={{borderRadius: 12}}
/>
          </View>
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
    fontWeight: '600',
    color: '#424242',
    margin: 5
  },
  headerText: {
          marginTop: 15,
    padding: 10,
    flex: 1,
  },
  welcomeBackText: {
    fontSize: 35, fontWeight: '700', color: 'black'
  },
  signInText: {
    fontSize: 35, fontWeight: '700', color: '#2196F3'
  },
  noAccountTextContainer: {
    flexDirection: 'row', marginTop: 5
  },
  inputStyle: {
    fontWeight: '500', fontSize: 15
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginView);
