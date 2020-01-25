import React from 'react';

import { createAppContainer } from 'react-navigation';

import { createStackNavigator } from 'react-navigation-stack';

import PackView from '../MainViews/Packs/PackView';
import PackChat from '../Modals/PackChatModal/'

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
    },
    {
    initialRouteName: 'PackView',
    }
);

export default createAppContainer(PackNavigator);