import * as React from 'react';

import {
    View,
    Text,
    StyleSheet,
    Modal,
    Image,
    SafeAreaView,
    TouchableHighlight,
} from 'react-native';

import {
    Surface,
    ActivityIndicator,
    Appbar,
    Button,
    IconButton,
    Avatar
} from 'react-native-paper';

import { Icon } from 'react-native-elements'

import ToggleSwitch from 'toggle-switch-react-native'
import { Video } from 'expo-av'
import FeatherIcon from "react-native-vector-icons/Feather"
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';
import StepIndicator from 'react-native-step-indicator';
import LupaController from '../../../controller/lupa/LupaController';
import ThinFeatherIcon from "react-native-feather1s";
import { LOG_ERROR } from '../../../common/Logger';
import { Constants } from 'react-native-unimodules';

  const chartConfig = {
    backgroundGradientFrom: "red",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5
  };

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

const customStyles = {
    stepIndicatorSize: 22,
    currentStepIndicatorSize: 25,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#2196F3',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#fe7013',
    stepStrokeUnFinishedColor: 'rgb(58,58,60)',
    separatorFinishedColor: '#1089ff',
    separatorUnFinishedColor: 'white',
    stepIndicatorFinishedColor: '#fe7013',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 10,
    currentStepIndicatorLabelFontSize: 10,
    stepIndicatorLabelCurrentColor: '#212121',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#212121',
    labelColor: '#212121',
    labelSize: 10,
    currentStepLabelColor: 'white'
}

const PROGRAM_SECTIONS = [
    "Warm Up",
    "Primary",
    "Break",
    "Secondary",
    "Cooldown",
]

function LoadingNextWorkoutActivityIndicator(props) {
    return (
        <Modal visible={false} presentationStyle="overFullScreen" style={{ alignItems: "center", justifyContent: "center", backgroundColor: "transparent", margin: 0 }} >
            <ActivityIndicator style={{ alignSelf: "center" }} animating={true} color="#03A9F4" size="large" />
        </Modal>
    )
}

function getMiniWorkoutContainerStyle(sectionWorkoutLength) {
    return sectionWorkoutLength > 0 ?
        { alignItems: "center", justifyContent: "center", }
        :
        {}
}

class LiveWorkout extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            programTitle: "",
            loadingNextWorkout: false,
            programDescription: "",
            programData:  this.props.route.params.programData,
            workoutData:  this.props.route.params.programData.program_workout_structure,
            currentStage: "",
            currentStageIndex: 0,
            currentStageData: [],
            currentWorkout: {},
            currentWorkoutIndex: 0,
            nextWorkout: "",
            nextStageData: [],
            timelineSectionHeight: 0,
            appBarY: 0,
            scrollViewY: 0,
            appBarHeight: 0,
            currentPosition: 0,
            currentTime: 0,
            stagesScheduled: [],
            switchEnabled: true,
            showPreview: true,
            currSwiperIndex: 0,
            playVideo: false,
        }
    }

    async componentDidMount() {
       await this.setupLiveWorkout()
    }

    setupLiveWorkout = async () => {
      /* let nextWorkoutIn, nextStageDataIn, currentStageIndexIn, currentWorkoutIndexIn, stagesScheduledIn = [];

        //Retrieve all stages that have workouts
        let result;
        for (let i = 0; i < PROGRAM_SECTIONS.length; i++) {
            result = await this.stageHasWorkouts(PROGRAM_SECTIONS[i]);

            if (result == true) {
                await stagesScheduledIn.push(PROGRAM_SECTIONS[i]);
            }
        }

        if (this.state.workoutData) {
            //get first stage
            let firstStageName = stagesScheduledIn[0];
            await this.setCurrentStageData(firstStageName);
            currentWorkoutIndexIn = 0;
            currentStageIndexIn = 0;

            //if the first stage we have set has more than one workout then we set nextworkout to the second
            //otherwise we move to the next scheduled stage
            if (this.state.currentStageData.length > 1) {
                nextWorkoutIn = this.state.currentStageData[1];
            }
            else {
                nextStageDataIn = await this.getStageData(stagesScheduledIn[1]);
                nextWorkoutIn = nextStageDataIn[0];
            }

            await this.setState({
                nextStageData: nextStageDataIn,
                currentStage: firstStageName,
                stagesScheduled: stagesScheduledIn,
                currentWorkout: this.state.currentStageData[0],
                nextWorkout: nextWorkoutIn,
                currentWorkoutIndex: currentWorkoutIndexIn,
                currentStageIndex: currentStageIndexIn,
                programFinished: false,
            })
        }
        */
    }

    stageHasWorkouts = (stage) => {
        switch (stage) {
            case "Warm Up":
                return this.state.workoutData.warmup.length > 0;
            case "Primary":
                return this.state.workoutData.primary.length > 0;
            case "Break":
                return this.state.workoutData.break.length > 0;
            case "Secondary":
                return this.state.workoutData.secondary.length > 0;
            case "Cooldown":
                return this.state.workoutData.cooldown.length > 0;
        }
    }

    setCurrentStageData = async (stage) => {
        let nextStageDataIn;
        switch (stage) {
            case "Warm Up":
                nextStageDataIn = await this.getStageData(this.state.stagesScheduled[this.state.currentStageIndex + 2]);
                await this.setState({ currentStageData: this.state.workoutData.warmup, currentStage: stage, currentWorkout: this.state.workoutData.warmup[0], currentWorkoutIndex: 0, nextStageData: nextStageDataIn });
                break;
            case "Primary":
                nextStageDataIn = await this.getStageData(this.state.stagesScheduled[this.state.currentStageIndex + 2]);
                await this.setState({ currentStageData: this.state.workoutData.primary, currentStage: stage, currenetWorkout: this.state.workoutData.primary[0], currentWorkoutIndex: 0, nextStageData: nextStageDataIn });
                break;
            case "Break":
                nextStageDataIn = await this.getStageData(this.state.stagesScheduled[this.state.currentStageIndex + 2]);
                await this.setState({ currentStageData: this.state.workoutData.break, currentStage: stage, currentWorkout: this.state.workoutData.break[0], currentWorkoutIndex: 0, nextStageData: nextStageDataIn });
                break;
            case "Secondary":
                nextStageDataIn = await this.getStageData(this.state.stagesScheduled[this.state.currentStageIndex + 2]);
                await this.setState({ currentStageData: this.state.workoutData.secondary, currentStage: stage, currentWorkout: this.state.workoutData.secondary[0], currentWorkoutIndex: 0, nextStageData: nextStageDataIn });
                break;
            case "Cooldown":
                await this.setState({ currentStageData: this.state.workoutData.cooldown, currentStage: stage, currentWorkout: this.state.workoutData.cooldown[0], currentWorkoutIndex: 0, nextStageData: nextStageDataIn });
                break;
        }
    }

    getStageData = (stage) => {
        switch (stage) {
            case "Warm Up":
                return this.state.workoutData.warmup;
            case "Primary":
                return this.state.workoutData.primary;
            case "Break":
                return this.state.workoutData.break;
            case "Secondary":
                return this.state.workoutData.secondary;
            case "Cooldown":
                return this.state.workoutData.cooldown;
        }
    }

    getCurrentWorkoutDescription = () => {
        return (
            <Text>
                This is a test description.  This is a test description.  This is a test description.  This is a test description.  This is a test description.  This is a test description.  This is a test description.  This is a test description.   This is a test description.  This is a test description.
            </Text>
        )
        
       // return this.state.currentWorkout.workout_description;
    }

    getNextWorkoutTitle = () => {
        if (this.state.currentStage == "Cooldown" && this.state.currentStageData[this.state.currentWorkoutIndex + 1] == undefined) {
            return "Finish";

        }

        return this.state.nextWorkout.workout_name;
    }

    handleCloseLiveWorkout = () => {
       // this.props.closeModalMethod();
       // this.setupLiveWorkout();
    }

    startWorkout = () => {

    }

    pauseWorkout = () => {

    }

    endWorkout = async () => {
        await this.setState({ programFinished: true, nextWorkout: "Finish" })
        await this.handleCloseLiveWorkout();
    }

    changeWorkout = async () => {
      let currentWorkoutIn, currentWorkoutIndexIn, currentStageIndexIn, currentStageIn, currentStageDataIn, nextWorkoutIn, nextStageDataIn;
        this.setState({ playVideo: false })
        if (this.state.programFinished) {
            await this.endWorkout();
        }


        //change stage if we are the end of a stage
        if (this.state.currentStageData[this.state.currentWorkoutIndex + 1] == undefined || this.state.nextWorkout == "" || this.state.currentStageData.length == this.state.currentWorkoutIndex) {
            //If we are at the end of a stage and that stage is cooldown - end workout
            if (this.state.currentStage == "Cooldown") {
                await this.endWorkout();
            }
            else //if we are at the end of a stage and it is not cooldown
            {
                await this.setCurrentStageData(this.state.stagesScheduled[this.state.currentStageIndex + 1]);
                currentStageIndexIn = this.state.currentStageIndex + 1;



                if (this.state.currentStageData.length > 1) {
                    nextWorkoutIn = this.state.currentStageData[1];
                }
                else {
                    let tempStageData = await this.getStageData(this.state.stagesScheduled[this.state.currentStageIndex + 1]);
                    nextWorkoutIn = tempStageData[0];
                }

                let nextStageDataIn;
                await this.state.stagesScheduled[this.state.currentStageIndex + 2] == undefined ? nextStageDataIn = "FINISH" : nextStageDataIn = await this.getStageData(this.state.stagesScheduled[this.state.currentStageIndex + 2])

                await this.setState({
                    nextStageData: nextStageDataIn,
                    nextWorkout: nextWorkoutIn,
                    currentStageIndex: currentStageIndexIn,
                })
            }

            return;
        }
        else //not at the end of stage
        {
            currentWorkoutIndexIn = this.state.currentWorkoutIndex + 1;
            currentWorkoutIn = this.state.currentStageData[this.state.currentWorkoutIndex + 1];
            nextWorkoutIn = this.state.currentStageData[this.state.currentWorkoutIndex + 2];

            if (nextWorkoutIn == "" || nextWorkoutIn == undefined)
            {
                let tempStageData = await this.getStageData(this.state.stagesScheduled[this.state.currentStageIndex + 1]);
                if (tempStageData == undefined)
                {
                    nextWorkoutIn = 'FINISH';
                }
                else
                {
                    nextWorkoutIn = tempStageData[0];
                }
            }

            await this.setState({
                currentWorkoutIndex: currentWorkoutIndexIn,
                currentWorkout: currentWorkoutIn,
                nextWorkout: nextWorkoutIn,
            })

        }
    }

    getTestDescription = () => {
        return (
            <Text>
                This is a test description.  This is a test description.  This is a test description.  This is a test description.  This is a test description.  This is a test description.  This is a test description.  This is a test description.   This is a test description.  This is a test description.
            </Text>
        )
    }

    onToggleSwitch = () => {
        this.setState({
            switchEnabled: !this.state.switchEnabled,
        })
    }

    getWorkoutMedia = () => {
        try {
            if ( this.state.currentWorkout.workout_media.media_type == "VIDEO")
            {
                return (
                    <>
                    <Video 
                    source={{ uri: this.state.currentWorkout.workout_media.uri }}
                    rate={1.0}
                    volume={0}
                    isMuted={true}
                    resizeMode="cover"
                    shouldPlay={this.state.playVideo}
                    isLooping={true}
                    style={{
                    width: "100%",
                    height: "100%",
                    borderTopRightRadius: 30, 
                    borderBottomRightRadius: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                    }}
                    >
                        

                    </Video>

                    </>
                )
            }
        } catch(err) {
            return (
            <View style={{flex: 1, backgroundColor: '#212121'}}>

            </View>
            )
        }
        
    }

    getVideoIcon = () => {
        return this.state.playVideo == true ?
                            null
                            :
                            <ThinFeatherIcon
                            thin={true}
                            name="play-circle" 
                            size={65} 
                            color="#FFFFFF"
                            onPress={() => this.setState({ playVideo: true })}
                            style={{alignSelf: 'center'}}
                          />
    }

    goToPreview = () => {
        this.setState({
            currSwiperIndex: 0
        })
    }

    goToWorkout = () => {
        this.setState({
            currSwiperIndex: 1
        })
    }

    goToWorkoutStats = () => {
        this.setState({
            currSwiperIndex: 2
        })
    }

    getCurrentUserAvatar = () => {
        try {
            return <Image style={{width: 50, height: 50, borderRadius: 50}} source={{uri: this.props.lupa_data.Users.currUserData.photo_url }} />
        } catch(error) {
            LOG_ERROR('LiveWorkout.js', 'Caught exception in getCurrentUserAvatar()', error);
            <Avatar.Icon size={50} name="help" color="#FFFFFF" style={{backgroundColor: '#212121'}}/>
        }
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Swiper loop={false} scrollEnabled={true} showsVerticalScrollIndicator={false} showsButtons={false} showsPagination={false} horizontal={false} index={this.state.currSwiperIndex}>
                    
                        <View style={{flex: 1}}>
                            <SafeAreaView style={{backgroundColor: '#212121'}} />
                            <View style={{flex: 3, backgroundColor: '#212121'}}>
                          
                                <View style={{flex: 4}}>

                                </View>
                                <View style={{flex: 0.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', backgroundColor: '#212121'}}>

                                <Icon
  reverse
  name='fullscreen'
  type='material'
  color='#1089ff'
  size={15}
  style={{elevation: 10}}
/>

                                <Icon
  reverse
  name='info'
  type='material'
  color='#1089ff'
  size={15}
  style={{elevation: 10}}
/>

<Icon
  reverse
  name='bookmark'
  type='material'
  color='#1089ff'
  size={15}
  style={{elevation: 10}}
/>

<Icon
  reverse
  name='vibration'
  type='material'
  color='#23374d'
  size={15}
  style={{elevation: 10}}
/>

<Icon
  reverse
  name='navigate-next'
  type='material'
  color='#1089ff'
  size={15}
  style={{elevation: 10}}
/>
                                </View>
                            </View>
                        <View style={{flex: 0.3, justifyContent: "center", backgroundColor: '#212121'}}>
                            <Button mode="text" color="#FFFFFF" style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                            <MaterialIcon name="arrow-drop-down" size={20}/>
                                <Text>
                                    Monday
                                </Text>
                            </Button>
                        </View>
                        <MaterialIcon onPress={() => this.props.navigation.pop()} name="close" color="white" size={26} style={{position: 'absolute', top: Constants.statusBarHeight, left: 0, margin: 16}} />
                        <SafeAreaView />
                    </View>
                     {
                         /*
                            View 3
                         */
                     }
                 {/*  <View style={{ flex: 1, padding: 15}}>
                        <SafeAreaView style={{ flex: 1 }}>
                            <View style={{padding: 15 }}>
                                <StepIndicator

                                    direction="horizontal"
                                    customStyles={customStyles}
                                    currentPosition={this.state.currentStageIndex}
                                    labels={PROGRAM_SECTIONS}
                                    stepCount={PROGRAM_SECTIONS.length}
                                    renderLabel={(labelRenderInfo) => {
                                        switch (labelRenderInfo.position) {
                                            case 0:
                                                return (
                                                    <View style={getMiniWorkoutContainerStyle(this.state.workoutData.warmup)}>
                                                        <Text style={{ alignSelf: "flex-start" }}>
                                                            {labelRenderInfo.label}
                                                        </Text>
                                                        <View style={[getMiniWorkoutContainerStyle(this.state.workoutData.warmup.length), { flexDirection: "row", flexWrap: "wrap" }]}>
                                                            {
                                                                this.state.workoutData.warmup ?
                                                                    this.state.workoutData.warmup.map(workout => {
                                                                        return (
                                                                            <MiniTimelineWorkout />
                                                                        )
                                                                    })
                                                                    :
                                                                    null
                                                            }
                                                        </View>
                                                    </View>
                                                )
                                            case 1:
                                                return (
                                                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                                                        <Text style={{ alignSelf: "center" }}>
                                                            {labelRenderInfo.label}
                                                        </Text>
                                                        <View style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", flexWrap: "wrap" }}>
                                                            {
                                                                this.state.workoutData.primary ?
                                                                    this.state.workoutData.primary.map(workout => {
                                                                        return (
                                                                            <MiniTimelineWorkout />
                                                                        )
                                                                    })
                                                                    :
                                                                    null
                                                            }
                                                        </View>
                                                    </View>
                                                )
                                            case 2:
                                                return (
                                                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                                                        <Text style={{ alignSelf: "center" }}>
                                                            {labelRenderInfo.label}
                                                        </Text>
                                                        <View style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", flexWrap: "wrap" }}>
                                                            {
                                                                this.state.workoutData.break ?
                                                                    this.state.workoutData.break.map(workout => {
                                                                        return (
                                                                            <MiniTimelineWorkout />
                                                                        )
                                                                    })
                                                                    :
                                                                    null
                                                            }
                                                        </View>
                                                    </View>
                                                )
                                            case 3:
                                                return (
                                                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                                                        <Text style={{ alignSelf: "center" }}>
                                                            {labelRenderInfo.label}
                                                        </Text>
                                                        <View style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", flexWrap: "wrap" }}>
                                                            {
                                                                this.state.workoutData.secondary ?
                                                                    this.state.workoutData.secondary.map(workout => {
                                                                        return (
                                                                            <MiniTimelineWorkout />
                                                                        )
                                                                    })
                                                                    :
                                                                    null
                                                            }
                                                        </View>
                                                    </View>
                                                )
                                            case 4:
                                                return (
                                                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                                                        <Text style={{ alignSelf: "center" }}>
                                                            {labelRenderInfo.label}
                                                        </Text>
                                                        <View style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", flexWrap: "wrap" }}>
                                                            {
                                                                this.state.workoutData.cooldown ?
                                                                    this.state.workoutData.cooldown.map(workout => {
                                                                        return (
                                                                            <MiniTimelineWorkout />
                                                                        )
                                                                    })
                                                                    :
                                                                    null
                                                            }
                                                        </View>
                                                    </View>
                                                )
                                            default:
                                        }
                                    }}
                                />

                            </View>

                            <View style={{ flex: 2 }}>
                                <Text style={{ fontFamily: "Avenir-Roman", fontSize: 25, padding: 10 }}>
                                    Workout Metrics
                            </Text>

                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontFamily: "avenir-roman", fontSize: 20, padding: 10 }}>
                                        Heading One
                                </Text>
                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", padding: 10 }}>
                                        <View style={{ flexDirection: "column", alignItems: "center", padding: 3 }}>
                                            <Text style={{ fontFamily: "avenir-roman", fontSize: 20 }}>
                                                Sets
                                        </Text>
                                            <Text>
                                                20
                                        </Text>
                                        </View>

                                        <View style={{ flexDirection: "column", alignItems: "center" }}>
                                            <Text style={{ fontFamily: "avenir-roman", fontSize: 20 }}>
                                                Reps
                                        </Text>
                                            <Text>
                                                5
                                        </Text>
                                        </View>

                                        <View style={{ flexDirection: "column", alignItems: "center" }}>
                                            <Text style={{ fontFamily: "avenir-roman", fontSize: 20 }}>
                                                Tempo
                                        </Text>
                                            <Text>
                                                4-6-2
                                        </Text>
                                        </View>
                                    </View>
                                    <Divider />
                                    <Text style={{ fontFamily: "avenir-roman", fontSize: 20, padding: 10 }}>
                                        Heading Two
                                </Text>
                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", padding: 10 }}>
                                        <View style={{ flexDirection: "column", alignItems: "center", padding: 3 }}>
                                            <Text style={{ fontFamily: "avenir-roman", fontSize: 20 }}>
                                                Sets
                                        </Text>
                                            <Text>
                                                20
                                        </Text>
                                        </View>

                                        <View style={{ flexDirection: "column", alignItems: "center" }}>
                                            <Text style={{ fontFamily: "avenir-roman", fontSize: 20 }}>
                                                Reps
                                        </Text>
                                            <Text>
                                                5
                                        </Text>
                                        </View>

                                        <View style={{ flexDirection: "column", alignItems: "center" }}>
                                            <Text style={{ fontFamily: "avenir-roman", fontSize: 20 }}>
                                                Tempo
                                        </Text>
                                            <Text>
                                                4-6-2
                                        </Text>
                                        </View>
                                    </View>
                                    <Divider />
                                    <Text style={{ fontFamily: "avenir-roman", fontSize: 20, padding: 10 }}>
                                        Heading Three
                                </Text>
                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", padding: 10 }}>
                                        <View style={{ flexDirection: "column", alignItems: "center", padding: 3 }}>
                                            <Text style={{ fontFamily: "avenir-roman", fontSize: 20 }}>
                                                Sets
                                        </Text>
                                            <Text>
                                                20
                                        </Text>
                                        </View>

                                        <View style={{ flexDirection: "column", alignItems: "center" }}>
                                            <Text style={{ fontFamily: "avenir-roman", fontSize: 20 }}>
                                                Reps
                                        </Text>
                                            <Text>
                                                5
                                        </Text>
                                        </View>

                                        <View style={{ flexDirection: "column", alignItems: "center" }}>
                                            <Text style={{ fontFamily: "avenir-roman", fontSize: 20 }}>
                                                Tempo
                                        </Text>
                                            <Text>
                                                4-6-2
                                        </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                <Surface style={{flexDirection: 'row', alignItems: 'center', elevation: 10, borderRadius: 20, width: '90%', height: 60, alignItems: 'center', justifyContent: 'center'}}>
                                    <FeatherIcon size={20} name="bluetooth" color="rgb(0, 30, 152)" />
                                    <Text style={{fontFamily: 'ARSMAquettePro-Regular'}}>
                                        Turn on bluetooth to connect your device
                                    </Text>
                                </Surface>
                            </View>

                            <Surface style={{backgroundColor: "transparent", elevation: 8, borderRadius: 20, padding: 10, flex: 1, alignItems: "flex-start", justifyContent: "center" }}>
                            <Text style={{fontFamily: "Avenir-Roman", fontSize: 20}}>
                                Muscle Spread
                            </Text>
                                <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-evenly'}}>
                                <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Icon
  name='clock'
  type='feather'
  color='#1E88E5'
  style={{elevation: 15, margin: 15}}
  iconStyle={{margin: 5, elevation: 15}}
  size={20}
/>
                                        <Text style={{  fontSize: 15}}>
                                            Time Spent: 120bpm
                                        </Text>
                                    </View>

                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Icon
  name='clock'
  type='feather'
  color='#0D47A1'
  style={{elevation: 15, margin: 15}}
  iconStyle={{margin: 5, elevation: 15}}
  size={20}
/>
                                        <Text style={{  fontSize: 15}}>
                                            Time Left: 120bpm
                                        </Text>
                                    </View>
                                </View>


                                <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Icon
  name='heart'
  type='feather'
  color='red'
  style={{elevation: 15, margin: 15}}
  iconStyle={{margin: 5, elevation: 15}}
  size={20}
/>
                                        <Text style={{  fontSize: 15}}>
                                            Cardio: 120bpm
                                        </Text>
                                    </View>

                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Icon
  name='activity'
  type='feather'
  color='#212121'
  style={{elevation: 15, margin: 15}}
  iconStyle={{margin: 5, elevation: 15}}
  size={20}
/>
                                        <Text style={{  fontSize: 15}}>
                                           Weight Pushed: 120bpm
                                        </Text>
                                    </View>
                                </View>


                                <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Icon
  name='target'
  type='feather'
  color='#FFC107'
  style={{elevation: 15, margin: 15}}
  iconStyle={{margin: 5, elevation: 15}}
  size={20}
/>
                                        <Text style={{  fontSize: 15}}>
                                            Calories Burned: 120bpm
                                        </Text>
                                    </View>

                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Icon
  name='heart'
  type='feather'
  color='red'
  style={{elevation: 15, margin: 15}}
  iconStyle={{margin: 5, elevation: 15}}
  size={20}
/>
                                        <Text style={{  fontSize: 15}}>
                                            Cardio: 120bpm
                                        </Text>
                                    </View>
                                    </View>
                                </View>

                                
                            </Surface>
                        </SafeAreaView>
                                </View>*/}
                    <LoadingNextWorkoutActivityIndicator isVisible={this.state.loadingNextWorkout} />
                </Swiper>
                <SafeAreaView />
                </View>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        margin: 0,
        backgroundColor: "#f5f5f5",
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

    }
})

export default connect(mapStateToProps)(LiveWorkout);