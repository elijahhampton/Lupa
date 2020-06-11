import React, { useEffect, useState } from 'react';

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    Animated,
    TouchableWithoutFeedback,
} from 'react-native';

import {
    Chip,
    Dialog,
    Portal,
    Divider,
    Surface,
} from 'react-native-paper';

import FeatherIcon from 'react-native-vector-icons/Feather';

function WorkoutLog(props) {
    let [surfaceHeight, setSurfaceHeight] = useState(new Animated.Value(130))
    let [surfaceIsOpen, setSurfaceOpen] = useState(false)

    const openTab  = () => {
        Animated.timing(surfaceHeight, {
            duration: 300,
            toValue: 350,
        }).start()
        setSurfaceOpen(true)
    }

    const closeTab = () => {
        Animated.timing(surfaceHeight, {
            duration: 300,
            toValue: 130,
        }).start()
        setSurfaceOpen(false)
    }


    return (
        <Animated.View style={{height: surfaceHeight, width: Dimensions.get('window').width - 10}}>
        <Surface style={{alignSelf: 'center', margin: 15, padding: 15, backgroundColor: "#FFFFFF", width: '95%', borderRadius: 25, elevation: 0}}>
                    <ScrollView>
                    <TouchableWithoutFeedback onPress={surfaceIsOpen == false ? openTab : closeTab}>
                            <View>
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Text style={{paddingVertical: 3, fontSize: 20, fontFamily: 'HelveticaNeueLight'}}>
                    Workout Log
                </Text>
                <FeatherIcon name={surfaceIsOpen == true ? "chevron-up" : "chevron-down"} size={20}/>
                </View>
                <Text style={{paddingVertical: 3, fontSize: 12, fontFamily: 'HelveticaNeueLight'}}>
                   Keep track of your previous workouts on or off the Lupa app
                </Text>
                </View>
                </TouchableWithoutFeedback>
                
            </ScrollView>
                        
                    </Surface>
                    </Animated.View>
    )
}

const styles = StyleSheet.create({
    dialog: {
        width: Dimensions.get('window').width - 20,
        height: '50%',
        alignSelf: 'center',
        padding: 5,
    },
    dialogSectionLabelText: {
        fontFamily: 'HelveticaNeueMedium',
        fontSize: 20
    },  
    chipStyle: {
        alignSelf: 'flex-end', 
        backgroundColor: 'rgba(227,242,253 ,1)', 
        width: '30%', 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    chipTextStyle: {
        fontFamily: 'HelveticaNeueLight'
    },
    footerComponentContainer: {
        width: Dimensions.get('window').width, 
        backgroundColor: '#FFFFFF', 
        padding: 10
    },
    headerComponentContainer: {
        padding: 5, 
        backgroundColor: '#FFFFFF'
    },
    headerText: {
        color: '#212121', fontFamily: 'HelveticaNeueLight', 
        fontSize: 18, 
        paddingVertical: 5, 
        textAlign: 'center'
    },
    headerSubtext: {
        paddingVertical:  5, 
        fontSize: 12
    },
    headerComponentContainerText: {
        alignItems: 'flex-start', 
        width: '100%'
    }
})

export default WorkoutLog;