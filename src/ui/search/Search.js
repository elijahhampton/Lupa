import React, { useState, useEffect } from 'react'

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native'

import LupaController from '../../controller/lupa/LupaController'
import { Appbar } from 'react-native-paper'
import {
    SearchBar
} from 'react-native-elements'
import FeatherIcon from 'react-native-vector-icons/Feather'
import LargeProgramSearchResultCard from '../workout/program/components/LargeProgramSearchResultCard'

function Search(props) {
    const LUPA_INSTANCE_CONTROLLER = LupaController.getInstance();

    const [searching, setIsSearching] = useState(false)
    const [searchValue, setSearchValue] = useState("")
    const [searchResults, setSearchResults] = useState([])

    const performSearch = async searchQuery => {
        let searchResultsIn = []

        //If no search query then set state and return
        if (searchQuery == "" || searchQuery == "") {
            setIsSearching(true)
            setSearchValue("")
            setSearchResults([])

            return;
        }

        await setSearchResults([])
        await setIsSearching(true)
        await setSearchValue(searchQuery)

        /*    await LUPA_CONTROLLER_INSTANCE.searchPrograms(searchQuery).then(searchData => {
                setSearchResults(searchResultsIn)
            })*/
        
        await setIsSearching(false)
    }

    const renderSearchResults = () => {
        {
            return searchResults.map(result => {
                return (
                    <LargeProgramSearchResultCard program={result} />
                )
            })
        }
    }

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.appbar}>
                 <SearchBar placeholder="Search fitness programs"
                        onChangeText={text => performSearch(text)}
                        platform="ios"
                        searchIcon={<FeatherIcon name="search" size={15} color="#1089ff" />}
                        containerStyle={styles.searchContainerStyle}
                        inputContainerStyle={styles.inputContainerStyle}
                        inputStyle={styles.inputStyle}
                        placeholderTextColor="#212121"
        value={searchValue} />
        <View style={styles.iconContainer}>
            <FeatherIcon name="sliders" size={20} color="#212121" />
        </View>
            </Appbar.Header>
            <ScrollView>
                {renderSearchResults()}
            </ScrollView>


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F2'
    },
    searchContainerStyle: {
        backgroundColor: "transparent", width: '90%'
    },
    inputContainerStyle: {
        backgroundColor: '#eeeeee',
    },
    inputStyle: {
        fontSize: 15, color: 'black', fontWeight: '800', fontFamily: 'avenir-roman'
    },
    iconContainer: {
        width: '10%', alignItems: 'center', justifyContent: 'center'
    },
    appbar: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        elevation: 0,
    }
})

export default Search;