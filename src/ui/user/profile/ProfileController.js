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
                alert(route.params.userUUID)
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
            if (uuid == currUserData.user_uuid) {
                setUserData(currUserData);
                setIsCurrentUser(true);
                setReady(true);
                return;
            }

            await LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(uuid).then(data => {
                setUserData(data);
                setIsCurrentUser(false);
            });
        }

        try {
            fetchData();
        } catch(error) {
            setReady(false);
            alert(error);
        }

        setReady(true);
    }, []);

    return renderProfile()
}

export default ProfileController;