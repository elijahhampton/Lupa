import React from 'react';

import { createAppContainer } from 'react-navigation';

import { createStackNavigator } from 'react-navigation-stack';

import LoginView from '../MainViews/login/LoginView';
import SignUpView from '../MainViews/login/SignUpView';
import WelcomeView from '../MainViews/login/WelcomeView';

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