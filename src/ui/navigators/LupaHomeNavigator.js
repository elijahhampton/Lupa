import React from 'react';

import Profile from '../user/profile/ProfileView';
import CreateProgram from '../workout/program/createprogram/CreateProgram';
import LiveWorkout from '../workout/modal/LiveWorkout';
import LupaHome from '../LupaHome';

import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator()

function LupaHomeNavigator() {
    return (
        <Stack.Navigator initialRouteName="" headerMode='none'>
      <Stack.Screen name="LupaHome" component={LupaHome} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="LiveWorkout" component={LiveWorkout} />
      <Stack.Screen name="CreateProgram" component={CreateProgram} />
    </Stack.Navigator>
    )
}

export default LupaHomeNavigator;