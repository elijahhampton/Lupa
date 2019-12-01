import React from 'react';

import { createAppContainer } from 'react-navigation';

import { createStackNavigator } from 'react-navigation-stack';

import LoginView from '../MainViews/login/LoginView';
import SignUpView from '../MainViews/login/SignUpView';

const AuthenticationNavigator = createStackNavigator(
    {
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
    initialRouteName: 'Login'
    }
);

export default createAppContainer(AuthenticationNavigator);