import React from 'react';

import PackView from '../packs/PackView';
import PackChat from '../packs/PackChatModal';
import PackModal from '../packs/PackModal';

import ProfileView from '../user/profile/ProfileView';

import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator()

function PackNavigator() {
    return (
        <Stack.Navigator initialRouteName="PackView" headerMode='none'>
      <Stack.Screen name="PackView" component={PackView} />
      <Stack.Screen name="PackChat" component={PackChat} />
      <Stack.Screen name="PackModal" component={PackModal} />
      <Stack.Screen name="ProfileView" component={ProfileView} />
    </Stack.Navigator>
    )
}

export default PackNavigator;