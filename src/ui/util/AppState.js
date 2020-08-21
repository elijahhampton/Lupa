import React from 'react';
import { AppState } from 'react-native';

export function addAppStateListener(callback) {
    AppState.addEventListener('change', callback);
}

export function removeAppStateListener(callback) {
    AppState.removeEventListener('change', callback);
}

const AppStateContext = React.createContext('active');

export default AppStateContext;