import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Button,
  TouchableOpacity,
  CameraRoll,
  Platform,
  Image
} from 'react-native';

import DashboardView from '../MainViews/dashboard/TrainerDashboardView';
import { createAppContainer, NavigationActions } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';

import ProfileView from '../DrawerViews/Profile/ProfileView';

import DrawerMenu from './Components/DrawerMenu';

import GoalsStackNavigator from './GoalsStackNavigator';

import NotificationsView from '../DrawerViews/Notifications/NotificationsView';

const LupaDrawerNavigator = createDrawerNavigator(
    {
    //Drawer Optons and indexing
      Dashboard: {
        screen: DashboardView
      },
      Profile: {
        screen: ProfileView
      },
      Goals: {
        screen: GoalsStackNavigator
      },
      Notifications: {
        screen: NotificationsView
      }
    },
    {
      contentComponent: () => {return (<DrawerMenu />)},
      hideStatusBar: 'true',
      drawerBackgroundColor: "#FAFAFA"
    }
  );


const options = {

}

export default createAppContainer(LupaDrawerNavigator);
