import React, { useEffect, useState } from 'react';

import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import LupaController from '../../../controller/lupa/LupaController';
import { getLupaUserStructure } from '../../../controller/firebase/collection_structures';
import { useSelector } from 'react-redux/lib/hooks/useSelector';
import TrainerProfile from './TrainerProfile';
import UserProfile from './UserProfile';
import LUPA_DB from '../../../controller/firebase/firebase';
import { render } from 'react-dom';
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
            if (route.params.userUUID) {
                id = route.params.userUUID;
                setUserUUID(id)
        } else {
            id = currUserData.user_uuid
            setUserUUID(id)
        }
        } catch(error) {
            alert(error);
            return 0
        }

        return id;
    }

    const renderProfile = () => {
        
            switch(userData.isTrainer) {
       
                case true:
                   return <TrainerProfile userData={userData} isCurrentUser={isCurrentUser} uuid={userUUID} />
                case false:
                   return <UserProfile userData={userData} isCurrentUser={isCurrentUser} />
                default:
                    return <View style={{flex: 1}} />
        }
    }

    useEffect(() => {
        let currUserSubscription;
        let receivedUUID;
       async function fetchData() {
            const uuid = await _getId();
            
            currUserSubscription = LUPA_DB.collection('users').doc(uuid).onSnapshot(documentSnapshot => {
                const userData = documentSnapshot.data()
                setUserData(userData)
            });

            if (uuid == userData.user_uuid) {
                setIsCurrentUser(true)
            } else {
             
                setIsCurrentUser(false);
            }

        }

        try {
            fetchData();

          
        } catch(error) {
            setReady(false);
            setIsCurrentUser(false)
            alert(error);
        }


       
        setReady(true);
        LOG('ProfileController.js', 'Running useEffect.')
        return () => currUserSubscription()
    }, [userData.user_uuid]);

    return renderProfile()
}

export default ProfileController;