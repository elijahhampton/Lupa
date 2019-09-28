import React from 'react';

import {
    View,
    StyleSheet,
    Text,
    ScrollView,
} from 'react-native';

import {
    Left,
    Body,
    Right,
    Separator
} from 'native-base';

import {
    Appbar,
    IconButton,
    Title
} from 'react-native-paper';
import NotificationListContainer from './NotificationListContainer';

export default class NotificationsView extends React.Component {
    render() {
        return (
            <View style={styles.root}>
                <Appbar style={styles.appbar}>
                    <Left>
                        <IconButton icon="menu" size={20} />
                    </Left>
                    <Body>
                    <Title>
                        Notifications
                    </Title>
                    </Body>
                    <Right>
                        <IconButton icon="inbox" size={20} />
                    </Right>
                </Appbar>
                <ScrollView contentContainerStyle={styles.notificationsContent}>
                    <NotificationListContainer notificationCategory="New" />
                    <Separator style={styles.separator}/>
                    <NotificationListContainer notificationCategory="General" />
                    <Separator style={styles.separator}/>
                    <NotificationListContainer notificationCategory="Sessions" />
                    <Separator style={styles.separator}/>
                    <NotificationListContainer notificationCategory="Packs" />
                </ScrollView>
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
    },
    notificationsContent: {

    },
    separator: {
        backgroundColor: "#FAFAFA",
    }
});