import React, { useEffect, useState } from 'react'

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
} from 'react-native'
import {
    Appbar
} from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import LupaController from '../../../controller/lupa/LupaController'
import LUPA_DB from '../../../controller/firebase/firebase'
import ReceivedProgramNotification from './component/ReceivedProgramNotification'
import { NOTIFICATION_TYPES } from '../../../model/notifications/common/types'
import Feather1s from 'react-native-feather1s/src/Feather1s'


function NotificationsView(props) {
    const [refreshing, setIsRefreshing] = useState(false)
    const [userNotifications, setUserNotifications] = useState([])

    const navigation = useNavigation()

    const currUserData = useSelector(state => {
        return state.Users.currUserData
    })

    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    useEffect(() => {
        try {
            const currUserSubscription = LUPA_DB.collection('users').doc(currUserData.user_uuid).onSnapshot(documentSnapshot => {
                let userData = documentSnapshot.data()
                setUserNotifications(userData.notifications)
            })


            return () => currUserSubscription()
        } catch(err) {
            setUserNotifications([])
            alert(err)
            return
        }
    }, [])

    const setupComponent = async () => {
        await loadNotifications(currUserData.user_uuid)
    }

    const loadNotifications = async (uuid) => {
        let notificationsIn = [];

        try {
            await LUPA_CONTROLLER_INSTANCE.getUserNotifications(uuid).then(notifications => {
                notificationsIn = notifications;
            })

        } catch (err) {
           notificationsIn = []
        }

        setUserNotifications(notificationsIn)
    }

    const renderNotifications = () => {
        return userNotifications.map((notification, index, arr) => {
            switch(notification.type) {
                case NOTIFICATION_TYPES.RECEIVED_PROGRAM:
                    return <ReceivedProgramNotification notificationData={notification} />
                default:
                    
            }
        })
    }

    const _onRefresh = async () => {
        setIsRefreshing(true)
        await setupComponent()
        setIsRefreshing(false)
    }

    return (
        <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
            <Appbar.Header style={styles.appbar}>
            <Appbar.Action icon={() => <Feather1s thin={true} name="arrow-left" size={20} />} onPress={() => navigation.pop()} />
            <Appbar.Content title="Notifications" titleStyle={{alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 20}} />
            </Appbar.Header>
            <View style={{flex: 1}}>
            <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false} refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={_onRefresh}
                />}>
         

                {renderNotifications()}
            </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    appbar: {
        backgroundColor: '#FFFFFF',
        elevation: 0,
        borderBottomWidth: 0.5, borderColor: 'rgb(174, 174, 178)'
    },
})

export default NotificationsView;
