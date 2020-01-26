import React, { useState } from 'react';

import {
    Modal,
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    ActionSheetIOS,
    TouchableOpacity
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
    Title
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

import PackEventModal from './Components/PackEventModal';

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

const PackEventCard = props => {
    const [packEventModalIsOpen, setPackEventModalIsOpen] = useState(false);
    const packEventObject = props.packEventObjectIn;

    handlePackEventModalOpen = () => {
        setPackEventModalIsOpen(true);
    }

    handlePackEventModalClose = () => {
        setPackEventModalIsOpen(false);
    }

    return (
        <TouchableOpacity onPress={this.handlePackEventModalOpen}>
        <Surface style={{ margin: 5, elevation: 5, width: 250, height: 320, borderRadius: 20 }}>
<Image style={{ width: "100%", height: "100%", borderRadius: 20 }} source={{ uri: packEventObject.pack_event_image }} resizeMethod="auto" resizeMode={ImageResizeMode.cover} />
<View style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' }}>
<Text style={{ fontSize: 30, fontWeight: '800', color: 'white' }}>
    {packEventObject.pack_event_title}
</Text>
<Text style={{ fontSize: 25, fontWeight: '600', color: 'white', textAlign: 'center' }}>
    {packEventObject.pack_event_description}
</Text>
</View>

</Surface>
<PackEventModal isOpen={packEventModalIsOpen} closeModalMethod={this.handlePackEventModalClose} packEventTitle={packEventObject.pack_event_title} packEventDescription={packEventObject.pack_event_description} packEventAttendees={packEventObject.attendees} packEventDate={packEventObject.pack_event_date} packEventImage={packEventObject.pack_event_image}/>
</TouchableOpacity>
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
            ready: false,
            currDisplayedPackEvent: 0,
            isAttendingCurrEvent: false,
        }
    }

    componentDidMount = async () => {
       await this.setupPackModal();
    }

    setupPackModal = async () => {
        let packInformationIn, packEventsIn, isAttendingCurrEventIn;

        await this.LUPA_CONTROLLER_INSTANCE.getPackInformationByUUID(this.state.packUUID).then(packInformation => {
            packInformationIn = packInformation;
        });

        await this.LUPA_CONTROLLER_INSTANCE.getPackEventsByUUID(this.state.packUUID).then(packEventsInformation => {
            packEventsIn = packEventsInformation.events;
        });

        await this.setState({ packInformation: packInformationIn, packEvents: packEventsIn });


        this.currentUserUUID = await this.LUPA_CONTROLLER_INSTANCE.getCurrentUser().uid;
        if (this.currentUserUUID == this.state.packInformation.pack_leader) { await this.setState({ currentUserIsPackLeader: true }) }
        

        await this.setState({ ready: true })

        console.log('calling this function 2222')
    }

    checkUserEventAttendance = async (packEventUUID, packEventTitle, userUUID) => {
        console.log('CHECKING ATTENDACNE NOW! GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG')
        let isAttendingCurrEventIn;

        await this.LUPA_CONTROLLER_INSTANCE.userIsAttendingPackEvent(packEventUUID, packEventTitle, userUUID).then(isAttendingCurrEvent => {
                isAttendingCurrEventIn = isAttendingCurrEvent;
            });

        await this.setState({ isAttendingCurrEvent: isAttendingCurrEventIn });

        console.log('ATTENDANCE RESULTS ' + isAttendingCurrEventIn)
        }

        handleAttendEventOption = async (packEventUUID, packEventTitle, userUUID) => {
            await this.checkUserEventAttendance(packEventUUID, packEventTitle, userUUID)
            this.LUPA_CONTROLLER_INSTANCE.setUserAsAttendeeForEvent(packEventUUID, packEventTitle, userUUID);
        }

        handleUnattendEventOption = async (packEventUUID, packEventTitle, userUUID) => {
            await this.checkUserEventAttendance(packEventUUID, packEventTitle, userUUID)
            this.LUPA_CONTROLLER_INSTANCE.removeUserAsAttendeeForEvent(packEventUUID, packEventTitle, userUUID)
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
           <PackEventCard packEventObjectIn={item} />
        );
    }

    handleOnSnapToItem = async (itemIndex) => {
        if (itemIndex == 0) {
            console.log('ITEM INDEX IS 0000000000000000000')
            await this.checkUserEventAttendance(this.state.packEvents[this.state.currDisplayedPackEvent].pack_uuid, 
                this.state.packEvents[0].pack_event_title, this.currentUserUUID);

                return;
        }

        await this.setState({ currDisplayedPackEvent: itemIndex });

        await this.checkUserEventAttendance(this.state.packEvents[this.state.currDisplayedPackEvent].pack_uuid, 
            this.state.packEvents[this.state.currDisplayedPackEvent].pack_event_title, this.currentUserUUID);
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
        console.log(this.state.packEvents)
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
                            itemWidth={250} 
                            onBeforeSnapToItem={itemIndex => this.handleOnSnapToItem(itemIndex)}
                            />
                    </View>

                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: "center", justifyContent: "space-evenly", width: '100%' }}>
                            <TouchableOpacity disabled={this.state.currDisplayedPackEvent == 0 ? true : false && this.state.isAttendingCurrEvent} onPress={() => this.handleAttendEventOption(this.state.packEvents[this.state.currDisplayedPackEvent].pack_uuid, this.state.packEvents[this.state.currDisplayedPackEvent].pack_event_title, this.currentUserUUID)}>
                            <Surface style={{ elevation: 8, width: 60, height: 60, borderRadius: 60, justifyContent: 'center', alignItems: 'center' }}>
                                <FeatherIcon name="check" size={25} color="#2196F3" />
                            </Surface>
                            </TouchableOpacity>

                            <TouchableOpacity  disabled={this.state.currDisplayedPackEvent == 0 ? true : false && !this.state.isAttendingCurrEvent} onPress={() => this.handleUnattendEventOption(this.state.packEvents[this.state.currDisplayedPackEvent].pack_uuid, this.state.packEvents[this.state.currDisplayedPackEvent].pack_event_title, this.currentUserUUID)}>
                            <Surface style={{ elevation: 8, width: 60, height: 60, borderRadius: 60, justifyContent: 'center', alignItems: 'center' }}>
                                <FeatherIcon name="x" size={25} color="#2196F3"/>
                            </Surface>
                            </TouchableOpacity>

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