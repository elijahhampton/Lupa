import React, { useState } from 'react';

import {
    Text,
    View,
    StyleSheet,
    Modal,
    Image,
    Dimensions,
} from 'react-native';

import {
    Surface,
    Button,
} from 'react-native-paper';

import { LinearGradient } from 'expo-linear-gradient';

import { Pagination } from 'react-native-snap-carousel';
import { SafeAreaView } from 'react-navigation';

import WelcomeLupaIntroduction from './WelcomeLupaIntroduction';
import WelcomeContentDriver from '../WelcomeContentDriver';
import BasicInformation from './BasicInformation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import TrainerInformation from './TrainerInformation';


const getView = (viewNumber) => {
    switch(viewNumber)
    {
        case 0:
            return <WelcomeLupaIntroduction />
        case 1:
            return <BasicInformation />
        case 2:
            return <TrainerInformation />
        case 3:
            return <WelcomeContentDriver />
    }
}

export default function WelcomeModal(props) {
    const [viewNumber, setViewNumber] = useState(0);
    return (
        <Modal presentationStyle="fullScreen" style={styles.modal} visible={props.isVisible} onDismiss={props.closeModalMethod}>
            <SafeAreaView>
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    colors={['#FFFFFF', '#8AC5F3', '#0084EC']}
                    style={styles.container}>
                    {
                        getView(viewNumber)
                    }
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Pagination dotsLength={3} activeDotIndex={viewNumber} />
                        {
                            viewNumber != 3 ? <Button color="#0D47A1" mode="text" onPress={() => setViewNumber(viewNumber + 1)}> Next </Button> : <Button mode="contained" color="#0D47A1" onPress={props.closeModalMethod}> <Text> Explore Lupa </Text> </Button>
                        }
                    </View>
                </LinearGradient>
            </SafeAreaView>
        </Modal>
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