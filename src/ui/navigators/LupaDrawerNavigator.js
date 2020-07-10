
import React from 'react';

import DashboardView from '../user/dashboard/TrainerDashboardView';
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer';

import DrawerMenu from './Components/DrawerMenu';
import ProfileNavigator from './ProfileNavigator';
import TrainerInformation from '../user/modal/WelcomeModal/TrainerInformation';
import NotificationsView from '../user/notifications/NotificationsView'
import MessagesView from '../user/chat/MessagesView'
import { createStackNavigator } from '@react-navigation/stack';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator()

function LupaDrawerNavigator() {
  return (
  /*  <NavigationContainer independent={true}>
          <Drawer.Navigator initialRouteName="Dashboard" drawerPosition="left" drawerContent={(props) => <DrawerMenu {...props}  />}>
     <Drawer.Screen name="Dashboard" component={DashboardView} />
      <Drawer.Screen name="Profile" component={ProfileNavigator} />
      <Drawer.Screen name="TrainerInformation" component={TrainerInformation} />
            <Drawer.Screen name="Notifications" component={NotificationsView} />
                  <Drawer.Screen name="Messages" component={MessagesView} />
    </Drawer.Navigator>
    </NavigationContainer>*/

    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{ gestureEnabled: false }}
      headerMode='none'
      mode='card'
    >
      <Stack.Screen
        name="Dashboard"
        component={DashboardView}
      />
    </Stack.Navigator>
  )
}

export default LupaDrawerNavigator;