import React from 'react';

import FollowerView from '../user/profile/modal/FollowerModal';
import ProfileView from '../user/profile/ProfileView';
import MessagesView from '../user/chat/MessagesView'
import SettingsModal from '../user/profile/component/SettingsModal';
import LiveWorkout from '../workout/modal/LiveWorkout';

import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';

import LupaController from '../../controller/lupa/LupaController'

const Stack = createStackNavigator();

function ProfileNavigator() {
  return (
    <Stack.Navigator initialRouteName="SettingsView" screenOptions={{ gestureEnabled: false }} headerMode='none'>
     <Stack.Screen name="Profile" component={ProfileView} initialParams={{userUUID: 0, navFrom: 'BottomTabNavigator'}} />
      <Stack.Screen name="FollowerView" component={FollowerView} />
      <Stack.Screen name="UserSettingsView" component={SettingsModal} />
      <Stack.Screen name="MessagesView" component={MessagesView} />
      <Stack.Screen name="LiveWorkout" component={LiveWorkout} />
    </Stack.Navigator>
  );
}

export default ProfileNavigator;