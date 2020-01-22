import React from 'react';

import {
    Modal,
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image
} from 'react-native';

import {
    IconButton,
    Surface,
    Caption,
    Button,
    Modal as PaperModal,
    Portal,
    Provider
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

export default class PackModal extends React.Component{
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
            ready: false
        }
    }

    componentDidMount = async () => {
        let packInformationIn, packEventsIn;

        await this.LUPA_CONTROLLER_INSTANCE.getPackInformationByUUID(this.state.packUUID).then(packInformation => {
            packInformationIn = packInformation;
        });

        await this.LUPA_CONTROLLER_INSTANCE.getPackEventsByUUID(this.state.packUUID).then(packEventsInformation => {
            packEventsIn = packEventsInformation.events;
        });


        await this.setState({ packInformation: packInformationIn, packEvents: packEventsIn});


        const currentUserUUID = await this.LUPA_CONTROLLER_INSTANCE.getCurrentUser().uid;
        if (currentUserUUID == this.state.packInformation.pack_leader) { await this.setState({ currentUserIsPackLeader: true })}
    
        await this.setState({ ready: true })
    }

    mapMembers = () => {
        /* This is an existing problem where you cannot access the pack_members field from packInformation..
        not sure why yet */

        if (this.state.ready == false) { return; }

       return this.state.packInformation.pack_members.map(member => {
            return (
                <UserDisplayCard userUUID={member}/>
            )
        })
    }

    _renderItem = ({item, index}) => {
        return (
            <View style={{margin: 5}}>
                <Surface style={{elevation: 5, width: 250, height: 320, borderRadius: 20}}>
                    <Image style={{width: "100%", height: "100%", borderRadius: 20}} source={this.state.packInformation.pack_image} resizeMethod="auto" resizeMode={ImageResizeMode.cover} />
                    <View style={{position: 'absolute', width: '100%', height: '100%', backgroundColor: 'transparent'}}>
                        <Text>
                            {item.pack_event_title}
                        </Text>
                        <Text>
                            {item.pack_event_description}
                        </Text>
                    </View>
                </Surface>
            </View>
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

    render() {
        return (
            <Modal presentationStyle="fullScreen" visible={this.props.isOpen} style={styles.modalContainer}>
                <SafeAreaView style={{flex: 1, backgroundColor: "#F5F5F5"}}>
                    <View>
                    <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <IconButton icon="clear" color="black" onPress={this.props.closeModalMethod}/>
                        <Text style={{        fontSize: 22,
        fontWeight: "500",}}>
                            {this.state.packInformation.pack_title}
                        </Text>
                        <IconButton icon="chat-bubble-outline" color="black" onPress={() => this.setState({ packChatModalIsOpen: true })}/>
                        </View>
                    </View>    


                <View style={{flex: 3, alignItems: "center", justifyContent: "center"}}>
                    <Carousel shouldRasterizeIOS={true}
                ref={(c) => { this._carousel = c; }}
              data={this.state.packEvents}
              renderItem={this._renderItem}
              sliderWidth={Dimensions.get('screen').width}
              itemWidth={250}/>

              <View style={{flex: 1, flexDirection: 'row', alignItems: "center", justifyContent: "center"}}>
                  {
                    this.state.currentUserIsPackLeader == true ? <IconButton icon="event" onPress={() => {this.setState({ createEventModalIsOpen: true })}} /> : null
                  }
            </View>    

              <View style={{flex: 1, alignItems: "center", justifyContent: "center", marginTop: 15}}>
                  <View style={{width: "100%", flexDirection: "row", justifyContent: "space-evenly"}}>
                  <Button mode="contained" color="#2196F3" theme={{roundness: 20}} onPress={this.handleLeavePack}>
                      Leave Pack
                  </Button>
                 {/* <Button mode="outlined" color="#2196F3" theme={{roundness: 20}} onPress={() => alert('Invite a Friend Pressed')}>
                      Invite a Friend
                </Button> */}
                  </View>
              </View>


                </View> 

                <View style={{flex: 1.5, flexDirection: "column"}}>
                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <Text style={styles.header}>
                    Members
                </Text>
                <Button mode="text" color="black">
                    View all
                </Button>
                </View>

                <ScrollView horizontal={true} shouldRasterizeIOS={true} overScrollMode="always" contentContainerStyle={{alignItems: "flex-start", justifyContent: "space-around", flexDirection: "row", flexWrap: 'wrap'}}>
                       {this.mapMembers()}
                    </ScrollView>



                </View>
                
               
               <PackInformationSlider />
               <CreateEvent packUUID={this.state.packUUID} isOpen={this.state.createEventModalIsOpen} closeModalMethod={this.handleCreateEventModalClose}/>
               <PackChatModal packUUID={this.state.packUUID} isOpen={this.state.packChatModalIsOpen} />
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
        fontSize : 25,
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