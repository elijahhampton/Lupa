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

const ProfileController = ({ route }) => {
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    const [userData, setUserData] = useState(getLupaUserStructure());
    const [isCurrentUser, setIsCurrentUser] = useState(false);
    const [ready, setReady] = useState(false);

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
        } else {
            id = currUserData.user_uuid
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
                   return <TrainerProfile userData={userData} isCurrentUser={isCurrentUser} />
                case false:
                    return <TrainerProfile userData={userData} isCurrentUser={isCurrentUser} />
                  // return <UserProfile userData={userData} isCurrentUser={isCurrentUser} />
                default:
                    return <View style={{flex: 1}} />
        }
    }

    useEffect(() => {
       async function fetchData() {
            const uuid = await _getId();
            
            const currUserSubscription = LUPA_DB.collection('users').doc(uuid).onSnapshot(documentSnapshot => {
                const userData = documentSnapshot.data()
                setUserData(userData)

                try {
                    if (uuid == currUserData.user_uuid) {
                        setIsCurrentUser(true)
                    } else {
                        setIsCurrentUser(false);
                    }
                } catch(error) {
                    setReady(false);
                    setIsCurrentUser(false);
                    alert(error);
                }
    
               
                setReady(true);
            });

            return () => currUserSubscription()
        }

        try {
            fetchData();
        } catch(error) {
            setReady(false);
            alert(error);
        }
        return () => fetchData();
    }, []);

    return renderProfile()
}

export default ProfileController;