import { LupaUserStructure } from "../../../../controller/lupa/common/types"
import { LupaProgramInformationStructure } from "../../programs/common/types"

export  type LupaWorkoutInformationStructure = {
    workout_name: String,
    workout_structure_uuid: String,
    workout_data: Object,
    workout_days: Array<String>,
    program_owner: String,
    program_workout_structure: Object,
    program_workout_days: Array<String>,
    type: String,
}

export type LupaExerciseStructure = {
    workout_name: String,
    workout_description: String,
    workoutMedia: Object,
    workout_sets: Number,
    workout_reps: Number,
    superset: Array<Object>,
    workout_uid: String,
    workout_tempo: String,
    workout_rest_time: Number,
    workout_day: String,
}

export type LiveWorkoutSession = {
    program: LupaProgramInformationStructure,
    participants: Array<LupaUserStructure>
}