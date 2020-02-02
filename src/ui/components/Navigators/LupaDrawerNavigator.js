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


import DrawerMenu from './Components/DrawerMenu';

import GoalsStackNavigator from './GoalsStackNavigator';

import ProfileNavigator from './ProfileNavigator';
import UserProfileModal from '../DrawerViews/Profile/UserProfileModal';

const LupaDrawerNavigator = createDrawerNavigator(
    {
    //Drawer Optons and indexing
      Dashboard: {
        screen: DashboardView
      },
      Profile: {
        screen: ProfileNavigator
      },
      Goals: {
        screen: GoalsStackNavigator
      },
      UserPofileView: {
        screen: UserProfileModal
      }
    },
    {
      initialRouteName: 'Dashboard',
      contentComponent: () => <DrawerMenu />
    }
  );


const options = {

}

export default createAppContainer(LupaDrawerNavigator);
