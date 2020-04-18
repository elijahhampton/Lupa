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
    RefreshControl,
} from 'react-native';

import {
    IconButton,
    Provider,
    Portal,
    Modal,
    Appbar,
    Title,
    Paragraph,
    Divider,
    Caption,
    Chip,
    Button
} from 'react-native-paper';

import { Pagination } from 'react-native-snap-carousel';

import LupaCalendar from './calendar/LupaCalendar'

import SafeAreaView from 'react-native-safe-area-view';

import SessionNotificationContainer, { PackEventNotificationContainer } from './component/SessionNotificationContainer';

import LupaController from '../../../controller/lupa/LupaController';

import { connect } from 'react-redux';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state
    }
}

const PackInviteModal = props => {

    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    handleAccept = async (packID, currUserID) => {
        await LUPA_CONTROLLER_INSTANCE.acceptPackInviteByPackUUID(packID, currUserID);
        await props.refreshData();
        props.closeModalMethod()
    }

    handleDecline = async (packID, currUserID) => {
        await LUPA_CONTROLLER_INSTANCE.declinePackInviteByPackUUID(packID, currUserID);
        await props.refreshData();
        props.closeModalMethod()
    }
    return (
        <Provider>
            <Portal>
                <Modal visible={props.isOpen} contentContainerStyle={{ alignSelf: 'center', padding: 15, height: 'auto', backgroundColor: 'white', margin: 0, width: '90%', borderRadius: 3 }}>
                    <Title>
                        {props.packTitle}
                    </Title>
                    <Paragraph>
                        You have been invited to join the {props.packTitle} pack.
                    </Paragraph>
                    <View style={{ justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }}>
                        <Button color="#2196F3" style={{ marginLeft: 5 }} onPress={() => handleAccept(props.packID, props.currUserID)}>
                            Accept
                        </Button>

                        <Button color="#2196F3" style={{ marginLeft: 3 }} onPress={() => this.handleDecline(props.packID, props.currUserID)}>
                            Decline
                        </Button>
                    </View>
                </Modal>
            </Portal>
        </Provider>
    )
}

class TrainerDashboardView extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            refreshing: false,
            sessionData: [],
            packEventsData: [],
            packInvites: [],
            openedPackInviteID: "",
            openedPackTitle: "",
            packInviteModalOpen: false,
            currUserData: this.props.lupa_data.Users.currUserData,
            currUserPacksData: this.props.lupa_data.Packs.currUserPacksData,
        }

    }

    componentDidMount = async () => {
        await this.fetchSessions();
        await this.fetchPackEvents();
        await this.fetchPackInvites();
    }

    _onRefresh = async () => {
        this.setState({ refreshing: true });
        await this.fetchSessions()
        await this.fetchPackEvents()
        await this.fetchPackInvites()
        this.setState({ refreshing: false });
    }

    /**
     * Fetch Sessions
     * 
     * Fetch user sessions from the LupaController.
     */
    fetchSessions = async () => {
        try {
            let sessionDataIn;

        await this.LUPA_CONTROLLER_INSTANCE.getUserSessions().then(res => {
            sessionDataIn = res;
        });

        //If this user has no sessions then we just return from the function
        if (sessionDataIn.length == 0 || sessionDataIn.length == undefined) {
            return;
        }


        //if session status pending and active.. nothing to do

        //if session status is set and expired... nothing to do

        //if session status is set and active... nothing to do

        //Check if session date is passed mark as expired and pending and remove session.. we'll let user remove the others
        for (let i = 0; i < sessionDataIn.length; ++i) {
            let sessionDate = sessionDataIn[i].sessionData.date;
            //check to see if session has expired
            let sessionDateParts = sessionDate.split('-');
            let month = sessionDateParts[0], day = sessionDateParts[1], year = sessionDateParts[2];
            let realMonth;
            switch (month) {
                case 'January':
                    realMonth = 1;
                    break;
                case 'February':
                    realMonth = 2;
                    break;
                case 'March':
                    realMonth = 3;
                    break;
                case "April":
                    realMonth = 4;
                    break;
                case 'May':
                    realMonth = 5;
                    break;
                case 'June':
                    realMonth = 6;
                    break;
                case 'July':
                    realMonth = 7;
                    break;
                case 'August':
                    realMonth = 8;
                    break;
                case 'September':
                    realMonth = 9;
                    break;
                case 'October':
                    realMonth = 10;
                    break;
                case 'November':
                    realMonth = 11;
                    break;
                case 'December':
                    realMonth = 12;
                    break;
                default:
            }

            if (new Date().getMonth() + 1 >= realMonth && new Date().getDate() > day && new Date().getFullYear() >= year && sessionDataIn[i].sessionData.sessionStatus == 'Set' ||
                new Date().getFullYear() > year && sessionDataIn[i].sessionData.sessionStatus == 'Set' ||
                new Date().getMonth() + 1 > realMonth && new Date().getFullYear() >= year && sessionDataIn[i].sessionData.sessionStatus == 'Set') {
                this.LUPA_CONTROLLER_INSTANCE.updateSession(sessionDataIn[i].sessionID, 'session_mode', 'Expired');
            }


            //Check session is within 3 days and mark as expires soon - TODO - no need to do anything in structures for this.. just visual warning.. just update value in sessionStatus

            //Check session is past and remove - we remove pending sessions that have expired - 
            //todo: NEED TO CHECK FOR TIME HERE AS WELL
            if (new Date().getMonth() + 1 >= realMonth && new Date().getDate() > day && new Date().getFullYear() >= year && sessionDataIn[i].sessionData.sessionStatus == 'Pending' ||
                new Date().getFullYear() > year && sessionDataIn[i].sessionData.sessionStatus == 'Pending' ||
                new Date().getMonth() + 1 > realMonth && new Date().getFullYear() >= year && sessionDataIn[i].sessionData.sessionStatus == 'Pending') {
                this.LUPA_CONTROLLER_INSTANCE.updateSession(sessionDataIn[i].sessionID, 'session_mode', 'Expired');
                sessionDataIn.splice(sessionDataIn.splice(i, 1));
            }
        }


        await this.setState({
            sessionData: sessionDataIn
        });
        } catch(err)
        {
            await this.setState({
                sessionData: []
            });
        }
    }

    /**
     * Fetch Pack Events
     */
    fetchPackEvents = async () => {
        let currentUserPackEventsData = [];

        try {
            for (let i = 0; i < this.state.currUserPacksData.length; i++) {
                await this.LUPA_CONTROLLER_INSTANCE.getPackEventsByUUID(this.state.currUserPacksData[i].id).then(result => {
                    currentUserPackEventsData = result;
                })
            }
    
            await this.setState({ packEventsData: currentUserPackEventsData });
        }
        catch(err)
        {
            await this.setState({ packEventsData: [] });
        }

    }

    fetchPackInvites = async () => {
        let currentUserPackInvites = [];

        try {
            await this.LUPA_CONTROLLER_INSTANCE.getPackInvitesFromUUID(this.props.lupa_data.Users.currUserData.user_uuid).then(result => {
                currentUserPackInvites = result;
            });
    
            await this.setState({ packInvites: currentUserPackInvites });
        } catch(err)
        {
            await this.setState({ packInvites: [] });
        }

    }

    /**
     * Populate Sessions
     * 
     * Populate the sessions section with any sessions pending that this user might have.
     * 
     * TODO: Pash in session UUID and populate inside of container
     */
    populateSessions = () => {
        return this.state.sessionData.length == 0 ?
            <Caption>
                You are not apart of any upcoming sessions.
          </Caption>
            :
            this.state.sessionData.map(session => {
                let sessionDate = session.sessionData.date;
                let date = sessionDate.split("-")
                let parsedDate = date[0] + " " + date[1] + "," + date[2];
                //Return a session notification container
                //NEED SOMEWAY TO GET THE DISPLAYNAME INTO THIS BLOCK
                return (
                    <SessionNotificationContainer sessionData={session.sessionData} sessionMode={session.sessionData.sessionMode} sessionUUID={session.sessionID} title={session.sessionData.name} description={session.sessionData.description} date={parsedDate} sessionStatus={session.sessionData.sessionStatus} />
                )
            })
    }

    populatePackEvents = () => {

        return this.state.packEventsData == 0 ?
            <Caption>
                You are not apart of any upcoming pack events.
        </Caption>
            :

            this.state.packEventsData.map(pack => {
                return (
                    <PackEventNotificationContainer packUUID={pack.pack_uuid}  packEventObject={pack} packImageEvent={pack.pack_event_image} packEventTitle={pack.pack_event_title} packEventDate={pack.pack_event_date} numAttending={pack.attendees.length} />
                )
            });
    }

    populatePackInvites = () => {
        return this.state.packInvites == 0 ?
            <Caption>
                You don't have any outstanding pack invites.
        </Caption>
            :
            this.state.packInvites.map(invites => {
                return (
                    <TouchableOpacity onPress={() => { this.handlePackInvite(invites.id, invites.pack_title) }} >
                        <Chip mode="flat" style={{ backgroundColor: "#90CAF9", margin: 5, borderRadius: 10, width: 'auto' }}>
                            {invites.pack_title}
                        </Chip>
                    </TouchableOpacity>
                )
            })
    }


    handlePackInvite = (inviteID, title) => {
        this.setState({ openedPackInviteID: inviteID, openedPackTitle: title, packInviteModalOpen: true });
    }

    handlePackInviteModalClose = () => {
        this.setState({ packInviteModalOpen: false })
    }

    render() {
        return (
            <View style={styles.safeareaview}>
                                        <Appbar.Header
                                        statusBarHeight
                                        style={{elevation: 0}}
                                        theme={{
                                            elevation: 0,
                                            colors: {
                                                primary: "#2196F3"
                                            }
                                        }}> 
                                        <View style={styles.header}>
                        <IconButton icon="menu" style={styles.iconButton} onPress={() => this.props.navigation.openDrawer()} />
                        <Text style={styles.headerText}>
                            Lupa
                        </Text>
                    </View>
</Appbar.Header>

                <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false} refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                    />}>

                    <LupaCalendar elevation={10} />

                    <View>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionHeaderText}>
                                Sessions
                        </Text>
                        </View>

                        <ScrollView shouldRasterizeIOS={true} horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{flexDirection: "row", justifyContent: "space-around", alignItems: "center", }}>
                            {
                                this.populateSessions()
                            }
                        </ScrollView>
                    </View>

                    <Divider style={styles.divider} />

                    <View>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionHeaderText}>
                                Pack Invites
                        </Text>

                        </View>
                        <ScrollView shouldRasterizeIOS={true} horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                            {
                                this.populatePackInvites()
                            }
                        </ScrollView>
                    </View>

                    <Divider style={styles.divider} />

                    <View>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionHeaderText}>
                                Pack Events
                        </Text>

                        </View>
                        <ScrollView shouldRasterizeIOS={true} horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                            {
                                this.populatePackEvents()
                            }
                        </ScrollView>
                    </View>

                    <Divider style={styles.divider} />


                    <View>
                        <Text style={styles.sectionHeaderText}>
                            Recent Workouts
                        </Text>
                        <Caption>
                            You have not performed any workouts recently.
                        </Caption>
                    </View>
                </ScrollView>
                <PackInviteModal refreshData={this.fetchPackInvites} closeModalMethod={this.handlePackInviteModalClose} isOpen={this.state.packInviteModalOpen} packID={this.state.openedPackInviteID} packTitle={this.state.openedPackTitle} currUserID={this.props.lupa_data.Users.currUserData.user_uuid} />
                            <SafeAreaView />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 2,
        justifyContent: "space-between",
        flexDirection: 'column',
        padding: 10,
    },
    safeareaview: {
        flex: 1,
        backgroundColor: "#2196F3"
    },
    header: {
        flexDirection: 'row', 
        alignItems: 'center', 
        width: "100%", 
        height: "auto",
        justifyContent: "space-between"
    },
    headerText: {
        fontSize: 40, 
        fontFamily: 'avenir-next-bold',
        color: 'white', 
        alignSelf: "center"
    },
    sectionHeader: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        margin: 3,
        fontFamily: "avenir-book"
    },
    sectionHeaderText: {
        fontSize: 20, 
        fontWeight: "500", 
        color: 'white'
    },
    divider: {
        margin: 8
    },
    iconButton: {
        alignSelf: "flex-start"
    }
});

export default connect(mapStateToProps)(TrainerDashboardView);