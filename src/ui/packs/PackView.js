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
    Title,
    Appbar,
    Chip,
} from 'react-native-paper';

import { withNavigation, NavigationActions } from 'react-navigation';

import FeatherIcon from "react-native-vector-icons/Feather"

import PackSearchResultCard from './component/PackSearchResultCard';
import UserSearchResultCard from '../user/component/UserSearchResultCard';
import TrainerSearchResultCard from '../user/trainer/component/TrainerSearchResultCard';

import DefaultPack, { SmallPackCard } from './component/ExploreCards/PackExploreCard';
import CreatePack from './modal/CreatePack';


import MyPacksCard from './component/PackCards';

import LupaController from '../../controller/lupa/LupaController';

import { connect } from 'react-redux';
import { getCurrentStoreState } from '../../controller/redux/index';
import CircularUserCard from '../user/component/CircularUserCard';


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
            currUserPacks: this.props.lupa_data.Packs.currUserPacksData
        }

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    }

    componentDidMount = async () => {
        await this.setupExplorePage()
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
                searchValue: "",
                searchResults: []
            })

            return;
         }

         await this.setState({
             searchResults: [],
         })

         await this.setState({
             searchValue: searchQuery,
         })
 
         await this.LUPA_CONTROLLER_INSTANCE.search(searchQuery).then(searchData => {
             searchResultsIn = searchData;
         })

         await this.setState({ searchResults: searchResultsIn });
     }
 
     showSearchResults() {
        //if the searchResults are 0 or undefined then we don't want to display anything
        if (this.state.searchResults.length == 0 || this.state.searchResults == undefined)
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
                         <PackSearchResultCard  title={result.pack_title} packLocation={result.pack_location.city + ", " + result.pack_location.state} isSubscription={result.pack_isSubscription} uuid={result.pack_uuid} />
                     )
                     case "trainer":
                        return (
                            <TrainerSearchResultCard title={result.display_name} username={result.username} email={result.email} avatar={result.photo_url} uuid={result.objectID} />
                        )
                    case "user":
                        return (
                            <UserSearchResultCard title={result.display_name} username={result.username} email={result.email} avatar={result.photo_url} uuid={result.objectID} />
                        )
                 default:
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
        await this.setupExplorePage();
     }
     
     setupExplorePage = async () => {
         let defaultPacksIn, explorePagePacksIn, communityPagePacksIn, nearYouIn = []
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

         }
 
         //set component state
        await this.setState({
            activePacks: explorePagePacksIn,

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
                return <MyPacksCard refreshPackViewMethod={this.refreshCurrentUserPacks} title={pack.pack_title} packImage={pack.pack_image} packUUID={pack.pack_uuid} numMembers={pack.pack_members.length} image={pack.pack_image} packType={pack.pack_type}/>
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
                    <DefaultPack packUUID={pack.id} pack_title={pack.pack_title}/>
                )
            })
         } catch(err)
         {
             return null;
         }
     }

     mapActivePacks = () => {
         if (true && this.state.activePacks.length)
         {
             if (this.state.activePacks.length > 0)
             {
                return this.state.activePacks.map(pack => {
                    return (
                        <SmallPackCard packCity={pack.pack_location.city} packState={pack.pack_location.state} packDescription={pack.pack_description} />
                    )
                })
             }
             else
             {
                 //couldn't find any packs.. this shouldn't happen as we add random packs even if there are none near the user
             }
         }
     }

     mapCommunityPacks = () => {
        if (true && this.state.communityPacks.length)
         {
             if (this.state.communityPacks.length > 0)
             {
                return this.state.communityPacks.map(pack => {
                    return (
                        <SmallPackCard />
                    )
                })
             }
             else
             {
                 //couldn't find any packs.. this shouldn't happen as we add random packs even if there are none near the user
             }
         }
     }

     renderNearbyUsers = () => {
         try {
            return this.state.usersNearYou.map(user => {
                return (
                    <CircularUserCard user={user} />
                )
            })
         } catch(err) {
        
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
                }}>
                    <Appbar.Action icon="more-vert" size={20} onPress={this._showActionSheet} style={styles.headerItems} color="#FFFFFF" />

                    <Appbar.Content title="Community" titleStyle={{fontFamily: 'ARSMaquettePro-Black',fontSize: 20, fontWeight: "600", color: "#212121"}} />
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
                                         <SearchBar placeholder="Search for packs and Lupa users"
                        onChangeText={text => this._performSearch(text)} 
                        platform="ios"
                        searchIcon={<FeatherIcon name="search" />}
                        containerStyle={{backgroundColor: "transparent"}}
                        value={this.state.searchValue}/>
     <ScrollView shouldRasterizeIOS={true} showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow: 2, justifyContent: 'space-between', flexDirection: 'column'}} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._handleOnRefresh}/>}>
                        
                {/* My Packs */}
                <View style={styles.containerSection}>
                    <View style={styles.sectionTextContainer}>
                    <Text style={styles.headerText}>
                        My Packs
                    </Text>
                    <Text style={styles.headerDescriptionText}>
                        Community Packs you have joined
                    </Text>
                    </View>
                    <View style={styles.sectionContent}>
                        <ScrollView horizontal shouldRasterizeIOS={true} showsHorizontalScrollIndicator={false}>
                            {
                                this.loadCurrUserPacks()
                            }
                        </ScrollView>
                    </View>
                </View>

                <View style={styles.containerSection}>
                    <View style={styles.sectionTextContainer}>
                    <Text style={styles.headerText}>
                        Near you
                    </Text>
                    <Text style={styles.headerDescriptionText}>
                        Users near you
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

                {/* Default Packs */}
                <View style={styles.containerSection}>
                    <View style={styles.sectionTextContainer}>
                    <Text style={styles.headerText}>
                        Default Packs
                    </Text>
                    <Text style={styles.headerDescriptionText}>
                        Default Lupa packs based on your account
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
{/*
                <View style={styles.containerSection}>
                    <View style={styles.sectionTextContainer}>
                    <Text style={styles.headerText}>
                        Communities
                    </Text>
                    </View>
                    <View style={styles.sectionContent}>
                        <ScrollView horizontal shouldRasterizeIOS={true} showsHorizontalScrollIndicator={false}>
                           {
                               this.mapCommunityPacks()
                            }
                        </ScrollView>
                    </View>
                </View>
                        */}
                </ScrollView>
                </>
                }

               <CreatePack isOpen={this.state.createPackModalIsOpen} closeModalMethod={this.closeCreatePackModal}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#F2F2F2",
    },
    textStyles: {
        fontFamily: 'ars-maquette-pro-bold',fontSize: 25, fontWeight: "600", color: "black"
    },
    header: {
        justifyContent: 'space-between',
        elevation: 0,
        backgroundColor: 'transparent'
    },
    headerItems: {
        alignSelf: 'flex-start'
    },
    containerSection: {
        flexDirection: 'column',
        width: Dimensions.get('window').width,
        margin: 8,
    },
    sectionTextContainer: {
        flexDirection: 'column',
    },
    headerText: {
        fontSize: 18,
        fontWeight: '500',
        padding: 3,
        color: '#212121',
        fontFamily: 'ars-maquette-pro-medium',
    },
    headerDescriptionText: {
        fontSize: 15,
        fontWeight: '400',
        padding: 3,
        color: '#212121',
        fontFamily: 'ars-maquette-pro-regular',
    },
    sectionContent: {

    }
});

export default connect(mapStateToProps)(withNavigation(PackView));