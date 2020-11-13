import React from 'react';

import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    Modal,
    Linking
} from 'react-native';

import {
    Button
} from 'react-native-paper';

import { WebView } from 'react-native-webview';

const PurchaseProgramWebView = ({ isVisible, closeModal }) => {
    return (
            <Modal presentationStyle="formSheet" visible={isVisible}>
              <WebView style={{flex: 1, width: Dimensions.get('window').width}} source={{uri: 'https://lupa-cd0e3.web.app' }} />
            </Modal>
    )
}

export default PurchaseProgramWebView;