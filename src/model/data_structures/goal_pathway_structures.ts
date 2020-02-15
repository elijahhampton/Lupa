import {
    GoalPathway
} from './workout/types';

import {
    MODALITY,
    GOAL_PATHWAY_STRUCTURE_UID,
    GOAL_UID,
} from './workout/types';

export var improve_strength_metabolic_pathway : GoalPathway = {
    name: "Improve Strength",
    goal_uid: GOAL_UID.IMPROVE_STRENGTH,
    description: "description",
    modality: MODALITY.METABOLIC,
    workouts: {
        warm_up: [],
        prime_workouts: [],
        warm_down: [],
    },
    uid: GOAL_PATHWAY_STRUCTURE_UID.IMPROVE_STRENGTH_METABOLIC,
    iteration: 0
}

export var improve_strength_calisthenics_pathway : GoalPathway = {
    name: "Improve Strength",
    goal_uid: GOAL_UID.IMPROVE_STRENGTH,
    description: "description",
    modality: MODALITY.CALISTHENICS,
    workouts: {
        warm_up: [],
        prime_workouts: [],
        warm_down: [],
    },
    uid: GOAL_PATHWAY_STRUCTURE_UID.IMPROVE_STRENGTH_CALISTHENICS,
    iteration: 0
}

export var improve_strength_weightlifting_pathway : GoalPathway = {
    name: "Improve Strength",
    goal_uid: GOAL_UID.IMPROVE_STRENGTH,
    description: "description",
    modality: MODALITY.WEIGHTLIFTING,
    workouts: {
        warm_up: [],
        prime_workouts: [],
        warm_down: [],
    },
    uid: GOAL_PATHWAY_STRUCTURE_UID.IMPROVE_STRENGTH_WEIGHTLIFTING,
    iteration: 0
}

export const getPathwaysForGoalUUID = (goalUUID) => {
    switch (goalUUID)
    {
        case GOAL_UID.IMPROVE_STRENGTH:
            return [
                improve_strength_calisthenics_pathway,
                improve_strength_metabolic_pathway,
                improve_strength_weightlifting_pathway,
            ]
    }
}