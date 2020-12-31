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

import {
  Button as ElementsButton
} from 'react-native-elements';

import { Avatar, SearchBar } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import Feather1s from 'react-native-feather1s'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import FeatherIcon from 'react-native-vector-icons/Feather'
import LupaController from '../controller/lupa/LupaController';
import { connect, useDispatch } from 'react-redux';
import { RFValue } from 'react-native-responsive-fontsize';
import LUPA_DB from '../controller/firebase/firebase';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import getLocationFromCoordinates from '../modules/location/mapquest/mapquest';
import { getUpdateCurrentUserAttributeActionPayload } from '../controller/redux/payload_utility';
import { request, PERMISSIONS, RESULTS, check, requestMultiple } from 'react-native-permissions';
import RBSheet from 'react-native-raw-bottom-sheet';
import moment from 'moment';
import { getLupaUserStructure } from '../controller/firebase/collection_structures';
import { getLupaStoreState } from '../controller/redux/index';
import BookingRequestModal from './user/modal/BookingRequestModal'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LOG_ERROR } from '../common/Logger';
import Geolocation from '@react-native-community/geolocation';
import PurchaseProgramWebView from './workout/program/modal/PurchaseProgramWebView'

const mapStateToProps = (state, action) => {
  return {
    lupa_data: state,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateUserAttribute: (payload) => {
      dispatch({
        type: 'UPDATE_CURRENT_USER_ATTRIBUTE',
        payload: payload
      })
    },
  }
}

const availabilityTimeBlocks = [
  {
    label: '6 a.m. - 9 a.m.',
    value: '6.am-9.pm'
  },
  {
    label: '9 a.m. - 12 p.m.',
    value: '9.am-12.pm',
  },
  {
    label: '12 p.m. - 4 p.m.',
    value: '12.pm-4.pm',
  },
  {
    label: '4 p.m. - 7 p.m.',
    value: '4.pm-7.pm',
  },
  {
    label: '7 p.m. - 10 p.m.',
    value: '7.pm-10.pm',
  }
]

class GuestView extends React.Component {
  constructor(props) {
    super(props);

    this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    this.searchBarRef = createRef()
    this.bookingRef = createRef();
    this.startTimePickerRef = createRef()
    this.endTimePickerRef = createRef();
    this.futureBookingDateRef = createRef();
    this.bookingRequestRef = createRef();

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
      curatedTrainers: [],
      promotedTrainers: [],
      byLupaTrainers: [],
      componentIsFetching: false,
    }
  }

  async componentDidMount() {
    let docData = getLupaUserStructure();
    let promotedTrainersIn = [];
    let byLupaTrainersIn = []

    this.setState({ componentIsFetching: true })

    this.PROMOTED_TRAINERS_OBSERVER = LUPA_DB.collection('users').limit(3).where('isTrainer', '==', true).onSnapshot(querySnapshot => {
      promotedTrainersIn = [];
      querySnapshot.docs.forEach(doc => {
        docData = doc.data();
        if (typeof (docData) == 'undefined') {
          return;
        }

        promotedTrainersIn.push(docData);
      });

      this.shuffle(promotedTrainersIn);
      this.setState({ promotedTrainers: promotedTrainersIn })
    });

    this.BY_LUPA_TRAINERS = LUPA_DB.collection('users').limit(3).where('isTrainer', '==', true).onSnapshot(querySnapshot => {
      byLupaTrainersIn = [];
      querySnapshot.docs.forEach(doc => {
        docData = doc.data();
        if (typeof (docData) == 'undefined') {
          return;
        }

        byLupaTrainersIn.push(docData);
      });

      this.shuffle(byLupaTrainersIn);
      this.setState({ byLupaTrainers: byLupaTrainersIn })
    });

    await this.fetchCuratedTrainers();

    await this.LUPA_CONTROLLER_INSTANCE.getAvailableTrainersByDateTime(this.state.futureBookingDisplayDate, this.state.futureBookingStartTime).then(data => {
      this.setState({ availableTrainers: data })
    })

    this.setState({ componentIsFetching: false })
  }

  async componentWillUnmount() {
    return () => {
      () => this.PROMOTED_TRAINERS_OBSERVER();
      () => this.BY_LUPA_TRAINERS();
    }
  }

  fetchCuratedTrainers = async () => {
    const updatedAppState = getLupaStoreState()
    const curatedTrainersLocation = updatedAppState.Users.currUserData.location;

    await this.LUPA_CONTROLLER_INSTANCE.generateCuratedTrainers(curatedTrainersLocation).then(data => {
      this.setState({ curatedTrainers: data, componentIsFetching: false })
    }).catch(error => {
      LOG_ERROR('GuestView.js', 'componentDidMount::Caught error in generateCuratedTrainers.', error);
      this.setState({ curatedTrainers: [], componentIsFetching: false })
    })
  }

  /**
 * Fetches the user's location and populates the user lat, 
 * long, city, state, and country in the database.
 * 
 * TODO: This methid is not working.  Throws an error due to the 'coords' key missing due to async
 * behavior.
 */
  getLocationAsync = async () => {
    this.setState({ componentIsFetching: true })
    try {
      await Geolocation.getCurrentPosition(
        async (locationInfo) => {
          const locationData = await getLocationFromCoordinates(locationInfo.coords.longitude, locationInfo.coords.latitude);
          // await this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('location', locationData);
          //udpate user in redux
          const payload = await getUpdateCurrentUserAttributeActionPayload('location', locationData, []);
          this.props.updateUserAttribute(payload);
        },
        async (error) => {
          const errLocationData = {
            city: 'Unknown',
            state: 'Unknown',
            country: 'USA',
            latitude: '37.7749',
            longitude: '122.4194',
          }


          //Update user location in database
          // await this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('location', errLocationData);

          //udpate user in redux
          const payload = await getUpdateCurrentUserAttributeActionPayload('location', errLocationData, []);
          this.props.updateUserAttribute(payload);
        },
      );
    } catch (error) {
      const errLocationData = {
        city: 'Unknown',
        state: 'Unknown',
        country: 'USA',
        latitude: '37.7749',
        longitude: '122.4194',
      }


      //Update user location in database
      // await this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('location', errLocationData);

      //udpate user in redux
      const payload = await getUpdateCurrentUserAttributeActionPayload('location', errLocationData, []);
      this.props.updateUserAttribute(payload);


      this.setState({ componentIsFetching: false })
    }


    this.setState({ componentIsFetching: false })

  }

  handleFetchUserLocation = () => {
    this.handleRequestLocationServices();
  }

  handleRequestLocationServices = () => {
    check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
      .then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            //tell user it is not available on this device
            Alert.alert(
              'Location Services Unavailable',
              'It looks like location services are not available on your device.',
              [{ text: 'Okay', onPress: () => { } }
              ]
            )
            break;
          case RESULTS.DENIED:
            //request permission
            request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result) => {
              if (result == RESULTS.DENIED || result == RESULTS.BLOCKED) {
                alert('Location services have been clocked or denied.  Enable location services from your settings application.');
              } else if (result == RESULTS.UNAVAILABLE) {
                alert('It looks like location services are not available on your device.');
              } else {
                //otherwise the services have been granted and there is nothing to do
                this.getLocationAsync();
              }
            });
            break;
          case RESULTS.GRANTED:
            // nothing to do
            this.getLocationAsync();
            break;
          case RESULTS.BLOCKED:
            // alert the user to change it from settings
            Alert.alert(
              'Location Services Blocked',
              'It looks like location have been disabled on your device.  Enable location services in the lupa section of your phones settings.',
              [{ text: 'Okay', onPress: () => { } }
              ]
            )
            break;
        }
      })
      .catch((error) => {
        // …
        // alert('Oops.  It looks like there was an error while trying to anable the Camera permission.  You can enable it from the Lupa tab in the Settings app.')
      });
  }

  renderPromotedTrainers = () => {
    const trainersMap = this.state.promotedTrainers;

    try {
      return trainersMap.map(trainer => {
        if (typeof (trainer) == 'undefined') {
          return;
        }



        return (
          <TouchableWithoutFeedback onPress={() => this.navigateToProfile(trainer.user_uuid)} key={trainer.user_uuid} style={{ paddingHorizontal: 10, borderRadius: 12, marginVertical: 10 }}>
            <View style={{borderRadius: 12}}>
              <View style={{ alignItems: 'center', flexDirection: 'row' }}>

                <Surface style={{ elevation: 0, borderRadius: 12 }}>
                  <PaperAvatar.Image source={{uri: trainer.photo_url}}  key={trainer.user_uuid} size={45} rounded containerStyle={{borderRadius: 12}} />
                </Surface>

                <View style={{ paddingHorizontal: 10 }}>
                  <Text style={{ paddingVertical: 5, fontSize: 15, fontFamily: 'Avenir-Heavy' }}>
                    {trainer.display_name}
                  </Text>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <FeatherIcon size={10} name="map-pin" style={{ paddingRight: 3 }} />
                    <Text style={{ fontSize: 12, fontFamily: 'Avenir-Light' }}>
                      {trainer.location.city}, {trainer.location.state}
                    </Text>
                  </View>

                </View>
              </View>
            </View>

            <Paragraph style={{ fontSize: 10 }} numberOfLines={2} ellipsizeMode="tail">
              {trainer.bio}
            </Paragraph>
          </TouchableWithoutFeedback>
        )
      });
    } catch (error) {
      return (
        <View style={{ padding: 20 }}>
          <Caption>
            Oops it looks like something went wrong.  Check back again later.
                 </Caption>
        </View>
      );
    }
  }

  renderByLupaTrainers = () => {
    const trainersMap = this.state.byLupaTrainers;

    try {
      return trainersMap.map(trainer => {
        if (typeof (trainer) == 'undefined') {
          return;
        }

        return (
          <TouchableWithoutFeedback onPress={() => this.navigateToProfile(trainer.user_uuid)} key={trainer.user_uuid} style={{ paddingHorizontal: 10, marginVertical: 10 }}>
            <View>
              <View style={{ alignItems: 'center', flexDirection: 'row' }}>

                <Surface style={{ elevation: 0 }}>
                  <PaperAvatar.Image key={trainer.user_uuid} rounded size={45} source={{ uri: trainer.photo_url }} />
                </Surface>

                <View style={{ paddingHorizontal: 10 }}>
                  <Text style={{ paddingVertical: 5, fontSize: 15, fontFamily: 'Avenir-Heavy' }}>
                    {trainer.display_name}
                  </Text>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <FeatherIcon size={10} name="map-pin" style={{ paddingRight: 3 }} />
                    <Text style={{ fontSize: 12, fontFamily: 'Avenir-Light' }}>
                      {trainer.location.city}, {trainer.location.state}
                    </Text>
                  </View>

                </View>
              </View>
            </View>

            <Paragraph style={{ fontSize: 10 }} numberOfLines={2} ellipsizeMode="tail">
              {trainer.bio}
            </Paragraph>
          </TouchableWithoutFeedback>
        )
      });
    } catch (error) {
      return (
        <View style={{ padding: 20 }}>
          <Caption>
            Oops it looks like something went wrong.  Check back again later.
          </Caption>
        </View>
      );
    }
  }

  renderCuratedTrainers = () => {
    const updatedAppState = getLupaStoreState()
    const curatedTrainers = this.state.curatedTrainers;

    if (curatedTrainers.length === 0) {
      if (updatedAppState.Auth.isAuthenticated === false) {
        return (
          <View style={{ padding: 20 }}>
            <Text style={{ fontFamily: 'Avenir-Medium' }}>
              <Text>
                Sorry we were not able to find any trainers in your area.{" "}
              </Text>
              <Text style={{ color: '#1089ff' }} onPress={this.handleFetchUserLocation}>
                Try enabling location services{" "}
              </Text>
              <Text>
                or check back again at a later date.
                </Text>
            </Text>
          </View>
        )
      }

      return (
        <View style={{ padding: 20 }}>
          <Caption>
            Sorry we were not able to find any trainers in your area.
              </Caption>
        </View>
      )
    }

    return (
      <ScrollView
        pagingEnabled={true}
        decelerationRate={0}
        snapToAlignment='center'
        snapToInterval={Dimensions.get('window').width}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {
          curatedTrainers.map(trainer => {
            if (typeof (trainer) == 'undefined') {
              return;
            }

            return (
              <TouchableOpacity  onPress={() => this.handleBookTrainerOnPress(trainer)}>
                <Surface style={{elevation: 0, marginHorizontal: 15, marginVertical: 12 }} >

                  <View style={{borderRadius: 12}}>

                    <Image style={{borderRadius: 12, borderWidth: 0.5, borderColor: '#EEEEEE', width: 120, height: 120}} key={trainer.user_uuid} source={{ uri: trainer.photo_url }} size={120} />

                    <Surface style={{ elevation: 5, width: 30, height: 30, alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 0, right: 0, margin: 12, borderRadius: 30 }}>
                      <Feather1s name="calendar" color="#1089ff" />
                    </Surface>


                  </View>

                  <View style={{alignItems: 'center', height: 50, justifyContent: 'space-evenly' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{ fontFamily: 'Avenir-Light', fontSize: 12, }}>
                        {trainer.display_name}
                      </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{ fontFamily: 'Avenir-Light', fontSize: 12, }}>
                        {trainer.location.city}, {trainer.location.state}
                      </Text>
                    </View>
                  </View>
                  <View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.2)', position: 'absolute' }} />
                </Surface>
              </TouchableOpacity>

            )
          })
        }
      </ScrollView>
    );
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
        <View style={{ flex: 1 }}>
          <DateTimePicker
            customStyles={{
              datePicker: {
                backgroundColor: '#d1d3d8',
                justifyContent: 'center'
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
          <Button onPress={this.handleOnPickFutureBookingDate} color="#1089ff" mode="contained" style={{ marginVertical: 10, elevation: 0, height: 45, alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width - 50, alignSelf: 'center' }}>
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
        <View style={{ flex: 1 }}>
          <ScrollView>
            {

              availabilityTimeBlocks.map(block => {
                return (
                  <TouchableWithoutFeedback style={{ marginVertical: 10 }} key={block.value} onPress={() => this.onChangeFutureStartTime(block)}>
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
          <Button onPress={this.handleOnPickFutureStartTime} color="#1089ff" mode="contained" style={{ marginVertical: 10, elevation: 0, height: 45, alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width - 50, alignSelf: 'center' }}>
            Done
              </Button>
        </SafeAreaView>
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

  handleOnPickFutureBookingDate = async () => {
    await this.LUPA_CONTROLLER_INSTANCE.getAvailableTrainersByDateTime(this.state.futureBookingDisplayDate, this.state.futureBookingStartTime).then(data => {
      this.setState({ availableTrainers: data })
    })

    alert('dfsdfd')
    this.closeFutureBookingDatePicker()
  }


  onChangeFutureStartTime = (block) => {
    this.setState({ futureBookingStartTime: block.value, futureBookingStartTimeFormatted: block.label });
    this.startTimePickerRef.current.close()
  };


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


  closeFutureBookingStartTimePicker = () => {
    if (this.startTimePickerRef) {
      this.endTimePickerRef.current.close()
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
        <View style={{ flex: 1, padding: 10, }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={{ fontFamily: 'Avenir-Heavy', fontSize: 18 }}>
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

                    <View style={{flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between'}}>

                    <View style={{ paddingVertical: 15, flexDirection: 'row', alignItems: 'center' }}>
                        <PaperAvatar.Image style={{ borderWidth: 1, borderColor: 'grey' }} size={35} source={{ uri: trainer.photo_url }} />
                        <View style={{ paddingHorizontal: 10 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 15, fontFamily: 'Avenir-Medium' }}>
                              {trainer.display_name}
                            </Text>
                          </View>
                        </View>
                      </View>


                    <Button
                        onPress={() => {
                          this.closeBookingBottomSheet().then(() => {
                            this.props.navigation.push('Profile', {
                              userUUID: trainer.user_uuid
                            });
                          })
                    
                        }
                        }

                        uppercase={false}
                        color="#23374d"
                        mode="contained"
                        style={{ elevation: 1, marginVertical: 5 }}>
                          <Text style={{fontFamily: 'Avenir', fontSize: 13}}>
                          View Profile
                          </Text>
                    
                </Button>
                    </View>
                     
                  
                      <Divider style={{ width: Dimensions.get('window').width, alignSelf: 'center', }} />
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
    this.setState({ bookingRequestModalIsVisible: false })
  }

  handleOpenRequestBookingDialog = () => {
    this.setState({ bookingRequestDialogVisible: true })
  }

  onCloseRequestBookingDialog = () => {
    //reset state
    this.setState({ requestedTrainer: undefined })
  }

  handleOnRequestBooking = (userData) => {
    if (typeof (userData) == 'undefined') {
      return;
    }

    if (moment(this.state.bookingEndTime).isBefore(moment(this.state.bookingStartTime))) {
      //invalid times
      this.setState({ snackBarMessage: "Invalid time period", setSnackBarVisible: true });
      return;
    }

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
    if (typeof (trainer) == 'undefined') {
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
    this.setState({ componentIsFetching: true })
    if (this.props.lupa_data.Auth.isAuthenticated === false) {
      this.props.navigation.navigate('SignUp')
      return;
    }

    if (typeof (trainer) == 'undefined') {
      return;
    } else {
      await this.setState({ requestedTrainer: trainer });
    }

    this.setState({ componentIsFetching: false }, () => {
      this.openBookingRequestModal()
    });
  }

  handleCloseBookTrainer = () => {
  this.setState({ componentIsFetching: true })
    this.setState({ bookingRequestModalIsVisible: true, componentIsFetching: false });
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
    if (typeof (uuid) == 'undefined') {
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
                                   Discover more by signing in or creating an account.
                                 </Text>
                          <View style={{marginVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                          <ElementsButton  onPress={() => this.props.navigation.navigate('Login')} color="#23374d" title="Sign in" titleStyle={{fontSize: 15, fontFamily: 'Avenir-Medium'}} raised type="solid" buttonStyle={{borderRadius: 5, backgroundColor: '#23374d',}} containerStyle={{width: '35%'}} />

                          <ElementsButton  onPress={() => this.props.navigation.navigate('SignUp')} color="#23374d" title="Sign up" titleStyle={{fontSize: 15, fontFamily: 'Avenir-Medium', color: '#23374d'}} type="outline" buttonStyle={{borderRadius: 5, backgroundColor: '#FFFFFF', borderColor: '#23374d'}} containerStyle={{width: '35%'}} />
                          </View>
                                 
          </View>
        )
      }
    }

  renderCreateAccountSection = () => {
    const updatedAuthState = getLupaStoreState().Auth;

    if (updatedAuthState.isAuthenticated === false) {
      return (
        <View style={{ padding: 10, paddingVertical: 15, marginVertical: 20 }}>

          <Text style={{ fontFamily: 'Avenir-Medium', fontSize: 18, color: 'black' }}>
            Register an account on Lupa and access a variety of fitness trainers
    </Text>

          <Button color="#23374d" uppercase={false} mode="outlined" onPress={() => this.props.navigation.navigate('SignUp')} style={{ width: 180, marginVertical: 10 }}>
            <Text style={{ fontSize: 12 }}>
              Create an account
      </Text>
          </Button>

        </View>
      )
    }
  }

  openBookingRequestModal = () => this.bookingRequestRef.current.open();
  closeBookingRequestModal = () => this.bookingRequestRef.current.close();


  renderPaymentInformationBanner = () => {
    try {
      const updatedAppState = getLupaStoreState();
      if (typeof (updatedAppState.Users.currUserData.card_added_to_stripe) == false && updatedAppState.Auth.isAuthenticated === true && updatedAppState.Users.currUserData.isTrainer === true) {
        return (
          <Banner
            visible={true}
            icon={() => <MaterialIcon name="payment" size={22} color="#1089ff" />}
            actions={[{
              label: 'Update Payment Information',
              color: "#1089ff",
              onPress: () => this.props.navigation.push('Settings')
            }]}
            style={{ fontSize: 5 }}
            contentStyle={{ fontSize: 5 }}
          >
            Thank you for using Lupa.  Your account won't show up on searches and users won't be able to book you until you add a card to receive payouts.
          </Banner>
        )
      }
    } catch (error) {
      return null;
    }
  }

  render() {
   this.checkSearchBarState()
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: 'white' }}>
          <ScrollView
            refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleOnRefresh} />}
            scrollEventThrottle={1}
            bounces={false}
            showsVerticalScrollIndicator={false}>
            <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Search')}>
              <SearchBar
                onStartShouldSetResponder={event => false}
                onStartShouldSetResponderCapture={event => false}
                ref={this.searchBarRef}
                placeholder="Search trainers and fitness programs"
                placeholderTextColor="rgb(199, 201, 203)"
                value={this.state.searchValue}
                inputStyle={styles.inputStyle}
                platform="ios"
                containerStyle={{ backgroundColor: 'white', borderColor: 'white', width: Dimensions.get('window').width - 10, alignSelf: 'center' }}
                inputContainerStyle={{borderColor: 'white', backgroundColor: 'rgb(245, 246, 249)' }}
                searchIcon={() => <FeatherIcon name="search" color="black" size={20} onPress={() => this.setState({ searchBarFocused: true })} />}
                onFocus={() => this.setState({ searchBarFocused: true })}
                onBlur={() => this.setState({ searchBarFocused: false })} />
            </TouchableWithoutFeedback>
            {this.renderPaymentInformationBanner()}
            {this.renderRequestAuthenticationMessage()}
              <View style={{marginVertical: 5}}>
                <Text style={{fontSize: 18, padding: 10, fontFamily: 'Avenir-Heavy'}}>
                  Book trainers near you
                </Text>
              <View>
                {this.renderCuratedTrainers()}
              </View>
            </View>
            <Divider style={{ marginVertical: 10, height: 8, backgroundColor: 'rgb(245, 246, 249)' }} />
            <View style={{ padding: 10, width: '100%' }}>
              <View style={{ paddingHorizontal: 5, paddingVertical: 10, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 18, fontFamily: 'Avenir-Heavy' }}>
                  Book by your availability
                </Text>
              </View>
              <View style={{ width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'center',}}>
                <TouchableOpacity 
                onPress={this.openFutureBookingDatePicker} 
                style={{ 
                  alignSelf: 'center', 
                  width: Dimensions.get('window').width - 20, 
                  marginVertical: 10, 
                  alignSelf: 'center', 
                  padding: 10, 
                  borderRadius: 5, 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  backgroundColor: 'rgb(250, 250, 250)', 
                  borderWidth: 0.5, 
                  borderColor: '#E5E5E5', 
                  justifyContent: 'center' 
                  }} 
                  icon={() => <FeatherIcon name="chevron-down" />}>
      
                  <Text style={{ paddingHorizontal: 10, fontWeight: '500', fontSize: 12 }}>
                    {this.state.futureBookingDisplayDateFormatted}
                  </Text>
                  <FeatherIcon name="chevron-down" />
                </TouchableOpacity>

              </View>
              <Button 
                onPress={this.handleOnRequestFutureBooking} 
                style={{ marginVertical: 15, elevation: 0, width: Dimensions.get('window').width - 20, alignSelf: 'center'}} 
                theme={{roundness: 12}}
                disabled={false} 
                color="rgb(34, 74, 115)" 
                uppercase={false} 
                mode="contained" 
                contentStyle={{ height: 55 }}>
                  <Text style={{fontSize: 16, fontFamily: 'Avenir', fontWeight: 'bold'}}>
                  See available trainers
                  </Text>

                </Button>
            </View>
            <Divider style={{ marginVertical: 10, height: 8, backgroundColor: 'rgb(245, 246, 249)' }} />
            <View style={{ marginVertical: 10, width: '100%' }}>
              <View style={{ paddingHorizontal: 5, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 16, padding: 10, fontFamily: 'Avenir-Heavy' }}>
                  Promoted Trainers
          </Text>
              </View>
              <ScrollView scrollEnabled={false}>
                {this.renderPromotedTrainers()}
              </ScrollView>
            </View>
            {this.renderCreateAccountSection()}
            <View style={{ marginVertical: 10, width: '100%' }}>
              <View style={{ paddingHorizontal: 5, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 16, padding: 10, fontFamily: 'Avenir-Heavy' }}>
                  By Lupa
          </Text>
              </View>
              <ScrollView scrollEnabled={false}>
                {this.renderByLupaTrainers()}
              </ScrollView>
            </View>
          </ScrollView>
          <SafeAreaView />
          {this.renderFutureStartTimePicker()}
          {this.renderFutureBookingDatePicker()}
          {this.renderRBSheet()}

         <BookingRequestModal 
          closeModal={this.closeBookingRequestModal}
          trainer={this.state.requestedTrainer}
          preFilledStartTime={this.state.preFilledStartTime}
          preFilledEndTime={this.state.preFilledEndTime}
          preFilledTrainerNote={this.state.preFilledTrainerNote}
          prefilledDate={this.state.futureBookingDisplayDate}
         ref={this.bookingRequestRef} />
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
    fontSize: 15, fontFamily: 'Avenir-Medium'

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

export default connect(mapStateToProps, mapDispatchToProps)(GuestView);
