import React from 'react';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Profile from '../user/profile/ProfileView';
import BuildAWorkout from '../workout/program/createprogram/BuildWorkout';
import MessagesView from '../user/chat/MessagesView';
import Programs from '../workout/program/Programs';

import TrainerInformation from '../user/modal/WelcomeModal/TrainerInformation';
import NotificationsView from '../user/notifications/NotificationsView';
import PackView from '../packs/PackView'
import TrainerInsights from '../user/trainer/TrainerInsights'
import CreateProgram from '../workout/program/createprogram/CreateProgram';
import LiveWorkout from '../workout/modal/LiveWorkout';
import LiveWorkoutPreview from '../workout/program/LiveWorkoutPreview'
import LupaHome from '../LupaHome';

import CardFormScreen from '../src/scenes/CardFormScreen';

const LupaHomeNavigator =  createStackNavigator(
    {
    LupaHome: {
        screen: (props) => <LupaHome />,
        navigationOptions: ({navigation}) => ({
            title: "SearchView",
            header: null,
            gesturesEnabled: false,
        })
    },
    NotificationsView: {
      screen: (props) => <NotificationsView />,
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
      screen: (props) => <BuildAWorkout {...props} />,
      navigationOptions:   ({navigation}) => ({
          title: "Build a Workout",
          header: null,
          gesturesEnabled: false,
      })
    },
    LiveWorkout: {
      screen: (props) => <LiveWorkout {...props} />,
      navigationOptions:   ({navigation}) => ({
          title: "LiveWorkout",
          header: null,
          gesturesEnabled: false,
      })
    },
    LiveWorkoutPreview: {
      screen: (props) =>  <LiveWorkoutPreview {...props} />,
      navigationOptions:   ({navigation}) => ({
        title: "LiveWorkout",
        header: null,
        gesturesEnabled: false,
    })
    },
    CreateProgram: {
      screen: (props) => <CreateProgram {...props} />,
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
        screen: (props) => <Programs {...props} />,
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
      CardFormScreen: {
        screen: CardFormScreen,
        navigationOptions:   ({navigation}) => ({
            title: "Programs",
            header: null,
            gesturesEnabled: false,
        })
      },
      PackView: {
        screen: PackView,
        navigationOptions:   ({navigation}) => ({
            title: "Packs",
            header: null,
            gesturesEnabled: false,
        })
      },
      TrainerInsights: {
        screen: TrainerInsights,
        navigationOptions:   ({navigation}) => ({
            title: "Packs",
            header: null,
            gesturesEnabled: false,
        })
      },
},
{
    initialRouteName: 'LupaHome'
})

export default createAppContainer(LupaHomeNavigator);