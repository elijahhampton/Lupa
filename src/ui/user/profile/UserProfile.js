import React, { useState, useEffect} from 'react';

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';

import {
    Surface, Appbar, Caption,
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
            } catch(error) {
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

    const renderLocation = () => {
        return (
            <View style={{paddingVertical: 2, flexDirection: 'row', alignItems: 'center'}}>
            <FeatherIcon name="map-pin" style={{paddingRight: 5}} />
            <Text style={[styles.userAttributeText, {color: '#23374d'}]}>{userData.location.city}, {userData.location.state}</Text>
        </View>
        )
    }

    const renderDisplayName = () => {
        return <Text key={userData.display_name} style={styles.displayNameText}>{userData.display_name}</Text>
    }

    const renderBio = () => {
        if (userData.bio.length == 0) {
            return (
                <Text style={styles.bioText}>
                {userData.display_name} has not setup a bio.
            </Text>
            )
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
                <View style={{paddingVertical: 5, flexDirection: 'row', alignItems: 'center'}}>
                     <View style={{flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap'}}>
                     <Text style={styles.bioText}>
                         Interest: {" "}
                     </Text>
                     {
                        userData.interest.map((interest, index, arr) => {
                            if (index  == 3) {
                                return;
                            }

                            return (
                                <Text style={{fontFamily: 'Avenir-Medium', fontSize: 10, color: 'rgb(58, 58, 61)'}}>
                                    {interest} {" "}
                                </Text>
                                
                            )
                        })
                    }
                    {trainingInterestTextVisible === true ? <Caption style={{fontFamily: 'Avenir-Medium', fontSize: 10, color: '#1089ff'}}> and 3 more... </Caption> : null }
                     </View>
                   
                </View>
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
                <FeatherIcon name="arrow-left" size={20} onPress={() => navigation.pop()}/>
                <Appbar.Content title={userData.email} titleStyle={styles.appbarTitle} />
            </Appbar.Header>
            <ScrollView>
            <View style={styles.userInformationContainer}>
                <View style={styles.infoContainer}>
                    {renderDisplayName()}
                    {renderBio()}
                    {renderInterest()}
                </View>

                <View style={styles.avatarContainer}>
                    {renderAvatar()}
                    {renderFollowers()}
                </View>
            </View>

            <Tabs page={currPage} tabBarUnderlineStyle={{height: 2, backgroundColor: '#1089ff'}} onChangeTab={tabInfo => setCurrPage(tabInfo.i)} tabContainerStyle={{backgroundColor: '#FFFFFF'}} tabBarBackgroundColor='#FFFFFF' locked={true} >
              <Tab activeTextStyle={styles.activeTabHeading} textStyle={styles.inactiveTabHeading}  heading="Vlogs">
                    <View style={{flex: 1}}>
                        
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

export default UserProfile;