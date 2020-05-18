import React, { useState } from 'react';

import {
    TouchableHighlight,
    View,
    StyleSheet,
    Text,
    ImageBackground,
    Dimensions,
} from 'react-native';

import {
    Surface
} from 'react-native-paper';

import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import ProgramInformationPreview from '../ProgramInformationPreview';
import { useSelector } from 'react-redux';
import { withNavigation, StackActions } from 'react-navigation';
import { TouchableOpacity } from 'react-native-gesture-handler';

function ProgramProfileComponent(props) {
    let [programModalVisible, setProgramModalVisible] = useState(false);
    const program = props.programData;

    const currUserData = useSelector(state => {
        return state.Users.currUserData
    })


    const handleOnPress = () => {

        if (program.program_participants.includes(currUserData.user_uuid))
        {
            props.navigation.push('LiveWorkout', {
                programData: program,
                programOwnerData: result.program_owner == currUserData.user_uuid ? currUserData : undefined 
            });
        }
        else
        {
            setProgramModalVisible(true)
        }
    }

    return (
        <View style={{}}>
        <TouchableOpacity onPress={() => handleOnPress()}>
        <Surface style={{elevation: 0, width: Dimensions.get('screen').width /1.3, height: 120, borderRadius: 16, margin: 5}}>
      <View style={{position: 'absolute', 
        flex: 1,
        top: 0, left: 0, right:0, 
        borderRadius: 16, 
        backgroundColor: 'rgba(0,0,0,0.7)'}} />               
      <ImageBackground 
       imageStyle={{borderRadius: 16}} 
       style={{alignItems: 'flex-start', justifyContent: 'center', width: '100%', height: '100%', borderRadius:16 }} 
       source={{uri: program.program_image }}>
           <View style={{flex: 1, padding: 15, alignItems: 'flex-start', justifyContent: 'center' }}>
           <Text style={{color: 'white', fontSize: 20,fontFamily: 'ARSMaquettePro-Medium' }}>
                {program.program_name}
                </Text>
                <Text  numberOfLines={3} style={{ color: 'white', fontSize: 12, fontFamily: 'ARSMaquettePro-Medium'}}>
                {program.program_description}
                </Text>
           </View>
       </ImageBackground>
        <MaterialIcon size={30} name="info" color="#FAFAFA" style={{ position: 'absolute', right: 0, top: 0, margin: 5}} />
    </Surface>
        </TouchableOpacity>

        <ProgramInformationPreview isVisible={programModalVisible} programData={program} closeModalMethod={() => setProgramModalVisible(false)} />
    </View>
    )
}

export default withNavigation(ProgramProfileComponent);