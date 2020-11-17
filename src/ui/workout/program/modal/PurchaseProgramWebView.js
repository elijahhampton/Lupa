import React, { createRef } from 'react';

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

class PurchaseProgramWebView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
 <Modal presentationStyle="formSheet" visible={this.props.isVisible}>
              <WebView 
                ref={(r) => (this.webViewRef = r)}
                style={{flex: 1, width: Dimensions.get('window').width}} 
                source={{uri: 'https://lupa-cd0e3.web.app' }}
        injectedJavaScriptBeforeContentLoaded={
            `
            window.programData = ${JSON.stringify(this.props.programProps)}
    `
        }
                startInLoadingState
                />
            </Modal>
        )
    }
}

export default PurchaseProgramWebView;