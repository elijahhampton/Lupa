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
            showSelectStyle: false
        }

        this.animatedViewRef = React.createRef();
        
    }

    static getDerivedStateFromProps = (props, state) => {
        return {
            showSelectStyle: props.showSelectStyle
        }
    }

    render() {
return (
    <>
    <View style={[{marginVertical: 10, width: Dimensions.get('window').width, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%'}]}>
    
   <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5}}>
   <View style={{flexDirection: 'row', alignItems: 'flex-start',}}>
       <TouchableOpacity onPress={this.props.onPress}>

   <Surface style={{borderWidth: 1, height: 70, width: 100, backgroundColor: '#212121'}}>
    <Video source={require('../../videos/pushuppreview.mov')} style={{flex: 1}} shouldPlay={false} resizeMode="cover" />
    {
        this.state.showSelectStyle === true ?
        <View style={{position: 'absolute',  width: '100%', height: '100%', flex: 1, backgroundColor: 'rgba(225, 120, 205, 0.5)'}}  />
        :
        null
    }
   
          </Surface>
          </TouchableOpacity>
    <View style={{paddingHorizontal: 10,}}>
    <Text style={{ paddingVertical: 3, fontSize: 15, fontFamily: 'Avenir-Heavy'}}>
              {this.props.workout.workout_name}
          </Text>
    </View>   
   </View>
   </View>

   
    </View>
    </>
)
 
            
  
    }
}

const styles = StyleSheet.create({
    selectStyle: {
        borderColor: '#1089ff', shadowColor: '#1089ff',
    },
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