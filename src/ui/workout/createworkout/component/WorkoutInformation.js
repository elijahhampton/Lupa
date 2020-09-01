import React, { useState, useEffect, useRef, createRef } from 'react';

import {
    View,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
} from 'react-native';
import { Checkbox, Button, Caption } from 'react-native-paper';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import LupaController from '../../../../controller/lupa/LupaController';

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
    const workoutNameInput = useRef();

    const handleCheckboxOnPress = (day) => {
        let updatedArr = checked;

        if (checked.includes(day)) { 
            updatedArr.splice(checked.indexOf(day), 1)
            setChecked(updatedArr)
            return;
        } else {
            updatedArr.push(day);
            setChecked(updatedArr)
            console.log(checked)
        }
    }

    const saveInformation = () => {
        saveWorkoutInformation(workoutName, checked);
    }

    return (
        <SafeAreaView style={{flex: 1, justifyContent: 'space-evenly'}}>
            <TextInput value={workoutName} placeholder="Give your workout a name" placeholderTextColor="#212121" style={{padding: 3, width: '90%',alignSelf: 'center', marginHorizontal: 40, borderBottomWidth: 2, fontSize: 18, fontFamily: 'Avenir-Light'}} />
            <View style={{alignItems: 'flex-start'}}>
                <Text style={{paddingLeft: 20, paddingVertical: 5, fontFamily: 'Avenir-Medium', fontSize: 20}}>
                    Which days will be included in your workout? {" "}
                    <Caption>
                        ( Choose at least one )
                    </Caption>
                </Text>
                {daysOfTheWeek.map(day => {
                    return (
                        <View style={{width: '60%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                            <Text  onPress={() => handleCheckboxOnPress(day)}  style={{fontFamily: 'Avenir-Light', fontSize: 18}}>
                                {day}
                            </Text>

                            <Checkbox.IOS key={day} status={checked.includes(day) === true ? 'checked' : 'unchecked'} color="#1089ff"  />
                        </View>
                    )
                })}
            </View>

            <Button onPress={saveInformation} mode="contained" style={{height: 40,  borderRadius: 5, alignItems: 'center', justifyContent: 'center', elevation: 3, marginHorizontal: 20}} uppercase={false} color="#1089ff">
          <Text>
              Add Workouts
          </Text>
              
            </Button>
        </SafeAreaView>
    )
}

export default WorkoutInformation;