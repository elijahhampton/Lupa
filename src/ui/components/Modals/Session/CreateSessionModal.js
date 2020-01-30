import React, { useState } from 'react';

import {
    View,
    Text,
    StyleSheet,
    Modal,
    Image,
    Dimensions,
    ScrollView,
    DatePickerIOS,
    Button as NativeButton,
    TouchableOpacity
} from 'react-native';

import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode'

import {
    IconButton,
    Button,
    Surface,
    Caption,
    TextInput,
    Title,
    Headline,
    Divider,
    Menu
} from 'react-native-paper';

import SafeAreaView from 'react-native-safe-area-view';

import { MaterialIcons as Icon, Feather as FeatherIcon } from '@expo/vector-icons';
import LupaController from '../../../../controller/lupa/LupaController';


const days = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']

const SessionInformation = props => {
    return (
        <>
            <View style={{ flex: 1, justifyContent: 'space-evenly', flexDirection: 'column', padding: 5 }}>
                <TextInput mode="outlined" placeholder="Session Name" style={{ margin: 5 }} />
                <TextInput mode="outlined" placeholder="Session Description" multiline={true} style={{ margin: 5, height: 120 }} />
            </View>

            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>



                {/* date selector */}
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <Menu
                        anchor={
                            <Button mode="contained" color="#1A237E">
                                27
                </Button>
                        }>
                        <Menu.Item title="1" />
                        <Menu.Item title="1" />
                        <Menu.Item title="1" />
                        <Menu.Item title="1" />
                        <Menu.Item title="1" />
                        <Menu.Item title="1" />
                        <Divider />
                        <Menu.Item title="Cancel" />
                    </Menu>

                    <Menu
                        anchor={
                            <Button mode="contained" color="#1A237E">
                                January
                </Button>
                        }>
                        <Menu.Item title="1" />
                    </Menu>


                    <Menu
                        anchor={
                            <Button mode="contained" color="#1A237E">
                                2020
                </Button>
                        }>
                        <Menu.Item title="1" />
                    </Menu>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Button mode="text" color="#1A237E">
                        Pick a time
                                </Button>
                    <FeatherIcon name="chevron-right" size={12} stlye={{ margin: 5 }} />
                </View>



            </View>


            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
                    <Button mode="text" color="#2196F3">
                        4:00 PM
            </Button>

                    <Button>
                        5:00 PM
            </Button>

                    <Button mode="text" color="#2196F3">
                        4:00 PM
            </Button>

                    <Button>
                        5:00 PM
            </Button>

                    <Button mode="text" color="#2196F3">
                        4:00 PM
            </Button>

                    <Button>
                        5:00 PM
            </Button>

                    <Button mode="text" color="#2196F3">
                        4:00 PM
            </Button>

                    <Button>
                        5:00 PM
            </Button>

                    <Button mode="text" color="#2196F3">
                        4:00 PM
            </Button>

                    <Button>
                        5:00 PM
            </Button>

                    <Button mode="text" color="#2196F3">
                        4:00 PM
            </Button>

                    <Button>
                        5:00 PM
            </Button>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Button mode="text" color="#1A237E">
                        Back
                                </Button>
                    <Button mode="contained" color="#1A237E">
                        Request
                                </Button>
                </View>
            </View>
        </>
    )
}

const PickADate = (props) => {
    return (
        <View style={{ flex: 1 }}>

            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>



                {/* date selector */}
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <Menu
                        visible={this.state.dayMenuVisible}
                        onDismiss={() => this.setState({ dayMenuVisible: false })}
                        anchor={
                            <Button mode="contained" onPress={() => this.setState({ dayMenuVisible: true })} color="#1A237E">
                                27
                </Button>
                        }>
                        <Menu.Item title="1" />
                        <Menu.Item title="1" />
                        <Menu.Item title="1" />
                        <Menu.Item title="1" />
                        <Menu.Item title="1" />
                        <Menu.Item title="1" />
                        <Divider />
                        <Menu.Item title="Cancel" />
                    </Menu>

                    <Menu
                        visible={this.state.triggerStateChange}
                        onDismiss={() => this.setState({ dayMenuVisible: false })}
                        anchor={
                            <Button mode="contained" color="#1A237E">
                                January
                </Button>
                        }>
                        <Menu.Item title="1" />
                    </Menu>


                    <Menu
                        visible={this.state.triggerStateChange}
                        onDismiss={() => this.setState({ dayMenuVisible: false })}
                        anchor={
                            <Button mode="contained" color="#1A237E">
                                2020
                </Button>
                        }>
                        <Menu.Item title="1" />
                    </Menu>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Button mode="text" color="#1A237E">
                        Pick a time
                                </Button>
                    <FeatherIcon name="chevron-right" size={12} stlye={{ margin: 5 }} />
                </View>



            </View>
        </View>
    )
}

const PickATime = props => {
    return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
                <Button mode="text" color="#2196F3">
                    4:00 PM
            </Button>

                <Button>
                    5:00 PM
            </Button>

                <Button mode="text" color="#2196F3">
                    4:00 PM
            </Button>

                <Button>
                    5:00 PM
            </Button>

                <Button mode="text" color="#2196F3">
                    4:00 PM
            </Button>

                <Button>
                    5:00 PM
            </Button>

                <Button mode="text" color="#2196F3">
                    4:00 PM
            </Button>

                <Button>
                    5:00 PM
            </Button>

                <Button mode="text" color="#2196F3">
                    4:00 PM
            </Button>

                <Button>
                    5:00 PM
            </Button>

                <Button mode="text" color="#2196F3">
                    4:00 PM
            </Button>

                <Button>
                    5:00 PM
            </Button>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Button mode="text" color="#1A237E">
                    Back
                                </Button>
                <Button mode="contained" color="#1A237E">
                    Request
                                </Button>
            </View>
        </View>
    )
}


export default class CreateSessionModal extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            userInvited: this.props.userInvited,
            sessionTitle: "",
            userDisplayName: "",
            sessionDescription: "",
            triggerStateChange: false,
            currIndex: 0,
            date: new Date(),
            dayMenuVisible: false
        }
    }

    componentDidMount() {
        this.setupUserInformation();
    }

    setupUserInformation = async () => {
        let displayName;
        await this.LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(this.state.userInvited, 'display_name').then(result => {
            displayName = result;
        });

        await this.setState({ userDisplayName: displayName });
    }

    _handleNewSessionRequest = () => {
        //Get date/time from state and parse separately
        let dateParam = this.state.date.toString();
        console.log(dateParam);
        let parsedDate = dateParam.split('T');
        date = parsedDate[0];
        time = parsedDate[1];

        this.LUPA_CONTROLLER_INSTANCE.createNewSession(this.LUPA_CONTROLLER_INSTANCE.getCurrentUser.uid, this.state.userInvited, time, date, {}, this.state.sessionTitle, this.state.sessionDescription);
    }

    render() {
        const { currIndex } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <SafeAreaView style={{ flex: 1, backgroundColor: '#1A237E', padding: 10, flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center' }}>
                        <Headline style={{ alignSelf: 'center', color: 'white', textAlign: 'center', }}>
                            You are about to request a session with:
                                </Headline>

                    <View>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                            <Surface style={{ width: 90, height: 90, elevation: 10, borderRadius: 80, margin: 10 }}>

                            </Surface>

                            <Icon name="compare-arrows" size={40} />

                            <Surface style={{ width: 90, height: 90, elevation: 10, borderRadius: 80, margin: 10, }}>
                                <Image source={{ uri: this.LUPA_CONTROLLER_INSTANCE.getCurrentUser().photoURL }} style={{ borderRadius: 80 }} />
                            </Surface>
                        </View>
                    </View>
                </SafeAreaView>
                    <ScrollView shouldRasterizeIOS={false} showsVerticalScrollIndicator={true} contentContainerStyle={{ flexGrow: 2, backgroundColor: "#FAFAFA", flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Headline style={{ padding: 5 }}>
                            Session Information
                            </Headline>

                            
                        <View style={{ flex: 1, justifyContent: 'space-evenly', flexDirection: 'column', padding: 5, margin: 5 }}>
                            <Title style={{alignSelf: 'center'}}>
                                Session name and description
                            </Title>
                            <TextInput mode="outlined" placeholder="Session Name" style={{ margin: 5 }} />
                            <TextInput mode="outlined" placeholder="Session Description" multiline={true} style={{ margin: 5, height: 80 }} />
                        </View>

                        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', margin: 5 }}>



                            {/* date selector */}
                            <View style={{flexDirection: 'column', justifyContent: 'space-evenly'}}>
                            <Title style={{alignSelf: 'center'}}>
                                    Pick a date
                                </Title>

                                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                <Menu
                                    anchor={
                                        <Button mode="contained" color="#1A237E">
                                            27
                </Button>
                                    }>
                                    <Menu.Item title="1" />
                                    <Menu.Item title="1" />
                                    <Menu.Item title="1" />
                                    <Menu.Item title="1" />
                                    <Menu.Item title="1" />
                                    <Menu.Item title="1" />
                                    <Divider />
                                    <Menu.Item title="Cancel" />
                                </Menu>

                                <Menu
                                    anchor={
                                        <Button mode="contained" color="#1A237E">
                                            January
                </Button>
                                    }>
                                    <Menu.Item title="1" />
                                </Menu>


                                <Menu
                                    anchor={
                                        <Button mode="contained" color="#1A237E">
                                            2020
                </Button>
                                    }>
                                    <Menu.Item title="1" />
                                </Menu>
                            </View>
                            </View>

                        </View>


                        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
                                <Title>
                                    Pick a time or multiple
                                </Title>
                                <Caption>
                                    Once you pick a date the users available times will appear here.
                                </Caption>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center', margin: 5 }}>
                                <Button mode="text" color="#1A237E">
                                    Back
                                </Button>
                                <Button mode="contained" color="#1A237E">
                                    Request
                                </Button>
                            </View>
                        </View>
                    </ScrollView>
                </View>
        );
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        display: "flex",
        backgroundColor: "#FAFAFA",
        margin: 0,
        padding: 15,
    },
    placeholderTextStyle: {
        color: "#E0E0E0",
        fontSize: 25
    },
    inputContainerStyle: {
        borderColor: "white",
        borderWidth: 0,
    },
    inputStyle: {
        fontSize: 17,
        fontWeight: "500",
    },
    containerStyle: {

    },
});
