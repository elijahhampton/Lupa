import React, { useState } from 'react';

import {
    View,
    Text,
    StyleSheet,
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

import LupaColor from '../../common/LupaColor'
import ImagePicker from 'react-native-image-picker';
import FeatherIcon from 'react-native-vector-icons/Feather'
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

function UserProfile({ userData, isCurrentUser }) {
    const navigation = useNavigation();
    const [profileImage, setProfileImage] = useState(userData.photo_url)

    /**
     * Allows the current user to choose an image from their camera roll and updates the profile picture in FB and redux.
     */
    const _chooseProfilePictureFromCameraRoll = async () => {
        
        ImagePicker.showImagePicker({}, async (response) => {
            if (!response.didCancel)
            {   
                setProfileImage(response.uri);

                let imageURL;
                //update in FB storage
                 this.LUPA_CONTROLLER_INSTANCE.saveUserProfileImage(response.uri).then(result => {
                    imageURL = result;
                });
        
                //update in Firestore
                this.LUPA_CONTROLLER_INSTANCE.updateCurrentUser('photo_url', imageURL, "");
        
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
        return <Text key={userData.certification} style={[styles.userAttributeText, {color: '#1089ff'}]}>NASM</Text>
    }

    const renderLocation = () => {
        return <Text style={[styles.userAttributeText, {color: '#1089ff'}]}>{userData.location.city}, {userData.location.state}</Text>
    }

    const renderDisplayName = () => {
        return <Text style={styles.bioText} key={userData.display_name} style={styles.displayNameText}>{userData.display_name}</Text>
    }

    const renderBio = () => {
        return (
            <Text style={styles.bioText}>
                {userData.bio}
            </Text>
        )
    }

    /**
     * Navigates to the follower view.
     */
    const navigateToFollowers = () => {
        this.props.navigation.navigate('FollowerView');
    }

    return (
        <SafeAreaView style={styles.container}>
            <Appbar.Header style={styles.appbar}>
                <FeatherIcon name="arrow-left" size={20} onPress={() => navigation.goBack()}/>
                <Appbar.Content title={userData.username} titleStyle={styles.appbarTitle} />
            </Appbar.Header>
            <ScrollView>
            <View style={styles.userInformationContainer}>
                <View style={styles.infoContainer}>
                    {renderDisplayName()}
                    {renderBio()}
                    <View style={{paddingVertical: 10}}>
                    {renderLocation()}
                    </View>
                </View>

                <View style={styles.avatarContainer}>
                    {renderAvatar()}
                    {renderFollowers()}
                </View>
            </View>

            <Tabs locked={true} tabContainerStyle={{backgroundColor: '#FFFFFF'}} tabBarBackgroundColor='#FFFFFF'>
              <Tab activeTextStyle={styles.activeTabHeading} textStyle={styles.inactiveTabHeading}  heading="Vlogs">
       
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
        fontFamily: 'Avenir-Light',
        fontSize: 11,
    },
    certificationText: {
        fontFamily: 'Avenir-Light',
    },
    appbar: {
        backgroundColor: 'transparent',
        elevation: 0,
    },
    appbarTitle: {
        fontSize: 12,
        fontFamily: 'Avenir-Roman'
    },
    displayNameText: {
        paddingVertical: 5,
        fontSize: 12,
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