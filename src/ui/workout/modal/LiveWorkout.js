import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    Modal,
    ScrollView,
    Image,
    SafeAreaView,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';

import {
    Divider,
    Button,
    Menu,
    Paragraph,
    Caption,
    Surface,
    TextInput,
    Portal,
    Title,
    Avatar,
    Appbar,
    Dialog,
} from 'react-native-paper';

import { Picker } from '@react-native-community/picker';

import ShareProgramModal from '../program/modal/ShareProgramModal'

import { ListItem, Input } from 'react-native-elements'
import { Video } from 'expo-av'
import FeatherIcon from "react-native-vector-icons/Feather"
import { connect } from 'react-redux';
import { GiftedChat } from 'react-native-gifted-chat';
import { Fire } from '../../../controller/firebase/firebase';
import LupaController from '../../../controller/lupa/LupaController';
import ThinFeatherIcon from "react-native-feather1s";
import { Constants } from 'react-native-unimodules';
import { getLupaProgramInformationStructure } from '../../../model/data_structures/programs/program_structures';
import RBSheet from "react-native-raw-bottom-sheet";
import { getLupaUserStructure } from '../../../controller/firebase/collection_structures';
import CircularUserCard from '../../user/component/CircularUserCard';
import RestTimer from './RestTimer';
import { useNavigation } from '@react-navigation/native';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import moment from 'moment'
import { getLupaExerciseStructure } from '../../../model/data_structures/workout/exercise_collections';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

const restTimesArr = [
    '10',
    '30',
    '90',
    '120'
]

const tempoArr = [
    '2-1-2'
]

function WorkoutFinishedModal({ isVisible, closeModal }) {
    const navigation = useNavigation();

    return (
        <Modal visible={isVisible} animated={true} animationType="fade">
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <View style={{ flex: 2, justifyContent: 'space-evenly', backgroundColor: '#1089ff' }}>
                    <View style={{ padding: 20, }}>
                        <Title style={{ color: 'white', fontWeight: '800' }}>
                            Congratulations
                </Title>
                        <Paragraph style={{ color: 'white', fontWeight: '600' }}>
                            It looks like you've completed a workout for today.
                </Paragraph>
                    </View>

                    <Button onPress={() => navigation.navigate('LupaHome')} color="white" mode="outlined" style={{ width: Dimensions.get('window').width - 20, alignSelf: 'center', borderColor: 'white' }}>
                        Exit Workout and Go Home
          </Button>


                </View>

            </View>


            <View style={{ flex: 3, alignItems: 'center', justifyContent: 'space-evenly' }}>

                <View style={{ width: Dimensions.get('window').width - 50, alignSelf: 'center', borderRadius: 20, backgroundColor: 'rgb(245, 246, 247)', padding: 20, justifyContent: 'center', alignItems: 'flex-start' }}>
                    <View style={{ marginVertical: 20 }}>
                        <Text style={{ color: 'rgb(116, 126, 136)', fontFamily: 'Avenir-Medium', fontSize: 15, fontWeight: '800' }}>
                            Your statistics have been updated in your dashboard!
                          </Text>

                    </View>

                    <Button onPress={() => navigation.navigate('Dashboard')} color="#1089ff" theme={{ roundness: 5 }} mode="contained" style={{ alignSelf: 'center', height: 45, alignItems: 'center', justifyContent: 'center', width: '90%' }}>
                        View Statistics
                      </Button>
                </View>

            </View>


            <SafeAreaView />
        </Modal>
    )
}

class LiveWorkout extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
        this.interactionsRBSheet = React.createRef();
        this.interactionRBSheet = React.createRef();
        this.shareProgramRBSheet = React.createRef()
        this.interactionInput = React.createRef();
        this.restTimesRBSheet = React.createRef();
        this.tempoRBSheet = React.createRef();

        this.state = {
            workoutStructure: ['Workout Name', 'Workout Name', 'Workout Name'],
            currentWorkout: getLupaExerciseStructure(),
            currentWorkoutOriginalReps: 0,
            currentWorkoutStructure: [],
            currentWeek: 0,
            workoutDays: [],
            currentWorkoutDay: "",
            currentDayIndex: 0,
            currentWorkoutIndex: 0,
            playVideo: false,
            contentShowing: false,
            ready: false,
            programData: getLupaProgramInformationStructure(),
            programOwnerData: getLupaUserStructure(),
            dayMenuVisible: false,
            currentDisplayedMediaURI: "",
            contentTypeDisplayed: "",
            componentDidErr: false,
            liveWorkoutOptionsVisible: false,
            currUserFollowing: [],
            feedback: "",
            feedbackDialogIsVisible: false,
            mediaContainerHeight: 0,
            messages: [],
            interactionInputFocused: false,
            showFullScreenContent: false,
            showFinishedDayDialog: false,
            restTimerStarted: false,
            restTimerVisible: false,
            descriptionDialogVisible: false,
            restTime: 3
        }
    }

    async componentDidMount() {
        await this.setupLiveWorkout().then(() => {
            this.setState({ ready: true })
        }).catch(error => {
            this.setState({ ready: false, componentDidErr: true })
        })
    }

    setupLiveWorkout = async () => {
        if (this.props.route.params.programData) {
            await this.setState({ programData: this.props.route.params.programData });

            await this.LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(this.props.route.params.programData.program_owner).then(data => {
                this.setState({ programOwnerData: data })
            });
        } else if (this.props.route.params.uuid) {
            let programData = getLupaProgramInformationStructure();

            await this.LUPA_CONTROLLER_INSTANCE.getProgramInformationFromUUID(this.props.route.params.uuid).then(data => {
                programData = data;
                this.setState({ programData: data })
            })

            await this.LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(programData.program_owner).then(data => {
                this.setState({ programOwnerData: data })
            });
        }

        await this.loadWorkoutDays()
    }

    loadWorkoutDays = () => {
        this.setState({ workoutDays: this.state.programData.program_workout_days })
        this.loadCurrentDayWorkouts(this.state.programData.program_workout_days[0])
    }

    loadCurrentDayWorkouts = async (day) => {
            let endDate = moment(this.state.programData.program_end_date)
            let weekDifference = endDate.diff(moment(), 'weeks');
            const currWeek = this.state.programData.program_duration - weekDifference;

            /****************************** ****************************/
            //TODO: Here we need to handle the case where the week is 0, i.e. the program has ended
            // beause the weekDIfference  = 0. (Need to also check that the day is the day, Sept 27 = Sept 27 so we don't end the program too early)
            /****************************** ****************************/
            await this.setState({ currentWeek: currWeek - 1 });

        let workoutStructure;

        switch (day) {
            case 'Monday':
                workoutStructure = this.generateWorkoutStructure(this.state.programData.program_workout_structure[this.state.currentWeek].Monday)
                this.setState({ currentWorkoutDay: day, currentWorkoutStructure: workoutStructure, currentWorkout: workoutStructure[0], restTime: workoutStructure[0].workout_rest_time, currentWorkoutOriginalReps: workoutStructure[0].workout_reps, currentWorkoutIndex: 0 })
                break;
            case 'Tuesday':
                workoutStructure = this.generateWorkoutStructure(this.state.programData.program_workout_structure[this.state.currentWeek].Tuesday)
                this.setState({ currentWorkoutDay: day, currentWorkoutStructure: workoutStructure, currentWorkout: workoutStructure[0], restTime: workoutStructure[0].workout_rest_time, currentWorkoutOriginalReps: workoutStructure[0].workout_reps, currentWorkoutIndex: 0 })
                break;
            case 'Wednesday':
                workoutStructure = this.generateWorkoutStructure(this.state.programData.program_workout_structure[this.state.currentWeek].Wednesday)
                this.setState({ currentWorkoutDay: day, currentWorkoutStructure: workoutStructure, currentWorkout: workoutStructure[0], restTime: workoutStructure[0].workout_rest_time, currentWorkoutOriginalReps: workoutStructure[0].workout_reps, currentWorkoutIndex: 0 })
                break;
            case 'Thursday':
                workoutStructure = this.generateWorkoutStructure(this.state.programData.program_workout_structure[this.state.currentWeek].Thursday)
                this.setState({ currentWorkoutDay: day, currentWorkoutStructure: workoutStructure, currentWorkout: workoutStructure[0], restTime: workoutStructure[0].workout_rest_time, currentWorkoutOriginalReps: workoutStructure[0].workout_reps, currentWorkoutIndex: 0 })
                break;
            case 'Friday':
                workoutStructure = this.generateWorkoutStructure(this.state.programData.program_workout_structure[this.state.currentWeek].Friday)
                this.setState({ currentWorkoutDay: day, currentWorkoutStructure: workoutStructure, currentWorkout: workoutStructure[0], restTime: workoutStructure[0].workout_rest_time, currentWorkoutOriginalReps: workoutStructure[0].workout_reps, currentWorkoutIndex: 0 })
                break;
            case 'Saturday':
                workoutStructure = this.generateWorkoutStructure(this.state.programData.program_workout_structure[this.state.currentWeek].Saturday)
                this.setState({ currentWorkoutDay: day, currentWorkoutStructure: workoutStructure, currentWorkout: workoutStructure[0], restTime: workoutStructure[0].workout_rest_time, currentWorkoutOriginalReps: workoutStructure[0].workout_reps, currentWorkoutIndex: 0 })
                break;
            case 'Sunday':
                workoutStructure = this.generateWorkoutStructure(this.state.programData.program_workout_structure[this.state.currentWeek].Sunday)
                this.setState({ currentWorkoutDay: day, currentWorkoutStructure: workoutStructure, currentWorkout: workoutStructure[0], restTime: workoutStructure[0].workout_rest_time, currentWorkoutOriginalReps: workoutStructure[0].workout_reps, currentWorkoutIndex: 0 })
                break;
            default:
        }

        this.setState({ dayMenuVisible: false })
    }

    generateWorkoutStructure = (workoutData) => {
        let workoutStructure = []

        for (let i = 0; i < workoutData.length; i++) {
            workoutStructure.push(workoutData[i]); //Add the first workout
            for (let j = 0; j < workoutData[i].superset.length; j++) {
                workoutStructure.push(workoutData[i].superset[j]);
            }
        }

        return workoutStructure;
    }

    handleOnChangeWorkout = async (workout) => {
        await this.setState({ currentWorkout: workout, contentShowing: true, contentTypeDisplayed: workout.workout_media.media_type })
    }

    showWarningDialog = () => {
        this.setState({ warningDialogShowing: true })
    }

    hideWarningDialog = () => {
        this.setState({ warningDialogShowing: false })
    }

    handleCloseWarningDialog = () => {
        this.hideWarningDialog();
        this.props.navigation.pop();
    }

    renderFinishWorkoutWarningDialog = () => {
        return (
            <Portal>


                <Dialog visible={this.state.warningDialogShowing} style={{ padding: 20, backgroundColor: 'white', width: '80%' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FeatherIcon size={18} style={{ paddingHorizontal: 10 }} name="alert-triangle" />

                        <Title>
                            Warning
            </Title>

                    </View>

                    <Paragraph>
                        You are about to leave your workout before completing it.  Your workout data and progress will not be saved.
            </Paragraph>
                    <Dialog.Actions>
                        <Button color="#1089ff" onPress={this.hideWarningDialog}>
                            Resume
                </Button>
                        <Button color="#e53935" onPress={this.handleCloseWarningDialog}>
                            Exit
                </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>


        )
    }

    renderPreviewContent = (type, uri) => {
        switch (type) {
            case 'IMAGE':
                return this.getImageWorkoutPreviewCover(uri)
            case 'VIDEO':
                return this.getVideoWorkoutPreviewCover(uri)
            default:
                return (
                    //In this case render information about the workout
                    <View style={{ borderRadius: 10, borderWidth: 1, borderColor: '#FFFFFF', width: '100%', height: '100%', backgroundColor: 'black' }}>

                    </View>
                )
        }
    }

    getVideoWorkoutPreviewCover = (uri) => {
        try {
            return (
                <Video
                    source={{ uri: uri }}
                    rate={1.0}
                    volume={0}
                    isMuted={true}
                    resizeMode="cover"
                    shouldPlay={false}
                    isLooping={false}
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: '#FFFFFF',
                    }}
                />



            )
        } catch (err) {
            alert(err)
            return (

                <View style={{ flex: 1, borderRadius: 10, backgroundColor: '#212121', color: 'white', justifyContent: 'center', justifyContent: 'center' }}>
                    <Text>
                        Sorry it looks like something went wrong.  Try loading the workout again to get the video.
                   </Text>
                </View>
            )
        }
    }

    getImageWorkoutPreviewCover = (uri) => {
        return (
            <Image source={{ uri: uri }} resizeMethod='scale' resizeMode='cover' style={{ borderRadius: 10, borderWidth: 1, borderColor: '#FFFFFF', width: '100%', height: '100%' }} />
        )
    }

    renderContent = () => {
        if (!this.state.ready) {
            return (
                <View style={{ width: '100%', height: '100%', backgroundColor: 'black' }}>

                </View>
            )
        }

        if (this.state.currentWorkout.workout_media.media_type == null || typeof (this.state.currentWorkout.workout_media.media_type) == 'undefined') {
            return (
                <View style={{ width: '100%', height: '100%', backgroundColor: 'black' }}>

                </View>
            )
        }

        const workoutMediaType = this.state.currentWorkout.workout_media.media_type
        switch (workoutMediaType) {
            case 'IMAGE':
                return this.getWorkoutImageMedia(this.state.currentWorkout.workout_media.uri);
            case 'VIDEO':
                return this.getWorkoutVideoMedia(this.state.currentWorkout.workout_media.uri);
            default:
                return (
                    //In this case render information about the workout
                    <View style={{ width: '100%', height: '100%', backgroundColor: 'black' }}>

                    </View>
                )
        }
    }

    getWorkoutImageMedia = (uri) => {
        try {
            return <Image source={{ uri: uri }} style={{ width: '100%', height: '100%' }} resizeMethod="scale" resizeMode="cover" />
        } catch (error) {

            return (

                <View style={{ flex: 1, backgroundColor: '#212121', color: 'white', justifyContent: 'center', justifyContent: 'center' }}>
                    <Text>
                        Sorry it looks like something went wrong.  Try loading the workout again to get the video.
                   </Text>
                </View>
            )
        }
    }

    getWorkoutVideoMedia = (uri) => {
        try {
            return (
                <>
                    <Video
                        source={{ uri: uri }}
                        rate={1.0}
                        volume={0}
                        isMuted={true}
                        resizeMode="cover"
                        shouldPlay={this.state.playVideo}
                        isLooping={true}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        {renderVideoIcon()}
                    </Video>



                </>
            )
        } catch (err) {
            alert(err)
            return (

                <View style={{ flex: 1, backgroundColor: '#212121', color: 'white', justifyContent: 'center', justifyContent: 'center' }}>
                    <Text>
                        Sorry it looks like something went wrong.  Try loading the workout again to get the video.
                   </Text>
                </View>
            )
        }

    }

    renderVideoIcon = () => {
        return this.state.playVideo == true ?
            <ThinFeatherIcon
                thin={true}
                name="pause-circle"
                size={30}
                color="#FFFFFF"
                onPress={() => this.setState({ playVideo: false })}
                style={{ alignSelf: 'center', alignItems: 'center', justifyContent: 'center', padding: 10 }} />
            :
            <ThinFeatherIcon
                thin={true}
                name="play-circle"
                size={30}
                color="#FFFFFF"
                onPress={() => this.setState({ playVideo: true })}
                style={{ alignSelf: 'center', alignItems: 'center', justifyContent: 'center', padding: 10 }}
            />
    }

    handleShowInteractionRBSheet = async () => {
        this.setState({ liveWorkoutOptionsVisible: false })
        if (this.state.playVideo === true) {
            this.setState({ playVideo: false })
        }

        this.interactionRBSheet.current.open()
    }

    handleShareProgram = async () => {
        this.setState({ liveWorkoutOptionsVisible: false })
        if (this.state.playVideo === true) {
            this.setState({ playVideo: false })
        }

        this.props.navigation.push('ShareProgramModal', {
            programData: this.state.programData
        })
    }

    handleCloseLiveWorkout = () => {
        this.closeLiveWorkoutOptionsModal()
        this.props.navigation.pop()
    }

    openRestTimesRBSheet = () => {
        this.restTimesRBSheet.current.open();
    }

    closeRestTimesRBSheet = () => {
        this.restTimesRBSheet.current.close();
    }

    openTempoRBSheet = () => {
        this.tempoRBSheet.current.open();
    }

    closeTempoRBSheet = () => {
        this.tempoRBSheet.current.close()
    }

    advanceExercise = () => {
        const currentWeek = this.state.currentWeek;
        if (this.state.currentWorkoutIndex === this.state.currentWorkoutStructure.length - 1) {
            this.setState({
                showFinishedDayDialog: true
            });

            return;
        }

        this.setState({ restTimerVisible: true, restTimerStarted: true, });

        if (this.state.currentWorkout.workout_sets == 1) {
            this.setState(prevState => {
                return {
                    currentWorkout: this.state.currentWorkoutStructure[prevState.currentWorkoutIndex + 1],
                    currentWorkoutIndex: prevState.currentWorkoutIndex + 1
                }
            });
        } else if (this.state.currentWorkout.workout_sets > 1) {
            let currentWorkout = this.state.currentWorkout
            currentWorkout.workout_sets = currentWorkout.workout_sets - 1;
            this.setState({
                currentWorkout: currentWorkout
            })
        }
    }

    renderWorkoutReps = () => {
        if (typeof (this.state.currentWorkout.workout_name) == 'undefined' || this.state.currentWorkout.workout_name == '') {
            return "-"
        }

        return this.state.currentWorkout.workout_reps
    }

    renderWorkoutSets = () => {
        if (typeof (this.state.currentWorkout.workout_name) == 'undefined' || this.state.currentWorkout.workout_name == '') {
            return "-"
        }

        return this.state.currentWorkout.workout_sets
    }

    renderWorkoutTempo = () => {
        return this.state.currentWorkout.workout_tempo
    }

    renderWorkoutRestTime = () => {
        return this.state.currentWorkout.workout_rest_time
    }

    showDialog = () => this.setState({ showFinishedDayDialog: true })

    hideDialog = () => this.setState({ showFinishedDayDialog: false })

    renderComponentDisplay = () => {
        if (this.state.ready === true && this.state.componentDidErr === false && typeof (this.state.programData) != 'undefined') {
            return (
                <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                    <View onLayout={event => this.setState({ mediaContainerHeight: event.nativeEvent.layout.height })} style={{ flex: 2.5, alignItems: 'center', justifyContent: 'center' }}>

                        <Surface style={{ backgroundColor: 'black', flex: 1, elevation: 0, borderRadius: 8, width: Dimensions.get('window').width }}>
                            <Video
                                source={require('../../videos/pushuppreview.mov')}
                                rate={1.0}
                                volume={0}
                                isMuted={true}
                                resizeMode="cover"
                                shouldPlay={true}
                                isLooping={true}
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100%',
                                    height: '100%',
                                }}
                            />
                        </Surface>
                    </View>

                    <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                        <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
                            <Text style={{ fontFamily: 'Avenir-Heavy' }}>
                                {this.state.currentWorkout.workout_name}
                            </Text>
                        </View>

                        <View style={{  alignItems: 'center', justifyContent: 'center' }}>

                            <Text style={{fontFamily: 'Avenir-Heavy'}}>
                                Week {this.state.currentWeek + 1}
                            </Text>
                        </View>
                    </View>


                    <Divider style={{ width: '100%' }} />
                    <View style={{ flex: 1.5, justifyContent: 'flex-start', alignItems: 'center' }}>
                    <View style={{ marginVertical: 10, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                            <View style={{ alignItems: 'flex-start', paddingHorizontal: 20 }}>
                                <Text style={{ paddingVertical: 3 }}>
                                    Sets
                        </Text>
                                <View style={{ width: 160, backgroundColor: '#E5E5E5', borderWidth: 1.2, borderRadius: 3, borderColor: 'rgb(218, 221, 234)', paddingHorizontal: 50, paddingVertical: 5, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ flexWrap: 'nowrap', fontFamily: 'Avenir-Light' }}>
                                        {this.renderWorkoutSets()}
                                    </Text>
                                </View>
                            </View>
                        
                            <View style={{ alignItems: 'flex-start', paddingHorizontal: 20 }}>
                                <Text style={{ paddingVertical: 3 }}>
                                    Reps
</Text>
                                <View style={{ width: 160, backgroundColor: '#E5E5E5', borderWidth: 1.2, borderRadius: 3, borderColor: 'rgb(218, 221, 234)', paddingHorizontal: 50, paddingVertical: 5, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontFamily: 'Avenir-Light' }}>
                                        {this.renderWorkoutReps()}
                                    </Text>
                                </View>
                            </View>

                        </View>



                 
                        <View style={{ marginVertical: 10, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                        <TouchableWithoutFeedback onPress={() =>  this.openTempoRBSheet()}>
                            <View style={{ alignItems: 'flex-start', paddingHorizontal: 20 }}>
                                <Text style={{ paddingVertical: 3 }}>
                                    Tempo
                        </Text>
                                <View style={{ width: 160, backgroundColor: '#E5E5E5', borderWidth: 1.2, borderRadius: 3, borderColor: 'rgb(218, 221, 234)', paddingHorizontal: 50, paddingVertical: 5, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ flexWrap: 'nowrap', fontFamily: 'Avenir-Light' }}>
                                        {this.renderWorkoutTempo()}
                                    </Text>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                        
                        <TouchableWithoutFeedback onPress={() =>  this.openRestTimesRBSheet()}>
                            <View style={{ alignItems: 'flex-start', paddingHorizontal: 20 }}>
                                <Text style={{ paddingVertical: 3 }}>
                                    Rest Time
</Text>
                                <View style={{ width: 160, backgroundColor: '#E5E5E5', borderWidth: 1.2, borderRadius: 3, borderColor: 'rgb(218, 221, 234)', paddingHorizontal: 50, paddingVertical: 5, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontFamily: 'Avenir-Light' }}>
                                        {this.state.restTime}
                                    </Text>
                                </View>
                            </View>
                            </TouchableWithoutFeedback>

                        </View>





                    </View>

                    <View>
                            <Button 
                            color="#23374d"
                            onPress={() => this.advanceExercise()}
                            mode="contained"
                            style={{alignSelf: 'center', elevation: 8, borderRadius: 15}}
                            contentStyle={{ height: 45, width: Dimensions.get('window').width - 50}}
                            >
                                Next Exercise
                            </Button>
                    </View>

                </SafeAreaView>
            )
        } else if (this.state.componentDidErr) {
            return (
                <View style={{ flex: 1, paddingVertical: 100, paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center' }}>

                    <Text style={{ fontSize: 15, fontFamily: 'HelveticaNeue' }}>
                        It looks like something wrong.  Try again later.
                        </Text>
                    <Button onPress={() => this.props.navigation.pop()} uppercase={false} mode="text" color="#1089ff" icon={() => <FeatherIcon name="arrow-left" color="#1089ff" />}>
                        Try again later
                        </Button>

                </View>
            )
        } else {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>
                        Loading your program...
                    </Text>
                </View>
            )
        }
    }


    handleCompleteWorkout = () => {
        const lastCompletedWorkoutData = {
            dateCompleted: new Date(),
            workoutUUID: this.state.programData.program_structure_uuid
        }

        this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('last_completed_workout', lastCompletedWorkoutData)
        this.hideDialog();
    }

    renderDescriptionDialog = () => {
        return (
            <Portal>
                <Dialog visible={this.state.descriptionDialogVisible}>
                    <Dialog.Content>
                        <Paragraph>
                            {this.state.programData.program_description}
                        </Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button color="#1089ff" onPress={() => this.setState({ descriptionDialogVisible: false })}>Done</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        )
    }

    renderTempoRBSheetPicker = () => {
        return (
            <RBSheet
                ref={this.tempoRBSheet}
                height={250}
                dragFromTopOnly={true}
                closeOnDragDown={true}
                customStyles={{
                    wrapper: {

                    },
                    container: {
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20
                    },
                    draggableIcon: {
                        backgroundColor: 'rgb(220, 220, 220)',
                    }
                }}
            >
                <View style={{ flex: 1 }}>
                    <View style={{ width: '100%' }}>
                        <Button color="#1089ff" style={{ alignSelf: 'flex-end' }} mode="text" onPress={this.closeTempoRBSheet}>
                            <Text>
                                Done
                        </Text>
                        </Button>
                    </View>

                    <Picker
                        selectedValue={this.state.restTime}
                        style={{ height: '100%', width: '100%' }}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({ currTempo: itemValue })
                        }>
                        {
                            tempoArr.map(time => {
                                return <Picker.Item label={time.toString()} value={time} />
                            })
                        }
                    </Picker>
                </View>
            </RBSheet>
        )
    }

    renderRestTimerRBSheetPicker = () => {
        return (
            <RBSheet
                ref={this.restTimesRBSheet}
                height={250}
                dragFromTopOnly={true}
                closeOnDragDown={true}
                customStyles={{
                    wrapper: {

                    },
                    container: {
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20
                    },
                    draggableIcon: {
                        backgroundColor: 'rgb(220, 220, 220)',
                    }
                }}
            >
                <View style={{ flex: 1 }}>
                    <View style={{ width: '100%' }}>
                        <Button color="#1089ff" style={{ alignSelf: 'flex-end' }} mode="text" onPress={this.closeRestTimesRBSheet}>
                            <Text>
                                Done
                        </Text>
                        </Button>
                    </View>

                    <Picker
                        selectedValue={this.state.restTime}
                        style={{ height: '100%', width: '100%' }}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({ restTime: itemValue })
                        }>
                        {
                            restTimesArr.map(time => {
                                return <Picker.Item label={time.toString()} value={time} />
                            })
                        }
                    </Picker>
                </View>
            </RBSheet>
        )
    }

    renderLiveWorkoutTitle = () => {
        if (this.state.ready) {
            if (this.props.route.params.programData) {
                return this.props.route.params.programData.program_name;
            } else if (this.props.route.params.uuid) {
                if (this.props.route.params.workoutType == 'WORKOUT') {
                    return null;
                } else if (this.props.route.params.workoutType == 'PROGRAM') {
                    return this.state.programData.program_name;
                }
            }
        } else {
            return null;
        }

    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Appbar.Header style={{ backgroundColor: '#1089ff', elevation: 0 }}>
                    <Appbar.Action icon={() => <FeatherIcon name="x" size={20} onPress={this.showWarningDialog} />} />

                    <Appbar.Content title={this.renderLiveWorkoutTitle()} titleStyle={{ alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 20 }} />

                        <TouchableWithoutFeedback style={{ position: 'absolute', bottom: 0, left: 0, marginLeft: 20 }} onPress={() => this.setState({ liveWorkoutOptionsVisible: true })}>
                            <Surface style={{ marginVertical: 5, elevation: 8, width: 35, height: 35, borderRadius: 65 }}>
                                {this.props.lupa_data.Users.currUserData.photo_url == '' ?
                                    null
                                    :
                                    <Avatar.Image style={{ flex: 1 }} size={35} source={{ uri: this.props.lupa_data.Users.currUserData.photo_url }} />
                                }
                            </Surface>
                        </TouchableWithoutFeedback>
                </Appbar.Header>

                {this.renderComponentDisplay()}
                {this.renderFinishWorkoutWarningDialog()}
                {typeof (this.props.route.params.programData) == 'undefined' ? null : this.renderDescriptionDialog()}
                {this.renderRestTimerRBSheetPicker()}
                {this.renderTempoRBSheetPicker()}

                <RestTimer restTime={this.state.restTime} isVisible={this.state.restTimerVisible} timerHasStarted={this.state.restTimerStarted} closeModal={() => this.setState({ restTimerVisible: false })} />
                <WorkoutFinishedModal isVisible={this.state.showFinishedDayDialog} closeModal={this.hideDialog} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        margin: 0,
        backgroundColor: "#FFFFFF",
        flex: 1
    },
    container: {

    },
    interactionSurface: {
        flex: 1,
        borderRadius: 15, elevation: 0,
        alignItems: "center",
        justifyContent: "center"
    },
    interactionSurfaceText: {
        fontFamily: 'avenir-roman',
        fontSize: 20,

    },
    RBSheetText: {
        color: 'white'
    },
    interactionsTitleText: {
        fontSize: 15,
        color: 'white',
    },
    interactionsSubtitleText: {
        fontSize: 12,
        color: 'white',
    }
})

export default connect(mapStateToProps)(LiveWorkout);
