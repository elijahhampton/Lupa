import React from 'react';

//import { NavigationContainer } from '@react-navigation/native';
//import { createStackNavigator } from '@react-navigation/stack';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Profile from '../user/profile/ProfileView';
import SessionsView from '../sessions/CreateSessionModal';
import SearchView from '../sessions/SearchView';
import PackModal from '../packs/PackModal';
import { PackChatModal as PackChat } from '../packs/PackChatModal';
import BuildAWorkout from '../workout/BuildWorkout';
import PrivateChat from '../user/chat/PrivateChat'
import MyPrograms from '../workout/Programs';

import MessagesView from '../user/chat/MessagesView';
import Programs from '../workout/Programs';

import TrainerInformation from '../user/modal/WelcomeModal/TrainerInformation';
import NotificationsView from '../sessions/NotificationsView';
import CreateProgram from '../workout/program/CreateProgram';

/*
const Stack = createStackNavigator();

export default function SessionsStackNavigator() {
  return (
    <NavigationContainer independent={true}>
    <Stack.Navigator
      initialRouteName="SearchView"
      screenOptions={{ gestureEnabled: false }}
      headerMode="none"
    >
      <Stack.Screen
        name="SearchView"
        component={SearchView}
      />
            <Stack.Screen
        name="Profile"
        component={Profile}
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

function SessionsNavigator() {
    return <SessionsStackNavigator />
}
*/

const UserViewNavigator =  createStackNavigator(
    {
         /*Added the search view here because navigation didn't work to 
        the user profile view without it.. need to reconsider the design of this in the future */
    SearchView: {
        screen: (props) => <SearchView setScreen={screen => props.screenProps.setCurrentScreen(screen)} goToIndex={index => props.screenProps.goToIndex(index)} disableSwipe={props.screenProps.disableSwipe} enableSwipe={props.screenProps.enableSwipe} />,
        navigationOptions: ({navigation}) => ({
            title: "SearchView",
            header: null,
            gesturesEnabled: false,
        })
    },
    NotificationsView: {
      screen: (props) => <NotificationsView disableSwipe={props.screenProps.disableSwipe} enableSwipe={props.screenProps.enableSwipe} />,
        navigationOptions: ({navigation}) => ({
            title: "NotificationsView",
            header: null,
            gesturesEnabled: false,
        })
    },
    Profile: {
        screen: Profile,
        navigationOptions: ({navigation}) => ({
            title: "Profile",
            header: null,
            gesturesEnabled: false,
        })
    },
    BuildAWorkout: {
      screen: (props) => <BuildAWorkout {...props} disableSwipe={props.screenProps.disableSwipe} enableSwipe={props.screenProps.enableSwipe} />,
      navigationOptions:   ({navigation}) => ({
          title: "Build a Workout",
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
    MessagesView: {
        screen: MessagesView,
        navigationOptions:   ({navigation}) => ({
            title: "MessagesView",
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
      TrainerInformation: {
        screen: TrainerInformation,
        navigationOptions:   ({navigation}) => ({
          title: "Register as a Trainer",
          gesturesEnabled: false,
          headerBackTitle: "Cancel"
      })
      },
},
{
    initialRouteName: 'SearchView'
})

export default createAppContainer(UserViewNavigator);