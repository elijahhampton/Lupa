import React, { useState } from 'react';

import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
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

import FeatherIcon from 'react-native-feather1s'
import { ScrollView } from 'react-native-gesture-handler';

function WorkoutDisplay({ workout, handleSuperSetOnPress, currDay, captureSuperSetIndex }) {
    const [scrollViewContainerHeight, setScrollViewContainerHeight] = useState(0)
    const [updateState, setUpdateState] = useState(false);
    const handleIncrementExcerciseSets = (workoutRef) => {
        workoutRef.workout_sets++;
        setUpdateState(!updateState)
    }

    const handleDecrementExerciseSets = (workoutRef) => {
        workoutRef.workout_sets--;
        setUpdateState(!updateState)
    }

    const handleIncrementExcerciseReps = (workoutRef) => {
        workoutRef.workout_reps++;
        setUpdateState(!updateState)
    }

    const handleDecrementExerciseReps = (workoutRef) => {
        workoutRef.workout_reps--;
        setUpdateState(!updateState)
    }

    const renderComponentDisplay = () => {
        switch(workout.superset.length == 0)
        {
            case true:
                return (
                    <View style={{flex: 1, width: Dimensions.get('window').width, alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}>
                                    <Surface style={{padding: 10, justifyContent: 'flex-start', backgroundColor: '#FFFFFF', elevation: 0, width: Dimensions.get('window').width,  flex: 1, alignSelf: 'center'}}>
                                     
                                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10}}>
                                        <Text style={{fontFamily: 'Avenir-Heavy', color: '#23374d', fontSize: 20}}>
                                          {workout.workout_name}
                                        </Text>
                                       
                                        </View>
        
                                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>

                                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                <View style={{marginHorizontal: 5}}>
                                                    <Text style={{color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light', fontSize: 15}}>
                                                        Sets
                                                    </Text>
                                                    <View style={{borderWidth: 1, borderRadius: 5, borderColor: 'rgb(102, 111, 120)', width: 90, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                                    <FeatherIcon name="chevron-up" size={30} onPress={() => handleIncrementExcerciseSets(workout)} />
                                                    <FeatherIcon name="chevron-down" size={30} onPress={() => handleDecrementExerciseSets(workout)}/>
                                                </View>
                                                <View style={{height: 70, backgroundColor: '#212121', width: 1}} />
                                                <View style={{paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center'}}>
                                                    <Text style={{fontSize: 30, fontFamily: 'Avenir-Light'}}>
                                                        {workout.workout_sets}
                                                    </Text>
                                                </View>
                                            </View>
                                                </View>
                                     
                                                <View style={{marginHorizontal: 5, }}>
                                                    <Text style={{color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light', fontSize: 15}}>
                                                        Reps
                                                    </Text>
                                                    <View style={{borderWidth: 1, borderRadius: 5, borderColor: 'rgb(102, 111, 120)', width: 90, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                                    <FeatherIcon name="chevron-up" size={30} onPress={() => handleIncrementExcerciseReps(workout)} />
                                                    <FeatherIcon name="chevron-down" size={30} onPress={() => handleDecrementExerciseReps(workout)} />
                                                </View>
                                                <View style={{height: 70, backgroundColor: '#212121', width: 1}} />
                                                <View style={{paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center'}}>
                                                    <Text style={{fontSize: 30, fontFamily: 'Avenir-Light'}}>
                                                        {workout.workout_reps}
                                                    </Text>
                                                </View>
                                            </View>
                                                </View>
                                            
                                            </View>


                                            <Surface style={{width: 80, height: 80, borderRadius: 80, elevation: 3, backgroundColor: '#212121'}}>

                                            </Surface>
                                            </View>

                                            <TouchableOpacity style={{position: 'absolute', bottom: 0, right: 0, margin: 12, }} onPress={handleSuperSetOnPress}>
                                            <View style={{borderWidth: 1, borderRadius: 5, borderColor: '#212121', padding: 10, borderWidth: 0.5, width: 90, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                <Text style={{fontFamily: 'Avenir-Medium'}}>
                                                    Super Set
                                                </Text>
                                                <FeatherIcon name="plus" size={15} />
                                            </View>  
                                            </TouchableOpacity>
                                                        

                                    </Surface>
                                    </View>
                )
            case false:
                return (
                    <View style={{flex: 1}}>
                        <ScrollView 
                        onLayout={event => setScrollViewContainerHeight(event.nativeEvent.layout.height)}
                                showsHorizontalScrollIndicator={false} 
                                pagingEnabled={true} 
                                decelerationRate={0} 
                                snapToAlignment='center' 
                                snapToInterval={scrollViewContainerHeight} 
                                horizontal={false} 
                                centerContent 
                                scrollEventThrottle={3}
                                contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}}
                        >
                        <View style={{flex: 1, height: scrollViewContainerHeight, width: Dimensions.get('window').width, alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}>
                                    <Surface style={{padding: 10, justifyContent: 'flex-start', backgroundColor: '#FFFFFF', elevation: 0, width: Dimensions.get('window').width,  flex: 1, alignSelf: 'center'}}>
                                     
                                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10}}>
                                        <Text style={{fontFamily: 'Avenir-Heavy', color: '#23374d', fontSize: 20}}>
                                          {workout.workout_name}
                                        </Text>
                                       
                                        </View>
        
                            
        

                                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>

                                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                <View style={{marginHorizontal: 5, }}>
                                                    <Text style={{color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light', fontSize: 15}}>
                                                        Sets
                                                    </Text>
                                                    <View style={{borderWidth: 1, borderRadius: 5, borderColor: 'rgb(102, 111, 120)', width: 90, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                                <FeatherIcon name="chevron-up" size={30} onPress={() => handleIncrementExcerciseSets(workout)} />
                                                    <FeatherIcon name="chevron-down" size={30} onPress={() => handleDecrementExerciseSets(workout)}/>
                                                </View>
                                                <View style={{height: 70, backgroundColor: '#212121', width: 1}} />
                                                <View style={{paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center'}}>
                                                    <Text style={{fontSize: 30, fontFamily: 'Avenir-Light'}}>
                                                        {workout.workout_sets}
                                                    </Text>
                                                </View>
                                            </View>
                                                </View>
                                     
                                                <View style={{marginHorizontal: 5, }}>
                                                    <Text style={{color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light', fontSize: 15}}>
                                                        Reps
                                                    </Text>
                                                    <View style={{borderWidth: 1, borderRadius: 5, borderColor: 'rgb(102, 111, 120)', width: 90, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                                <FeatherIcon name="chevron-up" size={30} onPress={() => handleIncrementExcerciseReps(workout)} />
                                                    <FeatherIcon name="chevron-down" size={30} onPress={() => handleDecrementExerciseReps(workout)} />
                                                </View>
                                                <View style={{height: 70, backgroundColor: '#212121', width: 1}} />
                                                <View style={{paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center'}}>
                                                    <Text style={{fontSize: 30, fontFamily: 'Avenir-Light'}}>
                                                        {workout.workout_reps}
                                                    </Text>
                                                </View>
                                            </View>
                                                </View>
                                            
                                            </View>


                                            <Surface style={{width: 70, height: 70, borderRadius: 5, elevation: 3, backgroundColor: '#212121'}}>

                                            </Surface>
                                            </View>

                                            <TouchableOpacity style={{position: 'absolute', bottom: 0, right: 0, margin: 12, }} onPress={handleSuperSetOnPress}>
                                            <View style={{borderWidth: 1, borderRadius: 5, borderColor: '#212121', padding: 10, borderWidth: 0.5, width: 90, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                <Text style={{fontFamily: 'Avenir-Medium', color: '#1089ff'}}>
                                                    Super Set
                                                </Text>
                                                <FeatherIcon name="plus" size={15} color="#1089ff" />
                                            </View>  
                                            </TouchableOpacity>
                                                        

                                    </Surface>
                                    </View>
                                    {
                                        workout.superset.map((superset, index, arr) => {
                                            return (
                                                <View style={{flex: 1, height: scrollViewContainerHeight, width: Dimensions.get('window').width, alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}>
                                    <Surface style={{padding: 10, justifyContent: 'flex-start', backgroundColor: '#FFFFFF', elevation: 0, width: Dimensions.get('window').width,  flex: 1, alignSelf: 'center'}}>
                                     
                                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10}}>
                                        <Text style={{fontFamily: 'Avenir-Heavy', color: '#23374d', fontSize: 20}}>
                                          {superset.workout_name}
                                        </Text>
                                       
                                        </View>
        
                            
        

                                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>

                                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                <View style={{marginHorizontal: 5, }}>
                                                    <Text style={{color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light', fontSize: 15}}>
                                                        Sets
                                                    </Text>
                                                    <View style={{borderWidth: 1, borderRadius: 5, borderColor: 'rgb(102, 111, 120)', width: 90, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                                <FeatherIcon name="chevron-up" size={30} onPress={() => handleIncrementExcerciseSets(superset)} />
                                                    <FeatherIcon name="chevron-down" size={30} onPress={() => handleDecrementExerciseSets(superset)}/>
                                                </View>
                                                <View style={{height: 70, backgroundColor: '#212121', width: 1}} />
                                                <View style={{paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center'}}>
                                                    <Text style={{fontSize: 30, fontFamily: 'Avenir-Light'}}>
                                                        {superset.workout_sets}
                                                    </Text>
                                                </View>
                                            </View>
                                                </View>
                                     
                                                <View style={{marginHorizontal: 5, }}>
                                                    <Text style={{color: 'rgb(102, 111, 120)', fontFamily: 'Avenir-Light', fontSize: 15}}>
                                                        Reps
                                                    </Text>
                                                    <View style={{borderWidth: 1, borderRadius: 5, borderColor: 'rgb(102, 111, 120)', width: 90, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                                <FeatherIcon name="chevron-up" size={30} onPress={() => handleIncrementExcerciseReps(superset)} />
                                                    <FeatherIcon name="chevron-down" size={30} onPress={() => handleDecrementExerciseReps(superset)} />
                                                </View>
                                                <View style={{height: 70, backgroundColor: '#212121', width: 1}} />
                                                <View style={{paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center'}}>
                                                    <Text style={{fontSize: 30, fontFamily: 'Avenir-Light'}}>
                                                        {superset.workout_reps}
                                                    </Text>
                                                </View>
                                            </View>
                                                </View>
                                            
                                            </View>


                                            <Surface style={{width: 70, height: 70, borderRadius: 5, elevation: 3, backgroundColor: '#212121'}}>

                                            </Surface>
                                            </View>

                                            <TouchableOpacity style={{position: 'absolute', bottom: 0, right: 0, margin: 12, }} onPress={handleSuperSetOnPress}>
                                            <View style={{borderWidth: 1, borderRadius: 5, borderColor: 'rgb(102, 111, 120)', padding: 10, borderWidth: 1, borderColor: '#212121', width: 90, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                                <Text style={{fontFamily: 'Avenir-Medium'}}>
                                                    Super Set
                                                </Text>
                                                <FeatherIcon name="plus" size={15} />
                                            </View>  
                                            </TouchableOpacity>
                                                        

                                    </Surface>
                                    </View>
                                            )
                                        })
                                    }
                        </ScrollView>
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
    }
})

export default WorkoutDisplay;