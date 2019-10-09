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

import LupaAppBar from '../../../AppBar/LupaAppBar';

export default class UpcomingView extends React.Component {
    render() {
        return (
            <View style={styles.root}>
            <LupaAppBar title="Upcoming" />
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