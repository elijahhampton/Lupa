import React from 'react';

import {
    Modal,
    View,
    Text,
    StyleSheet,
    Button,
    ImageBackground
} from 'react-native';

import {
    Headline,
    Title,
    Avatar
} from 'react-native-paper';

import LupaController from '../../../../../controller/lupa/LupaController';

export default class PackEventModal extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            eventAttendees: [],
            packEventUUID: this.props.packEventUUID,
            packEventImage: "",
        }

    }

    componentDidMount = async () => {
        await this.setupPackEventModal();
    }

    setupPackEventModal = async () => {
        let packEventImageIn;
        await this.LUPA_CONTROLLER_INSTANCE.getPackEventImageFromUUID(this.state.packEventUUID).then(result => {
            packEventImageIn = result;
        })

        const packAttendees = this.props.packEventAttendees;
        let attendeeInformationArr = [];
        if (true && packAttendees.length) 
        {
            if (packAttendees.length == 0) {
                return;
            }
            else 
            {
                for (let i = 0; i < packAttendees.length; ++i) {
                    let attendeeInformation;
                    await this.LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(packAttendees[i]).then(result => {
                        attendeeInformation = result;
                    });

                    await attendeeInformationArr.push(attendeeInformation);
                }
            }
        }
        await this.setState({ eventAttendees: attendeeInformationArr, packEventImage: packEventImageIn });
    }

    mapAttendees = () => {
        if (true && this.state.eventAttendees.length) 
        {
            if (this.state.eventAttendees.length == 0)
            {
                return (
                    <Caption>
                        There is no one signed up to attend this event.
                    </Caption>
                )
            }
            else
            {  
                return this.state.eventAttendees.map(attendee => {
                    let profilePictureURL;
                    this.LUPA_CONTROLLER_INSTANCE.getUserProfileImageFromUUID(attendee.user_uuid).then(result => {
                        profilePictureURL = result;
                    });

                    if (profilePictureURL == '' || profilePictureURL == undefined)
                    {
                        let displayName = attendee.display_name.split(" ");
                        let firstInitial = displayName[0].charAt(0);
                        let lastInitial = displayName[0].charAt(0);
                        return (
                            <Avatar.Text size={30} label={firstInitial+lastInitial} style={{margin: 3}} />
                        )
                    }
    
                    return (
                        <Avatar.Image size={30} source={{ uri: profilePictureURL }} style={{margin: 3}} />
                    )
                })
            }
        }
    }

    getPackEventImage = () => {
        if (this.state.packEventImage = "" || this.state.packEventImage == undefined)
        {
            return (
            <View style={{flex: 1, backgroundColor: 'black'}}>

            </View>
            )
        }

        try {
            return (<ImageBackground source={{ uri: this.state.packEventImage }} style={{ flex: 1 }}>
                </ImageBackground>)
        } catch(err)
        {
            return (
                <View style={{flex: 1, backgroundColor: 'black'}}>
    
                </View>
                )
        }

    }

    handleMapAttendees = () => {
        return this.mapAttendees().then(result => {
            return result;
        })
    }

    handleClosePackEventModal = () => {
        this.props.closeModalMethod();
    }

    convertDate = (date) => {
        const dateParts = date.split("-");
        let month = dateParts[0];
        month = month.replace(month.charAt(0), month.charAt(0).toUpperCase());

        let day = dateParts[1];

        let year = dateParts[2];

        return month + " " + day + "," + " " + year;
    }

    render() {
        return (
            <Modal presentationStyle="fullScreen" visible={this.props.isOpen} style={styles.modalContainer}>
                <ImageBackground source={{ uri: this.props.packEventImage }} style={{ flex: 1 }}>
                </ImageBackground>
                <View style={{ flex: 2, justifyContent: 'space-evenly', flexGrow: 2, padding: 10 }}>
                    <Headline>
                        {this.props.packEventTitle}
                    </Headline>

                    <View>
                        <Title>
                            Time/Day
                        </Title>
                        <Text>
                            {this.convertDate(this.props.packEventDate)} at {this.props.packEventTime}
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
                        <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                            {this.mapAttendees()}
                        </View>
                    </View>
                    <Button title="Close" onPress={this.handleClosePackEventModal} style={{ alignSelf: 'center' }} />
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