import React from 'react';

import {
    View,
    StyleSheet,
    Text,
    ScrollView,
} from 'react-native';

import {
    IconButton,
} from 'react-native-paper';

import NotificationListContainer from './NotificationListContainer';
import SafeAreaView from 'react-native-safe-area-view';

const Separator = () => {
    return (
        <View style={styles.separator}>

        </View>
    );
}

export default class NotificationsView extends React.Component {
    render() {
        return (
            <View style={styles.root}>
                <SafeAreaView style={styles.safeAreaView}>
                <IconButton style={{alignSelf: "flex-start"}} icon="menu" size={20} onPress={() => this.props.navigation.openDrawer()} />
                <ScrollView contentContainerStyle={styles.notificationsContent}>
                    <NotificationListContainer notificationCategory="New" />
                    <Separator style={styles.separator}/>
                    <NotificationListContainer notificationCategory="General" />
                    <Separator style={styles.separator}/>
                    <NotificationListContainer notificationCategory="Sessions" />
                    <Separator style={styles.separator}/>
                    <NotificationListContainer notificationCategory="Packs" />
                </ScrollView>
                </SafeAreaView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#FAFAFA"
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