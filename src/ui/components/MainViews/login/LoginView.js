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
  TouchableWithoutFeedback
} from "react-native";

import {
  Button,
  Divider,
  Snackbar
} from 'react-native-paper';

import Background from "../../../images/temp-background-2.jpg";
import Logo from "../../../images/temp-logo.png";

import axios from 'axios';

import API_ENDPOINT, { AXIOS_HEADERS } from '../../../../api/controller/axios/constants';
import { SocialIcon } from "react-native-elements";

import SigupModal from '../../Modals/SignupModal';
import SignupModal from "../../Modals/SignupModal";

class LoginView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      snackBarIsVisible: false,
      isSignupModalVisible: false,
    }

  }

  onLogin = async (e) => {
    e.preventDefault();
/*
    const {attemptedUserName, attemptedPassword} = this.state;
    console.log(attemptedUserName);
    console.log(attemptedPassword);

    await axios.get(API_ENDPOINT + "users/", {
      headers: AXIOS_HEADERS,
      params: {
        username: this.state.username,
      }
    })
      .then(user => {
        let currUser = user.data;
        console.log(currUser);
        if (currUser[0].password == this.state.password) {
          this.props.navigation.navigate('App');
        } else {
          this.setState({ snackBarIsVisible: true })
        }
      })
      .catch(err => console.log(err)); */

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
      <ImageBackground source={Background} style={styles.background}>
        <View style={styles.container}>
          <Image style={{ margin: 50, alignSelf: "center", width: 60, height: 60 }} source={Logo} />
          <View style={styles.textInputContainer}>
            <TextInput style={styles.textInput} value={usernameValue} placeholder="Username" placeholderTextColor="white" selectionColor="white" textContentType="username" onChangeText={(text) => this.setState({ username: text })} />
            <TextInput style={styles.textInput} value={passwordValue} placeholder="Password" placeholderTextColor="white" selectionColor="white" textContentType="password" onChangeText={(text) => this.setState({ password: text })} />
            <Button mode="text" color="white" onPress={this.onLogin}>
              Login
            </Button>
          </View>
          <View style={styles.dividerContainer}>
            <Divider style={styles.divider} />
            <Text style={{ color: "white" }}>
              OR
          </Text>
            <Divider style={styles.divider} />
          </View>

          <View style={styles.socialContainer}>
            <Text style={{ color: "white" }}>
              Sign in with
              </Text>
            <View style={styles.socialMediaContainer}>
              <SocialIcon type="twitter" onPress={() => alert('Login with Twitter')} />
              <SocialIcon type="google"  onPress={() => alert('Login with Google')}/>
              <SocialIcon type="facebook" onPress={() => alert('Login with Facebook')}/>
            </View>
          </View>

          <Text style={styles.termsText}>
            By using the Lupa Platform, you agree with our
            <Text style={{ fontWeight: "bold" }}>
              Terms and Conditions.
            </Text>
          </Text>

          <View style={styles.bottomText}>
            <Text style={{ flex: 1, color: "white" }}>
              Visit Lupa.org
              </Text>
            <View>

            </View>
            <Text style={{ flex: 1, color: "white" }}>
              Don't have an account?
              </Text>
              <TouchableWithoutFeedback onPress={() => {this._launchSignupModal}}>
              <Text style={{ flex: 1, color: "white", fontWeight: "bold" }}>
                Sign up
              </Text>
              </TouchableWithoutFeedback>
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

        </View>
        <SignupModal isVisible={this.state.isSignupModalVisible}/>
      </ImageBackground>
    );
  }
}


const styles = StyleSheet.create({
  background: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(33, 31, 35, 0.8)",
  },
  textInput: {
    width: "85%",
    borderBottomWidth: 1,
    borderBottomColor: "white",
    margin: 15
  },
  textInputContainer: {
    display: 'flex',
    margin: 30,
    alignItems: "center",
  },
  dividerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    margin: 20,
  },
  divider: {
    color: "white",
    backgroundColor: "white",
    width: "40%",
  },
  socialContainer: {
    width: "100%",
    alignItems: "center"
  },
  socialMediaContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 50,
  },
  icon: {
    width: 25,
    height: 25,
    margin: 15
  },
  iconContainer: {
    borderWidth: 1,
    borderColor: "white",
    margin: 5,
    borderRadius: 10
  },
  bottomText: {
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    bottom: 0,
    color: "white",
  },
  termsText: {
    color: "white",
    textAlign: "center",
  }
});

export default LoginView;
