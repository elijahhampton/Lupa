import React, { useState } from 'react';

import { Video } from 'expo-av';

import {
    StyleSheet,
    Button as NativeButton,
    TouchableOpacity,
    Dimensions,
    View,
} from 'react-native';

import {
    Surface,
} from 'react-native-paper';
import WorkoutPreview from './WorkoutPreview';

import { Feather as FeatherIcon } from '@expo/vector-icons';

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

class SingleWorkout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            workoutData: this.props.workoutData,
            workoutPreviewIsVisible: false,
            pressed: false,
        }
        
    }

    handlePressed() {
        this.setState({
            pressed: !this.state.pressed
        })

        if (this.props.onPress)
        {
            console.log('calling on press for the workout')
            this.props.onPress(this.state.workoutData);
        }
    }

    handleOnLongPress() {
        this.setState({
            workoutPreviewIsVisible: true,
        })
    }

    render() {
        return (
            <>
            <TouchableOpacity onPress={() => this.handlePressed()} onLongPress={() => this.handleOnLongPress()}>
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
            </TouchableOpacity>
            <WorkoutPreview isVisible={this.state.workoutPreviewIsVisible} closeModalMethod={() => this.setState({ workoutPreviewIsVisible: false })}/>
            </>
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