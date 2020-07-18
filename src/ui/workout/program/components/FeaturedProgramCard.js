import React, { useState } from 'react';
import ProgramInformationPreview from '../ProgramInformationPreview';

import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode'

import {
    View,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native';

import {
    Card
} from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import LupaController from '../../../../controller/lupa/LupaController';

import { useNavigation } from '@react-navigation/native'

function FeaturedProgramCard(props) {
    const navigation = useNavigation()
    let [programModalVisible, setProgramModalVisible] = useState(false);

    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    let currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

   const handleCardOnPress = (programData) => {
        if (currUserData.programs.includes(programData.program_structure_uuid))
        {
            currUserData = useSelector(state => {
                return state.Users.currUserData;
            })
            
          navigation.push('LiveWorkout', {
                programData: programData,
            });

        }
        else
        {
            console.log('Hisddd')
            setProgramModalVisible(true);
        }
}

const getProgramName = () => {
    try {
        return props.currProgram.program_name
    }
    catch(error) {
        LOG_ERROR('FeaturedProgramCard.js', 'Unhandled exception in getProgramName()', error)
        return 'Unknown Program Title'
    }
    
}

const getProgramLocation = () => {
    try {
        return props.currProgram.program_location
    }
    catch(error) {
        LOG_ERROR('FeaturedProgramCard.js', 'Unhandled exception in getProgramLocation()', error)
        return 'Unknown Location'
    }
}

    const { currProgram, programOwnerUUID } = props
    return (
        <>
        <Card key={Math.random()} style={{borderRadius: 0,  elevation: 3, margin: 10, width: Dimensions.get('window').width / 1.2, height: 250, marginVertical: 10 }} onPress={() => handleCardOnPress(currProgram)}>
        <Card.Cover resizeMode='contain' defaultSource={require('../../../images/programs/sample_photo_two.jpg')} source={{uri: currProgram.program_image}} style={{ height: '65%' }} />
        <Card.Actions style={{ width: '100%', height: '35%', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
            <View style={{ width: '100%', height: '100%', alignItems: 'flex-start', justifyContent: 'space-around' }}>
                <View style={{ width: '100%', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                   <View>
                   <Text style={{ fontFamily: 'avenir-roman', fontSize: RFValue(12),  }} numberOfLines={1}>
                        {getProgramName()}
</Text>
                   <Text style={{fontSize: RFValue(12)}}>
                ({getProgramLocation().name})
                </Text>
                   </View>
<Text style={{ fontSize: RFValue(12), fontWeight: '500', color: '#1089ff' }}>
                        Emily Loefstedt
</Text>
                </View>


                <View style={{ width: '100%'}}>
                <Text style={{ fontSize: RFValue(12), fontWeight: '400',  flexWrap: 'nowrap'}} numberOfLines={1}>
                        {getProgramLocation().address}
</Text>

                </View>
            </View>
        </Card.Actions>
    </Card>
    <ProgramInformationPreview isVisible={programModalVisible} programData={currProgram} closeModalMethod={() => setProgramModalVisible(false)} />
    </>
    )
}

export default FeaturedProgramCard