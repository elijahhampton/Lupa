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
import LUPA_DB, { Fire, LUPA_DB_FIREBASE } from '../../../controller/firebase/firebase';
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
import LiveWorkoutService, { LIVE_SESSION_REF } from '../../../common/service/LiveWorkoutService';
import StepIndicator from 'react-native-step-indicator';
import { InputAccessoryView } from 'react-native';
import { getDayOfTheWeekStringFromDate } from '../../../common/service/DateTimeService';
import { LIVE_WORKOUT_MODE } from '../../../model/data_structures/workout/types';
import VirtualSession from '../../sessions/virtual/VirtualSession';

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

function NoExercisesDialogVisible({ isVisible }) {
    const navigation = useNavigation();

    return (
        <Dialog visible={isVisible}>
            <Dialog.Title>
                You don't have any exercises scheduled for today.
            </Dialog.Title>
            <Dialog.Content>
                <Paragraph>
                    Check back tomorrow to see if there are any exercises scheduled for you.
                </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
                <Button color="#23374d" onPress={() => navigation.pop()}>
                    Okay
                </Button>
            </Dialog.Actions>
        </Dialog>
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
            showFinishedDayDialog: false,
            restTimerStarted: false,
            restTimerVisible: false,
            descriptionDialogVisible: false,
            restTime: 3,
            previousWorkout: getLupaExerciseStructure("", "", "", ""),
            nextWorkout: getLupaExerciseStructure("", "", "", ""),
            participants: [],
            timelineData: [],
            labelData: [],
            hasWorkouts: true,
            noWorkoutsDialogVisible: false,
            completed_exercise_weight_used: 0,
            completed_exercise_one_rep_max: 0,
            isEditingOneRepMax: false,
            isEditingWeightUsed: false,
            videoPlaylistIndex: 0,
            videoPlaylist: []
        }
    }

    async componentDidMount() {

        const { sessionID } = this.props.route.params;
        await this.setupLiveWorkout();
        this.workoutService = new LiveWorkoutService(sessionID, this.state.programOwnerData, [], this.state.programData);
        await this.workoutService.initLiveWorkoutSession();
        const sessionIDNumber = await this.workoutService.getCurrentSessionIDNumber()
        const refString = LIVE_SESSION_REF.toString() + sessionIDNumber.toString();
        await LUPA_DB_FIREBASE.ref(refString.toString()).on('value', (snapshot) => {
            const data = snapshot.val();

            var newState = Object.assign({}, data);
            this.setState({ ...newState }, () => {
                if (this.state.hasWorkouts == false) {
                    this.setState({ noWorkoutsDialogVisible: true })
                }
            })
        })

       {/* await LUPA_DB.collection('users').doc(this.props.lupa_data.Users.currUserData.user_uuid).onSnapshot(documentSnapshot => {
            const data = documentSnapshot.data();
            const completedExercises = data.completed_exercises;

            for (let i = 0; i < completedExercises.length; i++) {
                if (completedExercises[i].index == this.state.currentWorkout.index) {
                    if (completedExercises[i].one_rep_max == 0) {
                        this.setState({ isEditingOneRepMax: true })
                    } else {
                        this.setState({ isEditingOneRepMax: false })
                    }

                    if (completedExercises[i].exercise_weight == 0) {
                        this.setState({ isEditingWeightUsed: true })
                    } else {
                        this.setState({ isEditingWeightUsed: false })
                    }
                    
                    this.setState({ completed_exercise_weight_used: completedExercises[i].exercise_weight, completed_exercise_one_rep_max: completedExercises[i].one_rep_max })
                }
            }
        })*/}

        this.workoutService.addParticipant(this.props.lupa_data.Users.currUserData);
        await this.setState({ ready: true });
    }


    componentWillUnmount() {
        //  Fire.shared.off();
    }

    setupLiveWorkout = async () => {
        if (this.props.route.params.programData) {
            await this.setState({ programData: this.props.route.params.programData });

            await this.LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(this.props.route.params.programData.program_owner).then(data => {
                this.setState({ programOwnerData: data })
            });
        } else if (this.props.route.params.uuid) {
            try {
                let programData = getLupaProgramInformationStructure();
                switch (this.props.route.params.workoutType) {
                    case 'PROGRAM':
                        await this.LUPA_CONTROLLER_INSTANCE.getProgramInformationFromUUID(this.props.route.params.uuid).then(data => {
                            programData = data;
                            this.setState({ programData: data })
                        })

                        await this.LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(programData.program_owner).then(data => {
                            this.setState({ programOwnerData: data })
                        });
                        break;
                    case 'WORKOUT':
                        await this.LUPA_CONTROLLER_INSTANCE.getWorkoutInformationFromUUID(this.props.route.params.uuid).then(data => {
                            programData = data;
                            this.setState({ programData: data })
                        })

                        await this.LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(programData.program_owner).then(data => {
                            this.setState({ programOwnerData: data })
                        });
                        break;
                    default:
                        this.setState({ ready: false, componentDidErr: true })
                }

            } catch (err) {
                await this.setState({ ready: false, componentDidErr: true })
            }
        }
    }

    showWarningDialog = () => this.setState({ warningDialogShowing: true })

    hideWarningDialog = () =>  this.setState({ warningDialogShowing: false })

    handleCloseWarningDialog = () => {
        this.hideWarningDialog();
        this.props.navigation.pop();
    }

    renderParticipants = () => {
        const { participants } = this.state;
        return participants.map(user => {
            return (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Avatar.Image style={{ marginHorizontal: 10 }} size={25} source={{ uri: user.photo_url }} />
                    <Text style={{fontFamily: 'Avenir-Light'}}>
                        {user.display_name}
                    </Text>
                </View>
            )
        })
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

    playNext = async () => {
        if (this.state.videoPlaylistIndex == 0) {
            //increase the video index by one to load the next video source from the videoPlaylist array
            this.workoutService.playNext()
        }
    }

    videoUpdated = (playbackStatus) => {
        if (this.state.ready == true) {

        if (playbackStatus['didJustFinish']) {
            this.playNext();
          }
        }
    }

    renderContent = () => {
        if (!this.state.ready) {
            return (
                <View style={{ width: '100%', height: '100%', backgroundColor: 'white' }}>
                    <Text>
                        Loading trainer content...
                    </Text>
                </View>
            )
        }

        if (this.state.videoPlaylist[this.state.videoPlaylistIndex] == null || this.state.videoPlaylist[this.state.videoPlaylistIndex] == 'undefined') {
            return (
                <View style={{ width: '100%', height: '100%', backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
                    <Text>
                        Something went wrong with the video!
                    </Text>
                </View>
            )
        }

        const uri =  this.state.videoPlaylist[this.state.videoPlaylistIndex]

        return (
            <Video 
                onPlaybackStatusUpdate={playbackStatus => this.videoUpdated(playbackStatus)}
                source={{ uri: uri }}
                    rate={1.0}
                    isMuted={false}
                    resizeMode="cover"
                    shouldPlay={true}
                    isLooping={this.state.videoPlaylistIndex == 1 ? true : false}
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        }}
                    useNativeControls
            />
        )
    }

    handleCloseLiveWorkout = () => this.props.navigation.pop();

    openRestTimesRBSheet = () => this.restTimesRBSheet.current.open();

    closeRestTimesRBSheet = () => this.restTimesRBSheet.current.close();

    advanceExercise = () => this.workoutService.advanceWorkout();

    renderWorkoutReps = () => {
        const { currentWorkout } = this.state;
        if (currentWorkout && currentWorkout.workout_reps) {
            return currentWorkout.workout_reps;
        } else {
            return '-'
        }
    }

    renderWorkoutSets = () => {
        const { currentWorkout } = this.state;
        if (currentWorkout && currentWorkout.workout_sets) {
            return currentWorkout.workout_sets;
        } else {
            return '-'
        }
    }

    renderWorkoutTempo = () => {
        const { currentWorkout } = this.state;
        if (currentWorkout && currentWorkout.workout_tempo) {
            return currentWorkout.workout_tempo;
        } else {
            return '-'
        }
    }

    renderWorkoutRestTime = () => {
        const { currentWorkout } = this.state;
        if (currentWorkout && currentWorkout.workout_rest_time) {
            return currentWorkout.workout_rest_time;
        } else {
            return '-'
        }
    }


    showDialog = () => this.setState({ showFinishedDayDialog: true })

    hideDialog = () => this.setState({ showFinishedDayDialog: false })

    renderImageSource = (workout) => {
        const imageUri = workout.default_media_uri
        try {
            switch (imageUri) {
                case '':
                    return <Image source={''} style={{ flex: 1, alignSelf: 'center' }} />
                case 'Traps':
                    return <Image style={{ flex: 1, alignSelf: 'center' }} resizeMode="contain" source={require('../../images/buildworkout/singleworkout/Traps.png')} />
                case 'Chest':
                    return <Image style={{ flex: 1, alignSelf: 'center' }} resizeMode="contain" source={require('../../images/buildworkout/singleworkout/Chest.png')} />
                case 'Bicep':
                    return <Image style={{ flex: 1, alignSelf: 'center' }} resizeMode="contain" source={require('../../images/buildworkout/singleworkout/Bicep.png')} />
                case 'Calves':
                    return <Image style={{ flex: 1, alignSelf: 'center' }} resizeMode="contain" source={require('../../images/buildworkout/singleworkout/Calves.png')} />
                case 'Core':
                    return <Image style={{ flex: 1, alignSelf: 'center' }} resizeMode="contain" source={require('../../images/buildworkout/singleworkout/Core.png')} />
                case 'Glutes':
                    return <Image style={{ flex: 1, alignSelf: 'center' }} resizeMode="contain" source={require('../../images/buildworkout/singleworkout/Glutes.png')} />
                case 'Supr':
                    return <Image style={{ flex: 1, alignSelf: 'center' }} resizeMode="contain" source={require('../../images/buildworkout/singleworkout/Supr.png')} />
                case 'Triceps':
                    return <Image style={{ flex: 1, alignSelf: 'center' }} resizeMode="contain" source={require('../../images/buildworkout/singleworkout/Triceps.png')} />
                case 'Hip':
                    return <Image style={{ flex: 1, alignSelf: 'center' }} resizeMode="contain" source={require('../../images/buildworkout/singleworkout/Hip.png')} />
                default:
                    return <Image source={''} style={{ flex: 1, alignSelf: 'center' }} />
            }
        } catch (error) {
            return <Image source={''} style={{ flex: 1, alignSelf: 'center' }} />
        }
    }

    renderStepIndicator = () => {
        const { ready, hasWorkouts } = this.state;
        try {

            if ((ready || hasWorkouts) == false) {
                return;
            }

                return (
                <StepIndicator
                        labels={this.state.labelData}
                        currentPosition={this.state.currentWorkoutIndex}
                        steps={this.state.timelineData}
                        stepCount={this.state.timelineData.length}
                        customStyles={{
                            stepIndicatorSize: 25,
                            currentStepIndicatorSize: 30,
                            separatorStrokeWidth: 2,
                            currentStepStrokeWidth: 3,
                            stepStrokeCurrentColor: '#23374d', //outline
                            stepStrokeWidth: 3,
                            stepStrokeFinishedColor: '#23374d',
                            stepStrokeUnFinishedColor: '#23374d', //unfinished outline
                            separatorFinishedColor: '#23374d',
                            separatorUnFinishedColor: '#23374d',
                            stepIndicatorFinishedColor: '#23374d',
                            stepIndicatorUnFinishedColor: '#23374d',
                            stepIndicatorCurrentColor: '#ffffff',
                            stepIndicatorLabelFontSize: 13,
                            currentStepIndicatorLabelFontSize: 13,
                            stepIndicatorLabelCurrentColor: '#23374d',
                            stepIndicatorLabelFinishedColor: '#ffffff',
                            stepIndicatorLabelUnFinishedColor: '#FFFFFF',
                            labelColor: '#23374d',
                            labelSize: 10,
                            currentStepLabelColor: '#23374d'
                        }}
                    /> 
                )
        } catch (error) {
            return <Caption> Error loading workout steps. </Caption>;
        }
    }

    renderTemplateTrainingDisplay = () => {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <View style={{flex: 3}}>
                {this.renderContent()}
            </View>
            <Divider />
            <View style={{flex: 1.5, justifyContent: 'space-evenly'}}>
            <View style={{flex: 0.2}}>
                <Text style={{color: '#AAAAAA', fontSize: 12, paddingHorizontal: 10, fontFamily: 'Avenir-Medium'}}>
                    Participants
                </Text>
                <ScrollView horizontal>
                    {this.renderParticipants()}
                </ScrollView>
            </View>
            <Divider />
                <View style={{flex: 0.4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
           
            <View style={{flex: 1, alignItems: 'center', flexDirection: 'row'}}>
                <View style={{flex: 0.5, width: 80, height: 80}}>
                    {this.renderImageSource(this.state.currentWorkout)}
                </View>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-evenly'}}>
                <View style={{ width: '100%', marginVertical: 10,  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                        <Text style={{fontSize: 12, color: '#AAAAAA', paddingVertical: 2}}>
                            Sets ({this.renderWorkoutSets()})
                        </Text>


                        <Text style={{fontSize: 12, color: '#AAAAAA', paddingVertical: 2}}>
                            Tempo ( {this.renderWorkoutTempo()})
                        </Text>
                </View>

                <View style={{width: '100%', marginVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
               

                        <Text style={{fontSize: 12, color: '#AAAAAA', paddingVertical: 2}}>
                            Reps ({this.renderWorkoutReps()})
                        </Text>

                    <Text style={{fontSize: 12, color: '#AAAAAA', paddingVertical: 2}}>
                            Intensity (0%)
                        </Text>
                    </View>
               
                </View>
            </View>

            <View style={{flex: 0.5, padding: 10, }}>
            <View style={{ height: 60, width: '100%', backgroundColor: '#23374d', justifyContent: 'flex-end',  alignSelf: 'center', borderRadius: 3 }}>
                        <TouchableOpacity 
                        disabled={this.state.hasWorkouts == false} 
                        style={{width: '100%', 
                        flex: 1,
                        backgroundColor: this.state.hasWorkouts == true ? '#23374d' : '#E5E5E5', 
                        borderRadius: 3, 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                        }} onPress={() => this.advanceExercise()}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 15, color: '#FFFFFF', fontFamily: 'Avenir-Heavy' }}>
                                    Advance Workout
                   </Text>

                            </View>
                        </TouchableOpacity>
                    </View>
            </View>
            </View>
            <View style={{flex: 0.2, padding: 3, justifyContent: 'center'}}>
                {this.renderStepIndicator()}
            </View>
            </View>
        </SafeAreaView>
        )
    }

    renderRemoteCoachingDisplay = () => {
        return;
    }

    renderInPersonDisplay = () => {
        return;
    }

    renderComponentDisplay = () => {
        const { workoutMode, sessionID } = this.props.route.params;
        const { ready, componentDidErr, programData } = this.state;

        if (ready === true && componentDidErr === false && typeof (programData) != 'undefined') {
            switch(workoutMode) {
                case LIVE_WORKOUT_MODE.TEMPLATE:
                    return this.renderTemplateTrainingDisplay()
                default:
              {/*  case LIVE_WORKOUT_MODE.CONSULTATION: //show virtual session with show exercises prop false
                    return ( <VirtualSession 
                            booking={this.props.route.booking}
                            closeSession={this.handleCloseLiveWorkout}
                            sessionID={sessionID}
                            programUID={this.state.programData.program_structure_uuid}
                            isFirstSession={true}
                            />
                            )
                case LIVE_WORKOUT_MODE.IN_PERSON: // create screen - TODO
                    return;
                case LIVE_WORKOUT_MODE.REMOTE_COACHING: //create screen - TODO
                    return;
                case LIVE_WORKOUT_MODE.VIRTUAL:
                    //if in person booking then show person if virtual then show virtual with show exercises prop true
              return ( <VirtualSession 
                            booking={this.props.route.booking}
                            closeSession={this.handleCloseLiveWorkout}
                            sessionID={sessionID}
                            programUID={this.state.programData.program_structure_uuid}
                            isFirstSession={false}
                            />
                        ) */}
            }
        } else if (componentDidErr || typeof(programData) == 'undefined') {
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

    renderRestTimerRBSheetPicker = () => {
        restTimesArr.push(this.state.currentWorkout.workout_rest_time);
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

    /*****  Virtual Workout */



    /************ */

    render() {
        return (
            <>
                <Appbar.Header style={{ backgroundColor: '#FFFFFF', elevation: 0 }}>
                    <Appbar.BackAction onPress={this.showWarningDialog} />
                    <Appbar.Content title={`Week ${this.state.currentWeek + 1}, ${this.state.currentWorkoutDay}`} titleStyle={{ alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 16 }} />
                        <Surface style={{ marginVertical: 5, elevation: 0, width: 35, height: 35, borderRadius: 65 }}>
                            {
                            this.props.lupa_data.Users.currUserData.photo_url
                            &&
                            <Avatar.Image 
                            style={{ flex: 1 }} 
                            size={35} 
                            source={{ uri: this.props.lupa_data.Users.currUserData.photo_url }} />
                            }
                        </Surface>
                </Appbar.Header>
                {this.renderComponentDisplay()}
                {this.renderFinishWorkoutWarningDialog()}
                {this.renderRestTimerRBSheetPicker()}
                <RestTimer
                    isVisible={this.state.restTimerVisible}
                    restTime={this.state.restTime}
                    currentExercise={this.state.currentWorkout}
                    closeModal={() => this.setState({ restTimerVisible: false })}
                />
                <WorkoutFinishedModal isVisible={this.state.showFinishedDayDialog} closeModal={this.hideDialog} />
                <NoExercisesDialogVisible isVisible={this.state.noWorkoutsDialogVisible} />
            </>
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
    },
    errorImageContainer: {
        flex: 1, backgroundColor: '#212121', color: 'white', justifyContent: 'center', justifyContent: 'center'
    }
})

export default connect(mapStateToProps)(LiveWorkout);

   /*renderOneRepMax = () => {
        try {
            if (this.state.completed_exercise_one_rep_max == '' || typeof (this.state.completed_exercise_one_rep_max) == 'undefined') {
                // this.setState({ isEditingOneRepMax: true })
                return '0'
            }

            return this.state.completed_exercise_one_rep_max.toString();
        } catch (error) {
            return '-'
        }
    }

    renderWeightUsed = () => {
        try {
            if (this.state.completed_exercise_weight_used == '' || typeof (this.state.completed_exercise_weight_used) == 'undefined') {
                // this.setState({ isEditingWeightUsed: true })
                return '0'
            }

            return this.state.completed_exercise_weight_used.toString();
        } catch (error) {
            return '-'
        }
    }

    updateWeightUsed = () => {
        const weightUsed = this.state.completed_exercise_weight_used;

        let completedExercises = []
        LUPA_DB.collection('users').doc(this.props.lupa_data.Users.currUserData.user_uuid).get().then(documentSnapshot => {
            completedExercises = documentSnapshot.data().completed_exercises;

            for (let i = 0; i < completedExercises.length; i++) {
                if (completedExercises[i].index == this.state.currentWorkout.index) {
                    this.setState({ completed_exercise_weight_used: weightUsed })
                    completedExercises[i].exercise_weight = weightUsed
                }
            }

            LUPA_DB.collection('users').doc(this.props.lupa_data.Users.currUserData.user_uuid).update({
                completed_exercises: completedExercises
            })
        }, (error) => {

        })

        this.setState({ isEditingWeightUsed: false })
    }

    updateOneRepMax = () => {
        const repMax = this.state.completed_exercise_one_rep_max;

        let completedExercises = []
        LUPA_DB.collection('users').doc(this.props.lupa_data.Users.currUserData.user_uuid).get().then(documentSnapshot => {
            completedExercises = documentSnapshot.data().completed_exercises;

            for (let i = 0; i < completedExercises.length; i++) {
                if (completedExercises[i].index == this.state.currentWorkout.index) {
                    this.setState({ completed_exercise_one_rep_max: repMax })
                    completedExercises[i].one_rep_max = repMax
                }
            }

            LUPA_DB.collection('users').doc(this.props.lupa_data.Users.currUserData.user_uuid).update({
                completed_exercises: completedExercises
            })
        }, (error) => {

        })

        this.setState({ isEditingOneRepMax: false })
    }

    renderWeightUsedDisplay = () => {
        if (this.state.isEditingWeightUsed == false) {
            return (
                <View style={{ width: 160, height: 30, backgroundColor: '#FFFFFF', borderWidth: 1.2, borderRadius: 3, borderColor: 'rgb(218, 221, 234)', paddingHorizontal: 20, paddingVertical: 5, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontFamily: 'Avenir-Light' }}>
                        {this.renderWeightUsed()}
                    </Text>
                </View>
            )
        } else {
            return (
                <View style={{alignSelf: 'center'}}>
                    <View style={{alignSelf: 'center', height: 30, width: 160, backgroundColor: '#FFFFFF', borderWidth: 1.2, borderRadius: 3, borderColor: '#1089ff', paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' }}>
                        <Input
                            onChangeText={text => this.setState({ completed_exercise_weight_used: text })}
                            value={this.renderWeightUsed()}
                            onEndEditing={this.updateWeightUsed}
                            onSubmitEditing={this.updateWeightUsed}
                            clearTextOnFocus={true}
                            containerStyle={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
                            inputContainerStyle={{ width: '100%', height: '100%', borderBottomWidth: 0, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}
                            inputStyle={{ alignSelf: 'center' }}
                            returnKeyLabel="submit"
                            returnKeyType="done"
                            keyboardType="numeric"
                        />
                    </View>
                    <Caption style={{ padding: 5 }}>
                        What was the weight used for this exercise?
            </Caption>

                </View>
            )
        }
    }

    renderOneRepMaxDisplay = () => {
        if (this.state.isEditingOneRepMax == false) {
            return (
                <View style={{ width: 160, height: 30, backgroundColor: '#FFFFFF', borderWidth: 1.2, borderRadius: 3, borderColor: 'rgb(218, 221, 234)', paddingHorizontal: 20, paddingVertical: 5, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontFamily: 'Avenir-Light' }}>
                        {this.renderOneRepMax()}
                    </Text>
                </View>
            )
        } else {
            return (
                <View>
                    <View style={{ height: 30, width: 160, backgroundColor: '#FFFFFF', borderWidth: 1.2, borderRadius: 3, borderColor: '#1089ff', paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' }}>
                        <Input
                            onChangeText={text => this.setState({ completed_exercise_one_rep_max: text })}
                            value={this.renderOneRepMax()}
                            onEndEditing={this.updateOneRepMax}
                            onSubmitEditing={() => this.setState({ isEditingOneRepMax: false })}
                            clearTextOnFocus={true}
                            containerStyle={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
                            inputContainerStyle={{ width: '100%', height: '100%', borderBottomWidth: 0, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}
                            inputStyle={{ alignSelf: 'center' }}
                            returnKeyLabel="submit"
                            returnKeyType="done"
                            keyboardType="numeric"
                        />
                    </View>
                    <Caption style={{ paddingVertical: 5 }}>
                        What was your one rep max?
            </Caption>
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
    
    
    
    */
