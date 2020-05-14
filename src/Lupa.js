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
import SearchNavigator from "./ui/navigators/SearchNavigator";
import PackNavigator from './ui/navigators/PackNavigator'

import {
  logoutUser
} from './controller/lupa/auth/auth'

import WorkoutViewNavigator from "./ui/navigators/WorkoutViewNavigator";

import PushNotification from 'react-native-push-notification'

import loadFonts from './ui/common/Font/index'

import { connect } from 'react-redux';
import RemotePushController from "./modules/push-notifications";
import { generateMessagingToken } from "./controller/firebase/firebase";

import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

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
        alert('Received a notification.. need to handle it')
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
    let currUserData, currUserPacks, currUserHealthData, currUserPrograms, lupaWorkouts, lupaAssessments;
    await this.LUPA_CONTROLLER_INSTANCE.getCurrentUserData().then(result => {
      currUserData = result;
    })

    await this.LUPA_CONTROLLER_INSTANCE.getCurrentUserPacks().then(result => {
      currUserPacks = result;
    })

    await this.LUPA_CONTROLLER_INSTANCE.getCurrentUserHealthData().then(result => {
      currUserHealthData = result;
    });

    await this.LUPA_CONTROLLER_INSTANCE.loadCurrentUserPrograms().then(result => {
      currUserPrograms = result;
    })

    await this.LUPA_CONTROLLER_INSTANCE.loadWorkouts().then(result => {
      lupaWorkouts = result;
    });

    await this.LUPA_CONTROLLER_INSTANCE.loadAssessments().then(result => {
      lupaAssessments = result;
    })


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
  alert(screen)
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

showBottomNavigator = () => {
  return LUPA_SCREENS.includes(this.state.currScreen) ?
  null
  :
  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', backgroundColor: 'white', width: Dimensions.get('window').width, height: '10%'}}>
  <View style={{
    width: 'auto', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#BDBDBD', 
    padding: 5, 
    borderRadius: 20}}>
    <MaterialIcon name="dashboard" size={20} style={{margin: 3}} />
    <Text style={{fontFamily: 'ARSMaquettePro-Medium'}}>
      Dashboard
    </Text>
  </View>

  <View style={{
    width: 'auto', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#BDBDBD', 
    padding: 5, 
    borderRadius: 20}}>
    <MaterialIcon name="home" size={20} style={{margin: 3}} />
    <Text style={{fontFamily: 'ARSMaquettePro-Medium'}}>
      Home
    </Text>
  </View>

  <View style={{
    width: 'auto', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#BDBDBD', 
    padding: 5, 
    borderRadius: 20}}>
    <MaterialIcon name="people" size={20} style={{margin: 3}} />
    <Text style={{fontFamily: 'ARSMaquettePro-Medium'}}>
      Community
    </Text>
  </View>
</View>
}


  render() {
    return (
      <>
      <StatusBar backgroundColor="blue" barStyle="dark-content" networkActivityIndicatorVisible={true} />
        <Swiper style={styles.appContainer}
          loop={false}
          showButtons={false}
          showsPagination={false}
          index={this.state.currIndex}
          scrollEnabled={this.state.swipeable}
          onIndexChanged={index => console.log('Swiper index changed to: ', index)}
          >
        <Dashboard screenProps={this.dashboardNavigatorProps} />
        <SearchNavigator screenProps={this.searchNavigatorProps}/>
        <PackNavigator screenProps={this.packNavigatorProps}/>
      </Swiper>
      <WelcomeModal isVisible={this.state.isNewUser} closeModalMethod={this._handleWelcomeModalClose}/>
      </>
    );
  }
}


const styles = StyleSheet.create({
  appContainer: {
    display: 'flex'
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Lupa);
