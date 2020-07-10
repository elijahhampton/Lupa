import React, { useState } from 'react';

import {
    Modal,
    View,
    SafeAreaView,
    Button,
    TouchableOpacity,
    StyleSheet,
    Text,
    Dimensions,
    Slider,
} from 'react-native';

import {
    Divider,
    Caption,
    TextInput,
} from 'react-native-paper';

import Autocomplete from 'react-native-autocomplete-input';

import LupaController from '../../../controller/lupa/LupaController'
import { useSelector } from 'react-redux';

import FeatherIcon from 'react-native-vector-icons/Feather'

function WorkoutLogModal(props) {
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const lupaWorkouts = useSelector(state => {
        let workouts = []

        for (let i = 0; i < state.Application_Workouts.applicationWorkouts.length; i++)
        {
            workouts.push(state.Application_Workouts.applicationWorkouts[i].workout_name)
        }
        return workouts
    })

    const handleSelectWorkout = (workout_name) => {
        setValueIsPopulated(true)
        setWorkoutSelected(workout_name)
    }

    const handleOnChangeText = (text) => {
        setValueIsPopulated(false)
        setWorkoutSelected(text)
    }

    const handleAddEntry = () => {
        const logEntry = {
            workoutName: workoutSelected,
            reps: reps,
            sets: sets,
            difficultyLevel: difficultyLevel,
            date: new Date()
        }

        LUPA_CONTROLLER_INSTANCE.addEntryToWorkoutLog(logEntry);

        props.closeModalMethod()
    }

    const handleAddAnotherEntry = () => {
        const logEntry = {
            workoutName: workoutSelected,
            reps: reps,
            sets: sets,
            difficultyLevel: difficultyLevel,
            date: new Date()
        }

        LUPA_CONTROLLER_INSTANCE.addEntryToWorkoutLog(logEntry);

        setReps(0)
        setSets(0)
        setWorkoutSelected("")
        setWorkoutName("")
        setDifficultyLevel(0)
    }

    const [workoutName, setWorkoutName] = useState("");
    const [workoutSelected, setWorkoutSelected] = useState("")
    const [valueIsPopulated, setValueIsPopulated] = useState(false)
    const [reps, setReps] = useState(0)
    const [sets, setSets] = useState(0)
    const [difficultyLevel, setDifficultyLevel] = useState(0)
    

    return (
        <Modal visible={props.isVisible} presentationStyle="fullScreen" animated={true} animationType="slide">
                            <SafeAreaView style={{flex: 1, height: '100%', padding: 10,}}>
                                <View>
                                    <View style={{marginHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <FeatherIcon name="x" size={20} onPress={() => props.closeModalMethod()} />
                                    <Text style={{padding: 10, fontSize: 22, fontFamily: 'ARSMaquettePro-Medium'}}>
                Log a workout
            </Text>
                                    </View>
            <Text style={{padding: 10, fontSize: 15 }}>
                Keep track of your workouts and help trainers learn more about your routine
            </Text>
                                </View>
            <Divider style={styles.divider} />
            <View style={{flex: 1, justifyContent: 'space-evenly'}}>
            <Autocomplete
            autoCapitalize="none"
            autoCorrect={false}
            value={workoutSelected}
  data={valueIsPopulated ? [] : lupaWorkouts}
  defaultValue={workoutSelected}
  onChangeText={text => handleOnChangeText(text)}
  renderItem={({ item, i }) => (
    <TouchableOpacity key={i} onPress={() => handleSelectWorkout(item)}>
      <Text>{item}</Text>
    </TouchableOpacity>
  )}
  renderSeparator={() => <Divider />}
  containerStyle={{marginHorizontal: 10}}
  placeholder="Which workout are you logging?"
  keyboardAppearance="light"
  keyboardType="default"
  returnKeyLabel="done"
  returnKeyType="done" />

<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: Dimensions.get('window').width}}>
    <View style={{width: Dimensions.get('window').width / 3.5}}>
        <Text>
            Sets completed
        </Text>
        <TextInput value={sets} placeholder="0" label="# Sets" onChangeText={text => setSets(text)} mode="flat" keyboardType="numeric" keyboardAppearance="light" returnKeyType="done" />
    </View>

    <View style={{width: Dimensions.get('window').width / 3.5}}>
        <Text>
            Reps completed
        </Text>
        <TextInput value={reps} placeholder="0" label="# Reps" onChangeText={text => setReps(text)} mode="flat" keyboardType="numeric" keyboardAppearance="light" returnKeyType="done" />
    </View>
</View>

<View style={{marginHorizontal: 20}}>
    <Text>
        How difficult was this for you? (1-10)
    </Text>
    <View>
    <Slider 
    value={0} 
    minimumValue={0} 
    maximumValue={10} 
    onValueChange={val => setDifficultyLevel(val)} 
    key={'workout_log_slider'} 
    testID={'workout_log_slider'}
    step={1}
    />
    <Caption>
        Difficulty Level: {difficultyLevel}
    </Caption>
    </View>
</View>
<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
<Button title="Complete" onPress={handleAddEntry} disabled={workoutSelected == "" || sets == 0 || reps == 0}/>
<Button title="Log Another" onPress={handleAddAnotherEntry} disabled={workoutSelected == "" || sets == 0 || reps == 0}/>
</View>
            </View>
            </SafeAreaView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    divider: {
        marginVertical: 10,
        width: Dimensions.get('window').width
    }
})

export default WorkoutLogModal;