import React, {useState} from 'react';

import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import {
    Button
} from 'react-native-paper';


import { Avatar } from 'react-native-elements';

import  { Pagination } from 'react-native-snap-carousel'
import GymWelcome from './GymWelcome';
import GymInformation from './GymInformation';
import GymLocation from './GymLocation';
import WelcomeContentDriver from '../WelcomeContentDriver';

const getView = (viewNumber, toggleNext, closeModalMethod) => {
    switch(viewNumber)
    {
        case 0:
            return <GymWelcome setNextDisabled={toggleNext} />
        case 1:
            return <GymInformation setNextDisabled={toggleNext} />
        case 2:
            return <WelcomeContentDriver setNextDisabled={toggleNext} />
    }
}

function GymOnboarding(props) {
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
                            viewNumber != 2 ? <Button disabled={isNextEnabled} color="#212121" mode="text" onPress={() => setViewNumber(viewNumber + 1)}> Next </Button> : null
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

export default GymOnboarding;