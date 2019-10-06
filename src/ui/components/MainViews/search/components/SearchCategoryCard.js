import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    Dimensions
} from 'react-native';

import PropTypes from 'prop-types';

import {
    Surface
} from 'react-native-paper';

const searchCategoryCard = (props) => {
    return (
        <View style={styles.root}>
            <Surface style={styles.surface}>

            </Surface>
            <Text style={styles.text}>
                {props.categoryTitle}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center",
        width: Dimensions.get('window').width / 6, 
        height: "60%", 
        margin: 10, 
    },
    surface: {
        width: "100%",
        height: "100%",
        borderRadius: 15, 
        elevation: 15, 
    },
    text: {
        margin: 10,
    }
})

export default searchCategoryCard;