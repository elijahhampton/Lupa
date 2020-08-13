import React from 'react';

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
    Divider,
} from 'react-native-paper';

import FeatherIcon from 'react-native-vector-icons/Feather'
import { ScrollView } from 'react-native-gesture-handler';
import { Video } from 'expo-av';

function WorkoutDisplay({ workout, openAddCueModal }) {

    const renderCue = () => {
        try {
            if (workout.workout_cue == "" || typeof(workout.workout_cue) == "undefined") {
                return "You haven't added any cues!"
            }

            return workout.workout_cue;
        } catch(error) {
            alert(error)
            return "Error loading cues"
        }
    }

    const renderSetScheme = () => {
        try {
            return workout.workout_sets;
        } catch(error) {
            alert(error)
            return "-"
        }
    }

    const renderRepScheme = () => {
        try {
            return workout.workout_reps;
        } catch(error) {
            alert(error)
            return "-"
        }
    }

    const renderAddedMedia = () => {
        try {
            if (typeof(workout.workout_media.uri) == "undefined") {
                return (
                    <View style={{paddingLeft: 20, paddingVertical: 5}}>
                                            <Caption>
                                                Any media you add will appear here
                                            </Caption>
                    </View>
                )
            }


            switch(workout.workout_media.media_type) {
                case 'VIDEO':
                    return (
                        <Surface style={{alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 8, margin: 8}}>
                            <Video resizeMode="cover" style={{width: '100%', height: '100%', borderRadius: 8}} source={{uri: workout.workout_media.uri}} />
                    </Surface>
                    )
                case 'IMAGE':
                    return (
                        <Surface style={{alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 8, margin: 8}}>
                            <Image resizeMethod="scale" resizeMode="cover" style={{width: '100%', height: '100%', borderRadius: 8}} />
                    </Surface>
                    )
                default:
                    return (
                        <Surface style={{alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 8, margin: 8}}>
                        <FeatherIcon name="image" color="#23374d" />
                    </Surface>
                    )
            }

        } catch(error) {
            alert(error)
            return (
                <View style={{paddingLeft: 20, paddingVertical: 5}}>
                    <Caption>
                        Any media you add will appear here
                    </Caption>
                </View>
            )
        }
    }


    return (
        <View style={{width: Dimensions.get('window').width, alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}>
                                    <Surface style={{justifyContent: 'space-evenly', backgroundColor: '#FFFFFF', elevation: 0, width: Dimensions.get('window').width - 50,  alignSelf: 'center', borderRadius: 12}}>
                                        {renderAddedMedia()}
                                        <Divider />
                                        <View style={{ justifyContent: 'space-evenly'}}>
                                        <View style={{paddingVertical: 10, paddingHorizontal: 20}}>
                                        <Text style={{fontFamily: 'Avenir-Heavy', color: '#23374d', fontSize: 20}}>
                                          {workout.workout_name}
                                        </Text>
                                        <Text style={{fontSize: 11}}>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
                                        </Text>
                                        </View>
        
                                        <View style={{paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', width: '100%', paddingVertical: 10}}>
                                           
                                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <View style={{alignItems: 'center'}}>
                                                <Text style={{marginHorizontal: 10, color: 'rgb(174,189, 207)', fontSize: 13, fontFamily: 'Avenir-Heavy'}}>
                                                    Sets
                                                </Text>
                                                <Text style={{color: '#23374d', fontWeight: 'bold', fontSize: 15}}>
                                                    {renderSetScheme()}
                                                </Text>
                                            </View>
        
                                            <View style={{alignItems: 'center'}}>
                                                <Text style={{marginHorizontal: 10, color: 'rgb(174,189, 207)', fontSize: 13, fontFamily: 'Avenir-Heavy'}}>
                                                    Reps
                                                </Text>
                                                <Text style={{color: '#23374d', fontWeight: 'bold', fontSize: 15}}>
                                                    {renderRepScheme()}
                                                </Text>
                                            </View>
                                            </View>
                                        </View>
                                        </View>
        
                                 <Divider style={{width: Dimensions.get('window').width - 50, alignSelf: 'center'}} />
                                        <View style={{paddingVertical: 10, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20}}>
                                            <Caption numberOfLines={1} ellipsizeMode="tail"> 
                                                {renderCue()}
                                            </Caption>
                                        </View>                          

                                    </Surface>
                                    </View>
    )
}

export default WorkoutDisplay;