import React, { useState, useEffect, useRef, createRef } from 'react';

import {
    View,
    SafeAreaView,
    StyleSheet,
    Text,
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

    const [monday, setMonday] = useState('unchecked')
    const [tuesday, setTuesday] = useState('unchecked')
    const [wednesday, setWednesday] = useState('unchecked')
    const [thursday, setThursday] = useState('unchecked')
    const [friday, setFriday] = useState('unchecked')
    const [saturday, setSaturday] = useState('unchecked')
    const [sunday, setSunday] = useState('unchecked')

    const navigation = useNavigation();

    useEffect(() => {
        focusWorkoutTitleInput();
    }, []);

    const handleCheckboxOnPress = (day) => {
        switch(day) {
            case 'Monday':
                checked.includes(day) === true ? setMonday('unchecked') : setMonday('checked')
                break;
            case 'Tuesday':
                checked.includes(day) === true ? setTuesday('unchecked') : setTuesday('checked')
                break;
            case 'Wednesday':
                checked.includes(day) === true ? setWednesday('unchecked') : setWednesday('checked')
                break;
            case 'Thursday':
                checked.includes(day) === true ? setThursday('unchecked') : setThursday('checked')
                break;
            case 'Friday':
                checked.includes(day) === true ? setFriday('unchecked') : setFriday('checked')
                break;
            case 'Saturday':
                checked.includes(day) === true ? setSaturday('unchecked') : setSaturday('checked')
                break;
            case 'Sunday':
                checked.includes(day) === true ? setSunday('unchecked') : setSunday('checked')
                break;
            default:
        }

        let updatedArr = checked;

        if (checked.includes(day)) { 
            updatedArr.splice(checked.indexOf(day), 1);
            setChecked(updatedArr);
            return;
        } else {
            updatedArr.push(day);
            setChecked(updatedArr);
        }
    }

    const saveInformation = () => {
        saveWorkoutInformation(workoutName, checked);
    }

    const focusWorkoutTitleInput = () => {
        workoutTitleInput.current.focus();
    }

    return (
        <SafeAreaView style={{flex: 1, justifyContent: 'space-evenly'}}>
            <Button onPress={() => navigation.pop()} color="#23374d" uppercase={false} mode="text" style={{position: 'absolute', top: 0, left: 0, margin: 0}}>
                Cancel
            </Button>

            <View>
            <TextInput ref={workoutTitleInput} label="Workout Name" mode="outlined" theme={{roundness: 2, colors: {primary: '#1089ff'}}} onChangeText={text => setWorkoutName(text)} value={workoutName} placeholder="Give your workout a name" placeholderTextColor="#212121" style={{height: 45, padding: 3, width: '90%',alignSelf: 'center', marginHorizontal: 40, fontSize: 13, fontFamily: 'Avenir-Light'}} />
            </View>
            

            <View style={{alignItems: 'flex-start'}}>
                <Text style={{paddingLeft: 20, paddingVertical: 5, fontFamily: 'Avenir-Medium', fontSize: 20}}>
                    Which days will be included in your workout? {" "}
                    <Caption>
                        ( Choose at least one )
                    </Caption>
                </Text>

                <View style={{width: '60%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                            <Text  onPress={() => handleCheckboxOnPress('Monday')}  style={{fontFamily: 'Avenir-Light', fontSize: 18}}>
                                Monday
                            </Text>

                            <Checkbox.IOS key={'Monday'} status={monday} color="#1089ff"  />
                        </View>

                        <View style={{width: '60%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                            <Text  onPress={() => handleCheckboxOnPress('Tuesday')}  style={{fontFamily: 'Avenir-Light', fontSize: 18}}>
                                Tuesday
                            </Text>

                            <Checkbox.IOS key={'Tuesday'} status={tuesday} color="#1089ff"  />
                        </View>

                        <View style={{width: '60%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                            <Text  onPress={() => handleCheckboxOnPress('Wednesday')}  style={{fontFamily: 'Avenir-Light', fontSize: 18}}>
                                Wednesday
                            </Text>

                            <Checkbox.IOS key={'Wednesday'} status={wednesday} color="#1089ff"  />
                        </View>

                        <View style={{width: '60%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                            <Text  onPress={() => handleCheckboxOnPress('Thursday')}  style={{fontFamily: 'Avenir-Light', fontSize: 18}}>
                                Thursday
                            </Text>

                            <Checkbox.IOS key={'Thursday'} status={thursday} color="#1089ff"  />
                        </View>

                        <View style={{width: '60%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                            <Text  onPress={() => handleCheckboxOnPress('Friday')}  style={{fontFamily: 'Avenir-Light', fontSize: 18}}>
                                Friday
                            </Text>

                            <Checkbox.IOS key={'Friday'} status={friday} color="#1089ff"  />
                        </View>

                        <View style={{width: '60%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                            <Text  onPress={() => handleCheckboxOnPress('Saturday')}  style={{fontFamily: 'Avenir-Light', fontSize: 18}}>
                                Saturday
                            </Text>

                            <Checkbox.IOS key={'Saturday'} status={saturday} color="#1089ff"  />
                        </View>

                        <View style={{width: '60%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                            <Text  onPress={() => handleCheckboxOnPress('Sunday')}  style={{fontFamily: 'Avenir-Light', fontSize: 18}}>
                                Sunday
                            </Text>

                            <Checkbox.IOS key={'Sunday'} status={sunday} color="#1089ff"  />
                        </View>

              
            
            
            
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