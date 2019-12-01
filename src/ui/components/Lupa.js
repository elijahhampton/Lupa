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
  AsyncStorage
} from "react-native";

import WorkoutView from './MainViews/WorkoutView';
import SearchView from './MainViews/search/SearchView';
import PackView from './MainViews/Packs/PackView';

import Swiper from 'react-native-swiper';

import Dashboard from './Navigators/LupaDrawerNavigator';

import WelcomeModal from './Modals/WelcomeModal/WelcomeModal'

import _getPermissionsAsync from '../../controller/lupa/permissions/permissions';

class Lupa extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currIndex: 1,
      isNewUser: false,
    }

    this._showWelcomeModal = this._showWelcomeModal.bind(this);
  }

  componentDidMount = () => {
    this._showWelcomeModal();
    _getPermissionsAsync();
  }

  _showWelcomeModal = async () => {
  AsyncStorage.setItem('isNewUser', 'false');
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
  
  render() {
    const currIndex = this.state.currIndex;
    return (
      <>
        <Swiper style={styles.appContainer}
          loop={false}
          showButtons={false}
          showsPagination={false}
          index={currIndex}>
        <Dashboard />
        <WorkoutView />
        <PackView />
        <SearchView />
      </Swiper>
      <WelcomeModal isVisible={this.state.isNewUser} />
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
