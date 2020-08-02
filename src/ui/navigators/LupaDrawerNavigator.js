
import React from 'react';
import {
  View
} from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer';

import DrawerMenu from './Components/DrawerMenu';
import ProfileNavigator from './ProfileNavigator';
import FeatherIcon from 'react-native-vector-icons/Feather'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardNavigator from './DashboardNavigator';
import LupaHomeNavigator from './LupaHomeNavigator';
import Search from '../search/Search';
import { useSelector } from 'react-redux';

const Drawer = createDrawerNavigator();

function LupaDrawerNavigator() {
  return (
          <Drawer.Navigator initialRouteName="Lupa" drawerPosition="left" drawerContent={(props) => <DrawerMenu {...props}  />}>
      <Drawer.Screen name="Lupa" component={LupaBottomTabNavigator}/>
    </Drawer.Navigator>
  )
}

const Tab = createBottomTabNavigator();

const PlaceHolder = () => {
  return (
    <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>

    </View>
  )
}

const tabBarOptions = {
  showLabel: false,
  labelStyle: {
    fontWeight: '400',
    fontFamily: 'avenir-roman',
  }
}

function LupaBottomTabNavigator() {
  const currUserData = useSelector(state => {
    return state.Users.currUserData
  })

  return (
    <Tab.Navigator 
    tabBarOptions={tabBarOptions}
      initialRouteName="Train"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name)
          {
            case 'Dashboard':
              return <FeatherIcon name='dashboard' size={20} color={focused ? "#1089ff" : "#212121"} />;
            case 'Train':
              return <FeatherIcon name='home' size={20} color={focused ? "#1089ff" : "#212121"} />;
            case 'Create':
              return <FeatherIcon name='plus-circle' size={20} color={focused ? "#1089ff" : "#212121"}/>;
            case 'Search':
              return <FeatherIcon name='search' size={20} color={focused ? "#1089ff" : "#212121"} />;
            case 'Profile':
              return <FeatherIcon name='user' size={20} color={focused ? "#1089ff" : "#212121"} />;
          }

        },
      })} >
             
              <Tab.Screen name="Train" component={LupaHomeNavigator} />
              <Tab.Screen name="Search" component={Search} />
              {
                currUserData.isTrainer === true ?
                <Tab.Screen name="Create" component={PlaceHolder} options={{animationsEnabled: true}} listeners={({ navigation }) => ({
                  tabPress: event => {
                    event.preventDefault()
                    navigation.navigate('CreateProgram')
                  }
                })}  />
                :
                null
              }
             
        <Tab.Screen name="Dashboard" component={DashboardNavigator} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  );
}

export default LupaDrawerNavigator;