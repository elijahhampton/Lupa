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
    Animated,
    Button as NativeButton
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
    Surface,
    Chip,
    Button,
    FAB
} from 'react-native-paper';

import { PackEventNotificationContainer } from './component/SessionNotificationContainer';

import LupaController from '../../../controller/lupa/LupaController';
import { connect } from 'react-redux';
import LupaJournal from './component/LupaJournal/LupaJournal'

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
        }

    }

    componentDidMount = async () => {
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

    render() {
        return (
            <View style={styles.safeareaview}>
                                        <Appbar.Header
                                        statusBarHeight
                                        style={{elevation: 0, alignItems: 'center'}}
                                        theme={{
                                            elevation: 0,
                                            colors: {
                                                primary: "transparent"
                                            }
                                        }}
                                        > 
                                         <Appbar.Action icon="menu" style={{alignSelf: 'flex-end', left: 0,}} onPress={() => this.props.navigation.openDrawer()} />
                                        <Appbar.Content title="Lupa" titleStyle={styles.headerText} />
                                       
</Appbar.Header>

                <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false} refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                    />}>

                    <LupaJournal showJournal={this.state.showJournal} />

                    <View>
                    <View style={{padding: 10, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly', width: '100%', height: 'auto'}}>
                        <Surface style={{elevation: 0, padding: 10, margin: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 13, backgroundColor: '#FFFFFF', width: '100%'}}>
                            <Text style={{color: '#1E88E5', fontFamily: 'ARSMaquettePro-Regular', fontSize: 15, padding: 5, textAlign: 'center'}}>
                                Finished a workout offline? Log it
                            </Text>

                            <Text style={{color: '#292f33', fontWeight: '300', textAlign: 'center'}}>
                                Log workouts you complete outside of the Lupa app to enhance your live workout experience
                            </Text>

                            <Button mode="contained" style={{margin: 10, width: '40%', elevation: 0}} theme={{
                                colors: {
                                    primary: '#2196F3'
                                },
                                roundness: 10
                            }}>
                                <Text>
                                    Open Log
                                </Text>
                            </Button>
                        </Surface>

                        <Surface style={{elevation: 0, padding: 10, margin: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 13, backgroundColor: '#FFFFFF', width: '100%'}}>
                            <Text style={{color: '#1E88E5', fontFamily: 'ARSMaquettePro-Regular', fontSize: 15, padding: 5, textAlign: 'center'}}>
                                Try the EMS assessment
                            </Text>

                            <Text style={{color: '#292f33', fontWeight: '300', textAlign: 'center', padding: 5}}>
                            The EMS assessment is designed to simulate the critical physical tasks performed by paramedics and EMTs during emergency situations.
                            </Text>

                            <Button mode="contained" style={{margin: 10, width: '60%', elevation: 0}} theme={{
                                colors: {
                                    primary: '#2196F3'
                                },
                                roundness: 10,
    
                            }}>
                                <Text>
                                    Take Assessment
                                </Text>
                            </Button>
                        </Surface>
                    </View>

                    </View>
                </ScrollView>
                <PackInviteModal refreshData={this.fetchPackInvites} closeModalMethod={this.handlePackInviteModalClose} isOpen={this.state.packInviteModalOpen} packID={this.state.openedPackInviteID} packTitle={this.state.openedPackTitle} currUserID={this.props.lupa_data.Users.currUserData.user_uuid} />
                {/* <FAB onPress={() => this.setState({ showJournal: !this.state.showJournal })} icon="import-contacts" style={{backgroundColor: '#2196F3', position: 'absolute', bottom: 0, right: 0, margin: 16}} /> */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    scrollView: {
        alignItems: 'center',
        flexGrow: 2,
        flexDirection: 'column',
        padding: 10,
    },
    safeareaview: {
        flex: 1,
        backgroundColor: "#F2F2F2",
    },
    header: {
        flexDirection: 'row', 
        alignItems: 'center', 
        width: "100%", 
        height: "auto",
    },
    headerText: {
        fontSize: 30, 
        fontFamily: 'ARSMaquettePro-Medium',
        color: 'white', 
        alignSelf: "center",
        color: '#2196F3'
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
        margin: 8
    },
    iconButton: {
        
    }
});

export default connect(mapStateToProps)(TrainerDashboardView);