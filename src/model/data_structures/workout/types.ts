

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
    name: String,
    description: String,
    Steps: Array<String>,
    uid: String
}

export type Goal = {
    uid: String,
    name: String,
    description: String,
    pathways: Array<GoalPathway>,
}