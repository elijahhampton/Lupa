import React, { useState, useEffect } from 'react';
import { ListItem } from 'react-native-elements'
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView,
} from 'react-native';

import {
    Button,
    Surface,
    Divider
} from 'react-native-paper';

import FeatherIcon from 'react-native-vector-icons/Feather'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import LupaController from '../../../controller/lupa/LupaController';

import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux'

const WelcomeContentDriver = () => {
    const navigation = useNavigation()

    return (
        <View style={{flex: 1}}>
                            <View style={{flex: 0.5, justifyContent: "space-evenly"}}>
                                <Text style={{alignSelf: 'center', fontFamily: 'avenir-roman', fontSize: 20, color: 'rgb(58, 58, 60)', fontWeight: '700'}}>
                                   Thank you for joining Lupa.
                                </Text>
                                
                                <View>
                                <ListItem
        title='Report'
        titleStyle={{fontSize: 15, fontWeight: '600', color: 'rgb(72, 72, 74)'}}
        subtitle='Remember to eport suspicious behavior.'
        subtitleStyle={{fontSize: 15, fontWeight: '600'}}
        bottomDivider
      />
                                <ListItem
        title='Train Safely'
        titleStyle={{fontSize: 15, fontWeight: '600', color: 'rgb(72, 72, 74)'}}
        subtitle='Always meet trainers in a public area.'
        subtitleStyle={{fontSize: 15, fontWeight: '600'}}
        bottomDivider
      />
      <ListItem
        title='Get started'
        titleStyle={{color: '#1089ff', fontWeight: '500'}}

        bottomDivider
        rightIcon={() => <FeatherIcon name="arrow-right" />}
        onPress={() => navigation.navigate('App')}
      />
                               
                            </View>
                            </View>

                        </View>
    )
}

export default WelcomeContentDriver;

const styles = StyleSheet.create({
    topText: {
        fontSize: 15,
        textAlignVertical: "center",
        textAlign: "left",
    },
    contentDriverTextView: {
        width: "80%"
    },  
    contentDriverSurface: {
        alignItems: "center",
        justifyContent: "center",
        elevation: 5,
        borderRadius: 8,
        width: 35,
        height: 35,
        margin: 10, 
    },
    contentDriverView: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        padding: 5
    },
    contentDriverHeaderText: {
        fontSize: 15,
    },
    contentDriverDescriptionText: {
        fontSize: 12, 
         
    },
    displayedContentTitle: {
        color: '#212121',
        opacity: 0.8,
        alignSelf: "center"
    }
})