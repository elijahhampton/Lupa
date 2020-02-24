/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  20, 2019
 * 
 * User Profile Modal
 */

import React, { useState, useEffect } from 'react';

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
    TextInput,
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
    Header,
    Left,
    Right,
    Icon,
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

const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

const ProfilePreviewModal = props => {

    const [userData, setUserData] = useState({display_name: 'J'});
    const [name, setName] = useState('');
    const [userPackData, setUserPackData] = useState(props.lupa_data.Packs.currUserPacksData);
    const [createSessionModalIsOpen, setCreateSessionModalIsOpen] = useState(false);
    const [userUUID, setUserUUID] = useState(props.userUUID);
    const [followerModalIsOpen, setFollowerModalIsOpen] = useState(false);
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [active, setIsActive] = useState(false);
    const [refreshing, setIsRefreshing] = useState(false);
    useEffect(() => {
        console.log('executing on : ' + userUUID)
       // Create an scoped async function in the hook
     doIt = async () => {
        await     LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(userUUID).then(result => {
            setUserData(result);
            setName(result.username)
        });
    }

    doIt();
        
        console.log('uhh' + userData.display_name)

    }, [userData.display_name]);

    getFollowerLength = () => {
        /*if (userData.followers.length >= 0) {
            return userData.followers.length;
        }
        else if(userData.followers.length == undefined)
        {
            return 0;
        }*/
    }

    closeCreateSessionModal = () => {
       // this.setState({ createSessionModalIsOpen: false });
    }

    closeFollowerModal = () => {
       // this.setState({ followerModalIsOpen: false });
    }

    mapInterest = () => {
      /*  return this.state.userData.interest.length == 0 ?
        <Caption>
            Specializations and strengths that you add to your fitness profile will appear here.
                            </Caption> : this.state.userData.interest.map(interest => {
                return (
                    <Chip style={styles.chipStyle} textStyle={styles.chipTextStyle}>
                        {interest}
                    </Chip>
                );
            }) */
    }


    mapPacks = () => {
        return userPackData.map(pack => {
            return (
                <MyPacksCard packTitle={pack.pack_title} packPhotoSrc={pack.pack_image} />
            )
        })
    }

    
    renderFinishEditingBioButton = () => {
        return isEditingBio == true ? 
            <Button mode="text" color="#2196F3" onPress={() => this.handleEndEditingBio()}>
                Done
            </Button>
            :
            <Button mode="text" color="#2196F3" onPress={() => this.setState({ isEditingBio: true })}>
                Edit
            </Button>
    }

    handleEndEditingBio = () => {

    }

    mapBio = () => {
        return isEditingBio == true ?
        <Text style={{fontWeight: 'bold'}} allowFontScaling={true} allowsEditing={true}>
            {userData.bio}
        </Text>
    :
    <TextInput multiline={true} autoGrow={true}>
        {userData.bio}
    </TextInput>
    }

    mapRecommendedWorkouts = () => {
    /*    if (this.state.userRecommendedWorkouts.length == 0)
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
        }*/
    }


    handleFollowUser = async () => {
        let userToFollow = userUUID;
        this.LUPA_CONTROLLER_INSTANCE.followUser(userToFollow, this.LUPA_CONTROLLER_INSTANCE.getCurrentUser().uid);
        await this.setupProfileInformation();
    }

    handleUnFollowUser = async () => {
        let userToUnfollow = userUUID;
        this.LUPA_CONTROLLER_INSTANCE.unfollowUser(userToUnfollow, this.LUPA_CONTROLLER_INSTANCE.getCurrentUser().uid);
        await this.setupProfileInformation();
    }

    _renderFollowButton = () => {
        //No need to render follow button if current user is viewing their own profile modal
       /* const currUserUUID = this.LUPA_CONTROLLER_INSTANCE.getCurrentUser().uid;
        if (this.state.userUUID == currUserUUID) { return };


        return this.state.userData.followers.includes(this.LUPA_CONTROLLER_INSTANCE.getCurrentUser().uid) ? 
        <Button style={{backgroundColor: "#2196F3"}} mode="outlined" color="white" theme={{ roundness: 20 }} onPress={() => this.handleUnFollowUser()}>
        Follow
</Button>
:
<Button mode="outlined" color="#2196F3" theme={{ roundness: 20 }} onPress={() => this.handleFollowUser()}>
Follow
</Button>*/
    }

    handleOnRefresh = () => {
        this.setupProfileInformation();
    }

    _navigateToSessionsView = () => {
        props.navigation.navigate('SessionsView', {
            userUUID: userUUID
        });
    }


        return (
                <Modal style={styles.modalContainer} animationType="slide" visible={props.isOpen}>
                    <ScrollView showsVerticalScrollIndicator={false} shouldRasterizeIOS={true}>
                        <View style={{ margin: 3, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <IconButton icon="clear" size={20} onPress={props.closeModalMethod} />
                            {this._renderFollowButton()}
                        </View>
    
                        <ScrollView showsVerticalScrollIndicator={false} shouldRasterizeIOS={true} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.handleOnRefresh} />}>
                            <View style={styles.user}>
                            <View style={styles.userInfoContainer}>
                                <View style={styles.userInfo}>
                                    <Text style={{fontSize: 18, fontWeight: 'bold', padding: 1, color: 'black'}}>
                                        {
                                            userData.display_name
                                        }
                                    </Text>
                                    <Text style={{fontSize: 15, fontWeight: '600', padding: 1}}>
                                        {userData.username}
                                    </Text>
                                    {
                                        true && userData.isTrainer ? <Text style={{ fontSize: 12, fontWeight: "500", color: "grey", padding: 1 }}>
                                            Lupa Trainer
                                </Text> : <Text style={{ fontSize: 12, fontWeight: "500", color: "grey", padding: 2 }}>
                                                Lupa User
                                </Text>
                                    }
                                </View>
                                <View style={styles.alignCenterColumn}>
                                    <Avatar size={65} source={{uri: userData.photo_url}} rounded containerStyle={{}} />
    
                                </View>
                            </View>
    
    
    
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", margin: 3 }}>
                                    <TouchableOpacity>
                                        <View style={{ flexDirection: "column", alignItems: "center" }}>
                                            <Text>
                                                {
                                                    this.getFollowerLength()
                                                }
                                            </Text>
                                            <Text style={{ fontWeight: "bold" }}>
                                                Followers
                                    </Text>
                                        </View>
    
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <View style={{ flexDirection: "column", alignItems: "center" }}>
                                            <Text>
                                                {
    
                                                }
                                            </Text>
                                            <Text style={{ fontWeight: "bold" }}>
                                                Following
                                    </Text>
                                        </View>
                                    </TouchableOpacity>
    
                                </View>
                            </View>
    
                            <Divider />
    
                            <Timecards />
    
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
                                        
                                        <Button mode="text" color="white">
                                            View all
                                        </Button>
                                    </View>
                                    <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly', alignItems: 'center'}}>
                                    {
                                        this.mapInterest()
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
    
                           {/* <View style={styles.recommendedWorkouts}>
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
                                */}
    
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
                        active={active}
                        direction="up"
                        containerStyle={{}}
                        style={{ backgroundColor: '#637DFF' }}
                        position="bottomRight"
                        onPress={() => this.setState({ active: !active })}>
                        <MaterialIcon name="menu" />
                        <Button style={{ backgroundColor: '#637DFF' }} onPress={() => this._navigateToSessionsView()}>
                            <MaterialIcon name="fitness-center" />
                        </Button>
                    </Fab>
    
                    {
                                 userData.isTrainer == true ?
                                                <View style={styles.recommendedWorkouts}>
                                                <View style={styles.recommendedWorkoutsHeader}>
                                                    <Title>
                                                        Certification
                                                </Title>
                                                </View>
                        <Caption style={{flexWrap: 'wrap'}}>
                            This user is a certified trainer under the { userData.certification }
                        </Caption>
                                            </View>
                                            :
                                            null
                    }
    
                    </ScrollView>
                </Modal>
        )
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

export default connect(mapStateToProps)(ProfilePreviewModal);