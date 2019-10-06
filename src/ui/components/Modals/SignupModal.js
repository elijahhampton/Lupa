import React from 'react';

import {
    View,
    StyleSheet,
    ImageBackground,
    Modal,
    Text
} from 'react-native';

import {
    TextInput, 
    Button 
} from 'react-native-paper';

import LupaController from '../../../api/controller/LupaController';

class SignupModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            firstName: "Elijah",
            lastName: "Hampton",
            username: "ejh0017",
            password: "Hampton",
            email: "ejh0017@gmail.com",
            isRegistered: false,
        }
    }

    _registerUser = () => {
        LupaController.registerUser(this.state.username, this.state.password, this.state.firstName, this.state.lastName, this.state.email);
    }

    render() {
        return (
        <View>
            <Modal presentationStyle="fullScreen" visible={false} style={styles.modalContainer}>
                    <View style={styles.container}>

                    <View>
                        <Text style={{color: "white", fontSize: 20, fontWeight: "500"}}>
                            Let's get started by registering your account in the Lupa Database.
                        </Text>
                    </View>

                    <View style={styles.textInputContainer}>
                    <TextInput 
                        mode="flat"
                        label="First Name"
                        placeholder="First Name"
                        selectionColor="rgba(33, 31, 35, 0.8)"
                        underlineColor="transparent"
                        style={styles.textInput}
                        value={this.state.firstName}
                        onChangeText={text => this.setState({ firstName: text })}
                    />

                    <TextInput 
                        mode="flat"
                        label="Last Name"
                        placeholder="Last Name"
                        selectionColor="rgba(33, 31, 35, 0.8)"
                        underlineColor="transparent"
                        style={styles.textInput}
                        value={this.state.lastName}
                        onChangeText={text => this.setState({ lastName: text })}
                    />

                    <TextInput 
                        mode="flat"
                        label="Username"
                        placeholder="Choose a username"
                        selectionColor="rgba(33, 31, 35, 0.8)"
                        underlineColor="transparent"
                        style={styles.textInput}
                        value={this.state.username}
                        onChangeText={text => this.setState({ username: text })}
                    />

                    <TextInput 
                        mode="flat"
                        label="Password"
                        placeholder="Confirm password"
                        selectionColor="rgba(33, 31, 35, 0.8)"
                        underlineColor="transparent"
                        style={styles.textInput}
                        value={this.state.password}
                        onChangeText={text => this.setState({ password: text })}
                    />

                    <TextInput 
                        mode="flat"
                        label="Email"
                        placeholder="Enter your email"
                        selectionColor="rgba(33, 31, 35, 0.8)"
                        underlineColor="transparent"
                        style={styles.textInput}
                        value={this.state.email}
                        onChangeText={text => this.setState({ email: text })}
                    />

                    </View>


                    <View style={styles.registerButtons}>
                    <Button 
                    mode="text" 
                    color="white" 
                    style={{alignSelf: "center"}}
                    >
                            Already have an account? Login
                        </Button>
                        <Button 
                        mode="contained" 
                        style={{width: "40%", alignSelf: "center"}} 
                        onPress={this._registerUser}
                        >
                            Sign up
                        </Button>
                    </View>


                    </View>
            </Modal>
        </View>
        );
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        display: "flex",
        backgroundColor: "#1a1a1a",
        margin: 0,
    },
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(33, 31, 35, 0.8)",
        padding: 20,
        paddingTop: 40,
        paddingBottom: 40,
    },
    textInputContainer: {
        margin: 20,
        flexDirection: "column",
        justifyContent: "space-around",
        height: "80%"
    },
    textInput: {
        
    }

});

export default SignupModal;