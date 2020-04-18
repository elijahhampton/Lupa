import React, { useState } from 'react'

import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    Animated,
} from 'react-native';

import {
    Chip,
    Caption,
    Card,
    Portal,
    Badge,
    Button,
    IconButton,
    Surface,
    Modal,
    Avatar
} from 'react-native-paper';

import { Icon } from 'react-native-elements';

import ModifySessionModal from '../../../sessions/modal/ModifySessionModal';
import SessionCompleteModal from '../../../sessions/modal/SessionCompleteModal';

import PackEventModal from '../../../packs/modal/PackEventModal';

import LupaController from '../../../../controller/lupa/LupaController';
import { Feather } from '@expo/vector-icons';

export const PackEventNotificationContainer = (props) => {
    const [showModal, setShowModal] = useState(false);
    const [packEventObject, setPackEventObject] = useState(props.packEventObject);

    return (
            <TouchableOpacity style={{flexDirection: 'column', margin: 5}} onPress={() => setShowModal(true)}>
                <Surface style={{elevation: 3, width: 50, height: 50, borderRadius: 50}}>
                    <Image source={{uri: props.packEventImage}} style={{elevation: 10,}} size={55} />
                </Surface>
                        <Text style={{fontWeight: '500'}}>
                                {props.packEventTitle}
                            </Text>
                            <Text style={{fontWeight: '500'}}>
                                {props.packEventDate}
                            </Text>
                            <Text style={{fontWeight: '500'}}>
                               {props.numAttending} attending
                            </Text>
                            <PackEventModal isOpen={showModal} closeModalMethod={() => setShowModal(false)} packEventTime={packEventObject.pack_event_time} packEventTitle={packEventObject.pack_event_title} packEventDescription={packEventObject.pack_event_description} packEventAttendees={packEventObject.attendees} packEventDate={packEventObject.pack_event_date} packEventUUID={packEventObject.pack_event_uuid} packEventAttendees={packEventObject.attendees}/>
                    </TouchableOpacity>
    )
}


export default class SessionNotificationContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showModifySessionModal: false,
            showRemoveSessionModal: false,
            sessionUUID: this.props.sessionUUID,
            sessionStatus: this.props.sessionStatus,
            sessionMode: this.props.sessionMode,
            sessionData: this.props.sessionData,
            userData: {},
            containerWidth: new Animated.Value(60),
            toggleButtons: false,
        }
        
        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    }

    componentDidMount = async () => {
        let userDataIn;

        await this.LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(this.state.sessionData.attendeeOne).then(result => {
            userDataIn = result;
        });

        await this.setState({
            userData: userDataIn,
        })
    }

    toggleButtons = async () => {
        await this.setState({
            toggleButtons: !this.state.toggleButtons
        })

        this.state.toggleButtons == true ?

        Animated.timing(this.state.containerWidth, {
            toValue: 200,
            duration: 1000,
        }).start()
        :
        Animated.timing(this.state.containerWidth, {
            toValue: 60,
            duration: 1000,
        }).start();
    }

    untoggleButtons = () => {
        
    }

    handleCloseModal = () => {
        this.setState({ showModifySessionModal: false })
    }

    getSessionModal = (sessionStatus, sessionMode) => {
        if (sessionStatus == 'Pending' || sessionStatus == 'Set' && sessionMode == 'Active')
        {
            return <ModifySessionModal sessionUUID={this.state.sessionUUID} closeModalMethod={this.handleCloseModal} isOpen={this.state.showModifySessionModal} />
        }

        if (sessionStatus == 'Set' && sessionMode == 'Expired')
        {
            return <SessionCompleteModal sessionUUID={this.state.sessionUUID} closeModalMethod={this.handleCloseModal} isOpen={this.state.showModifySessionModal}/>
        }
    }

    getSessionBadge = (sessionStatus) => {
        if (sessionStatus == "Pending")
        {
            return <Feather name="minus-circle" color="red"/>
        }
        else if (sessionStatus == "Set")
        {
            <Feather name="check" color="green"/>
        }
    }


    render() {
        return (
            <TouchableOpacity style={{margin: 10}} onPress={this.toggleButtons}>
                <Animated.View style={{height: "auto", width: this.state.containerWidth, flexDirection: "row", alignItems: "center"}}>
                    <Surface style={styles.surface}>
                        
                    <Image source={{uri: this.state.userData.photo_url}} style={{flex: 1, borderRadius: 80}} />
                    <Badge style={{position: "absolute", backgroundColor: "white", elevation: 10}}>
                     <Feather name="check" color="green"/>
                        </Badge>
                    {/*<View style={styles.initialView}>
                        <View style={{width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                        <View>
                        <Text style={{fontWeight: 'bold'}}>
                        {this.props.date}
                        </Text>
                        <View style={{width: "100%", flexDirection: "column", }}>
                    <Text style={{fontWeight: 'bold'}}>
                        {this.props.title}
                    </Text>

                    <Text numberOfLines={1} ellipsizeMode="tail"  style={{ includeFontPadding: true, paddingTop: 3 }}>
                        {this.props.description}
                    </Text>
                    </View>
                        </View>
                    
                        <Chip mode="flat" style={{backgroundColor: this.props.sessionStatus === "Set" ? '#2196F3': '#f44336', elevation: 5, alignSelf: "flex-start"}}>
                        {this.props.sessionStatus}
                        </Chip>
                        </View>
    
                   
                    </View>*/}
                </Surface>
{
    this.state.toggleButtons ?
    <>
<Icon
  name='info'
  type='feather'
  color='212121'
  raised
style={{backgroundColor: "black", position: 'absolute', left: 0}}
underlayColor={{backgroundColor: "black"}}
reverseColor="white"
reverse
onPress={() => this.setState({ showModifySessionModal: true })}
/>

<Icon
  name='x'
  type='feather'
  color='f44336'
  raised
style={{backgroundColor: "black", alignSelf: "center"}}
underlayColor={{backgroundColor: "black"}}
reverseColor="white"
reverse
onPress={() => this.setState({ showRemoveSessionModal: true })}
/>
</>
:
null
    }
                </Animated.View>
                
                {
                    this.getSessionModal(this.state.sessionStatus, this.state.sessionMode)
                }
                <RemoveSessionModal isOpen={this.state.showRemoveSessionModal} sessionUUID={this.state.sessionUUID} closeModalMethod={this.handleCloseModal} />
            </TouchableOpacity>
        )
    }
}

//TODO - Doesn't work... have to remove for specific UUID
class RemoveSessionModal extends React.Component {

    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            sessionUUID: this.props.sessionUUID,
            sessionStatus: this.props.sessionStatus,
            sessionMode: this.props.sessionMode,
            toggleState: false,
        }
    }

    handleRemoveSessionNotification = () => {

        /*this.LUPA_CONTROLLER_INSTANCE.updateSession(this.state.sessionUUID, 'removed', true, currUserUUID);
        this.setState({ toggleState: !this.state.toggleState});
        this.props.closeModalMethod();*/
    }

    render() {
        return (
            <Portal>
                <Modal visible={this.props.isOpen} contentContainerStyle={{display: "flex", padding: 10, 
        margin:0,
       backgroundColor: "white", width: '95%', height: '30%', alignSelf: 'center',}} dismissable={true} onDissmiss={() => this.props.closeModalMethod()}>
    
           <Text>
               Are you sure you want to remove this session notification from your dashboard?  (You cannot reverse this action).
           </Text>
    
           <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
            <Button mode="text" color="#f44336" onPress={() => this.handleRemoveSessionNotification()}>
                Remove
            </Button>
    
            <Button color="#2196F3" onPress={() => this.props.closeModalMethod()}>
                Cancel
            </Button>
           </View>
    
                </Modal>
            </Portal>
    )
    }


    }

const styles = StyleSheet.create({
    surface: { 
        width: 60,
        height: 60,
        borderRadius: 80,
        elevation: 7,
        backgroundColor: "transparent",
    },
    initialView: {
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 5,
    },
});