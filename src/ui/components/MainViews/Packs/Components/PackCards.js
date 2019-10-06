import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    Image,
} from 'react-native';

import {
    Surface
} from 'react-native-paper';


const MyPacksCard = () => {
    return (
        <Surface style={styles.myPacksRoot}>
            
        </Surface>
    );
}

const styles = StyleSheet.create({
    myPacksRoot: {
        elevation: 4,
        width: "100%",
        height: 200,
        borderRadius: 40,
        margin: 15,
    }
});

export {
    MyPacksCard,
}