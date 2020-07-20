
import React, { useState } from 'react';

import {
    ScrollView,
    View,
    Text,
    Dimensions,
    Animated,
    TouchableWithoutFeedback,
    SafeAreaView,
} from 'react-native';
import AssessmentComponent from '../component/AssessmentComponent';
import { Constants } from 'react-native-unimodules'

import { connect, useSelector } from 'react-redux';
import { Paragraph, Caption, Divider, Surface } from 'react-native-paper';
import FeatherIcon from 'react-native-vector-icons/Feather';

function AssessmentView(props) {
    let [surfaceHeight, setSurfaceHeight] = useState(new Animated.Value(130))
    let [surfaceIsOpen, setSurfaceOpen] = useState(false)

    const lupaAssessments = useSelector(state => {
        return state.Assessments.generalAssessments
    })

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
            toValue: 122,
        }).start()
        setSurfaceOpen(false)
    }

        return (
            <SafeAreaView style={{flex: 1, width: Dimensions.get('window').width}}>
            <Surface 
            style={{alignSelf: 'center', padding: 15, backgroundColor: "#FFFFFF", width: '100%', borderRadius: 25, elevation: 0}}>
                <TouchableWithoutFeedback onPress={surfaceIsOpen == false ? openTab : closeTab}>
                                <View>
                                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}> 
                                    <Text style={{paddingVertical: 3, fontSize: 20 }}>
                    Assessments
                </Text>
                <FeatherIcon name={surfaceIsOpen == true ? "chevron-up" : "chevron-down"} size={20} />
                                    </View>
                <Text style={{paddingVertical: 3, fontSize: 12 }}>
                    We use assessments to customize and enhance your experience while using Lupa
                </Text>
                </View>
                                </TouchableWithoutFeedback>

                                <ScrollView contentContainerStyle={{height: surfaceIsOpen == true ? 'auto' : 0}}>

{
    lupaAssessments.map(assessment => {
        return (
            <AssessmentComponent 
                assessmentObjectIn={assessment}
                />
        )
    })
}
</ScrollView>
            </Surface>
            </SafeAreaView>
        )
}

export default AssessmentView;