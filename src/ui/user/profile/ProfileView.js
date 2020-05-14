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
    ImageBackground,
    RefreshControl,
    Image,
    Button as NativeButton,
    ActionSheetIOS,
    TextInput,
    Dimensions,
    SafeAreaView
} from "react-native";

import {
    IconButton,
    Title,
    Surface,
    Button,
    Caption,
    Avatar,
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
    Fab,
    Header,
    Left,
    Body,
    Right
} from 'native-base';

import {
    Avatar as ReactNativeElementsAvatar,
    Icon,
    Button as ElementsButton,
} from 'react-native-elements';

import { LinearGradient } from 'expo-linear-gradient';

import Timecards from './component/Timecards';

import { ImagePicker } from 'expo-image-picker';

import LupaMapView from '../modal/LupaMapView'

import ThinFeatherIcon from "react-native-feather1s";

import {
    CheckBox
} from 'react-native-elements';

import { withNavigation, NavigationActions } from 'react-navigation';
import LupaController from '../../../controller/lupa/LupaController';
import MyPacksCard from './component/MyPacksCard';

import { connect, useDispatch} from 'react-redux';

import ProfilePicture from '../../images/profile_picture1.jpeg';

import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { Pagination } from 'react-native-snap-carousel';
import ProgramListComponent from '../../workout/component/ProgramListComponent';
import FollowerModal from './modal/FollowerModal';

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
class ProfileView extends React.Component {
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
            showCreateServiceDialog: false,
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
        if (this.props.navigation.state.params) {
            id = this.props.navigation.state.params.userUUID;
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
    closeCreateServiceDialog = () => {
        this.setState({
            showCreateServiceDialog: false,
        })
    }


    _navigateToSessionsView = () => {
        this.props.navigation.navigate('SessionsView', {
            userUUID: this.props.navigation.state.params.userUUID
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

                <NativeButton title="See Review" />
            </View>
            )
        })
    }

    _navigateToFollowers = () => {
        this.props.navigation.navigate('FollowerView');
    }

    _navigateToSettings = () => {
        this.props.navigation.navigate('UserSettingsView');
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

    getHeaderRight = () => {
        if (this.props.navigation.state.params.navFrom) {
            switch (this.props.navigation.state.params.navFrom) {
                case 'Drawer':
                    return ( 
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                <IconButton icon="more-horiz" size={20} onPress={() => this._navigateToSettings()} />
                    <IconButton icon="email" size={20} onPress={() =>
                        this.props.navigation.dispatch(

                            NavigationActions.navigate({
                                routeName: 'MessagesView',
                                action: NavigationActions.navigate({ routeName: 'MessagesView' })
                            })
                        )} />
                        </View>
                    )
                default:
                    return <FeatherIcon name="plus-circle" size={20} onPress={() => this._showActionSheet()} />
            }
        }
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

        if (this.state.userData.photo_url == undefined && this.props.lupa_data.Users.currUserData.user_uuid == this.state.userData.user_uuid
            || this.state.userData.photo_url == "" && this.props.lupa_data.Users.currUserData.user_uuid == this.state.userData.user_uuid) {
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

    /* ---------------------------- */

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
                        alert('p')
                        return this.props.lupa_data.Programs.currUserProgramsData.map(program => {
                            return (
                                 <View style={{}}>
                        <TouchableHighlight>
                        <Surface style={{elevation: 0, width: Dimensions.get('screen').width /1.3, height: 120, borderRadius: 16, margin: 5}}>
                      <View style={styles.viewOverlay} />               
                      <ImageBackground 
                       imageStyle={{borderRadius: 16}} 
                       style={{alignItems: 'flex-start', justifyContent: 'center', width: '100%', height: '100%', borderRadius:16 }} 
                       source={{uri: 'https://picsum.photos/700'}}>
                           <View style={{flex: 1, padding: 15, alignItems: 'flex-start', justifyContent: 'center' }}>
                           <Text style={{color: 'white', fontSize: 20,fontFamily: 'ARSMaquettePro-Medium' }}>
                                Program Name
                                </Text>
                                <Text  numberOfLines={3} style={{ color: 'white', fontSize: 12, fontFamily: 'ARSMaquettePro-Medium'}}>
                                But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system
                                </Text>
                           </View>
                       </ImageBackground>
                        <MaterialIcon size={30} name="info" color="#FAFAFA" style={{ position: 'absolute', right: 0, top: 0, margin: 5}} />
                    </Surface>
                        </TouchableHighlight>
        
                    
                    </View>
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
                                 <View style={{}}>
                        <TouchableHighlight>
                        <Surface style={{elevation: 0, width: Dimensions.get('screen').width /1.3, height: 120, borderRadius: 16, margin: 5}}>
                      <View style={styles.viewOverlay} />               
                      <ImageBackground 
                       imageStyle={{borderRadius: 16}} 
                       style={{alignItems: 'flex-start', justifyContent: 'center', width: '100%', height: '100%', borderRadius:16 }} 
                       source={{uri: 'https://picsum.photos/700'}}>
                           <View style={{flex: 1, padding: 15, alignItems: 'flex-start', justifyContent: 'center' }}>
                           <Text style={{color: 'white', fontSize: 20,fontFamily: 'ARSMaquettePro-Medium' }}>
                                Program Name
                                </Text>
                                <Text  numberOfLines={3} style={{ color: 'white', fontSize: 12, fontFamily: 'ARSMaquettePro-Medium'}}>
                                But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system
                                </Text>
                           </View>
                       </ImageBackground>
                        <MaterialIcon size={30} name="info" color="#FAFAFA" style={{ position: 'absolute', right: 0, top: 0, margin: 5}} />
                    </Surface>
                        </TouchableHighlight>
        
                    
                    </View>
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
onPress={this.setState({ showCreateServiceDialog: true })}
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
            <View style={styles.container}>
                <SafeAreaView />
                <Appbar.Header style={{ backgroundColor: "transparent", margin: 10 }}>
                    <Left>
                        {this.getHeaderLeft()}
                    </Left>


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
                <View style={{alignSelf: 'center', marginBottom: 30, alignItems: 'center' }}>
                        <Text style={{color: '#212121', fontFamily: 'ARSMaquettePro-Bold'}}> National Academy of Sports Medicine </Text>
                        <Text style={{color: '#212121', fontFamily: 'ARSMaquettePro-Regular'}}> Lupa Tier 1 </Text>
                    </View>
                    
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
                         But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder.
                                </Paragraph>
                                </View>

                                {
                                    this.renderEditBioButton()
                                }
                            </View>
                            </View>

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

                        </View>


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
                </ScrollView>

                <InviteToPackDialog userToInvite={this.props.navigation.state.params.userUUID} userPacks={this.state.userPackData} isOpen={this.state.dialogVisible} closeModalMethod={this._hideDialog} />
                <UpdateInterestDialog userToUpdate={this.props.navigation.state.params.userUUID} isOpen={this.state.fitnessInterestDialogOpen} closeModalMethod={this.closeFitnessInterestDialog}/>
                <CreateServiceDialog isVisible={this.state.showCreateServiceDialog} closeDialogMethod={this.closeCreateServiceDialog} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F2F2F2",
    },
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 20,

        width: '100%',
      },
    myPacks: {
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
    viewOverlay: {
        position: 'absolute', 
        flex: 1,
        top: 0, left: 0, right:0, 
        borderRadius: 16, 
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
});

export default connect(mapStateToProps)(withNavigation(ProfileView));