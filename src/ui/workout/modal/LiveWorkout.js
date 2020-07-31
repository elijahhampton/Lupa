import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    Modal,
    ScrollView,
    Image,
    SafeAreaView,
    Dimensions,
    TouchableOpacity,
} from 'react-native';

import {
    ActivityIndicator,
    Divider,
    IconButton,
    Button,
    Menu,
    Surface,
    Provider,
} from 'react-native-paper';

import { Icon } from 'react-native-elements'

import { Video } from 'expo-av'
import FeatherIcon from "react-native-vector-icons/Feather"
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';
import StepIndicator from 'react-native-step-indicator';
import LupaController from '../../../controller/lupa/LupaController';
import ThinFeatherIcon from "react-native-feather1s";
import { LOG_ERROR } from '../../../common/Logger';
import { Constants } from 'react-native-unimodules';
import { getLupaProgramInformationStructure } from '../../../model/data_structures/programs/program_structures';
import RBSheet from "react-native-raw-bottom-sheet";

const chartConfig = {
    backgroundGradientFrom: "red",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5
};

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

const customStyles = {
    stepIndicatorSize: 22,
    currentStepIndicatorSize: 25,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#2196F3',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#fe7013',
    stepStrokeUnFinishedColor: 'rgb(58,58,60)',
    separatorFinishedColor: '#1089ff',
    separatorUnFinishedColor: 'white',
    stepIndicatorFinishedColor: '#fe7013',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 10,
    currentStepIndicatorLabelFontSize: 10,
    stepIndicatorLabelCurrentColor: '#212121',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#212121',
    labelColor: '#212121',
    labelSize: 10,
    currentStepLabelColor: 'white'
}

const PROGRAM_SECTIONS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
]

function LoadingNextWorkoutActivityIndicator({isVisible}) {
    return (
        <Modal visible={isVisible} presentationStyle="overFullScreen" style={{ alignItems: "center", justifyContent: "center", backgroundColor: "transparent", margin: 0 }} >
            <ActivityIndicator style={{ alignSelf: "center" }} animating={true} color="#03A9F4" size="large" />
        </Modal>
    )
}

function getMiniWorkoutContainerStyle(sectionWorkoutLength) {
    return sectionWorkoutLength > 0 ?
        { alignItems: "center", justifyContent: "center", }
        :
        {}
}

class LiveWorkout extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
        this.interactionsRBSheet = React.createRef()

        this.state = {
            workoutStructure: ['Workout Name', 'Workout Name', 'Workout Name'],
            currentWorkout: {},
            currentWorkoutStructure: [],
            workoutDays: [],
            currentWorkoutDay: "",
            currentDayIndex: 0,
            currentWorkoutIndex: 0,
            playVideo: false,
            contentShowing: false,
            ready: false,
            programData: getLupaProgramInformationStructure(),
            dayMenuVisible: false,
            currentDisplayedMediaURI: "",
        }
    }

    async componentDidMount() {
        await this.setupLiveWorkout()
    }

    setupLiveWorkout = async () => {
        await this.LUPA_CONTROLLER_INSTANCE.getProgramInformationFromUUID(this.props.route.params.uuid).then(data => {
            this.setState({ programData: data})
        })


        await this.loadWorkoutDays()
        await this.loadCurrentDayWorkouts()


       await this.setState({ ready: true })

       alert('This alert makes the loading screen go away.  Fix it.')
    }

    loadWorkoutDays = () => {
      this.setState({ workoutDays: this.state.programData.program_workout_days })
      this.loadCurrentDayWorkouts(this.state.programData.program_workout_days[0])
    }

    loadCurrentDayWorkouts = (day) => {
      switch(day) {
        case 'Monday':
          this.setState({ currentWorkoutDay: 'Monday', currentWorkoutStructure: this.state.programData.program_workout_structure.Monday, currentWorkout: this.state.programData.program_workout_structure.Monday[0] })
          break;
          case 'Tuesday':
            this.setState({ currentWorkoutDay: 'Tuesday', currentWorkoutStructure: this.state.programData.program_workout_structure.Tuesday, currentWorkout: this.state.programData.program_workout_structure.Tuesday[0] })
            break;
            case 'Wednesday':
              this.setState({ currentWorkoutDay: 'Wednesday', currentWorkoutStructure: this.state.programData.program_workout_structure.Wednesday, currentWorkout: this.state.programData.program_workout_structure.Wednesday[0] })
              break;
              case 'Thursday':
                this.setState({ currentWorkoutDay: 'Thursday', currentWorkoutStructure: this.state.programData.program_workout_structure.Thursday, currentWorkout: this.state.programData.program_workout_structure.Thursday[0] })
                break;
                case 'Friday':
                  this.setState({ currentWorkoutDay: 'Friday', currentWorkoutStructure: this.state.programData.program_workout_structure.Friday, currentWorkout: this.state.programData.program_workout_structure.Friday[0] })
                  break;
                  case 'Saturday':
                    this.setState({ currentWorkoutDay: 'Saturday', currentWorkoutStructure: this.state.programData.program_workout_structure.Saturday, currentWorkout: this.state.programData.program_workout_structure.Saturday[0] })
                    break;
                    case 'Sunday':
                      this.setState({ currentWorkoutDay: 'Sunday', currentWorkoutStructure: this.state.programData.program_workout_structurea.Sunday, currentWorkout: this.state.programData.program_workout_structure.Sunday[0] })
                      break;
                      default:
      }
    }

    handleOnChangeWorkout = async (workout) => {
        await this.setState({ currentWorkout: workout, contentShowing: true })
    }

    openDayMenu = () => this.setState({ dayMenuVisible: true })

    closeDayMenu = () => this.setState({ dayMenuVisible: false })

    renderContent = () => {
        const workoutMediaType = this.state.currentWorkout.workout_media.media_type
        switch(workoutMediaType) {
            case 'IMAGE':
                console.log('image')
                return this.getWorkoutImageMedia(this.state.currentWorkout.workout_media.uri);
            case 'VIDEO':
                console.log('video')
                return this.getWorkoutVideoMedia(this.state.currentWorkout.workout_media.uri);
            default:
                return (
                    //In this case render information about the workout
                    <View style={{width: '100%', height: '100%', backgroundColor: 'black'}}>
                        
                    </View>
                )
        }
    }

    getWorkoutVideoMedia = (uri) => {
        try {
            console.log(uri)
                return (
                    <>
                        <Video
                            source={{ uri: uri}}
                            rate={1.0}
                            volume={0}
                            isMuted={true}
                            resizeMode="cover"
                            shouldPlay={this.state.playVideo}
                            isLooping={true}
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                height: '100%',
                            }}
                        >
                              
                        </Video>

                     
                
                    </>
                )
        } catch (err) {
            alert(err)
            return (

                <View style={{ flex: 1, backgroundColor: '#212121', color: 'white', justifyContent: 'center', justifyContent: 'center' }}>
                   <Text>
                   Sorry it looks like something went wrong.  Try loading the workout again to get the video.
                   </Text>
                </View>
            )
        }

    }

    getVideoIcon = () => {
        return this.state.playVideo == true ?
                    <ThinFeatherIcon
        thin={true}
        name="pause-circle"
        size={25}
        color="#FFFFFF"
        onPress={() => this.setState({ playVideo: true })}
        style={{ alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} />
            :
                               <ThinFeatherIcon
                thin={true}
                name="play-circle"
                size={25}
                color="#FFFFFF"
                onPress={() => this.setState({ playVideo: true })}
                style={{ alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}
            />
    }

    renderComponentDisplay = () => {
        if (this.state.ready && typeof(this.state.programData) != 'undefined') {
            return (
                <View style={{ flex: 1, backgroundColor: 'black' }}>
                    {/* First Swiper View */}
                    <View style={{ flex: 1 }}>

                        {/* Content */}
                        <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
                            {this.renderContent()}
                        </View>



                        {/* Video slide Overlay */}
                        <View style={{width: Dimensions.get('window').width, position: 'absolute', top: Dimensions.get('window').height / 2.6}}>
                          <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            shouldRasterizeIOS={true}
                            contentContainerStyle={{justifyContent: 'space-between'}}
                            deaccelerationRate={0}
                            snapToInterval={Dimensions.get('window').width / 5}
                            snapToAlignment={'center'}
                            centerContent
                            >
                            {
                              this.state.currentWorkoutStructure.map((workout, index, arr) => {
                                return (
                                  <TouchableOpacity key={workout.workout_uid} onPress={() => this.handleOnChangeWorkout(workout)} style={{marginHorizontal: 10, }}>
                                  <View style={{alignItems: 'center', justifyContent: 'center',}}>
                                  <Surface key={workout.workout_uid} style={{ backgroundColor: '#212121', elevation: 3, width: Dimensions.get("window").width / 2, height: 100, marginHorizontal: 10, marginVertical: 3, borderRadius: 10, alignItems: "center", justifyContent: "center" }}>
                                  
                                  </Surface>
                                  <Text style={{fontFamily: 'HelveticaNeue-Medium', fontSize: 15, fontWeight: '800', color: 'white', paddingVertical: 10}}>
                                   {workout.workout_name}
                                      </Text>
                                  </View>
                                  </TouchableOpacity>
                                )
                              })
                            }
                          </ScrollView>
                        </View>

                        {/* Overlay on first swiper view */}
                            <View style={{ ...StyleSheet.absoluteFillObject, paddingTop: Constants.statusBarHeight, paddingVertical: 30, justifyContent: 'space-between', flex: 1 }}>
                          {/* Top overlayed options */}
                            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 10, paddingTop: 10 }}>
                            {
                                this.state.playVideo === true ?
                                <Text style={{color: 'white'}}>
                                0:00 / 4:30
                            </Text>
                            :
                            null
                            }
                            <View>
                        
                        </View>

                            </View>
                            <View>


                                <View style={{paddingHorizontal: 10, width: Dimensions.get('window').width, flexDirection: 'row',alignItems: 'center', justifyContent: 'space-between'}}>
                                <TouchableOpacity onPress={this.openDayMenu}>

                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                <Menu
                                onInd
                             visible={this.state.dayMenuVisible}
                             onDismiss={this.closeDayMenu}
                             anchor={
                                 <Text  style={{color: 'white', fontWeight: '600', fontSize: 15, fontFamily: 'Avenir-Roman'}}>
                                   {this.state.currentWorkoutDay}
                                 </Text>
                             }>
                             {
                               this.state.workoutDays.map((day, index, arr) => {
                                 return (
                                   <Menu.Item key={day} onPress={() => this.loadCurrentDayWorkouts(day)} title={day} />
                                 )
                               })
                             }
                           </Menu>


                                <FeatherIcon name="chevron-down" size={15}  color="white"/>
                                </View>
                                </TouchableOpacity>


                                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: 130}}>
                                    {this.getVideoIcon()}


                                    <FeatherIcon
                                        name="more-horizontal"
                                        size={25}
                                        color="white"
                                        onPress={() => this.interactionsRBSheet.current.open()}
                                    />

                                    </View>
                                </View>
                            </View>
                        </View>
                  
                        
                        <SafeAreaView />
                    </View>
                    <LoadingNextWorkoutActivityIndicator isVisible={this.state.loadingNextWorkout} />
            </View>
            )
        }

        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <LoadingNextWorkoutActivityIndicator isVisible={true} />
            </View>
        )
    }

    renderInteractionsBottomSheet = () => {
       return (
        <RBSheet
        ref={this.interactionsRBSheet}
        height={200}
        customStyles={{
          wrapper: {
            backgroundColor: "black",
          },
          draggableIcon: {
            backgroundColor: "transparent"
          }
        }}
      >
    
      </RBSheet>
       )
    }

    render() {
        return (
            <>
            {this.renderComponentDisplay()}
            {this.renderInteractionsBottomSheet()}
            </>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        margin: 0,
        backgroundColor: "#f5f5f5",
        flex: 1
    },
    container: {

    },
    interactionSurface: {
        flex: 1,
        borderRadius: 15, elevation: 0,
        alignItems: "center",
        justifyContent: "center"
    },
    interactionSurfaceText: {
        fontFamily: 'avenir-roman',
        fontSize: 20,

    }
})

export default connect(mapStateToProps)(LiveWorkout);
