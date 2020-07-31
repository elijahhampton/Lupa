/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  23, 2019
 *
 *  LupaHome
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    InteractionManager,
    ScrollView,
    Switch,
    TouchableOpacity,
    Image,
    Text,
    Modal,
    Dimensions,
    SafeAreaView,
    Button as NativeButton,
    Animated,
    RefreshControl,
} from 'react-native';

import {
    Surface,
    DataTable,
    Button,
    IconButton,
    Chip,
    Paragraph,
    Card,
    Banner,
    Caption,
    Badge,
    Appbar,
    Searchbar,
    Divider,
    Avatar,
    FAB,
    Menu,

} from 'react-native-paper';

import LupaController from '../controller/lupa/LupaController';

import { connect } from 'react-redux';
import { Modalize } from 'react-native-modalize';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import FeaturedProgramCard from './workout/program/components/FeaturedProgramCard';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import LUPA_DB from '../controller/firebase/firebase'
import StandardTrainerCard from './user/component/StandardTrainerCard';
import { MenuIcon } from './icons';
import { SearchBar } from 'react-native-elements';
import Swiper from 'react-native-swiper';
import { LOG_ERROR } from '../common/Logger';
import LargeProgramSearchResultCard from './workout/program/components/LargeProgramSearchResultCard';
import LiveWorkoutPreview from './workout/program/modal/LiveWorkoutPreview';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import InviteFriendsModal from './user/modal/InviteFriendsModal'
import { retrieveAsyncData, storeAsyncData } from '../controller/lupa/storage/async';
import ThinFeatherIcon from "react-native-feather1s";
import LiveWorkout from './workout/modal/LiveWorkout'
import CircularUserCard from './user/component/CircularUserCard';
import { TemporaryDirectoryPath } from 'react-native-fs';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

class LupaHome extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            swiperTwoViewIndex: 0,
            showTrainerRegistrationModal: false,
            trainerInsightsVisible: false,
            visible: false,
            usersNearYou: [],
            featuredTrainers: [],
            currCardIndex: 0,
            searchValue: "",
            searchResults: [],
            refreshing: false,
            searching: false,
            featuredPrograms: [],
            programModalVisible: false,
            inviteFriendsIsVisible: false,
            customizedInviteFriendsModalIsOpen: false,
            trainWithSwiperIndex: 0, //approved,
            index: 0,
            data: [0, 1, 2, 3, 4],
            showLiveWorkoutPreview: false,
        }

        this.searchAttributePickerModalRef = React.createRef()
        this.offset = 0
    }

    async componentDidMount() {
        await this.checkNewUser();
        await this.setupComponent();

        this.currExplorePageProgramsSubscription = LUPA_DB.collection('programs').onSnapshot((querySNapshot => {
            this.setupComponent();
        }))
    }

    componentWillUnmount = () => {
        //this.currExplorePageProgramsSubscription.unsubscribe()
    }

    setupComponent = async () => {
        await this.loadFeaturedPrograms();
        await this.loadFeaturedTrainers()
        //await this.loadTopPicks()
        //await this.loadRecentlyAddedPrograms
    }

    loadFeaturedTrainers = async () => {
        let featuredTrainersIn = []
        try {
            await this.LUPA_CONTROLLER_INSTANCE.getAllTrainers().then(result => {
                featuredTrainersIn = result;
            })
        }
        catch (err) {
            alert(err)
            featuredTrainersIn = [];
        }

        //set component state
        await this.setState({
            featuredTrainers: featuredTrainersIn
        })
    }

    loadTopPicks = () => {

    }

    loadRecentlyAddedPrograms = () => {

    }

    handleOnRefresh = async () => {
        this.setState({ refreshing: true })
        await this.setupComponent()
        this.setState({ refreshing: false })
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

    renderNearbyUsers = () => {
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

    closeTrainerInsightsModalMethod = () => {
        this.setState({ trainerInsightsVisible: false })
    }

    _performSearch = async searchQuery => {
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

        /*    await this.LUPA_CONTROLLER_INSTANCE.searchPrograms(searchQuery).then(searchData => {
                searchResultsIn = searchData;
            })*/

        await this.setState({ searchResults: searchResultsIn, searching: false });
    }

    showLiveWorkoutPreview = () => {
        this.setState({ showLiveWorkoutPreview: true })
    }

    hideLiveWorkoutPreview = () => {
        this.setState({ showLiveWorkoutPreview: false })
    }

    render() {
        return (
            <View style={styles.root}>

               <Appbar.Header style={{ backgroundColor: '#FFFFFF', elevation: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: 'rgb(199, 199, 204)', borderBottomWidth: 0.8 }}>
                    <MenuIcon customStyle={{ margin: 10 }} onPress={() => this.props.navigation.openDrawer()} />

                    <Appbar.Content title="Explore" titleStyle={{fontFamily: 'HelveticaNeue-Bold', fontSize: 20, fontWeight: '600'}} />

                    <ThinFeatherIcon name="mail" thin={true} size={25} style={{ marginRight: 10 }} onPress={() => this.props.navigation.navigate('MessagesView')} />
                </Appbar.Header>
                <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                    <ScrollView
                        contentContainerStyle={{ width: Dimensions.get('window').width, justifyContent: 'space-between', flexGrow: 2 }}
                        refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleOnRefresh} />}
                    >


                        <View style={{ justifyContent: 'center', justifyContent: 'center', marginVertical: 10 }}>
                        <View style={{ padding: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                              <View style={{paddingHorizontal: 10}}>
                              <Text style={styles.sectionHeaderText}>
                                   Daily suggestions
                        </Text>
                        <Caption>
                            Based on your location (Auburn, AL)
                        </Caption>
                              </View>

                        <Button uppercase={false} mode="text" style={{width: 'auto', flexDirection: 'row', alignItems: 'center'}}>
                <Text style={[styles.sectionHeaderText, {fontSize: RFValue(13), color: '#1089ff'}]}>
                    See more
                </Text>
                    </Button>
                            </View>
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                snapToAlignment='center'
                                centerContent
                                snapToInterval={Dimensions.get('window').width }
                                decelerationRate={0}
                                pagingEnabled={true}
                                
                            >
                                {
                                    this.state.featuredPrograms.map(item => {
                                        return (
                                            <View>
                                            <TouchableOpacity key={item.program_name} onPress={/*this.showLiveWorkoutPreview*/ () => {
                                                this.props.navigation.push('LiveWorkout', {
                                                    uuid: 'df871187-16b2-58ae-9626-6537b5ac4866'
                                                })
                                            }} style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                <Card theme={{roundness: 5}} style={{ alignSelf: 'center', elevation: 0, margin: 10, width: Dimensions.get('window').width - 50, height: 220, marginVertical: 10 }}>
                                                    <Card.Cover resizeMode='contain' source={{ uri: item.program_image }} style={{ borderRadius: 5, with: '100%', height: '100%', justifyContent: 'center' }} />
                                                </Card>
                                                <View style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', backgroundColor: 'rgba(58, 58, 60, 0.5)', borderRadius: 80, width: 70, height: 70, borderWidth: 1, borderColor: '#FFFFFF' }}>
                                                    <ThinFeatherIcon thin={true} name="play" color="white" size={30} style={{ alignSelf: 'center' }} />
                                                </View>
                                                <LiveWorkoutPreview program={item} isVisible={this.state.showLiveWorkoutPreview} closeModal={this.hideLiveWorkoutPreview} />
                                            </TouchableOpacity>
                                            <View style={{paddingLeft: 10}}>
                                                <Text style={{fontFamily: 'HelveticaNeue-Medium', fontSize: 15}}>
                                                {
                                                item.program_name.replace(/\w\S*/g, (txt) => {
                                                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
                                                })
                                                }
                                    
                                                </Text>
                                                <Caption>
                                                    Emily Loefstedt (0)
                                                </Caption>
                                                <Text style={{fontFamily: 'HelveticaNeue-Medium', fontSize: 15}}>
                                                    ${item.program_price}.00
                                                </Text>
                                            </View>
                                            </View>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>


                        <View style={{ justifyContent: 'center', justifyContent: 'center' }}>
                             
                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', flexDirection: 'row', paddingHorizontal: 10, width: '100%',}}>
                                <Text style={styles.sectionHeaderText}>
                                    Start training with
                    </Text>
                    <Button uppercase={false} mode="text" style={{marginVertical: 5, width: 'auto', flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start'}}>
                <Text style={{color: '#1089ff', fontWeight: '500'}}>
                    See more
                </Text>
                    </Button>
                            </View>

                            <View style={{ width: Dimensions.get('window').width }}>
                                <ScrollView
                                    snapToAlignment={'center'}
                                    snapToInterval={Dimensions.get('window').width}
                                    decelerationRate={0}
                                    contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
                                    centerContent
                                    onIndexChanged={index => this.setState({ index: index })}
                                    pagingEnabled={true}
                                    loop={false}
                                    showsPagination={false}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false} >
                                    {this.renderNearbyUsers()}
                                </ScrollView>

                               
                            </View>
                             
                        </View>


                     {/*   <View style={{ height: 190, backgroundColor: 'white', alignItems: 'center', justifyContent: 'space-evenly' }}>

                            <View style={{ width: '66%', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontFamily: 'Avenir-Roman', paddingVertical: 5, color: '#23374d', fontWeight: '600', fontSize: RFValue(17) }}>
                                    Need a trainer now?
                                    </Text>
                                <Text style={{ textAlign: 'center', fontSize: RFValue(13), fontFamily: 'avenir-roman', fontWeight: '300' }}>
                                    Click here and we'll recommend a program to you.
                                    </Text>
                            </View>


                            <Button uppercase={false} mode="contained" color="#1089ff" theme={{ roundness: 7 }} style={{  alignItems: 'center', justifyContent: 'center', elevation: 0, width: '65%' }}>
                                <Text style={{ fontSize: 15, fontFamily: 'Avenir-Black', fontWeight: '800' }}>
                                    Find a Trainer
                                        </Text>
                            </Button>
                        </View>

                         
                            */}
                        <View
                            style={{ justifyContent: 'center', justifyContent: 'center', marginVertical: 10 }}>
                            <View style={{ paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={styles.sectionHeaderText}>
                                    Top picks
                        </Text>

                        <Button uppercase={false} mode="text" style={{marginVertical: 5, width: 'auto', flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start'}}>
                <Text style={{color: '#1089ff', fontWeight: '500'}}>
                    See more
                </Text>
                    </Button>
                            </View>
                            <ScrollView scrollEnabled={this.state.featuredPrograms.length > 1 ? true : false} horizontal bounces={false} pagingEnabled={true} snapToInterval={Dimensions.get('window').width - 50} snapToAlignment={'center'} decelerationRate={0} >
                                {
                                    this.state.featuredPrograms.map((currProgram, index, arr) => {
                                        return (
                                            <FeaturedProgramCard currProgram={currProgram} keyProp={currProgram.program_name} />
                                        )
                                    })
                                }

                            </ScrollView>
                        </View>

                         <Divider style={{width: '90%', alignSelf: 'center'}} />

                        <View style={{ backgroundColor: 'white', justifyContent: 'center', justifyContent: 'center', paddingVertical: 20, }}>
                            <View style={{ alignItems: 'flex-start', width: '100%', paddingHorizontal: 10 }}>
                                <Text style={styles.sectionHeaderText}>
                                    Recently created programs
                    </Text>
                    <Caption>
                        Last updated 5 minutes ago
                    </Caption>
                            </View>
                            {this.renderRecentlyAddedPrograms()}
                        </View>

                    </ScrollView>
                </View>

                            <InviteFriendsModal isVisible={this.state.inviteFriendsIsVisible} showGettingStarted={true} closeModalMethod={() => this.setState({ inviteFriendsIsVisible: false })} />
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
        fontSize: RFValue(15), fontFamily: 'HelveticaNeue-Bold'
    }
});

export default connect(mapStateToProps)(LupaHome);
