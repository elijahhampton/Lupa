/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  23, 2019
 * 
 *  UserDashboardView
 */

import React, { useState, useEffect } from 'react';

import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    RefreshControl,
    Dimensions,
} from 'react-native';

import {
    Appbar,
} from 'react-native-paper';

import { useNavigation } from '@react-navigation/native'

import LupaController from '../../../controller/lupa/LupaController';
import { connect, useSelector } from 'react-redux';
import LUPA_DB from '../../../controller/firebase/firebase';

import { NOTIFICATION_TYPES } from '../../../model/notifications/common/types'
import ReceivedProgramNotification from '../notifications/component/ReceivedProgramNotification';

const { windowWidth } = Dimensions.get('window').width

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state
    }
}

const Dashboard = () => {
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
                case NOTIFICATION_TYPES.RECEIVED_NOTIFICATION:
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
        <SafeAreaView style={styles.safeareaview}>
            <Appbar.Header style={styles.appbar}>
                <Appbar.Content title="Dashboard" titleStyle={{fontFamily: 'HelveticaNeue-Bold', fontSize: 20, fontWeight: '600'}} />
            </Appbar.Header>
            <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false} refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={_onRefresh}
                />}>
         

                {renderNotifications()}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    appbar: {
        backgroundColor: '#FFFFFF',
        elevation: 0
    },
    scrollView: {
        flexGrow: 2,
        flexDirection: 'column',
        backgroundColor: '#FFFFFF'
    },
    safeareaview: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    header: {
        flexDirection: 'row', 
        alignItems: 'center', 
        width: "100%", 
        height: "auto",
    },
    headerText: {
          
        fontSize: 30,
        color: 'white', 
        alignSelf: "center",
        color: '#1565C0'
    },
    sectionHeader: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        margin: 3,
        fontFamily: "avenir-book",
        color: '#212121'
    },
    sectionHeaderText: {
        fontSize: 18, 
        color: '#212121',
         
    },
    divider: {
        margin: 10
    },
    iconButton: {
        
    },
    chipStyle: {
        backgroundColor: 'rgba(227,242,253 ,1)', 
        width: 'auto', 
        alignItems: 'center', 
        justifyContent: 'center',
        margin: 5, 
        alignSelf: 'flex-end'
    },
    chipTextStyle: {
        fontSize: 15,
    },
});

export default connect(mapStateToProps)(Dashboard);