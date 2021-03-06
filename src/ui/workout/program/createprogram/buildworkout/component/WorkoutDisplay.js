import React, { createRef, useEffect, useState } from 'react';

import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    ScrollView,
    StyleSheet,
    ActionSheetIOS,
    Modal,
    TextInput,
    SafeAreaView,
} from 'react-native'

import {
    Surface,
    Caption,
    Chip,
    Dialog,
    HelperText,
    Paragraph,
    Button,
} from 'react-native-paper';

import {
    Divider
} from 'react-native-elements'
import ImagePicker from 'react-native-image-picker';
import ThinFeatherIcon from 'react-native-feather1s'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { Video } from 'expo-av';
import Slider from "react-native-slider";
import { Pagination } from 'react-native-snap-carousel'

import ExerciseCameraModal from '../../component/ExerciseCameraModal';
import { Picker } from '@react-native-community/picker';
import RBSheet from 'react-native-raw-bottom-sheet'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import { getLupaExerciseStructure } from '../../../../../../model/data_structures/workout/exercise_collections';
import { LIVE_WORKOUT_MODE } from '../../../../../../model/data_structures/workout/types';
import LiveWorkoutService from '../../../../../../common/service/LiveWorkoutService';
let weeks = []

const restTimes = [
    'Edit',
    '15',
    '30',
    '90',
    '120',
    '180',
    '300',
]

const EXERCISE_EQUIPMENT_LIST = [
    'Treadmill'
]

function handleMeasurement(exercise, tempo) {
    if (typeof (exercise) == 'undefined' || typeof (tempo) == 'undefined') {
        return;
    }

    exercise.workout_tempo = tempo;
}

function AddTagsModal({ captureEquipmentTags, isVisible, closeModal }) {
    const [tags, setTags] = useState([]);
    const [forceUpdate, setForceUpdate] = useState(false);
  
    const handleAddTags = (tagString) => {
      if (tags.includes(tagString)) {
        let updatedTagList = tags;
        updatedTagList.splice(updatedTagList.indexOf(tagString), 1)
        setTags(updatedTagList)
      } else {
        setTags((prevState) => prevState.concat(tagString))
      }
  
      setForceUpdate(!forceUpdate)
    }
  
    const handleFinish = () => {
        captureEquipmentTags(tags);
      closeModal()
    }
  
    const renderPreFilledTags = (tagString) => {
      if (tags.includes(tagString)) {
        return (
          <Chip
            onPress={() => handleAddTags(tagString)}
            mode="flat"
            style={[styles.tagsChipStyle, { backgroundColor: '#23374d' }]}
            textStyle={[styles.tagsChipTextStyle, { color: 'white' }]}
            theme={{
              roundness: 0,
            }}>
            {tagString}
          </Chip>
        )
      } else {
        return (
          <Chip
            onPress={() => handleAddTags(tagString)}
            mode="outlined"
            style={styles.tagsChipStyle}
            textStyle={styles.tagsChipTextStyle}
            theme={{
              roundness: 0,
            }}>
            {tagString}
          </Chip>
        )
      }
    }
  
    return (
      <Modal presentationStyle="fullScreen" visible={isVisible}>
        <View style={{ flex: 1, padding: 20 }}>
          <View style={{ padding: 10, marginVertical: 20 }}>
            <Text style={{ fontFamily: 'Avenir-Black', fontSize: 30 }}>
              Add custom equipment requirements
            </Text>
            <Caption>
              Choose tags that best fit the equipment requirements for this exercise
            </Caption>
          </View>
  
          <View style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'row', margin: 10 }}>
            {
              EXERCISE_EQUIPMENT_LIST.map(tag => {
                return (
                  renderPreFilledTags(tag)
                )
              })
            }
          </View>
          <Button
            mode="contained"
            color="#23374d"
            theme={{ roundness: 8 }}
            contentStyle={{ width: Dimensions.get('window').width - 20, height: 45 }}
            contentStyle={{ width: Dimensions.get('window').width - 20, height: 45 }}
            onPress={handleFinish}
            uppercase={false}>
            <Text style={{ fontWeight: '800', fontFamily: 'Avenir-Medium' }}>
              Done
              </Text>
          </Button>
        </View>
      </Modal>
  
    )
  }

function WorkoutDisplay({ workoutMode, currWorkoutID, sessionID, programData, currProgramUUID, workout, handleExerciseOnPress, handleSuperSetOnPress, programDuration, programType, handleDeleteExercise }) {
    const [updateState, forceUpdateState] = useState(false);

    const [currProgramWeek, setCurrProgramWeek] = useState(0)

    const [exerciseTempoError, setExerciseTempoError] = useState(false)

    const programWeekPicker = createRef();
    const restTimePickerRef = createRef();
    const tempoPickerRef = createRef();

    const [measurementAccessed, setAccessedMeasurement] = useState(workout)
    const [currPressedExercise, setCurrPressedExercise] = useState(getLupaExerciseStructure())

    const [pickedExerciseTempo, setPickedExerciseTempo] = useState('0-0-0');
    const [pickedRestTime, setPickedRestTime] = useState(restTimes[0])

    const [editTempoIsVisible, setEditTempo] = useState(false);
    const [editRestTimeIsVisible, setEditRestTime] = useState(false);

    const [inputRestTimeOneText, setRestTimeInputOneText] = useState("")
    const [inputRestTimeTwoText, setRestTimeInputTwoText] = useState("")
    const [inputRestTimeSupersetText, setRestTimeSupersetText] = useState("")

    const [inputTempoOneText, setTempoInputOneText] = useState("");
    const [inputTempoTwoText, setTempoInputTwoText] = useState("");
    const [inputTempoSupersetText, setTempoSupersetText] = useState("");

    const [addEquipmentModalVisible, setAddEquipmentModalVisible] = useState(false);

    const intensityPickerRef = createRef();
    const openIntensityPicker = () => intensityPickerRef.current.open();
    const closeIntensityPicker = () => intensityPickerRef.current.close();

    const [editedIntensity, setEditedIntensity] = useState("");

    const [showCamera, setShowCamera] = useState(false);

    const liveWorkoutService = new LiveWorkoutService(sessionID, {}, [], programData);

    const renderImageSource = (workoutObj) => {
        if (workoutObj.workout_media.media_type == "VIDEO") {
            return <Video source={{ uri: workoutObj.workout_media.uri }} style={{width: '100%', height: '100%', borderRadius: 8 }} shouldPlay={false} resizeMode="cover"  />
        } else {
            switch (workoutObj.default_media_uri) {

                case '':
                    return <Image source={''} />
                case 'Traps':
                    return <Image style={{ flex: 1, alignSelf: 'center' }} resizeMode="contain" source={require('../../../../../images/buildworkout/singleworkout/Traps.png')} />
                case 'Chest':
                    return <Image style={{ flex: 1, alignSelf: 'center' }} resizeMode="contain" source={require('../../../../../images/buildworkout/singleworkout/Chest.png')} />
                case 'Bicep':
                    return <Image style={{ flex: 1, alignSelf: 'center' }} resizeMode="contain" source={require('../../../../../images/buildworkout/singleworkout/Bicep.png')} />
                case 'Calves':
                    return <Image style={{ flex: 1, alignSelf: 'center' }} resizeMode="contain" source={require('../../../../../images/buildworkout/singleworkout/Calves.png')} />
                case 'Core':
                    return <Image style={{ flex: 1, alignSelf: 'center' }} resizeMode="contain" source={require('../../../../../images/buildworkout/singleworkout/Core.png')} />
                case 'Glutes':
                    return <Image style={{ flex: 1, alignSelf: 'center' }} resizeMode="contain" source={require('../../../../../images/buildworkout/singleworkout/Glutes.png')} />
                case 'Supr':
                    return <Image style={{ flex: 1, alignSelf: 'center' }} resizeMode="contain" source={require('../../../../../images/buildworkout/singleworkout/Supr.png')} />
                case 'Triceps':
                    return <Image style={{ flex: 1, alignSelf: 'center' }} resizeMode="contain" source={require('../../../../../images/buildworkout/singleworkout/Triceps.png')} />
                case 'Hip':
                    return <Image style={{ flex: 1, alignSelf: 'center' }} resizeMode="contain" source={require('../../../../../images/buildworkout/singleworkout/Hip.png')} />
                default:
                    return <Image source={''} />
            }
        }
    }

    const handleChangeRepsSliderValue = (workoutRef, value) => {
        workoutRef.workout_reps = value;
        forceUpdateState(!updateState)
    }

    const handleChangeSetsSliderValue = (workoutRef, value) => {
        workoutRef.workout_sets = value;
        forceUpdateState(!updateState)
    }

    const handleIncrementExcerciseSets = (workoutRef) => {
        let updatedSets = workoutRef.workout_sets;

        updatedSets += 1;
        if (workoutMode) {
            if (workoutMode == LIVE_WORKOUT_MODE.IN_PERSON) {
                workoutRef.workout_sets = updatedSets
                liveWorkoutService.updateExerciseSetsLive(workoutRef.workout_uid, updatedSets)
            }
        } else {
            workoutRef.workout_sets++;
        }

        forceUpdateState(!updateState)
    }

    const handleDecrementExerciseSets = (workoutRef) => {
        let updatedSets = workoutRef.workout_sets;

        updatedSets -= 1;
        if (workoutMode) {
            if (workoutMode == LIVE_WORKOUT_MODE.IN_PERSON) {
                workoutRef.workout_sets = updatedSets
                liveWorkoutService.updateExerciseSetsLive(workoutRef.workout_uid, updatedSets)
            }
        } else {
            if (workoutRef.workout_sets == 0) {
                return;
            }

            workoutRef.workout_sets--;
        }

        forceUpdateState(!updateState)
    }

    const handleIncrementExcerciseReps = (workoutRef) => {
        let updatedReps = workoutRef.workout_reps;

        updatedReps += 1;
        if (workoutMode) {
            if (workoutMode == LIVE_WORKOUT_MODE.IN_PERSON) {
                workoutRef.workout_reps = updatedReps
                liveWorkoutService.updateExerciseRepsLive(workoutRef.workout_uid, updatedReps)
            }
        } else {
            workoutRef.workout_reps++;
        }

        forceUpdateState(!updateState)
    }

    const handleDecrementExerciseReps = (workoutRef) => {
        let updatedReps = workoutRef.workout_reps;

        updatedReps -= 1;
        if (workoutMode) {
            if (workoutMode == LIVE_WORKOUT_MODE.IN_PERSON) {
                workoutRef.workout_reps = updatedReps
                liveWorkoutService.updateExerciseRepsLive(workoutRef.workout_uid, updatedReps)
            }
        } else {
            if (workoutRef.workout_reps == 0) {
                return;
            }

            workoutRef.workout_reps--;
        }

        forceUpdateState(!updateState)
    }

    const changeExerciseRestTime = (workoutRef, restTime) => {
        if (restTime == 'Edit') {
            setEditRestTime(true);
            return;
        }
        workoutRef.workout_rest_time = restTime;
        setPickedRestTime(restTime)
    }

    const handleOnChangeRestTimeOneInputText = (text, workoutRef) => {
        setRestTimeInputOneText(text);
        workoutRef.workout_rest_time = inputRestTimeOneText;
    }

    const handleOnChangeRestTimeTwoInputText = (text, workoutRef) => {
        setRestTimeInputTwoText(text);
        workoutRef.workout_rest_time = inputRestTimeTwoText;
    }

    const handleOnChangeRestTimeSupersetInputText = (text, workoutRef) => {
        setRestTimeSupersetText(text);
        workoutre.workout_rest_time = inputRestTimeSupersetText;
    }

    const handleOnChangeTempoInputOneText = (text, workoutRef) => {
        setTempoInputOneText(text)
        workoutRef.workout_tempo = inputTempoOneText;
    }

    const handleOnChangeTempoInputTwoText = (text, workoutRef) => {
        setTempoInputTwoText(text)
        workoutRef.workout_tempo = inputTempoTwoText;
    }

    const handleOnPickIntensity = () => {
        openIntensityPicker();
    }

    const handleOnChangeIntensity = (exerciseRef, intensityText) => {
        exerciseRef.workout_rest_time = intensityText;
    }

    const handleOnSetTempo = () => {
        if (pickedExerciseTempo.length === 3) {
            setExerciseTempoError(true);
        }



        closeTempoPicker()
    }

    const onChangeTextHandler = (text) => {
        if (text.length < pickedExerciseTempo.length) {
            text = text.substr(0, pickedExerciseTempo.length - 2);
            setPickedExerciseTempo(text)
            handleMeasurement(measurementAccessed, text)
            //  workoutRef.workout_tempo = text
            return;
        } else if (text.length > pickedExerciseTempo.length) {
            if (pickedExerciseTempo.length === 4) {
                setPickedExerciseTempo(text);
                //     workoutRef.workout_tempo = text
                handleMeasurement(measurementAccessed, text)
                return;
            }

            text = text + "-"
            setPickedExerciseTempo(text)
            //   workoutRef.workout_tempo = text
            handleMeasurement(measurementAccessed, text)
        }
    }

    onFocusTextHandler = () => {
        if (pickedExerciseTempo === '0-0-0') {
            setPickedExerciseTempo("")
        }
    }

    const openProgramWeekPicker = () => programWeekPicker.current.open();
    const closeProgramWeekPicker = () => programWeekPicker.current.close();

    const openRestTimePicker = () => restTimePickerRef.current.open();
    const closeRestTimePicker = () => restTimePickerRef.current.close();

    const handleOnOpenTempoPicker = (workout) => {
        setAccessedMeasurement(workout);
        openTempoPicker();
    }



    const openTempoPicker = () => tempoPickerRef.current.open();
    const closeTempoPicker = () => tempoPickerRef.current.close();

    const renderTempoPicker = () => {
        return (
            <RBSheet
                ref={tempoPickerRef}
                height={350}
                closeOnPressMask={true} x
                customStyles={{
                    wrapper: {

                    },
                    container: {

                    },
                    draggableIcon: {
                        backgroundColor: '#000000'
                    }
                }}
                dragFromTopOnly={true}

            >
                <View style={{ flex: 1 }}>

                    <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
                        <Dialog.Content>
                            <Paragraph>
                                Type in the tempo you wish to set for this exercise.
                        </Paragraph>
                            {
                                exerciseTempoError ?
                                    <Text style={{ fontSize: 12, color: 'red' }}>
                                        Tempo must be in the format: X-X-X
                        </Text>
                                    :
                                    null
                            }

                        </Dialog.Content>
                        <TextInput
                            style={{ alignSelf: 'center', fontSize: 60, borderWidth: 0.8, padding: 20, borderRadius: 15, borderColor: '#EEEEEE' }}
                            placeholder="0-0-0"
                            maxLength={5}
                            keyboardType="numeric"
                            keyboardAppearance="light"
                            returnKeyLabel="done"
                            returnKeyType="done"
                            value={pickedExerciseTempo}
                            onFocus={onFocusTextHandler}
                            onChangeText={(text) => onChangeTextHandler(text)} />
                    </View>

                    <View style={{ width: '100%' }}>
                        <Button
                            mode="contained"
                            color="#1089ff"
                            style={{ alignSelf: 'center', marginVertical: 10, elevation: 0 }}
                            contentStyle={{ height: 45, width: Dimensions.get('window').width - 20 }}
                            onPress={handleOnSetTempo}
                            theme={{ roundness: 8 }}
                        >
                            <Text>
                                Set Tempo
                    </Text>
                        </Button>
                    </View>

                </View>
                <SafeAreaView />
            </RBSheet>
        )
    }

    const renderIntensityPicker = (exercise) => {
        return (
            <RBSheet
                ref={intensityPickerRef}
                height={300}
                closeOnPressMask={true}
                customStyles={{
                    wrapper: {

                    },
                    container: {
                        borderRadius: 20
                    },
                    draggableIcon: {
                        backgroundColor: '#000000'
                    }
                }}
                dragFromTopOnly={true}

            >
                <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
                    <Text style={{fontSize: 15, fontFamily: 'Avenir-Black', paddingHorizontal: 10}}>
                        Add a rest time (in seconds)
                    </Text>
                    <TextInput
                        style={{ alignSelf: 'center', fontSize: 60, borderWidth: 0.8, padding: 20, borderRadius: 15, borderColor: '#EEEEEE' }}
                        placeholder="0"
                        maxLength={3}
                        keyboardType="numeric"
                        keyboardAppearance="light"
                        returnKeyLabel="done"
                        returnKeyType="done"
                        value={workout.workout_rest_time}
                        onChangeText={(text) => handleOnChangeIntensity(exercise, text)} />

                    <View style={{ width: '100%' }}>
                        <Button
                            color="#1089ff"
                            style={{ alignSelf: 'center' }}
                            mode="contained"
                            onPress={closeIntensityPicker}
                            theme={{ roundness: 0 }}
                            style={{ height: 45, width: Dimensions.get('window').width - 20, borderRadius: 8, alignSelf: 'center' }}
                            contentStyle={{ height: 45, width: Dimensions.get('window').width - 20 }}
                        >
                            <Text>
                                Done
                            </Text>
                        </Button>
                    </View>
                </View>
                <SafeAreaView />
            </RBSheet>
        )
    }

    const renderRestTimePicker = () => {
        return (
            <RBSheet
                ref={restTimePickerRef}
                height={300}
                closeOnPressMask={true}
                customStyles={{
                    wrapper: {

                    },
                    container: {
                        borderRadius: 20
                    },
                    draggableIcon: {
                        backgroundColor: '#000000'
                    }
                }}
                dragFromTopOnly={true}>
                <View style={{ flex: 1 }}>
                    <View style={{ width: '100%' }}>
                        <Button color="#1089ff" style={{ alignSelf: 'flex-end' }} mode="text" onPress={closeRestTimePicker}>
                            <Text>
                                Done
                    </Text>
                        </Button>
                    </View>
                    <Picker
                        selectedValue={pickedRestTime}
                        style={{ height: '100%', width: '100%' }}
                        onValueChange={(itemValue, itemIndex) => changeExerciseRestTime(workout, itemValue)}>
                        {
                            restTimes.map((restTime, index, arr) => {
                                return <Picker.Item key={index} label={restTime} value={restTime} />
                            })
                        }
                    </Picker>
                </View>
                <SafeAreaView />
            </RBSheet>
        )
    }

    openMediaActionSheet = (workout) =>  {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options: ["Take a Video", "Upload Media", "Cancel"],
            destructiveButtonIndex: 2,
            cancelButtonIndex: 2
          },
          buttonIndex => {
            if (buttonIndex === 0) {
                handleTakeVideo(workout)
            } else if (buttonIndex === 1) {
              //image picker
              const options = {
                mediaType: 'video', 
                storageOptions:{
                  skipBackup:true,
                  path:'images'
                },
                allowsEditing: true
          };

              ImagePicker.showImagePicker(options, async (response) => {
                if (!response.didCancel)
                {      
                 const uri = await response.uri;
                 await LUPA_CONTROLLER_INSTANCE.saveProgramWorkoutGraphic(workout, currProgramUUID, 'VIDEO', uri)
                 .then(uploadedURI => {
                    handleCaptureNewMediaURI(uploadedURI, 'VIDEO', workout);
                 })
       
                }
                else if (response.error)
                {
              
                }
            });
            }
          }
        )
        }

    const renderVideoOptions = (workout) => {
        if (programType == 'template') {
            return (
                <TouchableOpacity onPress={() => openMediaActionSheet(workout)} style={{ width: '100%', alignItems: 'center', position: 'absolute', bottom: 0, left: 0, }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#1089ff', alignSelf: 'center', width: 30, height: 18, borderRadius: 30 }}>
                        <Feather1s name="video" color="white" />
                    </View>
                </TouchableOpacity>
            )
        }
    }

    const getBorderStyle = (exerciseID) => {
        if (currWorkoutID == exerciseID) {
            return {
                borderColor: '#1089ff',
                borderWidth: 2,
            }
        } else {
            return {
                borderColor: '#E5E5E5',
                borderWidth: 1,
            }
        }
    }


    const renderComponentDisplay = () => {
        switch (workout.superset.length == 0) {
            case true:
                return (
                    <>
                        <View style={{ marginLeft: 10}}>
                            <Text style={{ fontSize: 15, fontFamily: 'Avenir-Black' }}>
                                {workout.workout_name}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <FeatherIcon name="plus" />

                                <Text style={{ paddingLeft: 10, paddingVertical: 5, color: '#1089ff', fontWeight: '800', fontFamily: 'Avenir-Medium' }} onPress={handleSuperSetOnPress}>
                                    Add Superset
                  </Text>
                            </View>
                        </View>

                        <View style={{...getBorderStyle(workout.workout_uid),  borderRadius: 5, flex: 1, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}>


                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                <Surface style={{ width: 70, height: 50, borderRadius: 8, alignSelf: 'center', elevation: 0 }}>
                                    {renderImageSource(workout)}
                                    {renderVideoOptions(workout)}
                                    {renderIntensityPicker(workout)}
                                </Surface>


                                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-evenly', height: 80, width: 'auto' }}>

                                    <View>
                                        <View style={{ marginHorizontal: 5 }}>
                                            <View style={{ height: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                    <ThinFeatherIcon name="chevron-left" size={22} onPress={() => handleDecrementExerciseSets(workout)} />
                                                </View>

                                                <View style={{ paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center' }}>
                                                    <Text style={{ color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light', fontSize: 12 }}>
                                                        Sets ({workout.workout_sets})
            </Text>
                                                </View>

                                                <ThinFeatherIcon name="chevron-right" size={22} onPress={() => handleIncrementExcerciseSets(workout)} />
                                            </View>
                                        </View>

                                        <View style={{ marginHorizontal: 5 }}>
                                            <View style={{ height: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                    <ThinFeatherIcon name="chevron-left" size={22} onPress={() => handleDecrementExerciseReps(workout)} />
                                                </View>

                                                <View style={{ paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center' }}>
                                                    <Text style={{ color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light', fontSize: 12 }}>
                                                        Reps ({workout.workout_reps})
            </Text>
                                                </View>

                                                <ThinFeatherIcon name="chevron-right" size={22} onPress={() => handleIncrementExcerciseReps(workout)} />
                                            </View>
                                        </View>
                                    </View>


                                    <View style={{marginHorizontal: 10}}>
                                        <TouchableWithoutFeedback onPress={handleOnPickIntensity}>
                                            <Text style={{ paddingVertical: 5, color: '#1089ff', fontFamily: 'Avenir-Light', fontSize: 12 }}>
                                                Rest Time ({workout.workout_rest_time}s)
            </Text>
                                        </TouchableWithoutFeedback>

                                        <TouchableWithoutFeedback onPress={() => handleOnOpenTempoPicker(workout)}>
                                            <Text style={{ paddingVertical: 5, color: '#1089ff', fontFamily: 'Avenir-Light', fontSize: 12 }}>
                                                Tempo ({workout.workout_tempo})
            </Text>
                                        </TouchableWithoutFeedback>
                                    </View>




                                </View>
                            </View>

                            <TouchableOpacity onPress={() => handleDeleteExercise(workout.workout_uid)} style={{position: 'absolute', top: -8, right: -8,}}>
                            <View style={{backgroundColor: 'red',alignItems: 'center', justifyContent: 'center',  padding: 2,  width: 20, borderRadius: 12 }}>
                            <FeatherIcon name="minus" color="white" />
                            </View>
                            </TouchableOpacity>
                        </View>
                        <Divider style={{ height: 10, backgroundColor: '#FFFFFF' }} />
                        {renderExerciseCameraModal(workout)}
                    
                    </>
                )
            case false:

                return (

                    <View style={{ flex: 1, alignItems: 'flex-start' }}>

                        <View style={{ marginLeft: 10, }}>
                            <Text style={{ fontSize: 15, fontFamily: 'Avenir-Black' }}>
                                {workout.workout_name}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <FeatherIcon name="plus" />

                                <Text style={{ paddingLeft: 10, paddingVertical: 5, color: '#1089ff', fontWeight: '800', fontFamily: 'Avenir-Medium' }} onPress={handleSuperSetOnPress}>
                                    Add Superset
                  </Text>
                            </View>
                        </View>


                        <ScrollView
                            showsHorizontalScrollIndicator={false}
                            pagingEnabled={true}
                            decelerationRate={0}
                            snapToAlignment='center'
                            snapToInterval={Dimensions.get('window').width}
                            horizontal={true}
                            centerContent
                            scrollEventThrottle={3}
                            contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
                        >
                            <>

                                <View style={{...getBorderStyle(workout.workout_uid), flex: 1, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}>


                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>


                                        <Surface style={{ width: 70, height: 50, alignSelf: 'center', borderRadius: 8, elevation: 0, backgroundColor: '#FFFFFF' }}>
                                            {renderImageSource(workout)}
                                            {renderVideoOptions(workout)}
                                            {renderIntensityPicker(workout)}
                                        </Surface>


                                        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-evenly', height: 80, width: 'auto' }}>

                                            <View>
                                                <View style={{ marginHorizontal: 5 }}>
                                                    <View style={{ height: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                            <ThinFeatherIcon name="chevron-left" size={22} onPress={() => handleDecrementExerciseSets(workout)} />
                                                        </View>

                                                        <View style={{ paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center' }}>
                                                            <Text style={{ color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light', fontSize: 12 }}>
                                                                Sets ({workout.workout_sets})
          </Text>
                                                        </View>

                                                        <ThinFeatherIcon name="chevron-right" size={22} onPress={() => handleIncrementExcerciseSets(workout)} />
                                                    </View>
                                                </View>

                                                <View style={{ marginHorizontal: 5 }}>
                                                    <View style={{ height: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                            <ThinFeatherIcon name="chevron-left" size={22} onPress={() => handleDecrementExerciseReps(workout)} />
                                                        </View>

                                                        <View style={{ paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center' }}>
                                                            <Text style={{ color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light', fontSize: 12 }}>
                                                                Reps ({workout.workout_reps})
          </Text>
                                                        </View>

                                                        <ThinFeatherIcon name="chevron-right" size={22} onPress={() => handleIncrementExcerciseReps(workout)} />
                                                    </View>
                                                </View>
                                            </View>


                                            <View style={{marginHorizontal: 10}}>
                                                <TouchableWithoutFeedback onPress={handleOnPickIntensity}>
                                                    <Text style={{ paddingVertical: 5, color: '#1089ff', fontFamily: 'Avenir-Light', fontSize: 12 }}>
                                                        Rest Time ({workout.workout_rest_time}s)
          </Text>
                                                </TouchableWithoutFeedback>

                                                <TouchableWithoutFeedback onPress={() => handleOnOpenTempoPicker(workout)}>
                                                    <Text style={{ paddingVertical: 5, color: '#1089ff', fontFamily: 'Avenir-Light', fontSize: 12 }}>
                                                        Tempo ({workout.workout_tempo})
          </Text>
                                                </TouchableWithoutFeedback>
                                            </View>




                                        </View>
                                    </View>

                                    <TouchableOpacity onPress={() => handleDeleteExercise(workout.workout_uid)} style={{position: 'absolute', top: -8, right: -8,}}>
                            <View style={{backgroundColor: 'red',alignItems: 'center', justifyContent: 'center',  padding: 2,  width: 20, borderRadius: 12 }}>
                            <FeatherIcon name="minus" color="white" />
                            </View>
                            </TouchableOpacity>
                                </View>
                                <Divider style={{ height: 10, backgroundColor: '#EEEEEE' }} />
                             
                                {renderExerciseCameraModal(workout)}
                            </>
                            {
                                workout.superset.map(superset => {
                                    return (
                                        <>
                                            <View style={{...getBorderStyle(workout.workout_uid), flex: 1, marginHorizontal: 10, alignSelf: 'flex-start', alignItems: 'center', justifyContent: 'center' }}>


                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>


                                                    <Surface style={{ width: 70, height: 50, alignSelf: 'center', borderRadius: 8, elevation: 0, backgroundColor: '#FFFFFF' }}>
                                                        {renderImageSource(superset)}
                                                        {renderVideoOptions(superset)}
                                                        {renderIntensityPicker(superset)}
                                                    </Surface>



                                                    <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-evenly', height: 80, width: 'auto' }}>

                                                        <View style={{ marginRight: 10 }}>
                                                            <View style={{ marginHorizontal: 5 }}>
                                                                <View style={{ height: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                                        <ThinFeatherIcon name="chevron-left" size={22} onPress={() => handleDecrementExerciseSets(superset)} />
                                                                    </View>

                                                                    <View style={{ paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center' }}>
                                                                        <Text style={{ color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light', fontSize: 12 }}>
                                                                            Sets ({superset.workout_sets})
                                  </Text>
                                                                    </View>

                                                                    <ThinFeatherIcon name="chevron-right" size={22} onPress={() => handleIncrementExcerciseSets(superset)} />
                                                                </View>
                                                            </View>

                                                            <View style={{ marginHorizontal: 5 }}>
                                                                <View style={{ height: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                                        <ThinFeatherIcon name="chevron-left" size={22} onPress={() => handleDecrementExerciseReps(superset)} />
                                                                    </View>

                                                                    <View style={{ paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center' }}>
                                                                        <Text style={{ color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light', fontSize: 12 }}>
                                                                            Reps ({superset.workout_reps})
                                  </Text>
                                                                    </View>

                                                                    <ThinFeatherIcon name="chevron-right" size={22} onPress={() => handleIncrementExcerciseReps(superset)} />
                                                                </View>
                                                            </View>
                                                        </View>


                                                        <View style={{ marginHorizontal: 10 }}>
                                                            <TouchableWithoutFeedback onPress={handleOnPickIntensity}>
                                                                <Text style={{ paddingVertical: 5, color: '#1089ff', fontFamily: 'Avenir-Light', fontSize: 12 }}>
                                                                    Rest Time ({superset.workout_rest_time}s)
                                  </Text>
                                                            </TouchableWithoutFeedback>

                                                            <TouchableWithoutFeedback onPress={() => handleOnOpenTempoPicker(superset)}>
                                                                <Text style={{ paddingVertical: 5, color: '#1089ff', fontFamily: 'Avenir-Light', fontSize: 12 }}>
                                                                    Tempo ({superset.workout_tempo})
                                  </Text>
                                                            </TouchableWithoutFeedback>
                                                        </View>




                                                    </View>
                                                </View>

                                                <TouchableOpacity onPress={() => handleDeleteExercise(superset.workout_uid)} style={{position: 'absolute', top: -8, right: -8,}}>
                            <View style={{backgroundColor: 'red',alignItems: 'center', justifyContent: 'center',  padding: 2,  width: 20, borderRadius: 12 }}>
                            <FeatherIcon name="minus" color="white" />
                            </View>
                            </TouchableOpacity>
                                            </View>
                                          
                                            {renderExerciseCameraModal(superset)}
                                        </>
                                    )
                                })

                            }
                        </ScrollView>
                        <Divider style={{ height: 10, backgroundColor: '#EEEEEE' }} />
                    </View>
                )
            default:

        }
    }

    

    const handleTakeVideo = (workout) => {
        // await setCurrPressedExercise(workout);
        setShowCamera(true);
    }

    const handleCaptureNewMediaURI = async (uri, mediaType, exercise) => {
        exercise.workout_media = {
            uri: uri,
            media_type: mediaType,
        }
    }

    const renderExerciseCameraModal = (workout) => {

        return (
            <ExerciseCameraModal
                isVisible={showCamera}
                closeModal={() => setShowCamera(false)}
                currWorkoutPressed={workout}
                currProgramUUID={currProgramUUID}
                mediaCaptureType={'VIDEO'}
                outlet={'CreateProgram'}
                captureURIProp={(uri, mediaType) => handleCaptureNewMediaURI(uri, mediaType, workout)}
            />
        )
    }

    return (
        <>
            {renderComponentDisplay()}
            {renderRestTimePicker()}
            {renderTempoPicker()}
        </>
    )
}

const styles = StyleSheet.create({
    captionNotifier: {
        color: '#e53935',
        fontSize: 12
    },
    container: {
        height: 30,
        width: '80%',
    },
    track: {
        height: 4,
        backgroundColor: '#303030',
        width: '100%',
    },
    thumb: {
        width: 10,
        height: 10,
        backgroundColor: '#31a4db',
        borderRadius: 10 / 2,
        shadowColor: '#31a4db',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 2,
        shadowOpacity: 1,
    }
})

export default WorkoutDisplay;