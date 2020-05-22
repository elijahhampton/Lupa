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

import { withNavigation } from 'react-navigation'
import ProgramInformationPreview from '../ProgramInformationPreview';


function ProgramSearchResultCard(props) {
    const result = props.programData;

    let [programModalVisible, setProgramModalVisible] = useState(false);

    const currUserData= useSelector(state => {
        return state.Users.currUserData;
    })

    const handleOnPress = () => {

        if (result.program_participants.includes(currUserData.user_uuid))
        {
           props.navigation.push('LiveWorkout', {
                programData: result,
                programOwnerData: result.program_owner == currUserData.user_uuid ? currUserData : undefined 
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
        <View>

        <TouchableOpacity onPress={() => handleOnPress()}>
        <Surface style={{flexDirection: 'row', alignItems: 'center', borderRadius: 20, margin: 10, elevation: 0, width: Dimensions.get('window').width-20, height: 120, backgroundColor: 'transparent'}} >
                                
        <View style={{flex: 1, padding: 10, alignItems: 'center', justifyContent: 'center' }}>
            <Surface style={{width: '80%', height: '70%', elevation: 15, borderRadius: 10}}>
                <Image style={{width: '100%', height: '100%', borderRadius: 10}} source={{uri: result.program_image}} />
            </Surface>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center',justifyContent: 'flex-start'}}>
                <Text style={{alignSelf: 'flex-end', fontFamily: 'ARSMaquettePro-Regular', fontSize: 12}}>
                    One on One 
                </Text>
            </View>
        </View>

        <View style={{flex: 3, height: '100%', justifyContent: 'space-evenly'}}>
            <View style={{flex: 1, }}>
                <Text style={{fontFamily: 'ARSMaquettePro-Medium', fontSize: 15, color: '#212121'}}>
                    {result.program_name}
                </Text>
            </View>

        <View style={{flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
        <Paragraph style={{lineHeight: 12, fontSize: 10, width: '80%', flex: 1, flexWrap: 'wrap'}}>
                {result.program_description}
                </Paragraph>
        </View>


            <View style={{flex: 1, bottom: 0,width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <View style={{flex: 1,justifyContent: 'flex-start'}}>
                <Text style={{fontFamily: 'ARSMaquettePro-Regular', fontSize: 10, color: '#212121'}}>
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

      <ProgramInformationPreview isVisible={programModalVisible} programData={result} closeModalMethod={() => setProgramModalVisible(false)} />
      </View>
    )
}

export default withNavigation(ProgramSearchResultCard);