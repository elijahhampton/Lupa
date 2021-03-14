import React, { useState, useEffect } from 'react'

import {
    View,
    Text,
    Dimensions,
    Image,
    TouchableOpacity,
} from 'react-native';

import { Avatar, Card, Caption, Surface, Menu, Chip, Divider } from 'react-native-paper';
import { useSelector } from 'react-redux';

import { getLupaUserStructure } from '../../../controller/firebase/collection_structures';
import LupaController from '../../../controller/lupa/LupaController';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import { Video } from 'expo-av';
import DoubleClick from 'react-native-double-tap';
import FeatherIcon from 'react-native-vector-icons/Feather'
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

function VlogFeedCard({ vlogData, showTopDivider, clickable }) {
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
    const [componentDidErr, setComponentDidErr] = useState(false);
    const [showFullScreenContent, setFullScreenContentVisible] = useState(false);

    useEffect(() => {
        LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(vlogData.vlog_owner).then(data => {
            setVlogOwnerData(data);
        });
    }, []);

    const renderVlogControls = () => {
        return (
            <View style={{marginVertical: 10, width: '100%', flexDirection: 'row', alignItems: 'center'}}>
                <TouchableWithoutFeedback onPress={handleOnDoubleTap}>
                <View style={{flexDirection: 'row', alignItems: 'center', marginHorizontal: 10}}>
                <FeatherIcon name="message-circle" size={20}  />
               <Text>
                   {" "}
               </Text>
                <Caption>
                    {vlogData.comments.length}
                </Caption>
                </View>    
                </TouchableWithoutFeedback>

            </View>
        )
    }

    const renderVlogMedia = () => {
        try {
            if (typeof(vlogData) == 'undefined' || typeof(vlogData.vlog_media.uri) == 'undefined' || vlogData.vlog_media.uri == "") {
                return null;
            };

            if (vlogData.vlog_media.media_type == "IMAGE") {
                return (
                <Surface style={{elevation: 0, alignItems: 'center', justifyContent: 'center', borderRadius: 10, width: Dimensions.get('window').width, height: 400, alignSelf: 'center'}}>
                <Image source={{uri: vlogData.vlog_media.uri}} style={{ marginVertical: 0,  width: '100%', height: '100%', flex: 1, alignSelf: 'center' }} />
                   </Surface>
                )
            } else if (vlogData.vlog_media.media_type == 'VIDEO') {
                return (
                    <Surface style={{elevation: 0, alignItems: 'center', justifyContent: 'center', borderRadius: 10, width: Dimensions.get('window').width, height: 400, alignSelf: 'center'}}>
                    <Video useNativeControls={false} isMuted={isMuted} isLooping={true} resizeMode="stretch" style={{ marginVertical: 0,  width: '100%', height: '100%', alignSelf: 'center' }} source={{ uri: vlogData.vlog_media.uri }} shouldPlay={shouldPlay} />
                    </Surface>
                )
            }
    
      
        } catch(error) {
            return null;
        }
    }

    const handleOnDoubleTap = () => {
        if (clickable == false) {
            return;
        }

        navigation.push('VlogContent', {
            vlogData: vlogData
        })
    }

    return (
        <>
        <TouchableWithoutFeedback disabled={clickable === true ? false : true} onPress={() => setShouldPlay(true)}> 
       {showTopDivider === true ? <Divider style={{width: Dimensions.get('window').width, alignSelf: 'center', height: 1, backgroundColor: '#EEEEEE',}} /> : null } 
      
        <Card style={{ paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center', marginVertical: 15,   width: '100%', borderRadius: 0, elevation: 0}}>

        <View style={{ width: Dimensions.get('window').width}}>
     


        <View style={{paddingHorizontal: 10, paddingVertical: 10, width: '100%',flexDirection: 'row',  alignItems: 'center', justifyContent: 'space-between'}}>
        <View style={{  flexDirection: 'row', alignItems: 'center',  }}>
        <TouchableOpacity onPress={() => navigation.push('Profile', {
            userUUID: vlogData.vlog_owner
        })}>
        <Avatar.Image containerStyle={{borderWidth: 1, borderColor: '#EEEEEE'}} source={{ uri: vlogOwnerData.photo_url }} size={30} />
        </TouchableOpacity>
       
        <View style={{marginHorizontal: 10}}>
        <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                <Text style={{ fontFamily: 'Avenir-Heavy', fontSize: 13 }}>
                                    {vlogOwnerData.display_name}
                                </Text>
                                </View>
                                {
                                    currUserData.isTrainer === true ?
                                    <Text style={{ fontFamily: 'Avenir-Roman', fontSize: 10, color: '#1089ff' }}>
                                    NASM
                                </Text>
                                    :
                                    null
                                }
        </View>
        </View>



        <Menu
                            visible={optionsMenuVisible}
                            onDismiss={() => setOptionsMenuVisible(false)}
                            anchor={<FeatherIcon onPress={() => setOptionsMenuVisible(true)} name="more-horizontal" size={18} color="#212121" />}>
                            {
                                currUserData.user_uuid === vlogData.vlog_owner ?
                                <Menu.Item title="Delete Vlog" titleStyle={{fontSize: 15}} onPress={() => LUPA_CONTROLLER_INSTANCE.deleteVlog(currUserData.user_uuid, vlogData.vlog_uuid)} />
                                :
                              null
                            }
                           
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
        </TouchableWithoutFeedback>
        {renderVlogControls()}
        </>
    )
}

export default VlogFeedCard;