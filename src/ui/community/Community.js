
import React, { useState, useEffect, createRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Text,
  Image,
  Animated,
  ScrollView,
  Modal,
  ActionSheetIOS
} from 'react-native';

import { Input } from 'react-native-elements';

import { Surface, Avatar, Dialog, Paragraph } from 'react-native-paper';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import FeatherIcon from 'react-native-vector-icons/Feather'
import moment from 'moment';
import {Appbar, Caption, Button, Divider} from 'react-native-paper';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Constants } from 'react-native-unimodules';
import ImagePicker from 'react-native-image-picker';
import { Rating } from 'react-native-elements';
import ProgramImageOne from '../images/placeholders/fitness_program_one.jpg'
import ProgramImageTwo from '../images/placeholders/fitness_program_two.jpg'
import ProgramImageThree from '../images/placeholders/fitness_program_three.jpg'
import GymImageOne from '../images/placeholders/gym_one.jpg'
import GymImageTwo from '../images/placeholders/gym_two.png'
import GymImageThree from '../images/placeholders/gym_three.jpg'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useStore } from 'react-redux';
import LupaController from '../../controller/lupa/LupaController';
import DateTimePicker from '@react-native-community/datetimepicker';
import GeneralPurposeSearchModal from '../search/GeneralPurposeSearchModal';
import ProgramInformation from '../workout/program/createprogram/component/ProgramInformation';
import ProgramInformationComponent from '../workout/program/components/ProgramInformationComponent';
import RBSheet from 'react-native-raw-bottom-sheet';
import { createCommunityEvent, initializeNewCommunity } from '../../model/data_structures/community/community';
import { getAbbreviatedDayOfTheWeekFromDate, getDayOfMonthStringFromDate, getDayOfTheWeekStringFromDate } from '../../common/service/DateTimeService';
import LUPA_DB from '../../controller/firebase/firebase';
const imageArr = [
  ProgramImageOne,
  ProgramImageTwo,
  ProgramImageThree
]

const gymImageArr = [
  GymImageTwo,
  GymImageThree,
  GymImageOne,
]
const HEADER_MAX_HEIGHT = 120
const HEADER_MIN_HEIGHT = 70
const PROFILE_IMAGE_MAX_HEIGHT = 80
const PROFILE_IMAGE_MIN_HEIGHT = 40

const items = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
]

function CreateEventModal({ isVisible, closeModal, community }) {
  const [eventTitle, setEventTitle] = useState('');
  const [eventImages, setEventImages] = useState([])
  const [eventDetails, setEventDetails] = useState('');
  const [eventDuration, setEventDuration] = useState(0);
  const [startDate, setStartDate] = useState(new Date())
  const [startDateFormatted, setStartDateFormatted] = useState(moment().format('LL').toString())
  const [startTime, setStartTime] = useState(new Date(1598051730000))
  const [startTimeFormatted, setStartTimeFormatted] = useState(moment(new Date().getTime()).format('LT').toString())
  const [endTime, setEndTime] = useState(new Date(1598051730000))
  const [endTimeFormatted, setEndTimeFormatted] = useState(moment(new Date().getTime()).add(1, 'hour').format('LT').toString())
  const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

  const startDateSheetRef = createRef();
  const openStartDateSheet = () => startDateSheetRef.current.open();
  const closeStartDateSheet = () => startDateSheetRef.current.close();

  const startTimeSheetRef = createRef();
  const openStartTimeStartSheet = () => startTimeSheetRef.current.open();
  const closeStartTimeStartSheet = () => startTimeSheetRef.current.close();

  const endTimeSheetRef = createRef();
  const openEndTimeStartSheet = () => endTimeSheetRef.current.open();
  const closeEndTimeStartSheet = () => endTimeSheetRef.current.close();

  const renderStartDateTimeSheet = () => {
    return (
      <RBSheet
      ref={startDateSheetRef}
      height={450}
      customStyles={{
        wrapper: {

        },
        draggableIcon: {
            
        },
        container: {
          borderTopStartRadius: 20,
          borderTopEndRadius: 20
        }
      }}
      >
        <View style={{flex: 1,  justifyContent: 'center'}}>
        <DateTimePicker
          value={startDate}
          mode='date'
          is24Hour={false}
          display='inline'
          onChange={onChangeDisplayDate}
        />

        <Button
        mode="contained"
        theme={{roundness: 12}}
        contentStyle={{height: 50}}
        style={{alignSelf: 'center', marginVertical: 10, width: Dimensions.get('window').width - 20}}
        color="#1089ff"
        onPress={closeStartDateSheet}
        >
          Set Date
        </Button> 
        </View>
      </RBSheet>
    )
  }

  const renderStartTimeSheet = () => {
    return (
      <RBSheet
      ref={startTimeSheetRef}
      height={300}
      customStyles={{
        wrapper: {

        },
        draggableIcon: {
          
        },
        container: {

        }
      }}
      >
        <View style={{flex: 1, justifyContent: 'center'}}>
        <DateTimePicker
          value={startTime}
          mode='time'
          is24Hour={false}
          display='spinner'
          onChange={onChangeStartTime}
        />

        <Button
        mode="contained"
        theme={{roundness: 12}}
        contentStyle={{height: 50}}
        style={{alignSelf: 'center', marginVertical: 10, width: Dimensions.get('window').width - 20}}
        color="#1089ff"
        onPress={closeStartTimeStartSheet}
        >
          Set Time
        </Button> 
        </View>
      </RBSheet>
    )
  }

  const renderEndTimeSheet = () => {
    return (
      <RBSheet
      ref={endTimeSheetRef}
      height={300}
      customStyles={{
        wrapper: {

        },
        draggableIcon: {
          
        },
        container: {

        }
      }}
      >
        <View style={{flex: 1,justifyContent: 'center'}}>
        <DateTimePicker
          value={endTime}
          mode='time'
          is24Hour={false}
          display='spinner'
          onChange={onChangeEndTime}
        />

        <Button
        mode="contained"
        theme={{roundness: 12}}
        contentStyle={{height: 50}}
        style={{alignSelf: 'center', marginVertical: 10, width: Dimensions.get('window').width - 20}}
        color="#1089ff"
        onPress={closeEndTimeStartSheet}
        >
          Set Time
        </Button> 
        </View>
      </RBSheet>
    )
  }

  const onChangeStartTime = (event, date) => {
    const currentDate = date;
    const currentDateFormatted = moment(date).format('LT').toString()
    setStartTime(currentDate);
    setStartTimeFormatted(currentDateFormatted) //Store this
  };

 const onChangeEndTime = (event, date) => {
    const currentDate = date;
    const currentDateFormatted = moment(new Date(date)).format('LT').toString()
    setEndTime(currentDate);
    setEndTimeFormatted(currentDateFormatted); //Store this
  };

  const onChangeDisplayDate = (event, date) => {
    const currentDate = date;
    const currentDateFormatted = moment(new Date(date)).format('LL').toString();
    setStartDate(currentDate);
    setStartDateFormatted(currentDateFormatted);
  };

  const handleOnCreateEvent = () => {
      const updatedStartDate = moment(startDate).toDate().toISOString().split('T')[0];
      const newCommunityEvent = createCommunityEvent(community.uid, eventTitle, eventDetails, updatedStartDate, eventDuration, startTimeFormatted, endTimeFormatted);
      LUPA_CONTROLLER_INSTANCE.createCommunityEvent(community.uid, newCommunityEvent, eventImages);
   //   closeModal()
  }

  const handleOnLeaveModal = () => {
    LUPA_CONTROLLER_INSTANCE.updateCommunityPictures(community.uid, images);
    closeModal();
  }

  _chooseProfilePictureFromCameraRoll = async () => {
     ImagePicker.showImagePicker({
         allowsEditing: true
     }, async (response) => {
         if (!response.didCancel)
         {
           const uri = await response.uri;
           setEventImages(images => [uri, ...images])
         }
         else if (response.error)
         {
       
         }
     });
 }

  const renderAddedEventPhotos = () => {
    return (
      <ScrollView horizontal>
      <TouchableOpacity onPress={_chooseProfilePictureFromCameraRoll} style={{alignItems: 'center', justifyContent: 'center', margin: 10, width: 80, height: 80, borderRadius: 12, backgroundColor: '#EEEEEE'}}>
          <FeatherIcon name="plus-circle" size={20} style={{padding: 5}} color="rgb(42, 101, 141)" />
      </TouchableOpacity>
      {
        eventImages.map(imageURI => {
          return (
            <View  style={{alignItems: 'center', justifyContent: 'center', margin: 10, width: 80, height: 80, borderRadius: 12, backgroundColor: '#EEEEEE'}}>
              <Image key={imageURI} source={{ uri: imageURI }} style={{width: '100%', height: '100%', borderRadius: 12}} />
        </View>
          )
        })
      }
      </ScrollView>
    )
  }

  return (
    <Modal presentationStyle="fullScreen" visible={isVisible} animationType="slide">
      <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
          <Appbar.Header style={{backgroundColor: '#FFFFFF', elevation: 0}}>
            <Appbar.Action icon={() => <FeatherIcon name="arrow-left" size={20} style={{padding: 3}} onPress={closeModal} />} onPress={closeModal} />
            <Appbar.Content title="Create Event" titleStyle={{alignSelf: 'center', fontFamily: 'Avenir-Heavy', borderBottomColor: '#EEEEEE', borderBottomWidth: 1, fontWeight: 'bold', fontSize: 25}} />
         
          </Appbar.Header>
          <View style={{flex: 1, justifyContent: 'space-evenly'}}>
            <View>
              <Input
                        label="Event Title"
                        placeholder="E.g. Squat Day"
                        style={{ width: '50%' }}
                        containerStyle={[styles.containerStyle, { width: '100%' }]}
                        labelStyle={styles.labelStyle}
                        inputStyle={styles.inputStyle}
                        inputContainerStyle={styles.input}
                        returnKeyLabel="done"
                        returnKeyType="done"
                        keyboardType="default"
                        keyboardAppearance="light"
                        textContentType="none"
                        value={eventTitle}
                        onChangeText={text => setEventTitle(text)}
                    />
            </View>

            <View>
              <Text style={[styles.labelStyle, {paddingHorizontal: 10}]}>
                Add Photos
              </Text>
              {renderAddedEventPhotos()}
            </View>

            <View>
            <Input
                        label="Event Details"
                        placeholder="Event Details"
                        containerStyle={[styles.containerStyle, { width: '100%' }]}
                        labelStyle={styles.labelStyle}
                        inputStyle={styles.inputStyle}
                        inputContainerStyle={styles.input}
                        returnKeyLabel="done"
                        returnKeyType="done"
                        keyboardType="default"
                        keyboardAppearance="light"
                        textContentType="none"
                        multiline
                        value={eventDetails}
                        onChangeText={text => setEventDetails(text)}
                    />
            </View>

            <View>
              <View>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                  <Input
                        label="Start Date"
                        placeholder="DD/MM/YYYY"
                        containerStyle={[styles.containerStyle, { width: '50%' }]}
                        labelStyle={styles.labelStyle}
                        inputStyle={styles.inputStyle}
                        inputContainerStyle={styles.input}
                        textContentType="fullStreetAddress"
                        onTouchStart={openStartDateSheet}
                        value={startDateFormatted}
                    />

<Input
                        label="Event Duration"
                        placeholder="E.g. 5"
                        containerStyle={[styles.containerStyle, { width: '50%' }]}
                        labelStyle={styles.labelStyle}
                        inputStyle={styles.inputStyle}
                        inputContainerStyle={styles.input}
                        returnKeyLabel="done"
                        returnKeyType="done"
                        keyboardType="numeric"
                        keyboardAppearance="light"
                        textContentType="none"
                        value={eventDuration}
                        onChangeText={text => setEventDuration(eventDuration)}
                    />

                </View>
              </View>

              <View>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Input
                        label="Start Time"
                        placeholder="E.g. 4:40 PM"
                        containerStyle={[styles.containerStyle, { width: '45%' }]}
                        labelStyle={styles.labelStyle}
                        inputStyle={styles.inputStyle}
                        inputContainerStyle={styles.input}
                        textContentType="fullStreetAddress"
                        value={startTimeFormatted}
                        onTouchStart={openStartTimeStartSheet}
                    />

<Input
                        label="End Time"
                        placeholder="E.g. 5:40 PM"
                        containerStyle={[styles.containerStyle, { width: '45%' }]}
                        labelStyle={styles.labelStyle}
                        inputStyle={styles.inputStyle}
                        inputContainerStyle={styles.input}
                        returnKeyLabel="done"
                        returnKeyType="done"
                        keyboardType="default"
                        keyboardAppearance="light"
                        textContentType="fullStreetAddress"
                        value={endTimeFormatted}
                        onTouchStart={openEndTimeStartSheet}
                    />
                </View>
              </View>
            </View>

            <Divider />
            <Button 
            color="rgb(42, 101, 141)" 
            mode="text" 
            uppercase={true} 
            onPress={handleOnCreateEvent}
            >
                <Text style={{fontWeight: '700'}}>
                  Create
                </Text>
            </Button>
          </View>

          {renderStartDateTimeSheet()}
          {renderStartTimeSheet()}
          {renderEndTimeSheet()}
      </View>
    </Modal>
  )
}

function AddReviewDialog({ isVisible, closeModal, community }) {
  const [reviewText, setReviewText] = useState('');
  const currUserData = useSelector(state => {
    return state.Users.currUserData;
  })

  const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

  const handleSubmitReview = () => {
    if (reviewText.length < 3) {
      return;
    }

    LUPA_CONTROLLER_INSTANCE.addCommunityReview(community.uid, currUserData.user_uuid, reviewText)
    closeModal
  }

  return (
    
    
    <Modal presentationStyle="overFullScreen" visible={isVisible} transparent style={{alignSelf: 'center'}} animationType="slide">
        <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center'}}>
            <Surface style={{width: Dimensions.get('window').width - 20, paddingTop: 10,  borderRadius: 20, height: 'auto'}}>
            <Input 
value={reviewText}
onChangeText={text => setReviewText(text)}
returnKeyLabel="done"
returnKeyType="done"
placeholder={`Leave a review for ${community.name}?`}
keyboardType="default"
keyboardAppearance="light"
multiline
style={{alignItems: 'center'}}
inputStyle={{fontSize: 16, fontFamily: 'Avenir-Roman', alignItems: 'center'}} 
containerStyle={{alignSelf: 'center', height: 150, width: Dimensions.get('window').width - 20}} 
inputContainerStyle={{paddingLeft: 8, height: '100%',  alignItems: 'center', alignSelf: 'flex-start', borderBottomWidth: 0, backgroundColor: '#EEEEEE', borderRadius: 20}} 
/>

<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
<Button 
style={{elevation: 0,width: 200, alignSelf: 'center', marginVertical: 20}} 
contentStyle={{ height: 45}}
theme={{roundness: 12}}
mode="text"
color="rgb(34, 74, 115)"
onPress={handleSubmitReview}
>
  Submit Review
</Button>

<Button 
style={{elevation: 0,width: 200, alignSelf: 'center', marginVertical: 20}} 
contentStyle={{ height: 45}}
theme={{roundness: 12}}
mode="text"
color="rgb(200, 200, 200)"
onPress={closeModal}
>
  Cancel
</Button>
</View>

            </Surface>
        </View>
      </Modal>
  )
}

const EventCardList = ({ eventData, isVisible, closeModal  }) => {
  return (
    <Modal presentationStyle="pageSheet" visible={isVisible} onDismiss={closeModal} animationType="slide">
      <Appbar.Header style={{backgroundColor: 'white'}}>
        <Appbar.Content title="Events" titleStyle={{fontFamily: 'Avenir-Heavy', fontWeight: '800'}} />
      </Appbar.Header>
      <ScrollView style={{flex: 1}}>
        {eventData.map(event => {
          return (
            <>
            <View style={{alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width, padding: 20}}>
                <Text style={{fontFamily: 'Avenir-Medium'}}>
                  {event.name}
                </Text>
                <Text>
                  {event.startTime + ' | '  + event.endTime}
                </Text>
                <Paragraph style={{fontFamily: 'Avenir-Light'}}>
                  {event.details}
                </Paragraph>
              
              </View>
              <Divider />
              </>
          )
        })}
      </ScrollView>
    </Modal>
  )
}

const EventCard = ({key, dateData, eventData}) => {
  const [eventListIsVisible, setEventListIsVisible] = useState(false);

  useEffect(() => {

  }, [])

  return (
    <TouchableOpacity onPress={() => setEventListIsVisible(true)}>
    <Surface key={key} style={{alignItems: 'center', justifyContent: 'space-evenly', margin: 10, width: 90, height: 100, borderRadius: 12, elevation: 0, borderWidth: 1, borderColor: '#E5E5E5'}}>
       <Text style={{fontSize: 16, fontFamily: 'Avenir-Heavy'}}>
       {getAbbreviatedDayOfTheWeekFromDate(dateData)}
       </Text>

       <Text style={{fontSize: 18, fontFamily: 'Avenir-Heavy'}}>
       {getDayOfMonthStringFromDate(dateData)}
         </Text>
       
    <EventCardList isVisible={eventListIsVisible} closeModal={() => setEventListIsVisible(false)} eventData={eventData} />
    </Surface>
    </TouchableOpacity>
  )
}

function Community({ community }) {
  const [reviewDialogVisible, setReviewDialogVisible] = useState(false);
  const [programOffers, setProgramOffers] = useState(community.programs)
  const [trainerData, setTrainerData] = useState(community.trainers)
  const [subscribers, setSubscribers] = useState(community.subscribers)
  const [forceUpdate, setForceUpdate] = useState(false);
  const [createEventModalIsVisible, setCreateEventModalIsVisible] = useState(false);
  const [reviewModalIsVisible, setReviewModalIsVisible] = useState(false);
  const currUserData = useStore().getState().Users.currUserData;
  

  const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

  const [invitedUsers, setInvitedUsers] = useState([])

  handleOnPressSubscribeUser = () => {
    LUPA_CONTROLLER_INSTANCE.subscribeToCommunity(currUserData.user_uuid, community.uid);
  }

  handleOnPressUnsubscribeUser = () => {
    LUPA_CONTROLLER_INSTANCE.unsubscribeUserFromCommunity(currUserData.user_uuid, route.params.community.uid)
  }
  
  const renderFeaturedTrainer = () => {

    if (trainerData) {
      return <Caption style={{padding: 10}}> This community has no trainers on its roster. </Caption>
    }

    return programOffers.map(programOffer => {
      return (
        <ProgramInformationComponent program={programOffer[0]} />
      )
    })
  }

  const renderProgramOffers = () => {
    if (programOffers) {
      return <Caption style={{padding: 10}}> This community has no trainers on its roster. </Caption>
    }

      return (
      <View>
        <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        shouldRasterizeIOS={true}>
          {
          programOffers.map(item => {
            return (
              <Surface style={{margin: 10, backgroundColor: 'black', width: 150, height: 160, borderRadius: 12 }}>
                <Image source={item.program_image} style={{width: '100%', height: '100%', borderRadius: 12}} />
              </Surface>
            )
          })
          }
        </ScrollView>
      </View>
      )
  }


 

      const renderReviews = () => {
        const reviews = community.reviews;
        if (reviews.length == 0) {
          return (
             <Caption style={{padding: 10}}> This community has not received any reviews. </Caption>
          )
        }

        return reviews.map(review => {
          <Text>
            {review}
          </Text>
        })
      }

      const renderEvents = () => {
        const events = community.events;
        if (Object.keys(events).length != 0) {
          return (
            <ScrollView horizontal>
              {
                Object.keys(community.events).map(event => {
            return (
              <EventCard key={event} dateData={event} eventData={community.events[event.toString()].daily_events}/>
            )
          })

        }
            </ScrollView>
          )
        } else {
          return (
            <Caption style={{padding: 10}}> This community has not created any events. </Caption>
          )
        }


      }

      renderSubscribeButton = () => {
        if (community.subscribers.includes(currUserData.user_uuid) == false) {
          return (
              <TouchableOpacity onPress={handleOnPressSubscribeUser}>
                <View style={{alignItems: 'center', justifyContent: 'center'}}> 
                <Feather1s name="user-check" size={20} style={{padding: 3}} color="#1089ff" />
                <Text style={{fontFamily: 'Avenir', color: '#1089ff'}}>
                  Subscribe
                </Text>
              </View>
              </TouchableOpacity>
          )
        } else {
          return (
            <TouchableOpacity onPress={handleOnPressUnsubscribeUser}>
                <View style={{alignItems: 'center', justifyContent: 'center'}}> 
                <Feather1s name="user-minus" size={20} style={{padding: 3}} />
                <Text style={{fontFamily: 'Avenir'}}>
                  Unsubscribe
                </Text>
              </View>
              </TouchableOpacity>
          )
        }
      }
  

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{backgroundColor: 'rgb(245, 245, 245)', height: 150, width: '100%'}}>
              <Carousel 
              sliderWidth={Dimensions.get('window').width}
              itemWidth={Dimensions.get('window').width}
                data={community.pictures}
                renderItem={(item) => {
                  return (
                   <Image source={{ uri: item.item }} style={{flex: 1, width: '100%', height: '100%'}} />
                  )
                }}
              />

              <Animated.View style={{position: 'absolute', bottom: 0, paddingLeft: 10, flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width, justifyContent: 'space-between'}}>
                <Text style={{fontFamily: 'Avenir-Black', fontSize: 20, color: 'white', fontWeight: 'bold'}}>
                  {community.name}
                </Text>

                <Pagination activeDotIndex={0} inactiveDotColor="white" inactiveDotScale={1} dotsLength={community.pictures.length} dotColor="#1089ff" />
              </Animated.View>
          </View>

          <View style={{padding: 10}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Feather1s name="home" style={{paddingHorizontal: 5}} />
                <Caption> {community.address} </Caption>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Feather1s name="phone" style={{paddingHorizontal: 5}} />
                <Caption>{community.phoneNumber}</Caption>
              </View>
          </View>

       
          
          <View>
            <View style={{marginVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
              {renderSubscribeButton()}
                

                <TouchableOpacity onPress={() => setReviewDialogVisible(true)}>
                <View style={{alignItems: 'center', justifyContent: 'center'}}> 
                <Feather1s name="edit-2" size={20} style={{padding: 3}} />
                <Text style={{fontFamily: 'Avenir'}}>
                  Add Review
                </Text>
              </View>
                </TouchableOpacity>
            </View>


            <Divider style={{alignSelf: 'center', width: Dimensions.get('window').width}} />

            <View style={{marginVertical: 15}}>
              <View style={{padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <View>
                <Text>
                  Reviews
                </Text>
                <Rating ratingCount={5} showRating={false}  imageSize={10}/>
                </View>
                
                <Caption style={{color: '#1089ff'}} onPress={() => setReviewModalIsVisible(true)}>
                  See all reviews
                </Caption>
              </View>
           
                {renderReviews()}
              </View>

                <View style={{backgroundColor: '#EEEEEE'}}>
                <View style={{padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              <Text>
                  Events
                </Text>

                <Button color="#1089ff" onPress={() => setCreateEventModalIsVisible(true)}>
                  Add Event
                </Button>
              </View>
                {renderEvents()}
                </View>
             
          </View>

          <Divider />

          <View style={{paddingVertical: 10}}>
            <View style={{  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
               <View style={{  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: Dimensions.get('window').width }}>
               <Text style={{fontFamily: 'Avenir-Heavy', fontSize: 16, padding: 10}}>
             Trainer Roster
            </Text>

               </View>

            <Text style={{paddingHorizontal:3, fontFamily: 'Avenir-Light', color: 'rgb(160, 160, 160)'}}>
                ({community.trainers.length})
              </Text>
     
            </View>

            </View>
              
              <View>
              <ScrollView horizontal>
              {renderFeaturedTrainer()}
              </ScrollView>
              </View>
       
          </View>

          <View>
            <View style={{  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
               <View style={{width: Dimensions.get('window').width , flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
               <Text style={{fontFamily: 'Avenir-Heavy', fontSize: 16, padding: 10}}>
              Program Offers
            </Text>

      
               </View>
           
            <Text style={{paddingHorizontal:5, fontFamily: 'Avenir-Light', color: 'rgb(160, 160, 160)'}}>
                ({community.programs.length})
              </Text>
     
            </View>

            </View>

            
            {renderProgramOffers()}
          </View>
              
          <CreateEventModal 
          community={community} 
         isVisible={createEventModalIsVisible}
         closeModal={() => setCreateEventModalIsVisible(false)}
          />
          <AddReviewDialog isVisible={reviewDialogVisible} closeModal={() => setReviewDialogVisible(false)} community={community} />
         
          <SafeAreaView />
        </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  containerStyle: {
    marginVertical: 15
},
input: {
    padding: 5,
},
inputStyle: {
    fontSize: 15,
},
labelStyle: {
    fontSize: 20,
    fontFamily: 'Avenir-Heavy',
    color: 'black'
}
})
export default Community;

//input place holder
    //programs enabled
    //users enabled
    //trainers enabled
    //userHasButton
    //userButtonTitle
    //userButtonOnPress
    //isVisible
    //closeModal