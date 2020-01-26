import React from 'react'

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import SettingsView from '../DrawerViews/Profile/components/SettingsModal';
import AccountSettingsView from '../DrawerViews/Profile/components/AccountSettingsView';

const SettingsStackNavigator = createStackNavigator({
    SettingsView: {
        screen: SettingsView,
        navigationOptions: ({ navigation }) => ({
            title: "SettingsView",
            header: null,
            gesturesEnabled: false,
        })
    },
    AccountSettingsView: {
        screen: AccountSettingsView,
        navigationOptions: ({ navigation }) => ({
            title: "AccountSettingsView",
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