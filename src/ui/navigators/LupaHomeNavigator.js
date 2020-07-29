import React from 'react';

import Profile from '../user/profile/ProfileView';
import CreateProgram from '../workout/program/createprogram/CreateProgram';
import LiveWorkout from '../workout/modal/LiveWorkout';
import LupaHome from '../LupaHome';
import MessagesView from '../user/chat/MessagesView'

import { createStackNavigator } from '@react-navigation/stack';
import MyData from '../user/component/MyData';

const Stack = createStackNavigator()

function LupaHomeNavigator() {
    return (
        <Stack.Navigator initialRouteName="LupaHome" headerMode='none' mode='modal'>
      <Stack.Screen name="LupaHome" component={LupaHome} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="MessagesView" component={MessagesView} />
      <Stack.Screen name="MyData" component={MyData} />
      <Stack.Screen name="CreateProgram" component={CreateProgram} />
    </Stack.Navigator>
    )
}

export default LupaHomeNavigator;