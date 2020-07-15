import React from 'react'

import { createStackNavigator } from '@react-navigation/stack'
import TrainerDashboardView from '../user/dashboard/TrainerDashboardView'
import MessagesView from '../user/chat/MessagesView'

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
       <Stack.Screen name="Messages" component={MessagesView} /> 
    </Stack.Navigator>
    )
}

export default DashboardNavigator;