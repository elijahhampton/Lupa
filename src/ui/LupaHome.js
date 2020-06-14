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
    TouchableOpacity,
    Image,
    Text,
    Modal,
    Dimensions,
    SafeAreaView,
    Button as NativeButton,
    Animated,
    ImageBackground,
    TouchableHighlight,
    StatusBar,
} from 'react-native';

import {
    Surface,
    DataTable,
    Button,
    IconButton,
    FAB,
    Chip,
    Paragraph,
    Card,
    Banner,
    Caption,
    Badge,
    Appbar,
    Divider,
    Avatar,
    Menu,

} from 'react-native-paper';

import {
    Left
} from 'native-base';

import InviteFriendsModal from './user/modal/InviteFriendsModal'

import { Icon, SearchBar } from 'react-native-elements';

import { withNavigation } from 'react-navigation'

import LupaController from '../controller/lupa/LupaController';

import { connect } from 'react-redux';
import { Modalize } from 'react-native-modalize';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import FeaturedProgramCard from './workout/program/components/FeaturedProgramCard';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {Picker} from '@react-native-community/picker';

const CreateProgramImage = require('./images/programs/sample_photo_three.jpg')
const SamplePhotoOne = require('./images/programs/sample_photo_one.jpg')
const SamplePhotoTwo = require('./images/programs/sample_photo_two.jpg')
const SamplePhotoThree = require('./images/programs/sample_photo_three.jpg')

const CITIES = [
    "",
    "Auburn",
]

const STATES = [
    "",
   "Alabama",
]

const BODY_TYPES = [
    "",
    "Body Type",
    "Body Type",
    "Body Type",
]

const PRICES_RANGES = [
 "$0 - $7",
 "$7 - $15",
 "$15 - $25"
]

const CERTIFICATIONS = [
    "",
    "NASM"
]


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
            currCardIndex: 0,
            cardData: [1,2,3,4,5,6],
            data: [ 
                {text: 'City', icon: 'activity', chipID: 0}, 
                {text: 'State', icon: 'anchor', chipID: 1}, 
                {text: 'Body Type', icon: 'map-pin', chipID: 2},
                {text: 'Certification', icon: 'map-pin', chipID: 3},
                {text: 'Price', icon: 'map-pin', chipID: 4}
            ],
            samplePhotoData: [
                SamplePhotoOne,
                SamplePhotoTwo,
                SamplePhotoThree
            ],
            searchValue: "",
            searching: false,
            featuredPrograms: [],
            programModalVisible: false,
            inviteFriendsIsVisible: false,
            currSearchFilter: "",
            stateSearchFilterVal: "State",
            citySearchFilterVal: "City",
            certificationSearchFilterVal: "Certification",
            bodyTypeSearchFilterVal: "Body Type",
            priceSearchFilterVal: "Price",
        }

        this.searchAttributePickerModalRef = React.createRef()

    }

   async componentDidMount() {
       // this.setState({ inviteFriendsIsVisible: true })
        await this.loadFeaturedPrograms();
    }

    componentWillUnmount() {
    
    }

    loadFeaturedPrograms = async () => {
        let featuredProgramsIn = []

        try {
            await this.LUPA_CONTROLLER_INSTANCE.getFeaturedPrograms().then(result => {
                featuredProgramsIn = result;
            });
    
        } catch(error) {
            featuredProgramsIn = []
        } 

        await this.setState({
            featuredPrograms: featuredProgramsIn,
        })
    }

    closeTrainerInsightsModalMethod = () => {
        this.setState({ trainerInsightsVisible: false })
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
            })*/
   
            await this.setState({ searchResults: searchResultsIn, searching: false });
   
            await this.setState({ searchResults: [], searching :false });
        }

    _renderItem = ({item, index}) => {
        return (
            <>
                                <Surface style={{height: '80%', width: Dimensions.get('window').width - 100, alignItems: 'center', justifyContent: 'center', borderRadius: 15, elevation: 3, margin: 5}}>
                                    <Image resizeMode="cover" source={item} style={{width: '100%', height: '100%', borderRadius: 15}} />
                                    <Text style={{fontFamily: 'ARSMaquettePro-Black', position: 'absolute', alignSelf: 'center', fontWeight: 'bold', fontSize: 35, color: 'white'}}>
                                        Coming Soon
                                    </Text>
                                    <Chip style={{position: 'absolute', top: 0, right: 0, margin: 5, backgroundColor: '#1089ff'}}>
                                        Lupa
                                    </Chip>
                                </Surface>

                                <Text style={{alignSelf: 'center', fontSize: 15, fontFamily: 'HelveticaNeueMedium', color: '#212121'}}>
                                    Aura Program
                                </Text>
                                </>
        );
    }


    handleFilerOnPress = async (chipID) => {
        await this.setState({ currSearchFilter: chipID})
        this.searchAttributePickerModalRef.current.open()
    }

    getChipText(chipID)
    {
        switch(chipID)
        {
            case 0: //city
                return(
                    <Text style={{fontFamily: 'HelveticaNeueMedium', color: '#212121'}}>
                        {this.state.citySearchFilterVal}
                </Text>
                )
            case 1: //state
                return(
                    <Text style={{fontFamily: 'HelveticaNeueMedium', color: "#212121"}}>
                    {this.state.stateSearchFilterVal}
                </Text>
                )
            case 2: //body type
                return(
                    <Text style={{fontFamily: 'HelveticaNeueMedium', color: "#212121"}}>
                        {this.state.bodyTypeSearchFilterVal}
                </Text>
                )
            case 3: //certification
                return(
                    <Text style={{fontFamily: 'HelveticaNeueMedium', color: "#212121"}}>
                        {this.state.certificationSearchFilterVal}
                </Text>
                )
            case 4: //price
                return(
                    <Text style={{fontFamily: 'HelveticaNeueMedium', color: "#212121"}}>
                        {this.state.priceSearchFilterVal}
                </Text>
                )
            default:
        }
    }

    getPicker = (currSearchFilter) => {
        switch(currSearchFilter) {
            case 0:
                return (
                    <Picker
                    style={{flex: 1}}
                    selectedValue={this.state.citySearchFilterVal}
                    onValueChange={(itemValue, itemIndex) => {
                        this.setState({ citySearchFilterVal: itemValue})
                    }}>
                        {
                            this.getPickerValues(this.state.currSearchFilter).map(val => {
                                return <Picker.Item label={val} value={val} key={val} />
                            })
                        }
                  </Picker>
                )
            case 1:
                return (
                    <Picker
                    style={{flex: 1}}
                    selectedValue={this.state.stateSearchFilterVal}
                    onValueChange={(itemValue, itemIndex) => {
                        this.setState({ stateSearchFilterVal: itemValue})
                    }}>
                        {
                            this.getPickerValues(this.state.currSearchFilter).map(val => {
                                return <Picker.Item label={val} value={val} key={val}/>
                            })
                        }
                  </Picker>
                )
                case 2:
                    return (
                        <Picker
                        style={{flex: 1}}
                        selectedValue={this.state.bodyTypeSearchFilterVal}
                        onValueChange={(itemValue, itemIndex) => {
                            this.setState({ bodyTypeSearchFilterVal: itemValue})
                        }}>
                            {
                                this.getPickerValues(this.state.currSearchFilter).map(val => {
                                    return <Picker.Item label={val} value={val} key={val}/>
                                })
                            }
                      </Picker>
                    )
                    case 3:
                        return (
                            <Picker
                            style={{flex: 1}}
                            selectedValue={this.state.certificationSearchFilterVal}
                            onValueChange={(itemValue, itemIndex) => {
                                this.setState({ certificationSearchFilterVal: itemValue})
                            }}>
                                {
                                    this.getPickerValues(this.state.currSearchFilter).map(val => {
                                        return <Picker.Item label={val} value={val} key={val}/>
                                    })
                                }
                          </Picker>
                        )
                        case 4:
                            return (
                                <Picker
                                style={{flex: 1}}
                                selectedValue={this.state.priceSearchFilterVal}
                                onValueChange={(itemValue, itemIndex) => {
                                    this.setState({ priceSearchFilterVal: itemValue})
                                }}>
                                    {
                                        this.getPickerValues(this.state.currSearchFilter).map(val => {
                                            return <Picker.Item label={val} value={val} key={val}/>
                                        })
                                    }
                              </Picker>
                            )
        }
    }

    getPickerValues = (currSearchFilter) => {
        switch(currSearchFilter)
        {
            case 0:
                return CITIES
            case 1:
                return STATES
            case 2:
                return BODY_TYPES
            case 3:
                return CERTIFICATIONS
            case 4:
                return PRICES_RANGES
            default:
                return []
        }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                <Appbar.Header style={{ backgroundColor: '#FFFFFF', elevation: 2}}>
                <SearchBar placeholder="Search trainers"
                        onChangeText={text => this._performSearch(text)} 
                        platform="ios"
                        searchIcon={<FeatherIcon name="search" />}
                        containerStyle={{backgroundColor: "transparent"}}
                        value={this.state.searchValue}/>
                </Appbar.Header>

                <Surface style={{height: 80, marginTop: 1, elevation: 2}}>
                    
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width}} onMoveShouldSetResponder={evt => {
                        this.props.disableSwipe();
                        return true;
                    }}
                    onTouchEnd={() => this.props.enableSwipe()}>
                    <FeatherIcon name="sliders" size={15} style={{margin: 6}} />
                    <ScrollView bounces={false} horizontal={true} contentContainerStyle={{alignItems: 'center', justifyContent: 'center',}}>
                        {
                            this.state.data.map((currVal, index, arr) => {
                                // off blue - rgba(30,136,229 ,0.3)
                                // deep - rgba(41,98,255 ,1)
                                return (
                                        <Chip 
                                        onPress={() => this.handleFilerOnPress(currVal.chipID)} 
                                        mode="outlined"  
                                        icon={() => <FeatherIcon size={15}  name="chevron-down" color="#212121" />} 
                                        style={{backgroundColor: 'transparent', elevation: 0, margin: 5, marginVertical: 10, width: 'auto', borderRadius: 12}}>
                                            {
                                                this.getChipText(currVal.chipID) 
                                            }
                                        </Chip> 
                               )
                            })
                        }
                    </ScrollView>
                    </View>
                </Surface>

                {
                    this.state.searchValue != "" ?
                    <View style={{flex: 4}}>
                        <ScrollView>

                        </ScrollView>
                    </View>
                    :
<ScrollView contentContainerStyle={{justifyContent: 'space-between', flexGrow: 2,}}>
                <View style={{flex: 4}}>
                <View
                    style={{flex: 0.6, justifyContent: 'center', justifyContent: 'center' }}
                    onMoveShouldSetResponder={evt => {
                        this.props.disableSwipe();
                        return true;
                    }}
                    onTouchEnd={() => this.props.enableSwipe()}>
                    
                    <View style={{padding: 5}}>
                    <Text style={{ fontFamily: 'ARSMaquettePro-Medium', fontSize: RFPercentage(2.5) }}>
                        Curated By Lupa
                    </Text>
                    <Text style={{color: 'rgba(58, 58, 60, 0.9)', fontFamily: 'HelveticaNeueLight', fontSize: RFPercentage(1.8), }}>
                        Free Workouts and programs curated by Lupa
                    </Text>
                    </View>


                    <Carousel 
                        data={this.state.samplePhotoData}
                        itemWidth={Dimensions.get('window').width - 100}
                        sliderWidth={Dimensions.get('window').width}
                        scrollEnabled={true}
                        firstItem={1}
                        renderItem={this._renderItem}
                        pagingEnabled={false}
                        contentContainerCustomStyle={{alignItems: 'center', justifyContent: 'center'}}
                        />

                        </View>

                


                <View
                    style={{ flex: 0.7, justifyContent: 'center', justifyContent: 'center' }}
                    onMoveShouldSetResponder={evt => {
                        this.props.disableSwipe();
                        return true;
                    }}
                    onTouchEnd={() => this.props.enableSwipe()}>
                    <View style={{padding: 5}}>
                    <Text style={{ fontFamily: 'ARSMaquettePro-Medium', fontSize: RFPercentage(2.5) }}>
                        Start now
                    </Text>
                    <Text style={{ color: 'rgba(58, 58, 60, 0.9)', fontFamily: 'HelveticaNeueLight', fontSize: RFPercentage(1.8), }}>
                        Top picks of programs based on your account
                    </Text>
                    </View>
                    <ScrollView onScroll={(event) => {
                    }} contentContainerStyle={{}} scrollEnabled={this.state.featuredPrograms.length > 1 ? true : false} horizontal bounces={false} pagingEnabled={true} snapToInterval={Dimensions.get('window').width - 50} snapToAlignment={'center'} decelerationRate={0} >
                        {
                            this.state.featuredPrograms.map((currProgram, index, arr) => {
                                return (
                                   <FeaturedProgramCard currProgram={currProgram} key={index} />
                                )
                            })
                        }

                    </ScrollView>
                </View>
                </View>

            
                
                    <View style={{width: Dimensions.get('window').width, flex: 0.5}}>
                    <View style={{flex: 1, width: Dimensions.get('window').width, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Button mode="contained" color="#23374d" onPress={() => this.props.navigation.navigate('Programs')} style={{width: Dimensions.get('window').width - 100, borderRadius: 10}}>
                        <Text style={{fontFamily: 'HelveticaNeueMedium', fontSize: 15, padding: 0, margin: 0, color: '#FFFFFF'}}>
                            Explore More
                        </Text>
                    </Button>
                    </View>
                    </View>  
                    </ScrollView>
                    }
                    
                <InviteFriendsModal showGettingStarted={true} isVisible={this.state.inviteFriendsIsVisible} closeModalMethod={() => this.setState({ inviteFriendsIsVisible: false})} />
                
                <Modalize ref={this.searchAttributePickerModalRef} modalHeight={Dimensions.get('window').height / 3}>
                    {this.getPicker(this.state.currSearchFilter)}
        </Modalize>
                
                <SafeAreaView />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#212121",
    },
    mainGraphicText: {
        fontFamily: 'ARSMaquettePro-Bold',
        color: '#FFFFFF',
        fontSize: 25,
        alignSelf: 'flex-start'
    },
    subGraphicText: {
        fontFamily: 'ARSMaquettePro-Medium',
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
        fontFamily: 'ARSMaquettePro-Regular'
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
});

export default connect(mapStateToProps)(withNavigation(LupaHome));