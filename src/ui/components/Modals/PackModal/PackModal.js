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

import {
    Button as ElementsButton
} from 'react-native-elements';

import Carousel, { Pagination } from 'react-native-snap-carousel';

import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode'

import LupaController from '../../../../controller/lupa/LupaController';
import PackChatModal from '../PackChatModal.js';
import CreateEvent from '../Packs/CreateEvent';
import { withNavigation } from 'react-navigation';
import UserDisplayCard from './Components/UserDisplayCard';

import { Badge } from 'react-native-elements';

import PackInformationModal from '../Packs/PackInformationModal';

import PackEventModal from './Components/PackEventModal';

import PackRequestsModal from './Components/PackRequestsModal';

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
                                This pack currently has {props.packMembersLength} active members and {props.packRequestsLength} active invites.
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
        <Surface style={{ margin: 5, elevation: 5, width: Dimensions.get('screen').width - 20, height: 160, borderRadius: 20 }}>
<Image style={{ width: "100%", height: "100%", borderRadius: 20 }} source={{ uri: packEventObject.pack_event_photo_url }} resizeMethod="auto" resizeMode={ImageResizeMode.cover} />
</Surface>

<View style={{width: "auto", height: "auto", backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' }}>
<Title style={{ color: 'black' }}>
    {packEventObject.pack_event_title}
</Title>
<Paragraph style={{ textAlign: 'center', color: 'black', fontSize: 20}}>
    {packEventObject.pack_event_description}
</Paragraph>
</View>
<PackEventModal isOpen={packEventModalIsOpen} closeModalMethod={this.handlePackEventModalClose} packEventTime={packEventObject.pack_event_time} packEventTitle={packEventObject.pack_event_title} packEventDescription={packEventObject.pack_event_description} packEventAttendees={packEventObject.attendees} packEventDate={packEventObject.pack_event_date} packEventImage={packEventObject.pack_event_image}/>
</TouchableOpacity>
    )
}

class PackModal extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            packUUID: this.props.navigation.state.params.packUUID,
            packInformation: {},
            packEvents: [],
            currentUserIsPackLeader: false,
            createEventModalIsOpen: false,
            packInformationModalIsOpen: false,
            packMembersModalIsOpen: false,
            currDisplayedPackEvent: 0,
            currCarouselIndex: 0,
            isAttendingCurrEvent: false,
            currPackData: {},
            packRequestsModalIsVisible: false,
            packRequestsLength: 0,
            membersLength: 0,
            packRequests: [],
            packProfileImage: '',
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
       // await this.setState({ packUUID: this.props.navigation.state.params.packUUID}) //PROBLEM
        let packInformationIn, packEventsIn, isAttendingCurrEventIn

        await this.LUPA_CONTROLLER_INSTANCE.getPackInformationByUUID(this.state.packUUID).then(result => {
            packInformationIn = result;
        })

        await this.LUPA_CONTROLLER_INSTANCE.getPackEventsByUUID(this.state.packUUID).then(packEvents => {
            if (packEvents == undefined || packEvents.length == 0)
            {
                packEventsIn = [];
            }
            else
            {
                packEventsIn = packEvents;
            }
        });

        if (packEventsIn.length > 0)
        {
            for (let i = 0; i < packEventsIn.length; i++)
            {
                await this.LUPA_CONTROLLER_INSTANCE.getPackEventImageFromUUID(packEventsIn[i].pack_event_uuid).then(result => {
                    packEventsIn[i].pack_event_photo_url = result;
                });
            }
        }  


        if (packEventsIn.length > 0)
        {
            await this.LUPA_CONTROLLER_INSTANCE.userIsAttendingPackEvent(packEventsIn[0].pack_event_uuid, "", this.props.lupa_data.Users.currUserData.user_uuid).then(result => {
                isAttendingCurrEventIn = result;
            })
        }

        await this.setState({ 
            packInformation: packInformationIn, 
            packEvents: packEventsIn, 
            currDisplayedPackEvent: packEventsIn[0], 
            packRequestsLength: packInformationIn.pack_requests.length, 
            membersLength: packInformationIn.pack_members.length,
            packRequests: packInformationIn.pack_requests,
            isAttendingCurrEvent: isAttendingCurrEventIn,
            packProfileImage: packProfileImageIn,
        })

       this.currentUserUUID = this.props.lupa_data.Users.currUserData.user_uuid;
       if (this.currentUserUUID == this.state.packInformation.pack_leader) { await this.setState({ currentUserIsPackLeader: true }) }
    }

    refreshPackEvent = async () => {
        let packEventsIn;
        await this.LUPA_CONTROLLER_INSTANCE.getPackEventsByUUID(this.state.packUUID).then(packEvents => {
            if (packEvents == undefined || packEvents.length == 0)
            {
                packEventsIn = [];
            }
            else
            {
                packEventsIn = packEvents;
            }

        });

        await this.setState({
            packEvents: packEventsIn
        })
    }

    checkUserEventAttendance = async (packEventUUID, packEventTitle, userUUID) => {
        let isAttendingCurrEventIn;

        await this.LUPA_CONTROLLER_INSTANCE.userIsAttendingPackEvent(packEventUUID, packEventTitle, userUUID).then(isAttendingCurrEvent => {
                 isAttendingCurrEventIn = isAttendingCurrEvent;
             });

        await this.setState({ isAttendingCurrEvent: isAttendingCurrEventIn });
        }

        handleAttendEventOption = async () => {
            let index = this.state.currCarouselIndex;
             await this.LUPA_CONTROLLER_INSTANCE.setUserAsAttendeeForEvent(this.state.packEvents[index].pack_event_uuid, "", this.props.lupa_data.Users.currUserData.user_uuid);
             await this.checkUserEventAttendance(this.state.packEvents[index].pack_event_uuid, "", this.props.lupa_data.Users.currUserData.user_uuid);
            }

        handleUnattendEventOption = async () => {
            let index = this.state.currCarouselIndex;
            await this.LUPA_CONTROLLER_INSTANCE.removeUserAsAttendeeForEvent(this.state.packEvents[index].pack_event_uuid, "", this.props.lupa_data.Users.currUserData.user_uuid)
            await this.checkUserEventAttendance(this.state.packEvents[index].pack_event_uuid, "", this.props.lupa_data.Users.currUserData.user_uuid); 
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
        await this.setState({ currCarouselIndex: itemIndex });

       /* await this.checkUserEventAttendance(this.state.packEvents[itemIndex].pack_uuid, 
            this.state.packEvents[itemIndex].pack_event_title, this.currentUserUUID);*/
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

    handlePackRequestModalClose = () => {
        this.setState({ packRequestsModalIsVisible: false  })
    }

    _renderMoreVert = () => {
        return this.state.currentUserIsPackLeader ?
        <View style={{flexDirection: 'row'}}>
            <IconButton icon="more-vert" size={20} onPress={() => this._showActionSheet()} />
            <View>
                
            <IconButton icon="notifications" size={20} onPress={() => this.setState({ packRequestsModalIsVisible: true })} />
            <Badge
    status="error"
    containerStyle={{ position: 'absolute', top: -4, right: -4 }}
    value={this.state.packRequestsLength}
  />
            </View>
        </View>

        : 
        null
    }

    renderPackEventsContent = () => {
        return this.state.packEvents.length == 0 ? <Text style={{fontSize: 20, fontWeight: 'bold', padding: 8}}> Your pack leader has not setup any events yet!  When they do events will appear here. </Text> :                         
                            <View style={{flexDirection: 'column', justifyContent: 'space-evenly'}}>
                                                            <Carousel shouldRasterizeIOS={true}
                            ref={(c) => { this._carousel = c; }}
                            data={this.state.packEvents}
                            renderItem={this._renderItem}
                            sliderHeight={Dimensions.get('window').height / 4}
                            itemHeight={Dimensions.get('window').height / 2} 
                          onBeforeSnapToItem={itemIndex => this.handleOnSnapToItem(itemIndex)}
                          onSnapToItem={itemIndex => this.handleOnSnapToItem(itemIndex)}
                            vertical={true}
                            />
                            </View>
}

getButtonColor = () => {
    if (this.state.packEvents.length == 0) { return 'grey' }
    return this.state.packEvents[this.state.currCarouselIndex].attendees.includes(this.props.lupa_data.Users.currUserData.user_uuid) ? "grey" : "#2196F3";
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
                            <TouchableOpacity disabled={this.state.isAttendingCurrEvent} onPress={() => this.handleAttendEventOption()}>
                            <Surface style={{ elevation: 8, width: 60, height: 60, borderRadius: 60, justifyContent: 'center', alignItems: 'center' }}>
                                <FeatherIcon name="map-pin" size={25} color={buttonColors} />
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
                    <PackMembersModal isOpen={this.state.packMembersModalIsOpen} closeModalMethod={this.handlePackMembersModalClose} displayMembersMethod={this.mapMembers} packRequestsLength={this.state.packRequestsLength} packMembersLength={this.state.membersLength}/>
                    <PackRequestsModal isOpen={this.state.packRequestsModalIsVisible} closeModalMethod={this.handlePackRequestModalClose} requestsUUIDs={this.state.packRequests} />
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