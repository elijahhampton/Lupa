import React, { useState } from 'react';

import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import {
    Avatar,
    Chip
} from 'react-native-paper';

const UserInformation = (props) => {
    return (
        <View style={styles.userInformationContainer}>
            <View style={styles.userInformationTop}>
                <Avatar.Text label="EH" size={80} style={{borderColor: "#2196F3", borderWidth: 5}} />

                <View style={{alignItems: "center"}}>
                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                        Elijah Hampton
                    </Text>
                    <Text style={{fontSize: 15, fontWeight: "600", color: "#BDBDBD"}}>
                        @ejh0017
                    </Text>
                    <Chip mode="flat"  style={{margin: 2, backgroundColor: "#2196F3", justifyContent: "center", alignItems: "center", height: 20, elevation: 3}}>
                        Lupa Trainer Tier 1
                    </Chip>
                </View>

                <View style={{width: "85%"}}>
                    <Text style={{}}>
                        Hello everyone my name is Jamal Hampton.  I am into Yoga, Sprinting, High intensity workouts, and much more.  I'm very active on Lupa so if you're interested in a session
                        click that button and lets go!
                    </Text>
                </View>
            </View>
            <View style={styles.userInformationBottom}>
                <View style={{flex: 2, flexDirection: "column"}}>
                    <View>
                                            <Text>
                        Sessions Completed
                    </Text>
                    <Text>
                        Chicago
                    </Text>
                    <Text>
                        United States
                    </Text>
                    </View>
                </View>

                <View style={{flex: 1}}>

                </View>
            </View>
        </View>
    )
}

const UserExperience = (props) => {
    return (
        <View style={styles.userExperienceContainer}>
            <Text>
                User Experience
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    userInformationContainer: {
        flex: 1,
        display: "flex",
    },
    userExperienceContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    userInformationTop: {
        flex: 2,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-evenly"
    },
    userInformationBottom: {
        flex: 1,
        backgroundColor: "green",
        flexDirection: "row",
    }
})

export {
    UserInformation,
    UserExperience
}
