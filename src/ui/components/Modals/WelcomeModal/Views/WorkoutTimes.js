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
    Surface,
    Button
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
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
                <Button mode="text" color="#E0E0E0">
                    Take me into the app
                </Button>

                <View style={styles.instructionalTextContainer}>
                    <Text style={styles.instructionalText}>
                    What times do you usually workout each day?
                    </Text>

                </View>
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
        alignItems: "center",
        justifyContent: "center",
    },
    instructionalText: {
        flexShrink: 1,
        fontSize: 20,
        fontWeight: "500"
    },
    userInput: {
        flex: 2,
        alignItems: "center",
    },
})