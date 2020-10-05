import React, { useState, createRef, useEffect } from 'react';

import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Button as NativeButton,
  Modal,
  SafeAreaView,
} from 'react-native';

import {
  Surface,
  IconButton,
  Button,
  Snackbar,
  Caption,
  Divider,
  Paragraph, 
  Dialog, 
  Portal, Checkbox, HelperText
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
import { getLupaUserStructure } from '../../../../controller/firebase/collection_structures';

import RBSheet from 'react-native-raw-bottom-sheet'
import getBookingStructure from '../../../../model/data_structures/user/booking';
import LupaController from '../../../../controller/lupa/LupaController';

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
  const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

  const currUserData = useSelector(state => {
    return state.Users.currUserData;
  });

  const [markedDates, setMarkedDates] = useState({});
  const [displayDate, setDisplayDate] = useState(new Date());
  const [entryDate, setEntryDate] = useState('');
  const [items, setItems] = useState({});
  const [userData, setUserData] = useState(getLupaUserStructure())

  const [forceUpdate, setForceUpdate] = useState(false);
  const [editHoursModalVisible, setEditHoursModalVisible] = useState(false);

  const startTimePickerRef = createRef();
  const endTimePickerRef = createRef();

  const [snackBarMessage, setSnackBarMessage] = useState("")
  const [snackBarVisible, setSnackBarVisible] = useState(false)

  const onToggleSnackBar = () => setVisible(!snackBarVisible);

  const onDismissSnackBar = () => setSnackBarVisible(false);


  const [startTime, setStartTime] = useState(new Date(1598051730000))
  const [startTimeFormatted, setStartTimeFormatted] = useState(new Date(1598051730000))
  const [endTimeFormatted, setEndTimeFormatted] = useState(new Date(1598051730000))
  const [endTime, setEndTime] = useState(new Date(1598051730000))
  const openStartTimePicker = () => startTimePickerRef.current.open();
    const closeStartTimePicker = () => startTimePickerRef.current.close();

    const openEndTimePicker = () => endTimePickerRef.current.open();
    const closeEndTimePicker = () => endTimePickerRef.current.close();

    const [startTimeIsSet, setStartTimeIsSet] = useState(false);
    const [endTimeIsSet, setEndTimeIsSet] = useState(false);

    const [bookingRequestDialogVisible, setBookingRequestDialogVisible] = useState(false);

    const handleOnPickStartTime = () => {
      setStartTimeIsSet(true);
      closeStartTimePicker();
    }

    const handleOnPickEndTime = () => {
      setEndTimeIsSet(true);
      closeEndTimePicker();
    }

  const addMarkedDate = (day) => {
    let updatedMarkedDates = {}
    updatedMarkedDates[day.dateString] = {marked: true, color: '#1089ff', selected: true}
    setDisplayDate(moment(day.dateString).format('LL').toString())
    setEntryDate(day.dateString.toString());
    setMarkedDates(updatedMarkedDates)
    
  }

  const renderTimeBlocks = (timeBlock, year, month, day) => {
  if (typeof(timeBlock) == 'undefined') {
    return;
  }

    return timeBlock.map(timeBlock => {
      return(
        <Surface style={{elevation: 0,borderRadius: 3, alignItems: 'center', backgroundColor: 'white', borderWidth: 0.5, borderColor: '#E5E5E5', padding: 20,  marginVertical: 15, width: Dimensions.get('window').width - 20, alignSelf: 'center'}}>

          <Text style={{fontFamily: 'Avenir-Heavy',  alignSelf: 'flex-start', fontSize: 15}}>
            {moment(timeBlock.startTime).format('LT').toString()} - {moment(timeBlock.endTime).format('LT').toString()}
          </Text>
          
        </Surface>
      );
    })
  }

  const handleCloseRequestBookingDialog = () => {
    onCloseRequestBookingDialog();
    setBookingRequestDialogVisible(false);
  }

  const handleOpenRequestBookingDialog = () => {
    setBookingRequestDialogVisible(true)
  }

  const onCloseRequestBookingDialog = () => {
    //reset state
  }

  const handleOnRequestBooking = () => {
    if (moment(endTime).isBefore(moment(startTime))) {
      //invalid times
      setSnackBarMessage('Invalid time period.')
      setSnackBarVisible(true);
      return;
    } 

   /* if (!moment(endTime).subtract(60, 'minutes').isSame(moment(startTime)) || !moment(endTime).subtract(90, 'minutes').isSame(moment(startTime))) {
      //check time intervals
      alert('uh')
      setSnackBarMessage('Bookings must be in 60 or 90 minutes intervals.');
      setSnackBarVisible(true);
      return;
    }*/

    const trainerUUID = uuid;
    const requesterUUID = currUserData.user_uuid;
    const isSet = false;

    //create a booking structure
    const booking = getBookingStructure(moment(startTime).format('LT').toString(), moment(endTime).format('LT').toString(), trainerUUID, requesterUUID, isSet, entryDate)

    //send to backend
     LUPA_CONTROLLER_INSTANCE.createBookingRequest(booking);

     handleCloseRequestBookingDialog();
  }

  const renderBookingRequestDialog = () => {
   
    return (
      <Portal>
        <Dialog visible={bookingRequestDialogVisible} style={{alignSelf: 'center', width: Dimensions.get('window').width - 20}}>
          <Dialog.Title>
            Book {userData.display_name}
          </Dialog.Title>
          <Dialog.Content>
          <Caption>
          You are about to book a session with Elijah Hampton on {displayDate.toString()}. Choose a time block from the requested interval.
        </Caption>

      <View style={{marginTop: 30, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-evenly'}}>
      <View style={{marginVertical: 10}}>
        <Text>
          Start Time
        </Text>
      <NativeButton title={startTimeIsSet ? startTimeFormatted.toString() : 'Choose a start time'} onPress={openStartTimePicker} />
      </View>

      <View  style={{marginVertical: 10}}>
        <Text>
          End Time
        </Text>
        <NativeButton title={endTimeIsSet ? endTimeFormatted.toString() : 'Choose an end time'} onPress={openEndTimePicker} />
      </View>

      </View>


      {
      snackBarVisible && true ?
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
           <FeatherIcon name="alert-circle" color='#f44336' />
           <HelperText style={{color: '#f44336'}}>
     
     {snackBarMessage}
   </HelperText>
      </View>
    
      :
      null
      }


          </Dialog.Content>

          <Dialog.Actions>
            <Button color="#1089ff" onPress={handleCloseRequestBookingDialog}>
              Cancel
            </Button>

            <Button color="#1089ff" onPress={handleOnRequestBooking}>
              Request
            </Button>
          </Dialog.Actions>
        </Dialog>
      
      </Portal>
    )
  }

  const renderStartTimePicker = () => {
    return (
      <RBSheet
      ref={startTimePickerRef}
      height={300}
      customStyles={
        wrapper={

        },
        container={
          
        }
      }>
        <View style={{flex: 1}}>
        <DateTimePicker
        value={startTime}
        mode='time'
        is24Hour={false}
        display="default"
        onChange={onChangeStartTime}
      />
        </View>
        <SafeAreaView>
          <Button onPress={handleOnPickStartTime} color="#1089ff" mode="contained" style={{marginVertical: 10, elevation: 0, height: 45, alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width - 50, alignSelf: 'center'}}>
            Done
          </Button>
        </SafeAreaView>
      </RBSheet>
    )
  }
  
  const renderEndTimePicker = () => {
return (
<RBSheet
ref={endTimePickerRef}
height={300}>
  <View style={{flex: 1}}>
  <DateTimePicker
        value={endTime}
        mode='time'
        is24Hour={false}
        display="default"
        onChange={onChangeEndTime}
      />
  </View>
  <View>
          <Button onPress={handleOnPickEndTime} color="#1089ff" mode="contained" style={{marginVertical: 15, elevation: 0, height: 45, alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width - 50, alignSelf: 'center'}}>
            Done
          </Button>
          <SafeAreaView />
        </View>
</RBSheet>
)
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

  const renderSchedulerActions = () => {
    if (currUserData.user_uuid == userData.user_uuid) {
     return ( <Button onPress={() => setEditHoursModalVisible(true)} color="#1089ff" icon={() => <Feather1s name="plus" />}>
      <Text style={{fontSize: 12}}>
      Update Available Hours
      </Text>
    </Button>
     )
    } else {
      if (typeof(items[entryDate]) == 'undefined') {
        return null;
      }

     return ( 
     <Button onPress={handleOpenRequestBookingDialog} color="#1089ff" icon={() => <Feather1s name="calendar" />}>
      <Text style={{fontSize: 12}}>
      Book Me
      </Text>
    </Button>
     )
    }

  }

  useEffect(() => {
      const currUserSubscription = LUPA_DB.collection('users').doc(uuid).onSnapshot(async documentSnapshot => {
        let userData = await documentSnapshot.data()
        setUserData(userData);
        setItems(userData.scheduler_times);
    });

    async function setBeginningEntryDate() {
      const year = new Date().getFullYear();
      let day = new Date().getDate();
      if (day.toString().length === 1) {
        day = "0" + day;
      }
  
      //TODO: 
      let month = new Date().getMonth() + 1;
      if (month.toString().length === 1) {
        month = "0" + month;
      }
  
      const entryDateString = year + "-" + month + "-" + day;
      await setEntryDate(entryDateString)
    }

  
    setBeginningEntryDate()
  return () => currUserSubscription()
  }, []);

  return (
    <View style={styles.container}>
         <Button onPress={handleOpenRequestBookingDialog} color="#1089ff" icon={() => <Feather1s name="calendar" />}>
      <Text style={{fontSize: 12}}>
      Book Me
      </Text>
    </Button>
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
  selected={new Date()}
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
 
    return (
      <View style={{height: HEIGHT, backgroundColor: 'white', width: '100%'}}>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10}}>
        <View style={{justifyContent: 'flex-start', alignItems: 'center'}}>
        <Text style={{ fontSize: 20, fontFamily: 'Avenir-Light'}}>
      {day.day}
</Text>
<Text style={{fontSize: 10}}>
      {getMonthString(day.month)}
      </Text>
        </View>

      {renderSchedulerActions()}


             </View>
       
      
        {renderTimeBlocks(items[entryDate])}
<View>
     
</View>
</View>
    )
  }}
  // Specify how empty date content with no items should be rendered
  renderEmptyDate={() => {
    return (
<View style={{height: HEIGHT, backgroundColor: 'white', width: '100%'}}>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10}}>
        <View style={{justifyContent: 'flex-start', alignItems: 'center'}}>
        <Text style={{ fontSize: 20, fontFamily: 'Avenir-Light'}}>
  
</Text>
<Text style={{fontSize: 10}}>
      {getMonthString(day.month)}
      </Text>
        </View>

        {renderSchedulerActions()}
          </View>
      
        
<View>

</View>
<Divider style={{marginVertical: 5}} />
</View>
  )}}
  // Specify how agenda knob should look like
  //renderKnob={() => {return (<View />);}}
  // Specify what should be rendered instead of ActivityIndicator
  renderEmptyData = {() => {
    return (
<View style={{height: HEIGHT, backgroundColor: 'white', width: '100%'}}>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10}}>
        <View style={{justifyContent: 'flex-start', alignItems: 'center'}}>
        <Text style={{ fontSize: 20, fontFamily: 'Avenir-Light'}}>
  
</Text>
<Text style={{fontSize: 10}}>
      
      </Text>
        </View>

        {renderSchedulerActions()}


          </View>
      
        
<View>

</View>
<Divider style={{marginVertical: 5}} />
</View>
  )}}
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
    selectedDayTextColor: 'black',
    agendaDayTextColor: 'yellow',
    agendaDayNumColor: 'green',
    agendaTodayColor: 'red',
    agendaKnobColor: 'rgb(199, 199, 204)',
    backgroundColor: 'rgb(248, 248, 248)',
  }}

  // Agenda container style
  style={{height: HEIGHT}}
/>
{renderBookingRequestDialog()}
{renderStartTimePicker()}
{renderEndTimePicker()}

<SchedulerModal isVisible={editHoursModalVisible} closeModal={() => setEditHoursModalVisible(false)} displayDate={displayDate} entryDate={entryDate} />
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