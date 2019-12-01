import React, { useState } from 'react';

import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';

import {
    Surface,
    Chip,
    Button,
    Caption
} from 'react-native-paper';

import {
    Avatar,
    Rating
} from 'react-native-elements';

import {
    withNavigation
} from 'react-navigation';

const contentUnexpandedHeight = 0;
const contentExpandedHeight = 100;

const UserSearchResultCard = (props) => {
    const [height, setHeight] = useState(contentUnexpandedHeight);

    return (
        <TouchableWithoutFeedback onPress={() => { setHeight(contentExpandedHeight) }}>
            <Surface style={[styles.cardContainer]}>

                <View style={{ flex: 2, alignItems: "center", flexDirection: "row", justifyContent: "space-around" }}>
                    <Avatar label={props.title} rounded size="small" />
                    <View style={styles.cardContent}>
                        <Text>
                            {props.title}
                        </Text>
                        <Text style={{ fontWeight: "700" }}>
                            {props.location}
                        </Text>

                    </View>
                    <Chip style={[styles.chipIndicator, { backgroundColor: "#2196F3" }]} mode="flat">
                    Lupa Trainer
                    </Chip>
                </View>


                <View style={[styles.expandedContent, { height: height }]}>
                    <Text>
                        Hi
                </Text>
                </View>

            </Surface>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: "column",
        justifyContent: "space-around",
        elevation: 3,
        borderRadius: 0,
        height: 70,
        width: "100%",
        height: "auto",
        margin: 5,
        padding: 20,
        backgroundColor: "transparent",
    },
    cardContent: {
        flexDirection: "column",
        alignSelf: "center",
        justifyContent: "space-around",
    },
    expandedContent: {
        padding: 20,
    },
    chipIndicator: {
        width: 100,
        height: 25,
        alignItems: "center",
        justifyContent: "center",
        margin: 5
    },
    rating: {
        backgroundColor: "transparent",
    }
});

export default withNavigation(UserSearchResultCard);