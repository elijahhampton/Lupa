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

import { LineChart } from 'react-native-chart-kit';

import { MaterialIcons as MaterialIcon } from '@expo/vector-icons';
import FollowerModal from '../../Modals/User/FollowerModal';
import SettingsModal from './components/SettingsModal';

import PacksModal from '../../Modals/PackModal/PackModal';

import { connect } from 'react-redux';


const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }
    ],
    legend: ["Strength", "Flexibility"] // optional
  };

  const chartConfig = {
    backgroundColor: "#FFFFFF",
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5
  };

let chosenHeaderImage;
let chosenProfileImage;

let ProfileImage = require('../../../images/background-one.jpg');

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
class ProfileView extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            userData: this.props.lupa_data.Users.currUserData
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
       /* return this.state.userInterest.length == 0 ?
            <Caption>
                Specializations and strengths that you add to your fitness profile will appear here.
                                </Caption> : this.props.lupa_data.Users.currUserData.interest.map(interest => {
                    return (
                        <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>
                            {interest}
                        </Chip>
                    );
                })*/
    }

    mapExperience = () => {
        return  <View>
                <Title>
                    Education
            </Title>
                <Text>
                     Auburn University 
                </Text>
                <Title>
                    Certification
            </Title>
                <Text>
                     National Association Science and Medicine
                </Text>
                <Title>
                    Years as a Trainer
            </Title>
                <Text>
                     5
                </Text>
            </View>
    }

    mapPacks = () => {
        return <MyPacksCard />
    }

    //show rating at bottom of profile
    showRating = () => {
        return <Rating showReadOnlyText={false} readonly ratingTextColor="black" showRating={true} ratingCount={this.state.userData.rating} imageSize={80} />
    }

    handleOnRefresh = () => {
        this.setupProfileInformation()
    }

    mapBio = () => {
        return (
        <Text style={{fontWeight: 'bold'}}>
            {this.state.userData.bio}
        </Text>
        )
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

                <ScrollView contentContainerStyle={{flexGrow: 2, flexDirection: 'column', justifyContent: 'space-between'}} showsVerticalScrollIndicator={false} shouldRasterizeIOS={true} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleOnRefresh} />}>
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
                                        Lupa Tier 1 Trainer
                            </Text> : <Text style={{ fontSize: 12, fontWeight: "500", color: "grey", padding: 2 }}>
                                            Lupa User
                            </Text>
                                }
                            </View>
                            <View style={styles.alignCenterColumn}>
                                <Avatar size={65} source={{uri: this.state.userData.photo_url}} rounded containerStyle={{}} />

                            </View>
                        </View>
                        
                        <View style={styles.userAttributesContainer}>
                            <TouchableOpacity onPress={this._navigateToFollowers}>
                                <View style={styles.alignCenterColumn}>
                                    <Text>
                                        {this.state.userData.followers.length}
                                    </Text>
                                    <Text style={styles.userAttributeText}>
                                        Followers
                                </Text>
                                </View>

                            </TouchableOpacity>
                            <TouchableOpacity onPress={this._navigateToFollowers}>
                                <View style={styles.alignCenterColumn}>
                                    <Text>
                                        {this.state.userData.following.length}
                                    </Text>
                                    <Text style={styles.userAttributeText}>
                                        Following
                                </Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity>
                                <View style={styles.alignCenterColumn}>
                                    <Text>
                                        {this.state.userData.sessionsCompleted}
                                    </Text>
                                    <Text style={styles.userAttributeText}>
                                        Sessions Completed
                                </Text>
                                </View>

                            </TouchableOpacity>

                        </View>
                    </View>

                    <Timecards isEditing={this.state.isEditingProfile} />
                    <>
                        <Surface style={styles.contentSurface}>
                            <Title>
                                Bio
                        </Title>
                            <Divider />
                            <View style={{ justifyContent: "flex-start", padding: 5 }}>
                                {
                                    this.mapBio()
                                }
                            </View>
                        </Surface>
                    </>
                    
                    <>
                    {
                        true && this.state.userData.isTrainer ?
                                <Surface style={styles.contentSurface}>
                                    <Title>
                                        Experience
                        </Title>
                                    <Divider />
                                    {this.mapExperience()}
                                </Surface>
                            :
                            null
                    }   
                    </>

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
                                    this.props.lupa_data.Users.currUserData.interest.map((val, index, arr) => {
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
                    {/*</View> */}


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
                    <Button style={{ backgroundColor: '#637DFF' }} onPress={() => this._navigateToSettings()}>
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

export default connect(mapStateToProps)(withNavigation(ProfileView));