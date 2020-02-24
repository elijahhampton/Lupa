import React, { useState } from 'react'

import {
    View,
    StyleSheet,
    Text,
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

import { withNavigation } from 'react-navigation';

import ModifySessionModal from '../../../Modals/Session/ModifySessionModal';
import SessionCompleteModal from '../../../Modals/Session/SessionCompleteModal';
import PackModal from '../../../Modals/PackModal/PackModal';

import LupaController from '../../../../../controller/lupa/LupaController';

export const PackEventNotificationContainer = (props) => {
    const [showModal, setShowModal] = useState(false);

    handleCloseModal = () => {
        setShowModal(false);
    }

    return (
            <TouchableOpacity style={{flexDirection: 'column', margin: 5}} onPress={() => setShowModal(true)}>
                        <Avatar.Image source={{uri: props.packEventImage}} style={{elevation: 5}} size={55} />
                        <Text style={{fontWeight: '500'}}>
                                {props.packEventTitle}
                            </Text>
                            <Text style={{fontWeight: '500'}}>
                                {props.packEventDate}
                            </Text>
                            <Text style={{fontWeight: '500'}}>
                               {props.numAttending} attending
                            </Text>
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

    getSessionModal = (sessionStatus, sessionMode) => {
        console.log('isndie of getsions modal')
        if (sessionStatus == 'Pending' || sessionStatus == 'Set' && sessionMode == 'Active')
        {
            return <ModifySessionModal sessionUUID={this.state.sessionUUID} isOpen={this.state.showModifySessionModal} />
        }

        if (sessionStatus == 'Set' && sessionMode == 'Expired')
        {
            console.log('Showing complte modal')
            return <SessionCompleteModal sessionUUID={this.state.sessionUUID} isOpen={this.state.showModifySessionModal}/>
        }
    }

    handleCloseModal = () => {
        this.setState({ showRemoveSessionModal: false })
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
                    
                        <Text style={{margin: 3}}>
                        {this.props.sessionStatus}
                        </Text>
                        </View>

                    <View style={{width: "100%", flexDirection: "column", justifyContent: "flex-start"}}>
                    <Text style={{fontWeight: 'bold'}}>
                        {this.props.title}
                    </Text>
                    <Text numberOfLines={2} ellipsizeMode="tail"  style={{ includeFontPadding: true, padding: 3 }}>
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
        padding: 10,
        width: 310,
        borderRadius: 15,
        elevation: 3,
        backgroundColor: "white"
    },
    initialView: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
    },
});