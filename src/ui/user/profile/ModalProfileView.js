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
    Divider,
    Portal,
    FAB,
    Dialog,
    Chip,
    Appbar,
} from 'react-native-paper';

import {
    Fab,
    Header,
    Left,
    Body,
    Right
} from 'native-base';

import {
    Avatar as ReactNativeElementsAvatar,
    Icon
} from 'react-native-elements';

import Timecards from './component/Timecards';

import ImagePicker from 'react-native-image-picker';

import LupaMapView from '../modal/LupaMapView'

import {
    CheckBox
} from 'react-native-elements';

import { withNavigation, NavigationActions } from 'react-navigation';
import LupaController from '../../../controller/lupa/LupaController';
import MyPacksCard from './component/MyPacksCard';

import { connect } from 'react-redux';

import ProfilePicture from '../../images/profile_picture1.jpeg';

import ProgramListComponent from '../../workout/component/ProgramListComponent'

import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { Pagination } from 'react-native-snap-carousel';
import { Constants } from 'react-native-unimodules';
import ProgramProfileComponent from '../../workout/program/components/ProgramProfileComponent';

let chosenHeaderImage;
let chosenProfileImage;

const InviteToPackDialog = props => {
    const [userToInvite, setUserToInvite] = useState(props.userToInvite);
    const [checked, setChecked] = useState(false);
    const [packsToInvite, setPacksToInvite] = useState([]);

    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    _handlePacksToInvite = (uuid) => {
        let updatedPacks = packsToInvite;
        updatedPacks.push(uuid);
        setPacksToInvite(updatedPacks);
        setChecked(true);
    }

    handleDialogClose = () => {
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
                                        onPress={() => this._handlePacksToInvite(pack.id)} />

                                    <Text>
                                        {pack.pack_title}
                                    </Text>
                                </View>
                            )
                        })
                    }
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => this.handleDialogClose()}>Invite</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

const USER_INTEREST = [
        'Improve Strength',
        'Improve Power',
        'Improve Endurance',
        'Improve Speed',
        'Improve Flexibility',
        'Improve Agility'
]

const UpdateInterestDialog = props => {
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    let [fitnessInterest, setFitnessInterest] = useState([]);


    handleDialogClose = () => {
        LUPA_CONTROLLER_INSTANCE.updateCurrentUser('interest_arr', fitnessInterest);
        props.closeModalMethod();
    }

    handleChipSelection = async (interest) => {
        let interestArr = fitnessInterest;
        await interestArr.includes(interest) ? 
            interestArr.splice(interestArr.indexOf(interest), 1) 
            : 
            interestArr.push(interest);

            await setFitnessInterest(interestArr)
    }

    getChipMode = (interest) => {
        return fitnessInterest.includes(interest) ? "flat" : "outlined"
    }

    return (
        <Portal>
            <Dialog
                visible={props.isOpen}
                onDismiss={props.closeModalMethod}
                style={{borderRadius: 15, backgroundColor: "#212121"}}>
                <Dialog.Title style={{color: 'white'}}> Update Interest </Dialog.Title>
                <Dialog.Content>
                    <ScrollView contentContainerStyle={{flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center'}}>
                        {
                            USER_INTEREST.map(interest => {
                                return (
                                    <Chip 
                                        mode={getChipMode(interest)} onPress={() => handleChipSelection(interest)} 
                                        textStyle={fitnessInterest.includes(interest) ? [styles.selectedChipText] : [styles.unselectedChipText]} 
                                        style={fitnessInterest.includes(interest) ? [styles.selectedChip, styles.selectedChipText] : [styles.unselectedChip, styles.unselectedChipText]}
                                        >
                                        {interest}
                                    </Chip>
                                )
                            })
                        }
                    </ScrollView>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button color="rgba(30,136,229 ,1)" onPress={() => this.handleDialogClose()} theme={{
                        colors: {
                            primary: "rgba(30,136,229 ,1)"
                        }
                    }}>Update</Button>
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
        await this.generateSessionReviewData();
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

        let workouts = userInfo.recommended_workouts;
        let workoutData = [];
        for (let i = 0; i < workouts.length; i++) {
            await this.LUPA_CONTROLLER_INSTANCE.getWorkoutDataFromUUID(workouts[i]).then(result => {
                workoutData.push(result);
            })
        }

        this.currUserUUID = await this.LUPA_CONTROLLER_INSTANCE.getCurrentUser().uid;

        await this.setState({
            userData: userInfo,
            userUUID: uuid,
            userPackData: userPackData,
            followers: userInfo.followers,
            following: userInfo.following,
            interest: userInfo.interest,
            userRecommendedWorkouts: workoutData,
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
            return this.state.isEditingBio == false ?
                this.state.bio.length == 0 ?
                    null
                    :
                    <Text allowFontScaling={true} allowsEditing={false} style={{width: '100%', fontSize: 11, fontWeight: '400'}}>
                        {this.state.bio}
                    </Text>
                :
                <TextInput maxLength={150} editable={true} multiline={true} autoGrow={true} value={this.state.bio} onChangeText={text => this.handleChangeBioText(text)} />
        }
        //if another user viewing profile
        else {
            return this.state.isEditingBio == false ?
                this.state.bio.length == 0 ?
                null
                :
                <Text allowFontScaling={true} allowsEditing={false}>
                    {this.state.bio}
                </Text>
                :
                <TextInput editable={true} multiline={true} autoGrow={true} value={this.state.bio} onChangeText={text => this.handleChangeBioText(text)} />
        }
    }

    mapRecommendedWorkouts = () => {
        if (this.state.userRecommendedWorkouts.length == 0) {
            return <View>
                <Caption>
                    You don't have any recommended workouts saved!  You can recommend workouts from the workout library located on in the workout home.
</Caption>
            </View>
        }
        else {
            return (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {
                        this.state.userRecommendedWorkouts.map(workout => {
                            return (<Button mode="text" compact color="black">
                                {workout.workout_name}
                            </Button>
                            )
                        })

                    }
                </ScrollView>
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

    mapUserReviews = () => {
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
        })
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

    renderInteractions = () => {
        return this.props.lupa_data.Users.currUserData.user_uuid == this.state.userUUID ?
            null
            :
            <View style={{ width: Dimensions.get('window').width, margin: 10, padding: 10,alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                {
                    this.state.followers.includes(this.props.lupa_data.Users.currUserData.user_uuid) ?

                        <Button onPress={() => this.handleUnFollowUser()} mode="contained" style={{padding: 3, margin: 10, width: "50%", elevation: 8 }} theme={{
                            roundness: 20,
                            colors: {
                                primary: '#2196F3',
                            }
                        }}>
                            <Text>
                                Unfollow
</Text>
                        </Button>
                        :
                        <Button onPress={() => this.handleFollowUser()} mode="contained" style={{padding: 3, margin: 10, width: "50%", elevation: 8 }} theme={{
                            roundness: 20,
                            colors: {
                                primary: 'white',
                            }
                        }}>
                            <Text>
                                Follow
    </Text>
                        </Button>
                }

<Icon
                    name='send'
                    type='feather'
                    color='#2196F3'
                    size={20}
                    raised
                    reverseColor="white"
                    reverse
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

    _showDialog = () => this.setState({ dialogVisible: true });

    _hideDialog = () => this.setState({ dialogVisible: false });

    _showActionSheet = () => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ['Invite To Pack', 'Cancel'],
                cancelButtonIndex: 1,
            }, (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        this._showDialog();
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
        
                                }}>
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
                                 <ProgramProfileComponent programData={program} />
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
        
                                }}>
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
        
                                }}>
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
                                 <ProgramProfileComponent programData={program} />
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

    render() {
        return (
            <Modal presentationStyle="fullScreen" style={styles.container} visible={this.props.isVisible} animated={true} animationType="slide">
                <ScrollView contentContainerStyle={{marginTop: Constants.statusBarHeight}}>
                <NativeButton style={{alignSelf: 'center'}} title="Done" onPress={this.props.closeModalMethod}/>
                <Appbar.Header style={{ backgroundColor: "transparent", margin: 10 }}>

                    <Appbar.Content title={this.state.userData.username} />
                </Appbar.Header>

                <ScrollView contentContainerStyle={{ flexGrow: 2, flexDirection: 'column', justifyContent: 'space-between' }} showsVerticalScrollIndicator={false} shouldRasterizeIOS={true} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleOnRefresh} />}>
                    <View style={styles.user}>
                        <View style={styles.userInfoContainer}>
                            <View style={[{width: '70%'}, styles.userInfo]}>
                                <Text style={{ fontSize: 15, color: "#212121", fontWeight: 'bold', padding: 1 }}>
                                    {this.state.userData.display_name}
                                </Text>
                                {
                                    this.getLocation()
                                }
                                {
                                    true && this.state.userData.isTrainer ? <Text style={{ fontSize: 12, fontWeight: "500", color: "grey", padding: 2 }}>
                                        Lupa Trainer
                            </Text> : null
                                }
                            </View>
                            <View style={[{width: '30%'}, styles.alignCenterColumn]}>
                                {this.getUserAvatar()}
                            </View>
                        </View>

                        <View style={{alignSelf: 'center', margin: 0, padding: 5, width: '85%', alignItems: 'center', justifyContent: 'center'}}>
                        {
                                         this.mapBio()
                                    }
                        </View>

                        <View style={styles.userAttributesContainer}>
                            <TouchableOpacity onPress={() => this._navigateToFollowers()}>
                                <View style={styles.alignCenterColumn}>
                                    <Text>
                                        {this.getFollowerLength()}
                                    </Text>
                                    <Text style={styles.userAttributeText}>
                                        Followers
                                </Text>
                                </View>

                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this._navigateToFollowers()}>
                                <View style={styles.alignCenterColumn}>
                                    <Text>
                                        {this.getFollowingLength()}
                                    </Text>
                                    <Text style={styles.userAttributeText}>
                                        Following
                                </Text>
                                </View>
                            </TouchableOpacity>



                        </View>

                        <Timecards userUUID={this._getId()} />

                        {
                            this.renderInteractions()
                        }

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
                    }


                    </View>
                        
                        <SafeAreaView />

                    {
                        this.state.userData.isTrainer == true ?
                            <View style={styles.recommendedWorkouts}>
                                <View style={styles.recommendedWorkoutsHeader}>
                                    <Title>
                                        Certification
                                            </Title>
                                </View>
                                <Caption style={{ flexWrap: 'wrap' }}>
                                    This user is a certified trainer under the {this.state.userData.certification}
                                </Caption>
                            </View>
                            :
                            null
                    }
                </ScrollView>
                
                <InviteToPackDialog userToInvite={this._getId()} userPacks={this.state.userPackData} isOpen={this.state.dialogVisible} closeModalMethod={this._hideDialog} />
                <UpdateInterestDialog userToUpdate={this._getId()} isOpen={this.state.fitnessInterestDialogOpen} closeModalMethod={this.closeFitnessInterestDialog}/>
            </ScrollView>
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
        flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", margin: 20
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