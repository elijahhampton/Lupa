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
        const id = this.props.programProps;
        return (
            <Modal presentationStyle="formSheet" visible={this.props.isVisible}>
              <WebView 
                 
                ref={ref => this.webviewRef = ref}
                style={{flex: 1, width: Dimensions.get('window').width}} 
                source={{uri: `https://lupa-cd0e3.web.app/${id}` }}
                />
            </Modal>
        )
    }
}

export default PurchaseProgramWebView;