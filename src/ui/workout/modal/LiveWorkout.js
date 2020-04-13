import * as React from 'react';

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Button,
    Modal,
    SafeAreaView,
    Dimensions,
    Slider,
} from 'react-native';

import {
    Title, Divider, Paragraph, Switch, Surface, Headline,
    Appbar,
    Colors,
    ActivityIndicator,
} from 'react-native-paper';

import { PieChart } from 'react-native-chart-kit';

import { Video } from 'expo-av'

import ScrollPicker from 'react-native-wheel-scroll-picker';
import { Subtitle, Segment } from 'native-base';

import { Feather as FeatherIcon } from '@expo/vector-icons';

import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';

import StepIndicator from 'react-native-step-indicator';

import MiniTimelineWorkout from '../component/MiniTimelineWorkout';

const data = [
    {
      name: "Shoulders",
      population: 5,
      color: "#2196F3",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12
    },
    {
      name: "Biceps",
      population: 28,
      color: "#03A9F4",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12
    },
    {
      name: "Hamstrings",
      population: 46,
      color: "#00BCD4",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12
    },
    {
        name: "Triceps",
        population: 22,
        color: "#00BCD4",
        legendFontColor: "#009688",
        legendFontSize: 12
      },
  ];

  const chartConfig = {
    backgroundGradientFrom: "red",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5
  };

const mapStateToProps = state => {
    return {
        lupa_data: state,
    }
}

const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 35,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#2196F3',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#fe7013',
    stepStrokeUnFinishedColor: '#2196F3',
    separatorFinishedColor: '#fe7013',
    separatorUnFinishedColor: '#212121',
    stepIndicatorFinishedColor: '#fe7013',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 12,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#212121',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#212121',
    labelColor: '#212121',
    labelSize: 13,
    currentStepLabelColor: '#2196F3'
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
       /* <Modal visible={props.isVisible} presentationStyle="overFullScreen" style={{ alignItems: "center", justifyContent: "center", backgroundColor: "transparent", margin: 0 }} >
            <ActivityIndicator style={{ alignSelf: "center" }} animating={true} color="#03A9F4" size="large" />
        </Modal>*/
        <>
        </>
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

        this.state = {
            programTitle: "",
            loadingNextWorkout: false,
            programDescription: "",
            programData: this.props.programData,
            workoutData: this.props.programData.program_structure,
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
        }
    }

    async componentDidMount() {
        await this.setupLiveWorkout()
    }

    setupLiveWorkout = async () => {
        let nextWorkoutIn, nextStageDataIn, currentStageIndexIn, currentWorkoutIndexIn, stagesScheduledIn = [];

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
                // console.log(nextStageDataIn)
                await this.setState({ currentStageData: this.state.workoutData.warmup, currentStage: stage, currentWorkout: this.state.workoutData.warmup[0], currentWorkoutIndex: 0, nextStageData: nextStageDataIn });
                break;
            case "Primary":
                nextStageDataIn = await this.getStageData(this.state.stagesScheduled[this.state.currentStageIndex + 2]);
                //   console.log(nextStageDataIn)
                await this.setState({ currentStageData: this.state.workoutData.primary, currentStage: stage, currenetWorkout: this.state.workoutData.primary[0], currentWorkoutIndex: 0, nextStageData: nextStageDataIn });
                break;
            case "Break":
                nextStageDataIn = await this.getStageData(this.state.stagesScheduled[this.state.currentStageIndex + 2]);
                //    console.log(nextStageDataIn)
                await this.setState({ currentStageData: this.state.workoutData.break, currentStage: stage, currentWorkout: this.state.workoutData.break[0], currentWorkoutIndex: 0, nextStageData: nextStageDataIn });
                break;
            case "Secondary":
                nextStageDataIn = await this.getStageData(this.state.stagesScheduled[this.state.currentStageIndex + 2]);
                //    console.log(nextStageDataIn)
                await this.setState({ currentStageData: this.state.workoutData.secondary, currentStage: stage, currentWorkout: this.state.workoutData.secondary[0], currentWorkoutIndex: 0, nextStageData: nextStageDataIn });
                break;
            case "Cooldown":
                nextStageDataIn = "DONE"
                //   console.log('setting cooldown')
                //  console.log(nextStageDataIn)
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
        //return this.state.currentWorkout.workout_description;
    }

    getNextWorkoutTitle = () => {
        if (this.state.currentStage == "Cooldown" && this.state.currentStageData[this.state.currentWorkoutIndex + 1] == undefined) {
            return "Finish";

        }

        return this.state.nextWorkout.workout_name;
    }

    handleCloseLiveWorkout = () => {
        this.props.closeModalMethod();
        this.setupLiveWorkout();
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

    render() {
        return (
            <Modal presentationStyle="fullScreen" style={styles.margin} visible={this.props.isVisible}>
                <Swiper loop={false} scrollEnabled={true} showsVerticalScrollIndicator={false} showsButtons={false} showsPagination={false} horizontal={false} index={0}>
                    <View style={{ flex: 1, backgroundColor: "white" }}>
                            <Appbar.Header statusBarHeight style={{backgroundColor: "white", justifyContent: "space-between"}} style={{elevation: 0, backgroundColor: "white"}}>
                            <Surface>
                                    <Switch onValueChange={this.onToggleSwitch} value={this.state.switchEnabled} color="#2196F3" style={{ margin: 3 }} />
                                    <Text style={{fontSize: 10, fontFamily: "avenir-next-bold"}}>
                                        Toggle Vibration
                            </Text>
                                </Surface>
                                <Appbar.Content  title="Aura Program"  subtitle="Lupa Curated" />
                                <Appbar.Action icon="play-arrow" />
                            </Appbar.Header>

                        <Surface style={{ elevation: 0, backgroundColor: "white", borderRadius: 20, margin:8, flex: 1, flexDirection: 'row', }}>
                            <View style={{ flex: 1.5, alignItems: "center", justifyContent: "space-evenly" }}>
                                <Text style={{ fontFamily: 'avenir-roman', fontSize: 12, padding: 2 }}>
                                    Lorem ipum dolor sit amet, consectetur adipiscing
                            </Text>

                                <Text style={{ fontFamily: 'avenir-roman', fontSize: 12, padding: 2 }}>
                                    Lorem ipsum dolor adipiscing
                            </Text>

                                <Text style={{ fontFamily: 'avenir-roman', fontSize: 12, padding: 2 }}>
                                    Lorem ipsum dolor sit amet, consectetur
                            </Text>

                                <Text style={{ fontFamily: 'avenir-roman', fontSize: 12, padding: 2 }}>
                                    Lorem ipsum dolor sit amet
                            </Text>
                            </View>
                        </Surface>


                        <View style={{ flex: 1.5}}>
                            <Text style={{ fontFamily: "avenir-next-bold", fontSize: 25, padding: 10 }}>
                                Workout Details
                            </Text>
                            <View style={{ flex: 1, flexDirection: "column", justifyContent: "space-evenly" }}>
                                <Text style={{fontFamily: "avenir-roman", fontSize: 20, paddingLeft: 10}}>
                                    Workout Name
                                </Text>
                                <View style={{flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-evenly"}}>
                                <View style={{ flexDirection: "column", alignItems: "center", padding: 10 }}>
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

                            <View style={{ flex: 1 }}>
                                        <Text style={{ padding: 5, fontFamily: 'avenir-roman', textAlign: "center" }}>
                                        {this.state.nextWorkout ? 
                                        this.getCurrentWorkoutDescription 
                                        : 
                                        this.getTestDescription()
                                            }

                                </Text>
                            </View>
                        </View>

                        <View style={{ flex: 1,alignItems: "center", justifyContent: "center"}}>
                                <TouchableOpacity onPress={() => this.changeWorkout()} style={{ position: "absolute", right: 0, alignSelf: "center" }}>
                                    <Surface style={[styles.interactionSurface, {alignSelf: "center", backgroundColor: "#1565C0", elevation: 8, alignItems: "center", justifyContent: "space-evenly", shadowColor: "#212121", shadowRadius: 10, right: 0, width: Dimensions.get('window').width - 10, height: 150, alignSelf: "center", borderRadius: 0, borderTopLeftRadius: 20, borderBottomLeftRadius: 20 }]}>
                                   {/*     <Text style={{color: "white", fontSize: 20, fontFamily: "avenir-next-bold" }}>
                                            Up Next
                            </Text>

                                        <Text style={{ color: "white", fontSize: 16, fontFamily: "avenir-next-bold" }}>
                                            {this.state.nextWorkout ? this.getNextWorkoutTitle() : "Workout Name"
                                            }

                                        </Text>

                                        <Text style={{color: "white", fontFamily: "avenir-roman"}}>
                                            2:03
                                        </Text>*/}
                                         <Video shouldPlay style={{borderRadius: 0, borderTopLeftRadius: 20, borderBottomLeftRadius: 20, width: "100%", height: "100%" }} shouldPlay={false} resizeMode="cover" source={require('../../video/preview2.mov')}/>
                                    </Surface>
                                </TouchableOpacity>
                                        

                                       
                        </View>

                        <View style={{flex: 1, justifyContent: "center"}}>
                        <StepIndicator
                            direction="horizontal"
                            customStyles={customStyles}
                            currentPosition={this.state.currentStageIndex}
                            labels={PROGRAM_SECTIONS}
                            stepCount={PROGRAM_SECTIONS.length}
                        />
                        </View>



                                                <SafeAreaView />
                    </View>

                    <View style={{ flex: 1, padding: 15}}>
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
                                <Text style={{ fontFamily: "avenir-next-bold", fontSize: 25, padding: 10 }}>
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
                            <Surface style={{backgroundColor: "transparent", elevation: 8, borderRadius: 20, padding: 10, flex: 1, alignItems: "center", justifyContent: "center" }}>
                            <Text style={{fontFamily: "avenir-next-bold"}}>
                                Muscle Spread
                            </Text>
                            <PieChart
  data={data}
  width={Dimensions.get('window').width - 20}
  height={220}
  chartConfig={chartConfig}
  accessor="population"
  backgroundColor="transparent"
  paddingLeft="15"
  
  absolute
/>
                            </Surface>
                        </SafeAreaView>
                    </View>
                </Swiper>
                <LoadingNextWorkoutActivityIndicator isVisible={this.state.loadingNextWorkout} />

            </Modal>
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