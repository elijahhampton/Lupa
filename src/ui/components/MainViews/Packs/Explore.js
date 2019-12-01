import React from 'react';

import {
    View,
    StyleSheet,
    Text,
    Button as NativeButton,
    ScrollView,
    Dimensions,
    TouchableWithoutFeedback,
    Image
} from 'react-native';

import {
    Surface,
    Avatar,
} from 'react-native-paper';

import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode'

import TrainerFlatCard from './Components/ExploreCards/TrainerFlatCard';

import ProfilePicture from '../../../images/temp-profile.jpg'

const windowWidth = Dimensions.get('window').width;

export default class Explore extends React.Component {
    render() {
        return (
            <>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.headerText}>
                            Looking for Workout Sessions
                        </Text>
                        <NativeButton title="View all" />
                    </View>

                    <View style={{ width: windowWidth }}>
                        <ScrollView horizontal={true} contentContainerStyle={{ justifyContent: "space-around" }}>
                            <Avatar.Image size={60} source={ProfilePicture} style={{ margin: 10 }} />
                            <Avatar.Image size={60} source={ProfilePicture} style={{ margin: 10 }} />
                            <Avatar.Image size={60} source={ProfilePicture} style={{ margin: 10 }} />
                        </ScrollView>

                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.headerText}>
                            Browse Global Packs
                        </Text>
                        <NativeButton title="View all" />
                    </View>

                    <View style={{ width: Dimensions.get('window').width }}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            <Surface style={styles.packCards}>
                                <Image style={{width: "100%", height: "100%", borderRadius: 20}} 
                                resizeMode={ImageResizeMode.cover} 
                                source={{ uri: 'https://picsum.photos/700' }} />
                            </Surface>

                            <Surface style={styles.packCards}>
                            <Image style={{width: "100%", height: "100%", borderRadius: 20}} 
                                resizeMode={ImageResizeMode.cover} 
                                source={{ uri: 'https://picsum.photos/700' }} />
                            </Surface>

                            <Surface style={styles.packCards}>
                            <Image style={{width: "100%", height: "100%", borderRadius: 20}} 
                                resizeMode={ImageResizeMode.cover} 
                                source={{ uri: 'https://picsum.photos/700' }} />
                            </Surface>
                        </ScrollView>

                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.headerText}>
                            Subscription Based Offers
                        </Text>
                        <NativeButton title="View all" />
                    </View>

                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <TouchableWithoutFeedback>
                            <Surface style={styles.filter}>
                                <Text style={styles.filterText}>
                                    Filter
                                </Text>
                            </Surface>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback>
                            <Surface style={styles.filter}>
                                <Text style={styles.filterText}>
                                    Filter
                                </Text>
                            </Surface>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback>
                            <Surface style={styles.filter}>
                                <Text style={styles.filterText}>
                                    Filter
                                </Text>
                            </Surface>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback>
                            <Surface style={styles.filter}>
                                <Text style={styles.filterText}>
                                    Filter
                                </Text>
                            </Surface>
                        </TouchableWithoutFeedback>
                    </ScrollView>

                    <View style={{ width: Dimensions.get('window').width }}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            <Surface style={styles.offerCards}>
                            <Image style={{width: "100%", height: "100%", borderRadius: 15}} 
                                resizeMode={ImageResizeMode.cover} 
                                source={{ uri: 'https://picsum.photos/700' }} />
                            </Surface>

                            <Surface style={styles.offerCards}>
                            <Image style={{width: "100%", height: "100%", borderRadius: 15}} 
                                resizeMode={ImageResizeMode.cover} 
                                source={{ uri: 'https://picsum.photos/700' }} />
                            </Surface>

                            <Surface style={styles.offerCards}>
                            <Image style={{width: "100%", height: "100%", borderRadius: 15}} 
                                resizeMode={ImageResizeMode.cover} 
                                source={{ uri: 'https://picsum.photos/700' }} />
                            </Surface>

                            <Surface style={styles.offerCards}>
                            <Image style={{width: "100%", height: "100%", borderRadius: 15}} 
                                resizeMode={ImageResizeMode.cover} 
                                source={{ uri: 'https://picsum.photos/700' }} />
                            </Surface>
                        </ScrollView>

                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.headerText}>
                            Find Pack Leaders
                        </Text>
                        <NativeButton title="View all" />
                    </View>

                    <View style={{ width: windowWidth }}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ justifyContent: "space-around" }}>
                            <TrainerFlatCard />
                            <TrainerFlatCard />
                            <TrainerFlatCard />
                            <TrainerFlatCard />
                        </ScrollView>

                    </View>
                </View>
            </>
        );
    }
}

const styles = StyleSheet.create({
    root: {

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
        width: 250,
        height: 120,
        borderRadius: 20,
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

    },
    filter: {
        width: 120,
        height: 40,
        borderRadius: 20,
        elevation: 3,
        margin: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    filterText: {
        fontWeight: "bold",
        fontSize: 15
    },
    card: {
        width: 250,
        height: 250
    }
})