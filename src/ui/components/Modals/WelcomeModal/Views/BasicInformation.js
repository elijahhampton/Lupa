import React from 'react';

import {
    View,
    StyleSheet,
    Text,
    Picker,
    Dimensions
} from 'react-native';

import {
    TextInput,
    Switch
} from 'react-native-paper';

import { Input } from 'react-native-elements';

import { DatePicker } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';

export default class BasicInformation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            gender: undefined
        }
    }

    render() {
        return (
            <View style={styles.root}>
                <View style={styles.instructionalTextContainer}>
                    <Text style={styles.instructionalText}>
                        Welcome to Lupa.  Before we take you into the app we need a little information.  Don't worry you can save most of it for later.
                    </Text>
                </View>

                <View style={styles.userInput}>
                    <Input
                        placeholder="Enter your first name"
                        label="First Name"
                        inputStyle={{ fontSize: 20, fontWeight: "600", color: "black" }}
                        inputContainerStyle={styles.inputContainerStyle} />

                    <Input
                        placeholder="Enter your last name"
                        label="Last Name"
                        inputStyle={{ fontSize: 20, fontWeight: "600", color: "black" }}
                        inputContainerStyle={styles.inputContainerStyle} />
                </View>

                <View>
                    <TouchableOpacity style={{flexDirection: "row", alignItems: "center"}}>
                    <Icon name="map-pin" size={15} style={{padding: 2}} />
                    <Text style={[styles.generalText, { color: '#2196F3'}]}>
                        Where are you located?
                    </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.pickerContainer}>
                    <Text style={styles.generalText}>
                        Gender
                    </Text>
                    <Picker
                        mode="dropdown"
                        placeholder="Select One"
                        placeholderStyle={{ color: "#2874F0" }}
                        note={false}
                        selectedValue={this.state.gender}
                        onValueChange={value => this.setState({ gender: value })}
                        style={{ width: Dimensions.get('screen').width, height: 10 }}
                    >
                        <Picker.Item label="Male" value="male" />
                        <Picker.Item label="Female" value="female" />
                    </Picker>
                </View>

            </View>

        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-evenly",
        padding: 10,
    },
    generalText: {
        fontSize: 20,
        fontWeight: "400",
        color: "#9E9E9E"
    },
    instructionalTextContainer: {
        height: "20%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    instructionalText: {
        flexShrink: 1,
        fontSize: 20,
        fontWeight: "600"
    },
    userInput: {
        height: "20%",
        width: "100%",

    },
    pickerContainer: {
        height: "30%",
        width: "100%",
    },
    inputContainerStyle: {
        margin: 5,
    }
})