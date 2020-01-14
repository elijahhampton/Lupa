/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  20, 2019
 * 
 * User Profile Modal
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
    Dimensions,
    Modal,
    RefreshControl
} from "react-native";

import {
    IconButton,
    Title,
    Surface,
    Appbar,
    Button,
    Caption,
    FAB,
    Divider,
    Chip,
    Headline,
} from 'react-native-paper';

import {
    Fab,
    Icon
} from 'native-base';

import Timecards from './components/Timecards';

import { Ionicons } from '@expo/vector-icons';

import { ImagePicker } from 'expo-image-picker';

import { Avatar } from 'react-native-elements';

import SafeAreaView from 'react-native-safe-area-view';

import { withNavigation } from 'react-navigation';
import LupaController from '../../../../controller/lupa/LupaController';
import CreateSessionModal from '../../Modals/Session/CreateSessionModal';
import MyPacksCard from './components/MyPacksCard';

import { MaterialIcons as MaterialIcon } from '@expo/vector-icons';
import FollowerModal from '../../Modals/User/FollowerModal';

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
 * PHOTO_URL not correct
 */
class UserProfileModal extends React.Component {
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
            myPacks: [],
            followers: [],
            following: [],
            sessionsCompleted: undefined,
            isEditingProfile: false,
            createSessionModalIsOpen: false,
            userUUID: this.props.uuid, //Unlike the ProfileView this state property is unique to the UserProfileModal,
            followerModalIsOpen: false,
            refreshing: false,
            tabToOpen: 0
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
    let username, displayName, photoUrl, interestData, experienceData, isTrainer, followers, following, sessionsCompleted;

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

    closeCreateSessionModal = () => {
        this.setState({ createSessionModalIsOpen: false });
    }

    closeFollowerModal = () => {
        this.setState({ followerModalIsOpen: false });
    }

    mapInterest = () => {
        return this.state.userInterest.map(interest => {
            return (
                <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>
                    {interest}
                </Chip>
            );
        })
    }

    mapExperience = () => {
        return <View>
            <Title>
                Education
            </Title>
            <Text>
                { this.state.userExperience.school } with { this.state.userExperience.major}
            </Text>
            <Title>
                Certification
            </Title>
            <Text>
                { this.state.userExperience.certification }
            </Text>
            <Title>
                Years as a Trainer
            </Title>
            <Text>
                { this.state.userExperience.years_as_trainer }
            </Text>
        </View>
    }

    mapPacks = () => {
        return <MyPacksCard />
    }

    handleFollowUser = () => {
        console.log('Handling following user');
        
        let userToFollow = this.state.userUUID;

        this.LUPA_CONTROLLER_INSTANCE.followUser(userToFollow, this.LUPA_CONTROLLER_INSTANCE.getCurrentUser().uid);
    }

    _renderFollowButton = () => {
        //NEED TO RENDER BUTTON COLOR BASED ON IF THE USER IS FOLLOWING OR NOT
        return (
            <Button mode="outlined" color="#2196F3" theme={{roundness: 20 }} onPress={this.handleFollowUser}>
            Follow
        </Button>
        )
    }

    setupProfileInformation = async () => {

    }

    handleOnRefresh = () => {
        //this.setupProfileInformation();
    }

    render() {
        return (
            <Modal presentationStyle="fullScreen" visible={this.props.isOpen} style={styles.modalContainer}>
            <SafeAreaView forceInset={{ top: 'never' }} style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false} shouldRasterizeIOS={true}>
                <Surface style={{ height: "13%", width: "100%", elevation: 3 }}>
                    <Image style={{ width: "100%", height: "100%" }} source={ProfileImage} resizeMode="cover" resizeMethod="resize" />
                </Surface>
                <View style={{ margin: 3, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <IconButton icon="arrow-back" size={20} onPress={this.props.closeModalMethod} />
                    { this._renderFollowButton() }
                </View>

                <ScrollView showsVerticalScrollIndicator={false} shouldRasterizeIOS={true} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleOnRefresh} />}>
                    <View style={styles.user}>
                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                        <View style={styles.userInfo}>
                            <Text style={{fontWeight: "bold"}}>
                                {this.state.displayName}
                            </Text>
                            {
                                true && this.state.isTrainer ?                             <Text style={{ fontSize: 12 }}>
                                Lupa Tier 1 Trainer
                            </Text> : <Text style={{ fontSize: 12 }}>
                                Lupa User
                            </Text>
                            }
                        </View>
                        <View style={{flexDirection: 'column', alignItems: 'center'}}>
                        <Avatar size={40} source={this.state.photoUrl} rounded showEditButton={this.state.isEditingProfile} containerStyle={{ }} />
                        <Text style={{fontWeight: 'bold'}}>
                        {this.state.username}
                    </Text>

                        </View>
                        </View>

                        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", margin: 10}}>

                            <TouchableOpacity>
                            <View style={{flexDirection: "column", alignItems: "center"}}>
                                <Text>
                                    { this.state.sessionsCompleted }
                                </Text>
                                <Text style={{fontWeight: "bold"}}>
                                    Sessions Completed
                                </Text>
                            </View>

                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({ followerModalIsOpen: true, tabToOpen: 0 })}>
                            <View style={{flexDirection: "column", alignItems: "center"}}>
                            <Text>
                                    {this.state.followers.length}
                                </Text>
                                <Text style={{fontWeight: "bold"}}>
                                    Followers
                                </Text>
                            </View>

                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({ followerModalIsOpen: true, tabToOpen: 1 })}>
                            <View style={{flexDirection: "column", alignItems: "center"}}>
                            <Text>
                                    {this.state.following.length}
                                </Text>
                                <Text style={{fontWeight: "bold"}}>
                                   Following
                                </Text>
                            </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Timecards isEditing={this.state.isEditingProfile} />

                    <View style={styles.interest}>
                        <Surface style={[styles.contentSurface, styles.interestContent, {borderColor: "#2196F3", borderWidth: 2}]}>
                        <Headline>
                                Interest, Specializations and Strengths
                        </Headline>
                        <Divider />
                        <View style={{justifyContent: "flex-start"}}>
                        {
                                this.state.userInterest.length == 0 ?
                                    <Caption>
                                        Specializations and strengths that you add to your fitness profile will appear here.
                                </Caption> : this.mapInterest()
                            }
                        </View>
                        </Surface>
                    </View>

                    {
                        true && this.state.isTrainer ? 
                        <View style={styles.experience}>
                        <Surface style={[styles.contentSurface, {borderColor: "#2196F3", borderWidth: 2}]}>
                        <Headline>
                                Experience
                        </Headline>
                        <Divider />
                            {
                                this.state.userExperience.length == 0 ?
                                    <Caption>
                                        Experience that you add to your fitness profile will appear here.
                                </Caption> : this.mapExperience()
                            }
                        </Surface>
                    </View>
                    :
                    null
                    }


                    <View style={styles.myPacks}>
                        <Text style={{ fontWeight: "600", fontSize: 15 }}>
                            My Packs
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {this.mapPacks()}
                        </ScrollView>
                    </View>

                    <View style={styles.recommendedWorkouts}>
                        <Text style={{ fontWeight: "600", fontSize: 15 }}>
                            Recommended Workouts
                        </Text>
                        {/*
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <Surface style={{margin: 10, width: 100, height: 100, borderRadius: 20, elevation: 3}}>

                            </Surface>
                            <Surface style={{margin: 10, width: 100, height: 100, borderRadius: 20, elevation: 3}}>

                            </Surface>
                            <Surface style={{margin: 10, width: 100, height: 100, borderRadius: 20, elevation: 3}}>

                            </Surface>
                            <Surface style={{margin: 10, width: 100, height: 100, borderRadius: 20, elevation: 3}}>

                            </Surface>
                        </ScrollView>
                        */}
                        <Caption>
                            Visit the Workout Library to recommend workouts that you enjoy.
                       </Caption>
                    </View>

                </ScrollView>

                <CreateSessionModal isOpen={this.state.createSessionModalIsOpen} closeModalMethod={this.closeCreateSessionModal} />
                <FollowerModal isOpen={this.state.followerModalIsOpen} userUUID={this.state.userUUID} activeTab={this.state.tabToOpen} following={this.state.following} followers={this.state.followers} closeModalMethod={this.closeFollowerModal}/>
                </ScrollView>
            </SafeAreaView>
            
            <Fab
            active={this.state.active}
            direction="up"
            containerStyle={{ }}
            style={{ backgroundColor: '#637DFF' }}
            position="bottomRight"
            onPress={() => this.setState({ active: !this.state.active })}>
            <MaterialIcon name="menu" />
            <Button style={{ backgroundColor: '#637DFF' }}>
              <MaterialIcon name="message" />
            </Button>
            <Button style={{ backgroundColor: '#637DFF' }}>
              <MaterialIcon name="share" />
            </Button>
            <Button style={{ backgroundColor: '#637DFF' }} onPress={() => this.setState({ createSessionModalIsOpen: true })}>
              <MaterialIcon name="fitness-center" />
            </Button>
          </Fab>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FAFAFA",
    },
    contentSurface: {
        margin: 5,
        elevation: 5,
        padding: 15,
        borderRadius: 20
    },
    chipStyle: {
        elevation: 3,
        display: "flex",
        width: "auto",
        backgroundColor: "#637DFF",
        margin: 3
    },
    chipTextStyle: {
        color: "white",
    },
    interest: {
        backgroundColor: "transparent",
        justifyContent: "space-between",
        margin: 10,
    },
    interestContent: {
        flexDirection: "column",
        flexWrap: 'wrap',
        alignItems: "center",
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
    bulletRow: {
        flexDirection: "row",
    },
    boldText: {
        fontWeight: "bold",
    },
    normalText: {

    },
    userInfo: {
        flexDirection: "column",
    },
    user: {
        flexDirection: "column",
        padding: 5,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 5,
        color: "#637DFF",
        backgroundColor: "#2196F3"
    },
    modalContainer: {
        display: "flex",
        margin: 0,
        backgroundColor: "#FAFAFA",
    },

});

export default withNavigation(UserProfileModal);