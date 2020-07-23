import React, { useState } from 'react';

import { useRedux, useSelector } from 'react-redux';

import {
    ScrollView,
    SafeAreaView,
    View,
    StyleSheet,
    Dimensions,
    Image,
    Text,
} from 'react-native';

import {
    Avatar,
    Button as PaperButton,
    Paragraph,
} from 'react-native-paper'

import MapView from 'react-native-maps'


function ProgramPreview(props) {
    const currUserData = useSelector(state => {
        return state.Users.currUserData
    });

        const handleCreateProgram = async () => {
            props.saveProgram().then(() => {
                props.handleExit()
            })
        }
        //get program structure from redux

        //save program structure to firebase

    return (
        <SafeAreaView style={styles.container}>
              <ScrollView>
                   <View style={styles.imageContainer}>
                       <Image style={styles.image} source={{uri: props.programData.program_image}} />
                   </View>

                   <View style={styles.programInformationContainer}>
                       <Text>
                           {props.programData.program_name}
                       </Text>
                       <Paragraph style={styles.programDescriptionText}>
                       {props.programData.program_description}
                       </Paragraph>
                       <View style={styles.programTagsContainer}>
                        {/* Program Tags */}
                       </View>
                   </View>

                   <View style={styles.programOwnerDetailsContainer}>
                      
                       <View style={styles.programOwnerDetailsSubContainer}>
                       <View>
                               <Avatar.Image source={{uri: currUserData.photo_url}} label="EH" color="#FFFFFF" size={50} />
                           </View>
                           <View>
                               <Text style={styles.programOwnerNameText}>
                                 {currUserData.display_name}
                               </Text>
                               <Text style={styles.programOwnerCertificationText}>
                                   National Association of Sports Medicine
                               </Text>
                           </View>
                       </View>
                   </View>

                   <View style={styles.mapViewContainer}>
                       <View style={styles.mapViewSubContainer}>
                              <MapView style={styles.mapView}
                    initialRegion={{
                        latitude: currUserData.location.latitude,
                        longitude:  currUserData.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                      }} />
                                <View style={styles.mapViewTextContainer}>
                                <Text style={styles.mapViewAddressText}>
                           {props.programData.program_location.address}
                       </Text>
                       <Text style={styles.mapViewLocationNameText}>
                       {props.programData.program_location.name}
                       </Text>
                       </View>
                       </View>
                   </View>

                      <PaperButton onPress={handleCreateProgram} color="#1089ff" mode="contained" style={styles.publishButton}>
                        <Text>
                            Publish
                        </Text>
                      </PaperButton>

                   </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    imageContainer: {
        alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width, height: 300
    },
    image: {
        width: '100%',
        height: '100%'
    },
    programInformationContainer: {
        marginHorizontal: 10, height: 150, justifyContent: 'space-evenly'
    },
    programTagsContainer: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'
    },
    programDescriptionText: {
        color: 'rgb(180, 180, 180)', fontWeight: '600'
    },
    programOwnerDetailsContainer: {
        alignItems: 'center', justifyContent: 'space-evenly'
    },
    programOwnerDetailsSubContainer: {
        width: Dimensions.get('window').width, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'
    },
    programOwnerNameText: {
        fontSize: 20,
        fontWeight: '300'
    },
    programOwnerCertificationText: {
        fontSize: 15,
        fontWeight: '300'
    },
    mapViewContainer: {
        marginVertical: 20
    },
    mapViewSubContainer: {
        marginTop: 10, width: '100%', alignItems: 'center', justifyContent: 'center'
    },
    mapView: {
        width: Dimensions.get('window').width - 20, height: 180, alignSelf: 'center', borderRadius: 15
    },
    mapViewTextContainer: {
        paddingLeft: 20, marginHorizontal: 20, paddingVertical: 10, width: '100%', alignItems: 'flex-start', justifyContent: 'flex-start'
    },
    mapViewAddressText: {
        marginVertical: 10, fontSize: 15, fontWeight: '300'
    },
    mapViewLocationNameText: {
        fontSize: 15, fontWeight: '300'
    },
    publishButton: {
        marginVertical: 10, elevation: 5, width: '80%', alignSelf: 'center', shadowColor: '#1089ff'
    }
})

export default ProgramPreview;