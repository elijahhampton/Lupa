import React, { createRef, useEffect, useState } from 'react';

import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import { Appbar, Button, Caption, Divider } from 'react-native-paper';
import LupaController from '../../../controller/lupa/LupaController';
import { Input }  from 'react-native-elements';
import FeatherIcon from 'react-native-vector-icons/Feather'

import SearchableDropdown from 'react-native-searchable-dropdown';
import { getLupaStoreState } from '../../../controller/redux';
import LUPA_DB from '../../../controller/firebase/firebase';
import { useSelector } from 'react-redux/lib/hooks/useSelector';
import { ScrollView } from 'react-native';
import { Dimensions } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Modal } from 'react-native';

const EQUIPMENT_LIST = [
    'Medicine Ball',
    'Exercise Bands',
    'Dumbells',
    'Bodyweight',
    'Barbell',
    'Kettlebell',
    'Machine Assisted',
    'Plyometric',
    'Bench',
    'Exercise Ball',
    'Pull-Up Bar',
    'Bosu Ball',
    'Smith Machine',
    'Cables',
    'TRX Straps',
    'Hex Bar',
    'Jump Rope'
]

function AddEquipmentModal({ isVisible, closeModal, exerciseIndex, equipmentUsed }) {
    
    const [updatedEquipmentUsed, setUpdatedEquipmentUsed] = useState(equipmentUsed);
    const [searchableItems, setSearchableItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([])

    const [forceUpdate, setForceUpdate] = useState(false);
    useEffect(() => {
            async function generateSearchableItemsList() {
                for (let i = 0; i < EQUIPMENT_LIST.length; i++) {
                    let entry = {
                        name: EQUIPMENT_LIST[i],
                        id: i
                    }

                    const updatedItemsList = searchableItems;
                    updatedItemsList.push(entry);
                    setSearchableItems(updatedItemsList)
                }
            }

            generateSearchableItemsList()
    }, [])

    const renderScrollViewContent = () => {
        if (updatedEquipmentUsed.length == 0) {
            return (
                <Text style={{padding: 20,fontFamily: 'Avenir'}}>
                    Search for equipment using the drop down menu and add any you used for this exercise.
                </Text>
            )
        } else {
            return updatedEquipmentUsed.map(equipment => {
                
                return (
                    <>
                <View style={{paddingHorizontal: 20, paddingVertical: 5, width: Dimensions.get('window').width}}>
                    <Text style={{fontSize: 20}}>
                        {equipment.name}
                    </Text>
                </View>
                </>
                )
            }) 

            
        }
    }

    return (
        <Modal animationType="slide" visible={isVisible} presentationStyle="fullScreen">
            <View style={{flex: 1}}>
            <View style={styles.container}>
            <Appbar.Header style={{backgroundColor: 'white', elevation: 0}}>
                <Appbar.BackAction onPress={closeModal} />

                <Appbar.Content title="Search and Add Equipment" />

                <Appbar.Action icon={() => <FeatherIcon color="white" size={25} name="plus" />} />
            </Appbar.Header>
            <SearchableDropdown
             selectedItems={updatedEquipmentUsed}
            onItemSelect={(item) => {
              const newUpdatedEquipmentList = updatedEquipmentUsed;
              newUpdatedEquipmentList.push(item)
              setUpdatedEquipmentUsed(newUpdatedEquipmentList)
              setForceUpdate(!forceUpdate)
            }}
            containerStyle={{ padding: 5 }}
            onRemoveItem={(item, index) => {
             
            }}
            itemStyle={{
              padding: 10,
              marginTop: 2,
              backgroundColor: '#ddd',
              borderColor: '#bbb',
              borderWidth: 1,
              borderRadius: 5,
            }}
            itemTextStyle={{ color: '#222' }}
            itemsContainerStyle={{ maxHeight: 140 }}
            items={searchableItems}
            defaultIndex={2}
            resetValue={false}
            textInputProps={
              {
                placeholder: "Try Exercise Bands",
                underlineColorAndroid: "transparent",
                style: {
                    padding: 12,
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 5,
                },
                onTextChange: text => {}
              }
            }
            listProps={
              {
                nestedScrollEnabled: true,
              }
            }
        /> 
            <View style={{flex: 1}}>
                <ScrollView>
                    {renderScrollViewContent()}
                </ScrollView>
                <Button
                uppercase={false}
                onPress={() => LUPA_CONTROLLER_INSTANCE.updateCompletedExerciseEquipment(currUserData, exerciseIndex, equipmentUsed)}
                color="#23374d"
                mode="contained" 
                style={{elevation: 0, width: Dimensions.get('window').width - 20, alignSelf: 'center'}}
                theme={{roundness: 8}}
                contentStyle={{width: '100%', height: 45}}>
                    <Text>
                        Update Equipment
                    </Text>
                </Button>
            </View>
        </View>
            </View>
        </Modal>
    )
}


const ExerciseDataLog = ({ navigation, route }) => {
    const [lupaWorkouts, setLupaWorkouts] = useState([])
    const [searchableItems, setSearchableItems] = useState([])
    const [userCompletedExercises, setUserCompletedExercises] = useState([]);
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const [editedExercise, setEditedExercise] = useState({equipment_used: [], weight_used: 0, one_rep_max: 0})
    const [editedExerciseOneRepMax, setEditedExerciseOneRepMax] = useState('0');
    const [editedExerciseWeightUsed, setEditedExerciseWeightUsed] = useState('0');
    const [editedExerciseEquipmentUsed, setEditedExerciseEquipmentUsed] = useState([])
    const [addEquipmentModalVisible ,setAddEquipmentModalVisible] = useState(false);

    const editExerciseRBSheetRef = createRef();
    const openEditExerciseRBSheet = () => editExerciseRBSheetRef.current.open();
    const closeEditExerciseRBSheet = () => editExerciseRBSheetRef.current.close();

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

    useEffect(() => {
        const USER_DATA_OBSERVER = LUPA_DB.collection('users')
        .doc(currUserData.user_uuid)
        .onSnapshot(documentSnapshot => {
            const userData = documentSnapshot.data();
            setUserCompletedExercises(userData.completed_exercises);
        }, (error => {
            setUserCompletedExercises([]);
        }));

        return () => USER_DATA_OBSERVER();
    }, [])

    const handleOnPressEditExercise = async (exercise) => {
        await setEditedExercise(exercise);
        await setEditedExerciseEquipmentUsed(exercise.equipment_used)
        await setEditedExerciseWeightUsed(exercise.exercise_weight.toString())
        await setEditedExerciseOneRepMax(exercise.one_rep_max.toString())
        openEditExerciseRBSheet()
    }

    const handleOpenAddEquipmentUsedModal = async () => {
        await closeEditExerciseRBSheet();
        await setAddEquipmentModalVisible(true);
    }

    const renderEditCompletedExerciseRBSheet = () => {
        return (
            <RBSheet
            ref={editExerciseRBSheetRef}
            height={480}
            customStyles={{
                container: {
                    borderTopRightRadius: 20,
                    borderTopLeftRadius: 20
                },
                draggableIcon: {
                    backgroundColor: 'grey'
                }
            }}
            closeOnPressBack={true}
            closeOnDragDown={true}
            closeOnPressMask={true}
            >
                <View style={[styles.container, {padding: 20, justifyContent: 'space-evenly'}]}>
                    <Text style={{alignSelf: 'center', fontSize: 20, fontFamily: 'Avenir-Heavy'}}>
                        {editedExercise.exercise_name}
                    </Text>

                    <View>
                        <Text style={{fontFamily: 'Avenir-Medium'}}>
                            One Rep Max
                        </Text>
                        <Input 
                        placeholder={editedExerciseOneRepMax}
                        value={editedExerciseOneRepMax} 
                        onChangeText={text => setEditedExerciseOneRepMax(text)}
                        keyboardType="numeric"
                        returnKeyLabel="done"
                        returnKeyType="done"
                        containerStyle={{width: 100}}
                        />
                    </View>

                    <View>
                        <Text style={{fontFamily: 'Avenir-Medium'}}>
                            Weight Used (lbs)
                        </Text>
                        <Input 
                        placeholder={editedExerciseWeightUsed} 
                        value={editedExerciseWeightUsed} 
                        onChangeText={text => setEditedExerciseWeightUsed(text)}
                        keyboardType="numeric"
                        returnKeyLabel="done"
                        returnKeyType="done" 
                        containerStyle={{width: 100}}
                        />
                    </View>

                    <View style={{alignItems: 'flex-start'}}>
                    <Text style={{fontFamily: 'Avenir-Medium',  paddingVertical: 3}}>
                        Equipment Used
                    </Text>
                    <Caption style={{color: '#1089ff'}} onPress={handleOpenAddEquipmentUsedModal}>
                        Add Equipment
                    </Caption>
                    {renderEquipmentUsed(editedExerciseEquipmentUsed)}
                    </View>

                    <Button
                    onPress={() => LUPA_CONTROLLER_INSTANCE.updateCompletedExerciseStats(currUserData, exerciseID, editedExerciseWeightUsed, editedExerciseOneRepMax)}
                uppercase={false}
                onPress={() => {}}
                color="#23374d"
                mode="contained" 
                style={{elevation: 0, bottom: 0, width: Dimensions.get('window').width - 20, alignSelf: 'center'}}
                theme={{roundness: 8}}
                contentStyle={{width: '100%', height: 45}}>
                    <Text>
                        Update Exercise Data
                    </Text>
                </Button>
                </View>
                <AddEquipmentModal isVisible={addEquipmentModalVisible} closeModal={() => setAddEquipmentModalVisible(false)} equipmentUsed={editedExerciseEquipmentUsed} />
            </RBSheet>
        )
    }

    const renderEquipmentUsed = (equipmentUsedArr) => {
        if (equipmentUsedArr.length === 0) {
            return (
                <Caption>
                    You haven't recorded any equipment used for this exercise.
                </Caption>
            )
        }

        return equipmentUsedArr.map((equipment, index, arr) => {
            if (index == arr.length) {
                return (
                    <Caption>
                        and {exercise}.
                    </Caption>
                )
            }

            return (
                <Caption>
                    {equipment},
                </Caption>
            )
        })
    }

    const renderCompletedExercises = () => {
        const updatedUserCompletedExercises = getLupaStoreState().Users.currUserData.completed_exercises;

        return updatedUserCompletedExercises.map(exercise => {
            return (
                <>
                <View style={{padding: 20, width: Dimensions.get('window').width}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Text style={{fontSize: 18, fontFamily: 'Avenir-Heavy', paddingVertical: 3}}>
                        {exercise.exercise_name}
                    </Text>

                    <Button color="#23374d" style={{alignSelf: 'flex-end'}} onPress={() => handleOnPressEditExercise(exercise)}>
                        Edit Exercise
                    </Button>
                    </View>
                   
                    <Text style={{fontFamily: 'Avenir', paddingVertical: 3}}>
                        One Rep Max: {exercise.one_rep_max}
                    </Text>
                    <Text style={{fontFamily: 'Avenir',  paddingVertical: 3}}>
                        Weight Used: {exercise.exercise_weight}
                    </Text>
                    
                    
                </View>
                <Divider />
                </>
            )
        })
    }

    return (
        <View style={styles.container}>
            <Appbar.Header style={{backgroundColor: 'white', elevation: 0}}>
                <Appbar.BackAction onPress={() => navigation.pop()} />
                <Appbar.Content title="Exercise Data Log"  titleStyle={{alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: '800', fontSize: 25}} />
                <Appbar.Action icon={() => <FeatherIcon color="white" size={25} name="plus" />} />
            </Appbar.Header>
            <View style={{flex: 1}}>
                <ScrollView>
                    {renderCompletedExercises()}
                </ScrollView>
        {renderEditCompletedExerciseRBSheet()}
       
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    }
})

export default ExerciseDataLog;