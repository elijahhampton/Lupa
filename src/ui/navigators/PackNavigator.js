import React from 'react';

//import { NavigationContainer } from '@react-navigation/native';
//import { createStackNavigator } from '@react-navigation/stack';

import PackView from '../packs/PackView';
import PackChat from '../packs/PackChatModal';
import PackModal from '../packs/PackModal';

import ProfileNavigator from './ProfileNavigator';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
/*
const Stack = createStackNavigator();

export default function PackStackNavigator() {
    return (
        <NavigationContainer independent={true}>
        <Stack.Navigator 
            initialRouteName="PackView" 
            screenOptions={{gestureEnabled: false}}
            headerMode="none">
            <Stack.Screen 
                name="PackView"
                component={PackView}/>
            <Stack.Screen
                name="PackChat"
                component={PackChat} />
            <Stack.Screen
                name="PackModal"
                component={PackModal} />
        </Stack.Navigator>
        </NavigationContainer>
    )
}
*/
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
            screen: (props) => <PackModal {...props} disableSwipe={props.screenProps.disableSwipe} enableSwipe={props.screenProps.enableSwipe}/>,
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