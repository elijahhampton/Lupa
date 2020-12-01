/**
 *
 */

import LUPA_DB, {
    LUPA_AUTH,
    Fire,
    FirebaseStorageBucket
} from '../firebase/firebase.js';

const PACKS_COLLECTION = LUPA_DB.collection('packs');
//import * as algoliasearch from 'algoliasearch'; // When using TypeScript
const algoliasearch = require('algoliasearch/reactnative.js');
const algoliaIndex = algoliasearch("EGZO4IJMQL", "f0f50b25f97f17ed73afa48108d9d7e6");
import {initializeNewPack} from '../../model/data_structures/packs/packs';
import LOG, { LOG_ERROR } from '../../common/Logger';
import { NOTIFICATION_TYPES } from '../../model/notifications/common/types'
import moment from 'moment';

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
            PACKS_COLLECTION.doc(docRef.id).update({ uuid: docRef.id });
        }).catch(error => {
            alert('Error creating pack: ' + error)
            return Promise.resolve(-1);
        });

        if (typeof(newPackUUID) === 'undefined' || newPackUUID == "") {
            return Promise.resolve(-1);
        }

        return Promise.resolve(newPackUUID);
    }
}
