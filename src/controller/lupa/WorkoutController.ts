/**
 * 
 */

import LUPA_DB, { LUPA_AUTH } from '../firebase/firebase.js';

const WORKOUT_COLLECTION = LUPA_DB.collection('workouts');

export default class WorkoutController {

    loadWorkouts = async () => {
        let workouts = [];
        const WORKOUTS = require('../../model/data_structures/workout/json/workouts.json')
        return Promise.resolve(WORKOUTS.lupa_workouts);
    }
}