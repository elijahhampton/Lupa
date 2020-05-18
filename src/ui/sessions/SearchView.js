/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  23, 2019
 * 
 *  SearchView
 */

import React from 'react';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

import {
    View,
    StyleSheet,
    InteractionManager,
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
    Badge,
    Appbar,
} from 'react-native-paper';

import {
    LineChart,
} from 'react-native-chart-kit';

import FeatherIcon from 'react-native-vector-icons/Feather';

import { getUniqueId, getManufacturer, getDeviceType, getDeviceId} from 'react-native-device-info';

import { NavigationActions, withNavigation } from 'react-navigation'

import LupaController from '../../controller/lupa/LupaController';

import { connect } from 'react-redux';
import { Pagination } from 'react-native-snap-carousel';
import Swiper from 'react-native-swiper';

import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { throwIfAudioIsDisabled } from 'expo-av/build/Audio/AudioAvailability';
import { Constants } from 'react-native-unimodules';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';

import LiveWorkout from '../workout/modal/LiveWorkout';
import LupaDefaultCameraConfiguration from '../../modules/camera/Camera';
import LiveWorkoutPreview from '../workout/program/LiveWorkoutPreview';
import ProgramInformationPreview from '../workout/program/ProgramInformationPreview';


const ANIMATED_HEIGT_DURATION = 500;

const DEVICE_TYPE = getDeviceId();

const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80
  };

mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

class SearchView extends React.Component {
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
            chartTopPosition: new Animated.Value(Constants.statusBarHeight),
            expandedViewHeights: new Animated.Value(Dimensions.get('window').height / 3.2),
            chartHeight: new Animated.Value(Dimensions.get('window').height / 3.3)
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
            this.props.navigation.navigate('CreateProgram')
            return;
        }
        else
        {
            this.props.navigation.navigate('TrainerInformation')
        }
    }

    onSwipeUp(gestureState) {
      //  this.handleHideFeed();
      //  this.handleStopSwipers();
      }
    
      onSwipeDown(gestureState) {
       // this.handleShowFeed();
       // this.handleStartSwipers();
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
                    end={{ x: 1, y: 1 }} style={{padding: 15, position: 'absolute', top: 0, right: 0, left: 0, height: Dimensions.get('window').height, width: Dimensions.get('window').width}} colors={['#FFFFFF', '#F2F2F2']} />
            
                                <Surface style={{borderBottomLeftRadius: 50, elevation: 10, position: 'absolute', top: this.state.expandedViewHeights, height: this.interpolatedViewHeightThree, width: Dimensions.get('window').width, backgroundColor: 'transparent'}}>
                                <TouchableHighlight style={{borderBottomLeftRadius: 50, flex: 1}} onPress={this.showAnimatedViewThree}>
                                <Swiper autoplay={true} autoplayDirection={true} style={{borderBottomLeftRadius: 50,}} index={this.state.swiperThreeViewIndex} scrollEnabled={false} paginationStyle={{alignSelf: 'flex-start'}}>
<ImageBackground resizeMode="stretch" style={styles.imageBackground} imageStyle={{borderBottomLeftRadius: 50}} source={require('../images/programs/sample_photo_one.jpg')}>
<View style={styles.viewOverlay} />
{
    this.state.viewThreeFocused == true ?
    <>
    <Text style={styles.mainGraphicText}>
               Create a Program
            </Text>
                        <Paragraph style={styles.subGraphicText}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </Paragraph>
                        </>
    :
    null
}
<Button mode="text" color="white" style={styles.graphicButton} onPress={this.handleViewThreeOnPress}>
                View More
            </Button>
           
</ImageBackground>

<ImageBackground resizeMode="stretch" style={styles.imageBackground} imageStyle={{borderBottomLeftRadius: 50}} source={require('../images/programs/sample_photo_two.jpg')}>
<View style={styles.viewOverlay} />
{
    this.state.viewThreeFocused == true ?
    <>
    <Text style={styles.mainGraphicText}>
               Register as a Lupa Trainer
            </Text>
            <Paragraph style={styles.subGraphicText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Paragraph>
    </>
    :
    null
}
            <Button mode="text" color="white" style={styles.graphicButton} onPress={this.handleViewThreeOnPress}>
                View More
            </Button>
          
</ImageBackground>

<ImageBackground resizeMode="stretch" style={styles.imageBackground} imageStyle={{borderBottomLeftRadius: 50}} source={require('../images/programs/sample_photo_three.jpg')}>
<View style={styles.viewOverlay} />
{
    this.state.viewThreeFocused == true ?
    <>
    <Text style={styles.mainGraphicText}>
    Start your career with Lupa
 </Text>
 <Paragraph style={styles.subGraphicText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Paragraph>
            </>
    :
    null
}
            <Button mode="text" color="white" style={styles.graphicButton} onPress={this.handleViewThreeOnPress}>
                View More
            </Button>
        
</ImageBackground>
</Swiper>
                                </TouchableHighlight>
                                
</Surface>








                                <Surface style={{borderBottomLeftRadius: 50, elevation: 10, position: 'absolute', top: this.state.expandedViewHeights, height: this.interpolatedViewHeightTwo, width: Dimensions.get('window').width}}>
                                <TouchableHighlight style={{borderBottomLeftRadius: 50, flex: 1}} onPress={this.showAnimatedViewTwo}>
                                <Swiper autoplay={true} autoplayDirection={true}  style={{borderBottomLeftRadius: 50,}} index={this.state.swiperTwoViewIndex} scrollEnabled={false} paginationStyle={{alignSelf: 'flex-start'}}>
<ImageBackground resizeMode="stretch" style={styles.imageBackground} imageStyle={{borderBottomLeftRadius: 50}} source={require('../images/packprogramone.jpg')}>
<View style={styles.viewOverlay} />
{
    this.state.viewTwoFocused == true ?
    <>
    <Text style={styles.mainGraphicText}>
               Find a Pack
            </Text>
            <Paragraph style={styles.subGraphicText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Paragraph>
            </>
    :
    null
}

<Button mode="text" color="white" style={styles.graphicButton} onPress={() => this.navigateToIndex(2)}>
                View More
            </Button>
           
</ImageBackground>

<ImageBackground resizeMode="stretch" style={styles.imageBackground} imageStyle={{borderBottomLeftRadius: 50}} source={require('../images/packprogramtwo.jpg')}>
<View style={styles.viewOverlay} />
{
    this.state.viewTwoFocused == true ?
    <>
    <Text style={styles.mainGraphicText}>
               Engage in a Community
            </Text>
            <Paragraph style={styles.subGraphicText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Paragraph>
            </>
    :
    null
}

            <Button mode="text" color="white" style={styles.graphicButton} onPress={() => this.navigateToIndex(2)}>
                View More
            </Button>
          
</ImageBackground>

<ImageBackground resizeMode="stretch" style={styles.imageBackground} imageStyle={{borderBottomLeftRadius: 50}} source={require('../images/packprogramthree.jpg')}>
<View style={styles.viewOverlay} />
{
    this.state.viewTwoFocused == true ?
    <>
    <Text style={styles.mainGraphicText}>
    Progress with your Peers
  </Text>
  <Paragraph style={styles.subGraphicText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Paragraph>
            </>
    :
    null
}
   
            <Button mode="text" color="white" style={styles.graphicButton} onPress={() => this.navigateToIndex(2)}>
                View More
            </Button>
        
</ImageBackground>
</Swiper>
</TouchableHighlight>
</Surface>

<Surface style={{borderBottomLeftRadius: 50, elevation: 10, position: 'absolute', top: this.state.expandedViewHeights, height: this.interpolatedViewHeightOne, width: Dimensions.get('window').width, backgroundColor: 'transparent'}}>
<TouchableHighlight style={{borderBottomLeftRadius: 50, flex: 1}} onPress={this.showAnimatedViewOne}>

<Swiper autoplay={true} autoplayDirection={true} style={{borderBottomLeftRadius: 50,}} index={this.state.swiperOneViewIndex} scrollEnabled={false} paginationStyle={{alignSelf: 'flex-start'}}>
<ImageBackground resizeMode="stretch" style={styles.imageBackground} imageStyle={{borderBottomLeftRadius: 50}} source={require('../images/fitnesstrainer.jpg')}>
<View style={styles.viewOverlay} />
{
    this.state.viewOneFocused == true ?
    <>
    <Text style={styles.mainGraphicText}>
               Book a Fitness Trainer
            </Text>
            <Paragraph style={styles.subGraphicText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Paragraph>
            </>
            :
        null
}
<Button mode="text" color="white" style={styles.graphicButton} onPress={() => this.props.navigation.navigate('Programs')}>
                View More
            </Button>
           
</ImageBackground>

<ImageBackground resizeMode="stretch" style={styles.imageBackground} imageStyle={{borderBottomLeftRadius: 50}} source={require('../images/yogotrainer.jpg')}>
<View style={styles.viewOverlay} />
{
    this.state.viewOneFocused == true ?
    <>
    <Text style={styles.mainGraphicText}>
             Explore Trainer Programs
            </Text>
            <Paragraph style={styles.subGraphicText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Paragraph>
            </>
            :
        null
}
            <Button mode="text" color="white" style={styles.graphicButton} onPress={() => this.props.navigation.navigate('Programs')}>
                View More
            </Button>
          
</ImageBackground>

<ImageBackground resizeMode="stretch" style={styles.imageBackground} imageStyle={{borderBottomLeftRadius: 50}} source={require('../images/tracktrainer.jpg')}>
<View style={styles.viewOverlay} />
{
    this.state.viewOneFocused == true ?
    <>
    <Text style={styles.mainGraphicText}>
               Book a Track Trainer
            </Text>
            <Paragraph style={styles.subGraphicText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Paragraph>
            </>
            :
        null
}
            <Button mode="text" color="white" style={styles.graphicButton} onPress={() => this.props.navigation.navigate('Programs', {
                setScreen: this.props.setScreen.bind(this)
            })}>
                View More
            </Button>
        
</ImageBackground>
</Swiper>
</TouchableHighlight>
</Surface>

<View style={{bottom: 0, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', position: 'absolute', height: '20%', width: '50%'}}>
<FAB small onPress={() => this.props.navigation.navigate('MessagesView')} icon="email" color="white" style={{backgroundColor: '#212121', position: 'absolute', alignSelf: 'flex-start', marginLeft: 10}} />
<FAB small onPress={() => this.props.navigation.navigate('NotificationsView')} icon="notifications"  color="white"  style={{backgroundColor: '#212121', position: 'absolute', alignSelf: 'flex-end', marginRight: 10}} />
</View>

<Surface style={{ borderBottomLeftRadius: 40, position: 'absolute', elevation: 0, top: this.state.chartTopPosition, alignItems: 'center', justifyContent: 'center', backgroundColor: "white", alignSelf: 'center', width: '100%', height: this.state.chartHeight}}>
                <Surface style={{borderRadius: 20, elevation: 15, backgroundColor: '#FFFFFF', width: Dimensions.get('window').width / 1.1, height: '80%'  }} onLayout={event => this.setState({ surfaceWidth: event.nativeEvent.layout.width, surfaceHeight: event.nativeEvent.layout.height})}>
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
                  backgroundGradientFrom: "#212121",
                  backgroundGradientTo: "#000000",
                  decimalPlaces: 0, // optional, defaults to 2dp
                  color: (opacity = 0) => `rgba(33, 150, 243, ${opacity})`,
                  labelColor: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
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

                </Surface>
            </SafeAreaView>
            </GestureRecognizer>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "white",
    },
    mainGraphicText: {
        fontFamily: 'ARSMaquettePro-Black', 
        color: '#FFFFFF', 
        fontSize: 25
    },
    subGraphicText: {
        fontFamily: 'ARSMaquettePro-Medium',
        color: '#FFFFFF',
        padding: 10,
    },
    graphicButton: {

    },
    viewOverlay: {
        position: 'absolute', 
        width: '100%', 
        height: '100%', 
        borderBottomLeftRadius: 50, 
        backgroundColor: 'rgba(0,0,0,0.3)'
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

export default connect(mapStateToProps)(withNavigation(SearchView));