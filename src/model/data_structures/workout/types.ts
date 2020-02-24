export type GoalPathway = {
    name: String,
    goal_uid: String,
    description: String,
    modality: Object,
    workouts: {
        warm_up: Array<Workout>,
        prime_workouts: Array<Workout>,
        warm_down: Array<Workout>,
    },
    uid: String,
    iteration: Number
}

export type Workout = {
    workout_name: String,
    workout_description: String,
    workout_steps: Array<String>,
    workout_uid: String,
    workout_modalities: Array<String>,
    workout_tags: Array<String>,
}

export type Goal = {
    uid: String,
    name: String,
    description: String,
    pathways: Array<GoalPathway>,
}

export enum MODALITY {
    METABOLIC="metabolic",
    CALISTHENICS="calisthenics",
    WEIGHTLIFTING="weightlifting",
}


export enum GOAL_PATHWAY_STRUCTURE_UID {
    IMPROVE_STRENGTH_METABOLIC="dj928933hfoifjf",
    IMPROVE_STRENGTH_CALISTHENICS="jf892h938n2f3hf39hf",
    IMPROVE_STRENGTH_WEIGHTLIFTING="93ukfof3h4f984hf32d",
}

export enum GOAL_UID {
    IMPROVE_STRENGTH="sf928hf3928h0ie",
}


