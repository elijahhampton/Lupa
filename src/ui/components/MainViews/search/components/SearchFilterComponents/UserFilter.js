import React from 'react';

import {
    Text,
    View,
    StyleSheet,
    ScrollView
} from 'react-native';

import {
    Slider
} from 'react-native-elements';

import BottomSheet from 'reanimated-bottom-sheet';
import { Button, IconButton, Divider, RadioButton, Caption, Switch } from 'react-native-paper';

const days = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']

export default class UserFilters extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isGenderMaleSwitchOn: false,
            isGenderFemaleSwitchOn: false,
        }
    }

    render() {
        return (
            <View>
             <Text style={styles.title}>
                    Users and Trainers
                </Text>
                <View>
                    <Text style={styles.mainHeader}>
                        Personal
                    </Text>
                    <View style={styles.filter}>
                        <Text style={styles.filterHeader}>
                            Age
                        </Text>
                        <Slider
                            value={0}
                            onValueChange={() => console.log('Changing')}
                            minimumValue={0}
                            maximumValue={50}
                            orientation="horizontal"
                            thumbTintColor="#2196F3"
                        />

                        <Caption>
                            The age range is currently set at 0 to 0.
  </Caption>
                    </View>

                    <View style={styles.filter}>
                        <Text style={styles.filterHeader}>
                            Gender
                        </Text>
                        <View style={[styles.alignRow, { justifyContent: "space-between" }]}>
                            <Text>
                                Male
                            </Text>
                            <Switch
                                value={this.state.isGenderMaleSwitchOn}
                                onValueChange={() => { this.setState({ isGenderMaleSwitchOn: !isGenderMaleSwitchOn }); }
                                }
                                color="#2196F3"
                            />
                        </View>
                        <View style={[styles.alignRow, { justifyContent: "space-between" }]}>
                            <Text>
                                Female
                            </Text>
                            <Switch
                                value={this.state.isGenderFemaleSwitchOn}
                                onValueChange={() => { this.setState({ isGenderFemaleSwitchOn: !isGenderFemaleSwitchOn }); }
                                }
                                color="#2196F3"
                            />
                        </View>
                    </View>
                </View>

                <Divider style={styles.divider} />

                <View>
                    <Text style={styles.mainHeader}>
                        Fitness
                    </Text>

                    <View style={styles.filter}>
                        <Text style={styles.filterHeader}>
                            Average Days in Gym
                        </Text>

                        <Slider
                            value={0}
                            onValueChange={() => console.log('Changing')}
                            minimumValue={0}
                            maximumValue={50}
                            orientation="horizontal"
                            thumbTintColor="#2196F3"
                        />

                        <Caption>
                            Average days in gym range is currently set at 0 to 0.
  </Caption>
                    </View>

                    <View style={styles.filter}>
                        <View style={styles.alignRow, { alignItems: "center", flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                            <Text style={styles.filterHeader}>
                                Trainer
                        </Text>

                            <Switch color="#2196F3" value={true} />

                        </View>

                        <Caption>
                            You have chosen to search for trainers only.
                        </Caption>
                    </View>
                </View>

                <Divider style={styles.divider} />

                <View>
                    <Text style={styles.mainHeader}>
                        Availability
                    </Text>

                    <View style={styles.filter}>
                        <Text style={styles.filterHeader}>
                            Days Available
                        </Text>

                        <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", padding: 3 }}>
                            {
                                days.map(day => {
                                    return (
                                        <Text style={{ color: "#2196F3", fontSize: 15, fontWeight: "600" }}>
                                            {day}
                                        </Text>
                                    )
                                })
                            }
                        </View>

                        <Caption>
                            You have not chosen any days.
                        </Caption>
                    </View>

                    <View style={styles.filter}>
                        <Text style={styles.filterHeader}>
                            Times Available
                        </Text>

                        <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", padding: 3 }}>
                            {
                                days.map(day => {
                                    return (
                                        <Text style={{ color: "#2196F3", fontSize: 15, fontWeight: "600" }}>
                                            {day}
                                        </Text>
                                    )
                                })
                            }
                        </View>

                        <Caption>
                            You have not chosen any times.
                        </Caption>
                    </View>
                </View>
        </View>
        )
    }
}

const styles = StyleSheet.create({
    divider: {
        margin: 8
    },
    alignRow: {
        flexDirection: "row",
        alignItems: "center"
    },
    mainHeader: {
        fontSize: 20,
        fontWeight: '700',
    },
    title: {
        fontSize: 30,
        fontWeight: '700',
    },
    filterHeader: {
        fontSize: 15,
        fontWeight: "300",
        color: "#8E8E93"
    },
    filter: {
        padding: 5,
    }
})