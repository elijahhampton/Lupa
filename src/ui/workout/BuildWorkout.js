import React, { useState } from 'react';

import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    ScrollView,
    Animated,
    Button as NativeButton,
} from 'react-native';

import {
    FAB,
    IconButton,
    Surface,
    Dialog,
    Button,
    TextInput
} from 'react-native-paper';

import TimeLine from 'react-native-timeline-flatlist';

import { connect } from 'react-redux';

import LupaController from '../../controller/lupa/LupaController';

import WorkoutTool from './component/WorkoutTool';
import { LinearGradient } from 'expo-linear-gradient';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
       deleteProgram: (programID) => {
            dispatch({
              type: 'DELETE_CURRENT_USER_PROGRAM',
              payload: programID,
            })
          },
    }
  }

function ProgramDetailsDialog(props) {
    const [programTitle, setProgramTitle] = useState("");
    const [programDescription, setProgramDescription] = useState("");

    return (
        <Dialog>
            <Dialog.Title>
                Add a title and description for your program.
            </Dialog.Title>
            <Dialog.Content>
                <TextInput mode="outlined" placeholder="Program Title" onChangeText={text => setProgramTitle(text)} theme={{
                    colors: {
                        primary: "#2196F3"
                    }
                }}/>
                <TextInput mode="outlined" placeholder="Program Description" multiline onChangeText={text => setProgramDescription(text)} theme={{
                    colors: {
                        primary: "#2196F3"
                    }
                }}/>
            </Dialog.Content>
            <Dialog.Actions>
                <Button mode="text" onPress={() => props.saveProgramMethod(programTitle, programDescription)} theme={{
                    colors: {
                        primary: "#2196F3"
                    }
                }}>
                    Save Program
                </Button>
            </Dialog.Actions>
        </Dialog>
    )
}

class BuildWorkout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currProgramUUID: "",
            layoutHeight: 0,
            tabWidth: 0,
            overlayHeight: new Animated.Value(0),
            overlayWidth: new Animated.Value(Dimensions.get("screen").width / 1.1),
            animatedWidth: new Animated.Value(Dimensions.get("screen").width),
            tabXPosition: new Animated.Value(Dimensions.get("screen").width / 1.1 - 50),
            tabBorderTopLeft: new Animated.Value(0),
            tabHeight: new Animated.Value(35),
            libraryOpen: true,
            buildAWorkout: true,
            logAWorkout: false,
            searchValue: "",
            data: [
                { title: "Warm Up", description: "A short description about this section", workouts: [] },
                { title: "Primary", description: "A short description about this section",  workouts: [] },
                { title: "Break", description: "A short description about this section",  workouts: [] },
                { title: "Secondary", description: "A short description about this section",  workouts: [] },
                { title: "Cooldown", description: "A short description about this section",  workouts: [] },
                { title: "Homework", description: "A short description about this section",  workouts: [] },
            ],
        }

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    }

    componentDidMount() {
        //when this component mounts we should disable swipe for our main "swipe navigator" focus here
        this.props.disableSwipe();
    }

    componentWillUnmount() {
        //when this component unmounts we should enable swipe for our main "swipe navigator" to allow focus here
        this.props.enableSwipe();
    }

    renderDetailFunction = (rowData, sectionID, rowID) => {
        return (
            <>
                <Text style={{ fontFamily: "avenir-roman", fontSize: 20, alignSelf: "flex-start" }}>
                    {rowData.title}
                </Text>
                <Text style={{fontSize: 15, fontFamily: 'avenir-light'}}>
                    {rowData.description}
                </Text>
                <ScrollView horizontal shouldRasterizeIOS={true} showsHorizontalScrollIndicator={false}>
                    {
                        rowData.workouts.map(obj => {
                            return (
                                <Surface style={{ elevation: 3, width: 90, height: 70, margin: 5, borderRadius: 10, alignItems: "center", justifyContent: "center" }}>
                                    {/*<Video
  source={{ uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
  rate={1.0}
  volume={0}
  isMuted={true}
  resizeMode="cover"
  shouldPlay={false}
  isLooping={false}
  style={{ width: 90, height: 70, borderRadius: 10 }}
                            />*/}
                                </Surface>
                            )
                        })
                    }
                </ScrollView>
            </>
        )
    }

    updateWorkoutData = async (state) => {
        await this.setState({
            data: [
                { title: "Warm Up", description: "A short description about this section", workouts: state.warmup },
                { title: "Primary", description: "A short description about this section",  workouts: state.primary },
                { title: "Break", description: "A short description about this section",  workouts: state.break },
                { title: "Secondary", description: "A short description about this section",  workouts: state.secondary },
                { title: "Cooldown", description: "A short description about this section",  workouts: state.cooldown },
                { title: "Homework", description: "A short description about this section",  workouts: state.homework },
            ]
        })
    }

    setProgramUUID = (id) => {
        this.setState({ currProgramUUID: id })
    }

    showProgramDetailsDialog = () => {
        this.setState({
            showProgramDetailsDialog: true,
        })
    }

    closeProgramDetailsDialog = () => {
        this.setState({
            showProgramDetailsDialog: false
        })
    }

    /**
     * Saves a program to firebase
     * 
     * @param title String of the program title
     * @param description String of the program description
     * 
     * TODO: Need to adjust app to pull programs from FB and not Redux
     */
    saveProgram = async (title, description) => {
        //declare var to save program data
        let programData = undefined;

        //search through redux store for the program we need to store in FB
        for (let i = 0; i < this.props.lupa_data.Programs.currUserProgramsState.length; i++)
        {
            let currProgram = this.props.lupa_data.Programs.currUserProgramsState[i];
            if (currProgram.program_uuid == this.state.currProgramUUID)
            {
                programData = currProgram;
            }
        }

        //check to see if we found the program
        if (programData == undefined)
        {
            //send alert if we couldn't find the program - TODO
            alert('Unable to save program.  Try again later.')
        }
        else
        {
            //Set program data and description
            programData.program_title = title,
            programData.program_description = description;

            //Save program in FB if we find the program
            await this.LUPA_CONTROLLER_INSTANCE.saveProgram(this.props.lupa_data.Users.currUserData.user_uuid, programData);
        }

        this.props.navigation.goBack(null);
    }

    handleExitBuildAWorkout = async () => {
        //if a program has been started then delete it
        if (this.state.currProgramUUID != "")
        {
        //delete workout from FB
        await this.LUPA_CONTROLLER_INSTANCE.deleteProgram(this.props.lupa_data.Users.currUserData.user_uuid, this.state.currProgramUUID);

        //delete from Redux
        await this.props.deleteProgram(this.state.currProgramUUID);

        //reset state
        this.setState({
            currProgramUUID: "",
            libraryOpen: true,
            buildAWorkout: true,
            logAWorkout: false,
            searchValue: "",
            data: [
                { title: "Warm Up", description: "A short description about this section", workouts: [] },
                { title: "Primary", description: "A short description about this section",  workouts: [] },
                { title: "Break", description: "A short description about this section",  workouts: [] },
                { title: "Secondary", description: "A short description about this section",  workouts: [] },
                { title: "Cooldown", description: "A short description about this section",  workouts: [] },
                { title: "Homework", description: "A short description about this section",  workouts: [] },
            ],
        })
        }

        this.props.navigation.goBack(null);
    }

    render() {
        return (
            <View style={styles.container} onLayout={event => { this.setState({ layoutHeight: event.nativeEvent.layout.height }) }} >
                                    <LinearGradient style={{position: 'absolute', top: 0, left: 0, right: 0, height: Dimensions.get('window').height}} colors={['#FAFAFA', '#1E88E5']} start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}>
                <View style={styles.textContainer}>

                    <IconButton style={{ alignSelf: "flex-start" }} color="#212121" icon="arrow-back" onPress={() => this.handleExitBuildAWorkout()} />
                    <Text style={{padding: 5, fontFamily: 'ars-maquette-pro-medium', fontSize: 22, color: "#212121" }}>
                        Design a workout - what are you waiting for?
            </Text>
                </View>
                <View style={{ flex: 4, backgroundColor: "transparent" }}>
                    <Surface style={styles.contentContainer}>
                        <TimeLine
                            listViewStyle={{ flex: 1 }}
                            data={this.state.data}
                            position="left"
                            separator={true}
                            showTime={false}
                            titleStyle={{ alignSelf: "flex-start" }}
                            dotColor="#2196F3"
                            circleColor="#2196F3"
                            lineColor="#2196F3"
                            renderDetail={(rowData, sectionID, rowID) => this.renderDetailFunction(rowData, sectionID, rowID)}
                        />
                    </Surface>
                </View>

                <FAB color="white" icon="done" style={{
                    position: 'absolute',
                    margin: 16,
                    right: 0,
                    bottom: 0, 
                    backgroundColor: "#2196F3",
                }} 
                onPress={this.showProgramDetailsDialog}
                />
                
                <ProgramDetailsDialog saveProgramMethod={(title, description) => this.saveProgram(title, description)}/>
                <WorkoutTool setProgramUUID={uuid => this.setProgramUUID(uuid)} updateWorkoutData={state => this.updateWorkoutData(state)} />
                </LinearGradient>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#2196F3",
    },
    contentContainer: {
        //marginTop: Dimensions.get("screen").height / 4,
        flex: 1,
        backgroundColor: "white",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 10,
        elevation: 15, 
    },
    scrollViewContent: {

    },
    headerText: {
        fontSize: 25,
        fontWeight: "800",
        color: "white",
    },
    textContainer: {
        padding: 5,
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(BuildWorkout);
