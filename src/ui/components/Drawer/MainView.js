import React from 'react';

import {
    View,
    StyleSheet,
    Text,
    ScrollView
} from 'react-native';

const mainView = () => {
    return (
        <ScrollView style={styles.root}>
            <Text>
                Hi
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "red",
    }
})

export default mainView;