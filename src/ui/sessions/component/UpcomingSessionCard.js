import React from 'react';

import {
    Image,
    Text,
    View,
    Dimensions,
    Button as NativeButton,
} from 'react-native';

import {
    Surface
} from 'react-native-paper';

import {
    Icon
} from 'react-native-elements';

export default class UpcomingSessionCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sessionData: this.props.sessionDataObject,
            userData: this.props.userDataObject,
        }
    }
    
    getSessionStartTime = () => {
        //let times = this.state.sessionData.time_periods.sort();
        //return times[0];
        return <Text>
            5:00 PM
        </Text>
    }

    getTimeIcon = () => {
       /* if (!this.getSessionStartTime())
        {
            return (
                <Icon
      raised
      name='sun'
      type='feather'
      color='rgba(33,150,243 ,1)'
      reverseColor="white"
      size={6}
      reverse
      onPress={() => console.log('hello')} />
                )
        }

        if (this.getSessionStartTime().charAt(0).toString() < 6)
        {
            return (
            <Icon
  raised
  name='sun'
  type='feather'
  color='rgba(33,150,243 ,1)'
  reverseColor="white"
  size={10}
  reverse
  onPress={() => console.log('hello')} />
            )
        }

        if (this.getSessionStartTime().charAt(0).toString() >=7 )
        {
           return (

           <Icon
            raised
            name='moon'
            type='feather'
            color='#212121'
            reverseColor="white"
            size={10}
            reverse
            onPress={() => console.log('hello')} />
           )
        }
        */

       return (
        <Icon
raised
name='sun'
type='feather'
color='rgba(33,150,243 ,1)'
reverseColor="white"
size={6}
reverse
onPress={() => console.log('hello')} />
        )
    }

    render() {
        return (
            <Surface 
                style={{
                    flexDirection: "row", 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    elevation: 0,  
                    backgroundColor: "transparent", 
                    width: Dimensions.get('window').width - 20, 
                    height: 80, 
                    margin: 15, 
                    borderRadius: 20}}>
                <Surface style={{margin: 10, elevation: 10, width: 45, height: 45, borderRadius: 40}}>
                    <Image  style={{width: 45, height: 45, borderRadius: 45}} source={{uri: this.state.userData.photo_url}} />
                </Surface>
                <Surface style={{elevation: 8, backgroundColor: '#FFFFFF', padding: 20, borderRadius: 10, flex: 1, width: '80%', flexDirection: 'column', alignSelf: 'center', alignItems: 'flex-start', justifyContent: 'center'}}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                    <Text style={{fontWeight: 'bold'}}>
                        {this.state.userData.display_name}
                    </Text>

                    <View style={{backgroundColor: 'transparent', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    {
                        this.getTimeIcon()
                    }
                    
                
                    <Text style={{fontWeight: "bold"}}>
                        5:00 PM
                    </Text>
                    </View>
                </View>
                    <Text style={{fontSize: 12, fontFamily: "avenir-book"}}>
                        Tiger Gym
                    </Text>
                    <Text style={{fontSize: 12, flexWrap: 'wrap'}}>
                    512 Auburn Way
                    </Text>
                </Surface>
            </Surface>
        )
    }
}