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

import Background from "./images/login_background3.jpg";
import Logo from "../../../images/temp-logo.png";

import { SocialIcon, Input } from "react-native-elements";

import SignUpModal from "../../Modals/SignupModal";

import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

import LupaController from '../../../../controller/lupa/LupaController.ts';


let LUPA_CONTROLLER_INSTANCE;
class LoginView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: 'elijahhampton',
      password: 'Hamptonej1!',
      snackBarIsVisible: false,
      isSignupModalVisible: true,

    }
  }

  componentDidMount = () => {
    LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
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
   */
  _introduceApp = () => {
    this.props.navigation.navigate('App');
  }

  _launchSignupModal = () => {
    this.setState({
      isSignupModalVisible: true,
    })
  }

  render() {
    const usernameValue = this.state.username;
    const passwordValue = this.state.password;
    return (
      <ImageBackground source={Background} style={styles.root}>
        <SafeAreaView style={{flex: 1, }}>

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
            <TouchableOpacity style={styles.touchableOpacity} onPress={this.onLogin} >
              <Surface style={styles.loginButton}>
                <LinearGradient style={styles.gradient} colors={['#1E88E5', '#42A5F5']} start={[0.1, 0]} end={[1, 0]}>
                  <Feather name="arrow-right" size={20} color="white" />
                </LinearGradient>
              </Surface>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.socialView}>

          <SocialIcon type="facebook" raised button light />
          <SocialIcon type="instagram" raised button light />

          <View style={{padding: 20}}>
          <Text style={{ alignSelf: "center", fontSize: 20, fontWeight: "600", color: "white"}}>
            Don't have an account?
          </Text>
          <Text>
            { " "}
          </Text>
          <Text style={{ alignSelf: "center", fontSize: 20, fontWeight: "bold", color: "white"}}>
            Sign up
          </Text>
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
    height: "50%",
    width: "80%",
    alignSelf: "center",
    //margin: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  loginView: {
    flex: 2,
    width: "100%",
    justifyContent: "flex-end"
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
  touchableOpacity: {
    position: "absolute",
    borderRadius: 25,
    top: 221,
    width: "85%",
    height: "18%",
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
