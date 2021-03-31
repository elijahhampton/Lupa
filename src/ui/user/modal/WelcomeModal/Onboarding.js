import React, { useState } from 'react';

import {
    View,
    StyleSheet,
    Text
} from 'react-native';
import WelcomeLupaIntroduction from './WelcomeLupaIntroduction';
import UserOnboarding from './UserOnboarding';
import TrainerOnboarding from './TrainerOnboarding'
import GymOnboarding from './GymOnboarding';

const ACCOUNT_TYPES = {
    TRAINER: "trainer",
    USER: "user"
}


function Onboarding(props) {
    const [accountTypeSelected, setAccountTypeIsSelected] = useState(false);
    const [accountType, setAccountType] = useState(undefined);
    const renderComponent = () => {
        switch(accountType) {
            case 'user':
                return <UserOnboarding />
            case 'trainer':
                return <TrainerOnboarding />
            case 'gym':
                return <GymOnboarding />
            default:
                return <WelcomeLupaIntroduction setUserAccountTypeIsSelected={setAccountTypeIsSelected} setUserAccountType={setAccountType} setNextDisabled={() => {}}/>
        } 
    }

    return (
        <View style={{flex: 1}}>
            {renderComponent()}
        </View>
    )
}

export default Onboarding;