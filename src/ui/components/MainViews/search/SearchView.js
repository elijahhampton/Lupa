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
    Dimensions
} from 'react-native';

import {
    IconButton,
} from 'react-native-paper';

import {
    Left,
    Body,
    Right,
} from 'native-base';

import {
    SearchBar
} from 'react-native-elements';


import SearchCategoryCard from './components/SearchCategoryCard';
import SearchFilter from './components/SearchFilter';

class SearchView extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <View style={styles.root}>
                <View style={styles.header}>
                    <Left>
                        <IconButton icon="tune" size={25} color="black" />
                    </Left>

                    <Body>
                        <View style={styles.headerLocation}>
                            <Text style={{ fontSize: 16, color: "#848484", fontWeight: "100" }}>
                                Location
                    </Text>
                            <View>
                                <TouchableOpacity onPress={() => alert('Change location')}>
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
                            </View>
                        </View>
                    </Body>

                    <Right>
                        <IconButton size={25} icon="people" color="black" />
                    </Right>
                </View>

                <SearchFilter />

                
                <View style={styles.searchContent}>
                    <SearchBar inputContainerStyle={{ backgroundColor: "#e5e5e6", borderRadius: 30 }} containerStyle={styles.searchContainer} inputStyle={styles.searchInput} placeholder="Search Lupa" />

                    <View style={{ alignItems: "center", justifyContent: "space-evenly", width: Dimensions.get('window').width, height: "15%", flexDirection: "row", backgroundColor: "transparent" }}>
                        <SearchCategoryCard categoryTitle="Users" />

                        <SearchCategoryCard categoryTitle="Trainers" />

                        <SearchCategoryCard categoryTitle="Gyms" />
                    </View>


                    <View style={{ top: "15%", alignSelf: "center" }}>
                        <Text style={{ fontSize: 35, fontWeight: "600", color: "#D6D6D6" }}>
                            Search for Users, Trainers,{"\n"}and Gyms.
                        </Text>
                    </View>


                </View>
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
        height: '10%',
        flexDirection: "row",
    },
    headerLocation: {
        flexDirection: "column",
        alignItems: "center",
    },
    location: {
        flexDirection: "row",
        alignItems: "center",
    },
    searchContent: {
        backgroundColor: "#F3F3F3",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width: "100%",
        height: "90%",
    },
    searchSurface: {
        height: "5%",
        width: "90%",
        margin: 15,
        borderRadius: 40,
        alignItems: "center",
        flexDirection: "row",
        alignSelf: "center",
    },
    searchContainer: {
        backgroundColor: "transparent",
        borderTopColor: "transparent",
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: "transparent",
        borderRadius: 40,
        margin: 10,
    },
    searchInput: {
        backgroundColor: "#e5e5e6",
    }
});

export default SearchView;