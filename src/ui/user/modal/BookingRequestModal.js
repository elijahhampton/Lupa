import React, { useState, useEffect, createRef } from 'react';

import {
    View,
    Text, 
    StyleSheet,
    Button as NativeButton,
    Dimensions,
    TextInput,
    Share,
    Image,
    ActionSheetIOS,
    SafeAreaView,
    Modal,
    TouchableWithoutFeedback,
} from 'react-native';

 

import {
    Appbar,
    Caption,
    Dialog,
    Button,
    Surface,
    HelperText,
    Paragraph,
    Snackbar,
    Provider,
    Checkbox,
    Divider,
    Avatar,
    RadioButton,
    Menu
} from 'react-native-paper';

import FeatherIcon from 'react-native-vector-icons/Feather';
import RNSwipeVerify from 'react-native-swipe-verify'
import RBSheet from 'react-native-raw-bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios'
import moment from 'moment';
import { LinearGradient } from 'expo-linear-gradient';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import { ScrollView } from 'react-native-gesture-handler';
import { Constants } from 'react-native-unimodules';
import { useSelector } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import { useNavigation } from '@react-navigation/native';
import LupaController from '../../../controller/lupa/LupaController'
import { getNewBookingStructure } from '../../../model/data_structures/user/booking';
import LUPA_DB, { LUPA_AUTH } from '../../../controller/firebase/firebase';
import { BOOKING_STATUS, SESSION_TYPE } from '../../../model/data_structures/user/types';
import { initStripe, stripe, CURRENCY, STRIPE_ENDPOINT, LUPA_ERR_TOKEN_UNDEFINED} from '../../../modules/payments/stripe';
import LOG, { LOG_ERROR } from '../../../common/Logger';
import { getLupaStoreState } from '../../../controller/redux';
import { Input } from 'react-native-elements';
import { KeyboardAvoidingView } from 'react-native';
import { extractDateStringFromFormattedMoment, extractDateStringFromMoment } from '../../../common/service/DateTimeService';
import FullScreenLoadingIndicator from '../../common/FullScreenLoadingIndicator';

const BookingRequestModal = React.forwardRef(({trainer, closeModal, isVisible, preFilledStartTime, preFilledEndTime, preFilledDate, preFilledTrainerNote}, ref) => {
  const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

  const LUPA_STATE = useSelector(state => {
    return state;
  });

  const navigation = useNavigation();

  const startTimePickerRef = createRef();
  const endTimePickerRef = createRef();
  const bookingRef = createRef();
  const swipeToVerifyRef = createRef();

  const [showCardNeededDialog, setShowCardNeededDialogVisible] = useState(false);
  const [bookingCreationError, setBookingCreationErrorDialogVisible] = useState(false);

  const [timingBlockDuration, setTimingBlockDuration] = useState(60);

  const [startTime, setStartTime] = useState(new Date())
  const [startTimeFormatted, setStartTimeFormatted] = useState(moment(new Date()).format('LT').toString())
  const [endTimeFormatted, setEndTimeFormatted] = useState(moment(new Date()).add(60, 'minutes').format('LT').toString());
  const [endTime, setEndTime] = useState(new Date(1598051730000))
  const openStartTimePicker = () => startTimePickerRef.current.open();
  const closeStartTimePicker = () => startTimePickerRef.current.close();
  const openDatePicker = () => bookingRef.current.open();
  const closeDatePicker = () => bookingRef.current.close();
  const [trainerNote, setTrainerNote] = useState(typeof(preFilledTrainerNote) == 'undefined' ? "" : preFilledTrainerNote)
  const [sessionType, setSessionType] = useState(SESSION_TYPE.IN_PERSON)

  const [startTimeIsSet, setStartTimeIsSet] = useState(false);
  const [endTimeIsSet, setEndTimeIsSet] = useState(false);
  const [currPage, setCurrPage] = useState(0);
  const [sessionMenuVisible, setSessionMenuVisible] = useState(false)
  const [bookingDisplayDate, setBookingDisplayDate] = useState(moment(new Date()).format('LL').toString());
  const [bookingDate, setBookingDate] = useState(new Date());
  const [sessionTypeDialogIsVisible, setSessionTypeDialogIsVisible] = useState(false);
  const [creatingBookingSession, setIsCreatingBookingSession] = useState(false);
  const [cardAddedToStripeStatus, setCardAddedToStripeStatus] = useState(false)
  const [timeBlockDialogVisible, setTimeBlockDialogVisible] = useState(false);
  const updatedUserData = getLupaStoreState().Users.currUserData;

  const [confirmingSession, setConfirmingSession] = useState(false);

  useEffect(() => {
    setBookingDate(preFilledDate || bookingDate)
    setBookingDisplayDate(moment(bookingDate).format('LL').toString())

    if (typeof(preFilledStartTime) != 'undefined') {
      setStartTime(preFilledStartTime)
      setStartTimeFormatted(moment(preFilledStartTime).format('LT').toString())
      
      setEndTime(moment(preFilledStartTime).add(1, 'hour').format())
      setEndTimeFormatted(moment(preFilledStartTime).add(1, 'hour').format('LT').toString())
    } else {
      setStartTime(moment())
      setStartTimeFormatted(moment().format('LT').toString())

      setEndTime(moment().add(1, 'hour'))
      setEndTimeFormatted(moment().add(1, 'hour').format('LT').toString())
    }
   
  }, [preFilledStartTime])

  const renderSessionTypeDialog = () => {
    return (
      <Dialog 
      visible={sessionTypeDialogIsVisible} 
      style={{alignSelf: 'center', width: Dimensions.get('window').width - 20, padding: 20}}>
        <Dialog.Title>
          Choose a session type
        </Dialog.Title>
        <Dialog.Content>
        <View>
          <View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <RadioButton.Android color="#1089ff" status={sessionType == SESSION_TYPE.REMOTE ? 'checked' : 'unchecked'} onPress={() => setSessionType(SESSION_TYPE.REMOTE)} />
                        <Text style={{fontFamily: 'Avenir-Heavy', fontSize: 16}}>
                            Remote
                        </Text>
                    </View>
                    <Caption>
                      Complete a remote session over video.
                    </Caption>
          </View>


      <View>
                    <View style={{marginVertical: 10, flexDirection: 'row', alignItems: 'center'}}>
                        <RadioButton.Android color="#1089ff" status={sessionType == SESSION_TYPE.IN_PERSON ? 'checked' : 'unchecked'} onPress={() => setSessionType(SESSION_TYPE.IN_PERSON)} />
                        <Text style={{fontFamily: 'Avenir-Heavy', fontSize: 16}}>
                            In Person
                        </Text>
                    </View>
                    <Caption>
                      Meet with your trainer at their specified gym or workout location.
                    </Caption>
                    </View>
                </View>
        </Dialog.Content>

        <Dialog.Actions>
          <Button color="#1089ff" uppercase={false} onPress={() => setSessionTypeDialogIsVisible(false)}>
            <Text style={{ fontFamily: 'Avenir' }}>
              Done
            </Text>
          </Button>
        </Dialog.Actions>
      </Dialog>
    )
  }

  const renderDisplayDatePicker = () => {
    return (
      <RBSheet
      ref={bookingRef}
      height={350}>
        <View style={{flex: 1}}>
        <DateTimePicker
        value={bookingDate}
        mode='date'
        is24Hour={false}
        display='spinner'
        onChange={onChangeDisplayDate}
      />
        </View>
        <SafeAreaView>
          <Button onPress={handleOnPickDate} color="#1089ff" mode="contained" style={{marginVertical: 10, elevation: 0, height: 45, alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width - 50, alignSelf: 'center'}}>
            Done
          </Button>
        </SafeAreaView>
      </RBSheet>
    )
  }

  const renderStartTimePicker = () => {
      return (
        <RBSheet
        ref={startTimePickerRef}
        height={300}>
          <View style={{flex: 1}}>
          <DateTimePicker
          value={new Date(startTime)}
          mode='time'
          is24Hour={false}
          display='spinner'
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
  

    const handleOnPickStartTime = () => {
      setStartTimeIsSet(true);
      setEndTime(moment(startTime).add(timingBlockDuration, 'minutes').toDate());
      setEndTimeFormatted(moment(startTime).add(timingBlockDuration, 'minutes').format('LT').toString());
      closeStartTimePicker();
    }


    const handleOnPickDate = () => {
      closeDatePicker()
    }

    const renderBookingCreationErrorDialog = () => {
      return (
        <Dialog visible={bookingCreationError} style={{height: 'auto'}}>
              
              <Dialog.Title>
                Something went wrong
              </Dialog.Title>

              <Dialog.Content>
                <Text style={{color: 'rgb(144, 144, 144)'}}>
                  There was an error while trying to create your booking request.  Please make sure the card you are using is valid.  If so, cancel and try again.
                </Text>

              </Dialog.Content>

              <Dialog.Actions style={{alignItems: 'center', justifyContent: 'center'}}>
                <Button 
                onPress={() => setBookingCreationErrorDialogVisible(false)}
                uppercase={false} 
                mode="contained" 
                color="#23374d"
                style={{elevation: 0, padding: 5}}
                theme={{roundness: 8}}>
                  Confirm
                </Button>
              </Dialog.Actions>
        </Dialog>
      )
    }
  
   const onChangeStartTime = (event, date) => {
      const currentDate = date;
      const currentDateFormatted = moment(date).format('LT').toString()
      setStartTime(currentDate);
      setStartTimeFormatted(currentDateFormatted)
      setStartTimeIsSet(true)
    };

    const onChangeDisplayDate = (event, date) => {
      const currentDate = date;
      const currentDateFormatted = moment(new Date(date)).format('LL').toString();
      setBookingDisplayDate(currentDateFormatted);
      setBookingDate(currentDate);
    }

    const handleOnRequest = async () => {
      setConfirmingSession(true)
      const updatedUserData = getLupaStoreState().Users.currUserData;
      if (updatedUserData.stripe_metadata.card_added_to_stripe == false) {
        setShowCardNeededDialogVisible(true)
        return;
      }

      const booking = getNewBookingStructure(moment(startTime).format(), moment(endTime).format(), extractDateStringFromFormattedMoment(moment(bookingDate).format().toString()), new Date(), trainer.user_uuid, LUPA_STATE.Users.currUserData.user_uuid, trainerNote, sessionType);
      const booking_id = booking.uid;

      try {
        await LUPA_CONTROLLER_INSTANCE.createBookingRequest(booking, true);
        resetState();
        setConfirmingSession(false);
        closeModal()
      } catch(error) {
        LOG_ERROR('BookingRequestModal.js', 'Failed to creating booking.', error);
        //delete booking if it was created
        //check if booking was ever created?
        LUPA_CONTROLLER_INSTANCE.deleteBooking(booking_id, trainer.user_uuid, LUPA_STATE.Users.currUserData.user_uuid);
        //show warning to user
        setBookingCreationErrorDialogVisible(true);
        resetState();
        setConfirmingSession(false);
      }
  }

  const handleNavigateToConfirmation = () => {
    if (moment(bookingDate).diff(moment(), 'days') < 0) {
      alert('You must pick a date on or before the current day!')
      return;
    } 

    setCurrPage(1)
  }

    const handleNavigateToSettings = () => {
      closeModal();
      setShowCardNeededDialogVisible(false);
      resetState();
      navigation.push('Settings');
    }

    const resetState = () => {
      setCurrPage(0)
      setTrainerNote("")
      setStartTime(new Date())
      setStartTimeFormatted(moment(new Date()).format('LT').toString())
      setBookingDate(new Date())
      setBookingDisplayDate(moment(new Date()).format('LL').toString())
    }

    const renderCardNeededDialog = () => {
      return (
        <Dialog visible={showCardNeededDialog} style={{borderRadius: 12, height: 'auto', width: Dimensions.get('window').width - 20, alignSelf: 'center'}}>

              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              <Dialog.Title style={{alignSelf: 'center', fontWeight: 'bold', fontFamily: 'Avenir-Heavy'}}>
                No Card Found
              </Dialog.Title>
              </View>

           

              <Dialog.Content style={{alignSelf: 'flex-start', justifyContent: 'center'}}>
                <Paragraph style={{fontFamily: 'Avenir'}}>
                  Lupa requires that you have a card saved before booking a session.  
                </Paragraph>

              </Dialog.Content>

              <Dialog.Actions style={{alignItems: 'center', justifyContent: 'flex-end'}}>
            
                <Button 
                onPress={handleNavigateToSettings}
                uppercase={false} 
                mode="contained" 
                color="#23374d"
                style={{elevation: 0, marginHorizontal: 5}}
                contentStyle={{padding: 3}}
                theme={{roundness: 8}}>
                  Go to settings
                </Button>
              

              </Dialog.Actions>
        </Dialog>
      )
    }

  const renderComponent = () => {
    switch(currPage) {
      case 0:
        return (
          <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
          <KeyboardAvoidingView style={{flex: 1}}>


  <View style={{flex: 1, justifyContent: 'space-evenly'}}>
  <Text style={{fontFamily: 'Avenir-Heavy', fontSize: 20, paddingHorizontal: 20}}>
              Schedule a session with {trainer.display_name}
            </Text>

<View style={{paddingHorizontal: 20}}>
  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
  <Text style={{fontFamily: 'Avenir-Medium', fontSize: 16}}>
    Session Type
  </Text>
  
  <View style={{flexDirection: 'row', alignItems: 'center'}}>

  <FeatherIcon name="chevron-down" style={{paddingRight: 5}} />
  <Text onPress={() => setSessionTypeDialogIsVisible(true)} style={{ color: '#1089ff' }}>
    {sessionType == SESSION_TYPE.REMOTE ? 'Remote' : 'In Person'}
  </Text>

  </View>

  </View>
</View>

<Divider />

<View style={{paddingHorizontal: 20}}>
  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
  <Text style={{fontFamily: 'Avenir-Medium', fontSize: 16}}>
    Start Time
  </Text>
  <TouchableWithoutFeedback  onPress={openStartTimePicker}>
  <View style={{borderRadius: 10, flexDirection: 'row', alignItems: 'center'}} icon={() => <FeatherIcon name="chevron-down" />}>
  <FeatherIcon name="chevron-down" style={{paddingRight: 5}} />
                      <Text style={{fontWeight: '500', fontSize: 13, color: '#1089ff'}}>
                        {startTimeFormatted}
                      </Text>
                     
                  </View>
                  </TouchableWithoutFeedback>
  </View>
  <Caption>
    The maximum schedule time for a session is one hour.  Your session will end at: {endTimeFormatted}.
  </Caption>

  </View>

<Divider />

<View style={{paddingHorizontal: 20}}>
<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
<Text style={{fontFamily: 'Avenir-Medium', color: 'black', fontSize: 16}}>
          Date
        </Text>
        <TouchableWithoutFeedback onPress={openDatePicker}>
              <View style={{marginVertical: 5,  alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center',justifyContent: 'space-evenly'}} icon={() => <FeatherIcon name="chevron-down" />}>
              <FeatherIcon name="chevron-down" style={{paddingRight: 5}} />
                      <Text style={{fontWeight: '500', fontSize: 13, color: '#1089ff'}}>
                        {bookingDisplayDate}
                      </Text>
                  </View>
                  </TouchableWithoutFeedback>
</View>
</View>

<Divider />

<View>
<Button 
onPress={() => handleNavigateToConfirmation()}
mode="contained" 
color="#23374d"
uppercase={false}
style={{alignSelf: 'center', elevation: 0, marginVertical: 5}} 
contentStyle={{width: Dimensions.get('window').width - 20, height: 55}} 
theme={{roundness: 12}}>
  <Text style={{fontWeight: '600'}}>
    Request Session
  </Text>
</Button>

<Button 
onPress={() => ref.current.close()}
mode="outlined" 
color="black"
uppercase={false}
style={{alignSelf: 'center', elevation: 0, marginVertical: 5}} 
contentStyle={{width: Dimensions.get('window').width - 20, height: 45}} 
theme={{roundness: 12}}>
  <Text style={{fontFamily: 'Avenir'}}>
    Cancel
  </Text>
</Button>

</View>


            
        </View>
        </KeyboardAvoidingView>
        </View>
        )
      case 1:
        return (
          <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
           
              <View style={{paddingHorizontal: 15, alignItems: 'flex-start', justifyContent: 'center', flex: 1, backgroundColor: '#23374d'}}>
              <Caption onPress={() => setCurrPage(0)} style={{color: 'white'}}>
              Back
            </Caption>
                <View style={{marginVertical: 10, borderRadius: 60, width: 60, height: 60,backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center'}}>
                  <FeatherIcon size={20} name="check" />
                </View>
                <Text style={{marginVertical: 10, color: 'white', fontSize: 20, fontFamily: 'Avenir-Heavy'}}>
                  {LUPA_STATE.Users.currUserData.display_name}
                </Text>
                <Text style={{marginVertical: 10, fontFamily: 'Avenir-Heavy', fontSize: 26, color: 'white'}}>
                  Thank you for booking a personal trainer using Lupa.  Here are the details.
                </Text>
              </View>
              <View style={{flex: 1, padding: 20, justifyContent: 'space-evenly'}}>
                <View>

             
                <View>
                  <Text style={{fontSize: 20, fontFamily: 'Avenir-Medium'}}>
                    Session Date: {bookingDisplayDate}
                  </Text>
                </View>

                <View>
                  <Text style={{fontSize: 20, fontFamily: 'Avenir-Medium'}}>
                    Session Start Time: {startTimeFormatted}
                  </Text>
                </View>

                <View>
                  <Text style={{fontSize: 20, fontFamily: 'Avenir-Medium'}}>
                    Gym: {trainer.homegym.name}
                  </Text>
                  <Text style={{fontSize: 20, fontFamily: 'Avenir-Medium'}}>
                    Address: {trainer.homegym.address}
                  </Text>
                </View>
                </View>

                <View>
                  <Paragraph>
                    {trainerNote}
                  </Paragraph>
                </View>

                <Caption>
                  Your session with {trainer.display_name} is {sessionType == SESSION_TYPE.REMOTE ? 'a Remote' : 'an In Person'} session.  You will not be charged until {trainer.display_name} chooses to complete the session.
                </Caption>

                <Divider />

                <Button 
onPress={handleOnRequest}
mode="contained" 
color="#23374d"
uppercase={false}
style={{alignSelf: 'center', elevation: 0, marginVertical: 5}} 
contentStyle={{width: Dimensions.get('window').width - 20, height: 55}} 
theme={{roundness: 12}}>
  <Text style={{fontWeight: '600'}}>
    Confirm Session
  </Text>
</Button>
                
              </View>
          </View>
        )
      default:

    }
  }
  
  return (
    <RBSheet
    ref={ref}
    height={700}
    dragFromTopOnly={false}
    closeOnDragDown={true}
    closeOnPressMask={true}
    closeOnPressBack={true}
    animationType="slide"
    customStyles={{
      container: {
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20
      },
      draggableIcon: {
        backgroundColor: 'grey'
      }
    }}
    >
      {renderComponent()}
        
        {renderDisplayDatePicker()}
        {renderStartTimePicker()}
        {renderCardNeededDialog()}
        {renderBookingCreationErrorDialog()}
        {renderSessionTypeDialog()}
        <FullScreenLoadingIndicator isVisible={confirmingSession} />
        <SafeAreaView />
      </RBSheet>
  )
    })


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    appbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 0.5, borderColor: 'rgb(174, 174, 178)',
       // borderBottomColor: 'rgb(199, 199, 204)', 
       // borderBottomWidth: 0.8,
        elevation: 0,
    },
    appbarTitleStyle: {
        alignSelf: 'center', 
        fontFamily: 'Avenir-Heavy', 
        fontWeight: 'bold', 
        fontSize: 20
    }
})

export default BookingRequestModal;