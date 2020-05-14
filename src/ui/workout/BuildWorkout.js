import React, { useState } from 'react';

import {
    Text,
    View,
    StyleSheet,
    SafeAreaView,
    Dimensions,
    TouchableOpacity,
    Modal,
    Constants,
    TouchableWithoutFeedback,
    PanResponder,
    ScrollView,
    Image,
    TouchableHighlight,
    Animated,
    Button as NativeButton,
    Slider,
} from 'react-native';

import {
    FAB,
    IconButton,
    Surface,
    Dialog,
    Button,
    TextInput,
    Divider
} from 'react-native-paper';

import { RNCamera } from 'react-native-camera';

import TimeLine from 'react-native-timeline-flatlist';
import RBSheet from "react-native-raw-bottom-sheet";

import { Video } from 'expo-av';

import { connect } from 'react-redux';

import LupaController from '../../controller/lupa/LupaController';

import ThinFeatherIcon from "react-native-feather1s";

import FeatherIcon from "react-native-vector-icons/Feather"
import { LinearGradient } from 'expo-linear-gradient';
import SingleWorkout from './component/SingleWorkout';
import LupaCamera from './program/LupaCamera'
import { getLupaProgramInformationStructure } from '../../model/data_structures/programs/program_structures';

function getViewStyle(state) {
    if (state)
    {
        return {
            position: "absolute", alignItems: "center", justifyContent: "center", width: 80, height: 50, backgroundColor: "rgba(250,250,250 ,0.6)"
        }
    }
    else
    {
        return {
            position: "absolute", alignItems: "center", justifyContent: "center", width: 80, height: 50
        }
    }
}

function getIconStyle(state) {
    if (state)
    {
        return "rgba(33,150,243 ,1)"
    }
    else
    {
        return "rgba(33,150,243 ,0)"
    }
}

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
                <Button mode="text" onPress={() => props.saveProgramMethod("No Name", "No Description")} theme={{
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

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            currProgramUUID: "",
            currWorkoutPressed: "",
            currWorkoutPressedSection: "",
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
            pan: new Animated.ValueXY(),
            warmUpListTopY: 50,
            warmUpListBottomY: 50, 
            primaryListTopY: 0,
            breakListTopY: 0,
            secondaryListTopY: 0,
            cooldownListTopY: 0,
            homeworkListTopY: 0,
            totalSurfaceHeight: 595.7,
            showCamera: false,
        }

       this.RBSheet = React.createRef();

        this.animatedViewRef = React.createRef()
        this.firstView = React.createRef()
        this.timelineScrollview = React.createRef()

    }

    componentDidMount = async () => {
           
    }

     deleteProgram = async () => {
        await this.LUPA_INSTANCE_CONTROLLER.deleteProgram(this.props.lupa_data.Users.currUserData.user_uuid, this.state.currProgramUUID);

        await this.props.deleteProgram(this.state.currProgramUUID);
    }

    handleCancelBuildAWorkout = () => {
        //reset workout program
        this.resetWorkoutProgram();

        //delete program
        this.deleteProgram()

        //reset current program uuid and exit build a workout
        this.setState({ currProgramUUID: ""  });
    }

    resetWorkoutProgram = () => {

    }

    captureWorkout = (sectionName, workoutObject) => {
        console.log(workoutObject)
        let currState = this.state.data;
        for(let i = 0; i < currState.length; i++)
        {
            if (currState[i].title == sectionName)
            {
                currState[i].workouts.push(workoutObject);
                break;
            }
        }

        this.setState({ data: currState })
    }



    componentWillMount() {
        this._val = { x:0, y:0 }
        this.state.pan.addListener((value) => this._val = value);
    
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
              this.state.pan.setOffset(this.state.pan.__getValue());
              this.state.pan.setValue({ x: 0, y: 0 });
            },
            onPanResponderMove: Animated.event([
              null, {
                dx: this.state.pan.x,
                dy: this.state.pan.y
              }
            ], {
                listener: event => {
                    this.animatedViewRef.measure( (fx, fy, width, height, px, py) => {
                       
                    })
                }
            }),
            onPanResponderRelease: () => {
                Animated.spring(this.state.pan, {
                    toValue: { x: 0, y: 0 },
                    friction: 5
                  }).start();
            }
          });
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
    saveProgram = async () => {

            const workouts = {
                warmup: this.state.data[0].workouts,
                primary: this.state.data[1].workouts,
                break:this.state.data[2].workouts,
                secondary: this.state.data[3].workouts,
                cooldown: this.state.data[4].workouts,
                homework: this.state.data[5].workouts,
            }

            await this.props.saveProgramWorkoutData(workouts);

        this.props.goToIndex();
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

        //this.props.goToIndex(0)
    }

    handleWorkoutOnPress = (section, workout) => {
        this.setState({ currWorkoutPressed: workout, currWorkoutPressedSection: section })
        this.RBSheet.current.open()
    }

    handleCaptureNewMediaURI = async (uri, mediaType) => {
        let updatedState = this.state.data;
        switch(this.state.currWorkoutPressedSection)
        {
            case "Warm Up":
                for (let i = 0; i < updatedState[0].workouts.length; i++)
                {
                    let workout = updatedState[0].workouts[i];
                    if (updatedState[0].workouts[i].workout_uid == this.state.currWorkoutPressed.workout_uid)
                    {
                        updatedState[0].workouts[i].workout_media.uri = uri;
                        updatedState[0].workouts[i].workout_media.media_type = mediaType;
                        break;
                    }
                }
            break;
            case "Primary":
                for (let i = 0; i < updatedState[1].workouts.length; i++)
                {
                    let workout = updatedState[1].workouts[i];
                    if (workout.workout_uid == this.state.currWorkoutPressed.workout_uid)
                    {
                        workout.workout_media.uri = uri;
                        workout.workout_media.media_type = mediaType;
                        break;
                    }
                }
            break;
            case "Break":
                for (let i = 0; i < updatedState[2].workouts.length; i++)
                {
                    let workout = updatedState[2].workouts[i];
                    if (workout.workout_uid == this.state.currWorkoutPressed.workout_uid)
                    {
                        workout.workout_media.uri = uri;
                        workout.workout_media.media_type = mediaType;
                        break;
                    }
                }
            break;
            case "Secondary":
                for (let i = 0; i < updatedState[3].workouts.length; i++)
                {
                    let workout = updatedState[3].workouts[i];
                    if (workout.workout_uid == this.state.currWorkoutPressed.workout_uid)
                    {
                        workout.workout_media.uri = uri;
                        workout.workout_media.media_type = mediaType;
                        break;
                    }
                }
            break;
            case "Cooldown":
                for (let i = 0; i < updatedState[4].workouts.length; i++)
                {
                    let workout = updatedState[4].workouts[i];
                    if (workout.workout_uid == this.state.currWorkoutPressed.workout_uid)
                    {
                        workout.workout_media.uri = uri;
                        workout.workout_media.media_type = mediaType;
                        break;
                    }
                }
            break;
            case "Homework":
                for (let i = 0; i < updatedState[5].workouts.length; i++)
                {
                    let workout = updatedState[5].workouts[i];
                    if (workout.workout_uid == this.state.currWorkoutPressed.workout_uid)
                    {
                        workout.workout_media.uri = uri;
                        workout.workout_media.media_type = mediaType;
                        break;
                    }
                }
            break;
            default:
        }

        await this.setState({ data: updatedState })
    }

    closeModalMethod = () => {
        this.setState({ showCamera: false })
    }

    handleTakePictureOrVideo = () => {
        this.RBSheet.current.close();
        this.setState({ showCamera: true })
    }

    render() {
        return (
            <View ref={this.firstView} style={styles.container} onLayout={event => { this.setState({ layoutHeight: event.nativeEvent.layout.height }) }} >
                   <SafeAreaView style={{backgroundColor: '#FFFFFF'}} />
                   <Surface style={styles.contentContainer} onLayout={event => this.setState({ totalSurfaceHeight: event.nativeEvent.layout.height})}>
                       <View style={{flex: 1}} >
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
                            renderDetail={(rowData, sectionID, rowID) => {
                                return (
                                    <View >
                                        <Text style={{ fontFamily: "avenir-roman", fontSize: 20, alignSelf: "flex-start" }}>
                                            {rowData.title}
                                        </Text>
                                        <Text style={{fontSize: 15, fontFamily: 'avenir-light'}}>
                                            {rowData.description}
                                        </Text>
                                        <ScrollView key={rowData.title} ref={this.timelineScrollview} horizontal shouldRasterizeIOS={true} showsHorizontalScrollIndicator={false} onLayout={event => {
                                        if (this.timelineScrollview)
                                        {
                    let height;
                                            switch(rowData.title)
                                            {
                                                case 'Warm Up':
                                                    console.log('warmup: ' + event.nativeEvent.layout.y + event.nativeEvent.layout.height)
                                                    height = this.state.totalSurfaceHeight;  
                                                   this.setState({warmUpListTopY: (height - 20) / 5.5 })
                                                   break;
                                                case 'Primary':
                                       // console.log('primary: ' + event.nativeEvent.layout.y + event.nativeEvent.layout.height)
                                       height = this.state.totalSurfaceHeight;  
                                       this.setState({ primaryListTopY: (height - 20) / 3 })
                                                    break;
                                                    case 'Break':
                                                        height = this.state.totalSurfaceHeight;  
                                                          this.setState({ breakListTopY: (height - 20) / 2.1 })
                                                        break;
                                                        case 'Secondary':
                                                          //  console.log('primary: ' + event.nativeEvent.layout.y + event.nativeEvent.layout.height)
                                                          height = this.state.totalSurfaceHeight;  
                                                          this.setState({ secondaryListTopY: (height - 20) / 1.5 })
                                                            break;
                                                            case 'Cooldown':
                                                                console.log('primary: ' + event.nativeEvent.layout.y + event.nativeEvent.layout.height)
                                                                height = this.state.totalSurfaceHeight;
                                                                this.setState({ cooldownListTopY: (height - 20) / 1.25 })
                                                                break;
                                                                case 'Homework':
                                                                    console.log('surfaceheight: ' + this.state.totalSurfaceHeight)
                                                                    console.log('primary: ' + event.nativeEvent.layout.y + event.nativeEvent.layout.height)
                                                                    this.setState({ homeworkListTopY: (this.state.totalSurfaceHeight - 20) / 1 })
                                                                    break;
                                            }
                                        }
                            }}>
                                            {
                                                rowData.workouts.map(obj => {
                                                    return (
                                                        <TouchableWithoutFeedback onPress={() => this.handleWorkoutOnPress(rowData.title, obj)}>
                                                                                                                    <View style={{alignItems: 'center'}}>
                        <Surface style={{ backgroundColor: '#212121', elevation: 3, width: Dimensions.get("window").width / 5, height: 50, margin: 2, borderRadius: 10, alignItems: "center", justifyContent: "center" }}>
                                                            {
                                                                obj.workout_media.media_type == "VIDEO" ?
                                                                <Video source={{ uri: obj.workout_media.uri }}
                                                                    rate={1.0}
                                                                    volume={10}
                                                                    isMuted={false}
                                                                    resizeMode="cover"
                                                                    shouldPlay={true}
                                                                    isLooping={true}
                                                                    style={{width: "100%",
                                                                    height: "100%",
                                                                    borderRadius: 10}}
                                                                    />
                                                                :
                                                                <Image style={{width: '100%', height: '100%', borderRadius: 10}} source={{uri: obj.workout_media.uri}} />

                                                            }
                                                        </Surface>
                                                        <Text style={{fontSize: 10}}>
                                                           {obj.workout_name}
                                                        </Text>
                                                        </View>
                                                        </TouchableWithoutFeedback>
                                                    )
                                                })
                                            }
                                        </ScrollView>
                                    </View>
                                )
                            }}
                        />
                       </View>

                        <FAB 
                            icon="done" 
                            color="#FFFFFF" 
                            style={{position: 'absolute', bottom: 0, right: 0, margin: 16, backgroundColor: "#2196F3"}}
                            onPress={() => this.saveProgram()}
                            />
                    </Surface>
                    <View style={{flex: 1, flexDirection: 'row', padding: 5, backgroundColor: "#212121"}}>
                    {
                        this.props.lupa_data.Application_Workouts.applicationWorkouts.map(workout => {
                            if (workout.workout_name == "" || workout.workout_name == undefined)
                            {
                                return
                            }
                            return (
                                                                    <SingleWorkout 
                                workoutData={workout}
                                warmUpListTopY={this.state.warmUpListTopY} 
                                warmUpListBottomY={this.state.warmUpListBottomY}
                                primaryListTopY={this.state.primaryListTopY}
                                breakListTopY={this.state.breakListTopY}
                                secondaryListTopY={this.state.secondaryListTopY}
                                cooldownListTopY={this.state.cooldownListTopY}
                                homeworkListTopY={this.state.homeworkListTopY}
                                captureWorkout={(section, workoutObj) => this.captureWorkout(section, workoutObj)} />
                            )
                        })
                    }
                    </View>


                  <RBSheet
          ref={this.RBSheet}
          height={350}
          openDuration={250}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center"
            }
          }}
       >
           <View style={{flex: 1}}>
               <Text style={{alignSelf: 'center', fontFamily: 'ARSMaquettePro-Medium', fontSize: 15, padding: 10}}>
                   Add a customized graphic
               </Text>
               <View style={{flex: 1, justifyContent: 'space-evenly'}}>
               <View style={{padding: 20, width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',}}>
            <ThinFeatherIcon
name="upload"
size={18}
color="#000000"
thin={false}
style={{margin: 5}}
        /> 

                <Text style={{fontFamily: 'ARSMaquettePro-Regular', fontSize: 15}}>
                    Upload a picture or video
                </Text>
            </View>
            <Divider />
            <TouchableHighlight onPress={() => this.handleTakePictureOrVideo()}>
            <View style={{padding: 20, width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',}}>
            <ThinFeatherIcon
name="camera"
size={18}
color="#000000"
thin={false}
style={{margin: 5}}
/>
                <Text style={{fontFamily: 'ARSMaquettePro-Regular', fontSize: 15}}>
                    Take a picture or video
                </Text>
            </View>
            </TouchableHighlight>
            <Divider />
            <View style={{padding: 20, width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',}}>
            <ThinFeatherIcon
name="trash"
size={18}
color="#000000"
thin={false}
style={{margin: 5}}
/>
                <Text style={{fontFamily: 'ARSMaquettePro-Regular', fontSize: 15}}>
                   Delete Workout
                </Text>
            </View>
               </View>
            
           </View>
       </RBSheet>
        
                
                
              {/*  <WorkoutTool setProgramUUID={uuid => this.setProgramUUID(uuid)} updateWorkoutData={state => this.updateWorkoutData(state)} /> */}
            <LupaCamera 
            isVisible={this.state.showCamera} 
            currWorkoutPressed={this.state.currWorkoutPressed} 
            currProgramUUID={this.state.currProgramUUID} 
            handleCaptureNewMediaURI={(uri, type) => this.handleCaptureNewMediaURI(uri, type)}
            closeModalMethod={this.closeModalMethod}
            />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#212121",
    },
    contentContainer: {
        //marginTop: Dimensions.get("screen").height / 4,
        width: '100%',
        flex: 2,
        backgroundColor: "white",
        padding: 10,
        elevation: 0, 
    },
    scrollViewContent: {

    },
    headerText: {
        fontSize: 25,
        fontWeight: "800",
        color: "white",
    },
    textContainer: {
        alignItems: 'center',
        justifyContent: "center",
        flex: 1,
    },
    videoContainer: {
        margin: 5,
        backgroundColor: "white",
        borderRadius: 10,
        width: Dimensions.get("window").width / 5,
        height: 50,
        elevation: 3,
        alignItems: "center",
        justifyContent: "center",
    },
    video: {
        width: "100%",
        height: "100%",
        borderRadius: 10
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
      },
      preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
      },
      capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
        position: 'absolute',
        bottom: 50,
      },
})

export default connect(mapStateToProps, mapDispatchToProps)(BuildWorkout);
