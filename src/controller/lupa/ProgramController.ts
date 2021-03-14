/**
 *
 */

import LUPA_DB, { LUPA_AUTH, FirebaseStorageBucket } from '../firebase/firebase.js';
import WorkoutController from './WorkoutController';
import { getLupaProgramInformationStructure } from '../../model/data_structures/programs/program_structures';
import { getLupaWorkoutInformationStructure } from '../../model/data_structures/workout/workout_collection_structures';
import { getPurchaseMetaDataStructure } from '../../model/data_structures/programs/purchaseMetaData'
import { getLupaUserStructure, getLupaUserStructurePlaceholder } from '../firebase/collection_structures';
import moment from 'moment';
import { LupaProgramInformationStructure } from '../../model/data_structures/programs/common/types';
import { LupaUserStructure } from './common/types';
import { initializeNewPack, initializeNewPackWithMembers } from '../../model/data_structures/packs/packs';
import { kMaxLength } from 'buffer';

const PROGRAM_COLLECTION = LUPA_DB.collection('programs');
const USERS_COLLECTION = LUPA_DB.collection('users');
const WORKOUT_COLLECTION = LUPA_DB.collection('workouts');
const PROGRAM_WAITLIST_COLLECTION = LUPA_DB.collection('program_waitlist')

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

    createProgram = async (programStructure: LupaProgramInformationStructure) => {
        let id = -1;
    
        await PROGRAM_COLLECTION.add(programStructure)
            .then(docRef => {
                id = docRef.id;
                console.log('Creating a program with id: ' + id)

                PROGRAM_COLLECTION.doc(id).update({ program_structure_uuid: id });
            }).catch(error => {
                console.log(error);
                id = -1;
            })

        return new Promise(async (resolve, reject) => {
            resolve(id);
        });
    }

    handleMatchAndCreatePack = (programData, chosenFourUUIDS, createNewPack) => {
        //create new pack structure
       // const newPack = initializeNewPackWithMembers('Lupa_Pack398', chosenFourUUIDS[0], programData, [], chosenFourUUIDS);
        //create new pack
       // createNewPack(newPack)        
    } 

    checkProgramWaitlistForMatches = async (programUID, userData, createNewPack) => {
        console.log(userData.user_uuid)

        let programWaitlistEntries = []

        let programData = getLupaProgramInformationStructure()
        await PROGRAM_COLLECTION.doc(programUID).get().then(documentSnapshot => {
            programData = documentSnapshot.data();
        })

        await PROGRAM_WAITLIST_COLLECTION.doc(programUID).get().then(async documentShapshot => {
            const data = documentShapshot.data();
            const waitlist = data.waitlist;
            console.log(waitlist)
            console.log('A')

            const usersInCity = waitlist.filter(entry => {
                console.log('checking: ' + entry.city + "   " + userData.location.city)
                return entry.city == userData.location.city
            })

            if (usersInCity.length >= 3) {
                //choose first four 
                const chosenFour = usersInCity.slice(0, 3);
                let chosenFourUUIDS = []
                for (let i = 0; i < chosenFour.length; i++) {
                    chosenFourUUIDS.push(chosenFour[i].user_uuid)
                }

                this.handleMatchAndCreatePack(programData, chosenFourUUIDS, createNewPack)
            }
        })
    }

    addUserToProgramWaitlist = async (userData) => {
        //add user to program waitlist
        const userWaitlistDataEntry = constructUserWaitlistMetadataEntry(userData);
        const waitlistDocRef = PROGRAM_WAITLIST_COLLECTION.doc(userData.user_uuid).set(userWaitlistDataEntry)
    }

    updateProgramWorkoutData = (programUUID, workoutData, numWorkoutsAdded, equipmentList) => {
        const programDocumentRef = PROGRAM_COLLECTION.doc(programUUID);
        programDocumentRef.update({
            program_workout_structure: workoutData,
            num_exercises: numWorkoutsAdded,
            required_equipment: equipmentList,
        })
    }

    updateProgramImage = async (programUUID, imageURI) => {
        const programDocumentRef = await PROGRAM_COLLECTION.doc(programUUID);
        try {
            await programDocumentRef.update({
                program_image: imageURI
            })

            return Promise.resolve(true);
        } catch (error) {
            return Promise.resolve(false);
        }
    }

    updateProgramMetadata = async (programUUID, title, description, tags, price) => {
        const programDocumentRef = await PROGRAM_COLLECTION.doc(programUUID);
        try {
            await programDocumentRef.update({
                program_name: title,
                program_description: description,
                program_tags: tags,
                program_price: price,
                completedProgram: true,
            })

            let programsList = [];
            const userUUID = await LUPA_AUTH.currentUser.uid;
            await USERS_COLLECTION
                .doc(userUUID)
                .get()
                .then(async snapshot => {
                    programsList = snapshot.data().program_data;
                    
                    await PROGRAM_COLLECTION.doc(programUUID).get().then(snapshot => {
                        const data = snapshot.data();
                        programsList.push(data);
                    });
    
                    USERS_COLLECTION.doc(userUUID).update({
                        program_data: programsList
                    })
                })
                .catch(error => {
                    return Promise.resolve([]);
                })

            return Promise.resolve(true);
        } catch (error) {
            return Promise.resolve(false);
        }
    }

    setProgramPublic = (programUUID, isPublic: Boolean) => {
        const programDocumentRef = PROGRAM_COLLECTION.doc(programUUID);
        programDocumentRef.update({
            isPublic: isPublic
        })
    }

    getProgramsBasedOnInterest = async (interestArr : Array<String>, experienceLevel : String) : Promise<Array<LupaProgramInformationStructure>> => {
        let programDataList : Array<LupaProgramInformationStructure> = [];

        interestArr.push(experienceLevel);
        
        return new Promise(async (resolve, reject) => {
            await PROGRAM_COLLECTION
            .where('isPublic', '==', true)
            .where('completedProgram', '==', true)
            .where('program_tags', 'array-contains-any', [...interestArr])
            .get()
            .then(querySnapshot => {
                querySnapshot.docs.forEach(doc => {
                    programDataList.push(doc.data());
                })
            })
            .catch(error => {
                resolve([]);
            })

            resolve(programDataList);
        });
    }

    getProgramOfTheDay = async () => {
        return new Promise(async (resolve, reject) => {
            let luckyProgram = getLupaProgramInformationStructure();

            await PROGRAM_COLLECTION
            .where('isPublic', '==', true)
            .where('completedProgram', '==', true)
            .get()
            .then(querySnapshot => {
                querySnapshot.docs.forEach(doc => {
                    luckyProgram = doc.data();
                    resolve(luckyProgram)
                    return;
                })
            })
            .catch(error => {
                resolve(-1);
            })
        });
    }

    getAllUserPrograms = async (uuid) => {
        let programsList = [];
        let programDataList = [];

            await USERS_COLLECTION
            .doc(uuid)
            .get()
            .then(snapshot => {
                programsList = snapshot.data().programs;
            })
            .catch(error => {
                return Promise.resolve([]);
            })

            let programData = getLupaProgramInformationStructure()
            for (let i = 0; i < programsList.length; i++) {
                await PROGRAM_COLLECTION.doc(programsList[i]).get().then(snapshot => {
                    programData = snapshot.data();
                    if (typeof(programData) != 'undefined') {
                        programDataList.push(snapshot.data());
                    }
                })
            }

        return Promise.resolve(programDataList)
    }

    loadWorkouts = async () => {
        let documentData = {}
        let bodyweight = [],
        barbell = [],
        dumbell =  [],
        kettlebell = [],
        machine_assisted = [],
        medicine_ball = [],
        plyometric = []

        await LUPA_DB.collection('exercises').where('body_area', '==', 'Bodyweight').get().then(collectionSnapshot => {
            collectionSnapshot.forEach(doc => {
                if (typeof (doc) == 'undefined') {
                    //delete doc
                } else {
                    documentData = doc.data();
                    bodyweight.push(documentData);
                }
            });
        });

        await LUPA_DB.collection('exercises').where('body_area', '==', 'Barbell').get().then(collectionSnapshot => {
            collectionSnapshot.forEach(doc => {
                if (typeof (doc) == 'undefined') {
                    //delete doc
                } else {
                    documentData = doc.data();
                    barbell.push(documentData);
                }
            });
        });

        await LUPA_DB.collection('exercises').where('body_area', '==', 'Dumbell').get().then(collectionSnapshot => {
            collectionSnapshot.forEach(doc => {
                if (typeof (doc) == 'undefined') {
                    //delete doc
                } else {
                    documentData = doc.data();
                    dumbell.push(documentData);
                }
            });

        });

        await LUPA_DB.collection('exercises').where('body_area', '==', 'Kettlebell').get().then(collectionSnapshot => {
            collectionSnapshot.forEach(doc => {
                if (typeof (doc) == 'undefined') {
                    //delete doc
                } else {
                    documentData = doc.data();
                    kettlebell.push(documentData);
                }
            });
        });

        await LUPA_DB.collection('exercises').where('body_area', '==', 'Machine Assisted').get().then(collectionSnapshot => {
            collectionSnapshot.forEach(doc => {
                if (typeof (doc) == 'undefined') {
                    //delete doc
                } else {
                    documentData = doc.data();
                    machine_assisted.push(documentData);
                }
            });
        });

        await LUPA_DB.collection('exercises').where('body_area', '==', 'Medicine Ball').get().then(collectionSnapshot => {
            collectionSnapshot.forEach(doc => {
                if (typeof (doc) == 'undefined') {
                    //delete doc
                } else {
                    documentData = doc.data();
                    medicine_ball.push(documentData);
                }
            });
        });

        await LUPA_DB.collection('exercises').where('body_area', '==', 'Plyometric').get().then(collectionSnapshot => {
            collectionSnapshot.forEach(doc => {
                if (typeof (doc) == 'undefined') {
                    //delete doc
                } else {
                    documentData = doc.data();
                    plyometric.push(documentData);
                }
            });
        });

        const allWorkouts = {
            bodyweight: bodyweight,
        barbell: barbell,
        dumbell: dumbell,
        kettlebell: kettlebell,
        machine_assisted: machine_assisted,
        medicine_ball: medicine_ball,
        plyometric: plyometric
        }

        return Promise.resolve(allWorkouts);
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
                if (typeof (snapshot) != 'undefined' && snapshot != null && snapshot.program_image != "") {
                    topPicks.push(snapshot)
                }
            })
        })


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

                snapshot = querySnapshot.data()
                if (typeof (snapshot) != 'undefined' && snapshot != null && snapshot.program_image != "") {
                    recentlyAddedPrograms.push(snapshot)
                }
            })
        })
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

        return new Promise((resolve, reject) => {
            this.fbStorage.saveProgramImage(programUUID, blob).then(url => {
                resolve(url);
            })
        })
    }

    markProgramCompleted = (uuid) => {
        PROGRAM_COLLECTION.doc(uuid).update({
            completedProgram: true
        })
    }

    markProgramPublic = (uuid) => {
        PROGRAM_COLLECTION.doc(uuid).update({
            isPublic: true
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
            completedProgram: true,
            isPublic: true,
        })

        await USERS_COLLECTION.doc(LUPA_AUTH.currentUser.uid).get().then(snapshot => {
            userData = snapshot.data();
        })

        let programDataList = userData.program_data;
        programData.completedProgram = true;
        programData.program_metadata.workouts_completed = 0;
        programData.program_metadata.date_created = new Date().toDateString()

        //Give the program a start date of today and an end date based on the program duration
        let newStartDate = moment().format(); // 2020-09-23T21:09:59-04:00
        let newEndDate = moment().add(programData.program_duration, 'weeks');
        programData.program_start_date = newStartDate;
        programData.program_end_date = newEndDate;
        programData.isPublic = true;
        programData.program_image = imageURL;
        programData.program_started = false;
        programDataList.push(programData);

        USERS_COLLECTION.doc(LUPA_AUTH.currentUser.uid).update({
            program_data: programDataList
        })
    }

    /**
     * Removes a specified value from a given away.
     * 
     * !!! Move to lupa/common/utils !!!
     * @param arr 
     * @param value 
     */
    arrayRemove(arr, value) {
        return arr.filter(function (ele) {
            return ele != value;
        });
    }

    eraseProgram = async (uuid) => {
        let programData = getLupaProgramInformationStructure()

        await PROGRAM_COLLECTION.doc(uuid).get().then(documentSnapshot => {
            programData = documentSnapshot.data();
        });

        await USERS_COLLECTION.doc(programData.program_owner).get().then(documentSnapshot => {
            let userData = documentSnapshot.data();

            let updatedPrograms = userData.programs;
            updatedPrograms.splice(updatedPrograms.indexOf(uuid) , 1);

            let updatedProgramData = userData.program_data;
            let index = 0;
            for (let i = 0; i < updatedProgramData.length; i++) {
                if (updatedProgramData[i].program_structure_uuid == uuid) {
                    index = i;
                }
            }

            updatedProgramData.splice(index, 1);

            USERS_COLLECTION.doc(programData.program_owner).update({
                programs: updatedPrograms,
                program_data: updatedProgramData
            })
        })

        PROGRAM_COLLECTION.doc(uuid).delete();

        //delete any notifications

       /* for (let i = 0; i < programParticipants.length; i++) {
            let userPrograms = [], userProgramsDataList = []
            let userRef = USERS_COLLECTION.doc(programParticipants[i]).get().then(snapshot => {
                userPrograms = snapshot.data().programs;
                userProgramsDataList = snapshot.data().program_data;
            })

            let updatedProgramsList = this.arrayRemove(userPrograms, uuid);
            let updatedProgramsDataList = []
            for (let j = 0; j < userProgramsDataList.length; j++) {
                if (userProgramsDataList[j].program_structure_uuid == uuid) {
                    updatedProgramsDataList = userProgramsDataList.splice(j, 1);
                }
            }


            userRef.update({
                programs: updatedProgramsList,
                program_data: updatedProgramsDataList,
            })
        }*/
    }

    deleteWorkout = async (uuid) => {
        // not sure if we will need this yet or what it will do
    }

    publishWorkout = async (uuid, dateString) => {
        try {
            await WORKOUT_COLLECTION.doc(uuid).update({
                completedProgram: true
            });

            let workoutData = getLupaWorkoutInformationStructure();
            await WORKOUT_COLLECTION.doc(uuid).get().then(documentSnapshot => {
                workoutData = documentSnapshot.data();
            })

            let userWorkoutData = {}
            const userUUID = await LUPA_AUTH.currentUser.uid
            console.log(userUUID)
            await USERS_COLLECTION.doc(userUUID).get().then(documentSnapshot => {
                userWorkoutData = documentSnapshot.data().workouts;
            })

            userWorkoutData[dateString] = [workoutData];
            console.log(userWorkoutData)

            await USERS_COLLECTION.doc(userUUID).update({
                workouts: userWorkoutData
            })

        } catch (error) {

        }
    }

    updateProgramData = (programUUID, programData) => {
        const docRef = PROGRAM_COLLECTION.doc(programUUID);
        docRef.set(programData);
    }


    updateWorkoutInformation = (workoutUUID, workoutData) => {
        const docRef = WORKOUT_COLLECTION.doc(workoutUUID);
        docRef.set(workoutData);
    }

    updateWorkoutData = (workoutUUID, workoutData) => {
        const docRef = WORKOUT_COLLECTION.doc(workoutUUID);
        docRef.update({
            program_workout_structure: workoutData,
            completedWorkout: true,
        });

        /*  let userDataWorkouts = []
          USERS_COLLECTION.doc(LUPA_AUTH.currentUser.uid).get().then(documentSnapshot => {
              const data = documentSnapshot.data();
              userDataWorkouts = data.workouts;
          });
  
          userDataWorkouts.push(workoutUUID);
          USERS_COLLECTION.doc(LUPA_AUTH.currentUser.uid).update({
              workouts: userDataWorkouts
          })*/
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

        //Access user's data
        await USERS_COLLECTION.doc(LUPA_AUTH.currentUser.uid).get().then(snapshot => {
            userData = snapshot.data();
        });

        //get program uuids from program field
        const userPrograms = userData.programs;

        let programData = [];

        let tempProgramData;
        //get the data from each uuid
        for (let i = 0; i < userPrograms.length; i++) {
            await PROGRAM_COLLECTION.doc(userPrograms[i]).get().then(snapshot => {
                tempProgramData = snapshot.data();
                if (typeof (tempProgramData) != 'undefined' && tempProgramData.program_owner == LUPA_AUTH.currentUser.uid) {
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
                purchase_history: typeof (purchaseMetaDataList.length) == 'undefined' ? [] : purchaseMetaDataList,
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

    getProgramInformationFromGroup = async (uuidArr) => {
        let programArr = [];
        for (let i = 0; i < uuidArr.length; i++) {
            await this.getProgramInformationFromUUID(uuidArr).then(data => {
                programArr.push(data);
            })
        }

        return Promise.resolve(programArr);
    }

    markWorkoutCompleted = async (userUID, programUID, completionString) => {
        let foundProgramIndex = -1;
       //get user program data
       await USERS_COLLECTION.doc(userUID).get().then(documentSnapshot => {
           const data = documentSnapshot.data();

           let program_data = data.program_data;
           for (let i = 0; i < program_data.length; i++)
           {
               if (program_data[i].program_structure_uuid == programUID)
               {
                   foundProgramIndex = i;
               }
           }

           if (foundProgramIndex == -1) {
               return;
           }

           let updatedProgram = program_data[foundProgramIndex];
           
           updatedProgram.workouts_completed.push(completionString);

           program_data[foundProgramIndex] = updatedProgram;
           USERS_COLLECTION.doc(userUID).update({
               program_data: program_data
           })
       })
    }

}

function constructUserWaitlistMetadataEntry(userData: LupaUserStructure) {
    const entry = {
        user_uuid: userData.user_uuid,
        city: userData.location.city,
        state: userData.location.state,
        country: userData.location.country,
        position: [userData.location.longitude, userData.location.latitude], //[long, lat] - [x, y]
        interest: userData.interest
    };

    return entry;
}

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }
  
  function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
    var earthRadiusKm = 6371;
  
    var dLat = degreesToRadians(lat2-lat1);
    var dLon = degreesToRadians(lon2-lon1);
  
    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);
  
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return earthRadiusKm * c;
  }

  function convertKMToMiles(kilometers) {
    var miles = kilometers / 1.609;
    return miles;
  }
