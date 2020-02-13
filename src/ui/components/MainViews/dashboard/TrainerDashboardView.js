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

import { Pagination } from 'react-native-snap-carousel';

import { Feather as Icon } from '@expo/vector-icons';

import LupaCalendar from '../../Calendar/LupaCalendar'

import SafeAreaView from 'react-native-safe-area-view';

import SessionNotificationContainer, {PackEventNotificationContainer} from './Components/SessionNotificationContainer';

const chartWidth = Dimensions.get('screen').width - 20;
const chartHeight = 250;

import LupaController from '../../../../controller/lupa/LupaController';

const AppLogo = require('../../../images/applogo.png')

import { connect } from 'react-redux';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state
    }
}

class TrainerDashboardView extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            refreshing: false,
            sessionData: [],
            packEventsData: [],
        }

    }

    componentDidMount = async () => {
        await this.fetchSessions();
        await this.fetchPackEvents();
    }

    _onRefresh = () => {
        this.setState({refreshing: true});
        this.fetchSessions().then(() => this.fetchPackEvents().then(() => {
            this.setState({refreshing: false});
        }))
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
       * Fetch Pack Events
       */
      fetchPackEvents = async () => {
          console.log('start');
          let currentUserPacks = [];
          let currentUserPackEventsData = [];

          await this.props.lupa_data.Packs.currUserPacksData.forEach(pack => {
            currentUserPacks.push(pack.id);
          })

          await this.LUPA_CONTROLLER_INSTANCE.getPacksEventsFromArrayOfUUIDS(currentUserPacks).then(result => {
            currentUserPackEventsData = result;
          })
          
          await this.setState({ packEventsData: currentUserPackEventsData });

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
              let sessionDate = session.sessionData.date;
              let date = sessionDate.split("-")
              let parsedDate = date[0] + " " + date[1] + "," + date[2];
              //Return a session notification container
              //NEED SOMEWAY TO GET THE DISPLAYNAME INTO THIS BLOCK
              return (
                <SessionNotificationContainer sessionUUID={session.sessionID} attendeeOne={attendeeOneDisplayName} userToDisplay={attendeeTwoDisplayName} title={session.sessionData.name} description={session.sessionData.description} date={parsedDate} sessionStatus={session.sessionData.sessionStatus}/>
              )
          })
      }

      populatePackEvents = () => {
        return this.state.packEventsData.map(pack => {
            return (
            <PackEventNotificationContainer packUUID={pack.pack_uuid} packImageEvent={pack.pack_event_image} packEventTitle={pack.pack_event_title} packEventDate={pack.pack_event_date.seconds} numAttending={pack.attendees.length}/>
            )
        });
      }

    render() {
        return (
                <SafeAreaView style={{flex: 1, padding: 5,  backgroundColor: "#2196F3"}}>
                <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false} refreshControl={
                <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />}>  

          <View style={{flexDirection: 'row', alignItems: 'center', margin: 10, width: "100%", height: "auto"}}>
                        <IconButton icon="menu" style={{alignSelf: "flex-start"}} onPress={() => this.props.navigation.openDrawer()}/>
                        <Text style={{fontSize: 50, fontWeight: '600', color: 'white', alignSelf: "center"}}>
                            Lupa
                        </Text>
                        </View>    

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

                        <Pagination dotColor="#1A237E" dotsLength={this.state.sessionData.length} />
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
                        <ScrollView shouldRasterizeIOS={true} horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}}>
                        {
                            this.populatePackEvents()
                        }
                        </ScrollView>
                        <Pagination dotColor="#1A237E" dotsLength={this.state.sessionData.length}/>
                    </View>

            <LupaCalendar />

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
                            goals
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
                    {
                        this.props.lupa_data.Users.currUserData.isTrainer && true ? 
                        <View>
                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%",}}>
                        <Text style={{fontSize: 20, fontWeight: "500", color: 'white'}}>
                            Pack Offers
                        </Text>
                        <Icon name="plus" size={15} />
                        </View>
                        <View>
                            <Caption>
                                You are not currently leading any premium packs.  Visit the Packs section to start one.
                            </Caption>
                        </View>

                    </View>
                    :
                    null
                    }
                </ScrollView>
                </SafeAreaView>
        );                    
    }
}

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 2,
        justifyContent: "space-between",
        flexDirection: 'column',
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

export default connect(mapStateToProps)(TrainerDashboardView);