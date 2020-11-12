import React, { useState, useEffect, useRef, createRef } from 'react';

import {
    View,
    StyleSheet,
    Text,
    SafeAreaView,
} from 'react-native';
import { Constants } from 'react-native-unimodules'
import { Checkbox, Button, Caption, TextInput } from 'react-native-paper';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import LupaController from '../../../../controller/lupa/LupaController';
import { useNavigation } from '@react-navigation/native';
 
const daysOfTheWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
]

function WorkoutInformation({ saveWorkoutInformation }) {
    const [checked, setChecked] = useState([])
    const [workoutNameInputFocused, setWorkoutNameInputFocused] = useState(false);
    const [workoutName, setWorkoutName] = useState("");
    const workoutTitleInput = createRef();

    const navigation = useNavigation();

    useEffect(() => {
        focusWorkoutTitleInput();
    }, []);


    const saveInformation = async () => {
        var d = new Date();
let weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

let n = await weekday[d.getDay()];

        saveWorkoutInformation(workoutName, [n]);
    }

    const focusWorkoutTitleInput = () => {
        workoutTitleInput.current.focus();
    }

    return (
        <SafeAreaView style={{flex: 1, justifyContent: 'space-evenly'}}>
            <Button 
                onPress={() => navigation.pop()} 
                color="#23374d" 
                uppercase={false} 
                mode="text" 
                style={{position: 'absolute', top: 0, left: 0, margin: 0}}>
                Cancel
            </Button>

            <View>
            <TextInput 
                keyboardAppearance="light" 
                keyboardAppearance="light" 
                returnKeyLabel="done" 
                returnKeyType="done" 
                ref={workoutTitleInput} 
                label="Enter a name for your workout"
                
                mode="outlined" 
                theme={{roundness: 2, colors: {primary: '#1089ff'}}} 
                onChangeText={text => setWorkoutName(text)} 
                value={workoutName} 
                placeholder="Give your workout a name" 
                placeholderTextColor="#212121" 
                style={{
                    height: 45,
                    padding: 3, 
                    width: '90%',
                    alignSelf: 'center', 
                    marginHorizontal: 40, 
                    fontSize: 13, 
                    fontFamily: 'Avenir-Light'}} 
                />
            </View>
            

            <Button onPress={saveInformation} mode="contained" style={{height: 40,  borderRadius: 5, alignItems: 'center', justifyContent: 'center', elevation: 3, marginHorizontal: 20}} uppercase={false} color="#1089ff">
          <Text>
              Add Exercises
          </Text>
              
            </Button>
        </SafeAreaView>
    )
}

export default WorkoutInformation;