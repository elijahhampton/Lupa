import React from 'react'

import { createStackNavigator } from '@react-navigation/stack'
import TrainerDashboardView from '../user/dashboard/TrainerDashboardView'

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

{/*<Drawer.Screen name="Notifications" component={NotificationsView} />
                  <Drawer.Screen name="Messages" component={MessagesView} /> */}
    </Stack.Navigator>
    )
}

export default DashboardNavigator;