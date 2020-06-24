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


import Swiper from 'react-native-swiper';

import Dashboard from './ui/navigators/LupaDrawerNavigator';

import WelcomeModal from './ui/user/modal/WelcomeModal/WelcomeModal';

import LupaController from './controller/lupa/LupaController';
import PackNavigator from './ui/navigators/PackNavigator'
import { createAppContainer } from 'react-navigation';

import {
  logoutUser,
} from './controller/lupa/auth/auth'

import PushNotification from 'react-native-push-notification'
import { connect } from 'react-redux';
import { generateMessagingToken } from "./controller/firebase/firebase";

import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import LupaHomeNavigator from "./ui/navigators/LupaHomeNavigator";

import { createBottomTabNavigator } from 'react-navigation-tabs'
import FeatherIcon from "react-native-vector-icons/Feather";

/**
 * 
 */
mapStateToProps = (state, action) => {
  return {
    lupa_data: state
  }
}

/**
 * 
 */
mapDispatchToProps = dispatch => {
  return {
    updateUser: (currUserData) => {
      dispatch({
        type: 'UPDATE_CURRENT_USER',
        payload: currUserData
      })
    },
    updatePacks: (currUserPacksData) => {
      dispatch({
        type: 'UPDATE_CURRENT_USER_PACKS',
        payload: currUserPacksData,
      })
    },
    updateUserPrograms: (currUserProgramsData) => {
      dispatch({
        type: 'UPDATE_CURRENT_USER_PROGRAMS',
        payload: currUserProgramsData,
      })
    },
    updateLupaWorkouts: (lupaWorkoutsData) => {
      dispatch({
        type: 'UPDATE_LUPA_WORKOUTS',
        payload: lupaWorkoutsData,
      })
    },
    updateLupaAssessments: (lupaAssessmentData) => {
      dispatch({
        type: 'UPDATE_LUPA_ASSESSMENTS',
        payload: lupaAssessmentData
      })
    }
  }
}

const LUPA_SCREENS = ['Programs']

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
      currScreen: ''
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

    /**
   * 
   */
  _updateUserInRedux = (userObject) => {
    this.props.updateUser(userObject);
  }

  /**
   * 
   */
  _updatePacksInRedux = (packsData) => {
    this.props.updatePacks(packsData);
  }

  /**
   * 
   */
  _updateUserHealthDataInRedux = (healthData) => {
    this.props.updateHealthData(healthData);
  }

  /**
   * 
   */
  _updateUserProgramsDataInRedux = (programsData) => {
    this.props.updateUserPrograms(programsData);
  }

  /**
   * 
   */
  _updateLupaWorkoutsDataInRedux = (lupaWorkoutsData) => {
    this.props.updateLupaWorkouts(lupaWorkoutsData);
  }

  /**
   * 
   */
   /**
   * 
   */
  _updateLupaAssessmentDataInRedux = (lupaAssessmentData) => {
    this.props.updateLupaAssessments(lupaAssessmentData);
  }

    /**
   * 
   */
  _setupRedux = async () => {
    let currUserData, currUserPacks, currUserHealthData = {}, currUserPrograms, lupaWorkouts  =[], lupaAssessments=[];
    await this.LUPA_CONTROLLER_INSTANCE.getCurrentUserData().then(result => {
      currUserData = result;
    })

    await this.LUPA_CONTROLLER_INSTANCE.getCurrentUserPacks().then(result => {
      currUserPacks = result;
    })

    await this.LUPA_CONTROLLER_INSTANCE.loadCurrentUserPrograms().then(result => {
      currUserPrograms = result;
    })

    lupaWorkouts = await this.LUPA_CONTROLLER_INSTANCE.loadWorkouts()

    lupaAssessments = await this.LUPA_CONTROLLER_INSTANCE.loadAssessments()


    let userPayload = {
      userData: currUserData,
      healthData: currUserHealthData,
    }


    await this._updatePacksInRedux(currUserPacks);
    await this._updateUserInRedux(userPayload);
    await this._updateUserProgramsDataInRedux(currUserPrograms);
    await this._updateLupaWorkoutsDataInRedux(lupaWorkouts);
    await this._updateLupaAssessmentDataInRedux(lupaAssessments);
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
    else
    {
      await this._setupRedux();
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

disableSwipe = () => {
  this.setState({ swipeable: false })
}

enableSwipe = () => {
  this.setState({ swipeable: true })
}

goToIndex = (index) => {
  this.setState({ currIndex: index})
}

setScreen = (screen) => {
  this.setState({ currScreen: screen})
}

dashboardNavigatorProps = {
  disableSwipe: this.disableSwipe,
  enableSwipe: this.enableSwipe,
  logoutMethod: this._navigateToAuth,
  goToIndex: index => this.goToIndex(index)
}

workoutNavigatorProps = {
  disableSwipe: this.disableSwipe,
  enableSwipe: this.enableSwipe,
  goToIndex: index => this.goToIndex(index)
}

packNavigatorProps = {
  disableSwipe: this.disableSwipe,
  enableSwipe: this.enableSwipe,
  goToIndex: index => this.goToIndex(index)
}

searchNavigatorProps = {
  enableSwipe: this.enableSwipe,
  disableSwipe: this.disableSwipe,
  goToIndex: index => this.goToIndex(index),
  setCurrentScreen: screen => this.setScreen(screen)
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
    showLabel: false,
  },
  adaptive: true,
  lazy: true
}


const styles = StyleSheet.create({
  appContainer: {
    display: 'flex'
  }
});


class LupaBottomTabNavigator extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Navigator />
    )
  }
}

const BottomTabNavigator = createBottomTabNavigator({
 Dashboard: {
    screen: Dashboard,
    navigationOptions: {
      tabBarIcon: ({focused, horizontal, tintColor="#1089ff"}) => <FeatherIcon thin={false} name="clipboard" size={20} color={focused ? tintColor : 'rgb(58, 58, 60)'} />,
    }
  },
  Train:  {
    screen: LupaHomeNavigator,
    navigationOptions: {
      tabBarIcon: ({focused, horizontal, tintColor="#1089ff"})  => <FeatherIcon thin={false} name="activity" size={20} color={focused ? tintColor : 'rgb(58, 58, 60)'}/>
    }
  },
  Community: {
    screen: PackNavigator,
    navigationOptions: {
      tabBarIcon: ({focused, horizontal, tintColor="#1089ff"})  => <FeatherIcon thin={false} name="globe" size={20} color={focused ? tintColor : 'rgb(58, 58, 60)'}/>
    }
  }
}, {
  order: ['Dashboard', 'Train', 'Community'],
  initialRouteName: 'Train',
  ...config
})

const Navigator = createAppContainer(BottomTabNavigator)

//createAppContainer(TabNavigator);

export default connect(mapStateToProps, mapDispatchToProps)(Lupa);
