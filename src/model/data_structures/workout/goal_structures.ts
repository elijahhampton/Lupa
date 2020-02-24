import { WORKOUT_MODALITY } from '../../../controller/lupa/common/types';


import {
    Goal,
    GOAL_UID,
} from './types';

export var lupa_improve_strength_goal : Goal = {
    uid: GOAL_UID.IMPROVE_STRENGTH,
    name: "Increase Strength",
    description: "Increase strength description ",
    pathways: [],
}

export var lupa_improve_power_goal : Goal = {
    uid: "hsf98h298fh2h38f",
    name: "Increase Power",
    description: "Impove power description",
    pathways: [],
}

export var lupa_improve_flexibility_goal : Goal = {
    uid: "f0928thnf3028h3ff",
    name: "Increase Flexibility",
    description: "Improve flexibility description",
    pathways: [],
}

export var lupa_improve_stamina_goal : Goal = {
    uid: "d3928thd09320d8f",
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
