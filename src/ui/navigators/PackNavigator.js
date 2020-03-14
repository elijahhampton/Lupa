import React from 'react';

import { createAppContainer } from 'react-navigation';

import { createStackNavigator } from 'react-navigation-stack';

import PackView from '../packs/PackView';
import PackChat from '../packs/PackChatModal';
import PackModal from '../packs/PackModal';

import ProfileNavigator from './ProfileNavigator';

const PackNavigator = createStackNavigator(
    {
        PackView: {
            screen: PackView,
            navigationOptions: ({ navigation }) => ({
                title: 'PackView',
                header: null,
                gesturesEnabled: false,
            })
        },
        PackChat: {
            screen: PackChat,
            navigationOptions: ({ navigation }) => ({
                title: 'PackChat',
                header: null,
                gesturesEnabled: true,
            })
        },
        PackModal: {
            screen: PackModal,
            navigationOptions: ({ navigation }) => ({
                title: 'PackModal',
                header: null,
                gesturesEnabled: true,
            })
        },
        Profile: {
            screen: ProfileNavigator,
            navigationOptions: ({ navigation }) => ({
                title: 'UserProfileModal',
                header: null,
                gesturesEnabled: true,
            })
        }
    },
    {
        initialRouteName: 'PackView',
    }
);

export default createAppContainer(PackNavigator);