import React, { useState, useEffect, useRef, useCallback, createRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  Dimensions,
  Slider,
  TouchableHighlight,
  KeyboardAvoidingView,
  Modal,
} from 'react-native';

import {
  Surface,
  Modal as PaperModal,
  Caption,
  Button,
  Appbar,
  IconButton,
  Chip,
  Snackbar,
  ProgressBar,
  Divider,
  Title,
} from 'react-native-paper';

import { Constants } from 'react-native-unimodules';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import FeatherIcon from 'react-native-vector-icons/Feather'
import Icon from "react-native-feather1s";

import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import SelectProgramImage from './SelectProgramImage'
import { Input} from 'react-native-elements';
import LupaMapView from '../../../../user/modal/LupaMapView'
import { copyFileAssets } from 'react-native-fs';
import { getLupaProgramInformationStructure, } from '../../../../../model/data_structures/programs/program_structures';
import NumberFormat from 'react-number-format';

const months = ["January", "February", "March", "April",
  "May", "June", "July", "August", "September", "October",
  "November", "December"];

const numDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const { width } = Dimensions.get('window')

function AddTagsModal(props) {
  let [tags, setTags] = useState([]);
  let [inputValue, setInputValue] = useState('');

  const handleAddTags = () => {
    if (tags.length == 10) {
      return;
    }

    setTags((prevState) => [...prevState].concat(inputValue))
    setInputValue('')
  }

  const handleFinish = () => {
    props.captureTags(tags);
    props.closeModalMethod()
  }

  const handleCancel = () => {
    props.closeModalMethod()
  }

  return (

    <PaperModal contentContainerStyle={{ borderRadius: 10, alignSelf: 'center', top: 120, position: 'absolute', backgroundColor: 'white', width: Dimensions.get('window').width - 30, height: 400 }} visible={props.isVisible}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ padding: 10, fontSize: 20, fontWeight: 'bold' }}>
              Add your own tags
          </Text>
          </View>

          <View style={{ flex: 3, flexWrap: 'wrap', flexDirection: 'row', margin: 10 }}>
            {
              tags.map(tag => {
                return (
                  <Chip style={{ margin: 5, borderRadius: 5, width: 'auto' }} textStyle={{ fontSize: 15 }} theme={{
                    roundness: 0,
                  }}>
                    {tag}
                  </Chip>
                )
              })
            }
          </View>

          <View style={{ justifyContent: 'center', borderRadius: 10, flex: 1.5, backgroundColor: '#E3F2FD' }}>
            <Input
              placeholder='Try "cardio"'
              value={inputValue}
              inputStyle={{ fontSize: 12, padding: 10, }}
              inputContainerStyle={{ backgroundColor: 'white', borderWidth: 1, borderBottomWidth: 1, borderColor: '#BBDEFB' }}
              onBlur={handleAddTags}
              onChangeText={text => setInputValue(text)}
              keyboardAppearance="light"
              keyboardType="default"
              returnKeyLabel="submit"
              returnKeyType="done"
            />

            <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end', flexDirection: 'row' }}>
              <Button mode="text" color="#e53935" onPress={handleCancel}>
                <Text>
                  Cancel
            </Text>
              </Button>
              <Button mode="text" color="#1E88E5" onPress={() => handleFinish()}>
                <Text>
                  Done
            </Text>
              </Button>
            </View>

          </View>
        </View>
      </KeyboardAvoidingView>
    </PaperModal>

  )
}

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

function ProgramInformation({ handleCancelOnPress, saveProgramInformation }) {
  const [programDuration, setProgramDuration] = useState(1);
  const [programWorkoutDays, setProgramWorkoutDays] = useState([]);

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
      <SafeAreaView />
      <FeatherIcon name="x" size={22} onPress={() => {}} style={{alignSelf: 'flex-start', margin: 15}} />

            <Surface style={{flex: 8, elevation: 0, borderRadius: 10, borderWidth: 0, borderColor: '#E5E5E5', justifyContent: 'space-evenly', width: Dimensions.get('window').width - 20}}>

              <View style={{ paddingHorizontal: 20, paddingVertical: 10,}}>
              <Text style={{paddingVertical: 10, fontSize: 15, fontWeight: 'bold', color: '#23374d'}}>
                Select the duration
              </Text>
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
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#23374d'}}>
                Add workout days 
              </Text>
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
            </Surface>

            <View style={{flex: 2, padding: 20, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center'}}>
              <Button
              onPress={handleSaveProgramInformation}
              color="#1089ff"
              uppercase={false}
              mode="contained"
              theme={{roundness: 12}}
              style={{elevation: 8}}
              contentStyle={{height: 45, width: Dimensions.get('window').width - 50}}>
                Add Workouts to Plan
              </Button>
               </View>
          
             
                </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
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