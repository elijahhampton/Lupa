import React from 'react'

import SettingsView from '../user/profile/component/SettingsModal';
import { createStackNavigator } from '@react-navigation/stack';
import AccountSettings from '../user/settings/AccountSettings'
import PaymentSettings from '../user/settings/PaymentSettings';

const Stack = createStackNavigator();

function SettingsStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="SettingsView" headerMode='none'>
      <Stack.Screen name="SettingsView" component={SettingsView} />
     <Stack.Screen name="AccountSettings" component={AccountSettings} />
     <Stack.Screen name="PaymentSettings" component={PaymentSettings} />
    </Stack.Navigator>
  );
}

export default SettingsStackNavigator;