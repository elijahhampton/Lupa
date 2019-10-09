import React from 'react';

import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import {
    RadioButton
} from 'react-native-paper';

export default class Event extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <View style={styles.root}>
            <View style={styles.dateContainer}>
                    <Text style={styles.date}>
                        05/27/2019
                    </Text>
                    <Text style={styles.day}>
                        Sunday
                    </Text>
            </View>

            <View style={styles.noteContainer}>
                <Text style={{fontWeight: "700", fontSize: 15, color: 'black'}}>
                    Note:
                </Text>
                <Text style={{fontWeight: "200", color: "rgba(0,0,0,.3)", fontSize: 15}}>
                    Example Note
                </Text>
            </View>

            <RadioButton
          style={styles.radio}
          value="first"
          status='checked'
          onPress={() => alert('Checked')} />  
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flexDirection: "row",
        width: "100%",
        alignItems: "flex-start",
        display: "flex",
        margin: 3,
    },
    dateContainer: {
        display: "flex",
        width: "20%",
    },
    date: {
        fontWeight: "500",
        fontSize: 13,
        color: "red",
    },
    day: {
        fontWeight: "700",
        fontSize: 15,
        color: 'black'
    },
    noteContainer: {
        flexDirection: "column",
        display: "flex",
        width: "70%",
    },
    radio: {
        alignSelf: "flex-end",
        width: "5%",
    }
})