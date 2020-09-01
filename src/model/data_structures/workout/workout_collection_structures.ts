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
    workout_owner: "",
}

export const getLupaWorkoutInformationStructure = (
    workoutName = "", 
    workoutUUID = "", 
    workoutData = {
        Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: []
}, workoutDays = [], workoutOwner = "") => {
    lupa_workout_information_structure.workout_name =  workoutName;
    lupa_workout_information_structure.workout_structure_uuid =  workoutUUID;
    lupa_workout_information_structure.workout_data = workoutData;
    lupa_workout_information_structure.workout_days = workoutDays;
    lupa_workout_information_structure.workout_owner = workoutOwner;

    return lupa_workout_information_structure;
}