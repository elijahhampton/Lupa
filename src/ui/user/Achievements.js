import React, { useState } from 'react';

import {
    View,
    StyleSheet,
    Text,
    Image,
    ScrollView,
    Dimensions,
    Modal
} from 'react-native';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { 
    Appbar, 
    Surface,
    Caption,
 } from 'react-native-paper';
import FeatherIcon from 'react-native-vector-icons/Feather'
import LupaController from '../../controller/lupa/LupaController';
import { CATEGORIES_ARR } from '../../model/data_structures/achievement/types';

function AchievementPageModal({ isVisible, closeModal, achievementGroup, achievements }) {
    return (
        <Modal visible={isVisible} onDismiss={closeModal} presentationStyle="fullScreen">
            <Appbar.Header style={{backgroundColor: 'white', elevation: 0}}>
                <Appbar.Action icon={() => <Feather1s name="arrow-left" size={20} />} onPress={closeModal} />
                <Appbar.Content title={achievementGroup} titleStyle={{alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 25}} />
            </Appbar.Header>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap'}}>
                {
                    achievements.map(achievement => {
                        return (
                            <View style={{alignItems: 'center', margin: 10, justifyContent: 'center'}}>
                                 <View style={{alignItems: 'center', justifyContent: 'center', borderRadius: 45, width: 45, height: 45, backgroundColor: 'rgb(245, 245, 245)'}}>
                                        <Image style={{width: 22, height: 22}} source={require('../images/achievements/trophy.png')} />
                                </View>
                               <Text style={{paddingVertical: 10, fontSize: 12, fontFamily: 'Avenir', color: 'rgb(224, 224, 224)'}}>
                               {achievement.identifier}
                               </Text>
                            </View>
                           
                        )
                    })
                }
            </View>
        </Modal>
    )
}


function Achievements({ route, navigation }) {
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    const ACHIEVEMENTS = LUPA_CONTROLLER_INSTANCE.loadAchievements();

    const [achievementsModalIsVisible, setAchievementsModalIsVisible] = useState(false);
    const [achievementGroup, setAchievementGroup] = useState("");
    const [achievementGroupObjects, setAchievementGroupObjects] = useState([]);

    const renderRecentAchievements = () => {
        if (true) {
            return (
                <>
                    <Text style={{fontFamily: 'Avenir-Heavy', padding: 10, fontSize: 15}}>
                       Recent Updates
                    </Text>
                <View style={{flex: 1, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center'}}>
                    <Caption>
                        You haven't earned any achievements!  Try an easy one like joining your first pack or booking your first trainer.
                    </Caption>
                </View>
                </>
            )
        }
    }

    const renderPinnedAchievement = () => {
        if (true) {
            return (
                <>
                                    <Text style={{fontFamily: 'Avenir-Heavy', padding: 10, fontSize: 15}}>
                        Pinned
                    </Text>
                <View style={{flex: 1, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center'}}>
                    <Caption>
                        You haven't pinned an achievements.  Click the pin on one of the achievements you've earned to pin it.
                    </Caption>
                </View>
                </>
            )
        }
    }

    const handleOnPressCategory = (category) => {
        setAchievementGroup(category)

        switch(category) {
            case 'Exercise':
                setAchievementGroupObjects(ACHIEVEMENTS.exercise)
                break;
            case 'Muscle Group':
                setAchievementGroupObjects(ACHIEVEMENTS.muscleGroup)
                break;
            case 'Packs':
                setAchievementGroupObjects(ACHIEVEMENTS.packs)
                break;
            case 'Sessions':
                setAchievementGroupObjects(ACHIEVEMENTS.sessions)
                break;
            case 'Programs':
                setAchievementGroupObjects(ACHIEVEMENTS.programs)
                break;
            default:
     
        }

        setAchievementsModalIsVisible(true);
    }

    const renderAchievementCategories = () => {
        if (true) {
            return (
                <View>
                    <Text style={{fontFamily: 'Avenir-Heavy', padding: 10, fontSize: 15}}>
                        Explore Categories
                    </Text>
                        {
                            CATEGORIES_ARR.map(category => {
                                return (
                                    <TouchableWithoutFeedback onPress={() => handleOnPressCategory(category)}>

                    
                                    <Surface style={{elevation: 0, marginVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, width: Dimensions.get('window').width - 20, alignSelf: 'center', borderRadius: 10, height: 35}}>
                                    <Text style={{fontSize: 18, fontFamily: 'Avenir'}}>
                                        {category}
                                    </Text>

                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text>
                                            (15)
                                        </Text>
                                    <Feather1s name="chevron-right" size={20} />
                                    </View>
                            
                                </Surface>
                                </TouchableWithoutFeedback>
                                )
                            })
                        }
              
                </View>
            )
        }
    }

    return (
        <View style={styles.container}>
            <Appbar.Header style={{justifyContent: 'space-between', backgroundColor: '#FFFFFF', elevation: 0}}>
                <Appbar.Action icon={() => <FeatherIcon name="arrow-left" size={20} />} onPress={() => navigation.pop()} />
                <Text style={{fontSize: 20, fontFamily: 'Avenir-Heavy', padding: 10}}>
                    0/500
                </Text>
            </Appbar.Header>
            <View style={{backgroundColor: 'white', flex: 1}}>
            <ScrollView contentContainerStyle={{backgroundColor: 'white'}}>
                <View >
                    {renderRecentAchievements()}
                </View>

                <View >
                    {renderPinnedAchievement()}
                </View>

                <View >
                    {renderAchievementCategories()}
                </View>    
            </ScrollView>
            </View>
            <AchievementPageModal isVisible={achievementsModalIsVisible} closeModal={() => setAchievementsModalIsVisible(false)} achievements={achievementGroupObjects} achievementGroup={achievementGroup} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    }
})

export default Achievements;