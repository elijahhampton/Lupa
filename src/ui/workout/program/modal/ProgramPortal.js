import React, { useEffect, useState } from 'react';
import { Modal, View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Appbar, Button, Caption, Divider } from 'react-native-paper';
import LupaController from '../../../../controller/lupa/LupaController';
import { getLupaProgramInformationStructure } from '../../../../model/data_structures/programs/program_structures';

const daysOfTheWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
]

const ProgramPortal = ({ program }) => {
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    const [programData, setProgramData] = useState(getLupaProgramInformationStructure);

    useEffect(() => {
        async function a() {
            await LUPA_CONTROLLER_INSTANCE.getProgramInformationFromUUID('YF9pwpAFhRfvvPWL2IBJ').then(data => {
                console.log(data)
                setProgramData(data);
            });
        }

        a();

    }, []);

    const renderWorkoutContent = () => {
        return (
        <View style={{flex: 1}}>
            {
                programData.program_workout_structure.map((weekStructure, index, arr) => {
                    return (
                        <>
                       <View style={{padding: 10}}>
                           <Text style={style.weekHeaderText}>
                               Week {index + 1}
                           </Text>
                            {
                                daysOfTheWeek.map(day => {
                                    return (
                                        <View style={{marginVertical: 5}}>
                                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                            <Text style={style.dayHeaderText}>
                                                {day}
                                            </Text>
                                            <Button uppercase={false}>
                                                <Text style={{fontSize: 12}}>
                                                    Launch Workout
                                                </Text>
                                            </Button>
                                            </View>
                                           
                                            <View>
                                                {
                                                    weekStructure[day].length == 0 ?
                                                    <Caption>
                                                        There are no exercises set on this day.
                                                    </Caption>
                                                    :
                                                    weekStructure[day].map(exercise => {
                                                        return (
                                                            <View style={{paddingVertical: 5}}>
                                                                <Text style={style.exerciseHeaderText}>
                                                                    {exercise.workout_name}
                                                                </Text>
                                                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                                    <Text style={style.metadataText}>
                                                                    Sets: {exercise.workout_sets}
                                                                    </Text>
                                                                    <Text>
                                                                        {" "}
                                                                    </Text>
                                                                    <Text style={style.metadataText}>
                                                                    Reps: {exercise.workout_reps}
                                                                    </Text>
                                                                </View>  
                                                            </View>
                                                        )
                                                    })
                                                }
                                            </View>
                                        </View>

                                    )
                                })
                            }
                        </View>
                        <Divider />
                        </>
                    )
                })
            }
        </View>
        )
    }

    return (
        <Modal presentationStyle="fullScreen" visible={true}>
            <Appbar.Header style={{backgroundColor: 'white', elevation: 0}}>
                <Appbar.Content title={programData.program_name} />
            </Appbar.Header>
            <ScrollView>
            {renderWorkoutContent()} 
            <Button mode="text" color="#1089ff" onPress={() => alert('Share modal')}>
                Share this program with a friend
            </Button>
            </ScrollView>
        </Modal>
    )
}

const style = StyleSheet.create({
    weekHeaderText: {
        fontSize: 16,
        fontWeight: '700'
    },
    exerciseHeaderText: {
        fontSize: 15,
        fontWeight: '400'
    },
    metadataText: {
        color: '#AAAAAA',
        fontSize: 13
    },
    dayHeaderText: {
        fontSize: 13,
        fontWeight: '700'
    }
})

export default ProgramPortal