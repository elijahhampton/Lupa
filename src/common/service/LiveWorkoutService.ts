import { Days, LupaUserStructure } from "../../controller/lupa/common/types";
import { LupaProgramInformationStructure } from "../../model/data_structures/programs/common/types";
import LiveSession from "../../model/data_structures/workout/live_session";
import LUPA_DB, { LUPA_DB_FIREBASE } from '../../controller/firebase/firebase';
import { getLupaExerciseStructure } from "../../model/data_structures/workout/exercise_collections";

import moment from 'moment';
import { getLupaUserStructurePlaceholder } from "../../controller/firebase/collection_structures";
import { getDayOfTheWeekStringFromDate } from "./DateTimeService";

export const LIVE_SESSION_REF = 'live_session/';

const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
]

function LiveWorkoutService(sessionID, trainerData: LupaUserStructure, userData: Array<LupaUserStructure>, program: LupaProgramInformationStructure, week : Number) {
    this.trainer = trainerData;
    this.participants = []
    this.workoutStructure = ['Workout Name', 'Workout Name', 'Workout Name']
    this.currentWorkout = getLupaExerciseStructure()
    this.currentWorkoutOriginalReps = 0
    this.currentWorkoutStructure = []
    this.currentWeek = 0
    this.workoutDays = []
    this.currentWorkoutDay = ""
    this.currentDayIndex = 0
    this.currentWorkoutIndex = 0
    this.currentProgram = program;
    this.showFinishedDayDialog = false;
    this.restTimerStarted = false;
    this.restTimerVisible = false;
    this.timelineData = []
    this.labelData = []
    this.hasWorkouts = false;
    this.videoPlaylist = []
    this.videoPlaylistIndex = 0

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

    this.refreshState = async () => {
        await LUPA_DB_FIREBASE.ref(LIVE_SESSION_REF + this.getCurrentSessionIDNumber()).once('value', (snapshot) => {
            const currentState = snapshot.val();

            LUPA_DB_FIREBASE.ref(LIVE_SESSION_REF + this.getCurrentSessionIDNumber()).update({ 
                ...currentState
            })
        });
    }

    this.loadCurrentDayWorkouts = async () => {
        let updatedState = {}

        this.currentWeek = week;
        updatedState['currentWeek'] = week

        if (week == -1) {
            this.hasWorkouts = false;
            updatedState['hasWorkouts'] = false;
            return updatedState;
        } else if (week == -2) {
            this.hasWorkouts = true;
            updatedState['hasWorkouts'] = true;
        } else {
            this.hasWorkouts = true;
            updatedState['hasWorkouts'] = true;
        }

        let workoutStructure;

        workoutStructure = await this.generateWorkoutStructure(this.currentProgram.program_workout_structure[week]);
        this.workoutStructure = workoutStructure;

        this.currentWorkoutStructure = workoutStructure;
        updatedState['currentWorkoutStructure'] = workoutStructure;

        this.currentWorkout = workoutStructure[0];
        updatedState['currentWorkout'] = workoutStructure[0];
        
        this.videoPlaylistIndex = 0;
        updatedState['videoPlaylistIndex'] = 0;

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

    this.updateExerciseSetsLive = async (exerciseID, sets) => {
        let currentWorkoutStructure = [], currentWorkout = getLupaExerciseStructure()
        await LUPA_DB_FIREBASE.ref(LIVE_SESSION_REF + this.getCurrentSessionIDNumber()).once('value', (snapshot) => {
            currentWorkoutStructure = snapshot.val().currentWorkoutStructure;
            currentWorkout = snapshot.val().currentWorkout;
        });

        for (let i = 0; i < currentWorkoutStructure.length; i++) {
            if (currentWorkoutStructure[i].workout_uid == exerciseID) {
                currentWorkoutStructure[i].workout_sets = sets;
                if (currentWorkout.workout_uid == exerciseID) {
                    currentWorkout.workout_sets = sets;
                }

                await LUPA_DB_FIREBASE.ref(LIVE_SESSION_REF + this.getCurrentSessionIDNumber())
                .update({ 
                    currentWorkoutStructure: currentWorkoutStructure,
                    currentWorkout: currentWorkout
                }).then(() => {
                    this.updateStoredProgramStructure(currentWorkoutStructure)
                });

                continue;
            }
        }
    }

    this.changeWeekAndDay = async (week) => {
        let updatedState = {}
        if (week == -1) {
            this.hasWorkouts = false;
            updatedState['hasWorkouts'] = false;
            return updatedState;
        } else if (week == -2) {
            this.hasWorkouts = true;
            updatedState['hasWorkouts'] = true;
        } else {
            this.hasWorkouts = true;
            updatedState['hasWorkouts'] = true;
        }

        let workoutStructure;

        workoutStructure = await this.generateWorkoutStructure(this.currentProgram.program_workout_structure[week]);
        this.workoutStructure = workoutStructure;

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

        LUPA_DB_FIREBASE.ref(LIVE_SESSION_REF + this.getCurrentSessionIDNumber())
        .update({ 
            currentWeek: week,
            ...updatedState
        })
    }

    this.updateStoredProgramStructure = async (structure) => {
        let updatedCachedPrograms = [], updatedPrograms = [], participants : Array<LupaUserStructure> = [], currentWeek = 0;
        await LUPA_DB_FIREBASE.ref(LIVE_SESSION_REF + this.getCurrentSessionIDNumber()).once('value', (snapshot) => {
            participants = snapshot.val().participants;
            currentWeek = snapshot.val().currentWeek;
        });

        if (currentWeek < 0 || currentWeek > program.program_duration || typeof(currentWeek) == 'undefined') {
            return;
        }

        for (let i = 0; i < participants.length; i++) {
            let userUUID = participants[i].user_uuid
            await LUPA_DB.collection('users').doc(userUUID.toString()).get().then(documentSnapshot => {
                const userData = documentSnapshot.data();

                if (userData.hasOwnProperty('program_data')) {
                    updatedPrograms = userData.program_data;
                    updatedCachedPrograms = userData.program_data;
                } else {
                    return;
                }

                for (let i = 0; i < updatedPrograms.length; i++) {
                    if (updatedPrograms[i].program_structure_uuid == program.program_structure_uuid) {
                        updatedPrograms[i].program_workout_structure[currentWeek] = structure

                        LUPA_DB.collection('users').doc(userUUID.toString()).update({
                            program_data: updatedPrograms
                        })
                    }
                }
            })
        }
    }

    this.updateExerciseRepsLive = async (exerciseID, reps) => {
        let currentWorkoutStructure = [], currentWorkout = getLupaExerciseStructure()
        await LUPA_DB_FIREBASE.ref(LIVE_SESSION_REF + this.getCurrentSessionIDNumber()).once('value', (snapshot) => {
            currentWorkoutStructure = snapshot.val().currentWorkoutStructure;
            currentWorkout = snapshot.val().currentWorkout;
        });

        for (let i = 0; i < currentWorkoutStructure.length; i++) {
            if (currentWorkoutStructure[i].workout_uid == exerciseID) {
                currentWorkoutStructure[i].workout_reps = reps;
                if (currentWorkout.workout_uid == exerciseID) {
                    currentWorkout.workout_reps = reps;
                }

                await LUPA_DB_FIREBASE.ref(LIVE_SESSION_REF + this.getCurrentSessionIDNumber())
                .update({ 
                    currentWorkoutStructure: currentWorkoutStructure,
                    currentWorkout: currentWorkout
                }).then(() => {
                    this.updateStoredProgramStructure(currentWorkoutStructure)
                });

                continue;
            }
        }
    }

    this.playNext = () => {
        this.videoPlaylistIndex = 1;
        let updatedState = {}
        updatedState['videoPlaylistIndex'] = 1;

        LUPA_DB_FIREBASE.ref(LIVE_SESSION_REF + this.getCurrentSessionIDNumber())
        .update({ 
            videoPlaylistIndex: 1
        }).then(() => {
            this.videoPlaylistIndex = 1;
        })
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

    this.getCurrentWeek = () => {
        let currentWeek = -1;
        LUPA_DB_FIREBASE.ref(LIVE_SESSION_REF + this.getCurrentSessionIDNumber()).once('value').then((snapshot) => {
            currentWeek = (snapshot.val() && snapshot.val().currentWeek) || -1;
          });

        return currentWeek;
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
                currentWorkout: this.currentWorkout,
              
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
                    currentWorkoutOriginalReps: this.currentWorkoutStructure[this.currentWorkoutIndex + 1].workout_reps,
                    videoPlaylist: [this.currentWorkoutStructure[this.currentWorkoutIndex + 1].workout_how_to_media.uri, this.currentWorkoutStructure[this.currentWorkoutIndex + 1].workout_media.uri],
                    videoPlaylistIndex: 0
                }).then(() => {
                    this.currentWorkout = this.currentWorkoutStructure[this.currentWorkoutIndex + 1];
                    this.currentWorkoutIndex = this.currentWorkoutIndex + 1;
                    this.currentWorkoutOriginalReps = this.currentWorkoutStructure[this.currentWorkoutIndex + 1].workout_reps,
                    this.videoPlaylist = [this.currentWorkoutStructure[this.currentWorkoutIndex + 1].workout_how_to_media.uri, this.currentWorkoutStructure[this.currentWorkoutIndex + 1].workout_media.uri],
                    this.videoPlaylistIndex = 0
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