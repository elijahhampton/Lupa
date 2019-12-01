import React from 'react';

import {
    StyleSheet,
    Text,
    View
} from 'react-native';

import {
    Caption,
    Headline
} from 'react-native-paper';

export default class NotificationListContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            notifications: [],
        }
    }

    render() {
        return (
            <View style={styles.root}>
                <Text style={styles.headerText}>
                    {this.props.notificationCategory}
                </Text>

                {
                    this.state.notifications.length == 0 ? ( <Caption> You do not have any notifications. </Caption> ) : alert('Need to render notifications..')
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: "white",
        width: "100%",
        height: "auto",
        padding: 10,
    },
    headerText: {
        fontSize: 15,
        fontWeight: "500",
    }
})