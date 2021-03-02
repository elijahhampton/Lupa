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
import axios from 'axios';
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
import { extractDateStringFromMoment } from '../common/service/DateTimeService';
import ProgramInformationPreview from './workout/program/ProgramInformationPreview';
import ProgramOptionsModal from './workout/program/modal/ProgramOptionsModal';
import { Pagination } from 'react-native-snap-carousel';
import { ActionSheetIOS } from 'react-native';
import Swiper from 'react-native-swiper';
import { getLupaProgramInformationStructure } from '../model/data_structures/programs/program_structures';
import { Linking } from 'react-native';

const SKILL_BASED_INTEREST = [
  'Agility',
  'Balance',
  'Speed',
  'Power',
  'Coordination',
  'Reaction Time',
  'Weight Loss',
  'Test Preparation',
  'Sport Specific',
  'Bodybuilding',
  'Fitness Coach',
  'Injury Prevention',
]

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

class GuestView extends React.Component {
  constructor(props) {
    super(props);

    this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    this.searchBarRef = createRef();
    this.bookingRef = createRef();
    this.startTimePickerRef = createRef();
    this.endTimePickerRef = createRef();
    this.futureBookingDateRef = createRef();
    this.bookingRequestRef = createRef();

    this.programPreview = createRef();

    this.state = {
      refreshing: false,
      searchValue: "",
      searchResults: [],
      programModalVisible: false,
      programOptionsVisible: false,
      programOfTheDayPreviewVisible: false,
      searching: false,
      trainWithSwiperIndex: 0, //approved,
      featuredProgramsCurrentIndex: 0,
      lastRefresh: new Date().getTime(),
      recentlyAddedPrograms: [],
      topPicks: [],
      featuredPrograms: [],
      featuredTrainers: [],
      nearbyCommunities: [],
      inviteFriendsIsVisible: false,
      programsBasedOnInterest: [],
      feedVlogs: [],
      suggestionBannerVisisble: false,
      bookingRequestModalIsVisible: false,
      searchBarFocused: false,
      programOfTheDay: getLupaProgramInformationStructure(),
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
      timeBlockBookingDialogVisible: false,
      availableTrainersModalIsVisible: false,
      availableTrainers: [],
      curatedTrainers: [],
      promotedTrainers: [],
      byLupaTrainers: [],
      currAvailableTrainersPage: 0,
      componentIsFetching: false,
      previewingProgram: getLupaProgramInformationStructure()
    }
  }

  openProgramPreview = (program) => {
    axios({
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer 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`,
      },
      method: 'POST',
      url: 'https://us-central1-lupa-cd0e3.cloudfunctions.net/sendTrainerEmailReferral',
      data: JSON.stringify({
          trainer_data: this.props.lupa_data.Users.currUserData,
          referrer_data: this.props.lupa_data.Users.currUserData,
          referred_user_email: this.props.lupa_data.Users.currUserData.email,
      })
  }).then(response => {
     console.log(response);
  }).catch(error => {
     console.log(error)
  })
    /*this.setState({ previewingProgram: program }, () => {
      this.programPreview.current.open()
    })*/
  }

  closeProgramPreview = () => this.programPreview.current.close();

  handleOnPressSkill = (skill) => {
    if (this.props.lupa_data.Auth.isAuthenticated === false) {
      this.props.navigation.push('SignUp')
      return;
    }

    this.props.navigation.push('Search', {
      categoryToSearch: skill
    })
  }

renderSkills = () => {
    return (  
       <ScrollView contentContainerStyle={{marginVertical: 10}} showsHorizontalScrollIndicator={false} horizontal>
              {
                SKILL_BASED_INTEREST.map((skill, index, arr) => {
                    return  (
                      <Chip 
                      onPress={() => this.handleOnPressSkill(skill)} 
                      key={skill} 
                      mode="outline"
                      textStyle={{ fontFamily: 'Avenir-Medium', fontWeight: '700', backgroundColor: '#FFFFFF', color: '#1089ff'}} 
                      style={{borderWidth: 1, borderColor: '#EEEEEE', backgroundColor: '#FFFFFF', marginHorizontal: 10}}>
                          {skill}
                      </Chip>
                    )
                })
              }
       </ScrollView>
    )
}

  async componentDidMount() {
    Linking.getInitialURL().then((url) => {
      if (url) {
        this.handleURLNavigation(url);
      }
    }).catch(err => {
        console.warn('An error occurred', err);
    });

    Linking.addEventListener('url', this.handleOpenURL);

    let docData = getLupaUserStructure();
    let promotedTrainersIn = [];
    let byLupaTrainersIn = []

    const bookingDate = extractDateStringFromMoment(moment());
    this.setState({ 
      componentIsFetching: true, 
      prefilledDate: bookingDate,
      futureBookingDisplayDate: bookingDate, 
      futureBookingDisplayDateFormatted: moment(new Date()).format("LL").toString()
    });

    this.PROMOTED_TRAINERS_OBSERVER = LUPA_DB.collection('users')
    .limit(3)
    .where('isTrainer', '==', true)
    .onSnapshot(querySnapshot => {
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
    }, error => {
      this.setState({ promotedTrainers: [] })
    });

    this.BY_LUPA_TRAINERS = LUPA_DB.collection('users')
    .limit(3)
    .where('isTrainer', '==', true)
    .onSnapshot(querySnapshot => {
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
    }, error => {
      this.setState({ byLupaTrainers: [] })
    })

    await this.fetchCuratedTrainers();

    await this.LUPA_CONTROLLER_INSTANCE.getAvailableTrainersByDateTime(this.state.futureBookingDisplayDate, this.state.futureBookingStartTime)
    .then(data => {
      this.setState({ availableTrainers: data })
    })
    .catch(error => {
      this.setState({ availableTrainers: [] })
    })

      await this.LUPA_CONTROLLER_INSTANCE.getProgramsBasedOnInterest(this.props.lupa_data.Users.currUserData.interest, this.props.lupa_data.Users.currUserData.client_metadata.experience_level)
      .then(data => {
        this.setState({ programsBasedOnInterest: data });
      })
      .catch(error => {
        this.setState({ programsBasedOnInterest: [] });
      })

      await this.LUPA_CONTROLLER_INSTANCE.getProgramOfTheDay().then(data => {
        if (data == -1) {
          this.setState({ programOfTheDay: getLupaProgramInformationStructure() })
        } else {
          this.setState({ programOfTheDay: data})
        }
      })

      await this.LUPA_CONTROLLER_INSTANCE.getNearbyCommunitiesBasedOnCityAndState(this.props.lupa_data.Users.currUserData.location.city, this.props.lupa_data.Users.currUserData.location.state).then(data => {
        this.setState({ nearbyCommunities: data })
      })
   
    this.setState({ componentIsFetching: false })
  }

  handleOpenURL = (event) => {
    this.handleURLNavigation(event.url);
  }

  handleURLNavigation = async (url) => {
    const { navigate } = this.props.navigation;
    const route = url.replace(/.*?:\/\//g, '');
    const id = route.match(/\/([^\/]+)\/?$/)[1];
    const routeName = route.split('/')[0];

    switch (routeName) {
      case 'programs':
        //load program from id and open preview
       await this.LUPA_CONTROLLER_INSTANCE.getProgramInformationFromUUID(id).then(programData => {
         this.setState({ previewingProgram: programData }, () => {
           this.programPreview.current.open();
         })
       })
        break;
      case 'trainers':
        navigate('Profile', {
          userUUID: id
        });

        break;
      default:
        navigate('Train');
    }
  }


  async componentWillUnmount() {
    return () => {
      () => this.PROMOTED_TRAINERS_OBSERVER();
      () => this.BY_LUPA_TRAINERS();
      () =>  Linking.removeEventListener('url', this.handleOpenURL);
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

  handleCardOnPress = (program) => {
    const { currUserData } = this.props.lupa_data.Users;

    try {
    if (program.program_participants.includes(currUserData.user_uuid))
    {
      this.setState({ programOptionsVisible: true })
    }
    else
    {
      this.setState({ programModalVisible: true })
    }
} catch(error) {
    
}
}

  renderProgramBasedOnInterest = () => {
    const { programsBasedOnInterest } = this.state;

    if (programsBasedOnInterest.length == 0) {
      return (
      <View style={{flex: 1}}>
      <View style={{ padding: 20 }}>
            <Text style={{ fontFamily: 'Avenir', fontSize: 16 }}>
              <Text style={{color: 'white'}}>
                There are no programs available based on your interest and experience level.{" "}
              </Text>
              <Text style={{ color: '#1089ff' }} onPress={() => this.props.navigation.push('Search')}>
                Find more programs by searching.
              </Text>
            </Text>
          </View>
      </View>
      )
    }
    
    return (
      <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}>
       {
          programsBasedOnInterest.map((program, index, arr) => {
            return (
              <TouchableOpacity style={{margin: 5, alignItems: 'center'}} onPress={() => this.openProgramPreview(program)}>
                <Surface style={{width: 110, height: 110, borderRadius: 10, elevation: 0}}>
                    <Image key={program.program_structure_uuid} source={{ uri: program.program_image }} style={{borderRadius: 10, width: '100%', height: '100%'}} />
                </Surface>
                <Text style={{color: 'white', alignSelf: 'center', paddingVertical: 5, fontSize: 15, fontFamily: 'Avenir-Medium' }}>
                  {program.program_name}
                </Text>
            <ProgramOptionsModal 
            program={program} 
            isVisible={this.state.programOptionsVisible} 
            closeModal={() => this.setState({ programOptionsVisible: false })} 
            />
            </TouchableOpacity>
            )
          })
       }
      </ScrollView>
    )


  }

  renderProgramOfTheDay = () => {
    const program = this.state.programOfTheDay;

    return (
      <TouchableOpacity style={{margin: 10, alignItems: 'center'}} onPress={() => this.openProgramPreview(program)}>
        <Surface style={{width: Dimensions.get('window').width - 80, height: 400, borderRadius: 10, elevation: 0}}>
            <Image key={program.program_structure_uuid} source={{ uri: program.program_image }} style={{borderRadius: 10, width: '100%', height: '100%'}} />
        </Surface>
        <Text style={{color: 'white', alignSelf: 'center', paddingVertical: 5, fontSize: 15, fontFamily: 'Avenir-Medium' }}>
          {program.program_name}
        </Text>
        <Caption style={{color: 'white', alignSelf: 'center', paddingVertical: 5}}>
          {program.program_description}
        </Caption>
    <ProgramOptionsModal 
    program={program} 
    isVisible={this.state.programOptionsVisible} 
    closeModal={() => this.setState({ programOptionsVisible: false })} 
    />
    </TouchableOpacity>
    )
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

  renderNearbyCommunities = () => {
    if (this.state.nearbyCommunities.length == 0) {
      return (
        <View style={{flex: 1}}>
      <View style={{ padding: 20 }}>
            <Text style={{ fontFamily: 'Avenir', fontSize: 16 }}>
              <Text style={{color: 'white'}}>
                There are no communities in your area.{" "}
              </Text>
              <Text style={{ color: '#1089ff' }} onPress={() => this.props.navigation.push('Search')}>
                Find more communities by searching.
              </Text>
            </Text>
          </View>
      </View>
      )
    }

    return (
      <ScrollView
      horizontal
      >
        {
          this.state.nearbyCommunities.map(community => {
            return (
            <TouchableOpacity style={{backgroundColor: 'transparent'}}  onPress={() => {}}>
            <Surface style={{backgroundColor: 'transparent', elevation: 0, marginHorizontal: 15, marginVertical: 12 }} >

              <View style={{borderRadius: 12}}>

                <Image style={{borderRadius: 12, borderWidth: 0.5, width: 120, height: 120}} key={community.uid} source={{ uri: typeof(community.pictures[0]) == 'undefined' ? "" : community.pictures[0] }} size={120} />

              </View>

              <View style={{backgroundColor: 'transparent', alignItems: 'center', height: 50, justifyContent: 'space-evenly' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{color: 'white', fontFamily: 'Avenir-Medium', fontSize: 16, }}>
                    {community.name}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{color: 'white', fontFamily: 'Avenir-Light', fontSize: 12, }}>
                    {community.city}, {community.state}
                  </Text>
                </View>
              </View>
              <View style={{ width: '100%', height: '100%', backgroundColor: 'transparent', position: 'absolute' }} />
            </Surface>
          </TouchableOpacity>
            )
          })
        }
      </ScrollView>
    )
  }

  renderCuratedTrainers = () => {
    const updatedAppState = getLupaStoreState()
    const curatedTrainers = this.state.curatedTrainers;

    if (curatedTrainers.length === 0) {
      if (updatedAppState.Auth.isAuthenticated === false) {
        return (
          <View style={{ padding: 20, backgroundColor: 'transparent' }}>
            <Text style={{ fontFamily: 'Avenir-Medium', color: 'white' }}>
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
      } else {
        return (
          <View style={{ padding: 20, backgroundColor: 'transparent' }}>
          <Text style={{ fontFamily: 'Avenir-Medium', color: 'white' }}>
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
    }

    return (
      <ScrollView
        pagingEnabled={true}
        decelerationRate={0}
        snapToAlignment='center'
        snapToInterval={Dimensions.get('window').width}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{backgroundColor: 'transparent'}}
      >
        {
          curatedTrainers.map(trainer => {
            if (typeof (trainer) == 'undefined') {
              return;
            }

            return (
              <TouchableOpacity style={{backgroundColor: 'transparent'}}  onPress={() => this.handleBookTrainerOnPress(trainer)}>
                <Surface style={{ backgroundColor: 'transparent', elevation: 0, marginHorizontal: 5, marginVertical: 12 }} >
                  <View style={{borderRadius: 10}}>
                    <Image style={{borderRadius: 10,  width: 95, height: 95}} key={trainer.user_uuid} source={{ uri: trainer.photo_url }} size={120} />
                  </View>
                  <View style={{backgroundColor: 'transparent', alignItems: 'center', height: 50, justifyContent: 'space-evenly' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{color: 'white', fontFamily: 'Avenir-Medium', fontSize: 16, }}>
                        {trainer.display_name}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{color: 'white', fontFamily: 'Avenir-Light', fontSize: 12, }}>
                        {trainer.location.city}, {trainer.location.state}
                      </Text>
                    </View>
                  </View>
                  <View style={{ width: '100%', height: '100%', backgroundColor: 'transparent', position: 'absolute' }} />
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


  handleOnNavigateToCreateAccount = () => {
    this.bookingRef.current.close()
    this.props.navigation.navigate('SignUp')
  }


  closeFutureBookingStartTimePicker = () => {
    if (this.startTimePickerRef) {
      this.endTimePickerRef.current.close()
    }
  }

  handleNavigateToProfile = (trainer) => {
    if (this.bookingRef.current) {
      this.bookingRef.current.close();
    }

    this.navigateToProfile(trainer.user_uuid)
  }

  handleOnPressTrainerBookingTime = async (startTime, endTime, index, trainer) => {
    if (this.props.lupa_data.Auth.isAuthenticated === false) {
      this.props.navigation.push('SignUp')
      return;
    }

    const updatedTime  = moment(startTime).add(index, 'hour').format()
   
    this.setState({ preFilledStartTime: updatedTime, requestedTrainer: trainer}, () => {
      this.openBookingBottomSheet(trainer)
    });
  }

  renderRBSheet = () => {
    return (
      <RBSheet
        height={400}
        ref={this.bookingRef}
        customStyles={{
          container: {
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
          }
        }}
        >
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
                    <View>

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

                    <View style={{marginVertical: 10}}>
                      <ScrollView 
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      shouldRasterizeIOS={true}
                      >
                        {
                     
                          trainer.scheduler_times[this.state.futureBookingDisplayDate.toString()][0].times.map(time => {
                            
                            return (
                              <Chip mode="outlined" 
                              textStyle={{ fontFamily: 'Avenir-Medium', fontWeight: '700', backgroundColor: '#FFFFFF', color: '#23374d'}} 
                              style={{borderWidth: 1, borderColor: '#EEEEEE', backgroundColor: '#FFFFFF', marginHorizontal: 10}}>
                                {time}
                              </Chip>
                            )
                          })
                        }
                      </ScrollView>
                    </View>
                     
                  
                      <Divider style={{ width: Dimensions.get('window').width, alignSelf: 'center', }} />
                    </View>
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
      await this.openBookingBottomSheet(trainer)
    }

    this.setState({ componentIsFetching: false }, () => {
      this.setState({ bookingRequestModalIsVisible: true })
    });
  }

  handleCloseBookTrainer = () => {
  this.setState({ componentIsFetching: true })
    this.setState({ bookingRequestModalIsVisible: true, componentIsFetching: false });
  }

  handleTrainerCardOnPress = (trainer) => {
    this.openBookingBottomSheet(trainer)
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
          <Text style={{paddingLeft: 15, fontFamily: 'Avenir-Heavy', color: 'white'}}>
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
        <>
        <Divider style={{height: 5, backgroundColor: '#EEEEEE'}} />
        <View style={{ padding: 10, paddingVertical: 15, marginVertical: 20 }}>

          <Text style={{ fontFamily: 'Avenir-Medium', fontSize: 18, color: 'white' }}>
            Register an account on Lupa and access a variety of fitness trainers
    </Text>

          <Button color="white" uppercase={false} mode="outlined" onPress={() => this.props.navigation.navigate('SignUp')} style={{ borderColor: 'white', width: 180, marginVertical: 10 }}>
            <Text style={{ fontSize: 12 }}>
              Create an account
      </Text>
          </Button>

        </View>
        </>
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

  openTrainerActionSheet = (uuid) =>  {
  const { navigation } = this.props;
  const { currUserData } = this.props.lupa_data.Users;

  if (this.props.lupa_data.Auth.isAuthenticated === false) {
    this.props.navigation.push('SignUp')
    return;
  }

  ActionSheetIOS.showActionSheetWithOptions(
    {
      options: ["Cancel", "Send a Message", "View Profile"],
      destructiveButtonIndex: 0,
      cancelButtonIndex: 0
    },
    buttonIndex => {
      if (buttonIndex === 0) {
        // cancel action
      } else if (buttonIndex === 1) {
        this.props.navigation.push('PrivateChat', {
          currUserUUID: currUserData.user_uuid,
          otherUserUUID: uuid
        })
      } else if (buttonIndex === 2) {
        this.props.navigation.push('Profile', {
          userUUID: uuid
        })
      } 
    }
  )
  }

  renderAvailableTrainers = () => {
    if (this.state.availableTrainers.length == 0) {
      return (
        <View style={{flex: 1}}>
  <View style={{ padding: 20 }}>
            <Text style={{ fontFamily: 'Avenir', fontSize: 16 }}>
              <Text style={{color: 'white'}}>
                There are no trainers available today.{" "}
              </Text>
              <Text style={{ color: '#1089ff' }} onPress={() => this.props.navigation.push('Search')}>
                Find trainers by searching and book for a future date.
              </Text>
            </Text>
          </View>
        </View>
        
      )
    } else {
      return (
        <ScrollView 
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => this.setState({ currAvailableTrainersPage: event.nativeEvent.contentOffset.x })}
          centerContent
        >
{
  this.state.availableTrainers.map(trainer => {
    return (
      <View style={{backgroundColor: 'transparent', width: Dimensions.get('window').width}}>
           

      <View style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>

      <View style={{ paddingVertical: 15, flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <Avatar onPress={() => this.openTrainerActionSheet(trainer.user_uuid)} containerStyle={{ padding: 3, borderWidth: 2, margin: 10, borderColor: '#1089ff'}}rounded size={80} source={{ uri: trainer.photo_url }} />
          <View style={{ paddingHorizontal: 10 }}>
            <View style={{ alignItems: 'flex-start' }}>
              <Text style={{color: 'white', fontSize: 16, fontFamily: 'Avenir-Medium' }}>
                {trainer.display_name}
              </Text>
           
              <View style={{flexDirection: 'row', flexWrap: 'wrap', width: '83%', alignItems: 'center'}}>
             <Caption style={{color: 'white'}}>
               This trainer prefers:{" "}
             </Caption>
              {trainer.trainer_metadata.training_styles.map((style, index, arr) => {
                if (index == arr.length - 1) {
                    return (
                      <Caption style={{color: 'white'}}>
                      {style}
                    </Caption>
                    )
                }

                if (index == arr.length - 2) {
                  return (
                    <Caption style={{color: 'white'}}>
                    {style} and{" "}
                  </Caption>
                  )
                }

                return (
                  <Caption style={{color: 'white'}}>
                    {style},{" "}
                  </Caption>
                )
              })}
              <Caption style={{color: 'white'}}>
               {" "}training.
             </Caption>
                </View>
            </View>
          </View>
        </View>


      </View>

      <View style={{marginVertical: 0}}>
        <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        shouldRasterizeIOS={true}
        
        >
          {
            trainer.scheduler_times[this.state.futureBookingDisplayDate.toString()][0].times.map((time, index, arr) => {
              return (
                <Chip 
                onPress={() => this.handleOnPressTrainerBookingTime(trainer.scheduler_times[this.state.futureBookingDisplayDate.toString()][0].startTime, trainer.scheduler_times[this.state.futureBookingDisplayDate.toString()][0].endTime, index, trainer)} 
                mode="outlined" 
                textStyle={{ fontFamily: 'Avenir-Medium', fontWeight: '700', backgroundColor: '#FFFFFF', color: '#1089ff'}} 
                style={{marginVertical: 5, elevation: 2, borderWidth: 1, borderColor: '#EEEEEE', backgroundColor: '#FFFFFF', marginHorizontal: 10}}
                >
                  {time}
                </Chip>
              )
            })
          }
        </ScrollView>
      </View>
       

      </View>
    )
  })
}
        </ScrollView>
      )
      
    }
  }

  onScroll = (event) => {
    const { onScrollUp, onScrollDown } = this.props;
    var currentOffset = event.nativeEvent.contentOffset.y;
    var direction = currentOffset > this.offset ? 'down' : 'up';
    this.offset = currentOffset;

    if (direction == 'down') {
      onScrollDown()
    } else {
      onScrollUp()
    }
  }

  render() {
   this.checkSearchBarState()
   const { preFilledStartTime } = this.state;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#23374d' }}>
          <ScrollView
          onScroll={this.onScroll}
            refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleOnRefresh} />}
            scrollEventThrottle={1}
            bounces={false}
            showsVerticalScrollIndicator={false}>
            <TouchableWithoutFeedback onPress={() => this.props.navigation.push('Search')}>
              <SearchBar
                onStartShouldSetResponder={event => false}
                onStartShouldSetResponderCapture={event => false}
                ref={this.searchBarRef}
                placeholder="Search trainers and fitness programs"
                placeholderTextColor="rgb(199, 201, 203)"
                value={this.state.searchValue}
                inputStyle={styles.inputStyle}
                platform="ios"
                containerStyle={{ backgroundColor: 'transparent', borderColor: 'white', width: Dimensions.get('window').width - 10, alignSelf: 'center' }}
                inputContainerStyle={{borderRadius: 20, backgroundColor: '#EEEEEE' }}
                searchIcon={() => <FeatherIcon name="search" color="#1089ff" size={20} onPress={() => this.setState({ searchBarFocused: true })} />}
                onFocus={() => this.setState({ searchBarFocused: true })}
                onBlur={() => this.setState({ searchBarFocused: false })} />
            </TouchableWithoutFeedback>
            {this.renderPaymentInformationBanner()}
            {this.renderRequestAuthenticationMessage()}
            <View style={{marginVertical: 10, height: 200, backgroundcolor: 'white'}}>
              <Swiper showsPagination={false} showsButtons={false} dotColor="#FFFFFF" autoplay={true} >
                <TouchableWithoutFeedback onPress={() => this.props.navigation.push('Search')}>
                <View style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                <Image resizeMode="center" style={{alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%'}} source={require('./images/banner_images/banner1.jpeg')} />
                  <View style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, width: '100%', height: 200, backgroundColor: 'rgba(0,0,0,0.4)'}} />
       
                 <Text style={{fontSize: 20, color: '#FFFFFF', position: 'absolute', alignSelf: 'center', fontFamily: 'Avenir-Heavy'}}>
                    Book a virtual coach
                </Text>
               
          

                 <Chip style={{backgroundColor: 'white', position: 'absolute', bottom: 10, right: 10, height: 20, alignItems: 'center', justifyContent: 'center'}} textStyle={{fontFamily: 'Avenir-Medium'}}>
                  Book now
                </Chip>
               
                </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={() => this.props.navigation.push('Search')}>
                <View style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                <Image resizeMode="center" style={{alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%'}} source={require('./images/banner_images/banner2.jpeg')} />
                <View style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, width: '100%', height: 200, backgroundColor: 'rgba(0,0,0,0.4)'}} />
                <Text style={{fontSize: 20, color: '#FFFFFF', position: 'absolute', alignSelf: 'center', fontFamily: 'Avenir-Black'}}>
                    Book a movement coach
                </Text>

                <Chip style={{backgroundColor: 'white', position: 'absolute', bottom: 10, right: 10, height: 20, alignItems: 'center', justifyContent: 'center'}} textStyle={{fontFamily: 'Avenir-Medium'}}>
                  Book now
                </Chip>
                </View>
                </TouchableWithoutFeedback>


                <TouchableWithoutFeedback onPress={() => this.props.navigation.push('Search')}>
                <View style={{width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                <Image resizeMode="center" style={{width: '100%', height: '100%'}} source={require('./images/banner_images/banner3.jpeg')} />
                <View style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, width: '100%', height: 200, backgroundColor: 'rgba(0,0,0,0.4)'}} />
                <Text style={{fontSize: 20, color: '#FFFFFF', position: 'absolute', alignSelf: 'center', fontFamily: 'Avenir-Black'}}>
                    Book a personal trainer
                </Text>

                <Chip style={{backgroundColor: 'white', position: 'absolute', bottom: 10, right: 10, height: 20, alignItems: 'center', justifyContent: 'center'}} textStyle={{fontFamily: 'Avenir-Medium'}}>
                  Book now
                </Chip>
                </View>
                </TouchableWithoutFeedback>

              </Swiper>
           
            </View>
            {this.renderSkills()}
    
            <View style={{marginVertical: 0, paddingVertical: 15, width: '100%' }}>
              <View style={{  width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={styles.sectionHeaderText}>
                  Book a trainer now
                </Text>
              </View>

              {this.renderAvailableTrainers()}
      
             <Pagination 
             dotColor="#FFFFFF"
             dotStyle={{backgroundColor: '#FFFFFF'}}
             dotsLength={this.state.availableTrainers.length} 
             activeDotIndex={this.state.currAvailableTrainersPage} 
             />
            </View>


              <View style={{marginVertical: 5}}>
              <Text style={styles.sectionHeaderText}>
                  Book trainers near you
                </Text>
              <View>
                {this.renderCuratedTrainers()}
              </View>
            </View>

      
    
            <View style={{ marginVertical: 5, width: '100%' }}>
              <View style={{ paddingHorizontal: 5, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={styles.sectionHeaderText}>
                  Find your perfect program
          </Text>
              </View>

              {this.renderProgramBasedOnInterest()}
      
            </View>

            {this.renderCreateAccountSection()}

            <View style={{ paddingVertical: 15, marginVertical: 5, width: '100%' }}>
              <View style={{ paddingHorizontal: 10, width: '100%' }}>
                <Text style={[styles.sectionHeaderText, { color: 'white', padding: 0 }]}>
                  Featured Program
                </Text>
              </View>
        
              <View>
                {this.renderProgramOfTheDay()}
              </View>
            </View>

            <View style={{marginVertical: 10, width: '100%' }}>
              <View style={{ paddingHorizontal: 5, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={styles.sectionHeaderText}>
                  Communities in your area
                </Text>
              </View>
        
           
                {this.renderNearbyCommunities()}
             
            </View>
          </ScrollView>
          <SafeAreaView style={{backgroundColor: 'rgb(27, 41, 60)'}} />
          {this.renderRBSheet()}

         <BookingRequestModal 
          ref={this.bookingRef}
          trainer={this.state.requestedTrainer}
          preFilledStartTime={preFilledStartTime}
          preFilledEndTime={this.state.preFilledEndTime}
          preFilledTrainerNote={this.state.preFilledTrainerNote}
          prefilledDate={this.state.futureBookingDisplayDate}
          />

        <ProgramInformationPreview 
    ref={this.programPreview}
    program={this.state.previewingProgram} 
    />
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
    color: 'white', fontSize: 18, padding: 10, fontFamily: 'Avenir', fontWeight: '800'
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
