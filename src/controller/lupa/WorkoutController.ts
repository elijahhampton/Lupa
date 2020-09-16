/**
 * 
 */

import LUPA_DB, { LUPA_AUTH } from '../firebase/firebase.js';

const WORKOUT_COLLECTION = LUPA_DB.collection('workouts');

export default class WorkoutController {

    loadWorkouts = () => {
        const WORKOUTS = require('../../model/data_structures/workout/json/workouts.json')
        const allWorkouts = {
            lupa_workouts: WORKOUTS.lupa_workouts,
            lower_workouts: WORKOUTS.lower_workouts,
            upper_workouts: WORKOUTS.upper_workouts,
            core_workouts: WORKOUTS.core_workouts
        };
        return allWorkouts;
    }
}