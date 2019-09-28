/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  23, 2019
 * 
 *  UserDashboardView
 */

import React from 'react';

import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import {
    Appbar,
    IconButton,
    Title,
    Surface,
    Caption
} from 'react-native-paper';

import {
    Left,
    Right,
    Body,
} from 'native-base';

import { Feather as Icon } from '@expo/vector-icons';

import ProfilePicture from "../../../images/temp-profile.jpg";
import LupaCalendar from '../../Calendar/LupaCalendar'
import { ScrollView } from 'react-native-gesture-handler';

class TrainerDashboardView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showDrawer: false,
        }

    }

    _handleAvatarOnPress = () => {
        console.log("Clicked")
        this.setState({ showDrawer: true });
    }

    render() {
        return (
            <View style={styles.root}>
                <Appbar style={styles.appbar}>
                    <Left>
                        <IconButton icon="menu" size={20} />
                    </Left>
                    <Body>
                    <Title>
                        Dashboard
                    </Title>
                    </Body>
                    <Right>
                        <IconButton icon="inbox" size={20} />
                    </Right>
                </Appbar>

                <ScrollView contentContainerStyle={styles.dashboardContent}>

                    <LupaCalendar />

                    <View style={styles.calendarButtons}>
                        <View style={styles.calendarButtonsContainer}>
                            <TouchableOpacity>
                                <Surface style={styles.buttonSurface}>
                                    <Icon name="zap" size={15} />
                                </Surface>
                            </TouchableOpacity>

                            <Text style={styles.calendarButtonText}>
                                Start Session
                            </Text>
                        </View>

                        <View style={styles.calendarButtonsContainer}>
                            <TouchableOpacity>
                                <Surface style={styles.buttonSurface}>
                                    <Icon name="edit-2" size={15} />
                                </Surface>
                            </TouchableOpacity>

                            <Text style={styles.calendarButtonText}>
                                Modify Session
                            </Text>
                        </View>

                        <View style={styles.calendarButtonsContainer}>
                            <TouchableOpacity>
                                <Surface style={styles.buttonSurface}>
                                    <Icon name="x" size={15} />
                                </Surface>
                            </TouchableOpacity>

                            <Text style={styles.calendarButtonText}>
                                Cancel Session
                            </Text>
                        </View>

                        <View style={styles.calendarButtonsContainer}>
                            <TouchableOpacity>
                                <Surface style={styles.buttonSurface}>
                                    <Icon name="globe" size={15} />
                                </Surface>
                            </TouchableOpacity>

                            <Text style={styles.calendarButtonText}>
                                Invite Friends
                            </Text>
                        </View>
                    </View>

                    <View>
                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%",}}>
                        <Text style={{fontSize: 20, fontWeight: "700"}}>
                            Pack Offers
                        </Text>
                        <Icon name="plus" size={15} />
                        </View>

                        <View>
                            <Caption>
                                You are currently not offering any pack offers.
                            </Caption>
                        </View>

                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    appbar: {
        backgroundColor: "transparent",
        elevation: 0,
    },
    calendarButtons: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        alignSelf: "center",
        width: "100%",
        height: "auto",
        margin: 20,
    },
    calendarButtonsContainer: {
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: 'center',
    },
    calendarButtonText: {
        padding: 10,
        fontSize: 10,
    },
    dashboardContent: {
        padding: 10,
    },
    buttonSurface: {
        borderRadius: 40,
        width: 50,
        height: 50,
        elevation: 10,
        alignItems: "center",
        justifyContent: "center",
    }
})

export default TrainerDashboardView;