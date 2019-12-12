import React, { useState } from 'react'

import {
    View,
    StyleSheet,
    Text,
    Animated,
    Easing,
    TouchableOpacity,
} from 'react-native';

import {
    Surface, 
    Chip,
    Button,
    Caption
} from 'react-native-paper';

import {
    Feather as Icon
} from '@expo/vector-icons';

import ModifySessionModal from '../../../Modals/Session/ModifySessionModal';
import CancelSessionModal from '../../../Modals/Session/CancelSessionModal';


export default class SessionNotificationContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            height: 0,
            showModifySessionModal: false,
        }
    }

    _expandContainer = () => {
        this.setState({
            height: 'auto'
        })
    }

    _showModifySessionModal = () => {
        this.setState({
            showModifySessionModal: true,
        })
    }

    _handleSessionCancellation = () => {

    }

    render() {
        return (
            <TouchableOpacity onPress={this._expandContainer}>
                    <View style={styles.root}>
                <Surface style={styles.surface}>
                    <View style={styles.initialView}>
                    <Text>
                        Elijah Hampton
                    </Text>
    
                    <Chip mode="outlined" style={{elevation: 3, height: 25, backgroundColor: "rgba(244,67,54 ,1)"}}>
                        <Caption>
                        Expired
                        </Caption>

                    </Chip>
                    </View>
                    <View style={{height: this.state.height, padding: 0, justifyContent: "center"}}>
                        <View style={{flexDirection: 'column', alignItems: "center", padding: 10}}>
                        <Caption>
                                    Session Name
                                </Caption>
                                <Caption ellipsizeMode="tail">
                                    This is the description of a session and what is going to happen during it.  How fun it is going to be to launch Lupa Sessions!
                                </Caption>
                            <Text style={{fontWeight: "bold"}}>
                                Tiger Iron Gym
                            </Text>
                            <Text>
                                    May 27, 2019
                                </Text>
                                <Text>
                                    5:45
                                </Text>

                        </View>
                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                            <Button mode="text" color="rgba(38,50,56 ,1)" onPress={() => this._showModifySessionModal}>
                                Modify
                            </Button>
                            <Button mode="text" color="rgba(244,67,54 ,1)" onPress={() => this._handleSessionCancellation}>
                                Cancel
                            </Button>
                        </View>
                    </View>
                </Surface>
            </View>

            <ModifySessionModal isOpen={this.state.showModifySessionModal} />
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        margin: 5
    },
    surface: {
        width: "100%",
        height: "auto",
        borderRadius: 15,
        backgroundColor: 'rgba(245,245,245 ,0.8)',
        elevation: 3,
        padding: 5
    },
    initialView: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 30,
    },
});