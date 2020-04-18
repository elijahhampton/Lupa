import * as React from 'react';

import { createAppContainer } from 'react-navigation';

import { createStackNavigator } from 'react-navigation-stack';
import BuildWorkout from '../workout/BuildWorkout'
import WorkoutHome from '../workout/WorkoutHome';
import MessagesView from '../user/chat/MessagesView';
import SessionsView from '../sessions/SearchView'

const WorkoutViewNavigator = createStackNavigator(
    {
    WorkoutView: {
        screen: WorkoutHome,
        navigationOptions: ({ navigation }) => ({
            title: 'WorkoutView',
            header: null,
            gesturesEnabled: false,
        })
    },
    BuildAWorkout: {
      screen: BuildWorkout,
      navigationOptions:   ({navigation}) => ({
          title: "Build a Workout",
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
    SessionsView: {
        screen: SessionsView,
        navigationOptions:   ({navigation}) => ({
            title: "MessagesView",
            header: null,
            gesturesEnabled: false,
        })
    },
    initialRouteName: 'BuildAWorkout',
    }
);

export default createAppContainer(WorkoutViewNavigator);