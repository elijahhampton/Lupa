import React, { useState } from 'react';

import {
    View,
    Modal,
    Image,
    Text,
    Dimensions,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { useSelector } from 'react-redux';
import {
    Surface, Button, Divider
} from 'react-native-paper';

import Feather1s from 'react-native-feather1s/src/Feather1s';
import { useNavigation } from '@react-navigation/native';

/**
 * Renders a user's programs along with program options.
 * @param {} param0 
 */
const DashboardPrograms = ({ isVisible, closeModal }) => {
    const navigation = useNavigation();

    const [cardContentHeight, setCardContentHeight] = useState(0)
    const [cardExpanded, setCardExpanded]  = useState(false);
    const PROGRAMS = useSelector(state => {
        return state.Users.currUserData.program_data
    })

    const handleOnPress = () => {
        if (cardExpanded === false) {
            setCardExpanded(true);
            setCardContentHeight('auto')
        } else {
            setCardExpanded(false);
            setCardContentHeight(0)
        }
    }

    const navigateLiveWorkout = (programData) => {
        closeModal();

        navigation.push('LiveWorkout', {
            programData: programData
        })
    }

    return (
        <Modal animated={true} animationType="slide" visible={isVisible} presentationStyle="fullScreen" onDismiss={closeModal}>
            <SafeAreaView style={{flex: 1}}>
                <Feather1s name="arrow-left" size={20} onPress={closeModal} style={{paddingLeft: 20}} />
                <ScrollView>
                {
                    PROGRAMS.map((result, index, arr) => {
                        if (typeof(result) == 'undefined' || typeof(result.program_structure_uuid) == 'undefined' || result.program_image == "") {
                            return;
                        }
                        return (
                            <View style={{backgroundColor: 'white'}}>
                            <TouchableOpacity key={index} onPress={handleOnPress}>
                            <Surface style={{flexDirection: 'row', alignItems: 'center', borderRadius: 20, margin: 10, elevation: 0, width: Dimensions.get('window').width-20, height: 120, backgroundColor: 'transparent'}} >
                            <View style={{flex: 1.5, alignItems: 'center', justifyContent: 'center' }}>
                                <Image source={{uri: result.program_image }}  style={{width: '100%', height: '100%', borderRadius: 8}} />
                            </View>
                            <View style={{flex: 3, height: '100%', justifyContent: 'space-between' }}>
                                <View style={{justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 5}}>
                                <View style={{width: '90%'}} >
                                    <Text style={{fontSize: 15, color: '#212121'}}>
                                        {result.program_name}
                                    </Text>
                                    <Text style={{paddingVertical: 10, fontSize: 10,flexWrap: 'wrap'}} numberOfLines={4}>
                                    {result.program_description}
                                    </Text>
                                </View>

                                <Feather1s name={cardExpanded === true ? 'chevron-up' : 'chevron-down'} size={20} />
                                </View>

                                <Button onPress={() => navigateLiveWorkout(result)} color="#1089ff" style={{alignSelf: 'flex-start'}} uppercase={false} mode="#1089ff">
                                    Launch Live Workout
                                </Button>
                            </View>
                          </Surface>
                          </TouchableOpacity>
                            <View style={{width: Dimensions.get('window').width - 20, height: cardContentHeight}}>
                                <Text style={{margin: 10}}>
                                    Workouts Completed: {result.program_metadata.workouts_completed}
                                </Text>
                            </View>
                            <Divider />
                          </View>
                        )
                    })
                }
                                </ScrollView>
            </SafeAreaView>
        </Modal>
    )
}

export default DashboardPrograms;
