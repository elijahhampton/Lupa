import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';

import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider, useDispatch} from 'react-redux';

import { NavigationContainer, useNavigation } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import AuthenticationNavigator from './src/ui/navigators/AuthenticationNavigator';
import Lupa from './src/Lupa';

import { connect } from 'react-redux';
import LupaStore from './src/controller/redux/index';

import LupaController from './src/controller/lupa/LupaController';
import { LUPA_AUTH } from './src/controller/firebase/firebase';
import { getLupaUserStructure, getLupaPackStructure } from './src/controller/firebase/collection_structures';
import { getLupaProgramInformationStructure } from './src/model/data_structures/programs/program_structures';
import CreateProgram from './src/ui/workout/program/createprogram/CreateProgram';
import LupaDrawerNavigator from './src/ui/navigators/LupaDrawerNavigator'

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
      <NavigationContainer>
              <StoreProvider store={LupaStore}>
        <PaperProvider>
          <AppNavigator />
        </PaperProvider>
      </StoreProvider>
      </NavigationContainer>
    );
  }
}

const SwitchNavigator = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()

  const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance()

  const introduceApp = async () => {
    console.log('a')
    //setup redux
    await _setupRedux()

    //navigate to app
    navigation.navigate('App')
  }

  const showAuthentication = () => {
    navigation.navigate('Auth')
  }

    /**
   * Sets up redux by loading the current user's data, packs, and programs
   * as well as Lupa application data (assessments, workouts);
   */
  const _setupRedux = async () => {
    let currUserData = getLupaUserStructure(), currUserPacks = getLupaPackStructure(), currUserPrograms = getLupaProgramInformationStructure(), lupaAssessments = [], lupaWorkouts = [];
    
    await LUPA_CONTROLLER_INSTANCE.getCurrentUserData().then(result => {
      currUserData = result;
    })

    console.log('b')
    await LUPA_CONTROLLER_INSTANCE.getCurrentUserPacks().then(result => {
      currUserPacks = result;
    })


    await LUPA_CONTROLLER_INSTANCE.loadCurrentUserPrograms().then(result => {
      currUserPrograms = result;
    })

    console.log('c')

    lupaWorkouts = await LUPA_CONTROLLER_INSTANCE.loadWorkouts();

    lupaAssessments = await LUPA_CONTROLLER_INSTANCE.loadAssessments();

    let userPayload = {
      userData: currUserData,
      healthData: {}
    }

    await dispatch({ type: 'UPDATE_CURRENT_USER', payload: userPayload})
    await dispatch({ type: 'UPDATE_CURRENT_USER_PACKS', payload: currUserPacks})
    await dispatch({ type: 'UPDATE_CURRENT_USER_PROGRAMS', payload: currUserPrograms})
    await dispatch({ type: 'UPDATE_LUPA_WORKOUTS', payload: lupaWorkouts})
    await dispatch({ type: 'UPDATE_LUPA_ASSESSMENTS', payload: lupaAssessments})
    console.log('d')
  }

  useEffect(() => {
      LUPA_AUTH.onAuthStateChanged(user => {
          user ? introduceApp() : showAuthentication()
      })
    }, [])


  return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>Loading...</Text>
          <ActivityIndicator size="large" color="#e9446a"></ActivityIndicator>
      </View>
  )
}

const StackApp = createStackNavigator()

/**
 * Global App Navigator
 * Allows us to access the auth and app screen at a global level and acts as a switch navigator.
 * Allows access to our "global modal" for creating programs.
 */
function AppNavigator() {
  return (
    <StackApp.Navigator initialRouteName='Loading' headerMode='none'>
    <StackApp.Screen name='Loading' component={SwitchNavigator} />
    <StackApp.Screen name='Auth' component={AuthenticationNavigator}/>
    <StackApp.Screen name='App' component={Lupa}/>
    <StackApp.Screen name="CreateProgram" component={CreateProgram} options={{animationEnabled: true}}/>
  </StackApp.Navigator>
  )


}
export default App;