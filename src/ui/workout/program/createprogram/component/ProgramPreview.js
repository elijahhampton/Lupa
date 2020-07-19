import React, { useState } from 'react';

import { useRedux, useSelector } from 'react-redux';

import {
    ScrollView,
    SafeAreaView,
    View,
    Button,
    StyleSheet,
    ImageBackground,
    Dimensions,
    Image,
    Text,
} from 'react-native';

import {
    Avatar,
    Surface,
    Paragraph,
    Caption,
} from 'react-native-paper'

import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import ProgramListComponent from '../../../component/ProgramListComponent';
import ProgramSearchResultCard from '../../components/ProgramSearchResultCard';
import ProgramProfileComponent from './ProgramProfileComponent';

import MapView from 'react-native-maps'


function ProgramPreview(props) {
    const currUserData = useSelector(state => {
        return state.Users.currUserData
    });

        const handleCreateProgram = () => {
            props.saveProgram()
            props.handleExit();
        }
        //get program structure from redux

        //save program structure to firebase

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#F2F2F2'}}>
              <ScrollView contentContainerStyle={{}}>
                   <View style={{alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width, height: 300}}>
                       <Image style={{width: '100%', height: '100%'}} source={{uri: props.programData.program_image}} />
                   </View>

                   <View style={{marginHorizontal: 10, height: 150, justifyContent: 'space-evenly'}}>
                       <Text>
                           {props.programData.program_name}
                       </Text>
                       <Paragraph style={{color: 'rgb(180, 180, 180)', fontWeight: '600'}}>
                       {props.programData.program_description}
                       </Paragraph>
                       <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
                       
                       </View>
                   </View>

                   <View style={{alignItems: 'center', justifyContent: 'space-evenly'}}>
                      
                       <View style={{width: Dimensions.get('window').width, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                       <View>
                               <Avatar.Image source={{uri: currUserData.photo_url}} label="EH" color="#FFFFFF" size={50} style={{backgroundColor: '#212121'}} />
                           </View>
                           <View>
                               <Text style={{fontSize: 20, fontWeight: '300'}}>
                                 {currUserData.display_name}
                               </Text>
                               <Text style={{fontSize: 15, fontWeight: '300'}}>
                                   National Association of Sports Medicine
                               </Text>
                           </View>
                       </View>
                   </View>

                   <View style={{marginVertical: 20}}>
                       <View style={{marginTop: 10, width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                                <MapView style={{width: Dimensions.get('window').width - 20, height: 180, alignSelf: 'center', borderRadius: 15}}
                    initialRegion={{
                        latitude: true && typeof(props.programData.program_location.location.lat) != 'undefined' ? props.programData.program_location.location.lat : null,
                        longitude:  props.programData.program_location.location.long,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                      }} />
                                <View style={{paddingLeft: 20, marginHorizontal: 20, paddingVertical: 10, width: '100%', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                                <Text style={{marginVertical: 10, fontSize: 15, fontWeight: '300'}}>
                           {props.programData.program_location.address}
                       </Text>
                       <Text style={{fontSize: 15, fontWeight: '300'}}>
                       {props.programData.program_location.name}
                       </Text>
                       </View>
                       </View>
                   </View>


                   </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    identifierText: {textAlign: 'center',   fontSize: 12, color: 'rgb(44, 44, 46)'},
    identifierValueText: {textAlign: 'center', color: '#212121',   fontSize: 12},
    previewText: {
         
        padding: 10,
        fontSize: 16,
        color: 'rgb(142, 142, 147)'
    }
})

export default ProgramPreview;