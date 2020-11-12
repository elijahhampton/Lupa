
import React from 'react';
import {
  View
} from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer';

import DrawerMenu from './Components/DrawerMenu';
import ProfileNavigator from './ProfileNavigator';
import ThinFeatherIcon from 'react-native-feather1s'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardNavigator from './DashboardNavigator';
import LupaHomeNavigator from './LupaHomeNavigator';
import Search from '../search/Search';
import { useSelector } from 'react-redux';

const Drawer = createDrawerNavigator();

function LupaDrawerNavigator() {
  return (
          <Drawer.Navigator 
          initialRouteName="Lupa" 
          drawerPosition="left" 
          drawerContent={(props) => <DrawerMenu {...props}  />}
          screenOptions={{
          headerShown: false
          }}
          >
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

const ACTIVE_COLOR = "#23374d"
const INACTIVE_COLOR = "#23374d"

const tabBarOptions = {
  showLabel: true,
  activeTintColor: '#1089ff',
  inactiveTintColor: 'rgb(58, 58, 60)',
  labelStyle: {
    fontSize: 12,
    fontFamily: 'HelveticaNeue-Light',
    fontWeight: '400',
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
      screenOptions={({ route, index }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name)
          {
            case 'Dashboard':
              return focused === true ? <ThinFeatherIcon name='clipboard' size={20} color="#1089ff" /> : <ThinFeatherIcon name='clipboard' size={20} color="#212121" />
            case 'Train':
              return focused === true ? <ThinFeatherIcon name='home' size={20} color="#1089ff" /> : <ThinFeatherIcon name='home' size={20} color="#212121" />
            case 'Create':
              return focused === true ? <ThinFeatherIcon name='plus-circle' size={20} color="#1089ff" /> : <ThinFeatherIcon name='plus-circle' size={20} color="#212121" />
          }

        },
        headerShown: false
      })} >
             
             <Tab.Screen name="Train" component={LupaHomeNavigator} />
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
    </Tab.Navigator>
  );
}

export default LupaDrawerNavigator;