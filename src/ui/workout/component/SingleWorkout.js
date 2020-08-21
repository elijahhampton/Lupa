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
            isPressed: false,
        }

        this.animatedViewRef = React.createRef();
        
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return true;
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

        this.props.captureWorkout(this.props.workout);
    }

    render() {
return (
    <TouchableOpacity onPress={this.handleOnPress}>
    <View style={[{marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%'}]}>
   <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5}}>
   <Surface style={[this.state.isPressed ? styles.pressed : styles.notPressed , styles.videoContainer]}>
   <Surface style={{alignItems: 'center', justifyContent: 'center', position: 'absolute', backgroundColor: this.state.isPressed === true ? '#e53935' : '#1089ff' ,top: 0, right: 0, margin: 0, borderRadius: 20, width: 20, height: 20}}>
    <FeatherIcon name={this.state.isPressed === true ? "minus" : "plus"} color="white" />
</Surface>
          </Surface>
          <View style={{paddingHorizontal: 5, flex: 2}}>
                <View>
                <Text style={{paddingVertical: 3, fontSize: 18, color: '#212121', fontWeight: '400'}}>
              {this.props.workout.workout_name}
          </Text>
        
          <Text style={{fontSize: 12}} numberOfLines={2} ellipsizeMode="tail">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi 
          </Text>
                </View>
           
           
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