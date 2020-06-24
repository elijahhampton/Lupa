import React from 'react';

//import { NavigationContainer } from '@react-navigation/native';
//import { createStackNavigator } from '@react-navigation/stack';

import PackView from '../packs/PackView';
import PackChat from '../packs/PackChatModal';
import PackModal from '../packs/PackModal';

import ProfileNavigator from './ProfileNavigator';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import ProfileView from '../user/profile/ProfileView';

const PackNavigator = createStackNavigator(
    {
        PackView: {
            screen: (props) =>  <PackView  {...props} />,
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
        ProfileView: {
            screen: ProfileView,
            navigationOptions: ({ navigation }) => ({
                title: 'ProfileView',
                header: null,
                gesturesEnabled: true,
            })
        },
    },
    {
        initialRouteName: 'PackView',
    }
);

export default createAppContainer(PackNavigator);