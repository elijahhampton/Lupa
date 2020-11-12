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
import PickInterest from './PickInterest'
import _requestPermissionsAsync from '../../../../controller/lupa/permissions/permissions';
import { useNavigation } from '@react-navigation/native';
import LUPA_DB, { LUPA_AUTH } from '../../../../controller/firebase/firebase';


const getView = (viewNumber, toggleNext, closeModalMethod) => {
    switch(viewNumber)
    {
        case 0:
            return <WelcomeLupaIntroduction setNextDisabled={toggleNext} />
        case 1:
            return <BasicInformation setNextDisabled={toggleNext} />
        case 2:
            return <PickInterest setNextDisabled={toggleNext} isOnboarding={true} />
        case 3:
            return <WelcomeContentDriver closeModalMethod={closeModalMethod} />
    }
}

const WelcomeModal = (props) => {
    const [viewNumber, setViewNumber] = useState(0);
    const [isNextEnabled, setIsNextEnabled] = useState(false);

    return (
            <SafeAreaView style={styles.container}>
                    {
                       getView(viewNumber, setIsNextEnabled, props.closeModalMethod)
                    }
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Pagination dotsLength={3} activeDotIndex={viewNumber} />
                        {
                            viewNumber != 3 ? <Button disabled={isNextEnabled} color="#212121" mode="text" onPress={() => setViewNumber(viewNumber + 1)}> Next </Button> : null
                        }
                    </View>
            </SafeAreaView>
    );
}

export default WelcomeModal;

const styles = StyleSheet.create({
    container: {
       flex: 1,
       padding: 20,
       backgroundColor: '#FFFFFF'
    }
})