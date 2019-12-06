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
  SafeAreaView,
} from "react-native";

import {
  Button,
  Snackbar,
} from 'react-native-paper';

import Background from "./images/login_background3.jpg";
import { SocialIcon, Input } from "react-native-elements";

import { Feather } from "@expo/vector-icons";

import LupaController from '../../../../controller/lupa/LupaController.ts';

const { 
  isSignedIn,
  loginUser
} = require('../../../../controller/lupa/auth');

let LUPA_CONTROLLER_INSTANCE;
class LoginView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: 'elijahhampton',
      password: 'Hamptonej1!',
      signedIn: false,
      checkedSignedIn: false,
      snackBarIsVisible: false,
      secureTextEntry: true,
    }

    this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
  }

  componentDidMount = () => {
   this._checkSignedInStatus();
  }

  _checkSignedInStatus = () => {
    isSignedIn().then(res => {
      this.setState({
        signedIn: res,
        checkedSignedIn: true
      })
    })

    if (this.state.signedIn == true) { this._introduceApp() }
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

   // let successfulLogin = loginUser(attemptedUsername, attemptedPassword);

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
   // this.LUPA_CONTROLLER_INSTANCE.indexApplicationData();
    this.props.navigation.navigate('App');
  }

  render() {
    return (
      <ImageBackground source={Background} style={styles.root}>
        <SafeAreaView style={{flex: 1, display: "flex"}}>

          <View style={styles.iconView}>

          </View>

        <View style={styles.loginView}>
          <View style={styles.surface}>
            <Input placeholder="Enter your username"
              placeholderTextColor="black" label="Username"
              labelStyle={styles.labelStyle}
              inputStyle={styles.inputStyle}
              inputContainerStyle={styles.inputContainerStyle}
              containerStyle={styles.containerStyle}
              textContentType="username"
              onChangeText={text => this.setState({ username: text })}
              value={this.state.username} />
            <Input placeholder="Enter your password"
              placeholderTextColor="black"
              label="Password"
              labelStyle={styles.labelStyle}
              inputStyle={styles.inputStyle}
              secureTextEntry={this.state.secureTextEntry}
              inputContainerStyle={styles.inputContainerStyle}
              containerStyle={styles.containerStyle}
              rightIcon={<Feather name="eye" onPress={this._handleShowPassword} />}
              textContentType="password"
              onChangeText={text => this.setState({ password: text})}
              value={this.state.password} />
            <Button mode="text" style={{ alignSelf: "flex-start" }} color="#2196F3">
              Forgot Password
          </Button>
            <Button onPress={this.onLogin} mode="contained" color="#2196F3" style={{width: "60%", marginTop: 10}}>
              Login
            </Button>
          </View>
        </View>

        <View style={styles.socialView}>

          <SocialIcon type="twitter" raised button light />
          <SocialIcon type="instagram" raised button light />

          <View style={{padding: 20, flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
          <Text style={{ alignSelf: "center", fontSize: 20, fontWeight: "600", color: "white"}}>
            Don't have an account?
          </Text>
          <Text>
            { " "}
          </Text>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp')}>
          <Text style={{ alignSelf: "center", fontSize: 20, fontWeight: "900", color: "white"}}>
            Sign up
          </Text>
          </TouchableOpacity>
        </View>
        </View>


        <Snackbar
          visible={this.state.snackBarIsVisible}
          onDismiss={() => this.setState({ snackBarIsVisible: false })}
          action={{
            label: 'Okay',
            onPress: () => { this.setState({ snackBarIsVisible: false }) },
          }}
        >
          The username or password you provided was incorrect.
</Snackbar>
      
        </SafeAreaView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  surface: {
    //elevation: 10,
    backgroundColor: "rgba(250,250,250 ,0.8)",
    borderRadius: 15,
    height: "80%",
    width: "80%",
    //margin: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  loginView: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  gradient: {
    borderRadius: 19,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",

  },
  loginText: {
    fontSize: 17,
    fontWeight: "600"
  },
  iconView: {
    flex: 1,
  },
  loginButton: {
    borderRadius: 25,
    alignSelf: "center",
    width: "100%",
    height: "100%",
  },
  socialView: {
    flex: 1,
    padding: 10,
    width: "100%",
    justifyContent: "center"
  },
  labelStyle: {
    color: "black",
    fontSize: 12
  },
  inputContainerStyle: {
    borderBottomWidth: 0.5,
    borderBottomColor: "black",
  },
  inputStyle: {
    fontSize: 15,
    fontWeight: "600"
  },
  containerStyle: {
    padding: 10
  }
});

export default LoginView;
