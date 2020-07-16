import React, { useState } from 'react';
import {useSelector } from 'react-redux';

import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image,
} from 'react-native';

import {
    Paragraph,
    Caption,
    Surface,
} from 'react-native-paper';

import ProgramInformationPreview from '../ProgramInformationPreview';


function ProgramSearchResultCard(props) {
    const result = props.programData;

    const [programModalVisible, setProgramModalVisible] = useState(false);

    const currUserData= useSelector(state => {
        return state.Users.currUserData;
    })

    const handleOnPress = () => {

        if (result.program_participants.includes(currUserData.user_uuid))
        {
            props.navigation.push('LiveWorkout', {
                programData: result,
            });
        }
        else
        {
            setProgramModalVisible(true)
        }
    }

    const getProgramTags = () => {
        try {
        return (
            result.program_tags.map((tag, index, arr) => {
                if (index == arr.length - 1)
                {
                    return (
                        <Caption>
                        {tag}
                    </Caption>
                    )
                }
                return (
                    <Caption>
                        {tag},{" "}
                    </Caption>
                )
            })
        )
        } catch(err) {
            return;
        }
    }

    return (
        <View style={{width: Dimensions.get('window').width}}>

        <TouchableOpacity onPress={() => handleOnPress()}>
        <Surface style={{flexDirection: 'row', alignItems: 'center', borderRadius: 20, marginVertical: 10, elevation: 0, width: Dimensions.get('window').width-20, height: 120, backgroundColor: 'transparent'}} >
                                
        <View style={{flex: 1, padding: 10, alignItems: 'center', justifyContent: 'center' }}>
            <Surface style={{width: '80%', height: '70%', elevation: 15, borderRadius: 10}}>
                <Image style={{width: '100%', height: '100%', borderRadius: 10}} source={{uri: result.program_image}} />
            </Surface>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center',justifyContent: 'flex-start'}}>
                <Text style={{alignSelf: 'flex-end',   fontSize: 12}}>
                    One on One 
                </Text>
            </View>
        </View>

        <View style={{flex: 3, height: '100%', justifyContent: 'center'}}>
            <View style={{}}>
                <Text style={{  fontSize: 15, color: '#212121'}}>
                    {result.program_name}
                </Text>
            </View>

        <View style={{flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{fontSize: 10, width: '80%', flex: 1, flexWrap: 'wrap'}} numberOfLines={4}>
                {result.program_description}
                </Text>
        </View>


            <View style={{flex: 1, bottom: 0,width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <View style={{flex: 1,justifyContent: 'flex-end'}}>
                <Text style={{  fontSize: 10, color: '#212121'}}>
                 {result.program_duration} sessions per week
                </Text>
            </View>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                {
                    getProgramTags()
                }
            </View>
            </View>

            
        </View>


      </Surface>
      </TouchableOpacity>

      <ProgramInformationPreview isVisible={programModalVisible} programData={props.programData} closeModalMethod={() => setProgramModalVisible(false)} /> 
      </View>
    )
}

export default ProgramSearchResultCard;