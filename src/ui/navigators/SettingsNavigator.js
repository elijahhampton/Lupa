import React from 'react'

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import SettingsView from '../user/profile/component/SettingsModal';

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