import React, { useState, useEffect } from 'react'

import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    ScrollView,
    Animated,
    RefreshControl,
    Dimensions,
} from 'react-native'

import {Body, Header, List, ListItem as Item, ScrollableTab, Tab, Right, Tabs, Title, Left} from "native-base";

import LupaController from '../../controller/lupa/LupaController'
import { Appbar, Button, FAB, Surface } from 'react-native-paper'
import {
    SearchBar
} from 'react-native-elements'

import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import FeatherIcon from 'react-native-vector-icons/Feather'
import LargeProgramSearchResultCard from '../workout/program/components/LargeProgramSearchResultCard'
import Feather1s from 'react-native-feather1s/src/Feather1s'
import { useNavigation } from '@react-navigation/native'
import { Constants } from 'react-native-unimodules'
import { MenuIcon } from '../icons';
import { getLupaProgramInformationStructure } from '../../model/data_structures/programs/program_structures';
import LUPA_DB from '../../controller/firebase/firebase';
import { connect } from 'react-redux';

const CATEGORY_SEPARATION = 15
const NAVBAR_HEIGHT = 50;
const {width: SCREEN_WIDTH} = Dimensions.get("window");
const COLOR = "#FFFFFF";
const TAB_PROPS = {
  tabStyle: {backgroundColor: COLOR},
  activeTabStyle: {backgroundColor: COLOR},
  textStyle: {color: "rgba(35, 55, 77, 0.75)", fontFamily: 'Avenir-Heavy'},
  activeTextStyle: {color: "#1089ff", fontFamily: 'Avenir-Heavy', fontWeight: 'bold'}
};

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state
    }
}

class Search extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE= LupaController.getInstance();

        this.state = {
            searching: false,
            searchValue: "",
            searchResults: [],
            refreshing: false,
            popularPrograms: [],
            locationResults: []
        }

    }

    componentDidMount() {
        let docData = getLupaProgramInformationStructure();
        let popularProgramResults = [];
        let locationBasedResults = []

        this.popularProgramsObserver = LUPA_DB.collection('programs').where('completedProgram', '==', true).onSnapshot(querySnapshot => {
            querySnapshot.forEach(doc => {
                docData = doc.data();
                if (docData.program_location.address.includes(this.props.lupa_data.Users.currUserData.location.city) || docData.program_location.address.includes(this.props.lupa_data.Users.currUserData.location.state)) {
                    locationBasedResults.push(docData);
                }


                popularProgramResults.push(docData);
            });

            this.setState({ popularPrograms: popularProgramResults, locationResults: locationBasedResults})
        });

    }

    componentWillUnmount() {
        return() => this.popularProgramsObserver();
    }

    handleOnRefresh() {
        this.setState({ refreshing: true })
        this.setState({ refreshing: false })
      }


   performSearch = async searchQuery => {
        //If no search query then set state and return
        if (searchQuery == "" || searchQuery == "") {
            this.state({
                searching: true,
                searchValue: "",
                searchResults: []
            })
            return;
        }

        await this.setState({
            searching: true,
            searchValue: searchQuery,
            searchResults: []
        })

        await this.LUPA_CONTROLLER_INSTANCE.searchPrograms(searchQuery).then(searchData => {
            this.setState({ searchResults: searchData })
        })

        await this.setState({
            searching: false
        })

    }

    renderComponentDisplay = () => {
        if (this.state.searching === true) {
            return this.renderSearchResults()
        }

        return (
            null
        )
    }

    renderSearchResults = () => {
            return this.state.searchResults.map(result => {
                return (
                    <LargeProgramSearchResultCard program={result} />
                )
            })
        }  
    

        render() {
         
    return (

        <View style={{flex: 1, backgroundColor: 'white'}}>
            <Appbar.Header style={styles.appbar}>
                <Appbar.Action onPress={() => this.props.navigation.pop()} icon={() => <Feather1s name="arrow-left" size={20} color="#212121" />} />
          
                <Appbar.Content title="Search" titleStyle={{alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 20}} />
              
            </Appbar.Header>
          
          <ScrollView
          contentContainerStyle={{flex: 1}}
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleOnRefresh}/>}
            scrollEventThrottle={1}
            bounces={false}
            showsVerticalScrollIndicator={false}>
            <Tabs 
            
            
            renderTabBar={(props) => <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{width: '90%'}}>
                <ScrollableTab {...props} style={{  shadowRadius: 1, justifyContent: 'flex-start', elevation: 0, borderBottomColor: '#FFFFFF', backgroundColor: COLOR}} tabsContainerStyle={{flex: 1, justifyContent: 'flex-start', backgroundColor: COLOR, elevation: 0}} underlineStyle={{backgroundColor: "#1089ff", height: 5, width: 5, borderRadius: 10,marginLeft: 30, elevation: 0, borderRadius: 8}}/>
                </View>
          
                <View style={{width: '10%', alignItems: 'center', justifyContent: 'center'}}>
                    <MaterialIcon name="search" size={20} />
                </View>
            </View>
            }>
              
              <Tab heading="Popular" {...TAB_PROPS}>
                <ScrollView contentContainerStyle={{alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap'}}>
                    {
                        this.state.popularPrograms.map(program => {
                            return (
                                <LargeProgramSearchResultCard program={program} />
                            )
                        })
                    }
                </ScrollView>
    
              </Tab>

              <Tab heading="Most Recent" {...TAB_PROPS} >
              <ScrollView contentContainerStyle={{alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap'}}>
                    {
                        this.state.popularPrograms.map(program => {
                            return (
                                <LargeProgramSearchResultCard program={program} />
                            )
                        })
                    }
                </ScrollView>
              </Tab>
              
              <Tab heading="Location" {...TAB_PROPS} >
              <ScrollView contentContainerStyle={{alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap'}}>
                    {
                        this.state.locationResults.map(program => {
                            return (
                                <LargeProgramSearchResultCard program={program} />
                            )
                        })
                    }
                </ScrollView>
              </Tab>

            </Tabs>
          </ScrollView>
  
       
        </View>
    )
        }
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
        backgroundColor: '#FFFFFF',
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
       // borderBottomColor: 'rgb(199, 199, 204)', 
       // borderBottomWidth: 0.8,
        elevation: 0,
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

export default connect(mapStateToProps)(Search)