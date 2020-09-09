import React, { useEffect, useState } from 'react';

import {
    Modal,
    View,
    Text
} from 'react-native';

const RestTimer = ({isVisible, closeModal, timerHasStarted}) => {
    const [secondsLeft, setSecondsLeft] = useState(30);
    const [timerFinished, setTimerFinished] = useState(false)
  

    handleCountdown = () => {
        if (timerHasStarted) {
            setTimeout(() => {
                let updatedSecondsLeft = secondsLeft;
                updatedSecondsLeft -= 1;
                setSecondsLeft(updatedSecondsLeft);
                
                if (updatedSecondsLeft == 0) {
                    setTimerFinished(true)
                    setSecondsLeft(30)
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
            <Text style={{color: 'white', paddingHorizontal: 20, paddingVertical: 10, fontSize: 20, fontWeight: 'bold'}}>
                    Loading your next workout.  Take this time to rest and drink some water.
                </Text>

                <Text style={{color: 'white', fontSize: 35, fontWeight: 'bold'}}>
                    {secondsLeft}
                </Text>
            </View>
        </Modal>
    )
}

export default RestTimer;