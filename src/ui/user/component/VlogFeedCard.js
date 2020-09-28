import React, { useState, useEffect } from 'react'

import {
    View,
    Text,
    Dimensions,
    TouchableOpacity,
} from 'react-native';

import { Avatar, Card, Caption, Surface, Menu, Chip, Divider } from 'react-native-paper';
import { useSelector } from 'react-redux';

import { getLupaUserStructure } from '../../../controller/firebase/collection_structures';
import LupaController from '../../../controller/lupa/LupaController';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import { Video } from 'expo-av';
import LiveWorkoutFullScreenContentModal from '../../workout/modal/LiveWorkoutFullScreenContentModal';
import DoubleClick from 'react-native-double-tap';
import FeatherIcon from 'react-native-vector-icons/Feather'
import { NavigationContainer, useNavigation } from '@react-navigation/native';

function VlogFeedCard({ vlogData, showTopDivider }) {
    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    });

    const navigation = useNavigation();

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
        try {
            if (typeof(vlogData) == 'undefined' || typeof(vlogData.vlog_media.uri) == 'undefined' || vlogData.vlog_media.uri == "") {
                return null;
            };
    
            return (
                <Surface style={{elevation: 0, borderRadius: 10, width: Dimensions.get('window').width, height: 350, alignSelf: 'center'}}>
                <Video useNativeControls={false} isMuted={isMuted} isLooping={false} resizeMode="stretch" style={{ marginVertical: 0,  width: '100%', height: '100%', alignSelf: 'center' }} source={{ uri: vlogData.vlog_media.uri }} shouldPlay={shouldPlay} />
                </Surface>
            )
        } catch(error) {
            return null;
        }
    }

    return (
        <TouchableOpacity style={{width: '100%'}} onPress={() => setFullScreenContentVisible(true)}>
       {showTopDivider === true ? <Divider style={{width: '100%', height: 7,  backgroundColor: '#EEEEEE',}} /> : null } 
      
        <Card style={{ paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center', marginVertical: 15,   width: '100%', borderRadius: 0, elevation: 0}}>

        <View style={{ width: Dimensions.get('window').width}}>
     


        <View style={{paddingHorizontal: 10, paddingVertical: 10, width: '100%',flexDirection: 'row',  alignItems: 'center', justifyContent: 'space-between'}}>
        <View style={{  flexDirection: 'row', alignItems: 'center',  }}>
        <TouchableOpacity onPress={() => navigation.push('Profile', {
            userUUID: vlogData.vlog_owner
        })}>
        <Avatar.Image containerStyle={{borderWidth: 1, borderColor: '#EEEEEE'}} source={{ uri: vlogOwnerData.photo_url }} size={35} />
        </TouchableOpacity>
       
        <View style={{marginHorizontal: 10}}>
        <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                <Text style={{ fontFamily: 'Avenir-Medium', fontSize: 16 }}>
                                    {vlogOwnerData.display_name}
                                </Text>
                                </View>
                                {
                                    currUserData.isTrainer === true ?
                                    <Text style={{ fontFamily: 'Avenir-Medium', fontSize: 14, color: '#1089ff' }}>
                                    Trainer
                                </Text>
                                    :
                                    null
                                }
        </View>
        </View>



        <Menu
                            visible={optionsMenuVisible}
                            onDismiss={() => setOptionsMenuVisible(false)}
                            anchor={<FeatherIcon onPress={() => setOptionsMenuVisible(true)} name="more-vertical" size={18} color="#212121" />}>
                            <Menu.Item title="Delete Vlog" onPress={() => LUPA_CONTROLLER_INSTANCE.deleteVlog(currUserData.user_uuid, vlogData.vlog_uuid)} />
                        </Menu>
        </View>

        <View style={{paddingHorizontal: 10, paddingVertical: 5, width: '100%', }}>
                        <Text style={{ fontSize: 15,  fontWeight: '500' , paddingVertical: 3,}}>
                            {vlogData.vlog_title}
                        </Text>
                        <Text numberOfLines={2} style={{ width: '100%', fontSize: 13, fontWeight: '300', fontFamily: 'HelveticaNeue' }}>
                            {vlogData.vlog_text}
                        </Text>
                    </View>

        {renderVlogMedia()}
        </View>


        </Card>
        <LiveWorkoutFullScreenContentModal isVisible={showFullScreenContent} closeModal={() => setFullScreenContentVisible(false)} vlogData={vlogData} />
        </TouchableOpacity>
    )
}

export default VlogFeedCard;