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

    createPack = async (name, leader) => {
        const newPack = initializeNewPack(name, leader);
        let newPackUUID = "";

        await PACKS_COLLECTION.add(newPack)
        .then((docRef) => {
            newPackUUID = docRef.id
            PACKS_COLLECTION.doc(docRef.id).update({ uid: docRef.id, members: [leader] });
        }).catch(error => {
            return Promise.resolve(-1);
        });

        if (typeof(newPackUUID) === 'undefined' || newPackUUID == "") {
            return Promise.resolve(-1);
        } else {
            await USERS_COLLECTION.doc(leader).get()
            .then(documentSnapshot => {
                let userData = documentSnapshot.data();
                let packs = userData.packs;

                if (typeof(packs) === 'undefined') {
                    USERS_COLLECTION.doc(leader).update({
                        packs: []
                    })
                } else {
                    packs.push(newPackUUID)
                    USERS_COLLECTION.doc(leader).update({
                        packs: packs
                    })
                }
            })
        }

        return Promise.resolve(newPackUUID);
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
