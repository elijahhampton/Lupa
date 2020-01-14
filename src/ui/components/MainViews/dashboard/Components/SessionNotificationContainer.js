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
    IconButton
} from 'react-native-paper';

import ModifySessionModal from '../../../Modals/Session/ModifySessionModal';


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
            <TouchableOpacity onPress={() => this.setState({ showModifySessionModal: true })}>
                    <View style={styles.root}>
                <Card style={styles.surface}>
                    <View style={styles.initialView}>
                        <View style={{width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                        <Text>
                        {this.props.title}
                    </Text>
                    <Chip mode="outlined" style={{elevation: 3, height: 20, width: 90, backgroundColor: "rgba(244,67,54 ,1)"}}>
                        <Caption>
                        {this.props.sessionStatus}
                        </Caption>

                    </Chip>
                        </View>

                    <View style={{width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <Text>
                        {this.props.date}
                    </Text>
                    <Text>
                        {this.props.userToDisplay}
                    </Text>
                    </View>
    
                   
                    </View>
                </Card>
            </View>

            <ModifySessionModal sessionUUID={this.state.sessionUUID} isOpen={this.state.showModifySessionModal} />
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        margin: 5
    },
    surface: {
        
        padding: 5
    },
    initialView: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
    },
});