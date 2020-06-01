/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  20, 2019
 * 
 * Profile View
 */

import React, { useState } from 'react';

import {
    StyleSheet,
    View,
    Text,
    Modal,
    TouchableOpacity,
    ScrollView,
    TouchableHighlight,
    RefreshControl,
    Image,
    Button as NativeButton,
    ActionSheetIOS,
    TextInput,
    Dimensions,
    SafeAreaView,
} from "react-native";

import {
    IconButton,
    Title,
    Surface,
    Button,
    Caption,
    Avatar,
    Paragraph,
    Divider,
    Portal,
    FAB,
    Dialog,
    Chip,
    Appbar,
} from 'react-native-paper';

import {
    Avatar as ReactNativeElementsAvatar,
    Icon
} from 'react-native-elements';


import ImagePicker from 'react-native-image-picker';



import { withNavigation, NavigationActions } from 'react-navigation';
import LupaController from '../../../controller/lupa/LupaController';
import MyPacksCard from './component/MyPacksCard';

import { connect } from 'react-redux';

import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import ProgramProfileComponent from '../../workout/program/createprogram/component/ProgramProfileComponent';

import ThinFeatherIcon from "react-native-feather1s";

let chosenHeaderImage;
let chosenProfileImage;

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state
    }
}

const mapDispatchToProps = dispatchEvent => {
    
}

/**
 * Lupa Profile View
 * 
 * This view serves as the user profile for the current user to see only.  Any edits to the profile can be
 * made here.
 * 
 * TODO:
 * @todo Fix Fitness Interest surface displaying wrong caption for current user.
 */
class ModalProfileView extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            userUUID: '',
            userData: {},
            userPackData: [],
            userRecommendedWorkouts: [],
            isEditingBio: false,
            followers: [],
            following: [],
            interest: [],
            createSessionModalIsOpen: false,
            profileImage: "",
            dialogVisible: false,
            checkbox: false,
            bio: '',
            sessionReviews: [],
            fitnessInterestDialogOpen: false,
            city: '',
            state: '',
        }
    }

    /**
     * ComponentDidMount (Lifecycle Method) - ASYNC
     * 
     * ComponentDidMount is called right after the component is mounted on the display.  We setup user data here for the profile due to
     * the speed in which a user may search and click a user profile.  Loading the information and setting the state after the component has mounted
     * guarantees that the information will be loaded so the user can see it.
     */
    componentDidMount = async () => {
        await this.setupProfileInformation();
   //     await this.generateSessionReviewData();
    }

    componentWillUnmount = () => {
        
    }

    _getId() {
        let id = false;
        if (this.props.uuid) {
            id = this.props.uuid;
        }
        return id;
    }

    setupProfileInformation = async () => {
        let userInfo, userPackData, profileImageIn;
        const uuid = await this._getId();

        try {
            await this.LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(uuid).then(result => {
                userInfo = result;
            })

            if (userInfo == "" || userInfo == undefined || typeof userInfo != "object") {
                userInfo = this.props.lupa_data.Users.currUserData;
            }
        }
        catch (err) {
            userInfo = this.props.lupa_data.Users.currUserData;
        }

        try {
            await this.LUPA_CONTROLLER_INSTANCE.getPackInformationByUserUUID(uuid).then(result => {
                userPackData = result;
            })

            if (userPackData == "" || userPackData == undefined || typeof userPackData != "object") {
                userPackData = result;
            }
        }
        catch (err) {
            userPackData = this.props.lupa_data.Packs.currrUserPackData;
        }

        this.currUserUUID = await this.LUPA_CONTROLLER_INSTANCE.getCurrentUser().uid;

        await this.setState({
            userData: userInfo,
            userUUID: uuid,
            userPackData: userPackData,
            followers: userInfo.followers,
            following: userInfo.following,
            interest: userInfo.interest,
            bio: userInfo.bio,
            city: userInfo.city,
            state: userInfo.state,
        });
    }

    handleFollowUser = async () => {
        let userToFollow = this.state.userUUID;
        await this.LUPA_CONTROLLER_INSTANCE.followUser(userToFollow, this.props.lupa_data.Users.currUserData.user_uuid);

        //Update visible state for user to see
        const followers = this.state.followers;
        followers.push(this.props.lupa_data.Users.currUserData.user_uuid)
        await this.setState({
            followers: followers
        })
    }

    handleUnFollowUser = async () => {
        let userToUnfollow = this.state.userUUID;
        await this.LUPA_CONTROLLER_INSTANCE.unfollowUser(userToUnfollow, this.props.lupa_data.Users.currUserData.user_uuid);
        
        const followers = this.state.followers;
        followers.splice(this.state.followers.indexOf(userToUnfollow), 1);
        await this.setState({
            followers: followers,
        })
    }

    _chooseProfilePictureFromCameraRoll = async () => {
        
        ImagePicker.showImagePicker({}, async (response) => {
            if (!response.didCancel)
            {
                await this.setState({ profileImage: response.uri });

                let imageURL;
                //update in FB storage
                await this.LUPA_CONTROLLER_INSTANCE.saveUserProfileImage(response.uri).then(result => {
                    imageURL = result;
                });
        
                //update in Firestore
                await this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('photo_url', imageURL);
        
            }
        });
        //TODO
        //update in redux
        //await this.props.updateCurrentUsers()
    }

    closeSettingsModal = () => {
        this.setState({ settingsModalIsOpen: false });
    }

    closeFollowerModal = () => {
        this.setState({ followerModalIsOpen: false });
    }

    addFitnessInterest = () => {
        this.setState({ fitnessInterestDialogOpen: true })
    }

    closeFitnessInterestDialog = () => {
        this.setState({ fitnessInterestDialogOpen: false })
    }

    mapInterest = () => {
        return this.props.lupa_data.Users.currUserData.user_uuid == this.state.userData.user_uuid ?
        this.state.interest.length == 0 ?
        <Caption>
            Specializations and strengths that you add to your fitness profile will appear here.
         </Caption> : 
        this.state.userData.interest.map(interest => {
            return (
                <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>
                    {interest}
                </Chip>
            );
        })
        :
        this.state.interest.length == 0 ?
        <Caption>
            This user has not added any fitness interest.
         </Caption> : 
        this.state.userData.interest.map(interest => {
            return (
                <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>
                    {interest}
                </Chip>
            );
        })

    }

    mapPacks = () => {
        return this.state.userPackData.map(pack => {
            return (
                <MyPacksCard packUUID={pack.id} packTitle={pack.pack_title} />
            )
        })
    }


    handleOnRefresh = async () => {
        this.setState({ refreshing: true })
        await this.setupProfileInformation()
        this.setState({ refreshing: false })
    }

    handleChangeBioText = async (text) => {
        this.setState({
            bio: text,
        })
        this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('bio', text);
    }

    mapBio = () => {
        //if current user viewing profile
        if (this.state.userUUID == this.props.lupa_data.Users.currUserData.user_uuid) {
            return (
                <Text allowFontScaling={true} allowsEditing={false} style={{width: '100%', fontSize: 11, fontWeight: '400'}}>
                {this.state.bio}
            </Text>
            )
        }
        else
        {
            return (
                <Text allowFontScaling={true} allowsEditing={false} style={{width: '100%', fontSize: 11, fontWeight: '400'}}>
                {this.state.bio}
            </Text>
            )
        }
    }

    generateSessionReviewData = async () => {
        let userData, userUUID, sessionReviews = [];

        if (this.state.userData)
        {
            if (this.state.userData.session_reviews.length != 0)
            {
                let reviewData = this.state.userData.session_reviews;
                for (let i = 0; i < reviewData.length; ++i)
                {
                    //get users uuid from review object
                    userUUID = reviewData[i].reviewBy;

                    //get users information from controller
                    await this.LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(userUUID).then(userDataIn => {
                        userData = userDataIn;
                    });

                    //add it to review object and puhs into arr
                    reviewData.reviewByData = userData;
                    sessionReviews.push(reviewData);
                }
            }
        }
        //Set session review state property
        await this.setState({
            sessionReviews: sessionReviews
        })
    }

    mapUserReviews = () => {/*
        return this.state.sessionReviews.map(review => {
            console.log(review)
            return (
                <View style={{ margin: 10, width: Dimensions.get('window').width - 40, height: "auto", padding: 5, borderRadius: 15, flexDirection: "column", backgroundColor: "#ebebeb" }}>
                <View style={{ width: "100%", justifyContent: "space-between", alignItems: "center", flexDirection: "row" }}>
                    <View style={{ padding: 5, flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                        <Surface style={{ margin: 3, elevation: 10, width: 25, height: 25, borderRadius: 25 }}>
                            <Image source={{uri: review.reviewByData.photo_url}} style={{ width: 25, height: 25, borderRadius: 25 }} />
                        </Surface>

                        <Text style={{ fontWeight: "bold" }}>
                            {review.reviewByData.display_name}
                </Text>
                    </View>

                    <>
                        <Text style={{ fontWeight: "bold" }}>
                            {review.reviewDate}
            </Text>
                    </>
                </View>

                <Text style={{ padding: 3, fontFamily: "avenir-roman" }} numberOfLines={10} ellipsizeMode="tail">
                   {review.reviewText}
            </Text>

                <NativeButton title="See Review" />
            </View>
            )
        })*/
    }

    _navigateToFollowers = () => {
        this.props.navigation.navigate('FollowerView');
    }

    _navigateToSettings = () => {
        this.props.navigation.navigate('UserSettings');
    }

    renderFinishEditingBioButton = () => {
        if (this.state.userUUID == this.props.lupa_data.Users.currUserData.user_uuid) {
            return this.state.isEditingBio == true ?
                <Button mode="text" color="#2196F3" onPress={() => this.setState({ isEditingBio: false })}>
                    Done
            </Button>
                :
                <Button mode="text" color="#2196F3" onPress={() => this.setState({ isEditingBio: true })}>
                    Edit
            </Button>
        }
    }

    getFollowerLength = () => {
        if (this.state.followers.length) {
            return this.state.followers.length
        }
        else {
            return 0;
        }
    }

    getFollowingLength = () => {
        if (this.state.following.length) {
            return this.state.following.length;
        } else {
            return 0;
        }
    }

    getHeaderRight = () => {
        return <FeatherIcon name="plus-circle" size={20} onPress={() => this._showActionSheet()} />
    }

    renderEditBioButton = () => {
        if (this.state.userData)
        {
            if (this.props.lupa_data.Users.currUserData.user_uuid == this.state.userData.user_uuid)
            {
                return (
                    <TouchableHighlight style={{width: 'auto', borderRadius: 8}} onPress={ () => console.log()}>
                                <View style={{width: '100%'}}>
                            <View style={{backgroundColor: '#e3e3e3', borderRadius: 8, alignItems: 'center', justifyContent: 'center', width: 140, height: 30}}>
                                <Text>
                                    Edit Bio
                                </Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                )
            }
        }
    }

    renderInteractions = () => {
        return this.props.lupa_data.Users.currUserData.user_uuid == this.state.userUUID ?
            null
            :
            <View style={{ width: Dimensions.get('window').width, margin: 10, padding: 10,alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>

<IconButton
                    icon="message"
                    onPress={ () => this.props.navigation.dispatch(

                            NavigationActions.navigate({
                                routeName: 'PrivateChat',
                                params: {
                                    currUserUUID: this.props.lupa_data.Users.currUserData.user_uuid,
                                    otherUserUUID: this.getId()
                                },
                                action: NavigationActions.navigate({
                                    routeName: 'PrivateChat', params: {
                                        currUserUUID: this.props.lupa_data.Users.currUserData.user_uuid,
                                        otherUserUUID: this._getId()
                                    }
                                })
                            })
                        )

                    }
                />
            </View>

    }


    _showActionSheet = () => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ['Invite To Pack', 'Cancel'],
                cancelButtonIndex: 1,
            }, (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                       
                        break;
                    case 1:
                        break;
                    default:
                }
            });
    }

    getUserAvatar = () => {

        if (this.state.userData.photo_url == undefined && this.props.lupa_data.Users.currUserData.user_uuid == this.state.userData.user_uuid
            || this.state.userData.photo_url == "" && this.props.lupa_data.Users.currUserData.user_uuid == this.state.userData.user_uuid) {
                let display_name = "User Not Found";
        let firstInitial = "";
        let secondInitial = "";
        if (true && this.state.userData.display_name) {
            try {
                display_name = this.state.userData.display_name.split(" ");
                firstInitial = display_name[0].charAt(0);
                secondInitial = display_name[1].charAt(0);
            } catch(err)
            {
                firstInitial="U"
                secondInitial="K"
            }
        }
            
                return <Avatar.Text size={65} label={firstInitial + secondInitial} style={{ backgroundColor: "#212121" }} theme={{
                elevation: 3,
            }} />
        }

        try {
            if (this.props.lupa_data.Users.currUserData.user_uuid == this._getId()) {
                return (
                    <Surface style={{elevation: 8, width: 65, height: 65, borderRadius: 65}}>
                         <ReactNativeElementsAvatar raised rounded size={65} source={{ uri: this.props.lupa_data.Users.currUserData.photo_url }} showEditButton={true} onPress={this._chooseProfilePictureFromCameraRoll} />
                    </Surface>
                )
            }

            return <ReactNativeElementsAvatar rounded size={65} source={{ uri: this.state.userData.photo_url }} />
        }
        catch (err) {
            let firstInitial = "";
        let secondInitial = "";
        if (true && this.state.userData.display_name) {
            try {
                display_name = this.state.userData.display_name.split(" ");
                firstInitial = display_name[0].charAt(0);
                secondInitial = display_name[1].charAt(0);
            } catch(err)
            {
                firstInitial="U"
                secondInitial="K"
            }
        }
        
            return <Avatar.Text size={65} label={firstInitial + secondInitial} style={{ backgroundColor: "#212121" }} theme={{
                elevation: 3
            }} />
        }
    }

    getLocation = () => {
            return this.currUserUUID = this.props.lupa_data.Users.currUserData.user_uuid ?
                <View style={{alignItems: 'center', flexDirection: 'row'}}>
                <MaterialIcons name="place" />
                                                <Text style={{ fontSize: 12, color: "#212121", fontWeight: "600", padding: 1 }}>
                                   {this.props.lupa_data.Users.currUserData.location.city + ", " + this.props.lupa_data.Users.currUserData.location.state}
                                </Text>
            </View>
            :
            <View style={{alignItems: 'center', flexDirection: 'row'}}>
                <MaterialIcons name="place" />
                                                <Text style={{ fontSize: 12, color: "#212121", fontWeight: "600", padding: 1 }}>
                                   {this.state.userData.city+ ", " + this.state.userData.state}
                                </Text>
            </View>
    }

    mapTrainerPrograms = () => {
        //if a uuid exist
        if (this.state.userData.user_uuid)
        {
            //if we are dealing with the current user
            if (this.props.lupa_data.Users.currUserData.user_uuid == this.state.userData.user_uuid)
            {
                //if there are programs locally
               if (this.props.lupa_data.Programs.currUserProgramsData.length != undefined)
               {
                    if (this.props.lupa_data.Programs.currUserProgramsData.length == 0)
                    {
                
                        if (this.props.lupa_data.Users.currUserData.isTrainer)
                        {
                            return (
                                <TouchableHighlight>
                                <Surface style={{justifyContent: 'space-between', padding: 10, backgroundColor: 'white', elevation: 0, width: Dimensions.get('screen').width /1.3, height: 120, borderRadius: 16, margin: 5}}>
                        <Text style={{fontSize: 15, fontWeight: '400'}}>
                            You haven't created any programs.  Try creating a program and sharing it with other users to acquire clients.
                        </Text>
                        <Button mode="contained" style={{width: '60%', elevation: 0}} theme={{
                                    colors: {
                                        primary: '#2196F3'
                                    },
                                    roundness: 10,
        
                                }} onPress={() => this.props.navigation.push('CreateProgram',{
                                    navFrom: 'Profile'
                                })}>
                                    <Text>
                                        Create a Program
                                    </Text>
                                </Button>
                            </Surface>
                                </TouchableHighlight>
            
                            )
                        }
                        else
                        {
                            return (
                                <TouchableHighlight>
                                <Surface style={{justifyContent: 'space-between', padding: 10, backgroundColor: 'white', elevation: 0, width: Dimensions.get('screen').width /1.3, height: 120, borderRadius: 16, margin: 5}}>
                        <Text style={{fontSize: 15, fontWeight: '400'}}>
                            You haven't created any programs.  Try creating a program and sharing it with other users to acquire clients.
                        </Text>
                        <Button mode="contained" style={{width: '60%', elevation: 0}} theme={{
                                    colors: {
                                        primary: '#2196F3'
                                    },
                                    roundness: 10,
        
                                }}>
                                    <Text>
                                       Join a Program
                                    </Text>
                                </Button>
                            </Surface>
                                </TouchableHighlight>
            
                            )
                        }
                    }
                    else
                    {
                        return this.props.lupa_data.Programs.currUserProgramsData.map(program => {
                            return (
                                 <ProgramProfileComponent programData={program} programOwnerData={this.state.userData} />
                            )
                        })
                    }
               }
               else
               {
                if (this.props.lupa_data.Users.currUserData.isTrainer)
                        {
                            return (
                                <TouchableHighlight>
                                <Surface style={{justifyContent: 'space-between', padding: 10, backgroundColor: 'white', elevation: 0, width: Dimensions.get('screen').width /1.3, height: 120, borderRadius: 16, margin: 5}}>
                        <Text style={{fontSize: 15, fontWeight: '400'}}>
                            You haven't created any programs.  Try creating a program and sharing it with other users to acquire clients.
                        </Text>
                        <Button mode="contained" style={{width: '60%', elevation: 0}} theme={{
                                    colors: {
                                        primary: '#2196F3'
                                    },
                                    roundness: 10,
        
                                }} onPress={() => this.props.navigation.push('CreateProgram',{
                                    navFrom: 'Profile'
                                })}>
                                    <Text>
                                        Create a Program
                                    </Text>
                                </Button>
                            </Surface>
                                </TouchableHighlight>
            
                            )
                        }
                        else
                        {
                            return (
                                <TouchableHighlight>
                                <Surface style={{justifyContent: 'space-between', padding: 10, backgroundColor: 'white', elevation: 0, width: Dimensions.get('screen').width /1.3, height: 120, borderRadius: 16, margin: 5}}>
                        <Text style={{fontSize: 15, fontWeight: '400'}}>
                            You haven't created any programs.  Try creating a program and sharing it with other users to acquire clients.
                        </Text>
                        <Button mode="contained" style={{width: '60%', elevation: 0}} theme={{
                                    colors: {
                                        primary: '#2196F3'
                                    },
                                    roundness: 10,
        
                                }}>
                                    <Text>
                                       Join a Program
                                    </Text>
                                </Button>
                            </Surface>
                                </TouchableHighlight>
            
                            )
                        }
               }
            }
            else
            {
                     //if there are programs loaded for the user
               if (this.state.userData.programs.length != undefined)
               {
                    if (this.state.userData.programs.length == 0)
                    {

                        if (this.state.userData.isTrainer)
                        {
                            return (
                                <TouchableHighlight>
                                <Surface style={{justifyContent: 'space-between', padding: 10, backgroundColor: 'white', elevation: 0, width: Dimensions.get('screen').width /1.3, height: 120, borderRadius: 16, margin: 5}}>
                        <Text style={{fontSize: 15, fontWeight: '400'}}>
                            You haven't created any programs.  Try creating a program and sharing it with other users to acquire clients.
                        </Text>
                        <Button mode="contained" style={{width: '60%', elevation: 0}} theme={{
                                    colors: {
                                        primary: '#2196F3'
                                    },
                                    roundness: 10,
        
                                }} onPress={() => this.props.navigation.push('CreateProgram',{
                                    navFrom: 'Profile'
                                })}>
                                    <Text>
                                        Create a Program
                                    </Text>
                                </Button>
                            </Surface>
                                </TouchableHighlight>
            
                            )
                        }
                        else
                        {
                            return (
                                <TouchableHighlight>
                                <Surface style={{justifyContent: 'space-between', padding: 10, backgroundColor: 'white', elevation: 0, width: Dimensions.get('screen').width /1.3, height: 120, borderRadius: 16, margin: 5}}>
                        <Text style={{fontSize: 15, fontWeight: '400'}}>
                            You haven't created any programs.  Try creating a program and sharing it with other users to acquire clients.
                        </Text>
                        <Button mode="contained" style={{width: '60%', elevation: 0}} theme={{
                                    colors: {
                                        primary: '#2196F3'
                                    },
                                    roundness: 10,
        
                                }}>
                                    <Text>
                                       Join a Program
                                    </Text>
                                </Button>
                            </Surface>
                                </TouchableHighlight>
            
                            )
                        }
                
   
                    }
                    else
                    {
                        return this.state.userData.programs.map(program => {
                            return (
                                 <ProgramProfileComponent programData={program} programOwnerData={this.state.userData} />
                            )
                        })
                    }
               }
            }
        }
     }

     mapServices = () => {
        //if a uuid exist
if (this.state.userData.user_uuid)
{
    //if we are dealing with the current user
    if (this.props.lupa_data.Users.currUserData.user_uuid == this.state.userData.user_uuid)
    {

        //if there are programs locally
       if (this.props.lupa_data.Programs.currUserServicesData.length != undefined)
       {
            if (this.props.lupa_data.Programs.currUserServicesData.length == 0 || typeof(this.props.lupa_data.Programs.currUserServicesData.length == 0) == 'object')
            {
                return (
                    <View style={{margin: 15, padding: 10, backgroundColor: 'grey', borderWidth: 0.5, borderColor: '#212121', borderRadius: 20, height: 'auto', width: Dimensions.get('window').width / 1.8, justifyContent: 'space-between'}}>
<FAB style={{position: 'absolute', right: -12, top: -15, backgroundColor: 'grey'}} small  icon={() => <ThinFeatherIcon
name="add"
size={25}
color="#000000"
thin={true}
/>}
onPress={() => this.setState({ showCreateServiceDialog: true })}
/>
<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>

<Text style={{fontFamily: 'ARSMaquettePro-Medium'}}>
         Add a Service
     </Text>
</View>
     <View>
     </View>
</View>
                )
            }
            else //services > 0 so we return them
            {
                return this.props.lupa_data.Programs.currUserServicesData.map(service => {
                    return (
<View style={{margin: 15, padding: 10, backgroundColor: service.service_colors[0], borderWidth: 0.5, borderColor: '#212121', borderRadius: 20, height: 'auto', width: Dimensions.get('window').width / 1.8, justifyContent: 'space-between'}}>
<FAB style={{position: 'absolute', right: -12, top: -15, backgroundColor: service.service_colors[1]}} small  
icon={service.service_icon_type == 'feather' ? () => <ThinFeatherIcon
name={service.service_icon}
size={25}
color="#000000"
thin={true}
/> : <MaterialIcon name={service.iconName} size={25} color="#000000" />}/>
<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>

<Text style={{fontFamily: 'ARSMaquettePro-Medium'}}>
         {service.service_name}
     </Text>
</View>
     <View>
     </View>
</View>
                    )
                })
            }
        }
        else
        {
            return (
                <View style={{margin: 15, padding: 10, backgroundColor: 'grey', borderWidth: 0.5, borderColor: '#212121', borderRadius: 20, height: 'auto', width: Dimensions.get('window').width / 1.8, justifyContent: 'space-between'}}>
<FAB style={{position: 'absolute', right: -12, top: -15, backgroundColor: 'grey'}} small  icon={() => <ThinFeatherIcon
name="add"
size={25}
color="#000000"
thin={true}
/>}
onPress={() => this.setState({ showCreateServiceDialog: true })}
/>
<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>

<Text style={{fontFamily: 'ARSMaquettePro-Medium'}}>
     Add a Service
 </Text>
</View>
 <View>
 </View>
</View>
            )
        }
    }
    else
    {
 //if there are programs locally
 if (this.state.userData.services.length != undefined)
 {
      if (this.state.userData.services.length == 0 || typeof(this.state.userData.services.length == 0) == 'object')
      {
          return (
              <View style={{margin: 15, padding: 10, backgroundColor: 'grey', borderWidth: 0.5, borderColor: '#212121', borderRadius: 20, height: 'auto', width: Dimensions.get('window').width / 1.8, justifyContent: 'space-between'}}>
<FAB style={{position: 'absolute', right: -12, top: -15, backgroundColor: 'grey'}} small  icon={() => <ThinFeatherIcon
name="add"
size={25}
color="#000000"
thin={true}
/>}
onPress={() => this.setState({ showCreateServiceDialog: true })}
/>
<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>

<Text style={{fontFamily: 'ARSMaquettePro-Medium'}}>
   Add a Service
</Text>
</View>
<View>
</View>
</View>
          )
      }
      else //services > 0 so we return them
      {
          return this.state.userData.servies.map(service => {
              return (
<View style={{margin: 15, padding: 10, backgroundColor: '#e57373', borderWidth: 0.5, borderColor: '#212121', borderRadius: 20, height: 'auto', width: Dimensions.get('window').width / 1.8, justifyContent: 'space-between'}}>
<FAB style={{position: 'absolute', right: -12, top: -15, backgroundColor: '#f44336'}} small  icon={() => <ThinFeatherIcon
name="message-circle"
size={25}
color="#000000"
thin={true}
/>}/>
<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>

<Text style={{fontFamily: 'ARSMaquettePro-Medium'}}>
   One on One Consulations
</Text>
</View>
<View>
</View>
</View>
              )
          })
      }
  }
    }
}
       
    }

     
    /**
     * Renders the follow/unfollow button depending on if the current user follows this user
     */
    renderFollowButton = () => {
        if (this.state.userData)
        {
            if (this.props.lupa_data.Users.currUserData.user_uuid == this.state.userData.user_uuid)
            {
                return (
                    <View style={{width: '100%'}}>
                        {
                                            this.state.followers.includes(this.props.lupa_data.Users.currUserData.user_uuid) ?
                                            <TouchableHighlight style={{borderRadius: 8}}>
                                                                    <View style={{backgroundColor: '#2196F3', borderRadius: 8, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', width: 110, height: 30}}>
                        <Text>
                            Unfollow
                        </Text>
                    </View>
                                            </TouchableHighlight>
                                            :
                                            <TouchableHighlight>
                                            <View style={{backgroundColor: '#2196F3', borderRadius: 8, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', width: '80%', height: 30}}>
<Text>
    Follow
</Text>
</View>
                    
                    </TouchableHighlight>
                    }        
                    </View>    
                )
            }
        }
    }


    render() {
        return (
            <Modal presentationStyle="fullScreen" style={styles.container} visible={this.props.isVisible} animated={true} animationType="slide">
                <SafeAreaView style={{flex: 1}}>
                <ScrollView >
                <Appbar.Header style={{ backgroundColor: "transparent", margin: 10 }}>
                    <Appbar.BackAction onPress={this.props.closeModalMethod} />
                    <Appbar.Content title={this.state.userData.username} />
                </Appbar.Header>


                <ScrollView 
                contentContainerStyle={{ flexGrow: 1 }} 
                showsVerticalScrollIndicator={false} 
                shouldRasterizeIOS={true} 
                refreshControl={<RefreshControl refreshing={this.state.refreshing} 
                onRefresh={this.handleOnRefresh} />}>
                    {
                        this.state.userData.isTrainer == true ?
                                        <View style={{alignSelf: 'center', marginBottom: 30, alignItems: 'center' }}>
                                        <Text style={{color: '#212121', fontFamily: 'ARSMaquettePro-Bold'}}> National Academy of Sports Medicine </Text>
                                        <Text style={{color: '#212121', fontFamily: 'ARSMaquettePro-Regular'}}> Lupa Tier 1 </Text>
                                    </View>
                                    :
                                    null
                    }
                    
                    <View style={styles.user}>
                        <View style={styles.userInfoContainer}>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                            <View style={{flex: 2, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start'}}>
                                {this.getUserAvatar()}
                                <View style={styles.userAttributesContainer}>
                            <TouchableOpacity style={{margin: 3, }} onPress={() => this._navigateToFollowers()}>
                                <View style={{alignItems: 'center'}}>
                                    <Text>
                                        {this.getFollowerLength()}
                                    </Text>
                                    <Text style={styles.userAttributeText}>
                                        Followers
                                </Text>
                                </View>

                            </TouchableOpacity>
                            <TouchableOpacity style={{margin: 3, }} onPress={() => this._navigateToFollowers()}>
                                <View style={{alignItems: 'center'}}>
                                    <Text>
                                        {this.getFollowingLength()}
                                    </Text>
                                    <Text style={styles.userAttributeText}>
                                        Following
                                </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        {
                            this.renderFollowButton()
                        }
                            </View>
                            
                            <View style={{flex: 3, alignItems: 'flex-start'}}>
                                <View style={{flex: 1, justifyContent: 'flex-start'}}>
                                <Text style={{ fontSize: 15, color: "#212121", fontWeight: 'bold', padding: 1 }}>
                                    {this.state.userData.display_name}
                                </Text>
                                {
                                    this.getLocation()
                                }
                                </View>
                                <View style={{alignItems: 'flex-start', width: '100%'}}>
                                                                            <Paragraph style={{paddingVertical: 10, fontSize: 12}}>
                                {this.state.userData.bio}
                                </Paragraph>
                                </View>
                            </View>
                            </View>
                            
                            {
                                this.state.userData.isTrainer == true ?

                            <View style={{width: '100%', alignSelf: 'center', padding: 10}}>
                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                <Text style={{color: 'rgb(99, 99, 102)', fontFamily: 'ARSMaquettePro-Medium', padding: 10, alignSelf: 'center'}}>
                                    Program Reviews
                                </Text>

                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={{color: '#212121', fontFamily: 'ARSMaquettePro-Regular'}}>
                                        See all
                                    </Text>
                                    <MaterialIcons name="arrow-forward" size={15} color="#212121" />
                                </View>
                                </View>
                                <ScrollView horizontal contentContainerStyle={{padding: 10}} >
                                    <View style={{alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgb(199, 199, 204)', borderRadius: 12, width: 150, height: 45}}>
                                        <Text style={{fontSize: 10}}>
                                            This user has no reviews.
                                        </Text>
                                    </View>
                                </ScrollView>
                            </View>
                            :
                            null
                            }

                        </View>

                        <Divider />

                        <View style={styles.myPacks}>
                            <Text style={{fontSize: 20, fontFamily: 'ARSMaquettePro-Regular', padding: 10}}>
                                Online Programs
                            </Text>
                        <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        centerContent
                        snapToAlignment={'center'}
                        decelerationRate={0} 
                        snapToInterval={Dimensions.get('window').width  / 1.3}
                        pagingEnabled={true}>
                            {
                                this.mapTrainerPrograms()
                            }
                        </ScrollView>
                    </View>

                    {
                        /*
                        this.state.userData.isTrainer ?
                        <View style={styles.myPacks}>
                        <View style={{margin: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                      <Text style={{fontSize: 20, fontFamily: 'ARSMaquettePro-Regular', padding: 10}}>
             Services
         </Text>

         <FAB small style={{backgroundColor: '#212121'}} icon="add" onPress={() => this.setState({ showCreateServiceDialog: true })}/>
           </View>
<ScrollView horizontal showsHorizontalScrollIndicator={false}>
{
    this.mapServices()
}
</ScrollView>
</View>

                        :
                        null
                        */
                    }


                    </View>
                        
                        <SafeAreaView />
                </ScrollView>
                
                
            </ScrollView>
            </SafeAreaView>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FAFAFA",
    },
    menuIcon: {
        position: 'absolute',
        bottom: 0
    },
    contentSurface: {
        margin: 5,
        elevation: 0,
        padding: 15,
        borderRadius: 20,
        flexDirection: 'column',
        backgroundColor: "transparent",
        justifyContent: "space-between",
        margin: 10,
        borderColor: "#2196F3",
        borderWidth: 1
    },
    chipStyle: {
        elevation: 3,
        width: "auto",
        backgroundColor: "white",
        margin: 5
    },
    chipTextStyle: {
        color: "#2196F3",
        fontWeight: 'bold',
    },
    surfaceHeader: {
        height: "15%",
        width: "100%",
        elevation: 1
    },
    experience: {
        backgroundColor: "transparent",
        margin: 10,
    },
    myPacks: {
        backgroundColor: "transparent",
        padding: 5,
    },
    recommendedWorkouts: {
        backgroundColor: "transparent",
        margin: 10,
    },
    recommendedWorkoutsHeader: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    userInfo: {
        flexDirection: "column",
    },
    user: {
        flexDirection: "column",
        margin: 0,
        backgroundColor: "transparent"
    },
    uesrInfoText: {
        fontWeight: "600",
    },
    userAttributesContainer: {
        flexDirection: "row", alignItems: "center", justifyContent: "space-between", margin: 3, 
    },
    userAttributeText: {
        fontWeight: "500",
        color: "rgba(33,33,33 ,1)"
    },
    imageBackground: {
        width: "100%",
        height: "100%"
    },
    userInfoContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        margin: 10,
        marginBottom: 15,
    },
    alignCenterColumn: {
        flexDirection: 'column', alignItems: 'center'
    },
    fab: {
        position: 'absolute',
        marginBottom: 15,
        marginRight: 15, 
        right: 0,
        bottom: 0,
        backgroundColor: "#2196F3"
    },
    selectedChip: {
        elevation: 5,
        margin: 5,
        width: '100',
        height: 'auto',
        backgroundColor: "#2196F3",
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedChipText: {
        color: '#FFFFFF',
    },
    unselectedChip: {
        elevation: 0,
        margin: 5,
        width: 'auto',
        height: 'auto',
        opacity: 0.6,
        backgroundColor: "transparent",
        borderColor: 'rgba(30,136,229 ,1)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2, 
    },
    unselectedChipText: {
        color: "rgba(33,150,243 ,1)"
    }

});

export default connect(mapStateToProps)(withNavigation(ModalProfileView));