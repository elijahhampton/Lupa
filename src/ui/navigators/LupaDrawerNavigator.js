
import React from 'react';

import DashboardView from '../user/dashboard/TrainerDashboardView';
//import { NavigationContainer } from '@react-navigation/native'
//import { createDrawerNavigator } from '@react-navigation/drawer';

import DrawerMenu from './Components/DrawerMenu';

import ProfileNavigator from './ProfileNavigator';

import TrainerInformation from '../user/modal/WelcomeModal/TrainerInformation';

import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import NotificationsView from '../user/notifications/NotificationsView'
import MessagesView from '../user/chat/MessagesView'

/*
const Drawer = createDrawerNavigator();

export default function LupaDrawerNavigator() {
  return (
    <NavigationContainer independent={true}>
          <Drawer.Navigator initialRouteName="Dashboard" drawerPosition="left" drawerContent={(props) => <DrawerMenu {...props}  />}>
     <Drawer.Screen name="Dashboard" component={DashboardView} />
      <Drawer.Screen name="ProfileView" component={ProfileNavigator} />
      <Drawer.Screen name="TrainerInformation" component={TrainerInformation} />
    </Drawer.Navigator>
    </NavigationContainer>
  )
}
*/

const LupaDrawerNavigator = createDrawerNavigator(
    {
    //Drawer Optons and indexing
      Dashboard: {
        screen: (props) => <DashboardView {...props}  disableSwipe={props.screenProps.disableSwipe} enableSwipe={props.screenProps.enableSwipe}/>
      },
      Profile: {
        screen: ProfileNavigator
      },
    TrainerInformation: {
      screen: TrainerInformation
    },
    Notifications: {
      screen: (props) => <NotificationsView {...props} disableSwipe={props.screenProps.disableSwipe} enableSwipe={props.screenProps.enableSwipe} />,
    },
    Messages: {
      screen: (props) => <MessagesView {...props} disableSwipe={props.screenProps.disableSwipe} enableSwipe={props.screenProps.enableSwipe} />
    },
    },
    {
      initialRouteName: 'Dashboard',
      contentComponent: (props) => <DrawerMenu {...props} logoutMethod={props.screenProps.logoutMethod}/>
    }
  );

export default createAppContainer(LupaDrawerNavigator);