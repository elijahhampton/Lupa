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
  Image
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
} = require('../../../../controller/lupa/auth');


import { Pagination } from 'react-native-snap-carousel';


const AppLogo = require('../../../images/applogo.png')

class WelcomeView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      
    }

  }
s
  componentDidMount = () => {
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

  navigateToLogin = () => {
      this.props.navigation.navigate('Login');
  }

  
  navigateToSignUp = () => {
      this.props.navigation.navigate('SignUp');
  }

  render() {
    return (
      <SafeAreaView style={styles.root}>
          <View style={{flex: 2, justifyContent: "center", alignItems: "center"}}>
                <Image source={AppLogo} style={{width: '30%', height: '50%'}} />
                <View style={{alignItems: "center", justifyContent: "space-around", flex: 1}}>
                <Text style={{ textAlign: "center", fontSize: 40, fontWeight: '700', color: 'black', margin: 5}}>
                    Welcome to Lupa
                </Text>
                <Text style={{ textAlign: "center",fontSize: 25, fontWeight: '700', color: 'black', margin: 5}}>
                The fitness app for preventative health care
                </Text>
                <Text style={{fontSize: 18, fontWeight: '500', color: '#9bb6e4', margin: 5}}>
              Find trainers and friends to workout with, become a Lupa personal trainer, or simply browse workouts that fit your needs.
                </Text>
                </View>
          </View>

          <View style={{flex: 1, justifyContent: "space-evenly"}}>
                <Button mode="contained" color="#0D47A1" theme={{colors: {
                    text: 'white'
                }}} style={{elevation: 0, padding: 15, color: "white"}} onPress={this.navigateToSignUp}>
                    Sign Up
                </Button>
                <Button mode="contained" color="#42A5F5" theme={{colors: {
                    text: 'white'
                }}} style={{elevation: 0, padding: 15, color: "white"}} onPress={this.navigateToLogin}>
                    Login
                </Button>
          </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "rgb(244, 247, 252)",
    padding: 15,
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

export default WelcomeView;
