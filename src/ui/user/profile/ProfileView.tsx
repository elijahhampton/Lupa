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
    TouchableWithoutFeedback,
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
    Body,
} from 'native-base';

import {
    Avatar as ReactNativeElementsAvatar,
    Icon,
    CheckBox
} from 'react-native-elements';

import ImagePicker from 'react-native-image-picker';

import { connect, useDispatch} from 'react-redux';
import { withNavigation, NavigationActions } from 'react-navigation';

import ServicedComponent from '../../../controller/lupa/interface/ServicedComponent';
import LupaController from '../../../controller/lupa/LupaController';

import ThinFeatherIcon from "react-native-feather1s";
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import MyPacksCard from './component/MyPacksCard';
import ProgramProfileComponent from '../../workout/program/createprogram/component/ProgramProfileComponent';
import { getLupaUserStructure } from '../../../controller/firebase/collection_structures';
import { LupaUserStructure, LupaPackStructure } from '../../../controller/lupa/common/types';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state
    }
}

const COLORS_LIST = [
    {
        background: '#e57373',
        accent: '#f44336'
    },
    {
        background: '#7986CB',
        accent: '#3F51B5'
    },
    {
        background: '#64B5F6',
        accent: '#2196F3'
    },
    {
        background: '#4DB6AC',
        accent: '#009688'
    },
    {
        background: '#FFF176',
        accent: '#FFEB3B'
    },
    {
        background: '#FFB74D',
        accent: '#FF9800',
    },
    {
        background: '#FF8A65',
        accent: '#FF5722',
    },
    {
        background: '#90A4AE',
        accent: '#607D8B',
    }
]

const ICONS_LIST = [
    {
        icon: 'notifications',
        iconType: 'material'
    },
    {
        icon: 'directions-run',
        iconType: 'material'
    },
    {
        icon: 'fitness-center',
        iconType: 'material'
    },
    {
        icon: 'heart',
        iconType: 'material'
    },
    {
        icon: 'local-hospital',
        iconType: 'material'
    },
    {
        icon: 'kitchen',
        iconType: 'material'
    },
    {
        icon: 'activity',
        iconType: 'feather'
    },
    {
        icon: 'alert-circle',
        iconType: 'feather'
    },
    {
        icon: 'eye',
        iconType: 'feather'
    },
    {
        icon: 'home',
        iconType: 'feather'
    },
    {
        icon: 'phone',
        iconType: 'feather'
    },
    {
        icon: 'tablet',
        iconType: 'feather'
    },
    {
        icon: 'message-circle',
        iconType: 'feather'
    },
]

/*
function CreateServiceDialog(props) {
    let [serviceName, setServiceName] = useState("");
    let [serviceDescription, setServiceDescription] = useState("");
    let [serviceColors, setServiceColors] = useState([]);
    let [iconName, setIconName] = useState("");
    let [iconType, setIconType]  = useState("");
    let [currIconPressed, setCurrentIconPressed] = useState("");
    let [currColorPressed, setCurrentColorPresssed] = useState("")
    let [serviceNameError, setServiceNameError] = useState(false)
    let [serviceDescriptionError, setServiceDescriptionError] = useState(false)
    let [showSnack, setShowSnack] = useState(false);
    let [rejectedReason, setRejectedReason] = useState("");

    const dispatch = useDispatch();

    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const createService = async (serviceName, serviceDescription, iconName, iconType, serviceColors) => {
        const USER_SERVICE = await getLupaTrainerService(serviceName, serviceDescription, iconName, iconType, serviceColors);

        //add to local copy
        await dispatch({type: 'ADD_CURRENT_USER_SERVICE', payload: USER_SERVICE })

        //add to firebase
        LUPA_CONTROLLER_INSTANCE.createService(USER_SERVICE);
    }

    const _onDismissSnackBar = () => {
        setShowSnack(false)
    }

    const handleCreateServiceOnPress = () => {
        if (serviceName == "" || serviceName.length > 15 || serviceName.length <= 7)
        {
            setServiceNameError(true)
            setRejectedReason("Invalid service name.  The service name must be between 8 - 15 characters.")
            setShowSnack(true)
            return;
        }
        else
        {
            setServiceNameError(false);
        }

        //TODO: Check for invalid characters

        if (serviceDescription == "" || serviceDescription.length > 120 || serviceDescription.length < 20)
        {
            setServiceDescriptionError(true)
            setRejectedReason("Invalid service description.  The service description must be between 20 - 120 characters.")
            setShowSnack(true)
            return;
        }
        else
        {
            setServiceDescriptionError(false);
        }

        //TODO: Check for invalid characters

        //check color
        if (currIconPressed == "")
        {
            setShowSnack(true);
            setRejectedReason("Sorry you must pick an icon for your service.")
            return;
        }


        //check icon
        if (currColorPressed == "")
        {
            setShowSnack(true);
            setRejectedReason("Sorry you must pick a color for your service.")
            return;
        }


        createService(serviceName, serviceDescription, iconName, iconType, serviceColors);

        props.closeDialogMethod()
    }

    const handleClickColor = (colors) => {
        setCurrentColorPresssed(colors.background);
        let colorsArr = [colors.accent, colors.background];
        setServiceColors(colorsArr);
    }

    const handleIconClick = icon => {
        setCurrentIconPressed(icon.icon)
        setIconName(icon.icon);
        setIconType(icon.iconType);
    }

    return (
        <Dialog dismissable={true} onDismiss={props.closeDialogMethod} visible={props.isVisible} style={{alignSelf: 'center', width: Dimensions.get('window').width - 30, height: Dimensions.get('window').height - 300}}>
            <View style={{flex: 1, justifyContent: 'space-between'}}>
                <View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}> 
            <Surface style={{elevation: 3, margin: 10, alignItems: 'center', justifyContent: 'center', width: 45, height: 45, borderRadius: 50, backgroundColor: '#BBDEFB'}}>
                <FeatherIcon name="shield" color="#1976D2" size={25} />
            </Surface>
            <Text style={{fontSize: 20, fontFamily: 'ARSMaquettePro-Bold'}}>
                Create a Service
            </Text>
            </View>
            <Text style={{alignSelf: 'center', padding: 10 }}>
                Create services offering without going through the hassle of creating a full workout program.  Services can range from anything such as as consultations to free trials for the programs you create.
            </Text>
                </View>

            <View style={{width: '100%', justifyContent: 'space-between'}}>
                <TextInput  
                    value={serviceName} 
                    onChangeText={text => setServiceName(text)} 
                    mode="flat" 
                    placeholder="Service Name (Ex. Consultation)" 
                    label="Service Name" 
                    style={{margin: 10}}
                    theme={{
                        colors: {
                            primary: '#212121'
                        }
                    }}
                    error={serviceNameError}
                    />
                <TextInput 
                    value={serviceDescription} 
                    onChangeText={text => setServiceDescription(text)} 
                    multiline mode="flat" 
                    placeholder="Service Description" 
                    label="Service Description" 
                    style={{margin: 10}}
                    theme={{
                        colors: {
                            primary: '#212121'
                        }
                    }}
                    error={serviceDescriptionError}
                     />
            </View>

            <View style={{padding: 8}}>
                <Text style={{fontFamily: 'ARSMaquettePro-Medium', fontSize: 18}}>
                    Pick a color
                </Text>
                <View style={{padding: 10, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                    {
                        COLORS_LIST.map(color => {
                            return (
                                <TouchableWithoutFeedback onPress={ () => handleClickColor(color)} style={{backgroundColor: 'transparent'}}>
                                    <Surface style={{margin: 3, elevation: 2, borderRadius: 20, width: 20, height: 20, backgroundColor: color.background, borderColor: currColorPressed == color.background ? '#212121' : 'transparent', borderWidth: 1}} />
                                </TouchableWithoutFeedback>
                            )
                        })
                    }
                </View>
            </View>

            <View style={{padding: 8, }}>
                <Text style={{fontFamily: 'ARSMaquettePro-Medium', fontSize: 18}}>
                    Pick an icon
                </Text>
                <View style={{padding: 10, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', flexWrap: 'wrap'}}>
                    {
                        ICONS_LIST.map(icon => {
                            if (icon.iconType == "material")
                            {
                                return (
                                    <TouchableWithoutFeedback  onPress={() => handleIconClick(icon)} style={{borderRadius: 20, padding: 5}}>
                                                                            <MaterialIcon key={icon.icon} name={icon.icon} size={20} style={{backgroundColor: currIconPressed == icon.icon ? 'rgb(174,174,178)' : 'transparent', borderRadius: 20}} />
                                    </TouchableWithoutFeedback >
                                )
                            }   
                            else if (icon.iconType == "feather")
                            {
                                return (
                                    <TouchableWithoutFeedback  onPress={() => handleIconClick(icon)} style={{borderRadius: 20, padding: 5}}>
                                                                            <FeatherIcon key={icon.icon} name={icon.icon} size={20} style={{backgroundColor: currIconPressed == icon.icon ? 'rgb(174,174,178)' : 'transparent', borderRadius: 20}}/>
                                    </TouchableWithoutFeedback >
                                )
                            }

                        })
                    }
                </View>
            </View>

            <View style={{alignSelf: 'flex-end', width: '100%', padding: 10, backgroundColor: 'rgb(174,174,178)'}}>
            <Button mode="contained" style={{width: '30%', alignSelf: 'flex-end'}} theme={{
                colors: {
                    primary: '#2196F3'
                }
            }}
            onPress={() => handleCreateServiceOnPress()}>
                Create
            </Button>
</View>
            </View>
            <Snackbar
          style={{backgroundColor: '#212121'}}
          theme={{ colors: { accent: '#2196F3' }}}
          visible={showSnack}
          onDismiss={() => _onDismissSnackBar}
          action={{
            label: 'Okay',
            onPress: () => setShowSnack(false),
          }}
        >
          {rejectedReason}
        </Snackbar>
        </Dialog>
    )
}*/

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
    showCreateServiceDialog: Boolean,
    refreshing: Boolean,
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
            userData: {},
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
            showCreateServiceDialog: false,
            refreshing: false,
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
       // await this.generateSessionReviewData();
    }

    /**
     * Returns the ID retrieved from navigating to this view.  Verifies that the ID exist first.
     * @return id the uuid returned from this.props.navigation
     */
    _getId() {
        let id = false;
        if (this.props.navigation.state.params) {
            id = this.props.navigation.state.params.userUUID;
        }
        return id;
    }

    /**
     * Loads any necessary data the component needs to render.
     */
    setupComponent = async () => {
        let userInfo, userPackData, profileImageIn;
        const uuid = await this._getId();
        this.currUserUUID = await this.LUPA_CONTROLLER_INSTANCE.getCurrentUser().uid;

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
                userPackData = []
            }
        }
        catch (err) {
            userPackData = this.props.lupa_data.Packs.currrUserPackData;
        }

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

    mapPacks = () => {
        return this.state.userPackData.map(pack => {
            return (
                <MyPacksCard packUUID={pack.id} packTitle={pack.pack_title} />
            )
        })
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

    /**
     * Generates user session review data from FB.
     */
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

    /**
     * Renders user review data.
     */
   /* mapUserReviews = () => {
        return this.state.sessionReviews.length == 0 ?
        this.props.lupa_data.Users.currUserData.user_uuid == this.state.userData.user_uuid ?
        <Caption style={{marginLeft: 5, alignSelf: 'flex-start'}}>
            You have no session reviews.
        </Caption>
        :
        <Caption style={{marginLeft: 5, alignSelf: 'flex-start'}}>
            This user has no session reviews.
        </Caption>
        :
        this.state.sessionReviews.map(review => {
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

                <NativeButton title="See Review" onPress={() => console.log('User Review')}/>
            </View>
            )
        })
    }
*/

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
        if (this.props.navigation.state.params.navFrom) {
            switch (this.props.navigation.state.params.navFrom) {
                case 'Drawer':
                    return <IconButton icon="menu" size={20} onPress={() => this.props.navigation.openDrawer()} />
                default:
                    return <IconButton icon="arrow-back" size={20} onPress={() => this.props.navigation.goBack(null)} />


            }
        }

        return <IconButton icon="arrow-back" size={20} onPress={() => this.props.navigation.goBack(null)} />
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
        if (this.props.navigation.state.params.navFrom) {
            switch (this.props.navigation.state.params.navFrom) {
                case 'Drawer':
                    return ( 
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                <IconButton icon="more-horiz" size={20} onPress={() => this._navigateToSettings()} />
                        </View>
                    )
                default:
                    return <FeatherIcon name="plus-circle" size={20} onPress={() => this._showActionSheet()} />
            }
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
            </View>


    }

    /**
     * Shows invite to pack dialog.
     */
    _showDialog = () => this.setState({ dialogVisible: true });

    /**
     * Hides invite to pack dialog.
     */
    _hideDialog = () => this.setState({ dialogVisible: false });

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
                       // this._showDialog();
                        break;
                    case 1:
                        break;
                    default:
                }
            });
    }

    /**
     * Renders this profile's avatar.
     * @return Returns this profile's avatar is there is a photo url for this user.  Otherwise returns an Avatar with the user's initials.
     */
    getUserAvatar = () => {
        let display_name = "User Not Found";
        let firstInitial = "";
        let secondInitial = "";
        if (true && this.state.userData.display_name) {
            display_name = this.state.userData.display_name.split(" ");
            firstInitial = display_name[0].charAt(0);
            secondInitial = display_name[1].charAt(0);
        }

        if (this.state.userData.photo_url == undefined && this.props.lupa_data.Users.currUserData.user_uuid == this.state.userData.user_uuid
            || this.state.userData.photo_url == "" && this.props.lupa_data.Users.currUserData.user_uuid == this.state.userData.user_uuid) {
            return <Avatar.Text size={65} label={firstInitial + secondInitial} style={{ backgroundColor: "#212121", elevation: 3 }} />
        }

        try {
            if (this.props.lupa_data.Users.currUserData.user_uuid == this._getId()) {
                return (
                    <Surface style={{elevation: 8, width: 65, height: 65, borderRadius: 65}}>
                         <ReactNativeElementsAvatar raised={true} rounded size={65} source={{ uri: this.props.lupa_data.Users.currUserData.photo_url }} showEditButton={true} onPress={this._chooseProfilePictureFromCameraRoll} />
                    </Surface>
                )
            }

            return <ReactNativeElementsAvatar rounded size={65} source={{ uri: this.state.userData.photo_url }} />
        }
        catch (err) {
            return <Avatar.Text  size={65} label={firstInitial + secondInitial} style={{ backgroundColor: "#212121", elevation: 3 }} />
        }
    }

    /**
     * Renders this users location.
     * @return Returns a view containing this user's city and state.
     */
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

    /**
     * Renders this profiles programs.  Returns a ProfileProgramComponent is programs exist.  Otherwise returns a notice to join or create
     * a program depending on the account type.
     */
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
        
                                }} onPress={() => this.props.navigation.navigate('Programs')}>
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
        
                                }} onPress={() => this.props.navigation.navigate('Programs')}>
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
    
    /*
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
          return this.state.userData.services.map(service => {
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
       
    }*/

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <SafeAreaView />
                <Appbar.Header style={{ backgroundColor: "transparent", margin: 10 }}>
                    <Left>
                        {this.getHeaderLeft()}
                    </Left>

                    <Body>
                        <Text>
                        { this.state.userData.username}
                        </Text>
                    </Body>


                    <Right>
                        {this.getHeaderRight()}
                    </Right>
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
                        {
                            this.renderFollowButton()
                        }
                            </View>
                            
                            <View style={{flex: 3, alignItems: 'flex-start'}}>
                                <View style={{justifyContent: 'flex-start'}}>
                                <Text style={{ fontSize: 15, color: "#212121", fontWeight: 'bold', padding: 1 }}>
                                    {this.state.userData.display_name}
                                </Text>
                                {
                                    this.getLocation()
                                }
                                </View>
                                <View style={{flex: 1, alignItems: 'flex-start', width: '100%'}}>
                                                                            <Paragraph style={{paddingVertical: 10, fontSize: 12}}>
                         {
                             this.state.userData.user_uuid == this.props.lupa_data.Users.currUserData.user_uuid ?
                             this.props.lupa_data.Users.currUserData.bio
                             :
                             this.state.userData.bio
                         }
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


                        {
                            this.renderInteractions()
                        }

                        <Divider style={{marginVertical: 5}} />

                        <View style={styles.transparentBackground}>
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
                    </View>
                        
                        <SafeAreaView />
                </ScrollView>

    

            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F2F2F2",
    },
    transparentBackground: {
        backgroundColor: "transparent",
    },
    userAttributeText: {
        fontSize: 10,
    },
    user: {
        flexDirection: "column",
        margin: 0,
        backgroundColor: "transparent"
    },
    userAttributesContainer: {
        width: '100%',
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-evenly", margin: 20
    },
    userInfoContainer: {
        width: '100%',
    },
});

export default connect(mapStateToProps)(withNavigation(ProfileView));