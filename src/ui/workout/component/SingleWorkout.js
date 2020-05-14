import React, { useState } from 'react';

import { Video } from 'expo-av';

import {
    StyleSheet,
    Button as NativeButton,
    TouchableOpacity,
    Dimensions,
    PanResponder,
    Text,
    Animated,
    View,
} from 'react-native';

import {
    Surface,
} from 'react-native-paper';
import WorkoutPreview from './WorkoutPreview';

import FeatherIcon from "react-native-vector-icons/Feather"

function getViewStyle(state) {
    if (state)
    {
        return {
            position: "absolute", alignItems: "center", justifyContent: "center", width: 80, height: 50, backgroundColor: "rgba(250,250,250 ,0.6)"
        }
    }
    else
    {
        return {
            position: "absolute", alignItems: "center", justifyContent: "center", width: 80, height: 50
        }
    }
}

function getIconStyle(state) {
    if (state)
    {
        return "rgba(33,150,243 ,1)"
    }
    else
    {
        return "rgba(33,150,243 ,0)"
    }
}

let i = 0;

class SingleWorkout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            workoutData: this.props.workoutData,
            workoutPreviewIsVisible: false,
            pressed: false,
            pan: new Animated.ValueXY(),
            workoutToolWidth: this.props.workoutToolWidth,
            workoutToolHeight: this.props.workoutToolHeight,
            workoutYPosition: 0,
            py: 0,
            originalPositionX: 0,
            originalPositionY: 0,

        }

        this.animatedViewRef = React.createRef();
        
    }

    componentDidMount() {
        
    }

    componentWillMount() {
        this._val = { x:0, y:0 }
        this.state.pan.addListener((value) => this._val = value);
    
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderReject: () => {
                alert('p')
            },
            onPanResponderTerminationRequest: () => false,
            onPanResponderGrant: () => {
              this.state.pan.setOffset(this.state.pan.__getValue());
             this.state.pan.setValue({ x: 0, y: 0 });
            },
            onPanResponderRelease: (event, gesture) => {
                if (gesture.moveY > this.props.warmUpListTopY -20
                    && gesture.moveY < this.props.warmUpListTopY+20)
                {
                    this.props.captureWorkout("Warm Up", this.props.workoutData)
                }

                if (gesture.moveY > this.props.primaryListTopY - 40
                    && gesture.moveY < this.props.primaryListTopY+40)
                {
                    this.props.captureWorkout("Primary", this.state.workoutData)
                }

                if (gesture.moveY > this.props.breakListTopY - 40
                    && gesture.moveY < this.props.breakListTopY + 40)
                {
                    this.props.captureWorkout("Break", this.state.workoutData)
                }

                if (gesture.moveY > this.props.secondaryListTopY - 40
                    && gesture.moveY < this.props.secondaryListTopY)
                {
                    this.props.captureWorkout("Secondary", this.state.workoutData)
                }

                if (gesture.moveY > this.props.cooldownListTopY - 60
                    && gesture.moveY < this.props.cooldownListTopY + 60)
                {
                    this.props.captureWorkout("Cooldown", this.state.workoutData)
                }

                if (gesture.moveY > this.props.homeworkListTopY - 40
                    && gesture.moveY < this.props.homeworkListTopY + 40 )
                {
                    this.props.captureWorkout("Homework", this.state.workoutData)
                }
                else
                {
                    Animated.timing(this.state.pan, {
                        toValue: { x: 0, y: 0},
                        duration: 0,
                      }).start();
                }
            },  
            onPanResponderEnd: () => {
                Animated.timing(this.state.pan, {
                    toValue: { x: 0, y: 0},
                    duration: 0,
                  }).start();
            },
            onPanResponderMove: Animated.event([
              null, {
                dx: this.state.pan.x,
                dy: this.state.pan.y

              }
            ], {
                listener: (event, gesture)  => {
                    console.log('listen: ' + gesture.moveY)
                    if (gesture.moveY > this.props.warmUpListTopY -40
                        && gesture.moveY < this.props.warmUpListTopY+40)
                    {
                        console.log('warm up')
                    }

                    if (gesture.moveY > this.props.primaryListTopY - 40
                        && gesture.moveY < this.props.primaryListTopY+40)
                    {
                        console.log('primary')
                    }

                    if (gesture.moveY > this.props.breakListTopY - 40
                        && gesture.moveY < this.props.breakListTopY + 40)
                    {
                        console.log('break')
                    }

                    if (gesture.moveY > this.props.secondaryListTopY - 40
                        && gesture.moveY < this.props.secondaryListTopY)
                    {
                        console.log('sec')
                    }

                    if (gesture.moveY > this.props.cooldownListTopY - 60
                        && gesture.moveY < this.props.cooldownListTopY + 60)
                    {
                        console.log('cooldowm')
                    }

                    if (gesture.moveY > this.props.homeworkListTopY - 40
                        && gesture.moveY < this.props.homeworkListTopY + 40 )
                    {
                        console.log('homework')
                    }
                }
            })
          });
      }

    handlePressed = () => {
        this.setState({
            pressed: !this.state.pressed
        })

        if (this.props.onPress)
        {
            console.log('calling on press for the workout')
            this.props.onPress(this.state.workoutData);
        }
    }
handleOnLongPress = () => {
        this.setState({
            workoutPreviewIsVisible: true,
        })
    }

    
    handleSetOriginalPosition = (event) => {
        console.log('x: ' + this.state.originalPositionX)
        console.log('y: ' + this.state.originalPositionY)
        this.setState({ originalPositionX: event.nativeEvent.layout.x, originalPositionY: event.nativeEvent.layout.y })
    }

    render() {
        const panStyle = {
            transform: this.state.pan.getTranslateTransform()
          }

        return (
                                      <Animated.View
                                      key={() => Math.random()}
                                      ref={this.animatedViewRef}
                    style={panStyle}
          {...this.panResponder.panHandlers}
        >
                <Surface style={styles.videoContainer}>
                    <Video
                        source={{ uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
                        rate={1.0}
                        volume={0}
                        isMuted={true}
                        resizeMode="cover"
                        shouldPlay={false}
                        isLooping={false}
                        style={styles.video}
                    />
    
                    <View style={getViewStyle(this.state.pressed)}>
                        <FeatherIcon name="check" color={getIconStyle(this.state.pressed)} />
                    </View>
                </Surface>
                <Text>
                    {this.props.workoutData.workout_uid}
                </Text>
          {/*  <WorkoutPreview isVisible={this.state.workoutPreviewIsVisible} closeModalMethod={() => this.setState({ workoutPreviewIsVisible: false })}/> */}
            </Animated.View>
            
        );
    }
}

const styles = StyleSheet.create({
    videoContainer: {
        margin: 5,
        backgroundColor: "white",
        borderRadius: 10,
        width: Dimensions.get("window").width / 5,
        height: 50,
        elevation: 3,
        alignItems: "center",
        justifyContent: "center",
    },
    video: {
        width: "100%",
        height: "100%",
        borderRadius: 10
    }
})

export default SingleWorkout;