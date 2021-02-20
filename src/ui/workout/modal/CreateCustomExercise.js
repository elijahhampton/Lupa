import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Dimensions,
} from 'react-native';
import { Input } from 'react-native-elements';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import DropDownPicker from 'react-native-dropdown-picker';
import { Appbar, Button, Caption, Dialog, Modal, Divider } from 'react-native-paper';
import { Constants } from 'react-native-unimodules';

import FeatherIcon from 'react-native-vector-icons/Feather'
import { useSelector } from 'react-redux';
import LupaController from '../../../controller/lupa/LupaController';

const bodyParts = [
    {label: 'Traps', value: 'Traps' },
    {label: 'Chest', value: 'ACE'},
    {label: 'Bicep', value: 'ACSM'},
    {label: 'Calves', value: 'NCSF'},
    {label: 'Core', value: 'NCSF'},
    {label: 'Glutes', value: 'NCSF'},
    {label: 'Supr', value: 'NCSF'},
    {label: 'Triceps', value: 'NCSF'},
    {label: 'Hip', value: 'NCSF'},
]

const CreateCustomExercise = ({ isVisible, closeModal, workoutDay, programUUID, captureExercise}) => {
    const navigation = useNavigation();
    const [bodyPart, setBodyPart] = useState("");
    const currUserData = useSelector(state => {
        return state.Users.currUserData
    })

    const [forceUpdate, setForceUpdate] = useState(false)
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const [customExercise, setCustomExercise] = useState({
        workout_name: "",
        workout_description: "",
        workout_how_to_media: {
            uri: "",
            media_type: ""
        },
        workout_media: {
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
     default_media_type: "IMAGE",
     default_media_uri: bodyPart,
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
        
        newObject.workout_media.uri = uri;
        newObject.workout_media.media_type = "VIDEO";

        setCustomExercise(newObject);
        setForceUpdate(!forceUpdate)
    }

    const handleCaptureNewHowToMediaURI = (uri, mediaType) => {
        if (typeof(uri) == 'undefined' || typeof(mediaType) == 'undefined') {
            return;
        }

        let newObject = customExercise;
        
        newObject.workout_how_to_media.uri = uri;
        newObject.workout_how_to_media.media_type = "VIDEO";

        setCustomExercise(newObject);
        setForceUpdate(!forceUpdate)
    }

    const handleOnTakeHowToVideo = () => {
        navigation.push('LupaCamera', {
            currWorkoutPressed: customExercise,
            currProgramUUID: programUUID,
            mediaCaptureType: "VIDEO",
            captureURI: handleCaptureNewHowToMediaURI,
            outlet: 'CreateProgram',
        });
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

    const renderHowToMedia = (media) => {
        if (customExercise.workout_how_to_media.uri == "" || typeof(customExercise.workout_how_to_media.uri) == 'undefined') {
            return (
                <View style={{ margin: 10, alignItems: 'center', justifyContent: 'center', height: 60, width: 60, alignSelf: 'center', borderRadius: 80, borderColor: '#AAAAAA', borderWidth: 1}}>
               <TouchableOpacity onPress={handleOnTakeHowToVideo}>
                <Feather1s name='plus' size={30} color="#FFFFFF" />
                </TouchableOpacity>
        </View>
         
            )
        } else {
            return (
                <View style={{ flex: 1}}>
                    <View style={{ margin: 10, alignItems: 'center', justifyContent: 'center', height: 60, width: 60, alignSelf: 'center', borderRadius: 80, borderColor: '#AAAAAA', borderWidth: 1}}>
                    <Video style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height / 1.5}} resizeMode="cover" source={{ uri: customExercise.workout_how_to_media.uri }} />
        </View>
                  
         </View>
                 
            )
        }
    }

    const renderMedia = (media) => {
        if (customExercise.workout_media.uri == "" || typeof(customExercise.workout_media.uri) == 'undefined') {
            return (
                <View style={{ margin: 10, alignItems: 'center', justifyContent: 'center', height: 60, width: 60, alignSelf: 'center', borderRadius: 80, borderColor: '#AAAAAA', borderWidth: 1}}>
               <TouchableOpacity onPress={handleOnTakeVideo}>
                <Feather1s name='plus' size={30} color="#FFFFFF" />
                </TouchableOpacity>
        </View>
         
            )
        } else {
            return (
                <View style={{ flex: 1}}>
                    <View style={{ margin: 10, alignItems: 'center', justifyContent: 'center', height: 60, width: 60, alignSelf: 'center', borderRadius: 80, borderColor: '#AAAAAA', borderWidth: 1}}>
                    <Video style={{flex: 1, width: '100%', height: '100%'}} resizeMode="cover" source={{ uri: customExercise.workout_media.uri }} />
        </View>
         </View>             
            )
        }
    }

    const handleOnSave = () => {
        if (customExercise.workout_name.length < 5) {
            alert('Please add a longer workout name!')
            return;
        }

       // LUPA_CONTROLLER_INSTANCE.savePersonalExercise(currUserData, customExercise);
        captureExercise(customExercise, 'exercise');
        setCustomExercise({
            workout_name: "",
            workout_description: "",
            workout_how_to_media: {
                uri: "",
                media_type: ""
            },
            workout_media: {
            media_type: '',
            uri: '',
        },
        workout_reps: 0,
        workout_sets: 0,
        workout_uid: Math.random().toString(),
        workout_tempo: '0-0-0',
        workout_rest_time: 0,
        intensity:  0,
        workout_day: "",
        superset: [],
         default_media_type: "IMAGE",
         default_media_uri: bodyPart,
        index: -1
        });
        closeModal()
    }

    return (

        <Modal visible={isVisible} contentContainerStyle={{width: Dimensions.get('window').width, height: Dimensions.get('window').height,  backgroundColor: 'white'}}>
            <Appbar.Header style={{backgroundColor: '#FFFFFF', elevation: 0}}>
                <Appbar.BackAction onPress={closeModal} />
                <Appbar.Content title="Create" titleStyle={{alignSelf: 'center', fontFamily: 'Avenir-Heavy', borderBottomColor: '#EEEEEE', borderBottomWidth: 1, fontWeight: 'bold', fontSize: 25}} />
            </Appbar.Header>
            <View style={{flex: 1 }}>
                <ScrollView>
                <View style={{flexDirection: 'row', height: 'auto', width: Dimensions.get('window').width, alignItems: 'center'}}>
                    <View style={{backgroundColor: '#23374d', width: Dimensions.get('window').width /2, height: 200, alignItems: 'center', justifyContent: 'center'}}>
                    {renderHowToMedia('users')}
                    {
                    customExercise.workout_how_to_media.uri == "" ? 
                        <Caption 
                        onPress={handleOnTakeHowToVideo} 
                        style={{color: '#FFFFFF', textAlign: 'center'}}> 
                        Add an introduction for this exercise 
                        </Caption> 
                        : 
                        <Caption 
                        style={{color: '#FFFFFF'}}> 
                        Record again 
                        </Caption>
                    }
                    </View>
                    <View style={{backgroundColor: 'white', width: 1}} />
                    <View style={{backgroundColor: '#23374d', width: Dimensions.get('window').width / 2, height: 200, alignItems: 'center', justifyContent: 'center'}}>
                    {renderMedia('video')}
                    {
                    customExercise.workout_media.uri == "" ? 
                    <Caption 
                    onPress={handleOnTakeVideo} 
                    style={{color: '#FFFFFF', textAlign: 'center'}}> 
                    Add custom media for this exercise 
                    </Caption> 
                    : 
                    <Caption 
                    style={{color: '#FFFFFF'}}> 
                    Record again 
                    </Caption>}
                    </View>
                    </View>

                <View style={{marginVertical: 15}}>
<Input 
                        value={customExercise.workout_name} 
                        inputContainerStyle={{borderBottomWidth: 1, borderRadius: 0, paddingHorizontal: 5}}
                        inputStyle={{fontSize: 15}}
                        onChangeText={text => handleOnChangeExerciseName(text)} 
                        placeholder="What is the name of this exercise?"
                        returnKeyLabel="done"
                        returnKeyType="done"
                        keyboardType="default"
                        keyboardAppearance="light"
                    />
</View>

                  

                    <View style={{marginVertical: 15}}>
                        <Text style={{padding: 10}}> 
                            Select a muscle group for this exercise!
                        </Text>
<DropDownPicker
    items={bodyParts}
    defaultValue={bodyPart}
    containerStyle={{height: 40, width: Dimensions.get('window').width - 10, alignSelf: 'center'}}
    style={{backgroundColor: '#fafafa'}}
    itemStyle={{
        justifyContent: 'flex-start'
    }}
    dropDownStyle={{backgroundColor: '#fafafa'}}
    onChangeItem={item => setBodyPart(item.value)}
/>
</View>
                    
                </ScrollView>
                <View style={{position: 'absolute', bottom: 25, marginVertical: 15, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                        <Button uppercase={false} color="#23374d" mode="text" contentStyle={{height: 45, width: Dimensions.get('window').width / 2.5}} style={{height: 45, width: Dimensions.get('window').width / 2.5}} theme={{roundness: 8}} onPress={closeModal} >
                            <Text style={{fontFamily: 'Avenir-Heavy', fontWeight: '800'}} >
                                Cancel
                            </Text>
                        </Button>
                        <Button uppercase={false} color="#23374d" mode="text" contentStyle={{height: 45, width: Dimensions.get('window').width / 2.5}} style={{elevation: 0, height: 45, width: Dimensions.get('window').width / 2.5}} theme={{roundness: 8}} onPress={handleOnSave} >
                            <Text style={{fontFamily: 'Avenir-Heavy', fontWeight: '800'}} >
                                Save
                            </Text>
                        </Button>
                    </View>
            </View>
        </Modal>
    )
}

export default CreateCustomExercise;

const styles = StyleSheet.create({
   
})