/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  23, 2019
 * 
 *  UserDashboardView
 */

import React from 'react';

import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    TouchableWithoutFeedback,
    RefreshControl,
    Image,
} from 'react-native';

import {
    Surface,
    IconButton,
    Menu,
    Divider,
    Caption,
    FAB,
    Button
} from 'react-native-paper';

import {
    LineChart,
    ProgressChart
} from 'react-native-chart-kit';

import {
    LinearGradient
} from 'expo-linear-gradient';

import { Feather as Icon } from '@expo/vector-icons';

import LupaCalendar from '../../Calendar/LupaCalendar'

import SafeAreaView from 'react-native-safe-area-view';

import SessionNotificationContainer, {PackEventNotificationContainer} from './Components/SessionNotificationContainer';

const chartWidth = Dimensions.get('screen').width - 20;
const chartHeight = 250;

import LupaController from '../../../../controller/lupa/LupaController';

const AppLogo = require('../../../images/applogo.png')

class TrainerDashboardView extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
        this.fetchSessions();

        this.state = {
            refreshing: false,
            sessionData: [],
        }

    }

    _onRefresh = () => {
        this.setState({refreshing: true});
        this.fetchSessions().then(() => {
            this.setState({ refreshing: false });
        })
      }

      /**
       * Fetch Sessions
       * 
       * Fetch user sessions from the LupaController.
       */
      fetchSessions = async () => {
        await this.LUPA_CONTROLLER_INSTANCE.getUserSessions().then(res => {
            this.setState({
                sessionData: res
            });
        });
      }

      /**
       * Populate Sessions
       * 
       * Populate the sessions section with any sessions pending that this user might have.
       * 
       * TODO: Pash in session UUID and populate inside of container
       */
      populateSessions = () => {
          let attendeeTwoDisplayName;
          let attendeeOneDisplayName;
          return this.state.sessionData.map(session => {
        this.LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(session.sessionData.attendeeOne, 'display_name').then(res => {
                attendeeOneDisplayName = res;
            })
            //Convert each session UUID to its display name for attendeeTwo
            this.LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(session.sessionData.attendeeTwo, 'display_name').then(res => {
                attendeeTwoDisplayName = res;
            });
              //Return a session notification container
              //NEED SOMEWAY TO GET THE DISPLAYNAME INTO THIS BLOCK
              return (
                  <>
                <SessionNotificationContainer sessionUUID={session.sessionID} attendeeOne={attendeeOneDisplayName} userToDisplay={attendeeTwoDisplayName} title={session.sessionData.name} description={session.sessionData.description} date={session.sessionData.date} />
                <SessionNotificationContainer sessionUUID={session.sessionID} attendeeOne={attendeeOneDisplayName} userToDisplay={attendeeTwoDisplayName} title={session.sessionData.name} description={session.sessionData.description} date={session.sessionData.date} />
                <SessionNotificationContainer sessionUUID={session.sessionID} attendeeOne={attendeeOneDisplayName} userToDisplay={attendeeTwoDisplayName} title={session.sessionData.name} description={session.sessionData.description} date={session.sessionData.date} />
                <SessionNotificationContainer sessionUUID={session.sessionID} attendeeOne={attendeeOneDisplayName} userToDisplay={attendeeTwoDisplayName} title={session.sessionData.name} description={session.sessionData.description} date={session.sessionData.date} />
              </>
              )
          })
      }

      populatePackEvents = () => {
          return (
              <>
              <PackEventNotificationContainer />
              <PackEventNotificationContainer />
              <PackEventNotificationContainer />
              <PackEventNotificationContainer />
              <PackEventNotificationContainer />
              </>
          )
      }

    render() {
        return (
                <SafeAreaView style={{flex: 1, padding: 5,  backgroundColor: "#64B5F6"}}>
                <ScrollView contentContainerStyle={styles.dashboardContent} showsVerticalScrollIndicator={false} refreshControl={
                <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />}>  

          <View style={{flex: 1}}>
          <View style={{justifyContent: "center", flexDirection: 'row', alignItems: 'center', margin: 10, width: "100%", height: "auto"}}>
                        <Image source={AppLogo} style={{width: 120, height: 120}} />
                        <Text style={{fontSize: 50, fontWeight: '600', color: 'white'}}>
                            Lupa
                        </Text>
                        </View>    

            <View style={{margin: 5, marginBottom: 15}}>
            <View>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Text style={{fontSize: 20, fontWeight: "500", color: 'white'}}>
                            Sessions
                        </Text>
                        <Button mode="text" color="white">
                            View all
                        </Button>
                </View>

                        <ScrollView shouldRasterizeIOS={true} horizontal={true} showsHorizontalScrollIndicator={false}>
                        {
                            this.populateSessions()
                        }
                        </ScrollView>
                    </View>

                    <View>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Text style={{fontSize: 20, fontWeight: "500", color: 'white'}}>
                            Pack Events
                        </Text>
                        <Button mode="text" color="white">
                            View all
                        </Button>
                </View>
                        <ScrollView shouldRasterizeIOS={true} horizontal={true} showsHorizontalScrollIndicator={false}>
                        {
                            this.populatePackEvents()
                        }
                        </ScrollView>
                    </View>

            <LupaCalendar />
            </View>
          </View>

                    <View>
                        <Text style={{fontSize: 20, fontWeight: "500", color: "white"}}>
                            Goals
                        </Text>
                        <View style={{flexDirection: "row"}}>
                        <Caption>
                            You do not have any goals set. Visit your fitness profile to set your
                        </Caption>
                        <TouchableWithoutFeedback>
                        <Caption style={{color: "white"}}>
                            {" "} goals
                        </Caption>
                        </TouchableWithoutFeedback>
                        <Caption>
                            .
                        </Caption>
                        </View>

                    </View>

                    <View>
                        <Text style={{fontSize: 20, fontWeight: "500", color: 'white'}}>
                            Recent Workouts
                        </Text>
                        <Caption>
                            You have not performed any workouts recently.
                        </Caption>
                    </View>

                    <View>
                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%",}}>
                        <Text style={{fontSize: 20, fontWeight: "500", color: 'white'}}>
                            Pack Offers
                        </Text>
                        <Icon name="plus" size={15} />
                        </View>
                        <View>
                            <Caption>
                                You are currently not offering any pack offers.
                            </Caption>
                        </View>

                    </View>
                </ScrollView>
                </SafeAreaView>
        );                    
    }
}

const styles = StyleSheet.create({
    scrollView: {
    },
    charts: {
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        display: "flex",
    },
    buttonSurface: {
        borderRadius: 40,
        width: 50,
        height: 50,
        elevation: 10,
        alignItems: "center",
        justifyContent: "center",
    }
});

export default TrainerDashboardView;