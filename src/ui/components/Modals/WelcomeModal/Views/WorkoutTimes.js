import React from 'react';

import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Picker,
    Dimensions
} from 'react-native';

import {
    TextInput,
    Switch,
    Chip,
    Surface
} from 'react-native-paper';

import {
    Input
} from 'react-native-elements';

import { Feather as Icon} from '@expo/vector-icons';
import TimeslotSelector from '../Components/TimeslotSelector';

const { width } = Dimensions.get('window');

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default class WorkoutTimes extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            timeslot: undefined
        }
    }


    render() {
        return (
            <View style={styles.root}>
                <View style={styles.instructionalTextContainer}>
                    <Text style={styles.instructionalText}>
                    What time slots do you usually workout each day?
                    </Text>

                </View>

                <View style={styles.userInput}>
                    <TimeslotSelector />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        padding: 20
    },
    menuSurface: {
        width: "100%",
        height: 350,
        elevation: 5,
        borderRadius: 15
    },
    instructionalTextContainer: {
        height: "30%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    instructionalText: {
        flexShrink: 1,
        fontSize: 20,
        fontWeight: "600"
    },
    userInput: {
        height: "20%",
        width: "100%",
        alignItems: "center",
    },
})