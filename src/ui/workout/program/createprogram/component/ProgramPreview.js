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
    Caption,
} from 'react-native-paper'

import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import ProgramListComponent from '../../../component/ProgramListComponent';
import ProgramSearchResultCard from '../../components/ProgramSearchResultCard';
import ProgramProfileComponent from './ProgramProfileComponent';

function ProgramPreview(props) {
    const currUserState = useSelector(state => {
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
            <View style={{flex: 1}}>
                                        <View style={{padding: 10}}>
                    <Text style={{fontSize: 15, padding: 10, fontFamily: 'ARSMaquettePro-Medium', color: '#BDBDBD'}}>
                       Review your program
                    </Text>
                </View>

                <Surface style={{ margin: 5, backgroundColor: '#FFFFFF', borderRadius: 10, alignSelf: 'center', alignItems: 'center', justifyContent: 'space-evenly', borderWidth: 1, borderColor: 'rgb(229, 229, 234)', padding: 10, width: '90%', flex: 0.5, justifyContent: 'space-evenly'}}>
                <Avatar.Image source={{uri: currUserState.photo_url }} size={40} style={{position: 'absolute', top: 0, left: 0, margin: 5}} />

                    <View>
                        <Text style={styles.identifierText}>
                            Program Name:
                        </Text>
                        <Text style={styles.identifierValueText}>
                            {props.programData.program_name}
                        </Text>
                    </View>

                    <View>
                        <Text style={styles.identifierText}>
                            Program Description:
                        </Text>
                        <Text style={styles.identifierValueText}>
                            {props.programData.program_description}
                        </Text>
                    </View>
        {
            /*
        
                    <View >
                        <Text style={styles.identifierText}>
                            Total Slots:
                        </Text>
                        <Text style={styles.identifierValueText}>
                            {props.programData.program_slots}
                        </Text>
                    </View>
                    */
        }

                    <View  >
                        <Text style={styles.identifierText}>
                            Program Location
                        </Text>
                        <Text style={styles.identifierValueText}>
                            {props.programData.program_location.name}
                        </Text>
                        <Text style={styles.identifierValueText}>
                            {props.programData.program_location.address}
                        </Text>
                    </View>

                    <View  >
                        <Text style={styles.identifierText}>
                            Program Type
                        </Text>
                        <Text style={styles.identifierValueText}>
                            {props.programData.program_type == 'Single' ?   'One on One' : null}
                        </Text>
                    </View>
        {
            /*
        
                    <View >
                        <Text style={styles.identifierText}>
                            Waitlist:
                        </Text>
                        <Text style={styles.identifierValueText}>
                            Allowed
                        </Text>
                    </View>
        */}
                </Surface>

                <View style={{flex: 1}}>
                    <Text style={{fontSize: 20, fontFamily: 'ARSMaquettePro-Regular', padding: 3}}>
                        Program Preview
                    </Text>
                <ScrollView horizontal 
                        centerContent
                        snapToAlignment={'center'}
                        decelerationRate={0} 
                        snapToInterval={Dimensions.get('window').width}
                        pagingEnabled={true}>

                <View>
        <Text style={styles.previewText}>
                    Featured
                    </Text>
                <View style={{width: Dimensions.get('window').width, alignItems: 'center', justifyContent: 'center'}}>
                <ProgramListComponent  programData={props.programData} />
                </View>
                   

        </View>

        <View>
        <Text style={styles.previewText}>
                        On search results
                    </Text>

                    <ProgramSearchResultCard programData={props.programData} />
        </View>

        <View>
        <Text style={styles.previewText}>
                    On your profile
                </Text>
                <View style={{alignItems: 'center', justifyContent: 'center', width: Dimensions.get('window').width}}>
                <ProgramProfileComponent programData={props.programData} />
                </View>
        </View>
                    
                </ScrollView>
                </View>

               

                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                    <Button title="Edit Workout" onPress={() => props.goBackToEditWorkout()} />
                    <Button title="Create Program" onPress={() => handleCreateProgram()} />
                </View>
                </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    identifierText: {textAlign: 'center', fontFamily: 'ARSMaquettePro-Medium', fontSize: 12, color: 'rgb(44, 44, 46)'},
    identifierValueText: {textAlign: 'center', color: '#212121', fontFamily: 'ARSMaquettePro-Regular', fontSize: 12},
    previewText: {
        fontFamily: 'ARSMaquettePro-Medium',
        padding: 10,
        fontSize: 16,
        color: 'rgb(142, 142, 147)'
    }
})

export default ProgramPreview;