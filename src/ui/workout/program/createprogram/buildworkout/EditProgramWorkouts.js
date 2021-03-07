import React from 'react';

import {
    Modal,
} from 'react-native';

import LupaController from '../../../../../controller/lupa/LupaController';
import BuildWorkoutController from './BuildWorkoutController';
import { useNavigation } from '@react-navigation/native';
import LOG from '../../../../../common/Logger';


/**
 * @author Elijah Hampton
 * EditProgramWorkouts
 */

 const EditProgramWorkouts = ({ isVisible, closeModal, programData}) => {
    const navigation = useNavigation();
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    saveProgramWorkoutData = (workoutData, numWorkoutsAdded, equipmentList) => {
        LOG('CreateProgram.js', 'Updating workout data for program: ' + programData.program_structure_uuid);
        LUPA_CONTROLLER_INSTANCE.updateProgramWorkoutData(programData.program_structure_uuid, workoutData, numWorkoutsAdded, equipmentList)
        closeModal()
    }

    return (
        <Modal 
        visible={isVisible}
        presentationStyle="fullScreen" 
        animationType="slide"
        >
        <BuildWorkoutController
        isEditing={true}
        closeModal={closeModal}
        navigation={navigation} 
        programData={programData} 
        program_workout_days={programData.program_workout_days}
        goToIndex={() => {}} 
        saveProgramWorkoutData={(workoutData, numWorkoutsAdded, equipmentList) => saveProgramWorkoutData(workoutData, numWorkoutsAdded, equipmentList)} 
         />
        </Modal>
    )
 }  


export default EditProgramWorkouts;