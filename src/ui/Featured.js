/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  23, 2019
 *
 *  Featured
 */

import React from 'react';
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
} from 'react-native';

import {
    Surface,
    Button,
    Card,
    Caption,
    Appbar,
    Divider,
    FAB,
    Banner

} from 'react-native-paper';

import LupaController from '../controller/lupa/LupaController';
import FeatherIcon from 'react-native-vector-icons/Feather'
import { connect } from 'react-redux';
import FeaturedProgramCard from './workout/program/components/FeaturedProgramCard';
import {  RFValue } from 'react-native-responsive-fontsize';
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
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ProgramInformationComponent from './workout/program/components/ProgramInformationComponent';
import LargeProgramSearchResultCard from './workout/program/components/LargeProgramSearchResultCard'
import LUPA_DB from '../controller/firebase/firebase';
import VlogFeedCard from './user/component/VlogFeedCard';

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
        }
    }

    async componentDidMount() {
        await this.checkNewUser();
        await this.setupComponent();

        const query = LUPA_DB.collection('vlogs').where('vlog_state', '==', this.props.lupa_data.Users.currUserData.location.state)//.orderBy('time_created', 'asc');

         vlogCollectionObserver = query.onSnapshot(querySnapshot => {
            console.log(`Received query snapshot of size ${querySnapshot.size}`);
                querySnapshot.forEach(doc => {
                let data = doc.data();
                const updatedState = this.state.feedVlogs;
                if (typeof(updatedState) != 'undefined') {
                    updatedState.push(data);
                }
            
                this.sortVlogs(updatedState);
                this.setState({ feedVlogs: updatedState });
            })
        
        }, err => {
          alert(err)
        });

    }

    async componentWillUnmount() {
        return await vlogCollectionObserver();
    }

    sortVlogs = (vlogs) => {

    }

    setupComponent = async () => {
        await this.loadFeaturedPrograms();
       // await this.loadFeaturedTrainers();
        await this.loadTopPicks();
        //await this.loadRecentlyAddedPrograms();
    }

    checkNewUser = async () => {
        let showInviteFriendsModal
        await retrieveAsyncData('FIRST_LOGIN_' + this.props.lupa_data.Users.currUserData.email).then(value => {
            showInviteFriendsModal = value
        })

        if (showInviteFriendsModal === 'false') {
            storeAsyncData('FIRST_LOGIN_' + this.props.lupa_data.Users.currUserData.email, 'true'); this.setState({ inviteFriendsIsVisible: true })
            return;
        } else if (typeof (showInviteFriendsModal) != 'string') {
            storeAsyncData('FIRST_LOGIN_' + this.props.lupa_data.Users.currUserData.email, 'true');
            this.setState({ inviteFriendsIsVisible: true })
            return;
        }
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

    renderCarouselItem = ({currProgram, index}) => {
        if (typeof(currProgram) == null || currProgram == null || currProgram.program_name == "")  {
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
                            <Surface style={{ margin: 10, borderRadius: 5, width: 150, height: 170, backgroundColor: '#FFFFFF', elevation: 0, borderRadius: 5 }}>
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
                    <Divider />
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
            console.log(this.state.featuredProgramsCurrentIndex)
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

    render() {
        return (
            <View style={styles.root}>
              <Appbar.Header style={styles.appbar}>

                                <View style={{flexDirection: 'row'}}>
                <SearchBar placeholder="Search fitness programs"
                    onChangeText={text => this.performSearch(text)}
                    platform="ios"
                    searchIcon={<FeatherIcon name="search" size={15} color="#1089ff" />}
                    containerStyle={styles.searchContainerStyle}
                    inputContainerStyle={styles.inputContainerStyle}
                    inputStyle={styles.inputStyle}
                    placeholderTextColor="#212121"
                    value={this.state.searchValue} />
        </View>
        </Appbar.Header> 
                    <View style={{flex: 1}}>
                        {
                            this.state.searchValue === "" ?
                            
                            <View >
                            <View style={{ marginVertical: 15, justifyContent: 'center', }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                              <View style={{paddingHorizontal: 10}}>
                              <Text style={styles.sectionHeaderText}>
                                  Featured
                        </Text>
                        <Caption>
                            Based on your location ({this.props.lupa_data.Users.currUserData.location.city}, {this.props.lupa_data.Users.currUserData.location.state})
                        </Caption>
                              </View>


                            </View>

                             <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                snapToAlignment='center'
                                centerContent
                                snapToInterval={Dimensions.get('window').width}
                                decelerationRate={0}
                                pagingEnabled={true}
                                onScroll={this.handleOnScroll}
                                contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}}
                            >
                                {
                                    this.state.featuredPrograms.map((program, index, arr) => {
                                        return (
                                                <ProgramInformationComponent key={program.program_uuid + index.toString()} program={program} />
                                           
                                        )
                                    })
                                }
                            </ScrollView>            
                        </View>

                        <Divider style={{height: 15, backgroundColor: '#EEEEEE'}} />

                        <View>
                            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                            {
                                    this.state.feedVlogs.map((vlog, index, arr) => {
                                        return (
                                           <VlogFeedCard vlogData={vlog} />
                                        )
                                    })
                                }
                                                            </View>
                        </View>
                        </View>
                        :
                        this.renderSearchResults()

                        }
                          


                        
<InviteFriendsModal isVisible={this.state.inviteFriendsIsVisible} showGettingStarted={true} closeModalMethod={() => this.setState({ inviteFriendsIsVisible: false })} />
                            
                    </View>   
                             
                    </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    mainGraphicText: {

        color: '#FFFFFF',
        fontSize: 25,
        alignSelf: 'flex-start'
    },
    subGraphicText: {

        color: '#FFFFFF',
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
        backgroundColor: "transparent", width: '100%'
    },
    inputContainerStyle: {
        backgroundColor: '#eeeeee',
    },
    inputStyle: {
        fontSize: 15, color: 'black',  fontFamily: 'Avenir-Roman'
    },
    iconContainer: {
        width: '10%', alignItems: 'center', justifyContent: 'center'
    },
    appbar: {
        backgroundColor: '#FFFFFF',
        elevation: 0,
        borderTopColor: 'transparent',
        shadowOpacity: 0,
    }
});

export default connect(mapStateToProps)(Featured);
