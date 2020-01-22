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

export const PackEventNotificationContainer = (props) => {
    return (
            <TouchableOpacity style={{flexDirection: 'column', margin: 5}} onPress={() => alert('Pack Container')}>
                        <Avatar.Image style={{elevation: 5}} size={55} />
                        <Text style={{fontWeight: '500'}}>
                                Jogging Day
                            </Text>
                            <Text style={{fontWeight: '500'}}>
                                January 15, 2019 5:30 PM
                            </Text>
                            <Text style={{fontWeight: '500'}}>
                               6 attending
                            </Text>
                            {/* <PackModal /> */}
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
            <TouchableOpacity onPress={() => this.setState({ showModifySessionModal: true })}>
                <Surface style={styles.surface}>
                    <View style={styles.initialView}>
                        <View style={{width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                        <Text style={{fontWeight: '500'}}>
                        {this.props.title}
                    </Text>
                    <Chip mode="outlined" style={{elevation: 3, height: 20, width: 90, backgroundColor: "rgba(244,67,54 ,1)"}}>
                        <Caption>
                        {this.props.sessionStatus}
                        </Caption>

                    </Chip>
                        </View>

                    <View style={{width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <Text style={{fontWeight: '500'}}>
                        {this.props.date}
                    </Text>
                    </View>

                    <Text style={{alignSelf: "flex-start", fontWeight: 'bold', color: "#2196F3"}}>
                        Elijah Hampton
                    </Text>
    
                   
                    </View>
                </Surface>

            <ModifySessionModal sessionUUID={this.state.sessionUUID} isOpen={this.state.showModifySessionModal} />
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    surface: {
        margin: 5,
        padding: 10,
        width: 210,
        borderRadius: 15,
        elevation: 3,
    },
    initialView: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
    },
});