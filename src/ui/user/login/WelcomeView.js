/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  16, 2019
 * 
 * Login View
 */
import React from "react";

import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
} from "react-native";

import {
  Button,
} from 'react-native-paper';

//temporary
import { useNavigation } from "@react-navigation/native";

const AppLogo = require('../../images/applogo.png')

const WelcomeView = () => {
  const navigation = useNavigation()

  const navigateToLogin = () => {
      navigation.navigate('Login');
  }

  
  const navigateToSignUp = () => {
      navigation.navigate('SignUp');
  }

    return (
      <SafeAreaView style={styles.root}>
          <View style={{flex: 1, alignItems: 'center', flexDirection: 'column', margin: 10, padding: 10}}>
                <Text style={{  fontSize: 25, fontWeight: '700', color: '#212121', margin: 5, }}>
                Welcome to Lupa,
                </Text>
                <Text style={{  fontSize: 20, fontWeight: '700', color: '#1565C0', margin: 5, }}>
                the fitness app for preventative healthcare
                </Text>
          </View>

          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Image source={AppLogo} style={{flex: 1, width: 150, height: 5, alignSelf: 'center'}} />
          </View>

          <View style={{flex: 1, justifyContent: 'flex-end'}}>

                <Button mode="contained" color="#1565C0" theme={{colors: {
                    text: 'white'
                }}} style={{elevation: 8, padding: 5, color: "white", borderRadius: 20,margin: 20}} onPress={navigateToSignUp}>
                    <Text>
                    Create an account
                    </Text>
                </Button>
                <Button mode="contained" theme={{colors: {
                    primary: "#212121"
                }}} borderless style={{elevation: 8, padding: 5, color: "#212121", borderRadius: 20, margin: 20}} onPress={navigateToLogin}>
                    <Text style={{color: 'white'}}>
                    I already have an account
                    </Text>
                </Button>
          </View>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
    justifyContent: 'space-between',
  },
  textLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: '#424242',
    margin: 5
  },
  headerText: {
    margin: 15,
    padding: 10,
  },
});

export default WelcomeView;
