/**
 * 
 */

import LUPA_DB, { LUPA_AUTH } from '../firebase/firebase.js';

const WORKOUT_COLLECTION = LUPA_DB.collection('workouts');

export default class WorkoutController {

    loadWorkouts = () => {
        const WORKOUTS = require('../../model/data_structures/workout/json/workouts.json')
        return WORKOUTS.lupa_workouts;
    }
}