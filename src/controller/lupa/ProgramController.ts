/**
 * 
 */

import LUPA_DB, { LUPA_AUTH } from '../firebase/firebase.js';
import WorkoutController from './WorkoutController';
import { getLupaProgramInformationStructure } from '../../model/data_structures/programs/program_structures.js';

const PROGRAM_COLLECTION = LUPA_DB.collection('programs');
const USERS_COLLECTION = LUPA_DB.collection('users');

export default class ProgramController extends WorkoutController {
    private static _instance: ProgramController;

    private constructor() {
        super()
    }

    public static getInstance = () => {
        if (!ProgramController._instance) {
            ProgramController._instance = new ProgramController();
            return ProgramController._instance;
        }

        return ProgramController._instance;
    }

    /**
     * Returns an object representing a Lupa Program
     * See LupaProgramStructure
     * 
     * @return Object representing a LupaProgramStructure
     */
    getProgramInformationFromUUID = async (uuid) => {
        let programData = getLupaProgramInformationStructure()

        try {
            await PROGRAM_COLLECTION.doc(uuid).get().then(snapshot => {
                programData = snapshot.data();
            })
        } catch(error) {
            return Promise.resolve(programData);
        }

        return Promise.resolve(programData);
    }

    updateProgramData = (programUUID, programData) => {
        const docRef = PROGRAM_COLLECTION.doc(programUUID);
        docRef.set(programData);
    }

    updateProgramWorkoutData = (programUUID, workoutData) => {
        const docRef = PROGRAM_COLLECTION.doc(programUUID);
        docRef.update({
            program_workout_structure: workoutData
        })
    }
    
}