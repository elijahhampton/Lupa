import React from 'react';
import { connect } from 'react-redux';
import { getCurrentStoreState } from '../../controller/redux/index';

import {
    Text,
    View,
    StyleSheet,
    ActionSheetIOS,
    RefreshControl,
    Dimensions,
    ScrollView,
} from 'react-native';

import {
    SearchBar,
} from 'react-native-elements';

import { 
    Appbar,
} from 'react-native-paper';

import { 
    withNavigation
 } from 'react-navigation';

 import DefaultPack, { 
     SmallPackCard 
    } from './component/ExploreCards/PackExploreCard';

import CreatePack from './modal/CreatePack';
import MyPacksCard from './component/PackCards';

import FeatherIcon from "react-native-vector-icons/Feather"

import CircularUserCard from '../user/component/CircularUserCard';
import PackSearchResultCard from './component/PackSearchResultCard';
import UserSearchResultCard from '../user/component/UserSearchResultCard';
import TrainerSearchResultCard from '../user/trainer/component/TrainerSearchResultCard';

import LupaController from '../../controller/lupa/LupaController';
import ServicedComponent from '../../controller/lupa/interface/ServicedComponent';


const mapStateToProps = (state, action) => {
    return {
        lupa_data: state
    }
}

interface IPackViewProps {
    lupa_data: any,
}

interface IPackViewState {
    explorePagePacks: Array<Object>,
    activePacks: Array<Object>,
    communityPacks: Array<Object>,
    usersNearYou: Array<Object>,
    searchValue: String,
    searchResults: Array<Object>,
    createPackModalIsOpen: Boolean,
    refreshing: Boolean,
    defaultPacks: Array<Object>,
    currUserPacks: Array<Object>
}

/**
 * PackView Component.
 * This component renders general information about Packs including a user's packs, default packs, 
 * and community groups and active packs.  
 */
class PackView extends React.Component<IPackViewProps, IPackViewState> implements ServicedComponent {
    LUPA_CONTROLLER_INSTANCE: LupaController;
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

    /**
     * Lifecycle method - Handles operations after the component mounts.
     */
    componentDidMount = async () => {
        await this.setupComponent()
     } 

     /**
      * Refreshes the current users packs in redux
      */
     refreshCurrentUserPacks = async () => {
         let data;
         data = await getCurrentStoreState().Packs.currUserPacksData;
         await this.setState({ currUserPacks: data })
     }
     
     /**
      * Prepares the search by indexing packs into algolia.
      */
     async _prepareSearch() {
         await this.LUPA_CONTROLLER_INSTANCE.indexPacks();
     }
     
     /**
      * Performs a search and populates the state with the results.
      */
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
     
     /**
      * Renders search results for packs.
      * @return PackSearchResultCard if the result is a pack
      * @return TrainerSearchResultCard if the result is a trainer
      * @return UserSearchResultCard if the result is a user
      */
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

     /**
      * Refreshing the pack view completely and indexes algolia.
      */
     _handleOnRefresh = async () => {
         this.setState({ refreshing: true })
         await this.refreshCurrentUserPacks();
         await this._handleOnRefreshPackData();
         await this._prepareSearch();
         this.setState({ refreshing: false })
     }

     /**
      * Refreshes pack data.
      */
     _handleOnRefreshPackData = async () => {
       // await this.refreshCurrentUserPacks();
        await this.setupComponent();
     }
    
     /**
      * Handles any necessary operations when the component mounts.
      */
     setupComponent = async () => {
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
            defaultPacksIn = []
         }
 
         //set component state
        await this.setState({
            activePacks: explorePagePacksIn,

            defaultPacks: defaultPacksIn,
            usersNearYou: nearYouIn,
        })
        
    }
    
    /**
     * Renders an iOS action sheet.
     */
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

    /**
     * Renders the current user's packs.
     * @return MyPacksCard for each object in this.state.currUserPacks
     */
    showCurrUserPacks = () => {
        try {
            return this.state.currUserPacks.map(pack => {
                return <MyPacksCard refreshPackViewMethod={this.refreshCurrentUserPacks} title={pack.pack_title} packImage={pack.pack_image} packUUID={pack.pack_uuid} numMembers={pack.pack_members.length} image={pack.pack_image} packType={pack.pack_type}/>
            })
        } catch(err)
        {
            return null;
        }
      }

      /**
       * Renders default packs.
       * @return DefaultPack for each object in this.state.defaultPacks
       */
     showDefaultPacks = () => {
         try {
            return this.state.defaultPacks.map(pack => {
                return (
                    <DefaultPack pack={pack} packUUID={pack.id} pack_title={pack.pack_title}/>
                )
            })
         } catch(err)
         {
             return null;
         }
     }

     /**
      * Renders near by users on the screen.
      * @Return CircularUserCard for each object in this.state.usersNearYou.
      */
     showNearbyUsers = () => {
         try {
            return this.state.usersNearYou.map(user => {
                return (
                    <CircularUserCard user={user} />
                )
            })
         } catch(err) {
        
         }
     }

     /**
      * Opens the create pack modal.
      */
    openCreatePackModal = () => {
        this.setState({ createPackModalIsOpen: true })
    }

    /**
     * Refreshes user pack data and closes the create pack modal.
     */
    closeCreatePackModal = async () => {
        await this._handleOnRefreshPackData();
        this.setState({ createPackModalIsOpen: false });
    }

    /**
     * Renders the component.
     */
    render() {
        return (
            <View style={styles.root}>
                <Appbar.Header style={styles.header} 
                theme={{
                    elevation: 0,
                }}>
                <Appbar.Action icon="more-vert" size={20} onPress={this._showActionSheet} style={styles.headerItems} color="#212121" />
                <Appbar.Content title="Community" titleStyle={styles.appBarTitle} />
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
         <ScrollView 
         shouldRasterizeIOS={true} 
         showsVerticalScrollIndicator={false}
         refreshControl={<RefreshControl refreshing={this.state.refreshing} 
         onRefresh={this._handleOnRefresh}/>}>     
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
     <ScrollView 
     shouldRasterizeIOS={true} 
     showsVerticalScrollIndicator={false} 
     contentContainerStyle={styles.myPacksScrollView} 
     refreshControl={<RefreshControl refreshing={this.state.refreshing} 
     onRefresh={this._handleOnRefresh}/>}>
                        
                {/* My Packs START */}
                <View style={styles.containerSection}>
                    <View style={styles.sectionTextContainer}>
                    <Text style={styles.sectionHeaderText}>
                        My Packs
                    </Text>
                    <Text style={styles.headerDescriptionText}>
                        Community Packs you have joined
                    </Text>
                    </View>
                    <View style={styles.sectionContent}>
                        <ScrollView 
                        horizontal={true} 
                        shouldRasterizeIOS={true} 
                        showsHorizontalScrollIndicator={false}>
                            {
                                this.showCurrUserPacks()
                            }
                        </ScrollView>
                    </View>
                </View>
                {/* My Packs END */}
                
                {/* Users near you START */}
                <View style={styles.containerSection}>
                    <View style={styles.sectionTextContainer}>
                    <Text style={styles.sectionHeaderText}>
                        Near you
                    </Text>
                    <Text style={styles.headerDescriptionText}>
                        Users near you
                    </Text>
                    </View>
                    <View style={styles.sectionContent}>
                        <ScrollView 
                        horizontal={true}
                        shouldRasterizeIOS={true} 
                        showsHorizontalScrollIndicator={false}>
                            {
                                this.showNearbyUsers()
                            }
                        </ScrollView>
                    </View>
                </View>
                {/* Users near you END */}

                {/* Default Packs START */}
                <View style={styles.containerSection}>
                    <View style={styles.sectionTextContainer}>
                    <Text style={styles.sectionHeaderText}>
                        Default Packs
                    </Text>
                    <Text style={styles.headerDescriptionText}>
                        Default Lupa packs based on your account
                    </Text>
                    </View>

                    <View style={styles.sectionContent}>
                        <ScrollView 
                        contentContainerStyle={styles.justifyContentCenter} 
                        horizontal={true}
                        shouldRasterizeIOS={true} 
                        showsHorizontalScrollIndicator={false}>
                            {
                                this.showDefaultPacks()
                            }
                        </ScrollView>
                    </View>
                    {/* Default Packs end */}

                </View>
                </ScrollView>
                </>
                }

               <CreatePack 
               isOpen={this.state.createPackModalIsOpen} 
               closeModalMethod={this.closeCreatePackModal}
               />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#F2F2F2",
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
    sectionHeaderText: {
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

    },
    appBarTitle: {
        fontFamily: 'ARSMaquettePro-Black',
        fontSize: 20, 
        fontWeight: "600", 
        color: "#212121"
    },
    myPacksScrollView: {
        flexGrow: 2, 
        justifyContent: 'space-between', 
        flexDirection: 'column'
    },
    justifyContentCenter: {
        justifyContent: 'center'
    }
});

export default connect(mapStateToProps)(withNavigation(PackView));