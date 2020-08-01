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
    <View style={[{marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%'}]}>
   <View style={{flexDirection: 'row', alignItems: 'center'}}>
   <Surface style={[this.state.isPressed ? styles.pressed : styles.notPressed , styles.videoContainer]}>
          
          </Surface>
          <View style={{paddingHorizontal: 15, flex: 2}}>

            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 20, color: '#212121', fontWeight: '400'}}>
              {this.props.workoutData.workout_name}
          </Text>
          <FeatherIcon name="heart" size={15} />
            </View>
          <Text numberOfLines={1} ellipsizeMode="tail">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi 
          </Text>
          </View>
   </View>
    </View>
</TouchableOpacity>
)
 
            
  
    }
}

const styles = StyleSheet.create({
    videoContainer: {
        backgroundColor: "rgb(58,58,60)",
        borderRadius: 60,
        marginHorizontal: 10,
        width: 60,
        height: 60,
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