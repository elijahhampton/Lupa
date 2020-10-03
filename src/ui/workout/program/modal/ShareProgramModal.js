
import React, { useEffect, useState } from 'react';

import {
    View,
    StyleSheet,
    SafeAreaView,
    Dimensions,
    ScrollView,
} from 'react-native';

import {
    Appbar,
    FAB,
    Divider,
} from 'react-native-paper';

import { useSelector } from 'react-redux'

import { SearchBar } from 'react-native-elements'
import FeatherIcon from 'react-native-vector-icons/Feather'

import LupaController from '../../../../controller/lupa/LupaController'

import UserSearchResult from '../../../user/profile/component/UserSearchResult'
import ProfileProgramCard from '../components/ProfileProgramCard';

import ThinFeatherIcon from 'react-native-feather1s'

function ShareProgramModal({ navigation, route }) {
    const [followingUserObjects, setFollowingUserObjects] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([])
    const [searchResults, setSearchResults] = useState([])
    const [searchValue, setSearchValue] = useState("")
    const [searching, setSearching] = useState(false)

    const currUserData = useSelector(state => {
        return state.Users.currUserData
    })

    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance()

    useEffect(() => {
        LUPA_CONTROLLER_INSTANCE.getUserInformationFromArray(currUserData.following).then(objs => {
            setFollowingUserObjects(objs)
        })
    }, [])

    const handleAddToFollowList = (userObject) => {
        const updatedList = selectedUsers;
        var found = false;
        for(let i = 0; i < selectedUsers.length; i++)
        {
            if (selectedUsers[i] == userObject.user_uuid)
            {

              updatedList.splice(i, 1);
              found = true;
              break;
            }
        }

        if (found == false)
        {
            
            updatedList.push(userObject.user_uuid);
            
        }

        setSelectedUsers(updatedList)
    }

    const waitListIncludesUser = (userObject) => {
        for(let i = 0; i < selectedUsers.length; i++)
        {
            if (selectedUsers[i] == userObject.user_uuid)
            {
                return true;
            }
        }

        return false;
    }

    const mapFollowing = () => {
        return followingUserObjects.map(user => {
            return (
                <View key={user.user_uuid} style={{backgroundColor: waitListIncludesUser(user) ? '#E0E0E0' : 'transparent'}}>
                    <UserSearchResult 
                        userData={user}
                        hasButton={true}
                        buttonTitle="Invite"
                        buttonOnPress={() => handleAddToFollowList(user)}
                        />
                </View>
            );
        })
    }

    const handleApply = () => {
        try {
            LUPA_CONTROLLER_INSTANCE.handleSendUserProgram(currUserData, selectedUsers, route.params.programData);
            navigation.pop()
        } catch(err) {
            alert(err)
            navigation.pop()
        }
    }

    const performSearch = async searchQuery => {
      /*  let searchResultsIn = []

        //If no search query then set state and return
        if (searchQuery == "" || searchQuery == "") {
            setSearching(true);
            setSearchValue("");
            setSearchResults([]);

            return;
        }

        await setSearchResults([]);
        await setSearching(true);
        await setSearchValue(searchQuery);


            await this.LUPA_CONTROLLER_INSTANCE.searchPrograms(searchQuery).then(searchData => {
                setSearchResults(searchData);
            });

            setSearching(false);*/
    }

    return (
        <View style={styles.container}>
                    <Appbar.Header style={styles.appbar} theme={{
                    colors: {
                        primary: '#FFFFFF'
                    }
                }}>
                    <Appbar.Action onPress={() => navigation.pop()} icon={() => <ThinFeatherIcon name="arrow-left" size={20} />}/>
                    <Appbar.Content title="Share Program" titleStyle={{alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 20}} />
                </Appbar.Header>

                <View style={styles.contentContainer}>
                <ProfileProgramCard programData={route.params.programData} />
                              <Divider />
                              <View style={{flexDirection: 'row'}}>
                <SearchBar placeholder="Search fitness programs"
                    onChangeText={text => performSearch(text)}
                    platform="ios"
                    searchIcon={<FeatherIcon name="search" size={15} color="#1089ff" />}
                    containerStyle={styles.searchContainerStyle}
                    inputContainerStyle={styles.inputContainerStyle}
                    inputStyle={styles.inputStyle}
                    placeholderTextColor="#212121"
                    value={searchValue} />
        </View>
  
                    <ScrollView shouldRasterizeIOS={true}>
                    {
                        mapFollowing()
                    }
                </ScrollView>
                    </View>

                    <FAB color="#FFFFFF" style={styles.fab} icon="check" onPress={handleApply} />
                    <SafeAreaView />
            </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#FFFFFF'
    },
    appbar: {
        elevation: 0
    },
    fab: {
        position: 'absolute', bottom: 0, right: 0, margin: 16, backgroundColor: '#1089ff'
    },
    contentContainer: {
        flex: 1
    },
    searchContainerStyle: {
        backgroundColor: "transparent", width: '100%'
    },
    inputContainerStyle: {
        backgroundColor: '#eeeeee',
    },
    inputStyle: {
        fontSize: 15, color: 'black',  fontFamily: 'Avenir-Roman'
    },
    iconContainer: {
        width: '10%', alignItems: 'center', justifyContent: 'center'
    },
})


export default ShareProgramModal;