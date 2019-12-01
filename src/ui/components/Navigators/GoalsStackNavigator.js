import React from 'react'

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import ManageGoals from '../DrawerViews/Goals/ManageGoals';
import CreateNewGoal from '../DrawerViews/Goals/CreateNewGoal';


const GoalsStackNavigator = createStackNavigator({
    ManageGoals: {
        screen: ManageGoals,
        navigationOptions: ({ navigation }) => ({
            title: "Login",
            header: null,
            gesturesEnabled: false,
        })
    },
    CreateNewGoal: {
        screen: CreateNewGoal,
        navigationOptions: ({ navigation }) => ({
            title: "Login",
            header: null,
            gesturesEnabled: false,
        })
    },
},
    {
        initialRouteName: 'ManageGoals'
    }
)

export default createAppContainer(GoalsStackNavigator);