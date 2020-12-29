import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, AppState, NativeModules } from 'react-native';

import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider, useDispatch, useSelector } from 'react-redux';

import { NavigationContainer, useNavigation } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import AuthenticationNavigator from './src/ui/navigators/AuthenticationNavigator';
import Lupa from './src/Lupa';
import SplashScreen from 'react-native-splash-screen'
import { connect } from 'react-redux';
import UserOnboarding from './src/ui/user/modal/WelcomeModal/UserOnboarding'

import { SafeAreaProvider } from 'react-native-safe-area-context';

import LupaController from './src/controller/lupa/LupaController';
import LUPA_DB, { LUPA_AUTH, registerAppWithFCM, generateMessagingToken, UserAuthenticationHandler } from './src/controller/firebase/firebase';
import { getLupaUserStructure, getLupaPackStructure, getLupaUserStructurePlaceholder } from './src/controller/firebase/collection_structures';
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
import MyData from './src/ui/user/component/MyData';
import PickInterest from './src/ui/user/modal/WelcomeModal/PickInterest';
import CreateCustomWorkoutModal from './src/ui/workout/program/createprogram/buildworkout/modal/CreateCustomWorkoutModal';
import VlogFeedCardExpanded from './src/ui/workout/modal/VlogFeedCardExpanded';
import FollowerModal from './src/ui/user/profile/modal/FollowerModal';
import { LupaUserStructure } from './src/controller/lupa/common/types';
import GuestView from './src/ui/GuestView';
import SignUp from './src/ui/user/login/SignUpView';
import LoginView from './src/ui/user/login/LoginView';
import { getLupaStoreState, LupaStore } from './src/controller/redux/index';
import { verifyAuth, logoutError, logoutUser } from './src/controller/lupa/auth/auth';
import { retrieveAsyncData, storeAsyncData } from './src/controller/lupa/storage/async';
import DeviceInfo from 'react-native-device-info';
import MyClients from './src/ui/user/trainer/MyClients';
import Onboarding from './src/ui/user/modal/WelcomeModal/Onboarding'
import VirtualSession from './src/ui/sessions/virtual/VirtualSession';
import LOG, { LOG_ERROR } from './src/common/Logger';
import PackChat from './src/ui/packs/PackChat';
import { UPDATE_CURRENT_USER_PACKS_ACTION } from './src/controller/redux/actionTypes';
import Achievements from './src/ui/user/Achievements'
import Community from './src/ui/community/Community';
import HourlyPaymentModal from './src/ui/user/modal/HourlyPaymentModal';
import CommunityFeed from './src/ui/community/CommunityFeed';
import CommunityHome from './src/ui/community/CommunityHome';

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
      <StackApp.Screen name="SignUp" component={SignUp} />
      <StackApp.Screen name="Login" component={LoginView} />
      <StackApp.Screen name='App' component={Lupa} />
      <StackApp.Screen name="GuestView" component={GuestView} />
      <StackApp.Screen name="CreateProgram" component={CreateProgram} options={{ animationEnabled: true }} />
      <StackApp.Screen name="CreatePost" component={CreateNewPost} />
      <StackApp.Screen name="RegisterAsTrainer" component={TrainerInformation} options={{ animationEnabled: true }} />
      <StackApp.Screen name="PrivateChat" component={PrivateChat} />
      <StackApp.Screen name="Onboarding" component={Onboarding} />
      <StackApp.Screen name="ShareProgramModal" component={ShareProgramModal} />
      <StackApp.Screen name="Settings" component={SettingsStackNavigator} />
      <StackApp.Screen name="LiveWorkout" component={LiveWorkout} />
      <StackApp.Screen name="TrainerInsights" component={TrainerInsights} />
      <StackApp.Screen name="Profile" component={ProfileController} />
      <StackApp.Screen name="Notifications" component={NotificationsView} />
      <StackApp.Screen name="HourlyPayment" component={HourlyPaymentModal} />
      <StackApp.Screen name="Messages" component={MessagesView} />
      <StackApp.Screen name="PackChat" component={PackChat} />
      <StackApp.Screen name="Search" component={Search} />
      <StackApp.Screen name="MyData" component={MyData} />
      <StackApp.Screen name="LupaCamera" component={LupaCamera} initialParams={{ mediaCaptureType: "VIDEO" }} />
      <StackApp.Screen name="PickInterest" component={PickInterest} initialParams={{ isOnboarding: false }} />
      <StackApp.Screen name="CreateCustomWorkout" component={CreateCustomWorkoutModal} />
      <StackApp.Screen name="VlogContent" component={VlogFeedCardExpanded} />
      <StackApp.Screen name="FollowerView" component={FollowerModal} />
      <StackApp.Screen name="MyClients" component={MyClients} />
      <StackApp.Screen name="VirtualSession" component={VirtualSession} />
      <StackApp.Screen name="Achievements" component={Achievements} />
      <StackApp.Screen name="Community" component={CommunityHome} />
      <StackApp.Screen name="CommunityFeed" component={CommunityFeed} />
      </StackApp.Navigator>
  )
}

const SwitchNavigator = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()

  const [finishedVerifying, setFinishedVerifying] = useState(false);
  const [userHasCompletedOnboarding, setUserHasCompletedOnboarding] = useState(false);

  const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance()

  const introduceApp = async (uuid) => {
    //setup redux
    try {
    await _setupRedux(uuid);
    } catch(error) {
      LOG_ERROR('App.js', 'introduceApp::Caught error trying to setup redux.', error)
      SplashScreen.hide();
      if (LUPA_AUTH.currentUser) {
        logoutUser()
      }

      navigation.navigate('GuestView');
    }
    SplashScreen.hide();

    if (uuid == 0) {
      navigation.navigate('GuestView');
      return;
    }

    const lupaState = getLupaStoreState();

    navigation.navigate('App')
  }

  const handleGuestAccountUUID = async () => {
    let deviceID = undefined;
    retrieveAsyncData('UNIQUE_DEVICE_ID').then(deviceID => {
      deviceID = deviceID;
    });

    if (typeof(deviceID) == 'undefined') {
      const uniqueDeviceID = await DeviceInfo.getUniqueId();
      storeAsyncData('UNIQUE_DEVICE_ID', uniqueDeviceID);
      return uniqueDeviceID;
    } else { 
      return deviceID;
    }
  }

  /**
 * Sets up redux by loading the current user's data, packs, and programs
 * as well as Lupa application data (assessments, workouts);
 */
  const _setupRedux = async (uuid) => {
    const userAuthenticationHandler = new UserAuthenticationHandler();

    let currUserData = getLupaUserStructure(uuid), currUserPrograms = [], currUserPacks = [], lupaWorkouts , userPayload = {}

    //User is not signed in so we let the user continue as a guest
    if (uuid === 0) {
      if (LUPA_AUTH.currentUser) {
        logoutUser()
      }

      const newGuestUUID = await handleGuestAccountUUID();
      await userAuthenticationHandler.signUpUser(newGuestUUID, "", "", "");

      // Load user data
      await LUPA_CONTROLLER_INSTANCE.getCurrentUserData(newGuestUUID).then(result => {
        currUserData = result;
      });

     // await setUserHasCompletedOnboarding(currUserData.has_completed_onboarding);

      userPayload = {
        userData: currUserData,
      }

      await dispatch({ type: 'UPDATE_CURRENT_USER', payload: userPayload });
      await dispatch({ type: 'UPDATE_CURRENT_USER_PROGRAMS', payload: [] });
      await dispatch({ type: UPDATE_CURRENT_USER_PACKS_ACTION, payload: [] })
      return;
    }

    //we have an authenticated user and we shall continue normally
    await LUPA_CONTROLLER_INSTANCE.getCurrentUserData(uuid)
    .then(async result => {
      currUserData = result;
    })

    await LUPA_CONTROLLER_INSTANCE.loadCurrentUserPacks(uuid).then(result => {
      currUserPacks = result;
    });

   // await setUserHasCompletedOnboarding(currUserData.has_completed_onboarding);

    userPayload = {
      userData: currUserData,
    }

    // Load user program data if the user is a trainer
    if (typeof(currUserData) == 'undefined') {
      currUserPrograms = []
    } else {
      if (currUserData.isTrainer) {
        await LUPA_CONTROLLER_INSTANCE.loadCurrentUserPrograms().then(result => {
          currUserPrograms = result;
        });
      }
    }


    await dispatch({ type: 'UPDATE_CURRENT_USER', payload: userPayload });
    await dispatch({ type: 'UPDATE_CURRENT_USER_PROGRAMS', payload: currUserPrograms });
    await dispatch({ type: UPDATE_CURRENT_USER_PACKS_ACTION, payload: currUserPacks })
      
    // Load application workouts
    lupaWorkouts = await LUPA_CONTROLLER_INSTANCE.loadWorkouts();
    await dispatch({ type: 'UPDATE_LUPA_WORKOUTS', payload: lupaWorkouts });
  }

  useEffect(() => {
    
    const getUserAuthState = async () => {
      let isVerifyingAuth = true;
      while (isVerifyingAuth) {
        LOG('App.js', 'getUserAuthState::Attempting to verify user.');
        await dispatch(verifyAuth());
        isVerifyingAuth = getLupaStoreState().Auth.isVerifying;
      }
     
      const updatedAuthState = await getLupaStoreState().Auth;

      if (updatedAuthState.isAuthenticated === true) {
        LOG('App.js', 'getUserAuthState::User is authenticated.. Setting up notification listeners and navigating to app.');
        fcmService.createNotificationListeners(onNotification, onOpenNotification);
        localNotificationService.configure(onOpenNotification);
        introduceApp(updatedAuthState.user.uid)
      } else {
        LOG('App.js', 'getUserAuthState::User unauthenticated.')
        introduceApp(0);
    }
  }

    function onOpenNotification(notify) {
      LOG('App.js', 'onOpenNotification');
    }
  
    function onNotification(notify) {
      LOG('App.js', 'onNotification');

      const options = {
        soundName: 'default',
        playSound: true,
      }

      localNotificationService.showNotification(
        0,
        notify.notification.title,
        notify.notification.body,
        notify,
        options
      )
    }

    try {
    LOG('App.js', 'useEffect::Running useEffect.');
    getUserAuthState()
    } catch(error) {
      LOG_ERROR('App.js', 'useEffect::Caught error trying to fetch auth state.', error)
      SplashScreen.hide();
      if (LUPA_AUTH.currentUser) {
        logoutUser()
      }
      navigation.navigate('GuestView')
    }

    return () => {
      const updatedAuthState = getLupaStoreState().Auth;
      if (updatedAuthState.isAuthenticated) {
        fcmService.unRegister()
        localNotificationService.unregister()
      }
 
    }
  }, [])

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" color="#23374d"></ActivityIndicator>
    </View>
  )
}

export default App;