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
  
                <Text style={{width: 90, paddingHorizontal: 10, paddingVertical: 3, fontSize: 15, fontFamily: 'Avenir-Heavy'}}>
              {this.props.workout.workout_name}
          </Text>
   </View>
   </View>

   <View style={{alignItems: 'center', justifyContent: 'center', marginHorizontal: 20}}>
        <Feather1s name="plus-square" size={20} />
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