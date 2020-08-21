import React from 'react';

import LupaHome from '../LupaHome'
import MessagesView from '../user/chat/MessagesView'

import { createStackNavigator } from '@react-navigation/stack';
import ProfileController from '../user/profile/ProfileController';

const Stack = createStackNavigator()

function LupaHomeNavigator() {
  return (
    <Stack.Navigator initialRouteName="LupaHome" headerMode='none' mode='modal'>
      <Stack.Screen name="LupaHome" component={LupaHome} />
      <Stack.Screen name="Profile" component={ProfileController} />
      <Stack.Screen name="MessagesView" component={MessagesView} />
    </Stack.Navigator>
  )
}

export default LupaHomeNavigator;