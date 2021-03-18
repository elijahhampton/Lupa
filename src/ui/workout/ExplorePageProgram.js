import React, { useState } from 'react';

import {
    View,
    TouchableOpacity,
    Text,
    Image
} from 'react-native';

import {
    Surface
} from 'react-native-paper';

import ProgramOptionsModal from './program/modal/ProgramOptionsModal';

const ExplorePageProgram = ({ program }) => {

    const [programOptionsIsVisible, setProgramOptionsIsVisible] = useState(false);

    const handleCardOnPress = () => {
        setProgramOptionsIsVisible(true);
    }

    return (
        <TouchableOpacity style={{marginHorizontal: 10, alignItems: 'center'}} onPress={handleCardOnPress}>
        <Surface style={{width: 140, height: 90, borderRadius: 2, elevation: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Image resizeMethod="resize" resizeMode="cover" key={program.program_structure_uuid} source={{ uri: program.program_image }} style={{borderRadius: 10, width: '100%', height: '100%'}} />
         
            <View style={{position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)'}} />
            <View style={{position: 'absolute', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{color: 'white', alignSelf: 'center', paddingVertical: 3, fontSize: 15, fontFamily: 'Avenir-Heavy' }}>
          {program.program_name}
        </Text>
        <Text style={{color: 'white', alignSelf: 'center', fontSize: 15, fontFamily: 'Avenir' }}>
          {program.num_exercises} exercises
        </Text>
            </View>

        </Surface>
       
    <ProgramOptionsModal 
    program={program} 
    isVisible={programOptionsIsVisible} 
    closeModal={() => setProgramOptionsIsVisible(false)} 
    />
    
    </TouchableOpacity>
    )
}

export default ExplorePageProgram;