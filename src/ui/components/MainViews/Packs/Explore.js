import React from 'react';

import {
    View,
    StyleSheet,
    Text,
    Button as NativeButton,
    ScrollView,
    Dimensions,
    TouchableWithoutFeedback,
    Image,
    RefreshControl
} from 'react-native';

import {
    Surface,
    Avatar,
} from 'react-native-paper';

import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode'

import LupaController from '../../../../controller/lupa/LupaController';

import { SmallPackCard, SubscriptionPackCard, TrainerFlatCard } from './Components/ExploreCards/PackExploreCard';

const windowWidth = Dimensions.get('window').width;

export default class Explore extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            refreshing: false,
            trainers: [],
            explorePagePacks: [],
            usersInArea: [],
            subscriptionPacks: [],
            showPackModal: false
        }
    }

    componentDidMount() {
        this.setupExplorePage()
    } 

    setupExplorePage = async () => {
        let subscriptionPacksIn, trainersIn, explorePagePacksIn, usersInAreaIn;

        //get trainers
        await this.LUPA_CONTROLLER_INSTANCE.getAllTrainers().then(result => {
            trainersIn = result;
        })

        //get global packs
        await this.LUPA_CONTROLLER_INSTANCE.getExplorePagePacks().then(result => {
            explorePagePacksIn = result;
        });

        //get subscription packs
        await this.LUPA_CONTROLLER_INSTANCE.getSubscriptionPacks().then(result => {
            subscriptionPacksIn = result;
        })

        //get users in area


        //set component state
        await this.setState({
            trainers: trainersIn,
            explorePagePacks: explorePagePacksIn,
            subscriptionPacks: subscriptionPacksIn,
        })
    }

    closePackModal = () => {
        this.setState({ showPackModal: false })
    }

    mapTrainers = () => {
        return this.state.trainers.map(trainer => {
            return (
                <TrainerFlatCard trainerUUID={trainer.id} displayName={trainer.display_name} rating={trainer.rating} sessionsCompleted={trainer.sessions_completed} image={trainer.photo_url} location={trainer.location} />
            )
        })
    }

    mapGlobalPacks = () => {
        return this.state.explorePagePacks.map(globalPacks => {
            return (
                <SmallPackCard packUUID={globalPacks.id} image={globalPacks.pack_image} />
            )
        })
    }

    mapSubscriptionPacks = () => {
        return this.state.subscriptionPacks.map(subscriptionPacks => {
            return (
                <SubscriptionPackCard packUUID={subscriptionPacks.id} image={subscriptionPacks.pack_image} />
            )
        })
    }

    mapUsersInArea = () => {

    }

    render() {
        return (
            <ScrollView shouldRasterizeIOS showsVerticalScrollIndicator={false} contentContainerStyle={styles.rootScrollView} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => alert('Refreshing')}/>}>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.headerText}>
                            Looking for Workout Sessions
                        </Text>
                        <NativeButton title="View all" />
                    </View>

                    <View style={{ width: windowWidth }}>
                        <ScrollView horizontal={true} contentContainerStyle={{ justifyContent: "space-around" }} showsHorizontalScrollIndicator={false}>
                           {/* <Avatar.Image size={60} source={ProfilePicture} style={{ margin: 10 }} />
                            <Avatar.Image size={60} source={ProfilePicture} style={{ margin: 10 }} />
        <Avatar.Image size={60} source={ProfilePicture} style={{ margin: 10 }} /> */}
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
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} shouldRasterizeIOS={true} >
                           {this.mapGlobalPacks()}
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

                    <ScrollView horizontal={true} shouldRasterizeIOS={true} showsHorizontalScrollIndicator={false}>
                        <TouchableWithoutFeedback>
                            <Surface style={styles.filter}>
                                <Text style={styles.filterText}>
                                    Near Me
                                </Text>
                            </Surface>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback>
                            <Surface style={styles.filter}>
                                <Text style={styles.filterText}>
                                    > 5 Members
                                </Text>
                            </Surface>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback>
                            <Surface style={styles.filter}>
                                <Text style={styles.filterText}>
                                    > 10 Members
                                </Text>
                            </Surface>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback>
                            <Surface style={styles.filter}>
                                <Text style={styles.filterText}>
                                    Tier 1 Trainer
                                </Text>
                            </Surface>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback>
                            <Surface style={styles.filter}>
                                <Text style={styles.filterText}>
                                    Tier 2 Trainer
                                </Text>
                            </Surface>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback>
                            <Surface style={styles.filter}>
                                <Text style={styles.filterText}>
                                    Tier 3 Trainer
                                </Text>
                            </Surface>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback>
                            <Surface style={styles.filter}>
                                <Text style={styles.filterText}>
                                    Tier 4 Trainer
                                </Text>
                            </Surface>
                        </TouchableWithoutFeedback>
                    </ScrollView>

                    <View style={{ width: Dimensions.get('window').width }}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            {this.mapSubscriptionPacks()}
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
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} shouldRasterizeIOS={true} contentContainerStyle={{ justifyContent: "space-around" }}>
                            {this.mapTrainers()}
                        </ScrollView>

                    </View>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    rootScrollView: {
        backgroundColor: "#FFFFFF"
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