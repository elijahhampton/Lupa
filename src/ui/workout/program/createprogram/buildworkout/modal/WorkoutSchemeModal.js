import React, { useState } from 'react';

import {
    Modal,
    View,
    Text,
    StyleSheet,
    Slider,
    Dimensions,
} from 'react-native';

import {
    Caption,
    Divider,
    Appbar,
} from 'react-native-paper';

import FeatherIcon from 'react-native-vector-icons/Feather'

function WorkoutSchemeModal({ isVisible, captureValues, workout, closeModal}) {
    const [repSliderValue, setRepSliderValue] = useState(0);
    const [setSliderValue, setSetSliderValue] = useState(0);
    return (
        <Modal visible={isVisible} presentationStyle="fullScreen" contentContainerStyle={{borderRadius: 10, alignSelf: 'center', width: Dimensions.get('window').width - 50, height: Dimensions.get('window').height / 2, backgroundColor: '#FFFFFF'}}>
                                <Appbar.Header style={{elevation: 3, backgroundColor: '#FFFFFF'}}>
                            <Appbar.Action icon={() => <FeatherIcon name="arrow-left" />} onPress={closeModal} />
                            <Appbar.Content title="Workout Scheme" />
                            <Appbar.Action icon={() => <FeatherIcon name="check" />} onPress={() => captureValues(setSliderValue, repSliderValue)} />
                        </Appbar.Header>
            <View style={{flex: 1, padding: 5}}>
                <View style={{flex: 1}}>
                    <View style={{padding: 5}}>
                    <Text style={{  fontSize: 20}}>
                       Change workout sets and reps
                    </Text>
                    <Caption>
                        You can change the sets and reps of any workout before the workout begins when started.
                    </Caption>
                    </View>
                </View>

                <Divider />

                <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text style={{alignSelf: 'center', padding: 10}}>
                        {workout.workout_name}
                    </Text>
                    <View style={{flex: 1, justifyContent: 'center'}}>
                        <Text>
                        <Text style={{  fontSize: 15}}>
                            Reps:
                        </Text>
                        <Text>
                            {" "}
                        </Text>
                        <Text  style={{fontSize: 20,   color: '#2196F3'}}>
                            {repSliderValue}
                        </Text>
                        </Text>
                        
                        <Slider value={repSliderValue} step={1} minimumValue={0} maximumValue={15} onValueChange={value => setRepSliderValue(value)} />
                    </View>

                    <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text>
                        <Text style={{  fontSize: 15}}>
                            Sets:
                        </Text>
                        <Text>
                            {" "}
                        </Text>
                        <Text style={{fontSize: 20,   color: '#2196F3'}}>
                            {setSliderValue}
                        </Text>
                        </Text>
                        <Slider value={setSliderValue} step={1} minimumValue={0} maximumValue={15} onValueChange={value => setSetSliderValue(value)} />
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default WorkoutSchemeModal;