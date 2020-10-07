import { TabRouter, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';

import {
    Text,
    View,
    SafeAreaView,
    StyleSheet,
    ScrollView,
} from 'react-native';
import Feather1s from 'react-native-feather1s/src/Feather1s';

import { Checkbox, Button } from 'react-native-paper';
import { Constants } from 'react-native-unimodules';
import { useSelector } from 'react-redux';
import LupaController from '../../../../controller/lupa/LupaController';

const SKILL_BASED_INTEREST = [
    'Agility',
    'Balance',
    'Speed',
    'Power',
    'Coordination',
    'Reaction Time',
    'Weight Loss',
    'Test Preparation',
    'Sport Specific',
    'Bodybuilding',
    'Health/Fitness Coach',
    'Injury Prevention',
]

const PHYSIOLOGICAL_BASED_INTEREST = [
    'Test Preparation',
    'Sport Specific',
    'Bodybuilding',
    'Health/Fitness Coach',
    'Injury Prevention',
]

const TRAINER_PARADIGMS = [
    'In Studio',
    'In Home',
    'Outdoor',
]

function PickInterest({ setNextDisabled, isOnboarding, route, navigation }) {
    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

    const [pickedInterest, setPickedInterest] = useState(currUserData.interest)
    const [stateUpdate, forceStateUpdate] = useState(false)
    const [trainerTypes, setTrainerTypes] = useState(currUserData.trainer_type);

    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const handleOnPickInterest = (interest) => {

        if (pickedInterest.includes(interest)) {
            let updatedPickedInterest = pickedInterest;
            updatedPickedInterest.splice(updatedPickedInterest.indexOf(interest), 1);
            setPickedInterest(updatedPickedInterest)
        } else {
            let updatedPickedInterest = pickedInterest;
            updatedPickedInterest.push(interest);
            setPickedInterest(updatedPickedInterest)
        }

        LUPA_CONTROLLER_INSTANCE.updateCurrentUser('interest', pickedInterest)

        forceStateUpdate(!stateUpdate)
    }

    const handlePickTrainerTypes = (interest) => {
        try {
        if (trainerTypes.includes(interest)) {
            let updatedTrainerTypes = trainerTypes;
            updatedTrainerTypes.splice(updatedTrainerTypes.indexOf(interest), 1);
            setTrainerTypes(updatedTrainerTypes)
        } else {
            let updatedTrainerTypes = trainerTypes;
            updatedTrainerTypes.push(interest);
            setTrainerTypes(updatedTrainerTypes)
        }

        LUPA_CONTROLLER_INSTANCE.updateCurrentUser('trainer_type', trainerTypes);

        forceStateUpdate(!stateUpdate)
    } catch(error) {

    }
    }

    const enableNext = () => {
        if (setNextDisabled) {
            setNextDisabled(false);
        }
    }

    const disableNext = () => {
        if (setNextDisabled) {
            setNextDisabled(true);
        }
    }

    const renderSaveOption = () => {
        if (typeof(route) != 'undefined') {
            if (typeof(route.params) != 'undefined') {
                if (route.params.isOnboarding === false) {
                    return (
                        <Button color="#1089ff" style={{margin: 0, alignSelf: 'flex-end'}} mode="text" onPress={() =>  navigation.pop()}> 
                            Save
                        </Button>
                    )
                }
            }
        }
       
    }

    useEffect(() => {
        if (pickedInterest.length >= 1) {
            enableNext();
        }

    }, [])

    return (
        <SafeAreaView style={styles.container}>
       <ScrollView>

            <View style={{padding: 20, alignSelf: 'center', alignItems: 'flex-start', justifyContent: 'center'}}>
            {renderSaveOption()}
                <Text style={{ fontFamily: 'Avenir-Medium', textAlign: 'center', fontSize: 25, marginVertical: Constants.statusBarHeight}}>
                    What fitness skills and goals are you interested in?
                </Text>
                <Text style={{fontFamily: 'Avenir-Medium', color: 'rgb(165, 164, 171)'}}>
                    You can select a few:
                </Text>
            </View>
            <View>
            <Text style={{paddingLeft: 20, fontFamily: 'Avenir-Medium'}}>
                Goal Based
            </Text>
            <View style={[styles.container, styles.interestListContainer]}>
                {
                    SKILL_BASED_INTEREST.map((interest, index, arr) => {
                        return (
                            <View key={interest}  style={[styles.interestContainer, {backgroundColor: pickedInterest.includes(interest) ? 'rgba(16, 136, 255, 0.2)' : '#FFFFFF' }]}>
                            <Text style={styles.interestText}>
                                {interest}
                            </Text>
                            <Checkbox.Android color="#1088ff" onPress={() => handleOnPickInterest(interest)} status={pickedInterest.includes(interest) ? 'checked' : 'unchecked'} key={interest} />
                        </View>
                        )
                    })
                }
            </View>
            </View>

                {
                    currUserData.isTrainer ?
                    <View>
                    <Text style={{paddingLeft: 20, fontFamily: 'Avenir-Medium'}}>
                        Training Paradigm
                    </Text>
                    <View style={[styles.container, styles.interestListContainer]}>
                        {
                            TRAINER_PARADIGMS.map((interest, index, arr) => {
                                return (
                                    <View key={interest}  style={[styles.interestContainer, {backgroundColor: trainerTypes.includes(interest) ? 'rgba(16, 136, 255, 0.2)' : '#FFFFFF' }]}>
                                    <Text style={styles.interestText}>
                                        {interest}
                                    </Text>
                                    <Checkbox.Android color="#1088ff" onPress={() => handlePickTrainerTypes(interest)} status={trainerTypes.includes(interest) ? 'checked' : 'unchecked'} key={interest} />
                                </View>
                                )
                            })
                        }
                    </View>
                    </View>
                    :
                    null
                }
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    interestListContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    interestContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        padding: 10,
        width: '42%',
        borderColor: 'rgb(209, 209, 214)',
        marginVertical: 10,
        marginHorizontal: 10,
        borderRadius: 5,
    },
    interestText: {
        fontSize: 11,
        fontFamily: 'Avenir-Medium'
    }
});

export default PickInterest;