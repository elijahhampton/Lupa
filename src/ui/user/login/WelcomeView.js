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
  Image,
  StatusBar,
  SafeAreaView,
} from "react-native";

import {
  Button,
  Snackbar,
} from 'react-native-paper';
import { Constants } from "react-native-unimodules";
import loadFonts from "../../common/Font";

const {
  isSignedIn,
} = require('../../../controller/lupa/auth/auth');

const AppLogo = require('../../images/applogo.png')

class WelcomeView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      
    }

  }

  componentDidMount = async () => {
    await loadFonts();
    await this._checkSignedInStatus();

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
      <View style={styles.root}>
        <StatusBar translucent barStyle="dark-content" />
          <View style={{flex: 1, alignItems: 'flex-start', flexDirection: 'column', marginTop: 10}}>
                <Text style={{fontFamily: 'ARSMaquettePro-Black', fontSize: 35, fontWeight: '700', color: '#212121', margin: 5, }}>
                Welcome to Lupa,
                </Text>
                <Text style={{fontFamily: 'ARSMaquettePro-Black', fontSize: 30, fontWeight: '700', color: '#2196F3', margin: 5, }}>
                the fitness app for preventative healthcare
                </Text>
          </View>

          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Image source={AppLogo} style={{flex: 1, width: 150, height: 5, alignSelf: 'center'}} />
          </View>

          <View style={{flex: 1, justifyContent: 'flex-end'}}>

                <Button mode="contained" color="#2196F3" theme={{colors: {
                    text: 'white'
                }}} style={{elevation: 8, padding: 5, color: "white", borderRadius: 20,margin: 20}} onPress={this.navigateToSignUp}>
                    <Text>
                    Create an account
                    </Text>
                </Button>
                <Button mode="contained" theme={{colors: {
                    primary: "#212121"
                }}} borderless style={{elevation: 8, padding: 5, color: "#212121", borderRadius: 20, margin: 20}} onPress={this.navigateToLogin}>
                    <Text style={{color: 'white'}}>
                    I already have an account
                    </Text>
                </Button>
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "rgb(244, 247, 252)",
    padding: 15,
    justifyContent: 'space-between',
    paddingTop: Constants.statusBarHeight,
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
  },
});

export default WelcomeView;
