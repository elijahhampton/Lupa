import React from 'react';
import { Button } from 'react-native-paper';
import { withNavigation } from 'react-navigation';

function LogoutButton(props) {
    return (
        <Button mode="text" compact color="#2196F3" onPress={() => {props.navigation.navigate('LoginView')}}>
        Log out
        </Button>
    )
}

export default withNavigation(LogoutButton);