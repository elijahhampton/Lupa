import React from 'react';

import FollowerView from '../user/profile/modal/FollowerModal';
import ProfileView from '../user/profile/ProfileView';

import PackModal from '../packs/PackModal';

import SessionsView from '../sessions/CreateSessionModal';
import PrivateChat from '../user/chat/PrivateChat';

import MessagesView from '../user/chat/MessagesView'

//import { NavigationContainer } from '@react-navigation/native';
//import { createStackNavigator } from '@react-navigation/stack';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import SettingsModal from '../user/profile/component/SettingsModal';
import LiveWorkout from '../workout/modal/LiveWorkout';
import Programs from '../workout/program/Programs';
/*
const Stack = createStackNavigator();

export default function ProfileStackNavigator() {
  return (
    <NavigationContainer independent={true}>
    <Stack.Navigator
      initialRouteName="ProfileView"
      screenOptions={{ gestureEnabled: false }}
      
    >
      <Stack.Screen
        name="ProfileView"
        component={(props) => <ProfileView {...props} />}
        
      />
            <Stack.Screen
        name="FollowerView"
        component={FollowerView}
      />
                  <Stack.Screen
        name="PrivateChat"
        component={PrivateChat}
      />
                        <Stack.Screen
        name="PackModal"
        component={PackModal}
      />
                        <Stack.Screen
        name="SessionsView"
        component={SessionsView}
      />
                        <Stack.Screen
        name="MessagesView"
        component={MessagesView}
      />
    </Stack.Navigator>
    </NavigationContainer>
  );
}

function ProfileNavigator() {
    return <ProfileStackNavigator />
}
*/

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
    SessionsView: {
        screen: SessionsView,
        navigationOptions: ({navigation}) => ({
            title: "SessionsView",
            header: null,
            gesturesEnabled: false,
        }),
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
    },
    
    {
    initialRouteName: 'Profile',
    }
);

export default createAppContainer(ProfileNavigator);