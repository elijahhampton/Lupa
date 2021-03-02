import React, { createRef, useRef, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Slider,
    TouchableWithoutFeedback,
    Dimensions,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';

import {
    Appbar,
    Surface,
    Caption,
    Chip,
    Avatar,
    Divider,
    Button
} from 'react-native-paper';

import { useSelector } from 'react-redux';

import CreateCustomExercise from '../modal/CreateCustomExercise';
import FeatherIcon from 'react-native-vector-icons/Feather';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Picker } from '@react-native-community/picker';
import { Constants } from 'react-native-unimodules';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import initializeNewProgram, { getLupaProgramInformationStructure } from '../../../model/data_structures/programs/program_structures';
import { getLupaExerciseStructure } from '../../../model/data_structures/workout/exercise_collections';
import LupaController from '../../../controller/lupa/LupaController';
import { LOG_ERROR } from '../../../common/Logger';
import WorkoutDisplay from '../program/createprogram/buildworkout/component/WorkoutDisplay';
import SingleWorkout from './SingleWorkout';
import { LIVE_WORKOUT_MODE } from '../../../model/data_structures/workout/types';

const PLACEMENT_TYPES = {
    SUPERSET: 'superset',
    EXERCISE: 'exercise',
}

const CATEGORIES = [
    'Bodyweight',
    'Barbell',
    'Dumbbell',
    'Kettlebell',
    'Machine Assisted',
    'Medicine Ball',
    'Plyometric',
    'Personal Library'
]

const weekDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',

]

function Exercise(workoutObject, workoutDay) {
    this.workout_name = workoutObject.workout_name
    this.workout_description = workoutObject.workout_description
    this.workout_media = {
        media_type: workoutObject.workout_media_type,
        uri: workoutObject.workout_media_uri,
    }
    this.workout_how_to_media = {
        media_type: workoutObject.workout_how_to_media_type,
        uri: workoutObject.workout_how_to_media_uri,
    }
    this.workout_reps = 0
    this.workout_sets = 0
    this.workout_uid = Math.random().toString()
    this.workout_tempo = '0-0-0'
    this.workout_rest_time = 0
    this.intensity = 0;
    this.workout_day = workoutDay
    this.superset = []
    this.equipment = []
    this.default_media_type = workoutObject.default_media_type;
    this.default_media_uri = workoutObject.default_media_uri;
    this.index = workoutObject.index;
}

const InPersonWorkout = ({ sessionID, currentWorkoutStructure, programData, currWeek, currDay, currentWorkoutID }) => {
    const [addedWorkoutsScrollViewWidth, setAddedWorkoutsScrollViewWidth] = useState(0);
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    /**
     * Returns the workouts for the current day and week.
     */
    getCurrentDayContent = () => {
            if (typeof(currentWorkoutStructure) == 'undefined') {
                return (
                    <View style={{flex: 1}}>
                        <Text>
                        Oops! Something went wrong.
                        </Text>
                    </View>
                )
            }

            let content = currentWorkoutStructure.map((exercise, index, arr) => {
                let updatedExercise = {}
                Object.assign(updatedExercise, exercise);
                
                //Firebase doesn't push empty array values so we need to add back anything here that we need
                if (!updatedExercise.hasOwnProperty('superset')) {
                    updatedExercise.superset = []
                }

                if (!updatedExercise.hasOwnProperty('equipment')) {
                    updatedExercise.equipment = []
                }
                
                return (
                   <TouchableWithoutFeedback key={index} style={[style.populatedExerciseTouchableContainer, { width: addedWorkoutsScrollViewWidth - 10, }]}>
                         <WorkoutDisplay sessionID={sessionID} programData={programData} workoutMode={LIVE_WORKOUT_MODE.IN_PERSON} currWorkoutID={currentWorkoutID} programType='template' currProgramUUID={programData.program_structure_uuid} workout={updatedExercise} programDuration={programData.program_duration}  handleSuperSetOnPress={() => handleAddSuperSet(exercise)} />
                    </TouchableWithoutFeedback>
                
                )
            })

            return (
                <ScrollView>
                    {content}
                </ScrollView>
            )
    }


    return (
        <View style={style.container}>
                    <View style={{flex: 1}}>
                        {getCurrentDayContent()}
                    </View>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    populatedExerciseTouchableContainer: {
        height: 100,
        marginTop: 5,
        marginBottom: 10
    },
});

export default InPersonWorkout;