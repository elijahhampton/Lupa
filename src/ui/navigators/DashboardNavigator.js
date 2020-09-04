import React from 'react'

import { createStackNavigator } from '@react-navigation/stack'
import Dashboard from '../user/dashboard/Dashboard'
import NotificationsView from '../user/notifications/NotificationsView'
import MessagesView from '../user/chat/MessagesView'
import { useSelector } from 'react-redux'
import DashboardController from '../user/dashboard/DashboardController'

const Stack = createStackNavigator()

function DashboardNavigator() {
    return (
        <Stack.Navigator initialRouteName="Dashboard" headerMode='none'>
      <Stack.Screen name="Dashboard" component={DashboardController} />
    </Stack.Navigator>
    )
}

export default DashboardNavigator;