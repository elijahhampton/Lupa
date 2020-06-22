import React from 'react';

import {
    Text,
    View,
    StyleSheet,
    ActionSheetIOS,
    RefreshControl,
    Dimensions,
    SafeAreaView, 
    ScrollView,
    Animated,
    Image,
    Easing,
    TabBarIOS,
} from 'react-native';

import {
    Header,
    Container,
    Left,
    Right,
} from 'native-base';


import {
    SearchBar,
    Avatar
} from 'react-native-elements';

import { 
    IconButton,
    Dialog,
    Title,
    Card,
    Surface,
    Button,
    Appbar,
    Chip,
    FAB,
    Divider,
} from 'react-native-paper';

import Svg, {
    Circle,
    Ellipse,
    G,
    Text as SVGTest,
    TSpan,
    TextPath,
    Path,
    Polygon,
    Polyline,
    Line,
    Rect,
    Use,
    Symbol,
    Defs,
    RadialGradient,
    Stop,
    ClipPath,
    Pattern,
    Mask,
  } from 'react-native-svg';

  import { LinearGradient } from 'expo-linear-gradient'

import { withNavigation, NavigationActions } from 'react-navigation';

import FeatherIcon from "react-native-vector-icons/Feather"

import PackSearchResultCard from './component/PackSearchResultCard';
import UserSearchResultCard from '../user/component/UserSearchResultCard';

import DefaultPack, { SmallPackCard } from './component/ExploreCards/PackExploreCard';
import CreatePack from './modal/CreatePack';


import MyPacksCard from './component/PackCards';

import LupaController from '../../controller/lupa/LupaController';

import { connect } from 'react-redux';
import { getCurrentStoreState } from '../../controller/redux/index';
import CircularUserCard from '../user/component/CircularUserCard';
import { LOG_ERROR } from '../../common/Logger';
import { throwIfAudioIsDisabled } from 'expo-av/build/Audio/AudioAvailability';
import { Constants } from 'react-native-unimodules';
import CreatePackDialog from './dialog/CreatePackDialog';
import GestureRecognizer from 'react-native-swipe-gestures';

const TAB_BUTTONS = [
    "Community",
    "Explore",
  //  "Snippets",
  //  "Daily Body",
  //  "Tutorial",
]

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state
    }
}


class PackView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            explorePagePacks: [],
            activePacks: [],
            communityPacks: [0, 1, 2 ,3, 4],
            defaultPacks: [],
            usersNearYou: [],
            searchValue: "",
            searchResults: [],
            createPackModalIsOpen: false,
            refreshing: false,
            searching: false,
            currUserPacks: this.props.lupa_data.Packs.currUserPacksData,
            searchViewHeight: new Animated.Value(0),
            searchViewWidth: new Animated.Value(0),
            searching: false,
            fabSpinValue: new Animated.Value(0),
            currentTab: 'Community',
            nonParticipatingPacks: [],
        }

        this.renders = 0;

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        // Second interpolate beginning and end values (in this case 0 and 1)
this.spin = this.state.fabSpinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  })
    }

    showSearch = () => {
        this.setState({ searching: true })
        // First set up animation 
Animated.timing(
    this.state.fabSpinValue,
  {
    toValue: 1,
    duration: 500,
    easing: Easing.linear,
    useNativeDriver: true  // To make use of native driver for performance
  }
).start()

        Animated.timing(this.state.searchViewWidth, {
            duration: 300,
            toValue: Dimensions.get('window').width,
            useAnimatedDriver: false,
            useNativeDriver: false,
          //  easing: Easing.bounce
        }).start()

        Animated.timing(this.state.searchViewHeight, {
            duration: 300,
            toValue: Dimensions.get('window').height,
            useAnimatedDriver: false,
            useNativeDriver: false,
           // easing: Easing.bounce
        }).start()
    }

    closeSearch = () => {
        this.setState({ searching: false })
        // First set up animation 
Animated.timing(
    this.state.fabSpinValue,
  {
    toValue: 0,
    duration: 500,
    easing: Easing.linear,
    useNativeDriver: true  // To make use of native driver for performance
  }
).start()

        Animated.timing(this.state.searchViewWidth, {
            duration: 300,
            toValue: 0,
            useAnimatedDriver: false,
            useNativeDriver: false,
          //  easing: Easing.bounce
        }).start()

        Animated.timing(this.state.searchViewHeight, {
            duration: 300,
            toValue: 0,
            useAnimatedDriver: false,
            useNativeDriver: false,
           // easing: Easing.bounce
        }).start()
    }

    componentDidMount = async () => {
        await this.setupComponent()
     } 

     refreshCurrentUserPacks = async () => {
         let data;
         data = await getCurrentStoreState().Packs.currUserPacksData;
         await this.setState({ currUserPacks: data })
     }
 
     async _prepareSearch() {
        // await this.LUPA_CONTROLLER_INSTANCE.indexPacks();
     }
 
     _performSearch = async searchQuery => {
         let searchResultsIn;

         //If no search query then set state and return
         if (searchQuery == "" || searchQuery == "")
         {
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
 
        /* await this.LUPA_CONTROLLER_INSTANCE.search(searchQuery).then(searchData => {
             searchResultsIn = searchData;
         })

         await this.setState({ searchResults: searchResultsIn, searching: false });*/

         await this.setState({ searchResults: [], searching :false });
     }
 
     showSearchResults() {
        //if the searchResults are 0 or undefined then we don't want to display anything
        if (this.state.searchResults.length == 0 || typeof(this.state.searchResults) == 'undefined')
        {
            return;
        }

        if (typeof(this.state.searchResults[0]) != "object")
        {
            return;
        }

         return this.state.searchResults.map(result => {
             switch(result.resultType)
             {
                 case "pack":
                     return (
                         <PackSearchResultCard pack={result} />
                     )
                 default:
                    return (
                        <UserSearchResultCard user={result} />
                    )
             }
         })
     }

     _handleOnRefresh = async () => {
         this.setState({ refreshing: true })
         await this.refreshCurrentUserPacks();
         await this._handleOnRefreshPackData();
         await this._prepareSearch();
         this.setState({ refreshing: false })
     }

     _handleOnRefreshPackData = async () => {
        await this.refreshCurrentUserPacks();
        await this.setupComponent();
     }
     
     setupComponent = async () => {
         let defaultPacksIn = [], explorePagePacksIn = [], nonParticipatingPacksIn = [], nearYouIn = []
         try {
             await this.LUPA_CONTROLLER_INSTANCE.getUsersBasedOnLocation(this.props.lupa_data.Users.currUserData.location).then(result => {
                 nearYouIn = result;
             })
         }
         catch(err) {
             
             nearYouIn = [];
         }

         try {
            await this.LUPA_CONTROLLER_INSTANCE.getCurrentUserDefaultPacks().then(result => {
                defaultPacksIn = result;

                if (defaultPacksIn == undefined || typeof(defaultPacksIn) != "object")
                {
                    defaultPacksIn = [];
                }
            });
         } catch(err)
         {
            defaultPacksIn = []
         }

         try {
            await this.LUPA_CONTROLLER_INSTANCE.getPacksWithoutParticipatingUUID(this.props.lupa_data.Users.currUserData.user_uuid).then(result => {
                nonParticipatingPacksIn = result;
            });
         } catch(error) {
            nonParticipatingPacksIn = []
         }
 
         //set component state
        await this.setState({
            activePacks: explorePagePacksIn,
            nonParticipatingPacks: nonParticipatingPacksIn,
            defaultPacks: defaultPacksIn,
            usersNearYou: nearYouIn,
        })
        
    }
    
    _showActionSheet = () => {
        ActionSheetIOS.showActionSheetWithOptions(
        {
            options: ['Create New Pack', 'Cancel'],
            cancelButtonIndex: 1
        }, (buttonIndex) => {
            switch(buttonIndex) {
                case 0:
                    this.openCreatePackModal()
                    break;
                default:
            }
        });
    }

    loadCurrUserPacks = () => {
        try {
            return this.state.currUserPacks.map(pack => {
                return <MyPacksCard pack={pack} refreshPackViewMethod={this.refreshCurrentUserPacks} title={pack.pack_title} packImage={pack.pack_image} packUUID={pack.pack_uuid} numMembers={pack.pack_members.length} image={pack.pack_image} packType={pack.pack_type}/>
            })
        } catch(err)
        {
            return null;
        }
      }

     mapDefaultPacks = () => {
         try {
            return this.state.defaultPacks.map(pack => {
                return (
                    <DefaultPack packUUID={pack.id} pack={pack} pack_title={pack.pack_title}/>
                )
            })
         } catch(err)
         {
             return null;
         }
     }

     mapNonParticipatingPacks = () => {
        try {
            return this.state.nonParticipatingPacks.map(pack => {
                return (
                 <Card style={{marginVertical: 20, margin: 10, width: Dimensions.get('window').width - 100, borderRadius: 20}}>
                 <Card.Cover source={{uri: pack.pack_image}} />
                 <Card.Content style={{padding: 0, margin: 0}}>
                     <Text style={{width: '100%', paddingVertical: 8, fontFamily: 'HelveticaNeueMedium', fontSize: 18, }}>
                         Find out more about the {pack.pack_title} pack
                     </Text>
                     <Text style={{fontFamily: 'HelveticaNeueLight'}}>
                         {pack.pack_description}
                     </Text>
                 </Card.Content>
             </Card>
                )
            })
         } catch(err)
         {
             return null
         }
     }

     renderNearbyUsers = () => {
         try {
            return this.state.usersNearYou.map(user => {
                if (typeof(user) != 'object' 
                || user == undefined || user.user_uuid == undefined || 
                user.user_uuid == "" || typeof(user.user_uuid) != 'string')
                {
                    return null;
                }
                return (
                    <CircularUserCard user={user} />
                )
            })
         } catch(err) {
             LOG_ERROR('PackView.js', 'Exception caught in renderNearbyUsers()', error);
            return null;
         }
     }

    openCreatePackModal = () => {
        this.setState({ createPackModalIsOpen: true })
    }

    closeCreatePackModal = async () => {
        await this._handleOnRefreshPackData();
        this.setState({ createPackModalIsOpen: false });
    }



    render() {
        return (
            <View style={styles.root}>
                <Appbar.Header style={styles.header} theme={{
                    elevation: 0,
                }} statusBarHeight>
                    <View style={{flexDirection: 'row'}}>
                    <Appbar.Content title="Community" titleStyle={{fontSize: 25, alignSelf: 'flex-start', color: "#212121", marginTop: 15,}} />
                    <Appbar.Action icon="more-vert" size={20} onPress={this._showActionSheet} style={styles.headerItems} color="#212121" />
                    </View>
                   
                
                </Appbar.Header>
                <View style={{width: Dimensions.get('window').width}}>
                    <ScrollView horizontal contentContainerStyle={{padding: 5}}>
                        {
                            TAB_BUTTONS.map((buttonText, index, arr) => {
                                return (
                                    <View style={{alignItems: 'center'}}>
                                        <Button key={index} mode="text" compact color="#212121" style={{/*borderRadius: 0, borderBottomWidth: this.state.currentTab == buttonText ? 2 : 0, borderBottomColor: this.state.currentTab == buttonText ? '#212121' : 'transparent'*/}} onPress={() => this.setState({ currentTab: buttonText })}>
                                            <Text>
                                                {buttonText}
                                            </Text>
                                        </Button>
                                        {this.state.currentTab == buttonText ? <View style={{width: '85%', marginTop: 8, borderBottomWidth: 2, borderBottomColor: '#212121', borderTopColor: 'transparent', borderLeftColor: 'transparent', borderRightColor: 'transparent'}}/>
                                   : null}
                                    </View>
                                )
                            })
                        }
                    </ScrollView>
                    <Divider />
               
                </View>

                {
                    this.state.searchValue != "" ?
                    <>
                                            <SearchBar placeholder="Search for packs and Lupa users"
                        onChangeText={text => this._performSearch(text)} 
                        platform="ios"
                        searchIcon={<FeatherIcon name="search" />}
                        containerStyle={{backgroundColor: "transparent"}}
                        value={this.state.searchValue}/>
         <ScrollView shouldRasterizeIOS={true} shouldRasterizeIOS={true} showsVerticalScrollIndicator={false}refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._handleOnRefresh}/>} >
                        
         {
             this.showSearchResults()
         }
     </ScrollView> 
     </>

     :
         <>
     <ScrollView shouldRasterizeIOS={true} showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow: 2, justifyContent: 'space-between', flexDirection: 'column'}} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._handleOnRefresh}/>}>
     <View style={styles.containerSection}>
                    <View style={styles.sectionTextContainer}>
                    <Text style={styles.headerText}>
                        Users located near you
                    </Text>
                    </View>
                    <View style={styles.sectionContent}>
                        <ScrollView horizontal shouldRasterizeIOS={true} showsHorizontalScrollIndicator={false}>
                            {
                                this.renderNearbyUsers()
                            }
                        </ScrollView>
                    </View>
                </View>

                <View>
                    <Button 
                    key={'discover-trainers-button'} 
                    color="#23374d" 
                    mode="contained" 
                    style={{width: '85%', alignSelf: 'center', marginVertical: 20, height: 50, alignItems: 'center', justifyContent: 'center'}} 
                    theme={{
                        roundness: 10,
                    }}
                    onPress={() => this.props.goToIndex(1)}>
                        <Text>
                            Discover Trainers
                        </Text>
                    </Button>
                </View>

                                {/* Find out more */}
                                <View style={styles.containerSection}>
                            <Divider style={{marginVertical: 20, width: '90%', alignSelf: 'center'}} />
                    <View style={styles.sectionContent}>
                        <ScrollView contentContainerStyle={{justifyContent: 'center'}} horizontal shouldRasterizeIOS={true} showsHorizontalScrollIndicator={false}>
                            {
                               this.mapNonParticipatingPacks()
                            }
                        </ScrollView>
                    </View>

                    <Divider style={{marginVertical: 20, width: '90%', alignSelf: 'center'}} />

                </View>


                                {/* Default Packs */}
                                <View style={styles.containerSection}>
                    <View style={styles.sectionTextContainer}>
                    <Text style={styles.headerText}>
                        Default Packs based on your account
                    </Text>
                    </View>

                    <View style={styles.sectionContent}>
                        <ScrollView contentContainerStyle={{justifyContent: 'center'}} horizontal shouldRasterizeIOS={true} showsHorizontalScrollIndicator={false}>
                            {
                                this.mapDefaultPacks()
                            }
                        </ScrollView>
                    </View>

                </View>

                {/* My Packs */}
                <View style={styles.containerSection}>
                    <View style={styles.sectionTextContainer}>
                    <Text style={styles.headerText}>
                        My Packs
                    </Text>
                    </View>
                    <View style={styles.sectionContent}>
                        <View>
                            {
                                this.loadCurrUserPacks()
                            }
                        </View>
                    </View>
                </View>
                </ScrollView>
                </>
                }

               <Animated.View style={{backgroundColor: 'white', height: this.state.searchViewHeight, width: this.state.searchViewWidth, position: 'absolute', bottom: 0, right: 0, margin: 0}}>
              
                    <View style={{marginTop: Constants.statusBarHeight}}>
                   <SearchBar placeholder="Search"
                        onChangeText={text => this._performSearch(text)} 
                        platform="ios"
                        searchIcon={<FeatherIcon name="search" />}
                        containerStyle={{backgroundColor: "transparent"}}
        value={this.state.searchValue}/>
                    </View>

                    {
                        this.state.searchValue == "" ?
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{color: 'rgb(199, 199, 204)', fontFamily: 'HelveticaNeueLight', fontSize: 20, padding: 10}}>
                                Your fitness directory.  In your pocket.
                            </Text>
                        </View>
                        :
                        <ScrollView contentContainerStyle={{backgroundColor: 'white'}}>
                        
                        </ScrollView>
                        //perform search
                    }

               

</Animated.View>
          <FAB icon={this.state.searching === true ? 'close' : 'search'} color="rgba(255,255,255 ,1)" onPress={this.state.searching == true ? this.closeSearch : this.showSearch} style={{ transform: [{rotate: this.spin}], backgroundColor: '#23374d', position: 'absolute', bottom: 0, right: 0, margin: 16}} />
            
           <CreatePackDialog isVisible={this.state.createPackModalIsOpen} closeDialogMethod={this.closeCreatePackModal} /> 
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    textStyles: {
        fontFamily: 'ars-maquette-pro-bold',fontSize: 25, fontWeight: "600", color: "black"
    },
    header: {
        justifyContent: 'space-between',
        elevation: 0,
        backgroundColor: 'transparent',
        flexDirection: 'column'
    },
    headerItems: {
        alignSelf: 'flex-start'
    },
    containerSection: {
        flexDirection: 'column',
        width: Dimensions.get('window').width,
    },
    headerText: {
        fontSize: 18,
        paddingLeft: 10,
        paddingVertical: 8,
        color: '#212121',
    },
    sectionTextContainer: {
        flexDirection: 'column',
    },
    searchHeader: {
        fontFamily: 'ARSMaquettePro-Medium', 
        fontSize: 35, 
        paddingLeft: 12,
        marginTop: Constants.statusBarHeight,
    },
    headerDescriptionText: {
        fontSize: 15,
        paddingLeft: 10,
        color: '#212121',
        fontFamily: 'HelveticaNeueLight',
    },
    sectionContent: {

    }
});

export default connect(mapStateToProps)(withNavigation(PackView));