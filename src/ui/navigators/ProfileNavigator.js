import React from 'react';

import FollowerView from '../user/profile/modal/FollowerModal';
import MessagesView from '../user/chat/MessagesView'
import SettingsModal from '../user/profile/component/SettingsModal';
import LiveWorkout from '../workout/modal/LiveWorkout';

import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';

import LupaController from '../../controller/lupa/LupaController'
import ProfileController from '../user/profile/ProfileController';
import SettingsNavigator from './SettingsNavigator'
const Stack = createStackNavigator();

function ProfileNavigator() {
  return (
    <Stack.Navigator initialRouteName="Profile" screenOptions={{ gestureEnabled: false }} headerMode='none'>
     <Stack.Screen name="Profile" component={ProfileController} initialParams={{userUUID: 0, navFrom: 'BottomTabNavigator'}} />
      <Stack.Screen name="FollowerView" component={FollowerView} />
      <Stack.Screen name="UserSettingsView" component={SettingsNavigator} />
      <Stack.Screen name="MessagesView" component={MessagesView} />
    </Stack.Navigator>
  );
}

export default ProfileNavigator;