import React from 'react';

import {
    View,
    StyleSheet,
    ImageBackground,
    Modal,
    Text,
    TouchableWithoutFeedback
} from 'react-native';

import {
    TextInput, 
    Title,
    Headline,
    Button
} from 'react-native-paper';

import SafeAreaView from 'react-native-safe-area-view';

import Background from '../MainViews/login/images/login_background.jpg';

import { 
    SocialIcon,
    Input
 } from 'react-native-elements';

//import LupaController from '../../../api/controller/LupaController';

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
            visible: true,
        }
    }

    _registerUser = () => {
        LupaController.registerUser(this.state.username, this.state.password, this.state.firstName, this.state.lastName, this.state.email);
    }

    _closeModal = () => {
        this.setState({
            
        })
    }

    render() {
        return (
            <Modal presentationStyle="fullScreen" visible={false} style={styles.modalContainer}>
                <ImageBackground style={{flex: 1}} source={Background}>

                <SafeAreaView style={{flex: 1}}>
                    
                    <View style={styles.headerText}>
                        <Headline style={{fontSize: 25}}>
                            Sign Up
                        </Headline>
                        <Text style={styles.instructionalText}>
                            Welcome to the Lupa Platform
                        </Text>
                    </View>

                    <View style={{height: "30%", alignItems: "center", justifyContent: "center"}}>
                        <Text style={styles.instructionalText}>
                            Sign up using email or mobile
                        </Text>
                        
                            <Input placeholder="Enter an email address or phone number" placeholderTextColor="white" inputStyle={{color: "white"}} label="Email or Mobile" labelStyle={{color: "white"}} containerStyle={{margin: 3}}/>
                            <Input placeholder="Enter a password"  label="Password" placeholderTextColor="white" inputStyle={{color: "white"}} labelStyle={{color: 'white'}} containerStyle={{margin: 3}}/>
                    </View>

                    <View style={styles.socialNetworks}>
                        <Text style={styles.instructionalText}>
                            Or sign up using
                        </Text>
                        <View style={styles.socialButtons}>
                            <SocialIcon type="facebook" title="Sign in using Facebook" light raised={true} button style={styles.socialButton} />
                            <SocialIcon type="instagram" title="Sign in using Instagram" light raised={true} button style={styles.socialButton} />
                            <SocialIcon type="twitter" title="Sign in using Twitter" light raised={true} button style={styles.socialButton} />
                        </View>
                    </View>

                    <View style={{height: "10%", alignItems: "center", justifyContent: "space-around"}}>
                        <Button mode="contained" color="#2196F3" style={{width: "70%", padding: 4, borderRadius: 15}}>
                            Sign Up
                        </Button>
                        <View style={{alignItems: "center", flexDirection: "row"}}>
                        <Text style={{color: "white"}}>
                            Already have an account?
                        </Text>
                        <Text>
                            {" "}
                        </Text>
                        <TouchableWithoutFeedback onPress={this._closeModal}>
                        <Text style={{color: "#2196F3"}}>
                            Login
                        </Text>
                        </TouchableWithoutFeedback>
                        </View>

                    </View>
                </SafeAreaView>
                </ImageBackground>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        display: "flex",
        backgroundColor: "#FAFAFA",
        margin: 0,
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "space-between",
        flex: 1,
    },
    headerText: {
        alignItems: "center",
        justifyContent: "center",
        height: "20%",
    },
    instructionalText: {
        fontSize: 20,
        fontWeight: "600",
        margin: 10,
        color: "white",

    },
    socialButton: {
        width: "80%"
    },
    socialButtons: {
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
    },
    socialNetworks: {
        alignItems: "center",
        justifyContent: "center",
        height: "40%"
    }
});

export default SignupModal;