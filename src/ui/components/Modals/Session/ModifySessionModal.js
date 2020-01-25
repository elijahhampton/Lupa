import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    DatePickerIOS
} from 'react-native';
import { 
    IconButton,
    TextInput,
    Modal,
    Portal,
    Button,
    Headline
} from 'react-native-paper';

import { Container, Header, Left, Body, Right, Icon, Title } from 'native-base';

import LupaController from '../../../../controller/lupa/LupaController';

var otherUUID;

export default class ModifySessionModal extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
        this.currUserUUID = null;
        this.otherUserUUID = null;

        this.state = { 
            currIndex: 0,
            date: new Date(),
            sessionData: {},
            sessionUUID: this.props.sessionUUID
        }
    }

    componentDidMount() {
        this.setupSessionData();
    }

    async setupSessionData() {
        await this.LUPA_CONTROLLER_INSTANCE.getSessionInformationByUUID(this.props.sessionUUID).then(result => {
            this.setState({
                sessionData: result
            })
        })

      const currUserUUIDTemp = await this.LUPA_CONTROLLER_INSTANCE.getCurrentUser().uid;
      const userUUIDS = [this.state.sessionData.attendeeOne, this.state.sessionData.attendeeTwo];
      let index;
      if (currUserUUIDTemp == userUUIDS[0] ? index = 0 : index = 1);
      this.currUserUUID = userUUIDS[index];
      if (index == 0 ? this.otherUserUUID = userUUIDS[1] : this.otherUserUUID = userUUIDS[0]);

      otherUUID = this.otherUserUUID;

      this.otherUserName = null;
      await this.LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(this.otherUserUUID, 'display_name').then(async res => {
          this.otherUserName = await res;
      })

    otherUUID = await this.otherUserUUID

      console.log('The current user is: ' + this.currUserUUID)
      console.log('The other user is: ' + this.otherUserUUID)
    }

    _getLastSuggestedTimeByOtherUser() {
       const times = this.state.sessionData.lastSuggestedBy;
       for (var key in times) {
           if (key == this.currUserUUID) { continue; }
           if (key == this.otherUserUUID) { return times[key] }
       }
    }

    sessionStatusPendingText = (name) => (
        <View style={{alignSelf: 'center', flexDirection: "column", justifyContent: "space-around"}}>
            <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
            <Text style={{fontSize: 20, color: '#E0E0E0', fontWeight: "600"}}>
            It looks there isn't a set time and date for your session with 
        </Text>
        <Text style={{fontSize: 20, color: '#E0E0E0', fontWeight: "600"}}>
            {name}
        </Text>
            </View>
    
        <Button mode="text" color="#2196F3" onPress={() => alert('Suggest New Time')} onPress={this._handleNewSuggestedTime}>
                    Suggest New Time
                </Button>
        </View>
    )
    
    sessionStatusConfirmedText = (name) => (
        <View style={{alignSelf: 'center', flexDirection: "column", justifyContent: "space-around"}}>
            <View style={{flexDirection: "row", alignItems: "center"}}>
            <Text>
            Session confirmed with 
        </Text>
        <Text>
            {name}
        </Text>
        <Text>
            on {this._getLastSuggestedTimeByOtherUser()}
        </Text>
            </View>
    
        <Button mode="text" color="#2196F3" onPress={this.LUPA_CONTROLLER_INSTANCE.updateSession()}>
                    Confirm New Time
                </Button>
        </View>
    )

    _handleNewSuggestedTime = () => {
        //Get date from date picker
        const newSuggestedTime = this.state.date;

        //Update last suggested time by this user
        this.LUPA_CONTROLLER_INSTANCE.updateSession(this.state.sessionUUID, 'last_suggested_by', newSuggestedTime, this.currUserUUID)
    
        //Send notification to other user
        //this.LUPA_CONTROLLER_INSTANCE.addNotification()
    }

    _handleConfirmLastSuggestedTime = () => {

    }
    
    render() {
        return (
            <Portal>
                <Modal visible={this.props.isOpen} contentContainerStyle={styles.modal} presentationStyle="fullScreen">
                <Container>
        <Header>
          <Left>
              <Text  style={{fontSize: 15, color: "#2196F3"}}>
                  Cancel
              </Text>
          </Left>


          <Right>
              <Text>
                  Session Status:
              </Text>
              <Text>
                  {" "}
              </Text>
              <Text style={{color: "#2196F3"}}>
                {this.state.sessionData.stage}
              </Text>
          </Right>
        </Header>
        
        <View style={{flex: 1, justifyContent: "center", display: "flex"}}>
            <View style={{flex: 1, justifyContent: "center", alignItems: "center" }}>
                {
                   this.state.sessionData.stage == "Invited" ? this.sessionStatusPendingText(this.otherUserName) : this.sessionStatusConfirmedText(this.otherUserName)
                }
            </View>
            <View style={{flex: 2, justifyContent: "center"}}>
            <DatePickerIOS onDateChange={dateValue => this.setState({ date: dateValue })} date={this.state.date}/>
            </View>
            <View style={{flex: 1, marginTop: 10}}>
                <View style={{padding: 5, flexDirection: "row", alignItems: "center", flexWrap: 'wrap', justifyContent: "center"}}>
                <Text>
                    Last Suggested Time by {this.otherUserName}: 
                </Text>
                <Text>
                    {" "}
                </Text>
                <Text  style={{color: "#2196F3"}}>
                {
                   this._getLastSuggestedTimeByOtherUser()
                }
                </Text>
                </View>

                <Button mode="text" color="#2196F3" onPress={() => alert('Confirm last suggested')}>
                    Confirm last suggested time
                </Button>
            </View>
        </View>
      </Container>

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
