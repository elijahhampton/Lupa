import React from 'react';

import LoginView from '../user/login/LoginView';
import SignUpView from '../user/login/SignUpView';
import WelcomeView from '../user/login/WelcomeView';

import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator()

function AuthenticationNavigator() {
    return (
        <Stack.Navigator initialRouteName="Login" headerMode="none">
      <Stack.Screen name="WelcomeView" component={WelcomeView} />
      <Stack.Screen name="Login" component={LoginView} />
      <Stack.Screen name="SignUp" component={SignUpView} />
    </Stack.Navigator>
    )
}

export default AuthenticationNavigator;