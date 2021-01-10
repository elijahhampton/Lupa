import React, { useEffect, useState } from 'react'

import {
    View,
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
import EditProgramWorkouts from './workout/program/createprogram/buildworkout/EditProgramWorkouts'

function MyPrograms(props) {
    const [programOptionsModalIsVisible, setProgramOptionsModalIsVisible] = useState(false)
    const [currentProgram, setCurrentProgram] = useState(getLupaProgramInformationStructure())
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance()
    const [programs, setProgramsList] = useState([])
    const navigation = useNavigation();

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })


    const handleCardOnPress = async (program) => {
        if (typeof(program) == 'undefined') {
            return;
        }

        await setCurrentProgram(program)
        setProgramOptionsModalIsVisible(true)
    }

    useEffect(() => {
        const currUserProgramsObserver = LUPA_DB.collection('programs').where('program_owner', '==', currUserData.user_uuid).onSnapshot(querySnapshot => {
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
                <View style={{width: Dimensions.get('window').width - 20, margin: 20, alignSelf: 'center'}}>
                <Card key={program.program_structure_uuid} style={{elevation: 3, width: '100%', alignSelf: 'center'}} onPress={() => handleCardOnPress(program)}>
                <Card.Cover source={{ uri: program.program_image }} />
                <Card.Actions style={{justifyContent: 'center', paddingVertical: 10}}>
                    <Text style={{fontSize: 15, fontFamily: 'Avenir-Medium', alignSelf: 'center'}}>
                        {program.program_name}
                    </Text>
                </Card.Actions>
              </Card>
              </View>
            )
        })

    }

    const renderComponentDisplay = () => {
        if (programs.length === 0) {
            return (
            <View style={{height: 200, alignItems: 'center', justifyContent: 'center', width: '100%', paddingHorizontal: 10}}>
                <Text style={{color: 'rgb(116, 126, 136)', fontFamily: 'Avenir-Medium', fontSize: 16, fontWeight: '800'}}>
                    <Text>
                        You haven't created any programs.{" "}
                    </Text>
                    <Text onPress={() => navigation.push('CreateProgram')} style={{color: '#1089ff', fontSize: 16, fontFamily: 'Avenir-Medium', fontWeight: '800'}}>
                        Get started with your first.
                    </Text>
                </Text>
            </View>
            )
        } else {
            return (
                <View>
                    <ScrollView>
                    {renderPrograms()}
                    </ScrollView>
               </View>
            )
        }
    }

    return (
        <View style={styles.root}>
            {renderComponentDisplay()}
            <ProgramOptionsModal program={currentProgram} closeModal={() => setProgramOptionsModalIsVisible(false)} isVisible={programOptionsModalIsVisible} />
        </View>
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