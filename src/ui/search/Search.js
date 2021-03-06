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

import LupaController from '../../controller/lupa/LupaController'
import { Avatar, Surface, Divider, Button, Appbar, Chip, Paragraph, Caption } from 'react-native-paper'
import {
    SearchBar
} from 'react-native-elements'

import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { Constants } from 'react-native-unimodules'
import { connect } from 'react-redux';
import UserSearchResult from '../user/profile/component/UserSearchResult';
import ProgramInformationComponent from '../workout/program/components/ProgramInformationComponent'
import { Header } from 'native-base'
import Feather1s from 'react-native-feather1s/src/Feather1s'

const CATEGORY_SEPARATION = 15

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

let navigationListenerSubscription, navigationBlurListenerSubscription;

class Search extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            searchShowing: false,
            searching: false,
            searchValue: "",
            searchResults: [],
            resultsContainerHeight: 0,
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

    componentDidMount() {
        const { navigation, route } = this.props;
        this.LUPA_CONTROLLER_INSTANCE.indexApplicationData();

        navigationListenerSubscription = navigation.addListener('focus', () => {
            // Prevent default action
           // e.preventDefault();

           const { categoryToSearch } = this.props.route.params
           if (typeof(categoryToSearch) == 'undefined' || categoryToSearch == '' || categoryToSearch == null || categoryToSearch === undefined) {
            this.setState({ categoryIsPressed: false }, () => {
                this.setState({ categoryToSearch: '' })
            })
           } else {
        this.setState({ categoryIsPressed: true, categoryToSearch: categoryToSearch})
       }

          });

        navigationBlurListenerSubscription = navigation.addListener('blur', () => {
            this.setState({ categoryIsPressed: false, categoryIsPressed: ''})
        })
    }

    componentWillUnmount() {
        return () => {
            () => navigationListenerSubscription();
            () => navigationBlurListenerSubscription();
        }
    }

    handleOnPressCategory = (category) => {
        this.setState({ categoryIsPressed: true, categoryToSearch: category })
    }

    renderImage = (skill, index) => {
        switch (skill) {
            case 'Agility':
                return (
                    <TouchableOpacity style={{ marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.handleOnPressCategory('Agility')}>
                        <Image style={{ width: 63, height: 77, alignSelf: 'center' }} source={require('../images/interest_icons_themed/unselected/Agility.png')} />
                        <Text style={{color: 'white', fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                            {skill}
                        </Text>
                    </TouchableOpacity>
                )
            case 'Speed':
                return (
                    <TouchableOpacity style={{ marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.handleOnPressCategory('Speed')}>
                        <Image style={{ width: 70, height: 70, alignSelf: 'center' }} source={require('../images/interest_icons_themed/unselected/Speed.png')} />
                        <Text style={{color: 'white', fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                            {skill}
                        </Text>
                    </TouchableOpacity>
                )
            case 'Balance':
                return (
                    <TouchableOpacity style={{ marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.handleOnPressCategory('Balance')}>
                        <Image style={{ width: 63, height: 77, alignSelf: 'center' }} source={require('../images/interest_icons_themed/unselected/Balance.png')} />
                        <Text style={{color: 'white', fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                            {skill}
                        </Text>
                    </TouchableOpacity>
                )
            case 'Power':
                return (
                    <TouchableOpacity style={{ marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.handleOnPressCategory('Power')}>
                        <Image style={{ width: 25, height: 80, alignSelf: 'center' }} source={require('../images/interest_icons_themed/unselected/Power.png')} />
                        <Text style={{color: 'white', fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                            {skill}
                        </Text>
                    </TouchableOpacity>
                )
            case 'Coordination':
                return (
                    <TouchableOpacity style={{ marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.handleOnPressCategory('Coordination')}>
                        <Image style={{ width: 75, height: 82, alignSelf: 'center' }} source={require('../images/interest_icons_themed/unselected/Coordination.png')} />
                        <Text style={{color: 'white', fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                            {skill}
                        </Text>
                    </TouchableOpacity>
                )
            case 'Reaction Time':
                return (
                    <TouchableOpacity style={{ marginVertical: 15, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.handleOnPressCategory('Reaction Time')}>
                        <Image style={{ width: 70, height: 70, alignSelf: 'center' }} source={require('../images/interest_icons_themed/unselected/ReactionTime.png')} />
                        <Text style={{color: 'white', fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                            {skill}
                        </Text>
                    </TouchableOpacity>
                )
            case 'Weight Loss':
                return (
                    <TouchableOpacity style={{ marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.handleOnPressCategory('Weight Loss')}>
                        <Image style={{ width: 63, height: 77, alignSelf: 'center' }} source={require('../images/interest_icons_themed/unselected/WeightLoss.png')} />
                        <Text style={{color: 'white', fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                            {skill}
                        </Text>
                    </TouchableOpacity>
                )
            case 'Test Preparation':
                return (
                    <TouchableOpacity style={{ marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.handleOnPressCategory('Test Preparation')}>
                        <Image style={{ width: 85, height: 65, alignSelf: 'center' }} source={require('../images/interest_icons_themed/unselected/TestPreparation.png')} />
                        <Text style={{color: 'white', fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                            {skill}
                        </Text>
                    </TouchableOpacity>
                )
            case 'Sport Specific':
                return (
                    <TouchableOpacity style={{ marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.handleOnPressCategory('Sport Specific')}>
                        <Image style={{ width: 60, height: 75, alignSelf: 'center' }} source={require('../images/interest_icons_themed/unselected/SportSpecific.png')} />
                        <Text style={{color: 'white', fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                            {skill}
                        </Text>
                    </TouchableOpacity>
                )
            case 'Bodybuilding':
                return (
                    <TouchableOpacity style={{ marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.handleOnPressCategory('Bodybuilding')}>
                        <Image style={{ width: 80, height: 40, alignSelf: 'center' }} source={require('../images/interest_icons_themed/unselected/Bodybuilding.png')} />
                        <Text style={{color: 'white', fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                            {skill}
                        </Text>
                    </TouchableOpacity>
                )
            case 'Fitness Coach':
                return (
                    <TouchableOpacity style={{ marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.handleOnPressCategory('Fitness Coach')}>
                        <Image style={{ width: 62, height: 60, alignSelf: 'center' }} source={require('../images/interest_icons_themed/unselected/FitnessCoach.png')} />
                        <Text style={{color: 'white', fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                            {skill}
                        </Text>
                    </TouchableOpacity>
                )
            case 'Injury Prevention':
                return (
                    <TouchableOpacity style={{ marginVertical: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.handleOnPressCategory('Injury Prevention')}>
                        <Image style={{ alignSelf: 'center' }} source={require('../images/interest_icons_themed/unselected/InjuryPrevention.png')} />
                        <Text style={{color: 'white', fontFamily: 'Avenir-Light', fontSize: 15, paddingVertical: 10 }}>
                            {skill}
                        </Text>
                    </TouchableOpacity>
                )
            default:
        }
    }

    renderSkills = () => {
        return (
            <View style={{ flex: 1 }}>
                {
                    SKILL_BASED_INTEREST.map((skill, index, arr) => {

                        if (index % 2 == 0) {
                            return (
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 55 }}>
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
        }, async () => {
            await this.LUPA_CONTROLLER_INSTANCE
            .searchTrainersAndPrograms(searchQuery).then(searchData => {
                this.setState({ searchResults: searchData })
            })
            .catch(error => {
                
            })

            this.setState({
                searching: false
            })
        })

    }

    renderCategoryResults = () => {
        return (
            <View style={{ flex: 1, marginTop: 100, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, backgroundColor: 'transparent' }}>
                <Text style={{color: 'white', fontSize: 16, fontFamily: 'Avenir-Medium' }}>
                    Sorry we couldn't find any programs relating to {this.state.categoryToSearch}.
                </Text>
                <Text onPress={() => this.setState({ categoryIsPressed: false, categoryToSearch: '' })} style={{ fontFamily: 'Avenir-Roman', fontSize: 15, marginTop: 30, color: '#1089ff' }}>
                    Return to search
                </Text>
            </View>
        )
    }

    renderComponentDisplay = () => {
        if (this.state.searchValue != "") {
            return this.renderSearchResults()
        }

        if (this.state.searchResults.length == 0 && this.state.categoryIsPressed == false) {
            return (
                 <View>
                  <View style={{ margin: 10, padding: 10, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center'}}>
                    <Caption style={{color: 'white'}}>
                       Select a category or use the search bar
                   </Caption>
                    </View>
                    {this.renderSkills()}
            </View>
            )
        } else if (this.state.categoryIsPressed == true) {
            return this.renderCategoryResults();
        } else if (this.state.searching == true) {
            return this.renderSearchResults()
        } else {
            return (
                <View style={{flex: 1, height: this.state.resultsContainerHeight / 2 ,backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
                   <Text style={{fontFamily: 'Avenir-Medium', fontSize: 20}}>
                       No results to show
                   </Text>
                   <Paragraph>
                       Please check spelling or try different keywords
                   </Paragraph>
                </View>
            )
        }
    }

    renderSearchResults = () => {
        return this.state.searchResults.map(result => {
            switch(result.resultType) {
                case 'User':
                    return <UserSearchResult buttonOnPress={() => this.props.navigation.push('Profile', { userUUID: result.user_uuid })} userData={result} />
                case 'Program':
                    return <ProgramInformationComponent program={result} />
            }
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
            null
        )
    }


    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#23374d' }}>
                <Appbar.Header  style={{elevation: 0, flexDirection: 'row', justifyContent: 'space-evenly',  alignItems: 'center', backgroundColor: '#23374d'}}>
                    <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
                    <SearchBar
                            placeholder="Search trainers and fitness programs"
                            placeholderTextColor="rgb(150, 150, 150)"
                            onChangeText={text => this.performSearch(text)}
                            value={this.state.searchValue}
                            inputStyle={styles.inputStyle}
                            platform="ios"
                            containerStyle={{ backgroundColor: '#23374d', borderColor: 'white', width: Dimensions.get('window').width - 40 }}
                            inputContainerStyle={{ borderColor: 'white', backgroundColor: '#FFFFFF' }}
                            searchIcon={() => <FeatherIcon name="search" color="black" size={20} onPress={() => this.setState({ searchBarFocused: true })} />}
                        />
                </Appbar.Header>
                <ScrollView
                    onLayout={event => this.setState({ resultsContainerHeight: event.nativeEvent.layout.height })}
                    refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleOnRefresh} />}
                    scrollEventThrottle={1}
                    bounces={false}
                    showsVerticalScrollIndicator={false}>
                  
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
        backgroundColor: '#23374d'
    },
    searchContainerStyle: {
        backgroundColor: "transparent", 
        flex: 1,
    },
    inputContainerStyle: {
        backgroundColor: '#FFFFFF',
    },
    iconContainer: {
        alignItems: 'center', 
        justifyContent: 'center'
    },
    appbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: '#FFFFFF',
        borderColor: 'white',
        borderBottomWidth: 0,
        elevation: 0,
    },
    categoryText: {
        fontSize: 15,
        fontFamily: 'Avenir-Heavy',
    },
    inputStyle: {
        fontSize: 15, 
        fontFamily: 'Avenir-Roman'

    },
    category: {
        marginVertical: CATEGORY_SEPARATION,
        padding: 20
    },
    searchRowTouchable: {
        flexDirection: 'row', margin: 25, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 10, borderColor: 'black', padding: 5, 
    },
    searchRowImage: {
       width: 20, height: 24, alignSelf: 'center'
    },
    seachRowText: {
        paddingHorizontal: 5, fontFamily: 'Avenir-Medium', fontSize: 10, paddingVertical: 10
    }
})

export default connect(mapStateToProps)(Search)