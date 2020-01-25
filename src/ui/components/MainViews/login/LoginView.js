/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  16, 2019
 * 
 * Login View
 */
import React, { Component } from "react";

import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

import {
  Button,
  Snackbar,
} from 'react-native-paper';

import SafeAreaView from 'react-native-safe-area-view';

import Background from "./images/login_background3.jpg";
import { SocialIcon, Input } from "react-native-elements";

import { Feather as FeatherIcon } from '@expo/vector-icons';

const {
  isSignedIn,
  loginUser,
} = require('../../../../controller/lupa/auth');

class LoginView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: 'ejh0017@gmail.com',
      password: 'password',
      checkedSignedIn: false,
      snackBarIsVisible: false,
      secureTextEntry: true,
    }

  }

  componentWillMount = () => {
    this._checkSignedInStatus();
  }

  _checkSignedInStatus = async () => {
    let result;
    let signedInStatus = isSignedIn().then(res => {
      result = res;
    });

    this.setState({
      isSignedIn: result
    })

    this.setState({
      checkedSignedIn: true,
    });

    if (signedInStatus == true) { await this._introduceApp() }
  }

  _handleShowPassword = () => {
    this.setState({
      secureTextEntry: !this.state.secureTextEntry
    })
  }

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
   * Finish any last minute things here before showing the application to the user.
   * This really isn't the place to be doing this, but any small last minute changes can go here.
   */
  _introduceApp = () => {
    this.props.navigation.navigate('App');
  }

  render() {
    return (
      <SafeAreaView style={{ padding: 15, flex: 1, backgroundColor: 'rgb(244, 247, 252)'}}>
        <View style={{flex: 1, justifyContent: 'space-evenly'}}>
        <View style={styles.headerText}>
          <Text style={{ fontSize: 35, fontWeight: '700', color: 'black' }}>
            Welcome to Lupa,
                        </Text>
                        <Text style={{ fontSize: 35, fontWeight: '700', color: '#9bb6e4'}}>
                          sign in to continue
                        </Text>
                        <View style={{flexDirection: 'row', marginTop: 5}}>
        <Text style={{fontSize: 17, fontWeight: '500', color: "black"}}>
          Don't have an account?
        </Text>
        <Text>
          {" "}
        </Text>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp')}>
          <Text style={{fontSize: 17, fontWeight: '500', color: '#2196F3'}}>
            Sign up
          </Text>
        </TouchableOpacity>
</View>

        </View>

        <View style={{ flex: 4, justifyContent: 'space-evenly' }}>
          <View>
          <View style={{ width: '100%', margin: 5 }}>
            <Text style={styles.textLabel}>
              Email
                            </Text>
            <Input placeholder="Enter an email address" inputStyle={{ fontWeight: '500', fontSize: 15 }} inputContainerStyle={{ borderBottomColor: 'transparent', padding: 8 }} containerStyle={{ width: '100%', borderRadius: 5, backgroundColor: 'white' }} value={this.state.username} onChangeText={text => this.setState({username: text})}/>
          </View>

          <View style={{ width: '100%', margin: 5 }}>
            <Text style={styles.textLabel}>
              Password
                            </Text>
            <Input rightIcon={<FeatherIcon name="eye" />} placeholder="Enter a password" inputStyle={{ fontWeight: '500', fontSize: 15 }} inputContainerStyle={{ borderBottomColor: 'transparent', padding: 8 }} containerStyle={{ width: '100%', borderRadius: 5, backgroundColor: 'white' }} value={this.state.password} onChangeText={text => this.setState({password: text})} />
          </View>
          </View>

          <Button mode="contained" color="#2196F3" style={{ elevation: 0,padding: 10}} onPress={this.onLogin}>
                            Login
                        </Button>

        </View>

        <View style={{ flex: 2 }}>
          <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: '400' }}>
            or sign in with
      </Text>

          <SocialIcon type="facebook" button light />

          <SocialIcon type="google" button light />
        </View>


                
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
  },
});

export default LoginView;
