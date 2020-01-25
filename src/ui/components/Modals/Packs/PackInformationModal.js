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
            packInformation: {},
        }
    }

    componentDidMount = () => {
        this.setupPackInformation();

    }

    setupPackInformation  = async () => {
        let packInformationIn;
        await this.LUPA_CONTROLLER_INSTANCE.getPackInformationByUUID(this.state.packUUID).then(result => {
            packInformationIn = result;
        });

        await this.setState({ packInformation: packInformationIn });
    }

    render() {
        return (
                <Modal style={{height: '80%', width: '80%'}} presentationStyle="pageSheet" onRequestClose={this.props.closeModalMethod} onDismiss={this.props.closeModalMethod} visible={this.props.isOpen}>
                    {
                        console.log(this.state.packInformation)
                    }
                    <View style={{flex: 1}}>
                    <Headline style={{padding: 10}}>
                            Announcements
                        </Headline>
                        <Divider />
                        <View style={{padding: 10, alignItems: 'center', justifyContent: 'space-evenly', flex: 1}}>
                            <View style={{flexDirection: 'column', alignItems: 'center'}}>
                                <Title>
                                    Pack Leader
                                </Title>
                                <Avatar.Text label="EH" size={50} style={{margin: 5}} />
                            </View>

                            <Divider />

                            <View>
                                <Title>
                                    Created on
                                </Title>
                                <Text>
                                January 5, 2020
                                </Text>

                            </View>

                            <Divider />

                            <View>
                                <Title>
                                    Location
                                </Title>
                                <Text>
                                Chicago United States
                                </Text>
                            </View>

                            <Divider />

                            <View>
                                <Title>
                                    Description
                                </Title>
                                <Text>
                                Description
                                </Text>
                            </View>

                            <Divider />

                            <View>
                                <Title>
                                    Sessions Completed: 
                                </Title>
                            </View>
                        </View>
                    
                    </View>
                    {/*
                    <Surface style={styles.surface}>
                        <Text style={styles.text}>
                            {this.state.packInformation.pack_title}
                        </Text>
                    </Surface>

                    <Surface style={styles.surface}>
                        <Text style={styles.text}>
                            {this.state.packInformation.pack_description}
                        </Text>
                    </Surface>

                    <Surface style={styles.surface}>
                        <Text style={styles.text}>
                            This pack has 30 members.
                    </Text>
                    </Surface>

                    <Surface style={styles.surface}>
                        <Text style={styles.text}>
                            This pack is based out of: Chicago, Illinois
                    </Text>
                    </Surface> */}
                </Modal>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        alignSelf: "center",
        width: "80%",
        height: "60%",
        backgroundColor: "white",
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
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
    align
})