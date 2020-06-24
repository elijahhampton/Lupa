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
    TextInput as NativeTextInput,
    ScrollView,
    Image,
    TouchableHighlight,
    Animated,
    Button as NativeButton,
    Slider,
    KeyboardAvoidingView,
} from 'react-native';

import {
    FAB,
    IconButton,
    Surface,
    Menu,
    Modal as PaperModal,
    Dialog,
    Button,
    Chip,
    TextInput,
    Divider,
    Title,
    Caption,
} from 'react-native-paper';

import { RNCamera } from 'react-native-camera';

import TimeLine from 'react-native-timeline-flatlist';
import RBSheet from "react-native-raw-bottom-sheet";

import { Video } from 'expo-av';

import { connect } from 'react-redux';

import LupaController from '../../../../controller/lupa/LupaController';

import ThinFeatherIcon from "react-native-feather1s";

import FeatherIcon from "react-native-vector-icons/Feather"
import { LinearGradient } from 'expo-linear-gradient';
import SingleWorkout from '../../component/SingleWorkout';
import LupaCamera from './component/LupaCamera'
import { getLupaProgramInformationStructure } from '../../../../model/data_structures/programs/program_structures';
import {fromString} from 'uuidv4';

import ImagePicker from 'react-native-image-picker';
import { LOG_ERROR } from '../../../../common/Logger';

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

function WorkoutSchemeModal(props) {
    let [repSliderValue, setRepSliderValue] = useState(0);
    let [setSliderValue, setSetSliderValue] = useState(0);
    return (
        <PaperModal visible={false} contentContainerStyle={{borderRadius: 10, alignSelf: 'center', width: Dimensions.get('window').width - 50, height: Dimensions.get('window').height / 2, backgroundColor: '#FFFFFF'}}>
            <View style={{flex: 1, padding: 5}}>
                <View style={{flex: 1}}>
                    <View style={{padding: 5}}>
                    <Text style={{fontFamily: 'ARSMaquettePro-Medium', fontSize: 20}}>
                       Change workout sets and reps
                    </Text>
                    <Caption>
                        You can change the sets and reps of any workout before the workout begins when started.
                    </Caption>
                    </View>
                </View>

                <Divider />

                <View style={{flex: 3, justifyContent: 'center'}}>
                    <Text style={{alignSelf: 'center', padding: 10}}>
                        {props.workout.workout_name}
                    </Text>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <Text>
                        <Text style={{fontFamily: 'ARSMaquettePro-Regular', fontSize: 15}}>
                            Reps:
                        </Text>
                        <Text>
                            {" "}
                        </Text>
                        <Text  style={{fontSize: 20, fontFamily: 'ARSMaquettePro-Medium', color: '#2196F3'}}>
                            {repSliderValue}
                        </Text>
                        </Text>
                        
                        <Slider value={repSliderValue} step={1} minimumValue={0} maximumValue={15} onValueChange={value => setRepSliderValue(value)} />
                    </View>

                    <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text>
                        <Text style={{fontFamily: 'ARSMaquettePro-Regular', fontSize: 15}}>
                            Sets:
                        </Text>
                        <Text>
                            {" "}
                        </Text>
                        <Text style={{fontSize: 20, fontFamily: 'ARSMaquettePro-Medium', color: '#2196F3'}}>
                            {setSliderValue}
                        </Text>
                        </Text>
                        <Slider value={setSliderValue} step={1} minimumValue={0} maximumValue={15} onValueChange={value => setSetSliderValue(value)} />
                    </View>
                </View>

                <Divider />

                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Button mode="contained" style={{elevation: 0, width: '80%'}}  theme={{
                        colors: {
                            primary: '#2196F3'
                        }
                    }} onPress={() => props.captureValues(setSliderValue, repSliderValue)}>
                        Finish
                    </Button>
                </View>
            </View>
        </PaperModal>
    )
}

function AddDescriptionModal(props) {
    const [description, setDescription] = useState("")

    const saveDescription = () => {
        props.captureData(description)
        props.closeDialogMethod()
    }

    return (
                    <Dialog visible={props.isVisible} style={{position: 'absolute', top: Dimensions.get('window').height / 4, alignSelf: 'center', width: Dimensions.get('window').width - 20, height: 'auto'}} theme={{
                        colors: {
                            primary: '#23374d'
                        }
                    }}>
            <Dialog.Title>
                Add a description
            </Dialog.Title>
            <Divider />
            <Dialog.Content>
                <TextInput value={description} onChangeText={text => setDescription(text)} multiline mode="flat" placeholder="The purpose of this exercise is to..." label="Descriptions" theme={{
                        colors: {
                            primary: '#23374d'
                        }
                    }}/>
            </Dialog.Content>
            <Dialog.Actions>
                <Button mode="text" theme={{
                        colors: {
                            primary: '#23374d'
                        }
                    }} onPress={() => props.closeDialogMethod()}>
                    Cancel
                </Button>
                <Button mode="text" theme={{
                        colors: {
                            primary: '#23374d'
                        }
                    }} onPress={saveDescription}>
                    Save
                </Button>
            </Dialog.Actions>
        </Dialog>
    )
}

function AddCueModal(props) {
    const [cue, setCue] = useState("");

    const saveCue = () => {
        props.captureData(cue);
        props.closeDialogMethod();
    }

    return (
                    <Dialog visible={props.isVisible} style={{position: 'absolute', top: Dimensions.get('window').height / 4.3, alignSelf: 'center', width: Dimensions.get('window').width - 20, height: 'auto'}} theme={{
                        colors: {
                            primary: '#23374d'
                        }
                    }}>
            <Dialog.Title>
                Add a cue
            </Dialog.Title>
            <Divider />
            <Dialog.Content style={{alignItems: 'center', padding: 20}}>
                <NativeTextInput value={cue} onChangeText={text => setCue(text)} placeholder="Watch your back in this movement" style={{fontSize: 15, padding: 5, width: '100%', borderBottomWidth: 1.5}} />
            </Dialog.Content>
            <Dialog.Actions>
                <Button mode="text" theme={{
                        colors: {
                            primary: '#23374d'
                        }
                    }} onPress={() => props.closeDialogMethod()}>
                    Cancel
                </Button>
                <Button mode="text" theme={{
                        colors: {
                            primary: '#23374d'
                        }
                    }} onPress={saveCue}>
                    Save
                </Button>
            </Dialog.Actions>
        </Dialog>
    )
}

function AddedExercisePreviewModal(props) {
    const { exerciseData, isVisible } = props;

    const getWorkoutMedia = () => {
        if (typeof(exerciseData) == 'undefined' || typeof(exerciseData.workout_media.uri) == 'undefined')
        {
            return (
                <View style={{flex: 1, backgroundColor: '#FAFAFA'}}/>
            )
        }
        try {
            return (
                <Image resizeMode="cover" style={{width: '100%', height: '100%', borderRadius: 20}} source={{uri: exerciseData.workout_media.uri}} />
            )
        } catch(error) {
            LOG_ERROR('BuildWorkout.js', 'Caught exception in AddedExercisePreviewModal trying to display workout image.', error)
            return (
                <View style={{flex: 1, backgroundColor: '#FAFAFA'}}/>
            )
        }
    }

    const getWorkoutDescription = () => {
        if (typeof(exerciseData) == 'undefined')
        {
            return (
                <Text>
                     {" "}
                </Text>
            )
        }
        try {
            return (
                <Text>
                    {exerciseData.workout_description}
                </Text>
            )
        } catch(error) {
            LOG_ERROR('BuildWorkout.js', 'Caught exception in AddedExercisePreviewModal trying to display workout image.', error)
                return (
                    <Text>
                         {" "}
                    </Text>
                )
        }
    }

    const getWorkoutCue = () => {
        if (typeof(exerciseData) == 'undefined')
        {
            return (
                <Text>
                     {" "}
                </Text>
            )
        }
        try {
            return (
                <Text>
                    {exerciseData.workout_cue}
                </Text>
            )
        } catch(error) {
            LOG_ERROR('BuildWorkout.js', 'Caught exception in AddedExercisePreviewModal trying to display workout image.', error)
                return (
                    <Text>
                         {" "}
                    </Text>
                )
        }
    }

    const getWorkoutSets= () => {
        if (typeof(exerciseData) == 'undefined')
        {
            return (
                <Text>
                     {" "}
                </Text>
            )
        }
        try {
            return (
                <Text>
                    {exerciseData.workout_sets}
                </Text>
            )
        } catch(error) {
            LOG_ERROR('BuildWorkout.js', 'Caught exception in AddedExercisePreviewModal trying to display workout image.', error)
                return (
                    <Text>
                         {" "}
                    </Text>
                )
        }
    }

    const getWorkoutReps = () => {
        if (typeof(exerciseData) == 'undefined')
        {
            return (
                <Text>
                     {" "}
                </Text>
            )
        }
        try {
            return (
                <Text>
                    {exerciseData.workout_reps}
                </Text>
            )
        } catch(error) {
            LOG_ERROR('BuildWorkout.js', 'Caught exception in AddedExercisePreviewModal trying to display workout image.', error)
                return (
                    <Text>
                         {" "}
                    </Text>
                )
        }
    }
    return (
        <PaperModal visible={props.isVisible} contentContainerStyle={{borderRadius: 10, alignSelf: 'center', width: Dimensions.get('window').width - 50, height: Dimensions.get('window').height / 2, backgroundColor: '#FFFFFF'}}>
            <View style={{flex: 1, padding: 5}}>
                <Surface style={{marginTop: 10, width: '50%', elevation: 5, height: 110, alignSelf: 'center', borderRadius: 20}}>
                    {getWorkoutMedia()}
                </Surface>
            </View>

            <View style={{flex: 1}}>
                <Text>
                    {getWorkoutDescription()}
                </Text>

                <Text>
                    {getWorkoutCue()}
                </Text>

                <Text>
                    {getWorkoutSets()}
                </Text>

                <Text>
                    {getWorkoutReps()}
                </Text>
            </View>

            <Button mode="text" onPress={props.closeModalMethod}>
                Done
            </Button>
        </PaperModal>
    )
}

class BuildWorkout extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            currProgramUUID: "",
            currWorkoutPressed: {
                workout_name: '',
                workout_description: '',
                workout_media: {
                    workout_media: '',
                    uri: '',
                },
                workout_reps: 0,
                workout_sets: 0,
                workout_tags: [],
                workout_uid: '',
                workout_cue: '',
            },
            currWorkoutPressedSection: "",
            buildAWorkout: true,
            logAWorkout: false,
            searchValue: "",
            data: [
                { title: "Warm Up", description: "Prepare for physical exertion or a performance by exercising or practicing gently beforehand", workouts: [] },
                { title: "Primary", description: "Prime workouts to begin the program",  workouts: [] },
                { title: "Break", description: "A space to add custom workout components for your programs ",  workouts: [] },
                { title: "Secondary", description: "Secondary prime workouts",  workouts: [] },
                { title: "Cooldown", description: "Workout components to bring the program to an end",  workouts: [] },
                { title: "Homework", description: "End your program with custom workout components as post task",  workouts: [] },
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
            showWorkoutSchemeModal: false,
            flatlistValues: [],
            currPressedNonPopulatedWorkout: "",
            currPressedPopulatedWorkout: {
                workout_name: '',
                workout_description: '',
                workout_media: {
                    workout_media: '',
                    uri: '',
                },
                workout_reps: 0,
                workout_sets: 0,
                workout_tags: [],
                workout_uid: '',
                workout_cue: '',
            },
            menuVisible: false,
            mediaCaptureType: 'VIDEO',
            addDescriptionModalIsVisible: false,
            addCueModalModalIsVisible: false,
            addedExercisePreviewModal: false,
        }

       this.RBSheet = React.createRef();

        this.animatedViewRef = React.createRef()
        this.firstView = React.createRef()
        this.timelineScrollview = React.createRef()
        this.title = React.createRef()

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
        this.setState({ currPressedPopulatedWorkout: workout, currWorkoutPressedSection: section })
        this.RBSheet.current.open()
    }

    handleWorkoutOnLongPress = (section, workout) => {
        this.setState({ currPressedPopulatedWorkout: workout, currWorkoutPressedSection: section })
        this.showAddedExercisePreviewModal()
    }

    showAddedExercisePreviewModal = () => {
        this.setState({ addedExercisePreviewModal: true })
    }

    closeAddedExercisePreviewModal = () => {
        this.setState({ addedExercisePreviewModal: false })
    }

    handleCaptureNewMediaURI = async (uri, mediaType) => {
        if (this.state.currPressedPopulatedWorkout == undefined)
        {
          
            return;
        }
        let updatedState = this.state.data;
        switch(this.state.currWorkoutPressedSection)
        {
            case "Warm Up":
                for (let i = 0; i < updatedState[0].workouts.length; i++)
                {
                    let workout = updatedState[0].workouts[i];
                    if (workout.workout_uid == this.state.currPressedPopulatedWorkout.workout_uid)
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
                    if (workout.workout_uid == this.state.currPressedPopulatedWorkout.workout_uid)
                    {
                        updatedState[1].workouts[i].workout_media.uri = uri;
                        updatedState[1].workouts[i].workout_media.media_type = mediaType;
                        break;
                    }
                }
            break;
            case "Break":
                for (let i = 0; i < updatedState[2].workouts.length; i++)
                {
                    let workout = updatedState[2].workouts[i];
                    if (workout.workout_uid == this.state.currPressedPopulatedWorkout.workout_uid)
                    {
                        updatedState[2].workouts[i].workout_media.uri = uri;
                        updatedState[2].workouts[i].workout_media.media_type = mediaType;
                        break;
                    }
                }
            break;
            case "Secondary":
                for (let i = 0; i < updatedState[3].workouts.length; i++)
                {
                    let workout = updatedState[3].workouts[i];
                    if (workout.workout_uid == this.state.currPressedPopulatedWorkout.workout_uid)
                    {
                        updatedState[3].workouts[i].workout_media.uri = uri;
                        updatedState[3].workouts[i].workout_media.media_type = mediaType;
                        break;
                    }
                }
            break;
            case "Cooldown":
                for (let i = 0; i < updatedState[4].workouts.length; i++)
                {
                    let workout = updatedState[4].workouts[i];
                    if (workout.workout_uid == this.state.currPressedPopulatedWorkout.workout_uid)
                    {
                        updatedState[4].workouts[i].workout_media.uri = uri;
                        updatedState[4].workouts[i].workout_media.media_type = mediaType;
                        break;
                    }
                }
            break;
            case "Homework":
                for (let i = 0; i < updatedState[5].workouts.length; i++)
                {
                    let workout = updatedState[5].workouts[i];
                    if (workout.workout_uid == this.state.currPressedPopulatedWorkout.workout_uid)
                    {
                        updatedState[5].workouts[i].workout_media.uri = uri;
                        updatedState[5].workouts[i].workout_media.media_type = mediaType;
                        break;
                    }
                }
            break;
            default:
        }

        await this.setState({ data: updatedState, currPressedPopulatedWorkout: undefined, })
    }

    closeModalMethod = () => {
        this.setState({ showCamera: false })
    }

    handleTakePicture = () => {
        this.RBSheet.current.close();
        this.setState({ showCamera: true, mediaCaptureType: 'IMAGE' })
    }

    handleTakeVideo= () => {
        this.RBSheet.current.close();
        this.setState({ showCamera: true, mediaCaptureType: 'VIDEO' })
    }

    showChangeWorkoutSchemeModal = () => {
        this.setState({
            showWorkoutSchemeModal: true
        })
    }

    closeChangeWorkoutSchemeModal = () => {
        this.setState({
            showWorkoutSchemeModal: false,
        })
    }

    captureSetAndRepValues = async (sets, reps) => {
        const currPressedWorkout = this.state.currWorkoutPressed;
        const currWorkoutPressedSection = this.state.currWorkoutPressedSection

        let updatedState = this.state.data;

        switch(currWorkoutPressedSection)
        {
            case "Warm Up":
                for (let i = 0; i < updatedState[0].workouts.length; i++)
                {
                    let workout = updatedState[0].workouts[i];
                    if (updatedState[0].workouts[i].workout_uid == this.state.currWorkoutPressed.workout_uid)
                    {
                        updatedState[0].workouts[i].workout_sets = sets;
                        updatedState[0].workouts[i].workout_reps = reps;
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
                        updatedState[0].workouts[i].workout_sets = sets;
                        updatedState[0].workouts[i].workout_reps = reps;
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
                        updatedState[0].workouts[i].workout_sets = sets;
                        updatedState[0].workouts[i].workout_reps = reps;
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
                        updatedState[0].workouts[i].workout_sets = sets;
                        updatedState[0].workouts[i].workout_reps = reps;
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
                        updatedState[0].workouts[i].workout_sets = sets;
                        updatedState[0].workouts[i].workout_reps = reps;
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
                        updatedState[0].workouts[i].workout_sets = sets;
                        updatedState[0].workouts[i].workout_reps = reps;
                        break;
                    }
                }
            break;
            default:
        }

        await this.setState({ data: updatedState })
        this.closeChangeWorkoutSchemeModal()
    }

    captureValues = async (value) => {
        const updatedState = await this.state.flatlistValues;
        await updatedState.push(value);

        await this.setState({
            flatlistValues: updatedState
        })
    }

    captureNonPopulatedWorkout = async (obj) => {
     
        this.setState({
            currPressedNonPopulatedWorkout: obj
        })
    }

    addNonPopulatedToState = async (section) => {
        

        if (this.state.currPressedNonPopulatedWorkout == undefined 
            || this.state.currPressedNonPopulatedWorkout.workout_name  == "" 
            || this.state.currPressedNonPopulatedWorkout.workout_name == undefined)
        {
            return;
        }



        //We assign the workout a new UUID so the workouts are not the same
       const updatedWorkout = {
           workout_name: this.state.currPressedNonPopulatedWorkout.workout_name,
           workout_description: this.state.currPressedNonPopulatedWorkout.workout_description,
           workout_media: {
               uri: "",
               media_type: ""
           },
           workout_steps: this.state.currPressedNonPopulatedWorkout.workout_steps,
           workout_tags: this.state.currPressedNonPopulatedWorkout.workout_tags,
           workout_uid: fromString(Math.random().toString()),
           workout_section: section //add the section so it is easy to delete
       }

        let updatedState = this.state.data;
        switch(section)
        {
            case "Warm Up":
                    updatedState[0].workouts.push(updatedWorkout)
            break;
            case "Primary":
                updatedState[1].workouts.push(updatedWorkout)
            break;
            case "Break":
                updatedState[2].workouts.push(updatedWorkout)
            break;
            case "Secondary":
                updatedState[3].workouts.push(updatedWorkout)
            break;
            case "Cooldown":
                updatedState[4].workouts.push(updatedWorkout)
            break;
            case "Homework":
                updatedState[5].workouts.push(updatedWorkout)
            break;
            default:
        }

        await this.setState({ data: updatedState, currPressedNonPopulatedWorkout: undefined })
    }

    removePopulatedWorkoutFromProgram = () => {
        const workoutToRemove = this.state.currPressedPopulatedWorkout;
        const updatedState = this.state.data;
        const sectionToAccess = workoutToRemove.workout_section;

        switch(sectionToAccess)
        {
            default:
        }

    }

    getWorkoutSurfaceContent = (workout) => {
        try{
            if (workout.workout_media.uri != undefined)
            {
                return (
                    workout.workout_media.media_type == "VIDEO" ?
                    <Video key={workout.workout_uid} source={{ uri: workout.workout_media.uri }}
                        rate={1.0}
                        volume={0}
                        isMuted={true}
                        resizeMode="cover"
                        shouldPlay={false}
                        isLooping={false}
                        style={{width: "100%",
                        height: "100%",
                        borderRadius: 10}}
                        />
                    :
                    <Image style={{width: '100%', height: '100%', borderRadius: 10}} source={{uri: workout.workout_media.uri}} />
                )
            }
            else
            {
               return (
                <View style={{flex: 1, backgroundColor: '#212121'}}>
    
                </View>
               ) 
            }
        } catch(err) {
        
        }
    }

    addWorkoutMedia = () => {
        if (typeof(currPressedPopulatedWorkout) == 'undefined')
        {
            return;
        }
        // Open Image Library
        ImagePicker.launchImageLibrary({}, async (response) => {
            if (response.didCancel) {
                LOG_ERROR('BuildWorkout.js', 'User cancelled image picker in addWorkoutMedia()', 'true');
              } else if (response.error) {
                  LOG_ERROR('BuildWorkout.js', 'Caught exception in image picker in addWorkoutMedia()', response.error);
              } else {
                const source = { uri: response.uri };
                const workoutMediaURI = await this.LUPA_CONTROLLER_INSTANCE.saveProgramWorkoutGraphic(this.state.currPressedPopulatedWorkout, this.state.currProgramUUID, 'IMAGE', source.uri)
                this.handleCaptureNewMediaURI(workoutMediaURI, 'IMAGE');
            }
        });
    }

    showAddDescriptionModal = () => {
        this.setState({ addDescriptionModalIsVisible: true })
    }

    closeAddDescriptionModal = () => {
        this.setState({ addDescriptionModalIsVisible: false })
    }

    handleCaptureDescription = async (description) => {
        const currPressedWorkout = this.state.currWorkoutPressed;
        const currWorkoutPressedSection = this.state.currWorkoutPressedSection

        if (typeof(currPressedWorkout) == 'undefined' || typeof(currWorkoutPressedSection) == 'undefined' || description == "")
        {
            return;
        }

        let updatedState = this.state.data;

        switch(currWorkoutPressedSection)
        {
            case "Warm Up":
                for (let i = 0; i < updatedState[0].workouts.length; i++)
                {
                    let workout = updatedState[0].workouts[i];
                    if (updatedState[0].workouts[i].workout_uid == this.state.currWorkoutPressed.workout_uid)
                    {
                        updatedState[0].workouts[i].workout_description = description;
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
                        updatedState[0].workouts[i].workout_description = description;
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
                        updatedState[0].workouts[i].workout_description = description;
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
                        updatedState[0].workouts[i].workout_description = description;
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
                        updatedState[0].workouts[i].workout_description = description;
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
                        updatedState[0].workouts[i].workout_description = description;
                        break;
                    }
                }
            break;
            default:
        }

        await this.setState({ data: updatedState })
        this.closeAddDescriptionModal();
    }

    showAddCueModal = () => {
        this.setState({ addCueModalModalIsVisible: true })
    }

    closeAddCueModal = () => {
        this.setState({ addCueModalModalIsVisible: false })
    }

    handleCaptureCue = async (cue) => {
        const currPressedWorkout = this.state.currWorkoutPressed;
        const currWorkoutPressedSection = this.state.currWorkoutPressedSection

        if (typeof(currPressedWorkout) == 'undefined' || typeof(currWorkoutPressedSection) == 'undefined' || cue == "")
        {
            return;
        }

        let updatedState = this.state.data;

        switch(currWorkoutPressedSection)
        {
            case "Warm Up":
                for (let i = 0; i < updatedState[0].workouts.length; i++)
                {
                    let workout = updatedState[0].workouts[i];
                    if (updatedState[0].workouts[i].workout_uid == this.state.currWorkoutPressed.workout_uid)
                    {
                        updatedState[0].workouts[i].workout_cue = cue;
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
                        updatedState[0].workouts[i].workout_cue = cue;
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
                        updatedState[0].workouts[i].workout_cue = cue;
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
                        updatedState[0].workouts[i].workout_cue = cue;
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
                        updatedState[0].workouts[i].workout_cue = cue;
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
                        updatedState[0].workouts[i].workout_cue = cue;
                        break;
                    }
                }
            break;
            default:
        }

        await this.setState({ data: updatedState })
        this.closeAddCueModal();
    }

    render() {
        return (
            <View ref={this.firstView} style={styles.container} onLayout={event => { this.setState({ layoutHeight: event.nativeEvent.layout.height }) }}>
                   <SafeAreaView style={{backgroundColor: '#FFFFFF'}} />
                   <Surface style={styles.contentContainer} onLayout={event => this.setState({ totalSurfaceHeight: event.nativeEvent.layout.height})}>
                       <Button style={{alignSelf: 'flex-end'}} theme={{
                           colors: {
                               primary: 'rgb(30,136,229)'
                           }
                       }} onPress={() => this.props.goBackToEditInformation()}>
                            Edit Program Information
                       </Button>
                       <View style={{flex: 1}} >

                       <TimeLine
                       onEventPress={(rowData) => this.addNonPopulatedToState(rowData.title)}
                            captureValues={this.captureValues}
                            listViewStyle={{ height: '100%'}}
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
                                    <View>
                                        <Text style={{ fontFamily: "avenir-roman", fontSize: 20, alignSelf: "flex-start" }}>
                                            {rowData.title}
                                        </Text>
                                        <Text style={{fontSize: 15, fontFamily: 'avenir-light'}}>
                                            {rowData.description}
                                        </Text>
                                        <ScrollView 
                                        key={rowData.title} 
                                        ref={this.timelineScrollview} 
                                        horizontal 
                                        shouldRasterizeIOS={true} 
                                        showsHorizontalScrollIndicator={false}>
                                            {
                                                rowData.workouts.map(obj => {
                                                    return (
                                                        <TouchableWithoutFeedback key={obj.workout_uid} onPress={() => this.handleWorkoutOnPress(rowData.title, obj)} onLongPress={() => this.handleWorkoutOnLongPress(rowData.title, obj)}>
                                                                                                                    <View style={{alignItems: 'center'}}>
                        <Surface style={{ backgroundColor: '#212121', elevation: 3, width: Dimensions.get("window").width / 5, height: 50, margin: 2, borderRadius: 10, alignItems: "center", justifyContent: "center" }}>
                                                            {
                                                                this.getWorkoutSurfaceContent(obj)
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
                    <View style={{flex: 1.2}}>

                    <Menu
            visible={this.state.menuVisible}
            onDismiss={() => this.setState({ menuVisible: false })}
            
            anchor={
                <Button mode="text" compact color="#FFFFFF" onPress={() => this.setState({ menuVisible: true })}>
                <Text>
                    All Workouts
                </Text>
                <FeatherIcon name="chevron-down" />
            </Button>
            }
          >
            <Menu.Item onPress={() => {}} title="Workout Category 1" />
            <Menu.Item onPress={() => {}} title="Workout Category 2" />
            <Menu.Item onPress={() => {}} title="Workout Category 3" />
            <Menu.Item onPress={() => {}} title="Workout Category 4" />
            <Divider />
            <Menu.Item onPress={() => this.setState({ menuVisible: false })} title="Cancel" />
          </Menu>



                    <ScrollView contentContainerStyle={{flexWrap: 'wrap', justifyContent: 'center', width: Dimensions.get('window').width,  flexDirection: 'row', padding: 5, backgroundColor: "#212121"}}>
                    {
                        this.props.lupa_data.Application_Workouts.applicationWorkouts.map((workout, index, arr)=> {
                            if (workout.workout_name == "" || workout.workout_name == undefined)
                            {
                                return
                            }

                            const layoutValues = this.state.flatlistValues;
                            layoutValues.sort()
                            workout.workout_uid = fromString(workout.workout_name + (Math.random() * index).toString)
                            return (
                                                                    <SingleWorkout 
                                workoutData={workout}
                                warmUpListTopY={layoutValues[1]} 
                                primaryListTopY={layoutValues[2]}
                                breakListTopY={layoutValues[3]}
                                secondaryListTopY={layoutValues[4]}
                                cooldownListTopY={layoutValues[5]}
                                homeworkListTopY={layoutValues[5 + 100]}
                                captureWorkout={(section, workoutObj) => this.captureWorkout(section, workoutObj)} 
                                captureNonPopulatedWorkout={(obj) => this.captureNonPopulatedWorkout(obj)}
                                />
                            )
                        })
                    }
                    </ScrollView>
                    </View>


                  <RBSheet
          ref={this.RBSheet}
          height={Dimensions.get('window').height / 1.2}
          openDuration={250}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center",
              borderTopRightRadius: 35,
                borderTopLeftRadius: 35,
            }
          }}
       >
           <View style={{flex: 1}}>
               <Text style={{alignSelf: 'center', fontFamily: 'ARSMaquettePro-Medium', fontSize: 15, padding: 10}}>
                   Workout Options
               </Text>
               
               <View style={{flex: 1, justifyContent: 'space-evenly'}}>
            <TouchableOpacity onPress={() => this.handleTakeVideo()}>
            <View style={{width: Dimensions.get('window').width, height: 'auto', padding: 5, width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',}}>
            <ThinFeatherIcon
name="video"
size={18}
color="#000000"
thin={false}
style={styles.exerciseOptionIcon}
/>
<View style={{paddingVertical: 1.5}}>
<Text style={styles.exerciseOptionHeaderText}>
                    Record a video
                </Text>
                <Caption>
                    Take a video to use as the exercise media
                </Caption>
</View>
            </View>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity onPress={() => this.handleTakePicture()}>
            <View style={{width: Dimensions.get('window').width, height: 'auto', padding: 5, width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',}}>
            <ThinFeatherIcon
name="camera"
size={18}
color="#000000"
thin={false}
style={styles.exerciseOptionIcon}
/>
<View style={{paddingVertical: 1.5}}>
<Text style={styles.exerciseOptionHeaderText}>
                    Take a picture
                </Text>
                <Caption>
                    Take a picture to use as the exercise media
                </Caption>
</View>
            </View>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity onPress={() => this.addWorkoutMedia()}>
            <View style={{width: Dimensions.get('window').width, height: 'auto', padding: 5, width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',}}>
            <ThinFeatherIcon
name="film"
size={18}
color="#000000"
thin={false}
style={styles.exerciseOptionIcon}
/>
<View style={{paddingVertical: 1.5, width: '95%'}}>
<Text style={styles.exerciseOptionHeaderText}>
                Upload media
                </Text>
                <Caption>
                    Use a picture or video from your camera roll to use as the exercise media
                </Caption>
</View>
            </View>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity onPress={this.showAddDescriptionModal}>
            <View style={{width: Dimensions.get('window').width, height: 'auto', padding: 5, width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',}}>
            <ThinFeatherIcon
name="edit"
size={18}
color="#000000"
thin={false}
style={styles.exerciseOptionIcon}
/>
<View style={{paddingVertical: 1.5}}>
<Text style={styles.exerciseOptionHeaderText}>
                    Add a description
                </Text>
                <Caption>
                   Write a brief description of what this exercise will accomplish
                </Caption>
</View>
            </View>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity onPress={this.showAddCueModal}>
            <View style={{width: Dimensions.get('window').width, height: 'auto', padding: 5, width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',}}>
            <ThinFeatherIcon
name="edit"
size={18}
color="#000000"
thin={false}
style={styles.exerciseOptionIcon}
/>
<View style={{paddingVertical: 1.5}}>
<Text style={styles.exerciseOptionHeaderText}>
                    Add a cue
                </Text>
                <Caption>
                    Use cues to as special instructions during an exercise
                </Caption>
</View>
            </View>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity onPress={this.showChangeWorkoutSchemeModal}>
            <View style={{width: Dimensions.get('window').width, height: 'auto', padding: 5, width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',}}>
            <ThinFeatherIcon
name="clipboard"
size={18}
color="#000000"
thin={false}
style={styles.exerciseOptionIcon}
/>
<View style={{paddingVertical: 1.5}}>
<Text style={styles.exerciseOptionHeaderText}>
                    Edit Set/Rep Scheme
                </Text>
                <Caption>
                    Specify a specific number of sets or reps for this exercise
                </Caption>
</View>
            </View>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity onPress={this.removePopulatedWorkoutFromProgram}>
            <View style={{width: Dimensions.get('window').width, height: 'auto', padding: 5, width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',}}>
            <ThinFeatherIcon
name="trash"
size={18}
color="#000000"
thin={false}
style={styles.exerciseOptionIcon}
/>
<View style={{paddingVertical: 1.5}}>
<Text style={[styles.exerciseOptionHeaderText, { color: 'rgba(229,57,53 ,1)' }]}>
                    Delete exercise
                </Text>
                <Caption style={{color: 'rgba(229,57,53 ,1)'}}>
                    Remove this exercise from the program
                </Caption>
</View>
            </View>
            </TouchableOpacity>
               </View>
            
           </View>
           <SafeAreaView />
       </RBSheet>
        
                
                
              {/*  <WorkoutTool setProgramUUID={uuid => this.setProgramUUID(uuid)} updateWorkoutData={state => this.updateWorkoutData(state)} /> */}
              <WorkoutSchemeModal isVisible={this.state.showWorkoutSchemeModal} workout={this.state.currWorkoutPressed} captureValues={(sets, reps) => this.captureSetAndRepValues(sets, reps)} />
            <LupaCamera 
            isVisible={this.state.showCamera} 
            currWorkoutPressed={this.state.currPressedPopulatedWorkout} 
            currProgramUUID={this.state.currProgramUUID} 
            handleCaptureNewMediaURI={(uri, type) => this.handleCaptureNewMediaURI(uri, type)}
            mediaCaptureType={this.state.mediaCaptureType}
            closeModalMethod={this.closeModalMethod}
            />

            <AddDescriptionModal isVisible={this.state.addDescriptionModalIsVisible} closeDialogMethod={this.closeAddDescriptionModal} captureData={description => this.handleCaptureDescription(description)} />
            <AddCueModal isVisible={this.state.addCueModalModalIsVisible} closeDialogMethod={this.closeAddCueModal} captureData={cue => this.handleCaptureCue(cue)} />
            <AddedExercisePreviewModal exerciseData={this.state.currPressedPopulatedWorkout} isVisible={this.state.addedExercisePreviewModal} closeModalMethod={this.closeAddedExercisePreviewModal} />
            <SafeAreaView />
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
        backgroundColor: '#212121',
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
      exerciseOptionHeaderText: {
        fontSize: 15, 
        fontFamily: 'HelveticaNeueMedium'
      },
      exerciseOptionIcon: {
          marginHorizontal: 10,
      }
})

export default connect(mapStateToProps, mapDispatchToProps)(BuildWorkout);
