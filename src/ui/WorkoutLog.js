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

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

    const handleWorkoutOnPress = (workout) => {
        navigation.push('LiveWorkout', {
                uuid: workout.program_structure_uuid,
                workoutType: 'WORKOUT',
        })
    }

    const renderWorkouts = () => {
        return userWorkouts.map((workout, index, arr) => {
            if (typeof(workout) == 'undefined' ||  typeof(workout.completedWorkout) == 'undefined' || typeof(workout.program_structure_uuid) == false) {
                return;
            }
            
            return (
                <TouchableWithoutFeedback key={index} onPress={() => handleWorkoutOnPress(workout)} style={{margin: 10}}>
                    <Text>
                        {workout.program_name}
                    </Text>
                </TouchableWithoutFeedback>
            )
        })

    }

    useEffect(() => {
        let documents = []
        const workoutsObserver = LUPA_DB.collection('workouts').onSnapshot(documentQuery => {
            if (documentQuery.size > 0) {
                documentQuery.forEach(doc => {
                    const documentData = doc.data();
                    if (documentData.program_owner == currUserData.user_uuid) {
                        documents.push(documentData);
                    }
                });

                setUserWorkouts(documents);
                documents = [];
            }
        });

        return () => workoutsObserver();
    }, []) 

    return (
        <SafeAreaView style={styles.root}>
            <ScrollView contentContainerStyle={{backgroundColor: '#FFFFFF'}}>
            {renderWorkouts()}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    }
})

export default WorkoutLog;