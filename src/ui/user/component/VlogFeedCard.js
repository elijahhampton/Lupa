import React, { useState, useEffect } from 'react'

import {
    View,
    Text,
    StyleSheet,
    Dimensions
} from 'react-native';

import FeatherIcon from 'react-native-vector-icons/Feather'
import { Card, Avatar, Caption } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { getLupaUserStructure } from '../../../controller/firebase/collection_structures';
import LupaController from '../../../controller/lupa/LupaController';

function VlogFeedCard({ vlogData }) {
    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    });

    const [cardContentHeight, setCardContentHeight] = useState(0);
    const [vlogOwnerData, setVlogOwnerData] = useState(getLupaUserStructure());

    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    useEffect(() => {
        LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(vlogData.vlog_owner).then(data => {
            setVlogOwnerData(data);
        });
    }, [])

    return (
        <Card theme={{roundness: 0}} style={{width: Dimensions.get('window').width, borderRadius: 0, elevation: 3, marginBottom: 15}}>
                        <Card.Cover theme={{roundness: 0}} style={{elevation: 0, height: 180, borderRadius: 0}} source={{uri: 'https://picsum.photos/200/'}} />
                        <Avatar.Image source={{uri: vlogOwnerData.photo_url }} size={30} style={{position: 'absolute', bottom: cardContentHeight + 15, right: 0, marginRight: 15}} />
                       
                        <Card.Content style={{backgroundColor: 'rgb(248, 248, 248)'}} onLayout={event => setCardContentHeight(event.nativeEvent.layout.height)}>
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                <Text style={{fontSize: 15, paddingVertical: 5, fontFamily: 'Avenir-Heavy'}}>
                                    {vlogData.vlog_title}
                                </Text>
                                    { currUserData.user_uuid === vlogData.vlog_owner ? <FeatherIcon name="more-horizontal" size={20} color="#212121"  />  : null}
                                </View>
                                
                                
                                <View style={{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end'}}>
                                <Text numberOfLines={2} style={{width: '80%', fontSize: 12, fontFamily: 'Avenir-Light'}}>
                                {vlogData.vlog_text}
                                </Text>
                                
                           {/*  <Text style={{fontFamily: 'Avenir-Roman', fontSize: 12}}>
                                       See more
    </Text> */}
                                </View>
                                <Caption style={{fontFamily: 'Avenir-Light', fontSize: 10}}>
                                    {new Date().getTime() - vlogData.time_created} hour ago
                                </Caption>
                        </Card.Content>
                    </Card>
    )
}

export default VlogFeedCard;