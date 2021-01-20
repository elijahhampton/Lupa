import React, { useState, useEffect } from 'react';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    SafeAreaView,
    RefreshControl
} from 'react-native';

import {
    Surface, 
    Appbar, 
    Caption, 
    FAB, 
    Avatar as PaperAvatar,
    Divider,
} from 'react-native-paper';


import {
    Tab,
    Tabs
} from 'native-base'

import { 
    Avatar 
} from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import FeatherIcon from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native';
import LupaCalendar from './component/LupaCalendar';
import { useDispatch, useSelector } from 'react-redux';
import LupaController from '../../../controller/lupa/LupaController';
import ProfileProgramCard from '../../workout/program/components/ProfileProgramCard';
import LOG, { LOG_ERROR } from '../../../common/Logger';
import VlogFeedCard from '../component/VlogFeedCard'
import Feather1s from 'react-native-feather1s/src/Feather1s';
import EditBioModal from './settings/modal/EditBioModal'
import { getUpdateCurrentUserAttributeActionPayload } from '../../../controller/redux/payload_utility';
import { getLupaStoreState } from '../../../controller/redux';
import HourlyPaymentModal from '../modal/HourlyPaymentModal';
import { UPDATE_CURRENT_USER_ATTRIBUTE_ACTION } from '../../../controller/redux/actionTypes';

function TrainerProfile({ userData, isCurrentUser, uuid }) {
    const navigation = useNavigation();
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    const [profileImage, setProfileImage] = useState(userData.photo_url)
    const [showHourlyPaymentModal, setShowHourlyPaymentModalVisible] = useState(false);
    const [userPrograms, setUserPrograms] = useState([])
    const [userVlogs, setUserVlogs] = useState([])
    const [editBioModalVisible, setEditBioModalVisible] = useState(false);
    const [markedDates, setMarkedDates] = useState([])
    const [showSchedulerButton, setShowSchedulerButton] = useState(false);
    const [ready, setReady] = useState(false)
    const [refreshing, setRefreshing] = useState(false);
    const [forceUpdate, setForceUpdate] = useState(false);
    const [trailingInterestLength, setTrainingInterestLength] = useState(0);
    const [trainingInterestTextVisible, showTrailingInterestText] = useState(false)
    
    const dispatch = useDispatch();
    
    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })

    const currUserPrograms = useSelector(state => {
        return state.Programs.currUserProgramsData;
    })

    const captureMarkedDate = (dateObject) => {
        let updatedMarkedDates = markedDates;

        if (markedDates.includes(dateObject)) {
            updatedMarkedDates.splice(updatedMarkedDates.indexOf(dateObject), 1);
            setMarkedDates(updatedMarkedDates);

        } else {
            updatedMarkedDates.push(dateObject);
            setMarkedDates(updatedMarkedDates)
        }

        setForceUpdate(!forceUpdate);
    }

    /**
     * Allows the current user to choose an image from their camera roll and updates the profile picture in FB and redux.
     */
    const _chooseProfilePictureFromCameraRoll = async () => {

        ImagePicker.showImagePicker({
            allowsEditing: true
        }, async (response) => {
            if (!response.didCancel) {

                if (response.uri == "" || response.uri == null || typeof (response.uri) == 'undefined') {
                    return;
                }

                setProfileImage(response.uri)

                //update in FB storage
                LUPA_CONTROLLER_INSTANCE.saveUserProfileImage(response.uri).then(result => {
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
            if (isCurrentUser == false) {
                return (
                    <Avatar key={userData.photo_url} rounded size={60} source={{ uri: profileImage }} />
                )
            }

            return <Avatar key={userData.photo_url} rounded size={60} source={{ uri: profileImage }} showEditButton={true} onPress={_chooseProfilePictureFromCameraRoll} />
        } catch (error) {
            if (isCurrentUser == false) {
                return <PaperAvatar.Icon style={{ backgroundColor: 'white' }} icon={() => <FeatherIcon name="user" size={60} />} />

            } else {
                return (
                    <Surface style={{ marginVertical: 5, elevation: 8, width: 65, height: 65, borderRadius: 65 }}>
                        <Avatar key={userData.photo_url} raised={true} rounded size={65} source={{ uri: profileImage }} showEditButton={true} onPress={_chooseProfilePictureFromCameraRoll} />
                    </Surface>
                )
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
                        <Text style={{ fontSize: 15, fontFamily: 'Avenir-Heavy' }}>
                            {getFollowersLength()}
                        </Text>
                        <Text style={[styles.userAttributeText, { color: '#212121', fontFamily: 'Avenir', fontSize: 13 }]}>
                            Followers
        </Text>
                    </View>

                </TouchableOpacity>
                <TouchableOpacity onPress={navigateToFollowers}>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 15, fontFamily: 'Avenir-Heavy' }}>
                            {getFollowingLength()}
                        </Text>
                        <Text style={[styles.userAttributeText, { color: '#212121', fontFamily: 'Avenir', fontSize: 13 }]}>
                            Following
        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    const renderCertification = () => {
        return (<View style={{ paddingVertical: 2, flexDirection: 'row', alignItems: 'center' }}>
            <FeatherIcon name="file-text" style={{ paddingRight: 5 }} />
            <Text style={[styles.userAttributeText, { color: '#23374d' }]}>NASM</Text>
        </View>)
    }

    const renderLocation = () => {
        return <Text style={[styles.userAttributeText, { color: 'rgb(35, 73, 115)', fontFamily: 'Avenir-Light' }]}>{userData.location.city}, {userData.location.state}</Text>
    }

    const renderDisplayName = () => {
        return <Text key={userData.display_name} style={styles.displayNameText}>{userData.display_name}</Text>
    }

    const renderTrainerType = () => {
        if (userData.trainer_metadata.training_styles.length == 0) {
            return (
                <Caption>
                    This user has not specified any fitness interest.
                </Caption>
            )
        } else {
            return (
                <View style={{ paddingVertical: 2, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                        <Text style={styles.userAttributeText}>
                            Interest: {" "}
                        </Text>
                        {
                            userData.trainer_metadata.training_styles.map((interest, index, arr) => {
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
                        {trainingInterestTextVisible === true ? <Caption style={{ fontFamily: 'Avenir-Medium', fontSize: 10, color: '#1089ff' }}> and more... </Caption> : null}
                    </View>

                </View>
            )
        }
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

    const renderVlogs = () => {
        if (!ready) { return null; }

        if (userVlogs.length === 0) {
            return (
                <View style={{ flex: 1, paddingHorizontal: 10, marginTop: 20, alignItems: 'center', justifyContent: 'flex-start' }}>
                    {
                        isCurrentUser === false ?
                        <Text style={{color: 'rgb(116, 126, 136)', fontFamily: 'Avenir-Medium', fontSize: 15, fontWeight: '800'}}>
                        No Vlogs have been created by {userData.display_name}.
                     </Text>
                
                    
                :
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
               
                

                    }

                </View>
            )
        }

        return userVlogs.map((vlog, index, arr) => {
            if (typeof (vlog) == 'undefined') {
                return null;
            }

            return <VlogFeedCard vlogData={vlog} />
        })
    }

    const renderPrograms = () => {
        if (!ready) { return null; }

        if (userPrograms.length === 0) {
            return (
                <View style={{ flex: 1, paddingHorizontal: 10, marginTop: 20, alignItems: 'center', justifyContent: 'flex-start' }}>
                    {
                        isCurrentUser === false ?
                        <Text style={{color: 'rgb(116, 126, 136)', fontFamily: 'Avenir-Medium', fontSize: 15, fontWeight: '800'}}>
                    No programs have been created by {userData.display_name}.
                </Text>
                :
                <Text>
                <Text style={{color: 'rgb(116, 126, 136)', fontFamily: 'Avenir-Medium', fontSize: 15, fontWeight: '800'}}>
            <Text>
                You haven't created any programs.{" "}
            </Text>
            <Text onPress={() => navigation.push('CreateProgram')} style={{color: '#1089ff', fontSize: 15, fontFamily: 'Avenir-Medium', fontWeight: '800'}}>
                Get started with your first.
            </Text>
        </Text>
        </Text>
                       
                    }

                </View>
            )
        }

        return userPrograms.map((program, index, arr) => {
            if (typeof (program) === 'undefined') {

                return;
            }
         
            return (

                <ProfileProgramCard programData={program} />
            )
        })
    }

    const renderInteractions = () => {
        if (!ready) { return null }

       if (isCurrentUser) { return; }

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

    const renderFAB = () => {
        if (isCurrentUser == true) {
            return <FAB onPress={() => navigation.push('CreatePost')} icon="video" style={{ backgroundColor: '#1089ff', position: 'absolute', bottom: 0, right: 0, margin: 16 }} />
        }
    }

    /**
     * Navigates to the follower view.
     */
    const navigateToFollowers = () => {
        navigation.navigate('FollowerView');
    }

    const fetchVlogs = async (uuid) => {
        await LUPA_CONTROLLER_INSTANCE.getAllUserVlogs(uuid).then(vlogs => {
            setUserVlogs(vlogs);
        })
    }

    const fetchPrograms = async (uuid) => {
        let programs = [];
        let profilePrograms = [];
        await LUPA_CONTROLLER_INSTANCE
        .getAllUserPrograms(uuid)
        .then(data => {
            programs = data;
            for (let i = 0; i < data.length; i++) {
                if (programs[i].isPublic == true) {
                    profilePrograms.push(programs[i]);
                }
            }
        })

        setUserPrograms(profilePrograms);
    }

    const setTrainerPrograms = () => {
        let profilePrograms = [];
        const trainerPrograms = currUserPrograms;
        for (let i = 0; i < trainerPrograms.length; i++) {
            if (trainerPrograms[i].isPublic === true) {
                profilePrograms.push(trainerPrograms[i]);
            }
        }

        setUserPrograms(profilePrograms);
    }

    async function loadProfileData() {
        try {
            setProfileImage(userData.photo_url);
            await fetchVlogs(userData.user_uuid);

            if (currUserData.user_uuid == userData.user_uuid) {
          
                setTrainerPrograms();
            } else {
             
                await fetchPrograms(userData.user_uuid);
            }

        } catch (error) {
            setReady(false)
            setUserVlogs([])
            setUserPrograms([])
        }
    }


    useEffect(() => {
        async function loadProfile() {
            try {
                setProfileImage(userData.photo_url);
                await fetchVlogs(userData.user_uuid);
               if (currUserData.user_uuid == userData.user_uuid) {
                    setTrainerPrograms();
                } else {
                    await fetchPrograms(userData.user_uuid);
                }

                let total = userData.trainer_metadata.training_styles.length

                if (userData.trainer_metadata.training_styles.length > 3) {
                    setTrainingInterestLength(total - 3)
                    showTrailingInterestText(true)
                } else {
                    setTrainingInterestLength(total)
                    showTrailingInterestText(false);
                }
            } catch (error) {
                setReady(false)
                setUserVlogs([])
                setUserPrograms([])
            }
        }

        loadProfile()
        setReady(true)
        LOG('TrainerProfile.js', 'Running useEffect.')
    }, [uuid])

    const handleOnRefresh = async () => {
        
        await setRefreshing(true);
        await loadProfileData();
        await setRefreshing(false);
    }

    const handleHourPaymentOnPress = () => {
        if (isCurrentUser == false) {
            return;
        }

        navigation.push('HourlyPayment');
    }



    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.appbar}>
            <Appbar.BackAction onPress={() => navigation.pop()} />
                <Appbar.Content onPress={handleHourPaymentOnPress} title={`$${userData.hourly_payment_rate}/HR`} titleStyle={{color: isCurrentUser == false ? 'black' : '#1089ff', fontWeight: '500', alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontSize: 22}}/>
            </Appbar.Header>
            
            <ScrollView refreshControl={<RefreshControl onRefresh={handleOnRefresh} refreshing={refreshing} />}>
                <View>
                    <View style={{ backgroundColor: '#FFFFFF' }}>
                        <View style={styles.userInformationContainer}>
                            <View style={styles.infoContainer}>
                                {renderDisplayName()}
                                <View>
                                {renderLocation()}
                                {renderTrainerType()}
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
                        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
                            <Text style={{ fontFamily: 'Avenir-Medium', fontSize: 13 }}>
                                Learn more
                            </Text>
                            {
                                isCurrentUser === true ?
                                    <Text onPress={() => setEditBioModalVisible(true)} style={{ color: '#1089ff', fontWeight: '600', fontSize: 12 }}>
                                        Edit Bio
                                    </Text>
                                    :
                                    null
                            }
                        </View>
                        {renderBio()}
                    </View>
                </View>

                <Tabs initialPage={2} tabBarUnderlineStyle={{  backgroundColor: '#1089ff' }} tabContainerStyle={{ backgroundColor: '#FFFFFF', borderBottomWidth: 0 }} tabBarBackgroundColor='#FFFFFF'>
                    <Tab tabStyle={{ backgroundColor: '#FFFFFF' }} activeTabStyle={{ backgroundColor: '#FFFFFF' }} activeTextStyle={styles.activeTabHeading} textStyle={styles.inactiveTabHeading} heading="Programs">
                        <View style={{ backgroundColor: '#FFFFFF' }}>
                            {renderPrograms()}
                        </View>
                    </Tab>

                    <Tab tabStyle={{ backgroundColor: '#FFFFFF' }} activeTabStyle={{ backgroundColor: '#FFFFFF' }} activeTextStyle={styles.activeTabHeading} textStyle={styles.inactiveTabHeading} heading="Vlogs">
                        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                            {renderVlogs()}
                        </View>
                    </Tab>
                    <Tab tabStyle={{ backgroundColor: '#FFFFFF' }} activeTabStyle={{ backgroundColor: '#FFFFFF' }} activeTextStyle={styles.activeTabHeading} textStyle={styles.inactiveTabHeading} heading="Book Me">
                        <View style={{ backgroundColor: '#FFFFFF', height: Dimensions.get('window').height }}>
                            <LupaCalendar captureMarkedDates={captureMarkedDate} agendaData={userData.scheduler_times} uuid={userData.user_uuid} />
                        </View>
                    </Tab>
                </Tabs>
            </ScrollView>

            {renderFAB()}

            <EditBioModal isVisible={editBioModalVisible} closeModalMethod={() => setEditBioModalVisible(false)} />
        <SafeAreaView />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
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
        fontFamily: 'Avenir-Roman',
        fontSize: 13,

    },
    certificationText: {
        fontFamily: 'Avenir-Light',
    },
    appbar: {
        elevation: 0,
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF'
    },
    displayNameText: {
        paddingVertical: 2,
        fontSize: 20,
        fontFamily: 'Avenir-Black'
    },
    inactiveTabHeading: {
        fontSize: 15,
        fontFamily: 'Avenir-Medium',
        fontWeight: '500',
        color: 'rgb(102, 111, 120)',
    },
    activeTabHeading: {
        fontSize: 15,
        fontFamily: 'Avenir-Heavy',
        fontWeight: '700',
color: '#1089ff'
    },
    userAttributeText: {
        fontSize: 13,
        fontFamily: 'Avenir-Light',
    }
})

export default TrainerProfile;