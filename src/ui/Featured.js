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
    Platform
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
import { connect, useDispatch } from 'react-redux';
import { RFValue } from 'react-native-responsive-fontsize';
import LUPA_DB from '../controller/firebase/firebase';
import VlogFeedCard from './user/component/VlogFeedCard';
import { FlatList } from 'react-native-gesture-handler';

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
            const updatedState = [];

            querySnapshot.forEach(doc => {
                let data = doc.data();

                if (typeof (data) != 'undefined') {
                    updatedState.push(data);
                }
            });

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

        }, err => {
            alert(err)
        });

        this.setState({ suggestionBannerVisisble: true })

    }

    async componentWillUnmount() {
        return () => vlogCollectionObserver();
    }

    handleOnRefresh = () => {
        this.setState({ refreshing: true })
        this.setState({ refreshing: false })
      }

    checkSearchBarState = () => {
        if (this.state.searchBarFocused === true) {
            this.props.navigation.push('Search')
            this.searchBarRef.current.blur();
        }
    }

    renderVlogs = () => {
        if (this.state.feedVlogs.length === 0) {
            return (
                <View style={{ width: '100%', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
                    <Caption style={{ fontFamily: 'Avenir-Light', fontSize: 15, textAlign: 'center', backgroundColor: '#FFFFFF' }} >
                        There are no any vlogs in your area.  Check back later.
                    </Caption>
                </View>
            )
        }


        return this.state.feedVlogs.map((vlog, index, arr) => {
            if (index == 0) {
                return   <VlogFeedCard key={index} vlogData={vlog} showTopDivider={false} />
            }

            return (
                    <VlogFeedCard key={index} clickable={true} vlogData={vlog} showTopDivider={true} />  
            )
        })
    }

    render() {
        return (
            <View style={styles.root}>
     
                                <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleOnRefresh} />} contentContainerStyle={{backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
                                    {this.renderVlogs()}
                                </ScrollView>

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
        backgroundColor: "#FFFFFF", width: Dimensions.get('window').width, alignSelf: 'center'
    },
    inputContainerStyle: {
        backgroundColor: 'white',
    },
    inputStyle: {
        fontSize: 15, fontWeight: '600', fontFamily: 'Avenir-Roman'
    },
    iconContainer: {
        width: '10%', alignItems: 'center', justifyContent: 'center'
    },
    appbar: {
        width: Dimensions.get('window').width,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        elevation: 0,
        flexDirection: 'column',
        marginVertical: 20
    }
});

export default connect(mapStateToProps)(Featured);
