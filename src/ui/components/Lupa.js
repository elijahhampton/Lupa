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

import WorkoutView from './MainViews/workout/WorkoutView';
import PackView from './MainViews/Packs/PackView';

import Swiper from 'react-native-swiper';

import Dashboard from './Navigators/LupaDrawerNavigator';

import WelcomeModal from './Modals/WelcomeModal/WelcomeModal'

import LupaController from '../../controller/lupa/LupaController';
import SearchNavigator from "./Navigators/SearchNavigator";
import PackNavigator from './Navigators/PackNavigator';

import {
  logoutUser
} from '../../controller/lupa/auth'
import WorkoutViewNavigator from "./Navigators/WorkoutViewNavigator";

class Lupa extends React.Component {
  constructor(props) {
    super(props);

    this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    this.state = {
      currIndex: 1,
      isNewUser: false,
    }

    this._showWelcomeModal = this._showWelcomeModal.bind(this);
  }

  componentDidMount = () => {
    this._showWelcomeModal();
   this.LUPA_CONTROLLER_INSTANCE.runAppSetup();
  }

  _showWelcomeModal = async () => {
  let _isNewUser;
  await AsyncStorage.getItem('isNewUser').then(result => {
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
  await this.setState({ isNewUser: false })
  await AsyncStorage.setItem('isNewUser', 'false');
}
  
_navigateToAuth = async () => {
  await logoutUser();
  this.props.navigation.navigate('Auth');
}



  render() {
    const currIndex = this.state.currIndex;
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
