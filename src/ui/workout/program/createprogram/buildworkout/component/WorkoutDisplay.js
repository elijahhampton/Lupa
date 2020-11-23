import React, { createRef, useEffect, useState } from 'react';

import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    ScrollView,
    StyleSheet,
    TextInput,
    SafeAreaView,
} from 'react-native'
 
import {
    Surface,
    Caption,
    Dialog,
    HelperText,
    Paragraph,
    Button,
} from 'react-native-paper';

import {
    Divider
} from 'react-native-elements'

import ThinFeatherIcon from 'react-native-feather1s'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { Video } from 'expo-av';
import Slider from "react-native-slider";
import { Pagination } from 'react-native-snap-carousel'

import {Picker} from '@react-native-community/picker';
import RBSheet from 'react-native-raw-bottom-sheet'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Feather1s from 'react-native-feather1s/src/Feather1s';
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

function handleMeasurement(exercise, tempo) {
    if (typeof(exercise) == 'undefined' || typeof(tempo) == 'undefined') {
        return;
    }

    exercise.workout_tempo = tempo;
} 

function WorkoutDisplay({ workout, handleExerciseOnPress, handleSuperSetOnPress, programDuration }) {
    const [updateState, forceUpdateState] = useState(false);

    const [currProgramWeek, setCurrProgramWeek] = useState(0)

    const [exerciseTempoError, setExerciseTempoError] = useState(false)

    const programWeekPicker = createRef();
    const restTimePickerRef = createRef();
    const tempoPickerRef = createRef();

    const [measurementAccessed, setAccessedMeasurement] = useState(workout)


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

    const handleChangeRepsSliderValue = (workoutRef, value) => {
        workoutRef.workout_reps = value;
        forceUpdateState(!updateState)
    }

    const handleChangeSetsSliderValue  = (workoutRef, value) => {
        workoutRef.workout_sets = value;
        forceUpdateState(!updateState)
    }

    const handleIncrementExcerciseSets = (workoutRef) => {
        workoutRef.workout_sets++;
        forceUpdateState(!updateState)
    }

    const handleDecrementExerciseSets = (workoutRef) => {
        workoutRef.workout_sets--;
        forceUpdateState(!updateState)
    }

    const handleIncrementExcerciseReps = (workoutRef) => {
        workoutRef.workout_reps++;
        forceUpdateState(!updateState)
    }

    const handleDecrementExerciseReps = (workoutRef) => {
        workoutRef.workout_reps--;
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

    const handleOnChangeRestTimeOneInputText  = (text, workoutRef) => {
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

    const handleOnChangeTempoInputOneText  = (text, workoutRef) => {
       setTempoInputOneText(text)
        workoutRef.workout_tempo = inputTempoOneText;
    }

    const handleOnChangeTempoInputTwoText = (text, workoutRef) => {
        setTempoInputTwoText(text)
        workoutRef.workout_tempo = inputTempoTwoText;
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
            closeOnPressMask={true}x
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
            <View style={{flex: 1}}>

                <View style={{flex: 1, justifyContent: 'space-evenly'}}>
                    <Dialog.Content>
                        <Paragraph>
                        Type in the tempo you wish to set for this exercise.
                        </Paragraph>
                        {
                            exerciseTempoError ?
<Text style={{ fontSize: 12, color: 'red'}}>
                            Tempo must be in the format: X-X-X
                        </Text>
                        :
                        null
                        }
                        
                    </Dialog.Content>
                <TextInput
                style={{alignSelf: 'center', fontSize: 60, borderWidth: 0.8 ,padding: 20, borderRadius: 15, borderColor: '#EEEEEE'}}
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

                <View style={{width: '100%'}}>
                <Button 
                mode="contained"  
                color="#1089ff" 
                style={{alignSelf: 'center', marginVertical: 10, elevation: 0}} 
                contentStyle={{height: 45, width: Dimensions.get('window').width - 20}} 
                onPress={handleOnSetTempo}
                theme={{roundness: 8}}
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
            dragFromTopOnly={true}

        >
            <View style={{flex: 1}}>
            <View style={{width: '100%'}}>
                <Button color="#1089ff" style={{alignSelf: 'flex-end'}} mode="text" onPress={closeRestTimePicker}>
                    <Text>
                        Done
                    </Text>
                </Button>
                </View>
              
            <Picker
selectedValue={pickedRestTime}
style={{height: '100%', width: '100%'}}
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

    const renderComponentDisplay = () => {
        
        switch(workout.superset.length == 0)
        {
            case true:
                return (
                    <> 
                   <View style={{marginLeft: 10,}}>
         <Text style={{fontSize: 15, fontFamily: 'Avenir-Black'}}>
                            {workout.workout_name}
                        </Text>
         <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                        <FeatherIcon name="plus" />
                          
                    <Text style={{paddingLeft: 10, paddingVertical: 5, color: '#1089ff', fontWeight: '800', fontFamily: 'Avenir-Medium'}} onPress={handleSuperSetOnPress}>
                      Add Superset
                  </Text>
                    </View>
        </View>
                
                    <View style={{flex: 1, marginHorizontal: 10, alignSelf: 'flex-start', alignItems: 'center', justifyContent: 'center'}}>
            

<View style={{flexDirection: 'row', alignItems: 'center'}}>


<Surface style={{width: 70, height: 50, alignSelf: 'center', borderRadius: 8, elevation: 0, backgroundColor: '#212121'}}>
        <Video shouldPlay={false} style={{width: '100%', height: '100%'}} resizeMode="stretch" source={require('../../../../../videos/pushuppreview.mov')} />
    </Surface>


<View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-evenly', height: 80, width: 'auto'}}>

        <View>
        <View style={{marginHorizontal: 5}}>
            <View style={{height: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <ThinFeatherIcon name="chevron-left" size={22} onPress={() => handleDecrementExerciseSets(workout)} />
        </View>

        <View style={{paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light', fontSize: 12}}>
                Sets ({workout.workout_sets})
            </Text>
        </View>
  
        <ThinFeatherIcon name="chevron-right" size={22} onPress={() => handleIncrementExcerciseSets(workout)}/>
    </View>
        </View>

        <View style={{marginHorizontal: 5}}>
            <View style={{height: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <ThinFeatherIcon name="chevron-left" size={22} onPress={() => handleDecrementExerciseReps(workout)} />
        </View>

        <View style={{paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light', fontSize: 12}}>
                Reps ({workout.workout_reps})
            </Text>
        </View>
  
        <ThinFeatherIcon name="chevron-right" size={22} onPress={() => handleIncrementExcerciseReps(workout)}/>
    </View>
        </View>
        </View>
        

        <View>
        <TouchableWithoutFeedback onPress={openRestTimePicker}>
        <Text style={{paddingVertical: 5, color: '#1089ff', fontFamily: 'Avenir-Light', fontSize: 12}}>
                Rest Time ({workout.workout_rest_time}s)
            </Text>
            </TouchableWithoutFeedback>
            
            <TouchableWithoutFeedback onPress={() => handleOnOpenTempoPicker(workout)}>
            <Text style={{paddingVertical: 5, color: '#1089ff', fontFamily: 'Avenir-Light', fontSize: 12}}>
                Tempo ({workout.workout_tempo})
            </Text>
            </TouchableWithoutFeedback>
        </View>

        
    
    </View>
                                    </View>  
          
            
                                    </View>
                                    <Divider style={{height: 10, backgroundColor: '#EEEEEE'}} />
                                    </>
                )
            case false:

                return (
                    
                    <View style={{flex: 1, alignItems: 'flex-start'}}>
         
         <View style={{marginLeft: 10,}}>
         <Text style={{fontSize: 15, fontFamily: 'Avenir-Black'}}>
                            {workout.workout_name}
                        </Text>
         <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                        <FeatherIcon name="plus" />
                          
                    <Text style={{paddingLeft: 10, paddingVertical: 5, color: '#1089ff', fontWeight: '800', fontFamily: 'Avenir-Medium'}} onPress={handleSuperSetOnPress}>
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
                                contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}}
                        >
                          <>
                  
                  <View style={{flex: 1, marginHorizontal: 10, alignSelf: 'flex-start', alignItems: 'center', justifyContent: 'center'}}>
          

<View style={{flexDirection: 'row', alignItems: 'center'}}>


<Surface style={{width: 70, height: 50, alignSelf: 'center', borderRadius: 8, elevation: 0, backgroundColor: '#212121'}}>
      <Video shouldPlay={false} style={{width: '100%', height: '100%'}} resizeMode="stretch" source={require('../../../../../videos/pushuppreview.mov')} />
  </Surface>


<View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-evenly', height: 80, width: 'auto'}}>

      <View>
      <View style={{marginHorizontal: 5}}>
          <View style={{height: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <ThinFeatherIcon name="chevron-left" size={22} onPress={() => handleDecrementExerciseSets(workout)} />
      </View>

      <View style={{paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light', fontSize: 12}}>
              Sets ({workout.workout_sets})
          </Text>
      </View>

      <ThinFeatherIcon name="chevron-right" size={22} onPress={() => handleIncrementExcerciseSets(workout)}/>
  </View>
      </View>

      <View style={{marginHorizontal: 5}}>
          <View style={{height: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <ThinFeatherIcon name="chevron-left" size={22} onPress={() => handleDecrementExerciseReps(workout)} />
      </View>

      <View style={{paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light', fontSize: 12}}>
              Reps ({workout.workout_reps})
          </Text>
      </View>

      <ThinFeatherIcon name="chevron-right" size={22} onPress={() => handleIncrementExcerciseReps(workout)}/>
  </View>
      </View>
      </View>
      

      <View>
      <TouchableWithoutFeedback onPress={openRestTimePicker}>
      <Text style={{paddingVertical: 5, color: '#1089ff', fontFamily: 'Avenir-Light', fontSize: 12}}>
              Rest Time ({workout.workout_rest_time}s)
          </Text>
          </TouchableWithoutFeedback>
          
          <TouchableWithoutFeedback onPress={() => handleOnOpenTempoPicker(workout)}>
          <Text style={{paddingVertical: 5, color: '#1089ff', fontFamily: 'Avenir-Light', fontSize: 12}}>
              Tempo ({workout.workout_tempo})
          </Text>
          </TouchableWithoutFeedback>
      </View>

      
  
  </View>
                                  </View>  
        
          
                                  </View>
                                  <Divider style={{height: 10, backgroundColor: '#EEEEEE'}} />
                                  
                                  </>
                                    {
                                        workout.superset.map(superset => {
                                            return (
                                                <>
                                          <View style={{flex: 1, marginHorizontal: 10, alignSelf: 'flex-start', alignItems: 'center', justifyContent: 'center'}}>
                                  
                      
                      <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      
                      
                      <Surface style={{width: 70, height: 50, alignSelf: 'center', borderRadius: 8, elevation: 0, backgroundColor: '#212121'}}>
                              <Video shouldPlay={false} style={{width: '100%', height: '100%'}} resizeMode="stretch" source={require('../../../../../videos/pushuppreview.mov')} />
                          </Surface>
                
                      
                      
                      <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-evenly', height: 80, width: 'auto'}}>
                      
                              <View style={{marginRight: 10}}>
                              <View style={{marginHorizontal: 5}}>
                                  <View style={{height: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                  <ThinFeatherIcon name="chevron-left" size={22} onPress={() => handleDecrementExerciseSets(superset)} />
                              </View>
                      
                              <View style={{paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center'}}>
                                  <Text style={{color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light', fontSize: 12}}>
                                      Sets ({superset.workout_sets})
                                  </Text>
                              </View>
                        
                              <ThinFeatherIcon name="chevron-right" size={22} onPress={() => handleIncrementExcerciseSets(superset)}/>
                          </View>
                              </View>
                      
                              <View style={{marginHorizontal: 5}}>
                                  <View style={{height: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                  <ThinFeatherIcon name="chevron-left" size={22} onPress={() => handleDecrementExerciseReps(superset)} />
                              </View>
                      
                              <View style={{paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center'}}>
                                  <Text style={{color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light', fontSize: 12}}>
                                      Reps ({superset.workout_reps})
                                  </Text>
                              </View>
                        
                              <ThinFeatherIcon name="chevron-right" size={22} onPress={() => handleIncrementExcerciseReps(superset)}/>
                          </View>
                              </View>
                              </View>
                              
                      
                              <View style={{marginLeft: 10}}>
                              <TouchableWithoutFeedback onPress={openRestTimePicker}>
                              <Text style={{paddingVertical: 5, color: '#1089ff', fontFamily: 'Avenir-Light', fontSize: 12}}>
                                      Rest Time ({superset.workout_rest_time}s)
                                  </Text>
                                  </TouchableWithoutFeedback>
                                  
                                  <TouchableWithoutFeedback onPress={() => handleOnOpenTempoPicker(superset)}>
                                  <Text style={{paddingVertical: 5, color: '#1089ff', fontFamily: 'Avenir-Light', fontSize: 12}}>
                                      Tempo ({superset.workout_tempo})
                                  </Text>
                                  </TouchableWithoutFeedback>
                              </View>
                      
                              
                          
                          </View>
                                                          </View>  
                                
                                  
                                                          </View>
                                                          </>
                                            )    
                                    })
                                                      
                                    }
                        </ScrollView>
                        <Divider style={{height: 10, backgroundColor: '#EEEEEE'}} />
                    </View>
                )
                default:
    
        }
    }

    renderProgramWeekPicker = () => {
        weeks = new Array(programDuration).fill(0)
        for (let i = 0; i < programDuration; i++) {
            weeks[i] = i
        }

        return (
            <RBSheet
                ref={programWeekPicker}
                height={250}
                dragFromTopOnly={true}
                closeOnDragDown={true}
                customStyles={{
                    wrapper: {

                    },
                    container: {
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 0
                    },
                    draggableIcon: {
                        backgroundColor: 'rgb(220, 220, 220)',
                    }
                }}
            >
                <View style={{flex: 1}}>
                    <View style={{width: '100%'}}>
                    <Button color="#1089ff" style={{alignSelf: 'flex-end'}} mode="text" onPress={closeProgramWeekPicker}>
                        <Text>
                            Done
                        </Text>
                    </Button>
                    </View>
                  
                    <Picker
        selectedValue={currProgramWeek}
        style={{height: '100%', width: '100%'}}
        onValueChange={(itemValue, itemIndex) => setCurrProgramWeek(itemValue)}>
            {
                weeks.map(weekNum => {
                    return <Picker.Item label={(weekNum + 1).toString()} value={weekNum} key={weekNum} />
                })
            }
      </Picker>
                </View>
            </RBSheet>
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
        shadowOffset: {width: 0, height: 0},
        shadowRadius: 2,
        shadowOpacity: 1,
      }
})

export default WorkoutDisplay;