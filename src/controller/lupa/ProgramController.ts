/**
 * 
 */

import LUPA_DB, { LUPA_AUTH } from '../firebase/firebase.js';
import WorkoutController from './WorkoutController';

const PROGRAM_COLLECTION = LUPA_DB.collection('programs');

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
    
}