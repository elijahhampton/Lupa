import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av';
import React, { useState , useEffect} from 'react';
import { ScrollView, ActionSheetIOS  } from 'react-native';
import { SafeAreaView } from 'react-native';
import {
    View,
    Text,
    StyleSheet,
    Modal as NativeModal,
    TouchableOpacity,
    KeyboardAvoidingView,
    Dimensions,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { Input } from 'react-native-elements';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import DropDownPicker from 'react-native-dropdown-picker';
import { Appbar, Button, Caption, Dialog, Modal, Divider, Chip } from 'react-native-paper';
import { Constants } from 'react-native-unimodules';

import FeatherIcon from 'react-native-vector-icons/Feather'
import { useSelector } from 'react-redux';
import LupaController from '../../../controller/lupa/LupaController';

const bodyParts = [
    {label: 'Traps', value: 'Traps' },
    {label: 'Chest', value: 'Chest'},
    {label: 'Bicep', value: 'Bicep'},
    {label: 'Calves', value: 'Calves'},
    {label: 'Core', value: 'Core'},
    {label: 'Glutes', value: 'Glutes'},
    {label: 'Supr', value: 'Supr'},
    {label: 'Triceps', value: 'Triceps'},
    {label: 'Hip', value: 'Hip'},
]

const EXERCISE_EQUIPMENT_LIST = [
    'Treadmill'
]


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
      <NativeModal presentationStyle="fullScreen" visible={isVisible}>
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
      </NativeModal>
  
    )
  }



const CreateCustomExercise = ({ 
  isVisible, 
  closeModal, 
  workoutDay, 
  programUUID, 
  captureExercise
}) => {
    const navigation = useNavigation();
    const [bodyPart, setBodyPart] = useState("");
    const currUserData = useSelector(state => {
        return state.Users.currUserData
    })

    const [addEquipmentModalVisible, setAddEquipmentModalVisible] = useState(false);

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
    index: -1,
    required_eqipment: []
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
        if (customExercise.workout_media.uri == "" || typeof(customExercise.workout_media.uri) == 'undefined') {
            return (
                <View style={{ margin: 10, alignItems: 'center', justifyContent: 'center', height: 60, width: 60, alignSelf: 'center', borderRadius: 80, borderColor: '#AAAAAA', borderWidth: 1}}>
                <Feather1s name='plus' size={30} color="#FFFFFF" />
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

    const handleOnSave = async () => {
        if (customExercise.workout_name.length < 5) {
            alert('Please add a longer workout name!')
            return;
        }

       // LUPA_CONTROLLER_INSTANCE.savePersonalExercise(currUserData, customExercise);
        
       await captureExercise(customExercise, 'exercise');
        closeModal()
    }

    const captureEquipmentTags = (tags) => {
        let updatedExercise = {}
        updatedExercise = Object.assign(updatedExercise, customExercise);

        updatedExercise.required_eqipment = tags;
        setCustomExercise(updatedExercise)
    }

    const openMediaActionSheet = () =>  {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options: ["Take a Video", "Upload Media", "Cancel"],
            destructiveButtonIndex: 2,
            cancelButtonIndex: 2
          },
          buttonIndex => {
            if (buttonIndex === 0) {
                handleOnTakeVideo()
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
                 await LUPA_CONTROLLER_INSTANCE.saveProgramWorkoutGraphic(customExercise, currProgramUUID, 'VIDEO', uri)
                 .then(uploadedURI => {
                    handleCaptureNewMediaURI(uploadedURI, 'VIDEO', customExercise);
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

    return (

        <Modal visible={isVisible} contentContainerStyle={{width: Dimensions.get('window').width, height: Dimensions.get('window').height,  backgroundColor: 'white'}}>
            <Appbar.Header style={{backgroundColor: '#FFFFFF', elevation: 0}}>
                <Appbar.BackAction onPress={closeModal} />
                <Appbar.Content title="Create" titleStyle={{alignSelf: 'center', fontFamily: 'Avenir-Heavy', borderBottomColor: '#EEEEEE', borderBottomWidth: 1, fontWeight: 'bold', fontSize: 25}} />
            </Appbar.Header>
            <View style={{flex: 1 }}>
                <ScrollView>
                <TouchableOpacity onPress={openMediaActionSheet}>
                <View style={{flexDirection: 'row', height: 'auto', width: Dimensions.get('window').width, alignItems: 'center'}}>
                    <View style={{backgroundColor: '#23374d', width: Dimensions.get('window').width, height: 200, alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}>
                    {renderMedia()}
                    {
                    customExercise.workout_media.uri == "" ? 
                    <Caption 
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
                    </TouchableOpacity>

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
                            Select a muscle group
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

<TouchableOpacity onPress={() => setAddEquipmentModalVisible(true)}>
<View style={{flexDirection: 'row', alignItems: 'center'}}>
    <Feather1s name="plus" style={{paddingHorizontal: 5}} />
    <Caption>
        Add Required Equipment ({customExercise.required_eqipment.length})
    </Caption>
</View>
</TouchableOpacity>
                    
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
        
            <AddTagsModal 
        captureEquipmentTags={(tags) => captureEquipmentTags(tags)} 
        isVisible={addEquipmentModalVisible} 
        closeModal={() => setAddEquipmentModalVisible(false)} />
        
        </Modal>
    )
}

export default CreateCustomExercise;

const styles = StyleSheet.create({
   
})