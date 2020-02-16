import React from 'react';

import { createAppContainer } from 'react-navigation';

import { createStackNavigator } from 'react-navigation-stack';

import PackView from '../MainViews/Packs/PackView';
import PackChat from '../Modals/PackChatModal/';
import PackModal from '../Modals/PackModal/PackModal';
import MyPacks from '../MainViews/Packs/MyPacks';
import MyPacksCard from '../DrawerViews/Profile/components/MyPacksCard';

import UserProfileModal from '../DrawerViews/Profile/UserProfileModal';

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
        UserProfileModal: {
            screen: UserProfileModal,
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