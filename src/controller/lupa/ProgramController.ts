/**
 *
 */

import LUPA_DB, { LUPA_AUTH, FirebaseStorageBucket } from '../firebase/firebase.js';
import WorkoutController from './WorkoutController';
import { getLupaProgramInformationStructure } from '../../model/data_structures/programs/program_structures.js';
import { getLupaWorkoutInformationStructure } from '../../model/data_structures/workout/workout_collection_structures';
import { getPurchaseMetaDataStructure } from '../../model/data_structures/programs/purchaseMetaData'
import { getLupaUserStructure } from '../firebase/collection_structures';
const PROGRAM_COLLECTION = LUPA_DB.collection('programs');
const USERS_COLLECTION = LUPA_DB.collection('users');
const WORKOUT_COLLECTION = LUPA_DB.collection('workouts');

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

    getAllUserPrograms = async (uuid) => {
        let programsList = [];
        let programDataList = [];
        try {
            await USERS_COLLECTION.doc(uuid).get().then(snapshot => {
                programsList = snapshot.data().programs;
            });
    
            for (let i = 0; i < programsList.length; i++) {
                await PROGRAM_COLLECTION.doc(programsList[i]).get().then(snapshot => {
                    programDataList.push(snapshot.data());
                })
            }
        } catch(error) {
            alert(error)
            return Promise.resolve([]);
        }

        return Promise.resolve(programDataList)
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

    getWorkoutInformationFromUUID = async (uuid) => {
        let programData = getLupaWorkoutInformationStructure()

        try {
            await WORKOUT_COLLECTION.doc(uuid).get().then(snapshot => {
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
        await PROGRAM_COLLECTION.where('completedProgram', '==', true).limit(5).get().then(docs => {
            let snapshot = getLupaProgramInformationStructure()
            docs.forEach(querySnapshot => {
                  snapshot = querySnapshot.data()
                  if (typeof(snapshot) != 'undefined' && snapshot != null && snapshot.program_image != "") {
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

    publishWorkout = async (uuid) => {
        await WORKOUT_COLLECTION.doc(uuid).update({
            completedProgram: true
        });
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

    updateWorkoutInformation = (workoutUUID, workoutData) => {
        const docRef = WORKOUT_COLLECTION.doc(workoutUUID);
        docRef.set(workoutData);
    }

    updateWorkoutData = (workoutUUID, workoutData) => {
        const docRef = WORKOUT_COLLECTION.doc(workoutUUID);
        docRef.update({
            workout_data: workoutData,
        })
    }

    /**
     * Creates a new workout entry in the workout collection and adds the UUID for that workout
     * to the current users program list.
     * @param arr 
     * @param value 
     */
    createWorkout = async (uuid) => {
        WORKOUT_COLLECTION.doc(uuid).set(getLupaWorkoutInformationStructure());
    }

    fetchDashboardData = async () => {
        let userData = getLupaUserStructure()
        await USERS_COLLECTION.doc(LUPA_AUTH.currentUser.uid).get().then(snapshot => {
            userData = snapshot.data();
        });

        const userPrograms = userData.programs;

        let programData = [];
        let tempProgramData;
        for (let i = 0; i < userPrograms.length; i++) {
            await PROGRAM_COLLECTION.doc(userPrograms[i]).get().then(snapshot => {
                tempProgramData = snapshot.data();
                if (typeof(tempProgramData) != 'undefined') {
                    programData.push(tempProgramData);
                }
            });
        }

        /* Gather Purchase History and Interactions */
        let purchaseMetaDataList = [];
        let numInteractions = 0;
        let shares = 0;
        let views = 0;
        let grossPay = 0;
        let netPay = 0;
        for (let j = 0; j < programData.length; j++) {
            console.log(programData[j].program_purchase_metadata.purchase_list.length)
            console.log(programData[j].program_purchase_metadata.purchase_list)
            purchaseMetaDataList = purchaseMetaDataList.concat(programData[j].program_purchase_metadata.purchase_list)
             numInteractions = numInteractions += programData[j].program_metadata.num_interactions 
             shares = shares += programData[j].program_metadata.shares;
             views = views += programData[j].program_metadata.views;
            grossPay = programData[j].program_purchase_metadata.gross_pay;
            netPay = programData[j].program_purchase_metadata.net_pay;
            }

        const dashboardData = {
            purchaseMetaData: {
                purchase_history: typeof(purchaseMetaDataList.length) == 'undefined' ?  [] : purchaseMetaDataList,
                gross_pay: grossPay,
                net_pay: netPay,
            },
            interactions: {
                numInteractions: numInteractions,
                shares: shares,
                views: views
            }
        }

        console.log(dashboardData)

        return Promise.resolve(dashboardData);

    }

    addProgramView = async (programUUID) => {
        let updatedProgramMetaData = {}
        await PROGRAM_COLLECTION.doc(programUUID).get().then(snapshot => {
            updatedProgramMetaData = snapshot.data().program_metadata;
        })

        updatedProgramMetaData.views = updatedProgramMetaData.views += 1;
        updatedProgramMetaData.num_interactions = updatedProgramMetaData.num_interactions += 1;
    
        PROGRAM_COLLECTION.doc(programUUID).update({
            program_metadata: updatedProgramMetaData
        })
    }

    addProgramShare = async (programUUID, numShares) => {
        let updatedProgramMetaData = {}
        await PROGRAM_COLLECTION.doc(programUUID).get().then(snapshot => {
            updatedProgramMetaData = snapshot.data().program_metadata;
        })

        updatedProgramMetaData.shares = updatedProgramMetaData.shares += numShares;
        updatedProgramMetaData.num_interactions = updatedProgramMetaData.num_interactions += 1;
    
        PROGRAM_COLLECTION.doc(programUUID).update({
            program_metadata: updatedProgramMetaData
        })
    }

    addProgramInteraction = async (programUUID) => {
        let updatedProgramMetaData = {}
        await PROGRAM_COLLECTION.doc(programUUID).get().then(snapshot => {
            updatedProgramMetaData = snapshot.data().program_metadata;
        })

        updatedProgramMetaData.num_interactions = updatedProgramMetaData.num_interactions += 1;
    
        PROGRAM_COLLECTION.doc(programUUID).update({
            program_metadata: updatedProgramMetaData
        })
    }

}
