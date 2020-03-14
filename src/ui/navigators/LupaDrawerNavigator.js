import React from 'react';

import DashboardView from '../user/dashboard/TrainerDashboardView';
import { createAppContainer, NavigationActions } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';


import DrawerMenu from './Components/DrawerMenu';

import UserSettings from './SettingsNavigator';


import ProfileNavigator from './ProfileNavigator';

const LupaDrawerNavigator = createDrawerNavigator(
    {
    //Drawer Optons and indexing
      Dashboard: {
        screen: DashboardView
      },
      Profile: {
        screen: ProfileNavigator
      },
      UserSettings: {
        screen: UserSettings,
        navigationOptions: ({ navigation }) => ({
            title: 'UserSettings',
            header: null,
            gesturesEnabled: false,

        })
    },
    },
    {
      initialRouteName: 'Dashboard',
      contentComponent: () => <DrawerMenu />
    }
  );


const options = {

}

export default createAppContainer(LupaDrawerNavigator);
