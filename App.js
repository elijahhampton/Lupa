import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
  import { ActivityIndicator, View, Text, Button, SafeAreaView } from 'react-native';

import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider, useDispatch, useSelector} from 'react-redux';

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
import TrainerInformation from './src/ui/user/modal/WelcomeModal/TrainerInformation';
import PrivateChat from './src/ui/user/chat/PrivateChat';
import WelcomeModal from './src/ui/user/modal/WelcomeModal/WelcomeModal';
import ShareProgramModal from './src/ui/workout/program/modal/ShareProgramModal';
import AssessmentView from './src/ui/user/dashboard/component/LupaJournal/Views/AssessmentView';
import AccountSettings from './src/ui/user/profile/component/SettingsModal'

class App extends React.Component {
  constructor(props) {
    super(props);

   this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
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

  const introduceApp = async (uuid) => {
    try {
      console.log('a')

      //setup redux
      await _setupRedux(uuid)
  
      //navigate to app
      navigation.navigate('App')
    } catch(err) {
      alert(err)
      alert(err)
      showAuthentication()
    }
  }

  const showAuthentication = () => {
    navigation.navigate('Auth')
  }

    /**
   * Sets up redux by loading the current user's data, packs, and programs
   * as well as Lupa application data (assessments, workouts);
   */
  const _setupRedux = async (uuid) => {
    let currUserData = getLupaUserStructure(), currUserPacks = [], currUserPrograms = [], lupaAssessments = [], lupaWorkouts = [];
    
    await LUPA_CONTROLLER_INSTANCE.getCurrentUserData(uuid).then(result => {
      currUserData = result;
    })

    await LUPA_CONTROLLER_INSTANCE.getCurrentUserPacks().then(result => {
      currUserPacks = result;
    })


    await LUPA_CONTROLLER_INSTANCE.loadCurrentUserPrograms().then(result => {
      currUserPrograms = result;
    })

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
  }

  useEffect(() => {
      
    /*  async function getUserAuthState() {
        try {
        await LUPA_AUTH.onAuthStateChanged(user => {
          if (typeof(user.uid) == 'undefined') {
            showAuthentication()
          }
          
          introduceApp(user.uid)
      })
    } catch(err) {
      showAuthentication()
      alert(err)
    }
      }

      getUserAuthState()*/

      showAuthentication()
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
    <StackApp.Navigator initialRouteName='Loading' headerMode='none' screenOptions={{
      gestureEnabled: false
    }}>
    <StackApp.Screen name='Loading' component={SwitchNavigator} />
    <StackApp.Screen name='Auth' component={AuthenticationNavigator}/>
    <StackApp.Screen name='App' component={Lupa}/>
    <StackApp.Screen name="CreateProgram" component={CreateProgram} options={{animationEnabled: true}}/>
    <StackApp.Screen name="RegisterAsTrainer" component={TrainerInformation} options={{animationEnabled: true}}/>
    <StackApp.Screen name="PrivateChat" component={PrivateChat} />
    <StackApp.Screen name="Onboarding" component={WelcomeModal}/>
    <StackApp.Screen name="ShareProgramModal" component={ShareProgramModal} />
    <StackApp.Screen name="AccountSettings" component={AccountSettings} />
  </StackApp.Navigator>
  )


}
 export default App;