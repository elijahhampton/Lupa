import React, { useState, useEffect } from 'react'

import {
    View,
    Text,
    Dimensions,
    TouchableOpacity,
} from 'react-native';

<<<<<<< HEAD
import { Card, Caption, Surface, Menu, Chip, Divider } from 'react-native-paper';
=======
import { Card, Caption, Menu, Chip, Surface } from 'react-native-paper';
>>>>>>> mvp-runthrough-3
import { useSelector } from 'react-redux';
import { Avatar } from 'react-native-elements';
import { getLupaUserStructure } from '../../../controller/firebase/collection_structures';
import LupaController from '../../../controller/lupa/LupaController';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import { Video } from 'expo-av';
import LiveWorkoutFullScreenContentModal from '../../workout/modal/LiveWorkoutFullScreenContentModal';
import DoubleClick from 'react-native-double-tap';
<<<<<<< HEAD
import { TouchableOpacity } from 'react-native-gesture-handler';
import FeatherIcon from 'react-native-vector-icons/Feather'
=======

import FeatherIcon from 'react-native-vector-icons/Feather'

>>>>>>> mvp-runthrough-3
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
            <Surface style={{elevation: 15, borderRadius: 10, width: Dimensions.get('window').width - 20, height: 200, alignSelf: 'center'}}>
            <Video useNativeControls={false} isMuted={isMuted} isLooping={false} resizeMode="stretch" style={{ marginVertical: 0,  width: '100%', height: '100%', alignSelf: 'center', borderRadius: 10 }} source={{ uri: vlogData.vlog_media.uri }} shouldPlay={shouldPlay} />
            </Surface>
        )
    }

    return (
        <TouchableOpacity onPress={() => setFullScreenContentVisible(true)}>
              <Divider style={{width: '100%', height: 0.5,  backgroundColor: 'rgb(174, 174, 178)',}} />
                <Card style={{ marginVertical: 10, backgroundColor: '#FFFFFF',  alignSelf: 'center', width: Dimensions.get('window').width - 0, borderRadius: 0, elevation: 0}}>
            
           
            {renderVlogMedia()}

            <Card.Content style={{paddingVertical: 10, justifyContent: 'center', backgroundColor: '#FFFFFF', borderRadius: 0 }} onLayout={event => setCardContentHeight(event.nativeEvent.layout.height)}>
                    <View style={{width: '100%' }}>
                        <Text style={{ fontSize: 15, fontFamily: 'HelveticaNeue', fontWeight: '500' , paddingVertical: 3,}}>
                            {vlogData.vlog_title}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                        <Text numberOfLines={2} style={{ width: '100%', fontSize: 15, fontWeight: '300', fontFamily: 'HelveticaNeue' }}>
                            {vlogData.vlog_text}
                        </Text>
                    </View>
                </Card.Content>
         
                <Card.Content>
                    <View style={{paddingVertical: 10, width: '100%', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 3 }}>
                            <Avatar rounded  containerStyle={{borderWidth: 1, borderColor: '#EEEEEE'}} source={{ uri: vlogOwnerData.photo_url }} size={45} />
                            <View style={{ paddingHorizontal: 10 }}>
                                <View style={{width: '70%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                <Text style={{ fontFamily: 'Avenir-Medium' }}>
                                    {vlogOwnerData.display_name}
                                </Text>

                                <Menu
                            visible={optionsMenuVisible}
                            onDismiss={() => setOptionsMenuVisible(false)}
                            anchor={<FeatherIcon onPress={() => setOptionsMenuVisible(true)} name="more-horizontal" size={18} color="#212121" style={{ padding: 8}} />}>
                            <Menu.Item title="Delete Vlog" onPress={() => LUPA_CONTROLLER_INSTANCE.deleteVlog(currUserData.user_uuid, vlogData.vlog_uuid)} />
                        </Menu>
                                </View>
                                
                                <Text style={{ fontFamily: 'Avenir-Medium', fontSize: 12, color: '#1089ff' }}>
                                    TRAINER
                                </Text>
                            </View>
                        </View>
                       
                    </View>
                </Card.Content>
<<<<<<< HEAD
      
               
                <LiveWorkoutFullScreenContentModal isVisible={showFullScreenContent} closeModal={() => setFullScreenContentVisible(false)} contentType={vlogData.vlog_media.media_type} contentURI={vlogData.vlog_media.uri} />
            </Card>
        </TouchableOpacity>

=======
           
                <Card.Content style={{justifyContent: 'center', backgroundColor: '#FFFFFF', borderRadius: 0 }} onLayout={event => setCardContentHeight(event.nativeEvent.layout.height)}>
                    <View style={{width: '100%' }}>
                        <Text style={{ fontSize: 15, fontFamily: 'Avenir-Heavy',}}>
                            {vlogData.vlog_title}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                        <Text numberOfLines={2} style={{ width: '100%', fontSize: 15, fontFamily: 'Avenir-Roman' }}>
                            {vlogData.vlog_text}
                        </Text>
                    </View>
                </Card.Content>

                {renderVlogMedia()}
                <LiveWorkoutFullScreenContentModal isVisible={showFullScreenContent} closeModal={() => setFullScreenContentVisible(false)} vlogData={vlogData} />
            </Card>
            </TouchableOpacity>
>>>>>>> mvp-runthrough-3
    )
}

export default VlogFeedCard;