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

    return (
        <View>

        <TouchableOpacity onPress={() => handleOnPress()}>
        <Surface style={{flexDirection: 'row', alignItems: 'center', borderRadius: 20, margin: 10, elevation: 0, width: Dimensions.get('window').width-20, height: 100, backgroundColor: '#FFFFFF'}} >
                                
        <View style={{flex: 1, padding: 10, }}>
            <Surface style={{width: '100%', height: '100%', elevation: 5, borderRadius: 15}}>
                <Image style={{width: '100%', height: '100%', borderRadius: 15}} source={{uri: result.program_image}} />
            </Surface>
        </View>

        <View style={{flex: 3, height: '100%', alignItems: 'center'}}>
            <View style={{flex: 2, alignSelf: 'flex-end', padding: 5}}>
                <Text style={{fontFamily: 'ARSMaquettePro-Medium', fontSize: 15, color: '#212121'}}>
                    {result.program_name}
                </Text>
                <Caption numberOfLines={2} style={{lineHeight: 12, }}>
                {result.program_description}
                </Caption>
            </View>


            <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10}}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center',justifyContent: 'flex-start'}}>
                <Text style={{fontFamily: 'ARSMaquettePro-Regular', fontSize: 12}}>
                    {result.program_slots} spots available
                </Text>
            </View>

            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                {result.program_tags.map((tag, index, arr) => {
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
                            {tag},
                        </Caption>
                    )
                })}
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