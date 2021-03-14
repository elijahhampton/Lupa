import React, { useState } from 'react';
import { Modal, StyleSheet, View, Text, ScrollView } from 'react-native';
import { Appbar, Button, Caption, Divider } from 'react-native-paper';
import { Video } from 'expo-av';
import { useSelector } from 'react-redux/lib/hooks/useSelector';
import { LIVE_WORKOUT_MODE } from '../../../model/data_structures/workout/types';
import { useNavigation } from '@react-navigation/core';
import LupaController from '../../../controller/lupa/LupaController';
import { getLupaProgramInformationStructure } from '../../../model/data_structures/programs/program_structures';

function ProgramPortal({ isVisible, closeModal, clientData }) {
    const currUserData = useSelector(state => {
        return state.Users.currUserData
    })

    const [currWeek, setCurrWeek] = useState(0);
    const [currWorkout, setCurrWorkout] = useState(0);
    const [currExercise, setCurrExercise] = useState({})
    const [program, setCurrProgram] = useState(getLupaProgramInformationStructure())

    const navigation = useNavigation();

    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const renderTrainerVideos = (exercise) => {
        if (exercise.trainer_videos.length == 0) {
            return (
                <Caption>
                    Your trainer has not recorded any videos for this exercise!
                </Caption>
            )
        } else {
            return exercise.trainer_videos.map((video, index, arr) => {
                return (
                    <Video style={{ width: 100, height: 100 }} source={video} />
                )
            })
        }
    }

    const renderClientVideos = (exercise) => {
        if (exercise.client_videos.length == 0) {
            return (
                <Caption>
                    No videos have been recorded by the client.
                </Caption>
            )
        } else {
            return exercise.client_videos.map((video, index, arr) => {
                return (
                    <Video style={{ width: 100, height: 100 }} source={video} />
                )
            })
        }
    }

    

    const handleOnLaunchWorkout = (program, index, workoutIndex) => {
        navigation.navigate('LiveWorkout', {
            workoutMode: LIVE_WORKOUT_MODE.TEMPLATE,
            sessionID: program.program_owner + program.program_structure_uuid + currUserData.user_uuid,
            uuid: program.program_structure_uuid,
            workoutType: 'PROGRAM',
            week: index,
            workout: workoutIndex
        });

        <Button color="white" disabled={this.state.isExerciseRecorded} onPress={this.handleOnTakeVideo}>
        {this.state.isExerciseRecorded == false ? 'Record Exercise' : 'Exercise Recorded'}
    </Button>
        
        if (currUserData.user_uuid != program.program_owner)
        {
            if (program.program_restrictions.includes('temporary'))
            {
                const workoutCompleted = index.toString() + workoutIndex.toString();
                LUPA_CONTROLLER_INSTANCE.markWorkoutCompleted(currUserData.user_uuid, program.program_structure_uuid, workoutCompleted);
            }
        }
    }



    const handleCaptureNewMediaURI = (uri, mediaType) => {
        if (currUserData.user_uuid == program.program_owner)
        {
             //save to users program data
             LUPA_CONTROLLER_INSTANCE.saveProgramPlusVideoToProgram(currUserData.user_uuid, currExercise.workout_uid, uri, program.program_structure_uuid, currWeek, currWorkout, "TRAINER");
        }
        else
        {
            //save to users program data
            LUPA_CONTROLLER_INSTANCE.saveProgramPlusVideoToProgram(currUserData.user_uuid, currExercise.workout_uid, uri, program.program_structure_uuid, currWeek, currWorkout, "CLIENT");
        }
       
    }

    const handleOnRecordExercise = async (program, week, workout, exercise) => {
        await setCurrWeek(week)
        await setCurrWorkout(workout)
        await setCurrExercise(exercise)
        await setCurrProgram(program)

        navigation.navigate('LupaCamera', {
            currWorkoutPressed: exercise,
            currProgramUUID: program.program_structure_uuid,
            mediaCaptureType: "VIDEO",
            captureURI: handleCaptureNewMediaURI,
            outlet: 'CreateProgram',
        })
    }

    const renderCycles = (program, week, structure) => {
        return Object.keys(structure).map((week, index, arr) => {
            return (
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{marginVertical: 5}}>
                        <Text>
                            Workout {(index + 1).toString()}
                        </Text>
                        </View>

                        {
                    program.program_restrictions.includes('temporary') && program.workouts_completed.includes(week.toString() + index.toString()) == true ?
                                null
                                :
                                <Button color="#1089ff" uppercase={false} onPress={() => handleOnLaunchWorkout(program, week, index)}>
                                    <Text style={{ fontSize: 12 }}>
                                        Launch Workout
                                    </Text>
                                </Button>
                        }
                    </View>

                    <View>
                        {
                            structure[week].map((exercise, index, arr) => {

                                return (
                                    <View style={{ justifyContent: 'flex-start' }}>
                                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                        <Text style={{ fontStyle: 'italic' }}> {exercise.workout_name} </Text>
                                        <Button color="#1089ff" uppercase={false} onPress={() => handleOnRecordExercise(program, week, index, exercise)}>
                                    <Text style={{ fontSize: 12 }}>
                                        Record Exercise
                                    </Text>
                                </Button>
                                        </View>
                                       
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 10, color: "#AAAAAA" }}>
                                                Sets {exercise.workout_sets}
                                            </Text>
                                            <Text>
                                                {" "}
                                            </Text>
                                            <Text style={{ fontSize: 10, color: "#AAAAAA" }}>
                                                Reps {exercise.workout_reps}
                                            </Text>
                                        </View>
                                        <View style={{ marginVertical: 5 }}>
                                            <Text style={{ fontWeight: '600' }}>
                                                Trainer Videos
                                              </Text>
                                            <View>
                                                <ScrollView horizontal>
                                                    {renderTrainerVideos(exercise)}
                                                </ScrollView>
                                            </View>

                                        </View>

                                        <View style={{ marginVertical: 5 }}>
                                            <Text style={{ fontWeight: '600' }}>
                                                Client Videos
                                              </Text>
                                            <View>
                                                <ScrollView horizontal>
                                                    {renderClientVideos(exercise)}
                                                </ScrollView>
                                            </View>

                                        </View>
                                    </View>
                                )
                            })
                        }

                    </View>
                </View>
            )
        })
    }

    const renderTrainerView = () => {
        if (clientData.program_data.length && clientData.program_data.length == 0) {
            return null;
        } else {
            return clientData.program_data.program_workout_structure.map((weekStructure, index, arr) => {
                return (
                    <>
                        <View>
                            <Text style={{ paddingHorizontal: 10 }}>
                                {clientData.program_data.program_name}
                            </Text>
                        </View>
                        <View style={{ padding: 10 }}>
                            <View style={{ marginVertical: 10 }}>

                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text style={styles.weekHeaderText}>
                                        Week {index + 1}
                                    </Text>
                                </View>



                                <View>

                                    {renderCycles(clientData.program_data, index, weekStructure['workouts'])}
                                </View>
                            </View>

                            <View style={{ marginVertical: 10 }}>
                                <Text style={{ fontFamily: 'Avenir-Heavy', fontSize: 16 }}>
                                    Analytics
                                                    </Text>
                                <Caption>
                                    Coming soon
                                                    </Caption>
                            </View>

                        </View>
                        <Divider />
                    </>
                )
            })
        }
    }

    const renderUserView = () => {
        if (clientData.client.program_data.length && clientData.client.program_data.length == 0) {
            return null;
        } else {
            return clientData.client.program_data.map(program => {
                return program.program_workout_structure.map((weekStructure, index, arr) => {
                    return (
                        <> 
                        <View>
                        <Text style={{ paddingHorizontal: 10 }}>
                            {program.program_name} ({program.program_restrictions.includes('temporary') == true ? 'Assigned by trainer' : 'Purchased'})
                        </Text>
                    </View>
                            <View style={{ padding: 10 }}>

                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text style={styles.weekHeaderText}>
                                        Week {index + 1}
                                    </Text>
                                </View>



                                <View>

                                    {renderCycles(program, index, weekStructure['workouts'])}
                                </View>

                                <View>
                                    <Text>
                                        Analytics
                                                    </Text>
                                    <Caption>
                                        Coming soon
                                                    </Caption>
                                </View>

                            </View>
                            <Divider />
                        </>
                    )
                })
            })
        }
    }

    return (
        <Modal presentationStyle="fullScreen" visible={isVisible}>
            <Appbar.Header style={{ backgroundColor: 'white', elevation: 0 }}>
                <Appbar.BackAction onPress={closeModal} />
                <Appbar.Content title="Program Portal" />
            </Appbar.Header>
            <View style={{ flex: 1 }}>
                <View>
                    <Text style={{ fontFamily: 'Avenir-Black', paddingHorizontal: 10, fontSize: 16 }}>
                        {clientData.client.display_name}
                    </Text>
                </View>
                <ScrollView>
                    {currUserData.user_uuid == clientData.program_data.program_owner ? renderTrainerView() : renderUserView()}
                </ScrollView>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    weekHeaderText: {
        fontSize: 16,
        fontWeight: '700'
    },
    exerciseHeaderText: {
        fontSize: 15,
        fontWeight: '400'
    },
    metadataText: {
        color: '#AAAAAA',
        fontSize: 13
    },
    dayHeaderText: {
        fontSize: 13,
        fontWeight: '700'
    }
})

export default ProgramPortal;