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
    SearchBar,
    Avatar
} from 'react-native-elements';

import { 
    IconButton,
    Dialog,
    Title,
    Card,
    Searchbar,
    Surface,
    Button,
    Appbar,
    Chip,
    FAB,
    Divider,
} from 'react-native-paper';

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
import { RFValue } from 'react-native-responsive-fontsize'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MenuIcon } from '../icons';

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

     mapRecommendedGroups = () => {
        try {
            return this.state.communityPacks.map(pack => {
                return (
                <SmallPackCard pack={pack} />
                )
            })
         } catch(err)
         {
             return null
         }
     }

     mapNonParticipatingPacks = () => {
        try {
            return this.state.nonParticipatingPacks.map(pack => {
                return (
                 <Card style={{marginVertical: 20, margin: 10, width: Dimensions.get('window').width / 1.5, borderRadius: 0}}>
                 <Card.Cover source={{uri: pack.pack_image}} />
                 <Card.Content style={{padding: 0, margin: 0}}>
                     <Text style={{color: 'rgb(44, 44, 46)', width: '100%', paddingVertical: 8 , fontSize: 18, }}>
                         Find out more about the {pack.pack_title} pack
                     </Text>
                     <Text>
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
                <Appbar.Header style={[styles.header, {height: 'auto', elevation: 0}]} theme={{
                    elevation: 0,
                }}>
                     <MenuIcon customStyle={{margin:10}} onPress={() => this.props.navigation.openDrawer()} />
                    <Appbar.Content title="Community" titleStyle={{alignSelf: 'center', color: "#212121"}} />
                    <Appbar.Action icon={() => <FeatherIcon name="more-vertical" size={20} /> } size={20} onPress={this._showActionSheet} style={styles.headerItems} color="#212121" />
                   
                
                </Appbar.Header>

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
                        Recommended Groups
                    </Text>

                    <View>
                        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text onPress={() => this.props.navigation.navigate('LupaHome')} style={{color: '#1089ff'}}>
                           See all
                        </Text>
                        <FeatherIcon name="arrow-right" color="#1089ff" />
                        </TouchableOpacity>
                </View>
                    </View>

                    <View style={styles.sectionContent}>
                        <ScrollView contentContainerStyle={{justifyContent: 'center'}} horizontal shouldRasterizeIOS={true} showsHorizontalScrollIndicator={false}>
                            {
                                this.mapRecommendedGroups()
                            }
                        </ScrollView>
                    </View>
                </View>

                                {/* Find out more */}
                                <View style={styles.containerSection}>
                            <Divider style={{marginVertical: 20, width: '90%', alignSelf: 'center'}} />
                    <View style={styles.sectionContent}>
                    <View style={{padding: 5, width: '80%'}}>
                    <Text style={{fontSize: RFValue(15), fontWeight: '400', paddingVertical: 10, paddingLeft: 10 }}>
                       Learn more about packs
                    </Text>
                    <View style={{marginLeft: 10, width: 30, height: 3, backgroundColor: 'black', borderBottomEndRadius: 0}} />
                    </View>
                        <ScrollView contentContainerStyle={{justifyContent: 'center'}} horizontal shouldRasterizeIOS={true} showsHorizontalScrollIndicator={false}>
                            {
                               this.mapNonParticipatingPacks()
                            }
                        </ScrollView>
                    </View>

                    <View>
                    <Button 
                    key={'discover-trainers-button'} 
                    color="#1089ff" 
                    mode="contained" 
                    style={{elevation: 6, width: 'auto', marginLeft: 20, alignSelf: 'flex-start', marginVertical: 20, alignItems: 'center', justifyContent: 'center'}} 
                    theme={{
                        roundness: 7,
                    }}
                    onPress={() => this.props.navigation.navigate('LupaHome')}
                    >
                        <Text>
                            Discover people to follow
                        </Text>
                    </Button>
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
                    <Searchbar 
       style={{marginVertical: 5, borderRadius: 10, width: Dimensions.get('window').width - 50, alignSelf: 'center'}} 
       placeholder="Search workout programs, fitness professionals" 
       placeholderTextColor="rgb(99, 99, 102)" 
       icon={() => <FeatherIcon name="search" size={20} /> }
       inputStyle={{width: '100%', fontWeight: '300', fontSize: 15, padding: 0, margin: 0, width: '100%'}}
       theme={{
           colors: {
               primary: '#1089ff',
           }
       }}
       onChangeText={text => this._performSearch(text)}
       value={this.state.searchValue}
       />
                    </View>

                    {
                        this.state.searchValue == "" ?
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{color: 'rgb(199, 199, 204)' , fontSize: 20, padding: 10}}>
                                Your fitness directory.  In your pocket.
                            </Text>
                        </View>
                        :
                        <ScrollView contentContainerStyle={{backgroundColor: 'white'}}>
                        
                        </ScrollView>
                        //perform search
                    }

               

</Animated.View>
         {/* <FAB icon={this.state.searching === true ? 'close' : 'search'} color="rgba(255,255,255 ,1)" onPress={this.state.searching == true ? this.closeSearch : this.showSearch} style={{ transform: [{rotate: this.spin}], backgroundColor: '#1089ff', position: 'absolute', bottom: 0, right: 0, margin: 16}} /> */}
            
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
       backgroundColor: 'white',
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 5,
    },
    searchHeader: {
          
        fontSize: 35, 
        paddingLeft: 12,
        marginTop: Constants.statusBarHeight,
    },
    headerDescriptionText: {
        fontSize: 15,
        paddingLeft: 10,
        color: '#212121',
    },
    sectionContent: {

    }
});

export default connect(mapStateToProps)(PackView);