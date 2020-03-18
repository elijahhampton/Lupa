import React from 'react';

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
    Header,
    Container,
    Left,
    Right,
} from 'native-base';


import {
    SearchBar
} from 'react-native-elements';

import { 
    IconButton,
    Title,
} from 'react-native-paper';
import { withNavigation } from 'react-navigation';

import {
    Feather as FeatherIcon
} from '@expo/vector-icons';

import PackSearchResultCard from './component/PackSearchResultCard';
import DefaultPack, { SmallPackCard } from './component/ExploreCards/PackExploreCard';
import CreatePack from './modal/CreatePack';


import MyPacksCard from './component/PackCards';

import LupaController from '../../controller/lupa/LupaController';

import { connect } from 'react-redux';


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
            communityPacks: [],
            defaultPacks: [],
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
 
     async _prepareSearch() {
         await this.LUPA_CONTROLLER_INSTANCE.indexApplicationData();
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
                         <PackSearchResultCard  title={result.pack_title} isSubscription={result.pack_isSubscription} uuid={result.pack_uuid} />
                     )
                 default:
             }
         })
     }

     _handleOnRefresh = async () => {
         this.setState({ refreshing: true })
         await this._handleOnRefreshPackData();
         this.setState({ refreshing: false })
     }

     _handleOnRefreshPackData = async () => {
         await this.setupExplorePage();
     }
     
     setupExplorePage = async () => {
         let defaultPacksIn, explorePagePacksIn, communityPagePacksIn;
         try {
            await this.LUPA_CONTROLLER_INSTANCE.getActivePacksBasedOnLocation(this.props.lupa_data.Users.currUserData.location).then(result => {
                explorePagePacksIn = result;
            });
         } catch(err)
         {
             explorePagePacksIn = [];
             alert('Error on trying to get explore page packs')
         }

         try {
            await this.LUPA_CONTROLLER_INSTANCE.getCommunityPacksBasedOnLocation(this.props.lupa_data.Users.currUserData.location).then(result => {
                communityPagePacksIn = result;
            });
         } catch(err)
         {
            communityPagePacksIn = [];
             alert('Error on trying to get explore page packs')
         }

         try {
            await this.LUPA_CONTROLLER_INSTANCE.getCurrentUserDefaultPacks().then(result => {
                defaultPacksIn = result;

                if (defaultPacksIn == undefined || typeof(defaultPacksIn) != "object")
                {
                    defaultPacksIn == [];
                }
            });
         } catch(err)
         {
             alert('Error on trying to get user default packs')
         }
 
         //set component state
        await this.setState({
            activePacks: explorePagePacksIn,
            communityPacks: communityPagePacksIn,
            defaultPacks: defaultPacksIn,
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
            return this.props.lupa_data.Packs.currUserPacksData.map(pack => {
                return <MyPacksCard title={pack.pack_title} packImage={pack.pack_image} packUUID={pack.pack_uuid} numMembers={pack.pack_members.length} image={pack.pack_image} />
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

    openCreatePackModal = () => {
        this.setState({ createPackModalIsOpen: true })
    }

    closeCreatePackModal = async () => {
        await this._handleOnRefreshPackData();
        this.setState({ createPackModalIsOpen: false });
    }

    render() {
        return (
            <Container style={styles.root}>
                <Header style={styles.header} transparent={true}>
                    <Left>
                    <IconButton icon="more-vert" size={20} onPress={this._showActionSheet} style={styles.headerItems}/>
                    </Left>

                    <Right>
                <Title style={[styles.headerItems, {fontSize: 25, fontWeight: 600, color: "black"}]}>
                        Packs
                    </Title>
                    </Right>
                </Header>

                {
                    this.state.searchValue != "" ?
                    
         <ScrollView shouldRasterizeIOS={true} shouldRasterizeIOS={true} showsVerticalScrollIndicator={false}refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._handleOnRefresh}/>} >
                        <SearchBar placeholder="Find a pack by name"
                        onChangeText={text => this._performSearch(text)} 
                        platform="ios"
                        searchIcon={<FeatherIcon name="search" />}
                        containerStyle={{backgroundColor: "transparent"}}
                        value={this.state.searchValue}/>
                        
         {
             this.showSearchResults()
         }
     </ScrollView> 

     :

     <ScrollView shouldRasterizeIOS={true} showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow: 2, justifyContent: 'space-between', flexDirection: 'column'}} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._handleOnRefresh}/>}>
                                <SearchBar placeholder="Find a pack by name"
                        onChangeText={text => this._performSearch(text)} 
                        platform="ios"
                        searchIcon={<FeatherIcon name="search" />}
                        containerStyle={{backgroundColor: "transparent"}}
                        value={this.state.searchValue}/>
                        
                {/* My Packs */}
                <View style={styles.containerSection}>
                    <View style={styles.sectionTextContainer}>
                    <Text style={styles.headerText}>
                        My Packs
                    </Text>
                    <Text style={styles.headerDescriptionText}>
                        Packs that you have joined
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

                {/* Near you and other packs */}
                <View style={styles.containerSection}>
                    <View style={styles.sectionTextContainer}>
                    <Text style={styles.headerText}>
                        Near you and other packs
                    </Text>
                    </View>
                    <Text style={styles.headerDescriptionText}>
                        Active Packs
                    </Text>
                    <View style={styles.sectionContent}>
                        <ScrollView horizontal shouldRasterizeIOS={true} showsHorizontalScrollIndicator={false}>
                           {
                               this.mapActivePacks()
                            }
                        </ScrollView>
                    </View>
                </View>

                <View style={styles.containerSection}>
                    <View style={styles.sectionTextContainer}>
                    <Text style={styles.headerDescriptionText}>
                        Community Packs
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
                </ScrollView>
                }

                

               <CreatePack isOpen={this.state.createPackModalIsOpen} closeModalMethod={this.closeCreatePackModal}/>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        padding: 10,
    },
    header: {
        backgroundColor: "#FFFFFF", 
        justifyContent: 'space-between',
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
    },
    headerDescriptionText: {
        fontSize: 20,
        fontWeight: '400',
        padding: 3,
    },
    sectionContent: {

    }
});

export default connect(mapStateToProps)(withNavigation(PackView));