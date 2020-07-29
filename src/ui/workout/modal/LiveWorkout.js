import * as React from 'react';

import {
    View,
    Text,
    StyleSheet,
    Modal,
    Image,
    SafeAreaView,
    Dimensions,
    TouchableHighlight,
} from 'react-native';

import {
    ActivityIndicator,
    Divider,
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
import { ScrollView } from 'react-native-gesture-handler';

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

        this.state = {
            workoutStructure: ['Workout Name', 'Workout Name', 'Workout Name'],
            currentWorkout: {},
            currentWorkoutStructure: [],
            currentDay: "",
            playVideo: false,
            ready: false,
            programData: undefined
        }
    }

    async componentDidMount() {
        await this.setupLiveWorkout()
    }

    setupLiveWorkout = async () => {
        await this.LUPA_CONTROLLER_INSTANCE.getProgramInformationFromUUID(this.props.route.params.uuid).then(data => {
            this.setState({ programData: data})
        })

       await this.setState({ ready: true })

       alert(this.state.ready)
       
    }

    getWorkoutMedia = () => {
        try {
            if (this.state.currentWorkout.workout_media.media_type == "VIDEO") {
                return (
                    <>
                        <Video
                            source={{ uri: this.state.currentWorkout.workout_media.uri }}
                            rate={1.0}
                            volume={0}
                            isMuted={true}
                            resizeMode="cover"
                            shouldPlay={this.state.playVideo}
                            isLooping={true}
                            style={{
                                width: "100%",
                                height: "100%",
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >


                        </Video>

                    </>
                )
            }
        } catch (err) {
            return (
                <View style={{ flex: 1, backgroundColor: '#212121' }}>

                </View>
            )
        }

    }

    getVideoIcon = () => {
        return this.state.playVideo == true ?
            null
            :
            <ThinFeatherIcon
                thin={true}
                name="play-circle"
                size={65}
                color="#FFFFFF"
                onPress={() => this.setState({ playVideo: true })}
                style={{ alignSelf: 'center' }}
            />
    }

    renderWorkoutNames = () => {
        console.log()
        if (this.state.ready) {
            try {
                this.state.programData && true ?
                this.state.programData.program_workout_data.Monday.map(workout => {
                    return (
                        <Text style={{fontFamily: 'Helvetica-Bold', alignSelf: 'center', width: Dimensions.get('window').width, color: 'white', fontSize: 20}}>
                            {workout.workout_name}
                        </Text>
                    )
                })
                :
                null
            } catch(err) {
                return null
            }
        }

        return null
    }

    renderComponentDisplay = () => {
        if (this.state.ready && typeof(this.state.programData) != 'undefined') {
            return (
                <View style={{ flex: 1, backgroundColor: '#212121' }}>
                <Swiper loop={false} scrollEnabled={false} showsVerticalScrollIndicator={false} showsButtons={false} showsPagination={false} horizontal={false} index={0}>

                    {/* First Swiper View */}
                    <View style={{ flex: 1 }}>
                        <SafeAreaView style={{ backgroundColor: '#212121' }} />
                        {/* Content */}
                        <View style={{ flex: 1, backgroundColor: '#212121' }}>

                        </View>

                        {/* Overlay on first swiper view */}
                        <View style={{ ...StyleSheet.absoluteFillObject, paddingTop: Constants.statusBarHeight, justifyContent: 'space-between', flex: 1 }}>
                            {/* Top overlayed options */}
                            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                                <View style={{ flexDirection: 'row', backgroundColor: '#212121' }}>
                                    <View>
                                        <Text style={{ fontSize: 20, fontFamily: 'Helvetica-Bold', color: 'white', }}>
                                            <Text>
                                                {this.state.programData.program_name}
                                </Text>
                                            <MaterialIcon name="arrow-drop-down" size={20} />
                                        </Text>

                                        <Text style={{ color: 'white', fontFamily: 'Helvetica-Light' }}>
                                            tap to change the program
                                </Text>
                                    </View>

                                </View>
                                <View style={{ backgroundColor: '#212121' }}>
                                    <Text style={{ alignSelf: 'center', fontSize: 20, fontFamily: 'Helvetica-Bold', color: 'white', }}>
                                        <Text>
                                            Current Day
                                </Text>
                                        <MaterialIcon name="arrow-drop-down" size={20} />
                                    </Text>

                                </View>

                            </View>
                            <View>
                                <Divider style={{width: Dimensions.get('window').width, backgroundColor: '#FFFFFF', width: '90%', alignSelf: 'center'}} />
                                <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', backgroundColor: '#212121', marginVertical: 10 }}>
                                    
                                    <Icon
                                        reverse
                                        name='info'
                                        type='feather'
                                        color='rgba(0,0,0,0.2)'
                                        size={20}
                                        style={{ elevation: 10 }}
                                    />

                                    <Icon
                                        reverse
                                        name='message-circle'
                                        type='feather'
                                        color='rgba(0,0,0,0.2)'
                                        size={20}
                                        style={{ elevation: 10 }}
                                    />


                                    <Icon
                                        reverse
                                        name='x'
                                        type='feather'
                                        color='rgba(0,0,0,0.2)'
                                        size={20}
                                        style={{ elevation: 10 }}
                                    />

                                </View>

                                <View style={{width: Dimensions.get('window').width}}>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} shouldRasterizeIOS={true} centerContent contentContainerStyle={{ marginVertical: 10, alignItems: 'center', justifyContent: 'center'}} decelerationRate={0} snapToAlignment='center' snapToInterval={Dimensions.get('window').width}>
                                        {
                                            this.renderWorkoutNames()
                                        }
                                    </ScrollView>
                                </View>
                            </View>
                        </View>
                        <SafeAreaView />
                    </View>
                    {/* End First Swiper View */}
                    <LoadingNextWorkoutActivityIndicator isVisible={this.state.loadingNextWorkout} />
                </Swiper>
                <SafeAreaView style={{ backgroundColor: '#212121' }} />
            </View>
            )
        }

        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <LoadingNextWorkoutActivityIndicator isVisible={true} />
            </View>
        )
    }

    render() {
        return (
            <>
            {this.renderComponentDisplay()}
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