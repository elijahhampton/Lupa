import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Dimensions,
  Slider,
  KeyboardAvoidingView,
} from 'react-native';

import {
  Surface,
  Modal as PaperModal,
  Caption,
  Button,
  Chip,
  Paragraph,
  Appbar,
  Dialog,
} from 'react-native-paper';

import FeatherIcon from 'react-native-vector-icons/Feather'
import { Input} from 'react-native-elements';

const MIN_TITLE_LENGTH = 6
const MAX_TITLE_LENGTH = 40

const MIN_DESCRIPTION_LENGTH = 12
const MAX_DESCRIPTION_LENGTH = 150

const daysOfTheWeek  = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
]

const ProgramLearnMoreDialog = ({ isVisible, closeDialog }) => {
  return (
    <Dialog visible={isVisible} style={{width: Dimensions.get('window').width - 20, height: 300, justifyContent: 'space-evenly', alignSelf: 'center'}}>
      <Dialog.Title>
        Plan. Design. Publish
      </Dialog.Title>

      <Dialog.Content>
        <Paragraph>
          Create and host fitness programs using Lupa.  Choose the duration of your 
          program and then pick the days on which there will be workouts.
          After designing your program you can set your own price and publish it 
          for the world to see, send it to your friends, or save it for personal use.
        </Paragraph>
      </Dialog.Content>

      <Dialog.Actions>
        <Button onPress={closeDialog} theme={{roundness: 8}} uppercase={false} mode="contained" color="#1089ff">
          Start designing
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}

function ProgramInformation({ handleCancelOnPress, saveProgramInformation }) {
  const navigation = useNavigation();

  const [programDuration, setProgramDuration] = useState(1);
  const [programWorkoutDays, setProgramWorkoutDays] = useState([]);
  const [learnMoreDialogIsVisible, setLearnMoreDialogIsVisible] = useState(false);

  const handleSaveProgramInformation = () => {
    saveProgramInformation(programDuration, programWorkoutDays);
  }

  const handleOnPickDay = (day) => {
    if (!programWorkoutDays.includes(day)) {
      setProgramWorkoutDays(days => [...days, day])
    } else {
      setProgramWorkoutDays(days => days.splice(days.indexOf(day), 1));
    }
  }

  return (
    <View style={styles.root}>
      <Appbar.Header style={{paddingHorizontal: 10, elevation: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', backgroundColor: '#FFFFFF'}}>
      <FeatherIcon onPress={handleCancelOnPress} name="x" size={22} onPress={() => navigation.pop()} />
      <Appbar.Content title="Design a fitness program" style={{alignSelf: 'center'}} titleStyle={{alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 20}} />
      <FeatherIcon name="x" color="white" size={22} onPress={() => navigation.pop()} />
      </Appbar.Header>
      

            <View style={{flex: 8, elevation: 0, borderRadius: 10, borderWidth: 0, borderColor: '#E5E5E5', justifyContent: 'space-evenly', width: Dimensions.get('window').width - 20}}>

              <View style={{ paddingHorizontal: 20, paddingVertical: 10,}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <FeatherIcon name="clock" size={15} style={{marginRight: 5}} />
                <Text style={{paddingVertical: 10, fontSize: 15, fontWeight: 'bold', color: '#23374d'}}>
                Select the duration
              </Text>
             
                </View>
             
              <Text style={{color: 'rgb(141, 158, 171)', fontFamily: 'Avenir-Medium'}}>
                How long will this program last?
              </Text>
              <Slider 
                minimumValue={1} 
                maximumValue={15} 
                step={1} 
                value={programDuration} 
                onValueChange={value => setProgramDuration(value)} 
                />
              <Caption>
                {programDuration} Weeks
              </Caption>
                </View>

                <View style={{paddingVertical: 10,}}>
                  <View style={{paddingHorizontal: 20, paddingVertical: 15}}>

              <View style={{ flexDirection: 'row', paddingVertical: 5, alignItems: 'center', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <FeatherIcon name="calendar" size={18} style={{marginRight: 5}} />
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#23374d'}}>
                Add workout days 
              </Text>
              </View>
              
              <Caption>
                  ({programWorkoutDays.length}) selected
                </Caption>
              </View>
              <Text style={{ color: 'rgb(141, 158, 171)', fontFamily: 'Avenir-Medium'}}>
                Which days will exercise be required?
              </Text>
              </View>
            
            
              <View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {
                    daysOfTheWeek.map(day => {
                      return (
                        <Chip onPress={() => handleOnPickDay(day)} key={day} style={{ marginHorizontal: 10, backgroundColor: '#EEEEEE', width: 100, alignItems: 'center', justifyContent: 'center'}}>
                        {day}
                      </Chip>
                      )
                    })
                  }

                 
                </ScrollView>
              </View>
                </View>
            </View>

            <View style={{flex: 2, padding: 20, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'space-evenly'}}>
              <Button
              onPress={handleSaveProgramInformation}
              color="#1089ff"
              disabled={programWorkoutDays.length > 0 ? false : true}
              uppercase={false}
              mode="contained"
              theme={{roundness: 15}}
              style={{elevation: 0}}
              icon={() => <FeatherIcon name="plus" size={18} color="white" />}
              contentStyle={{height: 60, width: Dimensions.get('window').width - 50}}>
                Add Workouts to Program
              </Button>

              <Button mode="text" color="#1089ff" uppercase={false} onPress={() => setLearnMoreDialogIsVisible(true)}>
                    <Text style={{fontSize: 12}}>
                    Learn more about creating a program
                    </Text>
                 </Button>
               </View>

               <ProgramLearnMoreDialog isVisible={learnMoreDialogIsVisible} closeDialog={() => setLearnMoreDialogIsVisible(false)} />
                </View>
  )
}



const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topView: {
    flex: 2,
    backgroundColor: '#FFFFFF',
    elevation: 15,
    justifyContent: 'space-between'
  },
  bottomView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  divider: {
    width: Dimensions.get('window').width - 150,
    alignSelf: 'center'
  },
  container: {
    width: "100%",
    height: 320,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    color: 'white',
    margin: 10,
    backgroundColor: 'transparent'
  },
  selectedType: {
    backgroundColor: '#d4e5ff',
    borderColor: '#BBDEFB',
    borderWidth: 0.5
  },
  unselectedType: {
    backgroundColor: '#FFFFFF',
    borderColor: 'transparent',
    borderWidth: 0
  },
  textInput: {
    margin: 3,
    width: '100%',
    alignSelf: 'flex-start',
    marginVertical: 10,
    paddingVertical: 15,
    fontSize: 13,
    fontFamily: 'Avenir-Light',
  },
  questionText: {
    fontFamily: "Avenir-Medium",
    fontSize: 18,
    fontWeight: '700',
    color: '#23374d'
  }
})

export default ProgramInformation;