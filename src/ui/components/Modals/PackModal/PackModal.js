import React, { useState } from 'react';

import {
    Modal,
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    ActionSheetIOS
} from 'react-native';

import {
    IconButton,
    Surface,
    Caption,
    Button,
    Modal as PaperModal,
    Portal,
    Provider,
    Paragraph,
    Headline,
} from 'react-native-paper';

import { Feather as FeatherIcon } from '@expo/vector-icons';
import SafeAreaView from 'react-native-safe-area-view';
import { ScrollView } from 'react-native-gesture-handler';

import Carousel, { Pagination } from 'react-native-snap-carousel';
import PackInformationSlider from './Components/PackInformationSlider.js';

import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode'

import LupaController from '../../../../controller/lupa/LupaController';
import PackChatModal from '../PackChatModal.js';
import CreateEvent from '../Packs/CreateEvent';

import UserDisplayCard from './Components/UserDisplayCard';

import PackInformationModal from '../Packs/PackInformationModal';

const PackMembersModal = (props) => {
    return (

                <Modal presentationStyle="overFullScreen" visible={props.isOpen} dismissable={false}>
                    <SafeAreaView style={styles.membersModal}>
                        <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between'}}>
                            <IconButton icon="arrow-back" onPress={props.closeModalMethod}/>
                            <Headline>
                                Announcements Members
                            </Headline>
                        </View>
                        <View style={{flex: 3}}>
                            <ScrollView centerContent shouldRasterizeIOS={true} showsVerticalScrollIndicator={false}>
                            {
                                props.displayMembersMethod()
                            }
                            </ScrollView>
                        </View>
                        <View style={{flex: 1}}>
                            <Paragraph>
                                This pack currently has 20 active members.
                            </Paragraph>
                            <Paragraph>
                                This pack currently has 5 active invites.
                            </Paragraph>
                        </View>
                        </SafeAreaView>
                </Modal>
    )
}

export default class PackModal extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();


        this.state = {
            packUUID: this.props.packUUID,
            packInformation: {},
            packEvents: [],
            currentUserIsPackLeader: false,
            createEventModalIsOpen: false,
            packChatModalIsOpen: false,
            packInformationModalIsOpen: false,
            packMembersModalIsOpen: false,
            ready: false
        }
    }

    componentDidMount = async () => {
        let packInformationIn, packEventsIn;

        console.log('packmodal: ' + this.state.packUUID)

        await this.LUPA_CONTROLLER_INSTANCE.getPackInformationByUUID(this.state.packUUID).then(packInformation => {
            packInformationIn = packInformation;
        });

        await this.LUPA_CONTROLLER_INSTANCE.getPackEventsByUUID(this.state.packUUID).then(packEventsInformation => {
            console.log('uhhh' + packEventsIn)
            packEventsIn = packEventsInformation.events;
        });


        await this.setState({ packInformation: packInformationIn, packEvents: packEventsIn });


        const currentUserUUID = await this.LUPA_CONTROLLER_INSTANCE.getCurrentUser().uid;
        if (currentUserUUID == this.state.packInformation.pack_leader) { await this.setState({ currentUserIsPackLeader: true }) }

        await this.setState({ ready: true })

        console.log(this.state.packEvents)
    }

    mapMembers = () => {
        /* This is an existing problem where you cannot access the pack_members field from packInformation..
        not sure why yet */

        if (this.state.ready == false) { return; }

        return this.state.packInformation.pack_members.map(member => {
            return (
                <UserDisplayCard userUUID={member} />
            )
        })
    }

    _renderItem = ({ item, index }) => {
        return (
            <Surface style={{ margin: 5, elevation: 5, width: 250, height: 320, borderRadius: 20 }}>
                <Image style={{ width: "100%", height: "100%", borderRadius: 20 }} source={{ uri: item.pack_event_image }} resizeMethod="auto" resizeMode={ImageResizeMode.cover} />
                <View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 30, fontWeight: '800', color: 'white' }}>
                        {item.pack_event_title}
                    </Text>
                    <Text style={{ fontSize: 25, fontWeight: '600', color: 'white', textAlign: 'center' }}>
                        {item.pack_event_description}
                    </Text>
                </View>
            </Surface>
        );
    }

    handleCreateEventModalClose = () => {
        this.setState({ createEventModalIsOpen: false })
    }

    handleLeavePack = async () => {
        const currUserUUID = await this.LUPA_CONTROLLER_INSTANCE.getCurrentUser().uid;

        this.LUPA_CONTROLLER_INSTANCE.removeUserFromPackByUUID(this.state.packUUID, currUserUUID);

        this.props.closeModalMethod();
    }

    handlePackInformationModalClose = () => {
        this.setState({ packInformationModalIsOpen: false })
    }

    handlePackMembersModalClose = () => {
        this.setState({ packMembersModalIsOpen: false })
    }

    _showActionSheet = () => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ['Create an Event', 'Delete Pack', 'Cancel'],
                cancelButtonIndex: 2,
            }, (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        this.setState({ createEventModalIsOpen: true });
                        break;
                    case 1:
                        //delete pack
                        break;
                    case 2:
                        break;
                    default:
                }
            });
    }

    render() {
        return (
            <Modal presentationStyle="fullScreen" visible={this.props.isOpen} style={styles.modalContainer}>
                <SafeAreaView forceInset={{
                    bottom: 'never'
                }} style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
                    <View>
                        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <IconButton icon="clear" color="black" onPress={this.props.closeModalMethod} />
                            <Text style={{
                                fontSize: 22,
                                fontWeight: "500",
                            }}>
                                {this.state.packInformation.pack_title}
                            </Text>
                            <View style={{ flexDirection: 'row' }}>
                                <IconButton icon="more-vert" size={20} onPress={this._showActionSheet} />
                                <IconButton icon="chat-bubble-outline" color="black" onPress={() => this.setState({ packChatModalIsOpen: true })} />
                            </View>
                        </View>
                    </View>


                    <View style={{ flex: 2, alignItems: "center", justifyContent: "center" }}>
                        <Carousel shouldRasterizeIOS={true}
                            ref={(c) => { this._carousel = c; }}
                            data={this.state.packEvents}
                            renderItem={this._renderItem}
                            sliderWidth={Dimensions.get('screen').width}
                            itemWidth={250} />
                    </View>

                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: "center", justifyContent: "space-evenly", width: '100%' }}>
                            <Surface style={{ elevation: 8, width: 60, height: 60, borderRadius: 60, justifyContent: 'center', alignItems: 'center' }}>
                                <FeatherIcon name="x" size={25} color="#2196F3" />
                            </Surface>
                            <Surface style={{ elevation: 8, width: 60, height: 60, borderRadius: 60, justifyContent: 'center', alignItems: 'center' }}>
                                <FeatherIcon name="check-circle" size={25} />
                            </Surface>
                            <Surface style={{ elevation: 8, width: 60, height: 60, borderRadius: 60, justifyContent: 'center', alignItems: 'center' }}>
                                <FeatherIcon name="check" size={25} color="#2196F3" />
                            </Surface>
                        </View>

                        <View style={{ flex: 1, flexDirection: 'row', alignItems: "center", justifyContent: "space-evenly", width: '100%' }}>
                            <Button mode="outlined" color="#2196F3" onPress={() => this.setState({ packInformationModalIsOpen: true })}>
                                View Pack Information
                    </Button>

                            <Button mode="contained" color="#2196F3" onPress={this.handleLeavePack} disabled={this.state.packInformation.pack_isDefault}>
                                Leave Pack
                    </Button>
                        </View>
                    </View>

                    <View style={{ flex: 1, flexDirection: "column", padding: 10 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <Text style={styles.header}>
                                Members
                </Text>
                            <Button mode="text" color="black" onPress={() => this.setState({ packMembersModalIsOpen: true })} disabled={false /*this.state.packInformation.pack_members.length == 0 ? true : false*/}>
                                View all
                </Button>
                        </View>

                        <ScrollView horizontal={true} shouldRasterizeIOS={true} overScrollMode="always" contentContainerStyle={{ alignItems: "flex-start", justifyContent: "space-around", flexDirection: "row", flexWrap: 'wrap' }}>
                            {this.mapMembers()}
                        </ScrollView>



                    </View>

                    <CreateEvent packUUID={this.state.packUUID} isOpen={this.state.createEventModalIsOpen} closeModalMethod={this.handleCreateEventModalClose} />
                    <PackChatModal packUUID={this.state.packUUID} isOpen={this.state.packChatModalIsOpen} />
                    <PackInformationModal packUUID={this.state.packUUID} isOpen={this.state.packInformationModalIsOpen} closeModalMethod={this.handlePackInformationModalClose} />
                    <PackMembersModal isOpen={this.state.packMembersModalIsOpen} closeModalMethod={this.handlePackMembersModalClose} displayMembersMethod={this.mapMembers}/>
                </SafeAreaView>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        display: "flex",
        margin: 0,
        backgroundColor: "#FAFAFA",
    },
    membersModal: {
        flex: 1,
        margin: 0,
        padding: 10,
        alignItems: 'center'
    },
    flatUserCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: 15
    },
    userInfo: {
        flex: 2,
        flexDirection: "row",
        alignItems: "center",
    },
    icon: {
        flex: 1,
    },
    header: {
        fontSize: 25,
        fontWeight: "900",
        padding: 10
    },
    event: {
        width: 100,
        height: 115,
        borderRadius: 10,
        elevation: 6,
        margin: 5,
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: "500",
        padding: 10,
    },
    online: {
        display: "flex",
        flex: 3,
    },
    members: {
        flex: 1,
    },
    events: {
        flex: 2,
    },
    iconStyle: {
        borderColor: "#2196F3",
        color: "#2196F3",
        borderWidth: 1,
        borderRadius: 8,
        padding: 10
    }
});