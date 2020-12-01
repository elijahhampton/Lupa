/**
 *
 */

import LUPA_DB, {
    LUPA_AUTH,
    Fire,
    FirebaseStorageBucket
} from '../firebase/firebase.js';

const PACKS_COLLECTION = LUPA_DB.collection('packs');
const USERS_COLLECTION = LUPA_DB.collection('users');
//import * as algoliasearch from 'algoliasearch'; // When using TypeScript
const algoliasearch = require('algoliasearch/reactnative.js');
const algoliaIndex = algoliasearch("EGZO4IJMQL", "f0f50b25f97f17ed73afa48108d9d7e6");
import {initializeNewPack} from '../../model/data_structures/packs/packs';
import LOG, { LOG_ERROR } from '../../common/Logger';
import { NOTIFICATION_TYPES } from '../../model/notifications/common/types'
import moment from 'moment';
import { getLupaUserStructurePlaceholder } from '../firebase/collection_structures';

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

    createPack = async (newPack) => {
        let newPackUUID = "";

        await PACKS_COLLECTION.add(newPack)
        .then((docRef) => {
            newPackUUID = docRef.id
            PACKS_COLLECTION.doc(docRef.id).update({ uid: docRef.id, members: [newPack.leader] });
        }).catch(error => {
            return Promise.resolve(-1);
        });

        if (typeof(newPackUUID) === 'undefined' || newPackUUID == "") {
            return Promise.resolve(-1);
        } else {
            await USERS_COLLECTION.doc(newPack.leader).get()
            .then(documentSnapshot => {
                let userData = documentSnapshot.data();
                let packs = userData.packs;

                if (typeof(packs) === 'undefined') {
                    USERS_COLLECTION.doc(newPack.leader).update({
                        packs: []
                    })
                } else {
                    packs.push(newPackUUID)
                    USERS_COLLECTION.doc(newPack.leader).update({
                        packs: packs
                    })
                }
            })
        }

        return Promise.resolve(newPackUUID);
    }

    inviteUserToPack = async (uuid, packData) => {
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



        await INVITED_USER_DOC_REF.get().then(snapshot => {
            userNotifications = snapshot.data().notifications;
        });

        await userNotifications.push(receivedPackInviteNotificationStructure);

        INVITED_USER_DOC_REF.update({
            notifications: userNotifications,
        });
    }

    handleOnAcceptPackInvite = async (packUID, userUID) => {
        const INVITED_USER_DOC_REF = USERS_COLLECTION.doc(userUID);
        const PACK_DOC_REF = PACKS_COLLECTION.doc(packUID);

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

        //add to members list
        updatedMembers.push(packUID)

        PACK_DOC_REF.update({
            invited_members: updatedInviteList,
            members: updatedMembers
        })
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

    getPackInformationFromUUID = async (uuid) => {
        return new Promise(async (resolve, reject) => {
            await PACKS_COLLECTION.doc(uuid).get()
            .then(documentSnapshot => {
                const packData = documentSnapshot.data();
                resolve(packData);
            })
            .catch(error => {
                alert('Failed retrieivng pack info: ' + error)
                resolve(initializeNewPack('', ''));
            })
        })
    }

    loadCurrentUserPacks = async (): Promise<Array<Object>> => {
        let packUUIDS = [], packsData = [];
        let temp = getLupaUserStructurePlaceholder()
        let uuid = await LUPA_AUTH.currentUser.uid

        if (typeof (uuid) == 'undefined') {
            return Promise.resolve([])
        }

        try {

            await USERS_COLLECTION.doc(uuid).get().then(snapshot => {
                temp = snapshot.data();
            });

            packUUIDS = temp.packs;

            for (let i = 0; i < packUUIDS.length; i++) {
                await PACKS_COLLECTION.doc(packUUIDS[i]).get().then(snapshot => {
                    temp = snapshot.data();
                })


                try {
                    if (typeof (temp) != 'undefined' && temp != null) {
                        packsData.push(temp);
                    }
                } catch (error) {
                    LOG_ERROR('PacksController.ts', 'Unhandled exception in loadCurrentUserPacks()', error)
                    continue;
                }

            }
        } catch (error) {
            LOG_ERROR('PacksController.ts', 'Unhandled exception in loadCurrentUserPacks()', error)
            packsData = [];
        }


        return Promise.resolve(packsData);
    }
}
