import React, { useEffect, useState } from 'react';

import {
    Modal,
    View,
    Text
} from 'react-native';

const RestTimer = ({isVisible, closeModal, timerHasStarted, restTime}) => {
    const [secondsLeft, setSecondsLeft] = useState(restTime);
    const [timerFinished, setTimerFinished] = useState(false)
  

    handleCountdown = () => {
        if (timerHasStarted) {
            setTimeout(() => {
                let updatedSecondsLeft = secondsLeft;
                updatedSecondsLeft -= 1;
                setSecondsLeft(updatedSecondsLeft);
                
                if (updatedSecondsLeft == 0) {
                    setTimerFinished(true)
                    setSecondsLeft(restTime)
                    setTimerFinished(false)
                    closeModal()
                }
            }, 1000)
         }
    }

    handleCountdown()

 
    return (
        <Modal visible={isVisible} presentationStyle="overFullScreen" transparent >
            <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{textAlign: 'center', color: 'white', paddingHorizontal: 20, paddingVertical: 10, fontSize: 20, fontWeight: 'bold'}}>
                    Loading your next Exercise.  Take this time to rest and drink some water.
                </Text>

                <Text style={{color: 'white', paddingHorizontal: 20, paddingVertical: 10, fontSize: 20, fontFamily: 'Avenir'}}>
                    You're doing great! Keep it up!
                </Text>

                <Text style={{color: 'white', fontSize: 25, fontFamily: 'Avenir'}}>
                    {secondsLeft}
                </Text>
            </View>
        </Modal>
    )
}

export default RestTimer;