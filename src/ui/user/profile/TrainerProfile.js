import React, { useState, useEffect } from 'react';

import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';

import {
    Surface, Appbar, Caption, Button, FAB, Menu, Card, Avatar as PaperAvatar
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
import LOG from '../../../common/Logger';
import VlogFeedCard from '../component/VlogFeedCard'
import { getStreetAddressFromCoordinates } from '../../../modules/location/mapquest/mapquest';
import Feather1s from 'react-native-feather1s/src/Feather1s';

const LAT_LONG_DIFF = 60

function inside(point, vs) {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html
    
    var x = point[0], y = point[1];
    
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
};

function TrainerProfile({ userData, isCurrentUser, uuid }) {
    const navigation = useNavigation();
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    const [profileImage, setProfileImage] = useState(userData.photo_url)
    const [userPrograms, setUserPrograms] = useState([])
    const [userVlogs, setUserVlogs] = useState([])
    const [editHoursModalVisible, setEditHoursModalVisible] = useState(false);
    const [currPage, setCurrPage] = useState(0)
    const [markedDates, setMarkedDates] = useState([])
   const [showSchedulerButton, setShowSchedulerButton] = useState(false);
    const [ready, setReady] = useState(false)
    const [showLocationMessage, setShowLocationMessage] = useState(false);
    const [resultsLength, setResultsLength] = useState(0);

    const currUserData = useSelector(state => {
        return state.Users.currUserData;
    })
    
    const currUserPrograms = useSelector(state => {
        return state.Programs.currUserProgramsData;
    })

    const captureMarkedDate = (dateObject) => {
        setMarkedDates(prevState => prevState.concat(dateObject));
    }

    /**
     * Allows the current user to choose an image from their camera roll and updates the profile picture in FB and redux.
     */
    const _chooseProfilePictureFromCameraRoll = async () => {
        
        ImagePicker.showImagePicker({
            allowsEditing: true
        }, async (response) => {
            if (!response.didCancel)
            {   
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
                <Surface style={{marginVertical: 5, elevation: 8, width: 65, height: 65, borderRadius: 65}}>
                     <Avatar key={userData.photo_url} raised={true} rounded size={65} source={{ uri: profileImage }} showEditButton={true} onPress={_chooseProfilePictureFromCameraRoll} />
                </Surface>
            )
        }

        return <Avatar key={userData.photo_url} rounded size={65} source={{ uri: profileImage }} />
    }

    const renderFollowers = () => {
        return (
            <View style={{marginVertical: 10, flex: 1, width: '100%',  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
            <TouchableOpacity onPress={navigateToFollowers}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Text>
                {userData.followers.length}
            </Text>
            <Text style={styles.userAttributeText}>
                Followers
        </Text>
        </View>

    </TouchableOpacity>
    <TouchableOpacity onPress={navigateToFollowers}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
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
        return (<View style={{paddingVertical: 2, flexDirection: 'row', alignItems: 'center'}}>
                    <FeatherIcon name="file-text" style={{paddingRight: 5}} />
                    <Text key={userData.certification} style={[styles.userAttributeText, {color: '#23374d'}]}>NASM</Text>
                </View>)
    }

    const renderLocation = () => {
               return ( <View style={{paddingVertical: 2, flexDirection: 'row', alignItems: 'center'}}>
                    <FeatherIcon name="map-pin" style={{paddingRight: 5}} />
                    <Text style={[styles.userAttributeText, {color: '#23374d'}]}>{userData.location.city}, {userData.location.state}</Text>
                </View>)
    }

    const renderDisplayName = () => {
        return <Text key={userData.display_name} style={styles.displayNameText}>{userData.display_name}</Text>
    }

    const renderBio = () => {
        return (
            <Text style={styles.bioText}>
                {userData.bio}
            </Text>
        )
    }

    const openOptionsMenu = () => setOptionsMenuVisible(true)
    const closeOptionsMenu = () => setOptionsMenuVisible(false);

    const renderVlogs = () => {
        return userVlogs.map((vlog, index, arr) => {
            return <VlogFeedCard vlogData={vlog} />
        })
    }

    const renderPrograms = () => {
       return userPrograms.map((program, index, arr) => {
            return (
                <ProfileProgramCard programData={program} />
            )
        })
    }

    const renderInteractions = () => {
        if (isCurrentUser) { return; }

        return (
        <View style={{width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                <Button onPress={() => navigation.push('PrivateChat', {
                    currUserUUID: currUserData.user_uuid,
                    otherUserUUID: userData.user_uuid
                })} 
                theme={{roundness: 5}} 
                color="#23374d" 
                icon={() => <FeatherIcon name="mail" />} 
                uppercase={false} 
                mode="contained" 
                style={{ elevation: 0}}>
                    <Text>
                        Send a message
                    </Text>
                </Button>

               {renderFollowButton()}
            </View>
        )
    }

    const renderFollowButton = () => {
        if (currUserData.following.includes(userData.user_uuid)) {
            return (
            <Button 
            onPress={() => LUPA_CONTROLLER_INSTANCE.unfollowUser(userData.user_uuid, currUserData.user_uuid)} 
            icon={() => <FeatherIcon name="user" />} 
            theme={{roundness: 5}} 
            uppercase={false} 
            color="#23374d" 
            mode="contained" 
            style={{elevation: 0}}>
                    <Text style={{ color: 'white' }}>
                        Unfollow
                    </Text>
                </Button>
            )
        } else {
            return (
                <Button 
                onPress={() => LUPA_CONTROLLER_INSTANCE.followUser(userData.user_uuid, currUserData.user_uuid)} 
                icon={() => <FeatherIcon name="user" />} 
                theme={{roundness: 5}} 
                uppercase={false} 
                color="#E5E5E5" 
                mode="contained" 
                style={{elevation: 0}}>
                    <Text style={{}}>
                        Follow
                    </Text>
                </Button>
            )
        }
    }

    const renderFAB = () => {
        if (!isCurrentUser) {
            return;
        }

        if (showSchedulerButton === true) {
            return;
        }
        
        switch(currPage) {
            case 0:
                return  <FAB onPress={() => navigation.push('CreateProgram')} icon="plus" style={{backgroundColor: '#1089ff', position: 'absolute', bottom: 0, right: 0, margin: 16}} />
            case 1:
                return  <FAB onPress={() => navigation.push('CreatePost')} icon="rss" style={{backgroundColor: '#1089ff', position: 'absolute', bottom: 0, right: 0, margin: 16}} />
            case 2:
                return  <FAB onPress={() => setEditHoursModalVisible(true)} icon="calendar" style={{backgroundColor: '#1089ff', position: 'absolute', bottom: 0, right: 0, margin: 16}} />
            
        }

        return null;
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
        await LUPA_CONTROLLER_INSTANCE.getAllUserPrograms(uuid).then(data => {
            setUserPrograms(data);
        })
    }

    useEffect(() => {
        let isSubscribed = true;
        async function loadProfileData() {
            try {
                setProfileImage(userData.photo_url)
                await fetchVlogs(userData.user_uuid);
        if (isCurrentUser) {
            setUserPrograms(currUserPrograms)
        } else {
            fetchPrograms(userData.user_uuid);
        }
       checkCurrFitnessLocation()
                setReady(true)
            } catch(error) {
                setReady(false)
                alert(error);
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
        } catch (err)
        {
            setShowLocationMessage(false)
        }


        }

        loadProfileData()
        

        LOG('TrainerProfile.js', 'Running useEffect.')

        return () => isSubscribed = false;
    }, [profileImage])

    const renderScheduler = () => {
        if (isCurrentUser) {
            return;
        }
        
        if (showSchedulerButton === true) {
            return (
                <View  style={{backgroundColor: 'rgb(248, 248, 248)', width: '100%', height: Dimensions.get('window').height}}>
                     <Button onPress={() => setShowSchedulerButton(false)} mode="contained" uppercase={false} color='#1089ff' style={{marginVertical: 10, width: Dimensions.get('window').width - 20, alignSelf: 'center'}}>
                Done
            </Button>
            <LupaCalendar captureMarkedDates={captureMarkedDate} agendaData={userData.scheduler_times} uuid={userData.user_uuid} />
           </View>
            )
        }
       
        return renderCloseLocationMessage();
    }

    const renderCloseLocationMessage = () => {
        if (isCurrentUser) {
            return;
        }

        return (
            <Surface style={{backgroundColor: 'transparent', width: Dimensions.get('window').width - 20, elevation: 0, padding: 20, borderRadius: 8, marginVertical: 10, alignSelf: 'center'}}>
            <Caption style={{color: '#1089ff'}}>
                It looks like you and {userData.display_name} might be training in the same gym.  Would you like to see her available hours?
            </Caption>

            <Button onPress={() => setShowSchedulerButton(true)} mode="contained" uppercase={false} color='#1089ff' style={{marginVertical: 10}}>
                View Hours
            </Button>
        </Surface>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <Appbar.Header style={styles.appbar}>
                <ThinFeatherIcon  name="arrow-left" size={20} onPress={() => navigation.pop()}/>
                <Appbar.Content title={userData.username} titleStyle={styles.appbarTitle} />
            </Appbar.Header>
            <ScrollView>
            <View>
            <View style={styles.userInformationContainer}>
                <View style={styles.infoContainer}>
                    {renderDisplayName()}
                    {renderBio()}
                    <View style={{paddingVertical: 10}}>
                    {renderLocation()}
                    {renderCertification()}
                    </View>
                </View>

                <View style={styles.avatarContainer}>
                    {renderAvatar()}
                    {renderFollowers()}
                </View>
            </View>
            {renderInteractions()}
            </View>

           <>
           {renderScheduler()}
           </>

            <Tabs tabBarUnderlineStyle={{height: 2, backgroundColor: '#1089ff'}} onChangeTab={tabInfo => setCurrPage(tabInfo.i)} locked={true} tabContainerStyle={{backgroundColor: '#FFFFFF'}} tabBarBackgroundColor='#FFFFFF'>
             <Tab activeTextStyle={styles.activeTabHeading} textStyle={styles.inactiveTabHeading} heading="Programs/Services">
                    <View style={{flex: 1, backgroundColor: 'rgb(248, 248, 248)'}}>
                        {renderPrograms()}
                    </View>
             </Tab>
              <Tab activeTextStyle={styles.activeTabHeading} textStyle={styles.inactiveTabHeading}  heading="Vlogs">
       <View style={{flex: 1, backgroundColor: 'rgb(248, 248, 248)'}}>
                        {renderVlogs()}
                    </View>
              </Tab>
              {
                  isCurrentUser === true ? 
                  <Tab activeTextStyle={styles.activeTabHeading} textStyle={styles.inactiveTabHeading}  heading="Scheduler">
                  <View  style={{backgroundColor: 'rgb(248, 248, 248)', height: Dimensions.get('window').height}}>
                  <LupaCalendar captureMarkedDates={captureMarkedDate} agendaData={userData.scheduler_times} uuid={userData.user_uuid} />
                  </View>
                    </Tab>
                  :
                  null
              }
            </Tabs>
            </ScrollView>

           {renderFAB()}

           <SchedulerModal isVisible={editHoursModalVisible} closeModal={() => setEditHoursModalVisible(false)} selectedDates={markedDates} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(248, 248, 248)'
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
        paddingHorizontal: 20
    },
    appbarTitle: {
        fontSize: 15,
        fontFamily: 'Avenir-Roman'
    },
    displayNameText: {
        paddingVertical: 5,
        fontSize: 15,
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
        fontSize: 10,
        fontFamily: 'Avenir-Light',
   
    }
})

export default TrainerProfile;