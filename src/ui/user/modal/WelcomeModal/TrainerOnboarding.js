import React, {useState} from 'react';

import {
    View,
    Text,
    StyleSheet,    SafeAreaView,
} from 'react-native';
 
import BasicInformation from './BasicInformation';
import PickInterest from './PickInterest';
import WelcomeContentDriver from '../WelcomeContentDriver'
import TrainerBackgroundVerification from './TrainerBackgroundVerification';

import { Pagination } from 'react-native-snap-carousel';

import {
    Button
} from 'react-native-paper';
    
    const getView = (viewNumber, toggleNext, closeModalMethod) => {
        switch(viewNumber)
        {
            case 0:
                return <TrainerBackgroundVerification setNextDisabled={toggleNext} />
            case 1:
                return <BasicInformation setNextDisabled={toggleNext} />
            case 2:
                return <WelcomeContentDriver closeModalMethod={closeModalMethod} />
        }
    }
    
    function TrainerOnboarding(props) {
        const [viewNumber, setViewNumber] = useState(0);
        const [isNextEnabled, setIsNextEnabled] = useState(false);
    
        return (
            <View style={{flex: 1}}>
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
            </View>
        )
    }

    const styles = StyleSheet.create({
        container: {
           flex: 1,
           padding: 20,
           backgroundColor: '#FFFFFF'
        }
    })

export default TrainerOnboarding;