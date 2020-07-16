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

import { connect } from 'react-redux'

const mapStateToProps = (state, action) => {
  return {
    lupa_data: state
  }
}

class Lupa extends React.Component {
  constructor(props) {
    super(props);

    this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
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

  
_navigateToAuth = async () => {
  await logoutUser();
  this.props.navigation.navigate('Auth');
}

  render() {
    return (
      <>
      <StatusBar barStyle="dark-content" networkActivityIndicatorVisible={true} />
      <LupaDrawerNavigator />
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


export default connect(mapStateToProps)(Lupa);
