import React, { useState } from 'react';

import {
    View,
    Modal,
    Image,
    Text,
    Dimensions,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import {
    Surface, Button, Divider
} from 'react-native-paper';

import { ScrollView } from 'react-native-gesture-handler';
import Feather1s from 'react-native-feather1s/src/Feather1s';

/**
 * Renders a user's programs along with program options.
 * @param {} param0 
 */
const DashboardPrograms = ({ isVisible, closeModal }) => {
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
    return (
        <Modal animated={true} animationType="slide" visible={isVisible} presentationStyle="fullScreen" onDismiss={closeModal}>
            <SafeAreaView style={{flex: 1}}>
                <Feather1s name="arrow-left" size={20} onPress={closeModal} style={{paddingLeft: 20}} />
                <ScrollView>
                {
                    PROGRAMS.map(result => {
                        return (
                            <View>

                            <TouchableOpacity onPress={handleOnPress}>
                            <Surface style={{flexDirection: 'row', alignItems: 'center', borderRadius: 20, margin: 10, elevation: 0, width: Dimensions.get('window').width-20, height: 120, backgroundColor: 'transparent'}} >
                                                    
                            <View style={{flex: 1.5, alignItems: 'center', justifyContent: 'center' }}>
                                <Surface style={{width: '100%', height: '100%', elevation: 0, borderRadius: 8}}>
                                    <Image style={{width: '100%', height: '100%', borderRadius: 8}} source={{uri: result.program_image}} />
                                </Surface>
                            </View>
                    
                            <View style={{flex: 3, height: '100%', justifyContent: 'space-between' }}>
                                <View style={{justifyContent: 'space-between', flexDirection: 'row',}}>
                                <View style={{paddingHorizontal: 10}} >
                                    <Text style={{fontSize: 15, color: '#212121'}}>
                                        {result.program_name}
                                    </Text>
                                    <Text style={{paddingVertical: 10, fontSize: 10,flexWrap: 'wrap'}} numberOfLines={4}>
                                    {result.program_description}
                                    </Text>
                                </View>

                                <Feather1s name={cardExpanded === true ? 'chevron-up' : 'chevron-down'} size={20} />
                                </View>

                                <Button color="#1089ff" style={{alignSelf: 'flex-start'}} uppercase={false} mode="#1089ff" onPress={() => {}}>
                                    Launch Live Workout
                                </Button>
                         
                            </View>
                    
                    
                          </Surface>
                          </TouchableOpacity>
                            <View style={{width: Dimensions.get('window').width - 20, height: cardContentHeight}}>
                                <Text style={{padding: 10}}>
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
