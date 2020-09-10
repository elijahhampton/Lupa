import React, { useState, useEffect } from 'react'

import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    ScrollView,
    Dimensions,
} from 'react-native'

import LupaController from '../../controller/lupa/LupaController'
import { Appbar, Button } from 'react-native-paper'
import {
    SearchBar
} from 'react-native-elements'
import FeatherIcon from 'react-native-vector-icons/Feather'
import LargeProgramSearchResultCard from '../workout/program/components/LargeProgramSearchResultCard'
import Feather1s from 'react-native-feather1s/src/Feather1s'
import { useNavigation } from '@react-navigation/native'
import { Constants } from 'react-native-unimodules'

const CATEGORY_SEPARATION = 15

function Search({ navigation, route }) {
    const LUPA_CONTROLLER_INSTANCE= LupaController.getInstance();

    const [searching, setIsSearching] = useState(false)
    const [searchValue, setSearchValue] = useState("")
    const [searchResults, setSearchResults] = useState([])


    const performSearch = async searchQuery => {
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

        await LUPA_CONTROLLER_INSTANCE.searchPrograms(searchQuery).then(searchData => {
            setSearchResults(searchData)
        })

        await setIsSearching(false)
    }

    const renderComponentDisplay = () => {
        if (searching === true) {
            return renderSearchResults()
        }

        return (
            <ScrollView>
                <View style={[styles.category, { flexDirection: 'row', alignItems: 'center'}]}>
                <Text style={styles.categoryText}>
                    Programs Near you
                </Text>
                <FeatherIcon color="#1089ff" name="map-pin" size={15} style={{marginHorizontal: 10}} />
                </View>

                <View style={styles.category}>
                <Text style={styles.categoryText}>
                    Based off of Strength
                </Text>
                </View>

                <View style={styles.category}>
                <Text style={styles.categoryText}>
                    Based off of Power
                </Text>
                </View>

                <View style={styles.category}>
                <Text style={styles.categoryText}>
                    Based off of Agility
                </Text>
                </View>

                <View style={styles.category}>
                <Text style={styles.categoryText}>
                    Based off of Flexibility
                </Text>
                </View>

                <View style={styles.category}>
                <Text style={styles.categoryText}>
                    Based off of Speed
                </Text>
                </View>
                
               
            </ScrollView>
       
        )
    }

    const renderSearchResults = () => {
            return searchResults.map(result => {
                return (
                    <LargeProgramSearchResultCard program={result} />
                )
            })
        }  
    


    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.appbar}>
                <Appbar.Action onPress={() => navigation.pop()} icon={() => <Feather1s name="arrow-left" size={20} color="#212121" />} />
          
                <SearchBar placeholder="Search fitness programs"
                    onChangeText={text => performSearch(text)}
                    platform="ios"
                    searchIcon={<FeatherIcon name="search" size={15} color="#1089ff" />}
                    containerStyle={styles.searchContainerStyle}
                    inputContainerStyle={styles.inputContainerStyle}
                    inputStyle={styles.inputStyle}
                    placeholderTextColor="#212121"
                    value={searchValue} 

                    />
                    
              
            </Appbar.Header>
            {renderComponentDisplay()}
            <Button theme={{roundness: 8}} mode="contained" color="#1089ff" uppercase={false} style={{elevation: 5, height: 45, alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: Constants.statusBarHeight, alignSelf: 'center', width: Dimensions.get('window').width - 20, }}>
                    Recommendation
                </Button>
        </View>
    )
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    searchContainerStyle: {
        backgroundColor: "transparent",flex: 1,
    },
    inputContainerStyle: {
        backgroundColor: '#eeeeee',
    },
    inputStyle: {
        fontSize: 15, fontWeight: '800', fontFamily: 'Avenir-Roman'
    },
    iconContainer: {
        alignItems: 'center', justifyContent: 'center'
    },
    appbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderBottomColor: 'rgb(199, 199, 204)', 
        borderBottomWidth: 0.8 
    },
    categoryText: {
        fontSize: 15,
        fontFamily: 'Avenir-Heavy',
    },
    category: {
        marginVertical: CATEGORY_SEPARATION,
        padding: 20
    }
})

export default Search;