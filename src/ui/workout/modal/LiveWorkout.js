import React, { useState, useEffect } from 'react';

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
    ActivityIndicator,
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
import InPersonWorkout from '../component/InPersonWorkout';
import { useSelector } from 'react-redux';

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

const daysOfTheWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
]

function NoExercisesDialogVisible({ isVisible, programData, captureWeekAndDay }) {
    const currUserData = useSelector(state => {
        return state.Users.currUserData
    });

    const [day, setDay] = useState('')
    const [week, setWeek] = useState(0)
    const [weeks, setWeeks] = useState(0)

    const navigation = useNavigation();

    const renderCycles = (weekParam, structure) => {
        return Object.keys(structure).map((week, index, arr) => {
            return (
                <View>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Text>
                        Workout {(index + 1).toString()}
                    </Text>
    
                    <Button color="#1089ff" uppercase={false} onPress={() => captureWeekAndDay(weekParam, index)}>
                        <Text style={{fontSize: 12}}>
                            Launch Workout
                        </Text>
                    </Button>
                    </View>
    
                    <View>
                        {
                            structure[week].map((exercise, index, arr) => {
                                return(
                                    <View style={{justifyContent: 'flex-start'}}>
                                          <Text> {exercise.workout_name} </Text>
                                          <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                              <Caption>
                                                  Sets {exercise.workout_sets}
                                              </Caption>
                                             <Text>
                                                 {" "}
                                             </Text>
                                              <Caption>
                                                  Reps {exercise.workout_reps}
                                              </Caption>
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

    const renderWorkoutContent = () => {
        return (
        <View style={{flex: 1}}>
            {
                programData.program_workout_structure.map((weekStructure, index, arr) => {
                    return (
                        <>
                       <View style={{padding: 10}}>
    
                           <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                           <Text style={styles.weekHeaderText}>
                               Week {index + 1}
                           </Text>

                           </View>
    
    
                                           
                                            <View>
    
                                                {renderCycles(index, weekStructure['workouts'])}
                                                </View>
    
                        </View>
                        <Divider />
                        </>
                    )
                })
            }
        </View>
        )
    }

    const renderSessionControls = () => {
        if (currUserData.user_uuid == programData.program_owner) {
            return (
                <ScrollView>
                    {renderWorkoutContent()}
                </ScrollView>
            )
        } else {
            return (
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
 <ActivityIndicator style={{alignSelf: 'center'}} animating={true} color="#1089ff" />
                </View>
            )

        }
    }

    return (
        <Dialog visible={isVisible} style={{borderRadius: 20, height: Dimensions.get('window').height / 2}}>
            <Dialog.Title>
                Waiting for trainer to start the session.
            </Dialog.Title>
            <Divider />
            {renderSessionControls()}
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
 
        const { workoutMode, sessionID, week, day } = this.props.route.params;
        await this.setupLiveWorkout()
        this.workoutService = new LiveWorkoutService(sessionID, this.state.programOwnerData, [], this.state.programData, week, week);
        await this.workoutService.initLiveWorkoutSession();

        if (workoutMode == LIVE_WORKOUT_MODE.CONSULTATION) {
            this.setState({
                hasWorkouts: true,
                ready: true
            })
        } else {
            const sessionIDNumber = await this.workoutService.getCurrentSessionIDNumber()
            const refString = LIVE_SESSION_REF.toString() + sessionIDNumber.toString();
            await LUPA_DB_FIREBASE.ref(refString.toString()).on('value', (snapshot) => {
                const data = snapshot.val();
    
                var newState = Object.assign({}, data);
                this.setState({ ...newState });
            })
        }

        this.workoutService.addParticipant(this.props.lupa_data.Users.currUserData);
        await this.setState({ ready: true });

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
                    <Text style={{fontFamily: 'Avenir-Light', color: 'white'}}>
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

    renderContent = () => {
        if (!this.state.ready || this.state.hasWorkouts == false) {
            return (
                <View style={{flex: 1,  backgroundColor: 'black' }}>
                    <Text>
                        Loading trainer content...
                    </Text>
                </View>
            )
        }


        if (typeof(this.state.currentWorkout) == 'undefined') {
            return (
                <View style={{flex: 1, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center' }}>
                     <Text style={{color: 'white', paddingHorizontal: 20, alignSelf: 'center'}}>
                      We couldn't find another exercise in this workout.  Click the menu in the top right to choose another workout or refresh this one.
                    </Text>
                </View>
            )
        }

        let uri = "";
        if (this.state.currentWorkout && this.state.currentWorkout.workout_media) {
            uri = this.state.currentWorkout.workout_media.uri;
        } else {
            uri = "";
        }

        if (uri == "" || uri == `""""` || uri == `""` || uri == typeof(uri) == 'undefined') {

            return (
                <View style={{flex: 1, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{color: 'white', paddingHorizontal: 20, alignSelf: 'center'}}>
                        Oops.  This is embarassing.  Click the menu in the top right to choose another workout or refresh this one.
                    </Text>
                </View>
            )
        }

        return (
            <Video 
                source={{ uri: uri }}
                    rate={1.0}
                    isMuted={false}
                    resizeMode="cover"
                    shouldPlay={true}
                    isLooping={true}
                    style={{
                        backgroundColor: 'black',
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        }}
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

            if (ready == false || hasWorkouts == false || this.state.labelData.length <= 0 || this.state.timelineData.length <= 0) {
                return <View />
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
                            labelColor: '#FFFFFF',
                            labelSize: 10,
                            currentStepLabelColor: '#FFFFFF'
                        }}
                    /> 
                )
        } catch (error) {
            return <Caption> Error loading workout steps. </Caption>;
        }
    }

    renderTemplateTrainingDisplay = () => {
        return (
            <View style={{ flex: 1 }}>
            <View style={{flex: 1}}>
                {this.renderContent()}
            </View>
            <Divider />
            <View style={{position: 'absolute', width: Dimensions.get('window').width, bottom: 0, height: 300,  justifyContent: 'space-evenly'}}>
            <View style={{height: 80}}>
                <Text style={{color: '#FFFFFF', fontSize: 12, paddingHorizontal: 10, fontFamily: 'Avenir-Medium'}}>
                    Participants
                </Text>
                <ScrollView horizontal>
                    {this.renderParticipants()}
                </ScrollView>
            </View>
            <Divider />
                <View style={{height: 200, width: Dimensions.get('window').width,  flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
           
            <View style={{flex: 1, alignItems: 'center', flexDirection: 'row'}}>
                <View style={{flex: 0.5, width: 80, height: 80}}>
                    {this.renderImageSource(this.state.currentWorkout)}
                </View>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-evenly'}}>
                <View style={{ width: '100%', marginVertical: 10,  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                        <Text style={{fontSize: 12, color: '#FFFFFF', paddingVertical: 2}}>
                            Sets ({this.renderWorkoutSets()})
                        </Text>


                        <Text style={{fontSize: 12, color: '#FFFFFF', paddingVertical: 2}}>
                            Tempo ( {this.renderWorkoutTempo()})
                        </Text>
                </View>

                <View style={{width: '100%', marginVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
               

                        <Text style={{fontSize: 12, color: '#FFFFFF', paddingVertical: 2}}>
                            Reps ({this.renderWorkoutReps()})
                        </Text>

                    <Text style={{fontSize: 12, color: '#FFFFFF', paddingVertical: 2}}>
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
            <View style={{height: 80, padding: 3, justifyContent: 'center'}}>
                {this.renderStepIndicator()}
            </View>
            <SafeAreaView />
            </View>

        </View>
        )
    }

    renderRemoteCoachingDisplay = () => {
        return;
    }

    renderInPersonDisplay = () => {
        const { sessionID } = this.props.route.params;
        return (
         <View style={{ flex: 1 }}>
              <InPersonWorkout currentWorkoutID={this.state.currentWorkout.workout_uid} currentWorkoutStructure={this.state.currentWorkoutStructure} programData={this.state.programData} sessionID={sessionID} currWeek={this.state.currentWeek} currDay={this.state.currentWorkoutDay} />
            <View style={{height: 50, backgroundColor: 'white'}}>
                <Text style={{color: '#AAAAAA', fontSize: 12, paddingHorizontal: 10, fontFamily: 'Avenir-Medium'}}>
                    Participants
                </Text>
                <ScrollView horizontal>
                    {this.renderParticipants()}
                </ScrollView>
            </View>
            <Divider />
                <View style={{backgroundColor: 'white', flex: 0.4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
           
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
            <View style={{backgroundColor: 'white', flex: 0.2, padding: 3, justifyContent: 'center'}}>
                {this.renderStepIndicator()}
            </View>
        </View>
        )
    }

    renderComponentDisplay = () => {
        const { workoutMode, sessionID, booking } = this.props.route.params;
        const { ready, componentDidErr, programData } = this.state;

        if (this.state.hasWorkouts == false) {
            return (
                <View style={styles.container}>

                </View>
            )
        }

        if (ready === true && componentDidErr === false && typeof (programData) != 'undefined') {
            switch(workoutMode) {
                case LIVE_WORKOUT_MODE.TEMPLATE:
                    return this.renderTemplateTrainingDisplay()
              /*  case LIVE_WORKOUT_MODE.IN_PERSON: // create screen - TODO
                    return this.renderInPersonDisplay() */
                case LIVE_WORKOUT_MODE.CONSULTATION:
                    return ( 
                        <VirtualSession 
                        booking={booking}
                        closeSession={this.handleCloseLiveWorkout}
                        sessionID={sessionID}
                        programUID={this.state.programData.program_structure_uuid}
                        isFirstSession={true}
                        />
                    )
                case LIVE_WORKOUT_MODE.VIRTUAL:
                    return (
                        <VirtualSession 
                            booking={booking}
                            closeSession={this.handleCloseLiveWorkout}
                            sessionID={sessionID}
                            programUID={this.state.programData.program_structure_uuid}
                            isFirstSession={false}
                            currentWeek={this.workoutService.getCurrentWeek()}
                            currentDay={-2}
                            />
                        )
                default:
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

    captureWeekAndDay = (week, day) => {
        this.workoutService.changeWeekAndDay(week, day);
    }

    /*****  Virtual Workout */



    /************ */

    render() {
        return (
            <>
               
                {this.renderComponentDisplay()}
                {this.renderFinishWorkoutWarningDialog()}
                {this.renderRestTimerRBSheetPicker()}
                <Appbar.BackAction color="white" style={{position: 'absolute', top: Constants.statusBarHeight, left: 0}} onPress={this.showWarningDialog} />
          
                <WorkoutFinishedModal isVisible={this.state.showFinishedDayDialog} closeModal={this.hideDialog} />
                <NoExercisesDialogVisible captureWeekAndDay={(week, day) => this.captureWeekAndDay(week, day)} programData={this.state.programData} isVisible={!this.state.hasWorkouts} />
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
    },
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
