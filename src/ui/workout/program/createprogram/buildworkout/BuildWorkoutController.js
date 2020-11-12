import React, { createRef } from 'react';

import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    TouchableOpacity,
    ScrollView,
    SectionList,
    SafeAreaView,
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

const PLACEMENT_TYPES = {
    SUPERSET: 'superset',
    EXERCISE: 'exercise',
}

//Redux::mapStateToProps
const mapStateToProps = (state, action) => {
    return {
        lupa_data: state
    }
}

/**
 * @author Elijah Hampton
 * BuildWorkoutController
 */
class BuildWorkoutController extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
        this.addedWorkoutOptionsRef = createRef();
        this.weekDayRBSheetRef = createRef();
        this.dayOfTheWeekRBSheetRef = createRef();

        this.state = {
            addedWorkoutsScrollViewWidth: 0,
            currPressedPopulatedWorkout: getLupaExerciseStructure(),
            weeks: [],
            searchValue: '',
            bottomViewIndex: 0,
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
                    data: [],
                },
                {
                    title: "Flexibility",
                    data: this.props.lupa_data.Application_Workouts.applicationWorkouts._55.flexibility_workouts 
                },
                {
                    title: "Core",
                    data: this.props.lupa_data.Application_Workouts.applicationWorkouts._55.core_workouts
                },
                {
                    title: "Resistance",
                    data: this.props.lupa_data.Application_Workouts.applicationWorkouts._55.resistance_workouts
                },
                {
                    title: "Plyometric",
                    data: this.props.lupa_data.Application_Workouts.applicationWorkouts._55.plyometric_workouts
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
        console.log(this.props.lupa_data.Application_Workouts.applicationWorkouts)
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

    /**
     * Adds a workout to the workoutDays structure.
     * @param {*} workoutObject 
     * @param {*} placementType 
     */
    captureWorkout = (workoutObject, placementType) => {
        const workoutDay = this.getCurrentDay()
        const currWeek = this.getCurrentWeek();

        //  let updatedWorkout = getLupaExerciseStructure(workoutObject.workout_name, workoutObject.workout_description, workoutDay, Math.random().toString())
        let updatedWorkout = {
            workout_name: workoutObject.workout_name,
            workout_description: workoutObject.workout_description,
            workoutMedia: {
                media_type: '',
                uri: '',
            },
            workout_reps: 0,
            workout_sets: 0,
            workout_uid: Math.random().toString(),
            workout_tempo: '0-0-0',
            workout_rest_time: 0,
            workout_day: workoutDay,
            superset: [],
        }

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
                newWorkoutData[currWeek][workoutDay].push(updatedWorkout);
                break;
            default:
        }

        const num = this.state.numWorkoutsAdded + 1;
        this.setState({ workoutDays: newWorkoutData, currPressedPopulatedWorkout: undefined, numWorkoutsAdded: num, currPlacementType: PLACEMENT_TYPES.EXERCISE })
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
            if (typeof(workoutDays[currWeek][currDay]) == 'undefined') {
                return null;
            }

            if (workoutDays[currWeek][currDay].length === 0) {
                return null;
            }

            return (
                <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    {
                        workoutDays[currWeek][currDay].map((exercise, index, arr) => {
                            return (
                                <TouchableWithoutFeedback key={index} onPress={() => this.handleOpenAddedWorkoutOptionsSheet(exercise)} style={[styles.populatedExerciseTouchableContainer, { width: this.state.addedWorkoutsScrollViewWidth - 10, }]}>
                                    <View style={[styles.flexOne, { width: 100, height: 100, marginVertical: 10}]}>
                                        <View style={[styles.flexOne, { width: '100%'}]}>
                                            <Surface style={[styles.flexOne, { width: '100%'}]}>
                                                <Video source={require('../../../../videos/pushuppreview.mov')} style={[styles.flexOne, { width: '100%'}]} shouldPlay={false} resizeMode="cover" />
                                            </Surface>
                                        </View>
                                        <Text style={styles.populatedExerciseText}>
                                            {exercise.workout_name}
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            )
                        })
                    }
                </View>
            )
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
    handleOpenAddedWorkoutOptionsSheet = async (workout) => {
        this.setState({ currPressedPopulatedWorkout: workout })
        await this.addedWorkoutOptionsRef.current.open();
    }

    /**
     * Renders the appropriate caption in the header.
     */
    renderAddExercisesHeaderText = () => {
        if (this.props.lupa_data.Users.currUserData.isTrainer === true) {
            return (
                <Caption style={styles.whiteText}>
                    Choose a day of the week and add exercises. Select your added exercises for further options.
                </Caption>
            )
        } else {
            return (
                <Caption style={styles.whiteText}>
                    Add exercises and select your added exercises for further options.
                </Caption>
            )
        }
    }

    /**
     * Handles adding an exercise as a superset.
     */
    handleAddSuperSet = async () => {
        await this.setState({ currPlacementType: PLACEMENT_TYPES.SUPERSET });
        this.addedWorkoutOptionsRef.current.close();
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
                height={Dimensions.get('window').height / 3}
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
                            <Button color="#1089ff" style={{ alignSelf: 'flex-end' }} mode="text" onPress={this.closeWeekDayPicker}>
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
        if (this.props.lupa_data.Users.currUserData.isTrainer === false) {
            return;
        }

        return (
            
            <SafeAreaView style={styles.buildOptionsSafeAreaView}>
                    <Button onPress={this.openWeekDayPicker} uppercase={false} color="#1089ff" style={styles.buildOptionsButton} mode="contained" icon={() => <FeatherIcon color="white" name="chevron-up" />}>
                        {this.getCurrentDay()}
                    </Button>

           
                    <Button onPress={this.openWeekPicker} uppercase={false} color="#1089ff" style={styles.buildOptionsButton} mode="contained" icon={() => <FeatherIcon color="white" name="chevron-up" />}>
                        Week {this.state.currWeekIndex + 1}
                    </Button>
           
            </SafeAreaView>
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
                            <Button color="#1089ff" style={{ alignSelf: 'flex-end' }} mode="text" onPress={this.closeWeekPicker}>
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

    /**
     * Renders workout library as section list.
     */
    renderSectionList = () => {
        try {
            return (
                <SectionList
                                    sections={this.state.libraryData}
                                    keyExtractor={(item, index) => item.index}
                                    initialNumToRender={5}
                                    removeClippedSubviews={true}
                               
                                    renderItem={({ item }) => {
                                        if (typeof (item) == 'undefined' || item.workout_name == "" || typeof(item.workout_name) == 'undefined') {
                                            return;
                                        }
                                        return (
                                            <TouchableOpacity key={item.workout_name} onPress={() => this.captureWorkout(item, this.state.currPlacementType)}>
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
            )
        } catch(error) {
       
        }
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
                    <Appbar.Header style={[styles.appbar, styles.specializedAppbar]}>
                        <View style={styles.appbarActions}>
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
                            <Button color="white" uppercase={false} onPress={() => this.goToIndex(1)}>
                                Add Sets
                            </Button>
                        </View>
                        <View style={styles.containerPadding}>
                            <View>
                                <Text style={styles.addExerciseText}>
                                    Add Exercises
                                </Text>
                                {/* <View>
                        <FeatherIcon name="search" size={24} color="white" />
                   </View> */}
                            </View>
                            {this.renderAddExercisesHeaderText()}
                        </View>

                    </Appbar.Header>
                    <Divider />
                    <View style={styles.content}>
                        <View style={{ flex: 4 }}>
                            <View>
                                <View style={styles.flexOne}>
                                    <Text>
                                        No Workouts
                            </Text>
                                </View>
                            </View>
                            <View style={styles.flexOne}>
                                {
                                    this.props.lupa_data.Users.currUserData.isTrainer === true ?
                                            <Button icon={() => <FeatherIcon name="plus" color="#1089ff" />} onPress={() => this.props.navigation.push('CreateCustomWorkout', {
                                                programUUID: this.props.programData.program_structure_uuid
                                            })} color="#1089ff" style={{ alignSelf: 'flex-start' }}>
                                                <Text>
                                                    Add a custom exercise
                                                </Text>
                                            </Button>
                                        :
                                        null
                                }
                                {this.renderSectionList()}
                            </View>
                        </View>
                        <View style={styles.midSectionDivider} />
                        <View style={{ flex: 1.5 }}>
                            <ScrollView onLayout={event => this.setState({ addedWorkoutsScrollViewWidth: event.nativeEvent.layout.width })} contentContainerStyle={{ alignItems: 'center', width: '100%' }}>
                                {this.getCurrentDayContent()}
                            </ScrollView>
                        </View>
                    </View>
                   
                    {this.renderWorkoutOptionsSheet()}
                   {this.renderTrainerButtons()}
                   {            this.renderDropdownPicker()}
           { this.renderDayOfTheWeekDropdownPicker()}
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
    }, //---- verified
    populatedExerciseTouchableContainer: {
        height: 100, 
        marginTop: 5, 
        marginBottom: 10
    },
    populatedExerciseText: {
        padding: 3, 
        alignSelf: 'center'
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
        fontWeight: 'bold', 
        fontFamily: 'Avenir-Heavy', 
        fontSize: 25
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