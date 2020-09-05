import React, { useState } from 'react';

import {
    View,
    Text,
    StyleSheet,
    Modal,
    SafeAreaView,
    Dimensions,
    TouchableOpacity,
    Image
} from 'react-native';
import { Video } from 'expo-av'
import {
    TextInput as PaperInput, Divider, Surface, Caption, FAB
} from 'react-native-paper';
import { TextInput } from 'react-native-gesture-handler';

import FeatherIcon from 'react-native-vector-icons/Feather';
import ThinFeatherIcon from 'react-native-feather1s'
import { useNavigation } from '@react-navigation/native';
import LupaController from '../../../../../../controller/lupa/LupaController'
import ImagePicker from 'react-native-image-picker'

function CreateCustomWorkoutModal({ isVisible, programUUID, closeModal, captureWorkout }) {
    const navigation = useNavigation();
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const [workoutName, setWorkoutName] = useState("");
    const [workoutDescription, setWorkoutDescription] = useState("");
    const [workoutSets, setWorkoutSets] = useState(0);
    const [workoutReps, setWorkoutReps] = useState(0);
    const [mediaType, setMediaType] = useState("");
    const [uri, setUri] = useState("");

    const [customWorkout, setCustomWorkout] = useState({
        workout_name: "Custom",
        workout_description: "",
        workout_media: {
            uri: "",
            media_type: ""
        },
        workout_steps: [],
        workout_tags: [],
        workout_uid: Math.random().toString(),
        workout_cue: "",
        workout_sets: 0,
        workout_reps: 0,
        superset: []
    })
    const [updateState, setUpdateState] = useState(false);

    const handleIncrementExcerciseSets = () => {
        let newSets = workoutSets;
        newSets++;
        setWorkoutSets(newSets)
        setUpdateState(!updateState)
    }

    const handleDecrementExerciseSets = () => {
        let newSets = workoutSets;
        newSets--;
        setWorkoutSets(newSets)
        setUpdateState(!updateState)
    }

    const handleIncrementExcerciseReps = () => {
        let newReps = workoutReps;
        newReps++;
        setWorkoutReps(newReps)
        setUpdateState(!updateState)
    }

    const handleDecrementExerciseReps = () => {
        let newReps = workoutReps;
        newReps--;
        setWorkoutReps(newReps)
        setUpdateState(!updateState)
    }

    const handleTakeVideo = () => {
        navigation.navigate('LupaCamera', {
            currWorkoutPressed: customWorkout,
            currProgramUUID: programUUID,
            mediaCaptureType: "VIDEO",
            captureURI: handleCaptureNewMediaURI,
            outlet: 'CreateProgram',
        })
    }

    const handleTakePicture = () => {
        addWorkoutMedia()
    }

    const addWorkoutMedia = () => {
        // Open Image Library
        ImagePicker.launchImageLibrary({
            allowsEditing: true
        }, async (response) => {
            if (response.didCancel) {
                // LOG_ERROR('CreateCustomWorkoutModal.js', 'User cancelled image picker in addWorkoutMedia()', 'true');
            } else if (response.error) {
                //LOG_ERROR('CreateCustomWorkoutModal.js', 'Caught exception in image picker in addWorkoutMedia()', response.error);
            } else {
                const source = await response.uri
                const workoutMediaURI = await LUPA_CONTROLLER_INSTANCE.saveProgramWorkoutGraphic(customWorkout, programUUID, 'IMAGE', source)
                handleCaptureNewMediaURI(workoutMediaURI, 'IMAGE');
            }
        });
    }

    const handleCaptureNewMediaURI = async (uri, mediaType) => {
        setUri(uri);
        setMediaType(mediaType)
    }

    const handleOnSave = () => {
        setCustomWorkout({
            workout_name: workoutName,
            workout_description: workoutDescription,
            workout_media: {
                uri: uri,
                media_type: mediaType
            },
            workout_sets: workoutSets,
            workout_reps: workoutReps,
            ...customWorkout
        })
        captureWorkout(customWorkout)
        closeModal()
    }

    const renderMedia = () => {
        if (typeof (customWorkout.workout_media.uri) == 'undefined') {
            return (
                <ThinFeatherIcon color="rgb(102, 111, 120)" name="film" size={40} />
            )
        }

        switch (customWorkout.workout_media.media_type) {
            case 'IMAGE':
                return <Image source={{uri: customWorkout.workout_media.uri}} style={{ flex: 1, width: '100%', height: '100%',  borderRadius: 80 }} />
            case 'VIDEO':
                return <Video source={{uri: customWorkout.workout_media.uri}} style={{ flex: 1, width: '100%', height: '100%', borderRadius: 80 }} loop={false} />
        }
    }

    return (
        <Modal visible={isVisible} presentationStyle="fullScreen" animated={true} animationType="slide">
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ paddingHorizontal: 10 }}>
                    <ThinFeatherIcon name="arrow-left" onPress={closeModal} size={20} style={{ marginRight: 20 }} />
                </View>

                <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
                    <View style={{ paddingHorizontal: 10 }}>
                        <Text style={{ fontFamily: 'Avenir-Heavy', fontSize: 18 }}>
                            Create a custom workout
                </Text>
                        <Text style={{ color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light' }}>
                            Create a custom workout becuase custom shit is cool
                </Text>
                    </View>

                    <View>
                        <Text style={{ paddingHorizontal: 10, fontFamily: 'Avenir-Medium', fontWeight: '600' }}>
                            Workout Name
                    </Text>
                        <TextInput keyboardType="default" returnKeyLabel="done" returnKeyType="done" value={workoutName} onChangeText={text => setWorkoutName(text)} placeholder="Name" style={{ padding: 10, alignSelf: 'center', width: Dimensions.get('window').width - 20, borderWidth: 1, borderRadius: 3, borderColor: 'rgb(218, 221, 234)' }} />
                    </View>
                    <View>
                        <Text style={{ paddingHorizontal: 10, fontFamily: 'Avenir-Medium', fontWeight: '600' }}>
                            Workout Description
                    </Text>
                        <PaperInput
                            value={workoutDescription}
                            onChangeText={text => setWorkoutDescription(text)}
                            theme={{
                                colors: {
                                    primary: '#374e66'
                                }
                            }}
                            mode="flat"
                            multiline
                            keyboardType="default"
                            returnKeyLabel="return"
                            style={{ width: Dimensions.get('window').width - 20, alignSelf: 'center' }}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%' }}>
                            <View style={{ marginHorizontal: 5 }}>
                                <Text style={{ color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light', fontSize: 15 }}>
                                    Sets
                                                    </Text>
                                <View style={{ height: 50, borderWidth: 1, borderRadius: 5, borderColor: 'rgb(102, 111, 120)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <ThinFeatherIcon name="chevron-left" size={30} onPress={handleDecrementExerciseSets} />
                                    </View>
                                    <View style={{ height: 50, backgroundColor: '#212121', width: 1 }} />
                                    <View style={{ paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 30, fontFamily: 'Avenir-Light' }}>
                                            {workoutSets}
                                        </Text>
                                    </View>
                                    <View style={{ height: 50, backgroundColor: '#212121', width: 1 }} />
                                    <ThinFeatherIcon name="chevron-right" size={30} onPress={handleIncrementExcerciseSets} />
                                </View>
                            </View>

                            <View style={{ marginHorizontal: 5 }}>
                                <Text style={{ color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light', fontSize: 15 }}>
                                    Reps
                                                    </Text>
                                <View style={{ height: 50, borderWidth: 1, borderRadius: 5, borderColor: 'rgb(102, 111, 120)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <ThinFeatherIcon name="chevron-left" size={30} onPress={handleDecrementExerciseReps} />
                                    </View>
                                    <View style={{ height: 50, backgroundColor: '#212121', width: 1 }} />
                                    <View style={{ paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 30, fontFamily: 'Avenir-Light' }}>
                                            {workoutReps}
                                        </Text>
                                    </View>
                                    <View style={{ height: 50, backgroundColor: '#212121', width: 1 }} />
                                    <ThinFeatherIcon name="chevron-right" size={30} onPress={handleIncrementExcerciseReps} />
                                </View>
                            </View>

                        </View>
                    </View>
                </View>
                <Divider />
                <View style={{ flex: 1 }}>
                    <>
                        <Surface style={{ paddingVertical: 5, backgroundColor: 'white', elevation: 0, }}>
                            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>

                                <TouchableOpacity onPress={handleTakeVideo}>
                                    <View style={{ alignItems: 'center' }}>
                                        <Surface style={{ elevation: 2, width: 30, height: 30, borderRadius: 40, alignItems: 'center', justifyContent: 'center', margin: 3 }}>
                                            <ThinFeatherIcon color="#212121" thin={true} name="video" size={15} />
                                        </Surface>
                                        <Caption style={{ fontSize: 10 }}>
                                            Add Video
                       </Caption>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={handleTakePicture}>
                                    <View style={{ alignItems: 'center' }}>
                                        <Surface style={{ elevation: 2, width: 30, height: 30, borderRadius: 40, alignItems: 'center', justifyContent: 'center', margin: 3 }}>
                                            <ThinFeatherIcon color="#212121" thin={true} name="image" size={15} />
                                        </Surface>
                                        <Caption style={{ fontSize: 10 }}>
                                            Add Image
                       </Caption>
                                    </View>
                                </TouchableOpacity>

                            </View>
                        </Surface>
                        <Divider style={{ width: '100%' }} />
                    </>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', width: 80, height: 80, borderWidth: 0.5, borderRadius: 80, borderColor: 'rgb(102, 111, 120)' }}>
                            {renderMedia()}
                        </View>
                        <Caption style={{ paddingVertical: 10 }}>
                            You haven't added any media
                                    </Caption>
                    </View>
                </View>

            </SafeAreaView>

            <FAB onPress={handleOnSave} icon="check" style={{ backgroundColor: '#1089ff', position: 'absolute', bottom: 0, right: 0, margin: 16 }} />
        </Modal>
    )
}

const style = StyleSheet.create({
    root: {

    }
})

export default CreateCustomWorkoutModal;