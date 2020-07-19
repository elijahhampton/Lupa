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
    Button,
    Paragraph,
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
            <View style={{height: 200, width: windowWidth, justifyContent: 'space-evenly', padding: 20}}>
                <View style={{marginVertical: 5, justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View>
                    {getAvatar()}
                </View>

                <View style={{marginHorizontal: 15}}>
                <Text style={{fontWeight: '600', color: '#1089ff'}}>
                        {props.user.display_name}
                    </Text>
                    <Text style={{fontWeight: '600', color: '#212121'}}>
                        {props.user.location.city + ", " + props.user.location.state}
                    </Text>
                    <Text style={{fontWeight: '300', fontSize: 12}}>
                        National Association of Sports Medicine
                    </Text>
                </View>
                    </View>
                </View>

                <View style={{marginVertical: 5}}>
                    <Paragraph style={{fontWeight: '400', fontSize: 13}} ellipsizeMode="tail" numberOfLines={2}>
                   {props.user.bio}
                    </Paragraph>
                </View>

                <View style={{justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', width: '100%'}}>
                <Text style={{color: '#404f5e'}}>
                    5 Programs Available
                </Text>

                <Text style={{color: '#1089ff', fontWeight: '500'}}>
                    See more
                </Text>
                </View>
            </View>
        )
    }

    const getAvatar = () => {
        try {
            return <Avatar source={{uri: props.user.photo_url}} rounded size={45} containerStyle={{}} avatarStyle={{borderRadius: 50}} />
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