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
    RefreshControl
} from 'react-native';

import {
    Surface,
    IconButton,
    Menu,
    Divider,
    Caption,
    FAB
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

import SessionNotificationContainer from './Components/SessionNotificationContainer';

const chartWidth = Dimensions.get('screen').width - 20;
const chartHeight = 250;

import LupaController from '../../../../controller/lupa/LupaController';

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
                <SessionNotificationContainer sessionUUID={session.sessionID} attendeeOne={attendeeOneDisplayName} userToDisplay={attendeeTwoDisplayName} title={session.sessionData.name} description={session.sessionData.description} date={session.sessionData.date} />
              )
          })
      }

    render() {
        return (
                <LinearGradient style={{flex: 1, padding: 10, paddingTop: 20}} colors={['#2196F3', '#E3F2FD', '#fafafa']}>
                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <IconButton style={{alignSelf: "flex-start"}} icon="menu" size={20} onPress={() => {this.props.navigation.openDrawer()}} />
                    <Text style={{fontWeight: "900", color: "black", fontSize: 15}}>
                        Lupa
                    </Text>
                    </View>
                <ScrollView contentContainerStyle={styles.dashboardContent} showsVerticalScrollIndicator={false} refreshControl={
                <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />}>      

            <View style={{margin: 5, marginBottom: 10}}>
            <LupaCalendar />
            </View>

                    <View>
                        <Text style={{fontSize: 20, fontWeight: "700"}}>
                            Goals
                        </Text>
                        <View style={{flexDirection: "row"}}>
                        <Caption>
                            You do not have any goals set. Visit your fitness profile to set your
                        </Caption>
                        <TouchableWithoutFeedback>
                        <Caption style={{color: "#2196F3"}}>
                            {" "} goals
                        </Caption>
                        </TouchableWithoutFeedback>
                        <Caption>
                            .
                        </Caption>
                        </View>

                    </View>

                    <View>
                        <Text style={{fontSize: 20, fontWeight: "700"}}>
                            Recent Workouts
                        </Text>
                        <Caption>
                            You have not performed any workouts recently.
                        </Caption>
                    </View>

                    <View>
                    <Text style={{fontSize: 20, fontWeight: "700"}}>
                            Sessions
                        </Text>
                        {
                            this.populateSessions()
                        }
                    </View>

                    <View>
                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%",}}>
                        <Text style={{fontSize: 20, fontWeight: "700"}}>
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
                </LinearGradient>
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