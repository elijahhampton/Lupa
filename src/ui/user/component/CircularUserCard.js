import React, { useState } from 'react';

import {
    View,
    Image,
    Dimensions,
    Text,
    TouchableWithoutFeedback,
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
    console.log(props.user)

    const navigation = useNavigation()

    const navigateToProfile = () => {
        navigation.push('Profile', {
            userUUID: props.user.user_uuid,
        })
    }
    
    const renderUserCard = () => {
        return (
            <View style={{width: windowWidth, justifyContent: 'space-between', marginVertical: 10}}>
                <View style={{marginHorizontal: 10}}>
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

               {/* <View style={{marginVertical: 5}}>
                    <Paragraph style={{fontWeight: '400', fontSize: 13}} ellipsizeMode="tail" numberOfLines={2}>
                   {props.user.bio}
                    </Paragraph>
        </View> */}
                </View>

                <View style={{paddingHorizontal: 10, marginVertical: 10, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width}}>
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
        <TouchableWithoutFeedback style={{width: windowWidth}} onPress={navigateToProfile}>
        {renderUserCard()}
        </TouchableWithoutFeedback>
    )
    
}

export default CircularUserCard;