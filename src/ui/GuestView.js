/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  23, 2019
 *
 *  Featured
 */

import React, { useRef, createRef, LegacyRef } from 'react';
import {
    View,
    StyleSheet,
    Modal,
    ScrollView,
    ImageBackground,
    Animated,
    TouchableOpacity,
    Image,
    Text,
    Dimensions,
    Button as NativeButton,
    RefreshControl,
    SafeAreaView,
} from 'react-native';

import {
    Surface,
    Button,
    Card,
    Caption,
    Appbar,
    Divider,
    FAB,
    Banner,
    Portal,
    Dialog,
    Chip,
    TextInput,
    Avatar as PaperAvatar,
    Paragraph
} from 'react-native-paper';
import { Avatar, SearchBar } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import Feather1s from 'react-native-feather1s'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { Tabs, Tab, ScrollableTab, Header, Left, Right, Body } from 'native-base'
import LupaController from '../controller/lupa/LupaController';
import { connect, useDispatch } from 'react-redux';
import { RFValue } from 'react-native-responsive-fontsize';
import LUPA_DB from '../controller/firebase/firebase';
import VlogFeedCard from './user/component/VlogFeedCard';
import { FlatList, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Feather1fs from 'react-native-feather1s'
import { Constants } from 'react-native-unimodules';
import { MenuIcon } from './icons';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Pagination } from 'react-native-snap-carousel';
import moment from 'moment';
import { getLupaUserStructure } from '../controller/firebase/collection_structures';
import { getLupaStoreState} from '../controller/redux/index';
import BookingRequestModal from './user/modal/BookingRequestModal'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import BookingInformationModal from './sessions/modal/BookingInformationModal'
const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

const availabilityTimeBlocks = [
  {
    label: '6 a.m. - 9 a.m.',
    value: '6.am-9.pm'
  },
  {
    label:   '9 a.m. - 12 p.m.',
    value: '9.am-12.pm',
  },
  {
    label:   '12 p.m. - 4 p.m.',
    value: '12.pm-4.pm',
  },
  {
    label:  '4 p.m. - 7 p.m.',
    value: '4.pm-7.pm',
  },
  {
    label:    '7 p.m. - 10 p.m.',
    value: '7.pm-10.pm',
  }
]

const CATEGORY_SEPARATION = 15
const NAVBAR_HEIGHT = 50;
const {width: SCREEN_WIDTH} = Dimensions.get("window");
const COLOR = "#FFFFFF";
const TAB_PROPS = {
  tabStyle: {backgroundColor: COLOR},
  activeTabStyle: {backgroundColor: COLOR},
  textStyle: {color: "rgba(35, 55, 77, 0.75)", fontFamily: 'Avenir-Heavy'},
  activeTextStyle: {color: "#1089ff", fontFamily: 'Avenir-Heavy', fontWeight: 'bold'}
};

function AvailableTrainersModal({ isVisible, closeModal }) {
  return (
  <Modal presentationStyle="pageSheet" visible={isVisible} onDismiss={closeModal}>

  </Modal>
  )
}

class GuestView extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
        this.searchBarRef = createRef()
        this.bookingRef = createRef();
        this.startTimePickerRef = createRef()
        this.endTimePickerRef = createRef(); 
        this.futureBookingDateRef = createRef();

        this.state = {
            refreshing: false,
            searchValue: "",
            searchResults: [],
            searching: false,
            trainWithSwiperIndex: 0, //approved,
            featuredProgramsCurrentIndex: 0,
            lastRefresh: new Date().getTime(),
            recentlyAddedPrograms: [],
            topPicks: [],
            featuredPrograms: [],
            featuredTrainers: [],
            inviteFriendsIsVisible: false,
            showLiveWorkoutPreview: false,
            showTopPicksModalIsVisible: false,
            feedVlogs: [],
            suggestionBannerVisisble: false,
            bookingRequestModalIsVisible: false,
            searchBarFocused: false,
            bookingRequestDialogVisible: false,
            bookingEndTime: new Date(1598051730000),
            bookingStartTime: new Date(1598051730000),
            bookingEndTimeFormatted: moment(new Date(1598051730000)).format('LT').toString(),
            bookingStartTimeFormatted: moment(new Date(1598051730000)).format('LT').toString(),
            featuredTrainerHorizontalScrollIndex: 0,
            requestedTrainer: getLupaUserStructure(),
            displayDate: moment(new Date()).format('LL').toString(),
            startTimeIsSet: false,
            endTimeIsSet: false,
            futureBookingDisplayDate: new Date(),
            futureBookingDisplayDateFormatted: moment(new Date()).format('LL').toString(),
            futureBookingEndTime: new Date(1598051730000),
            futureBookingStartTime: availabilityTimeBlocks[0].value,
            futureBookingEndTimeFormatted: moment(new Date(1598051730000)).format('LT').toString(),
            futureBookingStartTimeFormatted: availabilityTimeBlocks[0].label,
            futureBookingTrainerNote: "",
            timeBlockSet: false,
            timeBlockBookingDialogVisible: false,
            availableTrainersModalIsVisible: false,
            availableTrainers: [],
        }
    }

    async componentDidMount() {
        let docData = getLupaUserStructure();

        this.TRAINERS_OBSERVER = LUPA_DB.collection('users').limit(3).where('isTrainer', '==', true).onSnapshot(querySnapshot => {
            let trainersDataList = [];
            querySnapshot.docs.forEach(doc => {
                docData = doc.data();

                if (typeof(docData) == 'undefined') {
                  return;
                }
                
                trainersDataList.push(docData);

            });
            this.shuffle(trainersDataList)
            this.setState({ featuredTrainers: trainersDataList })
        });

        this.LUPA_CONTROLLER_INSTANCE.getAvailableTrainersByDateTime(new Date(), new Date().getTime()).then(trainers => {
          this.setState({ availableTrainers: trainers });
        }).catch(error => {
          this.setState({ availableTrainers: []})
        })
    }

    async componentWillUnmount() {
        return () => this.PROGRAMS_OBSERVER(); 
    }

    shuffle = (array) => {
      var currentIndex = array.length, temporaryValue, randomIndex;
    
      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
    
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
    
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
    
      return array;
    }

    handleOnRefresh = () => {
        this.setState({ refreshing: true })
        this.setState({ refreshing: false })
      }

      renderFutureBookingDatePicker = () => {
        return (
          <RBSheet
          ref={this.futureBookingDateRef}
          height={300}>
            <View style={{flex: 1}}>
            <DateTimePicker
            customStyles={{
              datePicker: {
                backgroundColor: '#d1d3d8',
        justifyContent:'center'
              }
            }}
            value={this.state.futureBookingDisplayDate}
            mode='date'
            is24Hour={false}
            display="default"
            onChange={this.onChangeFutureBookingDate}
          />
            </View>
            <SafeAreaView>
              <Button onPress={this.handleOnPickFutureBookingDate} color="#1089ff" mode="contained" style={{marginVertical: 10, elevation: 0, height: 45, alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width - 50, alignSelf: 'center'}}>
                Done
              </Button>
            </SafeAreaView>
          </RBSheet>
        )
      }

      renderFutureStartTimePicker = () => {
        return (
          <RBSheet
          ref={this.startTimePickerRef}
          height={300}>
            <View style={{flex: 1}}>
              <ScrollView>
              {
              
              availabilityTimeBlocks.map(block => {
                return (
                  <TouchableWithoutFeedback style={{marginVertical: 10}} key={block.value} onPress={() => this.onChangeFutureStartTime(block)}>
                    <Text>
                      {block.label}
                    </Text>
                  </TouchableWithoutFeedback>
            
                )
              })
            }
              </ScrollView>
            </View>
            <SafeAreaView>
              <Button onPress={this.handleOnPickFutureStartTime} color="#1089ff" mode="contained" style={{marginVertical: 10, elevation: 0, height: 45, alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width - 50, alignSelf: 'center'}}>
                Done
              </Button>
            </SafeAreaView>
          </RBSheet>
        )
      }
      
renderFutureEndTimePicker = () => {
    return (
    <RBSheet
    ref={this.endTimePickerRef}
    height={300}>
      <View style={{flex: 1}}>
      <DateTimePicker
            value={this.state.futureBookingEndTime}
            mode='time'
            is24Hour={false}
            display="default"
            onChange={this.onChangeFutureEndTime}
          />
      </View>
      <View>
              <Button onPress={this.handleOnPickFutureEndTime} color="#1089ff" mode="contained" style={{marginVertical: 15, elevation: 0, height: 45, alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width - 50, alignSelf: 'center'}}>
                Done
              </Button>
              <SafeAreaView />
            </View>
    </RBSheet>
    )
      }

     

     handleOnPickFutureStartTime = async () => {
      await this.LUPA_CONTROLLER_INSTANCE.getAvailableTrainersByDateTime(this.state.futureBookingDisplayDate, this.state.futureBookingStartTime).then(data => {
        this.setState({ availableTrainers: data })
      })

        this.setStartTimeIsSet(true);
        this.closeStartTimePicker();
      }
  
     handleOnPickFutureEndTime = () => {
        this.setEndTimeIsSet(true);
        this.closeEndTimePicker();
      }

      handleOnPickFutureBookingDate = async () => {
        await this.LUPA_CONTROLLER_INSTANCE.getAvailableTrainersByDateTime(this.state.futureBookingDisplayDate, this.state.futureBookingStartTime).then(data => {
          this.setState({ availableTrainers: data })
        })
        this.closeFutureBookingDatePicker()
      }
    
    
     onChangeFutureStartTime = (block) => {
        this.setState({ futureBookingStartTime: block.value, futureBookingStartTimeFormatted: block.label});
        this.startTimePickerRef.current.close()
      };
    
     onChangeFutureEndTime = (event, date) => {
        const currentDate = date;
        const currentDateFormatted = moment(new Date(date)).format('LT').toString()
        this.setState({ futureBookingEndTime: currentDate, futureBookingEndTimeFormatted: currentDateFormatted});
      }

      onChangeFutureBookingDate = (event, date) => {
        const currentDate = date;
        const currentDateFormatted = moment(new Date(date)).format('LL').toString()
        this.setState({ futureBookingDisplayDate: currentDate, futureBookingDisplayDateFormatted: currentDateFormatted });
      }

      handleOnNavigateToCreateAccount = () => {
          this.bookingRef.current.close()
          this.props.navigation.navigate('SignUp')
      }

      openFutureBookingStartTimePicker = () => {
        if (this.startTimePickerRef) {
          this.startTimePickerRef.current.open()
        }
      }

      openFutureBookingEndTimePicker = () => {
        if (this.endTimePickerRef) {
          this.endTimePickerRef.current.open()
        }
      }

      closeFutureBookingStartTimePicker = () => {
        if (this.startTimePickerRef) {
          this.endTimePickerRef.current.close()
        }
      }

      closeFutureBookingEndTimePicker = () => {
        if (this.startTimePickerRef) {
          this.startTimePickerRef.current.close()
        }
      }

      openFutureBookingDatePicker = () => {
        if (this.futureBookingDateRef) {
          this.futureBookingDateRef.current.open()
        }
      }

      closeFutureBookingDatePicker = () => {
        if (this.futureBookingDateRef) {
          this.futureBookingDateRef.current.close()
        }
      }

    handleNavigateToProfile = (trainer) => {
      if (this.bookingRef.current) {
        this.bookingRef.current.close();
      }

        this.navigateToProfile(trainer.user_uuid)
      }

    renderRBSheet = () => {

        return (
            <RBSheet 
            height={400}
            ref={this.bookingRef}>
  <View style={{flex: 1, padding: 10,}}>
<ScrollView showsVerticalScrollIndicator={false}>
<Text style={{fontFamily: 'Avenir-Heavy', fontSize: 18}}>
        Available Trainers
          </Text>
          
          {
            this.state.availableTrainers.length === 0 ?
            <Caption>
              There are no available trainers for this date and time.
            </Caption>
            :
            this.state.availableTrainers.map((trainer, index, arr) => {
              return (
                <>

                <View style={{paddingHorizontal: 10, paddingVertical: 15, width: '100%', flexDirection: 'row', alignItems: 'center'}}>
                    <PaperAvatar.Image style={{borderWidth: 1, borderColor: 'grey'}} size={35} source={{uri: this.props.lupa_data.Users.currUserData.photo_url}} />
                    <View style={{paddingHorizontal: 10}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontSize: 15, fontWeight: '500'}}>
                        {trainer.display_name}
                    </Text>
                    <Image style={{width: 18, height: 18, marginHorizontal: 5}} source={require('./images/certificate_icon.jpeg')} />
                    </View>
                    
                    <Text style={{fontWeight: '400', fontSize: 12, color: 'rgb(158, 154, 170)'}}>
                        {trainer.bio}
                    </Text>
                    </View>
                </View>
                <Button 
                onPress={() => {
                  this.closeBookingBottomSheet()
                  this.props.navigation.push('Profile', {
                    userUUID: trainer.user_uuid
                  });
                }
                } 
                uppercase={false} 
                color="#23374d" 
                contentStyle={{width: '100%'}} 
                mode="contained" 
                style={{ elevation: 0, marginVertical: 5}}>
                  View Profile
                </Button>
                                    <Divider style={{width: Dimensions.get('window').width, alignSelf: 'center',}} />
                                    </>
              )
            })
          }
         
                                    </ScrollView>
                   </View>
            </RBSheet>
        )
    }

   handleCloseRequestBookingDialog = () => {
        this.onCloseRequestBookingDialog();
        this.setState({ bookingRequestDialogVisible: false })
      }
    
      handleOpenRequestBookingDialog = () => {
        this.setState({ bookingRequestDialogVisible: true })
      }
    
    onCloseRequestBookingDialog = () => {
        //reset state
      }
    
     handleOnRequestBooking = (userData) => {
         if (typeof(userData) == 'undefined') {
             return;
         }

        if (moment(this.state.bookingEndTime).isBefore(moment(this.state.bookingStartTime))) {
          //invalid times
          this.setState({snackBarMessage: "Invalid time period", setSnackBarVisible: true });
          return;
        } 
    
       /* if (!moment(endTime).subtract(60, 'minutes').isSame(moment(startTime)) || !moment(endTime).subtract(90, 'minutes').isSame(moment(startTime))) {
          //check time intervals
          alert('uh')
          setSnackBarMessage('Bookings must be in 60 or 90 minutes intervals.');
          setSnackBarVisible(true);
          return;
        }*/
    
        const trainerUUID = userData.uuid;
        const requesterUUID = this.props.lupa_data.currUserData.user_uuid;
        const isSet = false;
    
        //create a booking structure
        const booking = getBookingStructure(moment(this.state.bookingStartTime).format('LT').toString(), moment(this.state.bookingEndTime).format('LT').toString(), trainerUUID, requesterUUID, isSet, entryDate)
    
        //send to backend
         this.LUPA_CONTROLLER_INSTANCE.createBookingRequest(booking);
    
         this.handleCloseRequestBookingDialog();
      }

      openBookingBottomSheet = async (trainer) => {
        if (typeof(trainer) == 'undefined') {
          return;
        }

        await this.setState({ requestedTrainer: trainer })
        if (this.bookingRef.current) {
          this.bookingRef.current.open();
        }
      }

      closeBookingBottomSheet = async () => {
        if (this.bookingRef.current) {
          this.bookingRef.current.close();
        }
      }

    handleBookTrainerOnPress = async (trainer) => {
        if (this.props.lupa_data.Auth.isAuthenticated === false) {
          this.props.navigation.navigate('SignUp')
          return;
        }

        if (typeof(trainer) == 'undefined') {
          return;
        } else {
          await this.setState({ requestedTrainer: trainer });
        }

        this.setState({ bookingRequestModalIsVisible: true });
    }

    handleTrainerCardOnPress = (trainer) => {
      this.openBookingBottomSheet(trainer)
    }

    handleOnScrollTrainerView = (e) => {
            let contentOffset = e.nativeEvent.contentOffset;
            let viewSize = e.nativeEvent.layoutMeasurement;
        
            // Divide the horizontal offset by the width of the view to see which page is visible
            let pageNum = Math.floor(contentOffset.x / viewSize.width);
            this.setState({ featuredTrainerHorizontalScrollIndex: pageNum })
    }

    checkSearchBarState = () => {
        if (this.state.searchBarFocused === true) {
          if (this.props.navigation) {
            this.props.navigation.push('Search')
          }

            this.searchBarRef.current.blur();
        }
    }

    navigateToProfile = (uuid) => {
      if (this.props.lupa_data.Auth.isAuthenticated === false) {
        this.props.navigation.push('SignUp')
        return;
      }
      if (typeof(uuid) == 'undefined') {
        return;
      }

     if (this.props.navigation) {
       this.props.navigation.push('Profile', {
         userUUID: uuid
       })
     }
    }

    handleOnRequestFutureBooking = async () => {

      if (this.props.lupa_data.Auth.isAuthenticated === false) {
        this.props.navigation.navigate('SignUp')
        return;
      }

        if (this.bookingRef.current) {
          this.bookingRef.current.open()
        }
    }

    renderRequestAuthenticationMessage = () => {
      const updatedAuthState = getLupaStoreState().Auth;

      if (updatedAuthState.isAuthenticated === false) {
        return (
          <View style={{padding: 5, }}>
          <Text style={{paddingLeft: 15, fontFamily: 'Avenir-Heavy'}}>
                                   Discover more by creating an account.
                                 </Text>
                                 <Button onPress={() => this.props.navigation.push('SignUp')} icon={() => <FeatherIcon name="user" />} color="#1089ff" style={{alignSelf: 'flex-start'}} uppercase={false}>
                                   Login or Create Account
                                 </Button>
          </View>
        )
      }
    }

    renderCreateAccountSection = () => {
      const updatedAuthState = getLupaStoreState().Auth;

      if (updatedAuthState.isAuthenticated === false) {
        return (
          <View style={{padding: 10, paddingVertical: 15, marginVertical: 20}}>
    
    <Text style={{fontFamily: 'Avenir-Medium', fontSize: 18, color: 'black'}}>
        Register an account on Lupa and access a variety of fitness trainers 
    </Text>

    <Button color="#23374d" uppercase={false} mode="outlined" onPress={() => this.props.navigation.navigate('SignUp')} style={{width: 180, marginVertical: 10}}>
      <Text style={{fontSize: 12}}>
                    Create an account
      </Text>
    </Button>

</View>
        )
      }
    }

    renderPaymentInformationBanner = () => {
      try {
      const updatedAppState = getLupaStoreState();
      if (typeof(updatedAppState.Users.currUserData.card_added_to_stripe) == false && updatedAppState.Auth.isAuthenticated === true && updatedAuthState.Users.currUserData.isTrainer === true ) {
        return (
          <Banner 
          visible={true}
          icon={() => <MaterialIcon name="payment" size={22} color="#1089ff" />}
          actions={[{
label: 'Update Payment Information',
color: "#1089ff",
onPress: () => this.props.navigation.push('Settings')
}]}
style={{fontSize: 5}}
contentStyle={{fontSize: 5}}
>
Thank you for using Lupa.  Your account won't show up on searches and users won't be able to book you until you add a card to receive payouts.
</Banner>
        )
      }
    } catch(error) {
      return null;
    }

      return null;
    }

    render() {
      this.checkSearchBarState()
        return (
            
          <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
           <KeyboardAwareScrollView style={{flex: 1, backgroundColor: 'white'}}>        
         <ScrollView
         refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleOnRefresh}/>}
           scrollEventThrottle={1}
           bounces={false}
           showsVerticalScrollIndicator={false}
         >
             <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Search')}>
  <SearchBar
  onStartShouldSetResponder={event => false}
  onStartShouldSetResponderCapture={event => false}
                        ref={this.searchBarRef}
                        placeholder="Search trainers"
                        placeholderTextColor="#000000"
                        value={this.state.searchValue}
                        inputStyle={styles.inputStyle}
                        platform="ios"
                        containerStyle={{backgroundColor: 'white', borderColor: 'white'}}
                        inputContainerStyle={{borderColor: 'white', backgroundColor: '#EEEEEE'}}
                        searchIcon={() => <MaterialIcon name="search" color="#1089ff" size={20} onPress={() => this.setState({ searchBarFocused: true })} />}

                        onFocus={() => this.setState({ searchBarFocused: true })}
                        onBlur={() => this.setState({ searchBarFocused: false })}
                    />
                                 </TouchableWithoutFeedback>

                                 {this.renderPaymentInformationBanner()}

          {
            this.renderRequestAuthenticationMessage()
          }
          
            <Divider style={{height: 10, backgroundColor: '#EEEEEE'}} />

{/*
<View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <Chip mode="flat" textStyle={{paddingVertical: 5, color: 'rgb(199, 199, 204)', fontWeight: '600'}} style={{marginHorizontal: 10, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center', borderRadius: 3, padding: 3}}>
                            Miami
                        </Chip>

                        <Chip mode="flat" textStyle={{paddingVertical: 5, color: 'rgb(199, 199, 204)', fontWeight: '600'}} style={{marginHorizontal: 10, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center', borderRadius: 3, padding: 3}}>
                            Miami
                        </Chip>

                        <Chip mode="flat" textStyle={{paddingVertical: 5, color: 'rgb(199, 199, 204)', fontWeight: '600'}} style={{marginHorizontal: 10, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center', borderRadius: 3, padding: 3}}>
                            Miami
                        </Chip>

                        <Chip mode="flat" textStyle={{paddingVertical: 5, color: 'rgb(199, 199, 204)', fontWeight: '600'}} style={{marginHorizontal: 10, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center', borderRadius: 3, padding: 3}}>
                            Miami
                        </Chip>

                        <Chip mode="flat" textStyle={{paddingVertical: 5, color: 'rgb(199, 199, 204)', fontWeight: '600'}} style={{marginHorizontal: 10, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center', borderRadius: 3, padding: 3}}>
                            Miami
                        </Chip>
        </ScrollView>
    </View>
*/}


            

            <View style={{marginVertical: 5}}>
            <Text style={{fontSize: 15, padding: 10, fontFamily: 'Avenir-Heavy'}}>
                  Curated for you
                </Text>
                <View>
            <ScrollView
            pagingEnabled={true}
            decelerationRate={0}
            snapToAlignment='center'
            snapToInterval={Dimensions.get('window').width}
            horizontal
            showsHorizontalScrollIndicator={false}
            >
                {
                    this.state.featuredTrainers.map(trainer => {
                        return (
                          <TouchableOpacity onPress={() => this.handleBookTrainerOnPress(trainer)}>
                            <Surface  style={{ elevation: 0, marginHorizontal: 15, marginVertical: 12}} >
                             
                              <View>
                                
                              <Avatar key={trainer.user_uuid} source={{uri: trainer.photo_url}} size={120} />
                             
                              <Surface style={{elevation: 5, width: 30, height: 30, alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 0, right: 0, margin: 12, borderRadius: 30}}>
                                <Feather1s name="calendar" color="#1089ff" />
                              </Surface>
                           

                              </View>

                              <View style={{height: 50, justifyContent: 'space-evenly'}}>
                              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <FeatherIcon name="info" color="#1089ff" style={{paddingHorizontal: 3}} />
                              <Text style={{ fontFamily: 'Avenir-Light', fontSize: 12, }}>
                                Available Today
                              </Text>
                              </View>

                              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <FeatherIcon name="map-pin" color="#1089ff" style={{paddingHorizontal: 3}} />
                              <Text style={{ fontFamily: 'Avenir-Light', fontSize: 12, }}>
                                {trainer.location.city}, {trainer.location.state}
                              </Text>
                              </View>
                              </View>

              
                             

                              <View style={{width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.2)', position: 'absolute'}}/>
                            </Surface>
                            </TouchableOpacity>
                           
                        )
                    })
                }
                
            </ScrollView>
            </View>
           
            </View>

            <Divider  style={{marginVertical: 10}} />

            <View style={{padding: 10, width: '100%'}}>
                <View style={{paddingHorizontal: 5, paddingVertical: 10, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Text style={{fontSize: 15, fontFamily: 'Avenir-Heavy'}}>
                 Book by your availability
                </Text>
                </View>

                <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
                <TouchableWithoutFeedback onPress={this.openFutureBookingDatePicker} style={{ marginRight: 15, marginVertical: 10,  alignSelf: 'center', padding: 5, borderRadius: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderWidth: 0.5, borderColor: '#E5E5E5', justifyContent: 'space-evenly'}} icon={() => <FeatherIcon name="chevron-down" />}>
                      <FeatherIcon name="calendar" color="#1089ff" />
                      <Text style={{paddingHorizontal: 10, fontWeight: '500', fontSize: 12}}>
                      {this.state.futureBookingDisplayDateFormatted}
                      </Text>
                      <FeatherIcon name="chevron-down" />
                  </TouchableWithoutFeedback>

                  <TouchableWithoutFeedback onPress={this.openFutureBookingStartTimePicker} style={{marginRight: 15, padding: 5, borderRadius: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderWidth: 0.5, borderColor: '#E5E5E5'}} icon={() => <FeatherIcon name="chevron-down" />}>
                      <FeatherIcon name="clock" color="#1089ff" />
                      <Text style={{paddingHorizontal: 10, fontWeight: '500', fontSize: 12}}>
                      {this.state.futureBookingStartTimeFormatted}
                      </Text>
                      <FeatherIcon name="chevron-down" />
                  </TouchableWithoutFeedback>
                </View>


                
                <Button onPress={this.handleOnRequestFutureBooking} style={{marginVertical: 15}} disabled={false} color="#23374d" uppercase={true} icon={() => <FeatherIcon name='calendar' color="white" />} mode="contained" contentStyle={{height: 45}}>
                   Find Trainer
                </Button>               
              </View>
            
        
                <Divider  style={{marginVertical: 10}} />
              
              <View style={{marginVertical: 10, width: '100%'}}>
                <View style={{paddingHorizontal: 5, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Text style={{fontSize: 15, padding: 10, fontFamily: 'Avenir-Heavy'}}>
              Promoted Trainers
          </Text>

                </View>

                <ScrollView scrollEnabled={false}>
                  {
                    this.state.featuredTrainers.map(trainer => {
                      return (
                        <TouchableWithoutFeedback onPress={() => this.navigateToProfile(trainer.user_uuid)} key={trainer.user_uuid} style={{paddingHorizontal: 10, marginVertical: 10}}>
                        <View>
                          <View style={{alignItems: 'flex-start', flexDirection: 'row'}}>

                          <Surface style={{elevation: 5}}>
                          <Avatar size={45} source={{uri: trainer.photo_url}} />
                          </Surface>
                         
                          <View style={{paddingHorizontal: 10}}>
                            <Text style={{paddingVertical: 5, fontSize: 12, fontFamily: 'Avenir-Heavy'}}>
                              {trainer.display_name}
                            </Text>
                            
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <FeatherIcon size={10} name="map-pin" style={{paddingRight: 3}} />
                            <Text style={{fontSize: 12, fontFamily: 'Avenir-Light'}}>
                            {trainer.location.city}, {trainer.location.state}
                            </Text>
                            </View>
                            
                          </View>
                          </View>
                        </View>

                        <Paragraph style={{fontSize: 10}} numberOfLines={2} ellipsizeMode="tail">
                       {trainer.bio}
                          </Paragraph>
                      </TouchableWithoutFeedback>
                      )
                    })
                  }
                </ScrollView>
              </View>


              

{
  this.renderCreateAccountSection()
}



              <View style={{marginVertical: 10, width: '100%'}}>
                <View style={{paddingHorizontal: 5, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Text style={{fontSize: 15, padding: 10, fontFamily: 'Avenir-Heavy'}}>
              By Lupa
          </Text>


                </View>

                <ScrollView scrollEnabled={false}>
                  {
                    this.state.featuredTrainers.map(trainer => {
                      return (
                        <TouchableWithoutFeedback onPress={() => this.navigateToProfile(trainer.user_uuid)} key={trainer.user_uuid} style={{paddingHorizontal: 10, marginVertical: 10}}>
                        <View>
                          <View style={{alignItems: 'flex-start', flexDirection: 'row'}}>

                          <Surface style={{elevation: 5}}>
                          <Avatar size={45} source={{uri: trainer.photo_url}} />
                          </Surface>
                         
                          <View style={{paddingHorizontal: 10}}>
                            <Text style={{paddingVertical: 5, fontSize: 12, fontFamily: 'Avenir-Heavy'}}>
                              {trainer.display_name}
                            </Text>
                            
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <FeatherIcon size={10} name="map-pin" style={{paddingRight: 3}} />
                            <Text style={{fontSize: 12, fontFamily: 'Avenir-Light'}}>
                              {trainer.location.city}, {trainer.location.state}
                            </Text>
                            </View>
                            
                          </View>
                          </View>
                        </View>

                        <Paragraph style={{fontSize: 10}} numberOfLines={2} ellipsizeMode="tail">
                        {trainer.bio}
                          </Paragraph>
                      </TouchableWithoutFeedback>
                      )
                    })
                  }
                </ScrollView>
              </View>
         </ScrollView>
                
            
           <SafeAreaView />
           {this.renderFutureStartTimePicker()}
           {this.renderFutureEndTimePicker()}
           {this.renderFutureBookingDatePicker()}
           {this.renderRBSheet()}
          <BookingRequestModal 
            isVisible={this.state.bookingRequestModalIsVisible} 
            closeModal={() => this.setState({ bookingRequestModalIsVisible: false })} 
            trainer={this.state.requestedTrainer} 
            preFilledStartTime={this.state.preFilledStartTime}
            preFilledEndTime={this.state.preFilledEndTime}
            preFilledTrainerNote={this.state.preFilledTrainerNote}
            prefilledDate={this.state.futureBookingDisplayDate}
            />
            <AvailableTrainersModal isVisible={this.state.availableTrainersModalIsVisible} closeModal={() => this.setState({ availableTrainersModalIsVisible: false })} />
       </KeyboardAwareScrollView>
       </SafeAreaView>
        );

    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    mainGraphicText: {

        color: '#FFFFFF',
        fontSize: 25,
        alignSelf: 'flex-start'
    },
    subGraphicText: {

        color: '#FFFFFF',
        alignSelf: 'flex-start',
        textAlign: 'left',
    },
    graphicButton: {
        alignSelf: 'flex-start',
    },
    viewOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 0,
    },
    chipText: {
        color: 'white',

    },
    chip: {
        position: 'absolute',
        top: 15,
        right: 10,
        backgroundColor: '#2196F3',
        elevation: 15
    },
    imageBackground: {
        flex: 1,
        width: Dimensions.get('window').width,
        borderRadius: 0,
        alignItems: 'flex-start',
        justifyContent: 'space-around',
    },
    sectionHeaderText: {
        fontSize: RFValue(15), fontFamily: 'Avenir-Heavy', fontSize: 15,
    },

    inputStyle: {
        fontSize: 15, fontFamily: 'Avenir-Roman'

    },
    appbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
      //  borderBottomWidth: 0.5, borderColor: 'rgb(174, 174, 178)',
       // borderBottomColor: 'rgb(199, 199, 204)', 
       // borderBottomWidth: 0.8,
        elevation: 0,
    },
    iconContainer: {
        width: '10%', alignItems: 'center', justifyContent: 'center'
    },

});

export default connect(mapStateToProps)(GuestView);
