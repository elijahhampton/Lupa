import { LupaUserStructure } from "../../controller/lupa/common/types";
import { LupaProgramInformationStructure } from "../../model/data_structures/programs/common/types";
import LiveSession from "../../model/data_structures/workout/live_session";
import { LUPA_DB_FIREBASE } from '../../controller/firebase/firebase';
import { getLupaExerciseStructure } from "../../model/data_structures/workout/exercise_collections";

import moment from 'moment';

export const LIVE_SESSION_REF = 'live_session/';

function LiveWorkoutService(sessionID, trainerData: LupaUserStructure, userData: Array<LupaUserStructure>, program: LupaProgramInformationStructure) {
    this.trainer = trainerData;
    this.participants = userData;
    this.workoutStructure = ['Workout Name', 'Workout Name', 'Workout Name'],
    this.currentWorkout = getLupaExerciseStructure()
    this.currentWorkoutOriginalReps = 0,
    this.currentWorkoutStructure = [],
    this.currentWeek = 0,
    this.workoutDays = [],
    this.currentWorkoutDay = "",
    this.currentDayIndex = 0,
    this.currentWorkoutIndex = 0,
    this.currentProgram = program;
    this.showFinishedDayDialog = false;
    this.restTimerStarted = false;
    this.restTimerVisible = false;

    if (sessionID.includes('.')) {
        this.sessionID = sessionID.split('.')[1];
    } else {
        this.sessionID = sessionID;
    }


    this.liveSession = new LiveSession(program, [trainerData, ...userData]);

    this.getCurrentProgram = () => {
        return this.currentProgram;
    }

    this.getCurrentSessionIDNumber = () => {
        return this.sessionID;
    }

    this.initLiveWorkoutSession = async () => {
        const initialSessionData = await this.loadCurrentDayWorkouts();
        await LUPA_DB_FIREBASE.ref(LIVE_SESSION_REF + this.sessionID).set(initialSessionData);
    }

    /* Workout Control Functions */
    this.generateWorkoutStructure = (workoutData) => {
        let workoutStructure = []

        for (let i = 0; i < workoutData.length; i++) {
            workoutStructure.push(workoutData[i]); //Add the first workout
            for (let j = 0; j < workoutData[i].superset.length; j++) {
                workoutStructure.push(workoutData[i].superset[j]);
            }
        }

        return workoutStructure;
    }

    this.loadCurrentDayWorkouts = async () => {
        let updatedState = {}

        const endDate = moment(this.currentProgram.program_end_date)
        const weekDifference = endDate.diff(moment(), 'weeks');
        const currWeek = this.currentProgram.program_duration - weekDifference;

        /****************************** ****************************/
        //TODO: Here we need to handle the case where the week is 0, i.e. the program has ended
        // beause the weekDIfference  = 0. (Need to also check that the day is the day, Sept 27 = Sept 27 so we don't end the program too early)
        /****************************** ****************************/
        const currentWeek = currWeek - 1;
        updatedState['currentWeek'] = currentWeek;

        let workoutStructure;
        const day = this.currentProgram.program_workout_days[0].toString();

        workoutStructure = await this.generateWorkoutStructure(this.currentProgram.program_workout_structure[currentWeek][day]);
        this.workoutStructure = workoutStructure;

        this.currentWorkoutDay = day;
        updatedState['currentWorkoutDay'] = day;

        this.currentWorkoutStructure = workoutStructure;
        updatedState['currentWorkoutStructure'] = workoutStructure;

        this.currentWorkout = workoutStructure[0];
        updatedState['currentWorkout'] = workoutStructure[0];

        this.restTime = workoutStructure[0].workout_rest_time;
        updatedState['restTime'] = workoutStructure[0].workout_rest_time;

        this.currentWorkoutOriginalReps = workoutStructure[0].workout_reps;
        updatedState['currentWorkoutOriginalReps'] = workoutStructure[0].workout_reps;

        this.currentWorkoutIndex = 0;
        updatedState['currentWorkoutIndex'] = 0;

        this.previousWorkout = await this.getPreviousExercise();
        updatedState['previousWorkout'] = await this.getPreviousExercise();

        this.nextWorkout = await this.getNextExercise();
        updatedState['nextWorkout'] = await this.getNextExercise();

        this.showFinishedDayDialog = false;
        updatedState['showFinishedDayDialog'] = false;

        this.restTimerStarted = false;
        updatedState['restTimerStarted'] = false;

        this.restTimerVisible = false;
        updatedState['restTimerVisible'] = false;

        return updatedState;
    }

    this.handleOnChangeWorkout = () => {

    }

    this.advanceWorkout = async () => {
        const currentWeek = this.currentWeek;
        if (this.currentWorkoutIndex === this.currentWorkoutStructure.length - 1) {
            LUPA_DB_FIREBASE.ref(LIVE_SESSION_REF + this.getCurrentSessionIDNumber()).update({ showFinishedDayDialog: true });
            this.showFinishedDayDialog = true;
            return;
        }


        await LUPA_DB_FIREBASE.ref(LIVE_SESSION_REF + this.getCurrentSessionIDNumber()).update({ 
            restTimerVisible: true, 
            restTimerStarted: true 
        });

        this.restTimerVisible = true;
        this.restTimerStarted = true;

        if (this.currentWorkout.workout_sets == 1) {
            LUPA_DB_FIREBASE.ref(LIVE_SESSION_REF + this.getCurrentSessionIDNumber()).update({ 
                currentWorkout: this.currentWorkoutStructure[this.currentWorkoutIndex + 1],
                currentWorkoutIndex: this.currentWorkoutIndex + 1
            });

            this.currentWorkout = this.currentWorkoutStructure[this.currentWorkoutIndex + 1];
            this.currentWorkoutIndex = this.currentWorkoutIndex + 1;

        } else if (this.currentWorkout.workout_sets > 1) {
            let newCurrentWorkoutObj = {
                ...this.currentWorkout,
                workout_sets: this.currentWorkout.workout_sets
            }

            newCurrentWorkoutObj.workout_sets -= 1;


            this.currentWorkout = newCurrentWorkoutObj;
            LUPA_DB_FIREBASE.ref(LIVE_SESSION_REF + this.getCurrentSessionIDNumber()).update({ 
                currentWorkout: this.currentWorkout
            });
        }
    }

    this.getNextExercise = () => {
        if (typeof(this.currentWorkoutStructure[this.currentWorkoutIndex + 1]) == 'undefined' 
        || typeof(this.currentWorkoutStructure[this.currentWorkoutIndex + 1]) == null) {
            LUPA_DB_FIREBASE.ref(LIVE_SESSION_REF + this.getCurrentSessionIDNumber()).update({ 
                nextExercise: -1
            });
            this.nextExercise = -1;
        } else {
            LUPA_DB_FIREBASE.ref(LIVE_SESSION_REF + this.getCurrentSessionIDNumber()).update({ 
                nextExercise:  this.currentWorkoutStructure[this.currentWorkoutIndex + 1]
            });
            this.nextExercise = this.currentWorkoutStructure[this.currentWorkoutIndex + 1];
        }
    }

    this.getPreviousExercise = () => {
        if (typeof(this.currentWorkoutStructure[this.currentWorkoutIndex - 1]) == 'undefined' 
        || typeof(this.currentWorkoutStructure[this.currentWorkoutIndex - 1]) == null) {
            LUPA_DB_FIREBASE.ref(LIVE_SESSION_REF + this.getCurrentSessionIDNumber()).update({ 
                previousExercise: -1
            });
            this.previousExercise = -1;
        } else {
            LUPA_DB_FIREBASE.ref(LIVE_SESSION_REF + this.getCurrentSessionIDNumber()).update({ 
                previousExercise:  this.currentWorkoutStructure[this.currentWorkoutIndex - 1]
            });
            this.previousExercise = this.currentWorkoutStructure[this.currentWorkoutIndex - 1];
        }
    }

    this.getCurrentExercise = () => {
        if (typeof(this.currentWorkout) == 'undefined' 
        || typeof(this.currentWorkout) == null) {
            LUPA_DB_FIREBASE.ref(LIVE_SESSION_REF + this.getCurrentSessionIDNumber()).update({ 
                currentWorkout: -1
            });
            this.currentWorkout = -1;
        }

        return this.currentWorkout;
    }
}

export default LiveWorkoutService;