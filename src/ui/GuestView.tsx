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
    Platform
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
    Searchbar,
    Portal,
    Dialog,
    Avatar,
    Chip
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import Feather1s from 'react-native-feather1s'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import FeatherIcon from 'react-native-vector-icons/Feather';
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
const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

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

class GuestView extends React.Component {
    PROGRAMS_OBSERVER: () => void;
    bookingRef: LegacyRef<RBSheet>;
    LUPA_CONTROLLER_INSTANCE: LupaController;
    searchBarRef: React.RefObject<unknown>;
    TRAINERS_OBSERVER: () => void;

    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
        this.searchBarRef = createRef()
        this.bookingRef = createRef();
        this.startTimePickerRef = createRef()
        this.endTimePickerRef = createRef(); 

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
            searchBarFocused: false,
            searchContainerWidth: new Animated.Value(0),
            scrollableTabbarWidth: new Animated.Value(1),
            bookingRequestDialogVisible: false,
            bookingEndTime: new Date(1598051730000),
            bookingStartTime: new Date(1598051730000),
            bookingEndTimeFormatted: new Date(1598051730000),
            bookingStartTimeFormatted: new Date(1598051730000),
            featuredTrainerHorizontalScrollIndex: 0,
            requestedTrainer: getLupaUserStructure(),
            displayDate: moment(new Date()).format('LL').toString(),
            startTimeIsSet: false,
            endTimeIsSet: false,
        }
    }

    async componentDidMount() {
        let docData : Object;

       this.PROGRAMS_OBSERVER = LUPA_DB.collection('programs').onSnapshot(querySnapshot => {
            let programDataList : Array<Object> = [];
            querySnapshot.docs.forEach(doc => {
                docData = doc.data();
                programDataList.push(docData);
            });

            this.setState({ featuredPrograms: programDataList })
        });

        this.TRAINERS_OBSERVER = LUPA_DB.collection('users').where('isTrainer', '==', true).onSnapshot(querySnapshot => {
            let trainersDataList : Array<Object> = [];
            querySnapshot.docs.forEach(doc => {
                docData = doc.data();
                trainersDataList.push(docData);
            });

            this.setState({ featuredTrainers: trainersDataList })
        });
      // this.bookingRef.current.open()

    }

    async componentWillUnmount() {
        return () => this.PROGRAMS_OBSERVER();
    }

    handleOnRefresh = () => {
        this.setState({ refreshing: true })
        this.setState({ refreshing: false })
      }

      renderStartTimePicker = () => {
        return (
          <RBSheet
          ref={this.startTimePickerRef}
          height={300}>
            <View style={{flex: 1}}>
            <DateTimePicker
            value={this.state.bookingStartTime}
            mode='time'
            is24Hour={false}
            display="default"
            onChange={this.onChangeStartTime}
          />
            </View>
            <SafeAreaView>
              <Button onPress={this.handleOnPickStartTime} color="#1089ff" mode="contained" style={{marginVertical: 10, elevation: 0, height: 45, alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width - 50, alignSelf: 'center'}}>
                Done
              </Button>
            </SafeAreaView>
          </RBSheet>
        )
      }
      
renderEndTimePicker = () => {
    return (
    <RBSheet
    ref={this.endTimePickerRef}
    height={300}>
      <View style={{flex: 1}}>
      <DateTimePicker
            value={this.state.bookingEndTime}
            mode='time'
            is24Hour={false}
            display="default"
            onChange={this.onChangeEndTime}
          />
      </View>
      <View>
              <Button onPress={this.handleOnPickEndTime} color="#1089ff" mode="contained" style={{marginVertical: 15, elevation: 0, height: 45, alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width - 50, alignSelf: 'center'}}>
                Done
              </Button>
              <SafeAreaView />
            </View>
    </RBSheet>
    )
      }

     handleOnPickStartTime = () => {
        this.setStartTimeIsSet(true);
        this.closeStartTimePicker();
      }
  
     handleOnPickEndTime = () => {
        this.setEndTimeIsSet(true);
        this.closeEndTimePicker();
      }
    
    
     onChangeStartTime = (event, date) => {
        const currentDate = date;
        const currentDateFormatted = moment(new Date(date)).format('LT').toString()
        this.setState({ bookingStartTime: currentDate, bookingStartTimeFormatted: currentDateFormatted});
      };
    
     onChangeEndTime = (event, date) => {
        const currentDate = date;
        const currentDateFormatted = moment(new Date(date)).format('LT').toString()
        this.setState({ bookingEndTime: currentDate, bookingEndTimeFormatted: currentDateFormatted});
      }

      handleOnNavigateToCreateAccount = () => {
          this.bookingRef.current.close()
          this.props.navigation.navigate('SignUp')
      }

    renderRBSheet = (trainer) => {
        
        if (typeof(trainer) == 'undefined') {
            return;
        }

        return (
            <RBSheet 
            height={250}
            ref={this.bookingRef}>
  <View style={{flex: 1, padding: 10, justifyContent: 'space-evenly'}}>
                   <View style={{elevation: 10, backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', elevation: 0, width: Dimensions.get('window').width}}>
                        <Text style={{fontSize: 20, fontFamily: 'Avenir-Heavy', paddingHorizontal: 10}}>
                           Book a session with {trainer.display_name}
                        </Text>
                   </View>

                <View style={{marginVertical: 10}}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Avatar.Image  source={require('./images/yogotrainer.jpg')} size={55} /> 
                       <Text style={{paddingHorizontal: 10, fontSize: 20}}>
                           $15
                       </Text>
                    </View>
                     
                       <Button onPress={() => this.props.navigation.push('Profile', {
                           userUUID: trainer.user_uuid
                       })} mode='contained' color="#23374d">
                           View Profile
                       </Button>
                   </View>
                   <Text style={{paddingVertical: 5, }}>
                       {trainer.certification}
                   </Text>
                </View>

                <Button onPress={this.handleOnNavigateToCreateAccount} mode='text' color="#23374d">
                    Create an account to book trainers
                </Button>
                   </View>
            </RBSheet>
        )
    }

   handleCloseRequestBookingDialog = () => {
        this.onCloseRequestBookingDialog();
        this.setBookingRequestDialogVisible(false);
      }
    
      handleOpenRequestBookingDialog = () => {
        this.setBookingRequestDialogVisible(true)
      }
    
    onCloseRequestBookingDialog = () => {
        //reset state
      }
    
     handleOnRequestBooking = (userData : Object) => {
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

    renderBookingRequestDialog = (userData : Object) => {

        if (typeof(userData) == 'undefined') {
            return;
        }
   
        return (
          <Portal>
            <Dialog visible={this.state.bookingRequestDialogVisible} style={{alignSelf: 'center', width: Dimensions.get('window').width - 20}}>
              <Dialog.Title>
                Book {userData.display_name}
              </Dialog.Title>
              <Dialog.Content>
              <Caption>
              You are about to book a session with Elijah Hampton on {this.state.displayDate.toString()}. Choose a time block from the requested interval.
            </Caption>
    
          <View style={{marginTop: 30, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-evenly'}}>
          <View style={{marginVertical: 10}}>
            <Text>
              Start Time
            </Text>
          <NativeButton title={this.state.startTimeIsSet ? this.state.bookingStartTimeFormatted.toString() : 'Choose a start time'} onPress={this.state.openStartTimePicker} />
          </View>
    
          <View  style={{marginVertical: 10}}>
            <Text>
              End Time
            </Text>
            <NativeButton title={this.state.endTimeIsSet ? this.state.bookingEndTimeFormatted.toString() : 'Choose an end time'} onPress={this.state.openEndTimePicker} />
          </View>
    
          </View>
    
    
          {
          this.state.snackBarVisible && true ?
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
               <FeatherIcon name="alert-circle" color='#f44336' />
               <HelperText style={{color: '#f44336'}}>
         
         {this.state.snackBarMessage}
       </HelperText>
          </View>
        
          :
          null
          }
    
    
              </Dialog.Content>
    
              <Dialog.Actions>
                <Button color="#1089ff" onPress={this.handleCloseRequestBookingDialog}>
                  Cancel
                </Button>
    
                <Button color="#1089ff" onPress={this.handleOnRequestBooking}>
                  Request
                </Button>
              </Dialog.Actions>
            </Dialog>
          
          </Portal>
        )
      }

    handleBookTrainerOnPress = (trainer) => {
        this.bookingRef.current.open();
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
            this.props.navigation.push('Search')
            this.searchBarRef.current.blur();
        }
    }

    render() {
        this.checkSearchBarState()
        return (
            
           <View style={{flex: 1, backgroundColor: 'white'}}>
             <Header style={{backgroundColor: COLOR,  borderBottomWidth: 0.5, borderColor: 'rgb(174, 174, 178)',}} noShadow={false} hasTabs>
            <Left style={{flexDirection: 'row', alignItems: 'center'}}>
              <MenuIcon onPress={() => this.props.navigation.openDrawer()}/>

            </Left>

            <Body>
              <Image source={require('./icons/logo.jpg')} style={{marginTop: 5, width: 35, height: 35}} />
            </Body>

            <Right>
                <Button color="#1089ff" onPress={() => this.props.navigation.navigate('Login')}>
                    Login
                </Button>
            </Right>
          </Header>
     
         
         <ScrollView
         refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleOnRefresh}/>}
           scrollEventThrottle={1}
           bounces={false}
           showsVerticalScrollIndicator={false}
         >
             <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Search')}>
  <Searchbar
                        ref={this.searchBarRef}
                        placeholder="Search fitness programs"
                        placeholderTextColor="#000000"
                        value={this.state.searchValue}
                        inputStyle={styles.inputStyle}
                        style={{elevation: 2, alignSelf: 'center', backgroundColor: 'white', height: 50, marginVertical: 10, width: Dimensions.get('window').width - 20 }}
                        iconColor="#1089ff"
                        theme={{
                            roundness: 8,
                            colors: {
                                primary: 'white',
                            }
                        }}
                        onFocus={() => this.setState({ searchBarFocused: true })}
                        onBlur={() => this.setState({ searchBarFocused: false })}
                    />
                                 </TouchableWithoutFeedback>

<View style={{marginVertical: 10}}>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <Chip mode="outlined" textStyle={{color: 'white'}} style={{marginHorizontal: 10, backgroundColor: '#23374d', alignItems: 'center', justifyContent: 'center', borderRadius: 3, padidng: 3}}>
                            Miami
                        </Chip>

                        <Chip mode="outlined" textStyle={{color: 'white'}} style={{marginHorizontal: 10, backgroundColor: '#23374d', alignItems: 'center', justifyContent: 'center', borderRadius: 3, padidng: 3}}>
                           HIIT
                        </Chip>

                        <Chip mode="outlined" textStyle={{color: 'white'}} style={{marginHorizontal: 10, backgroundColor: '#23374d', alignItems: 'center', justifyContent: 'center', borderRadius: 3, padidng: 3}}>
                            Cardio
                        </Chip>

                        <Chip mode="outlined" textStyle={{color: 'white'}} style={{marginHorizontal: 10, backgroundColor: '#23374d', alignItems: 'center', justifyContent: 'center', borderRadius: 3, padidng: 3}}>
                            Frequent
                        </Chip>

                        <Chip mode="outlined" textStyle={{color: 'white'}} style={{marginHorizontal: 10, backgroundColor: '#23374d', alignItems: 'center', justifyContent: 'center', borderRadius: 3, padidng: 3}}>
                            Florida
                        </Chip>
        </ScrollView>
    </View>

<View style={{padding: 10, paddingVertical: 15}}>
    
              <Text style={{fontFamily: 'Avenir-Medium', fontSize: 15, color: 'black'}}>
                  Register an account on Lupa and access a variety of fitness trainers 
              </Text>

              <Text onPress={() => this.props.navigation.navigate('SignUp')} style={{marginVertical: 10, fontWeight: '500', letterSpacing: 0.3,  fontSize: 14, color: '#1089ff'}}>
                 Create an account
              </Text>

              <Divider />

          </View>
            
            <View>
            <Text style={{fontSize: 20, padding: 10, fontFamily: 'Avenir-Heavy'}}>
              Trainers
          </Text>

            <ScrollView
            pagingEnabled={true}
            decelerationRate={0}
            snapToAlignment='center'
            snapToInterval={Dimensions.get('window').width}
            horizontal
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={this.handleOnScrollTrainerView}
            >
                {
                    this.state.featuredTrainers.map(trainer => {
                        return (
                            <View>
                                 <View style={{paddingHorizontal: 5, flexDirection: 'row', alignItems: 'flex-start', width: Dimensions.get('window').width}}>
                            <Avatar.Image source={{uri: trainer.photo_url}} size={35} />
                            <View style={{paddingHorizontal: 10}}>
                                <Text style={{paddingVertical: 3, fontFamily: 'Avenir-Heavy'}}>
                                    {trainer.display_name}
                                </Text>

                               
                                <Text style={{fontFamily: 'Avenir-Light'}}>
                                    {trainer.certification}
                                </Text>
                                <Caption style={{color: '#1089ff'}}>
                                    Available today
                                </Caption>
                            </View>
                    </View>

                                     <Button onPress={() => this.handleBookTrainerOnPress(trainer)} uppercase={false} contentStyle={{width: Dimensions.get('window').width - 50, }} color="#1089ff" mode="contained" style={{ elevation: 3, marginVertical: 8, alignSelf: 'center'}}>
                                    Book with {trainer.display_name}
                                </Button>
                            </View>
                           
                        )
                    })
                }
                
            </ScrollView>
            <Pagination activeDotIndex={this.state.featuredTrainerHorizontalScrollIndex} dotColor='#1089ff' inactiveDotColor="#E5E5E5" dotsLength={this.state.featuredTrainers.length} dotStyle={{width: 20, height: 8}} containerStyle={{justifyContent: 'flex-end'}} />
            </View>


            <Text style={{fontSize: 20, padding: 10, fontFamily: 'Avenir-Heavy'}}>
              Programs
          </Text>

          {
              this.state.featuredPrograms.map(program => {
                  return (
                    <Card style={{alignSelf: 'center',  elevation: 3, width: Dimensions.get('window').width - 20, marginVertical: 10}} onPress={() => {}}>
                    <Card.Cover source={{uri: program.program_image }} style={{ height: 200}} />
                    <Card.Actions style={{justifyContent: 'space-between', paddingVertical: 10}}>
                        <Text style={{fontSize: 15, fontFamily: 'HelveticaNeue'}}>
                            {program.program_name}
                        </Text>
    
                        <FeatherIcon name="more-vertical" size={20} onPress={() => {}} />
                    </Card.Actions>
                  </Card>
                  )
              })
          }
         </ScrollView>
                
            
           <SafeAreaView />
           {this.renderBookingRequestDialog(this.state.requestedTrainer)}
           {this.renderRBSheet(this.state.requestedTrainer)}
       </View>
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
    searchContainerStyle: {
        backgroundColor: "#FFFFFF", width: Dimensions.get('window').width, alignSelf: 'center'
    },
    inputContainerStyle: {
        backgroundColor: 'white',
    },
    inputStyle: {
        fontSize: 15, fontWeight: '600', fontFamily: 'Avenir-Roman'
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
    iconContainer: {
        width: '10%', alignItems: 'center', justifyContent: 'center'
    },

});

export default connect(mapStateToProps)(GuestView);
