import React from 'react'

import { createStackNavigator } from '@react-navigation/stack'
import Dashboard from '../user/dashboard/Dashboard'
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
        component={Dashboard}
      />
       <Stack.Screen 
        name="MyData"
        component={MyData}
       />
    </Stack.Navigator>
    )
}

export default DashboardNavigator;