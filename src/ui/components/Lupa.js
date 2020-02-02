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

import {
  logoutUser
} from '../../controller/lupa/auth'

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
  //  this.LUPA_CONTROLLER_INSTANCE.runAppSetup();
  }

  _showWelcomeModal = async () => {
  AsyncStorage.setItem('isNewUser', 'true');
  let _isNewUser = await AsyncStorage.getItem('isNewUser');
  
  switch(_isNewUser)
  {
    case 'true':
      _isNewUser = true;
      break;
    case 'false':
      _isNewUser = false;
      break;
    default:
      _isNewUser = false;
  }

  this.setState({
    isNewUser: _isNewUser
  })
}

_handleWelcomeModalClose = () => {
  this.setState({ _isNewUser: false })
  AsyncStorage.setItem('isNewUser', 'false');
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
        <WorkoutView logoutMethod={this._navigateToAuth}/>
        <PackView />
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
