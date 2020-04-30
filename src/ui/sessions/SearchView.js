/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  23, 2019
 * 
 *  SearchView
 */

import React from 'react';

import {
    View,
    StyleSheet,
    RefreshControl,
    ScrollView,
    Image,
    Text,
    Button as NativeButton,
    Dimensions,
    SafeAreaView,
    Animated,
} from 'react-native';

import {
    Headline,
    Surface,
    Portal,
    Provider,
    Searchbar,
    Avatar,
    Button,
    FAB,
} from 'react-native-paper';

import {
    SearchBar,
} from 'react-native-elements';


import {
    Container,
} from 'native-base';

import MaterialIcon from "react-native-vector-icons/MaterialIcons"

import UserSearchResultCard from './component/UserSearchResultCard';
import TrainerSearchResultCard from './component/TrainerSearchResultCard';

import { NavigationActions, withNavigation } from 'react-navigation'

import { TrainerCard } from '../packs/component/ExploreCards/PackExploreCard'

import LupaController from '../../controller/lupa/LupaController';

import { connect } from 'react-redux';
import UpcomingSessionCard from './component/UpcomingSessionCard';
import { Video } from 'expo-av';

import SessionsVideo from '../video/video.mp4'

mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

class SearchView extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            searchValue: '',
            searchResults: [],
            refreshing: false,
            currUserData: this.props.lupa_data.Users.currUserData,
            suggestedTrainers: [],
            upcomingSessions: [],
            open: false,
            searchViewHeight: Dimensions.get('window').height / 2
        }
    }

    componentDidMount = async () => {
        await this.setupExplorePage();
    }

    doIt = () => {
        const end = this.state.searchViewHeight == Dimensions.get('window').height / 2 ? 0 : Dimensions.get('window').height / 2

        Animated.timing(this.state.searchViewHeight, {
            toValue: end,
            duration: 500,
        }).start();
    }

    setupExplorePage = async () => {
        let suggestedTrainersIn, upcomingSessionsIn;

        await this.LUPA_CONTROLLER_INSTANCE.getUpcomingSessions(this.props.lupa_data.Users.currUserData.user_uuid).then(result => {
            upcomingSessionsIn = result;
        });

        //set component state
        await this.setState({
            upcomingSessions: upcomingSessionsIn,
            suggestedTrainers: suggestedTrainersIn,
        });
    }

    mapTrainers = () => {
        return this.state.suggestedTrainers.map(trainer => {
            return (
                <TrainerCard userUUID={trainer.user_uuid} displayName={trainer.display_name} sessionsCompleted={trainer.sessions_completed} location={trainer.location} />
            )
        })
    }

    mapUpcomingSessions = () => {
        return this.state.upcomingSessions.length == 0 ?
        <Text style={{fontSize: 15,borderColor: "#212121", padding: 10, marginLeft: 20, alignSelf: "flex-start"}}>
            You have no sessions scheduled.
        </Text>
        :
        this.state.upcomingSessions.map(session => {
            return (
                <UpcomingSessionCard userDataObject={session.otherUserData} sessionDataObject={session} />
            )
        })
    }

    mapSuggestedTrainers = () => {
        return this.state.suggestedTrainers.map(user => {
            return (
                <Surface style={{ elevation: 8, margin: 5, borderRadius: 15, width: 300, height: 110, backgroundColor: "#212121", padding: 10 }}>
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", }}>
                        <Avatar.Image source={{ uri: user.photo_url }} size={50} />

                        <View style={{ padding: 10 }}>
                            <Text style={{ fontFamily: 'Avenir-Roman', color: "white" }}>
                                {user.display_name}
                            </Text>
                            <Text style={{ fontSize: 15, color: "grey" }}>
                                National Association for Medicine
                        </Text>
                        </View>
                    </View>

                    <View style={{ width: '100%', flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>

                        <Button mode="outlined" color="white" compact style={{ margin: 5, width: '35%' }} uppercase={false} contentStyle={{ width: '100%' }}>
                            View Profile
                    </Button>
                    </View>

                </Surface>
            )
        })
    }

    async _prepareSearch() {
        await this.LUPA_CONTROLLER_INSTANCE.indexApplicationData();
    }

    _performSearch = async searchQuery => {
        let searchResultsIn;

        //If no search query then set state and return 
        if (searchQuery == "" || searchQuery == '') {
            await this.setState({
                searchValue: "",
                searchResults: []
            });

            return;
        }

        await this.setState({
            searchResults: []
        })

        await this.setState({
            searchValue: searchQuery
        })

        await this.LUPA_CONTROLLER_INSTANCE.search(searchQuery).then(searchData => {
            searchResultsIn = searchData;
        })

        await this.setState({ searchResults: searchResultsIn })
    }

    showSearchResults() {
        //if the searchResults are 0 or undefined then we don't want to display anything
        if (this.state.searchResults.length == 0 || this.state.searchResults == undefined) {
            return;
        }

        if (typeof (this.state.searchResults[0]) != "object") {
            return;
        }

        return this.state.searchResults.map(result => {
            switch (result.resultType) {
                case "trainer":
                    return (
                        <TrainerSearchResultCard title={result.display_name} username={result.username} email={result.email} avatar={result.photo_url} uuid={result.objectID} />
                    )
                case "user":
                    return (
                        <UserSearchResultCard title={result.display_name} username={result.username} email={result.email} avatar={result.photo_url} uuid={result.objectID} />
                    )
                default:
            }
        })
    }

    _handleOnRefresh = async () => {
        //Refreshing
        this.setState({ refreshing: true });

        //Fetch data (index users)
        await this._prepareSearch();

        //End refreshing
        this.setState({ refreshing: false });
    }

    _onStateChange = ({ open }) => this.setState({ open: !this.state.open });

    render() {
        const open = this.state;
        return (
            <Container style={styles.root}>
                <View style={{ flex: 1, backgroundColor: "white" }}>
                    <Surface style={{ elevation: 10, borderBottomLeftRadius: 30, position: "absolute", width: Dimensions.get('window').width, top: 0, height: this.state.searchViewHeight, backgroundColor: "#2196F3" }}>
                        <SafeAreaView />
                        <Video
                            source={SessionsVideo}
                            rate={1.0}
                            volume={1.0}
                            isMuted={false}
                            resizeMode="cover"
                            shouldPlay
                            isLooping
                            style={{ position: "absolute", borderBottomLeftRadius: 30, width: "100%", height: "100%" }} />
                        <Text style={{ fontFamily: "ars-maquette-pro",fontSize: 30, color: "#212121", padding: 10, alignSelf: "flex-end" }}>
                            Sessions
                    </Text>

                        <Searchbar 
                            placeholder="Search Users and Lupa Trainers" 
                            style={{position: 'absolute', bottom: 20, borderRadius: 30, width: '90%', alignSelf: 'center'}}
                            onChangeText={text => this._performSearch(text)}
                            value={this.state.searchValue}
                            />
                    </Surface>

                    <View style={{ position: "absolute", bottom: 0, height: Dimensions.get('window').height / 2 }}>
                        {
                            this.state.searchResults == '' ?
                                <View style={{flex: 1}} shouldRasterizeIOS={true}>
                                    <Text style={{ fontFamily: 'ARSMaquettePro-Regular', fontSize: 25, color: "#212121", padding: 10, alignSelf: "flex-start" }}>
                                        Upcoming Sessions
                                     </Text>
                                    <ScrollView>
                                    {
                                        this.mapUpcomingSessions()
                                    }
                                    </ScrollView>
                                </View>
                                :
                                <ScrollView contentContainerStyle={styles.searchContainer} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._handeOnRefresh} />} shouldRasterizeIOS={true}>
                                    {
                                        this.showSearchResults()
                                    }
                                </ScrollView>
                        }
                    </View>
                </View>
           <FAB.Group
             open={this.state.open}
             icon={this.state.open ? 'list' : 'menu'}
             actions={[
               { icon: 'directions-run', label: 'Programs', onPress: () => this.props.navigation.navigate('Programs'), color: '#FFFFFF', style: {backgroundColor: '#212121'}},
               { icon: 'fitness-center', label: 'Build a Workout', onPress: () => this.props.navigation.navigate('BuildAWorkout'), color: '#FFFFFF', style: {backgroundColor: '#212121'}},
             ]}
             onPress={() => {
               this.setState({ open: !this.state.open})
             }}
             onStateChange={this._onStateChange}
             style={{position: 'absolute'}}
             fabStyle={{backgroundColor: "#212121"}}
           />
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "white",
    },
    header: {
        width: '100%',
        alignSelf: "center",
        flexDirection: "column",
        backgroundColor: "white"

    },
    location: {
        alignSelf: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    searchContainer: {
        flexDirection: "column",
        alignItems: "center",

        backgroundColor: "transparent",
    },
    searchContainerNoResults: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: "red",
    },
    button: {

    }
});

export default connect(mapStateToProps)(withNavigation(SearchView));