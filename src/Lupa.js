/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  22, 2019
 * 
 * Lupa App
 */
import React from "react";

import {
  Text,
  StyleSheet,
  AsyncStorage,
  StatusBar,
  View,
  Dimensions,
} from "react-native";

import Dashboard from './ui/navigators/LupaDrawerNavigator';

import WelcomeModal from './ui/user/modal/WelcomeModal/WelcomeModal';

import LupaController from './controller/lupa/LupaController';
import PackNavigator from './ui/navigators/PackNavigator'
import ProfileNavigator from './ui/navigators/ProfileNavigator'
import CreateProgram from './ui/workout/program/createprogram/CreateProgram'

import {
  logoutUser,
} from './controller/lupa/auth/auth'

import PushNotification from 'react-native-push-notification'
import { connect } from 'react-redux';
import { generateMessagingToken } from "./controller/firebase/firebase";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import LupaHomeNavigator from "./ui/navigators/LupaHomeNavigator";

import FeatherIcon from "react-native-vector-icons/Feather";

class Lupa extends React.Component {
  constructor(props) {
    super(props);

    this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    this.currUserUUID = this.LUPA_CONTROLLER_INSTANCE.getCurrentUser().uid;
    this.lupaSwiper = React.createRef();

    this.state = {
      currIndex: 1,
      isNewUser: false,
      ready: false,
      swipeable: true,
      permissions: null,
    }

    this._showWelcomeModal = this._showWelcomeModal.bind(this);
    this._showWelcomeModal();

    PushNotification.configure({
      // (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {

        console.log('LOCAL NOTIFICATION ==>', notification)
      },
    popInitialNotification: true,
      requestPermissions: false,
    })

    generateMessagingToken(); //Remove this if it generates the tokens .. keep for now
  }

  componentDidMount = async () => {
    this.LUPA_CONTROLLER_INSTANCE.indexApplicationData();
    await generateMessagingToken();
  }

  _showWelcomeModal = async () => {
    let _isNewUser;
    await AsyncStorage.getItem(`${this.currUserUUID}_` + 'isNewUser').then(result => {
      _isNewUser = result;
    });

    if (_isNewUser != 'false')
    {
      await this.setState({
        isNewUser: true
      })
    }

}

_handleWelcomeModalClose = async () => {
  await this.setState({ isNewUser: false })
  await AsyncStorage.setItem(`${this.currUserUUID}_` + 'isNewUser', 'false');
}
  
_navigateToAuth = async () => {
  await logoutUser();
  this.props.navigation.navigate('Auth');
}
  render() {
    return (
      <>
      <StatusBar barStyle="dark-content" networkActivityIndicatorVisible={true} />
      <LupaBottomTabNavigator />
      <WelcomeModal isVisible={this.state.isNewUser} closeModalMethod={this._handleWelcomeModalClose}/> 
      </>
    );
  }
}

const config = {
  tabBarOptions: {
    activeTintColor: '#1089ff',
    inactiveTintColor: 'rgb(58, 58, 60)',
    labelStyle: {
      fontSize: 12,
      fontWeight: '400',
    },
    style: {
    },
    labelPosition: 'below icon',
    showIcon: true,
    showLabel: true,
  },
  adaptive: true,
  lazy: true
}


const styles = StyleSheet.create({
  appContainer: {
    display: 'flex'
  }
});

const Tab = createBottomTabNavigator();

const PlaceHolder = () => {
  return (
    <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>

    </View>
  )
}

function LupaBottomTabNavigator() {
  return (
    <Tab.Navigator 
      initialRouteName="Train"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name)
          {
            case 'Dashboard':
              return <FeatherIcon name='clipboard' size={20} color="#212121" />;
            case 'Train':
              return <FeatherIcon name='activity' size={20} color="#212121" />;
            case 'Create':
              return <FeatherIcon name='plus-circle' size={20} color="#212121"/>;
            case 'Community':
              return <FeatherIcon name='globe' size={20} color="#212121" />;
            case 'Profile':
              return <FeatherIcon name='user' size={20} color='#212121' />;
          }

        },
      })} >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Train" component={LupaHomeNavigator} />
      <Tab.Screen name="Create" component={PlaceHolder} options={{animationsEnabled: true}} listeners={({ navigation }) => ({
          tabPress: event => {
            event.preventDefault()
            navigation.navigate('CreateProgram')
          }
        })}  />
      <Tab.Screen name="Community" component={PackNavigator} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  );
}

export default Lupa;
