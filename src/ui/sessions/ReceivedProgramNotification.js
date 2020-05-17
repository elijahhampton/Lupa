import React, { useState } from 'react';

import {
    View,
    Text,
    Dimensions,
} from 'react-native';

import {
    Avatar,
    Button,
} from 'react-native-paper';
import LiveWorkout from '../workout/modal/LiveWorkout';

import { withNavigation } from 'react-navigation';

function ReceivedProgramNotification(props) {
    let [showLiveWorkout, setShowLiveWorkout] = useState(false);

    const fromData = props.fromData;
    const notificationData = props.notification;
    return (
        <View style={{paddingVertical: 10, backgroundColor: '#F2F2F2', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', height: 'auto', width: Dimensions.get('window').width}}>
                       <View style={{width: '70%', flexDirection: 'row', alignItems: 'center'}}>
                       <Avatar.Image source={{uri: props.avatarSrc }} size={40} label="EH" style={{margin: 10}} />
                           <Text style={{flexWrap: 'wrap', width: '100%'}}>
                               <Text style={{fontFamily: 'ARSMaquettePro-Medium', fontSize: 12}}>
                               {fromData.display_name }
                               </Text>
                                <Text>
                                {' '}
                                </Text>
                               <Text style={{fontFamily: 'ARSMaquettePro-Regular', fontSize: 12}}>
                               has invited you to try out their program. Try it now.
                               </Text>
                           </Text>
                       </View>
                       <View style={{width: '20%'}}>
                       <Button mode="text" contentStyle={{width: '100%'}} theme={{
                           colors: {
                               primary: '#212121'
                           }
                       }} onPress={() => props.navigation.push('LiveWorkout', {
                           programOwnerData: notificationData.fromData,
                           programData: notificationData.data,
                       })}>
                            <Text>
                                View
                            </Text>
                       </Button>
                       </View>
                       
                     {/*  <LiveWorkout isVisible={showLiveWorkout} programData={notificationData.data} closeModalMethod={() => setShowLiveWorkout(false)}/> */}
                   </View>
    )
}

export default withNavigation(ReceivedProgramNotification);