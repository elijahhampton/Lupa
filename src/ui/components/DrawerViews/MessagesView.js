import React from 'react';

import {
    View,
    StyleSheet,
    Text
} from 'react-native';

import {
    Left,
    Right,
    Body
} from 'native-base';

import {
    Appbar,
    IconButton,
    Title,
} from 'react-native-paper';

export default class MessagesView extends React.Component {
    render() {
        return (
            <View style={styles.root}>
            <LupaAppBar title="Messages" />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    appbar: {
        backgroundColor: "transparent",
        elevation: 0,
        margin: 10,
    }
});