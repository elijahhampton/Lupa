import React, { useState } from 'react';
import ProgramInformationPreview from '../ProgramInformationPreview';
import { withNavigation } from 'react-navigation';

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
import { RFPercentage } from 'react-native-responsive-fontsize';

function FeaturedProgramCard(props) {
    let [programModalVisible, setProgramModalVisible] = useState(false);
    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

   const handleCardOnPress = (programData) => {
        if (programData.program_participants.includes(currUserData.user_uuid))
        {
          props.navigation.push('LiveWorkoutPreview', {
                programData: programData,
            });
        }
        else
        {
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

    const currProgram = props.currProgram;
    const key = props.key;
    return (
        <>
        <Card key={key} style={{ elevation: 2, margin: 10, width: Dimensions.get('window').width / 1.2, height: '90%', marginVertical: 10 }} onPress={() => handleCardOnPress(currProgram)}>
        <Card.Cover resizeMode='cover' defaultSource={require('../../../images/programs/sample_photo_two.jpg')} source={{uri: currProgram.program_image}} style={{ height: '65%' }} />
        <Card.Actions style={{ width: '100%', height: '35%', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
            <View style={{ width: '100%', height: '100%', alignItems: 'flex-start', justifyContent: 'space-around' }}>
                <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontFamily: 'avenir-roman', fontSize: RFPercentage(2),  }} numberOfLines={1}>
                        {getProgramName()}
</Text>
<Text style={{ fontSize: 14, fontWeight: '500', color: '#2962FF' }}>
                        Emily Loefstedt
</Text>
                </View>

                <Text style={{fontSize: RFPercentage(2)}}>
                ({getProgramLocation().name})
                </Text>

                <View style={{ width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: RFPercentage(1.5), fontWeight: '400',  flexWrap: 'nowrap'}} numberOfLines={1}>
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

export default withNavigation(FeaturedProgramCard)