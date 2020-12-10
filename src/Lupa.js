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
  SafeAreaView,
  StyleSheet,
  AsyncStorage,
  Dimensions,
  Modal,
  View,
  StatusBar,

} from "react-native";
import LupaController from './controller/lupa/LupaController';
import LupaDrawerNavigator from "./ui/navigators/LupaDrawerNavigator";
import BackgroundFetch from 'react-native-background-fetch';
import { connect, useSelector } from 'react-redux'
import LUPA_DB, { generateMessagingToken, requestNotificationPermissions, registerAppWithFCM, } from "./controller/firebase/firebase";
import { fcmService } from './controller/firebase/service/FCMService'
import WelcomeModal from './ui/user/modal/WelcomeModal/WelcomeModal'
import WelcomeContentDriver from "./ui/user/modal/WelcomeContentDriver";
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import getLocationFromCoordinates from './modules/location/mapquest/mapquest'
import Geolocation from '@react-native-community/geolocation';
import LOG from "./common/Logger";
import CreateNewPost from "./ui/user/profile/modal/CreateNewPost";
import PickInterest from "./ui/user/modal/WelcomeModal/PickInterest";
import { Paragraph, Title, Button,} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Onboarding from './ui/user/modal/WelcomeModal/Onboarding'
import Community from "./ui/community/Community";


const mapStateToProps = (state, action) => {
  return {
    lupa_data: state
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateUser: (currUserData) => {
      dispatch({
        type: 'UPDATE_CURRENT_USER',
        payload: currUserData
      })
    },
}
}

class Lupa extends React.Component {
  constructor(props) {
    super(props);
    
    this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    this.state = {
      initialPosition: '',
      lastPosition: '',
      locationPermissionStatus: '',
    }
  }

  async componentDidMount() {
    generateMessagingToken(this.props.lupa_data.Users.currUserData.user_uuid);
    this.LUPA_CONTROLLER_INSTANCE.indexApplicationData();
  }

  render() {
    return (
      <View style={{flex: 1}}>
       <StatusBar barStyle="dark-content" networkActivityIndicatorVisible={true} />
       <LupaDrawerNavigator />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  appContainer: {
    display: 'flex'
  }
});


export default connect(mapStateToProps, mapDispatchToProps)(Lupa);
