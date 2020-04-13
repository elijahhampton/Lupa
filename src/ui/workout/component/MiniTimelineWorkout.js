import * as React from 'react';

import {
    StyleSheet
} from 'react-native';

import {
    Surface
} from 'react-native-paper';

function MiniTimelineWorkout(props) {
    return (
        <Surface style={styles.surface}>

        </Surface>
    )
}

const styles = StyleSheet.create({
    surface: {
        margin: 3, 
        backgroundColor: "white", 
        elevation: 3, 
        borderRadius: 5, 
        width: 20, 
        height: 20
    }
})

export default MiniTimelineWorkout;