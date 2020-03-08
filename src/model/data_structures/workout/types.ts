import {v4 as uuidv4 } from 'uuid'; //Generating UUIDS randomly can be a problem if we want to compare users pathways by UUIDS..
import {v5 as uuidv5 } from 'uuid';  //We could generate UUIDS by a string, but this would have to stay consistent with no inconsistencies

export type GoalPathway = {
    name: String,
    goal_uid: String,
    description: String,
    modality: Object,
    workouts: {
        warm_up: Array<Workout>,
        prime_workouts: Array<String>,
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
    IMPROVE_POWER_CALISTHENICS="sdf89hef98jgr93odidg",
    IMPROVE_POWER_WEIGHTLIFTING="jf29fjf29jf2e09f22f",
    IMPROVE_FLEXIBILITY_CALISTHENICS="idj0ifje09fj0ef",
    IMPROVE_FLEXIBILITY_WEIGHTLIFTING="fg020kfefkijf893hf",
    IMPROVE_STAMINA_CALISTHENICS="jdf092uej0fh9f8grh",
    IMPROVE_STAMINA_WEIGHTLIFTING="0djf39efh9e8fhfd",
}

export enum GOAL_UID {
    IMPROVE_STRENGTH="sf928hf3928h0ie",
    IMPROVE_POWER="hsf98h298fh2h38f",
    IMPROVE_FLEXIBILITY="f0928thnf3028h3ff",
    IMPROVE_STAMINA="d3928thd09320d8f",
}


