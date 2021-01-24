import { Days, LupaUserStructure } from "../../controller/lupa/common/types";
import { LupaProgramInformationStructure } from "../../model/data_structures/programs/common/types";
import LiveSession from "../../model/data_structures/workout/live_session";
import LUPA_DB, { LUPA_DB_FIREBASE } from '../../controller/firebase/firebase';
import { getLupaExerciseStructure } from "../../model/data_structures/workout/exercise_collections";

import moment from 'moment';
import { getLupaUserStructurePlaceholder } from "../../controller/firebase/collection_structures";
import { getDayOfTheWeekStringFromDate } from "./DateTimeService";

export const LIVE_SESSION_REF = 'live_session/';

function LiveWorkoutService(sessionID, trainerData: LupaUserStructure, userData: Array<LupaUserStructure>, program: LupaProgramInformationStructure) {
    this.trainer = trainerData;
    this.participants = []
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
    this.timelineData = []
    this.labelData = []
    this.hasWorkouts = false;

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

    this.addParticipant = (data) => {
        LUPA_DB_FIREBASE.ref(LIVE_SESSION_REF + this.getCurrentSessionIDNumber()).once('value').then((snapshot) => {
            let updatedParticipantList = (snapshot.val() && snapshot.val().participants) || [];
            updatedParticipantList.push(data);

            LUPA_DB_FIREBASE.ref(LIVE_SESSION_REF + this.getCurrentSessionIDNumber()).update({ 
                participants: updatedParticipantList
            }, () => {
                this.participants = updatedParticipantList;
            })
          });
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
        const day = getDayOfTheWeekStringFromDate(new Date());

        workoutStructure = await this.generateWorkoutStructure(this.currentProgram.program_workout_structure[currentWeek][day]);
        this.workoutStructure = workoutStructure;

        if (this.workoutStructure.length != 0) {
            this.hasWorkouts = true;
            updatedState['hasWorkouts'] = true;
        } else {
            this.hasWorkouts = false;
            updatedState['hasWorkouts'] = false;
            return updatedState;
        }

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

        this.showFinishedDayDialog = false;
        updatedState['showFinishedDayDialog'] = false;

        this.restTimerStarted = false;
        updatedState['restTimerStarted'] = false;

        this.restTimerVisible = false;
        updatedState['restTimerVisible'] = false;

        if (workoutStructure.length != 0) {
            let exercise = getLupaExerciseStructure();
            let stepperData = []
            let labelData = []
            let title : String = ""
            let icon = ""
            for (let i = 0; i < workoutStructure.length; i++) {
                exercise = workoutStructure[i];
                title = exercise.workout_name;
                    switch(exercise.default_media_uri) {
                        case '':
                            icon =  ''
                        case 'Traps':
                            icon =  '../../images/buildworkout/singleworkout/Traps.png'
                        case 'Chest':
                            icon =  '../../images/buildworkout/singleworkout/Chest.png'
                        case 'Bicep':
                            icon =  '../../images/buildworkout/singleworkout/Bicep.png'
                        case 'Calves':
                            icon =  '../../images/buildworkout/singleworkout/Calves.png'
                        case 'Core':
                            icon =  '../../images/buildworkout/singleworkout/Core.png'
                        case 'Glutes':
                            icon =  '../../images/buildworkout/singleworkout/Glutes.png'
                        case 'Supr':
                            icon =  '../../images/buildworkout/singleworkout/Supr.png'
                        case 'Triceps':
                            icon =  '../../images/buildworkout/singleworkout/Triceps.png'
                        case 'Hip':
                            icon =  '../../images/buildworkout/singleworkout/Hip.png'
                        default:
                            icon = ''
                    }
                
                labelData.push(title);
                stepperData.push({
                    title: title,
                    icon: icon
                })
    
                title = ""
                icon = ""
            }
            this.labelData = labelData;
            this.timelineData = stepperData;
            updatedState['labelData'] = labelData;
            updatedState['timelineData'] = stepperData;
        }

        return updatedState;
    }

    this.handleOnChangeWorkout = () => {
        
    }

    this.createExerciseStructure = () => {
        const exerciseStructure = {
            exercise_name: this.currentWorkout.workout_name,
            exercise_weight: 0,
            one_rep_max: 0,
            equipment_used: [],
            index: this.currentWorkout.index
        }

        return exerciseStructure;
    }

    this.advanceWorkout = async () => {
        let userData = getLupaUserStructurePlaceholder();
        let updatedCompletedExerciseList = [];
        const newExerciseEntry = this.createExerciseStructure()
        let addExercise = true;
        await LUPA_DB_FIREBASE.ref(LIVE_SESSION_REF + this.getCurrentSessionIDNumber())
        .update({ 
            restTimerVisible: true, 
            restTimerStarted: true 
        }).then(async () => {
            for (let i = 0; i < this.participants.length; i++) {
                
                await LUPA_DB.collection('users').doc(this.participants[i].user_uuid).get().then(documentSnapshot => {
                    userData = documentSnapshot.data();
                }).then(() => {
                   updatedCompletedExerciseList = userData.completed_exercises;
                    
                    for (let i = 0; i < updatedCompletedExerciseList.length; i++) {
                        if (updatedCompletedExerciseList[i].index == newExerciseEntry.index) {
                            addExercise = false
                        }
                    }

                    if (addExercise == true) {
                        updatedCompletedExerciseList.push(newExerciseEntry);

                    LUPA_DB.collection('users').doc(this.participants[i].user_uuid).update({
                        completed_exercises: updatedCompletedExerciseList
                    })
                    }
                })


            }
        });

        this.restTimerVisible = true;
        this.restTimerStarteds = true;

        if (this.currentWorkout.workout_reps > 1) {
            let newCurrentWorkoutObj = {
                ...this.currentWorkout,
                workout_reps: this.currentWorkout.workout_reps
            }

            newCurrentWorkoutObj.workout_reps -= 1;


            this.currentWorkout = newCurrentWorkoutObj;
            LUPA_DB_FIREBASE.ref(LIVE_SESSION_REF + this.getCurrentSessionIDNumber())
            .update({ 
                currentWorkout: this.currentWorkout
            }).then(() => {

            })
        } else if (this.currentWorkout.workout_reps == 1) {
            if (this.currentWorkout.workout_sets == 1) {
                if (this.currentWorkoutIndex === this.currentWorkoutStructure.length - 1) {
                    LUPA_DB_FIREBASE.ref(LIVE_SESSION_REF + this.getCurrentSessionIDNumber()).update({ showFinishedDayDialog: true });
                    this.showFinishedDayDialog = true;
                    return;
                }

                LUPA_DB_FIREBASE.ref(LIVE_SESSION_REF + this.getCurrentSessionIDNumber()).update({ 
                    currentWorkout: this.currentWorkoutStructure[this.currentWorkoutIndex + 1],
                    currentWorkoutIndex: this.currentWorkoutIndex + 1,
                    currentWorkoutOriginalReps: this.currentWorkoutStructure[this.currentWorkoutIndex + 1].workout_reps
                }).then(() => {
                    this.currentWorkout = this.currentWorkoutStructure[this.currentWorkoutIndex + 1];
                    this.currentWorkoutIndex = this.currentWorkoutIndex + 1;
                    this.currentWorkoutOriginalReps = this.currentWorkoutStructure[this.currentWorkoutIndex + 1].workout_reps
                });
            } else { // > 0 sets
                console.log('@@@@@@')
                let newCurrentWorkoutObj = {
                    ...this.currentWorkout,
                }
    
                newCurrentWorkoutObj.workout_sets -= 1;
                newCurrentWorkoutObj.workout_reps = this.currentWorkoutOriginalReps;
    
                LUPA_DB_FIREBASE.ref(LIVE_SESSION_REF + this.getCurrentSessionIDNumber())
                .update({ 
                    currentWorkout: newCurrentWorkoutObj,
                }).then(() => {
                    this.currentWorkout = newCurrentWorkoutObj;
                })
            }
        }

        /* old */

       /* if (this.currentWorkout.workout_sets == 1) {
            LUPA_DB_FIREBASE.ref(LIVE_SESSION_REF + this.getCurrentSessionIDNumber()).update({ 
                currentWorkout: this.currentWorkoutStructure[this.currentWorkoutIndex + 1],
                currentWorkoutIndex: this.currentWorkoutIndex + 1
            }).then(() => {
                this.currentWorkout = this.currentWorkoutStructure[this.currentWorkoutIndex + 1];
                this.currentWorkoutIndex = this.currentWorkoutIndex + 1;
            });

        } else if (this.currentWorkout.workout_sets > 1) {
            let newCurrentWorkoutObj = {
                ...this.currentWorkout,
                workout_sets: this.currentWorkout.workout_sets
            }

            newCurrentWorkoutObj.workout_sets -= 1;


            this.currentWorkout = newCurrentWorkoutObj;
            LUPA_DB_FIREBASE.ref(LIVE_SESSION_REF + this.getCurrentSessionIDNumber())
            .update({ 
                currentWorkout: this.currentWorkout
            }).then(() => {

            })
        }*/
    }
}

export default LiveWorkoutService;