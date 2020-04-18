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
    RefreshControl,
    Image,
    Button as NativeButton,
    ActionSheetIOS,
    TextInput,
    Dimensions,
    Modal,
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
    Right
} from 'native-base';

import {
    Avatar as ReactNativeElementsAvatar,
    Icon
} from 'react-native-elements';

import Timecards from './component/Timecards';

import { ImagePicker } from 'expo-image-picker';

import SafeAreaView from 'react-native-safe-area-view';

import LupaMapView from '../modal/LupaMapView'

import {
    CheckBox
} from 'react-native-elements';

import { withNavigation, NavigationActions } from 'react-navigation';
import LupaController from '../../../controller/lupa/LupaController';
import MyPacksCard from './component/MyPacksCard';

import { connect } from 'react-redux';

import ProfilePicture from '../../images/profile_picture1.jpeg';

import { Feather as FeatherIcon } from '@expo/vector-icons';
import { Pagination } from 'react-native-snap-carousel';

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
                    <Button onPress={() => this.handleDialogClose()}>Done</Button>
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

/**
 * Lupa Profile View
 * 
 * This view serves as the user profile for the current user to see only.  Any edits to the profile can be
 * made here.
 * 
 * TODO:
 * ADD EDIT, ADD, and DELETE buttons for content.  (The delete buttons will be mapped beside content in each content area.).
 * EVERYTHINGG SHOULD MAP FROM THE STATE NOT REDUX STORE
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

    _getId() {
        let id = false;
        if (this.props.userUUID) {
            id = this.props.userUUID;
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
        });
    }

    handleFollowUser = async () => {
        let userToFollow = this.state.userUUID;
        this.LUPA_CONTROLLER_INSTANCE.followUser(userToFollow, this.LUPA_CONTROLLER_INSTANCE.getCurrentUser().uid);
        await this.setupProfileInformation();
    }

    handleUnFollowUser = async () => {
        let userToUnfollow = this.state.userUUID;
        this.LUPA_CONTROLLER_INSTANCE.unfollowUser(userToUnfollow, this.LUPA_CONTROLLER_INSTANCE.getCurrentUser().uid);
        await this.setupProfileInformation();
    }

    _navigateToSessionsView = () => {
        this.props.navigation.navigate('SessionsView', {
            userUUID: this._getId
        });
    }

    _chooseProfilePictureFromCameraRoll = async () => {
        chosenProfileImage = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
        });

        if (!chosenImage.cancelled) {
            await this.setState({ profileImage: chosenProfileImage.uri });
        }

        let imageURL;
        //update in FB storage
        await this.LUPA_CONTROLLER_INSTANCE.saveUserProfileImage(this.state.profileImage).then(result => {
            imageURL = result;
        });

        //update in Firestore
        await this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('photo_url', imageURL);

        //update in redux
        //await this.props.updateCurrentUsers()
    }

    closeSettingsModal = () => {
        this.setState({ settingsModalIsOpen: false });
    }

    closeFollowerModal = () => {
        this.setState({ followerModalIsOpen: false });
    }

    mapInterest = () => {
        return this.state.interest.length == 0 ?
            <Caption>
                Specializations and strengths that you add to your fitness profile will appear here.
                                </Caption> : this.state.userData.interest.map(interest => {
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
        console.log(this.state.userUUID == this.props.lupa_data.Users.currUserData.user_uuid)
        if (this.state.userUUID == this.props.lupa_data.Users.currUserData.user_uuid) {
            return this.state.isEditingBio == false ?
                this.state.bio.length == 0 ?
                    <Caption>
                        Looks like you have nothing to say.
                </Caption>
                    :
                    <Text allowFontScaling={true} allowsEditing={false}>
                        {this.state.bio}
                    </Text>
                :
                <TextInput editable={true} multiline={true} autoGrow={true} value={this.state.bio} onChangeText={text => this.handleChangeBioText(text)} />
        }
        //if another user viewing profile
        else {
            return this.state.isEditingBio == false ?
                <Text allowFontScaling={true} allowsEditing={false}>
                    {
                        this.state.bio.length == 0 ?
                            <Caption>
                                This user hasn't setup a bio yet.
                </Caption>
                            :
                            this.state.bio
                    }
                </Text>
                :
                <TextInput editable={true} multiline={true} autoGrow={true} value={this.state.bio} onChangeText={text => this.handleChangeBioText(text)} />
        }
    }

    mapRecommendedWorkouts = () => {
        if (this.state.userRecommendedWorkouts.length == 0) {
            return <View>
                <Caption>
                    You don't have any recommended workouts saved!  You can recommend workouts from the workout library inside of your goal pathways.
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
            if (this.state.userData.sessions_reviews.length != 0)
            {
                let reviewData = this.state.userData.sessions_reviews;
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

    getHeaderLeft = () => {
       /* if (this.props.navigation.state.params.navFrom) {
            switch (this.props.navigation.state.params.navFrom) {
                case 'Drawer':
                    return <IconButton icon="menu" size={20} onPress={() => this.props.navigation.openDrawer()} />
                default:
                    return <IconButton icon="arrow-back" size={20} onPress={() => this.props.navigation.goBack(null)} />


            }
        }

        return <IconButton icon="arrow-back" size={20} onPress={() => this.props.navigation.goBack(null)} /> */
    }

    getHeaderRight = () => {
       /* if (this.props.navigation.state.params.navFrom) {
            switch (this.props.navigation.state.params.navFrom) {
                case 'Drawer':
                    return <IconButton icon="more-horiz" size={20} onPress={() => this._navigateToSettings()} />
                default:
                    return <FeatherIcon name="plus-circle" size={20} onPress={() => this._showActionSheet()} />
            }
        }*/
    }

    renderInteractions = () => {
        /*return this.props.lupa_data.Users.currUserData.user_uuid == this.state.userUUID ?
            <View style={{ padding: 10, width: '100%', alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row' }}>
            

                <Icon
                    name='inbox'
                    type='message'
                    color='#2196F3'
                    size={20}
                    raised
                    style={{ backgroundColor: "black", position: 'absolute', left: 0 }}
                    underlayColor={{ backgroundColor: "black" }}
                    reverseColor="white"
                    reverse
                    onPress={
                        () =>
                            this.props.navigation.dispatch(

                                NavigationActions.navigate({
                                    routeName: 'MessagesView',
                                    action: NavigationActions.navigate({ routeName: 'MessagesView' })
                                })
                            )
                    }
                />
            </View>
            :
            <View style={{ width: '100%', margin: 10, padding: 10,alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row' }}>

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
                                    otherUserUUID: this.props.navigation.state.params.userUUID
                                },
                                action: NavigationActions.navigate({
                                    routeName: 'PrivateChat', params: {
                                        currUserUUID: this.props.lupa_data.Users.currUserData.user_uuid,
                                        otherUserUUID: this.props.navigation.state.params.userUUID
                                    }
                                })
                            })
                        )

                    }
                />






                {
                    this.state.followers.includes(this.currUserUUID) ?

                        <Button onPress={() => this.handleUnFollowUser()} mode="contained" style={{ padding: 3, margin: 10, width: "auto", elevation: 8 }} theme={{
                            roundness: 20,
                            colors: {
                                primary: '#2196F3',
                                text: "white",
                            }
                        }}>
                            <Text>
                                Unfollow
</Text>
                        </Button>
                        :
                        <Button onPress={() => this.handleFollowUser()} mode="contained" style={{ padding: 3, margin: 10, width: "25%", elevation: 8 }} theme={{
                            roundness: 20,
                            colors: {
                                primary: 'white',
                                text: "#2196F3",
                            }
                        }}>
                            <Text>
                                Follow
    </Text>
                        </Button>
                }
            </View>

*/
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
        let display_name = "User Not Found";
        let firstInitial = "";
        let secondInitial = "";
        if (true && this.state.userData.display_name) {
            display_name = this.state.userData.display_name.split(" ");
            firstInitial = display_name[0].charAt(0);
            secondInitial = display_name[1].charAt(0);
        }

        if (this.state.profileImage == undefined && this.props.lupa_data.Users.currUserData.user_uuid == this.state.userData.user_uuid
            || this.state.profileImage == "" && this.props.lupa_data.Users.currUserData.user_uuid == this.state.userData.user_uuid) {
            return <Avatar.Text size={65} label={firstInitial + secondInitial} style={{ backgroundColor: "#212121" }} theme={{
                elevation: 3,
            }} />
        }

        try {
            if (this.props.lupa_data.Users.currUserData.user_uuid == this.currUserUUID) {
                return <ReactNativeElementsAvatar rounded size={65} source={{ uri: this.props.lupa_data.Users.currUserData.photo_url }} showEditButton={true} onPress={this._chooseProfilePictureFromCameraRoll} />
            }

            return <ReactNativeElementsAvatar rounded size={65} source={{ uri: this.state.profileImage }} />
        }
        catch (err) {
            return <Avatar.Text size={65} label={firstInitial + secondInitial} style={{ backgroundColor: "#212121" }} theme={{
                elevation: 3
            }} />
        }
    }

    render() {
        return (
            <Modal style={styles.container} presentationStyle="pageSheet" visible={this.props.isVisible}>
                <ScrollView>
                <Appbar.Header style={{ backgroundColor: "transparent" }}>
                    <Left>
                        {this.getHeaderLeft()}
                    </Left>

                    <Right>
                        {this.getHeaderRight()}
                    </Right>
                </Appbar.Header>

                <ScrollView contentContainerStyle={{ flexGrow: 2, flexDirection: 'column', justifyContent: 'space-between' }} showsVerticalScrollIndicator={false} shouldRasterizeIOS={true} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleOnRefresh} />}>
                    <View style={styles.user}>
                        <View style={styles.userInfoContainer}>
                            <View style={styles.userInfo}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', padding: 1 }}>
                                    {this.state.userData.display_name}
                                </Text>
                                <Text style={{ fontSize: 15, fontWeight: "600", padding: 1 }}>
                                    {this.state.userData.username}
                                </Text>
                                {
                                    true && this.state.userData.isTrainer ? <Text style={{ fontSize: 12, fontWeight: "500", color: "grey", padding: 2 }}>
                                        Lupa Trainer
                            </Text> : <Text style={{ fontSize: 12, fontWeight: "500", color: "grey", padding: 2 }}>
                                            Lupa User
                            </Text>
                                }
                            </View>
                            <View style={styles.alignCenterColumn}>
                                {this.getUserAvatar()}
                            </View>
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

                        {
                            this.renderInteractions()
                        }
                    </View>

                    <Divider />

                    <Timecards />

                    <Divider />
                    <>
                        <Surface style={styles.contentSurface}>
                            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Title>
                                    Bio
                        </Title>
                                {
                                    this.renderFinishEditingBioButton()
                                }

                            </View>
                            <Divider />
                            <View style={{ justifyContent: "flex-start", padding: 5 }}>
                                {
                                    this.mapBio()
                                }
                            </View>
                        </Surface>
                    </>

                    {/* interest mapping */}
                    <Surface style={[styles.contentSurface, { elevation: 8, backgroundColor: "#2196F3" }]}>
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontSize: 20, fontFamily: "avenir-medium", fontWeight: "bold" }}>
                                Fitness Interest and Goals
                                </Text>
                        </View>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'center' }}>
                            {
                                this.mapInterest()
                            }
                        </View>
                    </Surface>
                    {/*</View> */}


                    <View style={styles.myPacks}>
                        {this.state.userData.user_uuid == this.props.lupa_data.Users.currUserData.user_uuid ?
                            <Title>
                                My Packs
                            </Title>
                            :
                            <Title>
                                {this.state.userData.display_name}'s Packs
                        </Title>
                        }
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {this.mapPacks()}
                        </ScrollView>
                    </View>

                    <View style={styles.recommendedWorkouts}>
                        <View style={styles.recommendedWorkoutsHeader}>
                            <Title>
                                Recommended Workouts
                        </Title>
                        </View>
                        {
                            this.mapRecommendedWorkouts()
                        }
                    </View>

                    <Surface style={{ backgroundColor: "transparent", width: Dimensions.get('window').width }}>
                    {this.state.userData.user_uuid == this.props.lupa_data.Users.currUserData.user_uuid ?
                            <Title style={{marginLeft: 10}}>
                                My Reviews
                            </Title>
                            :
                            <Title style={{marginLeft: 10}}>
                                {this.state.userData.display_name}'s Session Review
                        </Title>
                        }
                        <View style={{ width: "100%", height: "auto", backgroundColor: "transparent", alignItems: "center", justifyContent: "center" }}>
                            <ScrollView horizontal centerContent contentContainerStyle={{}}>
                                <View style={{ flex: 1, width: "100%", backgroundColor: "transparent", justifyContent: "space-evenly" }}>
                                    {this.mapUserReviews()}
                                </View>
                            </ScrollView>
                            <Pagination dotsLength={this.state.sessionReviews.length} />
                        </View>
                    </Surface>

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
                <FAB
                    style={styles.fab}
                    small={false}
                    icon="today"
                    onPress={this._navigateToSessionsView}

                />
                {/*<InviteToPackDialog userToInvite={this.props.navigation.state.params.userUUID} userPacks={this.state.userPackData} isOpen={this.state.dialogVisible} closeModalMethod={this._hideDialog} />*/}
                </ScrollView>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
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
        margin: 10,
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
        flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", margin: 3
    },
    userAttributeText: {
        fontWeight: "bold"
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
        margin: 16,
        right: 0,
        bottom: 5,
        color: "#637DFF",
        backgroundColor: "#2196F3"
    },
    fab: {
        position: 'absolute',
        bottom: 0,
        marginBottom: 16, marginRight: 16,
        right: 0,
        backgroundColor: "#2196F3"
    },
});

export default connect(mapStateToProps)(withNavigation(ModalProfileView));

 /*  <Button mode="contained"
                    style={{ padding: 3, margin: 10, flex: 3, elevation: 8, alignSelf: "center" }}
                    onPress={() =>
                        this.props.navigation.dispatch(

                            NavigationActions.navigate({
                                routeName: 'MessagesView',
                                action: NavigationActions.navigate({ routeName: 'MessagesView' })
                            })
                        )
                    }
                    theme={{
                        roundness: 20,
                        colors: {
                            primary: "#2196F3"
                        }
                    }}>
                    <Text>
                        View Messages
</Text>
                </Button>*/

                
                    /*

                    <Button onPress={() =>
                    this.props.navigation.dispatch(

                        NavigationActions.navigate({
                            routeName: 'PrivateChat',
                            params: {
                                currUserUUID: this.props.lupa_data.Users.currUserData.user_uuid,
                                otherUserUUID: this.props.navigation.state.params.userUUID
                            },
                            action: NavigationActions.navigate({
                                routeName: 'PrivateChat', params: {
                                    currUserUUID: this.props.lupa_data.Users.currUserData.user_uuid,
                                    otherUserUUID: this.props.navigation.state.params.userUUID
                                }
                            })
                        })
                    )
                }
                    mode="contained"
                    style={{ padding: 3, margin: 10, flex: 3, elevation: 8 }}
                    theme={{
                        roundness: 20,
                        colors: {
                            primary: "#2196F3"
                        }
                    }}>
                    <Text>
                        Send a Message
</Text>
                </Button>



----------------------

<Button onPress={() => this.handleFollowUser()} mode="contained" style={{ padding: 3, margin: 10, flex: 1, elevation: 8 }} theme={{
                            roundness: 20,
                            colors: {
                                primary: 'white',
                                text: "#2196F3",
                            }
                        }}>
                            <Text>
                                Follow
    </Text>
                        </Button>
                    */