import React, { useState } from 'react';

import {
    View,
    Image,
    Text,
    StyleSheet,
    Modal,
    SafeAreaView, ScrollView, Dimensions
} from 'react-native';
import { Video } from 'expo-av'
import ThinFeatherIcon from 'react-native-feather1s'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { Constants } from 'react-native-unimodules';
import VlogFeedCard from '../../user/component/VlogFeedCard';
import { Appbar, Divider, Chip} from 'react-native-paper';
import Feather1s from 'react-native-feather1s/src/Feather1s';

function LiveWorkoutFullScreenContentModal({ isVisible, closeModal, vlogData }) {
    const [playVideo, setPlayVideo] = useState(false);

    return (
        <Modal visible={isVisible} presentationStyle="fullScreen" animated={true} animationType="slide">
            <Appbar.Header style={{backgroundColor: 'white', elevation: 0}}>
                <Appbar.Action icon={() =>  <Feather1s  size={22} name="x" color="black" onPress={closeModal}/>} />
                <Appbar.Content title="Vlog"  titleStyle={{alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 20}} />
            </Appbar.Header>
           <ScrollView>
           <VlogFeedCard vlogData={vlogData} />
{/*
            <Divider style={{marginVertical: 10, marginHorizontal: 10}} />
           <View>
               <Text style={{fontSize: 15, fontFamily: 'Avenir-Heavy', padding: 10}}>
                   By Elijah Hampton
               </Text>
               <View style={{alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                    <View style={{width: Dimensions.get('window').width  - 20, height: 300, borderRadius: 10, borderWidth: 0.5, borderColor: 'black'}}>
                        <Image source={require('../../images/programs/sample_photo_two.jpg')} style={{flex: 1, width: '100%', borderRadius: 10,  height: '100%'}} />
                        <Chip textStyle={{color: 'white', fontFamily: 'Avenir-Heavy', fontWeight: '600'}} style={{paddingHorizontal: 10, elevation: 8, position: 'absolute', top: 0, right: 0, alignSelf: 'center', borderRadius: 0, borderTopRightRadius: 10, borderBottomLeftRadius: 10, backgroundColor: '#1089ff', width: 'auto'}}>
                           10.00
                       </Chip>
                    </View>

                    <View style={{width: '100%', padding: 10}}>
                    <Text style={{fontFamily: 'Avenir-Medium'}}>
                        Miami Fit Run
                    </Text>
                    <Text style={{fontFamily: 'Avenir-Light'}}>
                        5 Weeks
                    </Text>
                    </View>
                    

               
               </View>
           </View>

*/}
           </ScrollView>
        </Modal>
    )
}

export default LiveWorkoutFullScreenContentModal;