import React, { createRef, useState } from 'react';

import {
    Modal,
    View,
    TextInput,
    Text,
    Button as NativeButton, Dimensions,     SafeAreaView,
} from 'react-native';
 
import { Divider, Appbar, FAB, Caption, Menu, Provider, Button } from 'react-native-paper';
import ThinFeatherIcon from 'react-native-feather1s'
import FeatherIcon from 'react-native-vector-icons/Feather'
import Feather1s from 'react-native-feather1s/src/Feather1s';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import LupaController from '../../../../controller/lupa/LupaController';
import RBSheet from 'react-native-raw-bottom-sheet';
import moment from 'moment';

import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector } from 'react-redux';

function SchedulerModal({ closeModal, isVisible, displayDate, entryDate }) {
  const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance()

  const startTimePickerRef = createRef();
  const endTimePickerRef = createRef();

  const [startTime, setStartTime] = useState(new Date(1598051730000))
  const [startTimeFormatted, setStartTimeFormatted] = useState(moment(new Date(1598051730000)).format('LT').toString())
  const [endTimeFormatted, setEndTimeFormatted] = useState(moment(new Date(1598051730000)).format('LT').toString())
  const [endTime, setEndTime] = useState(new Date(1598051730000))

    const [addedTimes, setAddedTimes] = useState([]);

    const [markedDates, setMarkedDates] = useState([])

    const [startTimePeriod, setStartTimePeriod] = useState("AM")
    const [endTimePeriod, setEndTimePeriod] = useState("PM")

    const [startTimeMenuVisible, setStartTimeMenuVisible] = useState(false);
    const [endTimeMenuVisible, setEndTimeMenuVisible] = useState(false);

    const [editHoursModalVisible, setEditHoursModalVisible] = useState(false)

    const [allowTextChange, setAllowTextChange] = useState(0);

    const openStartTimeMenu = () => setStartTimeMenuVisible(true);
  
    const closeStartTimeMenu = () => setStartTimeMenuVisible(false);

    const openEndTimeMenu = () => setEndTimeMenuVisible(true);
  
    const closeEndTimeMenu = () => setEndTimeMenuVisible(false);

    const currUserData = useSelector(state => {
      return state.Users.currUserData;
    })

    const addTimes = () => {
      const timeBlock = {
        startTime: startTime,
        endTime: endTime,
      }

      setAddedTimes(prevState => prevState.concat(timeBlock));
    }

    const createTimeBlockArray = () => {
      let times = [moment(startTime).format('LT').toString()];
      let time = startTime
      while (moment(time).isSameOrBefore(endTime)) {
        time = moment(time).add(1, 'hour');
        times.push(moment(time).format('LT').toString())
      }

      return times;
    }

    const handleOnSave = () => {
      if (typeof(entryDate) == 'undefined') {
        return;
      }

      const times = createTimeBlockArray();

      const timeBlock = {
        startTime: moment(startTime).toISOString(),
        endTime: moment(endTime).toISOString(),
        times: times
      }

      let currentSchedulerTimes  = currUserData.scheduler_times;
      if (typeof(currentSchedulerTimes[entryDate]) == 'undefined') {
        currentSchedulerTimes[entryDate] = [timeBlock]
      } else {
        let times  =  currentSchedulerTimes[entryDate];
        times.push(timeBlock);
        currentSchedulerTimes[entryDate] = times;
      }

      if (Object.keys(currentSchedulerTimes).includes("")) {
        closeModal();
        return;
      }
      LUPA_CONTROLLER_INSTANCE.updateCurrentUser('scheduler_times', currentSchedulerTimes, 'update')

      closeModal();
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

    const onChangeStartTime = (event, date) => {
      const currentDate = date;
      const currentDateFormatted = moment(new Date(date)).format('LT').toString()
      setStartTime(currentDate);
      setStartTimeFormatted(currentDateFormatted)
    };

    const onChangeEndTime = (event, date) => {
      const currentDate = date;
      const currentDateFormatted = moment(new Date(date)).format('LT').toString()
      setEndTime(currentDate);
      setEndTimeFormatted(currentDateFormatted)
    }

    const renderStartTimePicker = () => {
      return (
        <RBSheet
        ref={startTimePickerRef}
        height={300}
        customStyles={{
          container: {
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
          }
        }}>
          <View style={{flex: 1}}>
          <DateTimePicker
          value={startTime}
          mode='time'
          is24Hour={false}
          display='spinner'
          onChange={onChangeStartTime}
        />
          </View>
          <View>
            <Button onPress={handleOnPickStartTime} color="#1089ff" mode="contained" contentStyle={{height: 45, width: Dimensions.get('window').width - 50,}}  style={{marginVertical: 10, borderRadius: 8, elevation: 0, height: 45, alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width - 50, alignSelf: 'center'}}>
              Done
            </Button>
            <SafeAreaView />
          </View>
        </RBSheet>
      )
    }
    
const renderEndTimePicker = () => {
return (
  <RBSheet
  ref={endTimePickerRef}
  customStyles={{
    container: {
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
    }
  }}
  height={300}>
    <View style={{flex: 1}}>
    <DateTimePicker
          value={endTime}
          mode='time'
          is24Hour={false}
          display='spinner'
          onChange={onChangeEndTime}
        />
    </View>
    <View>
            <Button onPress={handleOnPickEndTime} color="#1089ff" mode="contained" contentStyle={{height: 45, width: Dimensions.get('window').width - 50,}} style={{borderRadius: 8, marginVertical: 10, elevation: 0, height: 45, alignItems: 'center', justifyContent: 'center',  alignSelf: 'center'}}>
              Done
            </Button>
            <SafeAreaView />
          </View>
  </RBSheet>
)
    }

    const openStartTimePicker = () => startTimePickerRef.current.open();
    const closeStartTimePicker = () => startTimePickerRef.current.close();

    const openEndTimePicker = () => endTimePickerRef.current.open();
    const closeEndTimePicker = () => endTimePickerRef.current.close();

    const [startTimeIsSet, setStartTimeIsSet] = useState(false);
    const [endTimeIsSet, setEndTimeIsSet] = useState(false);

    const handleOnPickStartTime = () => {
      setStartTimeIsSet(true);
      closeStartTimePicker();
    }

    const handleOnPickEndTime = () => {
      setEndTimeIsSet(true);
      closeEndTimePicker();
    }

    handleOnSaveTimeBlock = () => {

    }

    return (
        <Modal presentationStyle="fullScreen" visible={isVisible} animated={true} animationType="slide">
            <Appbar.Header style={{backgroundColor: '#FFFFFF', elevation: 0,         borderBottomWidth: 0.5, borderColor: 'rgb(174, 174, 178)',}}>
                <Appbar.BackAction onPress={closeModal} />
                <Appbar.Content title="Update Availability" titleStyle={{alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 25}} />
                <Button color="#1089ff" onPress={handleOnSave}>
                  Save
                </Button>
            </Appbar.Header>
              <View style={{padding: 10}}>
                <Text style={{fontWeight: '600'}}>
                  {moment(displayDate).format('LL').toString()}
                </Text>
                <Caption>
                  Add a time block you are available for this date.
                </Caption>
              </View>
              <Divider />
              {renderAddedTimes()}
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-evenly',  width: '100%'}}>
         <View style={{alignItems: 'center'}}>
         <NativeButton title="Select start time" onPress={openStartTimePicker} />
        {
          startTimeIsSet &&
          <Caption>
           {startTimeFormatted}
         </Caption>
  
        }
               </View>
         
        

        <View style={{alignItems: 'center'}}>
        <NativeButton title="Select end time" onPress={openEndTimePicker} />
        {
          endTimeIsSet &&
          <Caption>
                 {endTimeFormatted}
         </Caption>
  
        }
        </View>
        
         
</View>
      {renderStartTimePicker()}
      {renderEndTimePicker()}

      </Modal>
    )
}

export default SchedulerModal;