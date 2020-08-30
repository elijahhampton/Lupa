import React, { useState } from 'react';

import {
    View,
    Image,
    Text,
    StyleSheet,
    Modal,
} from 'react-native';
import { Video } from 'expo-av'
import ThinFeatherIcon from 'react-native-feather1s'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { Constants } from 'react-native-unimodules';

function LiveWorkoutFullScreenContentModal({ isVisible, closeModal, contentURI, contentType }) {
    const [playVideo, setPlayVideo] = useState(false);
    
    const renderContent = () => {
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
                        source={require('../../videos/pushuppreview.mov')}
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

    }

    return (
        <Modal visible={isVisible} presentationStyle="fullScreen" animated={true} animationType="fade">
            {renderContent()}
            <FeatherIcon  size={22} name="minimize" style={{position: 'absolute', top: 0, left: 0, margin: Constants.statusBarHeight }} color="white" onPress={closeModal}/>
        </Modal>
    )
}

export default LiveWorkoutFullScreenContentModal;