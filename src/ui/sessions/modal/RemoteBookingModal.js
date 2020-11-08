import React, { useState, createRef } from 'react';

import {
    View,
    Text, 
    StyleSheet,
    Button as NativeButton,
    SafeAreaView,
    Dimensions,
    Image,
    Modal,
    TouchableWithoutFeedback,
} from 'react-native';

import {
    Appbar,
    Caption,
    Dialog,
    Button,
    TextInput,
    Surface,
    HelperText,
    Paragraph,
    Snackbar,
    Checkbox,
    Divider,
    Avatar,
    RadioButton
} from 'react-native-paper';

import FeatherIcon from 'react-native-vector-icons/Feather';

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
import { LUPA_AUTH } from '../../../controller/firebase/firebase';
import { BOOKING_STATUS } from '../../../model/data_structures/user/types';
import { initStripe, stripe, CURRENCY, STRIPE_ENDPOINT, LUPA_ERR_TOKEN_UNDEFINED} from '../../../modules/payments/stripe';
import LOG, { LOG_ERROR } from '../../../common/Logger';
import { getLupaStoreState } from '../../../controller/redux';
import RemoteBookingModal from '../../sessions/modal/RemoteBookingModal';

function RemoteBookingModal({ isVisible, closeModal, trainer, preFilledStartTime, preFilledEndTime, preFilledDate, preFilledTrainerNote }) {
  const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();  
  
  const LUPA_STATE = useSelector(state => {
      return state;
    });

    const navigation = useNavigation();

    const [snackBarVisible, setSnackBarVisible] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState(false);

    const startTimePickerRef = createRef();
    const endTimePickerRef = createRef();
    const bookingRef = createRef();

    const [sixtyRadioButtonChecked, setSixtyRadioButtonChecked] = useState('checked')
    const [ninetyRadioButtonChecked, setNinetyRadioButtonChecked] = useState('unchecked')

    const [paymentSuccessful, setPaymentSuccessful] = useState(false)
    const [paymentComplete, setPaymentComplete] = useState(true)
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState("")
    const [showCardNeededDialog, setShowCardNeededDialogVisible] = useState(false);
    const [bookingCreationError, setBookingCreationErrorDialogVisible] = useState(false);

    const [timingBlockDuration, setTimingBlockDuration] = useState(60);

    const [startTime, setStartTime] = useState(new Date(1598051730000))
    const [startTimeFormatted, setStartTimeFormatted] = useState(moment(new Date()).format('LT').toString())
    const [endTimeFormatted, setEndTimeFormatted] = useState(moment(new Date()).add(60, 'minutes').format('LT').toString());
    const [endTime, setEndTime] = useState(new Date(1598051730000))
    const openStartTimePicker = () => startTimePickerRef.current.open();
    const closeStartTimePicker = () => startTimePickerRef.current.close();
    const openEndTimePicker = () => endTimePickerRef.current.open();
    const closeEndTimePicker = () => endTimePickerRef.current.close();
    const openDatePicker = () => bookingRef.current.open();
    const closeDatePicker = () => bookingRef.current.close();
    const [trainerNote, setTrainerNote] = useState(typeof(preFilledTrainerNote) == 'undefined' ? "" : preFilledTrainerNote)

    const [startTimeIsSet, setStartTimeIsSet] = useState(false);
    const [endTimeIsSet, setEndTimeIsSet] = useState(false);

    const [bookingDisplayDate, setBookingDisplayDate] = useState(moment(new Date()).format('LL').toString());
    const [bookingDate, setBookingDate] = useState(new Date());

    const [timeBlockDialogVisible, setTimeBlockDialogVisible] = useState(false);

    const renderDisplayDatePicker = () => {
      return (
        <RBSheet
        ref={bookingRef}
        height={300}>
          <View style={{flex: 1}}>
          <DateTimePicker
          value={bookingDate}
          mode='date'
          is24Hour={false}
          display="default"
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

      const handleOnPickStartTime = () => {
        setStartTimeIsSet(true);
        setEndTime(moment(startTime).add(timingBlockDuration, 'minutes').toDate());
        setEndTimeFormatted(moment(startTime).add(timingBlockDuration, 'minutes').format('LT').toString());
        closeStartTimePicker();
      }
  
      const handleOnPickEndTime = () => {
        setEndTimeIsSet(true);
        closeEndTimePicker();
      }

      const handleOnPickDate = () => {
        closeDatePicker()
      }

      const handleOnPickTimeBlock = (value) => {
        switch (value) {
          case 60:
            setSixtyRadioButtonChecked('checked');
            setNinetyRadioButtonChecked('unchecked');
            setEndTime(moment(startTime).add(60, 'minutes').toDate());
            setEndTimeFormatted(moment(startTime).add(60, 'minutes').format('LT').toString());
            setTimingBlockDuration(60)
            break;
          case 90:
            setSixtyRadioButtonChecked('unchecked');
            setNinetyRadioButtonChecked('checked');
            setEndTime(moment(startTime).add(90, 'minutes').toDate());
            setEndTimeFormatted(moment(startTime).add(90, 'minutes').format('LT').toString());
            setTimingBlockDuration(90)
            break;
          default:
            setSixtyRadioButtonChecked('checked');
            setNinetyRadioButtonChecked('unchecked');
        }


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

      const renderTimeBlockDialog = () => {
        return (
          <Dialog visible={timeBlockDialogVisible} style={{height: 'auto'}}>
                <Image style={{width: 120, height: 120, alignSelf: 'center'}} source={require('../../images/clock_icon.jpeg')} />
                <Dialog.Title>
                  Choose a session length
                </Dialog.Title>

                <Dialog.Content>
                  <Text style={{color: 'rgb(144, 144, 144)'}}>
                  Choose between a 60 or 90 minutes session with this trainer.
                  </Text>

                  <View style={{marginVertical: 20}}>
                  <View key={60} style={{marginVertical: 10, flexDirection: 'row', alignItems: 'center'}}>
                          <RadioButton.Android color="#1089ff" status={sixtyRadioButtonChecked} onPress={() => handleOnPickTimeBlock(60)} />
                          <Text style={{fontFamily: 'Avenir-Heavy', fontSize: 16}}>
                              60 minutes
                          </Text>
                      </View>

                      <View key={90} style={{marginVertical: 10, flexDirection: 'row', alignItems: 'center'}}>
                          <RadioButton.Android color="#1089ff" status={ninetyRadioButtonChecked} onPress={() => handleOnPickTimeBlock(90)} />
                          <Text style={{fontFamily: 'Avenir-Heavy', fontSize: 16}}>
                              90 minutes
                          </Text>
                      </View>
                  </View>
                
                </Dialog.Content>

                <Dialog.Actions style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Button 
                  onPress={() => setTimeBlockDialogVisible(false)}
                  uppercase={false} 
                  mode="contained" 
                  color="#23374d"
                  style={{elevation: 0}}
                  contentStyle={{width: 180}}
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
    
     const onChangeEndTime = (event, date) => {
        const currentDate = date;
        const currentDateFormatted = moment(new Date(date)).format('LT').toString()
        setEndTime(currentDate);
        setEndTimeFormatted(currentDateFormatted);
        setEndTimeIsSet(true);
      }

      const onChangeDisplayDate = (event, date) => {
        const currentDate = date;
        const currentDateFormatted = moment(new Date(date)).format('LL').toString();
        setBookingDisplayDate(currentDateFormatted);
        setBookingDate(currentDate);
      }

      const getCurrentUserUUID = () => {
        //if the user is registered on lupa their uuid is stored in the global state
        //if not, we just return the device ID because this is what we use for unverified users
        if (LUPA_STATE.Auth.isAuthenticated === true) {
          return LUPA_STATE.Users.currUserData.user_uuid;
        } else {
          const deviceUUID = DeviceInfo.getUniqueId()
          return deviceUUID;
        }
      }

       /**
     * Sends request to server to complete payment
     */
    const makePayment = async (updatedToken, amount) => {
      //Create an idemptoencyKey to prevent double transactions
      const idempotencyKey = await Math.random().toString()
console.log('a')
      //Get a copy of the current user data to pass some fields into the request
      const userData = LUPA_STATE.Users.currUserData.user_uuid;
console.log('b')
console.log(trainer.stripe_metadata.stripe_id)
console.log(updatedToken)
      //Make the payment request to firebase with axios
    fetch(STRIPE_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        seller_stripe_id: trainer.stripe_metadata.stripe_id,
        amount: 100,
        currency: CURRENCY,
        token: updatedToken,
        idempotencyKey: idempotencyKey,
      })
    }).then(response => {
      console.log(response)
      console.log('Success')
    }).catch(error => {
      console.log(error)
      setPaymentSuccessful(false)
      setPaymentComplete(true)
    })

      /*await axios({
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
          },
          method: 'POST',
          url: STRIPE_ENDPOINT,
          data: JSON.stringify({
              seller_stripe_id: trainer.stripe_metadata.stripe_id,
              amount: 100,
              currency: CURRENCY,
              token: updatedToken,
              idempotencyKey: idempotencyKey,
          })
      }).then(response => {
        console.log('SUCCESS')
      }).catch(err => {
        console.log('oh')
        console.log(err)
          setPaymentSuccessful(false)
          setPaymentComplete(true)
      })
    } catch(error) {
      console.log(JSON.stringify(error))
    }*/
  }


  /**
   * Handles program purchase process
   */
  const handlePayBookingCost = async (amount) => {
      await setLoading(true)
       //handle stripe
       await initStripe();

       //collect payment information and generate payment token
       try {
           setToken(null)
           const token = await stripe.paymentRequestWithCardForm({
               requiredBillingAddressFields: 'zip'
           });

           if (token == undefined) {
               throw LUPA_ERR_TOKEN_UNDEFINED;
           }
           
           await setToken(token)
       } catch (error) {
         console.log(error)
           setLoading(false)
           return;
       }

       //get the token from the state
       const generatedToken = await token;

       //Send request to make payment
       try {
           await makePayment(generatedToken, amount)
       } catch (error) {
         console.log(error)
           await setPaymentComplete(false)
           await setPaymentSuccessful(false)
           setLoading(false);
           return;
       }

      await setLoading(false);
  }

      const handleOnRequest = async () => {
        if (LUPA_STATE.Auth.isAuthenticated === true) {
        //need to save a card before you can book
        if (LUPA_STATE.Users.currUserData.stripe_metadata.card_added_to_stripe === false) {
          setShowCardNeededDialogVisible(true);
          return;
        }
      }

        //let bookingDetailsVerified = checkBookingDetails()
        /*
        if (!bookingDetailsVerified) {
          return;
        }
        */
        

        const requesterID = getCurrentUserUUID();
        const booking = getNewBookingStructure(startTimeFormatted, endTimeFormatted, bookingDate, new Date(), trainer.user_uuid, requesterID, trainerNote);
        const booking_id = booking.uid;

        try {
          if (LUPA_STATE.Auth.isAuthenticated === true) {
            await LUPA_CONTROLLER_INSTANCE.createBookingRequest(booking, true);
          } else {
            await LUPA_CONTROLLER_INSTANCE.createBookingRequest(booking, false, requesterID);
          }
      
        closeModal()
        } catch(error) {
          console.log('BAAAAABY')
          console.log(error)
          LOG_ERROR('BookingRequestModal.js', 'Failed to creating booking.', error);
          //delete booking if it was created
          //check if booking was ever created?
          LUPA_CONTROLLER_INSTANCE.deleteBooking(booking_id);
          //show warning to user
          setBookingCreationErrorDialogVisible(true);
          return;
        }

        if (LUPA_STATE.Auth.isAuthenticated === false) {
          handlePayBookingCost(50.00);

          if (paymentSuccessful) {
           console.log('hi')
            closeModal()
   
          } else {
            console.log('error here')
            setBookingCreationErrorDialogVisible(true);
            LUPA_CONTROLLER_INSTANCE.deleteBooking(booking_id);
            closeModal();
          }
        }
      }

      const handleNavigateToSettings = () => {
        closeModal();
        navigation.push('Settings');
      }

      const renderCardNeededDialog = () => {
        return (
          <Dialog visible={showCardNeededDialog} style={{height: 'auto', width: Dimensions.get('window').width - 20, alignSelf: 'center'}}>

                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Dialog.Title style={{alignSelf: 'center', fontWeight: 'bold', fontFamily: 'Avenir-Heavy'}}>
                  No Card Found
                </Dialog.Title>


                <Button 
                  onPress={() => {}}
                  uppercase={false} 
                  mode="text" 
                  color="#23374d"
                  style={{elevation: 0}}

             
                  theme={{roundness: 8}}>
                    Learn More
                  </Button>
                </View>
  
             

                <Dialog.Content style={{alignSelf: 'flex-start', justifyContent: 'center'}}>
                  <Text style={{color: 'rgb(144, 144, 144)', paddingVertical: 5}}>
                    Lupa requires that you have a card saved before booking a session.  
                  </Text>

                  <Text style={{color: 'rgb(144, 144, 144)'}}>
                  Note: You will not be allowed to remove a card if you have an active session with 30 minutes of starting.
                  </Text>

                </Dialog.Content>

                <Dialog.Actions style={{alignItems: 'center', justifyContent: 'flex-end'}}>
               

                  <Button 
                  onPress={() => setShowCardNeededDialogVisible(false)}
                  uppercase={false} 
                  mode="outlined" 
                  color="#23374d"
                  style={{elevation: 0, marginHorizontal: 5}}
                  contentStyle={{padding: 3}}
                  theme={{roundness: 8}}>
                    Cancel
                  </Button>

                  <Button 
                  onPress={handleNavigateToSettings}
                  uppercase={false} 
                  mode="contained" 
                  color="#23374d"
                  style={{elevation: 0, marginHorizontal: 5}}
                  contentStyle={{padding: 3}}
                  theme={{roundness: 8}}>
                    Add Card
                  </Button>
                

                </Dialog.Actions>
          </Dialog>
        )
      }

      const renderFollowButton = () => {
        try {
        const updatedUserData = getLupaStoreState();
        return updatedUserData.following.includes(trainer.user_uuid) === true ?
          <Button 
          contentStyle={{width: 140}}
        theme={{
          roundness: 3
        }}
        onPress={() => LUPA_CONTROLLER_INSTANCE.unfollowUser(trainer.user_uuid, LUPA_STATE.Users.currUserData.user_uuid)} color="#1089ff" 
        uppercase={false} 
        mode="outlined" 
        style={{marginVertical: 20, marginHorizontal: 10}}>
        <Text style={{fontSize: 12}}>
          Follow
        </Text>
        </Button>
                   :
                   <Button 
                   contentStyle={{width: 140}}
                 theme={{
                   roundness: 3
                 }}
                 onPress={() => LUPA_CONTROLLER_INSTANCE.followUser(trainer.user_uuid, LUPA_STATE.Users.currUserData.user_uuid)} color="#1089ff" 
                 uppercase={false} 
                 mode="outlined" 
                 style={{marginVertical: 20, marginHorizontal: 10}}>
                 <Text style={{fontSize: 12}}>
                   Follow
                 </Text>
                 </Button>
      } catch(error) {
          return (
            <Button 
            contentStyle={{width: 140}}
          theme={{
            roundness: 3
          }}
          onPress={() => LUPA_CONTROLLER_INSTANCE.followUser(trainer.user_uuid, LUPA_STATE.Users.currUserData.user_uuid)} color="#1089ff" 
          uppercase={false} 
          mode="outlined" 
          style={{marginVertical: 20, marginHorizontal: 10}}>
          <Text style={{fontSize: 12}}>
            Follow
          </Text>
          </Button>
          )
      }
    }


    return (
        <Modal presentationStyle="fullScreen" visible={isVisible} animationType="slide">
            <LinearGradient
              colors={['#1089ff', 'white']}
              start={[1,1]}
              end={[1,0]}
              style={{
                justifyContent: 'space-between',
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                height: Dimensions.get('window').height,
                width: Dimensions.get('window').width
              }}>
<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{ alignSelf: 'center', paddingHorizontal: 20, paddingVertical: 15, fontWeight: '600'}}>
                You are about to request a session with Elijah Hampton
              </Text>
              
              <TouchableWithoutFeedback onPress={openDatePicker}>
              <View style={{width: '70%', marginVertical: 10,  alignSelf: 'center', padding: 5, borderRadius: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.1)', borderWidth: 0.5, borderColor: '#E5E5E5', justifyContent: 'space-evenly'}} icon={() => <FeatherIcon name="chevron-down" />}>
                      <FeatherIcon name="calendar" color="#1089ff" />
                      <Text style={{paddingHorizontal: 10, fontWeight: '500', fontSize: 12}}>
                        {bookingDisplayDate}
                      </Text>
                      <FeatherIcon name="chevron-down" />
                  </View>
                  </TouchableWithoutFeedback>
</View>

<Surface style={{backgroundColor: 'white', flex: 2}}>
  <View style={{flex: 1, padding: 20}}>

  <ScrollView showsVerticalScrollIndicator={false}>
  <View>
<View style={{paddingHorizontal: 20, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center'}}>
  <Avatar.Image source={{ uri: trainer.photo_url }} size={40} />
  <View style={{width: '100%', paddingHorizontal: 20}}>
    <Text style={{fontSize: 20, fontFamily: 'Avenir-Heavy'}}>
    {trainer.display_name}
    </Text>
    <Text style={{fontSize: 15, fontFamily: 'Avenir-Heavy'}}>
      National Association of Sports and Medicine
    </Text>
  </View>
</View>

<View style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>

<Button 
contentStyle={{width: 140}}
theme={{
  roundness: 3
}}
onPress={() => {
  closeModal()
  navigation.push('PrivateChat', {
    currUserUUID: getCurrentUserUUID(),
    otherUserUUID: trainer.user_uuid
    })
}} color="#1089ff" 
uppercase={false} 
mode="outlined" 
style={{marginVertical: 20, marginHorizontal: 10}}>
<Text style={{fontSize: 12}}>
  Message
</Text>
</Button> 





{renderFollowButton()}
</View>

</View>

<Divider />

<View style={{paddingVertical: 10}}>
  <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10}}>
        <FeatherIcon color="#23374d" name="clock" size={20} />
        <Text style={{fontFamily: 'Avenir-Heavy', paddingHorizontal: 20, color: 'rgb(156, 157, 168)'}}>
          Timing
        </Text>
  </View>

  <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems : 'center', marginVertical: 10}}>
    <View style={{alignItems: 'center'}}>
    <TouchableWithoutFeedback style={{marginHorizontal: 10,}} onPress={openStartTimePicker}>
  <View style={{padding: 8, borderRadius: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderWidth: 0.5, borderColor: '#E5E5E5'}} icon={() => <FeatherIcon name="chevron-down" />}>
                
                      <FeatherIcon name="clock" color="#1089ff" />
                      <Text style={{paddingHorizontal: 10, fontWeight: '500', fontSize: 12}}>
                        {startTimeFormatted}
                      </Text>
                      <FeatherIcon name="chevron-down" />
                  </View>
                  </TouchableWithoutFeedback>

                  <Caption>
                    Start Time
                  </Caption>
    </View>

    <Text>
      to
    </Text>


    <View style={{alignItems: 'center', marginHorizontal: 10,}}>
  <View style={{padding: 8, borderRadius: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderWidth: 0.5, borderColor: '#E5E5E5'}} icon={() => <FeatherIcon name="chevron-down" />}>
                
                      <FeatherIcon name="clock" color="#1089ff" />
                      <Text style={{paddingHorizontal: 10, fontWeight: '500', fontSize: 12}}>
                       {endTimeFormatted}
                      </Text>
                
                  </View>

                  <Caption>
                    End Time
                  </Caption>
    </View>
  </View>

  <View style={{paddingLeft: 30, flexDirection: 'row', alignItems: 'center'}}>
  <FeatherIcon name="clock" style={{color: '#1089ff'}} />
  <Caption onPress={() => setTimeBlockDialogVisible(true)} style={{ paddingHorizontal: 10, color: '#1089ff'}}>
    Change Duration (Currently set to {timingBlockDuration} minutes)
  </Caption>
  </View>

</View>

<Divider />

<View style={{paddingVertical: 10}}>
  <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10}}>
        <FeatherIcon color="#23374d" name="map-pin" size={20} />
        <Text style={{fontFamily: 'Avenir-Heavy', paddingHorizontal: 20, color: 'rgb(156, 157, 168)'}}>
          Location
        </Text>
  </View>

  <View style={{alignItems: 'flex-start'}}>
              <Paragraph style={{fontSize: 12}}>
                  {trainer.display_name} host sessions at Gold's Gym 1923.
              </Paragraph>
               {/*   <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                    <Caption>
                        Meet {trainer.display_name} at his home
                    </Caption>
                    <Checkbox.Android status="unchecked" />
</View> */}
              </View>
</View>

<Divider />

<View style={{paddingVertical: 10}}>
  <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10}}>
        <FeatherIcon color="#23374d" name="edit-2" size={20} />
        <Text style={{fontFamily: 'Avenir-Heavy', paddingHorizontal: 20, color: 'rgb(156, 157, 168)'}}>
          Notes for trainer
        </Text>
  </View>

  <View>
                <TextInput
                value={trainerNote}
                onChangeText={text => setTrainerNote(text)}
                theme={{
                    colors: {
                      primary: "#23374d"
                    }
                }} 
                mode="flat" 
                style={{width: Dimensions.get('window').width - 20, alignSelf: 'center'}} 
                />
                <Caption style={{paddingHorizontal: 10}}>
                  Leave a note about what you would like to accomplish during this session
                </Caption>
                </View>
</View>

<Divider />
{
  true && true ?
  <View style={{paddingVertical: 10}}>
    <Button color="#1089ff" uppercase={false} mode="outlined" onPress={handleOnRequest}>
      Request
    </Button>
  </View>
  :
  <View style={{paddingVertical: 10}}>
  <Caption>
    It looks like you don't have a PARQ exam saved.  Take a PARQ before requesting a trainer or create an account to save your results for later.
  </Caption>

  <Caption style={{color: '#1089ff'}}>
    Take PARQ exam
  </Caption>
</View>
}

</ScrollView>
</View>
</Surface>
            </LinearGradient>

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

          {renderStartTimePicker()}
        {renderEndTimePicker()}
        {renderDisplayDatePicker()}
        {renderTimeBlockDialog()}
        {renderBookingCreationErrorDialog()}
        {renderCardNeededDialog()}
            <Feather1s onPress={closeModal} name="x" size={24} style={{position: 'absolute', top: Constants.statusBarHeight, left: 20}} />
        </Modal>
    )
}

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

export default RemoteBookingModal;