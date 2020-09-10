import React, { useState } from 'react';

import {
    Modal,
    View,
    TextInput,
    Text,
    SafeAreaView,
} from 'react-native';
import { Divider, Appbar, FAB, Caption, Menu, Provider } from 'react-native-paper';
import ThinFeatherIcon from 'react-native-feather1s'
import FeatherIcon from 'react-native-vector-icons/Feather'
import Feather1s from 'react-native-feather1s/src/Feather1s';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import LupaController from '../../../../controller/lupa/LupaController';

function SchedulerModal({ closeModal, isVisible, selectedDates }) {
  const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance()
    const [addedTimes, setAddedTimes] = useState([]);

    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const [startTimePeriod, setStartTimePeriod] = useState("AM")
    const [endTimePeriod, setEndTimePeriod] = useState("PM")

    const [startTimeMenuVisible, setStartTimeMenuVisible] = useState(false);
    const [endTimeMenuVisible, setEndTimeMenuVisible] = useState(false);

    const [allowTextChange, setAllowTextChange] = useState(0);

    const openStartTimeMenu = () => setStartTimeMenuVisible(true);
  
    const closeStartTimeMenu = () => setStartTimeMenuVisible(false);

    const openEndTimeMenu = () => setEndTimeMenuVisible(true);
  
    const closeEndTimeMenu = () => setEndTimeMenuVisible(false);

    const addTimes = () => {
      const timeBlock = {
        startTime: startTime,
        startTimePeriod: startTimePeriod,
        endTime: endTime,
        endTimePeriod: endTimePeriod
      }

      setAddedTimes(prevState => prevState.concat(timeBlock));
    }

    const renderAddedTimes = () => {
      return addedTimes.map((timeBlock, index, arr) => {
        return (
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%'}}>
            <Text>
              {timeBlock.startTime} {timeBlock.startTimePeriod}
            </Text>
            <Text>
              {timeBlock.endTime} {timeBlock.endTimePeriod}
            </Text>
          </View>
        )
      })
    }

    const renderSelectedDates = () => {
      if (selectedDates.length == 0 || typeof(selectedDates) == 'undefined' || selectedDates == null) {
        return (<Caption>
          You haven't selected any dates.  Return to the calendar and select your desired dates.
        </Caption>
        )
      }
      return selectedDates.map((date, index, arr) => {
        return (
          <Text style={{margin: 10}}>
          {date}
        </Text>
        )
      })
    }

    const handleSaveTimes = () => {
      let dateObject = {}
      //for every date string we have add it as a key to our object and for the value have an object with a key "times" inside
      for (let i = 0; i < selectedDates.length; i++) {
          dateObject[selectedDates[i]]  =  [...addedTimes] 
      }

      LUPA_CONTROLLER_INSTANCE.addSchedulerTime(dateObject);
    }

    const renderStartTime = () => {
      if (startTime.length == 2) {
        return startTime + ":";
      } else if (startTime.length < 2) {
        setAllowTextChange(true);
      } else {
        return startTime;
      }

 
      if (allowTextChange) {
        return startTime;
      }



      startTime.length < 2 ? startTime + ":" : startTime
      return startTime;
    }

    return (
        <Modal presentationStyle="fullScreen" visible={isVisible} animated={true} animationType="slide">
            <Appbar.Header style={{backgroundColor: '#FFFFFF'}}>
                <Appbar.Action icon={() => <ThinFeatherIcon name="arrow-left" size={20} />}  onPress={closeModal}/>
                <Appbar.Content title="Add Hours" titleStyle={{alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 20}} />
            </Appbar.Header>
            <ScrollView contentContainerStyle={{marginTop: 10}}>
              <View style={{marginVertical: 10, paddingHorizontal: 20,}}>
              <Caption> Add blocks of time your are available for the dates you selected.</Caption>
               <Caption> Note: You must use one hour intervals. </Caption>
              </View>
              <ScrollView centerContent horizontal>
                {renderSelectedDates()}
              </ScrollView>
              <Divider />
              {renderAddedTimes()}
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{}}>
            <Text style={{paddingVertical: 5}}>
              Start time
            </Text>
            <TextInput returnKeyLabel="done" returnKeyType="done" keyboardType="numeric" maxLength={4} value={startTime} onChangeText={text => setStartTime(text)} placeholder="08:00" style={{borderWidth: 1, padding: 10, borderRadius: 3, borderColor: '#EEEEEE'}} />
            </View>

   
            <Menu
          visible={startTimeMenuVisible}
          onDismiss={closeStartTimeMenu}
          anchor={ 
          <TouchableOpacity onPress={openStartTimeMenu}>
              <Text  style={{paddingHorizontal: 10, fontSize: 15}}>
          {startTimePeriod}
          <FeatherIcon name="chevron-down" size={12} />
        </Text>
        </TouchableOpacity>}>
          <Menu.Item onPress={() => setStartTimePeriod("AM")} title="AM" />
          <Menu.Item onPress={() => setStartTimePeriod("PM")} title="PM" />
        </Menu> 
   
           
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{}}>
            <Text style={{paddingVertical: 5}}>
              End time
            </Text>
            <TextInput returnKeyLabel="done" returnKeyType="done" keyboardType="numeric" maxLength={4} value={endTime} onChangeText={text => setEndTime(text)} placeholder="11:00" style={{borderWidth: 1, padding: 10, borderRadius: 3, borderColor: '#EEEEEE'}} />
            </View>
    
            <Menu
          visible={endTimeMenuVisible}
          onDismiss={closeEndTimeMenu}
          anchor={ 
          <TouchableOpacity onPress={openEndTimeMenu}>
              <Text  style={{paddingHorizontal: 10, fontSize: 15}}>
          {endTimePeriod}
          <FeatherIcon name="chevron-down" size={12} />
        </Text>
        </TouchableOpacity>}>
          <Menu.Item onPress={() => setEndTimePeriod("AM")} title="AM" />
          <Menu.Item onPress={() => setEndTimePeriod("PM")} title="PM" />
        </Menu>
          </View>


          <FeatherIcon name="check"  size={24} onPress={addTimes} />
         
</View>
</ScrollView>
<FAB onPress={handleSaveTimes} icon="check" style={{position: 'absolute', bottom: 0, right: 0, margin: 16, backgroundColor: '#1089ff'}} />
      
      </Modal>
    )
}

export default SchedulerModal;