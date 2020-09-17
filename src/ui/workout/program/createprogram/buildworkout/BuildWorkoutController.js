import React, { createRef } from 'react';

import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    SectionList,
    TouchableWithoutFeedback
} from 'react-native';

import {
    Surface,
    Caption,
    Appbar,
    FAB,
    Button,
    Divider,
} from 'react-native-paper';

import DropDownPicker from 'react-native-dropdown-picker';
import FeatherIcon from 'react-native-vector-icons/Feather';
import RBSheet from 'react-native-raw-bottom-sheet';
import SingleWorkout from '../../../component/SingleWorkout';
import LupaController from '../../../../../controller/lupa/LupaController';
import { connect } from 'react-redux'
import CreateCustomWorkoutModal from './modal/CreateCustomWorkoutModal';
import { Video } from 'expo-av';
import AddSets from './component/AddSets';

const PLACEMENT_TYPES = {
    SUPERSET: 'superset',
    EXERCISE: 'exercise',
}

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state
    }
}

let items = []

/**
 * @author Elijah Hampton
 * 
 * This is the BuildWorkoutTool that allows users to create workouts .  This tool is used 
 * in creating workouts and programs.
 */
class BuildWorkoutController extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
        this.workoutLibraryRef = createRef()
        this.addedWorkoutOptionsRef = createRef();

        this.state = {
            mediaCaptureType: "",
            addCueModalIsVisible: false,
            addDescriptionModalIsVisible: false,
            workoutSchemeModalIsVisible: false,
            addedWorkoutsScrollViewWidth: 0,
            cameraIsVisible: false,
            currPressedPopulatedWorkout: {
                workout_name: "",
                workout_description: "",
                workout_media: {
                    uri: "",
                    media_type: ""
                },
                workout_sets: 0,
                workout_reps: 0,
                workout_tags: [],
                workout_uid: 0,
                workout_day: "", //add the section so it is easy to delete
                superset: [],
            },
            bottomViewIndex: 0,
            workoutDays: {
                Monday: [],
                Tuesday: [],
                Wednesday: [],
                Thursday: [],
                Friday: [],
                Saturday: [],
                Sunday: []
            },
            numWorkoutsAdded: 0,
            currDayIndex: 0,
            currPlacementType: PLACEMENT_TYPES.EXERCISE,
            customWorkoutModalVisible: false,
            libraryData: [
                {
                    title: "Lower",
                    data: this.props.lupa_data.Application_Workouts.applicationWorkouts.lower_workouts,
                },
                {
                    title: "Upper",
                    data: this.props.lupa_data.Application_Workouts.applicationWorkouts.lupa_workouts //WRONG
                },
                {
                    title: "Core",
                    data: this.props.lupa_data.Application_Workouts.applicationWorkouts.core_workouts
                },
            ],
            currView: 0
        }
    }

    /**
     * Changes the view of the build tool to a given index.
     * @param {Number} index The index to change the view to.
     */
    goToIndex = (index) => {
        this.setState({ currView: index })
    }

    /**
     * Saves the program days workout data.  This method calls a method passed as a prop to appropriately
     * save the program days workout data depending on how the tool is being used.
     * @param {Array} workoutDays 
     */
    handleSaveProgramData = (workoutDays) => {
        this.props.saveProgramWorkoutData(workoutDays)
    }

    /**
     * Returns the current day in program_workout_days depending 
     * on the current day index.
     */
    getCurrentDay = () => {
        const currIndex = this.state.currDayIndex
        try {
            return this.props.programData.program_workout_days[currIndex]
        } catch (error) {
            return this.props.program_workout_days[currIndex];
        }
    }

    /**
     * Removes a workout from the populated workouts list.
     */
    deleteWorkout = async () => {
        await this.addedWorkoutOptionsRef.current.close();
        const workoutToDelete = this.state.currPressedPopulatedWorkout;
        const workoutDay = this.getCurrentDay();

        let updatedWorkouts = []
        let newState = {}

        switch (workoutDay) {
            case 'Monday':
                for (let i = 0; i < this.state.workoutDays.Monday.length; i++) {
                    if (this.state.workoutDays.Monday[i].workout_uid == workoutToDelete.workout_uid) {
                        updatedWorkouts = this.state.workoutDays.Monday;
                        updatedWorkouts.splice(i, 1);

                        newState = {
                            Monday: updatedWorkouts,
                            ...this.state.workoutDays
                        }

                        this.setState({ workoutDays: newState })
                    }
                }
                break;
            case 'Tuesday':
                for (let i = 0; i < this.state.workoutDays.Tuesday.length; i++) {
                    if (this.state.workoutDays.Tuesday[i].workout_uid == workoutToDelete.workout_uid) {

                        updatedWorkouts = this.state.workoutDays.Tuesday;
                        updatedWorkouts.splice(i, 1);

                        newState = {
                            Tuesday: updatedWorkouts,
                            ...this.state.workoutDays
                        }

                        this.setState({ workoutDays: newState })
                    }
                }
                break;
            case 'Wednesday':
                for (let i = 0; i < this.state.workoutDays.Wednesday.length; i++) {
                    if (this.state.workoutDays.Wednesday[i].workout_uid == workoutToDelete.workout_uid) {

                        updatedWorkouts = this.state.workoutDays.Wednesday;
                        updatedWorkouts.splice(i, 1);

                        newState = {
                            Wednesday: updatedWorkouts,
                            ...this.state.workoutDays
                        }

                        this.setState({ workoutDays: newState })
                    }
                }
                break;
            case 'Thursday':
                for (let i = 0; i < this.state.workoutDays.Thursday.length; i++) {
                    if (this.state.workoutDays.Thursday[i].workout_uid == workoutToDelete.workout_uid) {

                        updatedWorkouts = this.state.workoutDays.Thursday;
                        updatedWorkouts.splice(i, 1);

                        newState = {
                            Thursday: updatedWorkouts,
                            ...this.state.workoutDays
                        }

                        this.setState({ workoutDays: newState })
                    }
                }
                break;
            case 'Friday':
                for (let i = 0; i < this.state.workoutDays.Friday.length; i++) {
                    if (this.state.workoutDays.Friday[i].workout_uid == workoutToDelete.workout_uid) {

                        updatedWorkouts = this.state.workoutDays.Friday;
                        updatedWorkouts.splice(i, 1);

                        newState = {
                            Friday: updatedWorkouts,
                            ...this.state.workoutDays
                        }

                        this.setState({ workoutDays: newState })
                    }
                }
                break;
            case 'Saturday':
                for (let i = 0; i < this.state.workoutDays.Saturday.length; i++) {
                    if (this.state.workoutDays.Saturday[i].workout_uid == workoutToDelete.workout_uid) {

                        updatedWorkouts = this.state.workoutDays.Saturday;
                        updatedWorkouts.splice(i, 1);

                        newState = {
                            Saturday: updatedWorkouts,
                            ...this.state.workoutDays
                        }

                        this.setState({ workoutDays: newState })
                    }
                }
                break;
            case 'Sunday':
                for (let i = 0; i < this.state.workoutDays.Sunday.length; i++) {
                    if (this.state.workoutDays.Sunday[i].workout_uid == workoutToDelete.workout_uid) {

                        updatedWorkouts = this.state.workoutDays.Sunday;
                        updatedWorkouts.splice(i, 1);

                        newState = {
                            Sunday: updatedWorkouts,
                            ...this.state.workoutDays
                        }

                        this.setState({ workoutDays: newState })
                    }
                }
                break;
            default:
        }
    }

    /**
     * Adds a workout to the populated workout column based on the current day.
     * @param {Object} workoutObject 
     * @param {Enum} placementType 
     */
    captureWorkout = (workoutObject, placementType) => {

        const workoutDay = this.getCurrentDay()
        const updatedWorkout = {
            workout_name: workoutObject.workout_name,
            workout_description: workoutObject.workout_description,
            workout_media: {
                uri: "",
                media_type: ""
            },
            workout_sets: 0,
            workout_reps: 0,
            workout_tags: workoutObject.workout_tags,
            workout_uid: Math.random().toString(),
            workout_day: workoutDay, //add the section so it is easy to delete
            superset: new Array(),
        }

        let updatedWorkoutData, newState;

        switch (this.state.currPlacementType) {
            case PLACEMENT_TYPES.SUPERSET:

                let workoutToUpdate = this.state.currPressedPopulatedWorkout;
                workoutToUpdate.superset.push(updatedWorkout);

                switch (workoutDay) {
                    case 'Monday':
                        for (let i = 0; i < this.state.workoutDays.Monday.length; i++) {
                            if (this.state.workoutDays.Monday[i].workout_uid == workoutToUpdate.workout_uid) {
                                updatedWorkoutData = this.state.workoutDays.Monday;
                                updatedWorkoutData[i] = workoutToUpdate
                                newState = {
                                    Monday: updatedWorkoutData,
                                    ...this.state.workoutDays
                                }
                            }
                        }
                        break;
                    case 'Tuesday':
                        for (let i = 0; i < this.state.workoutDays.Tuesday.length; i++) {
                            if (this.state.workoutDays.Tuesday[i].workout_workout_uid == workoutToUpdate.workout_uid) {
                                updatedWorkoutData = this.state.workoutDays.Tuesday;
                                updatedWorkoutData[i] = workoutToUpdate
                                newState = {
                                    Tuesday: updatedWorkoutData,
                                    ...this.state.workoutDays
                                }
                            }
                        }
                        break;
                    case 'Wednesday':
                        for (let i = 0; i < this.state.workoutDays.Wednesday.length; i++) {
                            if (this.state.workoutDays.Wednesday[i].workout_workout_uid == workoutToUpdate.workout_uid) {
                                updatedWorkoutData = this.state.workoutDays.Wednesday;
                                updatedWorkoutData[i] = workoutToUpdate
                                newState = {
                                    Wednesday: updatedWorkoutData,
                                    ...this.state.workoutDays
                                }
                            }
                        }
                        break;
                    case 'Thursday':
                        for (let i = 0; i < this.state.workoutDays.Thursday.length; i++) {
                            if (this.state.workoutDays.Thursday[i].workout_workout_uid == workoutToUpdate.workout_uid) {
                                updatedWorkoutData = this.state.workoutDays.Thursday;
                                updatedWorkoutData[i] = workoutToUpdate
                                newState = {
                                    Thursday: updatedWorkoutData,
                                    ...this.state.workoutDays
                                }
                            }
                        }
                        break;
                    case 'Friday':
                        for (let i = 0; i < this.state.workoutDays.Friday.length; i++) {
                            if (this.state.workoutDays.Friday[i].workout_workout_uid == workoutToUpdate.workout_uid) {
                                updatedWorkoutData = this.state.workoutDays.Friday;
                                updatedWorkoutData[i] = workoutToUpdate
                                newState = {
                                    Friday: updatedWorkoutData,
                                    ...this.state.workoutDays
                                }
                            }
                        }
                        break;
                    case 'Saturday':
                        for (let i = 0; i < this.state.workoutDays.Saturday.length; i++) {
                            if (this.state.workoutDays.Saturday[i].workout_workout_uid == workoutToUpdate.workout_uid) {
                                updatedWorkoutData = this.state.workoutDays.Saturday;
                                updatedWorkoutData[i] = workoutToUpdate
                                newState = {
                                    Saturday: updatedWorkoutData,
                                    ...this.state.workoutDays
                                }
                            }
                        }
                        break;
                    case 'Sunday':
                        for (let i = 0; i < this.state.workoutDays.Sunday.length; i++) {
                            if (this.state.workoutDays.Sunday[i].workout_workout_uid == workoutToUpdate.workout_uid) {
                                updatedWorkoutData = this.state.workoutDays.Sunday;
                                updatedWorkoutData[i] = workoutToUpdate
                                newState = {
                                    Sunday: updatedWorkoutData,
                                    ...this.state.workoutDays
                                }
                            }
                        }
                        break;
                    default:
                    // In the default case we do nothing
                }

                const num = this.state.numWorkoutsAdded + 1;
                this.setState({ numWorkoutsAdded: num, currPlacementType: PLACEMENT_TYPES.EXERCISE, currPressedPopulatedWorkout: undefined, workoutDays: newState })
                break;
            case PLACEMENT_TYPES.EXERCISE:
                try {
                    if (typeof (workoutObject) == 'undefined') {
                        return;
                    }

                    switch (workoutDay) {
                        case 'Monday':
                            updatedWorkoutData = this.state.workoutDays.Monday
                            updatedWorkoutData.push(updatedWorkout)
                            newState = {
                                Monday: updatedWorkoutData,
                                ...this.state.workoutDays,
                            }
                            break;
                        case 'Tuesday':
                            updatedWorkoutData = this.state.workoutDays.Tuesday
                            updatedWorkoutData.push(updatedWorkout)
                            newState = {
                                Tuesday: updatedWorkoutData,
                                ...this.state.workoutDays,
                            }
                            break;
                        case 'Wednesday':
                            updatedWorkoutData = this.state.workoutDays.Wednesday
                            updatedWorkoutData.push(updatedWorkout)
                            newState = {
                                Wednesday: updatedWorkoutData,
                                ...this.state.workoutDays,
                            }
                            break;
                        case 'Thursday':
                            updatedWorkoutData = this.state.workoutDays.Thursday
                            updatedWorkoutData.push(updatedWorkout)
                            newState = {
                                Thursday: updatedWorkoutData,
                                ...this.state.workoutDays,
                            }
                            break;
                        case 'Friday':
                            updatedWorkoutData = this.state.workoutDays.Friday
                            updatedWorkoutData.push(updatedWorkout)
                            newState = {
                                Friday: updatedWorkoutData,
                                ...this.state.workoutDays,
                            }
                            break;
                        case 'Saturday':
                            updatedWorkoutData = this.state.workoutDays.Saturday
                            updatedWorkoutData.push(updatedWorkout)
                            newState = {
                                Saturday: updatedWorkoutData,
                                ...this.state.workoutDays,
                            }
                            break;
                        case 'Sunday':
                            updatedWorkoutData = this.state.workoutDays.Sunday
                            updatedWorkoutData.push(updatedWorkout)
                            newState = {
                                Sunday: updatedWorkoutData,
                                ...this.state.workoutDays,
                            }
                            break;
                        default:
                            updatedWorkoutData = this.state.workoutDays.Monday
                            updatedWorkoutData.push(updatedWorkout)
                            newState = {
                                Monday: updatedWorkoutData,
                                ...this.state.workoutDays,
                            }
                    }

                    const num = this.state.numWorkoutsAdded + 1;
                    this.setState({ numWorkoutsAdded: num, workoutDays: newState })
                } catch (error) {
                    alert(error)
                }
                break;
            default:
        }
    }

    /**
     * Returns the populated exercises based on the current day 
     * retrieved by getCurrentDay().
     */
    getCurrentDayContent = () => {
        const currDay = this.getCurrentDay()
        try {

            switch (currDay) {
                case 'Monday':
                    if (this.state.workoutDays.Monday.length === 0) {
                        return (
                            null
                        )
                    }

                    return (
                        <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                            {
                                this.state.workoutDays.Monday.map((exercise, index, arr) => {
                                    return (
                                        <TouchableWithoutFeedback key={index} onPress={() => this.handleOpenAddedWorkoutOptionsSheet(exercise)} style={{ width: this.state.addedWorkoutsScrollViewWidth - 10, height: 100, marginTop: 5, marginBottom: 10 }}>
                                            <View style={[{ flex: 1, width: '100%' }]}>
                                                <View style={{ flex: 1 }} >
                                                    <Surface style={{ flex: 1, backgroundColor: '#212121' }}>
                                                        <Video source={require('../../../../videos/pushuppreview.mov')} style={{ flex: 1 }} shouldPlay={false} resizeMode="cover" />
                                                    </Surface>
                                                </View>
                                                <Text style={{ padding: 3, alignSelf: 'center' }}>
                                                    {exercise.workout_name}
                                                </Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    )
                                })
                            }
                        </View>
                    )
                case 'Tuesday':
                    if (this.state.workoutDays.Tuesday.length === 0) {
                        return (
                            null
                        )
                    }

                    return (
                        <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                            {

                                this.state.workoutDays.Tuesday.map((exercise, index, arr) => {
                                    return (
                                        <TouchableWithoutFeedback key={index} onPress={() => this.handleOpenAddedWorkoutOptionsSheet(exercise)} style={{ width: this.state.addedWorkoutsScrollViewWidth - 10, height: 100, marginTop: 5, marginBottom: 10 }}>
                                            <View style={[{ flex: 1, width: '100%' }]}>
                                                <View style={{ flex: 1 }} >
                                                    <Surface style={{ flex: 1, backgroundColor: '#212121' }}>
                                                        <Video source={require('../../../../videos/pushuppreview.mov')} style={{ flex: 1 }} shouldPlay={false} resizeMode="cover" />
                                                    </Surface>
                                                </View>
                                                <Text style={{ padding: 3, alignSelf: 'center' }}>
                                                    {exercise.workout_name}
                                                </Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    )
                                })
                            }
                        </View>
                    )
                case 'Wednesday':
                    if (this.state.workoutDays.Wednesday.length === 0) {
                        return (
                            null
                        )
                    }

                    return (
                        <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                            {

                                this.state.workoutDays.Wednesday.map((exercise, index, arr) => {
                                    return (
                                        <TouchableWithoutFeedback key={index} onPress={() => this.handleOpenAddedWorkoutOptionsSheet(exercise)} style={{ width: this.state.addedWorkoutsScrollViewWidth - 10, height: 100, marginTop: 5, marginBottom: 10 }}>
                                            <View style={[{ flex: 1, width: '100%' }]}>
                                                <View style={{ flex: 1 }} >
                                                    <Surface style={{ flex: 1, backgroundColor: '#212121' }}>
                                                        <Video source={require('../../../../videos/pushuppreview.mov')} style={{ flex: 1 }} shouldPlay={false} resizeMode="cover" />
                                                    </Surface>
                                                </View>
                                                <Text style={{ padding: 3, alignSelf: 'center' }}>
                                                    {exercise.workout_name}
                                                </Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    )
                                })
                            }
                        </View>
                    )
                case 'Thursday':
                    if (this.state.workoutDays.Thursday.length === 0) {
                        return (
                            null
                        )
                    }

                    return (
                        <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                            {

                                this.state.workoutDays.Thursday.map((exercise, index, arr) => {
                                    return (
                                        <TouchableWithoutFeedback key={index} onPress={() => this.handleOpenAddedWorkoutOptionsSheet(exercise)} style={{ width: this.state.addedWorkoutsScrollViewWidth - 10, height: 100, marginTop: 5, marginBottom: 10 }}>
                                            <View style={[{ flex: 1, width: '100%' }]}>
                                                <View style={{ flex: 1 }} >
                                                    <Surface style={{ flex: 1, backgroundColor: '#212121' }}>
                                                        <Video source={require('../../../../videos/pushuppreview.mov')} style={{ flex: 1 }} shouldPlay={false} resizeMode="cover" />
                                                    </Surface>
                                                </View>
                                                <Text style={{ padding: 3, alignSelf: 'center' }}>
                                                    {exercise.workout_name}
                                                </Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    )
                                })
                            }
                        </View>
                    )
                case 'Friday':
                    if (this.state.workoutDays.Friday.length === 0) {
                        return (
                            null
                        )
                    }
                    return (
                        <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                            {

                                this.state.workoutDays.Friday.map((exercise, index, arr) => {
                                    return (
                                        <TouchableWithoutFeedback key={index} onPress={() => this.handleOpenAddedWorkoutOptionsSheet(exercise)} style={{ width: this.state.addedWorkoutsScrollViewWidth - 10, height: 100, marginTop: 5, marginBottom: 10 }}>
                                            <View style={[{ flex: 1, width: '100%' }]}>
                                                <View style={{ flex: 1 }} >
                                                    <Surface style={{ flex: 1, backgroundColor: '#212121' }}>
                                                        <Video source={require('../../../../videos/pushuppreview.mov')} style={{ flex: 1 }} shouldPlay={false} resizeMode="cover" />
                                                    </Surface>
                                                </View>
                                                <Text style={{ padding: 3, alignSelf: 'center' }}>
                                                    {exercise.workout_name}
                                                </Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    )
                                })
                            }
                        </View>
                    )
                case 'Saturday':
                    if (this.state.workoutDays.Saturday.length === 0) {
                        return (
                            null
                        )
                    }

                    return (
                        <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                            {

                                this.state.workoutDays.Saturday.map((exercise, index, arr) => {
                                    return (
                                        <TouchableWithoutFeedback key={index} onPress={() => this.handleOpenAddedWorkoutOptionsSheet(exercise)} style={{ width: this.state.addedWorkoutsScrollViewWidth - 10, height: 100, marginTop: 5, marginBottom: 10 }}>
                                            <View style={[{ flex: 1, width: '100%' }]}>
                                                <View style={{ flex: 1 }} >
                                                    <Surface style={{ flex: 1, backgroundColor: '#212121' }}>
                                                        <Video source={require('../../../../videos/pushuppreview.mov')} style={{ flex: 1 }} shouldPlay={false} resizeMode="cover" />
                                                    </Surface>
                                                </View>
                                                <Text style={{ padding: 3, alignSelf: 'center' }}>
                                                    {exercise.workout_name}
                                                </Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    )
                                })
                            }
                        </View>
                    )
                case 'Sunday':
                    if (this.state.workoutDays.Sunday.length === 0) {
                        return (
                            null
                        )
                    }

                    return (
                        <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                            {
                                this.state.workoutDays.Sunday.map((exercise, index, arr) => {
                                    return (
                                        <TouchableWithoutFeedback key={index} onPress={() => this.handleOpenAddedWorkoutOptionsSheet(exercise)} style={{ width: this.state.addedWorkoutsScrollViewWidth - 10, height: 100, marginTop: 5, marginBottom: 10 }}>
                                            <View style={[{ flex: 1, width: '100%' }]}>
                                                <View style={{ flex: 1 }} >
                                                    <Surface style={{ flex: 1, backgroundColor: '#212121' }}>
                                                        <Video source={require('../../../../videos/pushuppreview.mov')} style={{ flex: 1 }} shouldPlay={false} resizeMode="cover" />
                                                    </Surface>
                                                </View>
                                                <Text style={{ padding: 3, alignSelf: 'center' }}>
                                                    {exercise.workout_name}
                                                </Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    )
                                })
                            }
                        </View>
                    )
                default:
                    return (
                        null
                    )

            }
        } catch (error) {
            return;
        }
    }

    /**
     * Opens the custom workout modal.
     */
    handleAddCustomWorkout = async () => {
        await this.workoutLibraryRef.current.close();
        this.setState({ customWorkoutModalVisible: true })
    }

    /**
     * Opens the workout options bottom sheet.
     * @param {Object} workout 
     */
    handleOpenAddedWorkoutOptionsSheet = async (workout) => {
        this.setState({ currPressedPopulatedWorkout: workout })
        await this.addedWorkoutOptionsRef.current.open();
    }

    /**
     * Renders the appropriate header text.
     */
    renderAddExercisesHeaderText = () => {
        if (this.props.lupa_data.Users.currUserData.isTrainer === true) {
            return (
                <Caption style={{ color: 'white' }}>
                    Choose a day of the week and add exercises. Select your added exercises for further options.
                </Caption>
            )
        } else {
            return (
                <Caption style={{ color: 'white' }}>
                    Add exercises and select your added exercises for further options.
                </Caption>
            )
        }
    }

    /**
     * Sets the current placement type to SUPERSET in order to add a new 
     * exercise.
     */
    handleAddSuperSet = async () => {
        await this.setState({ currPlacementType: PLACEMENT_TYPES.SUPERSET });
        this.addedWorkoutOptionsRef.current.close();
    }

    /**
     * Renders the current workouts supersets.
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
            <ScrollView>
                {
                    this.state.currPressedPopulatedWorkout.superset.map(exercise => {
                        return (
                            <View style={{ width: 100, height: 100 }}>
                                <View style={[{ flex: 1, width: '100%' }]}>
                                    <View style={{ flex: 1 }} >
                                        <Surface style={{ flex: 1, backgroundColor: '#212121' }}>
                                            <Video source={require('../../../../videos/pushuppreview.mov')} style={{ flex: 1 }} shouldPlay={false} resizeMode="cover" />
                                        </Surface>
                                    </View>
                                    <Text style={{ padding: 3, alignSelf: 'center' }}>
                                        {exercise.workout_name}
                                    </Text>
                                </View>
                            </View>
                        )
                    })
                }
            </ScrollView>
        )
    }

    /**
     * Renders workout options sheet.
     */
    renderWorkoutOptionsSheet = () => {
        return (
            <RBSheet
                ref={this.addedWorkoutOptionsRef}
                height={Dimensions.get('window').height / 3}
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
                <View style={{ alignItems: 'flex-start', flex: 1, padding: 20, backgroundColor: '#FFFFFF' }}>
                    <TouchableWithoutFeedback onPress={() => this.handleAddSuperSet()} style={{ marginVertical: 10, }}>
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

                    <Divider style={{ alignSelf: 'center', width: Dimensions.get('window').width }} />
                    <View style={{ width: '100%' }}>
                        <Text style={{ alignSelf: 'flex-end', paddingVertical: 5, fontSize: 18, fontWeight: 'bold' }}>
                            Exercise Supersets ({typeof (this.state.currPressedPopulatedWorkout) == 'undefined' ? 0 : this.state.currPressedPopulatedWorkout.superset.length})
                 </Text>
                        {this.renderCurrWorkoutSupersets()}
                    </View>
                </View>
                <SafeAreaView />
            </RBSheet>
        )
    }

    /**
     * Renders the day dropdown picker.
     */
    renderDropdownPicker = () => {
        if (this.props.lupa_data.Users.currUserData.isTrainer === true) {
            this.props.programData.program_workout_days.map((day, index, arr) => {
                let item = {
                    label: day,
                    value: day,
                    index: index
                }

                items.push(item)
            })

            return (
                <DropDownPicker
                    items={items}
                    defaultValue={this.getCurrentDay()}
                    containerStyle={{ marginVertical: 10, height: 45, width: Dimensions.get('window').width }}
                    style={{ backgroundColor: '#fafafa', marginHorizontal: 20 }}
                    itemStyle={{
                        fontSize: 12,
                        justifyContent: 'flex-start'
                    }}
                    dropDownStyle={{ backgroundColor: '#fafafa' }}
                    onChangeItem={item => this.setState({ currDayIndex: item.index })}
                />
            )
        } else {
            //we don't need to do anything here because the currDayIndex is already 0
        }
    }

    /**
     * Renders the component display.
     */
    renderComponentDisplay = () => {
        switch (this.state.currView) {
            case 0:
                return (<View style={styles.container}>
                    <Appbar.Header style={[styles.appbar, { height: 'auto', paddingVertical: 10 }]}>
                        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            {
                                this.props.toolIsFirstScreen === true ?
                                    <Button color="white" uppercase={false} onPress={() => this.props.navigation.pop()}>
                                        Cancel
              </Button>
                                    :
                                    <Button color="white" uppercase={false} onPress={() => this.state.bottomViewIndex === 0 ? this.props.goToIndex(0) : this.setState({ bottomViewIndex: 0 })}>
                                        Back
                    </Button>
                            }
                            <Button style={{ alignSelf: 'flex-end' }} color="white" uppercase={false} onPress={() => this.goToIndex(1)}>
                                Add Sets
                    </Button>
                        </View>
                        <View style={{ justifyContent: 'flex-start', width: '100%', padding: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={{ color: 'white', fontWeight: 'bold', fontFamily: 'Avenir-Heavy', fontSize: 25 }}>
                                    Add Exercises
                    </Text>
                                {/* <View>
                        <FeatherIcon name="search" size={24} color="white" />
                   </View> */}
                            </View>
                            {this.renderAddExercisesHeaderText()}
                        </View>
                    </Appbar.Header>
                    {this.renderDropdownPicker()}
                    <Divider />
                    <View style={styles.content}>
                        <View style={{ flex: 4 }}>
                            <View style={{}}>

                                <View style={{ flex: 1 }}>
                                    <Text>
                                        No Workouts
                            </Text>
                                </View>

                            </View>

                            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                                {
                                    this.props.lupa_data.Users.currUserData.isTrainer === true ?
                                        <View style={{ justifyContent: 'flex-start', width: '100%' }}>
                                            <Button icon={() => <FeatherIcon name="plus" color="#1089ff" />} onPress={this.handleAddCustomWorkout} color="#1089ff" style={{ alignSelf: 'flex-start' }}>
                                                <Text style={{ fontSize: 12 }}>
                                                    Add a custom exercise
                          </Text>
                                            </Button>
                                        </View>
                                        :
                                        null
                                }
                                <SectionList
                                    sections={this.state.libraryData}
                                    keyExtractor={(item, index) => item.workout_name}
                                    renderItem={({ item }) => {
                                        if (typeof (item) == 'undefined' || item.workout_name == "" || item.workout_name == undefined) {
                                            return;
                                        }
                                        return (
                                            <TouchableOpacity onPress={() => this.captureWorkout(item, this.state.currPlacementType)}>
                                                <SingleWorkout
                                                    showSelectStyle={this.state.placementType == PLACEMENT_TYPES.SUPERSET}
                                                    workout={item}
                                                />
                                            </TouchableOpacity>
                                        )
                                    }}
                                    renderSectionHeader={({ section: { title } }) => (
                                        <Text style={styles.sectionHeader}>{title}</Text>
                                    )}
                                />
                            </View>
                        </View>
                        <View style={{ height: '100%', width: 1.5, backgroundColor: '#EEEEEE' }} />
                        <View style={{ flex: 1.5 }}>
                            <ScrollView onLayout={event => this.setState({ addedWorkoutsScrollViewWidth: event.nativeEvent.layout.width })} contentContainerStyle={{ alignItems: 'center', width: '100%' }}>
                                {this.getCurrentDayContent()}
                            </ScrollView>
                        </View>
                    </View>
                    <CreateCustomWorkoutModal isVisible={this.state.customWorkoutModalVisible} closeModal={() => this.setState({ customWorkoutModalVisible: false })} programUUID={this.props.programUUID} captureWorkout={this.captureWorkout} />
                    {this.renderWorkoutOptionsSheet()}
                </View>
                );
            case 1:
                return <AddSets saveProgramWorkoutData={this.handleSaveProgramData} goToIndex={this.goToIndex} programWorkoutDays={this.props.programData.program_workout_days} workoutDays={this.state.workoutDays} structureID={this.props.currProgramUUID} />
        }
    }

    render() {
        return (
            this.renderComponentDisplay()
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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

    }
})

export default connect(mapStateToProps)(BuildWorkoutController);