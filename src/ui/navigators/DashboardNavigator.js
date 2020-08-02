import React from 'react'

import { createStackNavigator } from '@react-navigation/stack'
import Dashboard from '../user/dashboard/Dashboard'
import NotificationsView from '../user/notifications/NotificationsView'

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
        name="Notifications"
        component={NotificationsView}
       />
    </Stack.Navigator>
    )
}

export default DashboardNavigator;