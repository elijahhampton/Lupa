import React, { useEffect, useState } from 'react';

import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    ImageBackground,
    Animated,
    Image,
    Button as NativeButton,
    ScrollView,
    Modal,
    RefreshControl,
} from 'react-native';

import {
    Appbar,
    Title,
    Button,
    TextInput,
    Surface,
    Avatar as PaperAvatar,
    Paragraph,
    Snackbar,
    Chip,
    Modal as PaperModal,
    Dialog,
    Portal,
    Provider,
    Card,
    FAB,
    Caption,
    Searchbar,
} from 'react-native-paper';

import {
    Header,
    Tab,
    Tabs,
    ScrollableTab,
} from 'native-base';

import { withNavigation } from 'react-navigation';

import { connect } from 'react-redux'

import FeatherIcon from 'react-native-vector-icons/Feather'

import Carousel from 'react-native-snap-carousel';
import { SearchBar, Divider } from 'react-native-elements';

import ProgramListComponent from '../component/ProgramListComponent';
import RBSheet from "react-native-raw-bottom-sheet";
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import ProgramsFilter from './components/ProgramsFilter';

import { Button as ElementsButton } from 'react-native-elements';
import UserSearchResult from '../../user/profile/component/UserSearchResult'
import LupaController from '../../../controller/lupa/LupaController'
import { getCurrentStoreState } from '../../../controller/redux';
import TrainerInsights from '../../user/trainer/TrainerInsights';
import ProgramSearchResultCard from './components/ProgramSearchResultCard';

const SamplePhotoOne = require('../../images/programs/sample_photo_one.jpg')
const SamplePhotoTwo = require('../../images/programs/sample_photo_two.jpg')
const SamplePhotoThree = require('../../images/programs/sample_photo_three.jpg')

const list = [
    {
      name: 'Based on Interest',
      subtitle: '0 Selected',
      icon: <MaterialIcon name="label" size={20} color="#FFFFFF"/>
    },
    {
      name: 'Based on Workout Type',
      subtitle: '0 Selected',
      icon: <MaterialIcon name="fitness-center" size={20} color="#FFFFFF" />
    },
  ]

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

const mapDispatchToProps = (dispatchEvent) => {
    return {
        deleteProgram: (programUUID) => {
            dispatchEvent({
                type: "DELETE_CURRENT_USER_PROGRAM",
                payload: programUUID
            })
        },
    }
}

class ShareProgramModal extends React.Component{
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            followingUserObjects: [],
            selectedUsers: [],

        }
    }

    componentDidMount = async () => {
        let results = [];
        await this.LUPA_CONTROLLER_INSTANCE.getUserInformationFromArray(this.props.following).then(objs => {
            results = objs;
        })

        this.setState({ 
            followingUserObjects: results,
        })
    }

    handleAddToFollowList = (userObject) => {
        const updatedList = this.state.selectedUsers;
        var found = false;
        for(let i = 0; i < this.state.selectedUsers.length; i++)
        {
            if (this.state.selectedUsers[i] == userObject.user_uuid)
            {

              updatedList.splice(i, 1);
              found = true;
              break;
            }
        }

        if (found == false)
        {
            
            updatedList.push(userObject.user_uuid);
        }

        console.log(updatedList.length)

        this.setState({
            selectedUsers: updatedList,
        })


    }

    waitListIncludesUser = (userObject) => {
        for(let i = 0; i < this.state.selectedUsers.length; i++)
        {
            if (this.state.selectedUsers[i] == userObject.user_uuid)
            {
                return true;
            }
        }

        return false;
    }

    mapFollowing = () => {
        return this.state.followingUserObjects.map(user => {
            return (
                <View key={user.user_uuid} style={{backgroundColor: this.waitListIncludesUser(user) ? '#E0E0E0' : 'transparent'}}>
                    <UserSearchResult 
                        avatarSrc={user.photo_url} 
                        displayName={user.display_name} 
                        username={user.username} 
                        isTrainer={user.isTrainer}
                        hasButton={true}
                        buttonTitle="Invite"
                        buttonOnPress={() => this.handleAddToFollowList(user)}
                        />
                </View>
            );
        })
    }

    handleCancel = () => {
        this.props.closeModalMethod();
    }

    handleApply = () => {
        try {
            this.LUPA_CONTROLLER_INSTANCE.handleSendUserProgram(this.props.currUserData.user_uuid, this.props.currUserData, this.props.currUserData.display_name, this.state.selectedUsers, this.props.program);
            this.props.closeModalMethod();
        } catch(err) {
            
        }
    }

    render() {
        return (
                <PaperModal contentContainerStyle={{width: Dimensions.get('window').width, height: Dimensions.get('window').height, backgroundColor: '#F2F2F2'}} visible={this.props.isVisible}>
                                   <Appbar.Header style={{elevation: 0}} theme={{
                    colors: {
                        primary: '#F2F2F2'
                    }
                }}>
                    <Appbar.BackAction onPress={this.props.closeModalMethod} />
                    <Appbar.Content title="Share Program" />
                </Appbar.Header>

                <View style={{flex: 1, backgroundColor: '#F2F2F2'}}>
                <ProgramSearchResultCard programData={this.props.program} />
                              <Divider />
                    <ScrollView shouldRasterizeIOS={true} contentContainerStyle={{backgroundColor: '#F2F2F2'}}>
                    {
                        this.mapFollowing()
                    }
                </ScrollView>
                <SafeAreaView />
                    </View>

                    <FAB  color="#FFFFFF" style={{position: 'absolute', bottom: 0, right: 0, margin: 16, backgroundColor: '#2196F3'}} icon="done" onPress={this.handleApply} />
            </PaperModal>
        )
    }
}

connect(mapStateToProps)(ShareProgramModal);

class Programs extends React.Component {
    constructor(props) {
        super(props);

        this.props.disableSwipe();

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            open: false, 
            showLiveWorkout: false,
            lupaProgramsHeight: 0,
            samplePhotoData: [
                SamplePhotoOne,
                SamplePhotoTwo,
                SamplePhotoThree
            ],
            checked: false,
            filterHeight: new Animated.Value(0),
            showInviteModal: false,
            waitListData: ['','','',''],
            allSpotsFilled: false,
            showMyProgramSheet: false,
            pageIsPrograms: true,
            showShareProgramModal: false,
            currProgramClicked: {},
            refreshing: false,
            currUserPrograms: this.props.lupa_data.Programs.currUserProgramsData,
            searchResults: [],
            searchValue: "",
            featuredPrograms: [],
            trainerInsightsVisible: false,
            featuredIsRefreshing: false,
        }

      this.RBSheet = React.createRef();

    }

    async componentDidMount() {
        await this.props.disableSwipe();
      await this.loadFeaturedPrograms();
    }

    componentWillUnmount() {
        this.props.enableSwipe();
    }

    handleOnRefresh = async () => {
        this.setState({ refreshing: true })
        await this.loadFeaturedPrograms()
        this.setState({ refreshing: false })
    }

    loadFeaturedPrograms = async () => {
        let featuredProgramsIn;

        await this.LUPA_CONTROLLER_INSTANCE.getFeaturedPrograms().then(result => {
            featuredProgramsIn = result;
        });

        await this.setState({
            featuredPrograms: featuredProgramsIn,
        })
    }

    closeTrainerInsights = () => {
        this.setState({ trainerInsightsVisible: false })
    }

    openTrainerInsights = () => {
        this.setState({
            trainerInsightsVisible: true 
        })
    }

    showInviteModal = () => {
        this.setState({
            showInviteModal: true,
            pageIsPrograms: false,
        })
    }

    handleInviteWaitlist = () => {
        //invite users


        //clear waitlist
        this.setState({
            waitListData: ['', '', '', ''],
            pageIsPrograms: true,
        })
    }

    closeInviteModal = (list, action) => {
        if (action == 'APPLY')
        {
            this.setState({
                waitListData: list,
            })
        }

        if (list.length == 4)
        {
            this.setState({
                allSpotsFilled: true
            })
        }

        this.setState({
            showInviteModal: false,
            pageIsPrograms: true
        })
    }


    showFilter = () => {
        this.setState({ pageIsPrograms: false })
        Animated.timing(this.state.filterHeight, {
            toValue: Dimensions.get('window').height,
            duration: 500
        }).start();
    }

    closeFilter = () => {
        this.setState({ pageIsPrograms: true  })
        Animated.timing(this.state.filterHeight, {
            toValue: 0,
            duration: 500
        }).start();
    }

    handleCancelButtonOnPress = () => {
        this.closeFilter()
    }

    handleApplyFilterOnPress = () => {
        this.setState({ pageIsPrograms: true })

        //apply filters

        this.closeFilter()
    }

    //move inside of program component
    handleShowLiveWorkout = async (program) => {
        await this.setState({ showLiveWorkout: true })
    }

    //move inside of program component
    handleCloseLiveWorkout = () => {
         this.setState({ showLiveWorkout: false })
    }

    _onStateChange = ({ open }) => this.setState({ open: !this.state.open });

    /**
     * Deletes a user's program from their list and performs a store update
     */
    deleteUserProgram = async (programUUID, userUUID) => {
        //delete from database
        await this.LUPA_CONTROLLER_INSTANCE.deleteUserProgram(programUUID, userUUID);

        //delete from redux store
        await this.props.deleteProgram(programUUID);

        //update store
        this.handleOnRefresh();
    }

    _renderItem = ({item, index}) => {
        return (
            <View style={{flex: 1}}>
                                <Surface style={{alignItems: 'center', justifyContent: 'center', borderRadius: 15, elevation: 8, margin: 5, flex: 1}}>
                                    <Image resizeMode="cover" source={item} style={{width: '100%', height: '100%', borderRadius: 15}} />
                                    <Text style={{fontFamily: 'ARSMaquettePro-Black', position: 'absolute', alignSelf: 'center', fontWeight: 'bold', fontSize: 35, color: 'white'}}>
                                        Coming Soon
                                    </Text>
                                    <Chip style={{position: 'absolute', top: 0, right: 0, margin: 14, backgroundColor: '#2196F3'}}>
                                        Curated By Lupa
                                    </Chip>
                                </Surface>

                                <Text style={{alignSelf: 'center', fontFamily: 'ARSMaquettePro-Black', color: 'white'}}>
                                    Aura Program
                                </Text>

                              {/*  <View style={{marginTop: 50, alignSelf: 'center', width: '60%', height: 'auto', alignItems: 'center', justifyContent: 'center'}}>
                                <FAB
    style={{position: 'absolute', alignSelf: 'flex-start', backgroundColor: "#FFFFFF"}}
    small
    icon={() => <FeatherIcon name="activity" size={25} />}
    onPress={() => console.log('Pressed')}
    color="#F2F2F2"
  />

<FAB
    style={{position: 'absolute', alignSelf: 'flex-end', backgroundColor: "#212121"}}
    small
    icon="share"
    onPress={() => console.log('Pressed')}
  />
        </View>*/}
                                </View>
        );
    }

    getRBSheet = () => {
        return (
            <RBSheet
            ref={this.RBSheet}
            height={200}
            closeOnDragDown={true}
            closeOnPressMask={false}
            openDuration={150}
            customStyles={{
            wrapper: {
                backgroundColor: 'transparent',
            },
              container: {
                borderTopRightRadius: 35,
                borderTopLeftRadius: 35,
              },
              draggableIcon: {
                  backgroundColor: 'rgb(209, 209, 214)'
              }
            }}
         >
             <SafeAreaView style={{flex: 1, padding: 15}}>
             <TouchableOpacity containerStyle={{height: 'auto', width: Dimensions.get('window').width,}} style={{ flexDirection: 'row', alignItems: 'center',}} onPress={this.handleLaunchProgram}>
                    <View style={{margin: 15, width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'center'}}>
                        <FeatherIcon name="activity" size={20} style={{margin: 5}} color="#212121" />
                        <Text style={{fontSize: 18, fontWeight: '300'}}>
                            Launch Program
                        </Text>
                    </View>
                    </TouchableOpacity>
                    <Divider />
                    {
                        this.userOwnsProgram() ?
                        <>
                        <TouchableOpacity containerStyle={{height: 'auto', width: Dimensions.get('window').width,}} style={{ flexDirection: 'row', alignItems: 'center',}} onPress={this.handleShareWithFriend}>
                        <View style={{margin: 15, width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'center'}}>
                            <FeatherIcon name="share" size={20} style={{margin: 5}} color="#212121" />
                            <Text style={{fontSize: 18, fontWeight: '300'}}>
                                Share program
                            </Text>
                        </View>
                        </TouchableOpacity>
                        <Divider />
                        </>
                        :
                        null
                    }
             </SafeAreaView>    
             </RBSheet>
        )
    }

    handleProgramOnPress = async (program) => {
        await this.setState({
            currProgramClicked: program
        })
        this.RBSheet.current.open();
    }

    handleOnRefresh = async () => {
        await this.setState({ refreshing: true })
        await this.setState({
            currUserPrograms: getCurrentStoreState().Programs.currUserProgramsData
        })
        await this.setState({
            refreshing: false
        })
    }

    handleLaunchProgram = () => {
        this.RBSheet.current.close()
        this.props.navigation.push('LiveWorkout', {
            programData: this.state.currProgramClicked,
            programOwnerData: undefined
        })
    }
 
    mapPrograms = () => {
        if (this.state.currUserPrograms.length != undefined)
        {
            if (this.state.currUserPrograms.length > 0)
            {
                return (
                    <ScrollView contentContainerStyle={{alignItems: 'center', backgroundColor: '#F2F2F2'}}>
                        {
                              this.state.currUserPrograms.map(program => {
                                  if (typeof(program) == 'undefined')
                                  {
                                      return;
                                  }
                                    return (
                                        /* <View>
                                                                             <TouchableOpacity onPress={() => this.handleProgramOnPress(program)}>
                                         <View style={{}}>
                                         <Surface style={{elevation: 0, width: Dimensions.get('screen').width - 20, height: 120, borderRadius: 16, margin: 5}}>
                                               
                                       <ImageBackground 
                                        imageStyle={{borderRadius: 16}} 
                                        style={{alignItems: 'flex-start', justifyContent: 'center', width: '100%', height: '100%', borderRadius:16 }} 
                                        source={{uri: program.program_image}}>
                                        </ImageBackground>
                                     </Surface>
                                     </View>
                                     </TouchableOpacity>
                                      <View style={{width: '95%', paddingLeft: 10, alignItems: 'flex-start', justifyContent: 'center' }}>
                                      <Text style={{color: '#000000', fontSize: 20,fontFamily: 'ARSMaquettePro-Medium' }}>
                                           {program.program_name}
                                           </Text>
                                           <Text  numberOfLines={3} style={{ color: '#00000', fontSize: 12, fontFamily: 'ARSMaquettePro-Regular'}}>
                                          {program.program_description}
                                           </Text>
                                           
                                      </View>
                                        </View>*/
     
                                        <Card style={{width: '92%', marginVertical: 10}} onPress={() => this.handleProgramOnPress(program)}>
         <Card.Cover source={{ uri: program.program_image }} />
         <Card.Actions style={{width: '100%', justifyContent: 'space-between', padding: 10}}>
             
             <Text style={{fontFamily: 'ARSMaquettePro-Regular', fontSize: 15}}>
                 {program.program_name}
             </Text>
             <View style={{flexDirection: 'row'}}>
             <Button color="rgb(13,71,161)" >Edit </Button>
           <Button color="rgb(229,57,53)" onPress={() => this.deleteUserProgram(program.program_structure_uuid, this.props.lupa_data.Users.currUserData.user_uuid)}>Delete</Button>
             </View>
         </Card.Actions>
       </Card>
                                     )
                            })
                        }     
                    </ScrollView>
                )
            }
            else
            {
                if (this.props.lupa_data.Users.currUserData.isTrainer)
                {
                    return (
                        <View style={{flex: 1, backgroundColor: 'transparent',  justifyContent: 'center'}}>
                        <View style={{padding: 5, alignSelf: 'center', width: '80%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{fontWeight: '300', textAlign: 'left'}}>
                           Don't wait any longer- create programs for users looking for a trainer
                        </Text>
    
                        </View>
        
                        <ElementsButton type="solid" title="Create a Workout Program" buttonStyle={{backgroundColor: '#2196F3', borderRadius: 12}} style={{alignSelf: 'center', width: '90%'}} onPress={() => this.props.navigation.navigate('CreateProgram', {
                            navFrom: 'Programs',
                            setPageIsPrograms: this.setPageIsPrograms.bind(this),
                            setPageIsNotPrograms: this.setPageIsNotPrograms.bind(this)
                        })}/>
                </View>
                    )
                }  
                else
                {
                    return (
                        <View style={{flex: 1, backgroundColor: 'transparent',  justifyContent: 'center'}}>
                        <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{padding: 10,fontFamily: 'ARSMaquettePro-Regular', fontSize: 15}}>
                           How will you get started?
                        </Text>

                        <Text style={{padding: 10 }}>
                            Find a Lupa trainer 
                        </Text>
                        </View>
        
        
                        <ElementsButton type="solid" title="Find a trainer" buttonStyle={{backgroundColor: '#', borderRadius: 12}} style={{alignSelf: 'center', width: '90%'}} />
                </View>
                    )
                }
            }
        }
        else
        {
            return (
                <View style={{flex: 1, backgroundColor: 'transparent',}}>
                <Text>
                    How will you get started?
                </Text>

                <ElementsButton type="solid" title="Find a trainer" style={{width: '100%'}} />
        </View>
            )
        }
    }

    mapWaitlist = () => {
            if (this.props.lupa_data.Users.currUserData.length != undefined)
            {
                if (this.props.lupa_data.Users.currUserData.length > 0)
                {
                    return (
                        <ScrollView contentContainerStyle={{}}>
                            {
                                  this.props.lupa_data.Users.currUserData.waitlistedPrograms.map(program => {
                                    return (
                                    <Text> Program </Text>
                                    )
                                })
                            }     
                        </ScrollView>
                    )
                }
                else
                {
                    if (this.props.lupa_data.Users.currUserData.isTrainer)
                    {
                        return (
                            <View style={{flex: 1, backgroundColor: '#F2F2F2',  justifyContent: 'center'}}>
                            <View style={{padding: 5, alignSelf: 'center', width: '80%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{fontWeight: '300', textAlign: 'left'}}>
                               Explore programs that have a waitlist
                            </Text>
        
                            </View>
            
                            <ElementsButton type="solid" title="Explore waitlisted programs" buttonStyle={{backgroundColor: '#2196F3', borderRadius: 12}} style={{alignSelf: 'center', width: '90%'}} />
                    </View>
                        )
                    }  
                    else
                    {
                        return (
                            <View style={{flex: 1, backgroundColor: '#F2F2F2',  justifyContent: 'center'}}>
                            <View style={{padding: 5, alignSelf: 'center', width: '80%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{fontWeight: '300', textAlign: 'left'}}>
                               Explore programs that have a waitlist
                            </Text>
        
                            </View>
            
                            <ElementsButton type="solid" title="Explore waitlisted programs" buttonStyle={{backgroundColor: '#2196F3', borderRadius: 12}} style={{alignSelf: 'center', width: '90%'}} />
                    </View>
                        )
                    }
                }
            }
            else
            {
                return (
                    <View style={{flex: 1, backgroundColor: '#F2F2F2',  justifyContent: 'center'}}>
                    <View style={{padding: 5, alignSelf: 'center', width: '80%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontWeight: '300', textAlign: 'left'}}>
                       Explore programs that have a waitlist
                    </Text>

                    </View>
    
                    <ElementsButton type="solid" title="Explore waitlisted programs" buttonStyle={{backgroundColor: '#2196F3', borderRadius: 12}} style={{alignSelf: 'center', width: '90%'}} />
            </View>
                )
            }
    }

    handleShareWithFriend = async () => {
        this.RBSheet.current.close();
        this.setState({
            showShareProgramModal: true,
            pageIsPrograms: false,
        })
    }

    closeShareProgramModal = () => {
        this.setState({
            showShareProgramModal: false,
            pageIsPrograms: true,
        })
    }

    setPageIsPrograms = () => {
        this.setState({ pageIsPrograms: true })
    }

    setPageIsNotPrograms = () => {
        this.setState({ pageIsPrograms: false })
    }

    navigateToCreateProgram = () => {
        this.setState({ pageIsPrograms: false })
        this.props.navigation.navigate('CreateProgram', {
            setPageIsPrograms: this.setPageIsPrograms.bind(this),
            setPageIsNotPrograms: this.setPageIsNotPrograms.bind(this),
            navFrom: "Programs",
        })
    }

    userOwnsProgram = () => {
        if (this.props.lupa_data.Users.currUserData.user_uuid == this.state.currProgramClicked.program_owner)
        {
            return true
        }

        return false;
    }

    async _prepareSearch() {
     //   await this.LUPA_CONTROLLER_INSTANCE.indexPrograms();
    }

    _performSearch = async search => {
        this.setState({
            searchResults: [],
            searchValue: search,
        })

        let result;
        await this.LUPA_CONTROLLER_INSTANCE.searchPrograms(this.state.searchValue).then(data => {
            result = data;
        })

        this.setState({
            searchResults: result
        });
    }
    
    showSearchResults() {
       return this.state.searchResults.map(result => {
            return (
             <ProgramSearchResultCard programData={result} />
            )
        })
    }

    mapFeaturedPrograms = () => {
        return this.state.featuredPrograms.map((program, index, arr) => {
                    return (
                        <ProgramListComponent  programData={program} key={index} index={index}  setPageIsPrograms={this.setPageIsPrograms} setPageIsNotPrograms={this.setPageIsNotPrograms} />
                    )
        })
    }


    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#F2F2F2'}}>

<Header hasTabs style={{backgroundColor: '#F2F2F2', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
<Appbar.BackAction onPress={() => this.props.navigation.goBack()} color="#212121" />
                    <Appbar.Content title="Lupa Programs"   titleStyle={{fontFamily: 'ARSMaquettePro-Black', color: '#212121', fontSize: 20, fontWeight: '600', alignSelf: 'center'}} />
                   {/* <Appbar.Action icon="filter-list" onPress={this.showFilter} color="#212121" />
                    {
                        this.props.lupa_data.Users.currUserData.isTrainer ?
                             <Appbar.Action icon={() => <FeatherIcon name="bar-chart" size={22}/>} onPress={this.openTrainerInsights} color="#212121" />
                       
                        :
                        null
                    } */}
                   
</Header>
        <Tabs tabContainerStyle={{backgroundColor: '#F2F2F2'}} renderTabBar={()=> <ScrollableTab ref={this.scrollableTab} tabsContainerStyle={{backgroundColor: '#F2F2F2'}} />}>
          <Tab heading="Featured" tabStyle={{backgroundColor: '#F2F2F2'}} activeTabStyle={{backgroundColor: '#F2F2F2'}}>
              <View style={{backgroundColor: '#F2F2F2', flex: 1}}>
                

                    <ScrollView contentContainerStyle={{backgroundColor: '#F2F2F2'}} shouldRasterizeIOS={true} refreshControl={<RefreshControl refreshing={this.state.featuredIsRefreshing} onRefresh={() => this.handleOnRefresh()}/>}>
                        <View style={{height: Dimensions.get('window').height, justifyContent: 'space-between'}}>

                        <View style={{height: Dimensions.get('window').height / 2.5}}>
                        <Text style={styles.headerText}>
                        Curated By Lupa
                    </Text>

                        <Carousel 
                        data={this.state.samplePhotoData}
                        itemWidth={Dimensions.get('window').width - 100}
                        sliderWidth={Dimensions.get('window').width}
                        scrollEnabled={true}
                        firstItem={1}
                        renderItem={this._renderItem}
                        />
                        </View>


                        <View style={{flex: 1}}>
                        <Text style={styles.headerText}>
                        By Lupa Trainers
                    </Text>
                    <View style={{}}>
                        <ScrollView 
                        horizontal 
                        decelerationRate={0} 
                        shouldRasterizeIOS={true} 
                        snapToAlignment={'center'} 
                        centerContent
                      //  pagingEnabled={true}
                        snapToInterval={Dimensions.get('window').width / 1.2}
                        showsHorizontalScrollIndicator={false}>
                            {
                                this.mapFeaturedPrograms()
                            }
                        </ScrollView>
                    </View>
                        </View>

{/*
                        <View style={{ }}>
                        <Text style={styles.headerText}>
                        Programs with waitlist
                    </Text>
                        <View>
                            <Text style={{margin: 20, }}>
                                Coming soon.  Add up to four friends to waitlist for your.
                            </Text>
                        </View>
                        </View>

                        <View style={{backgroundColor: 'rgb(209, 209, 214)', marginVertical: 30, justifyContent: 'space-evenly', alignItems: 'center', padding: 10}}>
                            <Text style={{fontFamily: 'ARSMaquettePro-Regular', color: '#212121', fontSize: 18, fontWeight: '300'}}>
                                Add four friends and automatically get signed up to a pack when spots are available
                            </Text>
                            <View style={{width: '100%', margin: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                                <View style={{width: 60, height: 60, borderRadius: 60, backgroundColor: '#EBEBEB', alignItems: 'center', justifyContent: 'center'}}>
                                    {
                                        this.state.waitListData[0] == '' ?
                                        <MaterialIcon name="add" size={30} />
                                        :
                                        <Image source={{uri: this.state.waitListData[0].photo_url}} style={{width: 60, height: 60, borderRadius: 60}} />
                                    }
                                </View>

                                <View style={{width: 60, height: 60, borderRadius: 60, backgroundColor: '#EBEBEB', alignItems: 'center', justifyContent: 'center'}}>
                                    <MaterialIcon name="add" size={30} />
                                </View>

                                <View style={{width: 60, height: 60, borderRadius: 60, backgroundColor: '#EBEBEB', alignItems: 'center', justifyContent: 'center'}}>
                                    <MaterialIcon name="add" size={30} />
                                </View>

                                <View style={{width: 60, height: 60, borderRadius: 60, backgroundColor: '#EBEBEB', alignItems: 'center', justifyContent: 'center'}}>
                                    <MaterialIcon name="add" size={30} />
                                </View>
                            </View>

                            {
                                this.state.allSpotsFilled == true ?
                                <NativeButton title="Send out request" onPress={this.handleInviteWaitlist} />
                                :
                                <NativeButton title="Invite Friends" onPress={() => this.setState({ showInviteModal: true })} />
                            }
                        
                        </View>
                        */}
                                                </View>
                    </ScrollView>
                    </View>
                    <SafeAreaView style={{backgroundColor: '#F2F2F2'}} />
          </Tab>
          <Tab heading="Programs" tabStyle={{backgroundColor: '#F2F2F2'}} activeTabStyle={{backgroundColor: '#F2F2F2'}}>    
          <SearchBar  
                platform="ios" 
                style={{backgroundColor: '#F2F2F2'}}
                containerStyle={{backgroundColor: '#F2F2F2', borderColor: '#F2F2F2'}} 
                style={{borderColor: '#F2F2F2'}} 
                inputContainerStyle={{borderColor: '#F2F2F2'}} 
                inputStyle={{ borderColor: '#F2F2F2'}} 
                placeholder="Search"
                value={this.state.searchValue}
                onChangeText={text => this._performSearch(text)}
                />
                            <ScrollView style={{backgroundColor: '#F2F2F2'}}>
                                {
                                    this.showSearchResults()
                                }
                            </ScrollView>
          </Tab>
          <Tab heading="My Programs" tabStyle={{backgroundColor: '#F2F2F2'}} activeTabStyle={{backgroundColor: '#F2F2F2'}}>
                            <ScrollView centerContent={this.state.currUserPrograms.length == 0 || this.state.currUserPrograms == undefined ? true : false} contentContainerStyle={{flex: 1, backgroundColor: '#F2F2F2'}} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.setState({ currUserPrograms: getCurrentStoreState().Programs.currUserProgramsData })} />}>
                                {
                                    this.mapPrograms()
                                }
                            </ScrollView>
                            {this.getRBSheet()}
          </Tab>
          {/*

          <Tab heading="Waitlist" tabStyle={{backgroundColor: '#F2F2F2'}} activeTabStyle={{backgroundColor: '#F2F2F2'}}>
              {
                  this.mapWaitlist()
              }

            </Tab>*/}
          
        </Tabs>
            
       
       {
           this.props.lupa_data.Users.currUserData.isTrainer && this.state.pageIsPrograms ?
                  <Portal>
                  <FAB.Group
                  color="#FFFFFF"
                    open={this.state.open}
                    icon={this.state.open ? 'list' : 'add'}
                    actions={[
                      { icon: 'fitness-center', label: 'Create a Program', color: "#212121" ,onPress: () => this.navigateToCreateProgram()},
                     // { icon: () => <FeatherIcon name="shield" size={23} color="#212121" />, label: 'Create a Service', onPress: () => this.setState({ showCreateServiceDialog: true }) },
                    ]}
                    onStateChange={this._onStateChange}
                    onPress={() => {
                      if (this.state.open) {
                        // do something if the speed dial is open
                      }
                    }}
                    fabStyle={{backgroundColor: '#2196F3'}}
                  />
                </Portal>
                :
                null
       }

        <ProgramsFilter filterHeight={this.state.filterHeight} handleApplyFilterOnPress={this.handleApplyFilterOnPress} handleCancelButtonOnPress={this.handleCancelButtonOnPress} disableSwipe={this.props.disableSwipe} enableSwipe={this.props.enableSwipe} />
           <InviteWaitlistFriends following={this.props.lupa_data.Users.currUserData.following}  isVisible={this.state.showInviteModal} closeModalMethod={(list, action) => this.closeInviteModal(list, action)} />
          {/*  <CreateServiceDialog isVisible={this.state.showCreateServiceDialog} closeDialogMethod={this.closeCreateServiceDialog} /> */}
            <ShareProgramModal isVisible={this.state.showShareProgramModal} following={this.props.lupa_data.Users.currUserData.following} currUserData={this.props.lupa_data.Users.currUserData} program={this.state.currProgramClicked} closeModalMethod={this.closeShareProgramModal} />
           <TrainerInsights isVisible={this.state.trainerInsightsVisible} closeModalMethod={this.closeTrainerInsights} />
           
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerText: {
        fontFamily: 'ARSMaquettePro-Black', 
        margin: 5, 
        padding: 5, 
        alignSelf: 'flex-start', 
        color: '#212121', 
        fontWeight: 'bold', 
        fontSize: 25
    },
    filterText: {
        color: '#F2F2F2',
        fontFamily: 'ARSMaquettePro-Regular',
        fontSize: 15
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(Programs));