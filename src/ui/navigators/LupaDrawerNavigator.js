
import React from 'react';

import DashboardView from '../user/dashboard/TrainerDashboardView';
//import { NavigationContainer } from '@react-navigation/native'
//import { createDrawerNavigator } from '@react-navigation/drawer';

import DrawerMenu from './Components/DrawerMenu';

import ProfileNavigator from './ProfileNavigator';

import TrainerInformation from '../user/modal/WelcomeModal/TrainerInformation';

import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';

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
        screen: DashboardView
      },
      Profile: {
        screen: ProfileNavigator
      },
    TrainerInformation: {
      screen: TrainerInformation
    },
    },
    {
      initialRouteName: 'Dashboard',
      contentComponent: (props) => <DrawerMenu {...props} logoutMethod={props.screenProps.logoutMethod}/>
    }
  );

export default createAppContainer(LupaDrawerNavigator);