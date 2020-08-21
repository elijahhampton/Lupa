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
    Button,
    Divider,
} from 'react-native-paper';

import FeatherIcon from 'react-native-vector-icons/Feather'
import { ScrollView } from 'react-native-gesture-handler';

function WorkoutDisplay({ workout, showContentSection }) {

    const renderCue = () => {
        try {
            if (workout.workout_cue == "" || typeof(workout.workout_cue) == "undefined") {
                return (
                    <Text style={{color: '#e53935'}}>
                <FeatherIcon name="message-circle" style={{paddingHorizontal: 5}} />
                    You haven't added any cues
             </Text>
                )
            }

            return (
                <Text style={{color: '#4CAF50'}}>
                <FeatherIcon name="1 cue added" style={{paddingHorizontal: 5}} />
                    You haven't added any cues
             </Text>
            )
        } catch(error) {
            alert(error)
            return (
                <Text style={{color: '#e53935'}}>
                <FeatherIcon name="message-circle" style={{paddingHorizontal: 5, margin: 10}} />
                    Error loading cues
             </Text>
            )
        }
    }

    const renderSetScheme = () => {
        try {
            if (workout.workout_sets === 0) {
                return (
                    <Text style={{color: '#e53935'}}>
                    <FeatherIcon name="activity" style={{paddingHorizontal: 5}} />
                    This workout is set to {workout.workout_sets} sets.
                 </Text>
                )
            }

            return (
                <Text style={{color: '#4CAF50'}}>
                <FeatherIcon name="activity" style={{paddingHorizontal: 5}} />
                This workout is set to {workout.workout_sets} sets.
             </Text>
            )
        } catch(error) {
            alert(error)
            return (
                <Text style={{color: '#4CAF50'}}>
                <FeatherIcon name="activity" style={{paddingHorizontal: 5}} />
                Error displaying set scheme
             </Text>
            )
        }
    }

    const renderRepScheme = () => {
        try {
            if (workout.workout_reps == 0) {
                return (
                    <Text style={{color: '#e53935'}}>
                <FeatherIcon name="activity" style={{paddingHorizontal: 5}} />
                This workout is set to {workout.workout_reps} reps.
             </Text>
                )
            }
            
            
            return (
                <Text style={{color: '#4CAF50'}}>
                <FeatherIcon name="activity" style={{paddingHorizontal: 5}} />
                This workout is set to {workout.workout_reps} reps.
             </Text>
            )
        } catch(error) {
            alert(error)
            return (
                <Text style={{color: '#e53935'}}>
                <FeatherIcon name="activity" style={{paddingHorizontal: 5}} />
                    Error displaying rep scheme
             </Text>
            )
        }
    }

    const renderAddedMedia = () => {
        try {
            if (typeof(workout.workout_media.uri) == "undefined" || workout.workout_media.uri == "") {
                return (
                    <Text style={{color: '#e53935'}}>
                    <FeatherIcon name="film" style={{paddingHorizontal: 5}} />
                     You haven't added any media.
                 </Text>
                )
            }


            switch(workout.workout_media.media_type) {
                case 'VIDEO':
                    return (
                        <Text style={{color: '#4CAF50'}}>
                           <FeatherIcon name="video" style={{paddingHorizontal: 5}} />
                            1 video added
                        </Text>
                    )
                case 'IMAGE':
                    return (
                        <Text style={{color: '#4CAF50'}}>
                           <FeatherIcon name="image" style={{paddingHorizontal: 5}} />
                            1 image added
                        </Text>
                    )
                default:
                    return (
                        <Text style={{color: '#e53935'}}>
                           <FeatherIcon name="x-circle" style={{paddingHorizontal: 5}} />
                            Can't detect media type
                        </Text>
                    )
            }

        } catch(error) {
            alert(error)
            return (
                <Text style={{color: '#e53935'}}>
                           <FeatherIcon name="x-circle" style={{paddingHorizontal: 5}} />
                            Error displaying media
                        </Text>
            )
        }
    }


    return (
        <View style={{flex: 1, width: Dimensions.get('window').width, alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}>
                                    <Surface style={{justifyContent: 'flex-start', backgroundColor: '#FFFFFF', elevation: 0, width: Dimensions.get('window').width,  flex: 1, alignSelf: 'center'}}>
                                     
                                        <View style={{ justifyContent: 'space-evenly'}}>
                                        <View style={{paddingVertical: 10, paddingHorizontal: 20}}>
                                        <Text style={{fontFamily: 'Avenir-Heavy', color: '#23374d', fontSize: 20}}>
                                          {workout.workout_name}
                                        </Text>
                                        <Text style={{fontSize: 11}}>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
                                        </Text>
                                        </View>
        
                            
                                        </View>
        
                               {
                                   showContentSection === true ? 
                                   <>
                                 <Divider style={{width: Dimensions.get('window').width - 50, alignSelf: 'center'}} />
                                        <View style={{ width: '100%', paddingHorizontal: 10, justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center',  }}>
                                           <Button uppercase={false} mode="text" color="#1089ff" style={{alignSelf: 'flex-end'}}>
                                                <Text style={{fontSize: 15, fontWeight: '400', fontFamily: 'avenir'}}>
                                                    Preview
                                                </Text>
                                           </Button>
                                        </View>     

                                        <View style={{paddingHorizontal: 20}}>
                                            <ScrollView>
                                                <Caption>
                                                {renderCue()}
                                                </Caption>

                                                <Caption>
                                                {renderAddedMedia()}
                                                </Caption>

                                                <Caption>
                                                {renderRepScheme()}
                                                </Caption>

                                                <Caption>
                                                {renderSetScheme()}
                                                </Caption>

                                               
                                                         
                                            </ScrollView>
    </View>   
    </>
    :
    null
    }                  

                                    </Surface>
                                    </View>
    )
}

const styles = StyleSheet.create({
    captionNotifier: {
        color: '#e53935',
        fontSize: 12
    }
})

export default WorkoutDisplay;