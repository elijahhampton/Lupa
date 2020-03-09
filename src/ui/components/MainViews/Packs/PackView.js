import React from 'react';

import {
    Text,
    View,
    StyleSheet,
    ActionSheetIOS,
    Dimensions,
    ScrollView,
} from 'react-native';

import {
    Header,
    Container,
    Left,
    Right,
} from 'native-base'; //for conversion into an actual header


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

import PackSearchResultCard from '../search/components/PackSearchResultCard';
import DefaultPack, { SmallPackCard } from './Components/ExploreCards/PackExploreCard';
import CreatePack from '../../Modals/CreatePack';


import MyPacksCard from './Components/PackCards';

import LupaController from '../../../../controller/lupa/LupaController';

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
            defaultPacks: [],
            searchValue: "",
            searchResults: [],
            createPackModalIsOpen: false,
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
         await this.setState({
             searchResults: []
         })
 
         await this.setState({
             searchValue: searchQuery
         })
 
         this.LUPA_CONTROLLER_INSTANCE.search(searchQuery).then(searchData => {
             this.setState({ searchResults: searchData })
         })
     }
 
     showSearchResults() {
         return this.state.searchResults.map(result => {
             switch(result.resultType)
             {
                 case "pack":
                     return (
                         <PackSearchResultCard  title={result.pack_title} isSubscription={result.pack_isSubscription} avatarSrc={result.pack_image} uuid={result.pack_uuid} />
                     )
                 default:
             }
         })
     }
     
     setupExplorePage = async () => {
         let defaultPacksIn, explorePagePacksIn;
         try {
            await this.LUPA_CONTROLLER_INSTANCE.getExplorePagePacksBasedOnLocation(this.props.lupa_data.Users.currUserData.location).then(result => {
                explorePagePacksIn = result;

                if (explorePagePacksIn == undefined || typeof(explorePagePacksIn) != "object")
                {
                    explorePagePacksIn = [];
                }
            });   
         } catch(err)
         {
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
            explorePagePacks: explorePagePacksIn,
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
            return this.state.currUserPacks.map(pack => {
              return (
                  <MyPacksCard title={pack.pack_title} packUUID={pack.id} numMembers={pack.pack_members.length} image={pack.pack_image} />
              )
          })
      }

      mapGlobalPacks = () => {
        return this.state.explorePagePacks.map(globalPacks => {
             return (
                 <SmallPackCard packUUID={globalPacks.id} image={globalPacks.pack_image} />
             )
         })
     }

     mapDefaultPacks = () => {
        return this.state.defaultPacks.map(pack => {
            return (
                <DefaultPack packUUID={pack.id} pack_title={pack.pack_title}/>
            )
        })
     }

     mapActivePacks = () => {

     }

     mapCommunityPacks = () => {

     }

    openCreatePackModal = () => {
        this.setState({ createPackModalIsOpen: true })
    }

    closeCreatePackModal = () => {
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
                    
         <ScrollView shouldRasterizeIOS={true} showsVerticalScrollIndicator={false}>
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

     <ScrollView shouldRasterizeIOS={true} showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow: 2, justifyContent: 'space-between', flexDirection: 'column'}}>
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
                           <SmallPackCard />
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
                           <SmallPackCard />
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