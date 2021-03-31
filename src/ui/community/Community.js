
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

import { Surface, Avatar, Dialog, Paragraph, FAB } from 'react-native-paper';
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
import VlogFeedCard from '../user/component/VlogFeedCard';
import { getLupaStoreState } from '../../controller/redux';
import { logoutUser } from '../../controller/lupa/auth/auth';
import { useNavigation } from '@react-navigation/core';
import { useDispatch } from 'react-redux';

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
      const newCommunityEvent = createCommunityEvent(community.user_uuid, eventTitle, eventDetails, updatedStartDate, eventDuration, startTimeFormatted, endTimeFormatted);
      LUPA_CONTROLLER_INSTANCE.createCommunityEvent(community.user_uuid, newCommunityEvent, eventImages);
   //   closeModal()
  }

  const handleOnLeaveModal = () => {
    LUPA_CONTROLLER_INSTANCE.updateCommunityPictures(community.user_uuid, images);
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
            <Appbar.BackAction onPress={closeModal} />
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

    LUPA_CONTROLLER_INSTANCE.addCommunityReview(community.user_uid, currUserData.user_uuid, reviewText)
    setReviewText("")
    closeModal()
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
placeholder={`Leave a review for ${community.display_name}?`}
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
  const [forceUpdate, setForceUpdate] = useState(false);
  const currUserData = useStore().getState().Users.currUserData;
  const [feedVlogs, setFeedVlogs] = useState([])
  const navigation = useNavigation()
  const dispatch = useDispatch();

          const openActionSheet = () => {
            ActionSheetIOS.showActionSheetWithOptions(
              {
                options: ['Search Lupa', 'Create a Vlog', "Cancel"],
                destructiveButtonIndex: 2,
                cancelButtonIndex: 2
              },
              buttonIndex => {
                if (buttonIndex === 0) {
                    navigation.push('Search', { categoryToSearch: '' })
                } else if (buttonIndex === 1) {
                  navigation.push('CreatePost', {
                    communityUID: community.user_uuid,
                    vlogType: 'Community'
                })
                }
              }
            )
          }

  const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

  const handleOnPressSubscribeUser = () => {
    LUPA_CONTROLLER_INSTANCE.subscribeToCommunity(currUserData.user_uuid, community.user_uuid);
  }

  const handleOnPressUnsubscribeUser = () => {
    LUPA_CONTROLLER_INSTANCE.unsubscribeUserFromCommunity(currUserData.user_uuid, route.params.community.user_uuid)
  }

  useEffect(() => {
  async function fetchCommunityVlogs() {
    const VLOG_QUERY = await LUPA_DB.collection('vlogs').where('vlog_owner', '==', community.user_uuid);
    communityVlogObserver = VLOG_QUERY.onSnapshot(querySnapshot => {
        let updatedState = [];

        querySnapshot.forEach(doc => {
            let data = doc.data();

            if (typeof (data) != 'undefined') {
                updatedState.push(data);
            }
        });

        updatedState.concat(feedVlogs)
        setFeedVlogs(updatedState);

    }, error => {
        LOG_ERROR('CommunityFeed.js', 'Error fetching community vlog data.', error)
    });
}

fetchCommunityVlogs();
  }, [])

const renderVlogs = () => {
  if (feedVlogs.length === 0) {
      return (
          <View style={{alignItems: 'center', marginVertical: 20, width: '100%', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
              <View style={{marginVertical: 10, alignItems: 'center'}}>
              <Text style={{fontSize: 25, fontFamily: 'Avenir-Heavy'}}>
                  No Community Vlogs
              </Text>
              <Caption style={{fontFamily: 'Avenir', paddingHorizontal: 20}}>
                  This community has no vlogs.  Check back again later or {" "}
                  <Caption>
              create the first one.
              </Caption>
              </Caption>

              </View>
             
             <Image source={require('../images/vlogs/novlog.png')} style={{marginTop: 40, width: 220, height: 300}} />
          </View>
      )
  }


  return feedVlogs.map((vlog, index, arr) => {
      if (index == 0) {
          return <VlogFeedCard key={index} vlogData={vlog} showTopDivider={false} />
      }

      return (
          <VlogFeedCard key={index} clickable={true} vlogData={vlog} showTopDivider={true} />  
      )
  })
}

const renderFAB = () => {
        return (
          <FAB 
          small={false} 
          onPress={openActionSheet} 
          icon="menu" 
          style={{backgroundColor: '#1089ff', position: 'absolute', bottom: 0, right: 0, margin: 16, color: 'white', alignItems: 'center', justifyContent: 'center',}} color="white" 
          />
        )
}


      const handleUnFollowUser = () => {
        LUPA_CONTROLLER_INSTANCE.unfollowUser(community.user_uuid, currUserData.user_uuid);
    }

    const handleFollowUser = () => {
        LUPA_CONTROLLER_INSTANCE.followUser(community.user_uuid, currUserData.user_uuid)
    }

      const renderSocialBar = () => {
        return (
          <View style={{marginVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
            <View style={{alignItems: 'center'}}>
            <Text style={{fontFamily: 'Avenir-Medium'}}>
                Following
              </Text>
              <Text>
                {community.following.length}
              </Text>
            </View>

            <View style={{alignItems: 'center'}}>
            <Text style={{fontFamily: 'Avenir-Medium'}}>
                Followers
              </Text>
              <Text>
                {community.followers.length}
              </Text>
            </View>
          </View>
        )
      }

      const handleOnSignOut = async () => {
        await dispatch(logoutUser());
        await navigation.navigate('GuestView');
      }

      const renderSignOutButton = () => {
        return (
          <TouchableOpacity onPress={handleOnSignOut}>
          <View style={{ backgroundColor: 'white', borderColor: 'rgb(35, 73, 115)', borderWidth: 1, padding: 10, width: Dimensions.get('window').width - 20, alignSelf: 'center', marginVertical: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginHorizontal: 3, }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: 'rgb(35, 73, 115)' }}>
                  Sign Out
          </Text>
          </View>
      </TouchableOpacity>
        )
      }

      const renderFollowButton = () => {
        const updatedCurrUserData = getLupaStoreState().Users.currUserData;

        if (updatedCurrUserData.user_uuid == community.user_uuid) {
          return
        }
   
           if (updatedCurrUserData.following.includes(community.user_uuid) == false) {
               return (
                <TouchableOpacity onPress={handleFollowUser}>
                <View style={{ backgroundColor: 'rgb(35, 73, 115)', padding: 10, width: Dimensions.get('window').width - 20, alignSelf: 'center', marginVertical: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginHorizontal: 3, }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: 'white' }}>
                        Follow
                </Text>
                </View>
            </TouchableOpacity>
               )
           } else {
               return (
                <TouchableOpacity onPress={handleUnFollowUser}>
                <View style={{ backgroundColor: 'rgb(35, 73, 115)', padding: 10, width: 100, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginHorizontal: 3, }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: 'white' }}>
                        Unfollow
                </Text>
                </View>
            </TouchableOpacity>
               )
           }
       }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
               <View style={{backgroundColor: 'rgb(245, 245, 245)', height: 150, width: '100%'}}>
          <Image source={{ uri: community.photo_url }} style={{flex: 1, width: '100%', height: '100%'}} />

              <Animated.View style={{position: 'absolute', bottom: 0, paddingLeft: 10, flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width, justifyContent: 'space-between'}}>
                <Text style={{fontFamily: 'Avenir-Black', fontSize: 20, color: 'white', fontWeight: 'bold'}}>
                  {community.display_name}
                </Text>
              </Animated.View>
          </View>
        <ScrollView showsVerticalScrollIndicator={false}>


          <View style={{padding: 10}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Feather1s name="home" style={{paddingHorizontal: 5}} />
                <Caption> {community.location.city}, {community.location.state} </Caption>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Feather1s name="phone" style={{paddingHorizontal: 5}} />
                <Caption>{community.phone_number}</Caption>
              </View>
          </View>

       
          
   
            {renderSocialBar()}
            {renderFollowButton()}
            {renderSignOutButton()}
          

          <Divider />

        <View style={{paddingVertical: 10}}>
          {renderVlogs()}
        </View>
         
          
         
          <SafeAreaView />
      
        </ScrollView>
        {renderFAB()}
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