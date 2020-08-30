import React from 'react';

import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

import {
    Avatar,
    Chip,
    Button
} from 'react-native-paper';

const userSearchResult = (props) => {
    return (
        <View style={styles.root}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Avatar.Image size={40} source={{uri: props.avatarSrc}} style={{margin: 5}}/>
                    <View style={styles.userContent}>
                        <Text style={{fontSize: 12, fontWeight: 'bold'}}>
                           {props.displayName}
                        </Text>
                        <Text style={{fontSize: 10, fontWeight: "600"}}>
                            {props.username}
                        </Text>
                    </View>
                    </View>
                    {
                            props.hasButton == true ?
                            <Button uppercase={false} mode="outlined" style={{elevation: 0}} onPress={props.buttonOnPress} theme={{
                                colors: {
                                    primary: '#2196F3'
                                },
                                roundness: 5
                            }}>
                                <Text>
                                {props.buttonTitle}
                                </Text>
                            </Button>
                            :
                            null
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