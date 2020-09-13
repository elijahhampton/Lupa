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

import DropDownPicker from 'react-native-dropdown-picker';
import ImagePicker from 'react-native-image-picker'
import FeatherIcon from 'react-native-vector-icons/Feather';
import ThinFeatherIcon from 'react-native-feather1s'
import RBSheet from 'react-native-raw-bottom-sheet';
import {
    SearchBar
} from 'react-native-elements'
import { fromString } from 'uuidv4';
import SingleWorkout from '../../../component/SingleWorkout';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import WorkoutDisplay from './component/WorkoutDisplay';
import LupaController from '../../../../../controller/lupa/LupaController';

import { connect } from 'react-redux'
import CreateCustomWorkoutModal from './modal/CreateCustomWorkoutModal';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import { Video } from 'expo-av';
import AddSets from './component/AddSets';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

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

let items = []

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
            currView: 0
        }
    }

    goToIndex = (index) => {
        this.setState({ currView: index })
    }

    handleSaveProgramData = (workoutDays) => {
        this.props.saveProgramWorkoutData(workoutDays)
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
                    workout_uid: Math.random().toString(),
                    workout_day: workoutDay, //add the section so it is easy to delete
                    superset: new Array(),
                }

                let workoutToUpdate = this.state.currPressedPopulatedWorkout;
                workoutToUpdate.superset.push(updatedWorkout);
                let newWorkoutData, newState;

                switch (workoutDay) {
                    case 'Monday':
                        for (let i = 0; i < this.state.workoutDays.Monday.length; i++) {
                            if (this.state.workoutDays.Monday[i].workout_uid == workoutToUpdate.workout_uid) {
                                newWorkoutData = this.state.workoutDays.Monday;
                                newWorkoutData[i] = workoutToUpdate
                                newState = {
                                    Monday: newWorkoutData,
                                    ...this.state.workoutDays
                                }

                                this.setState({ workoutDays: newState })
                                console.log(this.state.workoutDays.Monday)
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

                const num = this.state.numWorkoutsAdded + 1;
                this.setState({ numWorkoutsAdded: num, currPlacementType: PLACEMENT_TYPES.EXERCISE, currPressedPopulatedWorkout: undefined })
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
                        workout_uid: Math.random().toString(),
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
                           null
                        )
                    }
                    
                    return (
                        <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                            {

                           this.state.workoutDays.Monday.map((exercise, index, arr) => {
                                return (
                                    <TouchableWithoutFeedback onPress={() => this.handleOpenAddedWorkoutOptionsSheet(workout)} style={{width: this.state.addedWorkoutsScrollViewWidth - 10, height: 100, marginTop: 5, marginBottom: 10}}>
                                    <View style={[{flex: 1, width: '100%'}]}>
                            <View style={{flex: 1}} >
                       <Surface style={{flex: 1, backgroundColor: '#212121'}}>
                            <Video source={require('../../../../videos/pushuppreview.mov')} style={{flex: 1}} shouldPlay={false} resizeMode="cover" />
          </Surface>
                       </View>
                       <Text style={{padding: 3, alignSelf: 'center'}}>
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
                                    <TouchableWithoutFeedback onPress={() => this.handleOpenAddedWorkoutOptionsSheet(workout)} style={{width: this.state.addedWorkoutsScrollViewWidth - 10, height: 100, marginTop: 5, marginBottom: 10}}>
                                    <View style={[{flex: 1, width: '100%'}]}>
                            <View style={{flex: 1}} >
                       <Surface style={{flex: 1, backgroundColor: '#212121'}}>
                            <Video source={require('../../../../videos/pushuppreview.mov')} style={{flex: 1}} shouldPlay={false} resizeMode="cover" />
          </Surface>
                       </View>
                       <Text style={{padding: 3, alignSelf: 'center'}}>
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
                                    <TouchableWithoutFeedback onPress={() => this.handleOpenAddedWorkoutOptionsSheet(workout)} style={{width: this.state.addedWorkoutsScrollViewWidth - 10, height: 100, marginTop: 5, marginBottom: 10}}>
                                    <View style={[{flex: 1, width: '100%'}]}>
                            <View style={{flex: 1}} >
                       <Surface style={{flex: 1, backgroundColor: '#212121'}}>
                            <Video source={require('../../../../videos/pushuppreview.mov')} style={{flex: 1}} shouldPlay={false} resizeMode="cover" />
          </Surface>
                       </View>
                       <Text style={{padding: 3, alignSelf: 'center'}}>
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
                                <TouchableWithoutFeedback onPress={() => this.handleOpenAddedWorkoutOptionsSheet(workout)} style={{width: this.state.addedWorkoutsScrollViewWidth - 10, height: 100, marginTop: 5, marginBottom: 10}}>
                                <View style={[{flex: 1, width: '100%'}]}>
                        <View style={{flex: 1}} >
                   <Surface style={{flex: 1, backgroundColor: '#212121'}}>
                        <Video source={require('../../../../videos/pushuppreview.mov')} style={{flex: 1}} shouldPlay={false} resizeMode="cover" />
      </Surface>
                   </View>
                   <Text style={{padding: 3, alignSelf: 'center'}}>
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
                                    <TouchableWithoutFeedback onPress={() => this.handleOpenAddedWorkoutOptionsSheet(workout)} style={{width: this.state.addedWorkoutsScrollViewWidth - 10, height: 100, marginTop: 5, marginBottom: 10}}>
                                    <View style={[{flex: 1, width: '100%'}]}>
                            <View style={{flex: 1}} >
                       <Surface style={{flex: 1, backgroundColor: '#212121'}}>
                            <Video source={require('../../../../videos/pushuppreview.mov')} style={{flex: 1}} shouldPlay={false} resizeMode="cover" />
          </Surface>
                       </View>
                       <Text style={{padding: 3, alignSelf: 'center'}}>
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
                                <TouchableWithoutFeedback onPress={() => this.handleOpenAddedWorkoutOptionsSheet(workout)} style={{width: this.state.addedWorkoutsScrollViewWidth - 10, height: 100, marginTop: 5, marginBottom: 10}}>
                                <View style={[{flex: 1, width: '100%'}]}>
                        <View style={{flex: 1}} >
                   <Surface style={{flex: 1, backgroundColor: '#212121'}}>
                        <Video source={require('../../../../videos/pushuppreview.mov')} style={{flex: 1}} shouldPlay={false} resizeMode="cover" />
      </Surface>
                   </View>
                   <Text style={{padding: 3, alignSelf: 'center'}}>
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
                                    <TouchableWithoutFeedback onPress={() => this.handleOpenAddedWorkoutOptionsSheet(workout)} style={{width: this.state.addedWorkoutsScrollViewWidth - 10, height: 100, marginTop: 5, marginBottom: 10}}>
                                    <View style={[{flex: 1, width: '100%'}]}>
                            <View style={{flex: 1}} >
                       <Surface style={{flex: 1, backgroundColor: '#212121'}}>
                            <Video source={require('../../../../videos/pushuppreview.mov')} style={{flex: 1}} shouldPlay={false} resizeMode="cover" />
          </Surface>
                       </View>
                       <Text style={{padding: 3, alignSelf: 'center'}}>
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

    handleAddCustomWorkout = async () => {
        await this.workoutLibraryRef.current.close();
     this.setState({ customWorkoutModalVisible: true })
    }


    handleOpenLibraryOnPress = async (placementType) => {
        await this.setState({ currPlacementType: placementType })
        this.workoutLibraryRef.current.open();
    }

    handleOpenAddedWorkoutOptionsSheet = async (workout) => {
        this.setState({ currPressedPopulatedWorkout: workout })
        await this.addedWorkoutOptionsRef.current.open();
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
            <View style={{flex: 1}}>

            </View>
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
                Scroll vertically to see exercises added for supersets.
            </Caption>
        )
    }

    renderAddExercisesHeaderText = () => {
        if (this.props.lupa_data.Users.currUserData.isTrainer === true) {
            return (
                <Caption style={{color: 'white'}}>
                Choose a day of the week and add exercises. Select your added exercises for further options.
            </Caption>
            )
        } else {
            return (
                <Caption style={{color: 'white'}}>
                Add exercises and select your added exercises for further options.
            </Caption>
            )
        }
    }


    renderBottomView = () => {
     
        this.props.programData.program_workout_days.map((day, index, arr) => {
            let item = {
                label: day,
                value: day,
                index: index
            }

            items.push(item)
        })

        

                return (
                    <View style={{ flex: 1.5 }}>

                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ flex: 2 }}>
                                <Divider />
                                <Text style={{ padding: 10, fontSize: 15, fontWeight: '400', fontFamily: 'Avenir', alignSelf: 'center' }}>
                                    Add exercises from the exercise library.
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
    }

    handleAddSuperSet =  async () => {
        await this.setState({ currPlacementType: PLACEMENT_TYPES.SUPERSET });
        this.addedWorkoutOptionsRef.current.close();
    }

    renderCurrWorkoutSupersets = () => {
        if (typeof(this.state.currPressedPopulatedWorkout) == 'undefined') {
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
                                <View style={{width: 100, height: 100}}>
                                <View style={{flex: 1}} >
                           <Surface style={{flex: 1, backgroundColor: '#212121'}}>
                                <Video source={require('../../../../videos/pushuppreview.mov')} style={{flex: 1}} shouldPlay={false} resizeMode="cover" />
              </Surface>
                           </View>
                           <Text style={{padding: 3}}>
                  Push up
              </Text>
                                </View>
                             )
                         })
                }
            </ScrollView>
        )
    }

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
                
                <View style={{alignItems: 'flex-start', flex: 1, padding: 20, backgroundColor: '#FFFFFF' }}>
                <TouchableWithoutFeedback onPress={() => this.handleAddSuperSet()} style={{marginVertical: 10,}}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <FeatherIcon name="plus" size={20} style={{paddingHorizontal: 10}} />
                    <Text style={{fontFamily: 'Avenir-Medium', fontSize: 15}}>
                    
                        Add super set
                    </Text>
                </View>
                </TouchableWithoutFeedback>

                <View style={{marginVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <FeatherIcon color="#e53935" name="trash" size={20} style={{paddingHorizontal: 10}} />
                    <Text style={{ color: '#e53935', fontFamily: 'Avenir-Medium', fontSize: 15}}>
                    
                        Remove Workout
                    </Text>
                </View>
            <Divider style={{alignSelf: 'center', width: Dimensions.get('window').width}} />
             <View style={{width: '100%'}}>
                 <Text style={{alignSelf: 'flex-end', paddingVertical: 5, fontSize: 18, fontWeight: 'bold'}}>
                     Exercise Supersets ({typeof(this.state.currPressedPopulatedWorkout) == 'undefined' ? 0 : this.state.currPressedPopulatedWorkout.superset.length})
                 </Text>
                 {this.renderCurrWorkoutSupersets()}
             </View>
</View>
<SafeAreaView />
            </RBSheet>
        )
    }

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

    renderComponentDisplay = () => {
        let items = [];

        switch(this.state.currView) {
            case 0:
              return ( <View style={styles.container}>
                <Appbar.Header style={[styles.appbar, {height: 'auto',  paddingVertical: 10}]}>
                    <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Button color="white" uppercase={false} onPress={() => this.state.bottomViewIndex === 0 ? this.props.goToIndex(0) : this.setState({ bottomViewIndex: 0 })}>
                        Back
                    </Button>

                    <Button color="white" uppercase={false} onPress={() => this.goToIndex(1)}>
                        Add Sets
                    </Button>
                    </View>

                    <View style={{justifyContent: 'flex-start', width: '100%', padding: 10}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Text style={{  color: 'white', fontWeight: 'bold', fontFamily: 'Avenir-Heavy', fontSize: 25}}>
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
                   <View style={{flex: 4}}>
                   <View style={{}}>
               
                        <View style={{flex: 1}}>
                            <Text>
                                No Workouts
                            </Text>
                        </View>
              
                   </View>
              
               <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
     

                  {
                      this.props.lupa_data.Users.currUserData.isTrainer === true ?
                      <View style={{justifyContent: 'flex-start', width: '100%'}}>
                      <Button icon={() => <FeatherIcon name="plus" color="#1089ff" />} onPress={this.handleAddCustomWorkout}color="#1089ff" style={{alignSelf: 'flex-start'}}>
                          <Text style={{fontSize: 12}}>
                          
                              Add a custom exercise
                          </Text>
                      </Button>
                  </View>
                      :
                      null
                  } 


                        <SectionList 
                         sections={this.state.libraryData}
                         keyExtractor={(item, index) => Math.random().toString()}
                         renderItem={({ item }) => {
                            if (typeof (item) == 'undefined' || item.workout_name == "" || item.workout_name == undefined) {
                                return;
                            }
                         
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

                    <View style={{height: '100%', width: 1.5,  backgroundColor: '#EEEEEE'}} />

                    <View style={{flex: 1.5}}>
                        <ScrollView onLayout={event => this.setState({ addedWorkoutsScrollViewWidth: event.nativeEvent.layout.width })} contentContainerStyle={{alignItems: 'center', width: '100%'}}>
                
                            {this.getCurrentDayContent()}
                      
                       
                        </ScrollView>
                    </View>
               </View>

                
                <CreateCustomWorkoutModal isVisible={this.state.customWorkoutModalVisible} closeModal={() => this.setState({ customWorkoutModalVisible: false })} programUUID={this.props.programUUID} captureWorkout={this.captureWorkout} />
                {this.renderWorkoutOptionsSheet()}
            </View>
              );
            case 1:
                return  <AddSets saveProgramWorkoutData={this.handleSaveProgramData} goToIndex={this.goToIndex} programWorkoutDays={this.props.programData.program_workout_days} workoutDays={this.state.workoutDays} structureID={this.props.currProgramUUID} />
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
        elevation: 3,
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