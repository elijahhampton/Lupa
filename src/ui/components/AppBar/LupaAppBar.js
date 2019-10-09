import React from 'react';

import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    ScrollView,
    TouchableOpacity
} from 'react-native';

import {
    Appbar,
    Surface,
    Title,
    IconButton,
    Menu,
    Divider,
    Caption
} from 'react-native-paper';

import {
    Left,
    Right,
    Body
} from 'native-base';

const appBar = (props) => {
    return (
        <Appbar style={styles.appbar}>
<Title>
    {props.title}
</Title>

    <IconButton icon="inbox" size={20} />
</Appbar>
    );
}

const styles = StyleSheet.create({
    appbar: {
        backgroundColor: "transparent",
        elevation: 0,
        margin: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
});

export default appBar;