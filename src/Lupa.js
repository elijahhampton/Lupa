/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  22, 2019
 *
 * Lupa App
 */
import React, { useEffect } from "react";
import {
  Text,
  StyleSheet,
  AsyncStorage,
  View,
  StatusBar,

} from "react-native";
import LupaController from './controller/lupa/LupaController';
import LupaDrawerNavigator from "./ui/navigators/LupaDrawerNavigator";
import { connect, useSelector } from 'react-redux'
import { generateMessagingToken } from "./controller/firebase/firebase";
import WelcomeModal from './ui/user/modal/WelcomeModal/WelcomeModal'
import WelcomeContentDriver from "./ui/user/modal/WelcomeContentDriver";

const Lupa = () => {
  /* useEffect(() => {
    //generateMessagingToken(currUserData.user_uuid)
     //LUPA_CONTROLLER_INSTANCE.indexApplicationData()
   }, [])*/

  return (
    <View style={{flex: 1}}>
      <StatusBar barStyle="dark-content" networkActivityIndicatorVisible={true} />
      <LupaDrawerNavigator />
    </View>
  )
}

const styles = StyleSheet.create({
  appContainer: {
    display: 'flex'
  }
});


export default Lupa;
