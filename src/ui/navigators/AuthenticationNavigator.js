import React from 'react';

//import { NavigationContainer } from '@react-navigation/native';
//import { createStackNavigator } from '@react-navigation/stack';

import LoginView from '../user/login/LoginView';
import SignUpView from '../user/login/SignUpView';
import WelcomeView from '../user/login/WelcomeView';

import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

const AuthenticationNavigator = createStackNavigator(
  {
  WelcomeView: {
      screen: WelcomeView,
      navigationOptions: ({ navigation }) => ({
          title: 'WelcomeScreen',
          header: null,
          gesturesEnabled: false,
      })
  },
  Login: {
      screen: LoginView,
      navigationOptions: ({navigation}) => ({
          title: "Login",
          header: null,
          gesturesEnabled: false,
      })
  },
  SignUp: {
      screen: SignUpView,
      navigationOptions: ({navigation}) => ({
          title: "SignUp",
          header: null,
          gesturesEnabled: false,
      })
  }
  },
  {
  initialRouteName: 'WelcomeView'
  }
);

export default createAppContainer(AuthenticationNavigator);