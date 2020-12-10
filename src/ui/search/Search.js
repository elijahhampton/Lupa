import React, { useState, useEffect } from 'react'

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Animated,
    RefreshControl,
    Dimensions,
    TouchableOpacity,
    Easing,
    TouchableWithoutFeedback,
    Image,
} from 'react-native'

import {Body, Header, List, ListItem as Item, ScrollableTab, Tab, Right, Tabs, Title, Left} from "native-base";

import LupaController from '../../controller/lupa/LupaController'
import { Avatar, Surface, Divider, Button, Appbar } from 'react-native-paper'
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

const SKILL_BASED_INTEREST = [
    'Agility',
    'Balance',
    'Speed',
    'Power',
    'Coordination',
    'Reaction Time',
    'Weight Loss',
    'Test Preparation',
    'Sport Specific',
    'Bodybuilding',
    'Fitness Coach',
    'Injury Prevention',
]

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
            categoryIsPressed: false,
            categoryToSearch: '',
        }

    }

    handleOnPressCategory = (category) => {
        this.setState({ categoryIsPressed: true, categoryToSearch: category })
    }

    renderImage = (skill, index) => {
        switch (skill) {
            case 'Agility':
                    return (
                        <TouchableOpacity style={{marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.handleOnPressCategory('Agility')}>
                            <Image style={{width: 63, height: 77, alignSelf: 'center' }} source={require('../images/interest_icons/selected/Agility.png')} />
                            <Text style={{ fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                            {skill}
                        </Text>
                        </TouchableOpacity>
                    )
            case 'Speed':
                    return (
                        <TouchableOpacity style={{marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.handleOnPressCategory('Speed')}>
                            <Image style={{ width: 70, height: 70, alignSelf: 'center' }} source={require('../images/interest_icons/selected/Speed.png')} />
                            <Text style={{ fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                                {skill}
                            </Text>
                        </TouchableOpacity>
                    )
            case 'Balance':
                    return (
                        <TouchableOpacity style={{marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.handleOnPressCategory('Balance')}>
                            <Image style={{ width: 63, height: 77, alignSelf: 'center' }} source={require('../images/interest_icons/selected/Balance.png')} />
                            <Text style={{ fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                            {skill}
                            </Text>
                        </TouchableOpacity>
                    )
            case 'Power':
                    return (
                        <TouchableOpacity style={{marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.handleOnPressCategory('Power')}>
                            <Image style={{ width: 63, height: 77, alignSelf: 'center' }} source={require('../images/interest_icons/selected/Power.png')} />
                            <Text style={{ fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                            {skill}
                                </Text>
                        </TouchableOpacity>
                    )
            case 'Coordination':
                    return (
                        <TouchableOpacity style={{marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.handleOnPressCategory('Coordination')}>
                            <Image style={{ width: 75, height: 82, alignSelf: 'center' }} source={require('../images/interest_icons/selected/Coordination.png')} />
                            <Text style={{ fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                            {skill}
                                    </Text>
                        </TouchableOpacity>
                    )
            case 'Reaction Time':
                    return (
                        <TouchableOpacity style={{marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.handleOnPressCategory('Reaction Time')}>
                            <Image style={{ width: 80, height: 77, alignSelf: 'center' }} source={require('../images/interest_icons/selected/ReactionTime.png')} />
                            <Text style={{ fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                            {skill}
                                        </Text>
                        </TouchableOpacity>
                    )
            case 'Weight Loss':
                    return (
                        <TouchableOpacity style={{marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.handleOnPressCategory('Weight Loss')}>
                            <Image style={{ width: 63, height: 77, alignSelf: 'center' }} source={require('../images/interest_icons/selected/WeightLoss.png')} />
                            <Text style={{ fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                            {skill}
                            </Text>
                        </TouchableOpacity>
                    )
            case 'Test Preparation':
                    return (
                        <TouchableOpacity style={{marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.handleOnPressCategory('Test Preparation')}>
                            <Image style={{ width: 85, height: 65, alignSelf: 'center' }} source={require('../images/interest_icons/selected/TestPreparation.png')} />
                            <Text style={{ fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                                {skill}
                                                </Text>
                        </TouchableOpacity>
                    )
            case 'Sport Specific':
                    return (
                        <TouchableOpacity style={{marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.handleOnPressCategory('Sport Specific')}>
                            <Image style={{ width: 60, height: 75, alignSelf: 'center' }} source={require('../images/interest_icons/selected/SportSpecific.png')} />
                            <Text style={{ fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                                {skill}
                            </Text>
                        </TouchableOpacity>
                    )
            case 'Bodybuilding':
                    return (
                        <TouchableOpacity style={{marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.handleOnPressCategory('Bodybuilding')}>
                            <Image style={{ width: 80, height: 40, alignSelf: 'center' }} source={require('../images/interest_icons/selected/Bodybuilding.png')} />
                            <Text style={{ fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                            {skill}
                                                        </Text>
                        </TouchableOpacity>
                    )
            case 'Fitness Coach':
                    return (
                        <TouchableOpacity style={{marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.handleOnPressCategory('Fitness Coach')}>
                            <Image style={{ width: 44, height: 56, alignSelf: 'center' }} source={require('../images/interest_icons/selected/Health:FitnessCoach.png')} />
                            <Text style={{ fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                            {skill}
                                                            </Text>
                        </TouchableOpacity>
                    )
            case 'Injury Prevention':
                    return (
                        <TouchableOpacity style={{marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.handleOnPressCategory('Injury Prevention')}>
                            <Image style={{  alignSelf: 'center' }} source={require('../images/interest_icons/selected/InjuryPrevention.png')} />
                            <Text style={{ fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                                {skill}
                            </Text>
                        </TouchableOpacity>
                    )
            default:
        }
    }

    renderSkills = () => {
        let count = 0;
        return (
            <View style={{ flex: 1 }}>
                {
                    SKILL_BASED_INTEREST.map((skill, index, arr) => {

                        if (index % 2 == 0) {
                            return (
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 55}}>
                                  {this.renderImage(arr[index], index)}
                                  {this.renderImage(arr[index + 1], index)}
                            </View>

                            )
                        }
                    })
                }
            </View>
        )
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

    renderCategoryResults = () => {
        return (
            <View style={{flex: 1, marginTop: 100, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, backgroundColor: 'white'}}>
                <Text style={{fontSize: 16, fontFamily: 'Avenir-Medium'}}>
                    Sorry we couldn't find any programs relating to {this.state.categoryToSearch}.
                </Text>
                <Text onPress={() => this.setState({ categoryIsPressed: false, categoryToSearch: '' })} style={{fontFamily: 'Avenir-Roman', fontSize: 15, marginTop: 30, color: '#1089ff'}}>
                    Return to search
                </Text>
            </View>
        )
    }

    renderComponentDisplay = () => {
        if (this.state.searchValue != "") {
            return this.renderSearchResults()
        }
        
        if (this.state.searchResults.length === 0 && this.categoryIsPressed === false) {
            return this.renderSkills()
        } else if (this.state.categoryIsPressed === true) {
            return this.renderCategoryResults();
        } else if (this.state.searching === true) {
            return this.renderSearchResults()
        } else {
            return this.renderSkills()
        }
    }

    renderSearchResults = () => {
            return this.state.searchResults.map(result => {
                return <UserSearchResult buttonOnPress={() => this.props.navigation.push('Profile', {userUUID: result.user_uuid})} userData={result} />
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
                          
<FeatherIcon onPress={() => this.props.navigation.pop()} name="arrow-left" size={20} color="#212121" style={{paddingHorizontal: 10, marginTop: Constants.statusBarHeight}} />
 
          
          <ScrollView
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleOnRefresh}/>}
            scrollEventThrottle={1}
            bounces={false}
            showsVerticalScrollIndicator={false}>

<View noShadow={true}  style={{elevation: 0,  marginTop: 10, marginBottom: 10, alignItems: 'center', justifyContent: 'center', borderBottomColor: 'white', backgroundColor: 'white'}} span={true}>
            <Text style={{padding: 10, width: '80%', fontFamily: 'Avenir-Heavy', alignSelf: 'flex-start', marginLeft: 20, fontSize: 20}}>
                    Explore Trainers and Fitness Programs
                </Text>
              
            </View>

            <View style={{backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' , justifyContent: 'space-evenly'}}>

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
         
                {
                    this.renderComponentDisplay()
                }

                
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