/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  23, 2019
 * 
 *  UserDashboardView
 */

import React, { useState } from 'react';

import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    Dimensions,
    Modal as NativeModal,
    Image,
    TouchableWithoutFeedback,
    Animated,
    Button as NativeButton,
    SafeAreaView,
    Slider
} from 'react-native';

import {
    IconButton,
    Provider,
    Portal,
    Modal,
    Appbar,
    Card,
    TextInput,
    Title,
    Paragraph,
    Divider,
    Caption,
    Surface,
    Chip,
    Button,
    FAB,
    TouchableRipple
} from 'react-native-paper';

import {
    Header,
    Left,
    Right,
    Body,
} from 'native-base';

import { PackEventNotificationContainer } from './component/SessionNotificationContainer.js';
import { Constants } from 'react-native-unimodules';
import LupaController from '../../../controller/lupa/LupaController';
import { connect } from 'react-redux';
import LupaJournal from './component/LupaJournal/LupaJournal'

import FeatherIcon from 'react-native-vector-icons/Feather';
import ThinFeatherIcon from "react-native-feather1s";
import WorkoutLog from './modal/workoutlog/WorkoutLog.js';
import { Modalize } from 'react-native-modalize';
import AssessmentView from './component/LupaJournal/Views/AssessmentView.js';
import TrainerInsights from '../trainer/TrainerInsights.js';
import InviteFriendsModal from '../../user/modal/InviteFriendsModal';
import WorkoutLogModal from '../../workout/modal/WorkoutLogModal'
import { RFValue } from 'react-native-responsive-fontsize';

const data = [

]

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
            packEventsData: [],
            showJournal: false,
            packInvites: [],
            openedPackInviteID: "",
            openedPackTitle: "",
            packInviteModalOpen: false,
            currUserData: this.props.lupa_data.Users.currUserData,
            currUserPacksData: this.props.lupa_data.Packs.currUserPacksData,
            trainerInsightsModalIsOpen: false,
            inviteFriendsModalIsOpen: false,
            workoutLogModalIsOpen: false,
        }

        this.workoutLogModalRef = React.createRef();

    }

    componentDidMount = async () => {
        console.log('enable swipe')
        //await this.fetchPackEvents();
        //await this.fetchPackInvites();
    }

    _onRefresh = async () => {
       /* await this.setState({ refreshing: true });
        await this.fetchPackEvents()
        await this.fetchPackInvites()
        await this.setState({ refreshing: false });*/
    }

    /**
     * Fetch Pack Events
     */
    fetchPackEvents = async () => {
        let currentUserPackEventsData = [];
        try {
            for (let i = 0; i < this.state.currUserPacksData.length; i++) {
                console.log(this.state.currUserPacksData.length)
                console.log(this.state.currUserPacksData[i].pack_uuid)
                await this.LUPA_CONTROLLER_INSTANCE.getPackEventsByUUID(this.state.currUserPacksData[i].pack_uuid).then(result => {
                    currentUserPackEventsData = result;
                    console.log(currentUserPackEventsData)
                })

                console.log(currentUserPackEventsData.length)
            }
    
            await this.setState({ packEventsData: currentUserPackEventsData });
        }
        catch(err)
        {
            console.log(err)
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

    showTrainerInsightsModal = () => {
        this.setState({ trainerInsightsModalIsOpen: true })
    }

    closeTrainerInsightsModal = () => {
        this.setState({ trainerInsightsModalIsOpen: false })
    }

    showInviteFriendsModal = () => {
        this.setState({ inviteFriendsModalIsOpen: true })
    }

    closeInviteFriendsModal = () => {
        this.setState({ inviteFriendsModalIsOpen: false })
    }

    showWorkoutLogModal = () => {
        this.setState({ workoutLogModalIsOpen: true })
    }

    closeWorkoutLogModal = () => {
        this.setState({ workoutLogModalIsOpen: false })
    }

    render() {
        return (
            <View style={styles.safeareaview}>
                <View style={{marginTop: Constants.statusBarHeight}}>
                <View style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
                                         <Left>
                                         <Appbar.Action icon="menu" style={{}} onPress={() => this.props.navigation.openDrawer()} />
                                         </Left>
                                        
                                        <Body />

                                        <Right />
                                         </View>

                                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: Dimensions.get('window').width}}>
                                        <View style={{flexDirection: 'row', alignItems: 'center',}}>
                                         <Text style={{paddingLeft: 15, fontSize: 20}}>
                                             Welcome,
                                         </Text>
                                         <Text>
                                             {" "}
                                         </Text>
                                         <Text style={{color: '#1089ff', fontSize: 20}}>
                                            {this.props.lupa_data.Users.currUserData.display_name}
                                         </Text>
                                         </View>

                                         <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                         <ThinFeatherIcon name="bell" thin={true} size={25} style={{marginRight: 20}} onPress={() => this.props.navigation.navigate('Notifications')} />
                                         <ThinFeatherIcon name="mail" thin={true} size={25} style={{marginRight: 20}} onPress={() => this.props.navigation.navigate('Messages')} />
                                         </View>
                                        </View>
                                         <Divider style={{marginTop: 15}} />

                </View>
                <View style={{flex: 1}}>
                <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false} refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                    />}>

                    <AssessmentView />
                    <Divider style={{width: '100%'}} />
                    <WorkoutLog workoutLogModalRef={this.workoutLogModalRef} />
                    <Divider style={{width: '100%'}} />

                </ScrollView>

                </View>

                {/* <PackInviteModal refreshData={this.fetchPackInvites} closeModalMethod={this.handlePackInviteModalClose} isOpen={this.state.packInviteModalOpen} packID={this.state.openedPackInviteID} packTitle={this.state.openedPackTitle} currUserID={this.props.lupa_data.Users.currUserData.user_uuid} /> */}


                    <SafeAreaView />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    scrollView: {
        alignItems: 'center',
        flexGrow: 2,
        flexDirection: 'column',

        backgroundColor: '#FFFFFF'
    },
    safeareaview: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    header: {
        flexDirection: 'row', 
        alignItems: 'center', 
        width: "100%", 
        height: "auto",
    },
    headerText: {
        fontFamily: 'ARSMaquettePro-Medium', 
        fontSize: 30,
        color: 'white', 
        alignSelf: "center",
        color: '#1565C0'
    },
    sectionHeader: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        margin: 3,
        fontFamily: "avenir-book",
        color: '#212121'
    },
    sectionHeaderText: {
        fontSize: 18, 
        color: '#212121',
        fontFamily: 'ARSMaquettePro-Medium'
    },
    divider: {
        margin: 10
    },
    iconButton: {
        
    },
    chipStyle: {
        backgroundColor: 'rgba(227,242,253 ,1)', 
        width: 'auto', 
        alignItems: 'center', 
        justifyContent: 'center',
        margin: 5, 
        alignSelf: 'flex-end'
    },
    chipTextStyle: {
        fontSize: 15,
    },
});

export default connect(mapStateToProps)(TrainerDashboardView);