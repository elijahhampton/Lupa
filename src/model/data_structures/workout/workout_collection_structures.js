"use strict";
exports.__esModule = true;
var lupa_workout = {
    workout_name: '',
    workout_description: '',
    workout_steps: [],
    workout_uid: '',
    workout_modalities: [],
    workout_tags: []
};
var getWorkoutStructure = function (workout_name, workout_description, workout_steps, workout_uid, workout_modalities, workout_tags) {
    lupa_workout.workout_name = workout_name;
    lupa_workout.workout_description = workout_description;
    lupa_workout.workout_steps = workout_steps;
    lupa_workout.workout_uid = workout_uid;
    lupa_workout.workout_modalities = workout_modalities;
    lupa_workout.workout_tags = workout_tags;
    return lupa_workout;
};
exports.getWorkoutStructure = getWorkoutStructure;
