import React, { useState } from 'react';

import {
    View,
    Image,
    Text,
    StyleSheet,
    Modal,
    SafeAreaView, ScrollView
} from 'react-native';
import { Video } from 'expo-av'
import ThinFeatherIcon from 'react-native-feather1s'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { Constants } from 'react-native-unimodules';
import VlogFeedCard from '../../user/component/VlogFeedCard';
import { Appbar, Divider } from 'react-native-paper';
import Feather1s from 'react-native-feather1s/src/Feather1s';

function LiveWorkoutFullScreenContentModal({ isVisible, closeModal, vlogData }) {
    const [playVideo, setPlayVideo] = useState(false);
    
   /* const renderContent = () => {
        if (contentType == null || typeof(contentType) == 'undefined') {
            return (
                <View style={{ width: '100%', height: '100%', backgroundColor: 'black' }}>

                    </View>
            )
        }

        switch (contentType) {
            case 'IMAGE':
                return getWorkoutImageMedia(contentURI);
            case 'VIDEO':
                return getWorkoutVideoMedia(contentURI);
            default:
                return (
                    //In this case render information about the workout
                    <View style={{ width: '100%', height: '100%', backgroundColor: 'black' }}>

                    </View>
                )
        }
    }

   const getWorkoutImageMedia = (uri) => {
        try {
            return <Image source={{uri: uri}} style={{width: '100%', height: '100%'}} resizeMethod="scale" resizeMode="cover" />
        } catch(error) {
            alert(err)
            return (

                <View style={{ flex: 1, backgroundColor: '#212121', color: 'white', justifyContent: 'center', justifyContent: 'center' }}>
                    <Text>
                        Sorry it looks like something went wrong.  Try loading the workout again to get the video.
                   </Text>
                </View>
            )
        }
    }

    const renderVideoIcon = () => {
        return playVideo == true ?
            <ThinFeatherIcon
                thin={true}
                name="pause-circle"
                size={30}
                color="#FFFFFF"
                onPress={() => setPlayVideo(false)}
                style={{alignSelf: 'center', alignItems: 'center', justifyContent: 'center', padding: 10 }} />
            :
            <ThinFeatherIcon
                thin={true}
                name="play-circle"
                size={30}
                color="#FFFFFF"
                onPress={() => setPlayVideo(true)}
                style={{alignSelf: 'center', alignItems: 'center', justifyContent: 'center', padding: 10 }}
            />
    }

    const getWorkoutVideoMedia = (uri) => {
        try {
            return (
                <>
                    <Video
                        source={{ uri: uri }}
                        rate={1.0}
                        volume={0}
                        isMuted={true}
                        resizeMode="cover"
                        shouldPlay={playVideo}
                        isLooping={true}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        useNativeControls={true}
                    >
                        {renderVideoIcon()}
                    </Video>



                </>
            )
        } catch (err) {
            alert(err)
            return (

                <View style={{ flex: 1, backgroundColor: '#212121', color: 'white', justifyContent: 'center', justifyContent: 'center' }}>
                    <Text>
                        Sorry it looks like something went wrong.  Try loading the workout again to get the video.
                   </Text>
                </View>
            )
        }

    }*/

    return (
        <Modal visible={isVisible} presentationStyle="fullScreen" animated={true} animationType="slide">
            <Appbar.Header style={{backgroundColor: 'white', elevation: 0}}>
                <Appbar.Action icon={() =>  <Feather1s  size={22} name="x" color="black" onPress={closeModal}/>} />
            </Appbar.Header>
           <ScrollView>
           <VlogFeedCard vlogData={vlogData} />
           </ScrollView>
        </Modal>
    )
}

export default LiveWorkoutFullScreenContentModal;