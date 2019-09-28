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

export default class UpcomingView extends React.Component {
    render() {
        return (
            <View style={styles.root}>
                <Appbar style={styles.appbar}>
                    <Left>
                        <IconButton icon="menu" size={20} />
                    </Left>
                    <Body>
                    <Title>
                        Upcoming
                    </Title>
                    </Body>
                    <Right>
                        <IconButton icon="inbox" size={20} />
                    </Right>
                </Appbar>
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
    }
});