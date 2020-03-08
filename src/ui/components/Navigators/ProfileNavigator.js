import React from 'react';

import { createAppContainer, createSwitchNavigator} from 'react-navigation';

import { createStackNavigator } from 'react-navigation-stack';

import SettingsStackNavigator from './SettingsNavigator';
import FollowerView from '../Modals/User/FollowerModal';
import ProfileView from '../DrawerViews/Profile/ProfileView';

import PackModal from '../Modals/PackModal/PackModal';

import SessionsView from '../Modals/Session/CreateSessionModal';

const ProfileNavigator = createSwitchNavigator(
    {
    Profile: {
        screen: ProfileView,
        initialParams: {
            userUUID: 566
        },
        navigationOptions: ({ navigation }) => ({
            title: 'ProfileView',
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
    },
    PackModal: {
        screen: PackModal,
        navigationOptions: ({ navigation }) => ({
            title: 'PackModal',
            header: null,
            gesturesEnabled: false,
        })
    },
    SessionsView: {
        screen: SessionsView,
        navigationOptions: ({navigation}) => ({
            title: "SessionsView",
            header: null,
            gesturesEnabled: false,
        }),
    },
    },
    {
    initialRouteName: 'Profile',
    }
);

export default createAppContainer(ProfileNavigator);