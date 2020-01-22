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
        await this.setState({
            searchResults: []
        })

        await this.setState({
            searchValue: search
        })


        let result;
        await this.LUPA_CONTROLLER_INSTANCE.searchUserByPersonalName(this.state.searchValue).then(data => {
            result = data;
        })

        //Remove any duplicates
        const newData = result.filter(item => {      
            const itemData = item.display_name;  
            console.log(itemData) 

             const textData = search;
            
             return itemData.indexOf(textData) > -1;    
          });
          
          this.setState({searchResults: newData });
    }
    
    showSearchResults() {
        return this.state.searchResults.map(result => {
            switch(result.resultType)
            {
                case "trainer":
                    return (
                        <TrainerSearchResultCard title={result.display_name} email={result.email} location="Chicago, United States" rating={result.rating} uuid={result.objectID}/>
                    )
                case "user":
                    return (
                        <UserSearchResultCard title={result.display_name} email={result.email} location="Chicago, United States" uuid={result.objectID} />
                    )
                case "pack":
                    break;
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
                    <View style={{width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                        <View style={{width: "85%"}}>
                        <SearchBar placeholder="Search the Lupa Database"
                        onChangeText={text => this._performSearch(text)} 
                        platform="ios"
                        searchIcon={<FeatherIcon name="search" />}
                        containerStyle={{backgroundColor: "transparent"}}
                        value={this.state.searchValue}/>
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

export default SearchView;