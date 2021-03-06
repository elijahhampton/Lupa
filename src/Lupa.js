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
import { connect, useSelector } from 'react-redux'
import LUPA_DB, { generateMessagingToken, requestNotificationPermissions, registerAppWithFCM, } from "./controller/firebase/firebase";
import UserOnboarding from './ui/user/modal/WelcomeModal/UserOnboarding'
import TrainerOnboarding from './ui/user/modal/WelcomeModal/TrainerOnboarding';
import {Avatar} from 'react-native-elements';
import WelcomeLupaIntroduction from "./ui/user/modal/WelcomeModal/WelcomeLupaIntroduction";
import HourlyPaymentModal from "./ui/user/modal/HourlyPaymentModal";
import RequestCommunity from './ui/community/RequestCommunity'; 
import MatchMe from "./ui/packs/modal/MatchMe";
import ExerciseDataLog from "./ui/workout/modal/ExerciseDataLog";
import HowToUseLupa from "./ui/user/settings/modal/HowToUseLupa";
import { Linking } from "react-native";
import CreateCustomExercise from "./ui/workout/modal/CreateCustomExercise";
import BuildWorkoutController from "./ui/workout/program/createprogram/buildworkout/BuildWorkoutController";
import { getLupaProgramInformationStructure } from "./model/data_structures/programs/program_structures";
import InPersonWorkout from "./ui/workout/component/InPersonWorkout";
import { LIVE_WORKOUT_MODE } from "./model/data_structures/workout/types";
import TrainerQRCode from "./ui/user/profile/component/TrainerQRCode";
import ProgramInformationPreview from "./ui/workout/program/ProgramInformationPreview";
import PublishProgram from "./ui/workout/program/createprogram/component/PublishProgram";
import ParQAssessment from "./ui/user/dashboard/components/ParQAssessment";
import GymOnboarding from "./ui/user/modal/WelcomeModal/GymOnboarding";
import CommunityHome from "./ui/community/CommunityHome";

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

  renderAppropriateView() {
    const { currUserData } = this.props.lupa_data.Users;

    if (currUserData.account_type == 'gym') {
      return <CommunityHome communityData={this.props.lupa_data.Users.currUserData} />
    } else {
      return <LupaDrawerNavigator />
    }

  }

  render() {
    return (
      <View style={{flex: 1}}>
       <StatusBar barStyle="dark-content" networkActivityIndicatorVisible={true} />
       {this.renderAppropriateView()}
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
