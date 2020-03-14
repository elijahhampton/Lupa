import {
    Goal,
    GOAL_UID,
} from './common/types';

export var lupa_improve_strength_goal : Goal = {
    uid: GOAL_UID.IMPROVE_STRENGTH,
    name: "Increase Strength",
    description: "Increase strength description ",
    pathways: [],
}

export var lupa_improve_power_goal : Goal = {
    uid: GOAL_UID.IMPROVE_POWER,
    name: "Increase Power",
    description: "Impove power description",
    pathways: [],
}

export var lupa_improve_flexibility_goal : Goal = {
    uid: GOAL_UID.IMPROVE_FLEXIBILITY,
    name: "Increase Flexibility",
    description: "Improve flexibility description",
    pathways: [],
}

export var lupa_improve_stamina_goal : Goal = {
    uid: GOAL_UID.IMPROVE_STAMINA,
    name: "Increase Stamina",
    description: "Increase stamina description",
    pathways: [],
}

export const getAllGoalStructures = () => {
    return [
        lupa_improve_strength_goal,
        lupa_improve_flexibility_goal,
        lupa_improve_power_goal,
        lupa_improve_stamina_goal,
    ];
}
