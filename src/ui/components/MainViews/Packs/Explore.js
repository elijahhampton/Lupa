import React from 'react';

import {
    View,
    StyleSheet,
    Text,
    Button,
    ScrollView,
    Dimensions
} from 'react-native';

import { 
    Surface, 
    Avatar 
} from 'react-native-paper';

import ProfilePicture from '../../../images/temp-profile.jpg'

const windowWidth = Dimensions.get('window').width;


export default class Explore extends React.Component {
    render() {
        return (
            <ScrollView style={styles.root}>


                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.headerText}>
                            Browse Global Packs
                        </Text>
                        <Button title="View all" />
                    </View>

                    <View style={{width: Dimensions.get('window').width}}>
                    <ScrollView horizontal={true}>
                        <Surface style={styles.packCards}>

                        </Surface>
                    </ScrollView>

                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.headerText}>
                            Subscription Based Offers
                        </Text>
                        <Button title="View all" />
                    </View>

                    <View style={{width: Dimensions.get('window').width}}>
                    <ScrollView horizontal={true}>
                        <Surface style={styles.offerCards}>

                        </Surface>
                    </ScrollView>

                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.headerText}>
                            Find Pack Leaders
                        </Text>
                        <Button title="View all" />
                    </View>

                    <View style={{width: windowWidth}}>
                    <ScrollView horizontal={true} contentContainerStyle={{justifyContent: "space-around"}}>
                            <Avatar.Image size={60} source={ProfilePicture} style={{margin: 10}}/>
                        <Avatar.Image size={60} source={ProfilePicture} style={{margin: 10}}/>
                        <Avatar.Image size={60} source={ProfilePicture} style={{margin: 10}}/>
                    </ScrollView>

                    </View>
                </View>


            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        width: "100%",
        height: "100%",
    },
    headerText: {
        fontSize: 22,
        fontWeight: "500",
    },
    sectionContent: {
        alignItems: "center",
        flexDirection: "row",
    },
    section: {
        flexDirection: "column",
        margin: 10,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        justifyContent: "space-between",
    },
    packCards: {
        elevation: 1,
        width: 100,
        height: 100,
        borderRadius: 15,
        margin: 5,
    },
    offerCards: {
        elevation: 1,
        width: 120,
        height: 150,
        borderRadius: 15,
        margin: 5,
    },
    packCardsContainer: {

    }
})