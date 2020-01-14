import React from 'react';

import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    RefreshControl,
} from 'react-native';

import {
    IconButton,
    Divider
} from 'react-native-paper';

import SafeAreaView from 'react-native-safe-area-view';
import { SessionNotificationCard } from './NotificationCard';

import LupaController from '../../../../controller/lupa/LupaController';

export default class NotificationsView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            refreshing: false,
            notifications: [],
        }

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    }

    onRefresh = async () => {
        console.log('uhh');
        this.setState({ refreshing: true })

        console.log('fetching..');
        await this.fetchNewNotifications();

        this.setState({ refreshing: false })
    }

    async fetchNewNotifications() {
        console.log('inside fetching function')
        let allNotifications;
        await this.LUPA_CONTROLLER_INSTANCE.getNotifications().then(res => {
            allNotifications = res;
        })
        console.log('allNotif: ' + allNotifications);
        this.setState({ notifications: allNotifications })
    }

    mapNotifications = () => {
        //Make sure there are some notifications loaded
        if (this.state.notifications.length == 0) {
            return;
        }

        //Sort data by timestamp

        //Return data
        return this.state.notifications.map(notification => {
            if (notification.type == 'SessionInvite') {
                let notificationData = notification.type;
                <SessionNotificationCard invitee={this.props.attendeeOne} description={notificationData.description}/>
            }
        })
    }

    render() {
        return (
            <View style={styles.root}>
                <SafeAreaView style={styles.safeAreaView}>
                <View style={{padding: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                <IconButton style={{alignSelf: "flex-start"}} icon="menu" size={20} onPress={() => this.props.navigation.openDrawer()} />
                <Text style={{fontSize: 25, fontWeight: "800"}}>
                    Notifications
                </Text>
                </View>
                <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh}/>}>
                    {
                        this.mapNotifications()
                    }
                </ScrollView>
                </SafeAreaView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "white"
    },
    appbar: {
        backgroundColor: "transparent",
        elevation: 0,
        margin: 10,
    },
    notificationsContent: {

    },
    safeAreaView: {
        flex: 1,
    },
    separator: {
        backgroundColor: "#FAFAFA",
        height: "10%"
    }
});