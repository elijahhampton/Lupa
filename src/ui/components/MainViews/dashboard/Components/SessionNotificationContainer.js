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
    IconButton,
    Surface,
    Avatar
} from 'react-native-paper';

import ModifySessionModal from '../../../Modals/Session/ModifySessionModal';
import PackModal from '../../../Modals/PackModal/PackModal';

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
                            <PackModal packUUID={props.packUUID} closeModalMethod={this.handleCloseModal} isOpen={showModal}/>
                    </TouchableOpacity>
    )
}




export default class SessionNotificationContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showModifySessionModal: false,
            sessionUUID: this.props.sessionUUID,
        }
    }

    render() {
        return (
            <TouchableOpacity style={{margin: 5}} onPress={() => this.setState({ showModifySessionModal: true })}>
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

            <ModifySessionModal sessionUUID={this.state.sessionUUID} isOpen={this.state.showModifySessionModal} />
            </TouchableOpacity>
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