import React from 'react';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Profile from '../user/profile/ProfileView';
import SessionsView from '../sessions/CreateSessionModal';
import SearchView from '../sessions/SearchView';
import PackModal from '../packs/PackModal';
import { PackChatModal as PackChat } from '../packs/PackChatModal';

const UserViewNavigator =  createStackNavigator(
    {
        /* Added the search view here because navigation didn't work to 
        the user profile view without it.. need to reconsider the design of this in the future */
    SearchView: {
        screen: () => <SearchView />,
        navigationOptions: ({navigation}) => ({
            title: "SearchView",
            header: null,
            gesturesEnabled: false,
        })
    },
    Profile: {
        screen: Profile,
        navigationOptions: ({navigation}) => ({
            title: "Profile",
            header: null,
            gesturesEnabled: false,
        })
    },
    SessionsView: {
        screen: SessionsView,
        navigationOptions: ({navigation}) => ({
            title: "SessionsView",
            header: null,
            gesturesEnabled: false,
        })
    },
},
{
    initialRouteName: 'SearchView'
})

export default createAppContainer(UserViewNavigator);