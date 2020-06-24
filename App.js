import React, { useEffect, useState } from 'react';

/*import {decode, encode} from 'base-64'
if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }*/

import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider} from 'react-redux';

import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import AuthenticationNavigator from './src/ui/navigators/AuthenticationNavigator';
import Lupa from './src/Lupa';

import { connect } from 'react-redux';
import LupaStore from './src/controller/redux/index';

import LupaController from './src/controller/lupa/LupaController';

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
    }
  }
}

class AppNavigator extends React.Component {
  constructor(props) {
    super(props);
      this.state ={
        isLoading: true,
        loggedIn: false,
      }

      this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    }

  render() {
    return (
      <>
      <Navigator />
      </>
    )
  }
}

connect(mapStateToProps, mapDispatchToProps)(AppNavigator);

const Navigator = createAppContainer(
  createSwitchNavigator(
    {
      Auth: {
        screen: AuthenticationNavigator,
        navigationOptions: ({ navigation }) => ({
          title: "Auth",
          header: null,
          gesturesEnabled: false,
        })
      },
      App: {
        screen: Lupa,
        navigationOptions: ({ navigation }) => ({
          title: "App",
          header: null,
          gesturesEnabled: false,
        })
      },
    },
  )
);

class App extends React.Component {
  constructor(props) {
    super(props);

    this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
  }

  componentDidMount = async () => {
    await this.setupApp();
  }
  
  setupApp = async () => {
    await this.LUPA_CONTROLLER_INSTANCE.runAppSetup();
  }

  render() {
    return (
      <StoreProvider store={LupaStore}>
        <PaperProvider>
          <AppNavigator />
        </PaperProvider>
      </StoreProvider>
    );
  }
}

export default App;
