import React from 'react';

import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

export default class eventListContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            packEvents: []

        }
    }

    render() {
        const packEventsLength = this.state.packEvents.length;
        return (
            <View style={styles.root}>
                {
                    packEventsLength== 0 ? <Text> There are no scheduled events for this pack. </Text> : <Text> There are no scheduled events for this pack. </Text>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        
    }
})