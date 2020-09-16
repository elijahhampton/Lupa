import React, { useEffect, useState } from 'react';

import {
    Modal,
    View,
    Animated,
    Text
} from 'react-native';

import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'

const RestTimer = ({isVisible, closeModal, timerHasStarted, restTime}) => {
    const [secondsLeft, setSecondsLeft] = useState(restTime);
    const [timerFinished, setTimerFinished] = useState(false)
 
    return (
        <Modal visible={isVisible} presentationStyle="overFullScreen" transparent >
            <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{textAlign: 'center', color: 'white', paddingHorizontal: 20, paddingVertical: 10, fontSize: 20, fontWeight: 'bold'}}>
                    Loading your next Exercise.  Take this time to rest and drink some water.
                </Text>

                <Text style={{color: 'white', paddingHorizontal: 20, paddingVertical: 20, fontSize: 20, fontFamily: 'Avenir'}}>
                    You're doing great! Keep it up!
                </Text>

                <CountdownCircleTimer
    isPlaying={true}
    onComplete={() => {
        closeModal()
    }}
    duration={restTime}
    initialRemainingTime={restTime}
    size={100}
    colors={[
      ['#23374d', 0.4],
      ['#1089ff', 0.4],
      ['#FFFFFF', 0.2],
    ]}
  >
    {({ remainingTime, animatedColor }) => (
      <Animated.Text style={{ color: animatedColor, fontSize: 20, fontFamily: 'Avenir' }}>
        {remainingTime}
      </Animated.Text>
    )}
  </CountdownCircleTimer>
            </View>
        </Modal>
    )
}

export default RestTimer;