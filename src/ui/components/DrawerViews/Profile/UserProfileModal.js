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
    RefreshControl,
    ImageBackground
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
    Icon,
    Header,
    Left,
    Right
} from 'native-base';

import Timecards from './components/Timecards';

import { Ionicons } from '@expo/vector-icons';

import { ImagePicker } from 'expo-image-picker';

import { Avatar, Rating } from 'react-native-elements';

import SafeAreaView from 'react-native-safe-area-view';

import { withNavigation } from 'react-navigation';
import LupaController from '../../../../controller/lupa/LupaController';
import CreateSessionModal from '../../Modals/Session/CreateSessionModal';
import MyPacksCard from './components/MyPacksCard';

import { MaterialIcons as MaterialIcon } from '@expo/vector-icons';
import FollowerModal from '../../Modals/User/FollowerModal';

import StripePaymentModal from '../../Modals/Payment/StripePaymentModal';
import StripePaymentComponent from '../../../../modules/payments/stripe/ui/stripe-ui';

let chosenHeaderImage;
let chosenProfileImage;

let ProfileImage = require('../../../images/background-one.jpg');

import { connect } from 'react-redux';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
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
 * PHOTO_URL not correct
 */
class UserProfileModal extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            userData: [],
            interest: [],
            experience: [],
                createSessionModalIsOpen: false,
            userUUID: this.props.navigation.state.params.userUUID, //Unlike the ProfileView this state property is unique to the UserProfileModal,
            followerModalIsOpen: false,
            refreshing: false,
            active: false,
            followers: [],
            following: [],
            userRecommendedWorkouts: [],
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
        await this.setupProfileInformation()
    }

    setupProfileInformation = async () => {
        let userInformationIn;

        await this.LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(this.props.navigation.state.params.userUUID).then(result => {
            userInformationIn = result;
        });

        let workouts = userInformationIn.recommended_workouts;
        let workoutData = [];
        for (let i = 0; i < workouts.length; i++)
        {
            await this.LUPA_CONTROLLER_INSTANCE.getWorkoutDataFromUUID(workouts[i]).then(result => {
                workoutData.push(result);
            })
        }


        await this.setState({ 
            userData: userInformationIn, 
            interest: userInformationIn.interest, 
            experience: userInformationIn.experience,
            followers: userInformationIn.followers,
            following: userInformationIn.following,
            userRecommendedWorkouts: workoutData });
  
    }

    closeCreateSessionModal = () => {
        this.setState({ createSessionModalIsOpen: false });
    }

    closeFollowerModal = () => {
        this.setState({ followerModalIsOpen: false });
    }

    mapInterest = () => {
        return this.state.interest.length == 0 ? this.state.interest.map(interest => {
            return (
                <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>
                    {interest}
                </Chip>
            );
        })

            :
            <Caption>
                Specializations and strengths that you add to your fitness profile will appear here.
         </Caption>
    }

    mapPacks = () => {
        return this.state.userPackData.map(pack => {
            return (
                <MyPacksCard packTitle={pack.pack_title} packPhotoSrc={pack.pack_image} />
            )
        })
    }

    mapBio = () => {
        return this.state.isEditingBio == true ?
            <Text style={{fontWeight: 'bold'}} allowFontScaling={true} allowsEditing={true}>
                {this.state.userData.bio}
            </Text>
        :
        <TextInput multiline={true} autoGrow={true}>
            {this.state.userData.bio}
        </TextInput>
    }

    mapRecommendedWorkouts = () => {
        if (this.state.userRecommendedWorkouts.length == 0)
        {
            return        <View>
            <Caption>
    You don't have any recommended workouts saved!  You can recommend workouts from the workout library inside of your goal pathways.
</Caption>
</View>
        }
        else 
        {
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

    _renderFollowButton = () => {
        //No need to render follow button if current user is viewing their own profile modal
        const currUserUUID = this.LUPA_CONTROLLER_INSTANCE.getCurrentUser().uid;
        if (this.state.userUUID == currUserUUID) { return };


        return this.state.followers.includes(this.LUPA_CONTROLLER_INSTANCE.getCurrentUser().uid) ? 
        <Button style={{backgroundColor: "#2196F3"}} mode="outlined" color="white" theme={{ roundness: 20 }} onPress={() => this.handleUnFollowUser()}>
        Follow
</Button>
:
<Button mode="outlined" color="#2196F3" theme={{ roundness: 20 }} onPress={() => this.handleFollowUser()}>
Follow
</Button>
    }

    handleOnRefresh = () => {
        this.setupProfileInformation();
    }

    _navigateToSessionsView = () => {
        this.props.navigation.navigate('SessionsView', {
            userUUID: this.state.userUUID
        });
    }

    render() {
        return (
            <SafeAreaView forceInset={{ top: 'never' }} style={styles.container}>
                <Header transparent style={{backgroundColor: 'transparent'}}>
                    <Left>
                        <IconButton icon="menu" size={20} onPress={() => this.props.navigation.goBack()} />
                    </Left>
                </Header>

                <ScrollView showsVerticalScrollIndicator={false} shouldRasterizeIOS={true}>
                    <View style={{ margin: 3, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <IconButton icon="arrow-back" size={20} onPress={this.props.closeModalMethod} />
                        {this._renderFollowButton()}
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} shouldRasterizeIOS={true} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleOnRefresh} />}>
                        <View style={styles.user}>
                        <View style={styles.userInfoContainer}>
                            <View style={styles.userInfo}>
                                <Text style={{fontSize: 18, fontWeight: 'bold', padding: 1}}>
                                    {this.state.userData.display_name}
                                </Text>
                                <Text style={{fontSize: 15, fontWeight: '600', padding: 1}}>
                                    {this.state.userData.username}
                                </Text>
                                {
                                    true && this.state.userData.isTrainer ? <Text style={{ fontSize: 12, fontWeight: "500", color: "grey", padding: 1 }}>
                                        Lupa Trainer
                            </Text> : <Text style={{ fontSize: 12, fontWeight: "500", color: "grey", padding: 2 }}>
                                            Lupa User
                            </Text>
                                }
                            </View>
                            <View style={styles.alignCenterColumn}>
                                <Avatar size={65} source={{uri: this.state.userData.photo_url}} rounded containerStyle={{}} />

                            </View>
                        </View>



                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", margin: 3 }}>
                                <TouchableOpacity onPress={() => this.setState({ followerModalIsOpen: true })}>
                                    <View style={{ flexDirection: "column", alignItems: "center" }}>
                                        <Text>
                                            {this.state.userData.followers && this.state.userData.followers.length}
                                        </Text>
                                        <Text style={{ fontWeight: "bold" }}>
                                            Followers
                                </Text>
                                    </View>

                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.setState({ followerModalIsOpen: true })}>
                                    <View style={{ flexDirection: "column", alignItems: "center" }}>
                                        <Text>
                                            {this.state.userData.following && this.state.userData.following.length}
                                        </Text>
                                        <Text style={{ fontWeight: "bold" }}>
                                            Following
                                </Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity>
                                    <View style={{ flexDirection: "column", alignItems: "center" }}>
                                        <Text>
                                            {this.state.userData.sessionsCompleted}
                                        </Text>
                                        <Text style={{ fontWeight: "bold" }}>
                                            Sessions Completed
                                </Text>
                                    </View>

                                </TouchableOpacity>

                            </View>
                        </View>
                        
                        <Divider />

                        <Timecards />

                        <Divider />

                        {
                            true && this.state.userData.isTrainer ?
                                <View style={styles.experience}>
                                    <Surface style={[styles.contentSurface, { borderColor: "#2196F3", borderWidth: 1 }]}>
                                        <Title>
                                            Experience
                        </Title>
                                        <Divider />
                                        {
                                            this.mapExperience()
                                        }
                                    </Surface>
                                </View>
                                :
                                null
                        }


                        {/* interest mapping */}
                        <Surface style={[styles.contentSurface, {elevation: 8, backgroundColor: "#2196F3"}]}>
                        <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Title style={{color: 'white'}}>
                                    Interest and Goals
                                </Title>
                                    
                                    <Button mode="text" color="white">
                                        View all
                                    </Button>
                                </View>
                                <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly', alignItems: 'center'}}>
                                {
                                    this.state.interest.map((val, index, arr) => {
                                        return (
                                            <Chip mode="flat" style={{width: 'auto', height: 'auto', alignItems: 'center', justifyContent: 'center', margin: 2, backgroundColor: "#FAFAFA", elevation: 3}}> 
                                            <Text style={{fontWeight: 'bold'}}>
                                                {val}
                                            </Text>
                                        </Chip>
                                        )
                                    })
                                }
                                </View>
                        </Surface>

                        <View style={styles.myPacks}>
                            <Title>
                                My Packs
                        </Title>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {this.mapPacks()}
                            </ScrollView>
                        </View>

                        <View style={styles.recommendedWorkouts}>
                            <View style={{ alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
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
                </ScrollView>
                {
                    /*  Removed for dev
                    true && (this.state.userUUID != this.LUPA_CONTROLLER_INSTANCE.getCurrentUser().uid) ?
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
                    </Fab> : null
                    */
                }

                <Fab
                    active={this.state.active}
                    direction="up"
                    containerStyle={{}}
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
                    <Button style={{ backgroundColor: '#637DFF' }} onPress={() => this._navigateToSessionsView()}>
                        <MaterialIcon name="fitness-center" />
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
        display: "flex",
        width: "auto",
        backgroundColor: "#637DFF",
        margin: 3
    },
    chipTextStyle: {
        color: "white",
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

export default connect(mapStateToProps)(UserProfileModal);