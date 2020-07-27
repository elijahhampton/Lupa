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
  StatusBar,

} from "react-native";

import LupaController from './controller/lupa/LupaController';

import LupaDrawerNavigator from "./ui/navigators/LupaDrawerNavigator";

import { connect, useSelector } from 'react-redux'
import { generateMessagingToken } from "./controller/firebase/firebase";

const Lupa = () => {
  const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
  const currUserData = useSelector(state => {
    return state.Users.currUserData
  })

  useEffect(() => {
   generateMessagingToken(currUserData.user_uuid)
    LUPA_CONTROLLER_INSTANCE.indexApplicationData()
  }, [])

  return (
    <>
    <StatusBar barStyle="dark-content" networkActivityIndicatorVisible={true} />
    <LupaDrawerNavigator />
    </>
  )
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


export default Lupa;
