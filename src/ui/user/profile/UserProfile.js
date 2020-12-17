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
    FAB,
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
import { useDispatch, useSelector } from 'react-redux';
import EditBioModal from './settings/modal/EditBioModal';
import { getLupaStoreState } from '../../../controller/redux';
import { UPDATE_CURRENT_USER_ATTRIBUTE_ACTION } from '../../../controller/redux/actionTypes';
import { getUpdateCurrentUserAttributeActionPayload } from '../../../controller/redux/payload_utility';

function UserProfile({uuid, userData, isCurrentUser }) {
    const navigation = useNavigation();
    const [profileImage, setProfileImage] = useState(userData.photo_url)
    const [editBioModalIsVisible, setEditBioModalIsVisible] = useState(false);
    const [userVlogs, setUserVlogs] = useState([])
    const [trailingInterestLength, setTrainingInterestLength] = useState(0);
    const [trainingInterestTextVisible, showTrailingInterestText] = useState(false)
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    const [ready, setReady] = useState(false);
    const [forceUpdate, setForceUpdate] = useState(false);

    const dispatch = useDispatch();

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

                //update in FB storage
                LUPA_CONTROLLER_INSTANCE
                .saveUserProfileImage(response.uri)
                .then(result => {
                     //update in Firestore
                LUPA_CONTROLLER_INSTANCE.updateCurrentUser('photo_url', result, "");
                });
            }
        });
        //TODO
        //update in redux
        //await this.props.updateCurrentUsers()
    }

    const renderAvatar = () => {
        try {
            if (isCurrentUser == true) {
                return (
                    <Avatar key={userData.photo_url} raised={true} rounded size={60} source={{ uri: profileImage }} showEditButton={true} onPress={_chooseProfilePictureFromCameraRoll} />
                )
            }

            return <Avatar key={userData.photo_url} rounded size={60} source={{ uri: profileImage }} />
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

    const renderFAB = () => {
        if (isCurrentUser == true) {
            return <FAB onPress={() => navigation.push('CreatePost')} icon="video" style={{ backgroundColor: '#1089ff', position: 'absolute', bottom: 0, right: 0, margin: 16 }} />
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
                    <Text style={[styles.userAttributeText, { color: '#212121', fontFamily: 'Avenir', fontSize: 13 }]}>
                        Followers
    </Text>
                </View>

            </TouchableOpacity>
            <TouchableOpacity onPress={navigateToFollowers}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 13, fontFamily: 'Avenir-Heavy' }}>
                        {getFollowingLength()}
                    </Text>
                    <Text style={[styles.userAttributeText, { color: '#212121', fontFamily: 'Avenir-Roman', fontSize: 13 }]}>
                        Following
    </Text>
                </View>
            </TouchableOpacity>
        </View>
        )
    }

    const renderLocation = () => {
        return <Text style={[styles.userAttributeText, { color: 'rgb(35, 73, 115)', fontFamily: 'Avenir-Light' }]}>{userData.location.city}, {userData.location.state}</Text>
    }

    const renderDisplayName = () => {
        return <Text key={userData.display_name} style={styles.displayNameText}>{userData.display_name}</Text>
    }

    const renderBio = () => {
        if (userData.bio.length == 0) {
            return isCurrentUser === true ?
            <Caption>
            You have not setup a bio.
          </Caption>
          :
          <Caption>
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
                                        {interest}, {" "}
                                    </Text>

                                )
                            })
                        }
                        {trainingInterestTextVisible === true ? <Caption style={{ fontFamily: 'Avenir-Medium', fontSize: 10, color: '#1089ff' }}> and more...</Caption> : null}
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
                      currUserData.user_uuid == uuid ?
                    <Text style={{paddingHorizontal: 10}}>
                    <Text style={{color: 'rgb(116, 126, 136)', fontFamily: 'Avenir-Medium', fontSize: 15, fontWeight: '800'}}>
                <Text>
                You haven't created any vlogs.{" "}
                </Text>
                <Text onPress={() => navigation.push('CreateNewPost')} style={{color: '#1089ff', fontSize: 15, fontFamily: 'Avenir-Medium', fontWeight: '800'}}>
                Start creating content on Lupa.
                </Text>
            </Text>
            </Text>
            :
                    <Text style={{color: 'rgb(116, 126, 136)', fontFamily: 'Avenir-Medium', fontSize: 15, fontWeight: '800'}}>
               No Vlogs have been created by {userData.display_name}.
            </Text>
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
        if (!ready) { return null }

        if (isCurrentUser == true) { return; }
 
         return (
             <View style={{ paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginVertical: 10 }}>
                 {renderFollowButton()}
 
                 <TouchableOpacity onPress={() => navigation.push('PrivateChat', {
                            currUserUUID: currUserData.user_uuid,
                            otherUserUUID: userData.user_uuid,
                        })}>
                     <View style={{ backgroundColor: '#FFFFFF', borderColor: 'rgb(231, 231, 236)', borderWidth: 0.5, padding: 10, width: 100, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginHorizontal: 3, }}>
                         <Text style={{ fontSize: 12, fontWeight: '600', color: 'black' }}>
                             Message
                     </Text>
                     </View>
                 </TouchableOpacity>
             </View>
         )
    }

    const handleUnFollowUser = () => {

        LUPA_CONTROLLER_INSTANCE.unfollowUser(userData.user_uuid, currUserData.user_uuid);
        
        let updatedFollowList = currUserData.following;
        updatedFollowList.splice(updatedFollowList.indexOf(userData.user_uuid), 1);

        const payload = getUpdateCurrentUserAttributeActionPayload('following', updatedFollowList);
        dispatch({ type: UPDATE_CURRENT_USER_ATTRIBUTE_ACTION, payload: payload })

        setForceUpdate(!forceUpdate);
    }

    const handleFollowUser = () => {
        LUPA_CONTROLLER_INSTANCE.followUser(userData.user_uuid, currUserData.user_uuid)

        let updatedFollowerList = currUserData.following;
        updatedFollowerList.push(userData.user_uuid);

        const payload = getUpdateCurrentUserAttributeActionPayload('followers', updatedFollowerList);
        dispatch({ type: UPDATE_CURRENT_USER_ATTRIBUTE_ACTION, payload: payload })
        
        setForceUpdate(!forceUpdate);
    }

    const renderFollowButton = () => {
        if (  currUserData.user_uuid == uuid ) { return; }

        const updatedCurrUserData = getLupaStoreState().Users.currUserData;
   
           if (updatedCurrUserData.following.includes(userData.user_uuid) == false) {
               return (
                <TouchableOpacity onPress={handleFollowUser}>
                <View style={{ backgroundColor: 'rgb(35, 73, 115)', padding: 10, width: 100, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginHorizontal: 3, }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: 'white' }}>
                        Follow
                </Text>
                </View>
            </TouchableOpacity>
               )
           } else {
               return (
                <TouchableOpacity onPress={handleUnFollowUser}>
                <View style={{ backgroundColor: 'rgb(35, 73, 115)', padding: 10, width: 100, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginHorizontal: 3, }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: 'white' }}>
                        Unfollow
                </Text>
                </View>
            </TouchableOpacity>
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
                <FeatherIcon name="arrow-left" size={20} onPress={() => navigation.pop()} />
                
            </Appbar.Header>
            <ScrollView>
                <View>
                <View style={{ backgroundColor: '#FFFFFF' }}>
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
                    </View>

                    <View style={{ padding: 10, }}>
                        <View style={{width: '100%', flexDirection: 'row',alignItems: 'center', justifyContent: "space-between"}}>
                        <Text style={{ fontFamily: 'Avenir-Medium', fontSize: 13 }}>
                            Learn more
                </Text>

                <Text onPress={() => setEditBioModalIsVisible(true)} style={{ color: '#1089ff', fontWeight: '600', fontSize: 12 }}>
                            Edit Bio
                </Text>
                        </View>
                        {renderBio()}
                    </View>
                    {renderInteractions()}
                </View>
                <Tabs tabBarUnderlineStyle={{ backgroundColor: '#1089ff' }} tabContainerStyle={{ backgroundColor: '#FFFFFF', borderBottomWidth: 0 }} tabBarBackgroundColor='#FFFFFF' >
                    <Tab tabStyle={{backgroundColor: '#FFFFFF'}} activeTabStyle={{backgroundColor: '#FFFFFF'}}  activeTextStyle={styles.activeTabHeading} textStyle={styles.inactiveTabHeading} heading="Vlogs">
                        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                            {renderVlogs()}
                        </View>
                    </Tab>
                </Tabs>
            </ScrollView>

            {renderFAB()}
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
        backgroundColor: '#FFFFFF'
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
        fontSize: 13,
    },
    certificationText: {
        fontFamily: 'Avenir-Light',
    },
    appbar: {
        backgroundColor: '#FFFFFF',
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
        fontSize: 13,
        fontFamily: 'Avenir-Light',

    }
})

export default UserProfile;