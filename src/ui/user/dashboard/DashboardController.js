import React, { useEffect, useState } from 'react';

import {
    View,
    StyleSheet,
    Text
} from 'react-native';
import { useSelector } from 'react-redux';
import TrainerDashboard from './components/TrainerDashboard';
import UserDashboard from './components/UserDashboard';

function DashboardController(props) {
    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    });

    const [screen, setScreen] = useState("")

    useEffect(() => {
        currUserData.isTrainer === true ? setScreen("Trainer") : setScreen("User")
    }, [screen])

    const renderComponent = () => {
        switch(screen) {
            case "Trainer":
                return <TrainerDashboard />
            case "User":
                return <UserDashboard />
            default:
                return <View style={{
                    flex: 1,
                    backgroundColor: '#FFFFFF'
                }} />
        }
    }
    
    return (
        <View style={{
            flex: 1,
            backgroundColor: '#FFFFFF'
        }}>
            {renderComponent()}
        </View>
    )
}

export default DashboardController;