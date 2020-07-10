/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  22, 2019
 * 
 * Lupa App
 */
import React from "react";

import {
  Text,
  StyleSheet,
  AsyncStorage,
  StatusBar,
  View,
  Dimensions,
} from "react-native";

import Dashboard from './ui/navigators/LupaDrawerNavigator';

import WelcomeModal from './ui/user/modal/WelcomeModal/WelcomeModal';

import LupaController from './controller/lupa/LupaController';
import PackNavigator from './ui/navigators/PackNavigator'
import ProfileNavigator from './ui/navigators/ProfileNavigator'
import CreateProgram from './ui/workout/program/createprogram/CreateProgram'

import {
  logoutUser,
} from './controller/lupa/auth/auth'

import PushNotification from 'react-native-push-notification'
import { connect } from 'react-redux';
import { generateMessagingToken } from "./controller/firebase/firebase";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import LupaHomeNavigator from "./ui/navigators/LupaHomeNavigator";

import FeatherIcon from "react-native-vector-icons/Feather";
import DashboardNavigator from "./ui/navigators/DashboardNavigator";
import LupaDrawerNavigator from "./ui/navigators/LupaDrawerNavigator";

class Lupa extends React.Component {
  constructor(props) {
    super(props);

    this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    this.currUserUUID = this.LUPA_CONTROLLER_INSTANCE.getCurrentUser().uid;
    this.lupaSwiper = React.createRef();

    this.state = {
      currIndex: 1,
      isNewUser: false,
      ready: false,
      swipeable: true,
      permissions: null,
    }

    this._showWelcomeModal = this._showWelcomeModal.bind(this);
    this._showWelcomeModal();

    PushNotification.configure({
      // (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {

        console.log('LOCAL NOTIFICATION ==>', notification)
      },
    popInitialNotification: true,
      requestPermissions: false,
    })

    generateMessagingToken(); //Remove this if it generates the tokens .. keep for now
  }

  componentDidMount = async () => {
    this.LUPA_CONTROLLER_INSTANCE.indexApplicationData();
    await generateMessagingToken();
  }

  _showWelcomeModal = async () => {
    let _isNewUser;
    await AsyncStorage.getItem(`${this.currUserUUID}_` + 'isNewUser').then(result => {
      _isNewUser = result;
    });

    if (_isNewUser != 'false')
    {
      await this.setState({
        isNewUser: true
      })
    }

}

_handleWelcomeModalClose = async () => {
  await this.setState({ isNewUser: false })
  await AsyncStorage.setItem(`${this.currUserUUID}_` + 'isNewUser', 'false');
}
  
_navigateToAuth = async () => {
  await logoutUser();
  this.props.navigation.navigate('Auth');
}
  render() {
    return (
      <>
      <StatusBar barStyle="dark-content" networkActivityIndicatorVisible={true} />
      <LupaDrawerNavigator />
      <WelcomeModal isVisible={this.state.isNewUser} closeModalMethod={this._handleWelcomeModalClose}/> 
      </>
    );
  }
}

const config = {
  tabBarOptions: {
    activeTintColor: '#1089ff',
    inactiveTintColor: 'rgb(58, 58, 60)',
    labelStyle: {
      fontSize: 12,
      fontWeight: '400',
    },
    style: {
    },
    labelPosition: 'below icon',
    showIcon: true,
    showLabel: true,
  },
  adaptive: true,
  lazy: true
}


const styles = StyleSheet.create({
  appContainer: {
    display: 'flex'
  }
});


export default Lupa;
