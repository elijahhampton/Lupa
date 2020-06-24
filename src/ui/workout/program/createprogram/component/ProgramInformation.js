import React, { useState, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux'


import ImagePicker from 'react-native-image-picker'

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Dimensions,
    Slider,
    Button,
    TouchableOpacity,
    TouchableHighlight,
    Picker,
    SafeAreaView,
    Modal,
    KeyboardAvoidingView,
} from 'react-native';

import {
    Surface,
    Modal as PaperModal,
    Caption,
    Button as PaperButton,
    IconButton,
    Chip,
    TextInput,
    Snackbar,
    Divider,
} from 'react-native-paper';

import Icon from "react-native-feather1s";

import DateTimePicker from '@react-native-community/datetimepicker';

import RBSheet from 'react-native-raw-bottom-sheet';

import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import ProgramListComponent from '../../../component/ProgramListComponent'

import FeatherIcon from 'react-native-vector-icons/Feather';
import { Input, CheckBox, Button as ElementsButton } from 'react-native-elements';
import LupaMapView from '../../../../user/modal/LupaMapView'
import { getLupaProgramInformationStructure } from '../../../../../controller/firebase/collection_structures';
import { throwIfAudioIsDisabled } from 'expo-av/build/Audio/AudioAvailability';

const months = ["January", "February", "March", "April",
  "May", "June", "July", "August", "September", "October",
  "November", "December"];

const numDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TimePicker = (props) => {
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
  
    const onChange = (event, selectedDate) => {
      const currentDate = selectedDate || date;
      setDate(currentDate);
    };

    return (
        <Modal visible={props.isVisible} presentationStyle="fullScreen" style={{alignItems: 'center', justifyContent: 'center'}}>
          <View style={{flex: 1, justifyContent: 'space-evenly'}}>
          <Text style={{alignSelf: 'center'}}>
              Some text
          </Text>
          
          <DateTimePicker
            testID="dateTimePicker"
            timeZoneOffsetInMinutes={0}
            value={new Date()}
            mode="time"
            display="default"
            onChange={onChange}
          />

          <Button title="Finish" onPress={() => props.closeModalMethod(date)} />
          </View>
      </Modal>
    );
  };

function AddTagsModal(props) {
  let [tags, setTags] = useState([]);
  let [inputValue, setInputValue] = useState('');

  handleAddTags = () => {
    if (tags.length == 10)
    {
      return;
    }

    const newTags = tags;
    newTags.push(inputValue);
    setTags(newTags);
  }

  handleFinish = () => {
    props.captureTags(tags);
    props.closeModalMethod()
  }

  handleCancel = () => {
    props.closeModalMethod()
  }
  return (

    <PaperModal contentContainerStyle={{borderRadius: 10, alignSelf: 'center', top: 120, position: 'absolute', backgroundColor: 'white', width: Dimensions.get('window').width - 30, height: 400}} visible={props.isVisible}>
          <KeyboardAvoidingView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          <Text style={{padding: 10, fontSize: 20, fontFamily: 'ARSMaquettePro-Bold'}}>
            Add your own tags
          </Text>
        </View>

        <View style={{flex: 3, flexWrap: 'wrap', flexDirection: 'row', margin: 10}}>
          {
            tags.map(tag => {
              return (
                <Chip style={{margin: 5, borderRadius: 5, width: 'auto'}} textStyle={{fontSize: 15}} theme={{
                  roundness: 0,
                }}>
                  {tag}
                </Chip>
              )
            })
          }
        </View>

        <View style={{justifyContent: 'center', borderRadius: 10, flex: 1.5, backgroundColor: '#E3F2FD'}}>
          <Input 
          placeholder='Try "cardio"'
          value={inputValue}
          inputStyle={{fontSize: 12, padding: 10,}}
          inputContainerStyle={{backgroundColor: 'white', borderWidth: 1, borderBottomWidth: 1, borderColor: '#BBDEFB'}}
          onSubmitEditing={() => handleAddTags()}
          onChangeText={text => setInputValue(text)}
          keyboardAppearance="light"
          keyboardType="default"
          returnKeyLabel="submit"
          returnKeyType="done"
           />

          <View style={{alignItems: 'flex-end', justifyContent: 'flex-end', flexDirection: 'row'}}>
          <PaperButton mode="text" color="#e53935" onPress={handleCancel}>
            <Text>
            Cancel
            </Text>
          </PaperButton>
          <PaperButton mode="text" color="#1E88E5" onPress={() => handleFinish()}>
            <Text>
              Done
            </Text>
          </PaperButton>
          </View>

        </View>
      </View>
      </KeyboardAvoidingView>
    </PaperModal>

  )
}

const MIN_TITLE_LENGTH = 8
const MAX_TITLE_LENGTH = 20

const MIN_DESCRIPTION_LENGTH = 15
const MAX_DESCRIPTION_LENGTH = 30

function ProgramInformation(props) {
  let [snackBarVisible, setSnackBarVisibility] = useState(false);
  let [rejectedReason, setRejectedReason] = useState(" ")

  
  const _onToggleSnackBar = () => setSnackBarVisibility(!snackBarVisible)

  const _onDismissSnackBar = () => setSnackBarVisibility(false)

  //redux useSelector hook
    const currUserState = useSelector(state => {
        return state.Users.currUserData
    });

    //program structure variables
    let [programImage, setProgramImage] = useState('');
    let [isProgramImageSet, setIsPromiseImageSet] = useState(false);
    let [programName, setProgramName] = useState('')
    let [programStartDate, setProgramStartDate] = useState(new Date())
    let [programEndDate, setProgramEndDate] = useState(new Date())
    let [programTime, setProgramTime] = useState(new Date(1598051730000));
    let [programTimeSet, setProgramTimeIsSet] = useState(false);
    let [programDuration, setProgramDuration] = useState(1);
    let [programDescription, setProgramDescription] = useState('')
    let [programLocation, setProgramLocation] = useState('Launch Map');
    let [programLocationData, setProgramLocationData] = useState('');
    let [numProgramSpots, setNumProgramSpots] = useState('')
    let [programPrice, setProgramPrice] = useState(7)
    let [programType, setProgramType]  = useState('Single');
    let [allowWaitlist, setAllowWaitlist] = useState(false);
    let [programTags, setProgramTags] = useState([]);
    let [addTagsModalIsOpen, setAddTagsModalIsOpen] = useState(false)

    //visibility modifiers
    let [mapViewVisible, setMapViewVisibility] = useState(false);
    let [timePickerVisible, setTimePickerVisible] = useState(false);

    //methods
    /**
     * 
     * @param {*} locationInformation 
     */

    const _chooseImageFromCameraRoll = async () => {
      
      ImagePicker.showImagePicker({}, async (response) => {
        if (!response.didCancel)
        {
          await props.captureImage(response.uri)
          await setProgramImage(response.uri)
          await setIsPromiseImageSet(true)
        }
    });

  }

   checkInputs = () => {
    if (programName.length < MIN_TITLE_LENGTH || programName.length > MAX_TITLE_LENGTH)
    {
      
      setRejectedReason("Program title elength")
      setSnackBarVisibility(true)
      return true;
    }

    if (programDescription.length < MIN_DESCRIPTION_LENGTH || programDescription.length > MAX_DESCRIPTION_LENGTH)
    {
      setRejectedReason("Program Deac")
      setSnackBarVisibility(true)
      return true;
    }

    if (programLocation == "Launch Map")
    {
      setRejectedReason("You must select a location for your program")
      setSnackBarVisibility(true)
      return true;
    }

    if (programTags.length == 0)
    {
      setRejectedReason("Please add atleast one tag into your program")
      setSnackBarVisibility(true)
      return true;
    }

    if (isProgramImageSet == false)
    {
      setRejectedReason("need to add na image")
      setSnackBarVisibility(true)
      return true;
    }

    return false;
  }

     const handleSaveProgramInformation = async () => {
          //check program values
        /*  let retVal = checkInputs()
          if (retVal)
          {
            return;
          }*/

         const imgV = programImage;
         await props.saveProgramInformation(
          programName,
          programDescription,
          numProgramSpots,
          programStartDate,
          programEndDate,
          programDuration,
          programTime,
          programPrice,
          programLocationData,
          programType,
          allowWaitlist,
          imgV,
          programTags,
         )

         //move to next page
        props.goToIndex()
     }

    /**
     * 
     * @param {*} locationInformation 
     */
    const onMapViewClose = (locationInformation) => {
        if (locationInformation == undefined) return;

        setProgramLocation(locationInformation.name);
        setProgramLocationData(locationInformation);

        closeMapView()
    }

    /**
     * 
     */
    const openMapView = () => {
        setMapViewVisibility(true)
    }

    /**
     * 
     */
    const closeMapView = () => {
        setMapViewVisibility(false)
    }

    /**
     * 
     * @param {*} startDate 
     */
    const captureStartDate = (startDate) => {
        setProgramStartDate(startDate);
    }

    /**
     * 
     * @param {*} endDate 
     */
    const captureEndDate = (endDate) => {
        setProgramEndDate(endDate)
    }

    /**
     * 
     * @param {*} time 
     */
    const captureTime = (time) => {
        setProgramTime(time);
    }

    /**
     * 
     * @param {*} time 
     */
    const handleCloseTimePicker = async (time) => {
        captureTime(time);
        await setTimePickerVisible(false);
    }

    const showAddTagsModal = () => {
      setAddTagsModalIsOpen(true);
    }

    const closeAddTagsModal = () => {
      setAddTagsModalIsOpen(false)
    }


    const captureTags = (tags) => {
      setProgramTags(tags);
    }

    return (
        <View style={styles.root}>
            <SafeAreaView />
        <ScrollView contentContainerStyle={{flexGrow: 2, justifyContent: 'space-between'}}>
                            <View style={{padding: 10}}>
                    <Text style={{fontSize: 15, padding: 10, fontFamily: 'ARSMaquettePro-Medium', color: '#BDBDBD'}}>
                        Name your program and select a program image, type, price, location
                    </Text>
                </View>

                <Surface style={{margin: 10, elevation: 10, borderRadius: 10, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width/ 1.5, height: 300}}>
                    {
                      isProgramImageSet == true ?
                      <Image source={{uri: programImage }} style={{width: '100%', height: '100%', borderRadius: 10}} />
                      :
                      <FeatherIcon name="plus-circle" size={60} color="rgb(174,174,178)" onPress={_chooseImageFromCameraRoll} />
                    }
                </Surface>
            
            <View style={{width: '100%', height: 'auto', marginLeft: 5, padding: 10}} >
                <TextInput  value={programName} onChangeText={text => setProgramName(text)} label="Title" placeholder="Program Title" mode="outlined"  style={{margin: 3, width: '90%', alignSelf: 'center'}} keyboardType="default" keyboardAppearance="light" returnKeyLabel="done" theme={{colors: { primary: 'rgb(30,136,229)'}}} />
                <TextInput value={programDescription} onChangeText={text => setProgramDescription(text)} label="Description" placeholder="Program Description"  mode="flat" multiline style={{height: 100, margin: 3, width: '90%', alignSelf: 'center', }} enablesReturnKeyAutomatically={true} returnKeyLabel="done" keyboardType="default" theme={{colors: { primary: 'rgb(30,136,229)'}}} />
               {/* <TextInput value={numProgramSpots} onChangeText={text => setNumProgramSpots(text)} label="Spots" placeholder="# Spots"  mode="outlined" style={{margin: 3, width: 80, alignSelf: 'flex-start', }} keyboardAppearance="light" returnKeyLabel="done" returnKeyType="done" keyboardType="numeric" /> */}
            </View>


          {/*  <View style={{padding: 10, marginVertical: 15}}>
            <Text style={{fontFamily: "avenir-roman", fontSize: 20}}>Select a start and end date</Text>
                <LupaCalendar setProgramStartDate={startDate => setProgramStartDate(startDate)} setProgramEndDate={endDate => setProgramEndDate(endDate)} />
            </View>
    */}

<Divider style={styles.divider} />

            <View style={{padding: 10, marginVertical: 15}}>
            <Text style={{fontFamily: "avenir-roman", fontSize: 20}}> How many sessions per week? </Text>
            <Caption>
              Use the slider to indicate the optimal amount of times your program should be performed per week.
            </Caption>
            <Slider step={1} value={programDuration} onValueChange={val => setProgramDuration(val)} thumbTintColor="#2196F3" minimumValue={1} maximumValue={15} value={programDuration} />
            <Text style={{alignSelf: 'center', padding: 3,color: '#BDBDBD', fontFamily: "ARSMaquettePro-Medium", fontSize: 15}}>
                                {programDuration} / week
                                </Text>
         </View>

         {
             /* show days to of the week to have it */
         }

         {/*

                      <View style={{padding: 10, marginVertical: 15}}>
        <Text style={{fontFamily: "avenir-roman", fontSize: 20}}>{programTime == '' ? 'Select a time' : 'Use selected time'}</Text>
                <Button title={setProgramTimeIsSet == true ? programTime.toString() : 'Set a time'} onPress={() => refRBSheet.current.open()} />
            </View>

         */}

<View style={{padding: 10, marginVertical: 15}}>
<Text style={{fontFamily: "avenir-roman", fontSize: 20}}>
                                Set a price 
                                </Text>
                                <Caption>
                                  Set a price for your program. <Text style={{color: 'rgb(229,57,53)'}}>
                                    You can change this later.
                                  </Text>
                                </Caption>
                               {/* <Text style={{padding: 3, color: '#0076d4', fontFamily: "ARSMaquettePro-Medium", fontSize: 16}}>
                                $0 - $10.99
        </Text>*/}

    <Slider step={1} value={programPrice} onValueChange={val => setProgramPrice(val)} thumbTintColor="#2196F3" minimumValue={0} maximumValue={25}/>
    <Text style={{alignSelf: 'center', padding: 3,color: '#BDBDBD', fontFamily: "ARSMaquettePro-Medium", fontSize: 15}}>
                                Current: ${programPrice}
                                </Text>
    <View>

    </View>
</View>

<Divider style={styles.divider} />

<View style={{padding: 10, marginVertical: 15}}>
<View>
                               
                            <Text style={{fontFamily: "avenir-roman", fontSize: 20}}>
                                Set a location
                                </Text>
                                <Caption>
                                  Where will your program sessions take place?
                                </Caption>
                            </View>
                         
                         {/*

                         <TouchableOpacity onPress={openMapView}>
                            <Surface style={{alignSelf: "center", margin: 10, elevation: 8, width: "85%", height: "auto", padding: 15, borderRadius: 15, alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
                                <View>
                                <Text style={{fontFamily: "avenir-roman", fontSize: 18}}>
                                    {programLocation}
                                </Text>
                                {
                                    programLocationData == '' ?
                                    null
                                    :
                                                                    <Text style={{fontFamily: "avenir-roman", fontSize: 15}}>
                                                                    {programLocationData.address}
                                                                </Text>
                                }
                                </View>
                            </Surface>
                            </TouchableOpacity>
                         
                         */}

                         <ElementsButton type="solid" title={programLocation} containerStyle={{width: '90%', alignSelf: 'center', margin: 5}}  onPress={() => openMapView()}/>
</View>

            <View style={{marginVertical: 15, width: Dimensions.get('window').width, height: 'auto', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                <TouchableHighlight onPress={() => setProgramType('Single')} style={{margin: 10, borderRadius: 5, alignSelf: 'center'}}>
                <Surface style={[{borderRadius: 5, padding: 5, width: Dimensions.get('window').width / 2.5, height: 160, elevation: 3, alignItems: 'center', justifyContent: 'space-evenly'}, programType == 'Single' ? styles.selectedType : styles.unselectedType]}>
                <Icon
  name="user"
  size={50}
  color="#757575"
  thin={true}
/>

                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{fontFamily: 'ARSMaquettePro-Medium'}}>
                            One on One
                        </Text>
                        <Caption style={{textAlign:'center'}}>
                            Host solo sessions with one Lupa user per subscription.
                        </Caption>
                    </View>
                </Surface>
                </TouchableHighlight>
                {/*
                <TouchableHighlight onPress={() => setProgramType('Group')} style={{margin: 10, borderRadius: 5}}>
                <Surface style={[{borderRadius: 5, padding: 5, width: Dimensions.get('window').width / 2.5, height: 160, elevation: 3,alignItems: 'center', justifyContent: 'space-evenly'}, programType == 'Group' ? styles.selectedType : styles.unselectedType]}>
                <Icon
  name="users"
  size={50}
  color="#757575"
  thin={true}
/>

                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{fontFamily: 'ARSMaquettePro-Medium'}}>
                            Group
                        </Text>
                        <Caption style={{textAlign:'center'}}>
                            Offer sessions to multiple Lupa users per subscription.
                        </Caption>
                    </View>
                </Surface>
                </TouchableHighlight>
                */}
            </View>

            <View style={{padding: 10, marginVertical: 15}}>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              <Text style={{fontFamily: "avenir-roman", fontSize: 20}}>
                                Make your program discoverable
                                </Text>
                
                <TouchableHighlight onPress={showAddTagsModal}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MaterialIcon name="add" size={15}  color='#2196F3'/>
                <Caption style={{color: '#2196F3'}}>
                  Add Tag
                </Caption>
                </View> 
                </TouchableHighlight>
              </View>

              <View style={{width: '100%', flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center'}}>
                {
                  programTags.length == 0 ? <Caption>
                    Add a tag
                  </Caption>
                  :
                  programTags.map(tag => {
                    return (
                      <Chip style={{margin: 3, width: 'auto', backgroundColor: '#2196F3'}} textStyle={{color: '#FFFFFF'}} mode="flat" color='#2196F3'>
                        {tag}
                      </Chip>
                    )
                  })
                }
              </View>
            </View>

            <Divider style={styles.divider} />


           {/* <CheckBox
  title='Allow users to join a waitlist until all spots are filled'
  checkedIcon='dot-circle-o'
  uncheckedIcon='circle-o'
  checked={allowWaitlist}
  containerStyle={{backgroundColor: '#F2F2F2'}}
  onPress={() => setAllowWaitlist(!allowWaitlist)}
           />*/}
<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
<Button title="Cancel" onPress={() => props.handleCancelOnPress()} />
<Button title="Design Program" onPress={handleSaveProgramInformation} />
</View>

<Snackbar
          visible={snackBarVisible}
          onDismiss={_onDismissSnackBar}
          action={{
            label: 'Okay',
            onPress: () => {
              setSnackBarVisibility(false)
              setRejectedReason("")
            },
          }}
        >
          {rejectedReason}
        </Snackbar>

        </ScrollView>

        <LupaMapView 
                            initialRegionLatitude={currUserState.location.latitude}
                            initialRegionLongitude={currUserState.location.longitude}
                            closeMapViewMethod={gymData => onMapViewClose(gymData)}
                            isVisible={mapViewVisible}
                        />


                        <SafeAreaView />


      <AddTagsModal isVisible={addTagsModalIsOpen} closeModalMethod={closeAddTagsModal} captureTags={(tags) => captureTags(tags)} />
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#F2F2F2',
    },
    topView: {
        flex: 2,
        backgroundColor: '#FFFFFF',
        elevation: 15,
        justifyContent: 'space-between'
    },
    bottomView: {
        flex: 1,
        backgroundColor: '#F2F2F2',
        alignItems: 'center',
        justifyContent: 'center'
    },
    divider: {
        margin: 8
    },
    container: {
        width: "100%",
        height: 320,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        color: 'white',
        margin: 10,
        backgroundColor: 'transparent'
      },
      selectedType: {
        backgroundColor: '#d4e5ff', 
        borderColor: '#BBDEFB', 
        borderWidth: 0.5
      },
      unselectedType: {
        backgroundColor: '#FFFFFF', 
        borderColor: 'transparent', 
        borderWidth: 0
      }
})

export default ProgramInformation;