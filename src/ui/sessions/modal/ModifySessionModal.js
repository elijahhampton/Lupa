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
    Chip,
    Portal,
    Button,
    Caption,
    Headline,
    Surface,
    Avatar
} from 'react-native-paper';

import { Container, Header, Left, Body, Right, Icon, Title } from 'native-base';

import LupaController from '../../../controller/lupa/LupaController';

import { connect } from 'react-redux';


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
            otherUserProfileImage: '',
            ready: false,
        }
    }

    componentDidMount = async () => {
        await this.setupSessionData();
    }

    async setupSessionData() {
        let sessionDataIn, otherUserInformationIn, userWhoRequestedDataIn, userWhoReceivedRequestDataIn, otherUserProfileImageIn;
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

      let arr1 = sessionDataIn.time_periods.filter(val => {
          return val.includes("PM")
      })

      arr1.sort();

      let arr2 = sessionDataIn.time_periods.filter(val => {
          return val.includes("AM")
      })

      arr2.sort();

      let finalArr = arr1.concat(arr2);

      await this.LUPA_CONTROLLER_INSTANCE.getUserProfileImageFromUUID(this.otherUserUUID).then(result => {
        otherUserProfileImageIn = result;
      })

      //Set the state for the other user information and the session information
      await this.setState({ 
        sessionData: sessionDataIn, 
        otherUserInformation: otherUserInformationIn, 
        userWhoRequestedData: userWhoRequestedDataIn, 
        userWhoReceivedRequestData: userWhoReceivedRequestDataIn,
        timePeriods: finalArr,
        availableTimes: userWhoReceivedRequestDataIn.preferred_workout_times,
        sessionDate: this.state.sessionData.date,
        otherUserProfileImage: otherUserProfileImageIn,
        ready: true,
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
        
        if (this.state.sessionData.sessionStatus == 'Set' && this.state.sessionData.sessionMode == 'Active')
        {
            return <Caption style={{padding: 20, color: 'white', fontWeight: 'bold'}}>
                Your session has been set.  You can no longer change the session times.
            </Caption>
        }

        let date = this.state.sessionDate;
        let dateParts = date.split('-');
        let month = dateParts[0], day = dateParts[1], year = dateParts[2];
        let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        let dayOfTheWeek = days[new Date(month + " " + day + "," + " " + year).getDay()];

        if (this.state.currUserData.user_uuid == this.state.userWhoRequestedData.user_uuid)
        {
            switch(dayOfTheWeek)
            {
                case 'Monday':
                    return this.state.availableTimes.Monday.map(time => {
                        let indexOfTime = this.state.availableTimes.Monday.indexOf(time);
                        if (this.state.timePeriods.includes(time))
                        {
                            return <Chip style={{margin: 3}} mode="flat" key={time} color="#212121" onPress={() => this.handleSessionTimeUpdate(time, indexOfTime)}>
                            {time}
                        </Chip>
                        }
                        else
                        {
                            return <Chip style={{margin: 3}} mode="outlined" key={time} color="#212121" onPress={() => this.handleSessionTimeUpdate(time, indexOfTime)}>
                            {time}
                        </Chip>
                        }
                    });
                    break;
                case 'Tuesday':
                    return this.state.availableTimes.Tuesday.map(time => {
                        let indexOfTime = this.state.availableTimes.Tuesday.indexOf(time);
                        if (this.state.timePeriods.includes(time))
                        {
                            return <Chip style={{margin: 3}} mode="flat" key={time} color="white" onPress={() => this.handleSessionTimeUpdate(time, indexOfTime)}>
                            {time}
                        </Chip>
                        }
                        else
                        {
                            return <Chip style={{margin: 3}} mode="outlined" key={time} color="white" onPress={() => this.handleSessionTimeUpdate(time, indexOfTime)}>
                            {time}
                        </Chip>
                        }
                    });
                    break;
                case 'Wednesday':
                    return this.state.availableTimes.Wednesday.map(time => {
                        let indexOfTime = this.state.availableTimes.Wednesday.indexOf(time);
                        if (this.state.timePeriods.includes(time))
                        {
                            return <Chip  style={{margin: 3}} mode="flat" key={time} color="white" onPress={() => this.handleSessionTimeUpdate(time, indexOfTime)} theme={{colors: {
                                primary: 'white',
                            }}}>
                            {time}
                        </Chip>
                        }
                        else
                        {
                            return <Chip style={{margin: 3}} mode="outlined" key={time} color="white" onPress={() => this.handleSessionTimeUpdate(time, indexOfTime)}>
                            {time}
                        </Chip>
                        }
                    });
                    break;
                case 'Thursday':
                    return this.state.availableTimes.Thursday.map(time => {
                        let indexOfTime = this.state.availableTimes.Thursday.indexOf(time);
                        if (this.state.timePeriods.includes(time))
                        {
                            return <Chip style={{margin: 3}} mode="flat" key={time} color="white" onPress={() => this.handleSessionTimeUpdate(time, indexOfTime)}>
                            {time}
                        </Chip>
                        }
                        else
                        {
                            return <Chip style={{margin: 3}} mode="outlined" key={time} color="white" onPress={() => this.handleSessionTimeUpdate(time, indexOfTime)}>
                            {time}
                        </Chip>
                        }
                    });
                    break;
                case 'Friday':
                    return this.state.availableTimes.Friday.map(time => {
                        let indexOfTime = this.state.availableTimes.Friday.indexOf(time);
                        if (this.state.timePeriods.includes(time))
                        {
                            return <Chip style={{margin: 3}} mode="flat" key={time} color="white" onPress={() => this.handleSessionTimeUpdate(time, indexOfTime)}>
                            {time}
                        </Chip>
                        }
                        else
                        {
                            return <Chip style={{margin: 3}} mode="outlined" key={time} color="white" onPress={() => this.handleSessionTimeUpdate(time, indexOfTime)}>
                            {time}
                        </Chip>
                        }
                    });
                    break;
                case 'Saturday':
                    return this.state.availableTimes.Saturday.map(time => {
                        let indexOfTime = this.state.timePeriods.indexOf(time);
                        if (this.state.timePeriods.includes(time))
                        {
                            return <Chip style={{margin: 3}} mode="flat" key={time} color="white" onPress={() => {this.handleSessionTimeUpdate(time, indexOfTime)}}>
                            {time}
                        </Chip>
                        }
                        else
                        {
                            return <Chip style={{margin: 3}} mode="outlined" key={time} color="white" onPress={() => {this.handleSessionTimeUpdate(time, indexOfTime)}}>
                            {time}
                        </Chip>
                        }
                    });
                    break;
                case 'Sunday':
                    return this.state.availableTimes.Sunday.map(time => {
                        let indexOfTime = this.state.availableTimes.Sunday.indexOf(time);
                        if (this.state.timePeriods.includes(time))
                        {
                            return <Chip style={{margin: 3}} mode="flat" key={time} color="white" onPress={() => this.handleSessionTimeUpdate(time, indexOfTime)}>
                            {time}
                        </Chip>
                        }
                        else
                        {
                            return <Chip style={{margin: 3}} mode="outlined" key={time} color="white" onPress={() => this.handleSessionTimeUpdate(time, indexOfTime)}>
                            {time}
                        </Chip>
                        }
                    });
                    break;
            } 
        } 
        else
        {
            return this.state.timePeriods.map(time => {
                return (
                <Chip key={time} color="white" mode="outlined" compact>
                    {time}
                </Chip>
                )
            })
        }
    
    }

    sessionStatusPendingText = () => (
        this.state.currUserData.user_uuid == this.state.userWhoRequestedData.user_uuid ?

        <View style={{alignSelf: 'center', alignItems: 'center', flex: 1, flexDirection: "column", justifyContent: "space-around"}}>
            <Avatar.Image source={{uri: this.state.otherUserProfileImage }} size={70} style={{margin: 5}}/>
            <Text style={{padding: 5, fontSize: 15, fontFamily: "avenir-book", textAlign: 'center'}}>
            Confirmation of your session is still pending.  Until {this.state.userWhoReceivedRequestData.display_name} accepts this session you can 
            select and deselect times from their availability.
        </Text>
        </View>

        :

        <View style={{alignSelf: 'center', alignItems: 'center', flexDirection: "column", justifyContent: "space-around"}}>
                        <Avatar.Image source={{uri: this.state.otherUserProfileImage }} size={70}/>
            <Text style={{fontSize: 15, color: '#212121', fontFamily: "avenir-book"}}>
    {this.state.otherUserInformation.display_name} is waiting on you to accept or decline this session.  The times requested are below.
        </Text>
        </View>
    )
    
    sessionStatusConfirmedText = () => (
        <View style={{alignSelf: 'center', flexDirection: "column", justifyContent: "space-around"}}>
            <View style={{flexDirection: "row", alignItems: "center"}}>
            <Text style={{fontSize: 20, fontFamily: "avenir-book"}}>
           Your session has been confirmed with {this.state.otherUserInformation.display_name} on {this.state.sessionData.date} at {this.state.sessionData.time_periods[0]}.
        </Text>
            </View>
        </View>
    )

    showConfirmationButton = () => {
        return this.state.currUserData.user_uuid == this.state.userWhoReceivedRequestData.user_uuid && this.state.sessionData.sessionStatus != "Set"?
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                        <Button mode="text" color="#2196F3" onPress={() => this.handleSessionConfirmation()}>
            Confirm Session
     </Button>

<Button mode="text" color="#2196F3" onPress={() => this.handleSessionDecline}>
Decline Session
</Button>
        </View>

        :

        null
    }
    
    handleSessionTimeUpdate = async (value, index) => {
        await this.LUPA_CONTROLLER_INSTANCE.updateSession(this.state.sessionUUID, 'time_periods', value, index);
        await this.updateSessionData();
    }

    handleSessionConfirmation = async () => {
        await this.LUPA_CONTROLLER_INSTANCE.updateSession(this.state.sessionUUID, 'session_status', 'Set');
        await this.LUPA_CONTROLLER_INSTANCE.updateSession(this.state.sessionUUID, 'session_mode', 'Active');
        this.props.closeModalMethod();
    }

    handleSessionDecline = async () => {
        await this.LUPA_CONTROLLER_INSTANCE.updateSession(this.state.sessionUUID, 'session_mode', 'Expired'); 
        this.props.closeModalMethod();
    }


    showStatusText = () => {
        if (this.state.sessionData.sessionStatus == 'Pending')
        {
            return this.sessionStatusPendingText();
        }

        if (this.state.sessionData.sessionStatus == 'Set' && this.state.sessionData.sessionMode == 'Active')
        {
            return this.sessionStatusConfirmedText();
        }
    }

    getTimesSorted = () => {
        let times = this.state.timePeriods.sort();
        return times;

    }

    getSessionLocationName = () => {
        if (this.state.sessionData && this.state.ready)
        {
            return this.state.sessionData.locationData.name
        }

        return "";
    }

    getSessionLocationAddress = () => {
        if (this.state.sessionData && this.state.ready)
        {
            return this.state.sessionData.locationData.address
        }

        return "";
    }
    render() {
        return (
            <Portal>
                <Modal visible={this.props.isOpen} contentContainerStyle={styles.modal} presentationStyle="fullScreen">
                <Header>
          <Left>
              <Text  style={{fontSize: 15, color: "#2196F3"}} onPress={() => this.props.closeModalMethod()}>
                  Cancel
              </Text>
          </Left>


          <Right style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text>
                  Session Status: {this.state.sessionData.sessionStatus}
              </Text>
          </Right>
        </Header>
                    
                    <ScrollView contentContainerStyle={{flex: 1, justifyContent: "space-between", flexGrow: 2}} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleOnRefresh}/>}>
        
        <View style={{flex: 1, justifyContent: "center", display: "flex"}}>
            <View style={{flex: 1, justifyContent: "center", alignItems: "center" }}>
                {
                   this.showStatusText()
                }
            </View>
            <View style={{flex: 1, justifyContent: "center", flexDirection: 'column',  elevation: 5, borderRadius: 10, margin: 20, backgroundColor: "transparent"}}>
                {this.showTimes()}
                <Text style={{margin: 10, fontFamily: "avenir-book"}}>
                    Session Start Time: {this.getTimesSorted()[0]}
                </Text>
                <Text style={{margin: 10, fontFamily: "avenir-book"}}>
                    Session End Time: {this.getTimesSorted()[this.getTimesSorted().length - 1]}
                </Text>
                <Text style={{margin: 10, fontFamily: "avenir-book"}}>
                    Session Location: {this.getSessionLocationName()} ({this.getSessionLocationAddress()})
                </Text>
            </View>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Caption>
                    Lupa sessions are not officially monitored.  It is the responsibility of the individual to verify who they are meeting with.  Don't meet with strangers and always meet in public spaces.
                </Caption>
                
                {
                    this.showConfirmationButton()
                }
            </View>
            </View>
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
        padding: 10,
       backgroundColor: "white",
    },
});


export default connect(mapStateToProps)(ModifySessionModal);