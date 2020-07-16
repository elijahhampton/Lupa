import React, { useState } from 'react';

import {
    View,
    Image,
    Dimensions,
    Text,
    TouchableOpacity,
} from 'react-native';

import {
    Avatar
} from 'react-native-elements';

import {
    Avatar as PaperAvatar,
    Surface,
    Chip,
    Caption,
} from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';

const { windowWidth } = Dimensions.get('window').width

function CircularUserCard(props) {
    const navigation = useNavigation()

    const navigateToProfile = () => {
        navigation.push('Profile', {
            navFrom: 'Packs',
            userUUID: props.user.user_uuid,
        })
    }
    
    const renderUserCard = () => {
        return (
            <View style={{width: windowWidth, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
                <View >
                    {getAvatar()}
                </View>
                <View >
                    <Text style={{fontWeight: '600', color: '#212121'}}>
                        Emily Loefstedt
                    </Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{fontWeight: '600', fontSize: 12}}>
                            5 Programs
                        </Text>
                        <Text>
                            /
                        </Text>
                        <Text style={{fontWeight: '300', fontSize: 12}}>
                        National Association of Sports and Medicine
                    </Text>
                    </View>
                </View>
            </View>
        )
    }

    const getAvatar = () => {
        try {
            return <Avatar source={{uri: props.user.photo_url}} rounded size={45} containerStyle={{margin: 10}} avatarStyle={{borderRadius: 50}} />
        } catch(error) {
            return <PaperAvatar.Text label="UU" size={45} color="#212121"  />
        }
    } 

    return (
        <TouchableOpacity style={{width: Dimensions.get('window').width}} onPress={navigateToProfile}>
        {renderUserCard()}
        </TouchableOpacity>
    )
    
}

export default CircularUserCard;