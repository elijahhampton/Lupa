import React from 'react';

import { createBottomTabNavigator} from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';

import TrainerDashboardView from '../MainViews/dashboard/TrainerDashboardView';

import ActivityView from '../MainViews/dashboard/Views/ActivityView'
import NotificationsView from '../MainViews/dashboard/Views/Notifications/NotificationsView';
import MessagesView from '../MainViews/dashboard/Views/MessagesView';
import ProfileView from '../MainViews/dashboard/Views/Profile/ProfileView';

import TrainerAnimatedTabbar from '../MainViews/dashboard/AnimatedTabbar/TrainerAnimatedTabbar';

const TrainerTabBarComponent = props => <TrainerAnimatedTabbar {...props} />;

const TrainerBottomTabNavigator = createBottomTabNavigator({
    ActivityView: ActivityView,
    MessagesView: MessagesView,
    DashboardView: TrainerDashboardView,
    NotificationsView: NotificationsView,
    ProfileView: ProfileView,
},
{
    initialRouteName: "ActivityView",
    tabBarComponent: props => (
        <TrainerTabBarComponent {...props} />
    ),
    defaultNavigationOptions:({ navigation }) => ({
        tabBarOnPress: ({ previousScene, scene, jumpToIndex }) => {

        },
    }),
});


export default createAppContainer(TrainerBottomTabNavigator);
