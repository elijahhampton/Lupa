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

import BasicInformation from './BasicInformation';
import PickInterest from './PickInterest';
import WelcomeContentDriver from '../WelcomeContentDriver'
import UserBackgroundVerification from './UserBackgroundVerification';

import  { Pagination } from 'react-native-snap-carousel'

const getView = (viewNumber, toggleNext, closeModalMethod) => {
    switch(viewNumber)
    {
        case 0:
            return <UserBackgroundVerification />
        case 1:
            return <BasicInformation setNextDisabled={toggleNext} />
        case 2:
            return <PickInterest setNextDisabled={toggleNext} isOnboarding={true} />
        case 3:
            return <WelcomeContentDriver closeModalMethod={closeModalMethod} />
    }
}

function UserOnboarding(props) {
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

export default UserOnboarding;