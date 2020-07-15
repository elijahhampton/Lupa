import React, { useState, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Dimensions,
    Slider,
    TextInput,
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
    Button,
    IconButton,
    Chip,
    TextInput as PaperTextInput,
    Snackbar,
    ProgressBar,
    Divider,
} from 'react-native-paper';

import Icon from "react-native-feather1s";

import DateTimePicker from '@react-native-community/datetimepicker';

import RBSheet from 'react-native-raw-bottom-sheet';

import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import ProgramListComponent from '../../../component/ProgramListComponent'

import FeatherIcon from 'react-native-vector-icons/Feather';
import SelectProgramImage from './SelectProgramImage'
import { Input, CheckBox, Button as ElementsButton } from 'react-native-elements';
import LupaMapView from '../../../../user/modal/LupaMapView'
import { getLupaProgramInformationStructure } from '../../../../../controller/firebase/collection_structures';
import { throwIfAudioIsDisabled } from 'expo-av/build/Audio/AudioAvailability';

const months = ["January", "February", "March", "April",
  "May", "June", "July", "August", "September", "October",
  "November", "December"];

const numDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const { width } = Dimensions.get('window')
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

    let newTags = []
    newTags = newTags.concat(tags)
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
          <Text style={{padding: 10, fontSize: 20, fontWeight: 'bold'}}>
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
          <Button mode="text" color="#e53935" onPress={handleCancel}>
            <Text>
            Cancel
            </Text>
          </Button>
          <Button mode="text" color="#1E88E5" onPress={() => handleFinish()}>
            <Text>
              Done
            </Text>
          </Button>
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
    const [programDays, setProgramDays] = useState([])
    const [automatedMessageText, setAutomatedMessageText] = useState("")

    //visibility modifiers
    let [mapViewVisible, setMapViewVisibility] = useState(false);
    let [timePickerVisible, setTimePickerVisible] = useState(false);

    const [currIndex, setCurrIndex] = useState(0)

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
          automatedMessageText
         )

         //move to next page
        props.goToIndex(1)
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

    const addProgramDay = (day) => {
      let newProgramDayArr = []
      newProgramDayArr = newProgramDayArr.concat(programDays)
      newProgramDayArr.push(day)

      setProgramDays(newProgramDayArr)
    }

    const getViewDisplay = () => {
      switch(currIndex) {
        case 0:
          return (
            <>
            <ScrollView contentContainerStyle={{flexGrow: 2, justifyContent: 'space-between'}}>  
                            <View>
            <View style={{width: '100%', height: 'auto', marginLeft: 5, marginVertical: 50, padding: 10}} >
                <View>
                <Text style={styles.questionText}>
                    1. Give your program a title and description
            </Text>
            <Caption style={{color: '#152230'}}>
              Choose the days of which your program will require work.
            </Caption>
                </View>
                <TextInput  value={programName} onChangeText={text => setProgramName(text)} label="Title" placeholder="Program Title"  placeholderTextColor="#212121" style={styles.textInput} keyboardType="default" keyboardAppearance="light" returnKeyLabel="done" theme={{colors: { primary: 'rgb(30,136,229)'}}} />
                <TextInput value={programDescription} onChangeText={text => setProgramDescription(text)} label="Description" placeholder="Program Description" placeholderTextColor="#212121" style={styles.textInput}  enablesReturnKeyAutomatically={true} returnKeyLabel="done" keyboardType="default" theme={{colors: { primary: 'rgb(30,136,229)'}}} />
               {/* <TextInput value={numProgramSpots} onChangeText={text => setNumProgramSpots(text)} label="Spots" placeholder="# Spots"  mode="outlined" style={{margin: 3, width: 80, alignSelf: 'flex-start', }} keyboardAppearance="light" returnKeyLabel="done" returnKeyType="done" keyboardType="numeric" /> */}
            </View>
                            </View>


                            <Divider style={styles.divider} />

<View style={{marginHorizontal: 20, marginVertical: 15, marginVertical: 60}}>
            <Text style={styles.questionText}>
            2. Which days of the week will your program take place?
            </Text>
            <Caption style={{color: '#152230'}}>
              Choose the days of which your program will require work.
            </Caption>
            
            <View style={{alignSelf: 'center', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-evenly'}}>
                {
                  days.map(day => {
                    return (
                      <Chip key={day} mode="outlined" style={{elevation: programDays.includes(day) ? 3 : 0, margin: 5, backgroundColor: programDays.includes(day) ? '#1089ff' : '#FFFFFF', }} textStyle={{color: programDays.includes(day) ? 'white' : 'black'}} onPress={() => addProgramDay(day)}>
                          {day}
                      </Chip>
                    )
                  })
                }
            </View>
         </View>

         <Divider style={styles.divider} />

         <View style={{marginHorizontal: 20, marginVertical: 15, marginVertical: 60}}>
            <Text style={styles.questionText}>
              3. How many weeks will your program last?
            </Text>
            <Caption style={{color: '#152230'}}>
              Choose the days of which your program will require work.
            </Caption>
            <Slider step={1} value={programDuration} onValueChange={val => setProgramDuration(val)} thumbTintColor="#2196F3" minimumValue={1} maximumValue={15} value={programDuration} />
            <Text style={{alignSelf: 'center', padding: 3,color: '#BDBDBD', fontSize: 15}}>
                                {programDuration} / week
                                </Text>
         </View>

         <Divider style={styles.divider} />
         
<View style={{marginHorizontal: 20, marginVertical: 15, marginVertical: 60}}>
<Text style={styles.questionText}>
                                4. How much do you want to charge for this program?
                                </Text>
                                <Caption style={{color: '#152230'}}>
                                  Set a price for your program. <Text style={{color: 'rgb(229,57,53)'}}>
                                    You can change this later.
                                  </Text>
                                </Caption>
                               {/* <Text style={{padding: 3, color: '#0076d4', fontSize: 16}}>
                                $0 - $10.99
        </Text>*/}

    <Slider step={1} value={programPrice} onValueChange={val => setProgramPrice(val)} thumbTintColor="#2196F3" minimumValue={0} maximumValue={25}/>
    <Text style={{alignSelf: 'center', padding: 3,color: '#BDBDBD', fontSize: 15}}>
                                Current: ${programPrice}
                                </Text>
    <View>

    </View>
</View>

<Divider style={styles.divider} />

<View style={{padding: 10, marginVertical: 60}}>
<View>
                               
                            <Text style={styles.questionText}>
                                5. Set a location for your sessions
                            </Text>
                                <Caption style={{color: '#152230'}}>
                                  Where will your program sessions take place?
                                </Caption>
                            </View>
                        
                         <Button mode="outlined" color="#23374d" title={programLocation} containerStyle={{backgroundColor: '#23374d', width: '90%', alignSelf: 'center', margin: 5}}  onPress={() => openMapView()}>
                           <Text>
                             {programLocation}
                           </Text>
                         </Button>
</View>

<Divider style={styles.divider} />

            <View style={{padding: 10, marginVertical: 60}}>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              <Text style={styles.questionText}>
                                6. Make your program discoverable
                                </Text>
                
              </View>

              <View style={{width: '100%', flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center'}}>
              <TouchableHighlight onPress={showAddTagsModal}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MaterialIcon name="add" size={15}  color='#2196F3'/>
                <Caption style={{color: '#2196F3'}}>
                  Add Tag
                </Caption>
                </View> 
                </TouchableHighlight>
                {
                  
                  programTags.length == 0 ? 
                    null
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

            <View style={{marginVertical: 60, width: Dimensions.get('window').width, height: 'auto', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                <TouchableHighlight onPress={() => setProgramType('Single')} style={{margin: 10, borderRadius: 5, alignSelf: 'center'}}>
                <Surface style={[{borderRadius: 5, padding: 5, width: Dimensions.get('window').width / 2.5, height: 160, elevation: 3, alignItems: 'center', justifyContent: 'space-evenly'}, programType == 'Single' ? styles.selectedType : styles.unselectedType]}>
                <Icon
  name="user"
  size={50}
  color="#757575"
  thin={true}
/>

                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{ }}>
                            One on One
                        </Text>
                        <Caption style={{textAlign:'center'}}>
                            Host solo sessions with one Lupa user per subscription.
                        </Caption>
                    </View>
                </Surface>
                </TouchableHighlight>
            </View>

          
          <View>
          <Caption style={{alignSelf: 'center', color: '#152230'}}>
         Note: After a client buys your program they will receive an automatic message from you.  It is up to you to set session times with your client.
        </Caption>
        <View>
              <Text style={[styles.questionText, {fontSize: 15, paddingLeft: 10, paddingVertical: 5}]}>
                               Automated message upon Purchase:
                                </Text>

                                <PaperTextInput theme={{
                                  colors: {
                                    primary: '#374e66'
                                  }
                                }} 
                                mode="flat" 
                                multiline 
                                value={automatedMessageText} 
                                onChangeText={text => setAutomatedMessageText(text)} 
                                keyboardType="default" 
                                returnKeyType="done"
                                style={{width: width - 20, alignSelf: 'center'}}
                                />
                
              </View>
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

            </>
          )
        case 1:
          return <SelectProgramImage captureImage={props.captureImage} />
      }
    }

    getOptionsButton = () => {
      switch(currIndex) {
        case 0:
          return (
            <Button color="#374e66" style={{borderRadius: 2, height: 45, alignItems: 'center', justifyContent: 'center'}} onPress={currIndex == 0 ? () => setCurrIndex(2) : handleSaveProgramInformation} mode="contained">
              <Text>
                Next
              </Text>
            </Button>
          )
        case 1:
          return 
      }
    }

    return (
        <View style={styles.root}>
            <SafeAreaView />
            <ProgressBar progress={currIndex == 0 ? 1 : 0.5} color="#23374d" />
            { 
            getViewDisplay()
            }

<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', margin: 10}}>
<Button color="#23374d" onPress={() => props.handleCancelOnPress()}>
  <Text>
    Cancel
  </Text>
</Button>
  {
        currIndex == 0 ?
    <Button color="#374e66" style={{borderRadius: 2, height: 45, alignItems: 'center', justifyContent: 'center'}} onPress={() => setCurrIndex(2)} mode="contained">
    <Text>
    Next
  </Text>
  </Button>
  :
  <Button color="#374e66" style={{borderRadius: 2, height: 45, alignItems: 'center', justifyContent: 'center'}} onPress={handleSaveProgramInformation} mode="contained">
    <Text>
    Add workouts
  </Text>
  </Button>
  }
</View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 2
    },
    topView: {
        flex: 2,
        backgroundColor: '#FFFFFF',
        elevation: 15,
        justifyContent: 'space-between'
    },
    bottomView: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center'
    },
    divider: {
      width: Dimensions.get('window').width - 150, 
      alignSelf: 'center'
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
      },
      textInput: {
        margin: 3, 
        width: '90%', 
        alignSelf: 'flex-start', 
        marginVertical: 10, 
        borderBottomColor: '#212121', 
        borderBottomWidth: 1, 
        paddingVertical: 15
      },
      questionText: {
        fontFamily: "avenir-roman", 
        fontSize: 20, 
        fontWeight: 'bold', 
        color: '#374e66'
      }
})

export default ProgramInformation;