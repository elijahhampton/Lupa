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

    /**
     * Returns an object with three arrays { [warm ups], [prime workotus], [post workouts]}
     */
    getWorkoutsFromModalityByType = async (modality) => {
        let workoutsArr = [];
        let warmupsArr = [], primeWorkoutsArr = [], postWorkoutsArr = [];
        await WORKOUT_COLLECTION.where('workout_tags', 'array-contains', modality).get().then(docs => {
            docs.forEach(doc => {
                let data = doc.data();
                workoutsArr.push(data);
            })
        });

        await workoutsArr.forEach(workout => {
            if (workout.workout_tags.includes('warm up'))
            {
                warmupsArr.push(workout);
            }

            if (workout.workout_tags.includes('prime workout'))
            {
                primeWorkoutsArr.push(workout);
            }

            if (workout.workout_tags.includes('post workout'))
            {

                postWorkoutsArr.push(workout);
            }
        });

        let workoutData = {
            warmUps: warmupsArr,
            primeWorkouts: primeWorkoutsArr,
            postWorkouts: postWorkoutsArr
        }

        return Promise.resolve(workoutData);
    }
}