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
  IconButton,
  Chip,
  Snackbar,
  ProgressBar,
  Divider,
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
import { getLupaProgramInformationStructure } from '../../../../../model/data_structures/programs/program_structures';
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
             // onSubmitEditing={() => handleAddTags()}
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

function ProgramInformation(props) {
  return (
    <View style={styles.root}>
      <SafeAreaView />
            <Surface style={{flex: 8, elevation: 0, borderRadius: 10, borderWidth: 0, borderColor: '#E5E5E5', justifyContent: 'space-evenly', width: Dimensions.get('window').width - 20}}>
              <View style={{ paddingHorizontal: 20, borderWidth: 1, borderRadius: 3, borderColor: '#E5E5E5', paddingVertical: 10, paddingBottom: 20}}>
              <Text style={{paddingVertical: 10, fontSize: 15, fontWeight: 'bold', color: '#23374d'}}>
                Write a program name
              </Text>
              <Text style={{color: 'rgb(141, 158, 171)', fontFamily: 'Avenir-Medium'}}>
                You will have a chance to change this later.
              </Text>
              <TextInput selectionColor="#23374d" placeholder="5 Week Starter Program" style={{borderColor: '#23374d', borderBottomWidth: 1.5, paddingVertical: 10}} />
              </View>

              <View style={{ paddingHorizontal: 20, borderWidth: 1, borderRadius: 3, borderColor: '#E5E5E5', paddingVertical: 10,}}>
              <Text style={{paddingVertical: 10, fontSize: 15, fontWeight: 'bold', color: '#23374d'}}>
                Select the duration
              </Text>
              <Slider  />
              <Caption>
                3 Weeks
              </Caption>
                </View>

                <View style={{borderWidth: 1, borderRadius: 3, borderColor: '#E5E5E5', paddingVertical: 10,}}>
              <View style={{paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              <Text style={{paddingVertical: 10, fontSize: 15, fontWeight: 'bold', color: '#23374d'}}>
                Choose workout days 
              </Text>
              <Caption>
                  (0) selected
                </Caption>
              </View>
            
              <View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {
                    daysOfTheWeek.map(day => {
                      return (
                        <Chip style={{ marginHorizontal: 10, backgroundColor: '#EEEEEE', width: 100, alignItems: 'center', justifyContent: 'center'}}>
                        {day}
                      </Chip>
                      )
                    })
                  }

                 
                </ScrollView>
              </View>
                </View>
            </Surface>

            <View style={{flex: 3, padding: 20, backgroundColor: '#1089ff', alignItems: 'flex-start'}}>
              <Caption style={{color: 'white'}}>
                  Create and sell fitness program directly through Lupa.  Add your own workouts, modify workout schemes, and make your program discoverable for sell.
              </Caption>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{color: 'white', fontFamily: 'Avenir-Heavy', paddingVertical: 10}}>
                Add workouts to my program
              </Text>
              <FeatherIcon name="arrow-right" size={15} color="#FFFFFF" />
              </View>
                </View>
            
            <FeatherIcon name="x" size={22} onPress={() => {}} style={{position: 'absolute', top: Constants.statusBarHeight, left: 0, margin: 15}} />
             
  </View>
  )
}

function PublishProgram(props) {
  return (
    <SafeAreaView style={{flex: 1}}>
        <View style={{flexDirection: 'rw'}}>
        <FeatherIcon name="arrow-left" size={22} onPress={() => {}} style={{margin: 18}} />
        </View>
    </SafeAreaView>
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