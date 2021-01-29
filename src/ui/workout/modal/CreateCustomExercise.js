import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Dimensions,
    Modal
} from 'react-native';
import { Input } from 'react-native-elements';
import { Appbar, Button, Caption, Dialog } from 'react-native-paper';

import FeatherIcon from 'react-native-vector-icons/Feather'

const CreateCustomExercise = ({ isVisible, closeModal, workoutDay, programUUID, captureExercise}) => {
    const navigation = useNavigation();

    const [forceUpdate, setForceUpdate] = useState(false)

    const [customExercise, setCustomExercise] = useState({
        workout_name: "",
        workout_description: "",
        workoutMedia: {
        media_type: '',
        uri: '',
    },
    workout_reps: 0,
    workout_sets: 0,
    workout_uid: Math.random().toString(),
    workout_tempo: '0-0-0',
    workout_rest_time: 0,
    intensity:  0,
    workout_day: workoutDay,
    superset: [],
     default_media_type: "",
     default_media_uri: "",
    index: -1
    })

    const handleOnChangeExerciseName = (text) => {
        let newObject = customExercise;
        newObject.workout_name = text;
        setCustomExercise(newObject);
        setForceUpdate(!forceUpdate)
    }

    const handleCaptureNewMediaURI = async (uri, mediaType) => {
        if (typeof(uri) == 'undefined' || typeof(mediaType) == 'undefined') {
            return;
        }

        let newObject = customExercise;
        
        newObject.workoutMedia.uri = uri;
        newObject.workoutMedia.media_type = "VIDEO";

        setCustomExercise(newObject);
        setForceUpdate(!forceUpdate)
    }

    const handleOnTakeVideo = () => {
        navigation.push('LupaCamera', {
            currWorkoutPressed: customExercise,
            currProgramUUID: programUUID,
            mediaCaptureType: "VIDEO",
            captureURI: handleCaptureNewMediaURI,
            outlet: 'CreateProgram',
        });
    }

    const renderMedia = () => {
        if (customExercise.workoutMedia.uri == "" || typeof(customExercise.workoutMedia.uri) == 'undefined') {
            return (
                <View style={{ margin: 10, alignItems: 'center', justifyContent: 'center', height: 80, width: 80, alignSelf: 'center', borderRadius: 80, borderColor: '#AAAAAA', borderWidth: 1}}>
               <TouchableOpacity onPress={handleOnTakeVideo}>
                <FeatherIcon name="video" size={30} color="#AAAAAA" />
                </TouchableOpacity>
        </View>
         
            )
        } else {
            return (
                <View style={{ margin: 10, height: 80, width: 80, alignSelf: 'center', borderRadius: 80, borderColor: '#AAAAAA', borderWidth: 1}}>
                   <Video style={{margin: 0, padding: 0, borderRadius: 80,  width: '100%',  height: '100%', alignSelf: 'center' }} resizeMode="cover" source={{ uri: customExercise.workoutMedia.uri }} />
         </View>
                 
            )
        }
    }

    const handleOnSave = () => {
        if (customExercise.workout_name.length < 2) {
            return;
        }

        captureExercise(customExercise, 'exercise');
        closeModal()
    }

    return (

        <Dialog visible={isVisible} style={{alignSelf: 'center', borderRadius: 20, height: 350, width: Dimensions.get('window').width - 20}}>
            <View style={{flex: 1, }}>
                <View style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
                    {renderMedia()}
                    {customExercise.workoutMedia.uri == "" ? <Caption onPress={handleOnTakeVideo} style={{color: '#1089ff'}}> Add custom media for this exercise </Caption> : <Caption style={{color: '#1089ff'}} onPress={handleOnTakeVideo}> Record again </Caption>}
                </View>

                <View style={{flex: 2, alignItems: 'center', justifyContent: 'space-evenly'}}>
                    <Input 
                        value={customExercise.workout_name} 
                        inputContainerStyle={{borderBottomWidth: 2}}
                        onChangeText={text => handleOnChangeExerciseName(text)} 
                        placeholder="What is the name of this exercise?"
                        returnKeyLabel="done"
                        returnKeyType="done"
                        keyboardType="default"
                        keyboardAppearance="light"
                    />

                    <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                        <Button uppercase={false} color="#23374d" mode="outlined" contentStyle={{height: 45, width: Dimensions.get('window').width / 2.5}} style={{height: 45, width: Dimensions.get('window').width / 2.5}} theme={{roundness: 8}} onPress={closeModal} >
                            <Text style={{fontFamily: 'Avenir-Heavy', fontWeight: '800'}} >
                                Cancel
                            </Text>
                        </Button>
                        <Button uppercase={false} color="#23374d" mode="contained" contentStyle={{height: 45, width: Dimensions.get('window').width / 2.5}} style={{elevation: 0, height: 45, width: Dimensions.get('window').width / 2.5}} theme={{roundness: 8}} onPress={handleOnSave} >
                            <Text style={{fontFamily: 'Avenir-Heavy', fontWeight: '800'}} >
                                Save
                            </Text>
                        </Button>
                    </View>
                </View>
            </View>
        </Dialog>
    )
}

export default CreateCustomExercise;

const styles = StyleSheet.create({
   
})