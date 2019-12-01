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
    TouchableOpacity,
} from 'react-native';

import {
    IconButton,
} from 'react-native-paper';

import {
    Input,
    Rating
} from 'react-native-elements';


import SearchFilter from './components/SearchFilter';
import LupaMapView from '../../Modals/LupaMapView';
import SafeAreaView from 'react-native-safe-area-view';
import { ScrollView } from 'react-native-gesture-handler';
import UserSearchResultCard from './components/UserSearchResultCard';
import TrainerSearchResultCard from './components/TrainerSearchResultCard';

import LupaController from '../../../../controller/lupa/LupaController';
const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

class SearchView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showMap: false,
            searchValue: '',
            readyToSearch: false,
            searchResults: [],
        }

       // eventEmitter.on('prepare_search', _prepareSearch);

    }

    componentDidMount() {
       this._prepareSearch();
        this.setState({
            readyToSearch: true,
        })
        console.log('Search prep finished');
    }

    async _prepareSearch() {
        await LUPA_CONTROLLER_INSTANCE.indexUsers();
    }

    _performSearch = async search => {
        this.setState({
            searchResults: []
        })

        this.setState({
            searchValue: search
        })
        let result;
        await LUPA_CONTROLLER_INSTANCE.searchUserByPersonalName(this.state.searchValue).then(data => {
            result = data;
        })

        this.setState({
            searchResults: this.state.searchResults.concat(result)
        },
        console.log('finished performing search and state is set'));
    }
    
    showSearchResults() {
        return this.state.searchResults.map(result => {
            console.log(result);
            switch(result.resultType)
            {
                case "trainer":
                    console.log('traienr')
                    return (
                        <TrainerSearchResultCard title={result.firstName + " " + result.lastName} location={result.location} rating={result.rating} />
                    )
                case "user":
                    console.log('user')
                    return (
                        <UserSearchResultCard title={result.firstName + " " + result.lastName} location={result.location} />
                    )
                case "pack":
                    break;
                default:
            }
        })
    }

    render() {
        return (
            <View style={styles.root}>
                <SafeAreaView forceInset={{ top: 'always', left: 'always', right: 'always', horizontal: 'never' }} />

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => this.setState({ showMap: true })}>
                        <View style={styles.location}>
                            <IconButton size={20} icon="room" color="#7E8BFF" style={{ margin: 0, padding: 0 }} />
                            <Text style={{ fontSize: 20, color: "#848484", fontWeight: "700" }}>
                                Auburn,
                                        </Text>
                            <Text>
                                {" "}
                            </Text>
                            <Text style={{ fontSize: 20, color: "#848484" }}>
                                Alabama
                                        </Text>
                        </View>
                    </TouchableOpacity>

                    <View style={{width: "100%", alignItems: "center", justifyContent: "center"}}>
                        <Input containerStyle={{width: "100%", alignSelf: "center", }}
                        placeholder="What are you looking for?" placeholderTextColor="#9E9E9E" 
                        inputContainerStyle={{borderColor: "#FAFAFA", borderBottomColor: "#FAFAFA", alignSelf: "center"}} 
                        inputStyle={{color: "#9E9E9E", fontWeight: "600", borderColor: "#FAFAFA", borderBottomColor: "#FAFAFA", alignSelf: "center"}}
                        onChangeText={text => this._performSearch(text)} value={this.state.searchValue} />
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.searchContainer}>
                    {
                        this.showSearchResults()
                    }
                </ScrollView>


                <SearchFilter />
                <LupaMapView isVisible={this.state.showMap} />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#FAFAFA",
    },
    header: {
        width: '100%',
        alignSelf: "center",
        flexDirection: "column",
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
    }
});

export default SearchView;