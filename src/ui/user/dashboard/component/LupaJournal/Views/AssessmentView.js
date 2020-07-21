
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
import { Paragraph, Caption, Divider, Surface, Appbar } from 'react-native-paper';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

function AssessmentView(props) {
    let [surfaceHeight, setSurfaceHeight] = useState(new Animated.Value(130))
    let [surfaceIsOpen, setSurfaceOpen] = useState(false)

    const navigation = useNavigation()

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
            <View style={{backgroundColor: 'white', flex: 1, width: Dimensions.get('window').width}}>
                <Appbar.Header statusBarHeight={false} style={{backgroundColor: '#FFFFFF', elevation: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <Appbar.BackAction onPress={() => navigation.pop()} />
                    <Appbar.Content title="Assessments" />
                </Appbar.Header>
                <View style={{backgroundColor: 'white', alignItems: 'center'}}>
                <Text style={{paddingHorizontal: 10, paddingVertical: 5, fontSize: 12 }}>
                    We use assessments to customize and enhance your experience while using Lupa
                </Text>
                </View>
                <Divider />
                <View style={{flex: 1}}>
                <ScrollView contentContainerStyle={{}}>

{
    lupaAssessments.map(assessment => {
        return (
            <>
            <AssessmentComponent 
                assessmentObjectIn={assessment}
                />
                <Divider />
                </>
        )
    })
}
</ScrollView>
                </View>
            </View>
        )
}

export default AssessmentView;