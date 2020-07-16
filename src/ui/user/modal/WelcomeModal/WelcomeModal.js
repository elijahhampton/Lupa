import React, { useState, useEffect } from 'react';

import {
    Text,
    View,
    StyleSheet,
    Modal,
    Image,
    Dimensions,
    SafeAreaView, 
} from 'react-native';

import {
    Surface,
    Button,
} from 'react-native-paper';

import { LinearGradient } from 'expo-linear-gradient';

import { Pagination } from 'react-native-snap-carousel';
import WelcomeLupaIntroduction from './WelcomeLupaIntroduction';
import WelcomeContentDriver from '../WelcomeContentDriver';
import BasicInformation from './BasicInformation';
import TrainerInformation from './TrainerInformation';

import _requestPermissionsAsync from '../../../../controller/lupa/permissions/permissions';
import { useNavigation } from '@react-navigation/native';


const getView = (viewNumber, toggleNext, closeModalMethod) => {
    switch(viewNumber)
    {
        case 0:
            return <WelcomeLupaIntroduction setNextDisabled={toggleNext} />
        case 1:
            return <BasicInformation setNextDisabled={toggleNext} />
        case 2:
            return <TrainerInformation />
        case 3:
            return <WelcomeContentDriver closeModalMethod={closeModalMethod} />
    }
}

export default function WelcomeModal(props) {
    const [viewNumber, setViewNumber] = useState(0);
    const [isNextEnabled, setIsNextEnabled] = useState(false);

    const navigation = useNavigation()

    return (
            <SafeAreaView style={{flex: 1}}>
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    colors={['#FFFFFF', '#8AC5F3', '#0084EC']}
                    style={styles.container}>
                    {
                        getView(viewNumber, setIsNextEnabled, props.closeModalMethod)
                    }
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Pagination dotsLength={3} activeDotIndex={viewNumber} />
                        {
                            viewNumber != 3 ? <Button disabled={isNextEnabled} color="#0D47A1" mode="text" onPress={() => setViewNumber(viewNumber + 1)}> Next </Button> : <Button mode="contained" color="#0D47A1" onPress={() => navigation.navigate('App')}> <Text> Explore Lupa </Text> </Button>
                        }
                    </View>
                </LinearGradient>
            </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: Dimensions.get('window').height,
        padding: 10
    },
    modal: {
        margin: 0,
        backgroundColor: "black",
        flex: 1,
    },
})