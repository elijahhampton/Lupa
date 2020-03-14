import { createAppContainer, createSwitchNavigator} from 'react-navigation';

import FollowerView from '../user/profile/modal/FollowerModal';
import ProfileView from '../user/profile/ProfileView';

import PackModal from '../packs/PackModal';

import SessionsView from '../sessions/CreateSessionModal';

const ProfileNavigator = createSwitchNavigator(
    {
    Profile: {
        screen: ProfileView,
        initialParams: {
            userUUID: 566
        },
        navigationOptions: ({ navigation }) => ({
            title: 'ProfileView',
            header: null,
            gesturesEnabled: false,
        })
    },
    FollowerView: {
        screen: FollowerView,
        navigationOptions: ({ navigation }) => ({
            title: 'FollowerView',
            header: null,
            gesturesEnabled: false,
        })
    },
    PackModal: {
        screen: PackModal,
        navigationOptions: ({ navigation }) => ({
            title: 'PackModal',
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
        }),
    },
    },
    {
    initialRouteName: 'Profile',
    }
);

export default createAppContainer(ProfileNavigator);