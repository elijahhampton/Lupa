import React from 'react';
import { Button } from 'react-native-paper';

function LogoutButton(props) {
    return (
        <Button mode="text" compact color="#2196F3" onPress={() => {props.navigation.navigate('LoginView')}}>
        Log out
        </Button>
    )
}

export default LogoutButton;