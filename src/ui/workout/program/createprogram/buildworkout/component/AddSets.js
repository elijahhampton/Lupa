import React, { useEffect, useState, createRef } from 'react';

import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    SafeAreaView,
    ScrollView,
} from 'react-native';

import {
    Appbar,
    Caption,
    Button,
    Divider,
    Surface
} from 'react-native-paper';
import RBSheet from 'react-native-raw-bottom-sheet';

import FeatherIcon from 'react-native-vector-icons/Feather'

import DropDownPicker from 'react-native-dropdown-picker';
import WorkoutDisplay from './WorkoutDisplay';
import { useSelector } from 'react-redux';

import {Picker} from '@react-native-community/picker';

function AddSets({ structureID, programData, workoutDays, programWorkoutDays, goToIndex, saveProgramWorkoutData }) {
    let items = []
    const weekDayRBSheetRef = createRef();
    const dayOfTheWeekRBSheetRef = createRef();

    const [weeks, setWeeks] = useState([])
    const [currWeekIndex, setCurrWeekIndex] = useState(0)
    const [currDayIndex, setCurrDayIndex] = useState(0);

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    });

    programWorkoutDays.map((day, index, arr) => {
        let item = {
            label: day,
            value: day,
            index: index
        }

        items.push(item)
    });


    const getCurrentDay = () => {
        if (typeof (programWorkoutDays) == 'undefined') {
            return undefined
        }

        const currIndex = currDayIndex;
        return programWorkoutDays[currIndex]
    }

    const saveWorkoutData = async () => {
        await saveProgramWorkoutData(workoutDays);
    }

    const renderWorkoutData = () => {

        if (typeof (workoutDays) == 'undefined') {
            return (
                <View style={{ flex: 1, backgroundColor: 'red', alignItems: 'center', justifyContent: 'center' }}>

                </View>
            )
        }

        if ( workoutDays[currWeekIndex][getCurrentDay()].length === 0) {
            <Caption>
                No Workout Data
            </Caption>
        }


        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ScrollView>
                    {
                        workoutDays[currWeekIndex][getCurrentDay()].map((workout, index, arr) => {

                            return (
                                <>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold', padding: 10, fontFamily: 'Avenir-Medium' }}>
                                        Exercise {index + 1}
                                    </Text>

                                    <WorkoutDisplay workout={workout} programDuration={programData.program_duration} />
                                </>
                            )
                        })
                    }
                </ScrollView>
            </View>
        )
    }

    renderDropdownPicker = () => {

        if (currUserData.isTrainer === true) {

            return (

                <RBSheet
                    ref={weekDayRBSheetRef}
                    height={300}
                    closeOnPressMask={true}
                    customStyles={{
                        wrapper: {

                        },
                        container: {
                            borderRadius: 20
                        },
                        draggableIcon: {
                            backgroundColor: '#000000'
                        }
                    }}
                    dragFromTopOnly={true}

                >
                    <View style={{ flex: 1 }}>
                        <View style={{ width: '100%' }}>
                            <Button color="#1089ff" style={{ alignSelf: 'flex-end' }} mode="text" onPress={closeWeekDayPicker}>
                                <Text>
                                    Done
                        </Text>
                            </Button>
                        </View>

                        <Picker
                            selectedValue={getCurrentDay()}
                            style={{ height: '100%', width: '100%' }}
                            onValueChange={(itemValue, itemIndex) =>
                                setCurrDayIndex(itemIndex)

                            }>
                            {
                                programData.program_workout_days.map(day => {
                                    return <Picker.Item label={day} value={day} />
                                })
                            }
                        </Picker>
                    </View>
                    <SafeAreaView />
                </RBSheet>

            )
        } else {
            //we don't need to do anything here because the currDayIndex is already 0
        }
    }

    renderDayOfTheWeekDropdownPicker = () => {
        if (currUserData.isTrainer === true) {
            return (
                <RBSheet
                    ref={dayOfTheWeekRBSheetRef}
                    height={300}
                    closeOnPressMask={true}
                    customStyles={{
                        wrapper: {

                        },
                        container: {
                            borderRadius: 20
                        },
                        draggableIcon: {
                            backgroundColor: '#000000'
                        }
                    }}
                    dragFromTopOnly={true}
                >
                    <View style={{ flex: 1 }}>
                        <View style={{ width: '100%' }}>
                            <Button color="#1089ff" style={{ alignSelf: 'flex-end' }} mode="text" onPress={closeWeekPicker}>
                                <Text>
                                    Done
                        </Text>
                            </Button>
                        </View>
                        <Picker
                            selectedValue={currWeekIndex}
                            style={{ height: '100%', width: '100%' }}
                            onValueChange={(itemValue, itemIndex) => setCurrWeekIndex(itemIndex)}>
                            {
                                weeks.map((week, index, arr) => {
                                    return <Picker.Item label={(week + 1).toString()} value={index} />
                                })
                            }
                        </Picker>
                    </View>
                    <SafeAreaView />
                </RBSheet>

            )
        } else {
            return null;
        }
        return null;
    }

    const openWeekDayPicker = () => weekDayRBSheetRef.current.open();
    const closeWeekDayPicker = () => weekDayRBSheetRef.current.close();

    const openWeekPicker = () => dayOfTheWeekRBSheetRef.current.open();
    const closeWeekPicker = () => dayOfTheWeekRBSheetRef.current.close();

    useEffect(() => {
        const programDuration = programData.program_duration;
        let tempWeeks = [];

            for (let i = 0; i < programDuration; i++) {
                tempWeeks.push(i);

            }

            setWeeks(tempWeeks);
    }, []);


    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Appbar.Header style={[styles.appbar, { height: 'auto', paddingVertical: 10 }]}>
                <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Button color="white" uppercase={false} onPress={() => goToIndex(0)}>
                        Back
                    </Button>

                    <Button color="white" uppercase={false} onPress={() => saveWorkoutData(workoutDays)}>
                        Finish
                    </Button>
                </View>

                <View style={{ justifyContent: 'flex-start', width: '100%', padding: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ color: 'white', fontWeight: 'bold', fontFamily: 'Avenir-Heavy', fontSize: 25 }}>
                            Add Sets and Reps
                    </Text>
                        {
                            /*
                        <View>
                            <FeatherIcon name="search" size={24} color="white" />
                        </View>
                        */
                        }
                    </View>

                    <Caption style={{ color: 'white' }}>
                        Go through each of your exercises and modify the sets and reps.
                    </Caption>
                </View>
            </Appbar.Header>



            {renderWorkoutData()}
            {renderDropdownPicker()}
            {renderDayOfTheWeekDropdownPicker()}
            <SafeAreaView style={{ borderTopColor: '#E5E5E5', borderTopWidth: 0.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                <View style={{ marginVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Button onPress={openWeekDayPicker} uppercase={false} color="#1089ff" style={{ elevation: 8 }} mode="contained" icon={() => <FeatherIcon color="white" name="chevron-up" />}>
                        {getCurrentDay()}
                    </Button>
                </View>

                <View style={{ marginVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Button onPress={openWeekPicker} uppercase={false} color="#1089ff" style={{ elevation: 8 }} mode="contained" icon={() => <FeatherIcon color="white" name="chevron-up" />}>
                        Week {currWeekIndex + 1}
                    </Button>
                </View>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    appbar: {
        backgroundColor: '#1089ff',
        elevation: 0,
        flexDirection: 'column',
    },
})

export default AddSets;