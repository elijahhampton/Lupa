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
                <Avatar.Image source={{uri: currUserState.photo_url }} size={40} style={{position: 'absolute', top: 0, left: 0, margin: 20}} />

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

                    <View >
                        <Text style={styles.identifierText}>
                            Total Slots:
                        </Text>
                        <Text style={styles.identifierValueText}>
                            {props.programData.program_slots}
                        </Text>
                    </View>

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
                            {props.programData.program_type}
                        </Text>
                    </View>

                    <View >
                        <Text style={styles.identifierText}>
                            Waitlist:
                        </Text>
                        <Text style={styles.identifierValueText}>
                            Allowed
                        </Text>
                    </View>
                </Surface>

                <View style={{flex: 1}}>
                    <Text style={{fontSize: 20, fontFamily: 'ARSMaquettePro-Regular', padding: 3}}>
                        Program Preview
                    </Text>
                <ScrollView horizontal                       centerContent
                        snapToAlignment={'center'}
                        decelerationRate={0} 
                        snapToInterval={Dimensions.get('window').width}
                        pagingEnabled={true}>

                <View>
        <Text style={styles.previewText}>
                    Featured
                    </Text>
                    <View style={{alignSelf: 'center', width: Dimensions.get('window').width, alignItems: 'center'}}>
                    <Surface style={{elevation: 0, width: Dimensions.get('screen').width /1.3, height: 200, borderRadius: 16, margin: 15}}>
                   <Image style={{width: '100%', height: '100%', borderRadius:16 }} source={{uri: props.programData.program_image}} />
                </Surface>

                <View style={{marginLeft: 15, width: Dimensions.get('screen').width /1.3}}>
                    <View style={{padding: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Text style={{fontFamily: 'ARSMaquettePro-Medium'}}>
                    {props.programData.program_name}
                    </Text>
                    <Caption>
                        {props.programData.program_slots} spots available
                    </Caption>
                    </View>
                    <Text style={{fontWeight: '300', fontSize: 12}}>
                    {props.programData.program_description}
                    </Text>

                    <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10, width: 120, justifyContent: 'space-evenly', alignSelf: 'flex-end'}}>
                    <Surface style={{alignItems: 'center', justifyContent: 'center', width: 20, height: 20, elevation: 4, borderRadius: 5, backgroundColor: '#2196F3'}}>
                                        <MaterialIcon name="fitness-center" size={10} color="#FFFFFF" />
                                        </Surface>
                                        <Surface style={{alignItems: 'center', justifyContent: 'center', width: 20, height: 20, elevation: 4, borderRadius: 5, backgroundColor: '#2196F3'}}>
                                        <MaterialIcon name="fitness-center" size={10} color="#FFFFFF" />
                                        </Surface>
                                        <Surface style={{alignItems: 'center', justifyContent: 'center', width: 20, height: 20, elevation: 4, borderRadius: 5, backgroundColor: '#2196F3'}}>
                                        <MaterialIcon name="fitness-center" size={10} color="#FFFFFF" />
                                        </Surface>
                                        <Surface style={{alignItems: 'center', justifyContent: 'center', width: 20, height: 20, elevation: 4, borderRadius: 5, backgroundColor: '#2196F3'}}>
                                        <MaterialIcon name="fitness-center" size={10} color="#FFFFFF" />
                                        </Surface>
                    </View>
                </View>
                </View>

        </View>

        <View>
        <Text style={styles.previewText}>
                        On search results
                    </Text>
                    <Surface style={{flexDirection: 'row', alignItems: 'center', borderRadius: 20, margin: 10, elevation: 0, width: Dimensions.get('window').width-20, height: 100, backgroundColor: '#F2F2F2'}} >
                                
                                <View style={{flex: 1, padding: 10, }}>
                                    <Surface style={{width: '100%', height: '100%', elevation: 5, borderRadius: 15}}>
                                        <Image style={{width: '100%', height: '100%', borderRadius: 15}} source={{uri: props.programData.program_image}} />
                                    </Surface>
                                </View>

                                <View style={{flex: 3, height: '100%', alignItems: 'center'}}>
                                    <View style={{flex: 2, alignSelf: 'flex-start', padding: 5}}>
                                        <Text style={{fontFamily: 'ARSMaquettePro-Medium', fontSize: 15, color: '#212121'}}>
                                        {props.programData.program_name}
                                        </Text>
                                        <Caption numberOfLines={2} style={{lineHeight: 12, }}>
                                        {props.programData.program_description}
                                        </Caption>
                                    </View>


                                    <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10}}>
                                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center',justifyContent: 'flex-start'}}>
                                        <Text style={{fontFamily: 'ARSMaquettePro-Regular', fontSize: 12}}>
                                        {props.programData.program_slots} spots available
                                        </Text>
                                    </View>

                                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center',  justifyContent: 'space-evenly'}}>
                                        <Surface style={{alignItems: 'center', justifyContent: 'center', width: 20, height: 20, elevation: 8, borderRadius: 5, backgroundColor: '#2196F3'}}>
                                        <MaterialIcon name="fitness-center" size={10} color="#FFFFFF" />
                                        </Surface>
                                        <Surface style={{alignItems: 'center', justifyContent: 'center', width: 20, height: 20, elevation: 8, borderRadius: 5, backgroundColor: '#2196F3'}}>
                                        <MaterialIcon name="fitness-center" size={10} color="#FFFFFF" />
                                        </Surface>
                                        <Surface style={{alignItems: 'center', justifyContent: 'center', width: 20, height: 20, elevation: 8, borderRadius: 5, backgroundColor: '#2196F3'}}>
                                        <MaterialIcon name="fitness-center" size={10} color="#FFFFFF" />
                                        </Surface>
                                        <Surface style={{alignItems: 'center', justifyContent: 'center', width: 20, height: 20, elevation: 8, borderRadius: 5, backgroundColor: '#2196F3'}}>
                                        <MaterialIcon name="fitness-center" size={10} color="#FFFFFF" />
                                        </Surface>
                                    </View>
                                    </View>

                                    
                                </View>


                              </Surface>
        </View>

        <View>
        <Text style={styles.previewText}>
                    On your profile
                </Text>
                <View style={{alignSelf: 'center', width: Dimensions.get('window').width, alignItems: 'center'}}>
                        <Surface style={{elevation: 0, width: Dimensions.get('screen').width /1.3, height: 120, borderRadius: 16, margin: 5}}>
                      <View style={styles.viewOverlay} />               
                      <ImageBackground 
                       imageStyle={{borderRadius: 16}} 
                       style={{alignItems: 'flex-start', justifyContent: 'center', width: '100%', height: '100%', borderRadius:16 }} 
                       source={{uri: props.programData.program_image}}>
                           <View style={{flex: 1, padding: 15, alignItems: 'flex-start', justifyContent: 'center' }}>
                           <Text style={{color: 'white', fontSize: 20,fontFamily: 'ARSMaquettePro-Medium' }}>
                                {props.programData.program_name}
                                </Text>
                                <Text  numberOfLines={3} style={{ color: 'white', fontSize: 12, fontFamily: 'ARSMaquettePro-Medium'}}>
                                {props.programData.program_description}
                                </Text>
                           </View>
                       </ImageBackground>
                        <MaterialIcon size={30} name="info" color="#FAFAFA" style={{ position: 'absolute', right: 0, top: 0, margin: 5}} />
                    </Surface>
        
                    
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