import React from 'react';

import {
  Modal,
  View,
  Animated,
  Text,
  StyleSheet,
} from 'react-native';

import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'

const RestTimer = ({ isVisible, closeModal, restTime }) => {
  return (
    <Modal 
      visible={isVisible} 
      presentationStyle="fullScreen">
      <View style={styles.container}>
        <Text style={styles.headerText}>
          Loading your next Exercise.  Take this time to rest and drink some water.
        </Text>
        <Text style={styles.subText}>
          You're doing great! Keep it up!
        </Text>
        <CountdownCircleTimer
          isPlaying={true}
          onComplete={() => {
            closeModal()
          }}
          duration={30}
          initialRemainingTime={30}
          size={100}
          colors={[
            ['#23374d', 0.4],
            ['#1089ff', 0.4],
            ['#FFFFFF', 0.2],
          ]}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', alignItems: 'center', justifyContent: 'center'
  },
  headerText: {
    textAlign: 'center', color: 'white', paddingHorizontal: 20, paddingVertical: 10, fontSize: 20, fontWeight: 'bold' 
  },
  subText: {
    color: 'white', paddingHorizontal: 20, paddingVertical: 20, fontSize: 20, fontFamily: 'Avenir'
  }
})

export default RestTimer;