/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  20, 2019
 * 
 * Profile View
 */

import React from 'react';

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    Button as NativeButton,
    Platform,
    Constants
} from "react-native";

import {
    Left,
    Right,
    Body,
    Tabs,
    Tab
} from 'native-base';

import {
    IconButton,
    Title,
    Surface,
    Appbar,
    Button,
    Divider,
    Caption,
    FAB,
    Chip
} from 'react-native-paper';

import Timecards from './components/Timecards';

import * as Permissions from 'expo-permissions';

import { ImagePicker } from 'expo-image-picker';

import { Avatar } from 'react-native-elements';

import SafeAreaView from 'react-native-safe-area-view';

import { withNavigation } from 'react-navigation';

function getHeaderImageContainerStyle(status) {

};

let chosenHeaderImage;
let chosenProfileImage;

let ProfileImage = require('../../../images/background-one.jpg');

class ProfileView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            headerImage: '',
            profileImage: '',
            userInterest: [],
            userExperience: [],
        }
    }

    componentWillMount = async () => {

    }

    _chooseHeaderFromCameraRoll = async () => {
        chosenHeaderImage = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
        });

        if (!chosenImage.cancelled) {
            this.setState({ profileImage: chosenHeaderImage.uri });
        }
    }

    _chooseProfilePictureFromCameraRoll = async () => {
        chosenProfileImage = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
        });

        if (!chosenImage.cancelled) {
            this.setState({ profileImage: chosenProfileImage.uri });
        }
    }

    mapInterest = () => {
            this.state.userInterest.map(interest => {
                return (
                <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>
                    {interest}
                </Chip>
                );
            })
    }

    mapExperience = () => {
        this.state.userExperience.map(experience => {
            return (
                <>
                </>
            );
        })
    }

    render() {
        return (
            <SafeAreaView forceInset={{top: 'never'}} style={styles.container}>
                <Surface style={{height: "13%", width: "100%", elevation: 3}}>
                    <Image style={{width: "100%", height: "100%"}} source={ProfileImage} resizeMode="cover" resizeMethod="resize" />
                </Surface>
                <IconButton style={{margin: 0, padding: 0}} icon="menu" size={20} onPress={() => this.props.navigation.openDrawer()}/>
                <View style={styles.user}>
                    <View style={styles.userInfo}>
                    <Text>
                            Elijah Hampton
                            </Text>
                        <Text style={{ fontWeight: "400", color: "#9E9E9E" }}>
                            Chicago, United States
                            </Text>
                        <Text style={{ fontSize: 12 }}>
                            Certified Lupa Trainer
                            </Text>
                    </View>
                    <Avatar title="EH" size={40} rounded showEditButton={true} containerStyle={{ margin: 15 }} />
                </View>

                <ScrollView>
                    <Timecards />

                    <View style={styles.interest}>
                        <Text style={{ fontWeight: "600", fontSize: 15 }}>
                            My Statistics
                        </Text>
                        <Surface style={{ margin: 5, elevation: 1, padding: 15, borderRadius: 20 }}>
                            {
                                this.state.userInterest.length == 0 ?
                                <Caption>
                                        My Statistics
                                </Caption> : this.mapInterest
                            }
                        </Surface>
                    </View>

                    <View style={styles.interest}>
                        <Text style={{ fontWeight: "600", fontSize: 15 }}>
                            Specializations and Strengths
                        </Text>
                        <Surface style={{ margin: 5, elevation: 1, padding: 15, borderRadius: 20 }}>
                            {
                                this.state.userInterest.length == 0 ?
                                <Caption>
                                        Specializations and strengths that you add to your fitness profile will appear here.
                                </Caption> : this.mapInterest
                            }
                        </Surface>
                    </View>

                    <View style={styles.experience}>
                        <Text style={{ fontWeight: "600", fontSize: 15 }}>
                            Experience
                        </Text>
                        <Surface style={{ margin: 5, elevation: 1, padding: 15, borderRadius: 20, flexDirection: "column"}}>
                            {
                                this.state.userInterest.length == 0 ?
                                <Caption>
                                    Experience that you add to your fitness profile will appear here.
                                </Caption> : this.mapExperience
                            }
                        </Surface>
                    </View>

                    <View style={styles.myPacks}>
                        <Text style={{ fontWeight: "600", fontSize: 15 }}>
                            My Packs
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <Surface style={{margin: 10, width: 100, height: 100, borderRadius: 20, elevation: 3}}>

                            </Surface>
                            <Surface style={{margin: 10, width: 100, height: 100, borderRadius: 20, elevation: 3}}>

                            </Surface>
                            <Surface style={{margin: 10, width: 100, height: 100, borderRadius: 20, elevation: 3}}>

                            </Surface>
                            <Surface style={{margin: 10, width: 100, height: 100, borderRadius: 20, elevation: 3}}>

                            </Surface>
                        </ScrollView>
                    </View>

                    <View style={styles.recommendedWorkouts}>
                        <Text style={{ fontWeight: "600", fontSize: 15 }}>
                            Recommended Workouts
                        </Text>
                        {/*
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <Surface style={{margin: 10, width: 100, height: 100, borderRadius: 20, elevation: 3}}>

                            </Surface>
                            <Surface style={{margin: 10, width: 100, height: 100, borderRadius: 20, elevation: 3}}>

                            </Surface>
                            <Surface style={{margin: 10, width: 100, height: 100, borderRadius: 20, elevation: 3}}>

                            </Surface>
                            <Surface style={{margin: 10, width: 100, height: 100, borderRadius: 20, elevation: 3}}>

                            </Surface>
                        </ScrollView>
                        */}
                       <Caption>
                            Visit the Workout Library to recommend workouts that you enjoy.
                       </Caption>
                    </View>

                </ScrollView>

                <FAB
                    style={styles.fab}
                    extended
                    label="Request Trainer"
                    loading={true}
                    icon="add"
                    onPress={() => console.log('Pressed')}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    chipStyle: {
        elevation: 3,
        display: "flex",
        width: 90,
        backgroundColor: "#637DFF",
    },
    chipTextStyle: {
        color: "white",
    },
    interest: {
        backgroundColor: "transparent",
        justifyContent: "space-between",
        margin: 10,
    },
    experience: {
        backgroundColor: "transparent",
        margin: 10,
    },
    myPacks: {
        backgroundColor: "transparent",
        margin: 10,
    },
    recommendedWorkouts: {
        backgroundColor: "transparent",
        margin: 10,
    },
    bulletRow: {
        flexDirection: "row",
    },
    boldText: {
        fontWeight: "bold",
    },
    normalText: {

    },
    userInfo: {
        flexDirection: "column",
    },
    user: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 5,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 5,
        color: "#637DFF",
        backgroundColor: "#2196F3"
    },

});

export default withNavigation(ProfileView);