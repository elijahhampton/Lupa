import React, { createRef } from 'react';

import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Image,
    SectionList,
    TouchableWithoutFeedback
} from 'react-native';

import {
    Surface,
    Caption,
    Appbar,
    Button,
    Divider,
} from 'react-native-paper';

import FeatherIcon from 'react-native-vector-icons/Feather';

import RBSheet from 'react-native-raw-bottom-sheet';

import SingleWorkout from '../../../component/SingleWorkout';
import LupaController from '../../../../../controller/lupa/LupaController';

import { connect } from 'react-redux'
import CreateCustomWorkoutModal from './modal/CreateCustomWorkoutModal';
import { Video } from 'expo-av';
import AddSets from './component/AddSets';

import { Picker } from '@react-native-community/picker';
import { getProgramWorkoutStructureEntry } from '../../../../../model/data_structures/programs/program_structures';
import { getLupaExerciseStructure } from '../../../../../model/data_structures/workout/exercise_collections';
import { LOG_ERROR } from '../../../../../common/Logger';
import { DebugInstructions } from 'react-native/Libraries/NewAppScreen';
import WorkoutDisplay from './component/WorkoutDisplay';

const PLACEMENT_TYPES = {
    SUPERSET: 'superset',
    EXERCISE: 'exercise',
}

const CATEGORIES = [
    'Balance',
    'Flexibility',
    'Core',
    'Resistance',
    'Plyometric'

]

//Redux::mapStateToProps
const mapStateToProps = (state, action) => {
    return {
        lupa_data: state
    }
}

function Exercise(workoutObject, workoutDay) {
    this.workout_name = workoutObject.workout_name
    this.workout_description = workoutObject.workout_description
    this.workoutMedia = {
        media_type: '',
        uri: '',
    }
    this.workout_reps = 0
    this.workout_sets = 0
    this.workout_uid = Math.random().toString()
    this.workout_tempo = '0-0-0'
    this.workout_rest_time = 0
    this.workout_day = workoutDay
    this.superset = []
}

/**
 * @author Elijah Hampton
 * BuildWorkoutController
 */
class BuildWorkoutController extends React.Component {
    constructor(props) {
        super(props);

        this.trackedWorkouts = []

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
        this.addedWorkoutOptionsRef = createRef();
        this.weekDayRBSheetRef = createRef();
        this.dayOfTheWeekRBSheetRef = createRef();
        this.addExerciseRBSheetRef = createRef();
        this.addExerciseNestedRBSheetRef = createRef()

        this.state = {
            addedWorkoutsScrollViewWidth: 0,
            currPressedPopulatedWorkout: getLupaExerciseStructure(),
            weeks: [],
            searchValue: '',
            bottomViewIndex: 0,
            folderIsSelected: false,
            folderSelected: '',
            workoutDays: [],
            numWorkoutsAdded: 0,
            currDayIndex: 0,
            currWeekIndex: 0,
            ready: false,
            currPlacementType: PLACEMENT_TYPES.EXERCISE,
            customWorkoutModalVisible: false,
            libraryData: [
                {
                    title: "Balance",
                    data: this.props.lupa_data.Application_Workouts.applicationWorkouts.balance_workouts,
                },
                {
                    title: "Flexibility",
                    data: this.props.lupa_data.Application_Workouts.applicationWorkouts.flexibility_workouts
                },
                {
                    title: "Core",
                    data: this.props.lupa_data.Application_Workouts.applicationWorkouts.core_workouts
                },
                {
                    title: "Resistance",
                    data: this.props.lupa_data.Application_Workouts.applicationWorkouts.resistance_workouts
                },
                {
                    title: "Plyometric",
                    data: this.props.lupa_data.Application_Workouts.applicationWorkouts.plyometric_workouts
                },
            ],
            currView: 0
        }
    }

    /**
     * Lifecycle method componentDidMount
     */
    async componentDidMount() {
        let weeks = [], workoutDays = [];
        const programDuration = this.props.programData.program_duration;

        if (this.props.lupa_data.Users.currUserData.isTrainer === true) {
            workoutDays = new Array(programDuration);
            for (let i = 0; i < programDuration; i++) {
                await weeks.push(i);
                workoutDays[i] = {
                    Monday: [],
                    Tuesday: [],
                    Wednesday: [],
                    Thursday: [],
                    Friday: [],
                    Saturday: [],
                    Sunday: []
                }
            }
        } else {
            workoutDays = new Array(1)
            await weeks.push(0)
            workoutDays[0] = {
                Monday: [],
                Tuesday: [],
                Wednesday: [],
                Thursday: [],
                Friday: [],
                Saturday: [],
                Sunday: []
            }
        }


        await this.setState({ ready: true, weeks: weeks, workoutDays: workoutDays })
    }

    /**
     * Changes the currView state variables causing the view to render the correct view.
     * @param {*} index 
     */
    goToIndex = (index) => {
        this.setState({ currView: index })
    }

    /**
     * Saves the program workout data to the appropriate document.
     * @param {*} workoutDays 
     */
    handleSaveProgramData = (workoutDays) => {
        this.props.saveProgramWorkoutData(workoutDays)
    }

    /**
     * Returns the current day inside of program_workout_days 
     * based on the currDayIndex;
     */
    getCurrentDay = () => {
        const currIndex = this.state.currDayIndex
        try {
            if (!this.props.lupa_data.Users.currUserData.isTrainer) {
                return this.props.program_workout_days[currIndex]
            }
            return this.props.programData.program_workout_days[currIndex]
        } catch (error) {
            return this.props.program_workout_days[currIndex];
        }
    }

    /**
     * Removes a workout from the workoutDays structure.
     */
    deleteWorkout = async () => {
        await this.addedWorkoutOptionsRef.current.close();
        const workoutToDelete = this.state.currPressedPopulatedWorkout;
        const workoutDay = this.getCurrentDay();
        const currWeek = this.getCurrentWeek()

        let newState = this.state.workoutDays;

        for (let i = 0; i < this.state.workoutDays[currWeek][workoutDay].length; i++) {
            if (this.state.workoutDays[currWeek][workoutDay][i].workout_uid == workoutToDelete.workout_uid) {
                newState[currWeek][workoutDay].splice(i, 1);
            }
        }

        this.setState({ workoutDays: newState })
    }

    addNewWorkout = (workoutObject) => {
        const workoutDay = this.getCurrentDay()
        const currWeek = this.getCurrentWeek();

        var updatedWorkout = {}

        return updatedWorkout;
    }

    /**
     * Adds a workout to the workoutDays structure.
     * @param {*} workoutObject 
     * @param {*} placementType 
     */
    captureWorkout = (workoutObject, placementType) => {
        const workoutDay = this.getCurrentDay()
        const currWeek = this.getCurrentWeek();

        let updatedWorkout = new Exercise(workoutObject, workoutDay)

        if (typeof (workoutObject) == 'undefined') {
            return;
        }

        let newWorkoutData = this.state.workoutDays;

        switch (this.state.currPlacementType) {
            case PLACEMENT_TYPES.SUPERSET:
                let workoutToUpdate = this.state.currPressedPopulatedWorkout;
                workoutToUpdate.superset.push(updatedWorkout);

                for (let i = 0; i < this.state.workoutDays[currWeek][workoutDay].length; i++) {
                    if (this.state.workoutDays[currWeek][workoutDay].workout_uid == workoutToUpdate.workout_uid) {
                        newWorkoutData[currWeek][workoutDay][i] = workoutToUpdate
                    }
                }
                break;
            case PLACEMENT_TYPES.EXERCISE:
                console.log('Exercise being added is: ' + updatedWorkout.workout_name);
                newWorkoutData[currWeek][workoutDay].push(updatedWorkout);
                break;
            default:
        }



        const num = this.state.numWorkoutsAdded + 1;
        this.setState({ workoutDays: Array.from(newWorkoutData), currPressedPopulatedWorkout: undefined, numWorkoutsAdded: num, currPlacementType: PLACEMENT_TYPES.EXERCISE })
    }

    /**
     * Returns the workouts for the current day and week.
     */
    getCurrentDayContent = () => {
        const currDay = this.getCurrentDay();
        const currWeek = this.getCurrentWeek();
        const workoutDays = this.state.workoutDays;

        if (!this.state.ready) {
            return null;
        }

        try {
            if (typeof (workoutDays[currWeek][currDay]) == 'undefined') {
                return null;
            }

            const currWorkoutDaysState = workoutDays[currWeek][currDay];
            const content = currWorkoutDaysState.map((exercise, index, arr) => {
                return (
                   <TouchableWithoutFeedback key={index} style={[styles.populatedExerciseTouchableContainer, { width: this.state.addedWorkoutsScrollViewWidth - 10, }]}>
                         <WorkoutDisplay workout={exercise} programDuration={0} handleExerciseOnPress={() => this.handleOpenAddedWorkoutOptionsSheet(exercise)} handleSuperSetOnPress={() => this.handleAddSuperSet(exercise)} />
                    </TouchableWithoutFeedback>
                
                )
            })

            if (currWorkoutDaysState.length == 0) {
                return (
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-evenly', width: '100%', height: '100%'}}>
                    <Image style={{width: 110, height: 110}} source={require('../../../../images/timetable_icon/timetable.png')} />
                
                <Text style={{paddingHorizontal: 10, fontFamily: 'Avenir-Black', fontSize: 18}}>
                    Add your first exercise to {this.getCurrentDay()} for this week.
                </Text>
                </View>
                )
            } else {
                return (
                    <ScrollView style={{flex: 1, width: '100%', alignItems: 'flex-start'}}>
                        {content}
                    </ScrollView>
                )
            }
        } catch (error) {
            LOG_ERROR('BuildWorkoutController.js', 'Caught unhandled exception in getCurrentDayContent', error);
        }
    }

    /**
     * Opens the custom workout modal.
     */
    handleAddCustomWorkout = async () => {
        this.setState({ customWorkoutModalVisible: true })
    }

    /**
     * Opens a bottom sheet with options for the current pressed added workout.
     * @param {} workout 
     */
    handleOpenAddedWorkoutOptionsSheet =  (workout) => {
        this.setState({ currPressedPopulatedWorkout: workout }, () => {
            this.addedWorkoutOptionsRef.current.open();
        })
    }

    /**
     * Handles adding an exercise as a superset.
     */
    handleAddSuperSet = (exercise) => {
        this.setState({ currPlacementType: PLACEMENT_TYPES.SUPERSET, currPressedPopulatedWorkout: exercise }, () => {
            console.log('handle add superset call back!')
            this.openRenderAddExerciseRBSheet()
        });
    }

    /**
     * Renders the supersets for any populated workout in the workout options bottom sheet.
     */
    renderCurrWorkoutSupersets = () => {
        if (typeof (this.state.currPressedPopulatedWorkout) == 'undefined') {
            return (
                <View>
                    <Caption>
                        You haven't added any supersets to this exercise.
                    </Caption>
                </View>
            )
        }

        return (
            <ScrollView horizontal>
                {
                    this.state.currPressedPopulatedWorkout.superset.map(exercise => {
                        return (
                            <View style={[styles.flexOne, styles.populatedSupersetExercise]}>
                                <View style={styles.flexOne}>
                                    <Surface style={styles.flexOne}>
                                        <Video source={require('../../../../videos/pushuppreview.mov')} style={styles.flexOne} shouldPlay={false} resizeMode="cover" />
                                    </Surface>
                                </View>
                                <Text style={styles.populatedExerciseText}>
                                    {exercise.workout_name}
                                </Text>
                            </View>
                        )
                    })
                }
            </ScrollView>
        )
    }

    /**
     * Renders the workout options bottom sheet.
     */
    renderWorkoutOptionsSheet = () => {
        return (
            <RBSheet
                ref={this.addedWorkoutOptionsRef}
                height={300}
                closeOnPressMask={true}
                customStyles={{
                    wrapper: {},
                    container: {
                        borderRadius: 20
                    },
                    draggableIcon: {
                        backgroundColor: '#000000'
                    }
                }}
                dragFromTopOnly={true}
            >
                <View style={{ alignItems: 'flex-start', flex: 1, padding: 20, backgroundColor: '#FFFFFF' }}>
                    <TouchableWithoutFeedback onPress={this.handleAddSuperSet} style={{ marginVertical: 10, }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <FeatherIcon name="plus" size={20} style={{ paddingHorizontal: 10 }} />
                            <Text style={{ fontFamily: 'Avenir-Medium', fontSize: 15 }}>
                                Add Superset
                    </Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback style={{ marginVertical: 10 }} onPress={() => this.deleteWorkout()}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <FeatherIcon color="#e53935" name="trash" size={20} style={{ paddingHorizontal: 10 }} />
                            <Text style={{ color: '#e53935', fontFamily: 'Avenir-Medium', fontSize: 15 }}>
                                Remove Workout
                    </Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <SafeAreaView />
                {this.renderNestedAddExerciseRBSheet()}
            </RBSheet>
        )
    }

    /**
     * Renders the bottom sheet for week days.
     */
    renderDropdownPicker = () => {
        if (this.props.lupa_data.Users.currUserData.isTrainer === true && this.state.ready) {
            return (
                <RBSheet
                    ref={this.weekDayRBSheetRef}
                    height={300}
                    closeOnPressMask={true}
                    customStyles={{
                        wrapper: {},
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
                        <Button color="#1089ff" style={{ alignSelf: 'center', marginVertical: 10 }} contentStyle={{width: Dimensions.get('window').width- 20}} mode="contained" onPress={this.closeWeekDayPicker}>
                                <Text>
                                    Done
                        </Text>
                            </Button>
                        </View>
                        <Picker
                            selectedValue={this.getCurrentDay()}
                            style={{ height: '100%', width: '100%' }}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({ currDayIndex: itemIndex })
                            }>
                            {
                                this.props.programData.program_workout_days.map(day => {
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

    renderTrainerButtons = () => {
        return (
            <View style={{ backgroundColor: '#23374d', padding: 10 }}>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%' }}>
                    <TouchableOpacity onPress={this.openWeekDayPicker}>
                        <View style={{ flexDirection: 'row', backgroundColor: 'rgb(247, 247, 247)', borderColor: 'rgb(231, 231, 236)', borderWidth: 0.5, padding: 10, width: 100, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginHorizontal: 3, }}>
                            <FeatherIcon name="chevron-down" />
                            <Text style={{ fontSize: 12, fontWeight: '600', color: 'black' }}>
                               {this.getCurrentDay()}
                    </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.openWeekPicker}>
                        <View style={{ flexDirection: 'row', backgroundColor: 'rgb(247, 247, 247)', borderColor: 'rgb(231, 231, 236)', borderWidth: 0.5, padding: 10, width: 100, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginHorizontal: 3, }}>
                            <FeatherIcon name="chevron-down" />
                            <Text style={{ fontSize: 12, fontWeight: '600', color: 'black' }}>
                                Week {this.getCurrentWeek() + 1}
                    </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.openRenderAddExerciseRBSheet}>
                        <View style={{ flexDirection: 'row', backgroundColor: 'rgb(247, 247, 247)', borderColor: 'rgb(231, 231, 236)', borderWidth: 0.5, padding: 10, width: 100, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginHorizontal: 3, }}>
                            <Text style={{ fontSize: 12, fontWeight: '600', color: 'black' }}>
                                Add Exercise
                    </Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }

    /**
     * Returns the current week index.
     */
    getCurrentWeek = () => {
        if (this.props.lupa_data.Users.currUserData.isTrainer != true) {
            return 0;
        }

        return this.state.currWeekIndex
    }

    /**
     * Renders the day of the week bottom sheet.
     */
    renderDayOfTheWeekDropdownPicker = () => {
        if (this.props.lupa_data.Users.currUserData.isTrainer === true && this.state.ready) {
            return (
                <RBSheet
                    ref={this.dayOfTheWeekRBSheetRef}
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
                            <Button color="#1089ff" style={{ alignSelf: 'center', marginVertical: 10 }} contentStyle={{width: Dimensions.get('window').width - 20}} mode="contained" onPress={this.closeWeekPicker}>
                                <Text>
                                    Done
                        </Text>
                            </Button>
                        </View>
                        <Picker
                            selectedValue={this.getCurrentWeek()}
                            style={{ height: '100%', width: '100%' }}
                            onValueChange={(itemValue, itemIndex) => this.setState({ currWeekIndex: itemIndex })}>
                            {
                                this.state.weeks.map((week, index, arr) => {
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

    checkShowSelectedStyle = (exerciseObject) => {
        const workoutDay = this.getCurrentDay()
        const currWeek = this.getCurrentWeek();
     
        for (let i = 0; i < this.state.workoutDays[currWeek][workoutDay].length; i++) {
            if (this.state.workoutDays[currWeek][workoutDay][i].workout_name == exerciseObject.workout_name) {
                exerciseObject.showSelectStyle = true;
            }
        }
    }

    openRenderAddExerciseRBSheet = () => this.addExerciseRBSheetRef.current.open();

    closeRenderAddExerciseRBSheet = () => this.addExerciseRBSheetRef.current.close();


    openRenderNestedAddExerciseRBSheet = () => this.addExerciseNestedRBSheetRef.current.open();

    closeRenderNestedAddExerciseRBSheet = () => this.addExerciseRBSheetRef.current.close();

    handleFolderIsOpen = (folderString) => {
        this.setState({ folderIsSelected: true, folderSelected: folderString }, () => {
            this.openRenderAddExerciseRBSheet();
        })
    }

    handlerLeaveFolder = () => {
        this.setState({ folderSelected: '', folderIsSelected: false}, () => {
            this.openRenderAddExerciseRBSheet()
        })


    }

    renderFolderContent = () => {
        switch(this.state.folderSelected) {
            case 'Balance':
                return (
                    <View style={{width: Dimensions.get('window').width}}>
                    <ScrollView>
                        {
                        this.props.lupa_data.Application_Workouts.applicationWorkouts.balance_workouts.map((item, index, value) => {
                            if (typeof (item) == 'undefined' || item.workout_name == "" || typeof (item.workout_name) == 'undefined') {
                                return;
                            }
                            this.checkShowSelectedStyle(item)
                            return (
                                <SingleWorkout
                                    onPress={() => this.captureWorkout(item, this.state.currPlacementType)}
                                    key={item.workout_name}
                                    showSelectStyle={item.showSelectStyle}
                                    workout={item}
                                />
                            )
                        })
                        }
                    </ScrollView>
                    <Button color="#1089ff" onPress={this.handlerLeaveFolder} mode="contained" theme={{roundness: 8}} contentStyle={{height: 40, width: Dimensions.get('window').width - 50}} style={{marginVertical: 10, alignSelf: 'center'}}>
                        Back
                    </Button>         
                    </View>
                )
            case 'Core':
                return (
                    <View style={{width: Dimensions.get('window').width}}>
                    <ScrollView>
                        {
                        this.props.lupa_data.Application_Workouts.applicationWorkouts.core_workouts.map((item, index, value) => {
                            if (typeof (item) == 'undefined' || item.workout_name == "" || typeof (item.workout_name) == 'undefined') {
                                return;
                            }
                            this.checkShowSelectedStyle(item)
                            return (
                                <SingleWorkout
                                    onPress={() => this.captureWorkout(item, this.state.currPlacementType)}
                                    key={item.workout_name}
                                    showSelectStyle={item.showSelectStyle}
                                    workout={item}
                                />
                            )
                        })
                        }
                    </ScrollView>
                    <Button color="#1089ff"  onPress={this.handlerLeaveFolder} mode="contained" theme={{roundness: 8}} contentStyle={{height: 40, width: Dimensions.get('window').width - 20}} style={{marginVertical: 10, alignSelf: 'center'}}>
                        Back
                    </Button>         
                    </View>
                )
            case 'Plyometric':
                return (
                    <View style={{width: Dimensions.get('window').width}}>
                    <ScrollView>
                        {
                        this.props.lupa_data.Application_Workouts.applicationWorkouts.plyometric_workouts.map((item, index, value) => {
                            if (typeof (item) == 'undefined' || item.workout_name == "" || typeof (item.workout_name) == 'undefined') {
                                return;
                            }
                            this.checkShowSelectedStyle(item)
                            return (
                                <SingleWorkout
                                    onPress={() => this.captureWorkout(item, this.state.currPlacementType)}
                                    key={item.workout_name}
                                    showSelectStyle={item.showSelectStyle}
                                    workout={item}
                                />
                            )
                        })
                        }
                    </ScrollView>
                    <Button color="#1089ff"  onPress={this.handlerLeaveFolder} mode="contained" theme={{roundness: 8}} contentStyle={{height: 40, width: Dimensions.get('window').width - 20}} style={{marginVertical: 10, alignSelf: 'center'}}>
                        Back
                    </Button>         
                    </View>
                )
            case 'Flexibility':
                return (
                    <View style={{width: Dimensions.get('window').width}}>
                    <ScrollView>
                        {
                        this.props.lupa_data.Application_Workouts.applicationWorkouts.flexibility_workouts.map((item, index, value) => {
                            if (typeof (item) == 'undefined' || item.workout_name == "" || typeof (item.workout_name) == 'undefined') {
                                return;
                            }
                            this.checkShowSelectedStyle(item)
                            return (
                                <SingleWorkout
                                    onPress={() => this.captureWorkout(item, this.state.currPlacementType)}
                                    key={item.workout_name}
                                    showSelectStyle={item.showSelectStyle}
                                    workout={item}
                                />
                            )
                        })
                        }
                    </ScrollView>
                    <Button color="#1089ff"  onPress={this.handlerLeaveFolder} mode="contained" theme={{roundness: 8}} contentStyle={{height: 40, width: Dimensions.get('window').width - 20}} style={{marginVertical: 10, alignSelf: 'center'}}>
                        Back
                    </Button>         
                    </View>
                )
            case 'Resistance':
                return (
                    <View style={{width: Dimensions.get('window').width}}>
                    <ScrollView>
                        {
                        this.props.lupa_data.Application_Workouts.applicationWorkouts.resistance_workouts.map((item, index, value) => {
                            if (typeof (item) == 'undefined' || item.workout_name == "" || typeof (item.workout_name) == 'undefined') {
                                return;
                            }
                            this.checkShowSelectedStyle(item)
                            return (
                                <SingleWorkout
                                    onPress={() => this.captureWorkout(item, this.state.currPlacementType)}
                                    key={item.workout_name}
                                    showSelectStyle={item.showSelectStyle}
                                    workout={item}
                                />
                            )
                        })
                        }
                    </ScrollView>
                    <Button color="#1089ff"  onPress={this.handlerLeaveFolder} mode="contained" theme={{roundness: 8}} contentStyle={{height: 40, width: Dimensions.get('window').width - 20}} style={{marginVertical: 10, alignSelf: 'center'}}>
                        Back
                    </Button>         
                    </View>
                )
        }
    }

    renderAddExerciseContent = () => {
        if (this.state.folderIsSelected === false) {
            
            return (
                <ScrollView horizontal>
{
                CATEGORIES.map(categoryString => {
                   return ( <TouchableOpacity onPress={() => this.handleFolderIsOpen(categoryString)} style={{ margin: 20, alignItems: 'center' }}>
                        <Image source={require('../../../../images/buildworkout/ExerciseFolder.png')} style={{ width: 90, height: 80 }} />
                        <Text style={{ fontFamily: 'Avenir-Heavy', marginVertical: 10 }}>
                            {categoryString}
                        </Text>
                    </TouchableOpacity>
                   )
            })
        }
                        </ScrollView>
            )
        } else {
            return (
            <View style={{flex: 1}}>
                {this.renderFolderContent()}
            </View>
            )
        }
    }

    handleOnCloseAddExerciseRBSheet = () => {
        console.log('BEGINNING ON CLOSE')
        this.setState({ folderIsSelected: false, folderSelected: ''})
        console.log("ENDING ON CLOSE")
    }

    renderAddExerciseRBSheet = () => {
        return (
            <RBSheet
                ref={this.addExerciseRBSheetRef}
                dragFromTopOnly={true}
                closeOnDragDown={true}
                onClose={this.handleOnCloseAddExerciseRBSheet}
                height={this.state.folderIsSelected === true ? 550 : 160}
                customStyles={{
                    wrapper: {
                        flex: 1,
                    },
                    container: {
                        borderTopRightRadius: 10,
                        borderTopLeftRadius: 10,
                    },
                    draggableIcon: {
                        backgroundColor: 'grey',
                    }
                }}
            >
                <ScrollView horizontal>
                    {
                        this.renderAddExerciseContent()
                    }
                </ScrollView>
            </RBSheet>
        )
    }

    renderNestedAddExerciseRBSheet = () => {
        return (
            <RBSheet
                ref={this.addExerciseNestedRBSheetRef}
                dragFromTopOnly={true}
                closeOnDragDown={true}
                onClose={this.handleOnCloseAddExerciseRBSheet}
                height={this.state.folderIsSelected === true ? 550 : 160}
                customStyles={{
                    wrapper: {
                        flex: 1,
                    },
                    container: {
                        borderTopRightRadius: 10,
                        borderTopLeftRadius: 10,
                    },
                    draggableIcon: {
                        backgroundColor: 'grey',
                    }
                }}
            >
           
                    {
                        this.renderAddExerciseContent()
                    }
   
            </RBSheet>
        )
    }



    /**
     * Renders the component display basd on currView
     */
    renderComponentDisplay = () => {
        if (!this.state.ready) {
            return null;
        }

        switch (this.state.currView) {
            case 0:
                return (
                    <View style={styles.container}>
                        <Appbar.Header style={{ elevation: 0, alignItems: 'center', backgroundColor: '#23374d', }}>
                            <Button color="white" uppercase={false} onPress={() => this.props.goToIndex(0)}>
                                Back
                                    </Button>
                            <Appbar.Content title="Add Exercises" />
                            <Button color="white" uppercase={false} onPress={() => this.props.goToIndex(2)}>
                                Next
                                    </Button>
                        </Appbar.Header>
                        <View style={styles.content}>
                           
                                {this.getCurrentDayContent()}
                            </View>
                        <View style={{ position: 'absolute', bottom: 0 }} /* style={styles.toolbar} */>
                            {this.renderTrainerButtons()}
                        </View>
                        {this.renderDropdownPicker()}
                        {this.renderDayOfTheWeekDropdownPicker()}
                        {this.renderAddExerciseRBSheet()}
                        {this.renderWorkoutOptionsSheet()}
                    </View>
                );
            case 1:
                return <AddSets programData={this.props.programData} saveProgramWorkoutData={this.handleSaveProgramData} goToIndex={this.goToIndex} programWorkoutDays={this.props.lupa_data.Users.currUserData.isTrainer === false ? this.props.program_workout_days : this.props.programData.program_workout_days} workoutDays={this.state.workoutDays} structureID={this.props.currProgramUUID} />
        }
    }

    /**
     * Opens the week day picker
     */
    openWeekDayPicker = () => this.weekDayRBSheetRef.current.open();

    /**
     * Closes the week day picker
     */
    closeWeekDayPicker = () => this.weekDayRBSheetRef.current.close();

    /**
     * Opens the week picker
     */
    openWeekPicker = () => this.dayOfTheWeekRBSheetRef.current.open();

    /**
     * Closes the week picker
     */
    closeWeekPicker = () => this.dayOfTheWeekRBSheetRef.current.close();

    /**
     * Renders the component.
     */
    render() {
        return (
            <>
                { this.renderComponentDisplay()}

            </>
        )
    }
}

const styles = StyleSheet.create({
    appbar: {
        backgroundColor: '#1089ff',
        elevation: 0,
        flexDirection: 'column',
    },
    container: {
        flex: 1,

    },
    content: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    mainContent: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EEEEEE'
    },
    alignAndJustifyCenter: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    exerciseOptionHeaderText: {
        fontSize: 15,
        fontFamily: 'Avenir-Medium',
        color: '#23374d',
    },
    exerciseOptionIcon: {
        marginHorizontal: 10,
        color: '#23374d',
    },
    sectionHeader: {
        fontFamily: 'Avenir-Heavy',
        backgroundColor: '#FFFFFF',
        fontSize: 15,
        padding: 10
    },
    pressedWorkoutStyle: {
        borderColor: '#1089ff',
        borderWidth: 0.5,
        padding: 10,
        flex: 1,
    }, //---- verified
    populatedExerciseTouchableContainer: {
        height: 100,
        marginTop: 5,
        marginBottom: 10
    },
    populatedExerciseText: {
        paddingVertical: 5,
        alignSelf: 'center',
        fontSize: 10,
        width: '100%'
    },
    flexOne: {
        flex: 1,
    },
    whiteText: {
        color: 'white'
    },
    populatedSupersetExercise: {
        width: 100,
        height: 100,
        marginHorizontal: 10
    },
    specializedAppbar: {
        height: 'auto',
        paddingVertical: 10
    },
    appbarActions: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    addExerciseText: {
        color: 'white',
        alignSelf: 'flex-start',
        fontWeight: 'bold',
        fontFamily: 'Avenir-Heavy',
        fontSize: 20
    },
    containerPadding: {
        padding: 10,
    },
    buildOptionsSafeAreaView: {
        borderTopColor: '#E5E5E5',
        borderTopWidth: 0.5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    buildOptionsButton: {
        elevation: 8,
        marginVertical: 10
    },
    midSectionDivider: {
        height: '100%',
        width: 1.5,
        backgroundColor: '#EEEEEE'
    }
})

export default connect(mapStateToProps)(BuildWorkoutController);