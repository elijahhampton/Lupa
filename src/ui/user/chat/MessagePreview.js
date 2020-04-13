import React from 'react';

import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import { Avatar } from 'react-native-paper';

export default class MessagePreview extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {
        return (
            <View style={styles.root}>
             
            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        width: "100%",
        height: "auto",
        backgroundColor: "red",
    }
})
