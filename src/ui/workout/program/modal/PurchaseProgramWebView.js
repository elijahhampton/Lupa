import React from 'react';

import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    Modal
} from 'react-native';

import { WebView } from 'react-native-webview';

const PurchaseProgramWebView = () => {
    return (
            <Modal presentationStyle="formSheet" visible={true}>
                 <WebView style={{flex: 1, width: Dimensions.get('window').width}} source={{uri: 'https://lupa-cd0e3.web.app' }} />
            </Modal>
    )
}

export default PurchaseProgramWebView;