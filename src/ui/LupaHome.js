/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  23, 2019
 * 
 *  LupaHome
 */

import React, { useState, useEffect } from 'react';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

import {
    View,
    StyleSheet,
    InteractionManager,
    ScrollView,
    Image,
    Text,
    Modal,
    Dimensions,
    SafeAreaView,
    Button as NativeButton,
    Animated,
    ImageBackground,
    TouchableHighlight,
} from 'react-native';

import {
    Surface,
    DataTable,
    Button,
    IconButton,
    FAB,
    Chip,
    Paragraph,
    Caption,
    Badge,
    Appbar,
    Divider,
    Avatar,
} from 'react-native-paper';

import {
    LineChart,
} from 'react-native-chart-kit';

import { NavigationActions, withNavigation } from 'react-navigation'

import LupaController from '../controller/lupa/LupaController';

import { connect } from 'react-redux';
import { Pagination } from 'react-native-snap-carousel';
import Swiper from 'react-native-swiper';
import { Constants } from 'react-native-unimodules';
import { LinearGradient } from 'expo-linear-gradient';

import Contacts from 'react-native-contacts';

import FeatherIcon from 'react-native-vector-icons/Feather';


import Stripe from 'tipsi-stripe';
import { initStripe } from '../modules/payments/stripe';

const ANIMATED_HEIGT_DURATION = 500;
const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80
  };

mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

function InviteFriendsModal(props) {
    let [contactPermissionsGranted, setContactPermissionsGranted] = useState(true);
    let [contactRecords, setContactRecords] =  useState([]);
    let [invitedList, setInvitedList] = useState([])

    handleInviteContact = (mobileNumber) => {
        let updatedInvitedContacts = invitedList;
        updatedInvitedContacts.push(mobileNumber);

        setInvitedList(updatedInvitedContacts);
    }

    useEffect(() => {

        Contacts.checkPermission((err, permission) => {
            if (err) throw err;
           
            // Contacts.PERMISSION_AUTHORIZED || Contacts.PERMISSION_UNDEFINED || Contacts.PERMISSION_DENIED
            if (permission === 'undefined') {
              Contacts.requestPermission((err, permission) => {
                
              })
            }
            if (permission === 'authorized') {
              setContactPermissionsGranted(true);
            }
            if (permission === 'denied') {
              setContactPermissionsGranted(false)
            }
          })


        async function retrieveContacts() {
            await Contacts.getAll((err, response) => {
                if (err)
                {
                    
                }

                setContactRecords(response);
            })
        }

        retrieveContacts()
    }, [contactRecords.length])

    return (
        <Modal visible={false} animated={true} animationStyle="slide" presentationStyle="fullScreen" style={{flex: 1, backgroundColor: '#FFFFFF'}}>
            <SafeAreaView style={{flex: 1, backgroundColor: 'transparent'}}>
               <View style={{flex: 1, padding: 10, alignItems: 'center', justifyContent: 'space-evenly'}}>
               <Text style={{fontFamily: 'ARSMaquettePro-Black', fontSize: 20, fontWeight: '300'}}>
                    Invite your contacts
                </Text>

                <Text style={{color: 'rgb(174, 174, 178)', fontFamily: 'ARSMaquettePro-Medium', fontSize: 15}}>
                    Gather partners to start your fitness journey
                </Text>

                <Text style={{color: 'rgb(174, 174, 178)', fontFamily: 'ARSMaquettePro-Medium', fontSize: 15}}>
                    Manage your client list from a centralized location
                </Text>
               </View>

               <Divider />

               <View style={{flex: 4}}>
                   <ScrollView>
                    {
                        contactPermissionsGranted == true ?
                        contactRecords.map(contact => {
                            return (
                                <View style={{backgroundColor: invitedList.includes(contact.phoneNumbers[0].number) ? 'grey' : 'transparent', width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'center',  justifyContent: 'space-between', margin: 10}}>
                                    <View style={{flex: 2, flexDirection: 'row', alignItems: 'center'}}>
                                        <Avatar.Icon icon="perm-identity" color="#212121" size={30} style={{backgroundColor: 'transparent', margin: 5}} />
                                        <View>
                                        <Text style={{fontSize: 18, fontWeight: '300'}}>
                                           {contact.familyName + " " + contact.givenName}
                                        </Text>
                                        <Caption>
                                            {contact.phoneNumbers[0].number}
                                        </Caption>
                                        </View>
                                        </View>

                                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                        <Button key={contact.phoneNumbers[0].number} style={{elevation: 0}} theme={{colors: {
                                            primary: 'rgb(33,150,243)'
                                        },
                                        roundness: 5
                                        }}
                                        mode="contained"
                                        onPress={() => handleInviteContact(contact.phoneNumbers[0].number)}>
                                            <Text>
                                                Invite
                                            </Text>
                                        </Button>
                                        </View>
                                </View>
                            )
                        })
                        :
                        <Text style={{backgroundColor: 'red'}}>
                            Hi
                        </Text>
                    }
                                       </ScrollView>
               </View>

               <Divider />

               <View style={{flex: 0.5, alignItems: 'center', justifyContent: 'center'}}>
                   <Text>
                       I'll handle this later
                   </Text>
                   <NativeButton title="Skip" />
               </View>
            
            </SafeAreaView>
        </Modal>
    )
}

class LupaHome extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            swiperOneViewIndex: 0,
            swiperTwoViewIndex: 1,
            swiperThreeViewIndex: 2,
            surfaceWidth: 0,
            surfaceHeight: 0,
            viewOneFocused: true,
            viewTwoFocused: true,
            viewThreeFocused: true,
            showTrainerRegistrationModal: false,
            viewGrantedResponder: false,
            viewGrantedMove: false,
            chartTopPosition: Constants.statusBarHeight,
            expandedViewHeights: new Animated.Value(Dimensions.get('window').height / 3.2),
            chartHeight: Dimensions.get('window').height / 3.3,
            currInteractiveSwiperIndex: 0
        }

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.viewOneAnimatedVal = new Animated.Value(0);
        this.interpolatedViewHeightOne = this.viewOneAnimatedVal.interpolate({inputRange: [0, 1], outputRange: ['30%', '10%']})
        this.viewTwoAnimatedVal = new Animated.Value(0);
        this.interpolatedViewHeightTwo = this.viewTwoAnimatedVal.interpolate({ inputRange: [0, 1], outputRange: ['45%', '15%']})
        this.viewThreeAnimatedVal = new Animated.Value(0);
        this.interpolatedViewHeightThree = this.viewThreeAnimatedVal.interpolate({ inputRange: [0, 1] , outputRange: ['60%', '20%']})
    }

    componentDidMount() {
       // this.handleStartSwipers();
    }

    componentWillUnmount() {
    //this.handleStopSwipers()
    }

    handleStartSwipers = () => {
        this.swiperOneInterval =    setInterval(this.activateSwiperOne, 2500);
        this.swiperTwoInterval = setInterval(this.activateSwiperTwo, 2500);
        this.swiperThreeInterval = setInterval(this.activateSwiperThree, 2500);
    }

    handleStopSwipers = () => {
        clearInterval(this.swiperOneInterval);
        clearInterval(this.swiperTwoInterval);
        clearInterval(this.swiperThreeInterval);
    }

    activateSwiperOne = () => {
        if (this.state.swiperOneViewIndex == 2)
        {
            this.setState({ 
                swiperOneViewIndex: 0 
            })

            return;
        }

        this.setState({
            swiperOneViewIndex: this.state.swiperOneViewIndex + 1
        })
    }

    activateSwiperTwo = () => {
        if (this.state.swiperTwoViewIndex == 2)
        {
            this.setState({ 
                swiperTwoViewIndex: 0 
            })

            return;
        }

        this.setState({
            swiperTwoViewIndex: this.state.swiperTwoViewIndex + 1
        })
    }

    activateSwiperThree = () => {
        if (this.state.swiperThreeViewIndex == 2)
        {
            this.setState({ 
                swiperThreeViewIndex: 0 
            })

            return;
        }

        this.setState({
            swiperThreeViewIndex: this.state.swiperThreeViewIndex + 1
        })
    }

    showAnimatedViewOne = () => {
        this.setState({
            viewOneFocused: true,
            viewTwoFocused: false,
            viewThreeFocused: false,
        });

        InteractionManager.runAfterInteractions(() => { 
            Animated.timing(this.viewOneAnimatedVal, {
                toValue: 0,
                duration: ANIMATED_HEIGT_DURATION 
            }).start()
    
            Animated.timing(this.viewTwoAnimatedVal, {
                toValue: 0,
                duration: ANIMATED_HEIGT_DURATION 
            }).start()
    
            Animated.timing(this.viewThreeAnimatedVal, {
                toValue: 0,
                duration: ANIMATED_HEIGT_DURATION 
            }).start()
         });

    }

    showAnimatedViewTwo = () => {
        this.setState({
            viewTwoFocused: true,
            viewOneFocused: false,
            viewThreeFocused: false,
        });

        InteractionManager.runAfterInteractions(() => {
            Animated.timing(this.viewTwoAnimatedVal, {
                toValue: 0,
                duration: ANIMATED_HEIGT_DURATION 
            }).start()
    
            Animated.timing(this.viewOneAnimatedVal, {
                toValue: 1,
                duration: ANIMATED_HEIGT_DURATION 
            }).start()
    
            Animated.timing(this.viewThreeAnimatedVal, {
                toValue: 0,
                duration: ANIMATED_HEIGT_DURATION 
            }).start()
        })
    }

    showAnimatedViewThree = () => {
        this.setState({
            viewThreeFocused: true,
            viewOneFocused: false,
            viewTwoFocused: false,
        })

        InteractionManager.runAfterInteractions(() => {
            Animated.timing(this.viewThreeAnimatedVal, {
                toValue: 0,
                duration: ANIMATED_HEIGT_DURATION 
            }).start()
    
            Animated.timing(this.viewTwoAnimatedVal, {
                toValue: 1,
                duration: ANIMATED_HEIGT_DURATION 
            }).start()
    
            Animated.timing(this.viewOneAnimatedVal, {
                toValue: 1,
                duration: ANIMATED_HEIGT_DURATION 
            }).start()
        })
    }

    navigateToIndex(index) {
       this.props.goToIndex(index)
    }

    handleViewThreeOnPress = () => {
        if (this.props.lupa_data.Users.currUserData.isTrainer == true)
        {
            this.props.navigation.navigate('CreateProgram', {
                navFrom: "Home"
            })
            return;
        }
        else
        {
            this.props.navigation.navigate('TrainerInformation')
        }
    }

    onSwipeUp(gestureState) {
        if (false)
        {
            this.handleHideFeed();
            this.handleStopSwipers();
        }
      }
    
      onSwipeDown(gestureState) {
      // this.handleShowFeed();
      //  this.handleStartSwipers();
      }
    
      onSwipeLeft(gestureState) {
       // this.handleShowFeed(); //Might remove this later if it is a performance overhaul
       // this.handleStopSwipers();
      }
    
      onSwipeRight(gestureState) {
       // this.handleShowFeed(); //Might remove this later if it is a performance overhaul
       // this.handleStopSwipers();
      }
      
      onSwipe(gestureName, gestureState) {
        const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
        switch (gestureName) {
          case SWIPE_UP:
               //this.onSwipeUp(gestureState);
            break;
          case SWIPE_DOWN:
              //  this.onSwipeDown(gestureState);
            break;
          case SWIPE_LEFT:
           // this.onSwipeLeft(gestureState);
            break;
          case SWIPE_RIGHT:
           // this.onSwipeRight(gestureState);
            break;
        }
      }

      handleShowFeed = () => {
        InteractionManager.runAfterInteractions(() => {
            Animated.timing(this.state.chartTopPosition, {
                toValue: Constants.statusBarHeight,
                duration: 200
            }).start()
    
            Animated.timing(this.state.expandedViewHeights, {
                toValue: Dimensions.get('window').height / 3.2,
                duration: 200
            }).start()

        })
      }

      handleHideFeed = () => {
       InteractionManager.runAfterInteractions(() => {
            Animated.timing(this.state.chartTopPosition, {
                toValue: -500,
                duration: 500
            }).start()
    
            Animated.timing(this.state.expandedViewHeights, {
                toValue: -500,
                duration: 500
            }).start()

        })
      }

    render() {
        return (
            <GestureRecognizer
            onSwipe={(direction, state) => this.onSwipe(direction, state)}
            onSwipeUp={(state) => this.onSwipeUp(state)}
            onSwipeDown={(state) => this.onSwipeDown(state)}
            onSwipeLeft={(state) => this.onSwipeLeft(state)}
            onSwipeRight={(state) => this.onSwipeRight(state)}
            config={config}
            style={{
              flex: 1,
              backgroundColor: this.state.backgroundColor
            }}
            >
            <SafeAreaView 
                style={styles.root}>

<LinearGradient start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }} style={{padding: 15, position: 'absolute', top: Constants.statusBarHeight, right: 0, left: 0, height: Dimensions.get('window').height, width: Dimensions.get('window').width}} colors={['#FFFFFF', '#F2F2F2']} />
            
                                <Surface style={{borderBottomLeftRadius: 50, elevation: 10, position: 'absolute', top: this.state.expandedViewHeights, height: this.interpolatedViewHeightThree, width: Dimensions.get('window').width, backgroundColor: 'transparent'}}>
                                <TouchableHighlight style={{borderBottomLeftRadius: 50, flex: 1}} onPress={this.showAnimatedViewThree}>
                                <Swiper autoplay={true} autoplayDirection={true} style={{borderBottomLeftRadius: 50,}} index={this.state.swiperThreeViewIndex} scrollEnabled={false} paginationStyle={{justifyContent: 'flex-start', bottom: 20, paddingLeft: 25}}>
<ImageBackground resizeMode="cover" style={styles.imageBackground} imageStyle={{borderBottomLeftRadius: 50}} source={require('./images/programs/sample_photo_one.jpg')}>
<View style={styles.viewOverlay} />
{
    this.state.viewThreeFocused == true ?
    <>
    <Text style={styles.mainGraphicText}>
               Create a Program
            </Text>
                        <Paragraph style={styles.subGraphicText}>
                         Have a workout program that you want to share with your friends, family, or the world?  Create it here on Lupa.
                        </Paragraph>
                        </>
    :
    null
}
<Button mode="text" color="white" style={styles.graphicButton} onPress={this.handleViewThreeOnPress}>
                Create a program
            </Button>
           
</ImageBackground>

<ImageBackground resizeMode="cover" style={styles.imageBackground} imageStyle={{borderBottomLeftRadius: 50}} source={require('./images/programs/sample_photo_two.jpg')}>
<View style={styles.viewOverlay} />
{
    this.state.viewThreeFocused == true ?
    <>
    <Text style={styles.mainGraphicText}>
               Register as a Lupa Trainer
            </Text>
            <Paragraph style={styles.subGraphicText}>
             Are you certified fitness trainer?  Register with Lupa and start earning money today.
            </Paragraph>
    </>
    :
    null
}
            <Button mode="text" color="white" style={styles.graphicButton} onPress={this.handleViewThreeOnPress}>
                Register as a Trainer
            </Button>
          
</ImageBackground>

<ImageBackground resizeMode="cover" style={styles.imageBackground} imageStyle={{borderBottomLeftRadius: 50}} source={require('./images/programs/sample_photo_three.jpg')}>
<View style={styles.viewOverlay} />
{
    this.state.viewThreeFocused == true ?
    <>
    <Text style={styles.mainGraphicText}>
    Start your career with Lupa
 </Text>
 <Paragraph style={styles.subGraphicText}>
          Enter your certification ID number, register with Lupa, and bring your client list to one centralized platform.
            </Paragraph>
            </>
    :
    null
}
            <Button mode="text" color="white" style={styles.graphicButton} onPress={this.handleViewThreeOnPress}>
                Create a workout
            </Button>
        
</ImageBackground>
</Swiper>
                                </TouchableHighlight>
                                
</Surface>








                                <Surface style={{borderBottomLeftRadius: 50, elevation: 10, position: 'absolute', top: this.state.expandedViewHeights, height: this.interpolatedViewHeightTwo, width: Dimensions.get('window').width}}>
                                <TouchableHighlight style={{borderBottomLeftRadius: 50, flex: 1}} onPress={this.showAnimatedViewTwo}>
                                <Swiper autoplay={true} autoplayDirection={true}  style={{borderBottomLeftRadius: 50,}} index={this.state.swiperTwoViewIndex} scrollEnabled={false} paginationStyle={{justifyContent: 'flex-start', bottom: 20, paddingLeft: 25}}>
<ImageBackground resizeMode="cover" style={styles.imageBackground} imageStyle={{borderBottomLeftRadius: 50}} source={require('./images/packprogramone.jpg')}>
<View style={styles.viewOverlay} />
{
    this.state.viewTwoFocused == true ?
    <>
    <Text style={styles.mainGraphicText}>
               Find a Pack
            </Text>
            <Paragraph style={styles.subGraphicText}>
            Sign up under a pack, a group of your peers, and complete your fitness journey together.  Find out more on the pack page.
            </Paragraph>
            </>
    :
    null
}

<Button mode="text" color="white" style={styles.graphicButton} onPress={() => this.navigateToIndex(2)}>
Go to Packs
            </Button>
           
</ImageBackground>

<ImageBackground resizeMode="cover" style={styles.imageBackground} imageStyle={{borderBottomLeftRadius: 50}} source={require('./images/packprogramtwo.jpg')}>
<View style={styles.viewOverlay} />
{
    this.state.viewTwoFocused == true ?
    <>
    <Text style={styles.mainGraphicText}>
               Engage in a Community
            </Text>
            <Paragraph style={styles.subGraphicText}>
             Fitness doesn't have to be a solo journey.  Engage with other Lupa users.  Find out more on the packs page.
            </Paragraph>
            </>
    :
    null
}

            <Button mode="text" color="white" style={styles.graphicButton} onPress={() => this.navigateToIndex(2)}>
            Go to Packs
            </Button>
          
</ImageBackground>

<ImageBackground resizeMode="cover" style={styles.imageBackground} imageStyle={{borderBottomLeftRadius: 50}} source={require('./images/packprogramthree.jpg')}>
<View style={styles.viewOverlay} />
{
    this.state.viewTwoFocused == true ?
    <>
    <Text style={styles.mainGraphicText}>
    Progress with your Peers
  </Text>
  <Paragraph style={styles.subGraphicText}>
            We progress faster when our friends are with us.  Find out more on the packs page.
            </Paragraph>
            </>
    :
    null
}
   
            <Button mode="text" color="white" style={styles.graphicButton} onPress={() => this.navigateToIndex(2)}>
                Go to Packs
            </Button>
        
</ImageBackground>
</Swiper>
</TouchableHighlight>
</Surface>

<Surface style={{borderBottomLeftRadius: 50, elevation: 10, position: 'absolute', top: this.state.expandedViewHeights, height: this.interpolatedViewHeightOne, width: Dimensions.get('window').width, backgroundColor: 'transparent'}}>
<TouchableHighlight style={{borderBottomLeftRadius: 50, flex: 1}} onPress={this.showAnimatedViewOne}>

<Swiper autoplay={true} autoplayDirection={true} style={{borderBottomLeftRadius: 50,}} index={this.state.swiperOneViewIndex} scrollEnabled={false} paginationStyle={{justifyContent: 'flex-start', bottom: 20, paddingLeft: 25}}>
<ImageBackground resizeMode="cover" style={styles.imageBackground} imageStyle={{borderBottomLeftRadius: 50}} source={require('./images/fitnesstrainer.jpg')}>
<View style={styles.viewOverlay} />
{
    this.state.viewOneFocused == true ?
    <>
    <Text style={styles.mainGraphicText}>
               Book a Fitness Trainer
            </Text>
            <Paragraph style={styles.subGraphicText}>
            Stop dealing with overpriced workout programs.  Easily find a trainer on the programs page.
            </Paragraph>
            </>
            :
        null
}
<Button mode="text" color="white" style={styles.graphicButton} onPress={() => this.props.navigation.navigate('Programs')}>
                Go to Programs
            </Button>
           
</ImageBackground>

<ImageBackground resizeMode="cover" style={styles.imageBackground} imageStyle={{borderBottomLeftRadius: 50}} source={require('./images/yogotrainer.jpg')}>
<View style={styles.viewOverlay} />
{
    this.state.viewOneFocused == true ?
    <>
    <Text style={styles.mainGraphicText}>
             Explore Programs
            </Text>
            <Paragraph style={styles.subGraphicText}>
             Explore a catalog of various workout programs.  Find the right one for your journey.
            </Paragraph>
            </>
            :
        null
}
            <Button mode="text" color="white" style={styles.graphicButton} onPress={() => this.props.navigation.navigate('Programs')}>
            Go to Programs
            </Button>
          
</ImageBackground>

<ImageBackground resizeMode="cover" style={styles.imageBackground} imageStyle={{borderBottomLeftRadius: 50}} source={require('./images/tracktrainer.jpg')}>
<View style={styles.viewOverlay} />
{
    this.state.viewOneFocused == true ?
    <>
    <Text style={styles.mainGraphicText}>
               Create a Workout
            </Text>
            <Paragraph style={styles.subGraphicText}>
                Using Lupa tools create your own exercises, workouts, or complete workout programs.
            </Paragraph>
            </>
            :
        null
}
            <Button mode="text" color="white" style={styles.graphicButton} onPress={() => this.props.navigation.navigate('Programs', {
                setScreen: this.props.setScreen.bind(this)
            })}>
                Go to Programs
            </Button>
        
</ImageBackground>
</Swiper>
</TouchableHighlight>
</Surface>

<View style={{bottom: 0, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', position: 'absolute', height: '13%', width: '50%'}}>
<FAB small onPress={() => this.props.navigation.navigate('MessagesView')} icon="email" color="white" style={{backgroundColor: '#212121', position: 'absolute', alignSelf: 'flex-start', marginLeft: 10}} />
<FAB small onPress={() => this.props.navigation.push('NotificationsView')} icon="notifications"  color="white"  style={{backgroundColor: '#212121', position: 'absolute', alignSelf: 'flex-end', marginRight: 10}} />
</View>

<View
style={{ 
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20, 
    position: 'absolute', 
   elevation: 0, 
    top: this.state.chartTopPosition, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: "#FFFFFF", 
    alignSelf: 'center', 
    width: '100%', 
    height: this.state.chartHeight}}>
        
                <Swiper index={this.state.currInteractiveSwiperIndex} scrollEnabled={false} loop={false} showsButtons={false}  showsPagination={false} style={{borderBottomLeftRadius: 20, borderBottomRightRadius: 20,}} centerContent horizontal={true}>
    <View onStartShouldSetResponder={event => true} onMoveShouldSetResponderCapture={evt => true}  onMoveShouldSetResponder={evt => true} onResponderGrant={evt => {}}   style={{paddingHorizontal: 20, backgroundColor: '#212121', flex: 1, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, alignItems: 'center', justifyContent: 'center'}}>
        <Chip icon={() => <FeatherIcon name="calendar" color="#212121" size={15} />} style={{elevation: 15, position: 'absolute', top: 0, right: 0, margin: 10, borderColor: '#FFFFFF'}} mode="outlined">
            Getting started 1/3
        </Chip>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
        <Image style={{width: 55, height: 55, margin: 5}} source={require('./images/calendar.png')} />
            <Text style={{paddingHorizontal: 12, fontFamily: 'ARSMaquettePro-Regular', fontSize: 25, color: '#FFFFFF'}}>
                Book your first trainer
            </Text>
</View>
            <Text style={{paddingHorizontal: 10, fontFamily: 'ARSMaquettePro-Medium', fontSize: 16, color: 'rgb(229, 229, 224)'}}>
                Explore a variety of trainer's and workout programs on Lupa.  Find a trainer or program tailored specifically to your
                fitness journey.
            </Text>
</View>

<View onStartShouldSetResponder={event => true} onMoveShouldSetResponderCapture={evt => true} onMoveShouldSetResponder={evt => true} style={{backgroundColor: '#212121', flex: 1, borderBottomLeftRadius: 20, alignItems: 'center', justifyContent: 'center'}}>
        <Chip icon={() => <FeatherIcon name="activity" color="#212121" size={15} />} style={{elevation: 15, position: 'absolute', top: 0, right: 0, margin: 10, borderColor: '#FFFFFF'}} mode="outlined">
            Getting started 2/3
        </Chip>
        <View style={{flexDirection: 'row', borderBottomLeftRadius: 20, alignItems: 'center', justifyContent: 'center'}}>
        <Image style={{width: 60, height: 60, margin: 5}} source={require('./images/deadlift.png')} />
            <Text style={{paddingHorizontal: 12, fontFamily: 'ARSMaquettePro-Regular', fontSize: 25, color: '#FFFFFF'}}>
                Create a workout
            </Text>
</View>
            <Text style={{paddingHorizontal: 15, fontFamily: 'ARSMaquettePro-Medium', fontSize: 16, color: 'rgb(229, 229, 224)'}}>
                Use a range of Lupa tools to create individual exercises, workout, and workout programs.  Share programs with your friends and other users.
            </Text>
</View>

<View onStartShouldSetResponder={event => true} onMoveShouldSetResponderCapture={evt => true} onMoveShouldSetResponder={evt => true} style={{backgroundColor: '#212121', flex: 1, borderBottomLeftRadius: 20, alignItems: 'center', justifyContent: 'center'}}>
        <Chip icon={() => <FeatherIcon name="book-open" color="#212121" size={15} />} style={{elevation: 15, position: 'absolute', top: 0, right: 0, margin: 10, borderColor: '#FFFFFF'}} mode="outlined">
            Getting started 3/3
        </Chip>
        <View style={{borderBottomLeftRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
        <Image style={{width: 55, height: 55, margin: 5}} source={require('./images/run.png')} />
            <Text style={{paddingHorizontal: 12, fontFamily: 'ARSMaquettePro-Regular', fontSize: 25, color: '#FFFFFF'}}>
                Log a workout
            </Text>
</View>
            <Text style={{paddingHorizontal: 10, fontFamily: 'ARSMaquettePro-Medium', fontSize: 16, color: 'rgb(229, 229, 224)'}}>
                Swipe right to your journal and log a workout you've recently finished on or off of Lupa.
            </Text>
</View>

    <View style={{backgroundColor: '#212121', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Surface style={{borderBottomLeftRadius: 20, borderBottomRightRadius: 20, elevation: 0, backgroundColor: '#212121', width: Dimensions.get('window').width / 1.1, height: '70%'  }} onLayout={event => this.setState({ surfaceWidth: event.nativeEvent.layout.width, surfaceHeight: event.nativeEvent.layout.height})}>
                <LineChart
                bezier
                data={{
                  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jul", "Aug", "Sep"],
                  datasets: [
                    {
                      data: [
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                      ]
                    }
                  ]
                }}
                width={this.state.surfaceWidth} // from react-native
                height={this.state.surfaceHeight}
                yAxisLabel="N"
                withHorizontalLabels={false}
                yAxisSuffix=""
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={{
                    strokeWidth: 0.5, 
                  backgroundColor: "#FAFAFA",
                  backgroundGradientFrom: "#F2F2F2",
                  backgroundGradientTo: "rgb(33,150,243)",
                  decimalPlaces: 0, // optional, defaults to 2dp
                  color: (opacity = 0) => `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = 0) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 20,
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#ffa726"
                  },
                  propsForBackgroundLines: {
                      backgroundColor: 'transparent',
                      color: 'transparent',
                      stroke: 'transparent',
                  }
                }}
                style={{
                  borderRadius: 15,
                }}
              />
                </Surface>
            <Chip textStyle={styles.chipText} style={styles.chip}>
               Activity
            </Chip>
                    </View> 
                </Swiper>
                
                <View textStyle={{fontSize: 10}} style={{padding: 0, margin: 0, alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, left: 0,  borderRadius: 35, width: 35, height: 35, backgroundColor: 'rgb(33,150,243)'}} mode="flat">
    <Text style={{fontSize: 10}}>
        1/5
    </Text>
</View>

<View style={{width: '100%', justifyContent: 'space-between'}}>
    {
        this.state.currInteractiveSwiperIndex != 0 ?
        <Button style={{alignSelf: 'flex-end', position: 'absolute', bottom: 0, left: 0}} color="white" onPress={() => this.setState({ currInteractiveSwiperIndex: this.state.currInteractiveSwiperIndex - 1})}>
        Back
    </Button>
    :
    null
    }
<Button style={{alignSelf: 'flex-start', position: 'absolute', bottom: 0, right: 0}} color="white" disabled={this.state.currInteractiveSwiperIndex == 3} onPress={() => this.setState({currInteractiveSwiperIndex: this.state.currInteractiveSwiperIndex + 1})}>
                        Next
                    </Button>
</View>

                </View>
        
            </SafeAreaView>
            </GestureRecognizer>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#212121",
    },
    mainGraphicText: {
        fontFamily: 'ARSMaquettePro-Bold', 
        color: '#FFFFFF', 
        fontSize: 25
    },
    subGraphicText: {
        fontFamily: 'ARSMaquettePro-Medium',
        color: '#FFFFFF',
        padding: 15,
    },
    graphicButton: {

    },
    viewOverlay: {
        position: 'absolute', 
        width: '100%', 
        height: '100%', 
        borderBottomLeftRadius: 50, 
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
    chipText: {
        color: 'white', 
        fontFamily: 'ARSMaquettePro-Regular'
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
        alignItems: 'center', 
        justifyContent: 'center', 
        borderBottomLeftRadius: 50
    },
    graphicButton: {
        bottom: 5, 
        right: 5, 
        position: 'absolute', 
        alignSelf: 'flex-end'
    }
});

export default connect(mapStateToProps)(withNavigation(LupaHome));