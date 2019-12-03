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
  TextInput,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  SafeAreaView,
  Dimensions
} from "react-native";

import {
  Button,
  Divider,
  Snackbar,
  Surface
} from 'react-native-paper';

import {
  storeAsyncData
} from '../../../../controller/lupa/storage/async';

import Background from "./images/login_background3.jpg";
import Logo from "../../../images/temp-logo.png";

import { SocialIcon, Input } from "react-native-elements";

import SignUpModal from "../../Modals/SignupModal";

import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

import LupaController from '../../../../controller/lupa/LupaController.ts';

const { isSignedIn } = require('../../../../controller/lupa/auth');

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
    }
  }

  componentDidMount = () => {
  LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
   this._checkSignedInStatus();
  }

  _checkSignedInStatus = () => {
    isSignedIn().then(res => {
      this.setState({
        signedIn: res,
        checkedSignedIn: true
      })
    })

    if (this.state.signedIn == true) { this._introduceApp }
  }

  onLogin = async (e) => {
    e.persist();

    let successfulLogin;

    const attemptedUsername = this.state.username;
    const attemptedPassword = this.state.password;

    await LUPA_CONTROLLER_INSTANCE.loginUser(attemptedUsername, attemptedPassword).then((value) => {
      successfulLogin = value;
    });

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
  _introduceApp = (username, password) => {
    storeAsyncData('lupaUSER_' + username, 'lupaPASS_' + password)
    this.props.navigation.navigate('App');
  }

  render() {
    const usernameValue = this.state.username;
    const passwordValue = this.state.password;
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
              inputContainerStyle={styles.inputContainerStyle}
              containerStyle={styles.containerStyle}
              rightIcon={<Feather name="eye" />}
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

          <SocialIcon type="facebook" raised button light />
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
