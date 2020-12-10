
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
import NotificationsView from '../user/notifications/NotificationsView';
import MessagesView from '../user/chat/MessagesView'

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

function LupaBottomTabNavigator() {
  const currUserData = useSelector(state => {
    return state.Users.currUserData
  })

  const INACTIVE_COLOR = "#212121"

  const tabBarOptions = {
    showLabel: false,
    activeTintColor: '#1089ff',
    inactiveTintColor: INACTIVE_COLOR,
    labelStyle: {
      fontSize: 12,
      fontFamily: 'Avenir-Light',
      fontWeight: '400',
    }
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
            case 'Dashboard':
              return focused === true ? <FeatherIcon name='clipboard' size={20} color="#1089ff" /> : <FeatherIcon name='clipboard' size={20} color={INACTIVE_COLOR} />
            case 'Train':
              return focused === true ? <FeatherIcon name='home' size={20} color="#1089ff" /> : <FeatherIcon name='home' size={20} color={INACTIVE_COLOR} />
            case 'Create':
              return focused === true ? <FeatherIcon name='plus-circle' size={20} color="#1089ff" /> : <FeatherIcon name='plus-circle' size={20} color={INACTIVE_COLOR} />
              case 'Alerts':
              return focused === true ? <FeatherIcon name='bell' size={20} color="#1089ff" /> : <FeatherIcon name='bell' size={20} color={INACTIVE_COLOR} />
              case 'Inbox':
              return focused === true ? <FeatherIcon name='message-square' size={20} color="#1089ff" /> : <FeatherIcon name='message-square' size={20} color={INACTIVE_COLOR} />
          }

        },
        headerShown: false
      })} >
             
             <Tab.Screen name="Train" component={LupaHomeNavigator} />
             <Tab.Screen name="Inbox" component={MessagesView} />
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
              <Tab.Screen name="Alerts" component={NotificationsView} />
            <Tab.Screen name="Dashboard" component={DashboardNavigator} />
    </Tab.Navigator>
  );
}

export default LupaDrawerNavigator;