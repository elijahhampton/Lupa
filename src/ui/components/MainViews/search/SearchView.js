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
    Feather as FeatherIcon
} from '@expo/vector-icons';

import UserSearchResultCard from './components/UserSearchResultCard';
import TrainerSearchResultCard from './components/TrainerSearchResultCard';

import LupaController from '../../../../controller/lupa/LupaController';

import UserProfileModal from '../../DrawerViews/Profile/UserProfileModal';

const buttonColor = "#2196F3";

class SearchView extends React.Component {
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

    _performSearch = async search => {
        this.setState({
            searchResults: []
        })

        this.setState({
            searchValue: search
        })


        let result;
        await this.LUPA_CONTROLLER_INSTANCE.searchUserByPersonalName(this.state.searchValue).then(data => {
            result = data;
        })

        this.setState({
            searchResults: this.state.searchResults.concat(result)
        },
        console.log('finished performing search and state is set'));

    }
    
    showSearchResults() {
        return this.state.searchResults.map(result => {
            switch(result.resultType)
            {
                case "trainer":
                    return (
                        <TrainerSearchResultCard title={result.display_name} location="Chicago, United States" rating={result.rating} uuid={result.objectID}/>
                    )
                case "user":
                    return (
                        <UserSearchResultCard title={result.display_name} location="Chicago, United States" uuid={result.objectID} />
                    )
                case "pack":
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
            <View style={styles.root}>
                <SafeAreaView style={{backgroundColor: "transparent"}}>

                <View style={styles.header}>
                    <View style={{width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                        <View style={{width: "85%"}}>
                        <SearchBar placeholder="Search the Lupa Database"
                        onChangeText={text => this._performSearch(text)} 
                        platform="ios"
                        searchIcon={<FeatherIcon name="search" />}
                        containerStyle={{backgroundColor: "white"}}/>
                        </View>
                        <View style={{width: "15%"}}>
                        <IconButton icon="tune" color="black" size={20} onPress={() => alert('Filter Results')} />
                        </View>
                    </View>
                    <View style={{flexDirection: "row", justifyContent: "space-evenly"}}>
                        <Button mode="text" compact color={buttonColor} style={styles.button}>
                            Users
                        </Button>
                        <Button mode="text" compact  color={buttonColor} style={styles.button}>
                            Trainers
                        </Button>
                        <Button mode="text" compact  color={buttonColor} style={styles.button}>
                            Packs
                        </Button>
                        <Button mode="text" compact  color={buttonColor} style={styles.button}>
                            Workouts
                        </Button>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.searchContainer} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._handeOnRefresh} />}>
                    {
                        this.showSearchResults()
                    }
                </ScrollView>
                </SafeAreaView>
            </View>
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
        margin: 5,
        backgroundColor: "red",
    },
    button: {
        borderWidth: 1, borderRadius: 10, borderColor: "#E0E0E0",
    }
});

export default SearchView;