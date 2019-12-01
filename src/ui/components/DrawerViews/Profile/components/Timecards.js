import React from 'react';

import {
    StyleSheet,
    Text,
    View,
    ScrollView
} from 'react-native';

import {
    Surface,
    Caption
} from 'react-native-paper';

const timecards = (props) => {
    return (
        <View style={{ width: "100%", }}>
            <ScrollView contentContainerStyle={styles.container} 
                horizontal={true} 
                showsHorizontalScrollIndicator={false}>
                <Surface style={styles.timecard}>
                    <View style={styles.timecardContent}>
                    <Text style={styles.timecardHeaderText}>
                        Monday
                    </Text>
                    <View style={styles.timeslots}>
                    <Caption style={styles.caption}>
                        You have not added any time slots for availability in your fitness profile.
                    </Caption>
                    </View>
                    </View>
                </Surface>

                <Surface style={styles.timecard}>
                <View style={styles.timecardContent}>
                    <Text style={styles.timecardHeaderText}>
                        Tuesday
                    </Text>
                    <View style={styles.timeslots}>
                    <Caption style={styles.caption}>
                        You have not added any time slots for availability in your fitness profile.
                    </Caption>
                    </View>
                    </View>
                </Surface>

                <Surface style={styles.timecard}>
                <View style={styles.timecardContent}>
                    <Text style={styles.timecardHeaderText}>
                        Wednesday
                    </Text>
                    <View style={styles.timeslots}>
                    <Caption style={styles.caption}>
                        You have not added any time slots for availability in your fitness profile.
                    </Caption>
                    </View>
                    </View>
                </Surface>

                <Surface style={styles.timecard}>
                <View style={styles.timecardContent}>
                    <Text style={styles.timecardHeaderText}>
                        Thursday
                    </Text>
                    <View style={styles.timeslots}>
                    <Caption style={styles.caption}>
                        You have not added any time slots for availability in your fitness profile.
                    </Caption>
                    </View>
                    </View>
                </Surface>

                <Surface style={styles.timecard}>
                <View style={styles.timecardContent}>
                    <Text style={styles.timecardHeaderText}>
                        Friday
                    </Text>
                    <View style={styles.timeslots}>
                    <Caption style={styles.caption}>
                        You have not added any time slots for availability in your fitness profile.
                    </Caption>
                    </View>
                    </View>
                </Surface>

                <Surface style={styles.timecard}>
                <View style={styles.timecardContent}>
                    <Text style={styles.timecardHeaderText}>
                        Saturday
                    </Text>
                    <View style={styles.timeslots}>
                    <Caption style={styles.caption}>
                        You have not added any time slots for availability in your fitness profile.
                    </Caption>
                    </View>
                    </View>
                </Surface>

                <Surface style={styles.timecard}>
                <View style={styles.timecardContent}>
                    <Text style={styles.timecardHeaderText}>
                        Sunday
                    </Text>
                    <View style={styles.timeslots}>
                    <Caption style={styles.caption}>
                        You have not added any time slots for availability in your fitness profile.
                    </Caption>
                    </View>
                    </View>
                </Surface>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
        margin: 5,
    },
    caption: {
        color: 'white',
    },
    timecard: {
        width: 120,
        height: 180,
        borderRadius: 10,
        elevation: 3,
        margin: 10,
        backgroundColor: "#2196F3",
        padding: 10,
        alignItems: "center",
        justifyContent: "space-between",
    },
    timecardHeaderText: {
        fontSize: 20,
        fontWeight: "500",
        alignSelf: "center",
        color: "white",
        alignSelf: "flex-start",
    },
    timeslots: {
        alignSelf: "center",
        justifyContent: "center",
    },
    timecardContent: {
        flexDirection: "column",
        alignSelf: "center",
    }

})

export default timecards;