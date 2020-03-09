/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  23, 2019
 * 
 *  SearchView
 */

import React from 'react';

import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Image,
    Modal
} from 'react-native';

import {
    IconButton,
    Avatar,
    Headline,
    Paragraph,
    Surface,
    Caption,
    Card,
    Title,
} from 'react-native-paper';

import {
    Input,
    SearchBar,
    Button,
    Rating
} from 'react-native-elements';


import {
    Container,
    Header,
    Icon,
    Left,
    Body,
    Right
} from 'native-base';

import {
    Feather as FeatherIcon
} from '@expo/vector-icons';

import UserSearchResultCard from './components/UserSearchResultCard';
import TrainerSearchResultCard from './components/TrainerSearchResultCard';
import PackSearchResultCard from './components/PackSearchResultCard';

import {TrainerCard} from '../Packs/Components/ExploreCards/PackExploreCard';

import LupaController from '../../../../controller/lupa/LupaController';

import { connect } from 'react-redux';

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
            trainers: [],
        }
    }

    componentDidMount = async () => {
        await this.setupExplorePage();
    }

    setupExplorePage = async () => {
        let subscriptionPacksIn, trainersIn, explorePagePacksIn, usersInAreaIn, currUsersLocationIn, tempUsersLocation;

        await this.LUPA_CONTROLLER_INSTANCE.getTrainersBasedOnLocation(this.props.lupa_data.Users.currUserData.location).then(result => {
            trainersIn = result;
        })

        //set component state
        await this.setState({
            trainers: trainersIn,
        })
        
    }

    mapTrainers = () => {
       {/* return this.state.trainers.map(trainer => {
            return (
                <TrainerCard userUUID={trainer.user_uuid} displayName={trainer.display_name} sessionsCompleted={trainer.sessions_completed} location={trainer.location} />
            )
        })*/}
    }

    async _prepareSearch() {
        await this.LUPA_CONTROLLER_INSTANCE.indexApplicationData();
    }

    _performSearch = async searchQuery => {
        let searchResultsIn;
        
        //If no search query then set state and return 
        if (searchQuery == "" || searchQuery == '')
        {
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
        if (this.state.searchResults.length == 0 || this.state.searchResults == undefined 
            || typeof(this.state.searchResults[0]) != "object")
            {
                return;
            }
        return this.state.searchResults.map(result => {
            switch(result.resultType)
            {
                case "trainer":
                    return (
                        <TrainerSearchResultCard title={result.display_name} email={result.email} uuid={result.objectID}/>
                    )
                case "user":
                    return (
                        <UserSearchResultCard title={result.display_name} email={result.email} uuid={result.objectID} />
                    )
                default:
            }
        })
    }

    _handleOnRefresh = () => {
        //Refreshing
        this.setState({ refreshing: true });

        //Fetch data (index users)
        _prepareSearch();

        //End refreshing
        this.setState({ refreshing: false });
    }

    render() {
        return (
            <Container style={styles.root}>

                    <Header searchBar rounded transparent={true} style={{backgroundColor: 'white', flexDirection: 'column'}}>
                        <Right style={{alignSelf: 'flex-end'}}>
                        <Title style={{fontSize: 25, fontWeight: 600, color: "black", alignSelf: 'flex-end'}}>
                       Sessions
                    </Title>
                        </Right>

                    </Header>
                    <SearchBar placeholder="Search the Lupa Database"
                        onChangeText={text => this._performSearch(text)} 
                        platform="ios"
                        searchIcon={<FeatherIcon name="search" />}
                        containerStyle={{backgroundColor: "transparent"}}
                        value={this.state.searchValue}/>

                    <View style={{flex: 1}}>
                        {
                            this.state.searchValue == '' ?
                            <ScrollView contentContainerStyle={{position: 'absolute', bottom: 15,}} horizontal showsHorizontalScrollIndicator={true}>
                                {
                                    this.mapTrainers()
                                }
                            </ScrollView>
                            :
                            <ScrollView contentContainerStyle={styles.searchContainer} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._handeOnRefresh} />}>

                            {
                                                                this.showSearchResults()
                            }
                            
                        </ScrollView>

                        }
                    </View>
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
    button: {
        
    }
});

export default connect(mapStateToProps)(SearchView);