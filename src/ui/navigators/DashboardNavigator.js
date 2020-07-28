import React from 'react'

import { createStackNavigator } from '@react-navigation/stack'
import TrainerDashboardView from '../user/dashboard/TrainerDashboardView'
import MyData from '../user/component/MyData'

const Stack = createStackNavigator()

function DashboardNavigator() {
    return (
        <Stack.Navigator
      initialRouteName="Dashboard"
      headerMode='none'
    >
      <Stack.Screen
        name="Dashboard"
        component={TrainerDashboardView}
      />
       <Stack.Screen 
        name="MyData"
        component={MyData}
       />
    </Stack.Navigator>
    )
}

export default DashboardNavigator;