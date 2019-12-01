/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  16, 2019
 * 
 * Workout View
 */

import React from 'react';

import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ViewPagerAndroid,
    Dimensions,
    Image,
    ImageBackground,
    StatusBar
} from "react-native";

import {
    Header,
    Body,
    Left,
    Right,
    Item,
    Icon,
} from 'native-base';

import {
    FAB,
    Headline,
    Card,
    Subheading,
    Title,
    Caption,
    IconButton,
    Surface,
    Avatar,
    Button,
    Searchbar
} from 'react-native-paper';

import BackgroundImageOne from '../../images/background-one.jpg';
import BackgroundImageTwo from '../../images/background-two.jpg';


import LupaController from '../../../controller/lupa/LupaController';
const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

class WorkoutView extends React.Component {
    constructor(props) {
        super(props);

        this.currUser = LUPA_CONTROLLER_INSTANCE.getCurrUser();

        this.state = {
            currUser: this.currUser
        }


    }


    render() {
        let firstName = this.state.currUser.personalInformation.firstName;
        let lastName = this.state.currUser.personalInformation.lastName;
        return (
            <View style={styles.root}>
                <View style={styles.imageView}>
                    <ImageBackground source={BackgroundImageTwo} style={styles.image} resizeMode='cover'>
                        <View style={styles.overlay}>
                            <View style={{ display: "flex" }}>
                                <Text style={{ color: "white", fontSize: 50, fontWeight: "200" }}>
                                    Welcome,
                                </Text>
                                <Text style={{ color: "white", fontSize: 50, fontWeight: "700" }}>
                                    { firstName }
                                    { " " }
                                    { lastName }
                                </Text>
                            </View>

                            <View style={{ display: "flex" }}>
                                <Text style={{ color: "white", fontSize: 20, fontWeight: "200" }}>
                                    Enjoy our catalog of workouts curated by Lupa and Lupa trainers
                                </Text>
                            </View>

                            <View style={{ alignSelf: "center", width: "100%" }}>
                                <Searchbar placeholder="Search workouts"
                                onChangeText={() => alert('Searching...')} />
                            </View>

                            <View style={styles.buttonScroll}>
                                <ScrollView horizontal={true}>
                                    <Button mode="text" color="white" compact>
                                        All Workouts
                                    </Button>
                                    <Button mode="text" color="white" compact>
                                        Routines
                                    </Button>
                                    <Button mode="text" color="white" compact>
                                        Body Part
                                    </Button>
                                    <Button mode="text" color="white" compact>
                                        Trainer Recommendations
                                    </Button>
                                    <Button mode="text" color="white" compact>
                                        Goal Based
                                    </Button>
                                    <Button mode="text" color="white" compact>
                                        Suggestions
                                    </Button>
                                    <Button mode="text" color="white" compact>
                                        Curated by Lupa
                                    </Button>
                                </ScrollView>
                            </View>

                        </View>
                    </ImageBackground>
                </View>

                <Surface style={styles.workoutSurface}>
                    <ScrollView>

                    </ScrollView>
                </Surface>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        display: "flex",
        backgroundColor: "rgba(0,111,230,0.2)",
    },
    buttonScroll: {
        display: "flex",
        bottom: 20
    },
    contentView: {
        display: "flex",
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    workoutSurface: {
        position: "absolute",
        bottom: 0,
        height: "45%",
        width: "100%",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: "#FAFAFA",
        alignItems: "center",
        flexDirection: "column",
        elevation: 12,
    },
    image: {
        ...StyleSheet.absoluteFillObject,
    },
    imageView: {
        width: "100%",
        height: "65%",
    },
    overlay: {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: "rgba(0,111,230,0.2)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        padding: 10
    }
});

export default WorkoutView;