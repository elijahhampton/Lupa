/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  23, 2019
 *
 *  Featured
 */

import React, { useRef, createRef } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    ImageBackground,
    TouchableOpacity,
    Image,
    Text,
    Dimensions,
    Button as NativeButton,
    RefreshControl,
    Platform,
} from 'react-native';

import {
    Surface,
    Button,
    Card,
    Caption,
    Appbar,
    Divider,
    FAB,
    Banner,
    Searchbar

} from 'react-native-paper';

import LupaController from '../controller/lupa/LupaController';
import FeatherIcon from 'react-native-vector-icons/Feather'
import { connect } from 'react-redux';
import FeaturedProgramCard from './workout/program/components/FeaturedProgramCard';
import { RFValue } from 'react-native-responsive-fontsize';
import { MenuIcon } from './icons';
import { SearchBar } from 'react-native-elements'
import LiveWorkoutPreview from './workout/program/modal/LiveWorkoutPreview';
import InviteFriendsModal from './user/modal/InviteFriendsModal'
import { retrieveAsyncData, storeAsyncData } from '../controller/lupa/storage/async';
import ThinFeatherIcon from "react-native-feather1s";
import CircularUserCard from './user/component/CircularUserCard';
import { ShowTrainersModal, ShowTopPicksModal } from './modal/ExplorePageModals';
import { titleCase } from './common/Util';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Constants } from 'react-native-unimodules';
import { TouchableWithoutFeedback, TouchableHighlight } from 'react-native-gesture-handler';
import ProgramInformationComponent from './workout/program/components/ProgramInformationComponent';
import LargeProgramSearchResultCard from './workout/program/components/LargeProgramSearchResultCard'
import LUPA_DB from '../controller/firebase/firebase';
import VlogFeedCard from './user/component/VlogFeedCard';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import LiveWorkoutFullScreenContentModal from './workout/modal/LiveWorkoutFullScreenContentModal';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

let vlogCollectionObserver;

class Featured extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
        this.searchBarRef = createRef()

        this.state = {
            refreshing: false,
            searchValue: "",
            searchResults: [],
            searching: false,
            trainWithSwiperIndex: 0, //approved,
            featuredProgramsCurrentIndex: 0,
            lastRefresh: new Date().getTime(),
            recentlyAddedPrograms: [],
            topPicks: [],
            featuredPrograms: [],
            featuredTrainers: [],
            inviteFriendsIsVisible: false,
            showLiveWorkoutPreview: false,
            showTopPicksModalIsVisible: false,
            feedVlogs: [],
            suggestionBannerVisisble: false,
            searchBarFocused: false,
        }
    }

    async componentDidMount() {

        const query = LUPA_DB.collection('vlogs').where('vlog_state', '==', this.props.lupa_data.Users.currUserData.location.state)//.orderBy('time_created', 'asc');
        vlogCollectionObserver = query.onSnapshot(querySnapshot => {
            console.log(`Received query snapshot of size ${querySnapshot.size}`);
            querySnapshot.forEach(doc => {
                let data = doc.data();
                const updatedState = [];
                if (typeof (updatedState) != 'undefined') {
                    updatedState.push(data);
                    updatedState.push(data);
                    updatedState.push(data);

                }

                updatedState.concat(this.state.feedVlogs)
                
                if (updatedState.length === 0) {
                    LUPA_DB.collection('vlogs').get().then(docs => {
                        docs.forEach(doc => {
                            const data = doc.data();
                            updatedState.push(data);
                        });
                    })//.orderBy('time_created', 'asc');
                }

                this.setState({ feedVlogs: updatedState });
            })

        }, err => {
            alert(err)
        });

        this.setState({ suggestionBannerVisisble: true })

    }

    async componentWillUnmount() {
        return () => vlogCollectionObserver();
    }

    sortVlogs = (vlogs) => {

    }

    loadFeaturedTrainers = async () => {
        await this.LUPA_CONTROLLER_INSTANCE.getAllTrainers().then(result => {
            this.setState({ featuredTrainers: result })
        })
    }

    loadTopPicks = async () => {
        await this.LUPA_CONTROLLER_INSTANCE.getTopPicks().then(result => {
            this.setState({ topPicks: result })
        })
    }

    loadRecentlyAddedPrograms = async () => {
        await this.LUPA_CONTROLLER_INSTANCE.getRecentlyAddedPrograms().then(result => {
            this.setState({ recentlyAddedPrograms: result })
        })
    }

    handleOnRefresh = async () => {
        this.setState({ refreshing: true })
        await this.setupComponent()
        this.setState({ refreshing: false, lastRefresh: new Date().getTime() })

    }

    loadFeaturedPrograms = async () => {
        let featuredProgramsIn = []

        try {
            await this.LUPA_CONTROLLER_INSTANCE.getFeaturedPrograms().then(result => {
                featuredProgramsIn = result;
            });

        } catch (error) {
            alert(error)
            featuredProgramsIn = []
        }

        await this.setState({
            featuredPrograms: featuredProgramsIn,
        })
    }

    renderCarouselItem = ({ currProgram, index }) => {
        if (typeof (currProgram) == null || currProgram == null || currProgram.program_name == "") {
            return null;
        }

        return (
            <FeaturedProgramCard currProgram={currProgram} keyProp={currProgram.program_name} />
        );
    }

    renderFeaturedTrainers = () => {
        try {
            return this.state.featuredTrainers.map(user => {
                if (typeof (user) != 'object'
                    || user == undefined || user.user_uuid == undefined ||
                    user.user_uuid == "" || typeof (user.user_uuid) != 'string' || typeof (user.display_name) == 'undefined' || user.display_name == "") {
                    return null;
                }

                return (
                    <CircularUserCard user={user} />
                )
            })
        } catch (error) {
            alert(error)
            return null;
        }
    }

    renderRecentlyAddedPrograms = () => {
        try {
            return this.state.featuredPrograms.map((element, index, arr) => {
                if (index >= 4) {
                    return;
                }

                return (
                    <>
                        <TouchableOpacity style={{}}>
                            <View style={{ margin: 5, width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'center' }}>
                                <Surface style={{ margin: 10, borderRadius: 5, width: 150, height: 170, backgroundColor: '#EEEEEE', elevation: 0, borderRadius: 5 }}>
                                    <Image source={{ uri: element.program_image }} style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: 5
                                    }}
                                        resizeMode='cover'
                                    />
                                </Surface>

                                <View style={{ flex: 1, padding: 10, height: 150, justifyContent: 'space-evenly', alignSelf: 'flex-start' }}>
                                    <Text style={{ color: '#1089ff', fontSize: 12, fontWeight: '600' }}>
                                        Emily Loefstedt
        </Text>
                                    <Text style={{ color: '#212121', fontSize: 15, fontWeight: '700' }}>
                                        {element.program_name}
                                    </Text>

                                    <Text numberOfLines={3} style={{ color: 'black', fontSize: 12, fontWeight: '300', fontFamily: 'avenir-roman' }}>
                                        {element.program_description}
                                    </Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        {
                                            element.program_tags.map(tag => {
                                                return (
                                                    <Caption>
                                                        {tag} {" "}
                                                    </Caption>
                                                )
                                            })
                                        }
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                       
                    </>
                )
            })
        } catch (err) {
            alert(err)
            return null
        }
    }

    performSearch = async searchQuery => {
        let searchResultsIn = []

        //If no search query then set state and return
        if (searchQuery == "" || searchQuery == "") {
            await this.setState({
                searching: true,
                searchValue: "",
                searchResults: [],
            })

            return;
        }

        await this.setState({
            searchResults: [],
            searching: true,
        })

        await this.setState({
            searchValue: searchQuery,
        })

        await this.LUPA_CONTROLLER_INSTANCE.searchPrograms(searchQuery).then(searchData => {
            searchResultsIn = searchData;
        })

        await this.setState({ searchResults: searchResultsIn, searching: false });
    }

    renderSearchResults = () => {
        return this.state.searchResults.map(result => {
            return (
                <LargeProgramSearchResultCard program={result} />
            )
        })
    }

    handleOnScroll = (event) => {
        this.setState({ featuredProgramsCurrentIndex: event.nativeEvent.contentOffset.x }, () => {

        })
    }


    showLiveWorkoutPreview = () => {
        this.setState({ showLiveWorkoutPreview: true })
    }

    hideLiveWorkoutPreview = () => {
        this.setState({ showLiveWorkoutPreview: false })
    }

    showTopPicksModal = () => {
        this.setState({ showTopPicksModalIsVisible: true })
    }

    closeTopPicksModal = () => {
        this.setState({ showTopPicksModalIsVisible: false })
    }

    checkSearchBarState = () => {
        if (this.state.searchBarFocused === true) {
            this.props.navigation.push('Search')
            this.searchBarRef.current.blur();
        }


    }

    render() {
        this.checkSearchBarState()
        return (
            <View style={styles.root}>
                <Appbar style={styles.appbar}>
                    <Searchbar
                        ref={this.searchBarRef}
                        placeholder="Search programs or trainers"
                        onChangeText={text => this.performSearch(text)}
                        placeholderTextColor="rgba(35, 55, 77, 0.5)"
                        value={this.state.searchValue}
                        inputStyle={styles.inputStyle}
                        style={{ backgroundColor: 'white', height: 50, marginVertical: 10, width: Dimensions.get('window').width - 20 }}
                        iconColor="#1089ff"
                        theme={{
                            roundness: 8,
                            colors: {
                                primary: 'white',
                            }
                        }}
                        onFocus={() => this.setState({ searchBarFocused: true })}
                        onBlur={() => this.setState({ searchBarFocused: false })}
                    />

                </Appbar>
                <View style={{ flex: 1, backgroundColor: '#EEEEEE' }}>
                    {
                        <View style={{ backgroundColor: '#EEEEEE' }}>
                            <View style={{ backgroundColor: '#EEEEEE' }}>
                                <View style={{ backgroundColor: '#EEEEEE', alignItems: 'center', justifyContent: 'center' }}>
                                    {
                                        this.state.feedVlogs.length === 0 ?
                                            <View style={{ width: '100%', alignItems: 'center', backgroundColor: '#EEEEEE' }}>
                                                <Caption style={{ fontFamily: 'Avenir-Light', fontSize: 15, textAlign: 'center', backgroundColor: '#EEEEEE' }} >
                                                    There are not any vlogs in your area.  Check back later.
                                </Caption>
                                            </View>

                                            :

                                            this.state.feedVlogs.map((vlog, index, arr) => {
                                                return (
                                                    <>
                                                    <VlogFeedCard key={index} vlogData={vlog} />
                                                    <Divider style={{width: Dimensions.get('window').width}} />
                                                    </>
                                                )
                                            })
                                    }
                                </View>
                            </View>
                        </View>
                    }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#EEEEEE",
    },
    mainGraphicText: {

        color: '#EEEEEE',
        fontSize: 25,
        alignSelf: 'flex-start'
    },
    subGraphicText: {

        color: '#EEEEEE',
        alignSelf: 'flex-start',
        textAlign: 'left',
    },
    graphicButton: {
        alignSelf: 'flex-start',
    },
    viewOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 0,
    },
    chipText: {
        color: 'white',

    },
    chip: {
        position: 'absolute',
        top: 15,
        right: 10,
        backgroundColor: '#2196F3',
        elevation: 15
    },
    imageBackground: {
        flex: 1,
        width: Dimensions.get('window').width,
        borderRadius: 0,
        alignItems: 'flex-start',
        justifyContent: 'space-around',
    },
    sectionHeaderText: {
        fontSize: RFValue(15), fontFamily: 'Avenir-Heavy', fontSize: 15,
    },
    searchContainerStyle: {
        backgroundColor: "#EEEEEE", width: Dimensions.get('window').width, alignSelf: 'center'
    },
    inputContainerStyle: {
        backgroundColor: 'white',
    },
    inputStyle: {
        fontSize: 15, fontWeight: '800', fontFamily: 'Avenir-Roman'
    },
    iconContainer: {
        width: '10%', alignItems: 'center', justifyContent: 'center'
    },
    appbar: {
        width: Dimensions.get('window').width,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EEEEEE',
        elevation: 0,
        marginVertical: 20
    }
});

export default connect(mapStateToProps)(Featured);
