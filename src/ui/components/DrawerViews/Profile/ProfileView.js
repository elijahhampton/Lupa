/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  20, 2019
 * 
 * Profile View
 */

import React from 'react';

import LUPA_DB from '../../../../controller/firebase/firebase';

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    Button as NativeButton,
    RefreshControl,
    ImageBackground,
    TouchableWithoutFeedback,
    TextInput
} from "react-native";

import {
    IconButton,
    Title,
    Surface,
    Button,
    Caption,
    Avatar,
    Divider,
    Chip,
    Headline,
    Avatar as PaperAvatar
} from 'react-native-paper';

import {
    Fab,
    Header,
    Left,
    Right
} from 'native-base';

import Timecards from './components/Timecards';

import { ImagePicker } from 'expo-image-picker';

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
            userUUID: '',
            userData: {},
            userPackData: [],
            userRecommendedWorkouts: [],
            isEditingBio: false,
            followers: [],
            following: [],
            interest: [],
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
    }

    _getId() {
        let id = false;
        if(this.props.navigation.state.params) {
          id = this.props.navigation.state.params.userUUID;
        }
        return id;
      }

    setupProfileInformation = async () => {
        let userInfo, userPackData;
        const uuid = this._getId();

        await this.LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(uuid).then(result => {
            userInfo = result;
        })

        await this.LUPA_CONTROLLER_INSTANCE.getPackInformationByUserUUID(uuid).then(result => {
            userPackData = result;
        })

        let workouts = userInfo.recommended_workouts;
        let workoutData = [];
        for (let i = 0; i < workouts.length; i++)
        {
            await this.LUPA_CONTROLLER_INSTANCE.getWorkoutDataFromUUID(workouts[i]).then(result => {
                workoutData.push(result);
            })
        }

        await this.setState({
            userData: userInfo,
            userPackData: userPackData,
            followers: userInfo.followers,
            following: userInfo.following,
            interest: userInfo.interest,
            userRecommendedWorkouts: workoutData,
        });
    }

    handleEndEditingBio = () => {

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
                <MyPacksCard packTitle={pack.pack_title} packPhotoSrc={pack.pack_image} />
            )
        })
    }


    handleOnRefresh = () => {
        this.setupProfileInformation()
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

    _navigateToFollowers = () => {
        this.props.navigation.navigate('FollowerView');
    }

    _navigateToSettings = () => {
        this.props.navigation.navigate('ProfileSettings');
    }

    renderFinishEditingBioButton = () => {
        return this.state.isEditingBio == true ? 
            <Button mode="text" color="#2196F3" onPress={() => this.handleEndEditingBio()}>
                Done
            </Button>
            :
            <Button mode="text" color="#2196F3" onPress={() => this.setState({ isEditingBio: true })}>
                Edit
            </Button>
    }

    getFollowerLength = () => {
       if (this.state.followers.length) {
            return this.state.followers.length
        }
        else
        {
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
        console.log(this.props.navigation.state.params)
        if (this.props.navigation.state.params.navFrom)
        {
            switch (this.props.navigation.state.params.navFrom)
            {
                case 'Drawer':
                    return <IconButton icon="menu" size={20} onPress={() => this.props.navigation.openDrawer()} />
                    break;
                case 'PackView':
                    return <IconButton icon="arrow-back" size={20} onPress={() => this.props.navigation.goBack(null)} />
                    break;
                case 'SearchView':
                    //Not using right now because it seems to work without it
                    break;
    
            }
        }

    }

    getHeaderRight = () => {
        if (this.props.navigation.state.params.navFrom)
        {
            switch (this.props.navigation.state.params.navFrom)
            {
                case 'Drawer':
                    return <IconButton icon="more-horiz" size={20} onPress={() => this._navigateToSettings()} />
                    break;
            }
        }
    }

    render() {
        return (
            <SafeAreaView forceInset={{ top: 'never' }} style={styles.container}>
                <Header transparent style={{backgroundColor: 'transparent'}}>
                    <Left>
                        {this.getHeaderLeft()}
                    </Left>

                    <Right>
                        {this.getHeaderRight()}
                    </Right>
                </Header>

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
                                        Lupa Trainer
                            </Text> : <Text style={{ fontSize: 12, fontWeight: "500", color: "grey", padding: 2 }}>
                                            Lupa User
                            </Text>
                                }
                            </View>
                            <View style={styles.alignCenterColumn}>
                                <Avatar.Image style={{elevation: 3}} size={65} source={{uri: this.state.userData.photo_url}} containerStyle={{}} />

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
                    </View>

                    <Divider />

                    <Timecards isEditing={this.state.isEditingProfile} />

                    <Divider />
                    <>
                        <Surface style={styles.contentSurface}>
                            <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
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
                        <Surface style={[styles.contentSurface, {elevation: 8, backgroundColor: "#2196F3"}]}>
                                <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Title style={{color: 'white'}}>
                                    Interest and Goals
                                </Title>
                                </View>
                                <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'center'}}>
                                {
                                    this.mapInterest()
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
                        </View>
                        {
                            this.mapRecommendedWorkouts()
                        }
                    </View>

                    {
                             this.state.userData.isTrainer == true ?
                                            <View style={styles.recommendedWorkouts}>
                                            <View style={styles.recommendedWorkoutsHeader}>
                                                <Title>
                                                    Certification
                                            </Title>
                                            </View>
                    <Caption style={{flexWrap: 'wrap'}}>
                        This user is a certified trainer under the { this.state.userData.certification }
                    </Caption>
                                        </View>
                                        :
                                        null
                }
                </ScrollView>
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