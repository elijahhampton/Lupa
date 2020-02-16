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
    TouchableOpacity,
    RefreshControl
} from 'react-native';

import {
    Surface,
    Avatar,
} from 'react-native-paper';

import {
    SearchBar
} from 'react-native-elements';

import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode'

import { connect } from 'react-redux';

import LupaController from '../../../../controller/lupa/LupaController';

import { SmallPackCard, SubscriptionPackCard, TrainerFlatCard } from './Components/ExploreCards/PackExploreCard';

import {
    Feather as FeatherIcon
} from '@expo/vector-icons';

import UserSearchResultCard from '../search/components/UserSearchResultCard';
import TrainerSearchResultCard from '../search/components/TrainerSearchResultCard';
import PackSearchResultCard from '../search/components/PackSearchResultCard';
const windowWidth = Dimensions.get('window').width;

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

 class Explore extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            refreshing: false,
            trainers: [],
            explorePagePacks: [],
            usersInArea: [],
            subscriptionPacks: [],
            showPackModal: false,
            currUsersLocation: '',
            searchValue: "",
            searchResults: [0],
        }
    }

    componentDidMount = async () => {
       await this.setupExplorePage()
    } 

    async _prepareSearch() {
        await this.LUPA_CONTROLLER_INSTANCE.indexApplicationData();
    }

    _performSearch = async searchQuery => {
        await this.setState({
            searchResults: []
        })

        await this.setState({
            searchValue: searchQuery
        })

        this.LUPA_CONTROLLER_INSTANCE.search(searchQuery).then(searchData => {
            this.setState({ searchResults: searchData })
        })
    }

    showSearchResults() {
        return this.state.searchResults.map(result => {
            switch(result.resultType)
            {
                case "pack":
                    return (
                        <PackSearchResultCard  title={result.pack_title} isSubscription={result.pack_isSubscription} avatarSrc={result.pack_image} uuid={result.pack_uuid} />
                    )
                default:
            }
        })
    }
    
    setupExplorePage = async () => {
        let subscriptionPacksIn, trainersIn, explorePagePacksIn, usersInAreaIn, currUsersLocationIn, tempUsersLocation;
        const currUserLocation = this.props.lupa_data.Users.currUserData.location;
        await this.LUPA_CONTROLLER_INSTANCE.getExplorePagePacksBasedOnLocation(this.props.lupa_data.Users.currUserData.location).then(result => {
            explorePagePacksIn = result;
        });

        await this.LUPA_CONTROLLER_INSTANCE.getUsersBasedOnLocation(this.props.lupa_data.Users.currUserData.location).then(result => {
            usersInAreaIn = result;
        });
        
        await this.LUPA_CONTROLLER_INSTANCE.getSubscriptionPacksBasedOnLocation(this.props.lupa_data.Users.currUserData.location).then(result => {
            subscriptionPacksIn = result;
        })

        await this.LUPA_CONTROLLER_INSTANCE.getTrainersBasedOnLocation(this.props.lupa_data.Users.currUserData.location).then(result => {
            trainersIn = result;
        })

        //set component state
        await this.setState({
            explorePagePacks: explorePagePacksIn,
            usersInArea: usersInAreaIn,
            subscriptionPacks: subscriptionPacksIn,
            trainers: trainersIn,
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
        return this.state.usersInArea.map(user => {
            return (
                                    <Avatar.Image source={{uri: user.photo_url }} size={60} style={{margin: 5}} />
            )
        })
    }

    _renderExploreView = () => {
        return this.state.searchValue != "" ?

         <View style={{flex: 1}}>
            {
                this.showSearchResults()
            }
        </View> 

        :
        
        <>
        <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.headerText}>
                            Looking for Workout Sessions
                        </Text>
                        <NativeButton title="View all" />
                    </View>

                    <View style={{ width: windowWidth }}>
                        <ScrollView horizontal={true} contentContainerStyle={{ justifyContent: "space-around" }} showsHorizontalScrollIndicator={false}>
                           {
                               this.mapUsersInArea()
                           }
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
                </>
    }

    render() {
        return (
            <ScrollView shouldRasterizeIOS showsVerticalScrollIndicator={false} contentContainerStyle={styles.rootScrollView} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => alert('Refreshing')}/>}>
                                       <SearchBar placeholder="Find a pack by name"
                        onChangeText={text => this._performSearch(text)} 
                        platform="ios"
                        searchIcon={<FeatherIcon name="search" />}
                        containerStyle={{backgroundColor: "transparent"}}
                        value={this.state.searchValue}/>
                
                {
                    this._renderExploreView()
                }
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
});

export default connect(mapStateToProps)(Explore);