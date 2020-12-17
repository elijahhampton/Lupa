import React, { useEffect, useState } from 'react';

import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import LupaController from '../../../controller/lupa/LupaController';
import { getLupaUserStructure, getLupaUserStructurePlaceholder } from '../../../controller/firebase/collection_structures';
import { useSelector } from 'react-redux/lib/hooks/useSelector';
import TrainerProfile from './TrainerProfile';
import UserProfile from './UserProfile';
import LUPA_DB from '../../../controller/firebase/firebase';
import LOG from '../../../common/Logger';

const ProfileController = ({ route }) => {
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    const [userData, setUserData] = useState(getLupaUserStructure());
    const [isCurrentUser, setIsCurrentUser] = useState(false);
    const [ready, setReady] = useState(false);
    const [userUUID, setUserUUID] = useState(0);

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

    /**
     * Returns the ID retrieved from navigating to this view.  Verifies that the ID exist first.
     * @return id the uuid returned from this.props.navigation
     */
    const _getId = () => {
        let id = 0
        try {
                id = route.params.userUUID;
                setUserUUID(id)

                if (currUserData.user_uuid == id) {
                    setIsCurrentUser(true)
                } else {
                    setIsCurrentUser(false)
                }

            return id;
        } catch(error) {
            
        }
        

        return id;
    }

    const renderProfile = () => {
            try {
            switch(userData.isTrainer) {
                case true:
                   return <TrainerProfile userData={userData} isCurrentUser={isCurrentUser} uuid={userUUID} />
                case false:
                   return <UserProfile userData={userData} isCurrentUser={isCurrentUser} uuid={userUUID} />
                default:
                    return <View style={{flex: 1, backgroundColor: '#FFFFFF'}} />
        }
    } catch(error) {
        return <View style={{flex: 1}} />
    }
    }

    useEffect(() => {
        const currUserSubscription = LUPA_DB.collection('users').doc(route.params.userUUID).onSnapshot(documentSnapshot => {
            const userData = documentSnapshot.data()
            setUserData(userData)
        });

        try {
            setUserUUID(route.params.userUUID)
            if (currUserData.user_uuid == route.params.userUUID) {
                setIsCurrentUser(true)
            } else {
                setIsCurrentUser(false)
            }
            setReady(true)
        } catch(error) {
            alert(error)
            setReady(false);
            setIsCurrentUser(false)
        }

        LOG('ProfileController.js', 'Running useEffect.')
        return () => currUserSubscription()
    }, [ready, userData.user_uuid, userUUID]);

    return renderProfile()
}

export default ProfileController;