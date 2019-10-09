import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    ScrollView
} from 'react-native';

import Event from './Event';

export default class eventListContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            packEvents: [1,2,3]

        }
    }

    render() {
        const packEventsLength = this.state.packEvents.length;
        return (
            <View style={styles.root}>
                <Text style={{fontSize: 20, fontWeight: "500"}}>
            Events
        </Text>
            <ScrollView contentContainerStyle={{height: "100%"}}>
                {
                    packEventsLength == 0 ? <Text> There are no scheduled events for this pack. </Text> : <Event />
                }
            </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        padding: 5,
    }
})