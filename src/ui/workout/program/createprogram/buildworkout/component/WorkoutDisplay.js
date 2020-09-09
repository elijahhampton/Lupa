import React, { useState } from 'react';

import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    ScrollView,
    StyleSheet,
} from 'react-native'

import {
    Surface,
    Caption,
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


function WorkoutDisplay({ workout, handleSuperSetOnPress, currDay, captureSuperSetIndex }) {
    const [updateState, forceUpdateState] = useState(false);

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

    const renderComponentDisplay = () => {
        switch(workout.superset.length == 0)
        {
            case true:
                return (
                    <>
                    <View style={{flex: 1, height: 380, width: Dimensions.get('window').width, alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}>
                                    <Surface style={{justifyContent: 'space-evenly', backgroundColor: '#FFFFFF', elevation: 0, width: Dimensions.get('window').width,  flex: 1, alignSelf: 'center'}}>
                                     <View style={{flex: 1,}}>

                                        <View style={{paddingVertical: 5, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                        <Text style={{fontFamily: 'Avenir-Medium', color: '#23374d', fontSize: 20, padding: 10}}>
                                          {workout.workout_name}
                                        </Text>

                                    
                                        </View>

                                        <Surface style={{width: '100%', height: '60%', alignSelf: 'center', borderRadius: 8, elevation: 0, backgroundColor: '#212121'}}>
                                                <Video shouldPlay={true} style={{width: '100%', height: '100%'}} resizeMode="stretch" source={require('../../../../../videos/pushuppreview.mov')} />
                                            </Surface>
        
                                 
                                            <View style={{marginVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>

<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%'}}>
        <View style={{marginHorizontal: 5}}>
            <Text style={{color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light', fontSize: 15}}>
                Sets
            </Text>
            <View style={{height: 50, borderWidth: 1, borderRadius: 5, borderColor: 'rgb(102, 111, 120)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <ThinFeatherIcon name="chevron-left" size={30} onPress={() => handleDecrementExerciseSets(workout)} />
        </View>
        <View style={{height: 50, backgroundColor: '#212121', width: 1}} />
        <View style={{paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontSize: 30, fontFamily: 'Avenir-Light'}}>
                {workout.workout_sets}
            </Text>
        </View>
        <View style={{height: 50, backgroundColor: '#212121', width: 1}} />
        <ThinFeatherIcon name="chevron-right" size={30} onPress={() => handleIncrementExcerciseSets(workout)}/>
    </View>
        </View>

        <View style={{marginHorizontal: 5}}>
            <Text style={{color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light', fontSize: 15}}>
                Reps
            </Text>
            <View style={{height: 50, borderWidth: 1, borderRadius: 5, borderColor: 'rgb(102, 111, 120)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <ThinFeatherIcon name="chevron-left" size={30} onPress={() => handleDecrementExerciseReps(workout)} />
        </View>
        <View style={{height: 50, backgroundColor: '#212121', width: 1}} />
        <View style={{paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontSize: 30, fontFamily: 'Avenir-Light'}}>
                {workout.workout_reps}
            </Text>
        </View>
        <View style={{height: 50, backgroundColor: '#212121', width: 1}} />
        <ThinFeatherIcon name="chevron-right" size={30} onPress={() => handleIncrementExcerciseReps(workout)}/>
    </View>
        </View>
    
    </View>
    </View>     

                                            </View>

                                        
                                                        

                                    </Surface>
                                    </View>
                                    <Divider style={{height: 10, backgroundColor: '#EEEEEE'}} />
                                    </>
                )
            case false:

                return (
                    <View style={{flex: 1}}>
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
                        <View style={{flex: 1, height: 300, width: Dimensions.get('window').width, alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}>
                                    <Surface style={{justifyContent: 'space-evenly', backgroundColor: '#FFFFFF', elevation: 0, width: Dimensions.get('window').width,  flex: 1, alignSelf: 'center'}}>
                                    <View style={{flex: 1}}>

                               
                                    <View style={{paddingVertical: 5, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                        <Text style={{fontFamily: 'Avenir-Medium', color: '#23374d', fontSize: 20, padding: 10}}>
                                          {workout.workout_name}
                                        </Text>

                                        </View>

                                        <Surface style={{width: '100%', height: '60%', alignSelf: 'center', borderRadius: 8, elevation: 0, backgroundColor: '#212121'}}>
                                                <Video shouldPlay={true} style={{width: '100%', height: '100%'}} resizeMode="stretch" source={require('../../../../../videos/pushuppreview.mov')} />
                                            </Surface>
        
                            
        

                                            <View style={{marginVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>

<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%'}}>
        <View style={{marginHorizontal: 5}}>
            <Text style={{color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light', fontSize: 15}}>
                Sets
            </Text>
            <View style={{height: 50, borderWidth: 1, borderRadius: 5, borderColor: 'rgb(102, 111, 120)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <ThinFeatherIcon name="chevron-left" size={30} onPress={() => handleDecrementExerciseSets(workout)} />
        </View>
        <View style={{height: 50, backgroundColor: '#212121', width: 1}} />
        <View style={{paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontSize: 30, fontFamily: 'Avenir-Light'}}>
                {workout.workout_sets}
            </Text>
        </View>
        <View style={{height: 50, backgroundColor: '#212121', width: 1}} />
        <ThinFeatherIcon name="chevron-right" size={30} onPress={() => handleIncrementExcerciseSets(workout)}/>
    </View>
        </View>

        <View style={{marginHorizontal: 5}}>
            <Text style={{color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light', fontSize: 15}}>
                Reps
            </Text>
            <View style={{height: 50, borderWidth: 1, borderRadius: 5, borderColor: 'rgb(102, 111, 120)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <ThinFeatherIcon name="chevron-left" size={30} onPress={() => handleDecrementExerciseReps(workout)} />
        </View>
        <View style={{height: 50, backgroundColor: '#212121', width: 1}} />
        <View style={{paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontSize: 30, fontFamily: 'Avenir-Light'}}>
                {workout.workout_reps}
            </Text>
        </View>
        <View style={{height: 50, backgroundColor: '#212121', width: 1}} />
        <ThinFeatherIcon name="chevron-right" size={30} onPress={() => handleIncrementExcerciseReps(workout)}/>
    </View>
        </View>
    
    </View>
    </View>     

    </View>
                                    </Surface>
                                    </View>
                                    {
                                        workout.superset.map((superset, index, arr) => {
                                            return (
                                                <View style={{flex: 1, height: 300, width: Dimensions.get('window').width, alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}>
                                    <Surface style={{justifyContent: 'space-evenly', backgroundColor: '#FFFFFF', elevation: 0, width: Dimensions.get('window').width,  flex: 1, alignSelf: 'center'}}>
                                                <View style={{flex: 1}}>

                                      
                                    <View style={{paddingVertical: 5, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                        <Text style={{fontFamily: 'Avenir-Medium', color: '#23374d', fontSize: 20, padding: 10}}>
                                          {superset.workout_name}
                                        </Text>

                                        <TouchableOpacity style={{margin: 12, alignSelf: 'flex-end'}} onPress={handleSuperSetOnPress}>
                                            <View style={{borderColor: '#212121', padding: 5, width: 90, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                <Text style={{fontFamily: 'Avenir-Medium', fontSize: 12, color: '#1089ff'}}>
                                                    Super Set
                                                </Text>
                                                <FeatherIcon name="plus" size={15} color='#1089ff' />
                                            </View>  
                                            </TouchableOpacity>
                                        </View>

                                        <Surface style={{width: '100%', height: '60%', alignSelf: 'center', borderRadius: 8, elevation: 0, backgroundColor: '#212121'}}>
                                                <Video shouldPlay={true} style={{width: '100%', height: '100%'}} resizeMode="stretch" source={require('../../../../../videos/pushuppreview.mov')} />
                                            </Surface>
        
                            
        

                                            <View style={{marginVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>

<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%'}}>
        <View style={{marginHorizontal: 5}}>
            <Text style={{color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light', fontSize: 15}}>
                Sets
            </Text>
            <View style={{height: 50, borderWidth: 1, borderRadius: 5, borderColor: 'rgb(102, 111, 120)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <ThinFeatherIcon name="chevron-left" size={30} onPress={() => handleDecrementExerciseSets(superset)} />
        </View>
        <View style={{height: 50, backgroundColor: '#212121', width: 1}} />
        <View style={{paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontSize: 30, fontFamily: 'Avenir-Light'}}>
                {superset.workout_sets}
            </Text>
        </View>
        <View style={{height: 50, backgroundColor: '#212121', width: 1}} />
        <ThinFeatherIcon name="chevron-right" size={30} onPress={() => handleIncrementExcerciseSets(superset)}/>
    </View>
        </View>

        <View style={{marginHorizontal: 5}}>
            <Text style={{color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light', fontSize: 15}}>
                Reps
            </Text>
            <View style={{height: 50, borderWidth: 1, borderRadius: 5, borderColor: 'rgb(102, 111, 120)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <ThinFeatherIcon name="chevron-left" size={30} onPress={() => handleDecrementExerciseReps(superset)} />
        </View>
        <View style={{height: 50, backgroundColor: '#212121', width: 1}} />
        <View style={{paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontSize: 30, fontFamily: 'Avenir-Light'}}>
                {superset.workout_reps}
            </Text>
        </View>
        <View style={{height: 50, backgroundColor: '#212121', width: 1}} />
        <ThinFeatherIcon name="chevron-right" size={30} onPress={() => handleIncrementExcerciseReps(superset)}/>
    </View>
        </View>
    
    </View>
    </View>             
    </View>   

                                    </Surface>
                                    </View>
                                            )
                                        })
                                    }
                        </ScrollView>
                        <Pagination dotsLength={5} />
                        <Divider style={{height: 10, backgroundColor: '#EEEEEE'}} />
                    </View>
                )
                default:
                    return <Text>
                        Huuh
                    </Text>
        }
    }


    return (
        renderComponentDisplay()
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