import React from 'react';

import {
    View,
    StyleSheet,
    Text,
} from 'react-native';

import {
    TextInput, Caption, Switch
} from 'react-native-paper';

import { Input } from 'react-native-elements';
import SafeAreaView from 'react-native-safe-area-view';

import LupaController from '../../../../../controller/lupa/LupaController';

export default class ChooseUsername extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            chosenUsername: "",
            displayName: "",
            maketrainerAccount: false,
            isForwardPageChange: this.props.isForwardPageChange
        }
    }

    _handleTrainerAccountUpdate = () => {
        console.log('here')
        this.setState({ makeTrainerAccount: !this.state.makeTrainerAccount });
        this.LUPA_CONTROLLER_INSTANCE.updateUser('isTrainer', this.state.maketrainerAccount);
    }

    _handleDisplayNameOnChangeText = text => {
        this.setState({ displayName: text })
    }

    _handleUsernameOnChangeText = text => {
        this.setState({ chosenUsername: text })
    }

    _handleDisplayNameEndEditing = () => {
        this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('display_name', this.state.displayName);
    }

    _handleUsernameEndEditing = () => {
        this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('username', this.state.chosenUsername);
    }

    render() {
        return (
            <View style={styles.root}>
                <SafeAreaView style={{flex: 1, padding: 10}}>
                <View style={{flex: 2, justifyContent: "center"}}>

                <View style={styles.instructionalTextContainer}>
                    <Text style={styles.instructionalText}>
                        Welcome to Lupa.  The fitness app for preventative health care.
                    </Text>
                </View>

                <View style={{flexDirection: "column", alignItems: "center", justifyContent: 'space-around'}}>
                    <TextInput 
                        style={styles.textInput} 
                        mode="outlined" 
                        label="Choose a username" 
                        theme={{colors: {primary: '#1976D2'}}} 
                        onChangeText={text => this._handleUsernameOnChangeText(text)}
                        onBlur={this._handleUsernameEndEditing}
                        value={this.state.chosenUsername}
                        />

                    <TextInput 
                        style={styles.textInput} 
                        mode="outlined" 
                        label="Enter a display name" 
                        theme={{colors: {primary: '#1976D2', backdrop: "red", accent: "red", surface: "red"}}} 
                        onChangeText={text => this._handleDisplayNameOnChangeText(text)}
                        onBlur={this._handleDisplayNameEndEditing}
                        value={this.state.displayName}
                        />
                </View>
                </View>

                <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                    <Text style={{fontWeight: "600", color: "#BDBDBD"}}>
                        On Lupa you can find certified trainers all over the world for private or sessions, and/or general fitness needs.  Would you like to sign up to become a Lupa Trainer?
                    </Text>
                    <View style={{padding: 10, flexDirection: "row", alignItems: "center"}}>
                    <Text style={{fontWeight: "600", color: "black"}}>
                        I am a certified trainer and I would like to make my account a trainer acccount.
                    </Text>
                    <Switch
        value={this.state.makeTrainerAccount}
        onValueChange={() => this._handleTrainerAccountUpdate}
        color="#1976D2"
        style={{margin: 3}}
      />
                    </View>
                </View>


                </SafeAreaView>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    textInput: {
        width: "95%",
        margin: 5,
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
        width: "75%",
    }
})