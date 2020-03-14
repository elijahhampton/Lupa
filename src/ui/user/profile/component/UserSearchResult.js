import React from 'react';

import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

import {
    Avatar,
    Chip
} from 'react-native-paper';

const userSearchResult = (props) => {
    return (
        <View style={styles.root}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Avatar.Image size={40} source={{url: props.avatarSrc}} style={{margins: 8}}/>
                    <View style={styles.userContent}>
                        <Text style={{fontSize: 17, fontWeight: 'bold'}}>
                           {props.displayName}
                        </Text>
                        <Text style={{fontWeight: 15, fontWeight: '600'}}>
                            {props.username}
                        </Text>
                    </View>
                    </View>
                    {
                        props.isTrainer == true ?                     <Chip style={[styles.chipIndicator, { backgroundColor: "#2196F3" }]} mode="flat">
                        Lupa Trainer
                        </Chip> :                     <Chip style={[styles.chipIndicator, { backgroundColor: "#2196F3" }]} mode="flat">
                    Lupa User
                    </Chip>
                    }
                </View>
    )
};

const styles = StyleSheet.create({
    root: {
        flexDirection: "row", alignItems: "center", width: "100%", padding: 5, justifyContent: 'space-between'
    },
    userContent: {
        flexDirection: "column", justifyContent: "flex-start", margin: 3
    },
    chipIndicator: {
        width: 100,
        height: 25,
        alignItems: "center",
        justifyContent: "center",
        margin: 5,

    },
})

export default userSearchResult;