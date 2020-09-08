import React, { useState } from 'react';

import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    ScrollView,
} from 'react-native';

import {
    Appbar,
    Caption,
    Button,
    Divider,
    Surface 
} from 'react-native-paper';

import FeatherIcon from 'react-native-vector-icons/Feather'

import DropDownPicker from 'react-native-dropdown-picker';
import WorkoutDisplay from './WorkoutDisplay';


function AddSets({ structureID, workoutDays, programWorkoutDays, goToIndex, saveProgramWorkoutData }) {
    let items = [];
    const [currDayIndex, setCurrDayIndex] = useState(0);

    const getCurrentDay = () => {
        if (typeof(programWorkoutDays) == 'undefined') {
            return "Undefined"
        }

        const currIndex = currDayIndex;
        return programWorkoutDays[currIndex]
    }

    const saveWorkoutData = () => {
        saveProgramWorkoutData(workoutDays);
    }

    const renderWorkoutData = () => {
        if (typeof(workoutDays) == 'undefined') {
            return (
                <View style={{flex: 1, backgroundColor: 'red', alignItems: 'center', justifyContent: 'center'}}>

                </View>
            )
        }

        return (
            <View style={{flex: 1,  alignItems: 'center', justifyContent: 'center'}}>
            <ScrollView>
                {
                workoutDays[getCurrentDay()].map((workout, index, arr) => {
                    
                     return (
                         <>
                         <Text style={{fontSize: 20, fontWeight: 'bold', padding: 10, fontFamily: 'Avenir-Medium'}}>
                             Superset {index + 1}
                         </Text>

                        <WorkoutDisplay workout={workout} />
                        </>
                    )
                })
                }
            </ScrollView>
            </View>
        )
    }

    return (
        <View style={{flex: 1, backgroundColor: 'white'}}>
               <Appbar.Header style={[styles.appbar, {height: 'auto',  paddingVertical: 10}]}>
                    <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Button color="white" uppercase={false} onPress={() => goToIndex(0)}>
                        Back
                    </Button>

                    <Button color="white" uppercase={false} onPress={() => saveWorkoutData(workoutDays)}>
                        Finish
                    </Button>
                    </View>

                    <View style={{justifyContent: 'flex-start', width: '100%', padding: 10}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Text style={{  color: 'white', fontWeight: 'bold', fontFamily: 'Avenir-Heavy', fontSize: 25}}>
                        Add Sets and Reps
                    </Text>
                    <View>
                        <FeatherIcon name="search" size={24} color="white" />
                    </View>
                    </View>
                   
                    <Caption style={{color: 'white'}}>
                        Go through each of your exercises and modify the sets and reps.
                    </Caption>
                    </View>
                </Appbar.Header>
{
                    
                     programWorkoutDays.map((day, index, arr) => {
                        let item = {
                            label: day,
                            value: day,
                            index: index
                        }
            
                        items.push(item)
                    })
                }

                <DropDownPicker
                                    items={items}
                                    defaultValue={getCurrentDay()}
                                    containerStyle={{ marginVertical: 10, height: 45, width: Dimensions.get('window').width }}
                                    style={{ backgroundColor: '#fafafa', marginHorizontal: 20 }}
                                    itemStyle={{
                                         fontSize: 12,
                                        justifyContent: 'flex-start'
                                    }}
                                    dropDownStyle={{ backgroundColor: '#fafafa' }}
                                    onChangeItem={item => setCurrDayIndex(item.index)}
                                />
            <Divider />

            {renderWorkoutData()}
                
        </View>
    )
}

const styles = StyleSheet.create({
    appbar: {
        backgroundColor: '#1089ff',
        elevation: 3,
        flexDirection: 'column',
    },
})

export default AddSets;