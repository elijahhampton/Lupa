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


function WorkoutDisplay({ workout, handleSuperSetOnPress, currDay, captureSuperSetIndex }) {
    const [scrollViewContainerHeight, setScrollViewContainerHeight] = useState(0)
    const [updateState, forceUpdateState] = useState(false);

    const handleChangeRepsSliderValue = (workoutRef, value) => {
        workoutRef.workout_reps = value;
        forceUpdateState(!updateState)
    }

    const handleChangeSetsSliderValue  = (workoutRef, value) => {
        workoutRef.workout_sets = value;
        forceUpdateState(!updateState)
    }

    const renderComponentDisplay = () => {
        switch(workout.superset.length == 0)
        {
            case true:
                return (
                    <View style={{flex: 1, width: Dimensions.get('window').width, alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}>
                                    <Surface style={{justifyContent: 'space-evenly', backgroundColor: '#FFFFFF', elevation: 0, width: Dimensions.get('window').width,  flex: 1, alignSelf: 'center'}}>
                                     <View style={{flex: 1,}}>

                                        <View style={{paddingVertical: 5, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                        <Text style={{fontFamily: 'Avenir-Medium', color: '#23374d', fontSize: 20, padding: 10}}>
                                          {workout.workout_name}
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
        
                                        <View style={{alignItems: 'center', justifyContent: 'space-between'}}>

                                        <View style={{justifyContent: 'space-evenly', width: '100%'}}>

                <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                <View style={{flex: 1,alignItems: 'center', justifyContent: 'center'}}>
                   
                <Slider
                value={workout.workout_sets}
            style={styles.container}
            trackStyle={styles.track}
            thumbStyle={styles.thumb}
            minimumTrackTintColor='#31a4db'
            thumbTouchSize={{width: 50, height: 40}}
            onValueChange={value => handleChangeSetsSliderValue(workout, value)}
            minimumValue={0}
            maximumValue={15}
            step={1}
          />
           <Caption>
                        Sets ({workout.workout_sets})
                    </Caption>
                </View>

                <View style={{flex: 1,alignItems: 'center', justifyContent: 'center'}}>
                   
                <Slider
                value={workout.workout_reps}
            style={styles.container}
            trackStyle={styles.track}
            thumbStyle={styles.thumb}
            minimumTrackTintColor='#31a4db'
            thumbTouchSize={{width: 50, height: 40}}
            onValueChange={value => handleChangeRepsSliderValue(workout, value)}
            minimumValue={0}
            maximumValue={15}
            step={1}
          />
           <Caption>
                        Reps ({workout.workout_reps})
                    </Caption>
                </View>
                </View> 

                                            </View>


                
                                            </View>

                                            </View>

                                        
                                                        

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
                                    <Surface style={{justifyContent: 'space-evenly', backgroundColor: '#FFFFFF', elevation: 0, width: Dimensions.get('window').width,  flex: 1, alignSelf: 'center'}}>
                                    <View style={{flex: 1}}>

                               
                                    <View style={{paddingVertical: 5, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                        <Text style={{fontFamily: 'Avenir-Medium', color: '#23374d', fontSize: 20, padding: 10}}>
                                          {workout.workout_name}
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
        
                            
        

                                        <View style={{alignItems: 'center', justifyContent: 'space-between'}}>

<View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
<View style={{flex: 1,alignItems: 'center', justifyContent: 'center'}}>
                   
                   <Slider
                   value={workout.workout_sets}
               style={styles.container}
               trackStyle={styles.track}
               thumbStyle={styles.thumb}
               minimumTrackTintColor='#31a4db'
               thumbTouchSize={{width: 50, height: 40}}
               onValueChange={value => handleChangeSetsSliderValue(workout, value)}
               minimumValue={0}
               maximumValue={15}
               step={1}
             />
              <Caption>
                           Sets ({workout.workout_sets})
                       </Caption>
                   </View>
   
                   <View style={{flex: 1,alignItems: 'center', justifyContent: 'center'}}>
                      
                   <Slider
                   value={workout.workout_reps}
               style={styles.container}
               trackStyle={styles.track}
               thumbStyle={styles.thumb}
               minimumTrackTintColor='#31a4db'
               thumbTouchSize={{width: 50, height: 40}}
               onValueChange={value => handleChangeRepsSliderValue(workout, value)}
               minimumValue={0}
               maximumValue={15}
               step={1}
             />
              <Caption>
                           Reps ({workout.workout_reps})
                       </Caption>
                   </View>
    
    </View>



    </View>

    </View>
                                    </Surface>
                                    </View>
                                    {
                                        workout.superset.map((superset, index, arr) => {
                                            return (
                                                <View style={{flex: 1, height: scrollViewContainerHeight, width: Dimensions.get('window').width, alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}>
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
        
                            
        

                                        <View style={{alignItems: 'center', justifyContent: 'space-between'}}>

<View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
<View style={{flex: 1,alignItems: 'center', justifyContent: 'center'}}>
                   
                   <Slider
                   value={superset.workout_sets}
               style={styles.container}
               trackStyle={styles.track}
               thumbStyle={styles.thumb}
               minimumTrackTintColor='#31a4db'
               thumbTouchSize={{width: 50, height: 40}}
               onValueChange={value => handleChangeSetsSliderValue(superset, value)}
               minimumValue={0}
               maximumValue={15}
               step={1}
             />
              <Caption>
                           Sets ({superset.workout_sets})
                       </Caption>
                   </View>
   
                   <View style={{flex: 1,alignItems: 'center', justifyContent: 'center'}}>
                      
                   <Slider
                   value={superset.workout_reps}
               style={styles.container}
               trackStyle={styles.track}
               thumbStyle={styles.thumb}
               minimumTrackTintColor='#31a4db'
               thumbTouchSize={{width: 50, height: 40}}
               onValueChange={value => handleChangeRepsSliderValue(superset, value)}
               minimumValue={0}
               maximumValue={15}
               step={1}
             />
              <Caption>
                           Reps ({superset.workout_reps})
                       </Caption>
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