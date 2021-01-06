import { useNavigation } from '@react-navigation/native';
import React from 'react';

import {
    View,
    Text,
} from 'react-native';

import {
    Button
} from 'react-native-paper';

import { Avatar } from 'react-native-elements';

const CommunityRoster = ({ trainers }) => {
    const navigation = useNavigation();


    return (
      <View style={{flex: 1}}>
         {
             trainers.map(trainer => {
                 return (
                    <View style={{paddingHorizontal: 20,width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10}}>
                                 
                    <View style={{marginVertical: 10}}>
                      <View style={{alignItems: 'center', flexDirection: 'row'}}>

          
                      <Avatar size={45} source={{uri: trainer.photo_url}} />
          
                     
                      <View style={{paddingHorizontal: 10}}>
                        <Text style={{paddingVertical: 5, fontSize: 12, fontFamily: 'Avenir-Heavy'}}>
                          {trainer.display_name}
                        </Text>
                      </View>
                      </View>
                    </View>

                 
                    <Button 
                    uppercase={false} 
                    mode="text" 
                    color="#1089ff" 
                    onPress={() => navigation.push('Profile', {
                        userUUID: trainer.user_uuid
                    })}>
                        View Client
                    </Button>
                           
                            </View>
                 )
             })
         }
      </View>
    )
}

export default CommunityRoster;