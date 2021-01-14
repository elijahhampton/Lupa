/**
 *
 */

import LUPA_DB, {
    LUPA_AUTH,
    Fire,
    FirebaseStorageBucket,
    LUPA_DB_FIREBASE,
} from '../firebase/firebase.js';

const PACKS_COLLECTION = LUPA_DB.collection('packs');
const USERS_COLLECTION = LUPA_DB.collection('users');
//import * as algoliasearch from 'algoliasearch'; // When using TypeScript
const algoliasearch = require('algoliasearch/reactnative.js');
const algoliaIndex = algoliasearch("EGZO4IJMQL", "f0f50b25f97f17ed73afa48108d9d7e6");
import {initializeNewPack, initializeNewPackProgramWithMembers, initializeNewPackWithMembers} from '../../model/data_structures/packs/packs';
import LOG, { LOG_ERROR } from '../../common/Logger';
import { NOTIFICATION_TYPES } from '../../model/notifications/common/types'
import moment from 'moment';
import { getLupaUserStructurePlaceholder } from '../firebase/collection_structures';
import { PackType } from '../../model/data_structures/packs/types.js';
import axios from 'axios'
import { send } from 'process';
import { getLupaProgramInformationStructure } from '../../model/data_structures/programs/program_structures';
import { ProgramParticipantCategory } from '../../model/data_structures/programs/common/types.js';
export default class PackController {
    private static _instance: PackController;
    private fbStorage = new FirebaseStorageBucket();

    private constructor() {

    }

    /**
     * Returns an instance of the user controller if one exist, otherwise creates an instance and
     * returns it.
     * @return PackController._instance an instance of the user controller.
     */
    public static getInstance = () => {
        if (!PackController._instance) {
            PackController._instance = new PackController();
            return PackController._instance;
        }

        return PackController._instance;
    }

    sendPackInvite = (newPack : PackType, usersToInvite : Array<String>) => {
        if (usersToInvite.length === 0) {
            return;
        }

        for (let i = 0; i < usersToInvite.length; i++) {
            this.inviteUserToPack(usersToInvite[i], newPack);
        }
    }

    createPack = async (newPack : PackType) => {
        let newPackUUID = "";
        const invitedMembers = newPack.invited_members;

        await PACKS_COLLECTION.add(newPack)
        .then((docRef) => {
            newPackUUID = docRef.id
        }).catch(error => {
            return Promise.resolve(-1);
        });

        await PACKS_COLLECTION
        .doc(newPackUUID)
        .update({ uid: newPackUUID, members: [newPack.leader] })

        
        if (typeof(newPackUUID) === 'undefined' || newPackUUID == "") {
            return Promise.resolve(-1);
        }  else {
            newPack.uid = newPackUUID; //LOOK AT THIS AGAIN.. BAD
            this.sendPackInvite(newPack, invitedMembers);
        }

        USERS_COLLECTION.doc(newPack.leader)
        .get()
        .then(documentSnapshot => {
            let updatedPacks = documentSnapshot.data().packs;
            updatedPacks.push(newPackUUID)

            USERS_COLLECTION.doc(newPack.leader).update({
                packs: updatedPacks
            })
        })

        return Promise.resolve(newPackUUID);
    }

    inviteUserToPack = async (uuid, packData) => {
        console.log('INVITING USER WITH ID: ' + uuid)
         //create notification
         const receivedPackInviteNotificationStructure = {
            notification_uuid: Math.random().toString(),
            data: packData,
            from: packData.leader,
            to: uuid,
            read: false,
            type: NOTIFICATION_TYPES.PACK_INVITE,
            actions: ['Accept', 'Delete'],
            timestamp: new Date().getTime()
        }

        //add notification to users notification array
        let userNotifications = [];

        const INVITED_USER_DOC_REF = USERS_COLLECTION.doc(uuid);


        console.log('got the data')
        await INVITED_USER_DOC_REF.get().then(snapshot => {
            userNotifications = snapshot.data().notifications;
        });

        console.log('about to udpate')
        await userNotifications.push(receivedPackInviteNotificationStructure);

        INVITED_USER_DOC_REF.update({
            notifications: userNotifications,
        });
    }

    handleCancelPackProgramRequest = (packProgramUID) => {

    }

    handleAcceptPackProgramOfferInvite = async (packProgramUID, userUID) => {
        let packProgramData = initializeNewPackProgramWithMembers('', '', []);
        let userData = getLupaUserStructurePlaceholder();
        
        await LUPA_DB.collection('pack_programs').doc(packProgramUID).get().then(documentSnapshot => {
            packProgramData = documentSnapshot.data()
        });

        let updatedMemberList = packProgramData.members;
        updatedMemberList.push(userUID);

        LUPA_DB.collection('pack_programs').doc(packProgramUID).update({
            members: updatedMemberList
        });
    }

    setPackProgramLive = async (packProgramUID, bool) => {
        if (bool === true) {
            //
            let programUID = 0;
            await LUPA_DB.collection('pack_programs').doc(packProgramUID).get().then(documentSnapshot => {
                const data = documentSnapshot.data();
                programUID = data.program_uid;
            });

            let programData = getLupaProgramInformationStructure()
            await LUPA_DB.collection('programs').doc(programUID).get().then(documentSnapshot => {
                const data = documentSnapshot.data();
                programData = data;
            });

            LUPA_DB.collection('pack_programs').doc(packProgramUID).update({
                is_live: bool,
                program: programData
            })
        } else {
            //clean up and delete pack
        }
    }

    handleDeletePackProgram = async (packProgramUID) => {
        let programUID = 0, members = []
        await LUPA_DB.collection('pack_programs').doc(packProgramUID).get().then(documentSnapshot => {
            const data = documentSnapshot.data();
            programUID = data.program_uid;
            members = data.members;
        });

         //erase individual pack program data
         let userData = getLupaUserStructurePlaceholder()
         for (let i = 0; i < members.length; i++) {
             await USERS_COLLECTION.doc(members[i]).get().then(documentSnapshot => {
                 userData = documentSnapshot.data();
             });
 
             userData.pack_programs.splice(userData.pack_programs.indexOf(packProgramUID), 1);
 
             USERS_COLLECTION.doc(members[i]).update({
                 pack_programs: userData.pack_programs
             })
         }

         //erase pack program
         LUPA_DB.collection('pack_programs').doc(packProgramUID).delete();
    }

    handleStartPackProgramOffer = async (packProgramUID) => {
        return Promise.resolve(async (resolve, reject) => {
            let programUID = 0, members = [], packProgramData = initializeNewPackProgramWithMembers('', '', [])

            //Fetch pack program data and get the program uid and members 
            await LUPA_DB.collection('pack_programs').doc(packProgramUID).get()
            .then(documentSnapshot => {
                const data = documentSnapshot.data();
                packProgramData = data;
                programUID = data.program_uid;
                members = data.members;
            })
            .catch(error => {
                resolve(false);
            })
    
            //fetch program data
            let programData = getLupaProgramInformationStructure();
            await LUPA_DB.collection('programs').doc(programUID).get()
            .then(documentSnapshot => {
                const data = documentSnapshot.data();
                programData = data;
            })
            .catch(error => {
                resolve(false)
            })
    
            //mark the programs participant category
            programData.program_participant_category = ProgramParticipantCategory.PACK;
    
            //update the program data for the pack_program entry and mark the program as live
            LUPA_DB.collection('pack_programs').doc(packProgramUID).update({
                is_live: true,
                program: programData
            })

            try {
            //add individual program data
            //notify all users that the program has started and they have been charged
            let userData = getLupaUserStructurePlaceholder()
            for (let i = 0; i < members.length; i++) {
                
                await USERS_COLLECTION.doc(members[i]).get().then(documentSnapshot => {
                    userData = documentSnapshot.data();
                });
    
                let userNotifications = []
            //add notification to users notification array
            if (userData.hasOwnProperty('notifications')) {
                userNotifications = userData.notifications;
            } else {
                userNotifications = []
            }
    
            let receivedPackProgramStartedNotificationStructure = {
                notification_uuid: Math.random().toString(),
                data: packProgramData,
                from: LUPA_AUTH.currentUser.uid,
                to: members[i],
                read: false,
                type: NOTIFICATION_TYPES.BOOKING_REQUEST,
                actions: ['Accept', 'View', 'Delete'],
                timestamp: new Date().getTime()
            }
    
            await userNotifications.push(receivedPackProgramStartedNotificationStructure);
    
            await USERS_COLLECTION.doc(members[i]).update({
                notifications: userNotifications,
            });
            }
            } catch(error) {

            }
            
            resolve(true);
        })
    }

    handleDeclinePackProgramOfferInvite = async (packProgramUID, userUID) => {
        let packProgramData = initializeNewPackProgramWithMembers('', '', []);
        let userData = getLupaUserStructurePlaceholder();

        await LUPA_DB.collection('pack_programs').doc(packProgramUID).get().then(documentSnapshot => {
            packProgramData = documentSnapshot.data()
        });

        let updatedMemberList = packProgramData.members;
        updatedMemberList.splice(updatedMemberList.indexOf(userUID), 1);

        LUPA_DB.collection('pack_programs').doc(packProgramUID).update({
            members: updatedMemberList
        });
    }

    handleSendProgramOfferInvite = async (programOwnerUID, senderUUID, packUUID, programUUID) => {
        // Create new pack program
        const newPackProgram = initializeNewPackProgramWithMembers(programOwnerUID, packUUID, programUUID, [senderUUID]);

        //Add the program to the database and update the uid
        let newPackProgramUID = 0;
        await LUPA_DB.collection('pack_programs')
        .add(newPackProgram)
        .then((docRef) => {
            newPackProgramUID = docRef.id;
            LUPA_DB.collection('pack_programs').doc(docRef.id).update({ uid: docRef.id });
        })
        .catch(error => {
            alert('Error trying to send program offer invite: ' + error)
        })

        //construct the system message to send in the pack chat
        const systemMessage = 
        {
            _id: 0,
            text: 'System Message',
            timestamp: new Date().getTime(),
            system: true,
            extraData: {
                type: 'PROGRAM_OFFER_INVITE',
                programUID: programUUID,
                senderUID: senderUUID,
                packUID: packUUID,
                packProgramUID: newPackProgramUID,
                defaultText: '',
            }
                // Any additional custom parameters are passed through
        }

        //Initialize the chat with Fire and send the message
        Fire.shared.init(packUUID);
        Fire.shared.send([systemMessage])
        Fire.shared.off() 

        //generate the pack members
        let packData = initializeNewPack('', '', '', []);
        await PACKS_COLLECTION.doc(packUUID).get().then(documentSnapshot => {
            packData = documentSnapshot.data();
        })

        const members = packData.members;
        if (members.length == 0) {
            return;
        }

        console.log('sending notification!!!')
        console.log(packUUID)

        //send all members of the pack except the sender a notification
        const receivedPackProgramOfferInvite = {
            notification_uuid: Math.random().toString(),
            data: packUUID,
            from: senderUUID,
            to: members,
            read: false,
            type: NOTIFICATION_TYPES.RECEIVED_PACK_PROGRAM_OFFER_INVITE,
            actions: ['View Pack Offer', 'Delete'],
            timestamp: new Date().getTime()
        }

        let userNotifications = [];
        for (let i = 0; i < members.length; i++) {
            await USERS_COLLECTION.doc(members[i]).get().then(snapshot => {
                userNotifications = snapshot.data().notifications;
            })
            await userNotifications.push(receivedPackProgramOfferInvite);
            await USERS_COLLECTION.doc(members[i]).update({
                notifications: userNotifications,
            })
        }

    }

    handleOnAcceptPackInvite = async (packUID, userUID) => {
        const INVITED_USER_DOC_REF = USERS_COLLECTION.doc(userUID);
        const PACK_DOC_REF = PACKS_COLLECTION.doc(packUID);

        console.log('USERID DSFSDFSD: ' + userUID);
        console.log(packUID)

        //update user pack list
        let invitedUserData = getLupaUserStructurePlaceholder();
        await INVITED_USER_DOC_REF.get()
        .then(documentSnapshot => {
            invitedUserData = documentSnapshot.data();
        });

        invitedUserData.packs.push(packUID);

        INVITED_USER_DOC_REF.update({
            packs: invitedUserData.packs
        });

        //update pack data
        let packData;
        await PACK_DOC_REF.get()
        .then(documentSnapshot => {
            packData = documentSnapshot.data()
        });

        let updatedInviteList = packData.invited_members;
        let updatedMembers = packData.members;

        //remove member from invite list
        updatedInviteList.splice(updatedInviteList.indexOf(userUID), 1);
        packData.invited_members = updatedInviteList;

        //add to members list
        updatedMembers.push(userUID)
        packData.members = updatedMembers;

        PACK_DOC_REF.update({
            invited_members: updatedInviteList,
            members: updatedMembers
        });

        return Promise.resolve(packData);
    }

    handleOnDeclinePackInvite = async (packUID, userUID) => {
        const PACK_DOC_REF = PACKS_COLLECTION.doc(packUID);

        //update pack data
        let packData;
        await PACK_DOC_REF.get()
        .then(documentSnapshot => {
            packData = documentSnapshot.data()
        });

        let updatedInviteList = packData.invited_members;

        //remove member from invite list
        updatedInviteList.splice(updatedInviteList.indexOf(userUID), 1);

        await PACK_DOC_REF.update({
            invited_members: updatedInviteList,
        })
    }

    checkPacksForCompletion = async (packData : PackType) => {
        if (packData.is_live) {
            return Promise.resolve(true);
        }

        //check fi 24 hours
        const timePackCreated = moment(packData.time_created);
        const deadlineTime = timePackCreated.add(24, 'hour');

        //if 24 hours
        if (timePackCreated.isSameOrAfter(deadlineTime)) {
            //axios request
            await axios({
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                url: "https://us-central1-lupa-cd0e3.cloudfunctions.net/createPackCharge",
                data: JSON.stringify({
                    pack_data: packData,
                })
            }).then(response => {
            }).catch(err => {
               return Promise.resolve(false);
            })
        }
        

        //set pack as live
        const packDocRef = PACKS_COLLECTION.doc(packData.uid);
        packDocRef.update({
            is_live: true,
            invited_members: []
        })

        return Promise.resolve(true);
    }

    getPackInformationFromUUID = async (uuid) => {
        return new Promise(async (resolve, reject) => {
            await PACKS_COLLECTION.doc(uuid).get()
            .then(documentSnapshot => {
                const packData = documentSnapshot.data();
                resolve(packData);
            })
            .catch(error => {
                resolve(initializeNewPack('', ''));
            })
        })
    }

    loadCurrentUserPacks = async (): Promise<Array<Object>> => {
        let packUUIDS = [], packsData = [];
        let temp = getLupaUserStructurePlaceholder()
        let uuid = await LUPA_AUTH.currentUser.uid;

        if (typeof(uuid) == 'undefined' || uuid == null) {
            return Promise.resolve([])
        }

        try {

            await USERS_COLLECTION.doc(uuid).get().then(async documentSnapshot => {
                if (documentSnapshot.exists) {
                    temp = documentSnapshot.data();
                } else {
                    return Promise.resolve([]);
                }

                packUUIDS = temp.packs;
                let packData = initializeNewPack('', '', '', []);
                for (let i = 0; i < packUUIDS.length; i++) {
                
                    await PACKS_COLLECTION.doc(packUUIDS[i]).get().then(documentSnapshot => {
                        if (documentSnapshot.exists) {
                            packData = documentSnapshot.data();
                        } else {
                            packData = null
                        }
                    })
    
    
                    try {
                        if (typeof (packData) != 'undefined' && packData != null) {
                            packsData.push(packData);
                        }
                    } catch (error) {
                        LOG_ERROR('PacksController.ts', 'Unhandled exception in loadCurrentUserPacks()', error)
                        continue;
                    }
    
                }
            });
        } catch (error) {
            LOG_ERROR('PacksController.ts', 'Unhandled exception in loadCurrentUserPacks()', error)
            packsData = [];
        }


        return Promise.resolve(packsData);
    }

    fetchCuratedPacks = async () => {
        return new Promise(async (resolve, reject) => {
            let curatedPacks = []
            let pack = initializeNewPack('', '', '', []);
            await PACKS_COLLECTION.get().then(querySnapshot => {
                querySnapshot.docs.forEach(doc => {
                    pack = doc.data();
                    if (pack.isPublic == true) {
                        curatedPacks.push(pack)
                    }
                });
            });

            resolve(curatedPacks);
        });
    }
}
