import React, { useState, createRef, useEffect } from 'react';

import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Animated,
} from 'react-native';

import {
    Surface,
    Caption,
    Appbar,
    FAB,
    Button,
    Divider,
    Chip,
    HelperText,
    DataTable,
} from 'react-native-paper';

import {
    ListItem
} from 'react-native-elements';

import DropDownPicker from 'react-native-dropdown-picker';

import { useSelector } from 'react-redux'
import FeatherIcon from 'react-native-vector-icons/Feather';
import ThinFeatherIcon from 'react-native-feather1s'
import RBSheet from 'react-native-raw-bottom-sheet';
import {
    SearchBar
} from 'react-native-elements'
import {fromString} from 'uuidv4';
import SingleWorkout from '../../../component/SingleWorkout';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { getLupaProgramInformationStructure } from '../../../../../model/data_structures/programs/program_structures';
import AddCueModal from './modal/AddCueModal';
import AddDescriptionModal from './modal/AddDescriptionModal';
import WorkoutDisplay from './component/WorkoutDisplay';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import LupaCamera from '../component/LupaCamera'
import WorkoutSchemeModal from './modal/WorkoutSchemeModal';
import { Left, Body, Right } from 'native-base';

const CATEGORY_TAGS = [
    'Calisthenics',
    'Torso',
    'Weights',
    'Legs',
    'General'
]

function BuildWorkoutController({ programUUID, programData, goToIndex, saveProgramWorkoutData }) {
    const workoutLibraryRef = createRef();
    const dayScrollViewRef = createRef();
    const customizeWorkoutRBSheet = createRef()

    const [mediaCaptureType, setMediaCaptureType] = useState("")

    const [addCueModalIsVisible, setAddCueModalVisible] = useState(false);
    const [addDescriptionModalIsVisible, setAddDescriptionModalVisible] = useState(false)
    const [workoutSchemeModalIsVisible, setWorkoutSchemeModalVisible] = useState(false);
    
    const [cameraIsVisible, setCameraIsVisible] = useState(false);
    const [currPressedPopulatedWorkout, setCurrPressedPopulatedWorkout] = useState(getLupaProgramInformationStructure())

    const [mondayCarouselIndex, setMondayCarouselIndex] = useState(0)
    const [tuesdayCarouselIndex, setTuesdayCarouselIndex] = useState(0)
    const [wednesdayCarouselIndex, setWednesdayCarouselIndex] = useState(0)
    const [thursdayCarouselIndex, setThursdayCarouselIndex] = useState(0)
    const [fridayCarouselIndex, setFridayCarouselIndex] = useState(0)
    const [saturdayCarouselIndex, setSaturdayCarouselIndex] = useState(0)
    const [sundayCarouselIndex, setSundayCarouselIndex] = useState(0)

    const [searchValue, setSearchValue] = useState("");
    const [bottomViewIndex, setBottomViewIndex] = useState(0);
    const [workoutDays, setWorkoutDays] = useState({
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: []
    });


    const [numWorkoutsAdded, setNumWorkoutsAdded] = useState(0)
    const [currDayIndex, setCurrDayIndex] = useState(0)
    const [ customizedWorkoutsButtonIsDisabled,  setCustomizedWorkoutsButtonIsDisabled] = useState(false)

    const LUPA_WORKOUTS = useSelector(state => {
        return state.Application_Workouts.applicationWorkouts;
    })

    const getCurrentDay = () => {
        const currIndex = currDayIndex;
        return programData.program_workout_days[currIndex]
    }

    const captureWorkout = (workoutObject) => {
        if (typeof(workoutObject) == 'undefined') {
            return;
        }

        const workoutDay =  getCurrentDay()

        //We assign the workout a new UUID so the workouts are not the same
        const updatedWorkout = {
            workout_name: workoutObject.workout_name,
            workout_description: workoutObject.workout_description,
            workout_uid: fromString(Math.random().toString()),
            workout_day: workoutDay, //add the section so it is easy to delete
            ...workoutObject
        }
        

        let updatedWorkoutData = [], newWorkoutData = {}
        switch (workoutDay)
        {
            case 'Monday':
                updatedWorkoutData = workoutDays.Monday
                updatedWorkoutData.push(updatedWorkout)

                newWorkoutData = {
                    Monday: updatedWorkoutData,
                    ...workoutDays,
                }

                setWorkoutDays(newWorkoutData)
                break;
            case 'Tuesday':
                updatedWorkoutData = workoutDays.Tuesday
                updatedWorkoutData.push(updatedWorkout)

                newWorkoutData = {
                    Tuesday: updatedWorkoutData,
                    ...workoutDays,
                }

                setWorkoutDays(newWorkoutData);
                break;
            case 'Wednesday':
                updatedWorkoutData = workoutDays.Wednesday
                updatedWorkoutData.push(updatedWorkout)

                newWorkoutData = {
                    Wednesday: updatedWorkoutData,
                    workoutDays,
                }

                setWorkoutDays(newWorkoutData);
                break;
            case 'Thursday':
                updatedWorkoutData = workoutDays.Thursday
                updatedWorkoutData.push(updatedWorkout)

                newWorkoutData = {
                    Thursday: updatedWorkoutData,
                    ...workoutDays,
                }

                setWorkoutDays(newWorkoutData)
                break;
            case 'Friday':
                updatedWorkoutData = workoutDays.Friday
                updatedWorkoutData.push(updatedWorkout)

                newWorkoutData = {
                    Friday: updatedWorkoutData,
                   ...workoutDays,
                }

                setWorkoutDays(newWorkoutData)
                break;
            case 'Saturday':
                updatedWorkoutData = workoutDays.Saturday
                updatedWorkoutData.push(updatedWorkout)

                newWorkoutData = {
                    Saturday: updatedWorkoutData,
                    ...workoutDays,
                }

                setWorkoutDays(newWorkoutData)
                break;
            case 'Sunday':
                updatedWorkoutData = workoutDays.Sunday
                updatedWorkoutData.push(updatedWorkout)

                newWorkoutData = {
                    Sunday: updatedWorkoutData,
                    ...workoutDays,
                }

                setWorkoutDays(newWorkoutData)
                break;
            default:
                updatedWorkoutData = workoutDays.Monday

                updatedWorkoutData.push(updatedWorkout)

                newWorkoutData = {
                    Monday: updatedWorkoutData,
                    ...workoutDays,
                }

                setWorkoutDays(newWorkoutData)
        }

        const num = numWorkoutsAdded + 1;
        setNumWorkoutsAdded(num)
    }

    const handleOnScroll = (event) => {
        const currDay = getCurrentDay()

        switch(currDay) {
            case 'Monday':
                setMondayCarouselIndex(event.nativeEvent.contentOffset.x)
                break;
                case 'Tuesday':
                    setTuesdayCarouselIndex(event.nativeEvent.contentOffset.x)
                    break;
                    case 'Wednesday':
                setWednesdayCarouselIndex(event.nativeEvent.contentOffset.x)
                break;
                case 'Thursday':
                setThursdayCarouselIndex(event.nativeEvent.contentOffset.x)
                break;
                case 'Friday':
                setFridayCarouselIndex(event.nativeEvent.contentOffset.x)
                break;
                case 'Saturday':
                setSaturdayCarouselIndex(event.nativeEvent.contentOffset.x)
                break;
                case 'Sunday':
                setSundayCarouselIndex(event.nativeEvent.contentOffset.x)
                break;
            default:
        }

    }

    const getCurrentDayContent = () => {
        const currDay =  getCurrentDay()
        try {
            switch (currDay)
            {
                case 'Monday':
                    if (workoutDays.Monday.length === 0) {
                        return (
                            <View style={styles.alignAndJustifyCenter}>
                            <View style={[styles.alignAndJustifyCenter, {width: 180, height: 180, borderRadius: 180, borderWidth: 1.5, borderColor: 'rgb(142, 142, 147)',}]}>
                            <ThinFeatherIcon color="rgb(142, 142, 147)" thin={true} name="plus" size={80} />
                            </View>
                            <Caption style={{padding: 20, color: '#1089ff'}} onPress={handleOpenLibraryOnPress}>
                                No workouts have been added for {currDay}
                            </Caption>
                            </View>
                        )
                    }

                    return (
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center',}}>
                            <ScrollView 
                                onScroll={handleOnScroll} 
                                showsHorizontalScrollIndicator={false} 
                                pagingEnabled={true} 
                                decelerationRate={0} 
                                snapToAlignment='center' 
                                snapToInterval={Dimensions.get('window').width} 
                                horizontal={true} 
                                centerContent 
                                contentContainerStyle={{alignItems: 'center', justifyContent: 'center', alignSelf: 'center'}}>
                                {
                                    workoutDays.Monday.map(workout => {
                                        return (
                                            <WorkoutDisplay workout={workout} openAddCueModal={handleAddCue} />
                                        )
                                    })
                                }
                            </ScrollView>
                        <Pagination dotsLength={workoutDays.Monday.length + 1} activeDotIndex={mondayCarouselIndex} dotColor="#1089ff" inactiveDotColor='#23374d'/>
                        </View>
                    )
                case 'Tuesday':
                    if (workoutDays.Tuesday.length === 0) {
                        return (
                            <View style={styles.alignAndJustifyCenter}>
                            <View style={[styles.alignAndJustifyCenter, {width: 180, height: 180, borderRadius: 180, borderWidth: 1.5, borderColor: 'rgb(142, 142, 147)',}]}>
                            <ThinFeatherIcon color="rgb(142, 142, 147)" thin={true} name="plus" size={80} />
                            </View>
                            <Caption style={{padding: 20, color: '#1089ff'}} onPress={handleOpenLibraryOnPress}>
                                No workouts have been added for {currDay}
                            </Caption>
                            </View>
                        )
                    }

                    return (

                        <View>
                        <ScrollView 
                            onScroll={handleOnScroll} 
                            showsHorizontalScrollIndicator={false} 
                            pagingEnabled={true} 
                            decelerationRate={0} 
                            snapToAlignment='center' 
                            snapToInterval={Dimensions.get('window').width} 
                            horizontal={true} 
                            centerContent 
                            contentContainerStyle={{alignItems: 'center', justifyContent: 'center', alignSelf: 'center'}}>
                            {
                                workoutDays.Tuesday.map(workout => {
                                    return (
                                        <WorkoutDisplay workout={workout} openAddCueModal={handleAddCue} />
                                    )
                                })
                            }
                        </ScrollView>
                    <Pagination dotsLength={workoutDays.Tuesday.length} activeDotIndex={tuesdayCarouselIndex}  dotColor="#1089ff" inactiveDotColor='#23374d'/>
                    </View>
                    )
                case 'Wednesday':
                    if (workoutDays.Wednesday.length === 0) {
                        return (
                            <View style={styles.alignAndJustifyCenter}>
                            <View style={[styles.alignAndJustifyCenter, {width: 180, height: 180, borderRadius: 180, borderWidth: 1.5, borderColor: 'rgb(142, 142, 147)',}]}>
                            <ThinFeatherIcon color="rgb(142, 142, 147)" thin={true} name="plus" size={80} />
                            </View>
                            <Caption style={{padding: 20, color: '#1089ff'}} onPress={handleOpenLibraryOnPress}>
                                No workouts have been added for {currDay}
                            </Caption>
                            </View>
                        )
                    }

                    return (

                        <View>
                            <ScrollView 
                                onScroll={handleOnScroll} 
                                showsHorizontalScrollIndicator={false} 
                                pagingEnabled={true} 
                                decelerationRate={0} 
                                snapToAlignment='center' 
                                snapToInterval={Dimensions.get('window').width} 
                                horizontal={true} 
                                centerContent 
                                contentContainerStyle={{alignItems: 'center', justifyContent: 'center', alignSelf: 'center'}}>
                                {
                                    workoutDays.Wednesday.map(workout => {
                                        return (
                                            <WorkoutDisplay workout={workout} openAddCueModal={handleAddCue} />
                                        )
                                    })
                                }
                            </ScrollView>
                        <Pagination dotsLength={workoutDays.Wednesday.length} activeDotIndex={wednesdayCarouselIndex}   dotColor="#1089ff" inactiveDotColor='#23374d'/>
                        </View>
                        )
                case 'Thursday':
                    if (workoutDays.Thursday.length === 0) {
                        return (
                            <View style={styles.alignAndJustifyCenter}>
                            <View style={[styles.alignAndJustifyCenter, {width: 180, height: 180, borderRadius: 180, borderWidth: 1.5, borderColor: 'rgb(142, 142, 147)',}]}>
                            <ThinFeatherIcon color="rgb(142, 142, 147)" thin={true} name="plus" size={80} />
                            </View>
                            <Caption style={{padding: 20, color: '#1089ff'}} onPress={handleOpenLibraryOnPress}>
                                No workouts have been added for {currDay}
                            </Caption>
                            </View>
                        )
                    }

                    return (

                        <View>
                            <ScrollView 
                                onScroll={handleOnScroll} 
                                showsHorizontalScrollIndicator={false} 
                                pagingEnabled={true} 
                                decelerationRate={0} 
                                snapToAlignment='center' 
                                snapToInterval={Dimensions.get('window').width} 
                                horizontal={true} 
                                centerContent 
                                contentContainerStyle={{alignItems: 'center', justifyContent: 'center', alignSelf: 'center'}}>
                                {
                                    workoutDays.Thursday.map(workout => {
                                        return (
                                            <WorkoutDisplay workout={workout} openAddCueModal={handleAddCue} />
                                        )
                                    })
                                }
                            </ScrollView>
                        <Pagination dotsLength={workoutDays.Thursday.length} activeDotIndex={thursdayCarouselIndex}   dotColor="#1089ff" inactiveDotColor='#23374d'/>
                        </View>
                        )
                case 'Friday':
                    if (workoutDays.Friday.length === 0) {
                        return (
                            <View style={styles.alignAndJustifyCenter}>
                            <View style={[styles.alignAndJustifyCenter, {width: 180, height: 180, borderRadius: 180, borderWidth: 1.5, borderColor: 'rgb(142, 142, 147)',}]}>
                            <ThinFeatherIcon color="rgb(142, 142, 147)" thin={true} name="plus" size={80} />
                            </View>
                            <Caption style={{padding: 20, color: '#1089ff'}} onPress={handleOpenLibraryOnPress}>
                                No workouts have been added for {currDay}
                            </Caption>
                            </View>
                        )
                    }
                    return (

                        <View>
                            <ScrollView 
                                onScroll={handleOnScroll} 
                                showsHorizontalScrollIndicator={false} 
                                pagingEnabled={true} 
                                decelerationRate={0} 
                                snapToAlignment='center' 
                                snapToInterval={Dimensions.get('window').width} 
                                horizontal={true} 
                                centerContent 
                                contentContainerStyle={{alignItems: 'center', justifyContent: 'center', alignSelf: 'center'}}>
                                {
                                    workoutDays.Friday.map(workout => {
                                        return (
                                            <WorkoutDisplay workout={workout} openAddCueModal={handleAddCue} />
                                        )
                                    })
                                }
                            </ScrollView>
                        <Pagination dotsLength={workoutDays.Friday.length} activeDotIndex={fridayCarouselIndex}   dotColor="#1089ff" inactiveDotColor='#23374d'/>
                        </View>
                        )
                case 'Saturday':
                    if (workoutDays.Saturday.length === 0) {
                        return (
                            <View style={styles.alignAndJustifyCenter}>
                            <View style={[styles.alignAndJustifyCenter, {width: 180, height: 180, borderRadius: 180, borderWidth: 1.5, borderColor: 'rgb(142, 142, 147)',}]}>
                            <ThinFeatherIcon color="rgb(142, 142, 147)" thin={true} name="plus" size={80} />
                            </View>
                            <Caption style={{padding: 20, color: '#1089ff'}} onPress={handleOpenLibraryOnPress}>
                                No workouts have been added for {currDay}
                            </Caption>
                            </View>
                        )
                    }

                    return (

                        <View>
                            <ScrollView 
                                onScroll={handleOnScroll} 
                                showsHorizontalScrollIndicator={false} 
                                pagingEnabled={true} 
                                decelerationRate={0} 
                                snapToAlignment='center' 
                                snapToInterval={Dimensions.get('window').width} 
                                horizontal={true} 
                                centerContent 
                                contentContainerStyle={{alignItems: 'center', justifyContent: 'center', alignSelf: 'center'}}>
                                {
                                    workoutDays.Saturday.map(workout => {
                                        return (
                                            <WorkoutDisplay workout={workout} openAddCueModal={handleAddCue} />
                                        )
                                    })
                                }
                            </ScrollView>
                        <Pagination dotsLength={workoutDays.Saturday.length} activeDotIndex={saturdayCarouselIndex}   dotColor="#1089ff" inactiveDotColor='#23374d'/>
                        </View>
                        )
                case 'Sunday':
                    if (workoutDays.Sunday.length === 0) {
                        return (
                            <View style={styles.alignAndJustifyCenter}>
                            <View style={[styles.alignAndJustifyCenter, {width: 180, height: 180, borderRadius: 180, borderWidth: 1.5, borderColor: 'rgb(142, 142, 147)',}]}>
                            <ThinFeatherIcon color="rgb(142, 142, 147)" thin={true} name="plus" size={80} />
                            </View>
                            <Caption style={{padding: 20, color: '#1089ff'}} onPress={handleOpenLibraryOnPress}>
                                No workouts have been added for {currDay}
                            </Caption>
                            </View>
                        )
                    }

                    return (

                        <View>
                            <ScrollView 
                                onScroll={handleOnScroll} 
                                showsHorizontalScrollIndicator={false} 
                                pagingEnabled={true} 
                                decelerationRate={0} 
                                snapToAlignment='center' 
                                snapToInterval={Dimensions.get('window').width} 
                                horizontal={true} 
                                centerContent 
                                contentContainerStyle={{alignItems: 'center', justifyContent: 'center', alignSelf: 'center'}}>
                                {
                                    workoutDays.Sunday.map(workout => {
                                        return (
                                            <WorkoutDisplay workout={workout} openAddCueModal={handleAddCue} />
                                        )
                                    })
                                }
                            </ScrollView>
                        <Pagination dotsLength={workoutDays.Sunday.length} activeDotIndex={sundayCarouselIndex}   dotColor="#1089ff" inactiveDotColor='#23374d'/>
                        </View>
                        )
                default:
                        return (
                            <View style={styles.alignAndJustifyCenter}>
                            <View style={[styles.alignAndJustifyCenter, {width: 120, height: 120, borderRadius: 120, borderWidth: 1.5, borderColor: 'rgb(142, 142, 147)',}]}>
                            <ThinFeatherIcon color="rgb(142, 142, 147)" thin={true} name="plus" size={80} />
                            </View>
                            <Caption style={{padding: 20, color: '#1089ff'}}>
                                No workouts have been added.  Choose a day from the drop down menu and add workouts using the workout library.
                            </Caption>
                            </View>
                        )
                    
            }
        } catch(error) {
            return;
        }
    }

    const captureSetAndRepValues = async (sets, reps) => {
        if (typeof(currPressedPopulatedWorkout) == 'undefined' || sets === 0 || reps === 0)
        {
            return;
        }

        let newWorkoutData = {}
        const currDay = getCurrentDay()
        const workout = currPressedPopulatedWorkout
        switch(currDay)
        {
            case 'Monday':
                for (let i = 0; i < workoutDays.Monday.length; i++)
                {
                    if (workout.workout_uid == currPressedPopulatedWorkout.workout_uid)
                    {                       

                        workoutDays.Monday[i].workout_sets = sets
                        workoutDays.Monday[i].workout_reps = reps

                        newWorkoutData = {
                            Monday: workoutDays.Monday,
                            ...workoutDays
                        }

                        break;
                    }
                }
            break;
            case "Tuesday":
                for (let i = 0; i < workoutDays.Tuesday.length; i++)
                {
                    if (workout.workout_uid == currPressedPopulatedWorkout.workout_uid)
                    {                       

                        workoutDays.Tuesday[i].workout_sets = sets
                        workoutDays.Tuesday[i].workout_reps = reps
                        
                        newWorkoutData = {
                            Tuesday: workoutDays.Tuesday,
                            ...workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Wednesday":
                for (let i = 0; i < workoutDays.Wednesday.length; i++)
                {
                    if (workout.workout_uid == currPressedPopulatedWorkout.workout_uid)
                    {                       

                        workoutDays.Wednesday[i].workout_sets = sets
                        workoutDays.Wednesday[i].workout_reps = reps
                        
                        newWorkoutData = {
                            Wednesday: workoutDays.Wednesday,
                            ...workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Thursday":
                for (let i = 0; i < workoutDays.Thursday.length; i++)
                {
                    if (workout.workout_uid == currPressedPopulatedWorkout.workout_uid)
                    {                       

                        workoutDays.Thursday[i].workout_sets = sets
                        workoutDays.Thursday[i].workout_reps = reps
                        
                        newWorkoutData = {
                            Thursday: workoutDays.Thursday,
                            ...workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Friday":
                for (let i = 0; i < workoutDays.Friday.length; i++)
                {
                    if (workout.workout_uid == currPressedPopulatedWorkout.workout_uid)
                    {                       

                        workoutDays.Friday[i].workout_sets = sets
                        workoutDays.Friday[i].workout_reps = reps
                        
                        newWorkoutData = {
                            Friday: workoutDays.Friday,
                            ...workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Saturday":
                for (let i = 0; i < workoutDays.Saturday.length; i++)
                {
                    if (workout.workout_uid == currPressedPopulatedWorkout.workout_uid)
                    {                       

                        workoutDays.Saturday[i].workout_sets = sets
                        workoutDays.Saturday[i].workout_reps = reps
                        
                        newWorkoutData = {
                            Saturday: workoutDays.Saturday,
                            ...workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Sunday":
                for (let i = 0; i < workoutDays.Sunday.length; i++)
                {
                    if (workout.workout_uid == currPressedPopulatedWorkout.workout_uid)
                    {                       

                        workoutDays.Sunday[i].workout_sets = sets
                        workoutDays.Sunday[i].workout_reps = reps
                        
                        newWorkoutData = {
                            Sunday: workoutDays.Sunday,
                            ...workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            default:
                return;
        }

        setWorkoutDays(newWorkoutData)
        setWorkoutSchemeModalVisible(false)
    }

    const handleCaptureCue = async (cue) => {
        if (typeof(currPressedPopulatedWorkout) == 'undefined' || cue == '')
        {
            return;
        }

        let newWorkoutData = {}, updatedWorkoutData = {}
        const currDay = getCurrentDay()
        const workout = currPressedPopulatedWorkout
        switch(currDay)
        {
            case 'Monday':
                for (let i = 0; i < workoutDays.Monday.length; i++)
                {
                    if (workout.workout_uid == currPressedPopulatedWorkout.workout_uid)
                    {                       

                        workoutDays.Monday[i].workout_cue = cue

                        newWorkoutData = {
                            Monday: workoutDays.Monday,
                            ...workoutDays
                        }

                        break;
                    }
                }
            break;
            case "Tuesday":
                for (let i = 0; i < workoutDays.Tuesday.length; i++)
                {
                    if (workout.workout_uid == currPressedPopulatedWorkout.workout_uid)
                    {                       

                        workoutDays.Tuesday[i].workout_cue = cue
                        
                        newWorkoutData = {
                            Tuesday: workoutDays.Tuesday,
                            ...workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Wednesday":
                for (let i = 0; i < workoutDays.Wednesday.length; i++)
                {
                    if (workout.workout_uid == currPressedPopulatedWorkout.workout_uid)
                    {                       

                        workoutDays.Wednesday[i].workout_media.workout_cue = cue
                        
                        newWorkoutData = {
                            Wednesday: workoutDays.Wednesday,
                            ...workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Thursday":
                for (let i = 0; i < workoutDays.Thursday.length; i++)
                {
                    if (workout.workout_uid == currPressedPopulatedWorkout.workout_uid)
                    {                       

                        workoutDays.Thursday[i].workout_cue = cue
                        
                        newWorkoutData = {
                            Thursday: workoutDays.Thursday,
                            ...workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Friday":
                for (let i = 0; i < workoutDays.Friday.length; i++)
                {
                    if (workout.workout_uid == currPressedPopulatedWorkout.workout_uid)
                    {                       

                        workoutDays.Friday[i].workout_cue = cue
                        
                        newWorkoutData = {
                            Friday: workoutDays.Friday,
                            ...workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Saturday":
                for (let i = 0; i < workoutDays.Saturday.length; i++)
                {
                    if (workout.workout_uid == currPressedPopulatedWorkout.workout_uid)
                    {                       

                        workoutDays.Saturday[i].workout_cue = cue
                        
                        newWorkoutData = {
                            Saturday: workoutDays.Saturday,
                            ...workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Sunday":
                for (let i = 0; i < workoutDays.Sunday.length; i++)
                {
                    if (workout.workout_uid == currPressedPopulatedWorkout.workout_uid)
                    {                       

                        workoutDays.Sunday[i].workout_cue = cue
                        
                        newWorkoutData = {
                            Sunday: workoutDays.Sunday,
                            ...workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            default:
                for (let i = 0; i < workoutDays.Monday.length; i++)
                {
                    if (workout.workout_uid == currPressedPopulatedWorkout.workout_uid)
                    {                       

                        workoutDays.Monday[i].workout_cue = cue

                        newWorkoutData = {
                            Monday: workoutDays.Monday,
                            ...workoutDays
                        }

                        break;
                    }
                }
                break;
        }

        await setWorkoutDays(newWorkoutData) 
        setCueModalVisible(false)
    }

    const handleCaptureNewMediaURI = async (uri, mediaType) => {
        if (typeof(currPressedPopulatedWorkout) == undefined)
        {
            return;
        }

        let newWorkoutData = {}, updatedWorkoutData = {}
        const currDay = getCurrentDay()
        const workout = currPressedPopulatedWorkout
        switch(currDay)
        {
            case 'Monday':
                for (let i = 0; i < workoutDays.Monday.length; i++)
                {
                    if (workout.workout_uid == currPressedPopulatedWorkout.workout_uid)
                    {                       

                        workoutDays.Monday[i].workout_media.uri = uri;
                        workoutDays.Monday[i].workout_media.media_type = mediaType;

                        newWorkoutData = {
                            Monday: workoutDays.Monday,
                            ...workoutDays
                        }

                        break;
                    }
                }
            break;
            case "Tuesday":
                for (let i = 0; i < workoutDays.Tuesday.length; i++)
                {
                    if (workout.workout_uid == currPressedPopulatedWorkout.workout_uid)
                    {                       

                        workoutDays.Tuesday[i].workout_media.uri = uri;
                        workoutDays.Tuesday[i].workout_media.media_type = mediaType;
                        
                        newWorkoutData = {
                            Tuesday: workoutDays.Tuesday,
                            ...workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Wednesday":
                for (let i = 0; i < workoutDays.Wednesday.length; i++)
                {
                    if (workout.workout_uid == currPressedPopulatedWorkout.workout_uid)
                    {                       

                        workoutDays.Wednesday[i].workout_media.uri = uri;
                        workoutDays.Wednesday[i].workout_media.media_type = mediaType;
                        
                        newWorkoutData = {
                            Wednesday: workoutDays.Wednesday,
                            ...workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Thursday":
                for (let i = 0; i < workoutDays.Thursday.length; i++)
                {
                    if (workout.workout_uid == currPressedPopulatedWorkout.workout_uid)
                    {                       

                        workoutDays.Thursday[i].workout_media.uri = uri;
                        workoutDays.Thursday[i].workout_media.media_type = mediaType;
                        
                        newWorkoutData = {
                            Thursday: workoutDays.Thursday,
                            ...workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Friday":
                for (let i = 0; i < workoutDays.Friday.length; i++)
                {
                    if (workout.workout_uid == currPressedPopulatedWorkout.workout_uid)
                    {                       

                        workoutDays.Friday[i].workout_media.uri = uri;
                        workoutDays.Friday[i].workout_media.media_type = mediaType;
                        
                        newWorkoutData = {
                            Friday: workoutDays.Friday,
                            ...workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Saturday":
                for (let i = 0; i < workoutDays.Saturday.length; i++)
                {
                    if (workout.workout_uid == currPressedPopulatedWorkout.workout_uid)
                    {                       

                        workoutDays.Saturday[i].workout_media.uri = uri;
                        workoutDays.Saturday[i].workout_media.media_type = mediaType;
                        
                        newWorkoutData = {
                            Saturday: workoutDays.Saturday,
                            ...workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Sunday":
                for (let i = 0; i < workoutDays.Sunday.length; i++)
                {
                    if (workout.workout_uid == currPressedPopulatedWorkout.workout_uid)
                    {                       

                        workoutDays.Sunday[i].workout_media.uri = uri;
                        workoutDays.Sunday[i].workout_media.media_type = mediaType;
                        
                        newWorkoutData = {
                            Sunday: workoutDays.Sunday,
                            ...workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            default:
                return;
        }

        setWorkoutDays(newWorkoutData);
    }

    const handleCaptureDescription = async (description) => {
        if (typeof(currPressedPopulatedWorkout) == 'undefined' || description == '')
        {
            return;
        }

        let newWorkoutData = {}, updatedWorkoutData = {}
        const currDay = getCurrentDay()
        const workout = currPressedPopulatedWorkout
        switch(currDay)
        {
            case 'Monday':
                for (let i = 0; i < workoutDays.Monday.length; i++)
                {
                    if (workout.workout_uid == currPressedPopulatedWorkout.workout_uid)
                    {                       

                        workoutDays.Monday[i].workout_description = description

                        newWorkoutData = {
                            Monday: workoutDays.Monday,
                            ...workoutDays
                        }

                        break;
                    }
                }
            break;
            case "Tuesday":
                for (let i = 0; i < workoutDays.Tuesday.length; i++)
                {
                    if (workout.workout_uid == currPressedPopulatedWorkout.workout_uid)
                    {                       

                        workoutDays.Tuesday[i].workout_description = description
                        
                        newWorkoutData = {
                            Tuesday: workoutDays.Tuesday,
                            ...workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Wednesday":
                for (let i = 0; i < workoutDays.Wednesday.length; i++)
                {
                    if (workout.workout_uid == currPressedPopulatedWorkout.workout_uid)
                    {                       

                        workoutDays.Wednesday[i].workout_media.workout_description = description
                        
                        newWorkoutData = {
                            Wednesday: workoutDays.Wednesday,
                            ...workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Thursday":
                for (let i = 0; i < workoutDays.Thursday.length; i++)
                {
                    if (workout.workout_uid == currPressedPopulatedWorkout.workout_uid)
                    {                       

                        workoutDays.Thursday[i].workout_description = description
                        
                        newWorkoutData = {
                            Thursday: workoutDays.Thursday,
                            ...workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Friday":
                for (let i = 0; i < workoutDays.Friday.length; i++)
                {
                    if (workout.workout_uid == currPressedPopulatedWorkout.workout_uid)
                    {                       

                       workoutDays.Friday[i].workout_description = description
                        
                        newWorkoutData = {
                            Friday: workoutDays.Friday,
                            ...workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Saturday":
                for (let i = 0; i < workoutDays.Saturday.length; i++)
                {
                    if (workout.workout_uid == currPressedPopulatedWorkout.workout_uid)
                    {                       

                        workoutDays.Saturday[i].workout_description = description
                        
                        newWorkoutData = {
                            Saturday: workoutDays.Saturday,
                            ...workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Sunday":
                for (let i = 0; i < workoutDays.Sunday.length; i++)
                {
                    if (workout.workout_uid == currPressedPopulatedWorkout.workout_uid)
                    {                       

                        workoutDays.Sunday[i].workout_description = description
                        
                        newWorkoutData = {
                            Sunday: workoutDays.Sunday,
                            ...workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            default:
                return;
        }

        setWorkoutDays(newWorkoutData)
        setAddDescriptionModalVisible(false)
    }

    const handleOpenLibraryOnPress = () => {
        workoutLibraryRef.current.open();
    }

    const handleEditWorkoutOnPress = () => {
        customizeWorkoutRBSheet.current.open();
    }

    const handleCloseEditWorkout = () => {
        customizeWorkoutRBSheet.current.close()
    }

    const handleTakeVideo = async () => {
        await setMediaCaptureType('VIDEO')
        await handleCloseEditWorkout()
        setCameraIsVisible(true)
    }

    const handleTakePicture = () => {
        setMediaCaptureType('IMAGE')
        handleCloseEditWorkout()
        setCameraIsVisible(true)
    }

    const addWorkoutMedia = () => {
       handleCloseEditWorkout()

        if (typeof(currPressedPopulatedWorkout) == 'undefined')
        {

            return;
        }


        // Open Image Library
        ImagePicker.launchImageLibrary({}, async (response) => {
            if (response.didCancel) {
                LOG_ERROR('BuildWorkoutController.js', 'User cancelled image picker in addWorkoutMedia()', 'true');
              } else if (response.error) {
                  LOG_ERROR('BuildWorkoutController.js', 'Caught exception in image picker in addWorkoutMedia()', response.error);
              } else {
                const source = await response.uri
                const workoutMediaURI = await LUPA_CONTROLLER_INSTANCE.saveProgramWorkoutGraphic(currPressedPopulatedWorkout, programData.program_structure_uuid, 'IMAGE', source)
                handleCaptureNewMediaURI(workoutMediaURI, 'IMAGE');
            }
        });
    }

    const handleAddDescription = async () => {
        await handleCloseEditWorkout()
        setAddDescriptionModalVisible(true)
    }

    const handleAddCue  = () => {
        handleCloseEditWorkout()
        setAddCueModalVisible(true)
    }

    const handleEditWorkoutScheme = () => {
        handleCloseEditWorkout()
        setWorkoutSchemeModalVisible(true)
    }

    const renderTopView = () => {
       return (
        getCurrentDayContent()
       )
    }


    const renderBottomView = () => {
        let items = []
        programData.program_workout_days.map((day, index, arr) => {
            let item = {
                label: day,
                value:day,
                index: index
            }
            items.push(item)
        })

        switch(bottomViewIndex) {
            case 0:
                return (
                    <View style={{flex: 1.8}}>
                       
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <View style={{flex: 2}}>
                        <Text style={{padding: 10, fontSize: 15, fontWeight: '400', fontFamily: 'Avenir', alignSelf: 'center'}}>
                            Choose a day of the week and add workouts from the workout library.
                        </Text>
                        <DropDownPicker
    items={items}
    defaultValue={getCurrentDay()}
    containerStyle={{height: 40, width: Dimensions.get('window').width}}
    style={{backgroundColor: '#fafafa', marginHorizontal: 20}}
    itemStyle={{
        justifyContent: 'flex-start'
    }}
    dropDownStyle={{backgroundColor: '#fafafa'}}
    onChangeItem={item => setCurrDayIndex(item.index)}
/>

                        <Caption>
                            
                        </Caption>
                      
                    </View>

                       <FAB small={false} label="Open Library"  onPress={handleOpenLibraryOnPress} style={{backgroundColor: '#1089ff', position: 'absolute', bottom: 0, right: 0, margin: 12}} color="white" icon="plus" />
                 </View>
                 </View>
                )
            case 1:
                return (
                    <View style={{flex: 1.8}}>
                        <DropDownPicker
    items={items}
    defaultValue={getCurrentDay()}
    containerStyle={{backgroundColor: '#FFFFFF', height: 40, width: Dimensions.get('window').width}}
    style={{backgroundColor: '#fafafa'}}
    itemStyle={{
        justifyContent: 'flex-start'
    }}
    dropDownStyle={{backgroundColor: '#FFFFFF'}}
    onChangeItem={item => setCurrDayIndex(item.index)}
/>
<Divider style={{height: 10}} />
                        <ListItem onPress={handleEditWorkoutOnPress} title="Edit Workout" topDivider={false} subtitle='Swipe to a workout and modify the scheme, cues, description, and media.' bottomDivider titleStyle={{fontFamily: 'Avenir-Medium', fontSize: 15}} subtitleStyle={{fontFamily: 'Avenir-Light', fontSize: 13}} rightIcon={() => <FeatherIcon name="arrow-right" size={15} />}/>
                        <ListItem onPress={saveProgramWorkoutData} title="Finish Editing" bottomDivider titleStyle={{fontFamily: 'Avenir-Medium', fontSize: 15}} subtitleStyle={{fontFamily: 'Avenir-Light', fontSize: 15}} rightIcon={() => <FeatherIcon name="arrow-right" size={15} />}/>
                      
                    </View>
                )
        }
    }

    const renderBottomSheet = () => {
        return (
            <RBSheet 
                ref={workoutLibraryRef} 
                height={Dimensions.get('window').height / 1.2} 
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
            <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
                <View style={{padding: 10}}>
                <SearchBar placeholder="Search specific workouts"
                        onChangeText={text => console.log(text)} 
                        platform="ios"
                        searchIcon={<FeatherIcon name="search" size={15} color="#1089ff" />}
                        containerStyle={{backgroundColor: "transparent", width: '100%'}}
                        inputContainerStyle={{backgroundColor: 'rgb(242, 242, 247))',}}
                        inputStyle={{fontSize: 15, color: 'black', fontWeight: '800', fontFamily: 'avenir-roman'}}
                        placeholderTextColor="#212121"
        value={searchValue}/>
                </View>
                <Divider />
                <View>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        {
                            CATEGORY_TAGS.map((tag) => {
                                return (
                                    <Chip key={tag} mode="flat" style={{margin: 10, backgroundColor: '#EEEEEE'}}>
                                        {tag}
                                    </Chip>
                                )
                            })
                        }
                    </ScrollView>
                </View>
                <View style={{flex: 1}}>
                        <ScrollView>
                    { 
                        LUPA_WORKOUTS.map((workout, index, arr)=> {
                            if (typeof(workout) == 'undefined' || workout.workout_name == "" || workout.workout_name == undefined)
                            {
                                return;
                            }

                            workout.workout_uid = workout.workout_name
                            return (
                            <SingleWorkout 
                                key={workout.workout_uid}
                                workout={workout}
                                captureWorkout={(workoutData) => captureWorkout(workoutData)}
                                />
                            )
                        })
                    }
                    </ScrollView>
                </View>
            </View>
            <SafeAreaView />
        </RBSheet>
        )
    }

    const renderCustomizeWorkoutBottomSheet = () => {
        return (
            <RBSheet
          ref={customizeWorkoutRBSheet}
          height={Dimensions.get('window').height / 1.2}
          openDuration={250}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center",
              borderTopRightRadius: 25,
                borderTopLeftRadius: 25,
            },
            draggableIcon: {
                backgroundColor: 'grey'
            }
          }}
       >
           <View style={{flex: 1}}>
               <View style={{ padding: 10, justifyContent: 'space-evenly', flexDirection: 'row', alignItems: 'center', width: '100%'}}>
               <Left>
               <Caption>
                    Cancel
                </Caption>
               </Left>

                <Body>
                <Text style={{alignSelf: 'center', fontWeight: 'bold', fontFamily: 'avenir',  fontSize: 12}}>
                   Workout Options
               </Text>
                </Body>

                <Right />
               </View>
               <Divider />
               
               <View style={{flex: 1, justifyContent: 'space-evenly'}}>
           <TouchableOpacity onPress={handleTakeVideo}>
            <View style={{width: Dimensions.get('window').width, height: 'auto', padding: 5, width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',}}>
            <ThinFeatherIcon
name="video"
size={18}
color="#000000"
thin={false}
style={styles.exerciseOptionIcon}
/>
<View style={{paddingVertical: 1.5}}>
<Text style={styles.exerciseOptionHeaderText}>
                    Record a video
                </Text>
</View>
            </View>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity onPress={handleTakePicture}>
            <View style={{width: Dimensions.get('window').width, height: 'auto', padding: 5, width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',}}>
            <ThinFeatherIcon
name="camera"
size={18}
color="#000000"
thin={false}
style={styles.exerciseOptionIcon}
/>
<View style={{paddingVertical: 1.5}}>
<Text style={styles.exerciseOptionHeaderText}>
                    Take a picture
                </Text>
</View>
            </View>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity onPress={addWorkoutMedia}>
            <View style={{width: Dimensions.get('window').width, height: 'auto', padding: 5, width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',}}>
            <ThinFeatherIcon
name="film"
size={18}
color="#000000"
thin={false}
style={styles.exerciseOptionIcon}
/>
<View style={{paddingVertical: 1.5, width: '95%'}}>
<Text style={styles.exerciseOptionHeaderText}>
                Upload media
                </Text>
</View>
            </View>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity onPress={handleAddDescription}>
            <View style={{width: Dimensions.get('window').width, height: 'auto', padding: 5, width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',}}>
            <ThinFeatherIcon
name="edit"
size={18}
color="#000000"
thin={false}
style={styles.exerciseOptionIcon}
/>
<View style={{paddingVertical: 1.5}}>
<Text style={styles.exerciseOptionHeaderText}>
                    Add a description
                </Text>
</View>
            </View>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity onPress={handleAddCue}>
            <View style={{width: Dimensions.get('window').width, height: 'auto', padding: 5, width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',}}>
            <ThinFeatherIcon
name="edit"
size={18}
color="#000000"
thin={false}
style={styles.exerciseOptionIcon}
/>
<View style={{paddingVertical: 1.5}}>
<Text style={styles.exerciseOptionHeaderText}>
                    Add a cue
                </Text>
</View>
            </View>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity onPress={handleEditWorkoutScheme}>
            <View style={{width: Dimensions.get('window').width, height: 'auto', padding: 5, width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',}}>
            <ThinFeatherIcon
name="clipboard"
size={18}
color="#000000"
thin={false}
style={styles.exerciseOptionIcon}
/>
<View style={{paddingVertical: 1.5}}>
<Text style={styles.exerciseOptionHeaderText}>
                    Edit Set/Rep Scheme
                </Text>
</View>
            </View>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity>
            <View style={{width: Dimensions.get('window').width, height: 'auto', padding: 5, width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',}}>
            <ThinFeatherIcon
name="trash"
size={18}
color="#000000"
thin={false}
style={[styles.exerciseOptionIcon, {color: 'rgba(229,57,53 ,1)'}]}
/>
<View style={{paddingVertical: 1.5}}>
<Text style={[styles.exerciseOptionHeaderText, { color: 'rgba(229,57,53 ,1)' }]}>
                    Delete exercise
                </Text>
</View>
            </View>
            </TouchableOpacity>
        
               </View>
            
           </View>
           <SafeAreaView />
       </RBSheet>
        )
    }

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.appbar}>
                   <Appbar.Action icon={() => <ThinFeatherIcon thin={true} onPress={() => bottomViewIndex === 0 ? goToIndex(0) : setBottomViewIndex(0)} name="arrow-left" size={20} color="#1089ff" />} />
                   {bottomViewIndex === 0 ? 
                   <Button disabled={numWorkoutsAdded === 0 ? true : false} color={numWorkoutsAdded === 0 ? "grey" : "#1089ff"} uppercase={false} onPress={() => setBottomViewIndex(1)}>
                    Customize Workouts
                    <ThinFeatherIcon thin={true} name="arrow-right" size={12} />
                   </Button>
                   
                   :
                  
                   null
                  
                   }
             </Appbar.Header>
             <View style={styles.content}>
             <View style={styles.mainContent}>
                           {renderTopView()}
                          
                   </View>

                  
                    {renderBottomView()}
             </View>

             {renderBottomSheet()}
             {renderCustomizeWorkoutBottomSheet()}

            <AddCueModal isVisible={addCueModalIsVisible} closeModal={() => setAddCueModalVisible(false)} captureData={cue => handleCaptureCue(cue)}/>
            <AddDescriptionModal isVisible={addDescriptionModalIsVisible} closeModal={() => setAddDescriptionModalVisible(false)} captureData={description => handleCaptureDescription(description)} />
            <WorkoutSchemeModal closeModal={() => setWorkoutSchemeModalVisible(false)} isVisible={workoutSchemeModalIsVisible} workout={currPressedPopulatedWorkout} captureValues={(sets, reps) => captureSetAndRepValues(sets, reps)} />

            <LupaCamera 
            isVisible={cameraIsVisible} 
            currWorkoutPressed={currPressedPopulatedWorkout} 
            currProgramUUID={programUUID} 
            handleCaptureNewMediaURI={(uri, type) => handleCaptureNewMediaURI(uri, type)}
            mediaCaptureType={mediaCaptureType}
            closeModalMethod={() => setCameraIsVisible(false)}
            />
     
            <SafeAreaView />
        </View>
    )
}

const styles = StyleSheet.create({
    appbar: {
        backgroundColor: '#FFFFFF', 
        elevation: 3,
    borderBottomColor: 'rgb(199, 199, 204)', 
        borderBottomWidth: 0.8, 
        justifyContent: 'space-between'
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        backgroundColor: '#FFFFFF'
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
      }
})

export default BuildWorkoutController;