import React, { useState, createRef } from 'react';
import {useSelector } from 'react-redux';

import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    TouchableWithoutFeedback
} from 'react-native';

import {
    Surface,
} from 'react-native-paper';

import ProgramInformationPreview from '../ProgramInformationPreview';
import ProgramOptionsModal from '../modal/ProgramOptionsModal';

function ProfileProgramCard({ programData }) {
    const [programModalVisible, setProgramModalVisible] = useState(false);
    const [programOptionsVisible, setProgramOptionsModalVisible] = useState(false);
    
    const programPreviewRef = createRef();
    const openProgramPreview = () => programPreviewRef.current.open();
    const closeProgramPreview = () => programPreviewRef.current.close();

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    });

    const handleOnPress = () => {

        if (programData.program_participants.includes(currUserData.user_uuid))
        {
            setProgramOptionsModalVisible(true);
        }
        else
        {
            setProgramModalVisible(true);
        }
    }

    return (
        <View style={styles.contentContainer}>
        <TouchableWithoutFeedback onPress={handleOnPress}>
        <Surface style={styles.container}>
        <View style={styles.imageContainer}>
        <Image source={{uri: programData.program_image}} style={styles.image} />
        </View>
        <View style={styles.informationContentContainer}>
            <View style={styles.programInformationContainer}>
            <Text style={styles.programNameText}>
            {programData.program_name}
            </Text>
          <Text numberOfLines={2} style={styles.programDescriptionText}>
         {programData.program_description}
          </Text>
            </View>
          </View>
        </Surface>
      </TouchableWithoutFeedback>
      <ProgramInformationPreview ref={programPreviewRef} program={programData} /> 
      <ProgramOptionsModal program={programData} isVisible={programOptionsVisible} closeModal={() => setProgramOptionsModalVisible(false)} />
      </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center', elevation: 3, shadowOpacity: 0.1,  borderRadius: 10, width: Dimensions.get('window').width - 70, height: 200, margin: 5, marginVertical: 15
    },
    contentContainer: {
        width: '100%', alignSelf: 'center', marginHorizontal: 20
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
        fontFamily: 'avenir-roman', fontSize: 10, flexWrap: 'nowrap'
    },
    buttonContainer: {
        flex: 0.5, alignItems: 'center', justifyContent: 'center'
    },
    buttonText: {
        fontWeight: '400', fontFamily: 'avenir-roman', fontSize: 12
    }
})
export default ProfileProgramCard;