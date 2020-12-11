import React, {useState} from 'react';

import {
    View,
    Text,
    StyleSheet,   
    Dimensions,
     SafeAreaView,
} from 'react-native';
 
import BasicInformation from './BasicInformation';
import TrainerBasicInformation from './TrainerBasicInformation';
import PickInterest from './PickInterest';
import WelcomeContentDriver from '../WelcomeContentDriver'
import TrainerBackgroundVerification from './TrainerBackgroundVerification';

import { Pagination } from 'react-native-snap-carousel';

import {
    Button
} from 'react-native-paper';
import HomeGymModal from '../HomeGymModal';
    
    const getView = (viewNumber, toggleNext, closeModalMethod, navigateNextView) => {
        switch(viewNumber)
        {
         /*   case 0:
                return <TrainerBackgroundVerification setNextDisabled={toggleNext} /> */
            case 0:
                return <TrainerBasicInformation setNextDisabled={toggleNext} />
            case 1:
                return <HomeGymModal navigateNextView={navigateNextView} />
            case 2:
                return <WelcomeContentDriver closeModalMethod={closeModalMethod} />
        }
    }
    
    function TrainerOnboarding(props) {
        const [viewNumber, setViewNumber] = useState(0);
        const [isNextEnabled, setIsNextEnabled] = useState(false);

        const displayNavigation = () => {
           if (viewNumber === 1) {
               return;
           }

            if (viewNumber != 3) {
               return (
                <View style={{backgroundColor: 'rgba(0,0,0,0)', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Pagination dotsLength={3} activeDotIndex={viewNumber} />
                   { viewNumber != 3 ? <Button disabled={isNextEnabled} color="#212121" mode="text" onPress={() => setViewNumber(viewNumber + 1)}> Next </Button> : null }
                </View>
               )
            }
        }

        const navigateNextView = () => {
            setViewNumber(view => view + 1);
        }
    
        return (
            <View style={{flex: 1, backgroundColor: 'white'}}>
                        {getView(viewNumber, setIsNextEnabled, props.closeModalMethod, navigateNextView)}
                        {displayNavigation()}
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