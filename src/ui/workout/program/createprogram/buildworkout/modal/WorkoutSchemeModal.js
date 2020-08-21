import React, { useState } from 'react';

import {
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
    Portal,
    Button,
    Modal,
} from 'react-native-paper';

import FeatherIcon from 'react-native-vector-icons/Feather'
import ThinFeatherIcon from 'react-native-feather1s';
import { Constants } from 'react-native-unimodules';

function WorkoutSchemeModal({ isVisible, captureValues, workout, closeModal}) {
    const [repSliderValue, setRepSliderValue] = useState(0);
    const [setSliderValue, setSetSliderValue] = useState(0);

    const saveScheme = () => { 
        captureValues(setSliderValue, repSliderValue);
        closeModal();
    }

    return (
        <Portal>

        <Modal visible={isVisible} contentContainerStyle={{width: Dimensions.get('window').width, height: Dimensions.get('window').height + Constants.statusBarHeight, backgroundColor: '#FFFFFF'}}>
                                <Appbar.Header style={{elevation: 3, backgroundColor: '#FFFFFF'}}>
                            <Appbar.Action icon={() => <ThinFeatherIcon thin={true} name="arrow-left" size={20} />} onPress={closeModal} />
                            <Appbar.Content title="Workout Scheme" />
                            <Button color="#23374d" mode="text" uppercase={false} onPress={saveScheme}>
                                Save
                            </Button>
                        </Appbar.Header>
            <View style={{flex: 1, paddingHorizontal: 10}}>
                <View>
                    <View style={{padding: 5}}>
                    <Text style={{  fontSize: 20}}>
                       Change workout sets and reps
                    </Text>
                    <Caption>
                        You can change the sets and reps of any workout before the workout begins when started.
                    </Caption>
                    </View>
                </View>


                <View style={{justifyContent: 'center'}}>
                    <Text style={{alignSelf: 'center', padding: 10}}>
                        {workout.workout_name}
                    </Text>
                    <View style={{justifyContent: 'center', marginVertical: 10}}>
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

                    <View style={{justifyContent: 'center', marginVertical: 10}}>
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
        </Portal>
    )
}

export default WorkoutSchemeModal;