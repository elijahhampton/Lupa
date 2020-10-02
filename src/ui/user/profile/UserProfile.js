import React, { useState, useEffect } from 'react';

import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';

import {
    Surface, Appbar, Caption, Divider,
    Button
} from 'react-native-paper';

import {
    Avatar
} from 'react-native-elements';

import {
    Tab,
    Tabs
} from 'native-base'

import ImagePicker from 'react-native-image-picker';
import FeatherIcon from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native';
import LupaController from '../../../controller/lupa/LupaController';
import LOG from '../../../common/Logger';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import VlogFeedCard from '../component/VlogFeedCard';
import { useSelector } from 'react-redux';

function UserProfile({ userData, isCurrentUser }) {
    const navigation = useNavigation();
    const [profileImage, setProfileImage] = useState(userData.photo_url)
    const [currPage, setCurrPage] = useState(0);
    const [userVlogs, setUserVlogs] = useState([])
    const [postType, setPostType] = useState("VLOG");
    const [trailingInterestLength, setTrainingInterestLength] = useState(0);
    const [trainingInterestTextVisible, showTrailingInterestText] = useState(false)
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    const [ready, setReady] = useState(false);

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

    useEffect(() => {
        async function loadProfileData() {
            try {
                setProfileImage(userData.photo_url)
                await fetchVlogs(userData.user_uuid);
                setTrainingInterestLength(userData.interest.length - 3)
                if (userData.interest.length > 3) {
                    showTrailingInterestText(true)
                }
                setReady(true)
            } catch (error) {
                setReady(false)
                alert(error);
                setUserVlogs([])
            }
        }

        loadProfileData()
        LOG('UserProfile.js', 'Running useEffect.')
    }, [ready])


    const fetchVlogs = async (uuid) => {
        await LUPA_CONTROLLER_INSTANCE.getAllUserVlogs(uuid).then(vlogs => {
            setUserVlogs(vlogs);
        })
    }

    /**
     * Allows the current user to choose an image from their camera roll and updates the profile picture in FB and redux.
     */
    const _chooseProfilePictureFromCameraRoll = async () => {

        ImagePicker.showImagePicker({
            allowsEditing: true
        }, async (response) => {
            if (!response.didCancel) {
                setProfileImage(response.uri);

                let imageURL;
                //update in FB storage
                LUPA_CONTROLLER_INSTANCE.saveUserProfileImage(response.uri).then(result => {
                    imageURL = result;
                });

                //update in Firestore
                LUPA_CONTROLLER_INSTANCE.updateCurrentUser('photo_url', imageURL, "");

            }
        });
        //TODO
        //update in redux
        //await this.props.updateCurrentUsers()
    }

    const renderAvatar = () => {
        if (isCurrentUser) {
            return (
                <Surface style={{ marginVertical: 5, elevation: 8, width: 65, height: 65, borderRadius: 65 }}>
                    <Avatar key={userData.photo_url} raised={true} rounded size={65} source={{ uri: profileImage }} showEditButton={true} onPress={_chooseProfilePictureFromCameraRoll} />
                </Surface>
            )
        }

        return <Avatar key={userData.photo_url} rounded size={65} source={{ uri: profileImage }} />
    }

    const renderFollowers = () => {
        return (
            <View style={{ marginVertical: 10, flex: 1, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                <TouchableOpacity onPress={navigateToFollowers}>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Text>
                            {userData.followers.length}
                        </Text>
                        <Text style={styles.userAttributeText}>
                            Followers
        </Text>
                    </View>

                </TouchableOpacity>
                <TouchableOpacity onPress={navigateToFollowers}>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Text>
                            {userData.following.length}
                        </Text>
                        <Text style={styles.userAttributeText}>
                            Following
        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    const renderLocation = () => {
        return (
            <View style={{ paddingVertical: 2, flexDirection: 'row', alignItems: 'center' }}>
                <FeatherIcon name="map-pin" style={{ paddingRight: 5 }} />
                <Text style={[styles.userAttributeText, { color: '#23374d' }]}>{userData.location.city}, {userData.location.state}</Text>
            </View>
        )
    }

    const renderDisplayName = () => {
        return <Text key={userData.display_name} style={styles.displayNameText}>{userData.display_name}</Text>
    }

    const renderBio = () => {
        if (userData.bio.length == 0) {
            return isCurrentUser === true ?
            <Caption style={styles.bioText}>
            You have not setup a bio.
          </Caption>
          :
          <Caption style={styles.bioText}>
             {userData.display_name} has not setup a bio.
        </Caption>
        }

        return (
            <Text style={styles.bioText}>
             {userData.bio}
            </Text>
        )
    }

    const renderInterest = () => {
        if (userData.interest.length == 0) {
            return (
                <Caption>
                    This user has not specified any fitness interest.
                </Caption>
            )
        } else {
            return (
                <View style={{ paddingVertical: 5, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                        <Text style={styles.bioText}>
                            Interest: {" "}
                        </Text>
                        {
                            userData.interest.map((interest, index, arr) => {
                                if (index == 3) {
                                    return;
                                }

                                return (
                                    <Text style={{ fontFamily: 'Avenir-Medium', fontSize: 10, color: 'rgb(58, 58, 61)' }}>
                                        {interest} {" "}
                                    </Text>

                                )
                            })
                        }
                        {trainingInterestTextVisible === true ? <Caption style={{ fontFamily: 'Avenir-Medium', fontSize: 10, color: '#1089ff' }}> and 3 more... </Caption> : null}
                    </View>

                </View>
            )
        }
    }

    const renderVlogs = () => {
        if (userVlogs.length === 0) {
            return (
                <View style={{flex: 1, paddingHorizontal: 10, marginTop: 20, alignItems: 'center', justifyContent: 'flex-start'}}>
                    {
                    isCurrentUser === true ?
                    <Caption>
                        <Caption>
                        You haven't created any vlogs.
                        </Caption>
{" "}
                        <Caption style={{color: '#1089ff'}} onPress={() => navigation.push('CreateNewPost')}>
                        Start publishing by creating content.
                        </Caption>
                    </Caption>
                    :
                    <Caption>
                        No Vlogs have been created by {userData.display_name}
                    </Caption>
                    }
                    
                </View>
            )
        }
        
        return userVlogs.map((vlog, index, arr) => {
            if (typeof (vlog) == 'undefined') {
                return;
            }

            return <VlogFeedCard vlogData={vlog} />
        })
    }

    const renderInteractions = () => {
        if (isCurrentUser) { return; }

        return (
            <View style={{ width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }}>

                {renderFollowButton()}

            </View>
        )
    }

    const renderFollowButton = () => {
        if (isCurrentUser) { return; }
   
           if (currUserData.following.includes(userData.user_uuid)) {
               return (
                   <Button
                       onPress={() => LUPA_CONTROLLER_INSTANCE.unfollowUser(userData.user_uuid, currUserData.user_uuid)}
                       icon={() => <FeatherIcon name="user" />}
                       theme={{ roundness: 5 }}
                       uppercase={false}
                       color="#E5E5E5"
                       mode="outlined"
                       style={{ elevation: 0 }}>
                           Unfollow {userData.display_name}
                       </Button>
               )
           } else {
               return (
                   <Button
                       onPress={() => LUPA_CONTROLLER_INSTANCE.followUser(userData.user_uuid, currUserData.user_uuid)}
                       icon={() => <FeatherIcon size={15} name="user" color="white" />}
                       theme={{ roundness: 5 }}
                       uppercase={false}
                       color="#1089ff"
                       mode="contained"
                       style={{ elevation: 0, width: '100%',   alignItems: 'center', justifyContent: 'center'}}>
                       <Text style={{fontSize: 13}}>
                           Follow {userData.display_name}
                       </Text>
                   </Button>
               )
           }
       }



    /**
     * Navigates to the follower view.
     */
    const navigateToFollowers = () => {
        navigation.push('FollowerView');
    }

    return (
        <SafeAreaView style={styles.container}>
            <Appbar.Header style={styles.appbar}>
                <FeatherIcon name="arrow-left" size={20} onPress={() => navigation.pop()} />
                <Appbar.Content title={userData.email} titleStyle={styles.appbarTitle} />
            {renderFollowButton()}
            </Appbar.Header>
            <ScrollView>
                <View>

                    <View style={styles.userInformationContainer}>
                        <View style={styles.infoContainer}>
                            {renderDisplayName()}
                            {renderInterest()}
                        </View>

                        <View style={styles.avatarContainer}>
                            {renderAvatar()}
                            {renderFollowers()}
                        </View>
                    </View>

                    <View style={{ padding: 10, }}>
                        <View style={{width: '100%', flexDirection: 'row',alignItems: 'center', justifyContent: "space-between"}}>
                        <Text style={{ fontFamily: 'Avenir-Medium', fontSize: 13 }}>
                            Learn more
                </Text>

                <Text style={{color: '#1089ff', fontFamily: 'Avenir-Light', fontSize: 13 }}>
                            Edit Profile
                       
                </Text>
                        </View>

                        {renderBio()}
                    </View>
                    {renderInteractions()}
                </View>
                <Tabs page={currPage} tabBarUnderlineStyle={{ height: 2, backgroundColor: '#1089ff' }} onChangeTab={tabInfo => setCurrPage(tabInfo.i)} tabContainerStyle={{ backgroundColor: '#FFFFFF' }} tabBarBackgroundColor='#FFFFFF' locked={true} >
                    <Tab tabStyle={{backgroundColor: '#FFFFFF'}} activeTabStyle={{backgroundColor: '#FFFFFF'}}  activeTextStyle={styles.activeTabHeading} textStyle={styles.inactiveTabHeading} heading="Vlogs">
                        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                            {renderVlogs()}
                        </View>
                    </Tab>
                </Tabs>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    userInformationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    infoContainer: {
        flex: 3,
        paddingHorizontal: 10,
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    avatarContainer: {
        flex: 2,
        paddingVertical: 10,
        alignItems: 'center'
    },
    bioText: {
        fontFamily: 'Avenir',
        fontSize: 12,
    },
    certificationText: {
        fontFamily: 'Avenir-Light',
    },
    appbar: {
        backgroundColor: 'transparent',
        elevation: 0,
        paddingHorizontal: 20
    },
    appbarTitle: {
        fontSize: 12,
        fontFamily: 'Avenir-Roman'
    },
    displayNameText: {
        paddingVertical: 5,
        fontSize: 20,
        fontFamily: 'Avenir-Black'
    },
    inactiveTabHeading: {
        fontSize: 12,
        fontFamily: 'Avenir-Medium',
        color: 'rgb(102, 111, 120)',
    },
    activeTabHeading: {
        fontSize: 12,
        fontFamily: 'Avenir-Medium',
    },
    userAttributeText: {
        fontSize: 12,
        fontFamily: 'Avenir',

    }
})

export default UserProfile;