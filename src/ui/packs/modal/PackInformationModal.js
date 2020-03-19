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
    Button,
    Divider,
    Avatar
} from 'react-native-paper';

import { connect } from 'react-redux';

import LupaController from '../../../controller/lupa/LupaController';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state
    }
}

class PackInformationModal extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            packUUID: this.props.packUUID,
            packInformation: [],
            packLeaderInformation: {},
            members: [],
            ready: false
        }
    }

    componentDidMount = async () => {
        await this.setupPackInformation();

    }

    setupPackInformation  = async () => {
        let packInformationIn, packLeaderInformationIn;

        await this.LUPA_CONTROLLER_INSTANCE.getPackInformationByUUID(this.props.packUUID).then(result => {
            packInformationIn = result;
        });

        await this.LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(packInformationIn.pack_leader).then(result => {
            packLeaderInformationIn = result;
        })

        await this.setState({ packInformation: packInformationIn, packLeaderInformation: packLeaderInformationIn, members: packInformationIn.pack_members, ready: true});

    }

    renderRequestToJoinButton = () => {
        this.state.packInformation.pack_requests.includes(this.props.lupa_data.Users.currUserData.user_uuid) == true ?
        <View style={{width: '100%', justifyContent: 'center'}}>
                            <Button disabled={true} mode="contained" color="#BDBDBD" onPress={() => this.LUPA_CONTROLLER_INSTANCE.requestToJoinPack(this.props.lupa_data.Users.currUserData.user_uuid, this.state.packUUID)}>
                                Request to Join Pack 
                            </Button>
                        </View>
        :
        <View style={{width: '100%', justifyContent: 'center'}}>
                            <Button mode="contained" color="#2196F3" onPress={() => this.LUPA_CONTROLLER_INSTANCE.requestToJoinPack(this.props.lupa_data.Users.currUserData.user_uuid, this.state.packUUID)}>
                                Request to Join Pack 
                            </Button>
                        </View>
    }

    render() {
        return (
                <Modal animationType="slide" presentationStyle="pageSheet" onDissmiss={this.props.closeModalMethod} onRequestClose={this.props.closeModalMethod} visible={this.props.isOpen}>
                    <View style={{flex: 1, padding: 10}}>
                        <View style={{padding: 20, flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Headline>
                            {this.state.ready && this.state.packInformation.pack_title}
                        </Headline>

                        <Title style={{color: "#2196F3"}}>
                            {this.state.ready && this.state.packInformation.pack_type}
                        </Title>
                        </View>

                        <View style={{flexDirection: 'column', alignItems: 'center', padding: 5}}>
                            <Avatar.Image source={{uri: this.state.packLeaderInformation.photo_url}} size={50} style={{margin: 5}} />
                            <Text style={{fontWeight: 'bold'}}>
                                Pack Leader Name
                            </Text>
                            <Text>
                                {this.state.packLeaderInformation.display_name}
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
                                    Members: {this.state.members.length}
                                </Title>

                            </View>

                            {
                            this.state.packInformation.isDefault == false ?
                            this.renderRequestToJoinButton()
                        :
                        null
                        }
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
        fontWeight: "600",
        color: "black",
    },
    alignColumnItemsCenter: {
        flexDirection: 'column',
        alignItems: 'center'
    }
})

export default connect(mapStateToProps)(PackInformationModal);