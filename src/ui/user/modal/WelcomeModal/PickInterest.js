import React, { useEffect, useState } from 'react';

import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Image,
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
    'Fitness Coach',
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

const INTEREST_ICON_PATH_SELECTED = '../../../images/interest_icons/selected/'
const INTEREST_ICON_PATH_UNSELECTED = '../../../images/interest_icons/unselected/'

function PickInterest({ setNextDisabled, isOnboarding, route, navigation }) {
    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

    const [pickedInterest, setPickedInterest] = useState(currUserData.interest)
    const [stateUpdate, forceStateUpdate] = useState(false)
    const [trainerTypes, setTrainerTypes] = useState(currUserData.trainer_type);

    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const getSelectedIconPathString = (skill) => {
        return (INTEREST_ICON_PATH_SELECTED + skill.split(" ").join("")).toString();
    }

    const getUnselectedIconPathString = (skill) => {
        return (INTEREST_ICON_PATH_UNSELECTED + skill.split(" ").join("")).toString() + '.png'
    }

    const renderImage = (skill, index) => {
        switch (skill) {
            case 'Agility':
                if (pickedInterest.includes(skill)) {
                    return (
                        <TouchableOpacity style={{marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleOnPickInterest('Agility')}>
                            <Image style={{width: 63, height: 77, alignSelf: 'center' }} source={require('../../../images/interest_icons/selected/Agility.png')} />
                            <Text style={{ fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                            {skill}
                        </Text>
                        </TouchableOpacity>
                    )
                } else {
                    return (
                        <TouchableOpacity style={{marginVertical: 25, alignItems: 'center', justifyContent: 'center' }} onPress={() => handleOnPickInterest('Agility')}>
                            <Image style={{ width: 63, height: 77, alignSelf: 'center' }} source={require('../../../images/interest_icons/unselected/Agility.png')} />
                            <Text style={{ fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                            {skill}
                        </Text>
                        </TouchableOpacity>
                    )
                }
            case 'Speed':
                if (pickedInterest.includes(skill)) {
                    return (
                        <TouchableOpacity style={{marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleOnPickInterest('Speed')}>
                            <Image style={{ width: 70, height: 70, alignSelf: 'center' }} source={require('../../../images/interest_icons/selected/Speed.png')} />
                            <Text style={{ fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                                {skill}
                            </Text>
                        </TouchableOpacity>
                    )
                } else {
                    return (
                        <TouchableOpacity style={{ marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleOnPickInterest('Speed')}>
                            <Image style={{width: 70, height: 70, alignSelf: 'center' }} source={require('../../../images/interest_icons/unselected/Speed.png')} />
                            <Text style={{ fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                                {skill}
                            </Text>
                        </TouchableOpacity>
                    )
                }
            case 'Balance':
                if (pickedInterest.includes(skill)) {
                    return (
                        <TouchableOpacity style={{marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleOnPickInterest('Balance')}>
                            <Image style={{ width: 63, height: 77, alignSelf: 'center' }} source={require('../../../images/interest_icons/selected/Balance.png')} />
                            <Text style={{ fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                            {skill}
                            </Text>
                        </TouchableOpacity>
                    )
                } else {
                    return (
                        <TouchableOpacity style={{marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleOnPickInterest('Balance')}>
                            <Image style={{ width: 63, height: 77, alignSelf: 'center' }} source={require('../../../images/interest_icons/unselected/Balance.png')} />
                            <Text style={{ fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                            {skill}
                            </Text>
                        </TouchableOpacity>
                    )
                }
            case 'Power':
                if (pickedInterest.includes(skill)) {
                    return (
                        <TouchableOpacity style={{marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleOnPickInterest('Power')}>
                            <Image style={{ width: 30, height: 75, alignSelf: 'center' }} source={require('../../../images/interest_icons/selected/Power.png')} />
                            <Text style={{ fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                            {skill}
                                </Text>
                        </TouchableOpacity>
                    )
                } else {
                    return (
                        <TouchableOpacity style={{marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleOnPickInterest('Power')}>
                            <Image style={{ width: 30, height: 75, alignSelf: 'center' }} source={require('../../../images/interest_icons/unselected/Power.png')} />
                            <Text style={{ fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                            {skill}
                                </Text>
                        </TouchableOpacity>
                    )
                }
            case 'Coordination':
                if (pickedInterest.includes(skill)) {
                    return (
                        <TouchableOpacity style={{marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleOnPickInterest('Coordination')}>
                            <Image style={{ width: 75, height: 82, alignSelf: 'center' }} source={require('../../../images/interest_icons/selected/Coordination.png')} />
                            <Text style={{ fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                            {skill}
                                    </Text>
                        </TouchableOpacity>
                    )
                } else {
                    return (
                        <TouchableOpacity style={{marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleOnPickInterest('Coordination')}>
                            <Image style={{width: 75, height: 82, alignSelf: 'center' }} source={require('../../../images/interest_icons/unselected/Coordination.png')} />
                            <Text style={{ fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                            {skill}
                                    </Text>
                        </TouchableOpacity>
                    )
                }
            case 'Reaction Time':
                if (pickedInterest.includes(skill)) {
                    return (
                        <TouchableOpacity style={{marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleOnPickInterest('Reaction Time')}>
                            <Image style={{ width: 80, height: 77, alignSelf: 'center' }} source={require('../../../images/interest_icons/selected/ReactionTime.png')} />
                            <Text style={{ fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                            {skill}
                                        </Text>
                        </TouchableOpacity>
                    )
                } else {
                    return (
                        <TouchableOpacity style={{marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleOnPickInterest('Reaction Time')}>
                            <Image style={{ width: 80, height: 77, alignSelf: 'center' }} source={require('../../../images/interest_icons/unselected/ReactionTime.png')} />
                            <Text style={{ fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                                {skill}
                            </Text>
                        </TouchableOpacity>
                    )
                }
            case 'Weight Loss':
                if (pickedInterest.includes(skill)) {
                    return (
                        <TouchableOpacity style={{marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleOnPickInterest('Weight Loss')}>
                            <Image style={{ width: 63, height: 77, alignSelf: 'center' }} source={require('../../../images/interest_icons/selected/WeightLoss.png')} />
                            <Text style={{ fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                            {skill}
                            </Text>
                        </TouchableOpacity>
                    )
                } else {
                    return (
                        <TouchableOpacity style={{ marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleOnPickInterest('Weight Loss')}>
                            <Image style={{ width: 63, height: 77, alignSelf: 'center' }} source={require('../../../images/interest_icons/unselected/WeightLoss.png')} />
                            <Text style={{ fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                            {skill}
                                            </Text>
                        </TouchableOpacity>
                    )
                }
            case 'Test Preparation':
                if (pickedInterest.includes(skill)) {
                    return (
                        <TouchableOpacity style={{marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleOnPickInterest('Test Preparation')}>
                            <Image style={{ width: 85, height: 65, alignSelf: 'center' }} source={require('../../../images/interest_icons/selected/TestPreparation.png')} />
                            <Text style={{ fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                                {skill}
                                                </Text>
                        </TouchableOpacity>
                    )
                } else {
                    return (
                        <TouchableOpacity style={{marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleOnPickInterest('Test Preparation')}>
                            <Image style={{ width: 85, height: 65, alignSelf: 'center' }} source={require('../../../images/interest_icons/unselected/TestPreparation.png')} />
                            <Text style={{ fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                            {skill}
                                                </Text>
                        </TouchableOpacity>
                    )
                }
            case 'Sport Specific':
                if (pickedInterest.includes(skill)) {
                    return (
                        <TouchableOpacity style={{marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleOnPickInterest('Sport Specific')}>
                            <Image style={{ width: 70, height: 95, alignSelf: 'center' }} source={require('../../../images/interest_icons/selected/SportSpecific.png')} />
                            <Text style={{ fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                                {skill}
                            </Text>
                        </TouchableOpacity>
                    )
                } else {
                    return (
                        <TouchableOpacity style={{marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleOnPickInterest('Sport Specific')}>
                            <Image style={{ width: 70, height: 95, alignSelf: 'center' }} source={require('../../../images/interest_icons/unselected/SportSpecific.png')} />
                            <Text style={{ fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                            {skill}
                                                    </Text>
                        </TouchableOpacity>
                    )
                }
            case 'Bodybuilding':
                if (pickedInterest.includes(skill)) {
                    return (
                        <TouchableOpacity style={{marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleOnPickInterest('Bodybuilding')}>
                            <Image style={{ width: 100, height: 50, alignSelf: 'center' }} source={require('../../../images/interest_icons/selected/Bodybuilding.png')} />
                            <Text style={{ fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                            {skill}
                                                        </Text>
                        </TouchableOpacity>
                    )
                } else {
                    return (
                        <TouchableOpacity style={{marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleOnPickInterest('Bodybuilding')}>
                            <Image style={{ width: 100, height: 50, alignSelf: 'center' }} source={require('../../../images/interest_icons/unselected/Bodybuilding.png')} />
                            <Text style={{ fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                            {skill}
                            </Text>
                        </TouchableOpacity>
                    )
                }
            case 'Fitness Coach':
                if (pickedInterest.includes(skill)) {
                    return (
                        <TouchableOpacity style={{marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleOnPickInterest('Fitness Coach')}>
                            <Image style={{ width: 59, height: 78, alignSelf: 'center' }} source={require('../../../images/interest_icons/selected/Health:FitnessCoach.png')} />
                            <Text style={{ fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                            {skill}
                                                            </Text>
                        </TouchableOpacity>
                    )
                } else {
                    return (
                        <TouchableOpacity style={{marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleOnPickInterest('Fitness Coach')}>
                            <Image style={{ width: 59, height: 78, alignSelf: 'center' }} source={require('../../../images/interest_icons/unselected/Health:FitnessCoach.png')} />
                            <Text style={{ fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                            {skill}
                                                            </Text>
                        </TouchableOpacity>
                    )
                }
            case 'Injury Prevention':
                if (pickedInterest.includes(skill)) {
                    return (
                        <TouchableOpacity style={{marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleOnPickInterest('Injury Prevention')}>
                            <Image style={{  alignSelf: 'center' }} source={require('../../../images/interest_icons/selected/InjuryPrevention.png')} />
                            <Text style={{ fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                                {skill}
                            </Text>
                        </TouchableOpacity>
                    )
                } else {
                    return (
                        <TouchableOpacity style={{marginVertical: 25,  alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => handleOnPickInterest('Injury Prevention')}>
                            <Image style={{  alignSelf: 'center', }} source={require('../../../images/interest_icons/unselected/InjuryPrevention.png')} />
                            <Text style={{ fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                                {skill}
                            </Text>
                        </TouchableOpacity>
                    )
                }
        }
    }

    const renderSkills = () => {
        let count = 0;
        return (
            <View style={{ flex: 1 }}>
                {
                    SKILL_BASED_INTEREST.map((skill, index, arr) => {

                        if (index % 2 == 0) {
                            return (
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 55}}>
                                  {renderImage(arr[index], index)}
                                  {renderImage(arr[index + 1], index)}
                            </View>

                            )
                        }
                    })
                }
            </View>
        )
    }

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
        } catch (error) {

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
        if (typeof (route) != 'undefined') {
            if (typeof (route.params) != 'undefined') {
                if (route.params.isOnboarding === false) {
                    return (
                        <Button color="#1089ff" style={{ margin: 0, alignSelf: 'flex-end' }} mode="text" onPress={() => navigation.pop()}>
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
                <View style={{ padding: 20, alignSelf: 'center', alignItems: 'flex-start', justifyContent: 'center' }}>
                    {renderSaveOption()}
                    <Text style={{ fontFamily: 'Avenir-Heavy', textAlign: 'center', fontSize: 25, marginVertical: Constants.statusBarHeight }}>
                        Which fitness skills and goals are you interested in?
                </Text>
                    <Text style={{ fontFamily: 'Avenir-Medium', color: 'rgb(165, 164, 171)' }}>
                        You can select a few:
                </Text>
                </View>

                {renderSkills()}

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