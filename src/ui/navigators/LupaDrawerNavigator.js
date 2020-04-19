import React from 'react';

import DashboardView from '../user/dashboard/TrainerDashboardView';
import { createAppContainer, NavigationActions } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';

import AuthenticationNavigator from './AuthenticationNavigator';

import DrawerMenu from './Components/DrawerMenu';

import UserSettings from './SettingsNavigator';


import ProfileNavigator from './ProfileNavigator';

import TrainerInformation from '../user/modal/WelcomeModal/TrainerInformation';

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
        }),
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


const options = {

}

export default createAppContainer(LupaDrawerNavigator);
