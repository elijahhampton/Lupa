import React from 'react';

import {
    View,
    StyleSheet,
    Text,
} from 'react-native';

import {
    Card,
    Button,
    Caption,
} from 'react-native-paper';
import { Rating } from 'react-native-ratings';

const trainerFlatCard = () => {
    return (
        <Card style={styles.card}>
<Card.Cover style={{height: 180}} source={{ uri: 'https://picsum.photos/700' }} />
<Card.Actions style={{height: "auto", flexDirection: "column", alignItems: "flex-start"}}>
    <View style={{paddingTop: 3, paddingBottom: 3}}>
    <Text style={styles.text}>
        Elijah Hampton
    </Text>
    <Text style={[styles.text, {fontWeight: "bold"}]}>
        Chicago, United States
    </Text>
    </View>

    <Rating showRating={false} imageSize={15} readonly/>

    <Caption>
        Elijah Hampton has completed over 75 sessions on Lupa.
    </Caption>
</Card.Actions>
</Card>
    );
}

export default trainerFlatCard;

const styles = StyleSheet.create({
    card: {
        width: 250,
        height: "auto",
        margin: 5,
    },
    text: {
        fontSize: 12,
    }
})
