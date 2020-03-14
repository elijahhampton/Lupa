import {
    GoalPathway
} from './common/types';

import {
    MODALITY,
    GOAL_PATHWAY_STRUCTURE_UID,
    GOAL_UID,
} from './common/types';


/** IMPROVE STRENGTH GOAL PATHWAYS  */
export var improve_strength_metabolic_pathway : GoalPathway = {
    name: "Improve Strength",
    goal_uid: GOAL_UID.IMPROVE_STRENGTH,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
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
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
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
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    modality: MODALITY.WEIGHTLIFTING,
    workouts: {
        warm_up: [],
        prime_workouts: ['WMT8VpdRAxvjwiIyBBGx'],
        warm_down: [],
    },
    uid: GOAL_PATHWAY_STRUCTURE_UID.IMPROVE_STRENGTH_WEIGHTLIFTING,
    iteration: 0
}

/** IMPROVE POWER GOAL PATHWAYS */
export var improve_power_calisthenics_pathway : GoalPathway = {
    name: "Improve Power",
    goal_uid: GOAL_UID.IMPROVE_POWER,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    modality: MODALITY.CALISTHENICS,
    workouts: {
        warm_up: [],
        prime_workouts: [],
        warm_down: [],
    },
    uid: GOAL_PATHWAY_STRUCTURE_UID.IMPROVE_POWER_CALISTHENICS,
    iteration: 0
}

export var improve_power_weightlifting_pathway : GoalPathway = {
    name: "Improve Power",
    goal_uid: GOAL_UID.IMPROVE_POWER,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    modality: MODALITY.WEIGHTLIFTING,
    workouts: {
        warm_up: [],
        prime_workouts: [],
        warm_down: [],
    },
    uid: GOAL_PATHWAY_STRUCTURE_UID.IMPROVE_POWER_WEIGHTLIFTING,
    iteration: 0
}

/** IMPROVE FLEXIBILITY pathways */
export var improve_flexibility_calisthenics_pathway : GoalPathway = {
    name: "Improve Flexibility",
    goal_uid: GOAL_UID.IMPROVE_FLEXIBILITY,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    modality: MODALITY.CALISTHENICS,
    workouts: {
        warm_up: [],
        prime_workouts: [],
        warm_down: [],
    },
    uid: GOAL_PATHWAY_STRUCTURE_UID.IMPROVE_FLEXIBILITY_CALISTHENICS,
    iteration: 0
}

export var improve_flexibility_weightlifting_pathway : GoalPathway = {
    name: "Improve Flexibility",
    goal_uid: GOAL_UID.IMPROVE_FLEXIBILITY,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    modality: MODALITY.WEIGHTLIFTING,
    workouts: {
        warm_up: [],
        prime_workouts: [],
        warm_down: [],
    },
    uid: GOAL_PATHWAY_STRUCTURE_UID.IMPROVE_FLEXIBILITY_WEIGHTLIFTING,
    iteration: 0
}

/** IMPROVE STAMINA PATHWAYS */
export var improve_stamina_calisthenics_pathway : GoalPathway = {
    name: "Improve Stamina",
    goal_uid: GOAL_UID.IMPROVE_STAMINA,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    modality: MODALITY.CALISTHENICS,
    workouts: {
        warm_up: [],
        prime_workouts: [],
        warm_down: [],
    },
    uid: GOAL_PATHWAY_STRUCTURE_UID.IMPROVE_STAMINA_CALISTHENICS,
    iteration: 0
}

export var improve_stamina_weightlifting_pathway : GoalPathway = {
    name: "Improve Stamina",
    goal_uid: GOAL_UID.IMPROVE_STAMINA,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    modality: MODALITY.WEIGHTLIFTING,
    workouts: {
        warm_up: [],
        prime_workouts: [],
        warm_down: [],
    },
    uid: GOAL_PATHWAY_STRUCTURE_UID.IMPROVE_STAMINA_WEIGHTLIFTING,
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
        case GOAL_UID.IMPROVE_POWER:
            return [
                improve_power_calisthenics_pathway,
                improve_power_weightlifting_pathway,
            ]
        case GOAL_UID.IMPROVE_FLEXIBILITY:
            return [
                improve_flexibility_calisthenics_pathway,
                improve_flexibility_weightlifting_pathway,
            ]
        case GOAL_UID.IMPROVE_STAMINA:
            return [
                improve_stamina_calisthenics_pathway,
                improve_stamina_weightlifting_pathway,
            ]
    }
}