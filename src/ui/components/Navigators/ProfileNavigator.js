import React from 'react';

import { createAppContainer, createSwitchNavigator} from 'react-navigation';

import { createStackNavigator } from 'react-navigation-stack';

import SettingsStackNavigator from './SettingsNavigator';
import FollowerView from '../Modals/User/FollowerModal';
import ProfileView from '../DrawerViews/Profile/ProfileView';

const ProfileNavigator = createSwitchNavigator(
    {
    Profile: {
        screen: ProfileView,
        navigationOptions: ({ navigation }) => ({
            title: 'ProfileView',
            header: null,
            gesturesEnabled: false,
        })
    },
    ProfileSettings: {
        screen: SettingsStackNavigator,
        navigationOptions: ({ navigation }) => ({
            title: 'ProfileSettings',
            header: null,
            gesturesEnabled: false,
        })
    },
    FollowerView: {
        screen: FollowerView,
        navigationOptions: ({ navigation }) => ({
            title: 'FollowerView',
            header: null,
            gesturesEnabled: false,
        })
    }
    },
    {
    initialRouteName: 'Profile',
    }
);

export default createAppContainer(ProfileNavigator);