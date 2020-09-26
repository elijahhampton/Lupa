import React, { useEffect, useState } from 'react'

import {
    View,
    SafeAreaView,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions
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
import { useNavigation } from '@react-navigation/native'
import LUPA_DB from '../controller/firebase/firebase'

function MyPrograms(props) {
    const [programOptionsModalIsVisible, setProgramOptionsModalIsVisible] = useState(false)
    const [currentProgram, setCurrentProgram] = useState(getLupaProgramInformationStructure())
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance()
    const [programs, setProgramsList] = useState([])
    const navigation = useNavigation();

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })


    const handleCardOnPress = (program) => {
        setCurrentProgram(program)
        setProgramOptionsModalIsVisible(true)
    }

    useEffect(() => {
        const currUserProgramsObserver = LUPA_DB.collection('programs').onSnapshot(querySnapshot => {
           let userPrograms = []
            querySnapshot.docs.forEach(doc => {
                let document = doc.data();

                if (typeof(document) == 'undefined' || document.completedProgram == false || document.program_owner != currUserData.user_uuid) {

                } else {
                    userPrograms.push(document);
                }
                
            });

            setProgramsList(userPrograms);
        });

        return () => currUserProgramsObserver();
    }, [])

    const renderPrograms = () => {
        return programs.map((program, index, arr) => {
            /*
            * TODO: There is a problem where programs are deleted from the users program_data if
            * if they do not publish the program.  For now we will check to not render programs that don't have completedPrograms as true 
            */
            if (typeof(program) == 'undefined' || program.completedProgram == false || typeof(program.completedProgram) == 'undefined') {
                return;
            }
            
            return (
                <Card key={program.program_structure_uuid} style={{elevation: 3, width: Dimensions.get('window').width - 20, marginVertical: 10}} onPress={() => handleCardOnPress(program)}>
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
           {
               programs.length === 0 ?
               <View style={{height: 200,  alignItems: 'center', justifyContent: 'center', width: '100%', paddingHorizontal: 20}}>
                <Text style={{color: 'rgb(116, 126, 136)', fontFamily: 'Avenir-Medium', fontSize: 15, fontWeight: '800'}}>
                    <Text>
                        You haven't created any programs.{" "}
                    </Text>
                    <Text onPress={() => navigation.push('CreateProgram', {

                    })} style={{color: '#1089ff', fontWeight: '400'}}>
                        Get started with your first.
                    </Text>
                </Text>
            </View>
               :
               <ScrollView 
                contentContainerStyle={{
                    alignItems: 'center', 
                }}>
                    {renderPrograms()}
               </ScrollView>
           } 

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