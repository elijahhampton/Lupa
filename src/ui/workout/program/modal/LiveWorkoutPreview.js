import React, { useState } from 'react'

import {
    StyleSheet,
    View,
    Text,
    Modal,
    SafeAreaView,
    ImageBackground
} from 'react-native'

import FeatherIcon from 'react-native-vector-icons/Feather'

import { Chip, Appbar, ActivityIndicator} from 'react-native-paper'
import { Constants } from 'react-native-unimodules'
import ProgramInformationPreview from '../ProgramInformationPreview'
import { titleCase } from '../../../common/Util'

function LiveWorkoutPreview({ program, isVisible, closeModal }) {
    const [programInformationPreviewIsVisible, setProgramInformationVisible] = useState(false)
    const renderProgramName = (text) => {
        return titleCase(text)
}
    return (
        <Modal style={styles.container} visible={isVisible} presentationStyle="fullScreen" animated={true} animationType="fade">

            <ImageBackground style={styles.container} imageStyle={{width: '100%', height: '100%',}} resizeMethod="scale" resizeMode="cover"  source={{ uri: program.program_image }}>
            

            <ActivityIndicator animating={true} color="#FFFFFF" size="large"/>
            </ImageBackground>

            <View style={{...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)'}} />
            <Chip mode="flat" style={styles.chip} textStyle={styles.chipTextStyle} onPress={() => setProgramInformationVisible(true)}>
                Learn more about {renderProgramName(program.program_name)}
                </Chip>
           
            <View style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: Constants.statusBarHeight, alignSelf: 'center', backgroundColor: 'rgba(58, 58, 60, 0.5)', borderRadius: 45, width: 45, height: 45, borderWidth: 1, borderColor: '#FFFFFF' }}>
                                                                <FeatherIcon thin={true}  onPress={closeModal} name="x" color="white" size={20} style={{ alignSelf: 'center' }} />
                                                            </View>

        <ProgramInformationPreview isVisible={programInformationPreviewIsVisible} programData={program} closeModalMethod={() => setProgramInformationVisible(false)} /> 
        </Modal>
    )
}

const styles = StyleSheet.create({
    appbar: {
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#212121'
    },
    mediaContent: {
        flex: 1,
        
        alignItems: 'center',
        justifyContent: 'center'
    },
    chip: {
        elevation: 10,
        position: 'absolute',
        bottom: Constants.statusBarHeight + 80,
        alignSelf: 'center',
        backgroundColor: '#1089ff'
    },
    chipTextStyle: {
        color: '#FFFFFF',
        fontWeight: 'bold'
    }
})

export default LiveWorkoutPreview