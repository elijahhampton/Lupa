import React, { useState, useEffect } from 'react';

import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Modal,
  SafeAreaView,
} from 'react-native';

import {
  Surface,
  IconButton,
  Button,
  Caption,
  Divider,
  Paragraph
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import CreateCustomWorkoutModal from '../../../workout/program/createprogram/buildworkout/modal/CreateCustomWorkoutModal';
import SchedulerModal from './SchedulerModal';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { useSelector } from 'react-redux';
import LUPA_DB from '../../../../controller/firebase/firebase';
import FeatherIcon from 'react-native-vector-icons/Feather'
import moment from 'moment';

function getMonthString(monthNum) {
  switch(monthNum) {
    case 1:
      return 'January'
    case 2:
      return 'Februrary'
      case 3:
      return 'March'
      case 4:
      return 'April'
      case 5:
      return 'May'
      case 6:
      return 'June'
      case 7:
      return 'July'
      case 8:
      return 'August'
      case 9:
      return 'September'
      case 10:
      return 'October'
      case 11:
      return 'November'
      case 12:
      return 'December'
      default:
        return 'January'
  }
}


const HEIGHT = 800

function LupaCalendar({ captureMarkedDates, isCurrentUser, uuid }) {
  const [markedDates, setMarkedDates] = useState({});
  const [items, setItems] = useState({});

  const [forceUpdate, setForceUpdate] = useState(false);

  const addMarkedDate = (day) => {
    let updatedMarkedDates = markedDates;
    if (Object.keys(updatedMarkedDates).includes(day.dateString)) {
      delete updatedMarkedDates[day.dateString]
      setMarkedDates(updatedMarkedDates)
      captureMarkedDates(day.dateString);
      setForceUpdate(!forceUpdate)
    } else {
      let dateObject = markedDates;
      dateObject[day.dateString] = { startingDay: markedDates.length === 0 ?  true : false, color: '#1089ff', selected: true, marked: true }
      setMarkedDates(dateObject);
      captureMarkedDates(day.dateString);
      setForceUpdate(!forceUpdate)
    }
  }

  const handleDeleteTimeBlock = (day, time) => {
    LUPA_CONTROLLER_INSTANCE.deleteSchedulertimeBlock(day, time);
  }

  const renderTimeBlocks = (timeBlock, year, month, day) => {
    const startTimePeriod = timeBlock.startTimePeriod;
    const endTimePeriod = timeBlock.endTimePeriod;

    let startTime = "", endTime = "";
    if (startTimePeriod == "AM") {
      startTime = Math.abs(12 - Number(timeBlock.startTime.substr(0, 2)));
    } else {
      startTime = timeBlock.startTime.substr(0, 2)
    }

    if (endTimePeriod == "PM") {  
      endTime = Math.abs(12 - Number(timeBlock.endTime.substr(0, 2)));
    } else {
      endTime = timeBlock.endTime.substr(0, 2)
    }


    const updatedStartTime = moment(`${year}-0${month}-${day} ${timeBlock.startTime.split(":")[0]}:${timeBlock.startTime.split(":")[1]}`, 'YYYY-MM-DD hh:mm a')
    const updatedEndTime = moment(`${year}-${month}-${day} ${timeBlock.endTime.split(":")[0]}:${timeBlock.endTime.split(":")[1]}`, 'YYYY-MM-DD hh:mm a')
    let start = moment(updatedStartTime)
    let end = moment(updatedEndTime);

    let blocks = []
    while (start.isSameOrBefore(end)) {
      let parsedTime = start.toString()
      let time = parsedTime.split(" ")[4]

      let updatedTimeFirst = "";
      let updatedTimeSecond = "";

      if (time.split(":")[0].toString().includes('0')) {
        updatedTimeFirst = time.split(":")[0].toString().charAt(1);
      } else {
        updatedTimeFirst = time.split(":")[0].toString();
      }

      updatedTimeSecond = time.split(":")[1].toString()

      updatedTimeOne = updatedTimeFirst + ":" + updatedTimeSecond;
      updatedTimeTwo =  (Number(updatedTimeFirst.charAt(0)) + 1).toString() + ":" + updatedTimeSecond;
      blocks.push(
          [updatedTimeOne, updatedTimeTwo]
      );
     
      start.add(1, 'hour')
    }

    return blocks.map(timeBlock => {
      return(
        <View style={[isCurrentUser === true ? styles.userTimeOptions : null  ,{padding: 10, paddingHorizontal: 20, borderRadius: 10, backgroundColor: '#E5E5E5', marginVertical: 5, alignItems: 'center',  width: Dimensions.get('window').width - 20, alignSelf: 'center'}]}>
   
<Text>
        <Text style={styles.timeBlockNumbers}>
          {timeBlock[0]}
        </Text>
        <Text>
          {" "}-{" "}
        </Text>
        <Text style={styles.timeBlockNumbers}>
          {timeBlock[1]}
        </Text>
      </Text>

      {isCurrentUser === true ? <FeatherIcon name="x" color="black" size={24} /> : null}
        </View>
      );
    })
  }

  useEffect(() => {
      const currUserSubscription = LUPA_DB.collection('users').doc(uuid).onSnapshot(async documentSnapshot => {
        let userData = await documentSnapshot.data()
        setItems(userData.scheduler_times);
    })

  return () => currUserSubscription()
  }, []);

  return (
    <View style={styles.container}>
          <Agenda
    markingType="period"
  // The list of items that have to be displayed in agenda. If you want to render item as empty date
  // the value of date key has to be an empty array []. If there exists no value for date key it is
  // considered that the date in question is not yet loaded
  items={items}
  // Callback that gets called when items for a certain month should be loaded (month became visible)
  loadItemsForMonth={(month) => {console.log('trigger items loading')}}
  displayLoadingIndicator={false}
  dayLoading={false}
  // Callback that fires when the calendar is opened or closed
  onCalendarToggled={(calendarOpened) => {console.log(calendarOpened)}}
  // Callback that gets called on day press
  onDayPress={(day)=> addMarkedDate(day)}
  
  // Callback that gets called when day changes while scrolling agenda list
  onDayChange={(day)=>{console.log('day changed')}}
  // Initially selected day
  selected={null}
  // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
  minDate={Date()}
  // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
  maxDate={'2020-31-12'}
  // Max amount of months allowed to scroll to the past. Default = 50
  pastScrollRange={50}
  // Max amount of months allowed to scroll to the future. Default = 50
  futureScrollRange={50}
  // Specify how each item should be rendered in agenda
  renderItem={(item, firstItemInDay) =>  <View />}
  // Specify how each date should be rendered. day can be undefined if the item is not first in that day.
  renderDay={(day, item) => {
    if (typeof(day) == 'undefined' || typeof(item) == 'undefined') {
      return;
    }

    const times = item.times;
    const list = times.map(time => {
      return (
        <View style={{paddingHorizontal: 20, width: Dimensions.get('window').width}}>
                  <View>
                    {renderTimeBlocks(time, day.year, day.month, day.day)}

                  </View>

                {/*  <View>
                  {isCurrentUser === true ? <Feather1s name="x" size={20} onPress={() => handleDeleteTimeBlock(day, time)}/> : null}
                </View>*/}

          </View>
      )
    });

    return (
      <View style={{height: HEIGHT, backgroundColor: 'white', width: '100%'}}>
        <View style={{justifyContent: 'flex-start', alignItems: 'center'}}>
        <Text style={{ fontSize: 20, fontFamily: 'Avenir-Light'}}>
      {day.day}
</Text>
<Text style={{fontSize: 10}}>
      {getMonthString(day.month)}
      </Text>
        </View>
        
<View>
{list}
</View>
<Divider style={{marginVertical: 5}} />
</View>
    )
  }}
  // Specify how empty date content with no items should be rendered
  renderEmptyDate={() => {return (<View />);}}
  // Specify how agenda knob should look like
  //renderKnob={() => {return (<View />);}}
  // Specify what should be rendered instead of ActivityIndicator
  renderEmptyData = {() => {return <View />}}
  // Specify your item comparison function for increased performance
  rowHasChanged={() => {return true}}
  // Hide knob button. Default = false
  hideKnob={false}
  // By default, agenda dates are marked if they have at least one item, but you can override this if needed
  markedDates={markedDates}
  // If disabledByDefault={true} dates flagged as not disabled will be enabled. Default = false
  disabledByDefault={true}
  // If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly.
  onRefresh={() => console.log('refreshing...')}
  // Set this true while waiting for new data from a refresh
  refreshing={false}
  // Add a custom RefreshControl component, used to provide pull-to-refresh functionality for the ScrollView.
  refreshControl={null}
  // Agenda theme
  theme={{
    agendaDayTextColor: 'yellow',
    agendaDayNumColor: 'green',
    agendaTodayColor: 'red',
    agendaKnobColor: 'rgb(199, 199, 204)',
    backgroundColor: 'rgb(248, 248, 248)',
  }}å

  // Agenda container style
  style={{height: HEIGHT}}
/>
    </View>
    );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: HEIGHT,
  },
  dateHeading: {
      margin: 10,
      fontSize: 15,
      fontFamily: 'Avenir-Heavy'
  },
  timePeriod: {
    fontFamily: 'Avenir-Roman',
    fontSize: 15
  },
  timeBlockNumbers: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Avenir'
  },
  userTimeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})

export default LupaCalendar;