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
    Title,
    Avatar
} from 'react-native-paper';

import {
    Svg,
    Ellipse
} from 'react-native-svg';

import { Feather as FeatherIcon } from '@expo/vector-icons';
import SafeAreaView from 'react-native-safe-area-view';
import { ScrollView } from 'react-native-gesture-handler';

import Carousel, { Pagination } from 'react-native-snap-carousel';

import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode'

import LupaController from '../../../../controller/lupa/LupaController';
import PackChatModal from '../PackChatModal.js';
import CreateEvent from '../Packs/CreateEvent';
import { withNavigation } from 'react-navigation';
import UserDisplayCard from './Components/UserDisplayCard';

import PackInformationModal from '../Packs/PackInformationModal';

import PackEventModal from './Components/PackEventModal';

import { connect } from 'react-redux';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

const PackMembersModal = (props) => {
    return (

                <Modal presentationStyle="overFullScreen" visible={props.isOpen} dismissable={false}>
                    <SafeAreaView style={styles.membersModal}>
                        <View style={{width: '100%', flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <IconButton icon="arrow-back" onPress={props.closeModalMethod}/>
                            <Headline>
                                Members
                            </Headline>
                        </View>
                        <View style={{flex: 3}}>
                            <ScrollView centerContent contentContainerStyle={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-around' }} shouldRasterizeIOS={true} showsVerticalScrollIndicator={false}>
                            {
                                props.displayMembersMethod()
                            }
                            </ScrollView>
                        </View>
                        <View style={{flex: 1, alignItems: 'center'}}>
                            <Paragraph>
                                This pack currently has 20 active members and 5 active invites.
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
        <Surface style={{ margin: 5, elevation: 5, width: Dimensions.get('screen').width - 20, height: 110, borderRadius: 20 }}>
<Image style={{ width: "100%", height: "100%", borderRadius: 20 }} source={{ uri: packEventObject.pack_event_image }} resizeMethod="auto" resizeMode={ImageResizeMode.cover} />
</Surface>

<View style={{width: "auto", height: "auto", backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' }}>
<Title style={{ color: 'black' }}>
    {packEventObject.pack_event_title}
</Title>
<Paragraph style={{ textAlign: 'center', color: 'black', fontSize: 20}}>
    {packEventObject.pack_event_description}
</Paragraph>
</View>
<PackEventModal isOpen={packEventModalIsOpen} closeModalMethod={this.handlePackEventModalClose} packEventTitle={packEventObject.pack_event_title} packEventDescription={packEventObject.pack_event_description} packEventAttendees={packEventObject.attendees} packEventDate={packEventObject.pack_event_date} packEventImage={packEventObject.pack_event_image}/>
</TouchableOpacity>
    )
}

class PackModal extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            packUUID: "",
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
            currPackData: {}
        }
    }

    componentDidMount = async () => {
       await this.setupPackModal();
    }

    _navigateToPackChat = (uuid) => {
        this.props.navigation.navigate('PackChat', {
            packUUID: uuid
        })
    }

    setupPackModal = async () => {
        await this.setState({ packUUID: this.props.navigation.state.params.packUUID}) //PROBLEM
        let packInformationIn, packEventsIn, isAttendingCurrEventIn;

        await this.LUPA_CONTROLLER_INSTANCE.getPackInformationByUUID(this.state.packUUID).then(result => {
            packInformationIn = result;
        })

        await this.LUPA_CONTROLLER_INSTANCE.getPackEventsByUUID(this.state.packUUID).then(packEvents => {
            if (packEvents == undefined || packEvents.events == undefined || packEvents.events.length == 0)
            {
                packEventsIn = [];
            }
            else
            {
                packEventsIn = packEvents.events;
            }

        });

        await this.setState({ packInformation: packInformationIn, packEvents: packEventsIn})

       this.currentUserUUID = this.props.lupa_data.Users.currUserData.user_uuid;
       if (this.currentUserUUID == this.state.packInformation.pack_leader) { await this.setState({ currentUserIsPackLeader: true }) }
    
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

        return this.state.packInformation.pack_members && this.state.packInformation.pack_members.map(member => {
             return (
                <View style={{margin: 5}}>
                                     <UserDisplayCard userUUID={member} />
                </View>
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

    _renderMoreVert = () => {
        this.state.currentUserIsPackLeader ? <IconButton icon="more-vert" size={20} onPress={this._showActionSheet} /> : null
    }

    renderPackEventsContent = () => {
        return this.state.packEvents.length == 0 ? <Text style={{fontSize: 20, fontWeight: 'bold', padding: 8}}> Your pack leader has not setup any events yet!  When they do events will appear here. </Text> :                         
                            <View style={{flexDirection: 'column', justifyContent: 'space-evenly'}}>
                                                            <Carousel shouldRasterizeIOS={true}
                            ref={(c) => { this._carousel = c; }}
                            data={this.state.packEvents}
                            renderItem={this._renderItem}
                            sliderWidth={Dimensions.get('screen').width}
                            itemWidth={Dimensions.get('screen').width- 20} 
                            onBeforeSnapToItem={itemIndex => this.handleOnSnapToItem(itemIndex)}
                            />
                            </View>
}

getButtonColor = () => {
    if (this.state.packEvents.length == 0) { return ['grey', 'grey']}

    return this.state.packEvents[this.state.currDisplayedPackEvent].attendees.includes(this.props.lupa_data.Users.currUserData.user_uuid) ? ["grey", "#2196F3"] : ["#2196F3", 'grey']
}

getButtonDisabledStatus = () => {
 /*   if (this.state.packEvents.length == 0) { return [true, true]}

    let attendingStatus = this.state.packEvents[this.state.currDisplayedPackEvent].attendees.includes(this.props.lupa_data.Users.currUserData.user_uuid);
    console.log('STATUS: ' + attendingStatus)

    this.setState({ isAttendingCurrEvent: attendingStatus });

    return attendingStatus // [true, false] : [false, true]*/
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
        const buttonColors = this.getButtonColor();
        return (
                <SafeAreaView forceInset={{
                    bottom: 'never'
                }} style={{ flex: 1, backgroundColor: "rgb(244, 247, 252)" }}>
                    <Svg height={Dimensions.get('screen').height / 2} width={Dimensions.get('screen').width} style={{position: 'absolute', }}>
  <Ellipse
    cx={"55"}
    cy="100"
    rx={Dimensions.get('screen').width}
    ry={Dimensions.get('screen').height / 3}
    fill="#4b87b6"
  />
</Svg>
                    <View>
                        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <IconButton icon="clear" color="black" onPress={() => this.props.navigation.goBack()} />
                            <Text style={{
                                fontSize: 22,
                                fontWeight: "500",
                            }}>
                                {this.state.packInformation.pack_title}
                            </Text>
                            <View style={{ flexDirection: 'row' }}>
                                {
                                    this._renderMoreVert()
                                }
                                <IconButton icon="chat-bubble-outline" color="black" onPress={() => this._navigateToPackChat()} />
                            </View>
                        </View>
                    </View>


                    <View style={{ flex: 2, alignItems: "center", justifyContent: "center" }}>
                        {
                            this.renderPackEventsContent()
                        }
                    </View>

                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: "center", justifyContent: "space-evenly", width: '100%' }}>
                            <TouchableOpacity disabled={this.getButtonDisabledStatus()} onPress={() => this.handleAttendEventOption(this.state.packEvents[this.state.currDisplayedPackEvent].pack_uuid, this.state.packEvents[this.state.currDisplayedPackEvent].pack_event_title, this.currentUserUUID)}>
                            <Surface style={{ elevation: 8, width: 60, height: 60, borderRadius: 60, justifyContent: 'center', alignItems: 'center' }}>
                                <FeatherIcon name="check" size={25} color={buttonColors[0]} />
                            </Surface>
                            </TouchableOpacity>

                            <TouchableOpacity disabled={this.getButtonDisabledStatus()} onPress={() => this.handleUnattendEventOption(this.state.packEvents[this.state.currDisplayedPackEvent].pack_uuid, this.state.packEvents[this.state.currDisplayedPackEvent].pack_event_title, this.currentUserUUID)}>
                            <Surface style={{ elevation: 8, width: 60, height: 60, borderRadius: 60, justifyContent: 'center', alignItems: 'center' }}>
                                <FeatherIcon name="x" size={25} color={buttonColors[1]} />
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
                            <Button mode="text" color="black" onPress={() => this.setState({ packMembersModalIsOpen: true })} disabled={false}>
                                View all
                </Button>
                        </View>

                        <ScrollView horizontal={true} shouldRasterizeIOS={true} overScrollMode="always" contentContainerStyle={{ alignItems: "flex-start", flexGrow: 2, justifyContent: 'space-around', flexDirection: "row" }}>
                            {
                            this.mapMembers()
                        }
                        </ScrollView>



                    </View>

                    <CreateEvent packUUID={this.state.packUUID} isOpen={this.state.createEventModalIsOpen} closeModalMethod={this.handleCreateEventModalClose} />
                    <PackInformationModal packUUID={this.state.packUUID} isOpen={this.state.packInformationModalIsOpen} closeModalMethod={this.handlePackInformationModalClose} />
                    <PackMembersModal isOpen={this.state.packMembersModalIsOpen} closeModalMethod={this.handlePackMembersModalClose} displayMembersMethod={this.mapMembers}/>
                   
                </SafeAreaView>
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

export default connect(mapStateToProps)(withNavigation(PackModal));