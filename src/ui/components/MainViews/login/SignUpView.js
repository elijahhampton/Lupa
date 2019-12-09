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
    Button,
    Surface
} from 'react-native-paper';

import SafeAreaView from 'react-native-safe-area-view';

import Background from './images/login_background.jpg';

import { 
    SocialIcon,
    Input
 } from 'react-native-elements';

 import { Feather } from '@expo/vector-icons';

const {
    signUpUser
} = require('../../../../controller/lupa/auth');

class SignupModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            confirmedPassword: "",
            isRegistered: false,
            confirmPasswordWidth: 0,
            confirmPasswordHeight: 0,
            passwordSecureTextEntry: true,
            secureConfirmPasswordSecureTextEntry: true,
        }
    }

  /**
   * Introduce the application
   * Finish any last minute things here before showing the application to the user.
   * This really isn't the place to be doing this, but any small last minute changes can go here.
   */
  _introduceApp = () => {
    //this.LUPA_CONTROLLER_INSTANCE.indexApplicationData();
    this.props.navigation.navigate('App');
  }

    _registerUser = async () => {
        const email = this.state.email;
        const password = this.state.password;
        const confirmedPassword = this.state.confirmedPassword;

        //Check registration status
        let successfulRegistration = await signUpUser(email, password, confirmedPassword);

        //Execute login or failure
        successfulRegistration == true ? this._introduceApp(email, password) : console.log('LUPA: Firebase failure upon registering user.');
    }

    _handleMobileInputOnChangeText = async (text) => {
        this.setState({ email: text })
    }

    _handlePasswordInputOnChangeText = async (text) => {
        text.length >= 1 ?  this.setState({ confirmPasswordWidth: "100%", confirmPasswordHeight: "auto" }) : 
        this.setState({confirmPasswordWidth: 0, confirmPasswordHeight: 0 })

        await this.setState({ password: text });

        console.log(this.state.password);
    }

    _handleConfirmedPasswordInputOnChangeText = async (text) => {
        await this.setState({ confirmedPassword: text });

        console.log(this.state.confirmedPassword)
    }

    _handleShowPassword = () => {
        this.setState({
            passwordSecureTextEntry: !this.state.passwordSecureTextEntry
        })
      }

      _handleShowConfirmPassword = () => {
        this.setState({
            confirmPasswordSecureTextEntry: !this.state.confirmPasswordSecureTextEntry
        })
      }

    render() {
        return (
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
                            Enter your email and create a password
                        </Text>

                        <Surface style={styles.surface}>
                        <Input placeholder="Enter an email" 
                        placeholderTextColor="black" 
                        inputStyle={styles.inputStyle} 
                        label="Email" 
                        labelStyle={styles.labelStyle} 
                        containerStyle={styles.containerStyle}
                        value={this.state.email}
                        onChangeText={text => this._handleMobileInputOnChangeText(text)}/>

                        <Input placeholder="Enter a password" 
                        label="Password" 
                        rightIcon={<Feather name="eye" onPress={this._handleShowPassword} />}
                        secureTextEntry={this.state.passwordSecureTextEntry}
                        placeholderTextColor="black" 
                        inputStyle={styles.inputStyle} 
                        labelStyle={styles.labelStyle} 
                        containerStyle={styles.containerStyle}
                        value={this.state.password}
                        onChangeText={text => this._handlePasswordInputOnChangeText(text)}/>

                        <View style={{height: this.state.confirmPasswordHeight, width: this.state.confirmPasswordWidth}}>
                        <Input placeholder="Confirm your password" 
                        label="Confirm Password" 
                        rightIcon={<Feather name="eye" onPress={this._handleShowConfirmShowPassword} />}
                        secureTextEntry={this.state.secureConfirmPasswordSecureTextEntry}
                        placeholderTextColor="black" 
                        inputStyle={styles.inputStyle} 
                        labelStyle={styles.labelStyle} 
                        containerStyle={styles.containerStyle} 
                        value={this.state.confirmedPassword}
                        onChangeText={text => this._handleConfirmedPasswordInputOnChangeText(text)}/> 
                        </View>
                        </Surface>
                    
                    </View>

                    <View style={styles.socialNetworks}>
                        <Text style={styles.instructionalText}>
                            Or sign up using
                        </Text>
                        <View style={styles.socialButtons}>
                            <SocialIcon type="facebook" title="Sign in using Facebook" light raised={true} button style={styles.socialButton} />
                            <SocialIcon type="instagram" title="Sign in using Instagram" light raised={true} button style={styles.socialButton} />
                        </View>
                    </View>

                    <View style={{height: "10%", alignItems: "center", justifyContent: "space-around"}}>
                        <Button mode="contained" color="#2196F3" style={{width: "70%", padding: 4, borderRadius: 15}} onPress={this._registerUser}>
                            Sign Up
                        </Button>
                        <View style={{alignItems: "center", flexDirection: "row"}}>
                        <Text style={{color: "white"}}>
                            Already have an account?
                        </Text>
                        <Text>
                            {" "}
                        </Text>
                        <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Login')}>
                        <Text style={{fontWeight: "900", color: "white"}}>
                            Login
                        </Text>
                        </TouchableWithoutFeedback>
                        </View>

                    </View>
                </SafeAreaView>
                </ImageBackground>
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
    surface: {
        backgroundColor: "rgba(250,250,250 ,0.8)",
        borderRadius: 15,
        height: "auto",
        width: "80%",
        //margin: 10,
        padding: 10,
        alignItems: "center",
        justifyContent: "center"
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
    },
    labelStyle: {
        color: "black",
        fontSize: 12
      },
      inputContainerStyle: {
        borderBottomWidth: 0.5,
        borderBottomColor: "black",
      },
      inputStyle: {
        fontSize: 15,
        fontWeight: "600"
      },
      containerStyle: {
        padding: 10
      }
});

export default SignupModal;