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

} from "react-native";

import WelcomeModal from './ui/user/modal/WelcomeModal/WelcomeModal';

import LupaController from './controller/lupa/LupaController';

import {
  logoutUser,
} from './controller/lupa/auth/auth'

import LupaDrawerNavigator from "./ui/navigators/LupaDrawerNavigator";

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
  }

  componentDidMount = async () => {
    this.LUPA_CONTROLLER_INSTANCE.indexApplicationData();
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
      <LupaDrawerNavigator />
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


export default Lupa;
