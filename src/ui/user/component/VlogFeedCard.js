import React, { useState, useEffect } from 'react'

import {
    View,
    Text,
    Dimensions
} from 'react-native';

import { Card, Caption, Menu, Chip } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { getLupaUserStructure } from '../../../controller/firebase/collection_structures';
import LupaController from '../../../controller/lupa/LupaController';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import { Avatar } from 'react-native-elements'
import { Video } from 'expo-av';
import LiveWorkoutFullScreenContentModal from '../../workout/modal/LiveWorkoutFullScreenContentModal';
import DoubleClick from 'react-native-double-tap';

function formatDateString(dateString) {
    const stringKeys = dateString.split(" ");
    let updatedString = stringKeys[1] + " " + stringKeys[2] + " " + stringKeys[3]
    return updatedString;
}

function VlogFeedCard({ vlogData }) {
    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    });

    const [cardContentHeight, setCardContentHeight] = useState(0);
    const [vlogOwnerData, setVlogOwnerData] = useState(getLupaUserStructure());
    const [optionsMenuVisible, setOptionsMenuVisible] = useState(false);
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    const [shouldPlay, setShouldPlay] = useState(false);
    const [isMuted, setMuted] = useState(false);
    const [showFullScreenContent, setFullScreenContentVisible] = useState(false);

    useEffect(() => {
        LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(vlogData.vlog_owner).then(data => {
            setVlogOwnerData(data);
        });
    }, []);

    const renderVlogMedia = () => {
        if (typeof(vlogData.vlog_media.uri) == 'undefined' || vlogData.vlog_media.uri == "") {
            return null;
        };

        return (
            <>
            <Video useNativeControls={false} isMuted={isMuted} isLooping={false} resizeMode="contain" style={{ marginVertical: 0, height: 300, width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 0 }} source={{ uri: vlogData.vlog_media.uri }} shouldPlay={shouldPlay} />
                <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingHorizontal: 10, position: 'absolute', bottom: cardContentHeight + 15, right: 0, }}>
                    <View style={{ backgroundColor: 'rgba(142, 142, 147, 0.5)', borderWidth: 1, borderColor: 'white', borderRadius: 0 }}>
                        <Feather1s onPress={() => setMuted(!isMuted)} color="white" name={isMuted === true ? 'volume-x' : 'volume-2'} size={20} style={{ backgroundColor: 'transparent', padding: 5 }} />
                    </View>
                </View>
                </>
        )
    }

    return (
        <DoubleClick singleTap={() => setShouldPlay(!shouldPlay)} doubleTap={() => setFullScreenContentVisible(true)}>
            <Card style={{ backgroundColor: '#EEEEEE', marginVertical: 0, alignSelf: 'center', width: Dimensions.get('window').width - 0, borderRadius: 0, elevation: 0 }}>
                <Card.Content>
                    <View style={{ width: '100%', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Avatar containerStyle={{ borderWidth: 1.5, borderColor: 'white', }} rounded source={{ uri: vlogOwnerData.photo_url }} size={40} />
                            <View style={{ paddingHorizontal: 10 }}>
                                <Text style={{ fontFamily: 'Avenir-Medium' }}>
                                    {vlogOwnerData.display_name}
                                </Text>
                                <Caption style={{ fontFamily: 'Avenir-Light', fontSize: 10 }}>
                                    {formatDateString(new Date(vlogData.time_created).toString())}
                                </Caption>
                            </View>
                        </View>
                        <Menu
                            visible={optionsMenuVisible}
                            onDismiss={() => setOptionsMenuVisible(false)}
                            anchor={<Feather1s onPress={() => setOptionsMenuVisible(true)} name="more-vertical" size={20} color="#212121" />}>
                            <Menu.Item title="Delete Vlog" onPress={() => LUPA_CONTROLLER_INSTANCE.deleteVlog(currUserData.user_uuid, vlogData.vlog_uuid)} />
                        </Menu>
                    </View>
                </Card.Content>
                {renderVlogMedia()}
                <Card.Content style={{ paddingVertical: 10, justifyContent: 'center', backgroundColor: '#EEEEEE', borderRadius: 0 }} onLayout={event => setCardContentHeight(event.nativeEvent.layout.height)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 15, fontFamily: 'Avenir-Medium' }}>
                            {vlogData.vlog_title}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                        <Text numberOfLines={2} style={{ width: '100%', fontSize: 15, fontFamily: 'Avenir-Light' }}>
                            {vlogData.vlog_text}
                        </Text>
                    </View>
                </Card.Content>
                <LiveWorkoutFullScreenContentModal isVisible={showFullScreenContent} closeModal={() => setFullScreenContentVisible(false)} contentType={vlogData.vlog_media.media_type} contentURI={vlogData.vlog_media.uri} />
            </Card>
        </DoubleClick>
    )
}

export default VlogFeedCard;