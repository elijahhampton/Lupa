import React from 'react'

import SettingsView from '../user/profile/component/SettingsModal';
//import { NavigationContainer } from '@react-navigation/native';
//import { createStackNavigator } from '@react-navigation/stack';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

/*
const Stack = createStackNavigator();

function SettingsStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="SettingsView"
      screenOptions={{ gestureEnabled: false }}
    >
      <Stack.Screen
        name="SettingsView"
        component={SettingsView}
      />
    </Stack.Navigator>
  );
}

export default function SettingsNavigator() {
    return <SettingsStackNavigator />
}
*/


const SettingsStackNavigator = createStackNavigator({
    SettingsView: {
        screen: SettingsView,
        navigationOptions: ({ navigation }) => ({
            title: "SettingsView",
            header: null,
            gesturesEnabled: false,
        })
    },
},
    {
        initialRouteName: 'SettingsView'
    }
)

export default createAppContainer(SettingsStackNavigator);