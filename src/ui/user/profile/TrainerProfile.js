import React, { useState, useEffect } from 'react';

import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
    RefreshControl
} from 'react-native';

import {
    Surface, Appbar, Caption, Button, FAB, Menu, Card, Avatar as PaperAvatar, Divider
} from 'react-native-paper';


import {
    Tab,
    Tabs
} from 'native-base'
import { Avatar } from 'react-native-elements';
import FeatherIcon from 'react-native-vector-icons/Feather'
import LupaColor from '../../common/LupaColor'
import ImagePicker from 'react-native-image-picker';
import ThinFeatherIcon from 'react-native-feather1s'
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import LupaCalendar from './component/LupaCalendar';
import SchedulerModal from './component/SchedulerModal';
import CreateNewPost from './modal/CreateNewPost'
import RBSheet from 'react-native-raw-bottom-sheet'
import { useSelector } from 'react-redux';
import LupaController from '../../../controller/lupa/LupaController';
import ProfileProgramCard from '../../workout/program/components/ProfileProgramCard';
import LOG, { LOG_ERROR } from '../../../common/Logger';
import VlogFeedCard from '../component/VlogFeedCard'
import { getStreetAddressFromCoordinates } from '../../../modules/location/mapquest/mapquest';
import Feather1s from 'react-native-feather1s/src/Feather1s';
import BookNowModal from './modal/BookNowModal';
import { retrieveAsyncData, storeAsyncData } from '../../../controller/lupa/storage/async';
import EditBioModal from './settings/modal/EditBioModal'
import { InformationIcon } from '../../icons';
import BookingRequestModal from '../modal/BookingRequestModal';

function TrainerProfile({ userData, isCurrentUser, uuid }) {
    const navigation = useNavigation();
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    const [profileImage, setProfileImage] = useState(userData.photo_url)
    const [userPrograms, setUserPrograms] = useState([])
    const [userVlogs, setUserVlogs] = useState([])
    const [editHoursModalVisible, setEditHoursModalVisible] = useState(false);
    const [currPage, setCurrPage] = useState(2)
    const [markedDates, setMarkedDates] = useState([])
    const [showSchedulerButton, setShowSchedulerButton] = useState(false);
    const [ready, setReady] = useState(false)
    const [showLocationMessage, setShowLocationMessage] = useState(false);
    const [resultsLength, setResultsLength] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [forceUpdate, setForceUpdate] = useState(false);
    const [trailingInterestLength, setTrainingInterestLength] = useState(0);
    const [trainingInterestTextVisible, showTrailingInterestText] = useState(false)
    const [trainerBookingModalVisible, setTrainerBookingModalVisible] = useState(false);
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

                if (response.uri == "" || response.uri == null || typeof(response.uri) == 'undefined') {
                    return;
                }

                setProfileImage(response.uri)

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

    const renderCertification = () => {
        return (<View style={{ paddingVertical: 2, flexDirection: 'row', alignItems: 'center' }}>
            <FeatherIcon name="file-text" style={{ paddingRight: 5 }} />
            <Text key={userData.certification} style={[styles.userAttributeText, { color: '#23374d' }]}>NASM</Text>
        </View>)
    }

    const renderLocation = () => {
        return (<View style={{ paddingVertical: 2, flexDirection: 'row', alignItems: 'center' }}>
            <FeatherIcon name="map-pin" style={{ paddingRight: 5 }} />
            <Text style={[styles.userAttributeText, { color: '#23374d' }]}>{userData.location.city}, {userData.location.state}</Text>
        </View>)
    }

    const renderDisplayName = () => {
        return <Text key={userData.display_name} style={styles.displayNameText}>{userData.display_name}</Text>
    }

    const renderTrainerType = () => {
        return (<View style={{ paddingVertical: 2, flexDirection: 'row', alignItems: 'center' }}>
            <FeatherIcon name="activity" style={{ paddingRight: 5 }} />
            {
                userData.trainer_metadata.trainer_interest.map((type, index, arr) => {
                    if (index == arr.length - 1) {
                        return (
                            <Text style={[styles.userAttributeText, { color: '#23374d' }]}>
                            {type}
                        </Text>
                        )
                    }

                    return (
                        <Text style={[styles.userAttributeText, { color: '#23374d' }]}>
                       {type} {" - "}
                   </Text>
                    );
                })
            }
        </View>
        )
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

    const renderVlogs = () => {
        if (!ready) { return null; }
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
            if (typeof(vlog) == 'undefined') {
                return null;
            }

            return <VlogFeedCard vlogData={vlog} />
        })
    }

    const renderPrograms = () => {
        if (!ready) { return null; }

        if (userPrograms.length === 0) {
            return (
                <View style={{flex: 1, paddingHorizontal: 10, marginTop: 20, alignItems: 'center', justifyContent: 'flex-start'}}>
                    {
                    isCurrentUser === true ?
                    <Caption>
                        <Caption>
                        You haven't created any programs.
                        </Caption>
                        {" "}
                        <Caption style={{color: '#1089ff'}} onPress={() => navigation.push('CreateProgram')}>
                        Create your first program.
                        </Caption>
                    </Caption>
                    :
                    <Caption>
                        No programs have been created by {userData.display_name}
                    </Caption>
                    }
                    
                </View>
            )
        }

        return userPrograms.map((program, index, arr) => {
            if (typeof(program) == 'undefined') {
                return null;
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
            <View style={{ width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }}>

                {renderFollowButton()}

            </View>
        )
    }

    const renderFollowButton = () => {
        if (!ready) { return null }

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

    const renderFAB = () => {
        if (!isCurrentUser) {
            return <FAB onPress={() => setTrainerBookingModalVisible(false)} icon="calendar" style={{ backgroundColor: '#1089ff', position: 'absolute', bottom: 0, right: 0, margin: 16 }} />
        } else {
            return <FAB onPress={() => navigation.push('CreatePost')} icon="rss" style={{ backgroundColor: '#1089ff', position: 'absolute', bottom: 0, right: 0, margin: 16 }} />
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
                            userData.trainer_metadata.trainer_interest.map((interest, index, arr) => {
                     
                                if (index >= 3) {
                                  return;
                                }

                                return (
                                    <Text style={{ fontFamily: 'Avenir-Medium', fontSize: 10, color: 'rgb(58, 58, 61)' }}>
                                        {interest} {" "}
                                    </Text>

                                )
                            })
                        }
                        {trainingInterestTextVisible === true ? <Caption style={{ fontFamily: 'Avenir-Medium', fontSize: 10, color: '#1089ff' }}> and {trailingInterestLength} more... </Caption> : null}
                    </View>

                </View>
            )
        }
    }

    const fetchPrograms = async (uuid) => {
        let programs = [];
        let profilePrograms = [];
        await LUPA_CONTROLLER_INSTANCE.getAllUserPrograms(uuid).then(data => {
            programs = data;
        })

        for (let i = 0; i < programs.length; i++) {
           if (programs[i].isPublic === true) {
                profilePrograms.push(programs[i]);
            }
        }

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
            setProfileImage(userData.photo_url)
            await fetchVlogs(userData.user_uuid);
            if (isCurrentUser) {
              //  setTrainerPrograms()
            } else {
               // fetchPrograms(userData.user_uuid);
            }
        } catch (error) {
            setReady(false)
 
            setUserVlogs([])
            setUserPrograms([])
        }
    }

    async function checkCurrFitnessLocation() {
        let results = []
        let currUserStreet = ""
        let trainerStreet = ""
        try {
            await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=gym&location=${userData.location.latitude},${userData.location.longitude}&radius=5000&type=gym&key=AIzaSyAPrxdNkncexkRazrgGy4FY6Nd-9ghZVWE`).then(response => response.json()).then(result => {
                results = result.results;
                setResultsLength(results.length)
            });

            await getStreetAddressFromCoordinates(currUserData.location.longitude, currUserData.location.latitude).then(result => {
                currUserStreet = result;
            });

            await getStreetAddressFromCoordinates(userData.location.longitude, userData.location.latitude).then(result => {
                trainerStreet = result;
            });


            for (let i = 0; i < results.length; i++) {
                LOG('TrainerProfile.js', 'Checking location')

                const formattedAddressParts = results[i].formatted_address.split(" ")

                for (let j = 0; j < formattedAddressParts.length; j++) {
                    if (currUserStreet.includes(formattedAddressParts[j]) && trainerStreet.includes(formattedAddressParts[j])) {
                        setShowLocationMessage(true);
                        return;
                    }
                }
                setShowLocationMessage(false);
            }
        } catch (err) {
            setShowLocationMessage(false)
        }


    }

    const addToRecentlyInteractedList = async () => {
    try {
      let recentlyInteractedList = await retrieveAsyncData('RECENTLY_INTERACTED_USERS');
    
        if (typeof(recentlyInteractedList) == 'undefined' || typeof(recentlyInteractedList) != 'object' || recentlyInteractedList == null) {
            recentlyInteractedList = [userData.user_uuid];
        } else {
            recentlyInteractedList.push(userData.user_uuid);
        }
    } catch(error) {
        storeAsyncData('RECENTLY_INTERACTED_USERS', [])
        LOG_ERROR('', '', error);
    }

        storeAsyncData('RECENTLY_INTERACTED_USERS', recentlyInteractedList)
    }

    useEffect(() => {
        let isSubscribed = true;
        loadProfileData()
        if (userData.interest.length > 3) {
            let total = userData.interest.length
            setTrainingInterestLength(total - 3)
            showTrailingInterestText(true)
        }
        setReady(true)

       // addToRecentlyInteractedList();
        LOG('TrainerProfile.js', 'Running useEffect.')

        return () => isSubscribed = false;
    }, [profileImage, ready])

    const renderScheduler = () => {
        if (!ready) { return null }

        if (isCurrentUser) {
            return;
        }

        if (showSchedulerButton === true) {
            return (
                <View style={{ backgroundColor: '#FFFFFF', width: '100%', height: Dimensions.get('window').height }}>
                    <Button onPress={() => setShowSchedulerButton(false)} mode="contained" uppercase={false} color='#1089ff' style={{ marginVertical: 10, width: Dimensions.get('window').width - 20, alignSelf: 'center' }}>
                        Done
            </Button>
                    <LupaCalendar captureMarkedDates={captureMarkedDate} agendaData={userData.scheduler_times} uuid={userData.user_uuid} isCurrentUser={isCurrentUser} />
                </View>
            )
        }

        return renderCloseLocationMessage();
    }

    const renderCloseLocationMessage = () => {
        if (!ready) { return null }
        
        if (isCurrentUser) {
            return;
        }

        return (
            <Surface style={{ backgroundColor: 'transparent', width: Dimensions.get('window').width - 20, elevation: 0, padding: 20, borderRadius: 8, marginVertical: 10, alignSelf: 'center' }}>
                <Caption style={{ color: '#1089ff' }}>
                    It looks like you and {userData.display_name} might be training in the same gym.  Would you like to see her available hours?
            </Caption>

                <Button onPress={() => setShowSchedulerButton(true)} mode="contained" uppercase={false} color='#1089ff' style={{ marginVertical: 10 }}>
                    View Hours
            </Button>
            </Surface>
        )
    }

    const handleOnRefresh = async () => {
        await setRefreshing(true);
        loadProfileData();
        await setRefreshing(false);
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{marginVertical: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={[styles.bioText, {color: '#1089ff', paddingHorizontal: 5}]}>
                                {userData.display_name} has an hourly rate of ${userData.hourly_payment_rate}
                            </Text>
                        </View>

            <Appbar.Header style={styles.appbar}>
                <ThinFeatherIcon name="arrow-left" size={20} onPress={() => navigation.pop()} />
        

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
            <ScrollView refreshControl={<RefreshControl onRefresh={handleOnRefresh} refreshing={refreshing} />}>
                <View>
                    <View style={styles.userInformationContainer}>
                        <View style={styles.infoContainer}>
                            {renderDisplayName()}
                            <View style={{ paddingVertical: 10 }}>
                                {renderLocation()}
                                {renderCertification()}
                                {renderTrainerType()}
                            </View>
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

                {
                isCurrentUser === true ?
                <Text onPress={() => setEditHoursModalVisible(true)} style={{color: '#1089ff', fontFamily: 'Avenir-Light', fontSize: 13 }}>
                Edit Bio
    </Text>
                :
                null
                }

              
                        </View>
                        {renderBio()}
                        
                    </View>
  
                    {renderInteractions()}
                
                </View>

               <Tabs page={currPage} tabBarUnderlineStyle={{ height: 2, backgroundColor: '#1089ff' }} onChangeTab={tabInfo => setCurrPage(tabInfo.i)} tabContainerStyle={{ backgroundColor: '#FFFFFF' }} tabBarBackgroundColor='#FFFFFF'>
                    <Tab tabStyle={{backgroundColor: '#FFFFFF'}} activeTabStyle={{backgroundColor: '#FFFFFF'}} activeTextStyle={styles.activeTabHeading} textStyle={styles.inactiveTabHeading} heading="Vlogs">
                        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                            {renderVlogs()}
                        </View>
            </Tab>
                            <Tab tabStyle={{backgroundColor: '#FFFFFF'}} activeTabStyle={{backgroundColor: '#FFFFFF'}} activeTextStyle={styles.activeTabHeading} textStyle={styles.inactiveTabHeading} heading="Scheduler">
                            <View style={{ backgroundColor: '#FFFFFF', height: Dimensions.get('window').height }}>
                                <LupaCalendar captureMarkedDates={captureMarkedDate} agendaData={userData.scheduler_times} uuid={userData.user_uuid} userData={currUserData} />
                            </View>
            </Tab>
            </Tabs>
            </ScrollView>

            {renderFAB()}
            
            <BookingRequestModal closeModal={() => setTrainerBookingModalVisible(false)} isVisible={trainerBookingModalVisible} trainer={userData}  />
            <EditBioModal isVisible={editHoursModalVisible} closeModalMethod={() => setEditHoursModalVisible(false)} />
            <SchedulerModal isVisible={editHoursModalVisible} closeModal={() => setEditHoursModalVisible(false)} selectedDates={markedDates} />
        </SafeAreaView>
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
        fontFamily: 'Avenir-Roman',
        fontSize: 11,

    },
    certificationText: {
        fontFamily: 'Avenir-Light',
    },
    appbar: {
        backgroundColor: 'transparent',
        elevation: 0,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
    },
    appbarTitle: {
        fontSize: 15,
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

export default TrainerProfile;