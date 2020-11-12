import React, { createRef, useState } from 'react';

import {
    View,
    Text,
    StyleSheet,
    Modal,
    Dimensions,
    TouchableOpacity,
    Image,
    SafeAreaView,
} from 'react-native';
 
import { Video } from 'expo-av'
import {
    TextInput as PaperInput, Divider, Surface, Caption, FAB, IconButton, Button, Appbar
} from 'react-native-paper';
import { ScrollView, TextInput } from 'react-native-gesture-handler';

import FeatherIcon from 'react-native-vector-icons/Feather';
import ThinFeatherIcon from 'react-native-feather1s'
import { useNavigation } from '@react-navigation/native';
import LupaController from '../../../../../../controller/lupa/LupaController'
import ImagePicker from 'react-native-image-picker'
import Feather1s from 'react-native-feather1s/src/Feather1s';

function CreateCustomWorkoutModal({ route, navigation }) {
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const [workoutName, setWorkoutName] = useState("");
    const [workoutDescription, setWorkoutDescription] = useState("");
    const [workoutSets, setWorkoutSets] = useState(0);
    const [workoutReps, setWorkoutReps] = useState(0);
    const [mediaType, setMediaType] = useState("");
    const [uri, setUri] = useState("");
    const titleInputFocused = createRef();

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

    const handleTakeVideo = () => {
        navigation.navigate('LupaCamera', {
            currWorkoutPressed: customWorkout,
            currProgramUUID: route.params.programUUID,
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
        if (typeof(uri) == 'undefined' || typeof(mediaType) == 'undefined') {
            return;
        }
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
            workout_uid: Math.random().toString(),
            superset: []
        })

        route.params.captureWorkout(customWorkout)
        navigation.pop();
    }

    const renderMedia = () => {
        if (typeof (mediaType) == 'undefined') {
            return (
                <ThinFeatherIcon color="rgb(102, 111, 120)" name="film" size={40} />
            )
        }

        switch (uri) {
            
            case 'IMAGE':
                return <Image source={{uri: uri}} resizeMode="cover" style={{ width: '100%', height: '100%',  borderRadius: 0 }} />
            case 'VIDEO':
                return <Video source={{uri: uri}} style={{  width: '100%', height: '100%', borderRadius: 80 }} loop={false} />
            default:
                return ( 
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}> 
                <Feather1s name="film" size={60} color="rgb(102, 111, 120)" /> 
                </View>
                )
        }
    }

    return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <ScrollView>
                <Appbar.Header style={{backgroundColor: 'white', elevation: 0, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <ThinFeatherIcon name="arrow-left" onPress={() => navigation.pop()} size={20} style={{ marginRight: 20 }} />
                    <Button color="#1089ff"  mode="text" onPress={handleOnSave}>
                        Add
                    </Button>
                </Appbar.Header>

                <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
                    <View style={{ paddingHorizontal: 10 }}>
                        <Text style={{ fontFamily: 'Avenir-Heavy', fontSize: 18 }}>
                            Create a custom workout
                </Text>
                        <Text style={{ color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light' }}>
                           Add an exercise using your own photo or video.
                </Text>
                    </View>

                    <View>
                        <View style={{marginVertical: 10,}}>
                        <View>
                        <Text style={{marginVertical: 10, paddingHorizontal: 10, fontFamily: 'Avenir-Medium', fontWeight: '800', fontSize: 15 }}>
                            Workout Name
                    </Text>
                   
                        <PaperInput theme={{colors: { primary: '#1089ff' }}} mode="outlined" ref={titleInputFocused} keyboardType="default" returnKeyLabel="done" returnKeyType="done" value={workoutName} onChangeText={text => setWorkoutName(text)} placeholder="Name" style={[styles.textInput, { height: 45, borderBottomColor: titleInputFocused ? "#1089ff" : "#212121",}]} />
                    </View>
                        </View>

                     
                    <View style={{marginVertical: 15}}>
                        <Text style={{marginVertical: 10, paddingHorizontal: 10, fontFamily: 'Avenir-Medium', fontWeight: '800', fontSize: 15  }}>
                            Workout Description
                    </Text>
                        <PaperInput
                            value={workoutDescription}
                            onChangeText={text => setWorkoutDescription(text)}
                            theme={{
                                colors: {
                                    primary: '#1089ff'
                                }
                            }}
                            mode="flat"
                            multiline
                            keyboardType="default"
                            returnKeyLabel="return"
                            style={{ height: 75, width: Dimensions.get('window').width - 20, alignSelf: 'center' }}
                        />
                    </View>
                    </View>

                    

                </View>
                <Divider style={{marginVertical: 10}} />
                <View style={{ flex: 1 }}>
                    <>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width - 50, height: 280, borderWidth: 0.5, borderRadius: 10, borderColor: 'rgb(102, 111, 120)' }}>
                            {renderMedia()}
                        </View>
                        {
                            typeof(uri) == 'undefined' ?
<Caption style={{ paddingVertical: 10 }}>
                            You haven't added any media
                                    </Caption>
                                    :
                                    null
                        }

                    </View>

                       

                    </>
                   
                </View>

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
</ScrollView>
            </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: '#FFFFFF',
    },
    textInput: {
        margin: 3,
        width: Dimensions.get('window').width - 20,
        alignSelf: 'center',
        fontSize: 13,
        fontFamily: 'Avenir-Light',
      },
})

export default CreateCustomWorkoutModal;