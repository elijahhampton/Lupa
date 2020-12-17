import React from 'react'

import { createStackNavigator } from '@react-navigation/stack'
import DashboardController from '../user/dashboard/DashboardController'
import MyData from '../user/component/MyData'

const Stack = createStackNavigator()

function DashboardNavigator() {
  return (
    <Stack.Navigator initialRouteName="Dashboard" headerMode='none'>
      <Stack.Screen name="Dashboard" component={DashboardController} />
    </Stack.Navigator>
  )
}

export default DashboardNavigator;