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
    TouchableOpacity,
    ScrollView,
    TouchableHighlight,
    RefreshControl,
    Image,
    Button as NativeButton,
    ActionSheetIOS,
    Dimensions,
    SafeAreaView,
} from "react-native";

import {
    IconButton,
    Surface,
    TextInput,
    Button,
    Caption,
    Avatar,
    Modal as PaperModal,
    Snackbar,
    Divider,
    Portal,
    FAB,
    Dialog,
    Chip,
    Appbar,
    Paragraph,
} from 'react-native-paper';

import {
    Left,
    Right,
    Body
} from 'native-base';

import {
    Avatar as ReactNativeElementsAvatar,
    Icon,
    CheckBox
} from 'react-native-elements';

import ImagePicker from 'react-native-image-picker';

import { connect, useDispatch} from 'react-redux';

import ServicedComponent from '../../../controller/lupa/interface/ServicedComponent';
import LupaController from '../../../controller/lupa/LupaController';

import FeatherIcon from 'react-native-vector-icons/Feather';

import { getLupaUserStructure, getLupaUserStructurePlaceholder } from '../../../controller/firebase/collection_structures';
import { LupaUserStructure, LupaPackStructure } from '../../../controller/lupa/common/types';
import ProfileProgramCard from '../../workout/program/components/ProfileProgramCard';
import ProgramOptionsModal from '../../workout/program/modal/ProgramOptionsModal';
import { getLupaProgramInformationStructure } from '../../../model/data_structures/programs/program_structures';
import { MenuIcon } from '../../icons/index'
import ChangeHourlyRateModal from './modal/ChangeHourlyRateModal';

const InviteToPackDialog = props => {
    const [userToInvite, setUserToInvite] = useState(props.userToInvite);
    const [checked, setChecked] = useState(false);
    const [packsToInvite, setPacksToInvite] = useState([]);

    const LUPA_CONTROLLER_INSTANCE: LupaController = LupaController.getInstance();

    const _handlePacksToInvite = (uuid : String) => {
        let updatedPacks = packsToInvite;
        updatedPacks.push(uuid);
        setPacksToInvite(updatedPacks);
        setChecked(true);
    }

    const handleDialogClose = () => {
        LUPA_CONTROLLER_INSTANCE.inviteUserToPacks(packsToInvite, userToInvite);
        props.closeModalMethod();
    }

    return (
        <Portal>
            <Dialog
                visible={props.isOpen}
                onDismiss={props.closeModalMethod}>
                <Dialog.Title>Pack Invites</Dialog.Title>
                <Dialog.Content>
                    {
                        props.userPacks.map(pack => {
                            return (
                                <View key={pack.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <CheckBox
                                        center
                                        checkedIcon='dot-circle-o'
                                        uncheckedIcon='circle-o'
                                        checked={checked}
                                        onPress={() => _handlePacksToInvite(pack.id)} />

                                    <Text>
                                        {pack.pack_title}
                                    </Text>
                                </View>
                            )
                        })
                    }
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => handleDialogClose()}>Invite</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state
    }
}

interface IProfileProps {
    lupa_data: any,
    Users: any,
    currUserData: any,
    navigation: any,
    state: any,
}

interface IProfileState {
    userUUID: String,
    userData: LupaUserStructure,
    userPackData: Array<LupaPackStructure>,
    followers: Array<String>,
    following: Array<String>,
    interest: Array<String>
    profileImage: String,
    dialogVisible: Boolean,
    checkbox: Boolean,
    bio: String,
    sessionReviews: Array<String>
    fitnessInterestDialogOpen: Boolean,
    city: String,
    state: String,
    refreshing: Boolean,
    nearbyUsers: Array<Object>,
    programOptionsModalIsOpen: Boolean,
    programOptionsProgram: Object,
    changeRateModalIsVisible: Boolean,
}


/**
 * Lupa Profile View
 * 
 * This component serves as the user profile for the current user to see only.  Any edits to the profile can be
 * made here and should be reflected in the ModalProfileView as well.
 */
class ProfileView extends React.Component<IProfileProps, IProfileState> implements ServicedComponent {
    LUPA_CONTROLLER_INSTANCE: LupaController;
    currUserUUID: String;

    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            userUUID: '',
            userData: getLupaUserStructurePlaceholder(),
            userPackData: [],
            followers: [],
            following: [],
            interest: [],
            profileImage: "",
            dialogVisible: false,
            checkbox: false,
            bio: '',
            sessionReviews: [],
            fitnessInterestDialogOpen: false,
            city: '',
            state: '',
            refreshing: false,
            nearbyUsers: [],
            programOptionsModalIsOpen: false,
            programOptionsProgram: getLupaProgramInformationStructure(),
            changeRateModalIsVisible: false
        }
    }

    /**
     * ComponentDidMount
     * 
     * ComponentDidMount is called right after the component is mounted on the display.  We setup user data here for the profile due to
     * the speed in which a user may search and click a user profile.  Loading the information and setting the state after the component has mounted
     * guarantees that the information will be loaded so the user can see it.
     */
    componentDidMount = async () => {
        await this.setupComponent();
    }

    /**
     * Returns the ID retrieved from navigating to this view.  Verifies that the ID exist first.
     * @return id the uuid returned from this.props.navigation
     */
    _getId() {
        let id = false;
        try {
            if (this.props.route.params.userUUID) {
                id =  this.props.route.params.userUUID;
        } else {
            id =  this.props.lupa_data.Users.currUserData.user_uuid
        }
        } catch(error) {
            return this.props.lupa_data.Users.currUserData.user_uuid
        }

        return id;
    }

    /**
     * Loads any neessary data the component needs to render.
     */
    setupComponent = async () => {
        let userInfo = {}, userPackData = [], nearbyUsers = []
        const uuid = await this._getId();
        this.currUserUUID = this.props.lupa_data.Users.currUserData.user_uuid

        try {
            await this.LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(uuid).then(result => {
                userInfo = result;
            })

            if (userInfo == "" || userInfo == undefined || typeof userInfo != "object") {
                userInfo = this.props.lupa_data.Users.currUserData;
            }       
        }
        catch (err) {
            alert(err)
            userInfo = this.props.lupa_data.Users.currUserData;
        }

        try {
            await this.LUPA_CONTROLLER_INSTANCE.getAllTrainers().then(res => {
                nearbyUsers = res
            })

            if (typeof(nearbyUsers) == 'undefined') {
                nearbyUsers = []
            }

        } catch(error) {
            nearbyUsers = []
        }

        await this.setState({
            userData: userInfo,
            userUUID: uuid,
            followers: userInfo.followers,
            following: userInfo.following,
            interest: userInfo.interest,
            bio: userInfo.bio,
            city: userInfo.city,
            state: userInfo.state,
            nearbyUsers: nearbyUsers
        });
    }

    /**
     * Adds this user to the current user's follow list.
     */
    handleFollowUser = async () => {
        let userToFollow = this.state.userUUID;
        await this.LUPA_CONTROLLER_INSTANCE.followUser(userToFollow, this.props.lupa_data.Users.currUserData.user_uuid);

        //Update visible state for user to see
        const followers = this.state.followers;
        followers.push(this.props.lupa_data.Users.currUserData.user_uuid)
        await this.setState({
            followers: followers
        })

        //TODO add redux update
    }

    /**
     * Removes this user to the current user's follow list
     */
    handleUnFollowUser = async () => {
        let userToUnfollow = this.state.userUUID;
        await this.LUPA_CONTROLLER_INSTANCE.unfollowUser(userToUnfollow, this.props.lupa_data.Users.currUserData.user_uuid);
        
        const followers = this.state.followers;
        followers.splice(this.state.followers.indexOf(userToUnfollow), 1);
        await this.setState({
            followers: followers,
        })

        //TODO add redux update
    }

    /**
     * Allows the current user to choose an image from their camera roll and updates the profile picture in FB and redux.
     */
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
                await this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('photo_url', imageURL, "");
        
            }
        });
        //TODO
        //update in redux
        //await this.props.updateCurrentUsers()
    }

    /**
     * Handles refreshing the profile view.  Re renders the view with fresh data from FB.
     */
    handleOnRefresh = async () => {
        this.setState({ refreshing: true })
        await this.setupComponent()
        this.setState({ refreshing: false })
    }

    /**
     * Renders the user's bio.
     */
    mapBio = () => {
        //if current user viewing profile
        if (this.state.userUUID == this.props.lupa_data.Users.currUserData.user_uuid) {
            return (
                <Text allowFontScaling={true} allowsEditing={false} style={{  width: '100%', fontSize: 13,}}>
                {this.state.bio}
            </Text>
            )
        }
        else
        {
            return (
                <Text allowFontScaling={true} allowsEditing={false} style={{width: '100%', fontSize: 20, fontWeight: '400'}}>
                {this.state.bio}
            </Text>
            )
        }
    }


    /**
     * Navigates to the follower view.
     */
    _navigateToFollowers = () => {
        this.props.navigation.navigate('FollowerView');
    }

    /**
     * Navigates to the settings view.
     */
    _navigateToSettings = () => {
        this.props.navigation.navigate('UserSettingsView');
    }

    /**
     * Returns the length of this users followers or 0 if the property is null
     * @return this.state.followers.length Current length of this users followers
     */
    getFollowerLength = () => {
        if (this.state.followers.length) {
            return this.state.followers.length
        }
        else {
            return 0;
        }
    }

    /**
     * Returns the length of this users following or 0 if the property is null
     * @return this.state.following.length Current length of this users following
     */
    getFollowingLength = () => {
        if (this.state.following.length) {
            return this.state.following.length;
        } else {
            return 0;
        }
    }

    /**
     * Return the correct IconButtons for the left side of the header 
     * depending on where this page was navigated from.
     * 
     * DRAWER:
     * @return IconButton menu Opens the user drawer
     * @return IconButton arrow-back Navigates back
     * 
     * DEFAULT:
     * @return IconButton arrow-back Navigates back
     */
    getHeaderLeft = () => {
        if (this.props.lupa_data.Users.currUserData.user_uuid == this.state.userData.user_uuid) {
            return <MenuIcon customStyle={{margin: 10}} onPress={() => this.props.navigation.openDrawer()} />
        }

        return <FeatherIcon name="arrow-left" size={20} onPress={() => this.props.navigation.goBack(null)} />
    }

    /**
     * Return the correct IconButtons for the left side of the header 
     * depending on where this page was navigated from.
     * 
     * DRAWER:
     * @return IconButton more-horiz Navigates to settings
     * 
     * DEFAULT:
     * @return FeatherIcon plus-circle  Opens action sheet
     */
    getHeaderRight = () => {
        if (this.props.lupa_data.Users.currUserData.user_uuid == this.state.userData.user_uuid) {
            return (
                   null
            )
            
        }
        
        return null
    }

    renderInteractionView = () => {
            if (this.state.userData.user_uuid == this.props.lupa_data.Users.currUserData.user_uuid && this.props.lupa_data.Users.currUserData.isTrainer) {
                return (
                    <Text style={{fontSize: 12, fontWeight: '700', alignSelf: 'center', color: '#1089ff'}}>
                    Verified Trainer
                </Text>
                )
            } else if (this.state.userData.user_uuid == this.props.lupa_data.Users.currUserData.user_uuid) {
                return (
                <Text style={{fontSize: 12, fontWeight: '700', alignSelf: 'center', color: '#1089ff'}}>
                    Lupa User
                </Text>
                )
            } else if(this.state.userData.user_uuid != this.props.lupa_data.Users.currUserData.user_uuid) {
                return this.renderViewerInteractions()
            }
    }

    /**
     * Renders interactions if this is not the current user's profile such as Follow, Unfollow, and Send a message.
     * @return Returns a view that contains the Follow/Unfollow button as well as the button to send a message.
     */
    renderInteractions = () => {
        return this.props.lupa_data.Users.currUserData.user_uuid == this.state.userUUID ?
            null
            :
            <View style={{ width: Dimensions.get('window').width, margin: 10, padding: 10,alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                        <Button mode="contained" style={{padding: 3, margin: 10, width: "50%", elevation: 2 }} theme={{
                            roundness: 8,
                            colors: {
                                primary: 'white',
                            }
                        }}>
                            <Text>
                               Message
    </Text>
                        </Button>
            </View>
    }

    /**
     * Shows the profile view actoion sheet.
     */
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

    /**
     * Shows change rate modal
     */
    showChangeRateModal = () => {
        this.setState({ changeRateModalIsVisible: true })
    }

    /**
     * Closes change rate modal
     */
    closeChangeRateModal = () => {
        this.setState({ changeRateModalIsVisible: false })
    }

    /**
     * Renders this profile's avatar.
     * @return Returns this profile's avatar is there is a photo url for this user.  Otherwise returns an Avatar with an icon
     */
    getUserAvatar = () => {
        //if the user data in the state is undefined
        if (typeof(this.state.userData.photo_url) == undefined)
        {   //if the user data in the state is ""
            if (this.state.userData.photo_url == '')
            {   //if we are dealing with the current user return an avatar with an icon
                if (this.props.lupa_data.Users.currUserData.user_uuid == this.state.userData.user_uuid)
                {
                    return <Avatar.Icon size={65} icon={() => <FeatherIcon name="help-circle" color="#212121" size={65} />} style={{elevation: 3}} />
                }
                else
                {   //if we are dealing with another user return an avatar with an icon
                    return <Avatar.Icon size={65} icon={() => <FeatherIcon name="help-circle" color="#212121" size={65} />} style={{elevation: 3}} />
                }
            }
        }

        try {
            //if we are dealing with the current user use the photo_url from the redux store as it may update and return an editable avatar
            if (this.props.lupa_data.Users.currUserData.user_uuid == this._getId()) {
                return (
                    <Surface style={{elevation: 8, width: 65, height: 65, borderRadius: 65}}>
                         <ReactNativeElementsAvatar raised={true} rounded size={65} source={{ uri: this.props.lupa_data.Users.currUserData.photo_url }} showEditButton={true} onPress={this._chooseProfilePictureFromCameraRoll} />
                    </Surface>
                )
            }

            //if we are dealing with another user use the data from the state
            return <ReactNativeElementsAvatar rounded size={65} source={{ uri: this.state.userData.photo_url }} />
        }
        catch (err) {
            
            //if there is an error return an avatar with an icon
            return <Avatar.Icon size={65} icon={() => <FeatherIcon name="help-circle" color="#212121" size={65} />} style={{elevation: 3}} />
        }
    }

    /**
     * Renders this users location.
     * @return Returns a view containing this user's city and state.
     */
    getLocation = () => {
            return this.state.userData == this.props.lupa_data.Users.currUserData.user_uuid ?
                <View style={{alignItems: 'center', flexDirection: 'row'}}>

                                                <Text style={{ fontSize: 12, color: "#212121", fontWeight: "600", padding: 1 }}>
                                   {this.props.lupa_data.Users.currUserData.location.city + ", " + this.props.lupa_data.Users.currUserData.location.state}
                                </Text>
            </View>
            :
            <View style={{alignItems: 'center', flexDirection: 'row'}}>
                                                <Text style={{ fontSize: 12, color: "#212121", fontWeight: "600", padding: 1 }}>
                                   {this.state.userData.location.city+ ", " + this.state.userData.location.state}
                                </Text>
            </View>
    }

   
    /**
     * Renders the follow/unfollow button depending on if the current user follows this user
     */
    renderFollowButton = () => {
        if (this.state.userData)
        {
            if (this.props.lupa_data.Users.currUserData.user_uuid != this.state.userData.user_uuid)
            {
                return (
                    <View style={{width: '100%', margin: 5}}>
                        {
                                            this.state.followers.includes(this.props.lupa_data.Users.currUserData.user_uuid) ?
                                            <TouchableHighlight style={{borderRadius: 8}} onPress={() => this.LUPA_CONTROLLER_INSTANCE.unfollowUser(this.state.userData.user_uuid, this.props.lupa_data.Users.currUserData.user_uuid)}>
                                                                    <View style={{backgroundColor: '#1089ff', borderRadius: 8, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', width: '80%', height: 30}}>
                        <Text style={{color: 'white', fontWeight: '500'}}>
                            Unfollow
                        </Text>
                    </View>
                                            </TouchableHighlight>
                                            :
                                            <TouchableHighlight onPress={() => this.LUPA_CONTROLLER_INSTANCE.followUser(this.state.userData.user_uuid, this.props.lupa_data.Users.currUserData.user_uuid)}>
                                            <View style={{backgroundColor: '#1089ff', borderRadius: 8, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', width: '80%', height: 30}}>
<Text style={{color: 'white', fontWeight: '500'}}>
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

        /**
     * Renders the message button if this profile doesn't belong to the current user
     */
    renderMessageButton = () => {
        if (this.state.userData)
        {
            if (this.props.lupa_data.Users.currUserData.user_uuid != this.state.userData.user_uuid)
            {
                return (
                    <View style={{width: '100%', margin: 5}}>
                                            <TouchableHighlight onPress={() => this.props.navigation.navigate('PrivateChat', {
                                                currUserUUID: this.props.lupa_data.Users.currUserData.user_uuid,
                                                otherUserUUID: this.state.userData.user_uuid
                                            })}>
                                            <View style={{backgroundColor: '#1089ff', borderRadius: 8, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', width: '80%', height: 30}}>
<Text style={{color: 'white', fontWeight: '500'}}>
    Message
</Text>
</View>
                    
                    </TouchableHighlight>        
                    </View>    
                )
            }
        }
    }

    renderViewerInteractions = () => {
        return (
            <>
            <View style={{width: '100%', margin: 5}}>
                        {
                                            this.state.followers.includes(this.props.lupa_data.Users.currUserData.user_uuid) ?
                                            <TouchableHighlight style={{borderRadius: 8}} onPress={() => this.LUPA_CONTROLLER_INSTANCE.unfollowUser(this.state.userData.user_uuid, this.props.lupa_data.Users.currUserData.user_uuid)}>
                                                                    <View style={{backgroundColor: '#1089ff', borderRadius: 8, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', width: '80%', height: 30}}>
                        <Text style={{color: 'white', fontWeight: '500'}}>
                            Unfollow
                        </Text>
                    </View>
                                            </TouchableHighlight>
                                            :
                                            <TouchableHighlight onPress={() => this.LUPA_CONTROLLER_INSTANCE.followUser(this.state.userData.user_uuid, this.props.lupa_data.Users.currUserData.user_uuid)}>
                                            <View style={{backgroundColor: '#1089ff', borderRadius: 8, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', width: '80%', height: 30}}>
<Text style={{color: 'white', fontWeight: '500'}}>
    Follow
</Text>
</View>
                    
                    </TouchableHighlight>
                    }        
                    </View> 

                    <View style={{width: '100%', margin: 5}}>
                                            <TouchableHighlight onPress={() => this.props.navigation.navigate('PrivateChat', {
                                                currUserUUID: this.props.lupa_data.Users.currUserData.user_uuid,
                                                otherUserUUID: this.state.userData.user_uuid
                                            })}>
                                            <View style={{backgroundColor: '#1089ff', borderRadius: 8, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', width: '80%', height: 30}}>
<Text style={{color: 'white', fontWeight: '500'}}>
    Message
</Text>
</View>
                    
                    </TouchableHighlight>        
                    </View>  
                    </>  
        )
    }

    renderHourlyRate = () => {
        if (this.props.lupa_data.Users.currUserData.user_uuid == this.state.userData.user_uuid && this.state.userData.isTrainer) {
            return (
                <View style={{flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10}}>
                    <Text style={{fontSize: 12,paddingTop: 10, fontWeight: '500', fontFamily: 'HelveticaNeue-Light', color: '#212121'}}>
                             Your hourly rate is ${this.props.lupa_data.Users.currUserData.hourly_payment_rate}.
                         </Text>

                        <Text style={{paddingTop: 10}} onPress={this.showChangeRateModal}>
                            <Text style={{fontSize: 12, fontWeight: '600',  color: '#1089ff'}}>
                            Change Rate
                            </Text>
                             <FeatherIcon color='#1089ff' name="arrow-right" size={15} style={{paddingHorizontal: 10}} />
                         </Text>
                </View>
                
            )
        } else if (this.props.lupa_data.Users.currUserData.user_uuid != this.state.userData.user_uuid && this.state.userData.isTrainer) {
            return (
                <View style={{flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10}}>
                    <Text style={{fontSize: 12,paddingTop: 10, fontWeight: '600',  color: '#212121'}}>
                    {this.state.userData.display_name} has an hourly rate of ${this.state.userData.hourly_payment_rate}.
                         </Text>

                        <Text style={{paddingTop: 10}}>
                            <Text style={{fontSize: 12, fontWeight: '600',  color: '#1089ff'}}>
                            Book {this.state.userData.display_name}
                            </Text>
                             <FeatherIcon color='#1089ff' name="arrow-right" size={15} style={{paddingHorizontal: 10}} />
                         </Text>
                </View>
            )
        } else {
            return null
        }
    }

    /**
     * 
     */
    handleProgramOptionsOnPress = (program) => {
        this.setState({ programOptionsProgram: program}, () => {
            this.setState({ programOptionsModalIsOpen: true})
        })
    }

    /**
     * 
     */
    closeProgramOptionsModal = () => {
        this.setState({ programOptionsModalIsOpen: false })
    }

    /**
     * Renders this profiles programs.  Returns a ProfileProgramComponent is programs exist.  Otherwise returns a notice to join or create
     * a program depending on the account type.
     */
    mapTrainerPrograms = () => {
        //if we are dealing with the current user and current user is looking at profile their profile
        if (this.props.lupa_data.Users.currUserData.user_uuid == this.state.userData.user_uuid)
        {
            if (this.props.lupa_data.Users.currUserData.isTrainer) //is trainer
            {
                if (this.props.lupa_data.Programs.currUserProgramsData.length == 0 || typeof(this.props.lupa_data.Programs.currUserProgramsData) == 'undefined') {
                    return (
                        <Surface style={{alignSelf: 'center', padding: 20, backgroundColor: '#F2F2F2', elevation: 0, width: Dimensions.get('screen').width, }}>
                        <Text style={{fontSize: 15, fontWeight: '400'}}>
                            After you create your first workout program it will appear here.
                        </Text>
                        <Button mode="contained" style={{margin: 15, width: '60%', elevation: 0}} theme={{
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
    
                    )
                }

                    return this.props.lupa_data.Programs.currUserProgramsData.map((program, index, arr) => {
                        return (
                            <View style={{marginVertical: 10}}>   
                                <ProfileProgramCard programData={program} />
                            </View>
                        )
                    })
            }
            else //is not trainer
            {
                return (
                    <View>
                <View>
                    <ScrollView horizontal={true}>
                        {
                            this.state.nearbyUsers.map(trainer => {
                        
                                return (
                                    <Surface style={{elevation: 3, justifyContent: 'space-evenly', margin: 10, backgroundColor: '#FFFFFF', borderRadius: 10, width: 140, height: 160}}>
                                        <View style={{alignItems: 'center', flex: 2, justifyContent: 'space-evenly'}}>
                                            <Avatar.Image source={{uri: trainer.photo_url}} size={60} />

                                            <Text>
                                                {trainer.display_name}
                                            </Text>
                                        </View>

                                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                            <Button onPress={() => this.props.navigation.push('Profile', {
                                                userUUID: trainer.user_uuid
                                            })} style={{width: '80%'}} color="#1089ff" mode="contained" theme={{
                                                
                                            }}>
                                               <Text style={{fontSize: 10}}>
                                                   View Profile
                                               </Text>
                                            </Button>
                                        </View>
                                    </Surface>
                                )
                            })
                        }
                    </ScrollView>
                </View>
                    </View>

                )
            }
        }

        //if we are dealing with the non current user
        if (this.props.lupa_data.Users.currUserData.user_uuid != this.state.userData.user_uuid)
        {
            if (this.state.userData.isTrainer) 
            {
                if (this.state.userData.programs.length == 0 || typeof(this.state.userData.programs) == 'undefined')
                {
                    return (
                        <View>
                                                                    <View style={{padding: 20, backgroundColor: '#F2F2F2', width: Dimensions.get('window').width, justifyContent: 'center', alignItems: 'center'}}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                               <Text style={{fontSize: 13, fontWeight: '300', textAlign: 'center'}}>
                               This trainer has not created any programs.  Explore trainers and fitness programs on from the Lupa Home page.
                           </Text>
                                    </View>
                         
                                </View>

                                <View>
                                <ScrollView horizontal={true}>
                                    {
                                        this.state.nearbyUsers.map(trainer => {
                                    
                                            return (
                                                <Surface style={{elevation: 3, justifyContent: 'space-evenly', margin: 10, backgroundColor: '#FFFFFF', borderRadius: 10, width: 140, height: 160}}>
                                                    <View style={{alignItems: 'center', flex: 2, justifyContent: 'space-evenly'}}>
                                                        <Avatar.Image source={{uri: trainer.photo_url}} size={60} />

                                                        <Text>
                                                            {trainer.display_name}
                                                        </Text>
                                                    </View>

                                                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                                        <Button style={{width: '80%'}} color="#1089ff" mode="contained" theme={{
                                                            
                                                        }}>
                                                           <Text style={{fontSize: 10}}>
                                                               View Profile
                                                           </Text>
                                                        </Button>
                                                    </View>
                                                </Surface>
                                            )
                                        })
                                    }
                                </ScrollView>
                                </View>
                                </View>
                    )
                }

                return this.state.userData.programs.map((program, index, arr) => {
                    return (
                        <View style={{marginVertical: 10}}>  
                            <ProfileProgramCard programData={program} />
                        </View>
                    )
                })
            }
            else
            {
                return (
                    <View>
                    <View>
                        <ScrollView horizontal={true}>
                            {
                                this.state.nearbyUsers.map(trainer => {
                            
                                    return (
                                        <Surface style={{elevation: 3, justifyContent: 'space-evenly', margin: 10, backgroundColor: '#FFFFFF', borderRadius: 10, width: 140, height: 160}}>
                                            <View style={{alignItems: 'center', flex: 2, justifyContent: 'space-evenly'}}>
                                                <Avatar.Image source={{uri: trainer.photo_url}} size={60} />

                                                <Text>
                                                    {trainer.display_name}
                                                </Text>
                                            </View>

                                            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                                <Button style={{width: '80%'}} color="#1089ff" mode="contained" theme={{
                                                    
                                                }}>
                                                   <Text style={{fontSize: 10}}>
                                                       View Profile
                                                   </Text>
                                                </Button>
                                            </View>
                                        </Surface>
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                        </View>
                )
            }
        }
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Appbar.Header style={{ backgroundColor: 'white', elevation: 0, borderBottomColor: 'rgb(199, 199, 204)', borderBottomWidth: 0.8  }}>
                    <Left>
                        {this.getHeaderLeft()}
                    </Left>
                    
                    <Body>
                    <Text style={{fontFamily: 'HelveticaNeue-Bold', fontSize: 15, fontWeight: '600'}}>
                        {this.state.userData.username}
                    </Text>
                    </Body>

                    <Right>
                        {this.getHeaderRight()}
                    </Right>
                </Appbar.Header>
                {/* UserInfo Container */}
                            {/* Avatar/Following - Name/Bio-EditBioButton */}
                            <View style={{width: '100%',  flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between'}}>
                                {/* Avatar/Following */}
                                <View style={{flex: 1, height: Dimensions.get('window').height / 4, alignItems: 'center', justifyContent: 'space-evenly'}}>
                                    {this.getUserAvatar()}
                                    <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                                    <TouchableOpacity onPress={() => this._navigateToFollowers()}>
                                <View style={{alignItems: 'center'}}>
                                    <Text>
                                        {this.getFollowerLength()}
                                    </Text>
                                    <Text style={styles.userAttributeText}>
                                        Followers
                                </Text>
                                </View>

                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this._navigateToFollowers()}>
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
                                </View>

                                {/* Name/Bio */}
                                <View style={{flex: 1.5, height: Dimensions.get('window').height / 4, justifyContent: 'space-evenly'}}>
                                        <View>
                                            <View style={{paddingVertical: 10}}>
                                            <Text style={{fontSize: 15, fontFamily: 'HelveticaNeue-Bold'}}>
                                                Elijah Hampton
                                            </Text>
                                            <Text style={{fontSize: 12, fontFamily: 'HelveticaNeue-Light'}}>
                                                Auburn, AL
                                            </Text>
                                            </View>
                                            <Text style={{fontSize: 12, paddingRight: 2, fontFamily: 'HelveticaNeue', fontWeight: '400'}}>
                         {

                             this.state.userData.user_uuid == this.props.lupa_data.Users.currUserData.user_uuid ?
                             this.props.lupa_data.Users.currUserData.bio
                             :
                            this.state.userData.bio
                        
                            
                         }
                    
                                </Text>
                                        </View>
                                        
                                       {/* <View>
                                        
                                            <Button color="rgb(230, 230, 230)" theme={{roundness: 8}} style={{elevation: 0, color: '#212121', alignSelf: 'flex-start', width: '80%'}} uppercase={false} mode="contained">
                                                Edit Bio
                                            </Button>
                                       </View>*/}
                                </View>
                            </View>

                            <Divider />

                <ScrollView 
                contentContainerStyle={{ flexGrow: 1, backgroundColor: '#FFFFFF'}} 
                showsVerticalScrollIndicator={false} 
                shouldRasterizeIOS={true} 
                refreshControl={
                <RefreshControl refreshing={this.state.refreshing} 
                onRefresh={this.handleOnRefresh} />}>
                    
                        

                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    {
                                this.props.lupa_data.Users.currUserData.isTrainer ?
                                this.mapTrainerPrograms()
                                :
                                null
                            }
                    </View>
                        
                        <SafeAreaView />
                </ScrollView>
                        
                <ProgramOptionsModal program={this.state.programOptionsProgram} isVisible={this.state.programOptionsModalIsOpen} closeModal={this.closeProgramOptionsModal} />
                <ChangeHourlyRateModal isVisible={this.state.changeRateModalIsVisible} closeModal={this.closeChangeRateModal} />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    transparentBackground: {
        backgroundColor: "white",
    },
    userAttributeText: {
        fontSize: 10,
    },
    user: {
        flexDirection: "column",
    },
    userAttributesContainer: {
        width: '100%',
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-evenly", 
        backgroundColor: 'white',
        margin: 20
    },
    userInfoContainer: {
        width: '100%',
        backgroundColor: 'white'
    },
});

export default connect(mapStateToProps)(ProfileView);