import React, { useState, useEffect } from 'react'

import {
    View,
    Text,
    StyleSheet,
    Dimensions
} from 'react-native';

import FeatherIcon from 'react-native-vector-icons/Feather'
import { Card,  Caption, Menu, Chip } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { getLupaUserStructure } from '../../../controller/firebase/collection_structures';
import LupaController from '../../../controller/lupa/LupaController';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import { Avatar } from 'react-native-elements'
import { Video } from 'expo-av';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import LiveWorkoutFullScreenContentModal from '../../workout/modal/LiveWorkoutFullScreenContentModal';
import DoubleClick from 'react-native-double-tap';

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
    }, [])

    return (
        <DoubleClick singleTap={() => setShouldPlay(!shouldPlay)} doubleTap={() => setFullScreenContentVisible(true)}>
        <Card theme={{roundness: 10}} style={{marginVertical: 10, alignSelf: 'center', width: Dimensions.get('window').width - 20, borderRadius: 20, elevation: 5}}>
                       {/* <Card.Cover resizeMode="cover" theme={{roundness: 10}} style={{elevation: 0, height: 180, width: Dimensions.get('window').width - 20, borderRadius: 0}} source={{uri: vlogData.vlog_media.uri}} /> */}
       
                      <Video  useNativeControls={false} isMuted={isMuted} isLooping={false} resizeMode="cover" style={{height: 300, width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 0}} source={{uri: vlogData.vlog_media.uri}} shouldPlay={shouldPlay} />
        
                      
                       <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, position: 'absolute', bottom: cardContentHeight + 15, right: 0, }}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <Chip textStyle={{color: 'white'}} style={{backgroundColor: 'rgba(0,0,0,0.3)', position: 'absolute', left: 30,  borderTopLeftRadius: 0, borderBottomLeftRadius: 0, height: 25, alignItems: 'center', justifyContent: 'center'}}>
                            {vlogOwnerData.display_name}
                        </Chip>
                        <Avatar  containerStyle={{borderWidth: 1.5, borderColor: 'white'}} rounded source={{uri: vlogOwnerData.photo_url }} size={35} />
                        
                        </View>
                       
                        <View style={{backgroundColor: 'rgba(142, 142, 147, 0.5)', borderWidth: 1, borderColor: 'white', borderRadius: 20}}>
                        <Feather1s  onPress={() => setMuted(!isMuted)} color="white"  name={isMuted === true ? 'volume-x' : 'volume-2'} size={20} style={{backgroundColor: 'transparent', padding: 5}} />
                       
    </View>
                        
    </View>
                       
                       
                        <Card.Content theme={{roundness: 10}} style={{backgroundColor: 'white', borderRadius: 10}} onLayout={event => setCardContentHeight(event.nativeEvent.layout.height)}>
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                <Text style={{fontSize: 15, paddingVertical: 5, fontFamily: 'Avenir-Heavy'}}>
                                    {vlogData.vlog_title}
                                </Text>
                                    { currUserData.user_uuid === vlogData.vlog_owner ? 
                                    <Menu 
    
                                        visible={optionsMenuVisible} 
                                        onDismiss={() => setOptionsMenuVisible(false)}
                                        anchor={<FeatherIcon onPress={() => setOptionsMenuVisible(true)} name="more-horizontal" size={20} color="#212121"  />  }>
                                        <Menu.Item title="Delete Vlog" onPress={() => LUPA_CONTROLLER_INSTANCE.deleteVlog(currUserData.user_uuid ,vlogData.vlog_uuid)} />
                                    </Menu>
                                    : 
                                    null
                                    }
                                </View>
                                
                                
                                <View style={{flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end'}}>
                                <Text numberOfLines={2} style={{width: '80%', fontSize: 15, fontFamily: 'Avenir-Roman'}}>
                                {vlogData.vlog_text}
                                </Text>
                                
                                </View>
                                <Caption style={{fontFamily: 'Avenir-Light', fontSize: 10}}>
                                    {Math.round(new Date().getTime() - vlogData.time_created.seconds)} hour ago
                                </Caption>
                        </Card.Content>

                        <LiveWorkoutFullScreenContentModal isVisible={showFullScreenContent} closeModal={() => setFullScreenContentVisible(false)} contentType={vlogData.vlog_media.media_type} contentURI={vlogData.vlog_media.uri} />
                    </Card>
                    </DoubleClick>
    )
}

export default VlogFeedCard;