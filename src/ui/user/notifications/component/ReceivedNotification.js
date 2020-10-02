import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    View,
    Text,
    Dimensions,
    TouchableWithoutFeedback,
} from 'react-native';

import {
    Avatar,
    Button,
    Appbar,
    Caption,
    Divider,
} from 'react-native-paper';
import LiveWorkout from '../../../workout/modal/LiveWorkout';

const {windowWidth} = Dimensions.get('window').width


function ReceivedNotification({ notificationData }) {

    return (
                   <>
                   <View style={{width: '100%', marginVertical: 15}}>
                       <View style={{width: '80%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
                           <Avatar.Image source={{uri: senderUserData.photo_url}} size={45} style={{marginHorizontal: 10}} />
                           <View>
                               <Text>
                                   {notificationData.data.message}
                               </Text>
                           </View>
                       </View>
                   </View>
                   <Divider />
                   </>
    )
}

export default ReceivedNotification;