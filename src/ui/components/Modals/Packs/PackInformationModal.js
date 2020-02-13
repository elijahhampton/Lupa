import React, { useState, useEffect } from 'react';

import {
    View,
    Text,
    StyleSheet,
    Modal,
    ScrollView
} from 'react-native';

import {
    Headline,
    Paragraph,
    Title,
    Divider,
    Avatar
} from 'react-native-paper';

import { Rating } from 'react-native-elements';

import LupaController from '../../../../controller/lupa/LupaController';

export default class PackInformationModal extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            packUUID: this.props.packUUID,
            packInformation: [],
            packLeaderPhotoURI: '',
            ready: false
        }
    }

    componentDidMount = async () => {
        await this.setupPackInformation();

    }

    setupPackInformation  = async () => {
        let packInformationIn, packLeaderPhotoURIIn;

        await this.LUPA_CONTROLLER_INSTANCE.getPackInformationByUUID(this.state.packUUID).then(result => {
            packInformationIn = result;
        });

        await this.setState({ packInformation: packInformationIn, ready: true});
    }

    render() {
        return (
                <Modal animationType="slide" presentationStyle="pageSheet" onDismiss={this.props.closeModalMethod} visible={this.props.isOpen}>
                    <View style={{flex: 1, padding: 10}}>
                    <Headline style={{padding: 10}}>
                            {this.state.ready && this.state.packInformation.pack_title}
                        </Headline>

                        <View style={{flexDirection: 'column', alignItems: 'center', padding: 5}}>
                            <Avatar.Image source={{uri: this.state.packLeaderPhotoURI}} size={50} style={{margin: 5}} />
                            <Text style={{fontWeight: 'bold'}}>
                                Pack Leader Name
                            </Text>
                            <Text style={{fontWeight: 'bold', fontSize: 15}}>
                                City, State
                            </Text>
                            </View>
                        <Divider />
                        <View style={{padding: 10, justifyContent: 'space-evenly', flex: 1}}>
                            <View style={styles.alignColumnItemsCenter}>
                                <Title>
                                    Location
                                </Title>
                                <Text>
                                    {this.state.ready && this.state.packInformation.pack_location.city + ", " + this.state.packInformation.pack_location.state }
                               </Text>
                            </View>

                            <Divider />

                            <View style={styles.alignColumnItemsCenter}>
                                <Title>
                                    Description
                                </Title>
                                <Text>
                                    {this.state.packInformation.pack_description}
                                </Text>
                            </View>

                            <Divider />

                            <View style={styles.alignColumnItemsCenter}>
                                <Title>
                                    Sessions Completed: {this.state.ready && this.state.packInformation.pack_sessions_completed}
                                </Title>

                            </View>
                        </View>
                    
                    </View>
                </Modal>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        alignSelf: "center",
        width: "60%",
        height: "60%",
        backgroundColor: "white",
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        padding: 10,
        borderRadius: 10,
    },
    surface: {
        width: '100%',
        height: 70,
        elevation: 6,
        margin: 5,
        alignItems: "center",
        justifyContent: "center"
    },
    text: {
        fontSize: 20,
        fontWeight: '600',
        color: "black",
    },
    alignColumnItemsCenter: {
        flexDirection: 'column',
        alignItems: 'center'
    }
})