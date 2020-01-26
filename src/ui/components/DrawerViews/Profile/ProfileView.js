/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  20, 2019
 * 
 * Profile View
 */

import React from 'react';

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    Button as NativeButton,
    RefreshControl,
    ImageBackground
} from "react-native";

import {
    IconButton,
    Title,
    Surface,
    Button,
    Caption,
    Divider,
    Chip,
    Headline,
    Avatar as PaperAvatar
} from 'react-native-paper';

import {
    Fab,
} from 'native-base';

import Timecards from './components/Timecards';

import { ImagePicker } from 'expo-image-picker';

import { Avatar, Rating } from 'react-native-elements';

import SafeAreaView from 'react-native-safe-area-view';

import { withNavigation } from 'react-navigation';
import LupaController from '../../../../controller/lupa/LupaController';
import MyPacksCard from './components/MyPacksCard';

import { MaterialIcons as MaterialIcon } from '@expo/vector-icons';
import FollowerModal from '../../Modals/User/FollowerModal';
import SettingsModal from './components/SettingsModal';

let chosenHeaderImage;
let chosenProfileImage;

let ProfileImage = require('../../../images/background-one.jpg');


/**
 * Lupa Profile View
 * 
 * This view serves as the user profile for the current user to see only.  Any edits to the profile can be
 * made here.
 * 
 * TODO:
 * ADD EDIT, ADD, and DELETE buttons for content.  (The delete buttons will be mapped beside content in each content area.).
 */
class ProfileView extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            headerImage: '',
            profileImage: '',
            username: '',
            displayName: '',
            photoUrl: '',
            userInterest: [],
            userExperience: [],
            userIsTrainer: [],
            userRating: 0,
            userGoals: [],
            myPacks: [],
            recommendedWorkouts: [],
            followers: [],
            following: [],
            sessionsCompleted: undefined,
            isEditingProfile: false,
            createSessionModalIsOpen: false,
            userUUID: this.LUPA_CONTROLLER_INSTANCE.getCurrentUser().uid,
            followerModalIsOpen: false,
            refreshing: false,
            settingsModalIsOpen: false,
        }
    }

    /**
     * ComponentDidMount (Lifecycle Method) - ASYNC
     * 
     * ComponentDidMount is called right after the component is mounted on the display.  We setup user data here for the profile due to
     * the speed in which a user may search and click a user profile.  Loading the information and setting the state after the component has mounted
     * guarantees that the information will be loaded so the user can see it.
     */
    componentDidMount = () => {
        this.setupProfileInformation();
    }

    setupProfileInformation = async () => {
        let username, displayName, photoUrl, interestData, experienceData, isTrainer, followers, following, sessionsCompleted, userRatingIn;
        await this.LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(this.state.userUUID, 'display_name').then(result => {
            displayName = result;
        })

        await this.LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(this.state.userUUID, 'username').then(result => {
            username = result;
        })

        await this.LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(this.state.userUUID, 'photo_url').then(result => {
            photoUrl = result;
        })

        await this.LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(this.state.userUUID, 'sessions_completed').then(result => {
            sessionsCompleted = result;
        })

        await this.LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(this.state.userUUID, 'following').then(result => {
            following = result;
        })

        await this.LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(this.state.userUUID, 'followers').then(result => {
            followers = result;
        })

        await this.LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(this.state.userUUID, 'isTrainer').then(result => {
            isTrainer = result;
        });

        await this.LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(this.state.userUUID, 'interest').then(result => {
            interestData = result;
        });

        await this.LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(this.state.userUUID, 'experience').then(result => {
            experienceData = result;
        });

        await this.LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(this.state.userUUID, 'rating').then(result => {
            usingRatingIn = result;
        });

        await this.setState({
            username: username,
            displayName: displayName,
            photoUrl: photoUrl,
            userExperience: experienceData,
            userInterest: interestData,
            userIsTrainer: isTrainer,
            followers: followers,
            following: following,
            sessionsCompleted: sessionsCompleted,
            userRating: userRatingIn,
        });
    }

    _chooseHeaderFromCameraRoll = async () => {
        chosenHeaderImage = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
        });

        if (!chosenImage.cancelled) {
            this.setState({ profileImage: chosenHeaderImage.uri });
        }
    }

    _chooseProfilePictureFromCameraRoll = async () => {
        chosenProfileImage = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
        });

        if (!chosenImage.cancelled) {
            this.setState({ profileImage: chosenProfileImage.uri });
        }
    }

    closeSettingsModal = () => {
        this.setState({ settingsModalIsOpen: false });
    }

    closeFollowerModal = () => {
        this.setState({ followerModalIsOpen: false });
    }

    mapInterest = () => {
        return this.state.userInterest.length == 0 ?
            <Caption>
                Specializations and strengths that you add to your fitness profile will appear here.
                                </Caption> : this.state.userInterest.map(interest => {
                    return (
                        <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>
                            {interest}
                        </Chip>
                    );
                })
    }

    mapExperience = () => {
        return this.state.userExperience.length == 0 ?
            <Caption>
                Experience that you add to your fitness profile will appear here.
    </Caption> : <View>
                <Title>
                    Education
            </Title>
                <Text>
                    {this.state.userExperience.school} with {this.state.userExperience.major}
                </Text>
                <Title>
                    Certification
            </Title>
                <Text>
                    {this.state.userExperience.certification}
                </Text>
                <Title>
                    Years as a Trainer
            </Title>
                <Text>
                    {this.state.userExperience.years_as_trainer}
                </Text>
            </View>
    }

    mapPacks = () => {
        return <MyPacksCard />
    }

    showRating = () => {
        return <Rating ratingCount={this.state.userRating} imageSize={10} />
    }

    setupProfileInformation = async () => {

    }

    handleOnRefresh = () => {
        //this.setupProfileInformation
    }

    mapGoals = () => {
        this.state.userGoals.length == 0 ?
            <Caption>
                You haven't set any goals.  Visit your fitness profile in the settings tab to add one.
        </Caption> : null
    }

    mapRecommendedWorkouts = () => {
        return <>
            <Button mode="text" compact color="black">
                Glute Bridge
                                </Button>
            <Button mode="text" compact color="black">
                Dumbbel Clean
                                </Button>
            <Button mode="text" compact color="black">
                Squat
                                </Button>
            <Button mode="text" compact color="black">
                Hammer Curl
                                </Button>
            <Button mode="text" compact color="black">
                Jumping Lunge
                                </Button>
        </>
    }

    _navigateToFollowers = () => {
        this.props.navigation.navigate('FollowerView');
    }

    _navigateToSettings = () => {
        this.props.navigation.navigate('ProfileSettings');
    }

    render() {
        return (
            <SafeAreaView forceInset={{ top: 'never' }} style={styles.container}>
                <Surface style={styles.surfaceHeader}>
                    <ImageBackground style={styles.imageBackground} source={ProfileImage}>
                        <IconButton style={styles.menuIcon} icon="menu" size={20} onPress={() => this.props.navigation.openDrawer()} />
                    </ImageBackground>
                </Surface>

                <ScrollView showsVerticalScrollIndicator={false} shouldRasterizeIOS={true} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleOnRefresh} />}>
                    <View style={styles.user}>
                        <View style={styles.userInfoContainer}>
                            <View style={styles.userInfo}>
                                <Headline>
                                    {this.LUPA_CONTROLLER_INSTANCE.getUserDisplayName()}
                                </Headline>
                                {
                                    true && this.state.isTrainer ? <Text style={{ fontSize: 12 }}>
                                        Lupa Tier 1 Trainer
                            </Text> : <Text style={styles.userInfoText}>
                                            Lupa User
                            </Text>
                                }
                            </View>
                            <View style={styles.alignCenterColumn}>
                                <Avatar size={40} source={this.LUPA_CONTROLLER_INSTANCE.getUserPhotoURL()} rounded showEditButton={this.state.isEditingProfile} containerStyle={{}} />
                                <Text style={styles.userInfoText}>
                                    {this.state.username}
                                </Text>

                            </View>
                        </View>



                        <View style={styles.userAttributesContainer}>
                            <TouchableOpacity onPress={this._navigateToFollowers}>
                                <View style={styles.alignCenterColumn}>
                                    <Text>
                                        {this.state.followers.length}
                                    </Text>
                                    <Text style={styles.userAttributeText}>
                                        Followers
                                </Text>
                                </View>

                            </TouchableOpacity>
                            <TouchableOpacity onPress={this._navigateToFollowers}>
                                <View style={styles.alignCenterColumn}>
                                    <Text>
                                        {this.state.following.length}
                                    </Text>
                                    <Text style={styles.userAttributeText}>
                                        Following
                                </Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity>
                                <View style={styles.alignCenterColumn}>
                                    <Text>
                                        {this.state.sessionsCompleted}
                                    </Text>
                                    <Text style={styles.userAttributeText}>
                                        Sessions Completed
                                </Text>
                                </View>

                            </TouchableOpacity>

                            <View style={styles.alignCenterColumn}>
                                <View style={{ margin: 3 }}>
                                    {this.showRating()}
                                </View>
                                <Text style={styles.userAttributeText}>
                                    Rating
                                </Text>
                            </View>

                        </View>
                    </View>

                    <Timecards isEditing={this.state.isEditingProfile} />

                    {
                        true && this.state.isTrainer ?
                            <View style={styles.experience}>
                                <Surface style={styles.contentSurface}>
                                    <Title>
                                        Experience
                        </Title>
                                    <Divider />
                                    {this.mapExperience()}
                                </Surface>
                            </View>
                            :
                            null
                    }


                    <>
                        <Surface style={styles.contentSurface}>
                            <Title>
                                Interest, Specializations and Strengths
                        </Title>
                            <Divider />
                            <View style={{ justifyContent: "flex-start" }}>
                                {
                                    this.mapInterest()
                                }
                            </View>
                        </Surface>
                    </>

                    <>
                        <Surface style={styles.contentSurface}>
                            <Title>
                                Goals
                        </Title>
                            <Divider />
                            <View style={{ justifyContent: "flex-start" }}>
                                {
                                    this.mapGoals()
                                }
                            </View>
                        </Surface>
                    </>


                    <View style={styles.myPacks}>
                        <Title>
                            My Packs
                        </Title>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {this.mapPacks()}
                        </ScrollView>
                    </View>

                    <View style={styles.recommendedWorkouts}>
                        <View style={styles.recommendedWorkoutsHeader}>
                            <Title>
                                Recommended Workouts
                        </Title>
                            <Button color="#2196F3">
                                View All
                        </Button>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {this.mapRecommendedWorkouts()}
                        </ScrollView>
                    </View>

                </ScrollView>

                <Fab
                    active={this.state.active}
                    direction="up"
                    containerStyle={{}}
                    style={{ backgroundColor: '#637DFF' }}
                    position="bottomRight"
                    onPress={() => this.setState({ active: !this.state.active })}>
                    <MaterialIcon name="menu" />
                    <Button style={{ backgroundColor: '#637DFF' }} onPress={this._navigateToSettings}>
                        <MaterialIcon name="settings" />
                    </Button>
                </Fab>
            </SafeAreaView>
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
        backgroundColor: "#637DFF",
        margin: 3
    },
    chipTextStyle: {
        color: "white",
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
        margin: 10,
    },
    uesrInfoText: {
        fontWeight: '600',
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
});

export default withNavigation(ProfileView);