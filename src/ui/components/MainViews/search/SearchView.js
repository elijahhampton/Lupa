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
    StyleSheet,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Modal
} from 'react-native';

import {
    IconButton,
    Avatar,
    Button
} from 'react-native-paper';

import {
    Input,
    SearchBar
} from 'react-native-elements';

import {
    Container,
    Header,
    Icon,
} from 'native-base';

import {
    Feather as FeatherIcon
} from '@expo/vector-icons';

import UserSearchResultCard from './components/UserSearchResultCard';
import TrainerSearchResultCard from './components/TrainerSearchResultCard';
import PackSearchResultCard from './components/PackSearchResultCard';

import LupaController from '../../../../controller/lupa/LupaController';
const buttonColor = "#2196F3";

export default class SearchView extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            searchValue: '',
            searchResults: [],
            refreshing: false,
        }
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
                case "trainer":
                    return (
                        <TrainerSearchResultCard title={result.display_name} email={result.email}  rating={result.rating} avatarSrc={result.photo_url} uuid={result.objectID}/>
                    )
                case "user":
                    return (
                        <UserSearchResultCard title={result.display_name} email={result.email} avatarSrc={result.photo_url} uuid={result.objectID} />
                    )
                case "pack":
                    return (
                        <PackSearchResultCard  title={result.pack_title} isSubscription={result.pack_isSubscription} avatarSrc={result.pack_image} uuid={result.pack_uuid} />
                    )
                case "workout":
                    break;
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

                    <Header span searchBar rounded style={{flexDirection: 'column'}}>
                        <SearchBar placeholder="Search the Lupa Database"
                        onChangeText={text => this._performSearch(text)} 
                        platform="ios"
                        searchIcon={<FeatherIcon name="search" />}
                        containerStyle={{backgroundColor: "transparent"}}
                        value={this.state.searchValue}/>
                    </Header>

                    <View style={{flex: 1}}>
                    <ScrollView contentContainerStyle={styles.searchContainer} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._handeOnRefresh} />}>
                    {
                        this.showSearchResults()
                    }
                </ScrollView>
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