import React from 'react';

//import { NavigationContainer } from '@react-navigation/native';
//import { createStackNavigator } from '@react-navigation/stack';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import BuildAWorkout from '../workout/BuildWorkout'
import WorkoutHome from '../workout/WorkoutHome';
import MessagesView from '../user/chat/MessagesView';
import SessionsView from '../sessions/SearchView'

/*
const Stack = createStackNavigator();

export default function WorkoutStackNavigator() {
  return (
    <NavigationContainer independent={true}>
    <Stack.Navigator
      initialRouteName="WorkoutView"
      screenOptions={{ gestureEnabled: false }}
      headerMode="none"
    >
      <Stack.Screen
        name="WorkoutView"
        component={WorkoutHome}
      />
            <Stack.Screen
        name="BuildAWorkout"
        component={BuildAWorkout}
      />
                  <Stack.Screen
        name="MessagesView"
        component={MessagesView}
      />
    </Stack.Navigator>
    </NavigationContainer>
  );
}

function WorkoutNavigator() {
    return <WorkoutStackNavigator />
}
*/


const WorkoutViewNavigator = createStackNavigator(
    {
    WorkoutView: {
        screen: (props) => <WorkoutHome {...props}  />,
        navigationOptions: ({ navigation }) => ({
            title: 'WorkoutView',
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
    MessagesView: {
        screen: MessagesView,
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
