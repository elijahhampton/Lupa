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
    Easing
} from 'react-native'

import {Body, Header, List, ListItem as Item, ScrollableTab, Tab, Right, Tabs, Title, Left} from "native-base";

import LupaController from '../../controller/lupa/LupaController'
import { Appbar, Button, Chip, FAB, Searchbar, Surface } from 'react-native-paper'
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
            searchShowing: false,
            searching: false,
            searchValue: "",
            searchResults: [],
            refreshing: false,
            popularPrograms: [],
            locationResults: [],
            searchContainerWidth: new Animated.Value(0),
            scrollableTabbarWidth: new Animated.Value(1),
            previousSearches: [],
            currTab: 1,
            noResultsViewHeight: 0,
        }

    }

    componentDidMount() {
        let docData = getLupaProgramInformationStructure();

        this.popularProgramsObserver = LUPA_DB.collection('programs').where('completedProgram', '==', true).onSnapshot(querySnapshot => {
            let popularProgramResults = [];
            let locationBasedResults = [];
            querySnapshot.forEach(doc => {
                docData = doc.data();
                if (docData.program_location.address.includes(this.props.lupa_data.Users.currUserData.location.city) || docData.program_location.address.includes(this.props.lupa_data.Users.currUserData.location.state)) {
                    locationBasedResults.push(docData);
                }


                popularProgramResults.push(docData);
            });

            this.setState({ popularPrograms: popularProgramResults, locationResults: locationBasedResults})
        });

        this.mostRecentProgramsObserver = LUPA_DB.collection('programs').orderBy('program_start_date', 'asc').onSnapshot(querySnapshot => {
            let mostRecentResults = []
            querySnapshot.forEach(doc => {
                docData = doc.data();
                mostRecentResults.push(docData);
            });
        })
    }

    componentWillUnmount() {
        let subscriptions = [
            this.popularProgramsObserver,
            this.mostRecentProgramsObserver
        ]
        return subscriptions.map((subscription) => {
            return () => subscription()
        })
    }

    handleOnRefresh() {
        this.setState({ refreshing: true })
        this.setState({ refreshing: false })
    }

    showSearch = () => {
       this.setState({ searchShowing: true })

        Animated.timing(this.state.searchContainerWidth, {
            toValue: 1,
            duration: 200,
            easing: Easing.linear
        }).start();

        Animated.timing(this.state.scrollableTabbarWidth, {
            toValue: 0,
            duration: 200,
            easing: Easing.linear
        }).start();
    }

    hideSearch = () => {
        this.setState({ searchShowing: false })

        Animated.timing(this.state.searchContainerWidth, {
            toValue: 0,
            duration: 200,
            easing: Easing.linear
        }).start();

        Animated.timing(this.state.scrollableTabbarWidth, {
            toValue: 1,
            duration: 200,
            easing: Easing.linear
        }).start();
    }


   performSearch = async searchQuery => {
        //If no search query then set state and return
        if (searchQuery == "" || searchQuery == "") {
            this.setState({
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

        handleOnChangeText = (text) => {
            if (text == "") {
                this.hideSearch()
            }

            this.performSearch(text)
        }
    

        render() {
         this.state.searching != "" ? () => this.setState({ currTab: 0}) : null
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
            page={this.state.currTab}
            onChangeTab={tabInfo => this.setState({ currTab: tabInfo.i })} 
            renderTabBar={(props) => <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Animated.View style={{width: this.state.scrollableTabbarWidth.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '90%']
                })}}>
                <ScrollableTab {...props} style={{  shadowRadius: 1, justifyContent: 'flex-start', elevation: 0, borderBottomColor: '#FFFFFF', backgroundColor: COLOR}} tabsContainerStyle={{flex: 1, justifyContent: 'flex-start', backgroundColor: COLOR, elevation: 0}} underlineStyle={{backgroundColor: "#1089ff", height: 5, width: 5, borderRadius: 10,marginLeft: 30, elevation: 0, borderRadius: 8}}/>
                </Animated.View>
          
                <Animated.View style={{width: this.state.searchContainerWidth.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                }), flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                   {this.state.searchShowing === true ? null : <MaterialIcon onPress={() => this.showSearch()} style={{padding: 20, width: '100%'}} name="search" size={20} /> } 
                   {this.state.searchShowing === true ?
                   <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                    <Searchbar 
                    style={{width: Dimensions.get('window').width - 20, marginVertical: 10, alignSelf: 'center'}} 
                    placeholder="Search programs or trainers"
                    iconColor="#1089ff"
                    value={this.state.searchValue}
                    onChangeText={text => this.handleOnChangeText(text)}
                    inputStyle={styles.inputStyle}
                    theme={{
                        roundness: 8,
                        colors: {
                            primary: '#1089ff',
                        }
                    }}
                      /> 
                   </View>

                    : 
                    null}
                </Animated.View>
            </View>
            }>
              
              <Tab heading="Search" {...TAB_PROPS}>
                  <View style={{flex: 1}}>
                <ScrollView onLayout={event => this.setState({ noResultsViewHeight: event.nativeEvent.layout.height })} contentContainerStyle={{alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap'}}>
                    {
                        this.state.searchResults.length === 0 ?
                        <View style={{flex: 1, height: this.state.noResultsViewHeight, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{fontFamily: 'Avenir-Light', fontSize: 20}}>
                                <Text>
                                Not seeing any results?
                                </Text>
                                <Text>
                                    {" "}
                                </Text>
                                <Text onPress={this.showSearch} style={{color: '#1089ff'}}>

                                Search fitness programs and trainers.
                                </Text>
                            </Text>
                        </View>
                       
                        :
                        null
                    }
                    {
                        this.renderSearchResults()
                    }
                </ScrollView>
                  </View>
              </Tab>

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