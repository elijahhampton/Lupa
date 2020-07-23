import React, { useEffect, useState } from 'react'

import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
} from 'react-native'

import {
    Button,
    Surface,
    Divider,
} from 'react-native-paper'

import { useSelector } from 'react-redux'

import ProgramInformationPreview from '../ProgramInformationPreview'
import { getLupaUserStructure } from '../../../../controller/firebase/collection_structures'
import LupaController from '../../../../controller/lupa/LupaController'
import { useNavigation } from '@react-navigation/native'

function LargeProgramSearchResultCard({ program }) {
    const [programOwnerData, setProgramOwnerData] = useState(getLupaUserStructure())
    const [programModalVisible, setProgramModalVisible] = useState(false);

    const LUPA_USER_CONTROLLER = LupaController.getInstance()

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

    const navigation = useNavigation()

    const handleOnPress = () => {

        if (program.program_participants.includes(currUserData.user_uuid))
        {
            navigation.push('LiveWorkout', {
                programData: program
            });
        }
        else
        {
            setProgramModalVisible(true)
        }
    }

    useEffect(() => {
        async function fetchProgramOwnerUserData() {
            try {
                await LUPA_USER_CONTROLLER.getUserInformationByUUID(program.program_owner).then(result => {
                    setProgramOwnerData(result)
                })
            } catch(err) {
                alert(err)
            }
        }

        fetchProgramOwnerUserData()
    }, [])

    return (
        <Surface style={styles.container}>
        <View style={styles.imageContainer}>
        <Image source={{uri: program.program_image}} style={styles.image} />
        </View>
      
        
        <View style={styles.informationContentContainer}>
            <View style={styles.programInformationContainer}>
              <Text style={styles.programOwnerDisplayNameText}>
                  {programOwnerData.display_name}
              </Text>

            <Text style={styles.programNameText}>
            {program.program_name}
          </Text>

          <Text numberOfLines={2} style={styles.programDescriptionText}>
         {program.program_description}
          </Text>
            </View>

            <Divider/>


          <View style={styles.buttonContainer}>
                  
             <Button color="#1089ff" onPress={handleOnPress}>
                 <Text style={styles.buttonText}>
                     View Program
                 </Text>
             </Button>
         </View>
          </View>
          <ProgramInformationPreview isVisible={programModalVisible} programData={program} closeModalMethod={() => setProgramModalVisible(false)} /> 
  </Surface>
    )
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center', elevation: 10, shadowOpacity: 0.1,  borderRadius: 10, width: Dimensions.get('window').width - 70, height: 450, margin: 5, marginVertical: 15
    },
    image: {
        width: '100%', height: '100%', borderTopLeftRadius: 10, borderTopRightRadius: 10,
    },
    imageContainer: {
        flex: 4
    },
    informationContentContainer: {
        flex: 2,
    },
    programInformationContainer: {
        flex: 1, padding: 10, justifyContent: 'space-evenly'
    },
    programOwnerDisplayNameText: {
        fontSize: 12, fontWeight: '600', color: '#1089ff'
    },
    programNameText: {
        fontSize: 15, fontWeight: 'bold', fontFamily: 'avenir-roman'
    },
    programDescriptionText: {
        fontFamily: 'avenir-roman', fontSize: 10,
    },
    buttonContainer: {
        flex: 0.5, alignItems: 'center', justifyContent: 'center'
    },
    buttonText: {
        fontWeight: '400', fontFamily: 'avenir-roman', fontSize: 12
    }
})

export default LargeProgramSearchResultCard