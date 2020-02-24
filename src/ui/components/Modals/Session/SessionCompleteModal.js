import React from 'react';

import {
    Modal,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl
} from 'react-native';

import {
    Button,
    Caption,
    Surface,
    Avatar,
    Headline
} from 'react-native-paper';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}


import LupaController from '../../../../controller/lupa/LupaController';

import { connect } from 'react-redux';

class SessionCompleteModal extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
        
        this.state = {
            sessionData: {},
                sessionUUID: this.props.sessionUUID,
                currUserData: this.props.lupa_data.Users.currUserData,
                otherUserInformation: {},
                userWhoRequestedData: {},
                userWhoReceivedRequestData: {},
                timePeriods: [],
                availableTimes: [],
                sessionDate: "",
                refreshing: false,
        }
    }

    componentDidMount = async () => {
        await this.setupSessionData();
    }

    async setupSessionData() {
        let sessionDataIn, otherUserInformationIn, userWhoRequestedDataIn, userWhoReceivedRequestDataIn;
        
        await this.LUPA_CONTROLLER_INSTANCE.getSessionInformationByUUID(this.props.sessionUUID).then(sessionData => {
           sessionDataIn = sessionData;
        })

        await this.setState({ sessionData: sessionDataIn })
        await this.LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(sessionDataIn.attendeeOne).then(userData => {
            userWhoRequestedDataIn = userData;
        })
        await this.LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(sessionDataIn.attendeeTwo).then(userData => {
            userWhoReceivedRequestDataIn = userData;
        })
     //Get the user uuids for this session.
      const userUUIDS = [sessionDataIn.attendeeOne, sessionDataIn.attendeeTwo];
      //Get the other user UUIDS information
      let currUserIndex;
      //Find the uuid for the current user
      if (this.state.currUserData.user_uuid == userUUIDS[0] ? currUserIndex = 0 : currUserIndex = 1);
      //Assign the other uuid to the other user
      if (currUserIndex == 0 ? this.otherUserUUID = userUUIDS[1] : this.otherUserUUID = userUUIDS[0]);
      //Get the other user information
      await this.LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(this.otherUserUUID).then(otherUserInformation => {
          otherUserInformationIn = otherUserInformation;
      })
      //Set the state for the other user information and the session information
      await this.setState({ 
        sessionData: sessionDataIn, 
        otherUserInformation: otherUserInformationIn, 
        userWhoRequestedData: userWhoRequestedDataIn, 
        userWhoReceivedRequestData: userWhoReceivedRequestDataIn,
        timePeriods: this.state.sessionData.time_periods,
        availableTimes: userWhoReceivedRequestDataIn.preferred_workout_times,
        sessionDate: this.state.sessionData.date,
    });
    }

    updateSessionData = async () => {
        let sessionDataIn;
        
        await this.LUPA_CONTROLLER_INSTANCE.getSessionInformationByUUID(this.state.sessionUUID).then(sessionData => {
            sessionDataIn = sessionData;
         })

        await this.setState({ sessionData: sessionDataIn, timePeriods: sessionDataIn.time_periods });
    }

    handleOnRefresh = async () => {
        await this.setState({ refreshing: true });
        await this.updateSessionData().then(() => {
            this.setState({ refreshing: false });
        })
    }

    render() {
        return (
            <Modal visible={this.props.isOpen} style={{flex: 1, alignItems: "center", justifyContent: 'center'}} presentationStyle="fullScreen">
            <Text style={{alignSelf: 'center', fontWeight: '20', fontWeight: 'bold'}}>
                You have completed your session with {this.state.otherUserInformation.display_name}.  Visit their profile to setup another.
            </Text>

            <Button title="Exit" onPress={() => this.props.closeModalMethod()}/>
        </Modal>
        )
    }
}

export default connect(mapStateToProps)(SessionCompleteModal);