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
    ViewPagerAndroidBase,
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

import InviteFriendsModal from './user/modal/InviteFriendsModal'
import CustomizedInviteFriendsModal from './user/modal/InviteFriendsModal'
import LupaController from '../controller/lupa/LupaController';

import { connect } from 'react-redux';
import { Modalize } from 'react-native-modalize';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import FeaturedProgramCard from './workout/program/components/FeaturedProgramCard';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import {Picker} from '@react-native-community/picker';

import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import CircularUserCard from './user/component/CircularUserCard';
import { MenuIcon } from './icons';

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
            height: new Animated.Value(80),
            customizedInviteFriendsModalIsOpen: false,
        }

        this.searchAttributePickerModalRef = React.createRef()
        this.offset = 0
    }

   async componentDidMount() {
        await this.setupComponent();
    }

    setupComponent = async () => {
        // this.setState({ inviteFriendsIsVisible: true })
        await this.loadFeaturedPrograms();

        let nearYouIn = []
        try {
            await this.LUPA_CONTROLLER_INSTANCE.getUsersBasedOnLocation(this.props.lupa_data.Users.currUserData.location).then(result => {
                nearYouIn = result;
            })
        }
        catch(err) {
        
            nearYouIn = [];
        }

        //set component state
       await this.setState({
           usersNearYou: nearYouIn,
       })
       
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
            <View>
                                <Surface style={{height: 200, width: Dimensions.get('window').width - 100, alignItems: 'center', justifyContent: 'center', borderRadius: 15, elevation: 3, margin: 5}}>
                                    <Image resizeMode="cover" source={item} style={{width: '100%', height: '100%', borderRadius: 15}} />
                                </Surface>
                                <View style={{margin: 15}}>
                                <Text style={{fontWeight: '500', fontSize: 15, color: '#212121'}}>
                                        by Emily Loefstedt
                                    </Text>
                                <Text style={{fontSize: 15,   color: '#212121'}}>
                                    Resistance - Circuit Training
                                </Text>
                                </View>
                                </View>
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
                    <Text style={{  color: '#212121'}}>
                        {this.state.citySearchFilterVal}
                </Text>
                )
            case 1: //state
                return(
                    <Text style={{  color: "#212121"}}>
                    {this.state.stateSearchFilterVal}
                </Text>
                )
            case 2: //body type
                return(
                    <Text style={{  color: "#212121"}}>
                        {this.state.bodyTypeSearchFilterVal}
                </Text>
                )
            case 3: //certification
                return(
                    <Text style={{  color: "#212121"}}>
                        {this.state.certificationSearchFilterVal}
                </Text>
                )
            case 4: //price
                return(
                    <Text style={{  color: "#212121"}}>
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

    onScroll = (event) => {
        var currentOffset = event.nativeEvent.contentOffset.y;
        var direction = currentOffset > this.offset ? this.showFilters() : this.hideFilters();
    this.offset = currentOffset;
    console.log(direction);
    }

    showFilters = () => {
            Animated.timing(this.state.height, {
                toValue: 0,
                duration: 100
            }).start()
    }

    hideFilters = () => {
            Animated.timing(this.state.height, {
                toValue: 80,
                duration: 100
            }).start()
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                
                <Appbar.Header style={{backgroundColor: '#FFFFFF', elevation: 0}}>
                <MenuIcon customStyle={{margin: 10}} onPress={() => this.props.navigation.openDrawer()} />
                </Appbar.Header>

                {
                    this.state.searchValue != "" ?
                    <View style={{flex: 1}}>
           <Searchbar 
       style={{marginVertical: 5, borderRadius: 10, width: Dimensions.get('window').width - 50, alignSelf: 'center'}} 
       placeholder="Search workout programs, fitness professionals" 
       placeholderTextColor="rgb(99, 99, 102)" 
       icon={() => <FeatherIcon name="search" size={20} /> }
       inputStyle={{width: '100%', fontWeight: '300', fontSize: 12, padding: 0, margin: 0, width: '100%'}}
       theme={{
           colors: {
               primary: '#1089ff',
           }
       }}
       onChangeText={text => this._performSearch(text)}
       value={this.state.searchValue}
       />
                        <ScrollView>
                      
                        </ScrollView>
                        <FAB icon="filter-list" color="#FFFFFF" style={{backgroundColor: 'rgba(1,87,155 ,1)', position: 'absolute', bottom: 0, right: 0, margin: 15}} />
                    </View>
                    :
               <View style={{flex: 1}}>
<ScrollView onScroll={event => this.onScroll(event)} contentContainerStyle={{width: Dimensions.get('window').width, justifyContent: 'space-between', flexGrow: 2}}>
<View style={{width: Dimensions.get('window').width}}>
       {/* <Input 

        rightIconContainerStyle={{position: 'absolute', right: 20}} 
        rightIcon={() => <FeatherIcon name="arrow-right" size={15} />} 
        placeholder="Looking for a trainer?" placeholderTextColor="#212121" 
        style={{}} 
        containerStyle={{width: Dimensions.get('screen').width, padding: 0, marginLeft: 10}} 
        inputStyle={{borderColor: 'black', borderBottomWidth: 1.5, borderBottomEndRadius: 0}} 
        value={this.state.searchValue}
        onChangeText={text => this._performSearch(text)}
       />*/}

       <Searchbar 
       style={{marginVertical: 5, marginTop: 15, borderRadius: 10, width: Dimensions.get('window').width - 50, alignSelf: 'center'}} 
       placeholder="Search workout programs, fitness professionals" 
       placeholderTextColor="rgb(99, 99, 102)" 
       icon={() => <FeatherIcon name="search" size={20} /> }
       inputStyle={{width: '100%', fontWeight: '300', fontSize: 12, padding: 0, margin: 0, width: '100%'}}
       theme={{
           colors: {
               primary: '#1089ff',
           }
       }}
       onChangeText={text => this._performSearch(text)}
       value={this.state.searchValue}
       />
        </View>

        <View
                    style={{justifyContent: 'center', justifyContent: 'center', marginVertical: 20 }}>
                    
                    <View style={{padding: 5, width: '80%'}}>
                   {/* <Text style={{fontSize: RFValue(15), fontWeight: '600', paddingVertical: 10, paddingLeft: 10 }}>
                        Curated fitness programs
    </Text> 
    <View style={{marginLeft: 10, width: 30, height: 3, backgroundColor: 'black', borderBottomEndRadius: 0}} /> */}
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

<View style={{justifyContent: 'center', justifyContent: 'center', marginVertical: 20 }}>
                    
                    <View style={{padding: 5, width: '80%'}}>
                    <Text style={{fontSize: RFValue(15), fontWeight: '400', paddingVertical: 10, paddingLeft: 10 }}>
                       Start training with...
                    </Text>
                    <View style={{marginLeft: 10, width: 30, height: 3, backgroundColor: 'black', borderBottomEndRadius: 0}} />
                    </View>

                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            {
                                this.renderNearbyUsers()
                            }
                    </ScrollView>
</View>

<View style={{padding: 20, height: 250, alignItems: 'flex-start', justifyContent: 'space-evenly'}}>
                        <View>
                        <Text style={{fontWeight: '400', paddingLeft: 10,  fontSize: 20, marginVertical: 5}}>
                            Starting and continuing a journey of a lifetime
                        </Text>
                        <Text style={{paddingLeft: 10, fontWeight: '300', fontSize: 15, marginVertical: 5}}>
                            It's important to us that you begin and stick with your fitness journey.  We believe most people continue with their journey with a partner or someone to hold them accountable.
                        </Text>
                        </View>
                        <Button mode="contained" color="#1089ff" style={{marginLeft: 10, width: 'auto', elevation: 6}} theme={{
                            roundness: 3
                        }} onPress={() => this.setState({ customizedInviteFriendsModalIsOpen: true})}>
                            <Text>
                                Invite Friends
                            </Text>
                        </Button>
                    </View>

                    <View
                    style={{justifyContent: 'center', justifyContent: 'center', marginVertical: 10 }}>
                    <View style={{padding: 5}}>
                    <Text style={{fontSize: RFValue(15), fontWeight: '500', paddingVertical: 10, paddingLeft: 10 }}>
                        Top picks
                        </Text>
                        <View style={{marginLeft: 10, width: 30, height: 3, backgroundColor: 'black', borderBottomEndRadius: 0}} />
                    </View>
                    <ScrollView onScroll={(event) => {
                    }} contentContainerStyle={{}} scrollEnabled={this.state.featuredPrograms.length > 1 ? true : false} horizontal bounces={false} pagingEnabled={true} snapToInterval={Dimensions.get('window').width - 50} snapToAlignment={'center'} decelerationRate={0} >
                        {
                            this.state.featuredPrograms.map((currProgram, index, arr) => {
                                return (
                                   <FeaturedProgramCard currProgram={currProgram} programOwnerUUID={currProgram.program_owner.uuid} key={index} />
                                )
                            })
                        }

                    </ScrollView>
                </View>

                        <View style={{justifyContent: 'space-evenly', alignItems: 'flex-start', padding: 20, height: 300, backgroundColor: 'black', marginVertical: 10}}>
                        <View>
                        <Text style={{paddingLeft: 10, color: 'white', fontSize: 20, marginVertical: 5}}>
                            Did you complete any type of exercise today?
                        </Text>
                        <Text style={{color: 'white', paddingLeft: 10, fontWeight: '300', fontSize: 15, marginVertical: 5}}>
                           Every time you complete a physical activity you are one step closer to completing your goals.  Keep track of your progress by logging your workout or checking in for the day.
                        </Text>
                        </View>

                        <Button mode="contained" color="#1089ff" style={{elevation: 8, marginLeft: 20, alignItems: 'center', justifyContent: 'center', width: '30%'}} theme={{
                            roundness: 3
                        }} >
                            <Text>
                                Log it
                            </Text>
                        </Button>
                        </View>
    
                    </ScrollView>
                    </View>
    }
                    
              <InviteFriendsModal showGettingStarted={true} isVisible={this.state.inviteFriendsIsVisible} closeModalMethod={() => this.setState({ inviteFriendsIsVisible: false})} />
                
              <CustomizedInviteFriendsModal showGettingStarted={false} isVisible={this.state.customizedInviteFriendsModalIsOpen} closeModalMethod={() => this.setState({ customizedInviteFriendsModalIsOpen: false})} />
                <Modalize ref={this.searchAttributePickerModalRef} modalHeight={Dimensions.get('window').height / 3}>
                    {this.getPicker(this.state.currSearchFilter)}
                </Modalize>
        
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
});

export default connect(mapStateToProps)(LupaHome);