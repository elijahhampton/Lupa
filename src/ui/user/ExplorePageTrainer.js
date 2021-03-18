import { useNavigation } from '@react-navigation/core';
import React, { useState } from 'react';

import {
    View,
    TouchableOpacity,
    Text,
    Image
} from 'react-native';

import { Avatar } from 'react-native-elements';
import { useSelector } from 'react-redux/lib/hooks/useSelector';


const ExplorePageTrainer = ({ trainer, openBookingBottomSheet }) => {

    const navigation = useNavigation();

    const LUPA_STATE = useSelector(state => {
        return state;
    })

    const handleBookTrainerOnPress = () => {
        if (LUPA_STATE.Auth.isAuthenticated === false) {
          navigation.navigate('SignUp')
          return;
        }
    
        if (typeof (trainer) == 'undefined') {
          return;
        } else {
          openBookingBottomSheet(trainer)
        }
    }

    return (
        <View style={{alignItems: 'center', marginHorizontal: 10}}>
        <Avatar size={65} rounded key={trainer.user_uuid} source={{ uri: trainer.photo_url }} onPress={handleBookTrainerOnPress} />
<View style={{backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'space-evenly' }}>
             <Text style={{color: 'white', paddingVertical: 3, fontFamily: 'Avenir-Medium', fontSize: 13, }}>
               {trainer.display_name}
             </Text>
         </View>
     </View>
    )
}

export default ExplorePageTrainer;