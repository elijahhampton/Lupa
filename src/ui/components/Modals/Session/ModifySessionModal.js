import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    DatePickerIOS,
    RefreshControl
} from 'react-native';
import { 
    IconButton,
    TextInput,
    Modal,
    Portal,
    Button,
    Caption,
    Headline,
    Surface,
    Avatar
} from 'react-native-paper';

import { Container, Header, Left, Body, Right, Icon, Title } from 'native-base';

import LupaController from '../../../../controller/lupa/LupaController';

import { connect } from 'react-redux';

import { SESSION_STATUS } from '../../../../controller/lupa/common/types';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

var otherUUID;

class ModifySessionModal extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
        this.currUserUUID = null;
        this.otherUserUUID = null;

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
            updatedTimePeriods: false,
            refreshing: false,
        }
    }

    componentDidMount = async () => {
        console.log('starting now')
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

    showTimes = () => {
        let date = this.state.sessionDate;
        let dateParts = date.split('-');
        let month = dateParts[0], day = dateParts[1], year = dateParts[2];
        let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        let dayOfTheWeek = days[new Date(month + " " + day + "," + " " + year).getDay()];

        console.log(dayOfTheWeek)

        if (this.state.currUserData.user_uuid == this.state.userWhoRequestedData.user_uuid)
        {
            switch(dayOfTheWeek)
            {
                case 'Monday':
                    return this.state.availableTimes.Monday.map(time => {
                        let indexOfTime = this.state.availableTimes.Monday.indexOf(time);
                        if (this.state.timePeriods.includes(time))
                        {
                            return <Button mode="outlined" key={time} color="#2196F3" onPress={() => {this.LUPA_CONTROLLER_INSTANCE.updateSession(this.state.sessionUUID, 'time_periods', time, indexOfTime)}}>
                            {time}
                        </Button>
                        }
                        else
                        {
                            return <Button mode="text" key={time} color="#2196F3" onPress={() => alert(time)}>
                            {time}
                        </Button>
                        }
                    });
                    break;
                case 'Tuesday':
                    return this.state.availableTimes.Tuesday.map(time => {
                        let indexOfTime = this.state.availableTimes.Tuesday.indexOf(time);
                        if (this.state.timePeriods.includes(time))
                        {
                            return <Button mode="outlined" key={time} color="#2196F3" onPress={() => alert(time)}>
                            {time}
                        </Button>
                        }
                        else
                        {
                            return <Button mode="text" key={time} color="#2196F3" onPress={() => alert(time)}>
                            {time}
                        </Button>
                        }
                    });
                    break;
                case 'Wednesday':
                    return this.state.availableTimes.Wednesday.map(time => {
                        let indexOfTime = this.state.availableTimes.Wednesday.indexOf(time);
                        if (this.state.timePeriods.includes(time))
                        {
                            return <Button mode="outlined" key={time} color="#2196F3" onPress={() => alert(time)}>
                            {time}
                        </Button>
                        }
                        else
                        {
                            return <Button mode="text" key={time} color="#2196F3" onPress={() => alert(time)}>
                            {time}
                        </Button>
                        }
                    });
                    break;
                case 'Thursday':
                    return this.state.availableTimes.Thursday.map(time => {
                        let indexOfTime = this.state.availableTimes.Thursday.indexOf(time);
                        if (this.state.timePeriods.includes(time))
                        {
                            return <Button mode="outlined" key={time} color="#2196F3" onPress={() => alert(time)}>
                            {time}
                        </Button>
                        }
                        else
                        {
                            return <Button mode="text" key={time} color="#2196F3" onPress={() => alert(time)}>
                            {time}
                        </Button>
                        }
                    });
                    break;
                case 'Friday':
                    return this.state.availableTimes.Friday.map(time => {
                        let indexOfTime = this.state.availableTimes.Friday.indexOf(time);
                        if (this.state.timePeriods.includes(time))
                        {
                            return <Button mode="outlined" key={time} color="#2196F3" onPress={() => alert(time)}>
                            {time}
                        </Button>
                        }
                        else
                        {
                            return <Button mode="text" key={time} color="#2196F3" onPress={() => alert(time)}>
                            {time}
                        </Button>
                        }
                    });
                    break;
                case 'Saturday':
                    return this.state.availableTimes.Saturday.map(time => {
                        let indexOfTime = this.state.timePeriods.indexOf(time);
                        if (this.state.timePeriods.includes(time))
                        {
                            return <Button mode="outlined" key={time} color="white" onPress={() => {this.handleSessionTimeUpdate(time, indexOfTime)}}>
                            {time}
                        </Button>
                        }
                        else
                        {
                            return <Button mode="text" key={time} color="white" onPress={() => {this.handleSessionTimeUpdate(time, indexOfTime)}}>
                            {time}
                        </Button>
                        }
                    });
                    break;
                case 'Sunday':
                    return this.state.availableTimes.Sunday.map(time => {
                        let indexOfTime = this.state.availableTimes.Sunday.indexOf(time);
                        if (this.state.timePeriods.includes(time))
                        {
                            return <Button mode="outlined" key={time} color="#2196F3" onPress={() => alert(time)}>
                            {time}
                        </Button>
                        }
                        else
                        {
                            return <Button mode="text" key={time} color="#2196F3" onPress={() => alert(time)}>
                            {time}
                        </Button>
                        }
                    });
                    break;
            } 
        } 
        else
        {
            return this.state.timePeriods.map(time => {
                return (
                <Button key={time} color="#2196F3">
                    {time}
                </Button>
                )
            })
        }
    
    }

    sessionStatusPendingText = () => (
        this.state.currUserData.user_uuid == this.state.userWhoRequestedData.user_uuid ?

        <View style={{alignSelf: 'center', alignItems: 'center', flex: 1, flexDirection: "column", justifyContent: "space-around"}}>
            <Avatar.Image source={{uri: this.state.otherUserInformation.photo_url }} size={70} style={{margin: 5}}/>
            <Text style={{fontSize: 15, fontWeight: "600", textAlign: 'center'}}>
            Confirmation of your session is still pending.  Until {this.state.userWhoReceivedRequestData.display_name} accepts this session you can 
            select and deselect times from their availability.
        </Text>
        </View>

        :

        <View style={{alignSelf: 'center', flexDirection: "column", justifyContent: "space-between"}}>
                        <Avatar.Image source={{uri: this.state.otherUserInformation.photo_url }} size={35}/>
            <Text style={{fontSize: 15, color: '#E0E0E0', fontWeight: "600"}}>
    {this.state.otherUserInformation.display_name} is waiting on you to accept or decline this session.  The times requested are below as well as the confirmation button.
        </Text>
        </View>
    )
    
    sessionStatusConfirmedText = () => (
        <View style={{alignSelf: 'center', flexDirection: "column", justifyContent: "space-around"}}>
            <View style={{flexDirection: "row", alignItems: "center"}}>
            <Text>
           Your session has been confirmed with {this.state.otherUserInformation.display_name} on this day at this time.
        </Text>
            </View>
        </View>
    )

    showConfirmationButton = () => {
        this.state.currUserData.user_uuid == this.state.userWhoReceivedRequestData.user_uuid ?
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                        <Button mode="text" color="#2196F3" onPress={() => alert('Confirm last suggested')}>
            Confirm Session
     </Button>

<Button mode="text" color="#2196F3" onPress={() => alert('Confirm last suggested')}>
Decline Session
</Button>
        </View>

        :

        <View>
            <Caption>
                Caption for now
            </Caption>
        </View>
    }
    
    handleSessionTimeUpdate = async (value, index) => {
        await this.LUPA_CONTROLLER_INSTANCE.updateSession(this.state.sessionUUID, 'time_periods', value, index);
        await this.updateSessionData();
    }

    handleSessionConfirmation = async () => {
        await this.LUPA_CONTROLLER_INSTANCE.updateSession(this.state.sessionUUID, 'session_status', SESSION_STATUS.Confirmed);
    }

    render() {
        return (
            <Portal>
                <Modal visible={this.props.isOpen} contentContainerStyle={styles.modal} presentationStyle="fullScreen">
                <Header>
          <Left>
              <Text  style={{fontSize: 15, color: "#2196F3"}}>
                  Cancel
              </Text>
          </Left>


          <Right style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text>
                  Session Status: {this.state.sessionData.sessionStage}
              </Text>
          </Right>
        </Header>
                    
                    <ScrollView contentContainerStyle={{flex: 1, flexGrow: 2}} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleOnRefresh}/>}>
                    <Container style={{flex: 1}}>
        
        <View style={{flex: 1, justifyContent: "center", display: "flex"}}>
            <View style={{flex: 1, justifyContent: "center", alignItems: "center" }}>
                {
                   this.state.sessionData.sessionStage == SESSION_STATUS.PENDING ? this.sessionStatusPendingText() : this.sessionStatusConfirmedText()
                }
            </View>
            <Surface style={{flex: 1, justifyContent: "center", flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', elevation: 5, borderRadius: 10, margin: 20, backgroundColor: "#2196F3"}}>
                {this.showTimes()}
            </Surface>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10}}>
                <Caption>
                    Lupa sessions are not officially monitored.  It is the responsibility of the individual to verify who they are meeting with.  Don't meet with strangers and always meet in public spaces.
                </Caption>
                
                {
                    this.showConfirmationButton()
                }
            </View>
            </View>
      </Container>
                    </ScrollView>
                </Modal>
            </Portal>
        );
    }
}

const styles = StyleSheet.create({
    modal: {
        display: "flex",
        margin:0,
        flex: 1,
       backgroundColor: "white",
    },
});


export default connect(mapStateToProps)(ModifySessionModal);