import React, { useEffect, useState } from 'react'

import {
    View,
    SafeAreaView,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native'

import {
    Card,
    Button,
    IconButton,
} from 'react-native-paper'

import { useSelector } from 'react-redux'
import LupaController from '../controller/lupa/LupaController'
import FeatherIcon from 'react-native-vector-icons/Feather'
import ProgramOptionsModal from './workout/program/modal/ProgramOptionsModal'
import { getLupaProgramInformationStructure } from '../model/data_structures/programs/program_structures'

function MyPrograms(props) {
    const [programOptionsModalIsVisible, setProgramOptionsModalIsVisible] = useState(false)
    const [currentProgram, setCurrentProgram] = useState(getLupaProgramInformationStructure())
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance()

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })


    const handleCardOnPress = (program) => {
        setCurrentProgram(program)
        setProgramOptionsModalIsVisible(true)
    }

    const renderPrograms = () => {
        return currUserData.program_data.map((program, index, arr) => {
            return (
                <Card key={index} style={{elevation: 3, width: '92%', marginVertical: 10}} onPress={() => handleCardOnPress(program)}>
                <Card.Cover source={{ uri: program.program_image }} />
                <Card.Actions style={{justifyContent: 'space-between', paddingVertical: 10}}>
                    <Text style={{fontSize: 15, fontFamily: 'HelveticaNeue'}}>
                        {program.program_name}
                    </Text>

                    <FeatherIcon name="more-vertical" size={20} onPress={() => setProgramOptionsModalIsVisible(true)} />
                </Card.Actions>
              </Card>
            )
        })

    }

    return (
        <SafeAreaView style={styles.root}>
                {renderPrograms()}
            <ProgramOptionsModal program={currentProgram} closeModal={() => setProgramOptionsModalIsVisible(false)} isVisible={programOptionsModalIsVisible} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    }
})

export default MyPrograms;