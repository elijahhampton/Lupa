import React, { useState } from 'react';

import {
    Text,
    View,
    StyleSheet,
    SafeAreaView,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback,
    TextInput as NativeTextInput,
    Picker,
    ScrollView,
    Image,
    Button as NativeButton,
    Slider,
} from 'react-native';

import {
    Surface,
    Modal as PaperModal,
    Dialog,
    Button,
    Appbar,
    TextInput,
    Divider,
    Caption,
} from 'react-native-paper';

import RBSheet from "react-native-raw-bottom-sheet";

import { Video } from 'expo-av';
import { Banner } from 'react-native-paper';

import { connect } from 'react-redux';

import LupaController from '../../../../controller/lupa/LupaController';

import ThinFeatherIcon from "react-native-feather1s";

import FeatherIcon from 'react-native-vector-icons/Feather'
import SingleWorkout from '../../component/SingleWorkout';
import LupaCamera from './component/LupaCamera'
import { getLupaProgramInformationStructure } from '../../../../model/data_structures/programs/program_structures';
import {fromString} from 'uuidv4';

import ImagePicker from 'react-native-image-picker';
import { LOG_ERROR } from '../../../../common/Logger';

import { SearchBar } from 'react-native-elements';

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
        <PaperModal visible={props.isVisible} contentContainerStyle={{borderRadius: 10, alignSelf: 'center', width: Dimensions.get('window').width - 50, height: Dimensions.get('window').height / 2, backgroundColor: '#FFFFFF'}}>
            <View style={{flex: 1, padding: 5}}>
                <View style={{flex: 1}}>
                    <View style={{padding: 5}}>
                    <Text style={{  fontSize: 20}}>
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
                        <Text style={{  fontSize: 15}}>
                            Reps:
                        </Text>
                        <Text>
                            {" "}
                        </Text>
                        <Text  style={{fontSize: 20,   color: '#2196F3'}}>
                            {repSliderValue}
                        </Text>
                        </Text>
                        
                        <Slider value={repSliderValue} step={1} minimumValue={0} maximumValue={15} onValueChange={value => setRepSliderValue(value)} />
                    </View>

                    <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text>
                        <Text style={{  fontSize: 15}}>
                            Sets:
                        </Text>
                        <Text>
                            {" "}
                        </Text>
                        <Text style={{fontSize: 20,   color: '#2196F3'}}>
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
                     Description not found
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
                         Descrription not found
                    </Text>
                )
        }
    }

    const getWorkoutCue = () => {
        if (typeof(exerciseData) == 'undefined')
        {
            return (
                <Text>
                     Cue not found
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
                         Cue not found
                    </Text>
                )
        }
    }

    const getWorkoutSets = () => {
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
                <Surface style={{margin: 10, width: '50%', elevation: 5, height: 110, alignSelf: 'center', borderRadius: 20}}>
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
            workoutDays: {
                Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: []
            },
            showCamera: false,
            showWorkoutSchemeModal: false,
            menuVisible: false,
            mediaCaptureType: 'VIDEO',
            addDescriptionModalIsVisible: false,
            addCueModalModalIsVisible: false,
            addedExercisePreviewModal: false,
            currSectionIndex: 0,
            currDayIndex: 0,
        }

        this.RBSheet = React.createRef();
        this.sectionPickerRBSheet = React.createRef()

        this.animatedViewRef = React.createRef();
        this.firstView = React.createRef();
        this.timelineScrollview = React.createRef();
        this.title = React.createRef();

    }
    
    componentDidMount = () => {
        this.setState({ firstTimeUserBannerVisible: true })
    }

    getCurrentDayContent = () => {
        const currDay = this.getCurrentDay()
        const workoutDays = this.state.workoutDays;
        try {
            switch (currDay)
            {
                case 'Monday':
                    if (workoutDays.Monday.length === 0) {
                        return (
                            <View style={{ alignItems: 'flex-start', width: Dimensions.get('window').width}}>
                            <View style={{alignItems: 'center', flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width}}>
                            <Surface style={{ backgroundColor: '#e5e5e5', elevation: 0, width: 65, height: 65, borderRadius: 65, margin: 5, alignItems: "center", justifyContent: "center" }}>
                    <FeatherIcon name="plus" size={30} color="#212121" />
</Surface>
<Text style={{width: '80%', color: 'rgb(174, 174, 178)', }}>
Choose a category and add a workout for this day.  Add custom media, cues, and descriptions.
</Text>
                            </View>

<Caption style={{paddingLeft: 10}}>
Example
</Caption>
</View>
                        )
                    }

                    return workoutDays.Monday.map(workout => {
                        return (
                            <TouchableWithoutFeedback key={workout.workout_uid} onPress={() => this.handleWorkoutOnPress(workout)} onLongPress={() => this.handleWorkoutOnLongPress(workout)}>
                            <View style={{alignItems: 'center'}}>
<Surface style={{ backgroundColor: '#212121', elevation: 3, width: Dimensions.get("window").width / 5, height: 50, margin: 2, borderRadius: 10, alignItems: "center", justifyContent: "center" }}>
{
this.getWorkoutSurfaceContent(workout)
}
</Surface>
<Text style={{fontSize: 10}}>
{workout.workout_name}
</Text>
</View>
</TouchableWithoutFeedback>
                        )
                    })
                case 'Tuesday':
                    if (workoutDays.Tuesday.length === 0) {
                        return (
                            <View style={{ alignItems: 'flex-start', width: Dimensions.get('window').width}}>
                            <View style={{alignItems: 'center', flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width}}>
                            <Surface style={{ backgroundColor: '#e5e5e5', elevation: 0, width: 65, height: 65, borderRadius: 65, margin: 5, alignItems: "center", justifyContent: "center" }}>
                    <FeatherIcon name="plus" size={30} color="#212121" />
</Surface>
<Text style={{width: '80%', color: 'rgb(174, 174, 178)', }}>
Choose a category and add a workout for this day.  Add custom media, cues, and descriptions.
</Text>
                            </View>

<Caption style={{paddingLeft: 10}}>
Example
</Caption>
</View>
                        )
                    }

                    return workoutDays.Tuesday.map(workout => {
                        return (
                            <TouchableWithoutFeedback key={workout.workout_uid} onPress={() => this.handleWorkoutOnPress(workout)} onLongPress={() => this.handleWorkoutOnLongPress(workout)}>
                            <View style={{alignItems: 'center'}}>
<Surface style={{ backgroundColor: '#212121', elevation: 3, width: Dimensions.get("window").width / 5, height: 50, margin: 2, borderRadius: 10, alignItems: "center", justifyContent: "center" }}>
{
this.getWorkoutSurfaceContent(workout)
}
</Surface>
<Text style={{fontSize: 10}}>
{workout.workout_name}
</Text>
</View>
</TouchableWithoutFeedback>
                        )
                    })
                case 'Wednesday':
                    if (workoutDays.Wednesday.length === 0) {
                        return (
                            <View style={{ alignItems: 'flex-start', width: Dimensions.get('window').width}}>
                            <View style={{alignItems: 'center', flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width}}>
                            <Surface style={{ backgroundColor: '#e5e5e5', elevation: 0, width: 65, height: 65, borderRadius: 65, margin: 5, alignItems: "center", justifyContent: "center" }}>
                    <FeatherIcon name="plus" size={30} color="#212121" />
</Surface>
<Text style={{width: '80%', color: 'rgb(174, 174, 178)', }}>
Choose a category and add a workout for this day.  Add custom media, cues, and descriptions.
</Text>
                            </View>

<Caption style={{paddingLeft: 10}}>
Example
</Caption>
</View>
                        )
                    }

                    return workoutDays.Wednesday.map(workout => {
                        return (
                            <TouchableWithoutFeedback key={workout.workout_uid} onPress={() => this.handleWorkoutOnPress(workout)} onLongPress={() => this.handleWorkoutOnLongPress(workout)}>
                            <View style={{alignItems: 'center'}}>
<Surface style={{ backgroundColor: '#212121', elevation: 3, width: Dimensions.get("window").width / 5, height: 50, margin: 2, borderRadius: 10, alignItems: "center", justifyContent: "center" }}>
{
this.getWorkoutSurfaceContent(workout)
}
</Surface>
<Text style={{fontSize: 10}}>
{workout.workout_name}
</Text>
</View>
</TouchableWithoutFeedback>
                        )
                    })
                case 'Thursday':
                    if (workoutDays.Thursday.length === 0) {
                        return (
                            <View style={{ alignItems: 'flex-start', width: Dimensions.get('window').width}}>
                            <View style={{alignItems: 'center', flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width}}>
                            <Surface style={{ backgroundColor: '#e5e5e5', elevation: 0, width: 65, height: 65, borderRadius: 65, margin: 5, alignItems: "center", justifyContent: "center" }}>
                    <FeatherIcon name="plus" size={30} color="#212121" />
</Surface>
<Text style={{width: '80%', color: 'rgb(174, 174, 178)', }}>
Choose a category and add a workout for this day.  Add custom media, cues, and descriptions.
</Text>
                            </View>

<Caption style={{paddingLeft: 10}}>
Example
</Caption>
</View>
                        )
                    }


                    return workoutDays.Thursday.map(workout => {
                        return (
                            <TouchableWithoutFeedback key={workout.workout_uid} onPress={() => this.handleWorkoutOnPress(workout)} onLongPress={() => this.handleWorkoutOnLongPress(workout)}>
                            <View style={{alignItems: 'center'}}>
<Surface style={{ backgroundColor: '#212121', elevation: 3, width: Dimensions.get("window").width / 5, height: 50, margin: 2, borderRadius: 10, alignItems: "center", justifyContent: "center" }}>
{
this.getWorkoutSurfaceContent(workout)
}
</Surface>
<Text style={{fontSize: 10}}>
{workout.workout_name}
</Text>
</View>
</TouchableWithoutFeedback>
                        )
                    })
                case 'Friday':
                    if (workoutDays.Friday.length === 0) {
                        return (
                            <View style={{ alignItems: 'flex-start', width: Dimensions.get('window').width}}>
                            <View style={{alignItems: 'center', flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width}}>
                            <Surface style={{ backgroundColor: '#e5e5e5', elevation: 0, width: 65, height: 65, borderRadius: 65, margin: 5, alignItems: "center", justifyContent: "center" }}>
                    <FeatherIcon name="plus" size={30} color="#212121" />
</Surface>
<Text style={{width: '80%', color: 'rgb(174, 174, 178)', }}>
Choose a category and add a workout for this day.  Add custom media, cues, and descriptions.
</Text>
                            </View>

<Caption style={{paddingLeft: 10}}>
Example
</Caption>
</View>
                        )
                    }

                    return workoutDays.Friday.map(workout => {
                        return (
                            <TouchableWithoutFeedback key={workout.workout_uid} onPress={() => this.handleWorkoutOnPress(workout)} onLongPress={() => this.handleWorkoutOnLongPress(workout)}>
                            <View style={{alignItems: 'center'}}>
<Surface style={{ backgroundColor: '#212121', elevation: 3, width: Dimensions.get("window").width / 5, height: 50, margin: 2, borderRadius: 10, alignItems: "center", justifyContent: "center" }}>
{
this.getWorkoutSurfaceContent(workout)
}
</Surface>
<Text style={{fontSize: 10}}>
{workout.workout_name}
</Text>
</View>
</TouchableWithoutFeedback>
                        )
                    })
                case 'Saturday':
                    if (workoutDays.Saturday.length === 0) {
                        return (
                            <View style={{ alignItems: 'flex-start', width: Dimensions.get('window').width}}>
                            <View style={{alignItems: 'center', flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width}}>
                            <Surface style={{ backgroundColor: '#e5e5e5', elevation: 0, width: 65, height: 65, borderRadius: 65, margin: 5, alignItems: "center", justifyContent: "center" }}>
                    <FeatherIcon name="plus" size={30} color="#212121" />
</Surface>
<Text style={{width: '80%', color: 'rgb(174, 174, 178)', }}>
Choose a category and add a workout for this day.  Add custom media, cues, and descriptions.
</Text>
                            </View>

<Caption style={{paddingLeft: 10}}>
Example
</Caption>
</View>
                        )
                    }

                    return workoutDays.Saturday.map(workout => {
                        return (
                            <TouchableWithoutFeedback key={workout.workout_uid} onPress={() => this.handleWorkoutOnPress(workout)} onLongPress={() => this.handleWorkoutOnLongPress(workout)}>
                            <View style={{alignItems: 'center'}}>
<Surface style={{ backgroundColor: '#212121', elevation: 3, width: Dimensions.get("window").width / 5, height: 50, margin: 2, borderRadius: 10, alignItems: "center", justifyContent: "center" }}>
{
this.getWorkoutSurfaceContent(workout)
}
</Surface>
<Text style={{fontSize: 10}}>
{workout.workout_name}
</Text>
</View>
</TouchableWithoutFeedback>
                        )
                    })
                case 'Sunday':
                    if (workoutDays.Sunday.length === 0) {
                        return (
                            <View style={{ alignItems: 'flex-start', width: Dimensions.get('window').width}}>
                            <View style={{alignItems: 'center', flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width}}>
                            <Surface style={{ backgroundColor: '#e5e5e5', elevation: 0, width: 65, height: 65, borderRadius: 65, margin: 5, alignItems: "center", justifyContent: "center" }}>
                    <FeatherIcon name="plus" size={30} color="#212121" />
</Surface>
<Text style={{width: '80%', color: 'rgb(174, 174, 178)', }}>
Choose a category and add a workout for this day.  Add custom media, cues, and descriptions.
</Text>
                            </View>

<Caption style={{paddingLeft: 10}}>
Example
</Caption>
</View>
                        )
                    }

                    return workoutDays.Sunday.map(workout => {
                        return (
                            <TouchableWithoutFeedback key={workout.workout_uid} onPress={() => this.handleWorkoutOnPress(workout)} onLongPress={() => this.handleWorkoutOnLongPress(workout)}>
                            <View style={{alignItems: 'center'}}>
<Surface style={{ backgroundColor: '#212121', elevation: 3, width: Dimensions.get("window").width / 5, height: 50, margin: 2, borderRadius: 10, alignItems: "center", justifyContent: "center" }}>
{
this.getWorkoutSurfaceContent(workout)
}
</Surface>
<Text style={{fontSize: 10}}>
{workout.workout_name}
</Text>
</View>
</TouchableWithoutFeedback>
                        )
                    })
                default:
                        return (
                            <View style={{ alignItems: 'flex-start', width: Dimensions.get('window').width}}>
                            <View style={{alignItems: 'center', flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width}}>
                            <Surface style={{ backgroundColor: '#e5e5e5', elevation: 0, width: 65, height: 65, borderRadius: 65, margin: 5, alignItems: "center", justifyContent: "center" }}>
                    <FeatherIcon name="plus" size={30} color="#212121" />
</Surface>
<Text style={{width: '80%', color: 'rgb(174, 174, 178)', }}>
Choose a category and add a workout for this day.  Add custom media, cues, and descriptions.
</Text>
                            </View>

<Caption style={{paddingLeft: 10}}>
Example
</Caption>
</View>
                        )
                    
            }
        } catch(error) {
            return []
        }
    }

    getCurrentDay = () => {
        const currIndex = this.state.currDayIndex;
        return this.props.programData.program_workout_days[currIndex]
    }

    getPreviousDay = () => {
        if (this.state.currDayIndex == 0)
        {
            return this.props.programData.program_workout_days[this.props.programData.program_workout_days.length - 1]
        }

        const currIndex = this.state.currDayIndex - 1
        return this.props.programData.program_workout_days[currIndex]
    }

    getNextDay = () => {
        const currIndex = this.state.currDayIndex + 1;
        return this.props.programData.program_workout_days[currIndex]
    }

    goNextDay = () => {
        if (this.state.currDayIndex == this.props.programData.program_workout_days.length) {
            this.setState({
                currDayIndex: 0
            })

            return;
        }

        this.setState({
            currDayIndex: this.state.currDayIndex + 1
        })

    }

    goPrevDay = () => {
        if (this.state.currDayIndex == 0)
        {
            this.setState({
                currDayIndex: this.props.programData.program_workout_days.length
            })

            return;
        }

        this.setState({
            currDayIndex: this.state.currDayIndex - 1
        })
    }

    renderSectionPickerRBSheet = () => {
        return (
            <RBSheet
            ref={this.sectionPickerRBSheet}
            height={Dimensions.get('window').height / 4}
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
             <Picker
  selectedValue={this.state.currentSectionIndex}
  style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height / 4}}
  onValueChange={(itemValue, itemIndex) => {
    this.setState({currentSectionIndex: itemIndex})
  }
  }>
      {
          this.props.programData.program_workout_days.map((day, index, arr) => {
            return (
                <Picker.Item key={day} label={day} value={day} />
            )
          })
      }
</Picker>
             <SafeAreaView />
               </View>
         </RBSheet>
        )
    }

    getWorkoutDataByDay = (obj) => {
        
    }

    captureWorkout = (workoutObject) => {
        const workoutDay = this.getCurrentDay()

        //We assign the workout a new UUID so the workouts are not the same
        let updatedWorkout = {
            workout_name: workoutObject.workout_name,
            workout_description: workoutObject.workout_description,
            workout_media: {
                uri: "",
                media_type: ""
            },
            workout_steps: workoutObject.workout_steps,
            workout_tags: workoutObject.workout_tags,
            workout_uid: fromString(Math.random().toString()),
            workout_day: workoutDay //add the section so it is easy to delete
        }


        let updatedWorkoutData = [], newWorkoutData = {}
        switch (workoutDay)
        {
            case 'Monday':
                updatedWorkoutData = this.state.workoutDays.Monday
                updatedWorkoutData.push(updatedWorkout)

                newWorkoutData = {
                    Monday: updatedWorkoutData,
                    ...this.state.workoutDays,
                }

                this.setState({
                    workoutData: newWorkoutData,

                })
                break;
            case 'Tuesday':
                updatedWorkoutData = this.state.workoutDays.Tuesday
                updatedWorkoutData.push(updatedWorkout)

                newWorkoutData = {
                    Tuesday: updatedWorkoutData,
                    ...this.state.workoutDays,
                }

                this.setState({
                    workoutData: newWorkoutData,
                })
                break;
            case 'Wednesday':
                updatedWorkoutData = this.state.workoutDays.Wednesday
                updatedWorkoutData.push(updatedWorkout)

                newWorkoutData = {
                    Wednesday: updatedWorkoutData,
                    ...this.state.workoutDays,
                }

                this.setState({
                    workoutData: newWorkoutData,
                })
                break;
            case 'Thursday':
                updatedWorkoutData = this.state.workoutDays.Thursday
                updatedWorkoutData.push(updatedWorkout)

                newWorkoutData = {
                    Thursday: updatedWorkoutData,
                    ...this.state.workoutDays,
                }

                this.setState({
                    workoutData: newWorkoutData,
                })
                break;
            case 'Friday':
                updatedWorkoutData = this.state.workoutDays.Friday
                updatedWorkoutData.push(updatedWorkout)

                newWorkoutData = {
                    Friday: updatedWorkoutData,
                    ...this.state.workoutDays,
                }

                this.setState({
                    workoutData: newWorkoutData,
                })
                break;
            case 'Saturday':
                updatedWorkoutData = this.state.workoutDays.Saturday
                updatedWorkoutData.push(updatedWorkout)

                newWorkoutData = {
                    Saturday: updatedWorkoutData,
                    ...this.state.workoutDays,
                }

                this.setState({
                    workoutData: newWorkoutData,
                })
                break;
            case 'Sunday':
                updatedWorkoutData = this.state.workoutDays.Sunday
                updatedWorkoutData.push(updatedWorkout)

                newWorkoutData = {
                    Sunday: updatedWorkoutData,
                    ...this.state.workoutDays,
                }

                this.setState({
                    workoutData: newWorkoutData,
                })
                break;
            default:
                updatedWorkoutData = this.state.workoutDays.Monday

                updatedWorkoutData.push(updatedWorkout)

                cnewWorkoutData = {
                    Monday: updatedWorkoutData,
                    ...this.state.workoutDays,
                }

                this.setState({
                    workoutData: newWorkoutData,
                })
        }
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

        const workoutData = this.state.workoutDays;

        await this.props.saveProgramWorkoutData(workoutData);
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

    handleWorkoutOnPress = async (workout) => {
        await this.setState({ currPressedPopulatedWorkout: workout})
        this.RBSheet.current.open()
    }

    handleWorkoutOnLongPress = async (workout) => {
        await this.setState({ currPressedPopulatedWorkout: workout })
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

        let newWorkoutData = {}, updatedWorkoutData = {}
        const currDay = this.getCurrentDay()
        const workout = this.state.currPressedPopulatedWorkout
        switch(currDay)
        {
            case 'Monday':
                for (let i = 0; i < this.state.workoutDays.Monday.length; i++)
                {
                    if (workout.workout_uid == this.state.currPressedPopulatedWorkout.workout_uid)
                    {                       

                        this.state.workoutDays.Monday[i].workout_media.uri = uri;
                        this.state.workoutDays.Monday[i].workout_media.media_type = mediaType;

                        newWorkoutData = {
                            Monday: this.state.workoutDays.Monday,
                            ...this.state.workoutDays
                        }

                        break;
                    }
                }
            break;
            case "Tuesday":
                for (let i = 0; i < this.state.workoutDays.Tuesday.length; i++)
                {
                    if (workout.workout_uid == this.state.currPressedPopulatedWorkout.workout_uid)
                    {                       

                        this.state.workoutDays.Tuesday[i].workout_media.uri = uri;
                        this.state.workoutDays.Tuesday[i].workout_media.media_type = mediaType;
                        
                        newWorkoutData = {
                            Tuesday: this.state.workoutDays.Tuesday,
                            ...this.state.workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Wednesday":
                for (let i = 0; i < this.state.workoutDays.Wednesday.length; i++)
                {
                    if (workout.workout_uid == this.state.currPressedPopulatedWorkout.workout_uid)
                    {                       

                        this.state.workoutDays.Wednesday[i].workout_media.uri = uri;
                        this.state.workoutDays.Wednesday[i].workout_media.media_type = mediaType;
                        
                        newWorkoutData = {
                            Wednesday: this.state.workoutDays.Wednesday,
                            ...this.state.workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Thursday":
                for (let i = 0; i < this.state.workoutDays.Thursday.length; i++)
                {
                    if (workout.workout_uid == this.state.currPressedPopulatedWorkout.workout_uid)
                    {                       

                        this.state.workoutDays.Thursday[i].workout_media.uri = uri;
                        this.state.workoutDays.Thursday[i].workout_media.media_type = mediaType;
                        
                        newWorkoutData = {
                            Thursday: this.state.workoutDays.Thursday,
                            ...this.state.workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Friday":
                for (let i = 0; i < this.state.workoutDays.Friday.length; i++)
                {
                    if (workout.workout_uid == this.state.currPressedPopulatedWorkout.workout_uid)
                    {                       

                        this.state.workoutDays.Friday[i].workout_media.uri = uri;
                        this.state.workoutDays.Friday[i].workout_media.media_type = mediaType;
                        
                        newWorkoutData = {
                            Friday: this.state.workoutDays.Friday,
                            ...this.state.workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Saturday":
                for (let i = 0; i < this.state.workoutDays.Saturday.length; i++)
                {
                    if (workout.workout_uid == this.state.currPressedPopulatedWorkout.workout_uid)
                    {                       

                        this.state.workoutDays.Saturday[i].workout_media.uri = uri;
                        this.state.workoutDays.Saturday[i].workout_media.media_type = mediaType;
                        
                        newWorkoutData = {
                            Saturday: this.state.workoutDays.Saturday,
                            ...this.state.workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Sunday":
                for (let i = 0; i < this.state.workoutDays.Sunday.length; i++)
                {
                    if (workout.workout_uid == this.state.currPressedPopulatedWorkout.workout_uid)
                    {                       

                        this.state.workoutDays.Sunday[i].workout_media.uri = uri;
                        this.state.workoutDays.Sunday[i].workout_media.media_type = mediaType;
                        
                        newWorkoutData = {
                            Sunday: this.state.workoutDays.Sunday,
                            ...this.state.workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            default:
                for (let i = 0; i < this.state.workoutDays.Monday.length; i++)
                {
                    if (workout.workout_uid == this.state.currPressedPopulatedWorkout.workout_uid)
                    {                       

                        this.state.workoutDays.Monday[i].workout_media.uri = uri;
                        this.state.workoutDays.Monday[i].workout_media.media_type = mediaType;

                        newWorkoutData = {
                            Monday: this.state.workoutDays.Monday,
                            ...this.state.workoutDays
                        }

                        break;
                    }
                }
                break;
        }

        await this.setState({ workoutDays: newWorkoutData, currPressedPopulatedWorkout: undefined, })
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
        this.RBSheet.current.close()
    }

    closeChangeWorkoutSchemeModal = () => {
        this.setState({
            showWorkoutSchemeModal: false,
        })
    }

    captureSetAndRepValues = async (sets, reps) => {
        if (typeof(this.state.currPressedPopulatedWorkout) == 'undefined' || sets === 0 || reps === 0)
        {
            return;
        }

        let newWorkoutData = {}, updatedWorkoutData = {}
        const currDay = this.getCurrentDay()
        const workout = this.state.currPressedPopulatedWorkout
        switch(currDay)
        {
            case 'Monday':
                for (let i = 0; i < this.state.workoutDays.Monday.length; i++)
                {
                    if (workout.workout_uid == this.state.currPressedPopulatedWorkout.workout_uid)
                    {                       

                        this.state.workoutDays.Monday[i].workout_sets = sets
                        this.state.workoutDays.Monday[i].workout_reps = reps

                        newWorkoutData = {
                            Monday: this.state.workoutDays.Monday,
                            ...this.state.workoutDays
                        }

                        break;
                    }
                }
            break;
            case "Tuesday":
                for (let i = 0; i < this.state.workoutDays.Tuesday.length; i++)
                {
                    if (workout.workout_uid == this.state.currPressedPopulatedWorkout.workout_uid)
                    {                       

                        this.state.workoutDays.Tuesday[i].workout_sets = sets
                        this.state.workoutDays.Tuesday[i].workout_reps = reps
                        
                        newWorkoutData = {
                            Tuesday: this.state.workoutDays.Tuesday,
                            ...this.state.workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Wednesday":
                for (let i = 0; i < this.state.workoutDays.Wednesday.length; i++)
                {
                    if (workout.workout_uid == this.state.currPressedPopulatedWorkout.workout_uid)
                    {                       

                        this.state.workoutDays.Wednesday[i].workout_sets = sets
                        this.state.workoutDays.Wednesday[i].workout_reps = reps
                        
                        newWorkoutData = {
                            Wednesday: this.state.workoutDays.Wednesday,
                            ...this.state.workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Thursday":
                for (let i = 0; i < this.state.workoutDays.Thursday.length; i++)
                {
                    if (workout.workout_uid == this.state.currPressedPopulatedWorkout.workout_uid)
                    {                       

                        this.state.workoutDays.Thursday[i].workout_sets = sets
                        this.state.workoutDays.Thursday[i].workout_reps = reps
                        
                        newWorkoutData = {
                            Thursday: this.state.workoutDays.Thursday,
                            ...this.state.workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Friday":
                for (let i = 0; i < this.state.workoutDays.Friday.length; i++)
                {
                    if (workout.workout_uid == this.state.currPressedPopulatedWorkout.workout_uid)
                    {                       

                        this.state.workoutDays.Friday[i].workout_sets = sets
                        this.state.workoutDays.Friday[i].workout_reps = reps
                        
                        newWorkoutData = {
                            Friday: this.state.workoutDays.Friday,
                            ...this.state.workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Saturday":
                for (let i = 0; i < this.state.workoutDays.Saturday.length; i++)
                {
                    if (workout.workout_uid == this.state.currPressedPopulatedWorkout.workout_uid)
                    {                       

                        this.state.workoutDays.Saturday[i].workout_sets = sets
                        this.state.workoutDays.Saturday[i].workout_reps = reps
                        
                        newWorkoutData = {
                            Saturday: this.state.workoutDays.Saturday,
                            ...this.state.workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Sunday":
                for (let i = 0; i < this.state.workoutDays.Sunday.length; i++)
                {
                    if (workout.workout_uid == this.state.currPressedPopulatedWorkout.workout_uid)
                    {                       

                        this.state.workoutDays.Sunday[i].workout_sets = sets
                        this.state.workoutDays.Sunday[i].workout_reps = reps
                        
                        newWorkoutData = {
                            Sunday: this.state.workoutDays.Sunday,
                            ...this.state.workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            default:
                for (let i = 0; i < this.state.workoutDays.Monday.length; i++)
                {
                    if (workout.workout_uid == this.state.currPressedPopulatedWorkout.workout_uid)
                    {                       

                        this.state.workoutDays.Monday[i].workout_sets = sets
                        this.state.workoutDays.Monday[i].workout_reps = reps

                        newWorkoutData = {
                            Monday: this.state.workoutDays.Monday,
                            ...this.state.workoutDays
                        }

                        break;
                    }
                }
                break;
        }

        await this.setState({ workoutDays: newWorkoutData, currPressedPopulatedWorkout: undefined})
        this.closeChangeWorkoutSchemeModal()
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
            if (workout.workout_media.uri != undefined || workout.workout_media.uri != "")
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
            alert(err)
            return (
                <View style={{flex: 1, backgroundColor: '#212121'}}>
    
                </View>
               ) 
        }
    }

    addWorkoutMedia = () => {
        this.RBSheet.current.close()

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
                const source = await response.uri
                const workoutMediaURI = await this.LUPA_CONTROLLER_INSTANCE.saveProgramWorkoutGraphic(this.state.currPressedPopulatedWorkout, this.state.currProgramUUID, 'IMAGE', source)
                await this.handleCaptureNewMediaURI(workoutMediaURI, 'IMAGE');
            }
        });
    }

    showAddDescriptionModal = () => {
        this.setState({ addDescriptionModalIsVisible: true })
        this.RBSheet.current.close()
    }

    closeAddDescriptionModal = () => {
        this.setState({ addDescriptionModalIsVisible: false })
    }

    handleCaptureDescription = async (description) => {
        if (typeof(this.state.currPressedPopulatedWorkout) == 'undefined' || description == '')
        {
            return;
        }

        let newWorkoutData = {}, updatedWorkoutData = {}
        const currDay = this.getCurrentDay()
        const workout = this.state.currPressedPopulatedWorkout
        switch(currDay)
        {
            case 'Monday':
                for (let i = 0; i < this.state.workoutDays.Monday.length; i++)
                {
                    if (workout.workout_uid == this.state.currPressedPopulatedWorkout.workout_uid)
                    {                       

                        this.state.workoutDays.Monday[i].workout_description = description

                        newWorkoutData = {
                            Monday: this.state.workoutDays.Monday,
                            ...this.state.workoutDays
                        }

                        break;
                    }
                }
            break;
            case "Tuesday":
                for (let i = 0; i < this.state.workoutDays.Tuesday.length; i++)
                {
                    if (workout.workout_uid == this.state.currPressedPopulatedWorkout.workout_uid)
                    {                       

                        this.state.workoutDays.Tuesday[i].workout_description = description
                        
                        newWorkoutData = {
                            Tuesday: this.state.workoutDays.Tuesday,
                            ...this.state.workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Wednesday":
                for (let i = 0; i < this.state.workoutDays.Wednesday.length; i++)
                {
                    if (workout.workout_uid == this.state.currPressedPopulatedWorkout.workout_uid)
                    {                       

                        this.state.workoutDays.Wednesday[i].workout_media.workout_description = description
                        
                        newWorkoutData = {
                            Wednesday: this.state.workoutDays.Wednesday,
                            ...this.state.workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Thursday":
                for (let i = 0; i < this.state.workoutDays.Thursday.length; i++)
                {
                    if (workout.workout_uid == this.state.currPressedPopulatedWorkout.workout_uid)
                    {                       

                        this.state.workoutDays.Thursday[i].workout_description = description
                        
                        newWorkoutData = {
                            Thursday: this.state.workoutDays.Thursday,
                            ...this.state.workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Friday":
                for (let i = 0; i < this.state.workoutDays.Friday.length; i++)
                {
                    if (workout.workout_uid == this.state.currPressedPopulatedWorkout.workout_uid)
                    {                       

                        this.state.workoutDays.Friday[i].workout_description = description
                        
                        newWorkoutData = {
                            Friday: this.state.workoutDays.Friday,
                            ...this.state.workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Saturday":
                for (let i = 0; i < this.state.workoutDays.Saturday.length; i++)
                {
                    if (workout.workout_uid == this.state.currPressedPopulatedWorkout.workout_uid)
                    {                       

                        this.state.workoutDays.Saturday[i].workout_description = description
                        
                        newWorkoutData = {
                            Saturday: this.state.workoutDays.Saturday,
                            ...this.state.workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Sunday":
                for (let i = 0; i < this.state.workoutDays.Sunday.length; i++)
                {
                    if (workout.workout_uid == this.state.currPressedPopulatedWorkout.workout_uid)
                    {                       

                        this.state.workoutDays.Sunday[i].workout_description = description
                        
                        newWorkoutData = {
                            Sunday: this.state.workoutDays.Sunday,
                            ...this.state.workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            default:
                for (let i = 0; i < this.state.workoutDays.Monday.length; i++)
                {
                    if (workout.workout_uid == this.state.currPressedPopulatedWorkout.workout_uid)
                    {                       

                        this.state.workoutDays.Monday[i].workout_description = description

                        newWorkoutData = {
                            Monday: this.state.workoutDays.Monday,
                            ...this.state.workoutDays
                        }

                        break;
                    }
                }
                break;
        }

        await this.setState({ workoutDays: newWorkoutData, currPressedPopulatedWorkout: undefined})
        this.closeAddDescriptionModal();
    }

    showAddCueModal = () => {
        this.setState({ addCueModalModalIsVisible: true })
        this.RBSheet.current.close()
    }

    closeAddCueModal = () => {
        this.setState({ addCueModalModalIsVisible: false })
    }

    handleCaptureCue = async (cue) => {
        if (typeof(this.state.currPressedPopulatedWorkout) == 'undefined' || cue == '')
        {
            return;
        }

        let newWorkoutData = {}, updatedWorkoutData = {}
        const currDay = this.getCurrentDay()
        const workout = this.state.currPressedPopulatedWorkout
        switch(currDay)
        {
            case 'Monday':
                for (let i = 0; i < this.state.workoutDays.Monday.length; i++)
                {
                    if (workout.workout_uid == this.state.currPressedPopulatedWorkout.workout_uid)
                    {                       

                        this.state.workoutDays.Monday[i].workout_cue = cue

                        newWorkoutData = {
                            Monday: this.state.workoutDays.Monday,
                            ...this.state.workoutDays
                        }

                        break;
                    }
                }
            break;
            case "Tuesday":
                for (let i = 0; i < this.state.workoutDays.Tuesday.length; i++)
                {
                    if (workout.workout_uid == this.state.currPressedPopulatedWorkout.workout_uid)
                    {                       

                        this.state.workoutDays.Tuesday[i].workout_cue = cue
                        
                        newWorkoutData = {
                            Tuesday: this.state.workoutDays.Tuesday,
                            ...this.state.workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Wednesday":
                for (let i = 0; i < this.state.workoutDays.Wednesday.length; i++)
                {
                    if (workout.workout_uid == this.state.currPressedPopulatedWorkout.workout_uid)
                    {                       

                        this.state.workoutDays.Wednesday[i].workout_media.workout_cue = cue
                        
                        newWorkoutData = {
                            Wednesday: this.state.workoutDays.Wednesday,
                            ...this.state.workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Thursday":
                for (let i = 0; i < this.state.workoutDays.Thursday.length; i++)
                {
                    if (workout.workout_uid == this.state.currPressedPopulatedWorkout.workout_uid)
                    {                       

                        this.state.workoutDays.Thursday[i].workout_cue = cue
                        
                        newWorkoutData = {
                            Thursday: this.state.workoutDays.Thursday,
                            ...this.state.workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Friday":
                for (let i = 0; i < this.state.workoutDays.Friday.length; i++)
                {
                    if (workout.workout_uid == this.state.currPressedPopulatedWorkout.workout_uid)
                    {                       

                        this.state.workoutDays.Friday[i].workout_cue = cue
                        
                        newWorkoutData = {
                            Friday: this.state.workoutDays.Friday,
                            ...this.state.workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Saturday":
                for (let i = 0; i < this.state.workoutDays.Saturday.length; i++)
                {
                    if (workout.workout_uid == this.state.currPressedPopulatedWorkout.workout_uid)
                    {                       

                        this.state.workoutDays.Saturday[i].workout_cue = cue
                        
                        newWorkoutData = {
                            Saturday: this.state.workoutDays.Saturday,
                            ...this.state.workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            case "Sunday":
                for (let i = 0; i < this.state.workoutDays.Sunday.length; i++)
                {
                    if (workout.workout_uid == this.state.currPressedPopulatedWorkout.workout_uid)
                    {                       

                        this.state.workoutDays.Sunday[i].workout_cue = cue
                        
                        newWorkoutData = {
                            Sunday: this.state.workoutDays.Sunday,
                            ...this.state.workoutDays
                        }
                        
                        break;
                    }
                }
            break;
            default:
                for (let i = 0; i < this.state.workoutDays.Monday.length; i++)
                {
                    if (workout.workout_uid == this.state.currPressedPopulatedWorkout.workout_uid)
                    {                       

                        this.state.workoutDays.Monday[i].workout_cue = cue

                        newWorkoutData = {
                            Monday: this.state.workoutDays.Monday,
                            ...this.state.workoutDays
                        }

                        break;
                    }
                }
                break;
        }

        await this.setState({ workoutDays: newWorkoutData, currPressedPopulatedWorkout: undefined})
        this.closeAddCueModal();
    }

    render() {
        return (
            <View ref={this.firstView} style={styles.container} onLayout={event => { this.setState({ layoutHeight: event.nativeEvent.layout.height }) }}>
                   <Appbar.Header style={{backgroundColor: '#FFFFFF', elevation: 3}}>
                   <Appbar.Action icon={() => <FeatherIcon onPress={() => this.props.goToIndex(0)} name="arrow-left" size={20} color="#1089ff" />} />
                          {/*  <SearchBar placeholder="Search specific workouts"
                        onChangeText={text => console.log(text)} 
                        platform="ios"
                        searchIcon={<FeatherIcon name="search" size={15} color="#1089ff" />}
                        containerStyle={{backgroundColor: "transparent", width: '100%'}}
                        inputContainerStyle={{backgroundColor: 'rgb(242, 242, 247))',}}
                        inputStyle={{fontSize: 15, color: 'black', fontWeight: '800', fontFamily: 'avenir-roman'}}
                        placeholderTextColor="#212121"
        value={this.state.searchValue}/> */}
                   </Appbar.Header>

                   <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
                        <View style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
                            <View style={{alignItems: 'center', justifyContent: 'center',}}>
                            <View style={{ alignItems: 'center', justifyContent: 'center',width: 180, height: 180, borderRadius: 180, borderWidth: 1.5, borderColor: 'rgb(142, 142, 147)',}}>
                            <ThinFeatherIcon color="rgb(142, 142, 147)" thin={true} name="plus" size={80} />
                            </View>
                            <Text style={{marginVertical: 50, color: 'rgb(142, 142, 147)'}}>
                                Open the workout library to add workouts.
                            </Text>
                            </View>
                          
                   </View>

                   <View style={{flex: 1}}>
                       
                       <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                           <View style={{flex: 2}}>

                           <ScrollView showsHorizontalScrollIndicator={false} centerContent contentContainerStyle={{alignItems: 'center', justifyContent: 'center',}} horizontal={true} decelerationRate={0} pagingEnabled={true} snapToAlignment='center' snapToInterval={Dimensions.get('window').width}>
                                <View style={{width: Dimensions.get('window').width, alignItems: 'center'}}>
                                    <Text>
                                        Monday
                                    </Text>
                                </View>

                                <View style={{width: Dimensions.get('window').width, alignItems: 'center'}}>
                                    <Text>
                                        Tuesday
                                    </Text>
                                </View>

                                <View style={{width: Dimensions.get('window').width, alignItems: 'center'}}>
                                    <Text>
                                        Wednesday
                                    </Text>
                                </View>
                           </ScrollView>
                           </View>

                           <View style={{flex: 1.5, alignItems: 'center', justifyContent: 'center'}}>
                           <Caption style={{alignSelf: 'center'}}>
                               Swipe to add workouts to a different day.
                           </Caption>
                           </View>
                         
                       </View>


                       <View style={{width: '100%', flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                           
                           <Button style={{height: 60}} color="#1089ff" uppercase={false} mode="contained" style={{alignItems: 'center', justifyContent: 'center', height: 55, borderRadius: 8, width: Dimensions.get('window').width - 20, alignSelf: 'center'}}>
                                <Text style={{fontFamily: 'Avenir-Heavy', fontWeight: '700', fontSize: 15}}>
                                    Add Workouts
                                </Text>
                           </Button>
                       </View>
                    </View>
                   </View>

                   <SafeAreaView />
                   
                 {/*  <Surface style={{flex: 1, elevation: 0, backgroundColor: '#EEEEEE'}}>
                       <TouchableOpacity onPress={() => this.sectionPickerRBSheet.current.open()}>
                       <View style={{width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{fontWeight: '400', fontSize: 15, paddingLeft: 10, alignSelf: 'flex-start'}}>
                           {this.getCurrentDay()}
                       </Text>
                        </View>
                       </TouchableOpacity>
                       <ScrollView horizontal contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}>
                           
                            {this.getCurrentDayContent()}
                       </ScrollView>
    </Surface>*/}
                    {
                        /*
                                                    <Banner
      visible={this.state.firstTimeUserBannerVisible}
      actions={[
        {
          label: 'Fix it',
          onPress: () => this.setState({ firstTimeUserBannerVisible: false }),
        },

      ]}
      icon={() => <FeatherIcon name="info" size={20} />}>
      There was a problem processing a transaction on your credit card.
    </Banner>
                        */
                    }
                   {/* <View style={{flex: 4}}>
                        <Divider />
                    <ScrollView>
                    {
                        this.props.lupa_data.Application_Workouts.applicationWorkouts.map((workout, index, arr)=> {
                            if (workout.workout_name == "" || workout.workout_name == undefined)
                            {
                                return
                            }

                            workout.workout_uid = fromString(workout.workout_name + (Math.random() * index).toString)
                            return (
                                <SingleWorkout 
                                workoutData={workout}
                                captureWorkout={(obj) => this.captureWorkout(obj)}
                                />
                            )
                        })
                    }
                    </ScrollView>
                    </View>

                    <View style={{flex: 0.5, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 10}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <Button onPress={this.goPrevDay} color="#23374d" mode='text' style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <FeatherIcon name="arrow-left" />
                                <Text>
                                    {this.getPreviousDay()}
                                </Text>
                        </Button>

                        <Button onPress={this.goNextDay} color="#23374d" mode='text' style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <Text>
                                    {this.getNextDay()}
                                </Text>
                        <FeatherIcon name="arrow-right" />
                        </Button>
                        </View>

                        <View>
                        <Button onPress={() => this.saveProgram()} color="#23374d" mode='contained' style={{alignItems: 'center', justifyContent: 'center'}}>
                        <Text>
                                    Complete
                                </Text>
                        </Button>
                        </View>
                </View> */}


                {/*  <RBSheet
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
               <Text style={{alignSelf: 'center',   fontSize: 15, padding: 10}}>
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
            <TouchableOpacity onPress={this.addWorkoutMedia}>
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
        {this.renderSectionPickerRBSheet()} 
        <SafeAreaView />*/}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        //margin: Dimensions.get("screen").height / 4,
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
         
      },
      exerciseOptionIcon: {
          marginHorizontal: 10,
      }
})

export default connect(mapStateToProps, mapDispatchToProps)(BuildWorkout);
