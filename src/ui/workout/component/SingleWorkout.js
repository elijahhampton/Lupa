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
    Caption,
} from 'react-native-paper';

import FeatherIcon from "react-native-vector-icons/Feather"
import Feather1s from 'react-native-feather1s/src/Feather1s';


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


   /* handleOnPress = () => {
        
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
    }*/

    render() {
return (
    <View style={[{marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%'}]}>
   <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5}}>
   <View style={{flexDirection: 'row', alignItems: 'flex-start',}}>
   <Surface style={{height: 70, width: 100, backgroundColor: '#212121'}}>
                            <Video source={require('../../videos/pushuppreview.mov')} style={{flex: 1}} shouldPlay={false} resizeMode="cover" />
          </Surface>
    <View style={{paddingHorizontal: 10,}}>
    <Text style={{width: 90,  paddingVertical: 3, fontSize: 15, fontFamily: 'Avenir-Heavy'}}>
              {this.props.workout.workout_name}
          </Text>
          <Text style={{fontFamily: 'Avenir-Light', color: '#1089ff'}}>
              Preview Exercise
          </Text>
    </View>
               
   </View>

   </View>

   

    </View>

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