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

import { RFPercentage } from 'react-native-responsive-fontsize'

import { Button as ElementsButton } from 'react-native-elements';
import UserSearchResult from '../../user/profile/component/UserSearchResult'
import LupaController from '../../../controller/lupa/LupaController'
import { getCurrentStoreState } from '../../../controller/redux';
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
                <PaperModal contentContainerStyle={{width: Dimensions.get('window').width, height: Dimensions.get('window').height, backgroundColor: '#FFFFFF'}} visible={this.props.isVisible}>
                                   <Appbar.Header style={{elevation: 0}} theme={{
                    colors: {
                        primary: '#FFFFFF'
                    }
                }}>
                    <Appbar.BackAction onPress={this.props.closeModalMethod} />
                    <Appbar.Content title="Share Program" />
                </Appbar.Header>

                <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
                <ProgramSearchResultCard programData={this.props.program} />
                              <Divider />
                    <ScrollView shouldRasterizeIOS={true} contentContainerStyle={{backgroundColor: '#FFFFFF'}}>
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
            showShareProgramModal: false,
            currProgramClicked: {},
            refreshing: false,
            currUserPrograms: this.props.lupa_data.Programs.currUserProgramsData,
            searchResults: [],
            searchValue: "",
            featuredPrograms: [],
            featuredIsRefreshing: false,
        }

      this.RBSheet = React.createRef();
      this.mainRBSheet = React.createRef();

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

    showInviteModal = () => {
        this.setState({
            showInviteModal: true,
        })
    }

    handleInviteWaitlist = () => {
        //invite users


        //clear waitlist
        this.setState({
            waitListData: ['', '', '', ''],
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
        })
    }


    showFilter = () => {
        Animated.timing(this.state.filterHeight, {
            toValue: Dimensions.get('window').height,
            duration: 500
        }).start();
    }

    closeFilter = () => {
        Animated.timing(this.state.filterHeight, {
            toValue: 0,
            duration: 500
        }).start();
    }

    handleCancelButtonOnPress = () => {
        this.closeFilter()
    }

    handleApplyFilterOnPress = () => {
        //apply filters

        //close filter
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
                                    <Chip style={{position: 'absolute', top: 0, right: 0, margin: 5, backgroundColor: '#2196F3'}}>
                                        Lupa
                                    </Chip>
                                </Surface>

                                <Text style={{alignSelf: 'center', fontFamily: 'ARSMaquettePro-Black', color: '#212121'}}>
                                    Aura Program
                                </Text>

                              {/*  <View style={{marginTop: 50, alignSelf: 'center', width: '60%', height: 'auto', alignItems: 'center', justifyContent: 'center'}}>
                                <FAB
    style={{position: 'absolute', alignSelf: 'flex-start', backgroundColor: "#FFFFFF"}}
    small
    icon={() => <FeatherIcon name="activity" size={25} />}
    onPress={() => console.log('Pressed')}
    color="#FFFFFF"
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
            height={225}
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
                        <FeatherIcon name="activity" size={20} style={{marginHorizontal: 10}} color="#212121" />
                        <View>
                        <Text style={{fontSize: 18, fontWeight: '300', paddingVertical: 2.5}}>
                            Launch Program
                        </Text>
                        <Text style={{fontFamily: 'HelveticaNeueLight', color: 'rgb(72, 72, 74)'}}>
                            Launch this workout
                        </Text>
                        </View>
                    </View>
                    </TouchableOpacity>
                    <Divider />
                        <TouchableOpacity containerStyle={{height: 'auto', width: Dimensions.get('window').width,}} style={{ flexDirection: 'row', alignItems: 'center',}} onPress={this.handleShareWithFriend}>
                        <View style={{margin: 15, width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'center'}}>
                            <FeatherIcon name="share" size={20} style={{margin: 10}} color="#212121" />
                            <View>
                        <Text style={{fontSize: 18, fontWeight: '300', paddingVertical: 2.5}}>
                            Share Program
                        </Text>
                        <Text style={{fontFamily: 'HelveticaNeueLight', color: 'rgb(72, 72, 74)'}}>
                            Send to a friend
                        </Text>
                        </View>
                        </View>
                        </TouchableOpacity>
                        <Divider />
             </SafeAreaView>    
             </RBSheet>
        )
    }

    getMainRBSheet = () => {
        return (
            <RBSheet
            ref={this.mainRBSheet}
            height={120}
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
             <TouchableOpacity containerStyle={{height: 'auto', width: Dimensions.get('window').width,}} style={{ flexDirection: 'row', alignItems: 'center',}} onPress={this.navigateToCreateProgram}>
                    <View style={{margin: 15, width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'center'}}>
                        <FeatherIcon name="edit-2" size={20} style={{marginHorizontal: 10}} color="#212121" />
                        <View>
                        <Text style={{fontSize: 18, fontWeight: '300', paddingVertical: 2.5}}>
                            Design a Program
                        </Text>
                        <Text style={{fontFamily: 'HelveticaNeueLight', color: 'rgb(72, 72, 74)'}}>
                            Design a complete workout program
                        </Text>
                        </View>
                    </View>
                    </TouchableOpacity>
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
        })
    }
 
    mapPrograms = () => {
        if (this.state.currUserPrograms.length != undefined)
        {
            if (this.state.currUserPrograms.length > 0)
            {
                return (
                    <ScrollView contentContainerStyle={{alignItems: 'center', backgroundColor: '#FFFFFF'}}>
                        {
                              this.state.currUserPrograms.map(program => {
                                  if (typeof(program) == 'undefined')
                                  {
                                      return;
                                  }
                                    return (
                                        <View>
                                            <ProgramSearchResultCard  programData={program} />
                                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                                            <Button color="rgb(13,71,161)" >
                                                <Text>
                                                Edit 
                                                </Text>
                                            </Button>
                                            <Button color="rgb(229,57,53)" 
                                            onPress={() => this.deleteUserProgram(program.program_structure_uuid, this.props.lupa_data.Users.currUserData.user_uuid)}>
                                                <Text>
                                                Delete
                                                </Text>
                                            </Button>
                                            </View>
                                        </View>
                                        
     
                                       /* <Card style={{elevation: 5, width: '92%', marginVertical: 10}} onPress={() => this.handleProgramOnPress(program)}>
         <Card.Cover source={{ uri: program.program_image }} />
         <Card.Actions style={{backgroundColor: '#FFFFFF',width: '100%', justifyContent: 'space-between', padding: 10}}>
             
             <Text style={{fontFamily: 'ARSMaquettePro-Regular', fontSize: 15}}>
                 {program.program_name}
             </Text>
             <View style={{flexDirection: 'row'}}>
             <Button color="rgb(13,71,161)" >Edit </Button>
           <Button color="rgb(229,57,53)" onPress={() => this.deleteUserProgram(program.program_structure_uuid, this.props.lupa_data.Users.currUserData.user_uuid)}>Delete</Button>
             </View>
         </Card.Actions>
                                    </Card>*/

                                 
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

    handleShareWithFriend = async () => {
        this.RBSheet.current.close();
        this.setState({
            showShareProgramModal: true,
        })
    }

    closeShareProgramModal = () => {
        this.setState({
            showShareProgramModal: false,
        })
    }

    navigateToCreateProgram = () => {
        this.mainRBSheet.current.close()
        this.props.navigation.navigate('CreateProgram', {
            navFrom: "Programs",
        })
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
                        <ProgramListComponent programData={program} key={index} index={index} />
                    )
        })
    }


    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>

<Header hasTabs style={{backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
<Appbar.BackAction onPress={() => this.props.navigation.goBack()} color="#212121" />
                    <Appbar.Content title="Lupa Programs"   titleStyle={{fontFamily: 'ARSMaquettePro-Black', color: '#212121', fontSize: 15, fontWeight: '600', alignSelf: 'center'}} />
                   <Appbar.Action icon={() => <FeatherIcon name="activity" size={20} />} onPress={() => this.mainRBSheet.current.open()} color="#212121" />
                   
</Header>
        <Tabs tabContainerStyle={{backgroundColor: '#FFFFFF'}} renderTabBar={()=> <ScrollableTab ref={this.scrollableTab} tabsContainerStyle={{backgroundColor: '#FFFFFF'}} />}>
          <Tab heading="Explore" tabStyle={{backgroundColor: '#FFFFFF'}} activeTabStyle={{backgroundColor: '#FFFFFF'}}>
              <View style={{backgroundColor: '#FFFFFF', flex: 1}}>
              <SearchBar placeholder="Search"
                        onChangeText={text => console.log(text)} 
                        platform="ios"
                        searchIcon={<FeatherIcon name="search" />}
                        containerStyle={{backgroundColor: "transparent"}}
                        value={this.state.searchValue}/>

                    <ScrollView contentContainerStyle={{backgroundColor: '#FFFFFF'}} shouldRasterizeIOS={true} refreshControl={<RefreshControl refreshing={this.state.featuredIsRefreshing} onRefresh={() => this.handleOnRefresh()}/>}>
                        <View style={{flex: 1}}>
                        <Text style={styles.headerText}>
                        Popular
                    </Text>
                    <Text style={{paddingLeft: 12, margin: 5}}>
                        Popular programs this week
                    </Text>
                    <View style={{}}>
                        <ScrollView 
                        horizontal 
                        decelerationRate={0} 
                        shouldRasterizeIOS={true} 
                        snapToAlignment={'center'} 
                        centerContent
                        pagingEnabled={true}
                        snapToInterval={Dimensions.get('window').width / 1.2}
                        showsHorizontalScrollIndicator={false}>
                            {
                                this.mapFeaturedPrograms()
                            }
                        </ScrollView>
                    </View>
                        </View>

                        <View>
                        <Text style={styles.headerText}>
                        Subscriptions
                    </Text>
                    <Text style={{paddingLeft: 12, margin: 5}}>
                        Program updates from trainers you are subscribed to
                    </Text>
                        </View>

                        <View>
                        <Text style={styles.headerText}>
                        Saved
                    </Text>
                    <Text style={{paddingLeft: 12, margin: 5}}>
                        Bookmarked programs saved for later
                    </Text>
                        </View>
                    </ScrollView>
                    </View>

          </Tab>
          <Tab heading="My Programs" tabStyle={{backgroundColor: '#FFFFFF'}} activeTabStyle={{backgroundColor: '#FFFFFF'}}>
                            <ScrollView centerContent={this.state.currUserPrograms.length == 0 || this.state.currUserPrograms == undefined ? true : false} contentContainerStyle={{flex: 1, backgroundColor: '#FFFFFF'}} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.setState({ currUserPrograms: getCurrentStoreState().Programs.currUserProgramsData })} />}>
                                {
                                    this.mapPrograms()
                                }
                            </ScrollView>
                            {this.getRBSheet()}
          </Tab>
          {/*

          <Tab heading="Waitlist" tabStyle={{backgroundColor: '#FFFFFF'}} activeTabStyle={{backgroundColor: '#FFFFFF'}}>
              {
                  this.mapWaitlist()
              }

            </Tab>*/}
          
        </Tabs>

       {this.getMainRBSheet()}
        <ProgramsFilter filterHeight={this.state.filterHeight} handleApplyFilterOnPress={this.handleApplyFilterOnPress} handleCancelButtonOnPress={this.handleCancelButtonOnPress} disableSwipe={this.props.disableSwipe} enableSwipe={this.props.enableSwipe} />
            <ShareProgramModal isVisible={this.state.showShareProgramModal} following={this.props.lupa_data.Users.currUserData.following} currUserData={this.props.lupa_data.Users.currUserData} program={this.state.currProgramClicked} closeModalMethod={this.closeShareProgramModal} />

            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerText: {
        fontFamily: 'ARSMaquettePro-Medium', 
        fontSize: 35, 
        paddingLeft: 12,
        margin: 5,
    },
    filterText: {
        color: '#FFFFFF',
        fontFamily: 'ARSMaquettePro-Regular',
        fontSize: 15
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(Programs));