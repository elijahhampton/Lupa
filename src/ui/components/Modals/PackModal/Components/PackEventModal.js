import React, { useState } from 'react';

import {
    Modal,
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    ActionSheetIOS,
    ImageBackground
} from 'react-native';

import {
    IconButton,
    Surface,
    Caption,
    Button,
    Modal as PaperModal,
    Portal,
    Provider,
    Paragraph,
    Headline,
    Title
} from 'react-native-paper';

import LupaController from '../../../../../controller/lupa/LupaController';

export default class PackEventModal extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            eventAttendees: []
        }

    }

    componentDidMount() {
        this.setupPackEventModal();
    }

    setupPackEventModal = async () => {
        const packAttendees = this.props.packAttendees;
        //We only care about each attendees picture so we only bring back a list of photo_urls for now.
        await packAttendees.map(async attendee => {
            await this.LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(attendee, 'photo_url').then(result => {
                attendee = result;
            });
        });

        await this.setState({ eventAttendees: packAttendees });
    }

    mapAttendees = () => {
        return this.state.eventAttendees.length == 0 ? null : this.state.eventAttendees.map(attendee => {
            return <Avatar.Text label="EH" />
        })
    }

    render() {
        return (
            <Modal presentationStyle="fullScreen" visible={this.props.isOpen} style={styles.modalContainer}>
                <ImageBackground source={{ uri: this.props.packEventImage }} style={{ flex: 1 }}>
                    <IconButton style={{margin: 25}} icon="clear" color="white" onPress={this.props.closeModalMethod}/>
                </ImageBackground>
                <View style={{ flex: 2}}>
                    <Headline>
                        {this.props.packEventTitle}
                    </Headline>

                    <View>
                        <Title>
                            Time/Day
                        </Title>
                        <Text>  
                            {this.props.packEventDate.seconds}
                        </Text>
                    </View>

                    
                    <View>
                        <Title>
                            Event Description
                        </Title>
                        <Text>  
                            {this.props.packEventDescription}
                        </Text>
                    </View>

                    <View>
                        <Title>
                            Attendees
                        </Title>
                        <View style={{flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap'}}>
                            {this.mapAttendees()}
                        </View>
                    </View>
                    </View>                                
            </Modal>
        );
        }
}

const styles = StyleSheet.create({
    modalContainer: {
        display: "flex",
        margin: 0,
        backgroundColor: "#FAFAFA",
    },
});