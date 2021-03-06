import { LupaWorkoutInformationStructure } from "./common/types";

var lupa_workout_information_structure : LupaWorkoutInformationStructure = {
    workout_name: "",
    workout_structure_uuid: "",
    workout_data: {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: []
    },
    workout_days: [],
    program_owner: "",
    program_workout_structure: {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: []
    },
    program_workout_days: [],
    type: 'WORKOUT',
}

export const getLupaWorkoutInformationStructure = (
    workoutName, 
    workoutUUID, 
    workoutData = {
        Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: []
}, workoutDays, 
workoutOwner,
programWorkoutDays) => {
    lupa_workout_information_structure.workout_name =  workoutName;
    lupa_workout_information_structure.workout_structure_uuid =  workoutUUID;
    lupa_workout_information_structure.workout_data = workoutData;
    lupa_workout_information_structure.workout_days = workoutDays;
    lupa_workout_information_structure.program_owner = workoutOwner;
    lupa_workout_information_structure.program_workout_structure = workoutData;
    lupa_workout_information_structure.program_workout_days = programWorkoutDays;

    return lupa_workout_information_structure;
}