import React, { useState } from 'react'
import {
    TouchableWithoutFeedback,
    View,
    ImageBackground,
    Dimensions,
    Text,
    StyleSheet
} from 'react-native'

import {
    Surface,
    Caption
} from 'react-native-paper'

import LupaController from '../../../../controller/lupa/LupaController'
import { getLupaUserStructure } from '../../../../controller/firebase/collection_structures';
import { useSelector } from 'react-redux/lib/hooks/useSelector';
import { titleCase } from '../../../common/Util';
import ProgramOptionsModal from '../modal/ProgramOptionsModal';
import ProgramInformationPreview from '../ProgramInformationPreview';

function ProgramInformationComponent({ program }) {
    const [programModalVisible, setProgramModalVisible] = useState(false);
    const [programOwnerData, setProgramOwnerData] = useState(getLupaUserStructure())
    const [programOptionsVisible, setProgramOptionsModalVisible] = useState(false)

    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

    const handleCardOnPress = (programData) => {
        if (currUserData.programs.includes(programData.program_structure_uuid)) {

           setProgramOptionsModalVisible(true)

        }
        else {
            setProgramModalVisible(true);
        }
    }

    return (
        <>
        <TouchableWithoutFeedback key={program.program_name} onPress={() => handleCardOnPress(program)} style={{width: Dimensions.get('screen').width / 1.2}}>

        <View style={{marginHorizontal: 10, width: Dimensions.get('screen').width / 1.2}}>
        <Surface style={{elevation: 0, width: Dimensions.get('screen').width / 1.2, height: 180, borderRadius: 16, margin: 5}}>
      <View style={{position: 'absolute', 
        flex: 1,
        top: 0, left: 0, right:0, 
        borderRadius: 16, 
        backgroundColor: 'rgba(0,0,0,0.7)'}} />               
      <ImageBackground 
       imageStyle={{borderRadius: 16}} 
       style={{alignItems: 'flex-start', justifyContent: 'center', width: '100%', height: '100%', borderRadius:16 }} 
       source={{uri: program.program_image }}>
       </ImageBackground>
      
    </Surface>
        <View style={{paddingLeft: 10, width: Dimensions.get('screen').width /1.3, alignItems: 'flex-start', justifyContent: 'center' }}>
           <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: Dimensions.get('screen').width /1.3,}}>
           <Text style={{color: '#000000', fontSize: 15, paddingVertical: 5, fontFamily: 'Avenir-Roman' }}>
                {titleCase(program.program_name)}
                </Text>
                <Caption>
                    Single
                </Caption>
           </View>
                <Text  numberOfLines={2} style={{ color: '#000000', fontSize: 12, fontFamily: 'Avenir-Light'}}>
                {program.program_description}
                </Text>
           </View>

    </View>
    </TouchableWithoutFeedback>

    <ProgramInformationPreview isVisible={programModalVisible} programData={program} closeModalMethod={() => setProgramModalVisible(false)} />
      <ProgramOptionsModal program={program} isVisible={programOptionsVisible} closeModal={() => setProgramOptionsModalVisible(false)} />
        </>
    )
}

export default ProgramInformationComponent