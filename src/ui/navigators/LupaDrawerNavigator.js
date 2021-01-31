
import React from 'react';
import {
  View,
  Dimensions,
} from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer';

import DrawerMenu from './Components/DrawerMenu';
import ProfileNavigator from './ProfileNavigator';
import Feather1s from 'react-native-feather1s'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardNavigator from './DashboardNavigator';
import LupaHomeNavigator from './LupaHomeNavigator';
import Search from '../search/Search';
import { useSelector } from 'react-redux';
import NotificationsView from '../user/notifications/NotificationsView';
import MessagesView from '../user/chat/MessagesView'
import { Constants } from 'react-native-unimodules';

const Drawer = createDrawerNavigator();

function LupaDrawerNavigator() {
  return (
          <Drawer.Navigator 
          initialRouteName="Lupa" 
          drawerPosition="left" 
        
          drawerStyle={{width: Dimensions.get('window').width}}
          drawerContent={(props) => <DrawerMenu {...props}  />}
          screenOptions={{
            gestureEnabled:false,
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

const ACTIVE_COLOR = "rgb(34, 74, 115)"
const INACTIVE_COLOR = "#A0A0A0"

function LupaBottomTabNavigator() {
  const currUserData = useSelector(state => {
    return state.Users.currUserData
  })

  const tabBarOptions = {
    showLabel: false,
    activeTintColor: ACTIVE_COLOR,
    inactiveTintColor: INACTIVE_COLOR,
    animationsEnabled: true,
    labelStyle: {
      fontSize: 12,
      fontFamily: 'Avenir-Light',
      fontWeight: '400',
    },
    style: {
      backgroundColor: '#FFFFFF',
      borderTopWidth: 1,
      height: 75,
      backgroundColor: '#EEEEEE',
    },
  }


  return (
    <Tab.Navigator 
    tabBarOptions={tabBarOptions}
      initialRouteName="Train"
      screenOptions={({ route, index }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name)
          {
            case 'Search':
              return focused === true ? <FeatherIcon name='search' size={25} color={ACTIVE_COLOR} /> : <Feather1s name='search' size={25} color={INACTIVE_COLOR} />
            case 'Dashboard':
              return focused === true ? <FeatherIcon name='clipboard' size={25} color={ACTIVE_COLOR}/> : <Feather1s name='clipboard' size={25} color={INACTIVE_COLOR} />
            case 'Train':
              return focused === true ? <FeatherIcon name='home' size={25} color={ACTIVE_COLOR} /> : <Feather1s name='home' size={25} color={INACTIVE_COLOR} />
            case 'Create':
              return focused === true ? <FeatherIcon name='plus-circle' size={25} color={ACTIVE_COLOR} /> : <Feather1s name='plus-circle' size={25} color={INACTIVE_COLOR} />
          }

        },
        headerShown: false
      })} >
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

              <Tab.Screen name="Train" component={LupaHomeNavigator} />
             

<Tab.Screen name="Search" component={Search} initialParams={{categoryToSearch: undefined}} />

       
           

            <Tab.Screen name="Dashboard" component={DashboardNavigator} />
    </Tab.Navigator>
  );
}

export default LupaDrawerNavigator;