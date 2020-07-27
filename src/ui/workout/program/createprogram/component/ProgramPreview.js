import React, { useState, useEffect } from 'react';

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
import LUPA_DB from '../../../../../controller/firebase/firebase';
import { getLupaProgramInformationStructure } from '../../../../../model/data_structures/programs/program_structures';


function ProgramPreview(props) {
    return (
        <SafeAreaView style={styles.container}>
            
            
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