import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    View,
    Text,
    Dimensions,
} from 'react-native';

import {
    Avatar,
    Button,
} from 'react-native-paper';
import LiveWorkout from '../../../workout/modal/LiveWorkout';

import { withNavigation } from 'react-navigation';

import Swipeout from 'react-native-swipeout';
import ProgramInformationPreview from '../../../workout/program/ProgramInformationPreview';

var swipeoutBtns = [
    {
      text: 'Delete',
    },
    {
      text: 'Swipe'
    },
  ]

function ReceivedProgramNotification(props) {
    let [showLiveWorkout, setShowLiveWorkout] = useState(false);
    let [programModalVisible, setProgramModalVisible] = useState(false);

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

    const fromData = props.fromData;
    const notificationData = props.notification;

    const handleOnPress = () => {

        if (notificationData.data.program_participants.includes(currUserData.user_uuid))
        {
           props.navigation.push('LiveWorkout', {
                           programOwnerData: notificationData.fromData,
                           programData: notificationData.data,
                       })
        }
        else
        {
            setProgramModalVisible(true)
        }
    }

    return (
        <View style={{paddingVertical: 10, backgroundColor: '#F2F2F2', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', height: 'auto', width: Dimensions.get('window').width}}>
                       <View style={{width: '60%', flexDirection: 'row', alignItems: 'center'}}>
                       <Avatar.Image source={{uri: props.avatarSrc }} size={40} label="EH" style={{margin: 10}} />
                           <Text style={{flexWrap: 'wrap', width: '100%'}}>
                               <Text style={{fontFamily: 'ARSMaquettePro-Medium', fontSize: 12}}>
                               {fromData.display_name }
                               </Text>
                                <Text>
                                {' '}
                                </Text>
                               <Text style={{fontFamily: 'ARSMaquettePro-Regular', fontSize: 12}}>
                               has invited you to try out the program <Text style={{fontFamily: 'ARSMaquettePro-Bold', fontWeight: '600'}}>
                                   {notificationData.data.program_name}</Text>
                               </Text>
                           </Text>
                       </View>
                       <View style={{width: '20%', justifyContent: 'flex-end'}}>
                       <Button mode="text" contentStyle={{width: '100%'}} theme={{
                           colors: {
                               primary: '#212121'
                           }
                       }} onPress={() => handleOnPress()}>
                            <Text>
                                View
                            </Text>
                       </Button>
                       </View>
                       <ProgramInformationPreview isVisible={programModalVisible} programData={notificationData.data} closeModalMethod={() => setProgramModalVisible(false)} />
                   </View>
    )
}

export default withNavigation(ReceivedProgramNotification);