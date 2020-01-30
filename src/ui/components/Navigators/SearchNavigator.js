import React from 'react';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import UserProfileView from '../DrawerViews/Profile/UserProfileModal';
import SessionsView from '../Modals/Session/CreateSessionModal';
import SearchView from '../MainViews/search/SearchView';

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
    UserProfileView: {
        screen: UserProfileView,
        navigationOptions: ({navigation}) => ({
            title: "UserProfileView",
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
    initialRouteName: 'SessionsView'
})

export default createAppContainer(UserViewNavigator);