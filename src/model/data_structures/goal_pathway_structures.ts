import {
    GoalPathway
} from './workout/types';

export enum MODALITY {
    METABOLIC="metabolic",
    CALISTHENICS="calisthenics",
    WEIGHTLIFTING="weightlifting",
}

export var improve_strength_metabolic_pathway : GoalPathway = {
    name: "Improve Strength",
    goal_uid: "sf928hf3928h0ie",
    description: "description",
    modality: MODALITY.METABOLIC,
    workouts: {
        warm_up: [],
        prime_workouts: [],
        warm_down: [],
    },
    uid: "dj928933hfoifjf",
    iteration: 0
}

export var improve_strength_calisthenics_pathway : GoalPathway = {
    name: "Improve Strength",
    goal_uid: "sf928hf3928h0ie",
    description: "description",
    modality: MODALITY.CALISTHENICS,
    workouts: {
        warm_up: [],
        prime_workouts: [],
        warm_down: [],
    },
    uid: "jf892h938n2f3hf39hf",
    iteration: 0
}

export var improve_strength_weightlifting_pathway : GoalPathway = {
    name: "Improve Strength",
    goal_uid: "sf928hf3928h0ie",
    description: "description",
    modality: MODALITY.WEIGHTLIFTING,
    workouts: {
        warm_up: [],
        prime_workouts: [],
        warm_down: [],
    },
    uid: "93ukfof3h4f984hf32d",
    iteration: 0
}

export const getPathwaysForGoalUUID = (goalUUID) => {
    switch (goalUUID)
    {
        case "sf928hf3928h0ie":
            return [
                improve_strength_calisthenics_pathway,
                improve_strength_metabolic_pathway,
                improve_strength_weightlifting_pathway,
            ]
    }
}