import { LupaExerciseStructure } from "./common/types";

var lupa__exercise_structure : LupaExerciseStructure = {
    workout_name: '',
    workout_description: '',
    workoutMedia: {
        media_type: '',
        uri: '',
    },
    workout_reps: 0,
    workout_sets: 0,
    workout_uid: '',
    workout_tempo: '0-0-0',
    workout_rest_time: 0,
    workout_day: '',
    superset: [],
}

export function getLupaExerciseStructure(exerciseName, exerciseDescription, exerciseDay, exerciseUUID) {
    lupa__exercise_structure.workout_name = exerciseName;
    lupa__exercise_structure.workout_description = exerciseDescription;
    lupa__exercise_structure.workout_uid = exerciseUUID;
    lupa__exercise_structure.workout_day = exerciseDay;
    return lupa__exercise_structure;
}