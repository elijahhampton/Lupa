import React, { useState } from "react";

import {
    Text,
    Animated,
    Dimensions,
    StyleSheet,
    Button as NativeButton,
    PanResponder,
    View,
    ScrollView,
    FlatList,
    TouchableOpacity,
} from 'react-native';

import {
    SearchBar,
    Button as ElementsButton
} from 'react-native-elements';

import {
    Surface,
    IconButton,
    Dialog,
    Paragraph,
    Button,
    RadioButton
} from 'react-native-paper';


import { connect, useSelector } from 'react-redux';

import LupaController from '../../../controller/lupa/LupaController';
import SingleWorkout from "./SingleWorkout";
import LiveWorkout from "../modal/LiveWorkout";

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addProgram: (programPayload) => {
            dispatch({
                type: "ADD_CURRENT_USER_PROGRAM",
                payload: programPayload,
            })
        },
        deleteProgram: (programUUID) => {
            dispatch({
                type: "DELETE_CURRENT_USER_PROGRAM",
                payload: programUUID
            })
        },
        addWorkoutToProgramSection: (programUUID, sectionName, workoutData) => {
            let eventPayload = {
                programUUID: programUUID,
                sectionName: sectionName,
                workoutData: workoutData
            }
            dispatch({
                type: "ADD_WORKOUT_TO_PROGRAM",
                payload: eventPayload
            })
        }
    }
}
/**
 * Data Model:
 * 
 * const data = [
    { title: 'Warm Up', description: "A short description about this section", workouts: [{ name: "bye" }, { name: "bye" }, { name: "bye" }, { name: "bye" }, { name: "bye" }, { name: "bye" }] },
    { title: 'Primary', description: "A short description about this section", workouts: [{ name: "bye" }, { name: "bye" }, { name: "bye" }, { name: "bye" }, { name: "bye" }, { name: "bye" }] },
    { title: 'Break', description: "A short description about this section", workouts: [{ name: "bye" }, { name: "bye" }, { name: "bye" }, { name: "bye" }, { name: "bye" }, { name: "bye" }] },
    { title: 'Secondary', description: "A short description about this section", workouts: [{ name: "bye" }, { name: "bye" }, { name: "bye" }, { name: "bye" }, { name: "bye" }, { name: "bye" }] },
    { title: 'Senoff', description: "A short description about this section", workouts: [{ name: "bye" }, { name: "bye" }, { name: "bye" }, { name: "bye" }, { name: "bye" }, { name: "bye" }] },
    { title: 'Homework', description: "A short description about this section", workouts: [{ name: "bye" }, { name: "bye" }, { name: "bye" }, { name: "bye" }, { name: "bye" }, { name: "bye" }] },
    { title: 'Homework', description: "A short description about this section", workouts: [{ name: "bye" }, { name: "bye" }, { name: "bye" }, { name: "bye" }, { name: "bye" }, { name: "bye" }] },
    { title: 'Homework', description: "A short description about this section", workouts: [{ name: "bye" }, { name: "bye" }, { name: "bye" }, { name: "bye" }, { name: "bye" }, { name: "bye" }] },
]
 */

const PROGRAM_SECTIONS = [
    "Warm Up",
    "Primary",
    "Break",
    "Secondary",
    "Cooldown",
    "Homework"
]

const boxWidth = Dimensions.get("screen").width - 20;
const boxHeight = Dimensions.get("screen").height - 350;

function BuildAWorkoutDescription(props) {
    return (
        <Dialog visible={props.isVisible}>
            <Dialog.Title>Getting started</Dialog.Title>
            <Dialog.Content>
                <Paragraph>
                    Information about the build a workout tool.
                </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={props.closeDialogMethod}> Done </Button>
            </Dialog.Actions>
        </Dialog>
    )
}

function LogAWorkoutDialog(props) {
    return (
        <Dialog visible={props.isVisible} >
            <Dialog.Title>Getting started</Dialog.Title>
            <Dialog.Content>
                <Paragraph>
                    Information about logging a workout
                </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={props.closeDialogMethod}> Done </Button>
            </Dialog.Actions>
        </Dialog>
    )
}

function AddWorkoutToSectionDialog(props) {
     "Warm Up",
    "Primary",
    "Break",
    "Secondary",
    "Cooldown",
    "Homework"
    const [warmUpChecked, setWarmUpChecked] = useState("");
    const [primaryChecked, setPrimaryChecked] = useState("");
    const [breakChecked, setBreakChecked] = useState("");
    const [secondaryChecked, setSecondaryChecked] = useState("");
    const [cooldownChecked, setCooldownChecked] = useState("");
    const [homeworkChecked, setHomeworkChecked] = useState("");

    function handleOnRadioPress(section) {

        switch(section)
        {
            case "warm up":
                warmUpChecked === "checked" ? setWarmUpChecked("unchecked") : setWarmUpChecked("checked");
                break;
            case "primary":
                primaryChecked === "checked" ? setPrimaryChecked("unchecked") :
                setPrimaryChecked("checked")
                break;
            case "break":
                breakChecked === "checked" ? setBreakChecked("unchecked") : 
                setBreakChecked("checked")
                break;
            case "secondary":
                secondaryChecked === "checked" ? setSecondaryChecked("unchecked") :
                setSecondaryChecked("checked")
                break;
            case "cooldown":
                cooldownChecked === "checked" ? setCooldownChecked("unchecked") :
                setCooldownChecked("checked")
                break;
            case "homework":
                setHomeworkChecked === "checked" ? setHomeworkChecked("unchecked") :
                setHomeworkChecked("checked")
                break;
            default:

        }

        props.onPress(section)
    }

    function resetRadioButtons() {
        setWarmUpChecked("unchecked");
        setPrimaryChecked("unchecked");
        setBreakChecked("unchecked");
        setSecondaryChecked("unchecked");
        setCooldownChecked("unchecked");
        setHomeworkChecked("unchecked")
    }

    async function handleCloseModal() {
        await props.addWorkoutsMethod();
        await resetRadioButtons();
        props.closeDialogMethod();
    }

    return (
        <Dialog visible={props.isVisible}>
            <Dialog.Title>Choose which sections to add these workouts</Dialog.Title>
            <Dialog.Content style={{flexDirection: "column"}}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <RadioButton.Android value={"warm up"} status={warmUpChecked} onPress={() => handleOnRadioPress("warm up")} key={"warm up"}/>
                                <Text>
                                   Warm Up
                                </Text>
                            </View>

                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <RadioButton.Android value={"primary"} status={primaryChecked} onPress={() => handleOnRadioPress("primary")} key={"primary"}/>
                                <Text>
                                    Primary
                                </Text>
                            </View>

                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <RadioButton.Android value={"break"} status={breakChecked} onPress={() => handleOnRadioPress("break")} key={"break"}/>
                                <Text>
                                    Break
                                </Text>
                            </View>

                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <RadioButton.Android value={"secondary"} status={secondaryChecked} onPress={() => handleOnRadioPress("secondary")} key={"secondary"}/>
                                <Text>
                                    Secondary
                                </Text>
                            </View>

                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <RadioButton.Android value={"cooldown"} status={cooldownChecked} onPress={() => handleOnRadioPress("cooldown")} key={"cooldown"}/>
                                <Text>
                                    Cooldown
                                </Text>
                            </View>

                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <RadioButton.Android value={"homework"} status={homeworkChecked} onPress={() => handleOnRadioPress("homework")} key={"homework"}/>
                                <Text>
                                   Homework
                                </Text>
                            </View>
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={() => handleCloseModal()}> Done </Button>
            </Dialog.Actions>
        </Dialog>
    )
}

class WorkoutTool extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            app_workouts: [],
            layoutHeight: 0,
            tabWidth: 0,
            overlayHeight: new Animated.Value(0),
            overlayWidth: new Animated.Value(Dimensions.get("screen").width / 1.1),
            animatedWidth: new Animated.Value(Dimensions.get("screen").width),
            tabXPosition: new Animated.Value(Dimensions.get("screen").width / 1.1 - 50),
            tabBorderTopLeft: new Animated.Value(0),
            tabHeight: new Animated.Value(35),
            libraryOpen: false,
            buildAWorkout: false,
            logAWorkout: false,
            searchValue: "",
            buildAWorkoutDescriptionVisible: false,
            currentProgramID: "",
            addToSectionDialogIsVisible: false,
            selectedWorkouts: [],
            selectedSectionsToAdd: [],
            logAWorkoutDialogIsVisible: false,
            workoutData: {
                warmup: [],
                primary: [],
                break: [],
                secondary: [],
                cooldown: [],
                homework: [],
            },
            showLiveWorkout: false,
        }

        this.LUPA_INSTANCE_CONTROLLER = LupaController.getInstance();
    }

    componentDidMount = async () => {
        await this.openLibrary();

    }

    openLiveWorkoutModal = () => {
        this.setState({ showLiveWorkout: true })
    }

    closeLiveWorkoutModal = () => {
        this.setState({ showLiveWorkout: false })
    }

    openLibrary = () => {
        Animated.timing(this.state.animatedWidth, {
            toValue: Dimensions.get("screen").width,
            duration: 200,
        }).start();


        Animated.timing(this.state.overlayWidth, {
            toValue: Dimensions.get("screen").width / 1.1,
            duration: 300,
        }).start();

        Animated.timing(this.state.tabXPosition, {
            toValue: Dimensions.get("screen").width / 1.1 - 50,
            duration: 300,
        }).start();

        Animated.timing(this.state.tabBorderTopLeft, {
            toValue: 0,
            duration: 2500,
        }).start();

        Animated.timing(this.state.tabHeight, {
            toValue: 35,
            duration: 2500,
        }).start();

        this.setState({ libraryOpen: true })
    }

    closeLibrary = () => {
        Animated.timing(this.state.animatedWidth, {
            toValue: 0,
            duration: 200,
        }).start();


        Animated.timing(this.state.overlayWidth, {
            toValue: 0,
            duration: 300,
        }).start();

        Animated.timing(this.state.tabXPosition, {
            toValue: 0,
            duration: 300,
        }).start();

        Animated.timing(this.state.tabBorderTopLeft, {
            toValue: 20,
            duration: 2500,
        }).start();

        Animated.timing(this.state.tabHeight, {
            toValue: 80,
            duration: 2500,
        }).start();

        this.setState({ libraryOpen: false })
    }

    getTabIcon = () => {
        if (this.state.libraryOpen) {
            return <IconButton color="white" icon="chevron-right" onPress={() => this.closeLibrary()} />
        }
        else {
            return <IconButton color="white" icon="chevron-left" onPress={() => this.openLibrary()} />
        }
    }

    resetWorkoutProgram = () => {

    }


    createNewWorkoutProgram = async () => {
        //Create a new program in FB and receive the program structure
        const programPayload = await this.LUPA_INSTANCE_CONTROLLER.createNewProgram(this.props.lupa_data.Users.currUserData.user_uuid);

        //Add the program to redux
        await this.props.addProgram(programPayload);
        await this.props.setProgramUUID(programPayload.program_uuid);
        await this.setState({ currentProgramID: programPayload.program_uuid });
    }

    deleteProgram = async () => {
        await this.LUPA_INSTANCE_CONTROLLER.deleteProgram(this.props.lupa_data.Users.currUserData.user_uuid, this.state.currentProgramID);

        await this.props.deleteProgram(this.state.currentProgramID);
    }

    handleBuildAWorkoutButton = () => {
        //reset workout program
        this.resetWorkoutProgram();

        //create program in firebase, redux, and set the current program uuid
        this.createNewWorkoutProgram();

        //set state for library for when opened
        this.setState({ buildAWorkout: true, logAWorkout: false })

        //set state to show dialog
        this.openBuildAWorkoutDescriptionDialog();
    }

    handleLogAWorkout = async () => {
        await this.setState({ buildAWorkout: false, logAWorkout: true });
        this.openLogAWorkoutDialog();
    }

    handleCancelBuildAWorkout = () => {
        //reset workout program
        this.resetWorkoutProgram();

        //delete program
        this.deleteProgram()

        //reset current program uuid and exit build a workout
        this.setState({ currentProgramID: "", buildAWorkout: false });
    }

    handleLeaveLogAWorkout = () => {
        this.setState({ logAWorkout: false })
    }

    openLogAWorkoutDialog = () => {
        this.setState({ logAWorkoutDialogIsVisible: true })
    }

    closeLogAWorkoutDialog = () => {
        this.setState({ logAWorkoutDialogIsVisible: false })
    }

    handleOnPressSection = async (sectionNameIn) => {
        let updatedSectionArr = this.state.selectedSectionsToAdd;

        let sectionName;
        switch(sectionNameIn)
        {
            case 'warm up':
                sectionName = "warm up"
                break;
            case "primary":
                sectionName = "primary"
                break;
            case "break":
                sectionName = "break"
                break;
            case "secondary":
                sectionName = "secondary"
                break;
            case "cooldown":
                sectionName = "cooldown";
                break;
            case "homework":
                sectionName = "homework";
                break;
            default:
                
                return;
        }

      /*  if (updatedSectionArr.includes(sectionName)) {
            await updatedSectionArr.splice(updatedSectionArr.indexOf(sectionName), 1);
            await this.setState({ selectedSectionsToAdd: updatedSectionArr });
        }
        else {*/
            await updatedSectionArr.push(sectionName);
            await this.setState({ selectedSectionsToAdd: updatedSectionArr });
        //}
    }

    handleAddWorkouts = async () => {
        let updatedWorkoutData = this.state.workoutData;
        for (let i = 0; i < this.state.selectedWorkouts.length; i++)
        {
            for (let j = 0; j < this.state.selectedSectionsToAdd.length; j++)
            {
                switch(this.state.selectedSectionsToAdd[j])
                {
                    case 'warm up':
                        await updatedWorkoutData.warmup.push(this.state.selectedWorkouts[i]);
                        break;
                    case "primary":
                        await updatedWorkoutData.primary.push(this.state.selectedWorkouts[i]);
                        break;
                    case "break":
                        await updatedWorkoutData.break.push(this.state.selectedWorkouts[i]);
                        break;
                    case "secondary":
                        await updatedWorkoutData.secondary.push(this.state.selectedWorkouts[i]);
                        break;
                    case "cooldown":
                        await updatedWorkoutData.cooldown.push(this.state.selectedWorkouts[i]);
                        break;
                    case "homework":
                       await updatedWorkoutData.homework.push(this.state.selectedWorkouts[i]);
                        break;
                    default:

                }
                //Call to lupa controller to add workout[i] to section[j]
                //Call to redux controller to do the same
                this.props.addWorkoutToProgramSection(this.state.currentProgramID, this.state.selectedSectionsToAdd[j], this.state.selectedWorkouts[i])
            }
        }

        //Update the correct section in the workout data in the state
        await this.setState({ workoutData: updatedWorkoutData})

        //update the workout data in BuildAWorkout timeline
        await this.props.updateWorkoutData(this.state.workoutData)

        //reset the workout data, selected workouts, and selection sectiontoadd
        await this.setState({ 
        selectedWorkouts: [],
        selectedSectionsToAdd: [],
    })
    }

    handleOnPressWorkout = async (workout_uuid) => {
        let updatedWorkoutsArr = this.state.selectedWorkouts;

        if (updatedWorkoutsArr.includes(workout_uuid)) {
            await updatedWorkoutsArr.splice(updatedWorkoutsArr.indexOf(workout_uuid), 1);
            await this.setState({ selectedWorkouts: updatedWorkoutsArr });
        }
        else {
            await updatedWorkoutsArr.push(workout_uuid);
            await this.setState({ selectedWorkouts: updatedWorkoutsArr });
        }
    }


    openBuildAWorkoutDescriptionDialog = () => {
        this.setState({ buildAWorkoutDescriptionVisible: true })
    }

    closeBuildAWorkoutDescriptionDialog = () => {
        this.setState({ buildAWorkoutDescriptionVisible: false })
    }

    openAddToWorkoutsDialog = () => {
        this.setState({ addToSectionDialogIsVisible: true })
    }

    closeAddToWorkoutsDialog = () => {
        this.setState({ addToSectionDialogIsVisible: false })
    }



    render() {
        return (
            <Animated.View style={{ position: "absolute", right: 0, flex: 1, width: this.state.animatedWidth, height: "100%", backgroundColor: "rgba(33,33,33 ,0.4)" }} onLayout={event => this.setState({ layoutHeight: event.nativeEvent.layout.height })}>
                
                <View>

                </View>


                <Surface style={{ position: "absolute", elevation: 10, top: this.state.layoutHeight / 4, right: 0, width: this.state.overlayWidth, height: boxHeight, backgroundColor: "#f5f5f5", borderTopLeftRadius: 30, borderBottomLeftRadius: 30 }} >
                    {
                        this.state.buildAWorkout || this.state.logAWorkout ?
                            null
                            :
                            <ScrollView shouldRasterizeIOS={true} contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between'}}>
                                <Text style={{ fontFamily: 'ars-maquette-pro-regular',fontWeight: "500", fontSize: 40, paddingTop: 20, paddingLeft: 20, color: "#212121" }}>
                                    It looks like you're ready to get started.
                        </Text>

                        <Text style={{ fontFamily: 'avenir-roman',fontSize: 20, paddingTop: 20, paddingLeft: 20, color: "#212121" }}>
                                   Use our tool to pick from over 70 workouts and variations to create your own workout program.  Add up to four workouts to each section.  Save your programs and return to them later.
                        </Text>

                                <View style={{ flex: 1, borderTopLeftRadius: 30, borderBottomLeftRadius: 30, alignItems: "center", justifyContent: "center", }}>
                                    <ElementsButton raised title="Build a workout" type="solid" containerStyle={{width: "80%", padding: 8}} buttonStyle={{borderRadius: 8, backgroundColor: "white"}} titleStyle={{fontFamily: 'avenir-book', color: "#2196F3"}} onPress={() => this.handleBuildAWorkoutButton()}/>
                                </View>
                            </ScrollView>

                    }

                    {
                        this.state.buildAWorkout && !this.state.logAWorkout ?
                            <View style={{ flex: 1, }}>
                                <View style={{ width: "100%", flexDirection: "row", alignItems: "center" }}>
                                    <IconButton icon="arrow-back" onPress={() => this.handleCancelBuildAWorkout()} />
                                </View>
                                    <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}>
                                        {
                                            this.props.lupa_data.Application_Workouts.applicationWorkouts.map(workout => {
                                                return (
                                                    <SingleWorkout workoutData={workout} onPress={(workoutIn) => this.handleOnPressWorkout(workoutIn)} />
                                                )
                                            })
                                        }
                                    </View>
                                <NativeButton title="Add Workouts" style={{position: "absolute", alignSelf: "center" }} onPress={this.openAddToWorkoutsDialog} />
                            </View>
                            :
                            null
                    }

                    <Surface style={{
                        position: "absolute",
                        width: 50,
                        height: this.state.tabHeight,
                        alignSelf: "center",
                        right: this.state.tabXPosition,
                        backgroundColor: "#2196F3",
                        borderTopLeftRadius: this.state.tabBorderTopLeft,
                        borderBottomLeftRadius: 20,
                        elevation: 10,
                        alignItems: "center",
                        justifyContent: "center",
                        bottom: 0,
                    }}
                        onLayout={event => this.setState({ tabWidth: event.nativeEvent.layout.width })} >
                        {this.getTabIcon()}
                    </Surface>
                </Surface>

                <BuildAWorkoutDescription isVisible={this.state.buildAWorkoutDescriptionVisible} closeDialogMethod={this.closeBuildAWorkoutDescriptionDialog} />
                <AddWorkoutToSectionDialog isVisible={this.state.addToSectionDialogIsVisible} onPress={this.handleOnPressSection} closeDialogMethod={this.closeAddToWorkoutsDialog} addWorkoutsMethod={this.handleAddWorkouts} />
                <LogAWorkoutDialog isVisible={this.state.logAWorkoutDialogIsVisible} closeDialogMethod={this.closeLogAWorkoutDialog} />
            </Animated.View>


        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkoutTool);