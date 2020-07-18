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
            <View style={{width: windowWidth, alignItems: 'flex-start', justifyContent: 'flex-start', padding: 20}}>
                <View style={{justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View >
                    {getAvatar()}
                </View>

                <View style={{marginHorizontal: 10}}>
                <Text style={{fontWeight: '600', color: '#212121'}}>
                        Emily Loefstedt
                    </Text>
                    <Text style={{fontWeight: '300', fontSize: 12}}>
                        National Association of Sports and Medicine
                    </Text>
                </View>
                    </View>
                </View>

                <View style={{paddingTop: 20}}>
                    <Paragraph style={{fontWeight: '400', fontSize: 13}} numberOfLines={3}>
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur
                    </Paragraph>
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