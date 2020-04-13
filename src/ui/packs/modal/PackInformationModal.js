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
    Caption,
    Button,
    Divider,
    Avatar
} from 'react-native-paper';

import { Button as ReactNativeElementsButton, Icon } from 'react-native-elements';

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
            packInformation: {},
            packLeaderInformation: {},
            packImageUrl: "",
            members: [],
            ready: false
        }
    }

    componentDidMount = async () => {
        await this.setupPackInformation();

    }

    setupPackInformation  = async () => {
        let packInformationIn, packLeaderInformationIn, packImageUrlIn;

        await this.LUPA_CONTROLLER_INSTANCE.getPackInformationByUUID(this.props.packUUID).then(result => {
            packInformationIn = result;
        });

        await this.LUPA_CONTROLLER_INSTANCE.getPackImageFromUUID(this.props.packUUID).then(result => {
            packImageUrlIn = result;
        });

        await this.LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(packInformationIn.pack_leader).then(result => {
            packLeaderInformationIn = result;
        });

        await this.setState({ 
            packInformation: packInformationIn, 
            packLeaderInformation: packLeaderInformationIn, 
            packImageUrl: packImageUrlIn, 
            members: packInformationIn.pack_members,
            ready: true
        });
    }

    renderRequestToJoinButton = () => {
        return this.state.ready ?
        this.state.packInformation.pack_requests.includes(this.props.lupa_data.Users.currUserData.user_uuid) == true ?
<Button  onPress={() => this.LUPA_CONTROLLER_INSTANCE.requestToJoinPack(this.props.lupa_data.Users.currUserData.user_uuid, this.state.packUUID)} disabled={true} mode="outlined" style={{padding: 20, borderRadius: 80, width: "85%", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly"}} color="black">
<Icon type="material" name="group" color="black" />
<>
Request to join {" "}
        <Text style={{fontFamily: "avenir-next-bold", fontSize: 15, padding: 5}}>
            {this.state.packInformation.pack_title}
            </Text>
</>
</Button>
        :

<Button  onPress={() => this.LUPA_CONTROLLER_INSTANCE.requestToJoinPack(this.props.lupa_data.Users.currUserData.user_uuid, this.state.packUUID)} mode="outlined" style={{padding: 20, borderRadius: 80, width: "85%", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly"}} color="black">
<Icon type="material" name="group" color="black" />
<>
Request to join {" "}
        <Text style={{fontFamily: "avenir-next-bold", fontSize: 15, padding: 5}}>
            {this.state.packInformation.pack_title}
            </Text>
</>
</Button>
:
null
    }

    mapFeaturedEvents = () => {
        return (
            <Caption>
                {this.state.packInformation.pack_title} has no featured events at the moment!
            </Caption>
        )
    }

    mapFriendsInPack = () => {
        return (
            <Caption>
                You have no friends currently in this pack.
            </Caption>
        )
    }

    getPackImage = () => {
        try {
            return (
                <Avatar.Image style={{margin: 10}} source={{uri: this.state.packImageUrl}} />
            )
        }
        catch(err) {
            return (
                <Avatar.Text label="EX" style={{margin: 10}} source={{uri: this.state.packImageUrl}} />
            )
        }
    }

    shouldComponentUpdate(state, props) {
        return true;
    }

    render() {
        return (
                <Modal animationType="slide" presentationStyle="pageSheet" onDismiss={this.props.closeModalMethod} onRequestClose={this.props.closeModalMethod} visible={this.props.isOpen}>
                    <ScrollView contentContainerStyle={{justifyContent: "space-evenly", flexGrow: 1}}>

                    <Text style={{position: "absolute", right: 0, top: 0, marginTop: 20, marginRight: 40, fontFamily: "avenir-next-bold"}}>
                        Community
                    </Text>

                    <View style={{alignItems: "center", justifyContent: "center"}}>
                   {
                       this.getPackImage()
                   }

                    <View style={{alignItems: "center", justifyContent: "center"}}>
                    <Text style={{fontFamily: "avenir-next-bold", fontSize: 25, padding: 5}}>
                            {                            this.state.packInformation.pack_title}
                        </Text>

                        {
                            this.state.ready  ?
                            <Text style={{fontFamily: "avenir-next-bold", fontSize: 15, padding: 5}}>
                                {this.state.packInformation.pack_location.city + ", " + this.state.packInformation.pack_location.country}
                                </Text>
                                :
                                <Text style={{fontFamily: "avenir-next-bold", fontSize: 15, padding: 5}}>
                                    Pack Location not found
                                </Text>
                        }
                    </View>
                    
                    {this.renderRequestToJoinButton()}
                    </View>

                    <View>
                    <Divider />
                        <View style={{padding: 20, flexDirection: "row", alignItems: "flex-start"}}>
                            <Avatar.Text label="EX" />
                            <View style={{padding: 10, alignItems: "center"}}>
                                <Title>
                                    Pack Leader
                                </Title>
                                
                                {
                            this.state.ready ?
                            <Text style={{fontFamily: "avenir-next-bold", fontSize: 15, padding: 5}}>
                                {this.state.packLeaderInformation.display_name}
                                </Text>
                                :
                                <Text style={{fontFamily: "avenir-next-bold", fontSize: 15, padding: 5}}>
                                    Couln't find pack leader name
                                </Text>
                        }
                            </View>
                        </View>

                        <Paragraph style={{textAlign: "center", fontSize: 15, margin: 10, padding: 5}}>
                            {this.state.packInformation.pack_description}
                        </Paragraph>
                        <Divider />
                    </View>


                    <View style={{padding: 5}}>
                        <Text style={{color: "#212121", fontSize: 20, fontFamily: "avenir-roman"}}>
                            Friends in this pack (0)
                        </Text>
                        <ScrollView horizontal>
                            {
                                this.mapFriendsInPack()
                            }
                        </ScrollView>
                    </View>


                    <View style={{padding: 5}}>
                        <Text style={{color: "#212121", fontSize: 20, fontFamily: "avenir-roman"}}>
                            Featured Events
                        </Text>
                        <ScrollView horizontal>
                            {
                                this.mapFeaturedEvents()
                            }
                        </ScrollView>
                    </View>
                    </ScrollView>
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