/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  22, 2019
 * 
 * Lupa App
 */
import React from "react";

import {
  StyleSheet,
  AsyncStorage,
  StatusBar
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
import { AppLoading } from "expo";

class Lupa extends React.Component {
  constructor(props) {
    super(props);

    this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    this.state = {
      currIndex: 1,
      isNewUser: false,
      ready: false,
    }

    this._showWelcomeModal = this._showWelcomeModal.bind(this);
  }

  componentDidMount = async () => {
    console.log('did mount..');
    await this._showWelcomeModal();
  }

  _showWelcomeModal = async () => {
  const user_uuid = await this.LUPA_CONTROLLER_INSTANCE.getCurrentUser().uid;
  let _isNewUser;
  await AsyncStorage.getItem(`${user_uuid}_` + 'isNewUser').then(result => {
    _isNewUser = result;
  })
  
  switch(_isNewUser)
  {
    case 'true':
      _isNewUser = true;
      break;
    case 'false':
      _isNewUser = false;
      break;
    default:
      _isNewUser = true;
  }

  await this.setState({
    isNewUser: _isNewUser
  })
}

_handleWelcomeModalClose = async () => {
  const user_uuid = await this.LUPA_CONTROLLER_INSTANCE.getCurrentUser().uid;
  await this.setState({ isNewUser: false })
  await AsyncStorage.setItem(`${user_uuid}_` + 'isNewUser', 'false');
}
  
_navigateToAuth = async () => {
  await logoutUser();
  this.props.navigation.navigate('Auth');
}


_onStartAsync = async () => {
  const { params } = this.props.navigation.state;
  await params._setupRedux();
  await this.LUPA_CONTROLLER_INSTANCE.runAppSetup();
}

_onFinishLoading = () => {
  this.setState({
    ready: true,
  })
}

_onErrorLoading = () => {

}



  render() {
    const currIndex = this.state.currIndex;

    if (!this.state.ready)
    {
      return (
        <AppLoading 
        startAsync={this._onStartAsync}
        onFinish={this._onFinishLoading}
        onError={this._onErrorLoading}
        />
      );
    }

    return (
      <>
        <StatusBar backgroundColor="blue" barStyle="dark-content" />
        <Swiper style={styles.appContainer}
          loop={false}
          showButtons={false}
          showsPagination={false}
          index={currIndex}>
        <Dashboard />
        <WorkoutViewNavigator />
        <PackNavigator />
        <SearchNavigator />
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

export default Lupa;
