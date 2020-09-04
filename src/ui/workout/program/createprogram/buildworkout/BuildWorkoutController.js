import React, { useState, useRef, createRef, useEffect } from 'react';

import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    SectionList,
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

import Dots from 'react-native-dots-pagination';

import DropDownPicker from 'react-native-dropdown-picker';
import ImagePicker from 'react-native-image-picker'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import FeatherIcon from 'react-native-vector-icons/Feather';
import ThinFeatherIcon from 'react-native-feather1s'
import RBSheet from 'react-native-raw-bottom-sheet';
import {
    SearchBar
} from 'react-native-elements'
import { fromString } from 'uuidv4';
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
import LupaController from '../../../../../controller/lupa/LupaController';

import { connect } from 'react-redux'
import CreateCustomWorkoutModal from './modal/CreateCustomWorkoutModal';

const CATEGORY_TAGS = [
    'Body Weight',
    'Barbell',
    'Dumbbell',
    'Cables',
    'Other'
]

const PLACEMENT_TYPES = {
    SUPERSET: 'superset',
    EXERCISE: 'exercise',
}
  

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state
    }
}

class BuildWorkoutController extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
        this.workoutLibraryRef = createRef()

        this.state = {
            mediaCaptureType: "",
            addCueModalIsVisible: false,
            addDescriptionModalIsVisible: false,
            workoutSchemeModalIsVisible: false,
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
            mondayCarouselIndex: 0,
            tuesdayCarouselIndex: 0,
            wednesdayCarouselIndex: 0,
            thursdayCarouselIndex: 0,
            fridayCarouselIndex: 0,
            saturdayCarouselIndex: 0,
            sundayCarouselIndex: 0,
            searchValue: '',
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
            currSuperSetWorkoutIndex: 0,
            customWorkoutModalVisible: false,
            libraryData: [
                {
                  title: "Lower",
                  data: this.props.lupa_data.Application_Workouts.applicationWorkouts,
                },
                {
                  title: "Upper",
                  data: []
                },
                {
                  title: "Core",
                  data: []
                },
              ],
        }
    }

    componentDidCatch(err, info) {
       console.log(err)
    }

    handleSaveProgramData = () => {
        this.props.saveProgramWorkoutData(this.state.workoutDays)
    }

    getCurrentDay = () => {
        const currIndex = this.state.currDayIndex;
        return this.props.programData.program_workout_days[currIndex]
    }

    captureWorkout = (workoutObject, placementType) => {

        const workoutDay = this.getCurrentDay()

        switch (this.state.currPlacementType) {
            case PLACEMENT_TYPES.SUPERSET:
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
                    workout_uid: workoutObject.workout_uid,
                    workout_day: workoutDay, //add the section so it is easy to delete
                    superset: new Array(),
                }

                let workoutToUpdate = this.state.currPressedPopulatedWorkout;
                workoutToUpdate.superset.push(updatedWorkout);
                let newWorkoutData, newState;

                switch (workoutDay) {
                    case 'Monday':
                        for (let i = 0; i < this.state.workoutDays.Monday.length; i++) {
                            if (this.state.workoutDays.Monday[i].workout_workout_uid == workoutToUpdate.workout_uid) {
                                newWorkoutData = this.state.workoutDays.Monday;
                                newWorkoutData[i] = workoutToUpdate
                                newState = {
                                    Monday: newWorkoutData,
                                    ...this.state.workoutDays
                                }

                                this.setState({ workoutDays: newState })
                            }
                        }
                        break;
                        case 'Tuesday':
                        for (let i = 0; i < this.state.workoutDays.Tuesday.length; i++) {
                            if (this.state.workoutDays.Tuesday[i].workout_workout_uid == workoutToUpdate.workout_uid) {
                                newWorkoutData = this.state.workoutDays.Tuesday;
                                newWorkoutData[i] = workoutToUpdate
                                newState = {
                                    Tuesday: newWorkoutData,
                                    ...this.state.workoutDays
                                }

                                this.setState({ workoutDays: newState })
                            }
                        }
                        break;
                        case 'Wednesday':
                        for (let i = 0; i < this.state.workoutDays.Wednesday.length; i++) {
                            if (this.state.workoutDays.Wednesday[i].workout_workout_uid == workoutToUpdate.workout_uid) {
                                newWorkoutData = this.state.workoutDays.Wednesday;
                                newWorkoutData[i] = workoutToUpdate
                                newState = {
                                    Wednesday: newWorkoutData,
                                    ...this.state.workoutDays
                                }

                                this.setState({ workoutDays: newState })
                            }
                        }
                        break;
                        case 'Thursday':
                        for (let i = 0; i < this.state.workoutDays.Thursday.length; i++) {
                            if (this.state.workoutDays.Thursday[i].workout_workout_uid == workoutToUpdate.workout_uid) {
                                newWorkoutData = this.state.workoutDays.Thursday;
                                newWorkoutData[i] = workoutToUpdate
                                newState = {
                                    Thursday: newWorkoutData,
                                    ...this.state.workoutDays
                                }

                                this.setState({ workoutDays: newState })
                            }
                        }
                        break;
                        case 'Friday':
                        for (let i = 0; i < this.state.workoutDays.Friday.length; i++) {
                            if (this.state.workoutDays.Friday[i].workout_workout_uid == workoutToUpdate.workout_uid) {
                                newWorkoutData = this.state.workoutDays.Friday;
                                newWorkoutData[i] = workoutToUpdate
                                newState = {
                                    Friday: newWorkoutData,
                                    ...this.state.workoutDays
                                }

                                this.setState({ workoutDays: newState })
                            }
                        }
                        break;
                        case 'Saturday':
                        for (let i = 0; i < this.state.workoutDays.Saturday.length; i++) {
                            if (this.state.workoutDays.Saturday[i].workout_workout_uid == workoutToUpdate.workout_uid) {
                                newWorkoutData = this.state.workoutDays.Saturday;
                                newWorkoutData[i] = workoutToUpdate
                                newState = {
                                    Saturday: newWorkoutData,
                                    ...this.state.workoutDays
                                }

                                this.setState({ workoutDays: newState })
                            }
                        }
                        break;
                        case 'Sunday':
                        for (let i = 0; i < this.state.workoutDays.Sunday.length; i++) {
                            if (this.state.workoutDays.Sunday[i].workout_workout_uid == workoutToUpdate.workout_uid) {
                                newWorkoutData = this.state.workoutDays.Sunday;
                                newWorkoutData[i] = workoutToUpdate
                                newState = {
                                    Sunday: newWorkoutData,
                                    ...this.state.workoutDays
                                }

                                this.setState({ workoutDays: newState })
                            }
                        }
                        break;
                    default:
                }


                break;
            case PLACEMENT_TYPES.EXERCISE:
                try {
                    if (typeof (workoutObject) == 'undefined') {
                        return;
                    }

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
                        workout_uid: workoutObject.workout_uid,
                        workout_day: workoutDay, //add the section so it is easy to delete
                        superset: new Array(),
                    }


                    let updatedWorkoutData = [], newWorkoutData = {}
                    switch (workoutDay) {
                        case 'Monday':

                            updatedWorkoutData = this.state.workoutDays.Monday
                            updatedWorkoutData.push(updatedWorkout)

                            newWorkoutData = {
                                Monday: updatedWorkoutData,
                                ...this.state.workoutDays,
                            }

                            this.setState({ workoutDays: newWorkoutData })

                       
                            break;
                        case 'Tuesday':
                            updatedWorkoutData = this.state.workoutDays.Tuesday
                            updatedWorkoutData.push(updatedWorkout)

                            newWorkoutData = {
                                Tuesday: updatedWorkoutData,
                                ...this.state.workoutDays,
                            }

                            this.setState({ workoutDays: newWorkoutData });
                            break;
                        case 'Wednesday':
                            updatedWorkoutData = this.state.workoutDays.Wednesday
                            updatedWorkoutData.push(updatedWorkout)

                            newWorkoutData = {
                                Wednesday: updatedWorkoutData,
                                ...this.state.workoutDays,
                            }

                            this.setState({ workoutDays: newWorkoutData });
                            break;
                        case 'Thursday':
                            updatedWorkoutData = this.state.workoutDays.Thursday
                            updatedWorkoutData.push(updatedWorkout)

                            newWorkoutData = {
                                Thursday: updatedWorkoutData,
                                ...this.state.workoutDays,
                            }

                            this.setState({ workoutDays: newWorkoutData })
                            break;
                        case 'Friday':
                            updatedWorkoutData = this.state.workoutDays.Friday
                            updatedWorkoutData.push(updatedWorkout)

                            newWorkoutData = {
                                Friday: updatedWorkoutData,
                                ...this.state.workoutDays,
                            }

                            this.setState({ workoutDays: newWorkoutData })
                            break;
                        case 'Saturday':
                            updatedWorkoutData = this.state.workoutDays.Saturday
                            updatedWorkoutData.push(updatedWorkout)

                            newWorkoutData = {
                                Saturday: updatedWorkoutData,
                                ...this.state.workoutDays,
                            }

                            this.setState({ workoutDays: newWorkoutData })
                            break;
                        case 'Sunday':
                            updatedWorkoutData = this.state.workoutDays.Sunday
                            updatedWorkoutData.push(updatedWorkout)

                            newWorkoutData = {
                                Sunday: updatedWorkoutData,
                                ...this.state.workoutDays,
                            }

                            this.setState({ workoutDays: newWorkoutData })
                            break;
                        default:
                            updatedWorkoutData = this.state.workoutDays.Monday

                            updatedWorkoutData.push(updatedWorkout)

                            newWorkoutData = {
                                Monday: updatedWorkoutData,
                                ...this.state.workoutDays,
                            }

                            this.setState({ workoutDays: newWorkoutData })
                    }

                    const num = this.state.numWorkoutsAdded + 1;
                    this.setState({ numWorkoutsAdded: num })
                } catch (error) {
                    alert(error)
                }
                break;
            default:
        }
    }

    handleOnHorizontalScroll = (event) => {
        const currDay = this.getCurrentDay()

        switch (currDay) {
            case 'Monday':
                this.setState({
                    mondayCarouselIndex: Math.round(parseFloat(event.nativeEvent.contentOffset.x / Dimensions.get('window').width)),
                    currPressedPopulatedWorkout: this.state.workoutDays.Monday[Math.round(parseFloat(event.nativeEvent.contentOffset.x / Dimensions.get('window').width))]
                })
                break;
            case 'Tuesday':
                this.setState({
                    tuesdayCarouselIndex: Math.round(parseFloat(event.nativeEvent.contentOffset.x / Dimensions.get('window').width)),
                    currPressedPopulatedWorkout: this.state.workoutDays.Tuesday[Math.round(parseFloat(event.nativeEvent.contentOffset.x / Dimensions.get('window').width))]
                })
                break;
            case 'Wednesday':
                this.setState({
                    wednesdayCarouselIndex: Math.round(parseFloat(event.nativeEvent.contentOffset.x / Dimensions.get('window').width)),
                    currPressedPopulatedWorkout: this.state.workoutDays.Wednesday[Math.round(parseFloat(event.nativeEvent.contentOffset.x / Dimensions.get('window').width))]
                })
                break;
            case 'Thursday':
                this.setState({
                    thursdayCarouselIndex: Math.round(parseFloat(event.nativeEvent.contentOffset.x / Dimensions.get('window').width)),
                    currPressedPopulatedWorkout: this.state.workoutDays.Thursday[Math.round(parseFloat(event.nativeEvent.contentOffset.x / Dimensions.get('window').width))]
                })
                break;
            case 'Friday':
                this.setState({
                    fridayCarouselIndex: Math.round(parseFloat(event.nativeEvent.contentOffset.x / Dimensions.get('window').width)),
                    currPressedPopulatedWorkout: this.state.workoutDays.Friday[Math.round(parseFloat(event.nativeEvent.contentOffset.x / Dimensions.get('window').width))]
                })
                break;
            case 'Saturday':
                this.setState({
                    saturdayCarouselIndex: Math.round(parseFloat(event.nativeEvent.contentOffset.x / Dimensions.get('window').width)),
                    currPressedPopulatedWorkout: this.state.workoutDays.Saturday[Math.round(parseFloat(event.nativeEvent.contentOffset.x / Dimensions.get('window').width))]
                })
                break;
            case 'Sunday':
                this.setState({
                    sundayCarouselIndex: Math.round(parseFloat(event.nativeEvent.contentOffset.x / Dimensions.get('window').width)),
                    currPressedPopulatedWorkout: this.state.workoutDays.Sunday[Math.round(parseFloat(event.nativeEvent.contentOffset.x / Dimensions.get('window').width))]
                })
                break;
            default:
        }

    }

    getCurrentDayContent = () => {
        const currDay = this.getCurrentDay()
        try {
            switch (currDay) {
                case 'Monday':
                    if (this.state.workoutDays.Monday.length === 0) {
                        return (
                            <View style={[styles.alignAndJustifyCenter]}>
                                <View style={[styles.alignAndJustifyCenter, { width: 120, height: 120, borderRadius: 120, borderWidth: 1.5, borderColor: 'rgb(142, 142, 147)', }]}>
                                    <ThinFeatherIcon color="rgb(142, 142, 147)" thin={true} name="plus" size={80} />
                                </View>
                                <Caption style={{ padding: 20, color: '#212121' }} onPress={() => this.handleOpenLibraryOnPress(PLACEMENT_TYPES.EXERCISE)}>
                                    No exercises have been added for {currDay}
                                </Caption>
                            </View>
                        )
                    }

                    return (
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <ScrollView
                                onScroll={this.handleOnHorizontalScroll}
                                showsHorizontalScrollIndicator={false}
                                pagingEnabled={true}
                                decelerationRate={0}
                                snapToAlignment='center'
                                snapToInterval={Dimensions.get('window').width}
                                horizontal={true}
                                centerContent
                                scrollEventThrottle={3}
                                contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                                {
                                    this.state.workoutDays.Monday.map((workout, index, arr) => {
                                        return (
                                            <WorkoutDisplay handleSuperSetOnPress={() => this.handleOpenLibraryOnPress(PLACEMENT_TYPES.SUPERSET)} key={workout.workout_uid} workout={workout} />
                                        )
                                    })
                                }
                            </ScrollView>
                            <Pagination dotStyle={{ width: 5, height: 5 }} containerStyle={{ backgroundColor: 'white', height: 2, width: Dimensions.get('window').width }} dotContainerStyle={{ height: 5 }} dotsLength={this.state.workoutDays.Monday.length} activeDotIndex={this.state.mondayCarouselIndex} dotColor="#1089ff" inactiveDotColor='#23374d' />
                        </View>
                    )
                case 'Tuesday':
                    if (this.state.workoutDays.Tuesday.length === 0) {
                        return (
                            <View style={styles.alignAndJustifyCenter}>
                                <View style={[styles.alignAndJustifyCenter, { width: 120, height: 120, borderRadius: 120, borderWidth: 1.5, borderColor: 'rgb(142, 142, 147)', }]}>
                                    <ThinFeatherIcon color="rgb(142, 142, 147)" thin={true} name="plus" size={80} />
                                </View>
                                <Caption style={{ padding: 20, color: '#212121' }} onPress={() => this.handleOpenLibraryOnPress(PLACEMENT_TYPES.EXERCISE)}>
                                    No exercises have been added for {currDay}
                                </Caption>
                            </View>
                        )
                    }

                    return (
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <ScrollView
                                onScroll={this.handleOnHorizontalScroll}
                                showsHorizontalScrollIndicator={false}
                                pagingEnabled={true}
                                decelerationRate={0}
                                snapToAlignment='center'
                                snapToInterval={Dimensions.get('window').width}
                                horizontal={true}
                                centerContent
                                scrollEventThrottle={3}
                                contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                                {
                                    this.state.workoutDays.Tuesday.map((workout, index, arr) => {
                                        return (
                                            <WorkoutDisplay handleSuperSetOnPress={() => this.handleOpenLibraryOnPress(PLACEMENT_TYPES.SUPERSET)} key={workout.workout_uid} workout={workout} showContentSection={this.state.bottomViewIndex == 1} />
                                        )
                                    })
                                }
                            </ScrollView>
                            <Pagination dotStyle={{ width: 5, height: 5 }} containerStyle={{ backgroundColor: 'white', height: 2, width: Dimensions.get('window').width }} dotContainerStyle={{ height: 5 }} dotsLength={this.state.workoutDays.Monday.length} activeDotIndex={this.state.mondayCarouselIndex} dotColor="#1089ff" inactiveDotColor='#23374d' />
                        </View>
                    )
                case 'Wednesday':
                    if (this.state.workoutDays.Wednesday.length === 0) {
                        return (
                            <View style={styles.alignAndJustifyCenter}>
                                <View style={[styles.alignAndJustifyCenter, { width: 120, height: 120, borderRadius: 120, borderWidth: 1.5, borderColor: 'rgb(142, 142, 147)', }]}>
                                    <ThinFeatherIcon color="rgb(142, 142, 147)" thin={true} name="plus" size={80} />
                                </View>
                                <Caption style={{ padding: 20, color: '#212121' }} onPress={() => this.handleOpenLibraryOnPress(PLACEMENT_TYPES.EXERCISE)}>
                                    No exercises have been added for {currDay}
                                </Caption>
                            </View>
                        )
                    }

                    return (
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <ScrollView
                                onScroll={this.handleOnHorizontalScroll}
                                showsHorizontalScrollIndicator={false}
                                pagingEnabled={true}
                                decelerationRate={0}
                                snapToAlignment='center'
                                snapToInterval={Dimensions.get('window').width}
                                horizontal={true}
                                centerContent
                                scrollEventThrottle={3}
                                contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                                {
                                    this.state.workoutDays.Wednesday.map((workout, index, arr) => {
                                        return (
                                            <WorkoutDisplay handleSuperSetOnPress={() => this.handleOpenLibraryOnPress(PLACEMENT_TYPES.SUPERSET)} key={workout.workout_uid} workout={workout} showContentSection={this.state.bottomViewIndex == 1} />
                                        )
                                    })
                                }
                            </ScrollView>
                            <Pagination dotStyle={{ width: 5, height: 5 }} containerStyle={{ backgroundColor: 'white', height: 2, width: Dimensions.get('window').width }} dotContainerStyle={{ height: 5 }} dotsLength={this.state.workoutDays.Monday.length} activeDotIndex={this.state.mondayCarouselIndex} dotColor="#1089ff" inactiveDotColor='#23374d' />
                        </View>
                    )
                case 'Thursday':
                    if (this.state.workoutDays.Thursday.length === 0) {
                        return (
                            <View style={styles.alignAndJustifyCenter}>
                                <View style={[styles.alignAndJustifyCenter, { width: 120, height: 120, borderRadius: 120, borderWidth: 1.5, borderColor: 'rgb(142, 142, 147)', }]}>
                                    <ThinFeatherIcon color="rgb(142, 142, 147)" thin={true} name="plus" size={80} />
                                </View>
                                <Caption style={{ padding: 20, color: '#212121' }} onPress={() => this.handleOpenLibraryOnPress(PLACEMENT_TYPES.EXERCISE)}>
                                    No exercises have been added for {currDay}
                                </Caption>
                            </View>
                        )
                    }

                    return (
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <ScrollView
                                onScroll={this.handleOnHorizontalScroll}
                                showsHorizontalScrollIndicator={false}
                                pagingEnabled={true}
                                decelerationRate={0}
                                snapToAlignment='center'
                                snapToInterval={Dimensions.get('window').width}
                                horizontal={true}
                                centerContent
                                scrollEventThrottle={3}
                                contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                                {
                                    this.state.workoutDays.Thursday.map((workout, index, arr) => {
                                        return (
                                            <WorkoutDisplay handleSuperSetOnPress={() => this.handleOpenLibraryOnPress(PLACEMENT_TYPES.SUPERSET)} key={workout.workout_uid} workout={workout} showContentSection={this.state.bottomViewIndex == 1} />
                                        )
                                    })
                                }
                            </ScrollView>
                            <Pagination dotStyle={{ width: 5, height: 5 }} containerStyle={{ backgroundColor: 'white', height: 2, width: Dimensions.get('window').width }} dotContainerStyle={{ height: 5 }} dotsLength={this.state.workoutDays.Monday.length} activeDotIndex={this.state.mondayCarouselIndex} dotColor="#1089ff" inactiveDotColor='#23374d' />
                        </View>
                    )
                case 'Friday':
                    if (this.state.workoutDays.Friday.length === 0) {
                        return (
                            <View style={styles.alignAndJustifyCenter}>
                                <View style={[styles.alignAndJustifyCenter, { width: 120, height: 120, borderRadius: 120, borderWidth: 1.5, borderColor: 'rgb(142, 142, 147)', }]}>
                                    <ThinFeatherIcon color="rgb(142, 142, 147)" thin={true} name="plus" size={80} />
                                </View>
                                <Caption style={{ padding: 20, color: '#212121' }} onPress={() => this.handleOpenLibraryOnPress(PLACEMENT_TYPES.EXERCISE)}>
                                    No exercises have been added for {currDay}
                                </Caption>
                            </View>
                        )
                    }
                    return (
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <ScrollView
                            onScroll={this.handleOnHorizontalScroll}
                            showsHorizontalScrollIndicator={false}
                            pagingEnabled={true}
                            decelerationRate={0}
                            snapToAlignment='center'
                            snapToInterval={Dimensions.get('window').width}
                            horizontal={true}
                            centerContent
                            scrollEventThrottle={3}
                            contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                            {
                                this.state.workoutDays.Friday.map((workout, index, arr) => {
                                    return (
                                        <WorkoutDisplay handleSuperSetOnPress={() => this.handleOpenLibraryOnPress(PLACEMENT_TYPES.SUPERSET)} key={workout.workout_uid} workout={workout} showContentSection={this.state.bottomViewIndex == 1} />
                                    )
                                })
                            }
                        </ScrollView>
                        <Pagination dotStyle={{ width: 5, height: 5 }} containerStyle={{ backgroundColor: 'white', height: 2, width: Dimensions.get('window').width }} dotContainerStyle={{ height: 5 }} dotsLength={this.state.workoutDays.Monday.length} activeDotIndex={this.state.mondayCarouselIndex} dotColor="#1089ff" inactiveDotColor='#23374d' />
                    </View>
                    )
                case 'Saturday':
                    if (this.state.workoutDays.Saturday.length === 0) {
                        return (
                            <View style={styles.alignAndJustifyCenter}>
                                <View style={[styles.alignAndJustifyCenter, { width: 120, height: 120, borderRadius: 120, borderWidth: 1.5, borderColor: 'rgb(142, 142, 147)', }]}>
                                    <ThinFeatherIcon color="rgb(142, 142, 147)" thin={true} name="plus" size={80} />
                                </View>
                                <Caption style={{ padding: 20, color: '#212121' }} onPress={() => this.handleOpenLibraryOnPress(PLACEMENT_TYPES.EXERCISE)}>
                                    No exercises have been added for {currDay}
                                </Caption>
                            </View>
                        )
                    }

                    return (
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <ScrollView
                            onScroll={this.handleOnHorizontalScroll}
                            showsHorizontalScrollIndicator={false}
                            pagingEnabled={true}
                            decelerationRate={0}
                            snapToAlignment='center'
                            snapToInterval={Dimensions.get('window').width}
                            horizontal={true}
                            centerContent
                            scrollEventThrottle={3}
                            contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                            {
                                this.state.workoutDays.Saturday.map((workout, index, arr) => {
                                    return (
                                        <WorkoutDisplay handleSuperSetOnPress={() => this.handleOpenLibraryOnPress(PLACEMENT_TYPES.SUPERSET)} key={workout.workout_uid} workout={workout} showContentSection={this.state.bottomViewIndex == 1} />
                                    )
                                })
                            }
                        </ScrollView>
                        <Pagination dotStyle={{ width: 5, height: 5 }} containerStyle={{ backgroundColor: 'white', height: 2, width: Dimensions.get('window').width }} dotContainerStyle={{ height: 5 }} dotsLength={this.state.workoutDays.Monday.length} activeDotIndex={this.state.mondayCarouselIndex} dotColor="#1089ff" inactiveDotColor='#23374d' />
                    </View>
                    )
                case 'Sunday':
                    if (this.state.workoutDays.Sunday.length === 0) {
                        return (
                            <View style={styles.alignAndJustifyCenter}>
                                <View style={[styles.alignAndJustifyCenter, { width: 120, height: 120, borderRadius: 120, borderWidth: 1.5, borderColor: 'rgb(142, 142, 147)', }]}>
                                    <ThinFeatherIcon color="rgb(142, 142, 147)" thin={true} name="plus" size={80} />
                                </View>
                                <Caption style={{ padding: 20, color: '#212121' }} onPress={() => this.handleOpenLibraryOnPress(PLACEMENT_TYPES.EXERCISE)}>
                                    No exercises have been added for {currDay}
                                </Caption>
                            </View>
                        )
                    }

                    return (
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <ScrollView
                            onScroll={this.handleOnHorizontalScroll}
                            showsHorizontalScrollIndicator={false}
                            pagingEnabled={true}
                            decelerationRate={0}
                            snapToAlignment='center'
                            snapToInterval={Dimensions.get('window').width}
                            horizontal={true}
                            centerContent
                            scrollEventThrottle={3}
                            contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
                            {
                                this.state.workoutDays.Sunday.map((workout, index, arr) => {
                                    return (
                                        <WorkoutDisplay handleSuperSetOnPress={() => this.handleOpenLibraryOnPress(PLACEMENT_TYPES.SUPERSET)} key={workout.workout_uid} workout={workout} showContentSection={this.state.bottomViewIndex == 1} />
                                    )
                                })
                            }
                        </ScrollView>
                        <Pagination dotStyle={{ width: 5, height: 5 }} containerStyle={{ backgroundColor: 'white', height: 2, width: Dimensions.get('window').width }} dotContainerStyle={{ height: 5 }} dotsLength={this.state.workoutDays.Monday.length} activeDotIndex={this.state.mondayCarouselIndex} dotColor="#1089ff" inactiveDotColor='#23374d' />
                    </View>
                    )
                default:
                    return (
                        <View style={styles.alignAndJustifyCenter}>
                            <View style={[styles.alignAndJustifyCenter, { width: 120, height: 120, borderRadius: 120, borderWidth: 1.5, borderColor: 'rgb(142, 142, 147)', }]}>
                                <ThinFeatherIcon color="rgb(142, 142, 147)" thin={true} name="plus" size={80} />
                            </View>
                            <Caption style={{ padding: 20, color: '#23374d' }}>
                                No exercises have been added.  Choose a day from the drop down menu and add an exercise using the exercise library.
                            </Caption>
                        </View>
                    )

            }
        } catch (error) {
            return;
        }
    }

    handleAddCustomWorkout = async () => {
        await this.workoutLibraryRef.current.close();
     this.setState({ customWorkoutModalVisible: true })
    }


    handleOpenLibraryOnPress = async (placementType) => {
        await this.setState({ currPlacementType: placementType })
        this.workoutLibraryRef.current.open();
    }

    handleTakeVideo = () => {
        const { navigation } = this.props;
        navigation.navigate('LupaCamera', {
            currWorkoutPressed: this.state.currPressedPopulatedWorkout,
            currProgramUUID: this.props.programUUID,
            mediaCaptureType: "VIDEO",
            captureURI: this.handleCaptureNewMediaURI.bind(this),
        })
    }

    handleTakePicture = () => {
        if (typeof (this.state.currPressedPopulatedWorkout) == 'undefined') {
            return;
        }

        this.addWorkoutMedia()
    }

    addWorkoutMedia = () => {
        // Open Image Library
        ImagePicker.launchImageLibrary({
            allowsEditing: true
        }, async (response) => {
            if (response.didCancel) {
                LOG_ERROR('BuildWorkoutController.js', 'User cancelled image picker in addWorkoutMedia()', 'true');
            } else if (response.error) {
                LOG_ERROR('BuildWorkoutController.js', 'Caught exception in image picker in addWorkoutMedia()', response.error);
            } else {
                const source = await response.uri
                const workoutMediaURI = await this.LUPA_CONTROLLER_INSTANCE.saveProgramWorkoutGraphic(this.state.currPressedPopulatedWorkout, this.props.programData.program_structure_uuid, 'IMAGE', source)
                this.handleCaptureNewMediaURI(workoutMediaURI, 'IMAGE');
            }
        });
    }

    handleAddDescription = async () => {
        this.setState({ addDescriptionModalIsVisible: true })
    }

    handleAddCue = () => {
        this.setState({ addCueModalIsVisible: true })
    }

    handleEditWorkoutScheme = () => {
        this.setState({ workoutSchemeModalIsVisible: true })
    }

    renderTopView = () => {
        return (
            this.getCurrentDayContent()
        )
    }

    renderExerciseNumberCaption = () => {
        return (
            /*  <Caption style={{paddingLeft: 20, color: '#1089ff'}}>
                              Showing exercise {this.state.mondayCarouselIndex} / {this.state.workoutDays.Monday.length}
                          </Caption>*/

            <Caption style={{ paddingLeft: 20, color: '#1089ff' }}>
                Scroll horizontally to see added exercises.
            </Caption>

        )
    }

    renderExerciseSuperSetNumberCaption = () => {
        return (
            /*  <Caption style={{paddingLeft: 20, color: '#1089ff'}}>
              Showing superset exercises {this.state.currSuperSetWorkoutIndex} / {this.state.currPressedPopulatedWorkout.superset.length}
          </Caption>*/
            <Caption style={{ paddingLeft: 20, color: '#1089ff' }}>
                Scroll vertically to see workouts added for supersets.
            </Caption>
        )
    }


    renderBottomView = () => {
        let items = []
        this.props.programData.program_workout_days.map((day, index, arr) => {
            let item = {
                label: day,
                value: day,
                index: index
            }
            items.push(item)
        })

        switch (this.state.bottomViewIndex) {
            case 0:
                return (
                    <View style={{ flex: 1.5 }}>

                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ flex: 2 }}>
                                <Divider />
                                <Text style={{ padding: 10, fontSize: 15, fontWeight: '400', fontFamily: 'Avenir', alignSelf: 'center' }}>
                                    Choose a day of the week and add exercises from the exercise library.
                        </Text>
                                <DropDownPicker
                                    items={items}
                                    defaultValue={this.getCurrentDay()}
                                    containerStyle={{ height: 40, width: Dimensions.get('window').width }}
                                    style={{ backgroundColor: '#fafafa', marginHorizontal: 20 }}
                                    itemStyle={{
                                        justifyContent: 'flex-start'
                                    }}
                                    dropDownStyle={{ backgroundColor: '#fafafa' }}
                                    onChangeItem={item => this.setState({ currDayIndex: item.index })}
                                />

                                {this.renderExerciseNumberCaption()}
                                {this.renderExerciseSuperSetNumberCaption()}


                            </View>

                            <FAB small={false} label="Open Library" onPress={() => this.handleOpenLibraryOnPress(PLACEMENT_TYPES.EXERCISE)} style={{ backgroundColor: '#1089ff', position: 'absolute', bottom: 0, right: 0, margin: 12 }} color="white" icon="plus" />
                        </View>
                    </View>
                )
            case 1:
                return (
                    <View style={{ flex: 1.8 }}>
                        {this.state.bottomViewIndex === 1 ?

                            <>
                                <Surface style={{ paddingVertical: 5, backgroundColor: 'white', elevation: 3, }}>
                                    <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                        <TouchableOpacity onPress={this.handleEditWorkoutScheme}>
                                            <View style={{ alignItems: 'center' }}>
                                                <Surface style={{ elevation: 2, width: 30, height: 30, borderRadius: 40, alignItems: 'center', justifyContent: 'center', margin: 3 }}>
                                                    <ThinFeatherIcon color="#212121" thin={true} name="clipboard" size={15} />
                                                </Surface>
                                                <Caption style={{ fontSize: 10 }}>
                                                    Edit Scheme
                       </Caption>
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={this.handleTakeVideo}>
                                            <View style={{ alignItems: 'center' }}>
                                                <Surface style={{ elevation: 2, width: 30, height: 30, borderRadius: 40, alignItems: 'center', justifyContent: 'center', margin: 3 }}>
                                                    <ThinFeatherIcon color="#212121" thin={true} name="video" size={15} />
                                                </Surface>
                                                <Caption style={{ fontSize: 10 }}>
                                                    Add Video
                       </Caption>
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={this.addWorkoutMedia}>
                                            <View style={{ alignItems: 'center' }}>
                                                <Surface style={{ elevation: 2, width: 30, height: 30, borderRadius: 40, alignItems: 'center', justifyContent: 'center', margin: 3 }}>
                                                    <ThinFeatherIcon color="#212121" thin={true} name="image" size={15} />
                                                </Surface>
                                                <Caption style={{ fontSize: 10 }}>
                                                    Add Image
                       </Caption>
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={this.handleAddCue}>
                                            <View style={{ alignItems: 'center' }}>
                                                <Surface style={{ elevation: 2, width: 30, height: 30, borderRadius: 40, alignItems: 'center', justifyContent: 'center', margin: 3 }}>
                                                    <ThinFeatherIcon color="#212121" thin={true} name="message-circle" size={15} />
                                                </Surface>
                                                <Caption style={{ fontSize: 10 }}>
                                                    Add Cues
                       </Caption>
                                            </View>
                                        </TouchableOpacity>

                                        <View style={{ alignItems: 'center' }}>
                                            <Surface style={{ elevation: 2, width: 30, height: 30, borderRadius: 40, alignItems: 'center', justifyContent: 'center', margin: 3 }}>
                                                <ThinFeatherIcon color="#e53935" thin={true} name="trash" size={15} />
                                            </Surface>
                                            <Caption style={{ color: '#e53935', fontSize: 10 }}>
                                                Remove
                       </Caption>
                                        </View>
                                    </View>
                                </Surface>
                                <Divider style={{ width: '100%' }} />
                            </>
                            :
                            null
                        }
                        <Text style={{ padding: 10, fontSize: 15, fontWeight: '400', fontFamily: 'Avenir', }}>
                            Showing exercises from:
                        </Text>
                        <DropDownPicker
                            items={items}
                            defaultValue={this.getCurrentDay()}
                            containerStyle={{ height: 40, width: Dimensions.get('window').width }}
                            style={{ backgroundColor: '#fafafa' }}
                            itemStyle={{
                                justifyContent: 'flex-start'
                            }}
                            dropDownStyle={{ backgroundColor: '#FFFFFF' }}
                            onChangeItem={item => this.setState({ currDayIndex: item.index })}
                        />

                    </View>
                )
        }
    }

    renderBottomSheet = () => {
        return (
            <RBSheet
                ref={this.workoutLibraryRef}
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
                <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                    <View style={{ padding: 10 }}>
                        <SearchBar placeholder="Search exercises"
                            onChangeText={text => console.log(text)}
                            platform="ios"
                            searchIcon={<FeatherIcon name="search" size={15} color="#1089ff" />}
                            containerStyle={{ backgroundColor: "transparent", width: '100%' }}
                            inputContainerStyle={{ backgroundColor: 'rgb(242, 242, 247))', }}
                            inputStyle={{ fontSize: 15, color: 'black', fontWeight: '800', fontFamily: 'avenir-roman' }}
                            placeholderTextColor="#212121"
                            value={this.state.searchValue} />
                    </View>
                    <Divider />
                    <View>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            {
                                CATEGORY_TAGS.map((tag) => {
                                    return (
                                        <Chip key={tag} mode="flat" style={{ margin: 10, backgroundColor: '#EEEEEE' }} textStyle={{ fontFamily: 'Avenir', fontWeight: '600' }}>
                                            {tag}
                                        </Chip>
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                    <View style={{ flex: 1 }}>

<View style={{justifyContent: 'flex-end', width: '100%'}}>
    <Button onPress={this.handleAddCustomWorkout} uppercase={false} color="#1089ff" style={{alignSelf: 'flex-end'}}>
        <Text style={{fontWeight: '300'}}>
            <ThinFeatherIcon thin={true} name="plus" size={15} />
            Add a custom exercise
        </Text>
    </Button>
</View>

<Divider />

                        <SectionList 
                         sections={this.state.libraryData}
                         keyExtractor={(item, index) => Math.random().toString()}
                         renderItem={({ item }) => {
                            if (typeof (item) == 'undefined' || item.workout_name == "" || item.workout_name == undefined) {
                                return;
                            }

                        item.workout_uid = Math.random().toString()
                         
                            return (
                                <TouchableOpacity onPress={() => this.captureWorkout(item, this.state.currPlacementType)}>

                                <SingleWorkout
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
                <SafeAreaView />
            </RBSheet>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <Appbar.Header style={styles.appbar}>
                    <Appbar.Action icon={() => <ThinFeatherIcon thin={true} onPress={() => this.state.bottomViewIndex === 0 ? this.props.goToIndex(0) : this.setState({ bottomViewIndex: 0 })} name="arrow-left" size={20} color="#1089ff" />} />
                        <Button color="#1089ff" uppercase={false} onPress={this.handleSaveProgramData} >
                            <ThinFeatherIcon thin={true} name="arrow-right" size={20} />
                        </Button>
                </Appbar.Header>

                <View style={styles.content}>
                    <View style={styles.mainContent}>
                        {this.renderTopView()}

                    </View>


                    {this.renderBottomView()}
                </View>

                {this.renderBottomSheet()}

                
                <CreateCustomWorkoutModal isVisible={this.state.customWorkoutModalVisible} closeModal={() => this.setState({ customWorkoutModalVisible: false })} programUUID={this.props.programUUID} captureWorkout={this.captureWorkout} />
                <SafeAreaView />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    appbar: {
        backgroundColor: '#FFFFFF',
        elevation: 3,
        justifyContent: 'space-between',
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
    },
    sectionHeader: {
        fontFamily: 'Avenir-Heavy',
        backgroundColor: '#FFFFFF',
        fontSize: 15,
        padding: 10
    }
})

export default connect(mapStateToProps)(BuildWorkoutController);