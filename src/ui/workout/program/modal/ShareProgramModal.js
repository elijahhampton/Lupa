
import React, { useEffect, useState } from 'react';

import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    ImageBackground,
    Animated,
    Image,
    Button as NativeButton,
    ScrollView,
    Modal,
    RefreshControl,
} from 'react-native';

import {
    Appbar,
    Title,
    Button,
    TextInput,
    Surface,
    Avatar as PaperAvatar,
    Paragraph,
    Snackbar,
    Chip,
    Modal as PaperModal,
    Dialog,
    Portal,
    Provider,
    Card,
    FAB,
    Caption,
    Searchbar,
} from 'react-native-paper';

import {
    Header,
    Tab,
    Tabs,
    ScrollableTab,
} from 'native-base';

import { connect } from 'react-redux'

import FeatherIcon from 'react-native-vector-icons/Feather'

import { Input, Divider } from 'react-native-elements';

import LupaController from '../../../../controller/lupa/LupaController'

import UserSearchResult from '../../../user/profile/component/UserSearchResult'
import ProgramSearchResultCard from '../components/ProgramSearchResultCard';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

const mapDispatchToProps = (dispatchEvent) => {
    return {
        deleteProgram: (programUUID) => {
            dispatchEvent({
                type: "DELETE_CURRENT_USER_PROGRAM",
                payload: programUUID
            })
        },
    }
}

class ShareProgramModal extends React.Component{
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            followingUserObjects: [],
            selectedUsers: [],

        }
    }

    componentDidMount = async () => {
        let results = [];
        
        await this.LUPA_CONTROLLER_INSTANCE.getUserInformationFromArray(this.props.route.params.following).then(objs => {
            results = objs;
        })

        this.setState({ 
            followingUserObjects: results,
        })
    }

    handleAddToFollowList = (userObject) => {
        const updatedList = this.state.selectedUsers;
        var found = false;
        for(let i = 0; i < this.state.selectedUsers.length; i++)
        {
            if (this.state.selectedUsers[i] == userObject.user_uuid)
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

        this.setState({
            selectedUsers: updatedList,
        })


    }

    waitListIncludesUser = (userObject) => {
        for(let i = 0; i < this.state.selectedUsers.length; i++)
        {
            if (this.state.selectedUsers[i] == userObject.user_uuid)
            {
                return true;
            }
        }

        return false;
    }

    mapFollowing = () => {
        return this.state.followingUserObjects.map(user => {
            return (
                <View key={user.user_uuid} style={{backgroundColor: this.waitListIncludesUser(user) ? '#E0E0E0' : 'transparent'}}>
                    <UserSearchResult 
                        avatarSrc={user.photo_url} 
                        displayName={user.display_name} 
                        username={user.username} 
                        isTrainer={user.isTrainer}
                        hasButton={true}
                        buttonTitle="Invite"
                        buttonOnPress={() => this.handleAddToFollowList(user)}
                        />
                </View>
            );
        })
    }

    handleCancel = () => {
        this.props.navigation.pop()
    }

    handleApply = () => {
        try {
            this.LUPA_CONTROLLER_INSTANCE.handleSendUserProgram(this.props.lupa_data.Users.currUserData, this.state.selectedUsers, this.props.route.params.programData);
            this.props.navigation.pop()
        } catch(err) {
            alert(err)
            this.props.navigation.pop()
        }
    }

    render() {
        const { navigation } = this.props
        return (
                <View style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height, backgroundColor: '#FFFFFF'}}>
                                   <Appbar.Header style={{elevation: 0}} theme={{
                    colors: {
                        primary: '#FFFFFF'
                    }
                }}>
                    <Appbar.BackAction onPress={() => navigation.pop()} />
                    <Appbar.Content title="Share Program" />
                </Appbar.Header>

                <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
                <ProgramSearchResultCard programData={this.props.route.params.programData} />
                              <Divider />
                    <ScrollView shouldRasterizeIOS={true} contentContainerStyle={{backgroundColor: '#FFFFFF'}}>
                    {
                        this.mapFollowing()
                    }
                </ScrollView>
                <SafeAreaView />
                    </View>

                    <FAB  color="#FFFFFF" style={{position: 'absolute', bottom: 0, right: 0, margin: 16, backgroundColor: '#2196F3'}} icon="done" onPress={this.handleApply} />
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShareProgramModal);