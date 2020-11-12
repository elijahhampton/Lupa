import React, { useState, useEffect } from 'react'

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Animated,
    RefreshControl,
    Dimensions,
    Easing,
    TouchableWithoutFeedback,
    Image,
} from 'react-native'

import {Body, Header, List, ListItem as Item, ScrollableTab, Tab, Right, Tabs, Title, Left} from "native-base";

import LupaController from '../../controller/lupa/LupaController'
import { Avatar, Surface, Divider, Button } from 'react-native-paper'
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
import UserSearchResult from '../user/profile/component/UserSearchResult';

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

const GOALS = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h'
]

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
            currTab: 0,
            noResultsViewHeight: 0,
            goalIsPressed: true,
            goalPressed: "",
        }

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

        await this.LUPA_CONTROLLER_INSTANCE.search(searchQuery).then(searchData => {
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
                return <UserSearchResult userData={result} />
            })
        }  

        handleOnChangeText = (text) => {
            if (text == "") {
                this.hideSearch()
            }

            this.performSearch(text)
        }

        handleOnGoalPressed = (goal) => {
            this.setState({ goalIsPressed: true, goalPressed: goal })
        }

        renderGoalPressedResults = () => {
            return (
                <>
                <View style={{paddingHorizontal: 20, paddingVertical: 20, width: '100%', flexDirection: 'row', alignItems: 'center'}}>
                    <Avatar.Image style={{borderWidth: 1, borderColor: 'grey'}} size={35} source={{uri: this.props.lupa_data.Users.currUserData.photo_url}} />
                    <View style={{paddingHorizontal: 20}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontSize: 15, fontWeight: '500', color: '#23374d'}}>
                        Elijah Hampton
                    </Text>
                    <Image style={{width: 18, height: 18, marginHorizontal: 5}} source={require('../images/certificate_icon.jpeg')} />
                    </View>
                    
                    <Text style={{fontWeight: '400', fontSize: 15, color: 'rgb(158, 154, 170)'}}>
                        National Association of Sports and Medicine
                    </Text>
                    </View>
                </View>
                                    <Divider style={{width: Dimensions.get('window').width}} />
                                    </>
            )
        }
    

        render() {
    return (

        <View style={{flex: 1, backgroundColor: 'white'}}>
            <Header noShadow={true}  style={{borderBottomColor: 'white',flexDirection: 'column', backgroundColor: 'white'}} span={true}>
                <Text style={{alignSelf: 'center', fontSize: 18, fontFamily: 'Avenir-Heavy'}}>
                    Search
                </Text>
                <View style={{backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' , justifyContent: 'space-evenly'}}>

              
            <Feather1s onPress={() => this.props.navigation.pop()} name="x" size={20} color="#212121" style={{paddingHorizontal: 10}} />
             
                <SearchBar
                        placeholder="Search trainers"
                        placeholderTextColor="#000000"
                        onChangeText={text => this.performSearch(text)}
                        value={this.state.searchValue}
                        inputStyle={styles.inputStyle}
                        platform="ios"
                        containerStyle={{backgroundColor: 'white', borderColor: 'white', width: '90%'}}
                        inputContainerStyle={{borderColor: 'white', backgroundColor: '#EEEEEE'}}
                        searchIcon={() => <MaterialIcon name="search" color="#1089ff" size={20} onPress={() => this.setState({ searchBarFocused: true })} />}
                    />
  </View>
          
              
            </Header>
          
          <ScrollView
          contentContainerStyle={{flex: 1}}
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleOnRefresh}/>}
            scrollEventThrottle={1}
            bounces={false}
            showsVerticalScrollIndicator={false}>
                {
                    this.renderSearchResults()
                }
                   {/*  <Tabs 
            page={this.state.currTab}
            onChangeTab={tabInfo => this.setState({ currTab: tabInfo.i })} 
            renderTabBar={(props) =>  <>
                <ScrollableTab {...props} style={{  shadowRadius: 1, justifyContent: 'flex-start', elevation: 0, borderBottomColor: 'white'}} tabsContainerStyle={{paddingVertical: 5, flex: 1, justifyContent: 'flex-start', backgroundColor: COLOR, elevation: 0}} underlineStyle={{backgroundColor: "#1089ff", height: 5, width: 5, borderRadius: 10,marginLeft: 30, elevation: 0, borderRadius: 8}}/>
                <Divider />
                </>
            }>
              
     <Tab heading="Goals" {...TAB_PROPS}>
                  <View style={{flex: 1}}>
                      {
                          this.state.goalIsPressed === true ?
                          <View style={{justifyContent: 'flex-start', padding: 20, backgroundColor: 'rgb(245, 246, 249)'}}>
                              <Text style={{color: '#23374d', fontFamily: 'Avenir-Medium', fontSize: 18}}>
                                Improve Balance
                              </Text>
                          </View>
                          :
                          null
                      }
                <ScrollView onLayout={event => this.setState({ noResultsViewHeight: event.nativeEvent.layout.height })} contentContainerStyle={{alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap'}}>
                    {
                        this.state.goalIsPressed === true ?
                        this.renderGoalPressedResults()
                        :
                       GOALS.map(goal => {
                           return (
                               <TouchableWithoutFeedback key={goal} onPress={() => this.handleOnGoalPressed(goal)}>
                               <Surface style={{alignItems: 'center', justifyContent: 'center', shadowColor: "rgb(210, 180 ,120)", elevation: 2, borderRadius: 15, width: Dimensions.get('window').width / 2.5, backgroundColor: 'rgb(223, 240 ,254)', height: 150, margin: 20}}>
                                <Text style={{fontFamily: 'Avenir-Roman'}}>
                                   Improve Balance
                                </Text>
                                   <MaterialIcon size={24} name="star" style={{position: 'absolute', top: 0, left: 0, margin: 12}}/>
                               </Surface>
                               </TouchableWithoutFeedback>
                           )
                       })
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
                </Tabs>*/}
                
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
    iconContainer: {
        alignItems: 'center', justifyContent: 'center'
    },
    appbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: '#FFFFFF',
        borderColor: 'white',
        borderBottomWidth: 0,
      //  borderBottomWidth: 0.5, borderColor: 'rgb(174, 174, 178)',
       // borderBottomColor: 'rgb(199, 199, 204)', 
       // borderBottomWidth: 0.8,
        elevation: 0,
    },
    categoryText: {
        fontSize: 15,
        fontFamily: 'Avenir-Heavy',
    },
    inputStyle: {
        fontSize: 15, fontFamily: 'Avenir-Roman'

    },
    category: {
        marginVertical: CATEGORY_SEPARATION,
        padding: 20
    }
})

export default connect(mapStateToProps)(Search)