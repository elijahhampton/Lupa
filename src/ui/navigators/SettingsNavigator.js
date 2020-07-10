import React from 'react'

import SettingsView from '../user/profile/component/SettingsModal';
import { createStackNavigator } from '@react-navigation/stack';


const Stack = createStackNavigator();

function SettingsStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="SettingsView" headerMode='none'>
      <Stack.Screen
        name="SettingsView"
        component={SettingsView}
      />
    </Stack.Navigator>
  );
}

export default SettingsStackNavigator;