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
import { TouchableHighlight } from 'react-native-gesture-handler';

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
            warmUpListTopY: this.props.warmUpListTopY,
            primaryListTopY: this.props.primaryListTopY,
            breakListTopY: this.props.breakListTopY,
            secondaryListTopY: this.props.secondaryListTopY,
            cooldownListTopY: this.props.cooldownListTopY,
            homeworkListTopY: this.props.homeworkListTopY,
            isPressed: false,
        }

        this.animatedViewRef = React.createRef();
        
    }

   static currWorkoutPressed;

    async componentWillUpdate(nextProps, nextState) {
        if (nextProps.warmUpListTopY != this.state.warmUpListTopY) {
        
          await this.setState({
              warmUpListTopY: nextProps.warmUpListTopY
          })
     
        }

        if (nextProps.primaryListTopY != this.state.primaryListTopY) {
            await this.setState({
                primaryListTopY: nextProps.primaryListTopY
            })
          }

          if (nextProps.breakListTopY != this.state.breakListTopY) {
            await this.setState({
                breakListTopY: nextProps.breakListTopY
            })
          }

          if (nextProps.secondaryListTopY!= this.state.secondaryListTopY) {
            await this.setState({
                secondaryListTopY: nextProps.secondaryListTopY
            })
          }

          if (nextProps.cooldownListTopY != this.state.cooldownListTopY) {
            await this.setState({
                cooldownListTopY: nextProps.cooldownListTopY
            })
          }

          if (nextProps.homeworkListTopY != this.state.homeworkListTopY) {
            await this.setState({
                homeworkListTopY: nextProps.homeworkListTopY
            })
          }
    }

      shouldComponentUpdate(nextProps, nextState) {
         return true;
      }

    componentWillMount() {
        this._val = { x:0, y:0 }
        this.state.pan.addListener((value) => this._val = value);
    
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderReject: () => {
             
            },
            onPanResponderTerminationRequest: () => false,
            onPanResponderGrant: () => {
              this.state.pan.setOffset(this.state.pan.__getValue());
             this.state.pan.setValue({ x: 0, y: 0 });
            },
            onPanResponderRelease: (event, gesture) => {
                if (gesture.moveY > 0
                    && gesture.moveY <  this.state.warmUpListTopY)
                {
                   
                   this.props.captureWorkout("Warm Up", this.props.workoutData)
                }

                    if (gesture.moveY > this.state.warmUpListTopY
                        && gesture.moveY < this.state.primaryListTopY)
                    {
                        this.props.captureWorkout("Primary", this.state.workoutData)
                    }

                    if (gesture.moveY > this.state.primaryListTopY
                        && gesture.moveY < this.state.breakListTopY)
                    {
                        this.props.captureWorkout("Break", this.state.workoutData)
                    }

                    if (gesture.moveY > this.state.primaryListTopY
                        && gesture.moveY < this.state.secondaryListTopY)
                    {
             
                        this.props.captureWorkout("Secondary", this.state.workoutData)
                    }

                    if (gesture.moveY > this.state.secondaryListTopY
                        && gesture.moveY < this.state.cooldownListTopY)
                    {
                        this.props.captureWorkout("Cooldown", this.state.workoutData)
                    }

                    if (gesture.moveY > this.state.cooldownListTopY
                        && gesture.moveY < this.state.homeworkListTopY)
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
                  // console.log('listen: ' + gesture.moveY)
                   console.log('aaa: ' + this.state.secondaryListTopY)
                    if (gesture.moveY > 0
                    && gesture.moveY <  this.props.warmUpListTopY)
                {
                   // console.log('dsfsdsdfs: ' + Dimensions.get('window').height + (0+20))
                   // this.props.captureWorkout("Warm Up", this.props.workoutData)
                }

                    if (gesture.moveY > this.props.warmUpListTopY
                        && gesture.moveY < this.props.primaryListTopY)
                    {
                        //console.log('BAAAAAAAAAABY')
                    }

                    if (gesture.moveY > this.props.primaryListTopY
                        && gesture.moveY < this.props.breakListTopY)
                    {
                       // console.log('CRAAAAAAZT')
                    }

                    if (gesture.moveY > this.props.primaryListTopY
                        && gesture.moveY < this.props.secondaryListTopY)
                    {
                       // console.log('sec')
                    }

                    if (gesture.moveY > this.props.secondaryListTopY
                        && gesture.moveY < this.props.cooldownListTopY)
                    {
                       // console.log('cooldowm')
                    }

                    if (gesture.moveY > this.props.cooldownListTopY
                        && gesture.moveY < this.props.homeworkListTopY)
                    {
                       // console.log('homework')
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
        this.setState({ originalPositionX: event.nativeEvent.layout.x, originalPositionY: event.nativeEvent.layout.y })
    }

    handleWorkoutOnPress = () => {
        
        if (this.state.isPressed)
        {

            this.setState({
                isPressed: false
            })
        }
        else
        {
            this.setState({
                isPressed: true
            })
        }

        this.props.captureNonPopulatedWorkout(this.state.workoutData)
    }

    render() {
return (
    <TouchableOpacity onPress={this.handleWorkoutOnPress}>
    <View style={[{alignItems: 'center'}]}>
    <Surface style={[this.state.isPressed ? styles.pressed : styles.notPressed , styles.videoContainer]}>
          
        </Surface>
        <Text style={{fontSize: 10, color: 'white'}}>
            {this.props.workoutData.workout_name}
        </Text>
    </View>
</TouchableOpacity>
)
 
            
  
    }
}

const styles = StyleSheet.create({
    videoContainer: {
        margin: 5,
        backgroundColor: "rgb(58,58,60)",
        borderRadius: 10,
        width: Dimensions.get("window").width / 5,
        height: 50,
        elevation: 3,
        alignItems: "center",
        justifyContent: "center",
    },
    pressed: {
        borderColor: '#FFFFFF',
        borderWidth: 0.5,
    },
    notPressed: {
        borderColor: '#212121',
        borderWidth: 0.5,
    }
})

export default SingleWorkout;