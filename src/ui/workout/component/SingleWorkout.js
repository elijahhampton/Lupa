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

import FeatherIcon from "react-native-vector-icons/Feather"


class SingleWorkout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            workoutData: this.props.workoutData,
            workoutPreviewIsVisible: false,
            pressed: false,
            isPressed: false,
        }

        this.animatedViewRef = React.createRef();
        
    }


handleOnLongPress = () => {
        this.setState({
            workoutPreviewIsVisible: true,
        })
    }

    
    handleSetOriginalPosition = (event) => {
        this.setState({ originalPositionX: event.nativeEvent.layout.x, originalPositionY: event.nativeEvent.layout.y })
    }

    handleOnPress = () => {
        
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

        this.props.captureWorkout(this.state.workoutData)
    }

    render() {
return (
    <TouchableOpacity onPress={this.handleOnPress}>
    <View style={[{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: Dimensions.get('window').width}]}>
   <View style={{flexDirection: 'row', alignItems: 'center'}}>
   <Surface style={[this.state.isPressed ? styles.pressed : styles.notPressed , styles.videoContainer]}>
          
          </Surface>
          <Text style={{marginHorizontal: 20, fontSize: 15, color: '#212121', fontWeight: '500'}}>
              {this.props.workoutData.workout_name}
          </Text>
   </View>

    <View style={{marginRight: 20}} >
    <FeatherIcon name="heart" size={15} />
    </View>
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