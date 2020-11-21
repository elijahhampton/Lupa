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
    Surface, 
    Appbar, 
    Caption,
    Button
} from 'react-native-paper';

import {
    Avatar
} from 'react-native-elements';

import {
    Tab,
    Tabs
} from 'native-base'

import { useNavigation } from '@react-navigation/native';
import ImagePicker from 'react-native-image-picker';
import FeatherIcon from 'react-native-vector-icons/Feather'
import LupaController from '../../../controller/lupa/LupaController';
import LOG, { LOG_ERROR } from '../../../common/Logger';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import VlogFeedCard from '../component/VlogFeedCard';
import { useSelector } from 'react-redux';
import EditBioModal from './settings/modal/EditBioModal';

function UserProfile({ userData, isCurrentUser }) {
    const navigation = useNavigation();
    const [profileImage, setProfileImage] = useState(userData.photo_url)
    const [editBioModalIsVisible, setEditBioModalIsVisible] = useState(false);
    const [userVlogs, setUserVlogs] = useState([])
    const [trailingInterestLength, setTrainingInterestLength] = useState(0);
    const [trainingInterestTextVisible, showTrailingInterestText] = useState(false)
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    const [ready, setReady] = useState(false);

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

    useEffect(() => {
        let isSubscribed = true;
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
         
                setUserVlogs([])
            }
        }
        loadProfileData()
        LOG('UserProfile.js', 'Running useEffect.')
        return () => isSubscribed = false;
    }, [profileImage, ready])


    const fetchVlogs = async (uuid) => {
        await LUPA_CONTROLLER_INSTANCE.getAllUserVlogs(uuid).then(vlogs => {
            setUserVlogs(vlogs);
        })
    }

    /**
     * Allows the current user to choose an image from their camera roll and updates the profile picture in FB and redux.
     */
    const _chooseProfilePictureFromCameraRoll = async () => {

        ImagePicker.launchImageLibrary({
            allowsEditing: true
        }, async (response) => {
            if (!response.didCancel) {
                if (response.uri == "" || response.uri == null || typeof(response.uri) == 'undefined') {
                    return;
                }

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
        try {
            if (isCurrentUser) {
                return (
                    <Avatar key={userData.photo_url} raised={true} rounded size={60} source={{ uri: profileImage }} showEditButton={true} onPress={_chooseProfilePictureFromCameraRoll} />
                )
            }

            return <Avatar key={userData.photo_url} rounded size={80} source={{ uri: profileImage }} />
        } catch (error) {
            if (isCurrentUser) {
                return (
                    <Surface style={{ marginVertical: 5, elevation: 8, width: 65, height: 65, borderRadius: 65 }}>
                        <Avatar key={userData.photo_url} raised={true} rounded size={65} source={{ uri: profileImage }} showEditButton={true} onPress={_chooseProfilePictureFromCameraRoll} />
                    </Surface>
                )
            } else {
                return <PaperAvatar.Icon style={{ backgroundColor: 'white' }} icon={() => <FeatherIcon name="user" size={30} />} />
            }
        }
    }

    const getFollowersLength = () => {
        if (typeof (userData.followers.length) == 'undefined') {
            return 0;
        }

        try {
            return userData.followers.length
        } catch (error) {
            return 0;
        }
    }

    const getFollowingLength = () => {
        if (typeof (userData.following.length) == 'undefined') {
            return 0;
        }

        try {
            return userData.following.length
        } catch (error) {
            return 0;
        }
    }

    const renderFollowers = () => {
        return (
            <View style={{ marginVertical: 10, flex: 1, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
            <TouchableOpacity onPress={navigateToFollowers}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 13, fontFamily: 'Avenir-Heavy' }}>
                        {getFollowersLength()}
                    </Text>
                    <Text style={[styles.userAttributeText, { color: '#212121', fontFamily: 'Avenir-Roman', fontSize: 11 }]}>
                        Followers
    </Text>
                </View>

            </TouchableOpacity>
            <TouchableOpacity onPress={navigateToFollowers}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 13, fontFamily: 'Avenir-Heavy' }}>
                        {getFollowingLength()}
                    </Text>
                    <Text style={[styles.userAttributeText, { color: '#212121', fontFamily: 'Avenir-Roman', fontSize: 11 }]}>
                        Following
    </Text>
                </View>
            </TouchableOpacity>
        </View>
        )
    }

    const renderLocation = () => {
        return <Text style={[styles.userAttributeText, { color: 'rgb(35, 73, 115)', fontFamily: 'Avenir-Heavy' }]}>{userData.location.city}, {userData.location.state}</Text>
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
                <View style={{ paddingVertical: 2, flexDirection: 'row', alignItems: 'center' }}>
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
        <View style={styles.container}>
            <Appbar.Header style={styles.appbar}>
                <Feather1s name="arrow-left" size={20} onPress={() => navigation.pop()} />
                
                {
                    isCurrentUser === true ?
                    null
                    :
                    <Feather1s name="send" size={22} onPress={() => navigation.push('PrivateChat', {
                        currUserUUID: currUserData.user_uuid,
                        otherUserUUID: userData.user_uuid,
                    })} />
                }
            </Appbar.Header>
            <ScrollView>
                <View>
                <View style={{ backgroundColor: 'rgb(247, 247, 247)' }}>
                        <View style={styles.userInformationContainer}>
                            <View style={styles.infoContainer}>
                                {renderDisplayName()}
                                <View>
                                {renderLocation()}
                                {renderInterest()}
                                </View>
                            </View>
                            <View style={styles.avatarContainer}>
                                {renderAvatar()}
                                {renderFollowers()}
                            </View>
                        </View>
                        {renderInteractions()}
                    </View>

                    <View style={{ padding: 10, }}>
                        <View style={{width: '100%', flexDirection: 'row',alignItems: 'center', justifyContent: "space-between"}}>
                        <Text style={{ fontFamily: 'Avenir-Medium', fontSize: 13 }}>
                            Learn more
                </Text>

                <Text onPress={() => setEditHoursModalVisible(true)} style={{ color: '#1089ff', fontWeight: '600', fontSize: 12 }}>
                            Edit Bio
                </Text>
                        </View>
                        {renderBio()}
                    </View>
                    {renderInteractions()}
                </View>
                <Tabs tabBarUnderlineStyle={{ height: 0, backgroundColor: '#1089ff' }} tabContainerStyle={{ backgroundColor: '#FFFFFF', borderBottomWidth: 0 }} tabBarBackgroundColor='#FFFFFF' >
                    <Tab tabStyle={{backgroundColor: '#FFFFFF'}} activeTabStyle={{backgroundColor: '#FFFFFF'}}  activeTextStyle={styles.activeTabHeading} textStyle={styles.inactiveTabHeading} heading="Vlogs">
                        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                            {renderVlogs()}
                        </View>
                    </Tab>
                </Tabs>
            </ScrollView>

            <EditBioModal isVisible={editBioModalIsVisible} closeModalMethod={() => setEditBioModalIsVisible(false)} />
            <SafeAreaView />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    userInformationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: 'rgb(247, 247, 247)'
    },
    infoContainer: {
        flex: 3,
        height: 120,
        justifyContent: 'space-evenly',
        paddingHorizontal: 10,
        alignItems: 'flex-start',

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
        backgroundColor: 'rgb(247, 247, 247)',
        elevation: 0,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    appbarTitle: {
        fontSize: 12,
        fontFamily: 'Avenir-Roman'
    },
    displayNameText: {
        paddingVertical: 2,
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