
import React, { useEffect, useState } from 'react';

import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    ScrollView,
    SafeAreaView,
} from 'react-native';
 
import {
    Appbar,
    FAB,
    Divider,
    Chip,
     Avatar, Button
} from 'react-native-paper';

import { useSelector } from 'react-redux'

import { SearchBar } from 'react-native-elements'
import FeatherIcon from 'react-native-vector-icons/Feather'

import LupaController from '../../../../controller/lupa/LupaController'

import UserSearchResult from '../../../user/profile/component/UserSearchResult'
import ProfileProgramCard from '../components/ProfileProgramCard';

import ThinFeatherIcon from 'react-native-vector-icons/Feather'
import { retrieveAsyncData, storeAsyncData } from '../../../../controller/lupa/storage/async';

function ShareProgramModal({ navigation, route }) {
    const [selectedUsers, setSelectedUsers] = useState([])
    const [displaydUsers, setDisplayedUsers] = useState([])
    const [searchResults, setSearchResults] = useState([])
    const [searchValue, setSearchValue] = useState("")
    const [searching, setSearching] = useState(false)
    const [recentlyInteractedUsers, setRecentlyInteractedUsers] = useState([])
    const [forcedUpdate, setForcedUpdate] = useState(false);

    const currUserData = useSelector(state => {
        return state.Users.currUserData
    })

    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance()

    const handleAddToFollowList = (userObject) => {
        const updatedList = selectedUsers;
        const updatedDisplayedUserlist = displaydUsers;

        var found = false;
        for(let i = 0; i < selectedUsers.length; i++)
        {
            if (selectedUsers[i] == userObject.user_uuid)
            {

              updatedList.splice(i, 1);
              updatedDisplayedUserlist.splice(i, 1);
              found = true;
              break;
            }
        }

        if (found == false)
        {
            
            updatedList.push(userObject.user_uuid);
            updatedDisplayedUserlist.push(userObject);
            
        }

        setSelectedUsers(updatedList)
        setDisplayedUsers(updatedDisplayedUserlist);
        setForcedUpdate(!forcedUpdate)
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

    const handleApply = () => {
        if (selectedUsers.length === 0) {
          navigation.pop();
          return;
        }

        try {
            LUPA_CONTROLLER_INSTANCE.handleSendUserProgram(currUserData, selectedUsers, route.params.programData);
            navigation.pop()
        } catch(err) {
            alert(err)
            navigation.pop()
        }
    }

    const mapSearchResults = () => {
        return searchResults.map(user => {
            return <UserSearchResult 
            userData={user} 
            hasButton={true}
            buttonTitle={selectedUsers.includes(user.user_uuid) == false ? 'Share' : 'Remove'}
            buttonOnPress={() => handleAddToFollowList(user)}
            />
        })
    }

    const performSearch = async searchQuery => {
        let searchResultsIn = []

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


            await LUPA_CONTROLLER_INSTANCE.search(searchQuery).then(searchData => {
                setSearchResults(searchData);
            });

    }

    const renderSelectedUsers = () => {
        return displaydUsers.map((user) => {
            return (
                <Chip key={user.user_uuid} style={{marginHorizontal: 10, width: 150}} avatar={() => <Avatar.Image source={{ uri: user.photo_url }} />}>
                {user.display_name}
            </Chip>
            )
        })
    }

    return (
        <ScrollView style={styles.container}>
                    <Appbar.Header style={styles.appbar} theme={{
                    colors: {
                        primary: '#FFFFFF'
                    }
                }}>
                    <Appbar.Action onPress={() => navigation.pop()} icon={() => <ThinFeatherIcon name="arrow-left" size={20} />}/>
                    <Appbar.Content title="Share Program" titleStyle={{alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 25}} />
                    <Button color="#1089ff" mode="text" onPress={handleApply}>
                        Save
                    </Button>
                </Appbar.Header>
              
        

                <View style={styles.contentContainer}>
                <ProfileProgramCard programData={route.params.programData} />
                <View>		                        
                <SearchBar placeholder="Who would you like to send this to?"		              
                    onChangeText={text => performSearch(text)}		                 
                    platform="ios"
                    searchIcon={<FeatherIcon name="search" color="black" size={20} />}	
                    placeholderTextColor="rgb(199, 201, 203)"	                  
                    containerStyle={styles.searchContainerStyle}		                  
                    inputContainerStyle={styles.inputContainerStyle}		                   
                    inputStyle={styles.inputStyle}		                  	                    
                    value={searchValue} />		                    
               
                   		                   
        </View>
                <ScrollView horizontal contentContainerStyle={{marginBottom: 10}}>
                        {renderSelectedUsers()}
                    </ScrollView>
                              <Divider />
                              <View>
                   
        </View>
  
                    <ScrollView shouldRasterizeIOS={true}>
                    {mapSearchResults()}
                </ScrollView>
                    </View>

            
                    <SafeAreaView />
            </ScrollView>
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