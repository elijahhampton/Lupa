import React, { useState } from 'react'

import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity
} from 'react-native';

import {
    Chip,
    Caption,
    Card,
    Portal,
    Button,
    IconButton,
    Surface,
    Modal,
    Avatar
} from 'react-native-paper';

import ModifySessionModal from '../../../sessions/modal/ModifySessionModal';
import SessionCompleteModal from '../../../sessions/modal/SessionCompleteModal';

import PackEventModal from '../../../packs/modal/PackEventModal';

import LupaController from '../../../../controller/lupa/LupaController';

export const PackEventNotificationContainer = (props) => {
    const [showModal, setShowModal] = useState(false);
    const [packEventObject, setPackEventObject] = useState(props.packEventObject);

    return (
            <TouchableOpacity style={{flexDirection: 'column', margin: 5}} onPress={() => setShowModal(true)}>
                <Surface style={{elevation: 3, width: 50, height: 50, borderRadius: 50}}>
                    <Image source={{uri: props.packEventImage}} style={{elevation: 5}} size={55} />
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
            sessionMode: this.props.sessionMode
        }
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


    render() {
        return (
            <TouchableOpacity style={{margin: 5}} onPress={() => this.setState({ showModifySessionModal: true })} onLongPress={() => this.setState({ showRemoveSessionModal: true })}>
                <Surface style={styles.surface}>
                    <View style={styles.initialView}>
                        <View style={{width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                        <Text style={{fontWeight: 'bold'}}>
                        {this.props.date}
                    </Text>
                    
                        <Chip mode="flat" style={{backgroundColor: this.props.sessionStatus === "Set" ? '#2196F3': '#f44336', elevation: 5}}>
                        {this.props.sessionStatus}
                        </Chip>
                        </View>

                    <View style={{width: "100%", flexDirection: "column", }}>
                    <Text style={{fontWeight: 'bold'}}>
                        {this.props.title}
                    </Text>
                    </View>

                    <View style={{}}>
                    <Text numberOfLines={1} ellipsizeMode="tail"  style={{ includeFontPadding: true, paddingTop: 3 }}>
                        {this.props.description}
                    </Text>
                    </View>
    
                   
                    </View>
                </Surface>

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
    
           <View style={{flexDirection: 'row', alignItems: 'row', justifyContent: 'flex-start'}}>
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
        padding: 3,
        width: 310,
        borderRadius: 15,
        height: 80,
        elevation: 3,
        backgroundColor: "#f2f2f2",
    },
    initialView: {
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 5,
    },
});