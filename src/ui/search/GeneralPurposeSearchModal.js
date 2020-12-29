import React from 'react'

import {
    View,
    Text,
    Modal,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Dimensions,
} from 'react-native'

import LupaController from '../../controller/lupa/LupaController'
import { Paragraph } from 'react-native-paper'
import {
    SearchBar
} from 'react-native-elements'

import FeatherIcon from 'react-native-vector-icons/Feather'
import { Constants } from 'react-native-unimodules'
import { connect } from 'react-redux';
import UserSearchResult from '../user/profile/component/UserSearchResult';
import ProgramInformationComponent from '../workout/program/components/ProgramInformationComponent'

const CATEGORY_SEPARATION = 15

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state
    }
}

class GeneralPurposeSearchModal extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            searchShowing: false,
            searching: false,
            searchValue: "",
            searchResults: [],
            refreshing: false,
        }

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
        })

        const { usersEnabled, trainersEnabled, programsEnabled} = this.props;
        if (usersEnabled == true && programsEnabled == true && trainersEnabled) {
            await this.LUPA_CONTROLLER_INSTANCE.searchTrainersAndPrograms(searchQuery).then(searchData => {
                this.setState({ searchResults: searchData })
            })
        } else if (programsEnabled == true) {
            await this.LUPA_CONTROLLER_INSTANCE.searchTrainersAndPrograms(searchQuery).then(searchData => {
                this.setState({ searchResults: searchData })
            })
        } else if (usersEnabled == true) {
            await this.LUPA_CONTROLLER_INSTANCE.searchTrainersAndPrograms(searchQuery).then(searchData => {
                this.setState({ searchResults: searchData })
            })
        } else if (trainersEnabled == true) {
            await this.LUPA_CONTROLLER_INSTANCE.searchTrainersAndPrograms(searchQuery).then(searchData => {
                this.setState({ searchResults: searchData })
            })
        } else {
            await this.LUPA_CONTROLLER_INSTANCE.searchTrainersAndPrograms(searchQuery).then(searchData => {
                this.setState({ searchResults: searchData })
            })
        }

        await this.setState({
            searching: false
        })
    }

    renderComponentDisplay = () => {
        if (this.state.searchValue != "") {
            return this.renderSearchResults()
        } else {
            return (
                <View style={{flex: 1, height: Dimensions.get('screen').height - Constants.statusBarHeight ,backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
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
        const { userHasButton, userButtonTitle, userButtonOnPress } = this.props;
        return this.state.searchResults.map(result => {
            switch(result.resultType) {
                case 'User':
                    return <UserSearchResult 
                    hasButton={userHasButton}
                    buttonOnPress={() => userButtonOnPress(result)}
                    buttonTitle={userButtonTitle} 
                    userData={result} />
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

    renderSearchBarContent = () => {
        const { showContentBelowSearchBar, contentBelowSearchBar } = this.props;

        if (showContentBelowSearchBar === true) {
            return contentBelowSearchBar
        } else {
            return (<Text>
                Hi
            </Text>)
        }
    }

    //input place holder
    //programs enabled
    //users enabled
    //trainers enabled
    //userHasButton
    //userButtonTitle
    //userButtonOnPress
    //isVisible
    //closeModal

    render() {
        const { inputPlaceholder, closeModal, isVisible  } = this.props;
        return (
            <Modal presentationStyle="fullScreen" visible={isVisible} animationStyle="slide">
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <FeatherIcon onPress={closeModal} name="arrow-left" size={20} color="#212121" style={{ paddingHorizontal: 10, marginTop: Constants.statusBarHeight }} />
                <ScrollView
                    onLayout={event => this.setState({ resultsContainerHeight: event.nativeEvent.layout.height })}
                    refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleOnRefresh} />}
                    scrollEventThrottle={1}
                    bounces={false}
                    showsVerticalScrollIndicator={false}>
                    <View style={{ backgroundColor: 'white', }}>
                        <SearchBar
                            placeholder={inputPlaceholder}
                            placeholderTextColor="rgb(199, 201, 203)"
                            onChangeText={text => this.performSearch(text)}
                            value={this.state.searchValue}
                            inputStyle={styles.inputStyle}
                            platform="ios"
                            containerStyle={{ backgroundColor: 'white', borderColor: 'white', width: Dimensions.get('window').width - 10 }}
                            inputContainerStyle={{ borderColor: 'white', backgroundColor: '#EEEEEE' }}
                            searchIcon={() => <FeatherIcon name="search" color="black" size={20} onPress={() => this.setState({ searchBarFocused: true })} />}
                        />
                        {this.renderSearchBarContent()}
                    </View>
                    {
               
                        this.renderComponentDisplay()
                    }
                </ScrollView>
            </View>
            </Modal>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
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

export default connect(mapStateToProps)(GeneralPurposeSearchModal)