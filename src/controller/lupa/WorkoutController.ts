/**
 * 
 */

import LUPA_DB, { LUPA_AUTH } from '../firebase/firebase.js';

const WORKOUT_COLLECTION = LUPA_DB.collection('workouts');

export default class WorkoutController {
    private static _instance: WorkoutController;

    private constructor() {

    }

    public static getInstance = () => {
        if (!WorkoutController._instance) {
            WorkoutController._instance = new WorkoutController();
            return WorkoutController._instance;
        }

        return WorkoutController._instance;
    }

    getWorkoutDataFromUUID = async (uuid) => {
        let workoutData;
        await WORKOUT_COLLECTION.doc(uuid).get().then(async result => {
            workoutData = await result.data();
        });

        return Promise.resolve(workoutData);
    }
}