import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, AppState } from 'react-native';

import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider, useDispatch, useSelector } from 'react-redux';

import { NavigationContainer, useNavigation } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import AuthenticationNavigator from './src/ui/navigators/AuthenticationNavigator';
import Lupa from './src/Lupa';
import SplashScreen from 'react-native-splash-screen'
import { connect } from 'react-redux';
import LupaStore from './src/controller/redux/index';

import LupaController from './src/controller/lupa/LupaController';
import LUPA_DB, { LUPA_AUTH, registerAppWithFCM, generateMessagingToken } from './src/controller/firebase/firebase';
import { getLupaUserStructure, getLupaPackStructure } from './src/controller/firebase/collection_structures';
import { getLupaProgramInformationStructure } from './src/model/data_structures/programs/program_structures';
import CreateProgram from './src/ui/workout/program/createprogram/CreateProgram';
import LupaDrawerNavigator from './src/ui/navigators/LupaDrawerNavigator'
import TrainerInformation from './src/ui/user/modal/WelcomeModal/TrainerInformation';
import PrivateChat from './src/ui/user/chat/PrivateChat';
import WelcomeModal from './src/ui/user/modal/WelcomeModal/WelcomeModal';
import ShareProgramModal from './src/ui/workout/program/modal/ShareProgramModal';
import AccountSettings from './src/ui/user/profile/component/SettingsModal'
import LiveWorkout from './src/ui/workout/modal/LiveWorkout'
import TrainerInsights from './src/ui/user/trainer/TrainerInsights';
import NotificationsView from './src/ui/user/notifications/NotificationsView';
import MessagesView from './src/ui/user/chat/MessagesView';
import LupaCamera from './src/ui/workout/program/createprogram/component/LupaCamera';
import ProfileController from './src/ui/user/profile/ProfileController';
import CreateNewPost from './src/ui/user/profile/modal/CreateNewPost';
import ProfileNavigator from './src/ui/navigators/ProfileNavigator';
import SettingsStackNavigator from './src/ui/navigators/SettingsNavigator';
import CreateWorkout from './src/ui/workout/createworkout/CreateWorkout';
import { localNotificationService } from './src/controller/firebase/service/LocalNotificationsService'
import { fcmService } from './src/controller/firebase/service/FCMService';
import Search from './src/ui/search/Search';


const App = () => {
  return (
    <NavigationContainer>
      <StoreProvider store={LupaStore}>
        <PaperProvider>
          <AppNavigator />
        </PaperProvider>
      </StoreProvider>
    </NavigationContainer>
  )
}

const SwitchNavigator = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()


  const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance()

  const introduceApp = async (uuid) => {
    try {
      //setup redux
      await _setupRedux(uuid)
    } catch (err) {
      SplashScreen.hide()
      showAuthentication()
    }
    SplashScreen.hide()
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
  const _setupRedux = async (uuid) => {
    let currUserData = getLupaUserStructure(), currUserPrograms = [], lupaWorkouts = [];

    // Load user data
    await LUPA_CONTROLLER_INSTANCE.getCurrentUserData(uuid).then(result => {
      currUserData = result;
    })
    let userPayload = {
      userData: currUserData,
      healthData: {}
    }

    await dispatch({ type: 'UPDATE_CURRENT_USER', payload: userPayload })

    // Load user program data if the user is a trainer
    if (currUserData.isTrainer) {
      await LUPA_CONTROLLER_INSTANCE.loadCurrentUserPrograms().then(result => {
        currUserPrograms = result;
      });
  
      await dispatch({ type: 'UPDATE_CURRENT_USER_PROGRAMS', payload: currUserPrograms });
    }

    // Load application workouts
    lupaWorkouts = LUPA_CONTROLLER_INSTANCE.loadWorkouts();
    dispatch({ type: 'UPDATE_LUPA_WORKOUTS', payload: lupaWorkouts });
  }

  useEffect(() => {
    async function getUserAuthState() {
      try {
        await LUPA_AUTH.onAuthStateChanged(user => {
          if (typeof (user) == 'undefined' || user == null) {
            SplashScreen.hide()
            showAuthentication()
            return;
          }
          console.log('A')
          fcmService.createNotificationListeners(onNotification, onOpenNotification);
          console.log('B')
          localNotificationService.configure(onOpenNotification);
          introduceApp(user.uid)
        })
      } catch (err) {
        SplashScreen.hide()
        showAuthentication()
        alert(err)
      }
    }

    function onOpenNotification(notify) {
      console.log('onOpenNotification')
     console.log(notify)
    }
  
    function onNotification(notify) {
      console.log('onNotification')

      const options = {
        soundName: 'default',
        playSound: true,
      }

      console.log(notify)
      localNotificationService.showNotification(
        0,
        notify.notification.title,
        notify.notification.body,
        notify,
        options
      )
    }

    getUserAuthState()

    return () => {
      fcmService.unRegister()
      localNotificationService.unregister()
    }
  }, [])

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" color="#23374d"></ActivityIndicator>
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
    <StackApp.Navigator initialRouteName='Loading' mode="modal" headerMode='none' screenOptions={{
      gestureEnabled: false
    }}>
      <StackApp.Screen name='Loading' component={SwitchNavigator} />
      <StackApp.Screen name='Auth' component={AuthenticationNavigator} />
      <StackApp.Screen name='App' component={Lupa} />
      <StackApp.Screen name="CreateProgram" component={CreateProgram} options={{ animationEnabled: true }} />
      <StackApp.Screen name="CreateWorkout" component={CreateWorkout} options={{ animationEnabled: true }} />
      <StackApp.Screen name="CreatePost" component={CreateNewPost} />
      <StackApp.Screen name="RegisterAsTrainer" component={TrainerInformation} options={{ animationEnabled: true }} />
      <StackApp.Screen name="PrivateChat" component={PrivateChat} />
      <StackApp.Screen name="Onboarding" component={WelcomeModal} />
      <StackApp.Screen name="ShareProgramModal" component={ShareProgramModal} />
      <StackApp.Screen name="Settings" component={SettingsStackNavigator} />
      <StackApp.Screen name="LiveWorkout" component={LiveWorkout} />
      <StackApp.Screen name="TrainerInsights" component={TrainerInsights} />
      <StackApp.Screen name="Profile" component={ProfileNavigator} />
      <StackApp.Screen name="Notifications" component={NotificationsView} />
      <StackApp.Screen name="Messages" component={MessagesView} />
      <StackApp.Screen name="Search" component={Search} />
      <StackApp.Screen name="LupaCamera" component={LupaCamera} initialParams={{ mediaCaptureType: "VIDEO" }} />
    </StackApp.Navigator>
  )
}
export default App;