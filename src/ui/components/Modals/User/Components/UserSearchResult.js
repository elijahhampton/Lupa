import React, { useState }from 'react';

import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

import {
    Avatar
} from 'react-native-paper';

const userSearchResult = (props) => {
    console.log('displayname: ' + props.displayName)
    console.log('displayname: ' + props.username)
    return (
        <View style={styles.root}>
                    <Avatar.Text label="eh" size={40} source={props.photoUrl}/>
                    <View style={styles.userContent}>
                        <Text>
                           {props.displayName}
                        </Text>
                        <Text>|
                            {props.username}
                        </Text>
                    </View>
                </View>
    )
};

const styles = StyleSheet.create({
    root: {
        flexDirection: "row", alignItems: "center", width: "100%", padding: 5
    },
    userContent: {
        flexDirection: "column", justifyContent: "flex-start", margin: 3
    }
})

export default userSearchResult;