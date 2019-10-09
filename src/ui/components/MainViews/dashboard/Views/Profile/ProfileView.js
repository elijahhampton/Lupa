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
    Button as NativeButton
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
    Avatar
} from 'react-native-paper';

import LupaAppBar from '../../../../AppBar/LupaAppBar';

import HeaderImage from '../../../../../images/background-one.jpg'
import CertificationImage from '../../../../../images/certification.png'

const profileViewHeight = "40%";


function getHeaderImageContainerStyle(status) {

};

export default class ProfileView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            shouldScroll: true,
        }
    }

    _isScrollEnabled = (yPosition) => {

    }

    _shouldShowEditButton = () => {
        return true;
    }

    _requestTrainerSession = () => {
        alert('Requesting Session')
    }

    render() {
        return (
            <View style={styles.root}>
                <LupaAppBar title="Profile" />

                <ScrollView scrollEnabled={this.state.shouldScroll}>

                    <View style={styles.userInfoContainer}>
                    <Surface style={styles.userInfo}>

<Surface style={styles.photoView}>
    <View style={{borderTopLeftRadius: 40, borderTopRightRadius: 40, width: "100%", height: 100}}>
    <Image source={HeaderImage} style={{ width: "100%", height: 100, borderRadius: 40,}} resizeMode="cover" />
    </View>
</Surface>

<View style={styles.userInfoMainContent}>
    <View style={{flexDirection: "column", justifyContent: "space-around", alignItems: "center"}}>
    <Text style={[{fontWeight: "bold", fontSize: 18}]}>
        Elijah Hampton
    </Text>
    <Text style={[{fontWeight: "bold", fontSize: 12}]}>
        TRAINERIAM23
    </Text>
    </View>
    <Text style={[{fontWeight: "200", fontSize: 12, color: "#8E8E8E"}, styles.addMargin]}>
        Trainer | Troy, Alabama
    </Text>
    <Button mode="contained" style={{padding: 10},styles.addMargin} color="#637DFF" onPress={this._requestTrainerSession}>
        <Text style={{color: "white"}}>
        Request Session
        </Text>
    </Button>

    <View style={styles.certificationsView}>
        <Surface style={{backgroundColor: "black", width: 45, height: 45, borderRadius: 40, justifyContent: "center", alignItems: "center", elevation: 12}}>
            <Image source={CertificationImage} style={{ width: 45, height: 45}}/>
        </Surface>
    </View>
</View>

<Divider />

<View style={styles.description}>
    <Text>
        Whats up everyone my name is Mark Cobbins.  I am a trinaer outside of New York City a 
        trinaer outside of New York City and I mainly train football players for sport and speed.
    </Text>
    <Button mode="text">
        More
    </Button> 
</View>
</Surface>
                    </View>

                

                <View style={styles.fitnessProfileContainer}>
                <Text style={{fontSize: 15, fontWeight: "600", margin: 2}}>
                    Fitness Profile
                </Text>

                <Surface style={styles.fitnessProfile}>
                    <View>
                        <Text style={styles.fitnessProfileHeader}>
                            General Information
                        </Text>
                        <NativeButton style={{fontSize: 12,}} title="Update your fitness profile to display information." />
                    </View>

                    <Divider />

                    <View>
                        <Text style={styles.fitnessProfileHeader}>
                            Recommended Workouts
                        </Text>
                        <NativeButton title="Update your fitness profile to display information." />
                    </View>

                    <Divider />

                    <View>
                        <Text style={styles.fitnessProfileHeader}>
                            Achievemnets
                        </Text>
                        <NativeButton title="Update your fitness profile to display information." />
                    </View>

                    <Divider />

                    <View>
                        <Text style={styles.fitnessProfileHeader}>
                            Goals
                        </Text>
                        <NativeButton title="Update your fitness profile to display information." />
                    </View>

                </Surface>
                </View>

                <View style={styles.packsAndOffersContainer}>
                    <Text style={{fontSize: 15, fontWeight: "600", margin: 5}}>
                        Packs and Offers
                    </Text>

                    <ScrollView horizontal contentContainerStyle={{padding: 10,}}>
                        <TouchableOpacity>
                        <Surface style={{width: 80, height: 80, elevation: 5, borderRadius: 15,}}>

                        </Surface>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </ScrollView>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        padding: 10,
        backgroundColor: "#FAFAFA"
        
    },
    appbar: {
        backgroundColor: "transparent",
        elevation: 0,
    },
    userInfo: {
        width: "100%",
        height: "auto",
        elevation: 2,
        borderRadius: 40,
        alignSelf: "center",
    },
    fitnessProfile: {
        width: "100%",
        height: "auto",
        elevation: 2,
        borderRadius: 40,
        padding: 15,
        margin: 10,
        alignSelf: "center",
    },
    fitnessProfileHeader: {
        fontSize: 18,
        color: "#8E8E8E",
    },
    fitnessProfileContainer: {
        margin: 3,
    },
    userInfoContainer: {
        margin: 3
    },
    packsAndOffersContainer: {
        margin: 3,
        marginBottom: 70,
    },
    photoView: {
        width: "100%",
        height: 100,
        backgroundColor: "black",
        elevation: 4,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
    },
    userInfoMainContent: {
        padding: 40,
        flexDirection: "column",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    addMargin: {
        margin: 8,
    },
    certificationsView: {
        alignSelf: "center",
        top: 15,
        borderRadius: 40,
    },
    description: {
        padding: 10,
        alignSelf: "center",
    },
    userAvatar: {
        position: "absolute"
    }
});