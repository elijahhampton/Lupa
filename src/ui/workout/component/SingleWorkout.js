import React from 'react';

import {
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Image,
    Text,
    View,
} from 'react-native';

import FeatherIcon from "react-native-vector-icons/Feather"


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

    renderImageSource = () => {
        const { workout } = this.props;
        switch(workout.default_media_uri) {
            case '':
                return <Image source={''} />
            case 'Traps':
                return <Image style={{flex: 1, alignSelf: 'center'}} resizeMode="contain" source={require('../../images/buildworkout/singleworkout/Traps.png')} />
            case 'Chest':
                return <Image style={{flex: 1, alignSelf: 'center'}} resizeMode="contain" source={require('../../images/buildworkout/singleworkout/Chest.png')} />
            case 'Bicep':
                return <Image style={{flex: 1, alignSelf: 'center'}} resizeMode="contain"source={require('../../images/buildworkout/singleworkout/Bicep.png')} />
            case 'Calves':
                return <Image style={{flex: 1, alignSelf: 'center'}} resizeMode="contain" source={require('../../images/buildworkout/singleworkout/Calves.png')} />
            case 'Core':
                return <Image style={{flex: 1, alignSelf: 'center'}} resizeMode="contain" source={require('../../images/buildworkout/singleworkout/Core.png')} />
            case 'Glutes':
                return <Image style={{flex: 1, alignSelf: 'center'}} resizeMode="contain" source={require('../../images/buildworkout/singleworkout/Glutes.png')} />
            case 'Supr':
                return <Image style={{flex: 1, alignSelf: 'center'}} resizeMode="contain" source={require('../../images/buildworkout/singleworkout/Supr.png')} />
            case 'Triceps':
                return <Image style={{flex: 1, alignSelf: 'center'}} resizeMode="contain" source={require('../../images/buildworkout/singleworkout/Triceps.png')} />
            case 'Hip':
                return <Image style={{flex: 1, alignSelf: 'center'}} resizeMode="contain" source={require('../../images/buildworkout/singleworkout/Hip.png')} />
            case 'Personal':
                return <Video style={{flex: 1, alignSelf: 'center'}} resizeMode="contain" source={workout.workout_media.uri} />
            default:
                return <Image source={''} />
        }
    }

    render() {
return (
    <View style={styles.container}>
   <View style={styles.contentContainer}>
       <TouchableOpacity onPress={this.props.onPress}>

   <View style={{height: 70, width: 100}}>
   {this.renderImageSource()}
    {
        this.state.showSelectStyle === true ?
        <View style={{backgroundColor: 'rgba(245, 245, 245, 0.8)', alignItems: 'center', justifyContent: 'center', position: 'absolute',  width: '100%', height: '100%', flex: 1, borderRadius: 5}}>
            <FeatherIcon name="check-circle" size={18} color="#1089ff" />
        </View>
        :
        null
    }
    
   
          </View>
          </TouchableOpacity>
          
    <View style={{paddingHorizontal: 10,}}>
    <Text style={{ paddingVertical: 3, fontSize: 15, fontFamily: 'Avenir-Heavy'}}>
              {this.props.workout.workout_name}
          </Text>
    </View>   
   </View>

   
    </View>
)
    }
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10, width: Dimensions.get('window').width, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%'
    },
    contentContainer: {
        flexDirection: 'row',  alignItems: 'center', paddingHorizontal: 5
    },
    selectStyle: {
        borderColor: '#1089ff', shadowColor: '#1089ff',
    },
})

export default SingleWorkout;