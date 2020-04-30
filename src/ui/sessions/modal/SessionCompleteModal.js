import React from 'react';

import {
    Modal,
    Text,
    View,
    SafeAreaView,
    Image
} from 'react-native';

import { Button } from 'react-native-elements';

import LupaController from '../../../controller/lupa/LupaController'


import { withNavigation, NavigationActions, NavigationContext } from 'react-navigation';

import { connect } from 'react-redux';
import { Dialog, Button as MaterialButton, TextInput } from 'react-native-paper';
import { throwIfAudioIsDisabled } from 'expo-av/build/Audio/AudioAvailability';

const mapStateToProps = (state) => {
    return {
        lupa_data: state,
    }
}

class ReviewDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            reviewText: "",
        }

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    }

    handleSubmitReview = async (nextAction) => {
        const DATE_SUBMITTED = new Date();
        let success;

        //handle review submission
        await this.LUPA_CONTROLLER_INSTANCE.addUserSessionReview(this.props.sessionUUID, this.props.userReviewing, this.props.userToReview, this.state.reviewText, DATE_SUBMITTED).then(retVal => {
            success = retVal;
        })


    }

    closeMethod = async () => {
        await this.handleSubmitReview(this.props.action);
        
        if (this.props.action == 'Finish')
        {
            this.props.closeDialogMethod();
        }

        if (this.props.action == 'Request')
        {
            this.props.closeDialogMethod();
            this.props.requestAnotherSessionMethod();
        }
    }

    onChangeText = (text) => {
        this.setState({ reviewText: text })
    }

    render() {
        const action = this.props.action;
        return (
            <Dialog visible={this.props.isVisible}>
        <Dialog.Title>
            Let us know how your session went with {this.props.otherUserDisplayName}.
        </Dialog.Title>
        <Dialog.Content>
            <TextInput mode="outlined" multiline theme={{
                colors: {
                    primary: "#2196F3"
                }
            }} onChangeText={text => this.onChangeText(text)} value={this.state.reviewText}>

            </TextInput>
        </Dialog.Content>
        <Dialog.Actions>
            <MaterialButton mode="text" onPress={this.closeMethod} theme={{
                colors: {
                    primary: "#2196F3"
                }
            }}>
                <Text style={{fontSize: 20}}>
                    Finish Review
                </Text>
            </MaterialButton>
        </Dialog.Actions>
    </Dialog>
        )
    }
}

class SessionCompleteModal extends React.Component {
    static contextType = NavigationContext;
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
                showReviewDialog: false,
                action: "",
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

    handleRequestAnotherSession = async () => {
        await this.props.navigation.dispatch(

            await NavigationActions.navigate({
              routeName: 'Profile',
              params: {userUUID: this.otherUserUUID, navFrom: 'Dashboard'},
              action: NavigationActions.navigate({ routeName: 'Profile', params: {userUUID: this.otherUserUUID, navFrom: 'Dashboard'}})
            })
        )

        await this.props.closeModalMethod();
    }

    handleShowReviewDialogMethod = (action) => {
        this.setState({
            action: action,
            showReviewDialog: true
        })
    }

    handleCloseReviewDialogMethod = (action) => {
        this.setState({
            action: action,
            showReviewDialog: false
        })
    }

    handleReview = (action) => {
        this.handleShowReviewDialogMethod(action);
    }

    /**
     * Finishes the session by launching the review dialog and deleting
     * the session from the UI and firestore.
     */
    handleFinishSession = async () => {
        //remove session from state and delete from database
        //this.LUPA_CONTROLLER_INSTANCE.deleteSessionForUser(this.state.sessionUUID);

        //close dialog
        this.handleCloseReviewDialogMethod();
        
        //close the main modal
         this.props.closeModalMethod();
    }


    render() {
        const navigation = this.context;
        return (
            <Modal 
            visible={this.props.isOpen} 
            style={{margin: 0, display: 'flex', flex: 1}} 
            presentationStyle="fullScreen">
                <SafeAreaView style={{flex: 1, padding: 10, justifyContent: 'space-evenly', marginBottom: 10, marginTop: 10}}>
                <Text style={{alignSelf: 'center', fontFamily: "avenir-book", fontSize: 20, color: "#212121"}}>
                You have completed your session with {this.state.otherUserInformation.display_name}.  Visit their profile to setup another.
            </Text>

            <Image style={{alignSelf: 'center', width: '80%', height: '45%'}} source={{ uri: this.state.otherUserInformation.photo_url }}  />

            <View>
            <Button
  title="Request Another Session"
  type="solid"
  style={{padding: 10, margin: 5}}
  onPress={() => this.handleReview('Request')}
/>

<Button
  title="Finish Session"
  type="outline"
  style={{padding: 10, margin: 5}}
  onPress={() => this.handleReview('Finish')}
/>
            </View>
                </SafeAreaView>
                <ReviewDialog isVisible={this.state.showReviewDialog} sessionUUID={this.state.sessionUUID} userReviewing={this.state.currUserData.user_uuid} userToReview={this.state.otherUserInformation.user_uuid}  action={this.state.action} requestAnotherSessionMethod={this.handleRequestAnotherSession}  closeDialogMethod={this.handleFinishSession} otherUserDisplayName={this.state.otherUserInformation.display_name}/>
        </Modal>
        )
    }
}


export default connect(mapStateToProps)(withNavigation(SessionCompleteModal));