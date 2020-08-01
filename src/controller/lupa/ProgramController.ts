/**
 *
 */

import LUPA_DB, { LUPA_AUTH, FirebaseStorageBucket } from '../firebase/firebase.js';
import WorkoutController from './WorkoutController';
import { getLupaProgramInformationStructure } from '../../model/data_structures/programs/program_structures.js';

const PROGRAM_COLLECTION = LUPA_DB.collection('programs');
const USERS_COLLECTION = LUPA_DB.collection('users');

export default class ProgramController {
    private static _instance: ProgramController;
    private fbStorage = new FirebaseStorageBucket();

    private constructor() {

    }

    public static getInstance = () => {
        if (!ProgramController._instance) {
            ProgramController._instance = new ProgramController();
            return ProgramController._instance;
        }

        return ProgramController._instance;
    }

    loadWorkouts = () => {
        const WORKOUTS = require('../../model/data_structures/workout/json/workouts.json')
        return WORKOUTS.lupa_workouts;
    }

    /**
     * Returns an object representing a Lupa Program
     * See LupaProgramStructure
     *
     * @return Object representing a LupaProgramStructure
     */
    getProgramInformationFromUUID = async (uuid) => {
        let programData = getLupaProgramInformationStructure()

        try {
            await PROGRAM_COLLECTION.doc(uuid).get().then(snapshot => {
                programData = snapshot.data();
            })
        } catch (error) {
            return Promise.resolve(programData);
        }

        return Promise.resolve(programData);
    }

    /**
     * Returns top 5 programs.
     * For now, just returns 5 programs.
     *
     * @return Array
     */
    getTopPicks = async () => {
        let topPicks = []
        await PROGRAM_COLLECTION.limit(5).get().then(docs => {
            let snapshot = getLupaProgramInformationStructure()
            docs.forEach(querySnapshot => {
                  snapshot = querySnapshot.data()
                  if (typeof(snapshot) != 'undefined' && snapshot != null && snapshot.program_image != "") {
                      console.log('getToPciks()')
                    topPicks.push(snapshot)
                  }
              })
        })

        console.log('getToPciks()')

        return Promise.resolve(topPicks)
    }

    /**
     * Returns 5 recently added programs.
     *
     * @return Array
     */
    getRecentlyAddedPrograms = async () => {
        let recentlyAddedPrograms = []
        await PROGRAM_COLLECTION.orderBy("program_start_date").limit(5).get().then(docs => {
            let snapshot = getLupaProgramInformationStructure()  
            docs.forEach(querySnapshot => {
                console.log('getToPciks()')
                  snapshot = querySnapshot.data()
                  if (typeof(snapshot) != 'undefined' && snapshot != null && snapshot.program_image != "") {
                    recentlyAddedPrograms.push(snapshot)
                  }
              })
        })
        console.log('getToPciks()')
        return Promise.resolve(recentlyAddedPrograms)
    }

    saveProgramImage = async (programUUID, url) => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', url, true);
            xhr.send(null);
        });

        let imageURL;
        return new Promise((resolve, reject) => {
            this.fbStorage.saveProgramImage(programUUID, blob).then(url => {
                resolve(url);
            })
        })
    }

    publishProgram = async (uuid) => {
        let programData = getLupaProgramInformationStructure()

        await PROGRAM_COLLECTION.doc(uuid).get().then(documentSnapshot => {
            programData = documentSnapshot.data()
        })

        let imageURL;

        await this.saveProgramImage(uuid, programData.program_image).then(url => {
            imageURL = url
        })


        await PROGRAM_COLLECTION.doc(uuid).update({
            program_image: imageURL,
            completedProgram: true
        })
    }

    updateProgramData = (programUUID, programData) => {
        const docRef = PROGRAM_COLLECTION.doc(programUUID);
        docRef.set(programData);
    }

    updateProgramWorkoutData = (programUUID, workoutData) => {
        const docRef = PROGRAM_COLLECTION.doc(programUUID);
        docRef.update({
            program_workout_structure: workoutData
        })
    }

}
