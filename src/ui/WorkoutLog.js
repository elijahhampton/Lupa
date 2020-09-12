import React, { useEffect, useState } from 'react'

import {
    View,
    SafeAreaView,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native'

import {
    Card,
    Button,
    IconButton,
} from 'react-native-paper'

import { useSelector } from 'react-redux'
import LupaController from '../controller/lupa/LupaController'
import FeatherIcon from 'react-native-vector-icons/Feather'
import ProgramOptionsModal from './workout/program/modal/ProgramOptionsModal'
import { getLupaProgramInformationStructure } from '../model/data_structures/programs/program_structures'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import LUPA_DB from '../controller/firebase/firebase'

function WorkoutLog(props) {
    const [userWorkouts, setUserWorkouts] = useState([])
    const navigation = useNavigation();

    const handleWorkoutOnPress = (workout) => {
        navigation.push('LiveWorkout', {
                uuid: workout.workout_structure_uuid,
                workoutType: 'WORKOUT',
        })
    }

    const renderWorkouts = () => {
        return userWorkouts.map((workout, index, arr) => {
            if (typeof(workout) == 'undefined' || workout.workout_structure_uuid == false) {
                return;
            }
            
            return (
                <TouchableWithoutFeedback key={index} onPress={() => handleWorkoutOnPress(workout)} style={{margin: 10}}>
                    <Text>
                        {renderWorkouts()}
                    </Text>
                </TouchableWithoutFeedback>
            )
        })

    }

    useEffect(() => {
        const workoutsObserver = LUPA_DB.collection('users').doc().onSnapshot(documentQuery => {
            try {
                const data = documentQuery.data();
                setUserWorkouts(data.workouts);
            } catch(error) {
                setUserWorkouts([])
            }
        });

        return () => workoutsObserver();
    }, []) 

    return (
        <SafeAreaView style={styles.root}>
                {renderWorkouts()}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    }
})

export default WorkoutLog;