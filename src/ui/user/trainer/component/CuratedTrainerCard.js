import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native';

import {
    Surface,
    Avatar,
    Chip,
    Button
} from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize'
import { useNavigation } from '@react-navigation/native';

function CuratedTrainerCard({ trainer }) {
    const navigation = useNavigation();

    return (
        <View style={{width: Dimensions.get('window').width, alignItems: 'center', justifyContent: 'center', alignSelf: 'center'}}>
        <Surface style={{padding: 10, justifyContent: 'space-evenly', borderRadius: 12, width: Dimensions.get('window').width / 1.3, height: '65%'}}>
                                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                    <Avatar.Image style={{marginHorizontal: 10}} source={{uri: trainer.photo_url }} size={40} />
                                    <View>
                                        <Text style={{fontSize: 12, fontFamily: "Avenir-Light"}}>
                                            {trainer.display_name}
                                        </Text>
                                        <Text style={{fontSize: 12, fontFamily: "Avenir-Light"}}>
                                            {trainer.location.city + ", " + trainer.location.state}
                                        </Text>
                                    </View>
                                    </View>
                                    
                                    <Chip mode="outlined" style={{borderColor: '#1089ff'}} textStyle={{color: '#1089ff'}}>
                                        NASM
                                    </Chip>
                                    </View>
                                    
                                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                                        <Text style={{fontSize: RFValue(15), paddingVertical: 5, fontFamily: 'Avenir-Medium'}}>
                                            12 Week Resistance Training
                                        </Text>
                                    </View>

                                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                        <Text>
                                            <Text style={{fontFamily: 'Avenir-Heavy'}}>
                                                {trainer.programs.length}{" "}
                                            </Text>
                                            <Text style={{fontFamily: 'Avenir-Heavy', color: 'rgb(187, 198, 207)'}}>
                                                 Programs
                                            </Text>
                                        </Text>

                                        <View style={{width: 120, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                                            <Button onPress={() => navigation.navigate('Profile', {
                                                userUUID: trainer.user_uuid
                                            })} color="#1089ff" mode="contained" theme={{roundness: 3}} style={{elevation: 8, shadowColor: '#1089ff'}}>
                                                View
                                            </Button>
                                        </View>
                                    </View>
                                </Surface> 
                                </View>
    )
}

export default CuratedTrainerCard;