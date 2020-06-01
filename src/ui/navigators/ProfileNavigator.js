import React from 'react';

import FollowerView from '../user/profile/modal/FollowerModal';
import ProfileView from '../user/profile/ProfileView';

import PackModal from '../packs/PackModal';

import PrivateChat from '../user/chat/PrivateChat';

import MessagesView from '../user/chat/MessagesView'

//import { NavigationContainer } from '@react-navigation/native';
//import { createStackNavigator } from '@react-navigation/stack';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import SettingsModal from '../user/profile/component/SettingsModal';
import LiveWorkout from '../workout/modal/LiveWorkout';
import Programs from '../workout/program/Programs';
import CardFormScreen from '../src/scenes/CardFormScreen'
import CreateProgram from '../workout/program/createprogram/CreateProgram';


const ProfileNavigator = createStackNavigator(
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
    PrivateChat: {
        screen: PrivateChat,
        navigationOptions: ({navigation}) => ({
            title: "PrivateChat",
            header: null,
            gesturesEnabled: false,
        }),
    },
    PackModal: {
        screen: PackModal,
        navigationOptions: ({ navigation }) => ({
            title: 'PackModal',
            header: null,
            gesturesEnabled: false,
        })
    },
    UserSettingsView: {
      screen: SettingsModal,
      navigationOptions: ({navigation}) => ({
          title: "UserSettings",
          header: null,
          gesturesEnabled: false,
      }),
  },
    MessagesView: {
        screen: MessagesView,
        navigationOptions:   ({navigation}) => ({
            title: "MessagesView",
            header: null,
            gesturesEnabled: false,
        })
      },
      LiveWorkout: {
        screen: (props) => <LiveWorkout {...props} disableSwipe={props.screenProps.disableSwipe} enableSwipe={props.screenProps.enableSwipe} />,
        navigationOptions:   ({navigation}) => ({
            title: "LiveWorkout",
            header: null,
            gesturesEnabled: false,
        })
      },
      Programs: {
        screen: (props) => <Programs {...props} enableSwipe={props.screenProps.enableSwipe} disableSwipe={props.screenProps.disableSwipe} />,
        navigationOptions:   ({navigation}) => ({
            title: "Programs",
            header: null,
            gesturesEnabled: false,
        })
      },
      CardFormScreen: {
        screen: CardFormScreen,
        navigationOptions:   ({navigation}) => ({
            title: "Card Form",
            header: null,
            gesturesEnabled: false,
        })
      },
      CreateProgram: {
        screen: (props) => <CreateProgram {...props} disableSwipe={props.screenProps.disableSwipe} enableSwipe={props.screenProps.enableSwipe} />,
        navigationOptions: ({navigation}) => ({
          title: "CreateProgram",
          header: null,
          gesturesEnabled: false,
        })
      },
    },
    
    {
    initialRouteName: 'Profile',
    }
);

export default createAppContainer(ProfileNavigator);