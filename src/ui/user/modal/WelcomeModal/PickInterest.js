import React, { useState } from 'react';

import {
    Text,
    View,
    SafeAreaView,
    StyleSheet,
    ScrollView,
} from 'react-native';

import { Checkbox } from 'react-native-paper';
import LupaController from '../../../../controller/lupa/LupaController';

const interestList = [
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

function PickInterest(props) {
    const [pickedInterest, setPickedInterest] = useState([])
    const [stateUpdate, forceStateUpdate] = useState(false)

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

    return (
        <SafeAreaView style={styles.container}>
       
            <View style={{padding: 20, alignSelf: 'center', alignItems: 'flex-start', justifyContent: 'center'}}>
                <Text style={{ fontFamily: 'Avenir-Roman', fontSize: 18, marginVertical: 20 }}>
                    What fitness skills and goals are you interested in?
                </Text>
                <Text style={{fontFamily: 'Avenir-Medium', color: 'rgb(165, 164, 171)'}}>
                    You can select a few:
                </Text>
            </View>
            <View style={[styles.container, styles.interestListContainer]}>
                {
                    interestList.map((interest, index, arr) => {
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
        justifyContent: 'space-evenly',
        flexWrap: 'wrap'
    },
    interestContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        padding: 10,
        width: '45%',
        borderColor: 'rgb(209, 209, 214)',
        marginVertical: 10,
        borderRadius: 5
    },
    interestText: {
        fontSize: 13,
        fontFamily: 'Avenir-Medium'
    }
});

export default PickInterest;